/**
 * FileUpload — Ark UI file upload primitive wired into the design system.
 *
 * Covered in v1:
 *   - Trigger (button to open picker)
 *   - Dropzone (drag and drop)
 *   - ItemGroup / Item / ItemPreview / ItemPreviewImage / ItemName / ItemSizeText
 *   - ItemDeleteTrigger
 *   - ClearTrigger
 *   - HiddenInput (required for form submission)
 *
 * Available on the underlying Ark primitive but not wrapped here yet — pass
 * the props directly on <FileUpload> and they'll just work:
 *   - directory          — folder upload (webkit only)
 *   - capture            — "user" | "environment" for device camera
 *   - transformFiles     — async transform before files are added (e.g. compression)
 *   - setClipboardFiles  — paste-to-upload (call from a textarea onPaste)
 *   - validate           — custom per-file validator
 */
import { FileUpload as FileUploadPrimitive } from "@ark-ui/solid/file-upload";
import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";
import { buttonVariants } from "../button/button";

// ─── Root ─────────────────────────────────────────────────────────────────────

function FileUpload(props: ComponentProps<typeof FileUploadPrimitive.Root>) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <FileUploadPrimitive.Root
      data-slot="file-upload"
      class={cn("flex flex-col gap-3", local.class)}
      {...rest}
    >
      {local.children}
      <FileUploadPrimitive.HiddenInput />
    </FileUploadPrimitive.Root>
  );
}

// ─── Label ────────────────────────────────────────────────────────────────────

function FileUploadLabel(
  props: ComponentProps<typeof FileUploadPrimitive.Label>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <FileUploadPrimitive.Label
      data-slot="file-upload-label"
      class={cn(
        "text-sm leading-none font-medium",
        "data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Trigger ──────────────────────────────────────────────────────────────────
// Renders as a button using the design-system button variants.

function FileUploadTrigger(
  props: ComponentProps<typeof FileUploadPrimitive.Trigger> & {
    variant?: "default" | "outline" | "ghost" | "brand" | "destructive";
  },
) {
  const [local, rest] = splitProps(props, ["class", "variant"]);
  return (
    <FileUploadPrimitive.Trigger
      data-slot="file-upload-trigger"
      class={cn(
        buttonVariants({ variant: local.variant ?? "outline" }),
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── ClearTrigger ─────────────────────────────────────────────────────────────
// Auto-hides itself when there are no files (Ark sets hidden on the element).

function FileUploadClearTrigger(
  props: ComponentProps<typeof FileUploadPrimitive.ClearTrigger> & {
    variant?: "default" | "outline" | "ghost" | "brand" | "destructive";
  },
) {
  const [local, rest] = splitProps(props, ["class", "variant"]);
  return (
    <FileUploadPrimitive.ClearTrigger
      data-slot="file-upload-clear-trigger"
      class={cn(
        buttonVariants({ variant: local.variant ?? "ghost" }),
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Dropzone ─────────────────────────────────────────────────────────────────

function FileUploadDropzone(
  props: ComponentProps<typeof FileUploadPrimitive.Dropzone>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <FileUploadPrimitive.Dropzone
      data-slot="file-upload-dropzone"
      class={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-popover px-6 py-10 text-center",
        "cursor-pointer transition-colors",
        "hover:bg-muted",
        "data-dragging:border-foreground data-dragging:bg-muted",
        "data-invalid:border-destructive",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── ItemGroup ────────────────────────────────────────────────────────────────

function FileUploadItemGroup(
  props: ComponentProps<typeof FileUploadPrimitive.ItemGroup>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <FileUploadPrimitive.ItemGroup
      data-slot="file-upload-item-group"
      class={cn("flex list-none flex-col gap-2 p-0", local.class)}
      {...rest}
    />
  );
}

// ─── Item ─────────────────────────────────────────────────────────────────────
// data-type is set by Ark — "accepted" or "rejected" — when the parent
// ItemGroup specifies a type. We tint rejected items red.

function FileUploadItem(
  props: ComponentProps<typeof FileUploadPrimitive.Item>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <FileUploadPrimitive.Item
      data-slot="file-upload-item"
      class={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-popover p-3",
        "data-[type=rejected]:border-destructive/40 data-[type=rejected]:bg-destructive/5",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── ItemPreview ──────────────────────────────────────────────────────────────
// Container for a per-type preview (gated by `type` prop on Ark's primitive).

function FileUploadItemPreview(
  props: ComponentProps<typeof FileUploadPrimitive.ItemPreview>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <FileUploadPrimitive.ItemPreview
      data-slot="file-upload-item-preview"
      class={cn(
        "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded bg-muted text-muted-foreground",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── ItemPreviewImage ─────────────────────────────────────────────────────────
// <img> thumbnail. Ark sets src to a blob URL of the file.

function FileUploadItemPreviewImage(
  props: ComponentProps<typeof FileUploadPrimitive.ItemPreviewImage>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <FileUploadPrimitive.ItemPreviewImage
      data-slot="file-upload-item-preview-image"
      class={cn("size-full object-cover", local.class)}
      {...rest}
    />
  );
}

// ─── ItemName ─────────────────────────────────────────────────────────────────

function FileUploadItemName(
  props: ComponentProps<typeof FileUploadPrimitive.ItemName>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <FileUploadPrimitive.ItemName
      data-slot="file-upload-item-name"
      class={cn("truncate text-sm font-medium", local.class)}
      {...rest}
    />
  );
}

// ─── ItemSizeText ─────────────────────────────────────────────────────────────
// Auto-formatted ("1.2 MB"). Use as a sibling to ItemName.

function FileUploadItemSizeText(
  props: ComponentProps<typeof FileUploadPrimitive.ItemSizeText>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <FileUploadPrimitive.ItemSizeText
      data-slot="file-upload-item-size-text"
      class={cn("text-xs text-muted-foreground tabular-nums", local.class)}
      {...rest}
    />
  );
}

// ─── ItemDeleteTrigger ────────────────────────────────────────────────────────
// Small ghost icon button. Use ml-auto in the consumer to push to the end.

function FileUploadItemDeleteTrigger(
  props: ComponentProps<typeof FileUploadPrimitive.ItemDeleteTrigger>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <FileUploadPrimitive.ItemDeleteTrigger
      data-slot="file-upload-item-delete-trigger"
      class={cn(
        "ml-auto inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground",
        "transition-colors hover:bg-muted hover:text-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "[&_svg]:size-4",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Context (re-export of the render-prop component) ─────────────────────────
// Pass-through so consumers can read acceptedFiles / rejectedFiles to render
// items. We don't wrap it — it's a render-prop, not a styled element.

const FileUploadContext = FileUploadPrimitive.Context;

export {
  FileUpload,
  FileUploadLabel,
  FileUploadTrigger,
  FileUploadClearTrigger,
  FileUploadDropzone,
  FileUploadItemGroup,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemPreviewImage,
  FileUploadItemName,
  FileUploadItemSizeText,
  FileUploadItemDeleteTrigger,
  FileUploadContext,
};
