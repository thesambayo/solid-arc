import { createFileRoute } from "@tanstack/solid-router";
import { For } from "solid-js";

import { Ring, type RingTone } from "../../components/ui/ring";

export const Route = createFileRoute("/previews/ring")({
  component: RouteComponent,
});

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      <div class="flex flex-wrap items-center gap-6">{props.children}</div>
    </div>
  );
}

function Demo(props: { label: string; children: any }) {
  return (
    <div class="flex flex-col items-center gap-1.5">
      {props.children}
      <span class="font-mono text-sm text-muted-foreground">{props.label}</span>
    </div>
  );
}

// App policy, not a library concern: map an uptime % to a semantic tone.
// (99.9 = success SLA, 99 = warning, below = breach.)
function uptimeTone(value: number): RingTone {
  if (value >= 99.9) return "success";
  if (value >= 99) return "warning";
  return "destructive";
}

const UPTIMES = [100, 99.95, 99.5, 98, 75, 0];

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Ring</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Circular gauge built on the circular Progress primitives. Passes all
          Ark <code class="font-mono text-xs">Progress.Root</code> props
          through; adds <code class="font-mono text-xs">size</code>,{" "}
          <code class="font-mono text-xs">stroke</code>,{" "}
          <code class="font-mono text-xs">label</code>, and{" "}
          <code class="font-mono text-xs">tone</code>. Use{" "}
          <code class="font-mono text-xs">defaultValue={"{null}"}</code> for an
          indeterminate spinner.
        </p>
      </div>

      <Section title="Tones">
        <Demo label="brand">
          <Ring defaultValue={68} tone="brand" />
        </Demo>
        <Demo label="success">
          <Ring defaultValue={68} tone="success" />
        </Demo>
        <Demo label="warning">
          <Ring defaultValue={68} tone="warning" />
        </Demo>
        <Demo label="destructive">
          <Ring defaultValue={68} tone="destructive" />
        </Demo>
        <Demo label="foreground">
          <Ring defaultValue={68} tone="foreground" />
        </Demo>
        <Demo label="muted">
          <Ring defaultValue={68} tone="muted" />
        </Demo>
      </Section>

      <Section title="Uptime (tone derived by the app)">
        <For each={UPTIMES}>
          {(value) => (
            <Demo label={`${value}%`}>
              <Ring defaultValue={value} tone={uptimeTone(value)} />
            </Demo>
          )}
        </For>
      </Section>

      <Section title="With centered label">
        <Demo label="100">
          <Ring defaultValue={100} label size={48} stroke={5} tone="success" />
        </Demo>
        <Demo label="80">
          <Ring defaultValue={80} label size={48} stroke={5} tone="brand" />
        </Demo>
        <Demo label="42">
          <Ring
            defaultValue={42}
            label
            size={48}
            stroke={5}
            tone="destructive"
          />
        </Demo>
      </Section>

      <Section title="Indeterminate">
        <Demo label="defaultValue=null">
          <Ring defaultValue={null} size={48} stroke={5} />
        </Demo>
        <Demo label="tone=muted">
          <Ring defaultValue={null} size={48} stroke={5} tone="muted" />
        </Demo>
      </Section>

      <Section title="Sizes">
        <Demo label="22 × 3">
          <Ring defaultValue={99.95} size={22} stroke={3} tone="success" />
        </Demo>
        <Demo label="36 × 4 (default)">
          <Ring defaultValue={99.95} tone="success" />
        </Demo>
        <Demo label="56 × 6">
          <Ring defaultValue={99.95} size={56} stroke={6} tone="success" />
        </Demo>
        <Demo label="80 × 8">
          <Ring defaultValue={99.95} size={80} stroke={8} tone="success" />
        </Demo>
      </Section>
    </div>
  );
}
