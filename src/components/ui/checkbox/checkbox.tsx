import { Checkbox as CheckboxPrimitive } from "@ark-ui/solid/checkbox";
import type {
  CheckboxCheckedState,
  CheckboxControlProps,
  CheckboxGroupProps,
  CheckboxHiddenInputProps,
  CheckboxIndicatorProps,
  CheckboxLabelProps,
} from "@ark-ui/solid/checkbox";
import { CheckIcon, MinusIcon } from "lucide-solid";
import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";

function CheckboxControl(props: CheckboxControlProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CheckboxPrimitive.Control
      data-slot="checkbox-control"
      class={cn(
        "relative size-4 shrink-0 rounded border border-border bg-background shadow-xs",
        "overflow-hidden transition-colors",
        // default: near-black when checked
        "data-[state=checked]:border-foreground data-[state=checked]:bg-foreground",
        "data-[state=indeterminate]:border-foreground data-[state=indeterminate]:bg-foreground",
        // brand variant: indigo when checked
        "group-data-brand/checkbox:data-[state=checked]:border-brand group-data-brand/checkbox:data-[state=checked]:bg-brand",
        "group-data-brand/checkbox:data-[state=indeterminate]:border-brand group-data-brand/checkbox:data-[state=indeterminate]:bg-brand",
        // states
        "data-invalid:border-destructive",
        "data-focus-visible:ring-3 data-focus-visible:ring-ring/30",
        "group-data-brand/checkbox:data-focus-visible:ring-brand/30",
        local.class,
      )}
      {...rest}
    />
  );
}

function CheckboxIndicator(props: CheckboxIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CheckboxPrimitive.Indicator
      data-slot="checkbox-indicator"
      class={cn(
        "absolute inset-0 flex items-center justify-center text-background",
        "[&_svg]:size-3 [&_svg]:stroke-3",
        local.class,
      )}
      {...rest}
    />
  );
}

function CheckboxLabel(props: CheckboxLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CheckboxPrimitive.Label
      data-slot="checkbox-label"
      class={cn(
        "text-sm leading-none select-none",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
}

function CheckboxHiddenInput(props: CheckboxHiddenInputProps) {
  return (
    <CheckboxPrimitive.HiddenInput data-slot="checkbox-input" {...props} />
  );
}

function CheckboxGroup(props: CheckboxGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CheckboxPrimitive.Group
      data-slot="checkbox-group"
      class={cn("flex flex-col gap-2", local.class)}
      {...rest}
    />
  );
}

const CheckboxContext = CheckboxPrimitive.Context;

interface CheckboxRootProps extends ComponentProps<
  typeof CheckboxPrimitive.Root
> {
  brand?: boolean;
}

function Checkbox(props: CheckboxRootProps) {
  const [local, rest] = splitProps(props, ["class", "children", "brand"]);
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-brand={local.brand ? "" : undefined}
      class={cn(
        "group/checkbox inline-flex w-fit items-center gap-2",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    >
      <CheckboxControl>
        <CheckboxIndicator>
          <CheckIcon />
        </CheckboxIndicator>
        <CheckboxIndicator indeterminate>
          <MinusIcon />
        </CheckboxIndicator>
      </CheckboxControl>
      <CheckboxHiddenInput />
      {local.children}
    </CheckboxPrimitive.Root>
  );
}

export {
  Checkbox,
  // CheckboxControl,
  // CheckboxIndicator,
  // CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxGroup,
  CheckboxContext,
};
export type { CheckboxCheckedState };
