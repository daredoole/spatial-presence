import { describe, expect, it } from "vitest";

import {
  coverageSectorPath,
  localTargetToFloor,
  normalizeHeading,
  zoomViewBox,
} from "../src/geometry";
import type { RadarSensor } from "../src/types";

const sensor: RadarSensor = {
  id: "radar",
  x: 500,
  y: 600,
  heading: 0,
  range_m: 6,
  fov_degrees: 120,
};

describe("radar coordinate transforms", () => {
  it("maps forward to canvas up at zero heading", () => {
    expect(localTargetToFloor(sensor, 0, 2000, 100)).toEqual({
      x: 500,
      y: 400,
    });
  });

  it("rotates clockwise with the sensor heading", () => {
    const point = localTargetToFloor({ ...sensor, heading: 90 }, 0, 2000, 100);
    expect(point.x).toBeCloseTo(700);
    expect(point.y).toBeCloseTo(600);
  });

  it("keeps positive target x on sensor-right", () => {
    expect(localTargetToFloor(sensor, 1000, 0, 100)).toEqual({
      x: 600,
      y: 600,
    });
  });
});

describe("heading and view helpers", () => {
  it("normalizes negative and overflowing headings", () => {
    expect(normalizeHeading(-15)).toBe(345);
    expect(normalizeHeading(725)).toBe(5);
  });

  it("zooms around the requested anchor", () => {
    const result = zoomViewBox(
      { x: 0, y: 0, width: 1000, height: 500 },
      { x: 250, y: 125 },
      0.5,
      { width: 1000, height: 500 },
    );
    expect(result).toEqual({ x: 125, y: 62.5, width: 500, height: 250 });
  });

  it("produces a closed coverage sector", () => {
    const path = coverageSectorPath(sensor, 100);
    expect(path.startsWith("M 500 600 L")).toBe(true);
    expect(path.endsWith("Z")).toBe(true);
    expect(path).toContain("A 600 600");
  });
});

