import {
  SliderControlProps,
  Slider as SliderPrimitive,
} from "@ark-ui/solid/slider";
import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";

// ─── Root ─────────────────────────────────────────────────────────────────────

function Slider(props: ComponentProps<typeof SliderPrimitive.Root>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      class={cn(
        "flex flex-col gap-2",
        "data-[orientation=horizontal]:w-full",
        "data-[orientation=vertical]:h-40 data-[orientation=vertical]:flex-row data-[orientation=vertical]:items-start",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Label ────────────────────────────────────────────────────────────────────

function SliderLabel(props: ComponentProps<typeof SliderPrimitive.Label>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <SliderPrimitive.Label
      data-slot="slider-label"
      class={cn(
        "text-sm leading-none font-medium",
        "data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── ValueText ────────────────────────────────────────────────────────────────

function SliderValueText(
  props: ComponentProps<typeof SliderPrimitive.ValueText>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <SliderPrimitive.ValueText
      data-slot="slider-value-text"
      class={cn(
        "text-sm text-muted-foreground tabular-nums",
        "data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Control ─────────────────────────────────────────────────────────────────
// The interactive area that contains the track and thumbs.

function SliderControl(props: SliderControlProps) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <SliderPrimitive.Control
      data-slot="slider-control"
      class={cn(
        "relative flex touch-none items-center select-none",
        "data-[orientation=horizontal]:h-5 data-[orientation=horizontal]:w-full",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-5 data-[orientation=vertical]:flex-col",
        local.class,
      )}
      {...rest}
    >
      <SliderTrack>
        <SliderRange />
      </SliderTrack>
      {local.children}
    </SliderPrimitive.Control>
  );
}

// ─── Track ───────────────────────────────────────────────────────────────────

function SliderTrack(props: ComponentProps<typeof SliderPrimitive.Track>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <SliderPrimitive.Track
      data-slot="slider-track"
      class={cn(
        "relative grow overflow-hidden rounded-full bg-muted",
        "data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Range ────────────────────────────────────────────────────────────────────
// The filled portion between origin and thumb (or between two thumbs).

function SliderRange(props: ComponentProps<typeof SliderPrimitive.Range>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <SliderPrimitive.Range
      data-slot="slider-range"
      class={cn(
        "absolute bg-foreground data-disabled:opacity-50",
        "data-[orientation=horizontal]:h-full",
        "data-[orientation=vertical]:w-full",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Thumb ────────────────────────────────────────────────────────────────────
// Includes HiddenInput so the slider participates in native form reset.
// Ark positions this via --slider-thumb-transform CSS variable.

function SliderThumb(props: ComponentProps<typeof SliderPrimitive.Thumb>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      class={cn(
        // Ark sets --slider-thumb-transform on the root element to position each thumb
        "absolute transform-(--slider-thumb-transform)",
        "block size-4 shrink-0 rounded-full border-2 border-foreground bg-background shadow-sm",
        "transition-shadow",
        "data-focus-visible:ring-3 data-focus-visible:ring-ring/30",
        "data-dragging:ring-3 data-dragging:ring-ring/30",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    >
      <SliderPrimitive.HiddenInput />
    </SliderPrimitive.Thumb>
  );
}

// ─── MarkerGroup ──────────────────────────────────────────────────────────────

function SliderMarkerGroup(
  props: ComponentProps<typeof SliderPrimitive.MarkerGroup>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <SliderPrimitive.MarkerGroup
      data-slot="slider-marker-group"
      class={cn(
        "relative flex",
        "data-[orientation=horizontal]:w-full data-[orientation=horizontal]:justify-between",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:flex-col data-[orientation=vertical]:justify-between",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Marker ───────────────────────────────────────────────────────────────────
// Positioned automatically by Ark at the value on the track.
// data-[state=under-value] = passed by thumb
// data-[state=at-value]    = current thumb value
// data-[state=over-value]  = not yet reached

function SliderMarker(props: ComponentProps<typeof SliderPrimitive.Marker>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <SliderPrimitive.Marker
      data-slot="slider-marker"
      class={cn(
        "relative text-xs text-muted-foreground",
        // Dot above the label
        "before:absolute before:size-1 before:rounded-full before:bg-border before:content-['']",
        "before:-top-2.5 before:left-1/2 before:-translate-x-1/2",
        // Passed-by-thumb + current value → foreground
        "data-[state=under-value]:text-foreground",
        "data-[state=under-value]:before:bg-foreground",
        "data-[state=at-value]:before:bg-foreground",
        local.class,
      )}
      {...rest}
    />
  );
}

export {
  Slider,
  SliderLabel,
  SliderValueText,
  SliderControl,
  SliderThumb,
  SliderMarkerGroup,
  SliderMarker,
};
