"""Persistent Spatial Presence map storage."""

from __future__ import annotations

from copy import deepcopy
from datetime import UTC, datetime
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY, STORAGE_MINOR_VERSION, STORAGE_VERSION
from .schema import validate_map_config, validate_map_id


class SpatialMapStore:
    """Own validated, versioned maps and one-step rollback snapshots."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store = Store[dict[str, Any]](
            hass,
            STORAGE_VERSION,
            STORAGE_KEY,
            minor_version=STORAGE_MINOR_VERSION,
        )
        self._data: dict[str, Any] = {"maps": {}}

    async def async_load(self) -> None:
        """Load maps from Home Assistant's atomic storage helper."""
        stored = await self._store.async_load()
        if isinstance(stored, dict) and isinstance(stored.get("maps"), dict):
            self._data = stored

    def get(self, map_id: str) -> dict[str, Any] | None:
        """Return one map envelope."""
        validate_map_id(map_id)
        value = self._data["maps"].get(map_id)
        return deepcopy(value) if isinstance(value, dict) else None

    def list_metadata(self) -> list[dict[str, Any]]:
        """Return stable metadata without transmitting map geometry."""
        result = []
        for map_id, envelope in sorted(self._data["maps"].items()):
            config = envelope.get("config", {})
            result.append(
                {
                    "map_id": map_id,
                    "revision": envelope.get("revision", 1),
                    "updated_at": envelope.get("updated_at"),
                    "floor_count": len(config.get("floors", [])),
                    "title": envelope.get("title", map_id),
                    "can_restore": isinstance(envelope.get("previous"), dict),
                }
            )
        return result

    async def async_save_map(
        self, map_id: str, config: Any, title: str | None = None
    ) -> dict[str, Any]:
        """Validate and atomically save a map, retaining one prior revision."""
        map_id = validate_map_id(map_id)
        validated = validate_map_config(config)
        existing = self._data["maps"].get(map_id)
        revision = int(existing.get("revision", 0)) + 1 if existing else 1
        previous = None
        if existing:
            previous = {
                "revision": existing.get("revision", 1),
                "updated_at": existing.get("updated_at"),
                "title": existing.get("title", map_id),
                "config": existing.get("config"),
            }
        envelope = {
            "revision": revision,
            "updated_at": datetime.now(UTC).isoformat(),
            "title": title.strip()[:128] if isinstance(title, str) and title.strip() else map_id,
            "config": validated,
            "previous": previous,
        }
        self._data["maps"][map_id] = envelope
        await self._store.async_save(self._data)
        return {"map_id": map_id, **self._metadata(envelope)}

    async def async_restore_previous(self, map_id: str) -> dict[str, Any]:
        """Swap the current and immediately previous map revisions."""
        map_id = validate_map_id(map_id)
        current = self._data["maps"].get(map_id)
        if not current or not isinstance(current.get("previous"), dict):
            raise ValueError("No previous map revision is available")
        previous = current["previous"]
        restored = {
            "revision": int(current.get("revision", 1)) + 1,
            "updated_at": datetime.now(UTC).isoformat(),
            "title": previous.get("title", map_id),
            "config": validate_map_config(previous.get("config")),
            "previous": {
                "revision": current.get("revision", 1),
                "updated_at": current.get("updated_at"),
                "title": current.get("title", map_id),
                "config": current.get("config"),
            },
        }
        self._data["maps"][map_id] = restored
        await self._store.async_save(self._data)
        return {"map_id": map_id, **self._metadata(restored)}

    @staticmethod
    def _metadata(envelope: dict[str, Any]) -> dict[str, Any]:
        return {
            "revision": envelope["revision"],
            "updated_at": envelope["updated_at"],
            "title": envelope["title"],
            "can_restore": isinstance(envelope.get("previous"), dict),
        }
