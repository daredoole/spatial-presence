import "./spatial-presence-card";
import type { SpatialPresenceCard } from "./spatial-presence-card";
import type { HassEntity, HomeAssistant, SpatialPresenceConfig } from "./types";

const state = (value: string, unit = "mm"): HassEntity => ({
  state: value,
  attributes: { unit_of_measurement: unit },
});

const hass: HomeAssistant = {
  states: {
    "sensor.ld2450_presence_target_1_x": state("-620"),
    "sensor.ld2450_presence_target_1_y": state("2820"),
    "sensor.ld2450_presence_target_2_x": state("1320"),
    "sensor.ld2450_presence_target_2_y": state("4170"),
    "sensor.ld2450_presence_temperature": state("77.4", "°F"),
    "sensor.ld2450_presence_humidity": state("45.6", "%"),
    "binary_sensor.ld2450_presence_status": state("on", ""),
  },
};

const config: SpatialPresenceConfig = {
  type: "custom:spatial-presence-card",
  schema_version: "0.1",
  title: "Spatial Presence",
  auto_discover: true,
  target_trail_seconds: 8,
  default_floor: "main",
  floors: [
    {
      id: "main",
      name: "Main floor",
      width: 1200,
      height: 800,
      pixels_per_meter: 100,
      rooms: [
        {
          id: "living",
          name: "Living room",
          area_id: "living_room",
          points: [
            { x: 70, y: 70 }, { x: 670, y: 70 },
            { x: 670, y: 500 }, { x: 70, y: 500 },
          ],
        },
        {
          id: "kitchen",
          name: "Kitchen",
          area_id: "kitchen",
          points: [
            { x: 670, y: 70 }, { x: 1130, y: 70 },
            { x: 1130, y: 500 }, { x: 670, y: 500 },
          ],
        },
      ],
      walls: [
        {
          id: "outer",
          points: [
            { x: 70, y: 70 }, { x: 1130, y: 70 },
            { x: 1130, y: 730 }, { x: 70, y: 730 }, { x: 70, y: 70 },
          ],
        },
        { id: "middle", points: [{ x: 670, y: 70 }, { x: 670, y: 500 }] },
      ],
      zones: [
        {
          id: "sofa",
          name: "Sofa",
          points: [
            { x: 170, y: 230 }, { x: 470, y: 230 },
            { x: 470, y: 390 }, { x: 170, y: 390 },
          ],
        },
      ],
      sensors: [
        {
          id: "ld2450_presence",
          name: "Living room radar",
          entity_prefix: "ld2450_presence",
          x: 600,
          y: 700,
          heading: 4,
          range_m: 6,
          fov_degrees: 120,
          mount: "wall",
        },
      ],
    },
    {
      id: "upstairs",
      name: "Upstairs",
      width: 900,
      height: 1200,
      pixels_per_meter: 100,
      walls: [
        {
          id: "outer-upstairs",
          points: [
            { x: 80, y: 80 }, { x: 820, y: 80 },
            { x: 820, y: 1120 }, { x: 80, y: 1120 }, { x: 80, y: 80 },
          ],
        },
      ],
      rooms: [],
      zones: [],
      sensors: [],
    },
  ],
};

const preview = document.querySelector<SpatialPresenceCard>("#preview");
if (preview) {
  preview.hass = hass;
  preview.setConfig(config);
}

