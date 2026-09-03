// @vitest-environment happy-dom

import { beforeEach, describe, expect, it } from "vitest";

import {
  SpatialPresenceCard,
  SpatialPresenceCardEditor,
} from "../src/spatial-presence-card";
import type { SpatialPresenceConfig } from "../src/types";

const config: SpatialPresenceConfig = {
  type: "custom:spatial-presence-card",
  schema_version: "0.1",
  floors: [
    {
      id: "main",
      name: "Main floor",
      width: 1200,
      height: 800,
      pixels_per_meter: 100,
      sensors: [
        {
          id: "radar",
          entity_prefix: "radar",
          x: 600,
          y: 700,
          heading: 0,
        },
      ],
    },
  ],
};

describe("Spatial Presence card", () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  it("registers the card and graphical editor", () => {
    expect(customElements.get("spatial-presence-card")).toBe(SpatialPresenceCard);
    expect(customElements.get("spatial-presence-card-editor")).toBe(
      SpatialPresenceCardEditor,
    );
    expect(SpatialPresenceCard.getConfigElement()).toBeInstanceOf(
      SpatialPresenceCardEditor,
    );
    const card = new SpatialPresenceCard();
    expect(card.getCardSize()).toBe(6);
    expect(card.getGridOptions()).toEqual({ rows: 6, columns: 12, min_rows: 4 });
  });

  it("rejects a configuration without floors", () => {
    const card = new SpatialPresenceCard();
    expect(() => card.setConfig({ ...config, floors: [] })).toThrow(
      "Add at least one floor",
    );
  });

  it("renders an LD2450 target and opens its radar inspector", async () => {
    const card = new SpatialPresenceCard();
    card.hass = {
      states: {
        "sensor.radar_target_1_x": {
          state: "250",
          attributes: { unit_of_measurement: "mm" },
        },
        "sensor.radar_target_1_y": {
          state: "2000",
          attributes: { unit_of_measurement: "mm" },
        },
      },
    };
    card.setConfig(config);
    document.body.append(card);
    await card.updateComplete;

    expect(card.renderRoot.querySelectorAll(".target")).toHaveLength(1);
    expect(card.renderRoot.querySelector(".target-halo")).not.toBeNull();
    const summary = card.renderRoot.textContent?.replace(/\s+/g, " ").trim();
    expect(summary).toContain("1 live target");
    expect(summary).toContain("1/1 radar online");
    const radar = card.renderRoot.querySelector<SVGGElement>("[data-sensor=radar]");
    expect(radar).not.toBeNull();
    radar?.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    await card.updateComplete;
    expect(card.renderRoot.querySelector(".inspector")).not.toBeNull();
  });

  it("guides radar calibration from placement to a live reference", async () => {
    const card = new SpatialPresenceCard();
    card.editorMode = true;
    card.hass = {
      states: {
        "sensor.radar_target_1_x": {
          state: "0",
          attributes: { unit_of_measurement: "mm" },
        },
        "sensor.radar_target_1_y": {
          state: "2000",
          attributes: { unit_of_measurement: "mm" },
        },
      },
    };
    card.setConfig(config);
    document.body.append(card);
    await card.updateComplete;

    card.renderRoot
      .querySelector<SVGGElement>("[data-sensor=radar]")
      ?.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    await card.updateComplete;
    const buttons = () => [...card.renderRoot.querySelectorAll("button")];
    buttons().find((button) => button.textContent?.includes("Calibrate placement"))?.click();
    await card.updateComplete;
    expect(card.renderRoot.textContent).toContain("Place the radar");

    buttons().find((button) => button.textContent?.includes("Radar is placed"))?.click();
    await card.updateComplete;
    expect(card.renderRoot.textContent).toContain("Mark the person’s location");
    expect(card.renderRoot.textContent).toContain("Target 1");
  });
});
