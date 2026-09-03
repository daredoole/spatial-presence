"""Pure geometry and LD2450 state projection for Spatial Presence."""

from __future__ import annotations

from dataclasses import dataclass
import math
import re
from typing import Any, Mapping

UNKNOWN_STATES = {"unknown", "unavailable", "none", ""}
ENTITY_PREFIX_PATTERN = re.compile(r"^[a-z0-9_]+$")


@dataclass(frozen=True, slots=True)
class FeatureDefinition:
    """One room or zone that becomes native Home Assistant entities."""

    key: str
    map_id: str
    map_title: str
    floor_id: str
    floor_name: str
    feature_id: str
    name: str
    kind: str
    points: tuple[tuple[float, float], ...]
    hold_seconds: float


@dataclass(frozen=True, slots=True)
class ProjectedTarget:
    """One non-fused target projected into floorplan coordinates."""

    target_id: str
    floor_key: str
    x: float
    y: float


@dataclass(frozen=True, slots=True)
class FeatureReading:
    """Instantaneous targets within a room or zone."""

    count: int
    target_ids: tuple[str, ...]
    source_available: bool


def collect_definitions(
    maps: Mapping[str, Mapping[str, Any]],
) -> dict[str, FeatureDefinition]:
    """Build stable entity definitions from stored maps."""
    result: dict[str, FeatureDefinition] = {}
    for map_id, envelope in maps.items():
        config = envelope.get("config", {})
        map_title = str(envelope.get("title") or config.get("title") or map_id)
        hold_seconds = float(config.get("stationary_hold_seconds", 30))
        for floor in config.get("floors", []):
            floor_id = str(floor["id"])
            floor_name = str(floor.get("name") or floor_id)
            for collection, default_kind in (("rooms", "detection"), ("zones", "detection")):
                for feature in floor.get(collection, []):
                    kind = str(feature.get("kind") or default_kind)
                    if kind == "exclusion" or len(feature.get("points", [])) < 3:
                        continue
                    feature_id = str(feature["id"])
                    key = f"{map_id}:{floor_id}:{collection}:{feature_id}"
                    result[key] = FeatureDefinition(
                        key=key,
                        map_id=map_id,
                        map_title=map_title,
                        floor_id=floor_id,
                        floor_name=floor_name,
                        feature_id=feature_id,
                        name=str(feature.get("name") or feature_id.replace("_", " ").title()),
                        kind=kind,
                        points=tuple((float(p["x"]), float(p["y"])) for p in feature["points"]),
                        hold_seconds=hold_seconds if kind == "stationary" else 0,
                    )
    return result


def calculate_readings(
    maps: Mapping[str, Mapping[str, Any]],
    states: Mapping[str, Any],
    definitions: Mapping[str, FeatureDefinition],
) -> dict[str, FeatureReading]:
    """Project current LD2450 targets and count them per spatial feature."""
    targets_by_floor: dict[str, list[ProjectedTarget]] = {}
    availability: dict[str, bool] = {}
    exclusions: dict[str, list[tuple[tuple[float, float], ...]]] = {}

    for map_id, envelope in maps.items():
        config = envelope.get("config", {})
        for floor in config.get("floors", []):
            floor_key = f"{map_id}:{floor['id']}"
            floor_targets, floor_available = _targets_for_floor(
                map_id, floor, states
            )
            targets_by_floor[floor_key] = floor_targets
            availability[floor_key] = floor_available
            exclusions[floor_key] = [
                tuple((float(p["x"]), float(p["y"])) for p in zone["points"])
                for zone in floor.get("zones", [])
                if zone.get("kind") == "exclusion" and len(zone.get("points", [])) >= 3
            ]

    result: dict[str, FeatureReading] = {}
    for key, definition in definitions.items():
        floor_key = f"{definition.map_id}:{definition.floor_id}"
        matched = []
        for target in targets_by_floor.get(floor_key, []):
            if any(
                point_in_polygon(target.x, target.y, polygon)
                for polygon in exclusions.get(floor_key, [])
            ):
                continue
            if point_in_polygon(target.x, target.y, definition.points):
                matched.append(target.target_id)
        result[key] = FeatureReading(
            count=len(matched),
            target_ids=tuple(sorted(matched)),
            source_available=availability.get(floor_key, False),
        )
    return result


