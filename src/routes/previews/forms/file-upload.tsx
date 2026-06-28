import { createForm } from "@tanstack/solid-form";
import { createFileRoute } from "@tanstack/solid-router";
import { FileIcon, PaperclipIcon, CloudUploadIcon, XIcon } from "lucide-solid";
import { For, type JSX } from "solid-js";

import { Button } from "../../../components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../../../components/ui/field";
import {
  FileUpload,
  FileUploadContext,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDeleteTrigger,
  FileUploadItemGroup,
  FileUploadItemName,
  FileUploadItemPreview,
  FileUploadItemPreviewImage,
  FileUploadItemSizeText,
  FileUploadTrigger,
} from "../../../components/ui/file-upload";

export const Route = createFileRoute("/previews/forms/file-upload")({
  component: FileUploadFormPage,
});

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section(props: {
  title: string;
  description?: string;
  children: JSX.Element;
}) {
  return (
    <div class="flex flex-col gap-4">
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
      {props.children}
    </div>
  );
}

// ─── Single-file avatar upload ────────────────────────────────────────────────
// FileUpload value is always File[]. For "single file" semantics,
// set maxFiles={1} and treat the array as either [] or [file].

function AvatarUploadForm() {
  const form = createForm(() => ({
    defaultValues: {
      avatar: [] as File[],
    },
    onSubmit: async ({ value }) => {
      const file = value.avatar[0];
      alert(
        `Submitted avatar: ${file ? `${file.name} (${file.size} bytes)` : "none"}`,
      );
    },
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class="flex max-w-sm flex-col gap-4"
    >
      <form.Field
        name="avatar"
        validators={{
          onChange: ({ value }) => {
            const files = value as File[];
            if (files.length === 0) return "Please choose an avatar";
            return undefined;
          },
        }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0} required>
            <FieldLabel>Avatar</FieldLabel>
            {/*
             * FileUpload wiring:
             * - acceptedFiles    → controlled value, reads from field state
             * - onFileChange     → fires for accepted + rejected, receives
             *                      { acceptedFiles, rejectedFiles }
             *                      We only push acceptedFiles into the form value.
             *
             * Note: onFileAccept fires only when files are accepted, but
             * onFileChange covers both cases and gives us the full picture.
             */}
            <FileUpload
              acceptedFiles={field().state.value as File[]}
              onFileChange={(details) =>
                field().handleChange(details.acceptedFiles)
              }
              accept="image/*"
              maxFiles={1}
              maxFileSize={1024 * 1024}
            >
              <FileUploadTrigger class="gap-2 self-start">
                <PaperclipIcon class="size-4" />
                Choose image
              </FileUploadTrigger>
              <FileUploadItemGroup>
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
            </FileUpload>
            <FieldDescription>PNG, JPG, GIF — max 1 MB.</FieldDescription>
            <FieldError>
              {field().state.meta.errors[0] as string | undefined}
            </FieldError>
          </Field>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {(state) => (
          <Button
            type="submit"
            disabled={!state().canSubmit}
            loading={state().isSubmitting}
            loadingText="Uploading..."
            class="self-start"
          >
            Save avatar
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── Multi-file attachments with rejected feedback ────────────────────────────
// Rejected files (wrong type, too large, etc.) never enter the form value —
// Ark separates them. We show them inline as visual feedback only;
// they don't block form submission.

function AttachmentsForm() {
  const form = createForm(() => ({
    defaultValues: {
      attachments: [] as File[],
    },
    onSubmit: async ({ value }) => {
      const names = value.attachments.map((f) => f.name).join(", ");
      alert(`Submitted ${value.attachments.length} attachments: ${names}`);
    },
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class="flex max-w-md flex-col gap-4"
    >
      <form.Field
        name="attachments"
        validators={{
          onChange: ({ value }) => {
            const files = value as File[];
            if (files.length === 0) return "Add at least one file";
            return undefined;
          },
        }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0} required>
            <FieldLabel>Attachments</FieldLabel>
            <FileUpload
              acceptedFiles={field().state.value as File[]}
              onFileChange={(details) =>
                field().handleChange(details.acceptedFiles)
              }
              accept="image/*,application/pdf"
              maxFiles={5}
              maxFileSize={2 * 1024 * 1024}
            >
              <FileUploadDropzone>
                <CloudUploadIcon class="size-6 text-muted-foreground" />
                <div>
                  <p class="text-sm font-medium">Drop files here</p>
                  <p class="text-xs text-muted-foreground">
                    Images and PDFs, up to 5 files (2 MB each)
                  </p>
                </div>
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

              {/* Rejected — visual feedback only, not part of the form value */}
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
            <FieldError>
              {field().state.meta.errors[0] as string | undefined}
            </FieldError>
          </Field>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {(state) => (
          <Button
            type="submit"
            disabled={!state().canSubmit}
            loading={state().isSubmitting}
            loadingText="Uploading..."
            class="self-start"
          >
            Upload attachments
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function FileUploadFormPage() {
  return (
    <div class="flex max-w-2xl flex-col gap-10 p-8">
      <div>
        <h1 class="text-lg font-semibold">File upload</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          The form value is always{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">File[]</code>. Wire
          it with{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">
            acceptedFiles
          </code>{" "}
          (controlled value) and{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">onFileChange</code>{" "}
          (handler). Rejected files are kept by Ark and shown inline — they
          never enter the form value.
        </p>
      </div>

      <Section
        title="Single file (avatar)"
        description="maxFiles={1}, accept='image/*'. Submit with no file to see the required error."
      >
        <AvatarUploadForm />
      </Section>

      <Section
        title="Multiple files with rejected feedback"
        description="Drop a non-image / non-PDF or something over 2 MB to see the rejection list — the upload itself still succeeds with whatever was accepted."
      >
        <AttachmentsForm />
      </Section>
    </div>
  );
}
