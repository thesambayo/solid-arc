/**
 * Marker — inline conversation marker: status note, bordered row, or labeled
 * separator. Presentational; pair with a future Message component in a thread.
 *
 * Composition:
 *   Marker            (root; holds variant, polymorphic via `asChild`)
 *   ├── MarkerIcon    (decorative, aria-hidden)
 *   └── MarkerContent (the text)
 */
import { ark, type HTMLArkProps } from "@ark-ui/solid";
import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";

export const markerVariants = cva(
  [
    "group/marker relative flex w-full items-center gap-2 min-h-4 text-left text-sm text-muted-foreground",
    // When the root itself is rendered as a link (via asChild).
    "[a]:underline [a]:underline-offset-3 [a]:hover:text-foreground",
    "[&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: "",
        border: "border-b border-border pb-2",
        separator:
          "before:mr-1 before:h-px before:min-w-0 before:flex-1 before:bg-border after:ml-1 after:h-px after:min-w-0 after:flex-1 after:bg-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type MarkerVariantProps = VariantProps<typeof markerVariants>;

export type MarkerProps = HTMLArkProps<"div"> & MarkerVariantProps;

function Marker(props: MarkerProps) {
  const [local, rest] = splitProps(props, ["class", "variant"]);
  return (
    <ark.div
      data-slot="marker"
      data-variant={local.variant ?? "default"}
      class={cn(markerVariants({ variant: local.variant }), local.class)}
      {...rest}
    />
  );
}

// ─── MarkerIcon ───────────────────────────────────────────────────────────────
// Decorative — hidden from assistive tech; MarkerContent carries the meaning.

function MarkerIcon(props: ComponentProps<"span">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      class={cn(
        "size-4 shrink-0 [&_svg:not([class*='size-'])]:size-4",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── MarkerContent ────────────────────────────────────────────────────────────

function MarkerContent(props: ComponentProps<"span">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <span
      data-slot="marker-content"
      class={cn(
        "min-w-0 wrap-break-word",
        // Centered between the divider lines in the separator variant.
        "group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center",
        "*:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        local.class,
      )}
      {...rest}
    />
  );
}

export { Marker, MarkerIcon, MarkerContent };
