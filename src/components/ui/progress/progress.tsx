import { Progress as ProgressPrimitive } from "@ark-ui/solid/progress";
import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";

// ─── Root ─────────────────────────────────────────────────────────────────────
// Anatomy: Progress > (ProgressLabel, ProgressValueText, ProgressTrack > ProgressRange).
// Ark drives the fill via the --percent CSS variable; set `value={null}` for
// an indeterminate bar.

function Progress(props: ComponentProps<typeof ProgressPrimitive.Root>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      class={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1.5",
        "data-[orientation=vertical]:h-40 data-[orientation=vertical]:flex-col",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Label ────────────────────────────────────────────────────────────────────

function ProgressLabel(props: ComponentProps<typeof ProgressPrimitive.Label>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ProgressPrimitive.Label
      data-slot="progress-label"
      class={cn("text-sm leading-none font-medium", local.class)}
      {...rest}
    />
  );
}

// ─── ValueText ────────────────────────────────────────────────────────────────

function ProgressValueText(
  props: ComponentProps<typeof ProgressPrimitive.ValueText>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ProgressPrimitive.ValueText
      data-slot="progress-value-text"
      class={cn(
        "ml-auto text-sm text-muted-foreground tabular-nums",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Track ───────────────────────────────────────────────────────────────────
// `w-full` forces the track onto its own row beneath the label/value when the
// root wraps.

function ProgressTrack(props: ComponentProps<typeof ProgressPrimitive.Track>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ProgressPrimitive.Track
      data-slot="progress-track"
      class={cn(
        "relative w-full overflow-hidden rounded-full bg-muted",
        "data-[orientation=horizontal]:h-1.5",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Range ────────────────────────────────────────────────────────────────────
// Ark sizes this via --percent; we only style appearance + transition.

function ProgressRange(props: ComponentProps<typeof ProgressPrimitive.Range>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ProgressPrimitive.Range
      data-slot="progress-range"
      class={cn(
        "bg-foreground transition-all",
        "data-[orientation=horizontal]:h-full",
        "data-[orientation=vertical]:w-full",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Circle ───────────────────────────────────────────────────────────────────
// Circular variant of Progress. Size via the `--size`/`--thickness` CSS vars
// Ark exposes on this element (see Ark's progress styling guide). Ark already
// rotates CircleRange -90deg internally so 0% starts at 12 o'clock — don't
// add another rotation here, it would double up to 6 o'clock.

function ProgressCircle(
  props: ComponentProps<typeof ProgressPrimitive.Circle>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ProgressPrimitive.Circle
      data-slot="progress-circle"
      class={cn(local.class)}
      {...rest}
    />
  );
}

// ─── CircleTrack ──────────────────────────────────────────────────────────────

function ProgressCircleTrack(
  props: ComponentProps<typeof ProgressPrimitive.CircleTrack>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ProgressPrimitive.CircleTrack
      data-slot="progress-circle-track"
      class={cn("stroke-border", local.class)}
      {...rest}
    />
  );
}

// ─── CircleRange ──────────────────────────────────────────────────────────────
// Ark sizes this via stroke-dasharray/dashoffset computed from --percent.

function ProgressCircleRange(
  props: ComponentProps<typeof ProgressPrimitive.CircleRange>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ProgressPrimitive.CircleRange
      data-slot="progress-circle-range"
      class={cn(
        "stroke-foreground transition-[stroke-dashoffset] duration-500 ease-out",
        local.class,
      )}
      {...rest}
    />
  );
}

export {
  Progress,
  ProgressLabel,
  ProgressValueText,
  ProgressTrack,
  ProgressRange,
  ProgressCircle,
  ProgressCircleTrack,
  ProgressCircleRange,
};
