/**
 * Message — row layout for a single conversation message: avatar, alignment,
 * header, and footer around the message surface. Presentational; render the
 * visible surface inside with `Bubble`.
 *
 * Composition:
 *   Message
 *   ├── MessageAvatar
 *   └── MessageContent
 *       ├── MessageHeader
 *       ├── Bubble            (the surface)
 *       └── MessageFooter
 */
import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";

// ─── MessageGroup ─────────────────────────────────────────────────────────────

function MessageGroup(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="message-group"
      class={cn("flex min-w-0 flex-col gap-2", local.class)}
      {...rest}
    />
  );
}

// ─── Message (row) ────────────────────────────────────────────────────────────

export type MessageProps = ComponentProps<"div"> & {
  align?: "start" | "end";
};

function Message(props: MessageProps) {
  const [local, rest] = splitProps(props, ["class", "align"]);
  return (
    <div
      data-slot="message"
      data-align={local.align ?? "start"}
      class={cn(
        "group/message relative flex w-full min-w-0 gap-2 text-sm",
        "data-[align=end]:flex-row-reverse",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── MessageAvatar ────────────────────────────────────────────────────────────
// Anchors to the bottom of the message; shifts up when a footer is present so it
// stays aligned with the surface instead of the footer.

function MessageAvatar(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="message-avatar"
      class={cn(
        "flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted",
        "group-has-data-[slot=message-footer]/message:-translate-y-8",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── MessageContent ───────────────────────────────────────────────────────────

function MessageContent(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="message-content"
      class={cn(
        "flex w-full min-w-0 flex-col gap-2.5 wrap-break-word",
        // On end-aligned rows, push the surface/header/footer to the end.
        "group-data-[align=end]/message:*:data-slot:self-end",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── MessageHeader ────────────────────────────────────────────────────────────

function MessageHeader(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="message-header"
      class={cn(
        "flex max-w-full min-w-0 items-center px-3 text-xs font-medium text-muted-foreground",
        "group-has-data-[variant=ghost]/message:px-0",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── MessageFooter ────────────────────────────────────────────────────────────

function MessageFooter(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="message-footer"
      class={cn(
        "flex max-w-full min-w-0 items-center px-3 text-xs font-medium text-muted-foreground",
        "group-data-[align=end]/message:justify-end",
        "group-has-data-[variant=ghost]/message:px-0",
        local.class,
      )}
      {...rest}
    />
  );
}

export {
  MessageGroup,
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
  MessageFooter,
};
