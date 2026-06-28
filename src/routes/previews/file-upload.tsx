import { createFileRoute } from "@tanstack/solid-router";
import { FileIcon, PaperclipIcon, CloudUploadIcon, XIcon } from "lucide-solid";
import { For } from "solid-js";

import {
  FileUpload,
  FileUploadClearTrigger,
  FileUploadContext,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDeleteTrigger,
  FileUploadItemGroup,
  FileUploadItemName,
  FileUploadItemPreview,
  FileUploadItemPreviewImage,
  FileUploadItemSizeText,
  FileUploadLabel,
  FileUploadTrigger,
} from "../../components/ui/file-upload";

export const Route = createFileRoute("/previews/file-upload")({
  component: RouteComponent,
});

function Section(props: {
  title: string;
  description?: string;
  children: any;
}) {
  return (
    <div class="flex flex-col gap-3">
      <div>
        <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {props.title}
        </p>
        {props.description && (
          <p class="mt-0.5 text-xs text-muted-foreground">
            {props.description}
          </p>
        )}
      </div>
      <div>{props.children}</div>
    </div>
  );
}

function RouteComponent() {
  return (
    <div class="flex max-w-xl flex-col gap-10 p-8">
      <div>
        <h1 class="text-lg font-semibold">File upload</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Trigger button or dropzone, with previews, size text, and per-item
          delete.
        </p>
      </div>

      {/* ── Basic trigger ─────────────────────────────────────────────────── */}
      <Section
        title="Basic"
        description="A button that opens the file picker, with a compact item list."
      >
        <FileUpload maxFiles={5}>
          <FileUploadLabel>Attachments</FileUploadLabel>
          <FileUploadTrigger class="gap-2 self-start">
            <PaperclipIcon class="size-4" />
            Choose file(s)
          </FileUploadTrigger>
          <FileUploadItemGroup>
            <FileUploadContext>
              {(ctx) => (
                <For each={ctx().acceptedFiles}>
                  {(file) => (
                    <FileUploadItem file={file}>
                      <FileUploadItemName />
                      <FileUploadItemDeleteTrigger>
                        <XIcon />
                      </FileUploadItemDeleteTrigger>
                    </FileUploadItem>
                  )}
                </For>
              )}
            </FileUploadContext>
          </FileUploadItemGroup>
        </FileUpload>
      </Section>

      {/* ── Dropzone ──────────────────────────────────────────────────────── */}
      <Section
        title="Dropzone"
        description="Drag-and-drop area. Clicking it also opens the picker."
      >
        <FileUpload maxFiles={5}>
          <FileUploadLabel>Upload files</FileUploadLabel>
          <FileUploadDropzone>
            <CloudUploadIcon class="size-6 text-muted-foreground" />
            <div>
              <p class="text-sm font-medium">Drop files here</p>
              <p class="text-xs text-muted-foreground">
                or click to browse — up to 5 files
              </p>
            </div>
          </FileUploadDropzone>
          <FileUploadItemGroup>
            <FileUploadContext>
              {(ctx) => (
                <For each={ctx().acceptedFiles}>
                  {(file) => (
                    <FileUploadItem file={file}>
                      <FileUploadItemPreview type="image/*">
                        <FileUploadItemPreviewImage />
                      </FileUploadItemPreview>
                      <FileUploadItemPreview type=".*">
                        <FileIcon class="size-4" />
                      </FileUploadItemPreview>
                      <div class="flex min-w-0 flex-1 flex-col">
                        <FileUploadItemName />
                        <FileUploadItemSizeText />
                      </div>
                      <FileUploadItemDeleteTrigger>
                        <XIcon />
                      </FileUploadItemDeleteTrigger>
                    </FileUploadItem>
                  )}
                </For>
              )}
            </FileUploadContext>
          </FileUploadItemGroup>
        </FileUpload>
      </Section>

      {/* ── Images only ───────────────────────────────────────────────────── */}
      <Section
        title="Images only"
        description="Accept restricted via the accept prop. Image preview thumbnails."
      >
        <FileUpload
          maxFiles={5}
          accept="image/png,image/jpeg,image/webp"
          maxFileSize={2 * 1024 * 1024}
        >
          <div class="flex items-center justify-between">
            <FileUploadLabel>Images (PNG/JPEG/WebP, max 2 MB)</FileUploadLabel>
            <FileUploadClearTrigger class="text-xs">
              Clear all
            </FileUploadClearTrigger>
          </div>
          <FileUploadDropzone>
            <CloudUploadIcon class="size-6 text-muted-foreground" />
            <p class="text-sm font-medium">Drop images here</p>
          </FileUploadDropzone>

          {/* Accepted */}
          <FileUploadItemGroup type="accepted">
            <FileUploadContext>
              {(ctx) => (
                <For each={ctx().acceptedFiles}>
                  {(file) => (
                    <FileUploadItem file={file}>
                      <FileUploadItemPreview type="image/*">
                        <FileUploadItemPreviewImage />
                      </FileUploadItemPreview>
                      <div class="flex min-w-0 flex-1 flex-col">
                        <FileUploadItemName />
                        <FileUploadItemSizeText />
                      </div>
                      <FileUploadItemDeleteTrigger>
                        <XIcon />
                      </FileUploadItemDeleteTrigger>
                    </FileUploadItem>
                  )}
                </For>
              )}
            </FileUploadContext>
          </FileUploadItemGroup>

          {/* Rejected — Ark sets data-type="rejected" on Item via the parent group */}
          <FileUploadItemGroup type="rejected">
            <FileUploadContext>
              {(ctx) => (
                <For each={ctx().rejectedFiles}>
                  {(rejection) => (
                    <FileUploadItem file={rejection.file}>
                      <FileUploadItemPreview type=".*">
                        <FileIcon class="size-4" />
                      </FileUploadItemPreview>
                      <div class="flex min-w-0 flex-1 flex-col">
                        <FileUploadItemName />
                        <p class="text-xs text-destructive">
                          {rejection.errors.join(", ")}
                        </p>
                      </div>
                    </FileUploadItem>
                  )}
                </For>
              )}
            </FileUploadContext>
          </FileUploadItemGroup>
        </FileUpload>
      </Section>

      {/* ── Disabled ──────────────────────────────────────────────────────── */}
      <Section title="Disabled">
        <FileUpload disabled>
          <FileUploadLabel>Locked</FileUploadLabel>
          <FileUploadDropzone>
            <CloudUploadIcon class="size-6 text-muted-foreground" />
            <p class="text-sm font-medium">Upload disabled</p>
          </FileUploadDropzone>
        </FileUpload>
      </Section>
    </div>
  );
}
