export interface HassEntity {
  state: string;
  attributes: Record<string, unknown> & {
    friendly_name?: string;
    unit_of_measurement?: string;
  };
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  locale?: { language: string };
  callWS?: <T>(message: Record<string, unknown>) => Promise<T>;
}

export interface Point {
  x: number;
  y: number;
}

export interface PathFeature {
  id: string;
  name?: string;
  area_id?: string;
  kind?: "detection" | "exclusion" | "entrance" | "stationary";
  points: Point[];
}

export interface RadarSensor {
  id: string;
  name?: string;
  entity_prefix?: string;
  x: number;
  y: number;
  heading: number;
  range_m?: number;
  fov_degrees?: number;
  mount?: "wall" | "ceiling";
}

export interface Floor {
  id: string;
  name: string;
  width: number;
  height: number;
  pixels_per_meter: number;
  background?: string;
  walls?: PathFeature[];
  rooms?: PathFeature[];
  zones?: PathFeature[];
  sensors?: RadarSensor[];
}

export interface SpatialPresenceConfig {
  type: string;
  title?: string;
  schema_version?: "0.1";
  floors: Floor[];
  default_floor?: string;
  auto_discover?: boolean;
  target_trail_seconds?: number;
  backend_map_id?: string;
}

export interface RadarTarget {
  id: string;
  sensorId: string;
  sensorName: string;
  index: number;
  localXmm: number;
  localYmm: number;
  floorPoint: Point;
  updatedAt: number;
}

export interface RadarRuntime {
  sensor: RadarSensor;
  targets: RadarTarget[];
  temperature?: number;
  humidity?: number;
  online: boolean;
  discovered: boolean;
}

export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}
