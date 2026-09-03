"""Websocket API for Spatial Presence maps."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import config_validation as cv

from .const import (
    DATA_STORE,
    DOMAIN,
    WS_MAP_GET,
    WS_MAP_LIST,
    WS_MAP_RESTORE,
    WS_MAP_SAVE,
)
from .schema import MapValidationError
from .store import SpatialMapStore


def _map_store(hass: HomeAssistant) -> SpatialMapStore:
    return hass.data[DOMAIN][DATA_STORE]


@callback
@websocket_api.websocket_command({"type": WS_MAP_LIST})
def websocket_map_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """List available maps without their geometry."""
    connection.send_result(msg["id"], _map_store(hass).list_metadata())


@callback
@websocket_api.websocket_command(
    {"type": WS_MAP_GET, vol.Required("map_id"): cv.string}
)
def websocket_map_get(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Load one spatial map."""
    try:
        value = _map_store(hass).get(msg["map_id"])
    except MapValidationError as err:
        connection.send_error(msg["id"], "invalid_map_id", str(err))
        return
    if value is None:
        connection.send_error(msg["id"], "map_not_found", "Map does not exist")
        return
    connection.send_result(msg["id"], {"map_id": msg["map_id"], **value})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        "type": WS_MAP_SAVE,
        vol.Required("map_id"): cv.string,
        vol.Required("config"): dict,
        vol.Optional("title"): cv.string,
    }
)
@websocket_api.async_response
async def websocket_map_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Validate and persist one spatial map."""
    try:
        result = await _map_store(hass).async_save_map(
            msg["map_id"], msg["config"], msg.get("title")
        )
    except MapValidationError as err:
        connection.send_error(msg["id"], "invalid_map", str(err))
        return
    connection.send_result(msg["id"], result)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {"type": WS_MAP_RESTORE, vol.Required("map_id"): cv.string}
)
@websocket_api.async_response
async def websocket_map_restore_previous(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Restore the immediately previous saved revision."""
    try:
        result = await _map_store(hass).async_restore_previous(msg["map_id"])
    except (MapValidationError, ValueError) as err:
        connection.send_error(msg["id"], "restore_unavailable", str(err))
        return
    connection.send_result(msg["id"], result)


def async_register_websocket_commands(hass: HomeAssistant) -> None:
    """Register the stable frontend/backend map contract."""
    for command in (
        websocket_map_list,
        websocket_map_get,
        websocket_map_save,
        websocket_map_restore_previous,
    ):
        websocket_api.async_register_command(hass, command)
