/**
 * Alert — inline contextual feedback.
 *
 * Layout uses CSS grid so users can drop children in any order without a
 * content wrapper. The grid auto-flips when an icon (svg child) is present.
 *
 *   <Alert>
 *     <InfoIcon />
 *     <AlertTitle>Heads up!</AlertTitle>
 *     <AlertDescription>You can add components...</AlertDescription>
 *     <AlertAction><Button>Enable</Button></AlertAction>
 *   </Alert>
 */
import { type ComponentProps, type JSX, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";

type AlertVariant = "default" | "destructive";

const variantStyles: Record<AlertVariant, string> = {
  default: "border-border bg-background text-foreground",
  destructive:
    "border-destructive/40 bg-destructive/5 text-destructive [&>svg]:text-destructive",
};

interface AlertProps extends Omit<ComponentProps<"div">, "role"> {
  variant?: AlertVariant;
  children?: JSX.Element;
}

function Alert(props: AlertProps) {
  const [local, rest] = splitProps(props, ["class", "variant", "children"]);
  return (
    <div
      role="alert"
      data-slot="alert"
      data-variant={local.variant ?? "default"}
      class={cn(
        // base grid: defaults to 1fr for content + auto for optional action
        "grid w-full items-start gap-x-3 gap-y-0.5 rounded-lg border px-4 py-3 text-sm",
        "grid-cols-[1fr_auto]",
        // when an icon (svg) is a direct child, add an auto column for it
        "has-[>svg]:grid-cols-[auto_1fr_auto]",
        // icon: small, slightly nudged down, spans both rows
        "[&>svg]:row-span-2 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:self-start",
        // title/description: row 1 and 2, middle column when icon present
        "*:data-[slot=alert-title]:row-start-1",
        "*:data-[slot=alert-description]:row-start-2",
        "has-[>svg]:*:data-[slot=alert-title]:col-start-2",
        "has-[>svg]:*:data-[slot=alert-description]:col-start-2",
        // action: last column, vertically centered across both rows
        "*:data-[slot=alert-action]:row-span-2 *:data-[slot=alert-action]:self-center",
        variantStyles[local.variant ?? "default"],
        local.class,
      )}
      {...rest}
    >
      {local.children}
    </div>
  );
}

function AlertTitle(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="alert-title"
      class={cn("leading-tight font-medium", local.class)}
      {...rest}
    />
  );
}

function AlertDescription(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="alert-description"
      class={cn(
        "text-sm leading-relaxed text-muted-foreground",
        // destructive variant: softer destructive tone for description
        "in-data-[variant=destructive]:text-destructive/80",
        local.class,
      )}
      {...rest}
    />
  );
}

function AlertAction(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="alert-action"
      class={cn("shrink-0", local.class)}
      {...rest}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, AlertAction };
