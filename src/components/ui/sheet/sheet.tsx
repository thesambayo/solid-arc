/**
 * Sheet — a Dialog that slides in from an edge of the screen.
 *
 * Built on the same Ark `DialogPrimitive` as our Dialog component — only the
 * positioning and animation differ. State (open/close/escape/focus trap) is
 * identical, so the `DialogContext` / `useDialogContext` hook works for both.
 *
 *   <Sheet>
 *     <SheetTrigger>Open settings</SheetTrigger>
 *     <SheetContent side="right">
 *       <SheetHeader>
 *         <SheetTitle>Settings</SheetTitle>
 *         <SheetDescription>Manage your account.</SheetDescription>
 *       </SheetHeader>
 *       <div class="flex-1 overflow-auto p-4">...body...</div>
 *       <SheetFooter>
 *         <SheetClose>Cancel</SheetClose>
 *       </SheetFooter>
 *     </SheetContent>
 *   </Sheet>
 */
import { Dialog as DialogPrimitive } from "@ark-ui/solid/dialog";
import { XIcon } from "lucide-solid";
import { type ComponentProps, type JSX, Show, splitProps } from "solid-js";
import { Portal } from "solid-js/web";

import { cn } from "../../../lib/cn";
import { buttonVariants } from "../button/button";

// ─── Root + Trigger + Close ───────────────────────────────────────────────────

function Sheet(props: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(props: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(
  props: ComponentProps<typeof DialogPrimitive.CloseTrigger>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <DialogPrimitive.CloseTrigger
      data-slot="sheet-close"
      class={cn(buttonVariants({ variant: "outline" }), local.class)}
      {...rest}
    >
      {local.children ?? "Close"}
    </DialogPrimitive.CloseTrigger>
  );
}

// ─── Side-specific styles ─────────────────────────────────────────────────────

type SheetSide = "top" | "right" | "bottom" | "left";

/**
 * Per-side rules for both the Positioner (where the content sits on screen)
 * and the Content (its size + slide direction).
 */
const positionerBySide: Record<SheetSide, string> = {
  top: "items-start justify-stretch",
  bottom: "items-end justify-stretch",
  left: "items-stretch justify-start",
  right: "items-stretch justify-end",
};

const contentBySide: Record<SheetSide, string> = {
  top: [
    "w-full max-h-[80vh] border-b",
    "data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
  ].join(" "),
  bottom: [
    "w-full max-h-[80vh] border-t",
    "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
  ].join(" "),
  left: [
    "h-full w-3/4 sm:max-w-sm border-r",
    "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
  ].join(" "),
  right: [
    "h-full w-3/4 sm:max-w-sm border-l",
    "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
  ].join(" "),
};

// ─── Content ──────────────────────────────────────────────────────────────────

interface SheetContentProps extends ComponentProps<
  typeof DialogPrimitive.Content
> {
  side?: SheetSide;
  showCloseButton?: boolean;
}

function SheetContent(props: SheetContentProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "children",
    "side",
    "showCloseButton",
  ]);
  const side = () => local.side ?? "right";

  return (
    <Portal>
      <DialogPrimitive.Backdrop
        data-slot="sheet-overlay"
        class="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
      />
      <DialogPrimitive.Positioner
        class={cn("fixed inset-0 z-50 flex", positionerBySide[side()])}
      >
        <DialogPrimitive.Content
          data-slot="sheet-content"
          data-side={side()}
          class={cn(
            // Layout: column so SheetHeader sits at top, footer at bottom,
            // user-provided body grows / scrolls in between.
            "relative flex flex-col border-border bg-popover text-foreground shadow-lg outline-none",
            // Animation
            "data-[state=closed]:animate-out data-[state=open]:animate-in",
            "data-[state=closed]:duration-200 data-[state=open]:duration-300",
            // Side variants
            contentBySide[side()],
            local.class,
          )}
          {...rest}
        >
          {local.children}
          <Show when={local.showCloseButton ?? true}>
            <DialogPrimitive.CloseTrigger
              data-slot="sheet-close-icon"
              class="absolute top-3 right-3 flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <XIcon class="size-4" />
              <span class="sr-only">Close</span>
            </DialogPrimitive.CloseTrigger>
          </Show>
        </DialogPrimitive.Content>
      </DialogPrimitive.Positioner>
    </Portal>
  );
}

// ─── Header / Footer ──────────────────────────────────────────────────────────

function SheetHeader(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="sheet-header"
      class={cn(
        "flex flex-col gap-1.5 border-b border-border p-4",
        local.class,
      )}
      {...rest}
    />
  );
}

function SheetFooter(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="sheet-footer"
      class={cn(
        "mt-auto flex flex-col-reverse gap-2 border-t border-border bg-muted/50 p-4 sm:flex-row sm:justify-end",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Title / Description ──────────────────────────────────────────────────────

function SheetTitle(props: ComponentProps<typeof DialogPrimitive.Title>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      class={cn("text-base leading-none font-medium", local.class)}
      {...rest}
    />
  );
}

function SheetDescription(
  props: ComponentProps<typeof DialogPrimitive.Description>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DialogPrimitive.Description
      data-slot="sheet-description"
      class={cn("text-sm text-muted-foreground", local.class)}
      {...rest}
    />
  );
}

// Shared context with Dialog — same Ark machine
const SheetContext = DialogPrimitive.Context;

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetContext,
};
