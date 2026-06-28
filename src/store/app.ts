import { createEffect, createRoot, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import type { Accent, Incident, Monitor, Tweaks, URLResult } from "../types";

// RawMonitor is the full backend monitor shape (GET /monitors/{id}) used to
// pre-fill the edit form. timeout/interval are nanoseconds (Go time.Duration);
// headers is http.Header (key → values array).
export interface RawMonitor {
  public_id: string;
  url: string;
  name: string;
  method: Monitor["method"];
  body?: string;
  headers?: Record<string, string[]> | null;
  timeout: number;
  interval: number;
  keyword_contains?: string;
  keyword_not_contains?: string;
  alerts_enabled: boolean;
}

const TWEAK_DEFAULTS: Tweaks = {
  accent: "indigo",
  density: "comfortable",
  vizStyle: "bars",
  showTweaks: false,
  startInOnboarding: false,
};

export const ACCENTS: Record<Accent, { h: number; label: string; c?: number }> =
  {
    indigo: { h: 268, label: "Indigo" },
    teal: { h: 195, label: "Teal" },
    plum: { h: 330, label: "Plum" },
    forest: { h: 155, label: "Forest" },
    graphite: { h: 80, label: "Graphite", c: 0.005 },
  };

function loadTweaks(): Tweaks {
  try {
    const raw = localStorage.getItem("argus_tweaks");
    if (raw)
      return { ...TWEAK_DEFAULTS, ...(JSON.parse(raw) as Partial<Tweaks>) };
  } catch {
    /* noop */
  }
  return TWEAK_DEFAULTS;
}

function computeTrace(
  results: URLResult[],
): Pick<Monitor, "segments" | "latencyTrace"> {
  const sorted = [...results].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  const recent = sorted.slice(-60);
  const padCount = Math.max(0, 60 - recent.length);

  const segments = [
    ...new Array(padCount).fill("nodata"),
    ...recent.map((r) => (r.isUp ? "up" : "down")),
  ] as Monitor["segments"];

  const latencyTrace = [
    ...new Array(padCount).fill(null),
    ...recent.map((r) => Math.round(r.latency / 1_000_000)),
  ] as Monitor["latencyTrace"];

  return { segments, latencyTrace };
}

// A freshly-created monitor has no history yet — render it as "pending" with an
// empty trace until the first check arrives over SSE.
function pendingStub(m: {
  public_id: string;
  name: string;
  url: string;
  method: Monitor["method"];
}): Monitor {
  return {
    id: m.public_id,
    name: m.name,
    url: m.url,
    method: m.method ?? "GET",
    interval: 0,
    region: "multi",
    tag: "production",
    segments: new Array(60).fill("nodata") as Monitor["segments"],
    latencyTrace: new Array(60).fill(null) as Monitor["latencyTrace"],
    status: "pending",
    alertsEnabled: true,
    currentLatency: null,
    avgLatency: 0,
    p95LatencyMs: null,
    uptime30d: 0,
    incident: null,
    lastCheck: 0,
  };
}

// POST a monitor to the backend, returning a pending stub on success or null on
// failure. Shared by the "New monitor" flow and onboarding.
async function createMonitorRequest(input: {
  name: string;
  url: string;
  method: Monitor["method"];
  interval: string;
}): Promise<Monitor | null> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/monitors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: input.name,
      url: input.url,
      method: input.method,
      interval: input.interval,
      timeout: "30s",
      body: "",
      headers: {},
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    monitor: {
      public_id: string;
      name: string;
      url: string;
      method: Monitor["method"];
    };
  };
  return pendingStub(data.monitor);
}

// Monitors always start empty; the dashboard hydrates them from the backend
// via fetchMonitors() on mount. No client-side seed data.
const [monitors, setMonitors] = createStore<Monitor[]>([]);
const [tweaks, setTweaksRaw] = createStore<Tweaks>(loadTweaks());

