import { createFileRoute } from "@tanstack/solid-router";
import { createSignal } from "solid-js";
import { For } from "solid-js";

import {
  Slider,
  SliderControl,
  SliderLabel,
  SliderMarker,
  SliderMarkerGroup,
  SliderThumb,
  SliderValueText,
} from "../../components/ui/slider";

export const Route = createFileRoute("/previews/slider")({
  component: RouteComponent,
});

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      {props.children}
    </div>
  );
}

function RouteComponent() {
  const [controlled, setControlled] = createSignal([40]);

  return (
    <div class="flex max-w-lg flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Slider</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          A range input where the user selects a value or range by dragging a
          thumb.
        </p>
      </div>

      {/* ── Default ───────────────────────────────────────────────────────── */}
      <Section title="Default">
        <Slider defaultValue={[40]}>
          <div class="flex justify-between">
            <SliderLabel>Volume</SliderLabel>
            <SliderValueText />
          </div>
          <SliderControl>
            <SliderThumb index={0} />
          </SliderControl>
        </Slider>
      </Section>

      {/* ── Range ─────────────────────────────────────────────────────────── */}
      <Section title="Range">
        <Slider defaultValue={[25, 75]}>
          <div class="flex justify-between">
            <SliderLabel>Price range</SliderLabel>
            <SliderValueText />
          </div>
          <SliderControl>
            <SliderThumb index={0} />
            <SliderThumb index={1} />
          </SliderControl>
        </Slider>
      </Section>

      {/* ── With markers ──────────────────────────────────────────────────── */}
      <Section title="With markers">
        <Slider defaultValue={[50]}>
          <div class="flex justify-between">
            <SliderLabel>Quality</SliderLabel>
            <SliderValueText />
          </div>
          <SliderControl>
            <SliderThumb index={0} />
          </SliderControl>
          <SliderMarkerGroup>
            <For each={[0, 25, 50, 75, 100]}>
              {(value) => <SliderMarker value={value}>{value}</SliderMarker>}
            </For>
          </SliderMarkerGroup>
        </Slider>
      </Section>

      {/* ── Controlled ────────────────────────────────────────────────────── */}
      <Section title="Controlled">
        <Slider
          value={controlled()}
          onValueChange={(details) => setControlled(details.value)}
        >
          <div class="flex justify-between">
            <SliderLabel>Brightness</SliderLabel>
            <SliderValueText />
          </div>
          <SliderControl>
            <SliderThumb index={0} />
          </SliderControl>
        </Slider>
        <p class="mt-2 text-xs text-muted-foreground">
          Signal value:{" "}
          <span class="font-mono text-foreground">{controlled()[0]}</span>
        </p>
      </Section>

      {/* ── Center origin ─────────────────────────────────────────────────── */}
      <Section title="Center origin">
        <Slider origin="center" defaultValue={[0]} min={-50} max={50}>
          <div class="flex justify-between">
            <SliderLabel>Offset</SliderLabel>
            <SliderValueText />
          </div>
          <SliderControl>
            <SliderThumb index={0} />
          </SliderControl>
        </Slider>
      </Section>

      {/* ── Vertical ──────────────────────────────────────────────────────── */}
      <Section title="Vertical">
        <div class="flex h-40 gap-8">
          <Slider orientation="vertical" defaultValue={[60]}>
            <SliderLabel>L</SliderLabel>
            <SliderControl>
              <SliderThumb index={0} />
            </SliderControl>
          </Slider>

          <Slider orientation="vertical" defaultValue={[30, 70]}>
            <SliderLabel>R</SliderLabel>
            <SliderControl>
              <SliderThumb index={0} />
              <SliderThumb index={1} />
            </SliderControl>
          </Slider>
        </div>
      </Section>

      {/* ── Disabled ──────────────────────────────────────────────────────── */}
      <Section title="Disabled">
        <Slider defaultValue={[60]} disabled>
          <div class="flex justify-between">
            <SliderLabel>Locked</SliderLabel>
            <SliderValueText />
          </div>
          <SliderControl>
            <SliderThumb index={0} />
          </SliderControl>
        </Slider>
      </Section>
    </div>
  );
}
