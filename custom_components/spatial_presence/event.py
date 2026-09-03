"""Enter and leave event entities for Spatial Presence features."""

from __future__ import annotations

from homeassistant.components.event import EventEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DATA_MANAGER, DOMAIN
from .entity import SpatialPresenceEntity
from .runtime import SpatialPresenceManager
from .spatial import FeatureDefinition


class SpatialTransitionEventEntity(SpatialPresenceEntity, EventEntity):
    """Fire enter/leave events when feature occupancy changes."""

    _attr_event_types = ["enter", "leave"]

    def __init__(self, manager: SpatialPresenceManager, definition: FeatureDefinition) -> None:
        super().__init__(manager, definition, "transition")
        state = manager.state(definition.key)
        self._last_sequence = state.event_sequence if state else 0

    @callback
    def _handle_runtime_update(self, changed: set[str]) -> None:
        if self.key not in changed:
            return
        state = self._state
        if (
            state is not None
            and state.event_sequence != self._last_sequence
            and state.last_event is not None
        ):
            self._last_sequence = state.event_sequence
            definition = self._definition
            self._trigger_event(
                state.last_event,
                {
                    "target_count": state.count,
                    "target_ids": list(state.target_ids),
                    "map_id": definition.map_id if definition else None,
                    "floor_id": definition.floor_id if definition else None,
                    "feature_id": definition.feature_id if definition else None,
                    "feature_kind": definition.kind if definition else None,
                },
            )
        self.async_write_ha_state()


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up transition event entities and future map additions."""
    manager: SpatialPresenceManager = hass.data[DOMAIN][DATA_MANAGER]
    remove = manager.register_platform(
        "event",
        lambda definitions: async_add_entities(
            [SpatialTransitionEventEntity(manager, definition) for definition in definitions]
        ),
    )
    entry.async_on_unload(remove)
