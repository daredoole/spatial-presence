import { describe, expect, it } from "vitest";

import {
  discoverLd2450Prefixes,
  discoveredRadarForFloor,
  runtimeForFloor,
  unassignedLd2450Prefixes,
} from "../src/discovery";
import type { Floor, HomeAssistant } from "../src/types";

const floor: Floor = {
  id: "main",
  name: "Main",
  width: 1200,
  height: 800,
  pixels_per_meter: 100,
  sensors: [
    {
      id: "ld2450_presence",
      entity_prefix: "ld2450_presence",
      x: 500,
      y: 700,
      heading: 0,
    },
  ],
};

function entity(state: string, unit = "mm") {
  return { state, attributes: { unit_of_measurement: unit } };
}

describe("LD2450 discovery", () => {
  it("requires matching x and y entities", () => {
    const hass: HomeAssistant = {
      states: {
        "sensor.one_target_1_x": entity("100"),
        "sensor.one_target_1_y": entity("200"),
        "sensor.incomplete_target_1_x": entity("300"),
      },
    };
    expect(discoverLd2450Prefixes(hass)).toEqual(["one"]);
  });

  it("normalizes metres and ignores zero targets", () => {
    const hass: HomeAssistant = {
      states: {
        "sensor.ld2450_presence_target_1_x": entity("0.5", "m"),
        "sensor.ld2450_presence_target_1_y": entity("2", "m"),
        "sensor.ld2450_presence_target_1_speed": entity("12", "in/s"),
        "sensor.ld2450_presence_target_2_x": entity("0"),
        "sensor.ld2450_presence_target_2_y": entity("0"),
        "sensor.ld2450_presence_temperature": entity("77.4", "°F"),
        "sensor.ld2450_presence_humidity": entity("45.6", "%"),
      },
    };
    const [runtime] = runtimeForFloor(hass, floor, 1234);
    expect(runtime?.targets).toHaveLength(1);
    expect(runtime?.targets[0]?.localXmm).toBe(500);
    expect(runtime?.targets[0]?.localYmm).toBe(2000);
    expect(runtime?.targets[0]?.speedMmPerSecond).toBeCloseTo(304.8);
    expect(runtime?.targets[0]?.floorPoint).toEqual({ x: 550, y: 500 });
    expect(runtime?.temperature).toBe(77.4);
    expect(runtime?.humidity).toBe(45.6);
  });

  it("normalizes Home Assistant imperial target coordinates", () => {
    const hass: HomeAssistant = {
      states: {
        "sensor.ld2450_presence_target_1_x": entity("-14.0944881889764", "in"),
        "sensor.ld2450_presence_target_1_y": entity("79.7244094488189", "in"),
        "sensor.ld2450_presence_target_2_x": entity("1", "ft"),
        "sensor.ld2450_presence_target_2_y": entity("6", "ft"),
      },
    };
    const [runtime] = runtimeForFloor(hass, floor, 1234);
    expect(runtime?.targets[0]?.localXmm).toBeCloseTo(-358);
    expect(runtime?.targets[0]?.localYmm).toBeCloseTo(2025);
    expect(runtime?.targets[0]?.floorPoint.x).toBeCloseTo(464.2);
    expect(runtime?.targets[0]?.floorPoint.y).toBeCloseTo(497.5);
    expect(runtime?.targets[1]?.localXmm).toBeCloseTo(304.8);
    expect(runtime?.targets[1]?.localYmm).toBeCloseTo(1828.8);
  });

  it("keeps discovered sensors unplaced until a floor claims them", () => {
    const hass: HomeAssistant = {
      states: {
        "sensor.kitchen_target_1_x": entity("100"),
        "sensor.kitchen_target_1_y": entity("1000"),
      },
    };
    const emptyFloor = { ...floor, sensors: [] };
    expect(runtimeForFloor(hass, emptyFloor)).toEqual([]);
    expect(unassignedLd2450Prefixes(hass, [emptyFloor])).toEqual(["kitchen"]);

    const discovered = discoveredRadarForFloor("kitchen", emptyFloor);
    expect(discovered.x).toBe(600);
    expect(discovered.y).toBe(680);
  });

  it("does not offer a radar already assigned to another floor", () => {
    const hass: HomeAssistant = {
      states: {
        "sensor.ld2450_presence_target_1_x": entity("100"),
        "sensor.ld2450_presence_target_1_y": entity("1000"),
      },
    };
    expect(
      unassignedLd2450Prefixes(hass, [floor, { ...floor, id: "upstairs", sensors: [] }]),
    ).toEqual([]);
  });

  it("does not treat an empty presence state as an offline device", () => {
    const hass: HomeAssistant = {
      states: {
        "sensor.ld2450_presence_target_1_x": entity("0"),
        "sensor.ld2450_presence_target_1_y": entity("0"),
        "binary_sensor.ld2450_presence_presence": entity("off", ""),
      },
    };
    expect(runtimeForFloor(hass, floor)[0]?.online).toBe(true);
  });
});
