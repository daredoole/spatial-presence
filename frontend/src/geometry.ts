import type { Point, RadarSensor, ViewBox } from "./types";

const DEG_TO_RAD = Math.PI / 180;

export function normalizeHeading(value: number): number {
  return ((value % 360) + 360) % 360;
}

export function localTargetToFloor(
  sensor: RadarSensor,
  localXmm: number,
  localYmm: number,
  pixelsPerMeter: number,
): Point {
  const scale = pixelsPerMeter / 1000;
  const localX = localXmm * scale;
  const localY = -localYmm * scale;
  const angle = normalizeHeading(sensor.heading) * DEG_TO_RAD;

  return {
    x: sensor.x + localX * Math.cos(angle) - localY * Math.sin(angle),
    y: sensor.y + localX * Math.sin(angle) + localY * Math.cos(angle),
  };
}

export function calibrateRadarFromReference(
  sensor: RadarSensor,
  localXmm: number,
  localYmm: number,
  reference: Point,
): { heading: number; pixelsPerMeter: number } | undefined {
  const localDistanceMm = Math.hypot(localXmm, localYmm);
  const floorDistance = Math.hypot(reference.x - sensor.x, reference.y - sensor.y);
  if (localDistanceMm < 100 || floorDistance < 1) return undefined;

  const localAngle = Math.atan2(-localYmm, localXmm);
  const floorAngle = Math.atan2(reference.y - sensor.y, reference.x - sensor.x);
  return {
    heading: normalizeHeading((floorAngle - localAngle) / DEG_TO_RAD),
    pixelsPerMeter: (floorDistance * 1000) / localDistanceMm,
  };
}

export function coverageSectorPath(
  sensor: RadarSensor,
  pixelsPerMeter: number,
  rangeFactor = 1,
): string {
  const radius = (sensor.range_m ?? 6) * pixelsPerMeter * rangeFactor;
  const halfFov = (sensor.fov_degrees ?? 120) / 2;
  const start = polarPoint(sensor, radius, -halfFov);
  const end = polarPoint(sensor, radius, halfFov);
  const largeArc = halfFov * 2 > 180 ? 1 : 0;

  return [
    `M ${round(sensor.x)} ${round(sensor.y)}`,
    `L ${round(start.x)} ${round(start.y)}`,
    `A ${round(radius)} ${round(radius)} 0 ${largeArc} 1 ${round(end.x)} ${round(end.y)}`,
    "Z",
  ].join(" ");
}

function polarPoint(
  sensor: RadarSensor,
  radius: number,
  offsetDegrees: number,
): Point {
  const angle = (sensor.heading + offsetDegrees - 90) * DEG_TO_RAD;
  return {
    x: sensor.x + radius * Math.cos(angle),
    y: sensor.y + radius * Math.sin(angle),
  };
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function zoomViewBox(
  view: ViewBox,
  anchor: Point,
  factor: number,
  bounds: { width: number; height: number },
): ViewBox {
  const nextWidth = clamp(view.width * factor, bounds.width * 0.08, bounds.width * 4);
  const nextHeight = clamp(
    view.height * factor,
    bounds.height * 0.08,
    bounds.height * 4,
  );
  const ratioX = (anchor.x - view.x) / view.width;
  const ratioY = (anchor.y - view.y) / view.height;

  return {
    x: anchor.x - ratioX * nextWidth,
    y: anchor.y - ratioY * nextHeight,
    width: nextWidth,
    height: nextHeight,
  };
}

export function pointsAttribute(points: Point[]): string {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

export function clientToFloorPoint(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  view: ViewBox,
): Point {
  return {
    x: view.x + ((clientX - rect.left) / rect.width) * view.width,
    y: view.y + ((clientY - rect.top) / rect.height) * view.height,
  };
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
