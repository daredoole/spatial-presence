"""Shared native entity behavior for Spatial Presence."""

from __future__ import annotations

from homeassistant.core import callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import Entity

from .const import DOMAIN
from .runtime import FeatureState, SpatialPresenceManager
from .spatial import FeatureDefinition


class SpatialPresenceEntity(Entity):
    """Base for entities backed by one floorplan feature."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(
        self,
        manager: SpatialPresenceManager,
        definition: FeatureDefinition,
        suffix: str,
    ) -> None:
        self.manager = manager
        self.key = definition.key
        self._attr_unique_id = f"{definition.key}:{suffix}"
        self._suffix = suffix

    @property
    def _definition(self) -> FeatureDefinition | None:
        return self.manager.definition(self.key)

    @property
    def _state(self) -> FeatureState | None:
        return self.manager.state(self.key)

    @property
    def name(self) -> str:
        definition = self._definition
        if definition is None:
            return self._suffix.title()
        return f"{definition.floor_name} {definition.name} {self._suffix}"

    @property
    def available(self) -> bool:
        state = self._state
        return self._definition is not None and state is not None and state.available

    @property
    def device_info(self) -> DeviceInfo | None:
        definition = self._definition
        if definition is None:
            return None
        return DeviceInfo(
            identifiers={(DOMAIN, definition.map_id)},
            name=definition.map_title,
            manufacturer="Spatial Presence",
            model="Spatial map",
        )

    @property
    def extra_state_attributes(self) -> dict[str, object]:
        definition = self._definition
        state = self._state
        if definition is None:
            return {}
        return {
            "map_id": definition.map_id,
            "floor_id": definition.floor_id,
            "feature_id": definition.feature_id,
            "feature_kind": definition.kind,
            "target_ids": list(state.target_ids) if state else [],
            "held": state.held if state else False,
        }

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        self.async_on_remove(self.manager.add_listener(self._handle_runtime_update))

    @callback
    def _handle_runtime_update(self, changed: set[str]) -> None:
        if self.key in changed:
            self.async_write_ha_state()