const [openMonitorId, setOpenMonitorId] = createSignal<string | null>(null);
const [newMonitorOpen, setNewMonitorOpen] = createSignal(false);
const [editMonitorId, setEditMonitorId] = createSignal<string | null>(null);
const [cmdKOpen, setCmdKOpen] = createSignal(false);
const [tweaksOpen, setTweaksOpen] = createSignal(false);

// Apply tweaks to <html> + persist. createRoot so the effect has an owner
// (the store is a module-level singleton; this root lives for the page lifetime).
createRoot(() => {
  createEffect(() => {
    const accent = ACCENTS[tweaks.accent] ?? ACCENTS.indigo;
    const c = accent.c != null ? accent.c : 0.16;
    const root = document.documentElement;
    root.style.setProperty("--accent", `oklch(55% ${c} ${accent.h})`);
    root.style.setProperty("--accent-ink", `oklch(46% ${c} ${accent.h})`);
    root.style.setProperty(
      "--accent-soft",
      `oklch(96% ${c * 0.2} ${accent.h})`,
    );
    root.dataset.density = tweaks.density;
    try {
      localStorage.setItem("argus_tweaks", JSON.stringify(tweaks));
    } catch {
      /* noop */
    }
  });
});

export const app = {
  // state getters
  monitors,
  tweaks,
  openMonitorId,
  newMonitorOpen,
  editMonitorId,
  cmdKOpen,
  tweaksOpen,

  // derived
  openMonitor: (): Monitor | null =>
    monitors.find((m) => m.id === openMonitorId()) ?? null,
  openIncidentCount: (): number =>
    monitors.reduce((n, m) => (m.incident ? n + 1 : n), 0),

  // setters
  openMonitorById: setOpenMonitorId,
  closeMonitor: () => setOpenMonitorId(null),
  openNewMonitor: () => setNewMonitorOpen(true),
  closeNewMonitor: () => setNewMonitorOpen(false),
  openEditMonitor: (id: string) => setEditMonitorId(id),
  closeEditMonitor: () => setEditMonitorId(null),
  openCmdK: () => setCmdKOpen(true),
  closeCmdK: () => setCmdKOpen(false),
  toggleCmdK: () => setCmdKOpen((v) => !v),
  openTweaks: () => setTweaksOpen(true),
  closeTweaks: () => setTweaksOpen(false),

  patchTweaks(patch: Partial<Tweaks>) {
    setTweaksRaw(patch);
  },

  resetOnboarding() {
    setMonitors([]);
    try {
      localStorage.setItem("argus_onboarded", "reset");
    } catch {
      /* noop */
    }
  },

  // Persist each onboarding monitor to the backend, then seed the store with
  // pending stubs. The dashboard's fetchMonitors() on mount hydrates the rest
  // (results, incidents, stats). Failed creates are skipped.
  async completeOnboarding(payload: {
    monitors: {
      name: string;
      url: string;
      method?: Monitor["method"];
      interval?: number;
    }[];
    channels: string[];
  }) {
    const created = await Promise.all(
      payload.monitors.map((m) =>
        createMonitorRequest({
          name: m.name,
          url: m.url,
          method: m.method ?? "GET",
          interval: `${m.interval ?? 60}s`,
        }),
      ),
    );
    setMonitors(created.filter((m): m is Monitor => m !== null));
    try {
      localStorage.removeItem("argus_onboarded");
    } catch {
      /* noop */
    }
  },

  skipOnboarding() {
    setMonitors([]);
    try {
      localStorage.removeItem("argus_onboarded");
    } catch {
      /* noop */
    }
  },

  async createMonitor(input: {
    name: string;
    url: string;
    method: Monitor["method"];
    interval: string;
  }) {
    const stub = await createMonitorRequest(input);
    if (stub) setMonitors((list) => [stub, ...list]);
  },

  async getMonitorForEdit(id: string): Promise<RawMonitor> {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/monitors/${id}`);
    if (!res.ok) throw new Error("failed to load monitor");
    const data = (await res.json()) as { monitor: RawMonitor };
    return data.monitor;
  },

  async updateMonitor(
    id: string,
    payload: {
      name: string;
      url: string;
      method: Monitor["method"];
      interval: string;
      timeout: string;
      body: string;
      headers: Record<string, string>;
      keyword_contains: string;
      keyword_not_contains: string;
      alerts_enabled: boolean;
    },
  ) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/monitors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { message?: string };
      throw new Error(err.message || "update failed");
    }
    const data = (await res.json()) as {
      monitor: {
        public_id: string;
        name: string;
        url: string;
        method: Monitor["method"];
        alerts_enabled: boolean;
      };
    };
    const m = data.monitor;
    setMonitors(
      (x) => x.id === id,
      (x) => ({
        ...x,
        name: m.name,
        url: m.url,
        method: m.method ?? "GET",
        alertsEnabled: m.alerts_enabled,
      }),
    );
  },

  async fetchMonitors() {
    const [monitorsRes, resultsRes, incidentsRes] = await Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/monitors`),
      fetch(`${import.meta.env.VITE_API_URL}/results`),
      fetch(`${import.meta.env.VITE_API_URL}/incidents`),
    ]);

    const { monitors: rawMonitors = [] } = (await monitorsRes.json()) as {
      monitors: {
        public_id: string;
        name: string;
        url: string;
        method: Monitor["method"];
        avg_latency_ms: number | null;
        p95_latency_ms: number | null;
        uptime_percent: number | null;
        current_latency_ms: number | null;
        is_up: boolean | null;
        alerts_enabled: boolean;
      }[];
    };
    const { results: rawResults = [] } = (await resultsRes.json()) as {
      results: URLResult[];
    };
    const { incidents: rawIncidents = [] } = (await incidentsRes.json()) as {
      incidents: Incident[];
    };

    const resultsByMonitor = rawResults.reduce<Record<string, URLResult[]>>(
      (acc, r) => {
        (acc[r.monitorId] ??= []).push(r);
        return acc;
      },
      {},
    );

    const openIncidentByMonitor = rawIncidents.reduce<Record<string, Incident>>(
      (acc, i) => {
        if (!i.resolvedAt) acc[i.monitorId] = i;
        return acc;
      },
      {},
    );

    const hydrated: Monitor[] = rawMonitors.map((m) => {
      const status: Monitor["status"] =
        m.is_up == null ? "pending" : m.is_up ? "up" : "down";
      return {
        id: m.public_id,
        name: m.name,
        url: m.url,
        method: m.method ?? "GET",
        interval: 0,
        region: "multi",
        tag: "production",
        alertsEnabled: m.alerts_enabled,
        incident: openIncidentByMonitor[m.public_id] ?? null,
        lastCheck: 0,
        status,
        currentLatency: m.current_latency_ms,
        avgLatency: m.avg_latency_ms ?? 0,
        p95LatencyMs: m.p95_latency_ms,
        uptime30d: m.uptime_percent ?? 0,
        ...computeTrace(resultsByMonitor[m.public_id] ?? []),
      };
    });

    setMonitors(hydrated);
  },

  connectSSE() {
    const es = new EventSource(`${import.meta.env.VITE_API_URL}/events`);
    es.onmessage = (event: MessageEvent) => {
      const result = JSON.parse(event.data as string) as URLResult;
      const latencyMs = Math.round(result.latency / 1_000_000);
      const status: Monitor["status"] = result.isUp ? "up" : "down";

      setMonitors(
        (m) => m.id === result.monitorId,
        (m) => {
          const patch: Partial<Monitor> = {
            status,
            currentLatency: latencyMs,
            avgLatency:
              m.avgLatency === 0
                ? latencyMs
                : Math.round((m.avgLatency + latencyMs) / 2),
            segments: [...m.segments.slice(1), status] as Monitor["segments"],
            latencyTrace: [...m.latencyTrace.slice(1), latencyMs],
            lastCheck: Date.now(),
          };

          if (result.incident?.state === "opened") {
            patch.incident = result.incident;
          } else if (result.incident?.state === "recovered") {
            patch.incident = null;
          }

          return patch;
        },
      );
    };
    return es;
  },
};
