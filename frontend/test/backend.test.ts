import { describe, expect, it } from "vitest";

import {
  listStoredMaps,
  loadStoredMap,
  restoreStoredMap,
  saveStoredMap,
  toPortableMap,
} from "../src/backend";
import type { HomeAssistant, SpatialPresenceConfig } from "../src/types";

const config: SpatialPresenceConfig = {
  type: "custom:spatial-presence-card",
  schema_version: "0.1",
  backend_map_id: "house",
  floors: [{
    id: "main",
    name: "Main",
    width: 1000,
    height: 700,
    pixels_per_meter: 100,
  }],
};

describe("backend websocket client", () => {
  it("uses stable command names", async () => {
    const messages: Record<string, unknown>[] = [];
    const callWS = async <T>(message: Record<string, unknown>): Promise<T> => {
      messages.push(message);
      return {} as T;
    };
    const hass: HomeAssistant = { states: {}, callWS };
    await listStoredMaps(hass);
    await loadStoredMap(hass, "house");
    await restoreStoredMap(hass, "house");
    expect(messages.map((message) => message.type)).toEqual([
      "spatial_presence/map/list",
      "spatial_presence/map/get",
      "spatial_presence/map/restore_previous",
    ]);
  });

  it("removes dashboard-only fields before saving", async () => {
    const messages: Record<string, unknown>[] = [];
    const callWS = async <T>(message: Record<string, unknown>): Promise<T> => {
      messages.push(message);
      return {} as T;
    };
    await saveStoredMap({ states: {}, callWS }, "house", config);
    const message = messages[0]!;
    expect(message.config).not.toHaveProperty("type");
    expect(message.config).not.toHaveProperty("backend_map_id");
    expect(message.config).toHaveProperty("schema_version", "0.1");
    expect(toPortableMap(config)).not.toHaveProperty("backend_map_id");
  });

  it("explains when the integration is unavailable", async () => {
    await expect(loadStoredMap({ states: {} }, "house")).rejects.toThrow(
      "integration is not connected",
    );
  });
});
