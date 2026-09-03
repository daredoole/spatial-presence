"""Validation for portable Spatial Presence maps."""

from __future__ import annotations

from copy import deepcopy
import json
import math
import re
from typing import Any

MAP_ID_PATTERN = re.compile(r"^[a-z0-9][a-z0-9_-]{0,63}$")
ENTITY_PREFIX_PATTERN = re.compile(r"^(?:sensor\.)?[a-z0-9_]+$")
MAX_MAP_BYTES = 2_000_000
MAX_FLOORS = 12
MAX_PATHS_PER_FLOOR = 5_000
MAX_POINTS_PER_PATH = 2_000
MAX_SENSORS_PER_FLOOR = 256
MAX_COORDINATE = 10_000_000


class MapValidationError(ValueError):
    """Raised when a stored spatial map is invalid or unsafe."""


def validate_map_id(map_id: str) -> str:
    """Return a safe map id or raise a useful validation error."""
    if not isinstance(map_id, str) or not MAP_ID_PATTERN.fullmatch(map_id):
        raise MapValidationError(
            "Map id must use 1–64 lowercase letters, numbers, underscores or hyphens"
        )
    return map_id


def validate_map_config(candidate: Any) -> dict[str, Any]:
    """Validate an untrusted websocket/import payload and return a deep copy."""
    if not isinstance(candidate, dict):
        raise MapValidationError("Map must be a JSON object")
    try:
        encoded = json.dumps(candidate, allow_nan=False, separators=(",", ":"))
    except (TypeError, ValueError) as err:
        raise MapValidationError("Map must contain finite JSON values") from err
    if len(encoded.encode()) > MAX_MAP_BYTES:
        raise MapValidationError("Map exceeds the 2 MB storage limit")
    if candidate.get("schema_version") != "0.1":
        raise MapValidationError("Only Spatial Map Schema 0.1 is supported")

    floors = candidate.get("floors")
    if not isinstance(floors, list) or not 1 <= len(floors) <= MAX_FLOORS:
        raise MapValidationError("Map must contain between 1 and 12 floors")

    floor_ids: set[str] = set()
    for floor_index, floor in enumerate(floors):
        path = f"floors[{floor_index}]"
        if not isinstance(floor, dict):
            raise MapValidationError(f"{path} must be an object")
        floor_id = _required_id(floor.get("id"), f"{path}.id")
        if floor_id in floor_ids:
            raise MapValidationError(f"Duplicate floor id: {floor_id}")
        floor_ids.add(floor_id)
        if not isinstance(floor.get("name"), str) or not floor["name"].strip():
            raise MapValidationError(f"{path}.name must not be empty")
        _positive_number(floor.get("width"), f"{path}.width")
        _positive_number(floor.get("height"), f"{path}.height")
        _positive_number(floor.get("pixels_per_meter"), f"{path}.pixels_per_meter")

        background = floor.get("background")
        if background is not None and (
            not isinstance(background, str)
            or not background.startswith(("/", "http://", "https://"))
        ):
            raise MapValidationError(
                f"{path}.background must be a local path or HTTP(S) URL"
            )

        for collection in ("walls", "rooms", "zones"):
            _validate_paths(floor.get(collection, []), f"{path}.{collection}")
        _validate_sensors(floor.get("sensors", []), f"{path}.sensors")

    default_floor = candidate.get("default_floor")
    if default_floor is not None and default_floor not in floor_ids:
        raise MapValidationError("default_floor must reference an existing floor id")
    title = candidate.get("title")
    if title is not None and (not isinstance(title, str) or len(title) > 128):
        raise MapValidationError("title must be a string up to 128 characters")
    trail_seconds = candidate.get("target_trail_seconds")
    if trail_seconds is not None:
        value = _finite_number(trail_seconds, "target_trail_seconds")
        if not 0 <= value <= 300:
            raise MapValidationError("target_trail_seconds must be between 0 and 300")
    hold_seconds = candidate.get("stationary_hold_seconds")
    if hold_seconds is not None:
        value = _finite_number(hold_seconds, "stationary_hold_seconds")
        if not 0 <= value <= 3600:
            raise MapValidationError(
                "stationary_hold_seconds must be between 0 and 3600"
            )

    return deepcopy(candidate)


