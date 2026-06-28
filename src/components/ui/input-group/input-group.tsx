import { Field as FieldPrimitive } from "@ark-ui/solid/field";
import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";

function InputGroup(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="input-group"
      class={cn(
        "flex h-9 w-full items-center overflow-hidden rounded-md border border-border bg-popover",
        "divide-x divide-border",
        "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20",
        "has-[input[aria-invalid]]:border-destructive has-[input[aria-invalid]]:focus-within:ring-destructive/20",
        local.class,
      )}
      {...rest}
    />
  );
}

function InputAddon(props: ComponentProps<"span">) {
  const [local, rest] = splitProps(props, ["class", "onClick"]);
  return (
    <span
      data-slot="input-addon"
      class={cn(
        "flex shrink-0 cursor-text items-center px-2.5 text-sm text-muted-foreground select-none",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        local.class,
      )}
      onClick={(e) => {
        // Don't steal focus from interactive elements inside the addon
        // (buttons, anchors, etc. should still work as expected)
        if (!(e.target as HTMLElement).closest("button, a, [role='button']")) {
          e.currentTarget.parentElement
            ?.querySelector<HTMLInputElement>("input")
            ?.focus();
        }
        if (typeof local.onClick === "function") local.onClick(e);
      }}
      {...rest}
    />
  );
}

function InputGroupInput(props: ComponentProps<typeof FieldPrimitive.Input>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <FieldPrimitive.Input
      data-slot="input-group-input"
      class={cn(
        "h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none",
        "placeholder:text-muted-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
}

export { InputGroup, InputAddon, InputGroupInput };
