import type { HomeAssistant, SpatialPresenceConfig } from "./types";

export interface StoredMapEnvelope {
  map_id: string;
  revision: number;
  updated_at: string;
  title: string;
  can_restore: boolean;
  config: Omit<SpatialPresenceConfig, "type" | "backend_map_id">;
}

export interface StoredMapMetadata extends Omit<StoredMapEnvelope, "config"> {
  floor_count: number;
}

function websocket<T>(
  hass: HomeAssistant,
  message: Record<string, unknown>,
): Promise<T> {
  if (!hass.callWS) {
    return Promise.reject(
      new Error("Spatial Presence integration is not connected"),
    );
  }
  return hass.callWS<T>(message);
}

export function listStoredMaps(hass: HomeAssistant): Promise<StoredMapMetadata[]> {
  return websocket(hass, { type: "spatial_presence/map/list" });
}

export function loadStoredMap(
  hass: HomeAssistant,
  mapId: string,
): Promise<StoredMapEnvelope> {
  return websocket(hass, { type: "spatial_presence/map/get", map_id: mapId });
}

export function saveStoredMap(
  hass: HomeAssistant,
  mapId: string,
  config: SpatialPresenceConfig,
): Promise<Omit<StoredMapEnvelope, "config">> {
  const stored = toPortableMap(config);
  return websocket(hass, {
    type: "spatial_presence/map/save",
    map_id: mapId,
    title: config.title ?? mapId,
    config: { ...stored, schema_version: "0.1" },
  });
}

export function toPortableMap(
  config: SpatialPresenceConfig,
): Omit<SpatialPresenceConfig, "type" | "backend_map_id"> {
  const { type: _type, backend_map_id: _backendMapId, ...stored } = config;
  return { ...stored, schema_version: "0.1" };
}

export function restoreStoredMap(
  hass: HomeAssistant,
  mapId: string,
): Promise<Omit<StoredMapEnvelope, "config">> {
  return websocket(hass, {
    type: "spatial_presence/map/restore_previous",
    map_id: mapId,
  });
}