def _validate_paths(candidate: Any, path: str) -> None:
    if not isinstance(candidate, list) or len(candidate) > MAX_PATHS_PER_FLOOR:
        raise MapValidationError(f"{path} must be an array of at most 5000 paths")
    ids: set[str] = set()
    for index, feature in enumerate(candidate):
        feature_path = f"{path}[{index}]"
        if not isinstance(feature, dict):
            raise MapValidationError(f"{feature_path} must be an object")
        feature_id = _required_id(feature.get("id"), f"{feature_path}.id")
        if feature_id in ids:
            raise MapValidationError(f"Duplicate feature id in {path}: {feature_id}")
        ids.add(feature_id)
        if "kind" in feature and feature["kind"] not in (
            "detection",
            "exclusion",
            "entrance",
            "stationary",
        ):
            raise MapValidationError(f"{feature_path}.kind is not supported")
        points = feature.get("points")
        if (
            not isinstance(points, list)
            or not 2 <= len(points) <= MAX_POINTS_PER_PATH
        ):
            raise MapValidationError(
                f"{feature_path}.points must contain 2–2000 points"
            )
        for point_index, point in enumerate(points):
            _validate_point(point, f"{feature_path}.points[{point_index}]")


def _validate_sensors(candidate: Any, path: str) -> None:
    if not isinstance(candidate, list) or len(candidate) > MAX_SENSORS_PER_FLOOR:
        raise MapValidationError(f"{path} must contain at most 256 sensors")
    ids: set[str] = set()
    for index, sensor in enumerate(candidate):
        sensor_path = f"{path}[{index}]"
        if not isinstance(sensor, dict):
            raise MapValidationError(f"{sensor_path} must be an object")
        sensor_id = _required_id(sensor.get("id"), f"{sensor_path}.id")
        if sensor_id in ids:
            raise MapValidationError(f"Duplicate sensor id in {path}: {sensor_id}")
        ids.add(sensor_id)
        name = sensor.get("name")
        if name is not None and (
            not isinstance(name, str) or not name.strip() or len(name) > 128
        ):
            raise MapValidationError(
                f"{sensor_path}.name must be a non-empty string up to 128 characters"
            )
        prefix = sensor.get("entity_prefix")
        if prefix is not None and (
            not isinstance(prefix, str)
            or len(prefix) > 255
            or not ENTITY_PREFIX_PATTERN.fullmatch(prefix)
        ):
            raise MapValidationError(
                f"{sensor_path}.entity_prefix must be a valid sensor entity prefix"
            )
        _coordinate(sensor.get("x"), f"{sensor_path}.x")
        _coordinate(sensor.get("y"), f"{sensor_path}.y")
        _finite_number(sensor.get("heading"), f"{sensor_path}.heading")
        if "range_m" in sensor:
            _positive_number(sensor["range_m"], f"{sensor_path}.range_m")
        if "fov_degrees" in sensor:
            fov = _positive_number(sensor["fov_degrees"], f"{sensor_path}.fov_degrees")
            if fov > 180:
                raise MapValidationError(f"{sensor_path}.fov_degrees must be at most 180")
        if sensor.get("mount", "wall") not in ("wall", "ceiling"):
            raise MapValidationError(f"{sensor_path}.mount must be wall or ceiling")


def _validate_point(candidate: Any, path: str) -> None:
    if not isinstance(candidate, dict):
        raise MapValidationError(f"{path} must be an object")
    _coordinate(candidate.get("x"), f"{path}.x")
    _coordinate(candidate.get("y"), f"{path}.y")


def _required_id(candidate: Any, path: str) -> str:
    if not isinstance(candidate, str) or not candidate or len(candidate) > 128:
        raise MapValidationError(f"{path} must be a non-empty string up to 128 characters")
    return candidate


def _positive_number(candidate: Any, path: str) -> float:
    value = _finite_number(candidate, path)
    if value <= 0 or value > MAX_COORDINATE:
        raise MapValidationError(f"{path} must be positive and within supported bounds")
    return value


def _coordinate(candidate: Any, path: str) -> float:
    value = _finite_number(candidate, path)
    if abs(value) > MAX_COORDINATE:
        raise MapValidationError(f"{path} is outside supported coordinate bounds")
    return value


def _finite_number(candidate: Any, path: str) -> float:
    if isinstance(candidate, bool) or not isinstance(candidate, (int, float)):
        raise MapValidationError(f"{path} must be a number")
    value = float(candidate)
    if not math.isfinite(value):
        raise MapValidationError(f"{path} must be finite")
    return value
