import { describe, expect, it } from "vitest";

import {
  exportEasyFloorplan,
  importEasyFloorplan,
  importRadarMapManager,
} from "../src/interoperability";

describe("Easy Floorplan interoperability", () => {
  it("imports walls, rooms, HA areas and backgrounds", () => {
    const result = importEasyFloorplan({
      type: "custom:easy-floorplan-card",
      title: "House",
      width: 1000,
      height: 600,
      defaultFloor: "main",
      floors: [{
        id: "main",
        name: "Main",
        image: "/local/main.svg",
        walls: [{ id: "w1", x1: 10, y1: 20, x2: 300, y2: 20 }],
        areas: [{
          id: "living",
          name: "Living room",
          haArea: "living_room",
          points: [{ x: 10, y: 20 }, { x: 300, y: 20 }, { x: 300, y: 250 }],
        }],
        furniture: [{ id: "sofa" }],
      }],
    });
    const floor = result.map.floors[0];
    expect(floor?.background).toBe("/local/main.svg");
    expect(floor?.walls?.[0]?.points).toEqual([{ x: 10, y: 20 }, { x: 300, y: 20 }]);
    expect(floor?.rooms?.[0]?.area_id).toBe("living_room");
    expect(result.warnings).toContain("main: 1 furniture retained only by Easy Floorplan");
  });

  it("exports every polyline segment as an Easy Floorplan wall", () => {
    const imported = importEasyFloorplan({
      width: 800,
      height: 600,
      walls: [{ id: "w1", x1: 0, y1: 0, x2: 10, y2: 0 }],
      areas: [],
    });
    const exported = exportEasyFloorplan(imported.map);
    const floors = exported.floors as Array<{ walls: unknown[] }>;
    expect(floors[0]?.walls).toHaveLength(1);
  });
});
describe("Radar Map Manager interoperability", () => {
  it("imports map groups, radar poses and semantic zones", () => {
    const result = importRadarMapManager({
      version: 1,
      maps: {
        upstairs: {
          zones: {
            exclude_zones: [{ name: "Desk", points: [[10, 10], [20, 10], [20, 20]] }],
          },
          config: { background_image: "/local/upstairs.png" },
        },
      },
      radars: {
        Bedroom_Radar: {
          map_group: "upstairs",
          layout: { origin_x: 25, origin_y: 80, rotation: 90, scale_x: 5, scale_y: 5 },
          monitor_zones: [],
        },
      },
    });
    const floor = result.map.floors[0];
    expect(floor?.sensors?.[0]).toMatchObject({ x: 250, y: 800, heading: 90 });
    expect(floor?.zones?.[0]).toMatchObject({ name: "Desk", kind: "exclusion" });
    expect(floor?.background).toBe("/local/upstairs.png");
  });
});
