"""Config flow for Spatial Presence."""

from __future__ import annotations

from typing import Any

from homeassistant import config_entries
from homeassistant.config_entries import ConfigFlowResult

from .const import DOMAIN


class SpatialPresenceConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Create the singleton Spatial Presence entry."""

    VERSION = 1
    MINOR_VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle setup from the integrations page."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        if user_input is not None:
            return self.async_create_entry(title="Spatial Presence", data={})

        return self.async_show_form(step_id="user")
