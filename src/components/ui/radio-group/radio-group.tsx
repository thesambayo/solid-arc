import { RadioGroup as RadioGroupPrimitive } from "@ark-ui/solid/radio-group";
import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";

function RadioGroupLabel(
  props: ComponentProps<typeof RadioGroupPrimitive.Label>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <RadioGroupPrimitive.Label
      data-slot="radio-group-label"
      class={cn(
        "text-sm leading-none font-medium",
        "data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
}

function RadioGroupItemControl(
  props: ComponentProps<typeof RadioGroupPrimitive.ItemControl>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <RadioGroupPrimitive.ItemControl
      data-slot="radio-group-item-control"
      class={cn(
        "relative size-4 shrink-0 rounded-full border border-border bg-background shadow-xs",
        "transition-colors",
        "data-[state=checked]:border-foreground",
        "after:absolute after:inset-0 after:m-auto after:size-2 after:rounded-full",
        "after:bg-foreground after:opacity-0 after:transition-opacity",
        "data-[state=checked]:after:opacity-100",
        "data-invalid:border-destructive",
        "data-focus-visible:ring-3 data-focus-visible:ring-ring/30",
        local.class,
      )}
      {...rest}
    />
  );
}

function RadioGroupItemText(
  props: ComponentProps<typeof RadioGroupPrimitive.ItemText>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <RadioGroupPrimitive.ItemText
      data-slot="radio-group-item-text"
      class={cn(
        "text-sm leading-none select-none",
        "data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
}

function RadioGroupItemHiddenInput(
  props: ComponentProps<typeof RadioGroupPrimitive.ItemHiddenInput>,
) {
  return (
    <RadioGroupPrimitive.ItemHiddenInput
      data-slot="radio-group-item-input"
      {...props}
    />
  );
}

function RadioGroupItem(
  props: ComponentProps<typeof RadioGroupPrimitive.Item>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      class={cn(
        "w-fit",
        "flex items-center gap-2",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    >
      <RadioGroupItemControl />
      <RadioGroupItemHiddenInput />
      <RadioGroupItemText>{local.children}</RadioGroupItemText>
    </RadioGroupPrimitive.Item>
  );
}

function RadioGroupCard(
  props: ComponentProps<typeof RadioGroupPrimitive.Item>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-card"
      class={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4",
        "transition-colors",
        "data-[state=checked]:border-foreground data-[state=checked]:bg-muted",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    >
      <RadioGroupItemControl class="mt-0.5 shrink-0" />
      <RadioGroupItemHiddenInput />
      {local.children}
    </RadioGroupPrimitive.Item>
  );
}

function RadioGroup(props: ComponentProps<typeof RadioGroupPrimitive.Root>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      class={cn(
        "flex flex-col gap-2",
        "data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:gap-4",
        local.class,
      )}
      {...rest}
    />
  );
}

export {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupItem,
  RadioGroupCard,
  RadioGroupItemControl,
  RadioGroupItemText,
};
