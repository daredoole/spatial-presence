import { localTargetToFloor } from "./geometry";
import type {
  Floor,
  HassEntity,
  HomeAssistant,
  RadarRuntime,
  RadarSensor,
  RadarTarget,
} from "./types";

const TARGET_X = /^sensor\.(.+)_target_([1-9]\d*)_x$/;

export function discoverLd2450Prefixes(hass: HomeAssistant): string[] {
  const prefixes = new Set<string>();
  for (const entityId of Object.keys(hass.states)) {
    const match = TARGET_X.exec(entityId);
    if (!match) continue;
    const prefix = match[1];
    const index = match[2];
    if (prefix && index && hass.states[`sensor.${prefix}_target_${index}_y`]) {
      prefixes.add(prefix);
    }
  }
  return [...prefixes].sort();
}

export function unassignedLd2450Prefixes(
  hass: HomeAssistant,
  floors: Floor[],
): string[] {
  const assigned = new Set(
    floors.flatMap((floor) =>
      (floor.sensors ?? []).map((sensor) => sensor.entity_prefix ?? sensor.id),
    ),
  );
  return discoverLd2450Prefixes(hass).filter((prefix) => !assigned.has(prefix));
}

export function discoveredRadarForFloor(
  prefix: string,
  floor: Floor,
): RadarSensor {
  return {
    id: prefix,
    name: friendlyPrefix(prefix),
    entity_prefix: prefix,
    x: floor.width / 2,
    y: floor.height * 0.85,
    heading: 0,
    range_m: 6,
    fov_degrees: 120,
    mount: "wall",
  };
}

export function runtimeForFloor(
  hass: HomeAssistant,
  floor: Floor,
  now = Date.now(),
): RadarRuntime[] {
  return (floor.sensors ?? []).map((sensor) =>
    runtimeForSensor(hass, floor, sensor, now),
  );
}

function runtimeForSensor(
  hass: HomeAssistant,
  floor: Floor,
  sensor: RadarSensor,
  now: number,
): RadarRuntime {
  const prefix = sensor.entity_prefix ?? sensor.id;
  const targets: RadarTarget[] = [];

  for (let index = 1; index <= 9; index += 1) {
    const xEntity = hass.states[`sensor.${prefix}_target_${index}_x`];
    const yEntity = hass.states[`sensor.${prefix}_target_${index}_y`];
    if (!xEntity || !yEntity) continue;
    const localXmm = stateToMillimetres(xEntity);
    const localYmm = stateToMillimetres(yEntity);
    const speedMmPerSecond = stateToMillimetresPerSecond(
      hass.states[`sensor.${prefix}_target_${index}_speed`],
    );
    if (localXmm === undefined || localYmm === undefined) continue;
    if (localXmm === 0 && localYmm === 0) continue;

    targets.push({
      id: `${floor.id}:${sensor.id}:${index}`,
      floorId: floor.id,
      sensorId: sensor.id,
      sensorName: sensor.name ?? friendlyPrefix(prefix),
      index,
      localXmm,
      localYmm,
      ...(speedMmPerSecond === undefined ? {} : { speedMmPerSecond }),
      floorPoint: localTargetToFloor(
        sensor,
        localXmm,
        localYmm,
        floor.pixels_per_meter,
      ),
      updatedAt: now,
    });
  }

  const temperature = numericState(hass.states[`sensor.${prefix}_temperature`]);
  const humidity = numericState(hass.states[`sensor.${prefix}_humidity`]);
  return {
    sensor,
    targets,
    ...(temperature === undefined ? {} : { temperature }),
    ...(humidity === undefined ? {} : { humidity }),
    online: sensorOnline(hass, prefix),
    discovered: false,
  };
}

function sensorOnline(hass: HomeAssistant, prefix: string): boolean {
  const status =
    hass.states[`binary_sensor.${prefix}_online`] ??
    hass.states[`binary_sensor.${prefix}_status`];
  if (status) return status.state === "on";
  const presence = hass.states[`binary_sensor.${prefix}_presence`];
  return presence ? !["unavailable", "unknown"].includes(presence.state) : true;
}

function stateToMillimetres(entity: HassEntity): number | undefined {
  const value = numericState(entity);
  if (value === undefined) return undefined;
  const unit = String(entity.attributes.unit_of_measurement ?? "mm").toLowerCase();
  if (unit === "m") return value * 1000;
  if (unit === "cm") return value * 10;
  if (unit === "in") return value * 25.4;
  if (unit === "ft") return value * 304.8;
  return value;
}

function stateToMillimetresPerSecond(entity: HassEntity | undefined): number | undefined {
  if (!entity) return undefined;
  const value = numericState(entity);
  if (value === undefined) return undefined;
  const unit = String(entity.attributes.unit_of_measurement ?? "mm/s").toLowerCase();
  if (unit === "m/s") return value * 1000;
  if (unit === "cm/s") return value * 10;
  if (unit === "in/s") return value * 25.4;
  if (unit === "ft/s") return value * 304.8;
  if (unit === "mph") return value * 447.04;
  return value;
}

function numericState(entity: HassEntity | undefined): number | undefined {
  if (!entity || ["unknown", "unavailable"].includes(entity.state)) return undefined;
  const value = Number(entity.state);
  return Number.isFinite(value) ? value : undefined;
}

function friendlyPrefix(prefix: string): string {
  return prefix
    .split("_")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}
