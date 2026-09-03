import type {
  Floor,
  PathFeature,
  Point,
  RadarSensor,
  SpatialPresenceConfig,
} from "./types";

export interface ConversionResult {
  map: Omit<SpatialPresenceConfig, "type">;
  warnings: string[];
}

interface EasyWall {
  id?: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}

interface EasyArea {
  id?: string;
  name?: string;
  haArea?: string;
  points?: unknown;
}

interface EasyFloor {
  id?: string;
  name?: string;
  image?: string;
  walls?: EasyWall[];
  areas?: EasyArea[];
  openings?: unknown[];
  items?: unknown[];
  texts?: unknown[];
  furniture?: unknown[];
  trackers?: unknown[];
}

interface EasyConfig extends EasyFloor {
  title?: string;
  width?: number;
  height?: number;
  defaultFloor?: string;
  floors?: EasyFloor[];
}

/** Import Easy Floorplan's public card configuration without copying UI code. */
export function importEasyFloorplan(
  input: unknown,
  pixelsPerMeter = 100,
): ConversionResult {
  if (!isRecord(input)) throw new Error("Easy Floorplan configuration must be an object");
  const source = input as EasyConfig;
  const width = positive(source.width, 1000);
  const height = positive(source.height, 700);
  const easyFloors = Array.isArray(source.floors) && source.floors.length
    ? source.floors
    : [source];
  const warnings: string[] = [];
  const usedIds = new Set<string>();
  const floors = easyFloors.map((easyFloor, index) => {
    const id = uniqueSlug(easyFloor.id ?? `floor-${index + 1}`, usedIds);
    const wallIds = new Set<string>();
    const roomIds = new Set<string>();
    const walls = (easyFloor.walls ?? []).flatMap((wall, wallIndex) => {
      if (![wall.x1, wall.y1, wall.x2, wall.y2].every(finite)) {
        warnings.push(`${id}: skipped wall ${wall.id ?? wallIndex + 1} with invalid coordinates`);
        return [];
      }
      return [{
        id: uniqueSlug(String(wall.id ?? `wall-${wallIndex + 1}`), wallIds),
        points: [
          { x: Number(wall.x1), y: Number(wall.y1) },
          { x: Number(wall.x2), y: Number(wall.y2) },
        ],
      }];
    });
    const rooms = (easyFloor.areas ?? []).flatMap((area, areaIndex) => {
      const points = normalizePoints(area.points);
      if (points.length < 3) {
        warnings.push(`${id}: skipped area ${area.id ?? areaIndex + 1} with fewer than three points`);
        return [];
      }
      return [{
        id: uniqueSlug(String(area.id ?? `room-${areaIndex + 1}`), roomIds),
        ...(area.name ? { name: area.name } : {}),
        ...(area.haArea ? { area_id: area.haArea } : {}),
        points,
      }];
    });
    for (const key of ["openings", "items", "texts", "furniture", "trackers"] as const) {
      const count = easyFloor[key]?.length ?? 0;
      if (count) warnings.push(`${id}: ${count} ${key} retained only by Easy Floorplan`);
    }
    return {
      id,
      name: easyFloor.name ?? `Floor ${index + 1}`,
      width,
      height,
      pixels_per_meter: positive(pixelsPerMeter, 100),
      ...(safeImage(easyFloor.image) ? { background: easyFloor.image } : {}),
      walls,
      rooms,
      zones: [],
      sensors: [],
    } satisfies Floor;
  });
  warnings.unshift("Easy Floorplan has no physical scale; verify pixels per metre after import");
  const defaultIndex = easyFloors.findIndex(
    (floor) => floor.id === source.defaultFloor,
  );
  const defaultFloor = floors[Math.max(0, defaultIndex)]?.id ?? floors[0]!.id;
  return {
    map: {
      schema_version: "0.1",
      title: source.title ?? "Imported Easy Floorplan",
      default_floor: defaultFloor,
      auto_discover: true,
      target_trail_seconds: 8,
      floors,
    },
    warnings,
  };
}

/** Export architectural geometry to Easy Floorplan's documented config shape. */
export function exportEasyFloorplan(map: ConversionResult["map"]): Record<string, unknown> {
  const first = map.floors[0];
  if (!first) throw new Error("Spatial map has no floors");
  return {
    type: "custom:easy-floorplan-card",
    title: map.title,
    width: first.width,
    height: first.height,
    defaultFloor: map.default_floor,
    floors: map.floors.map((floor) => ({
      id: floor.id,
      name: floor.name,
      ...(floor.background ? { image: floor.background, imageFit: "contain" } : {}),
      walls: (floor.walls ?? []).flatMap((wall) =>
        wall.points.slice(0, -1).map((start, index) => {
          const end = wall.points[index + 1]!;
          return {
            id: `${wall.id}-${index + 1}`,
            x1: start.x,
            y1: start.y,
            x2: end.x,
            y2: end.y,
          };
        }),
      ),
      areas: (floor.rooms ?? []).map((room) => ({
        id: room.id,
        name: room.name,
        haArea: room.area_id,
        points: room.points,
      })),
      openings: [],
      items: [],
      texts: [],
      furniture: [],
      trackers: [],
    })),
  };
}

