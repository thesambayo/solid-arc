import { Collapsible as CollapsiblePrimitive } from "@ark-ui/solid/collapsible";
import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";

// ─── Root ─────────────────────────────────────────────────────────────────────
// Anatomy: Collapsible > (CollapsibleTrigger, CollapsibleContent).
// Use `open` / `onOpenChange` for controlled state.

function Collapsible(props: ComponentProps<typeof CollapsiblePrimitive.Root>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      class={cn("flex flex-col", local.class)}
      {...rest}
    />
  );
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

function CollapsibleTrigger(
  props: ComponentProps<typeof CollapsiblePrimitive.Trigger>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      class={cn(
        "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Indicator ────────────────────────────────────────────────────────────────
// Place an icon inside; styles.css rotates it via [data-state]. Marked aria-hidden
// since it's decorative — the trigger conveys state to assistive tech.

function CollapsibleIndicator(
  props: ComponentProps<typeof CollapsiblePrimitive.Indicator>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CollapsiblePrimitive.Indicator
      data-slot="collapsible-indicator"
      aria-hidden="true"
      class={cn("inline-flex shrink-0 text-muted-foreground", local.class)}
      {...rest}
    />
  );
}

// ─── Content ──────────────────────────────────────────────────────────────────
// Ark exposes --height (and --collapsed-height for partial collapse) for the
// open/closed animation — see styles.css. The inner wrapper carries padding so
// the height animation isn't fighting collapsing margins.

function CollapsibleContent(
  props: ComponentProps<typeof CollapsiblePrimitive.Content>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <CollapsiblePrimitive.Content
      data-slot="collapsible-content"
      class="overflow-hidden text-sm"
      {...rest}
    >
      <div class={cn(local.class)}>{local.children}</div>
    </CollapsiblePrimitive.Content>
  );
}

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleIndicator,
  CollapsibleContent,
};
