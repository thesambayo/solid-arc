import { Tabs as TabsPrimitive } from "@ark-ui/solid/tabs";
import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";

interface TabsListProps extends ComponentProps<typeof TabsPrimitive.List> {
  variant?: "default" | "line";
}

function Tabs(props: ComponentProps<typeof TabsPrimitive.Root>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      class={cn("group/tabs flex flex-col gap-2", local.class)}
      {...rest}
    />
  );
}

function TabsList(props: TabsListProps) {
  const [local, rest] = splitProps(props, ["class", "variant"]);
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={local.variant ?? "default"}
      class={cn(
        "group/tabs-list inline-flex items-center",
        // default: pill container
        "data-[variant=default]:gap-1 data-[variant=default]:rounded-lg data-[variant=default]:bg-muted data-[variant=default]:p-1",
        // line: border-bottom strip
        "data-[variant=line]:w-full data-[variant=line]:gap-0 data-[variant=line]:border-b data-[variant=line]:border-border",
        local.class,
      )}
      {...rest}
    />
  );
}

function TabsTrigger(props: ComponentProps<typeof TabsPrimitive.Trigger>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      class={cn(
        "inline-flex cursor-pointer items-center justify-center text-sm font-medium whitespace-nowrap transition-all",
        "focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        // default variant styles
        "group-data-[variant=default]/tabs-list:rounded-md group-data-[variant=default]/tabs-list:px-3 group-data-[variant=default]/tabs-list:py-1",
        "group-data-[variant=default]/tabs-list:text-muted-foreground",
        "group-data-[variant=default]/tabs-list:data-selected:bg-background group-data-[variant=default]/tabs-list:data-selected:text-foreground group-data-[variant=default]/tabs-list:data-selected:shadow-sm",
        // line variant styles
        "group-data-[variant=line]/tabs-list:px-3 group-data-[variant=line]/tabs-list:pt-1 group-data-[variant=line]/tabs-list:pb-2",
        "group-data-[variant=line]/tabs-list:-mb-px group-data-[variant=line]/tabs-list:border-b-2 group-data-[variant=line]/tabs-list:border-transparent",
        "group-data-[variant=line]/tabs-list:text-muted-foreground",
        "group-data-[variant=line]/tabs-list:data-selected:border-foreground group-data-[variant=line]/tabs-list:data-selected:text-foreground",
        local.class,
      )}
      {...rest}
    />
  );
}

function TabsContent(props: ComponentProps<typeof TabsPrimitive.Content>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      class={cn("focus-visible:outline-none", local.class)}
      {...rest}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
