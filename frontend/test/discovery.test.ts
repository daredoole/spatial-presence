import { describe, expect, it } from "vitest";

import { discoverLd2450Prefixes, runtimeForFloor } from "../src/discovery";
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
        "sensor.ld2450_presence_target_2_x": entity("0"),
        "sensor.ld2450_presence_target_2_y": entity("0"),
        "sensor.ld2450_presence_temperature": entity("77.4", "°F"),
        "sensor.ld2450_presence_humidity": entity("45.6", "%"),
      },
    };
    const [runtime] = runtimeForFloor(hass, floor, true, 1234);
    expect(runtime?.targets).toHaveLength(1);
    expect(runtime?.targets[0]?.localXmm).toBe(500);
    expect(runtime?.targets[0]?.localYmm).toBe(2000);
    expect(runtime?.targets[0]?.floorPoint).toEqual({ x: 550, y: 500 });
    expect(runtime?.temperature).toBe(77.4);
    expect(runtime?.humidity).toBe(45.6);
  });

  it("places newly discovered sensors at a safe visible default", () => {
    const hass: HomeAssistant = {
      states: {
        "sensor.kitchen_target_1_x": entity("100"),
        "sensor.kitchen_target_1_y": entity("1000"),
      },
    };
    const runtimes = runtimeForFloor(hass, { ...floor, sensors: [] });
    expect(runtimes[0]?.sensor.x).toBe(600);
    expect(runtimes[0]?.sensor.y).toBe(680);
    expect(runtimes[0]?.discovered).toBe(true);
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