def required_entity_ids(maps: Mapping[str, Mapping[str, Any]]) -> set[str]:
    """Return all coordinate entities that can affect current calculations."""
    result: set[str] = set()
    for envelope in maps.values():
        for floor in envelope.get("config", {}).get("floors", []):
            for sensor in floor.get("sensors", []):
                prefix = _sensor_prefix(sensor)
                if prefix is None:
                    continue
                for index in range(1, 10):
                    result.add(f"sensor.{prefix}_target_{index}_x")
                    result.add(f"sensor.{prefix}_target_{index}_y")
                result.add(f"binary_sensor.{prefix}_online")
                result.add(f"binary_sensor.{prefix}_status")
                result.add(f"binary_sensor.{prefix}_presence")
    return result


def point_in_polygon(
    x: float, y: float, polygon: tuple[tuple[float, float], ...]
) -> bool:
    """Return whether a point lies inside or on a polygon boundary."""
    inside = False
    previous = polygon[-1]
    for current in polygon:
        x1, y1 = previous
        x2, y2 = current
        cross = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1)
        if (
            abs(cross) < 1e-9
            and min(x1, x2) <= x <= max(x1, x2)
            and min(y1, y2) <= y <= max(y1, y2)
        ):
            return True
        if (y1 > y) != (y2 > y):
            intercept = (x2 - x1) * (y - y1) / (y2 - y1) + x1
            if x < intercept:
                inside = not inside
        previous = current
    return inside


def _targets_for_floor(
    map_id: str, floor: Mapping[str, Any], states: Mapping[str, Any]
) -> tuple[list[ProjectedTarget], bool]:
    targets: list[ProjectedTarget] = []
    available = False
    floor_key = f"{map_id}:{floor['id']}"
    pixels_per_meter = float(floor["pixels_per_meter"])
    for sensor in floor.get("sensors", []):
        prefix = _sensor_prefix(sensor)
        if prefix is None:
            continue
        explicit_availability = _sensor_source_available(prefix, states)
        sensor_available = explicit_availability is True
        if explicit_availability is False:
            continue
        for index in range(1, 10):
            x_state = states.get(f"sensor.{prefix}_target_{index}_x")
            y_state = states.get(f"sensor.{prefix}_target_{index}_y")
            local_x = _state_to_mm(x_state)
            local_y = _state_to_mm(y_state)
            if local_x is not None and local_y is not None:
                sensor_available = True
            if local_x is None or local_y is None or (local_x == 0 and local_y == 0):
                continue
            angle = math.radians(float(sensor.get("heading", 0)) % 360)
            scale = pixels_per_meter / 1000
            scaled_x = local_x * scale
            scaled_y = -local_y * scale
            floor_x = float(sensor["x"]) + scaled_x * math.cos(angle) - scaled_y * math.sin(angle)
            floor_y = float(sensor["y"]) + scaled_x * math.sin(angle) + scaled_y * math.cos(angle)
            targets.append(
                ProjectedTarget(
                    target_id=f"{map_id}:{floor['id']}:{sensor['id']}:{index}",
                    floor_key=floor_key,
                    x=floor_x,
                    y=floor_y,
                )
            )
        available = available or sensor_available
    return targets, available


def _sensor_source_available(
    prefix: str, states: Mapping[str, Any]
) -> bool | None:
    for suffix in ("online", "status"):
        state = states.get(f"binary_sensor.{prefix}_{suffix}")
        if state is not None:
            raw = getattr(
                state,
                "state",
                state.get("state") if isinstance(state, dict) else state,
            )
            return str(raw).lower() == "on"
    presence = states.get(f"binary_sensor.{prefix}_presence")
    if presence is not None:
        return _state_is_available(presence)
    return None


def _sensor_prefix(sensor: Mapping[str, Any]) -> str | None:
    prefix = str(sensor.get("entity_prefix") or sensor["id"])
    prefix = prefix.removeprefix("sensor.")
    return prefix if ENTITY_PREFIX_PATTERN.fullmatch(prefix) else None


def _state_is_available(state: Any) -> bool:
    value = getattr(state, "state", state.get("state") if isinstance(state, dict) else state)
    return str(value).lower() not in UNKNOWN_STATES


def _state_to_mm(state: Any) -> float | None:
    if state is None or not _state_is_available(state):
        return None
    raw = getattr(state, "state", state.get("state") if isinstance(state, dict) else state)
    try:
        value = float(raw)
    except (TypeError, ValueError):
        return None
    fallback = state.get("attributes", {}) if isinstance(state, dict) else {}
    attributes = getattr(state, "attributes", fallback)
    unit = str(attributes.get("unit_of_measurement", "mm")).lower()
    if unit == "m":
        return value * 1000
    if unit == "cm":
        return value * 10
    return value
