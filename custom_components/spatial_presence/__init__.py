"""Spatial Presence integration."""

from __future__ import annotations

import logging

from homeassistant.components.http import StaticPathConfig
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DATA_STORE, DOMAIN, FRONTEND_BASE_URL, FRONTEND_PATH, FRONTEND_URL
from .store import SpatialMapStore
from .websocket import async_register_websocket_commands

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Spatial Presence and expose its local frontend bundle."""
    if not FRONTEND_PATH.is_file():
        _LOGGER.error(
            "Spatial Presence frontend is missing at %s; install a release build",
            FRONTEND_PATH,
        )
        return False

    domain_data = hass.data.setdefault(DOMAIN, {})
    if DATA_STORE not in domain_data:
        map_store = SpatialMapStore(hass)
        await map_store.async_load()
        domain_data[DATA_STORE] = map_store
        async_register_websocket_commands(hass)
    if not domain_data.get("frontend_registered"):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(FRONTEND_BASE_URL, str(FRONTEND_PATH.parent), False)]
        )
        add_extra_js_url(hass, f"{FRONTEND_URL}?v={FRONTEND_PATH.stat().st_mtime_ns}")
        domain_data["frontend_registered"] = True

    domain_data[entry.entry_id] = {"frontend_url": FRONTEND_URL}
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a Spatial Presence config entry."""
    hass.data.get(DOMAIN, {}).pop(entry.entry_id, None)
    return True
