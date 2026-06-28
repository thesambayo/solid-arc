export type Status = "up" | "down" | "degraded" | "paused" | "pending";
export type Segment = Status | "nodata";
export type Method = "GET" | "POST" | "TCP" | "SSL";
export type Region = "multi" | "us-east" | "eu-west" | "ap-southeast";
export type Tag =
  | "production"
  | "marketing"
  | "internal"
  | "staging"
  | "legacy"
  | "partner"
  | "cert";

export interface Incident {
  id: string;
  publicId: string;
  monitorId: string;
  startedAt: string;
  resolvedAt?: string | null;
  cause: string;
  statusCode?: number | null;
}

export type IncidentState = "opened" | "recovered";

export interface IncidentEvent extends Incident {
  state: IncidentState;
}

export interface Monitor {
  id: string;
  name: string;
  url: string;
  method: Method;
  region: Region;
  interval: number;
  tag: Tag;
  alertsEnabled: boolean;
  segments: Segment[];
  latencyTrace: (number | null)[];
  status: Status;
  currentLatency: number | null;
  avgLatency: number;
  p95LatencyMs: number | null;
  uptime30d: number;
  incident: Incident | null;
  certExpires?: number | null;
  lastCheck: number;
}

export interface URLResult {
  monitorId: string;
  url: string;
  timestamp: string;
  latency: number; // nanoseconds
  statusCode: number;
  isUp: boolean;
  errorMessage?: string;
  incident?: IncidentEvent | null;
}

export type Accent = "indigo" | "teal" | "plum" | "forest" | "graphite";
export type Density = "comfortable" | "compact";
export type VizStyle = "bars" | "dots" | "sparkline";

export interface Tweaks {
  accent: Accent;
  density: Density;
  vizStyle: VizStyle;
  showTweaks: boolean;
  startInOnboarding: boolean;
}
