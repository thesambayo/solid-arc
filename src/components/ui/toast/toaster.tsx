/**
 * Toaster — renders all active toasts from the {@link toast} singleton.
 *
 * Mount once near the app root:
 *
 *   import { Toaster } from "@/components/ui/toast";
 *   // ...
 *   <Toaster />
 *   <Toaster richColors />   // bolder bg + colored border per type
 */
import { Toast, Toaster as ArkToaster } from "@ark-ui/solid/toast";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-solid";
import { type Component, Show, Switch, Match } from "solid-js";
import { Portal } from "solid-js/web";

import { cn } from "../../../lib/cn";
import { toast } from "./toast";

type ToastType = "info" | "success" | "error" | "warning" | "loading";

/**
 * Per-type icon color in the *subtle* (default) variant — keeps the card
 * neutral (bg-popover) and uses color only on the icon.
 */
const subtleIconStyles: Record<ToastType, string> = {
  info: "text-muted-foreground",
  success: "text-success",
  error: "text-destructive",
  warning: "text-warning",
  loading: "text-muted-foreground",
};

/**
 * Per-type styles in the *rich* variant — pale bg + matching border, with
 * the saturated brand color used for title + icon. Uses the `-subtle` /
 * `-border` token trio from styles.css, so backgrounds are fully opaque
 * (toasts stacking via `overlap: true` don't bleed through each other).
 *
 * `info` and `loading` intentionally stay neutral (we don't have an "info"
 * semantic color, and loading isn't a final state).
 */
const richColorStyles: Record<ToastType, string> = {
  info: "",
  loading: "",
  success:
    "bg-success-subtle border-success-border text-success [&_[data-slot=toast-description]]:text-success/80",
  error:
    "bg-destructive-subtle border-destructive-border text-destructive [&_[data-slot=toast-description]]:text-destructive/80",
  warning:
    "bg-warning-subtle border-warning-border text-warning [&_[data-slot=toast-description]]:text-warning/80",
};

interface ToastIconProps {
  type: ToastType | undefined;
  rich: boolean;
}

function ToastIcon(props: ToastIconProps) {
  const type = () => props.type ?? "info";
  // In rich mode, the icon inherits the card's colored text so we don't double-color it.
  const iconClass = () =>
    cn("size-4 shrink-0", props.rich ? "" : subtleIconStyles[type()]);
  return (
    <Switch>
      <Match when={type() === "success"}>
        <CircleCheckIcon class={iconClass()} />
      </Match>
      <Match when={type() === "error"}>
        <CircleAlertIcon class={iconClass()} />
      </Match>
      <Match when={type() === "warning"}>
        <TriangleAlertIcon class={iconClass()} />
      </Match>
      <Match when={type() === "loading"}>
        <Loader2Icon class={cn(iconClass(), "animate-spin")} />
      </Match>
      <Match when={type() === "info"}>
        <InfoIcon class={iconClass()} />
      </Match>
    </Switch>
  );
}

export interface ToasterProps {
  /**
   * When true, success/error/warning toasts get a colored background, border,
   * and text — bolder visual treatment.
   * @default false
   */
  richColors?: boolean;
}

export const Toaster: Component<ToasterProps> = (props) => {
  return (
    <Portal>
      <ArkToaster toaster={toast}>
        {(toastItem) => {
          const type = () => (toastItem().type ?? "info") as ToastType;
          return (
            <Toast.Root
              data-slot="toast-root"
              /*
               * Ark assigns these CSS variables at runtime: --x, --y, --scale,
               * --z-index, --height, --opacity, --gap. We translate them into
               * actual CSS via the inline-arbitrary classes below so stacking,
               * positioning, and animations work.
               */
              class={cn(
                // Required: Ark's runtime CSS variables → real CSS
                "z-(--z-index) h-(--height) translate-x-(--x) translate-y-(--y) scale-(--scale) opacity-(--opacity)",
                "transition-[translate,scale,opacity,height,box-shadow] duration-400 ease-[cubic-bezier(0.21,1.02,0.73,1)] will-change-transform",
                "data-[state=closed]:duration-200 data-[state=closed]:ease-[cubic-bezier(0.06,0.71,0.55,1)]",
                // Layout
                "relative flex w-(--width,360px) items-start gap-3 rounded-lg border border-border bg-popover p-4 text-sm text-foreground shadow-md",
                // Rich color overrides (no-op for info/loading)
                props.richColors && richColorStyles[type()],
              )}
            >
              <ToastIcon type={type()} rich={!!props.richColors} />

              <div class="flex min-w-0 flex-1 flex-col gap-0.5">
                <Toast.Title
                  data-slot="toast-title"
                  class="text-sm leading-tight font-medium"
                >
                  {toastItem().title}
                </Toast.Title>
                <Toast.Description
                  data-slot="toast-description"
                  class="text-sm leading-snug text-muted-foreground"
                >
                  {toastItem().description}
                </Toast.Description>
              </div>

              <Show when={toastItem().action}>
                <Toast.ActionTrigger
                  data-slot="toast-action"
                  class={cn(
                    "shrink-0 rounded-md px-2 py-1 text-xs font-medium",
                    "border border-border bg-background transition-colors hover:bg-muted",
                  )}
                >
                  {toastItem().action?.label}
                </Toast.ActionTrigger>
              </Show>

              <Toast.CloseTrigger
                data-slot="toast-close"
                class={cn(
                  "inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground",
                  "transition-colors hover:bg-muted hover:text-foreground",
                )}
              >
                <XIcon class="size-3.5" />
                <span class="sr-only">Close</span>
              </Toast.CloseTrigger>
            </Toast.Root>
          );
        }}
      </ArkToaster>
    </Portal>
  );
};
