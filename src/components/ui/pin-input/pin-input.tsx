/**
 * PinInput — segmented input for PIN / OTP / verification codes, built on Ark
 * UI's PinInput. Each slot is a real <input>, so focus/selection is native and
 * paste-to-fill + auto-advance come from Ark.
 *
 * Composition:
 *   PinInput                (Root; type/otp/mask/disabled/invalid/value…)
 *   ├── PinInputLabel
 *   ├── PinInputControl
 *   │   ├── PinInputInput index={0}
 *   │   ├── PinInputSeparator   (optional, decorative)
 *   │   └── PinInputInput index={1} …
 *   └── PinInputHiddenInput      (single input for form submission)
 *
 * Note: unlike shadcn's connected-border OTP look (built on the React-only
 * input-otp lib), slots here are individually-boxed and gapped — Ark renders
 * separate real inputs, and gapped boxes compose cleanly with a separator.
 */
import { PinInput as PinInputPrimitive } from "@ark-ui/solid/pin-input";
import { MinusIcon } from "lucide-solid";
import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";

// ─── Root ─────────────────────────────────────────────────────────────────────

function PinInput(props: ComponentProps<typeof PinInputPrimitive.Root>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <PinInputPrimitive.Root
      data-slot="pin-input"
      class={cn(
        "flex flex-col items-start gap-1.5 data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Label ────────────────────────────────────────────────────────────────────

function PinInputLabel(props: ComponentProps<typeof PinInputPrimitive.Label>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <PinInputPrimitive.Label
      data-slot="pin-input-label"
      class={cn("text-sm leading-none font-medium", local.class)}
      {...rest}
    />
  );
}

// ─── Control ──────────────────────────────────────────────────────────────────

function PinInputControl(
  props: ComponentProps<typeof PinInputPrimitive.Control>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <PinInputPrimitive.Control
      data-slot="pin-input-control"
      class={cn("flex items-center gap-2", local.class)}
      {...rest}
    />
  );
}

// ─── Input (a single slot) ────────────────────────────────────────────────────

function PinInputInput(props: ComponentProps<typeof PinInputPrimitive.Input>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <PinInputPrimitive.Input
      data-slot="pin-input-input"
      class={cn(
        "relative size-10 rounded-md border border-border bg-popover text-center text-base font-medium text-foreground outline-none transition-all",
        "placeholder:text-muted-foreground",
        // Bring the focused slot above its neighbors so the ring isn't clipped.
        "focus-visible:z-10 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20",
        "data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── HiddenInput ──────────────────────────────────────────────────────────────
// The single form-facing input carrying the concatenated value.

function PinInputHiddenInput(
  props: ComponentProps<typeof PinInputPrimitive.HiddenInput>,
) {
  return <PinInputPrimitive.HiddenInput {...props} />;
}

// ─── Separator ────────────────────────────────────────────────────────────────
// Decorative — place between slots inside the Control. Defaults to a dash.

function PinInputSeparator(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <div
      data-slot="pin-input-separator"
      role="separator"
      aria-hidden="true"
      class={cn(
        "flex items-center text-muted-foreground [&>svg]:size-4",
        local.class,
      )}
      {...rest}
    >
      {local.children ?? <MinusIcon />}
    </div>
  );
}

export {
  PinInput,
  PinInputLabel,
  PinInputControl,
  PinInputInput,
  PinInputHiddenInput,
  PinInputSeparator,
};
