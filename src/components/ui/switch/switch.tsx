import { Switch as SwitchPrimitive } from "@ark-ui/solid/switch";
import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";

function SwitchLabel(props: ComponentProps<typeof SwitchPrimitive.Label>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <SwitchPrimitive.Label
      data-slot="switch-label"
      class={cn(
        "text-sm leading-none select-none",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
}

interface SwitchRootProps extends ComponentProps<typeof SwitchPrimitive.Root> {
  size?: "sm" | "default";
  brand?: boolean;
}

function Switch(props: SwitchRootProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "children",
    "size",
    "brand",
  ]);
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={local.size ?? "default"}
      data-brand={local.brand ? "" : undefined}
      class={cn(
        "group/switch inline-flex items-center gap-2",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    >
      <SwitchPrimitive.Control
        data-slot="switch-control"
        class={cn(
          "relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors",
          // unchecked
          "data-[state=unchecked]:bg-foreground/15",
          // checked — near-black
          "data-[state=checked]:bg-foreground",
          // brand override
          "group-data-brand/switch:data-[state=checked]:bg-brand",
          // focus ring
          "data-focus-visible:ring-3 data-focus-visible:ring-ring/30",
          "group-data-brand/switch:data-focus-visible:ring-brand/30",
          // invalid
          "data-invalid:ring-3 data-invalid:ring-destructive/30",
          // sizing
          "group-data-[size=default]/switch:h-5 group-data-[size=default]/switch:w-9",
          "group-data-[size=sm]/switch:h-4 group-data-[size=sm]/switch:w-7",
        )}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          class={cn(
            "pointer-events-none block rounded-full bg-background shadow-sm transition-transform",
            // default: size-4 (16px), travel translate-x-4 (16px = 36 - 4 - 16)
            "group-data-[size=default]/switch:size-4",
            "group-data-[size=default]/switch:data-[state=unchecked]:translate-x-0",
            "group-data-[size=default]/switch:data-[state=checked]:translate-x-4",
            // sm: size-3 (12px), travel translate-x-3 (12px = 28 - 4 - 12)
            "group-data-[size=sm]/switch:size-3",
            "group-data-[size=sm]/switch:data-[state=unchecked]:translate-x-0",
            "group-data-[size=sm]/switch:data-[state=checked]:translate-x-3",
          )}
        />
      </SwitchPrimitive.Control>
      <SwitchPrimitive.HiddenInput />
      {local.children}
    </SwitchPrimitive.Root>
  );
}

const SwitchContext = SwitchPrimitive.Context;

export { Switch, SwitchLabel, SwitchContext };
