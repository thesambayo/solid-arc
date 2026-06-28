/**
 * Attachment — displays a file or image attachment with media, metadata,
 * upload state, and actions. Ported from shadcn's Attachment (base-rhea) to
 * SolidJS + this design system.
 *
 * Composition:
 *   Attachment
 *   ├── AttachmentMedia        (icon or <img>)
 *   ├── AttachmentContent
 *   │   ├── AttachmentTitle
 *   │   └── AttachmentDescription
 *   ├── AttachmentActions
 *   │   └── AttachmentAction
 *   └── AttachmentTrigger      (optional full-card overlay)
 *
 * Lay multiple out in a scrollable row with <AttachmentGroup>.
 *
 * The root carries `group/attachment` plus `data-state` / `data-size` /
 * `data-orientation`, which the parts key off of via `group-data-[…]`.
 *
 * Usage:
 *   <Attachment>
 *     <AttachmentMedia><FileTextIcon /></AttachmentMedia>
 *     <AttachmentContent>
 *       <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
 *       <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
 *     </AttachmentContent>
 *     <AttachmentActions>
 *       <AttachmentAction aria-label="Remove sales-dashboard.pdf">
 *         <XIcon />
 *       </AttachmentAction>
 *     </AttachmentActions>
 *   </Attachment>
 */
import { ark, type HTMLArkProps } from "@ark-ui/solid";
import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";
import { Button, type ButtonProps } from "../button/button";

// ─── Root ──────────────────────────────────────────────────────────────────

const attachmentVariants = cva(
  [
    "group/attachment relative isolate flex w-fit",
    "rounded-xl border border-border bg-popover",
    "focus-within:ring-1 focus-within:ring-ring/50",
    "data-[state=error]:border-destructive/40 data-[state=error]:bg-destructive/5",
  ],
  {
    variants: {
      orientation: {
        horizontal: "min-w-40 items-center",
        vertical: "w-24 flex-col has-data-[slot=attachment-content]:w-30",
      },
      size: {
        default:
          "gap-2 text-sm has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2",
        sm: "gap-2.5 text-xs has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5",
        xs: "gap-1.5 rounded-lg text-xs has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      size: "default",
    },
  },
);

export type AttachmentState =
  | "idle"
  | "uploading"
  | "processing"
  | "error"
  | "done";

export type AttachmentProps = ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants> & {
    state?: AttachmentState;
  };

function Attachment(props: AttachmentProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "state",
    "size",
    "orientation",
  ]);

  const state = () => local.state ?? "done";
  const size = () => local.size ?? "default";
  const orientation = () => local.orientation ?? "horizontal";

  return (
    <div
      data-slot="attachment"
      data-state={state()}
      data-size={size()}
      data-orientation={orientation()}
      class={cn(
        attachmentVariants({ size: size(), orientation: orientation() }),
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Media ─────────────────────────────────────────────────────────────────

const attachmentMediaVariants = cva(
  [
    "relative grid aspect-square w-10 shrink-0 place-items-center overflow-hidden",
    "rounded-lg bg-muted text-foreground",
    "group-data-[size=sm]/attachment:w-8",
    "group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-md",
    "[&_svg:not([class*='size-'])]:size-4",
    "group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
    "group-data-[orientation=vertical]/attachment:w-full",
    "group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6",
  ],
  {
    variants: {
      variant: {
        icon: "",
        image:
          "opacity-60 group-data-[state=idle]/attachment:opacity-100 group-data-[state=done]/attachment:opacity-100 [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  },
);

export type AttachmentMediaProps = ComponentProps<"div"> &
  VariantProps<typeof attachmentMediaVariants>;

function AttachmentMedia(props: AttachmentMediaProps) {
  const [local, rest] = splitProps(props, ["class", "variant"]);
  return (
    <div
      data-slot="attachment-media"
      class={cn(
        attachmentMediaVariants({ variant: local.variant ?? "icon" }),
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Content ───────────────────────────────────────────────────────────────

function AttachmentContent(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="attachment-content"
      class={cn(
        "min-w-0 leading-tight group-data-[orientation=vertical]/attachment:px-1",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Title ─────────────────────────────────────────────────────────────────
// Shimmers while the attachment is uploading or processing.

function AttachmentTitle(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="attachment-title"
      class={cn(
        "truncate font-medium",
        "group-data-[state=uploading]/attachment:shimmer",
        "group-data-[state=processing]/attachment:shimmer",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Description ───────────────────────────────────────────────────────────

function AttachmentDescription(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="attachment-description"
      class={cn(
        "mt-0.5 truncate text-xs text-muted-foreground",
        "group-data-[state=error]/attachment:text-destructive",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Actions ───────────────────────────────────────────────────────────────

function AttachmentActions(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="attachment-actions"
      class={cn(
        "relative z-20 flex items-center",
        "group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:right-3 group-data-[orientation=vertical]/attachment:gap-1",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Action ────────────────────────────────────────────────────────────────
// Renders a design-system Button. Defaults to an icon-xs ghost button.

function AttachmentAction(props: ButtonProps) {
  const [local, rest] = splitProps(props, ["variant", "size"]);
  return (
    <Button
      data-slot="attachment-action"
      variant={local.variant ?? "ghost"}
      size={local.size ?? "icon-xs"}
      {...rest}
    />
  );
}

// ─── Trigger ───────────────────────────────────────────────────────────────
// A full-card overlay that activates the attachment. Renders an ark.button, so
// it supports `asChild` to become a link or a Dialog trigger. It sits below the
// actions (z-10 vs z-20) so both stay independently clickable.

function AttachmentTrigger(props: HTMLArkProps<"button">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ark.button
      data-slot="attachment-trigger"
      class={cn(
        "absolute inset-0 z-10 cursor-pointer rounded-[inherit] outline-none",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Group ─────────────────────────────────────────────────────────────────
// Horizontally scrollable, snapping row with an edge fade.

function AttachmentGroup(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="attachment-group"
      class={cn(
        "flex snap-x gap-3 overflow-x-auto scroll-px-1 py-1",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)]",
        "[&>*]:snap-start [&>*]:shrink-0",
        local.class,
      )}
      {...rest}
    />
  );
}

export {
  Attachment,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
  AttachmentGroup,
  attachmentVariants,
};
