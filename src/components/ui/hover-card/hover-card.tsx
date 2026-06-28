import { HoverCard as HoverCardPrimitive } from "@ark-ui/solid/hover-card";
import { type ComponentProps, splitProps } from "solid-js";
import { Portal } from "solid-js/web";

import { cn } from "../../../lib/cn";

function HoverCard(props: ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger(
  props: ComponentProps<typeof HoverCardPrimitive.Trigger>,
) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
}

function HoverCardContent(
  props: ComponentProps<typeof HoverCardPrimitive.Content>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <Portal>
      <HoverCardPrimitive.Positioner>
        <HoverCardPrimitive.Content
          data-slot="hover-card-content"
          class={cn(
            "z-50 w-64 rounded-lg p-4 text-sm outline-none",
            "border border-border bg-popover text-popover-foreground shadow-md",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
            local.class,
          )}
          {...rest}
        />
      </HoverCardPrimitive.Positioner>
    </Portal>
  );
}

const HoverCardContext = HoverCardPrimitive.Context;

export { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardContext };
