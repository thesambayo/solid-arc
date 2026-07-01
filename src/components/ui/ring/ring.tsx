/**
 * Ring — a convenience recipe for a circular gauge, built on the circular
 * Progress primitives. It's a thin wrapper: every Ark `Progress.Root` prop
 * passes straight through, so value/min/max/onValueChange/etc. behave exactly
 * as documented. It only adds presentational extras: `size`, `stroke`, `label`,
 * and a semantic `tone`.
 *
 * Determinate:   <Ring defaultValue={80} />
 * Indeterminate: <Ring defaultValue={null} />
 *   NB: use `defaultValue={null}`, not `value={null}`. Ark treats a *controlled*
 *   `value` of null as "no controlled value" and falls back to the default,
 *   rendering a determinate ring. `defaultValue={null}` is the documented way.
 *
 * For anything past these knobs (custom colors, extra center content, a
 * value-driven color scale, …), compose the primitives directly:
 *   <Progress …><ProgressCircle><ProgressCircleTrack/><ProgressCircleRange/></…>
 */
import { Progress as ProgressPrimitive } from "@ark-ui/solid/progress";
import { type ComponentProps, Show, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";
import {
  ProgressCircle,
  ProgressCircleRange,
  ProgressCircleTrack,
  ProgressValueText,
} from "../progress";

export type RingTone =
  | "brand"
  | "foreground"
  | "success"
  | "warning"
  | "destructive"
  | "muted";

const RING_TONE: Record<RingTone, string> = {
  brand: "stroke-brand",
  foreground: "stroke-foreground",
  success: "stroke-success",
  warning: "stroke-warning",
  destructive: "stroke-destructive",
  muted: "stroke-muted-foreground",
};

export interface RingProps
  extends Omit<ComponentProps<typeof ProgressPrimitive.Root>, "children"> {
  /** Outer width/height in px. Default 36. */
  size?: number;
  /** Stroke width in px. Default 4. */
  stroke?: number;
  /** Render the value (e.g. "80%") centered inside the ring. */
  label?: boolean;
  /** Range color. Default "brand". */
  tone?: RingTone;
}

function Ring(props: RingProps) {
  const [local, root] = splitProps(props, [
    "size",
    "stroke",
    "label",
    "tone",
    "class",
  ]);
  const size = () => local.size ?? 36;
  const stroke = () => local.stroke ?? 4;

  return (
    <ProgressPrimitive.Root
      data-slot="ring"
      class={cn("relative inline-flex items-center justify-center", local.class)}
      {...root}
    >
      <ProgressCircle
        style={{
          "--size": `${size()}px`,
          "--thickness": `${stroke()}px`,
        }}
      >
        <ProgressCircleTrack />
        <ProgressCircleRange class={RING_TONE[local.tone ?? "brand"]} />
      </ProgressCircle>

      <Show when={local.label}>
        <ProgressValueText class="absolute inset-0 m-0 flex items-center justify-center font-mono text-sm font-semibold text-foreground" />
      </Show>
    </ProgressPrimitive.Root>
  );
}

export { Ring };
