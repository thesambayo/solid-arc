import { Field as FieldPrimitive } from "@ark-ui/solid/field";
import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";

function Field(props: ComponentProps<typeof FieldPrimitive.Root>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <FieldPrimitive.Root
      data-slot="field"
      class={cn("flex flex-col gap-1.5", local.class)}
      {...rest}
    />
  );
}

function FieldLabel(props: ComponentProps<typeof FieldPrimitive.Label>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      class={cn(
        "flex items-center gap-1 text-sm font-medium text-foreground",
        "data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
}

function FieldDescription(
  props: ComponentProps<typeof FieldPrimitive.HelperText>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <FieldPrimitive.HelperText
      data-slot="field-description"
      class={cn("text-xs text-muted-foreground", local.class)}
      {...rest}
    />
  );
}

function FieldError(props: ComponentProps<typeof FieldPrimitive.ErrorText>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <FieldPrimitive.ErrorText
      data-slot="field-error"
      class={cn("text-xs text-destructive", local.class)}
      {...rest}
    />
  );
}

function FieldRequiredIndicator(
  props: ComponentProps<typeof FieldPrimitive.RequiredIndicator>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <FieldPrimitive.RequiredIndicator
      data-slot="field-required"
      class={cn("text-destructive", local.class)}
      {...rest}
    />
  );
}

const FieldContext = FieldPrimitive.Context;

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldRequiredIndicator,
  FieldContext,
};
