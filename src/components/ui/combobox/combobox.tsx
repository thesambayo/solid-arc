import { Combobox as ComboboxPrimitive } from "@ark-ui/solid/combobox";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-solid";
import { type ComponentProps, splitProps } from "solid-js";
import { Portal } from "solid-js/web";

import { cn } from "../../../lib/cn";

function Combobox<T>(props: ComponentProps<typeof ComboboxPrimitive.Root<T>>) {
  return <ComboboxPrimitive.Root data-slot="combobox" {...props} />;
}

function ComboboxLabel(props: ComponentProps<typeof ComboboxPrimitive.Label>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ComboboxPrimitive.Label
      data-slot="combobox-label"
      class={cn("mb-1.5 block text-sm font-medium", local.class)}
      {...rest}
    />
  );
}

function ComboboxControl(
  props: ComponentProps<typeof ComboboxPrimitive.Control>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ComboboxPrimitive.Control
      data-slot="combobox-control"
      class={cn(
        "flex h-9 w-full items-center rounded-lg border border-border bg-popover px-3 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring",
        local.class,
      )}
      {...rest}
    />
  );
}

function ComboboxInput(props: ComponentProps<typeof ComboboxPrimitive.Input>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-input"
      class={cn(
        "flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
}

function ComboboxTrigger(
  props: ComponentProps<typeof ComboboxPrimitive.Trigger>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      class={cn(
        "-mr-1 flex shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground",
        local.class,
      )}
      {...rest}
    >
      {local.children ?? <ChevronsUpDownIcon class="size-4" />}
    </ComboboxPrimitive.Trigger>
  );
}

function ComboboxClearTrigger(
  props: ComponentProps<typeof ComboboxPrimitive.ClearTrigger>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <ComboboxPrimitive.ClearTrigger
      data-slot="combobox-clear-trigger"
      class={cn(
        "flex shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground",
        local.class,
      )}
      {...rest}
    >
      {local.children ?? <XIcon class="size-3.5" />}
    </ComboboxPrimitive.ClearTrigger>
  );
}

function ComboboxContent(
  props: ComponentProps<typeof ComboboxPrimitive.Content>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <Portal>
      <ComboboxPrimitive.Positioner class="z-50 w-(--reference-width)">
        <ComboboxPrimitive.Content
          data-slot="combobox-content"
          class={cn(
            "max-h-(--available-height) overflow-y-auto rounded-lg border border-border bg-popover p-1 text-sm shadow-md outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            local.class,
          )}
          {...rest}
        />
      </ComboboxPrimitive.Positioner>
    </Portal>
  );
}

function ComboboxEmpty(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="combobox-empty"
      class={cn("py-6 text-center text-sm text-muted-foreground", local.class)}
      {...rest}
    />
  );
}

function ComboboxItemGroup(
  props: ComponentProps<typeof ComboboxPrimitive.ItemGroup>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ComboboxPrimitive.ItemGroup
      data-slot="combobox-item-group"
      class={cn("", local.class)}
      {...rest}
    />
  );
}

function ComboboxItemGroupLabel(
  props: ComponentProps<typeof ComboboxPrimitive.ItemGroupLabel>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ComboboxPrimitive.ItemGroupLabel
      data-slot="combobox-item-group-label"
      class={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        local.class,
      )}
      {...rest}
    />
  );
}

function ComboboxItem(props: ComponentProps<typeof ComboboxPrimitive.Item>) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      class={cn(
        "relative flex cursor-default items-center rounded-md px-2 py-1.5 outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-muted",
        local.class,
      )}
      {...rest}
    >
      {local.children}
    </ComboboxPrimitive.Item>
  );
}

function ComboboxItemText(
  props: ComponentProps<typeof ComboboxPrimitive.ItemText>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ComboboxPrimitive.ItemText
      data-slot="combobox-item-text"
      class={cn("flex-1", local.class)}
      {...rest}
    />
  );
}

function ComboboxItemIndicator(
  props: ComponentProps<typeof ComboboxPrimitive.ItemIndicator>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <ComboboxPrimitive.ItemIndicator
      data-slot="combobox-item-indicator"
      class={cn("ml-auto flex items-center", local.class)}
      {...rest}
    >
      {local.children ?? <CheckIcon class="size-3.5 text-muted-foreground" />}
    </ComboboxPrimitive.ItemIndicator>
  );
}

export {
  Combobox,
  ComboboxLabel,
  ComboboxControl,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxClearTrigger,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItemGroup,
  ComboboxItemGroupLabel,
  ComboboxItem,
  ComboboxItemText,
  ComboboxItemIndicator,
};
