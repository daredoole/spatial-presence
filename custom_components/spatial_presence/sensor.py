"""Target-count entities for Spatial Presence rooms and zones."""

from __future__ import annotations

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DATA_MANAGER, DOMAIN
from .entity import SpatialPresenceEntity
from .runtime import SpatialPresenceManager
from .spatial import FeatureDefinition


class SpatialTargetCountEntity(SpatialPresenceEntity, SensorEntity):
    """Number of raw radar targets inside a floorplan feature."""

    _attr_native_unit_of_measurement = "targets"
    _attr_suggested_display_precision = 0

    def __init__(self, manager: SpatialPresenceManager, definition: FeatureDefinition) -> None:
        super().__init__(manager, definition, "target count")

    @property
    def native_value(self) -> int | None:
        state = self._state
        return state.count if state and state.available else None


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up target-count entities and future map additions."""
    manager: SpatialPresenceManager = hass.data[DOMAIN][DATA_MANAGER]
    remove = manager.register_platform(
        "sensor",
        lambda definitions: async_add_entities(
            [SpatialTargetCountEntity(manager, definition) for definition in definitions]
        ),
    )
    entry.async_on_unload(remove)
