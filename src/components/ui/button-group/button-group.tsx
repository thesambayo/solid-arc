/**
 * ButtonGroup — CSS-first connected button toolbar.
 *
 * Buttons inside automatically merge borders and border-radii so the group
 * looks like one joined control. No context wiring needed — just nest children.
 *
 * Usage (basic horizontal group):
 *   <ButtonGroup>
 *     <Button variant="outline">Day</Button>
 *     <Button variant="outline">Week</Button>
 *     <Button variant="outline">Month</Button>
 *   </ButtonGroup>
 *
 * Usage (vertical):
 *   <ButtonGroup orientation="vertical">
 *     <Button variant="outline">Top</Button>
 *     <Button variant="outline">Bottom</Button>
 *   </ButtonGroup>
 *
 * Usage (with a text addon):
 *   <ButtonGroup>
 *     <ButtonGroupText>https://</ButtonGroupText>
 *     <Input class="rounded-none border-x-0" placeholder="example.com" />
 *     <Button variant="outline">Check</Button>
 *   </ButtonGroup>
 *
 * Usage (with a separator):
 *   <ButtonGroup>
 *     <Button variant="outline"><BoldIcon /></Button>
 *     <ButtonGroupSeparator />
 *     <Button variant="outline"><ItalicIcon /></Button>
 *   </ButtonGroup>
 *
 * Usage (asChild on ButtonGroupText — renders as a link):
 *   <ButtonGroupText asChild={(p) => <a href="/docs" {...p()}>Docs</a>} />
 *
 * Nested groups:
 *   <ButtonGroup>
 *     <ButtonGroup>...</ButtonGroup>
 *     <Button>...</Button>
 *   </ButtonGroup>
 *
 * Exports: ButtonGroup, ButtonGroupText, ButtonGroupSeparator, buttonGroupVariants
 */
import { ark, type HTMLArkProps } from "@ark-ui/solid";
import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";
import { ButtonContext, type ButtonVariantProps } from "../button/button";

// ─── Variants ─────────────────────────────────────────────────────────────────

export const buttonGroupVariants = cva(
  [
    "flex w-fit items-stretch",
    // nested groups get a gap instead of merging
    "has-[>[data-slot=button-group]]:gap-2",
    // keep focused child above its siblings so its ring isn't clipped
    "[&>*]:focus-visible:relative [&>*]:focus-visible:z-10",
    // inputs inside stretch to fill
    "[&>input]:flex-1",
  ],
  {
    variants: {
      orientation: {
        horizontal: [
          "[&>*:not(:first-child)]:rounded-l-none",
          "[&>*:not(:first-child)]:border-l-0",
          "[&>*:not(:last-child)]:rounded-r-none",
        ],
        vertical: [
          "flex-col",
          "[&>*:not(:first-child)]:rounded-t-none",
          "[&>*:not(:first-child)]:border-t-0",
          "[&>*:not(:last-child)]:rounded-b-none",
        ],
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);

// ─── ButtonGroup ──────────────────────────────────────────────────────────────

export type ButtonGroupProps = ComponentProps<"div"> &
  VariantProps<typeof buttonGroupVariants> &
  ButtonVariantProps;

export function ButtonGroup(props: ButtonGroupProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "orientation",
    "variant",
    "size",
  ]);
  return (
    <ButtonContext.Provider
      value={{ variant: local.variant, size: local.size }}
    >
      <div
        role="group"
        data-slot="button-group"
        data-orientation={local.orientation ?? "horizontal"}
        class={cn(
          buttonGroupVariants({ orientation: local.orientation }),
          local.class,
        )}
        {...rest}
      />
    </ButtonContext.Provider>
  );
}

// ─── ButtonGroupText ──────────────────────────────────────────────────────────

export type ButtonGroupTextProps = HTMLArkProps<"div">;

export function ButtonGroupText(props: ButtonGroupTextProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ark.div
      data-slot="button-group-text"
      class={cn(
        "flex items-center gap-2 rounded-md border border-border bg-muted px-3 text-sm font-medium",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── ButtonGroupSeparator ─────────────────────────────────────────────────────

export type ButtonGroupSeparatorProps = ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical";
};

export function ButtonGroupSeparator(props: ButtonGroupSeparatorProps) {
  const [local, rest] = splitProps(props, ["class", "orientation"]);
  const orientation = () => local.orientation ?? "vertical";
  return (
    <div
      data-slot="button-group-separator"
      data-orientation={orientation()}
      class={cn(
        "relative self-stretch bg-border",
        orientation() === "vertical" ? "w-px" : "h-px w-full",
        local.class,
      )}
      {...rest}
    />
  );
}