/** Import Radar Map Manager's version-1 backup format as percentage geometry. */
export function importRadarMapManager(input: unknown): ConversionResult {
  if (!isRecord(input)) throw new Error("Radar Map Manager backup must be an object");
  const candidateMaps = isRecord(input.maps) ? input.maps : {};
  const maps = Object.keys(candidateMaps).length ? candidateMaps : { default: {} };
  const radars = isRecord(input.radars) ? input.radars : {};
  const warnings = [
    "Radar Map Manager uses percentage coordinates; verify floor scale and background alignment",
    "Fusion and smoothing settings stay in Radar Map Manager and are not imported",
  ];
  const usedFloorIds = new Set<string>();
  const floors = Object.entries(maps).map(([mapGroup, rawMap], floorIndex) => {
    const mapData = isRecord(rawMap) ? rawMap : {};
    const config = isRecord(mapData.config) ? mapData.config : {};
    const width = 1000;
    const height = 1000;
    const usedSensorIds = new Set<string>();
    const sensors: RadarSensor[] = Object.entries(radars).flatMap(([name, rawRadar]) => {
      if (!isRecord(rawRadar) || String(rawRadar.map_group ?? "default") !== mapGroup) return [];
      const layout = isRecord(rawRadar.layout) ? rawRadar.layout : {};
      const scaleX = positive(layout.scale_x, 5);
      const scaleY = positive(layout.scale_y, 5);
      if (Math.abs(scaleX - scaleY) > 0.01) {
        warnings.push(`${mapGroup}/${name}: non-uniform RMM scale requires manual calibration`);
      }
      if (Array.isArray(rawRadar.monitor_zones) && rawRadar.monitor_zones.length) {
        warnings.push(`${mapGroup}/${name}: radar-local monitor zones require manual review`);
      }
      return [{
        id: uniqueSlug(name, usedSensorIds),
        name,
        entity_prefix: slug(name),
        x: percent(layout.origin_x, 50) * width,
        y: percent(layout.origin_y, 50) * height,
        heading: finite(layout.rotation) ? Number(layout.rotation) : 0,
        range_m: 6,
        fov_degrees: 120,
        mount: layout.ceiling_mount ? "ceiling" : "wall",
      }];
    });
    const zoneRoot = isRecord(mapData.zones) ? mapData.zones : {};
    const zoneKinds = [
      ["include_zones", "detection"],
      ["exclude_zones", "exclusion"],
      ["entrance_zones", "entrance"],
      ["stationary_zones", "stationary"],
    ] as const;
    const zones = zoneKinds.flatMap(([key, kind]) =>
      normalizeRmmZones(zoneRoot[key], key, width, height, kind, warnings),
    );
    const background = [config.bg_image, config.background_image, config.background]
      .find((value) => safeImage(value));
    return {
      id: uniqueSlug(mapGroup || `floor-${floorIndex + 1}`, usedFloorIds),
      name: mapGroup === "default" ? "Main floor" : mapGroup,
      width,
      height,
      pixels_per_meter: 100,
      ...(typeof background === "string" ? { background } : {}),
      walls: [],
      rooms: [],
      zones,
      sensors,
    } satisfies Floor;
  });
  return {
    map: {
      schema_version: "0.1",
      title: "Imported Radar Map Manager map",
      auto_discover: true,
      target_trail_seconds: 8,
      floors,
    },
    warnings,
  };
}

function normalizeRmmZones(
  candidate: unknown,
  sourceName: string,
  width: number,
  height: number,
  kind: NonNullable<PathFeature["kind"]>,
  warnings: string[],
): PathFeature[] {
  if (!Array.isArray(candidate)) return [];
  return candidate.flatMap((raw, index) => {
    const value = isRecord(raw) && Array.isArray(raw.points) ? raw.points : raw;
    const points = normalizePoints(value).map((point) => ({
      x: Math.abs(point.x) <= 100 ? (point.x / 100) * width : point.x,
      y: Math.abs(point.y) <= 100 ? (point.y / 100) * height : point.y,
    }));
    if (points.length < 3) {
      warnings.push(`${sourceName}[${index}]: skipped zone with fewer than three points`);
      return [];
    }
    return [{
      id: `${sourceName}-${index + 1}`,
      name: isRecord(raw) && typeof raw.name === "string" ? raw.name : `${kind} ${index + 1}`,
      kind,
      points,
    }];
  });
}

function normalizePoints(candidate: unknown): Point[] {
  if (!Array.isArray(candidate)) return [];
  return candidate.flatMap((raw) => {
    if (Array.isArray(raw) && finite(raw[0]) && finite(raw[1])) {
      return [{ x: Number(raw[0]), y: Number(raw[1]) }];
    }
    if (isRecord(raw) && finite(raw.x) && finite(raw.y)) {
      return [{ x: Number(raw.x), y: Number(raw.y) }];
    }
    return [];
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function finite(value: unknown): boolean {
  return typeof value === "number" && Number.isFinite(value);
}

function positive(value: unknown, fallback: number): number {
  return finite(value) && Number(value) > 0 ? Number(value) : fallback;
}

function percent(value: unknown, fallback: number): number {
  const number = finite(value) ? Number(value) : fallback;
  return Math.max(0, Math.min(100, number)) / 100;
}

function slug(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "") || "item";
}

function uniqueSlug(value: string, used: Set<string>): string {
  const base = slug(value);
  let result = base;
  let index = 2;
  while (used.has(result)) result = `${base}_${index++}`;
  used.add(result);
  return result;
}

function safeImage(value: unknown): value is string {
  return typeof value === "string" && /^(\/|https?:\/\/)/i.test(value.trim());
}
