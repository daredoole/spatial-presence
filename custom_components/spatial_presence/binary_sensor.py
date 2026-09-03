"""Occupancy entities for Spatial Presence rooms and zones."""

from __future__ import annotations

from homeassistant.components.binary_sensor import BinarySensorDeviceClass, BinarySensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DATA_MANAGER, DOMAIN
from .entity import SpatialPresenceEntity
from .runtime import SpatialPresenceManager
from .spatial import FeatureDefinition


class SpatialOccupancyEntity(SpatialPresenceEntity, BinarySensorEntity):
    """Whether a drawn room or zone currently contains a target."""

    _attr_device_class = BinarySensorDeviceClass.OCCUPANCY

    def __init__(self, manager: SpatialPresenceManager, definition: FeatureDefinition) -> None:
        super().__init__(manager, definition, "occupancy")

    @property
    def is_on(self) -> bool | None:
        state = self._state
        return state.occupied if state and state.available else None


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up occupancy entities and future map additions."""
    manager: SpatialPresenceManager = hass.data[DOMAIN][DATA_MANAGER]
    remove = manager.register_platform(
        "binary_sensor",
        lambda definitions: async_add_entities(
            [SpatialOccupancyEntity(manager, definition) for definition in definitions]
        ),
    )
    entry.async_on_unload(remove)
