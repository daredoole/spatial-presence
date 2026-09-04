// @vitest-environment happy-dom

import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  SpatialPresenceCard,
  SpatialPresenceCardEditor,
} from "../src/spatial-presence-card";
import type { HomeAssistant, SpatialPresenceConfig } from "../src/types";

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

  it("fills a dashboard viewport without restoring the old half-page cap", () => {
    const styles = SpatialPresenceCard.styles.cssText;
    expect(styles).toContain("100dvh - var(--header-height, 56px)");
    expect(styles).not.toContain("64dvh");
    expect(styles).not.toContain("680px");
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
        "sensor.radar_target_1_speed": {
          state: "12",
          attributes: { unit_of_measurement: "in/s" },
        },
      },
    };
    card.setConfig(config);
    document.body.append(card);
    await card.updateComplete;

    expect(card.renderRoot.querySelectorAll(".target")).toHaveLength(1);
    expect(card.renderRoot.querySelector(".target-halo")).not.toBeNull();
    expect(card.renderRoot.querySelector(".person-body")).not.toBeNull();
    expect(card.renderRoot.querySelector(".target")?.getAttribute("data-motion")).toBe(
      "moving",
    );
    expect(card.renderRoot.querySelector(".target")?.getAttribute("aria-label")).toContain(
      "0.3 metres per second",
    );
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

  it("shows only radars and people assigned to the selected floor", async () => {
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
    card.setConfig({
      ...config,
      auto_discover: true,
      default_floor: "main",
      floors: [
        config.floors[0]!,
        {
          id: "upstairs",
          name: "Upstairs",
          width: 1000,
          height: 700,
          pixels_per_meter: 100,
          sensors: [],
        },
      ],
    });
    document.body.append(card);
    await card.updateComplete;

    expect(card.renderRoot.querySelectorAll(".sensor")).toHaveLength(1);
    expect(card.renderRoot.querySelectorAll(".target")).toHaveLength(1);
    card.hass = {
      states: {
        "sensor.radar_target_1_x": {
          state: "300",
          attributes: { unit_of_measurement: "mm" },
        },
        "sensor.radar_target_1_y": {
          state: "1900",
          attributes: { unit_of_measurement: "mm" },
        },
      },
    };
    await card.updateComplete;
    await card.updateComplete;
    expect(card.renderRoot.querySelectorAll(".trail")).toHaveLength(1);

    const floor = card.renderRoot.querySelector<HTMLSelectElement>(".floor-select select")!;
    floor.value = "upstairs";
    floor.dispatchEvent(new Event("change", { bubbles: true }));
    await card.updateComplete;

    expect(card.renderRoot.querySelectorAll(".sensor")).toHaveLength(0);
    expect(card.renderRoot.querySelectorAll(".target")).toHaveLength(0);
    expect(card.renderRoot.querySelectorAll(".trail")).toHaveLength(0);
    expect(card.renderRoot.textContent).toContain("No radar placed on Upstairs");
  });

  it("places an unassigned discovered radar only on the chosen floor", async () => {
    const card = new SpatialPresenceCard();
    card.hass = {
      states: {
        "sensor.kitchen_target_1_x": {
          state: "100",
          attributes: { unit_of_measurement: "mm" },
        },
        "sensor.kitchen_target_1_y": {
          state: "1000",
          attributes: { unit_of_measurement: "mm" },
        },
      },
    };
    card.setConfig({
      ...config,
      auto_discover: true,
      backend_map_id: "house",
      floors: [
        { ...config.floors[0]!, sensors: [] },
        {
          id: "upstairs",
          name: "Upstairs",
          width: 1000,
          height: 700,
          pixels_per_meter: 100,
          sensors: [],
        },
      ],
    });
    document.body.append(card);
    await card.updateComplete;
    expect(card.renderRoot.querySelectorAll(".sensor")).toHaveLength(0);

    card.renderRoot.querySelector<HTMLButtonElement>(".edit-layout")?.click();
    await card.updateComplete;
    expect(card.renderRoot.textContent).toContain("Unplaced radars");
    [...card.renderRoot.querySelectorAll("button")]
      .find((button) => button.textContent?.includes("Place Kitchen"))
      ?.click();
    await card.updateComplete;

    expect(card.renderRoot.querySelectorAll(".sensor")).toHaveLength(1);
    expect(card.renderRoot.querySelectorAll(".target")).toHaveLength(1);
    expect(card.renderRoot.textContent).not.toContain("Unplaced radars");
  });

  it("supports direct drag placement, undo, redo and persistent save", async () => {
    const messages: Record<string, unknown>[] = [];
    const callWS = vi.fn(async (message: Record<string, unknown>) => {
      messages.push(message);
      if (message.type === "spatial_presence/map/get") {
        throw new Error("Map does not exist");
      }
      return { revision: 1 };
    }) as unknown as NonNullable<HomeAssistant["callWS"]>;
    const card = new SpatialPresenceCard();
    card.hass = { states: {}, callWS };
    card.setConfig({ ...config, backend_map_id: "house" });
    document.body.append(card);
    await card.updateComplete;

    card.renderRoot.querySelector<HTMLButtonElement>(".edit-layout")?.click();
    await card.updateComplete;
    const map = card.renderRoot.querySelector<SVGSVGElement>("svg.map")!;
    Object.defineProperty(map, "getBoundingClientRect", {
      value: () => ({
        left: 0,
        top: 0,
        right: 1200,
        bottom: 800,
        width: 1200,
        height: 800,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    });
    map.setPointerCapture = vi.fn();
    map.hasPointerCapture = vi.fn(() => true);
    map.releasePointerCapture = vi.fn();

    const radar = card.renderRoot.querySelector<SVGGElement>("[data-sensor=radar]")!;
    radar.dispatchEvent(new PointerEvent("pointerdown", {
      bubbles: true,
      clientX: 600,
      clientY: 700,
      pointerId: 1,
    }));
    map.dispatchEvent(new PointerEvent("pointermove", {
      bubbles: true,
      clientX: 700,
      clientY: 600,
      pointerId: 1,
    }));
    map.dispatchEvent(new PointerEvent("pointerup", {
      bubbles: true,
      clientX: 700,
      clientY: 600,
      pointerId: 1,
    }));
    await card.updateComplete;
    expect(card.renderRoot.querySelector("[data-sensor=radar]")?.getAttribute("transform"))
      .toContain("translate(700 600)");

    [...card.renderRoot.querySelectorAll("button")]
      .find((button) => button.textContent?.trim() === "Undo")
      ?.click();
    await card.updateComplete;
    expect(card.renderRoot.querySelector("[data-sensor=radar]")?.getAttribute("transform"))
      .toContain("translate(600 700)");

    [...card.renderRoot.querySelectorAll("button")]
      .find((button) => button.textContent?.trim() === "Redo")
      ?.click();
    await card.updateComplete;
    [...card.renderRoot.querySelectorAll("button")]
      .find((button) => button.textContent?.trim() === "Save layout")
      ?.click();
    await vi.waitFor(() => {
      expect(messages.some((message) => message.type === "spatial_presence/map/save"))
        .toBe(true);
    });
    const save = messages.find((message) => message.type === "spatial_presence/map/save")!;
    const savedConfig = save.config as SpatialPresenceConfig;
    expect(savedConfig.floors[0]?.sensors?.[0]?.x).toBe(700);
    expect(savedConfig.floors[0]?.sensors?.[0]?.y).toBe(600);
  });

  it("supports accessible keyboard placement", async () => {
    const card = new SpatialPresenceCard();
    card.hass = { states: {} };
    card.setConfig({ ...config, backend_map_id: "house" });
    document.body.append(card);
    await card.updateComplete;
    card.renderRoot.querySelector<HTMLButtonElement>(".edit-layout")?.click();
    await card.updateComplete;

    const radar = card.renderRoot.querySelector<SVGGElement>("[data-sensor=radar]")!;
    radar.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await card.updateComplete;
    expect(card.renderRoot.querySelector("[data-sensor=radar]")?.getAttribute("transform"))
      .toContain("translate(605 700)");
  });

  it("unplaces a radar and returns it to the setup tray", async () => {
    const card = new SpatialPresenceCard();
    card.hass = {
      states: {
        "sensor.radar_target_1_x": {
          state: "250",
          attributes: { unit_of_measurement: "mm" },
        },
        "sensor.radar_target_1_y": {
          state: "1500",
          attributes: { unit_of_measurement: "mm" },
        },
      },
    };
    card.setConfig({ ...config, auto_discover: true, backend_map_id: "house" });
    document.body.append(card);
    await card.updateComplete;

    card.renderRoot.querySelector<HTMLButtonElement>(".edit-layout")?.click();
    await card.updateComplete;
    card.renderRoot
      .querySelector<SVGGElement>("[data-sensor=radar]")
      ?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1 }));
    await card.updateComplete;
    [...card.renderRoot.querySelectorAll("button")]
      .find((button) => button.textContent?.includes("Remove from this floor"))
      ?.click();
    await card.updateComplete;

    expect(card.renderRoot.querySelectorAll(".sensor")).toHaveLength(0);
    expect(card.renderRoot.querySelectorAll(".target")).toHaveLength(0);
    expect(card.renderRoot.textContent).toContain("Unplaced radars");
    expect(card.renderRoot.textContent).toContain("Place Radar");
  });

  it("moves radar ownership to another floor", async () => {
    const card = new SpatialPresenceCard();
    card.hass = { states: {} };
    card.setConfig({
      ...config,
      backend_map_id: "house",
      floors: [
        config.floors[0]!,
        {
          id: "upstairs",
          name: "Upstairs",
          width: 1000,
          height: 700,
          pixels_per_meter: 100,
          sensors: [],
        },
      ],
    });
    document.body.append(card);
    await card.updateComplete;

    card.renderRoot.querySelector<HTMLButtonElement>(".edit-layout")?.click();
    await card.updateComplete;
    card.renderRoot
      .querySelector<SVGGElement>("[data-sensor=radar]")
      ?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1 }));
    await card.updateComplete;
    const destination = card.renderRoot.querySelector<HTMLSelectElement>(".floor-control select")!;
    destination.value = "upstairs";
    destination.dispatchEvent(new Event("change", { bubbles: true }));
    await card.updateComplete;

    expect(card.renderRoot.querySelector<HTMLSelectElement>(".floor-select select")?.value)
      .toBe("upstairs");
    expect(card.renderRoot.querySelectorAll(".sensor")).toHaveLength(1);
    const floor = card.renderRoot.querySelector<HTMLSelectElement>(".floor-select select")!;
    floor.value = "main";
    floor.dispatchEvent(new Event("change", { bubbles: true }));
    await card.updateComplete;
    expect(card.renderRoot.querySelectorAll(".sensor")).toHaveLength(0);
  });
});
