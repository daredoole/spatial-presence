"""Push-based Spatial Presence runtime driven by Home Assistant states."""

from __future__ import annotations

import asyncio
from collections.abc import Callable
from dataclasses import dataclass
import time
from typing import Any

from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.event import async_call_later, async_track_state_change_event

from .spatial import FeatureDefinition, calculate_readings, collect_definitions, required_entity_ids
from .store import SpatialMapStore

RuntimeListener = Callable[[set[str]], None]
DefinitionAdder = Callable[[list[FeatureDefinition]], None]


@dataclass(frozen=True, slots=True)
class FeatureState:
    """Published state for one spatial feature."""

    count: int
    occupied: bool
    available: bool
    target_ids: tuple[str, ...]
    held: bool = False
    last_event: str | None = None
    event_sequence: int = 0


class SpatialPresenceManager:
    """Project ESPHome radar coordinates and publish room/zone state."""

    def __init__(self, hass: HomeAssistant, store: SpatialMapStore) -> None:
        self.hass = hass
        self.store = store
        self.definitions: dict[str, FeatureDefinition] = {}
        self.states: dict[str, FeatureState] = {}
        self._maps: dict[str, dict[str, Any]] = {}
        self._listeners: list[RuntimeListener] = []
        self._platform_adders: dict[str, DefinitionAdder] = {}
        self._platform_keys: dict[str, set[str]] = {}
        self._hold_until: dict[str, float] = {}
        self._remove_state_listener: CALLBACK_TYPE | None = None
        self._remove_store_listener: Callable[[], None] | None = None
        self._remove_hold_timer: CALLBACK_TYPE | None = None
        self._refresh_handle: asyncio.Handle | None = None
        self._monotonic: Callable[[], float] = time.monotonic

    async def async_start(self) -> None:
        """Start map and entity-state subscriptions."""
        self._remove_store_listener = self.store.add_listener(self._schedule_reload)
        await self.async_reload()

    async def async_stop(self) -> None:
        """Release every runtime subscription."""
        for remove in (
            self._remove_state_listener,
            self._remove_store_listener,
            self._remove_hold_timer,
        ):
            if remove is not None:
                remove()
        self._remove_state_listener = None
        self._remove_store_listener = None
        self._remove_hold_timer = None
        if self._refresh_handle is not None:
            self._refresh_handle.cancel()
            self._refresh_handle = None
        self._listeners.clear()
        self._platform_adders.clear()

    async def async_reload(self) -> None:
        """Rebuild definitions and state subscriptions after a map save."""
        if self._remove_state_listener is not None:
            self._remove_state_listener()
            self._remove_state_listener = None
        self._maps = self.store.maps()
        self.definitions = collect_definitions(self._maps)
        entity_ids = required_entity_ids(self._maps)
        if entity_ids:
            self._remove_state_listener = async_track_state_change_event(
                self.hass, entity_ids, self._handle_state_change
            )
        self._add_new_entities()
        self._refresh()

    def register_platform(
        self, domain: str, adder: DefinitionAdder
    ) -> Callable[[], None]:
        """Register one entity platform and immediately add its definitions."""
        self._platform_adders[domain] = adder
        self._platform_keys.setdefault(domain, set())
        self._add_new_entities(domain)

        def remove() -> None:
            self._platform_adders.pop(domain, None)

        return remove

    def add_listener(self, listener: RuntimeListener) -> Callable[[], None]:
        """Subscribe an entity to calculated state changes."""
        self._listeners.append(listener)

        def remove() -> None:
            if listener in self._listeners:
                self._listeners.remove(listener)

        return remove

    def definition(self, key: str) -> FeatureDefinition | None:
        """Return the current definition for an entity key."""
        return self.definitions.get(key)

    def state(self, key: str) -> FeatureState | None:
        """Return the current calculated state for an entity key."""
        return self.states.get(key)

    @callback
    def _schedule_reload(self) -> None:
        self.hass.async_create_task(self.async_reload())

    @callback
    def _handle_state_change(self, _event: Any) -> None:
        if self._refresh_handle is None:
            self._refresh_handle = self.hass.loop.call_soon(
                self._run_scheduled_refresh
            )

    @callback
    def _run_scheduled_refresh(self) -> None:
        self._refresh_handle = None
        self._refresh()

    @callback
    def _refresh(self) -> None:
        readings = calculate_readings(self._maps, self.hass.states, self.definitions)
        now = self._monotonic()
        changed: set[str] = set()
        next_states: dict[str, FeatureState] = {}

        for key, definition in self.definitions.items():
            reading = readings[key]
            previous = self.states.get(key)
            occupied = reading.count > 0
            held = False
            if definition.hold_seconds and reading.source_available:
                if occupied:
                    self._hold_until.pop(key, None)
                elif previous is not None and previous.occupied:
                    deadline = self._hold_until.setdefault(
                        key, now + definition.hold_seconds
                    )
                    occupied = now < deadline
                    held = occupied
                elif (deadline := self._hold_until.get(key)) is not None:
                    occupied = now < deadline
                    held = occupied
                    if not occupied:
                        self._hold_until.pop(key, None)
            elif not reading.source_available:
                self._hold_until.pop(key, None)

            last_event = previous.last_event if previous else None
            sequence = previous.event_sequence if previous else 0
            if (
                previous is not None
                and previous.available
                and reading.source_available
                and previous.occupied != occupied
            ):
                last_event = "enter" if occupied else "leave"
                sequence += 1

            current = FeatureState(
                count=reading.count,
                occupied=occupied,
                available=reading.source_available,
                target_ids=reading.target_ids,
                held=held,
                last_event=last_event,
                event_sequence=sequence,
            )
            next_states[key] = current
            if current != previous:
                changed.add(key)

        changed.update(set(self.states) - set(next_states))
        self.states = next_states
        self._schedule_hold_timer(now)
        if changed:
            for listener in tuple(self._listeners):
                listener(changed)

    def _schedule_hold_timer(self, now: float) -> None:
        if self._remove_hold_timer is not None:
            self._remove_hold_timer()
            self._remove_hold_timer = None
        future = [deadline for deadline in self._hold_until.values() if deadline > now]
        if future:
            self._remove_hold_timer = async_call_later(
                self.hass, max(0, min(future) - now), self._handle_hold_timer
            )

    @callback
    def _handle_hold_timer(self, _now: Any) -> None:
        self._remove_hold_timer = None
        self._refresh()

    def _add_new_entities(self, only_domain: str | None = None) -> None:
        for domain, adder in tuple(self._platform_adders.items()):
            if only_domain is not None and domain != only_domain:
                continue
            known = self._platform_keys.setdefault(domain, set())
            new_keys = sorted(set(self.definitions) - known)
            if not new_keys:
                continue
            known.update(new_keys)
            adder([self.definitions[key] for key in new_keys])
