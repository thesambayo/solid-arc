/**
 * Empty — empty-state container.
 *
 *   <Empty>
 *     <EmptyHeader>
 *       <EmptyMedia variant="icon"><InboxIcon /></EmptyMedia>
 *       <EmptyTitle>No monitors yet</EmptyTitle>
 *       <EmptyDescription>Add your first URL to get started.</EmptyDescription>
 *     </EmptyHeader>
 *     <EmptyContent>
 *       <Button>Add monitor</Button>
 *     </EmptyContent>
 *   </Empty>
 */
import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";

type EmptyVariant = "default" | "outline";

const variantStyles: Record<EmptyVariant, string> = {
  default: "",
  outline: "border border-border rounded-xl",
};

interface EmptyProps extends ComponentProps<"div"> {
  variant?: EmptyVariant;
}

function Empty(props: EmptyProps) {
  const [local, rest] = splitProps(props, ["class", "variant"]);
  return (
    <div
      data-slot="empty"
      class={cn(
        "flex flex-col items-center justify-center gap-6 p-12 text-center",
        variantStyles[local.variant ?? "default"],
        local.class,
      )}
      {...rest}
    />
  );
}

function EmptyHeader(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="empty-header"
      class={cn("flex max-w-md flex-col items-center gap-2", local.class)}
      {...rest}
    />
  );
}

type EmptyMediaVariant = "default" | "icon";

interface EmptyMediaProps extends ComponentProps<"div"> {
  variant?: EmptyMediaVariant;
}

function EmptyMedia(props: EmptyMediaProps) {
  const [local, rest] = splitProps(props, ["class", "variant"]);
  return (
    <div
      data-slot="empty-media"
      data-variant={local.variant ?? "default"}
      class={cn(
        "mb-2",
        // icon variant: muted circle background with a centered svg
        local.variant === "icon" &&
          "flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-6",
        local.class,
      )}
      {...rest}
    />
  );
}

function EmptyTitle(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="empty-title"
      class={cn("text-base font-medium text-foreground", local.class)}
      {...rest}
    />
  );
}

function EmptyDescription(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="empty-description"
      class={cn("text-sm leading-relaxed text-muted-foreground", local.class)}
      {...rest}
    />
  );
}

function EmptyContent(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="empty-content"
      class={cn(
        "flex w-full max-w-sm flex-col items-center gap-3",
        local.class,
      )}
      {...rest}
    />
  );
}

export {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
};
