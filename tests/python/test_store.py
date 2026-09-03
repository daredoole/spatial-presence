"""Tests for map revision persistence with a minimal Home Assistant shim."""

from __future__ import annotations

from copy import deepcopy
import importlib
from pathlib import Path
import sys
from types import ModuleType
from typing import Any
import unittest

ROOT = Path(__file__).parents[2]


class FakeStore:
    """In-memory stand-in for Home Assistant's atomic Store helper."""

    saved: dict[str, Any] | None = None

    def __class_getitem__(cls, _item):
        return cls

    def __init__(self, *_args, **_kwargs) -> None:
        pass

    async def async_load(self):
        return deepcopy(self.saved)

    async def async_save(self, data):
        self.saved = deepcopy(data)


def load_store_module():
    package = ModuleType("spatial_presence")
    package.__path__ = [str(ROOT / "custom_components" / "spatial_presence")]
    core = ModuleType("homeassistant.core")
    core.HomeAssistant = object
    storage = ModuleType("homeassistant.helpers.storage")
    storage.Store = FakeStore
    helpers = ModuleType("homeassistant.helpers")
    homeassistant = ModuleType("homeassistant")
    sys.modules.update(
        {
            "spatial_presence": package,
            "homeassistant": homeassistant,
            "homeassistant.core": core,
            "homeassistant.helpers": helpers,
            "homeassistant.helpers.storage": storage,
        }
    )
    for name in ("spatial_presence.const", "spatial_presence.schema", "spatial_presence.store"):
        sys.modules.pop(name, None)
    return importlib.import_module("spatial_presence.store")


def valid_map(name: str = "Main") -> dict[str, Any]:
    return {
        "schema_version": "0.1",
        "floors": [
            {
                "id": "main",
                "name": name,
                "width": 1000,
                "height": 700,
                "pixels_per_meter": 100,
                "walls": [],
                "rooms": [],
                "zones": [],
                "sensors": [],
            }
        ],
    }


class SpatialMapStoreTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self) -> None:
        FakeStore.saved = None
        module = load_store_module()
        self.store = module.SpatialMapStore(object())
        await self.store.async_load()

    async def test_save_load_metadata_and_revision(self) -> None:
        first = await self.store.async_save_map("house", valid_map(), "My house")
        second = await self.store.async_save_map(
            "house", valid_map("Updated"), "My house"
        )
        self.assertEqual(first["revision"], 1)
        self.assertEqual(second["revision"], 2)
        self.assertEqual(self.store.get("house")["config"]["floors"][0]["name"], "Updated")
        self.assertEqual(
            self.store.list_metadata(),
            [
                {
                    "map_id": "house",
                    "revision": 2,
                    "updated_at": second["updated_at"],
                    "floor_count": 1,
                    "title": "My house",
                    "can_restore": True,
                }
            ],
        )

    async def test_restore_swaps_to_previous_config(self) -> None:
        await self.store.async_save_map("house", valid_map("Original"))
        await self.store.async_save_map("house", valid_map("Changed"))
        restored = await self.store.async_restore_previous("house")
        self.assertEqual(restored["revision"], 3)
        self.assertEqual(
            self.store.get("house")["config"]["floors"][0]["name"],
            "Original",
        )

    async def test_get_returns_a_defensive_copy(self) -> None:
        await self.store.async_save_map("house", valid_map())
        loaded = self.store.get("house")
        loaded["config"]["floors"][0]["name"] = "Mutated"
        self.assertEqual(
            self.store.get("house")["config"]["floors"][0]["name"],
            "Main",
        )


if __name__ == "__main__":
    unittest.main()
