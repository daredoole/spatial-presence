"""Constants for Spatial Presence."""

from pathlib import Path

DOMAIN = "spatial_presence"
DATA_STORE = "map_store"
FRONTEND_BASE_URL = "/spatial_presence"
FRONTEND_URL = "/spatial_presence/spatial-presence-card.js"
FRONTEND_PATH = Path(__file__).parent / "frontend" / "spatial-presence-card.js"
STORAGE_KEY = f"{DOMAIN}.maps"
STORAGE_VERSION = 1
STORAGE_MINOR_VERSION = 1

WS_MAP_GET = f"{DOMAIN}/map/get"
WS_MAP_LIST = f"{DOMAIN}/map/list"
WS_MAP_SAVE = f"{DOMAIN}/map/save"
WS_MAP_RESTORE = f"{DOMAIN}/map/restore_previous"
