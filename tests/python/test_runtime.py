"""Tests for push-based occupancy transitions and stationary hold."""

from __future__ import annotations

import importlib
import asyncio
from pathlib import Path
import sys
from types import ModuleType
from typing import Any
import unittest

ROOT = Path(__file__).parents[2]


class FakeHass:
    def __init__(self, states: dict[str, Any]) -> None:
        self.states = states
        self.loop = asyncio.get_running_loop()

    def async_create_task(self, coroutine):
        coroutine.close()


class FakeMapStore:
    def __init__(self, maps: dict[str, Any]) -> None:
        self.value = maps
        self.listener = None

    def maps(self):
        return self.value

    def add_listener(self, listener):
        self.listener = listener
        return lambda: None


def load_runtime_module():
    package = ModuleType("spatial_presence")
    package.__path__ = [str(ROOT / "custom_components" / "spatial_presence")]
    homeassistant = ModuleType("homeassistant")
    core = ModuleType("homeassistant.core")
    core.CALLBACK_TYPE = object
    core.HomeAssistant = object
    core.callback = lambda function: function
    helpers = ModuleType("homeassistant.helpers")
    event = ModuleType("homeassistant.helpers.event")
    event.async_call_later = lambda _hass, _delay, _callback: lambda: None
    event.async_track_state_change_event = (
        lambda _hass, _entity_ids, _callback: lambda: None
    )
    store = ModuleType("spatial_presence.store")
    store.SpatialMapStore = object
    sys.modules.update(
        {
            "spatial_presence": package,
            "spatial_presence.store": store,
            "homeassistant": homeassistant,
            "homeassistant.core": core,
            "homeassistant.helpers": helpers,
            "homeassistant.helpers.event": event,
        }
    )
    for name in ("spatial_presence.spatial", "spatial_presence.runtime"):
        sys.modules.pop(name, None)
    return importlib.import_module("spatial_presence.runtime")


def map_data(kind: str = "detection", hold: int = 30) -> dict[str, Any]:
    return {
        "house": {
            "title": "House",
            "config": {
                "schema_version": "0.1",
                "stationary_hold_seconds": hold,
                "floors": [
                    {
                        "id": "main",
                        "name": "Main",
                        "width": 1000,
                        "height": 800,
                        "pixels_per_meter": 100,
                        "rooms": [],
                        "zones": [
                            {
                                "id": "seat",
                                "name": "Seat",
                                "kind": kind,
                                "points": [
                                    {"x": 400, "y": 400},
                                    {"x": 600, "y": 400},
                                    {"x": 600, "y": 600},
                                    {"x": 400, "y": 600},
                                ],
                            }
                        ],
                        "sensors": [
                            {
                                "id": "radar",
                                "x": 500,
                                "y": 700,
                                "heading": 0,
                            }
                        ],
                    }
                ],
            },
        }
    }


def states(y: str = "2000") -> dict[str, Any]:
    return {
        "sensor.radar_target_1_x": {
            "state": "0",
            "attributes": {"unit_of_measurement": "mm"},
        },
        "sensor.radar_target_1_y": {
            "state": y,
            "attributes": {"unit_of_measurement": "mm"},
        },
    }


class RuntimeTests(unittest.IsolatedAsyncioTestCase):
    async def test_publishes_enter_and_leave_transitions(self) -> None:
        runtime = load_runtime_module()
        hass = FakeHass(states())
        manager = runtime.SpatialPresenceManager(hass, FakeMapStore(map_data()))
        await manager.async_start()
        key = "house:main:zones:seat"
        self.assertTrue(manager.state(key).occupied)
        self.assertEqual(manager.state(key).event_sequence, 0)

        hass.states.update(states("0"))
        manager._handle_state_change(None)
        await asyncio.sleep(0)
        self.assertFalse(manager.state(key).occupied)
        self.assertEqual(manager.state(key).last_event, "leave")
        self.assertEqual(manager.state(key).event_sequence, 1)

        hass.states.update(states())
        manager._handle_state_change(None)
        await asyncio.sleep(0)
        self.assertEqual(manager.state(key).last_event, "enter")
        self.assertEqual(manager.state(key).event_sequence, 2)

    async def test_stationary_zone_holds_before_leave(self) -> None:
        runtime = load_runtime_module()
        now = 100.0
        hass = FakeHass(states())
        manager = runtime.SpatialPresenceManager(
            hass, FakeMapStore(map_data("stationary", hold=10))
        )
        manager._monotonic = lambda: now
        await manager.async_start()
        key = "house:main:zones:seat"

        hass.states.update(states("0"))
        manager._handle_state_change(None)
        await asyncio.sleep(0)
        self.assertTrue(manager.state(key).occupied)
        self.assertTrue(manager.state(key).held)
        self.assertEqual(manager.state(key).count, 0)

        now = 111.0
        manager._handle_hold_timer(None)
        self.assertFalse(manager.state(key).occupied)
        self.assertEqual(manager.state(key).last_event, "leave")


if __name__ == "__main__":
    unittest.main()
