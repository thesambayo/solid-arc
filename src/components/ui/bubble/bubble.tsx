/**
 * Bubble — presentational message surface for conversational UIs.
 *
 * Composition:
 *   Bubble                 (root; holds variant + align, styles its content child)
 *   ├── BubbleContent      (the framed surface; polymorphic via `asChild`)
 *   └── BubbleReactions    (overlapping reaction row, anchored to an edge)
 *
 * Like shadcn's version, the root targets its content child via
 * `*:data-[slot=bubble-content]:…` so the surface colour lands on the content
 * (which may be a <button>/<a>) while reactions stay unstyled.
 *
 * Token note: shadcn uses --primary/--secondary/--card which don't exist here.
 * Mapped to the house palette: default/tinted → brand (the repo's accent, used
 * for the current user's bubble), secondary/muted → muted, like `badge`.
 */
import { ark, type HTMLArkProps } from "@ark-ui/solid";
import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";

// ─── BubbleGroup ──────────────────────────────────────────────────────────────
// Groups consecutive bubbles from the same sender (alignment stays per-Bubble).

function BubbleGroup(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="bubble-group"
      class={cn("flex min-w-0 flex-col gap-2", local.class)}
      {...rest}
    />
  );
}

// ─── Bubble (root) ────────────────────────────────────────────────────────────

export const bubbleVariants = cva(
  [
    "group/bubble relative flex w-fit min-w-0 flex-col gap-1",
    // Sizes to content, up to 80% of the row; ghost spans full width.
    "max-w-[80%] data-[variant=ghost]:max-w-full",
    // Aligns via its own `align` prop, or when inside an end-aligned Message.
    "data-[align=end]:self-end group-data-[align=end]/message:self-end",
  ],
  {
    variants: {
      variant: {
        default:
          "*:data-[slot=bubble-content]:bg-brand *:data-[slot=bubble-content]:text-brand-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-brand/90",
        secondary:
          "*:data-[slot=bubble-content]:bg-muted *:data-[slot=bubble-content]:text-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-foreground/8",
        muted:
          "*:data-[slot=bubble-content]:bg-muted/60 *:data-[slot=bubble-content]:text-muted-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted",
        tinted:
          "*:data-[slot=bubble-content]:bg-brand/10 *:data-[slot=bubble-content]:text-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-brand/20",
        outline:
          "*:data-[slot=bubble-content]:bg-background *:data-[slot=bubble-content]:border-border [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted",
        ghost:
          "*:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:rounded-md [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted",
        destructive:
          "*:data-[slot=bubble-content]:bg-destructive/10 *:data-[slot=bubble-content]:text-destructive [&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BubbleVariantProps = VariantProps<typeof bubbleVariants>;

export type BubbleProps = ComponentProps<"div"> &
  BubbleVariantProps & {
    align?: "start" | "end";
  };

function Bubble(props: BubbleProps) {
  const [local, rest] = splitProps(props, ["class", "variant", "align"]);
  return (
    <div
      data-slot="bubble"
      data-variant={local.variant ?? "default"}
      data-align={local.align ?? "start"}
      class={cn(bubbleVariants({ variant: local.variant }), local.class)}
      {...rest}
    />
  );
}

// ─── BubbleContent ────────────────────────────────────────────────────────────
// The framed surface. Built on ark.div so it can become a <button>/<a> via
// `asChild={(p) => <button {...p()} />}` — the interactive focus ring + hover
// styles in the variants then apply to it.

function BubbleContent(props: HTMLArkProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ark.div
      data-slot="bubble-content"
      class={cn(
        "w-fit max-w-full min-w-0 overflow-hidden wrap-break-word",
        "rounded-xl border border-transparent px-3 py-2 text-sm leading-relaxed",
        "group-data-[align=end]/bubble:self-end",
        "[&:is(button)]:text-left [&:is(button,a)]:transition-colors",
        "[&:is(button,a)]:outline-none [&:is(button,a)]:focus-visible:border-ring [&:is(button,a)]:focus-visible:ring-3 [&:is(button,a)]:focus-visible:ring-ring/50",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── BubbleReactions ──────────────────────────────────────────────────────────
// Overlaps the bubble edge — leave vertical gap between rows (see preview).

export const bubbleReactionsVariants = cva(
  [
    "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1",
    "rounded-full bg-muted px-1.5 py-0.5 text-sm ring-3 ring-background has-[button]:p-0",
  ],
  {
    variants: {
      side: {
        top: "top-0 -translate-y-3/4",
        bottom: "bottom-0 translate-y-3/4",
      },
      align: {
        start: "left-3",
        end: "right-3",
      },
    },
    defaultVariants: {
      side: "bottom",
      align: "end",
    },
  },
);

export type BubbleReactionsProps = ComponentProps<"div"> & {
  side?: "top" | "bottom";
  align?: "start" | "end";
};

function BubbleReactions(props: BubbleReactionsProps) {
  const [local, rest] = splitProps(props, ["class", "side", "align"]);
  return (
    <div
      data-slot="bubble-reactions"
      data-side={local.side ?? "bottom"}
      data-align={local.align ?? "end"}
      class={cn(
        bubbleReactionsVariants({ side: local.side, align: local.align }),
        local.class,
      )}
      {...rest}
    />
  );
}

export { Bubble, BubbleGroup, BubbleContent, BubbleReactions };
