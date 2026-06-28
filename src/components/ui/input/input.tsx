import { Field as FieldPrimitive } from "@ark-ui/solid/field";
import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";

const inputBase = [
  "flex w-full min-w-0 rounded-md border border-border bg-popover px-3 text-sm text-foreground outline-none",
  "placeholder:text-muted-foreground",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20",
  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
];

function Input(props: ComponentProps<typeof FieldPrimitive.Input>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <FieldPrimitive.Input
      data-slot="input"
      class={cn(inputBase, "h-9 py-1", local.class)}
      {...rest}
    />
  );
}

function Textarea(props: ComponentProps<typeof FieldPrimitive.Textarea>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <FieldPrimitive.Textarea
      data-slot="textarea"
      class={cn(inputBase, "min-h-20 resize-y py-2", local.class)}
      {...rest}
    />
  );
}

export { Input, Textarea };
