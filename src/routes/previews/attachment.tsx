import { createFileRoute } from "@tanstack/solid-router";
import {
  FileIcon,
  FileTextIcon,
  ImageIcon,
  PaperclipIcon,
  XIcon,
} from "lucide-solid";
import { For } from "solid-js";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  type AttachmentState,
} from "../../components/ui/attachment";
import {
  FileUpload,
  FileUploadContext,
  FileUploadLabel,
  FileUploadTrigger,
} from "../../components/ui/file-upload";

export const Route = createFileRoute("/previews/attachment")({
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
      <div class="flex flex-wrap items-start gap-3">{props.children}</div>
    </div>
  );
}

// A small deterministic placeholder thumbnail so the image demos work offline.
const thumb = (hue: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='hsl(${hue} 70% 60%)'/><circle cx='24' cy='28' r='10' fill='hsl(${hue} 80% 85%)'/><path d='M0 80 L30 44 L52 66 L66 52 L80 66 L80 80 Z' fill='hsl(${hue} 60% 40%)'/></svg>`,
  )}`;

const states: AttachmentState[] = [
  "idle",
  "uploading",
  "processing",
  "done",
  "error",
];

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-10 p-8">
      <div>
        <h1 class="text-lg font-semibold">Attachment</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Displays a file or image attachment with media, metadata, upload
          state, and actions.
        </p>
      </div>

      {/* ── Basic (icon) ──────────────────────────────────────────────────── */}
      <Section title="Icon media">
        <Attachment>
          <AttachmentMedia>
            <FileTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
            <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove sales-dashboard.pdf">
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      </Section>

      {/* ── Image / vertical ──────────────────────────────────────────────── */}
      <Section
        title="Image media"
        description="variant='image' on the media, orientation='vertical' to stack."
      >
        <Attachment>
          <AttachmentMedia variant="image">
            <img src={thumb(210)} alt="" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>workspace.png</AttachmentTitle>
            <AttachmentDescription>PNG · 840 KB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>

        <Attachment orientation="vertical">
          <AttachmentMedia variant="image">
            <img src={thumb(160)} alt="" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>cover.jpg</AttachmentTitle>
            <AttachmentDescription>1.2 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove cover.jpg">
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      </Section>

      {/* ── States ────────────────────────────────────────────────────────── */}
      <Section
        title="States"
        description="uploading / processing shimmer the title; error uses a destructive treatment."
      >
        <div class="flex flex-col gap-3">
          <For each={states}>
            {(state) => (
              <Attachment state={state} class="min-w-72">
                <AttachmentMedia>
                  <FileIcon />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>quarterly-report.xlsx</AttachmentTitle>
                  <AttachmentDescription>
                    {state === "error"
                      ? "Upload failed — file too large"
                      : `${state} · 3.1 MB`}
                  </AttachmentDescription>
                </AttachmentContent>
              </Attachment>
            )}
          </For>
        </div>
      </Section>

      {/* ── Sizes ─────────────────────────────────────────────────────────── */}
      <Section title="Sizes">
        <div class="flex flex-col gap-3">
          <For each={["default", "sm", "xs"] as const}>
            {(size) => (
              <Attachment size={size}>
                <AttachmentMedia>
                  <ImageIcon />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>diagram.svg</AttachmentTitle>
                  <AttachmentDescription>SVG · 12 KB</AttachmentDescription>
                </AttachmentContent>
              </Attachment>
            )}
          </For>
        </div>
      </Section>

      {/* ── Group ─────────────────────────────────────────────────────────── */}
      <Section
        title="Group"
        description="Horizontally scrollable, snapping row with an edge fade."
      >
        <AttachmentGroup class="max-w-lg">
          <For each={[210, 160, 30, 280, 100, 340]}>
            {(hue, i) => (
              <Attachment orientation="vertical">
                <AttachmentMedia variant="image">
                  <img src={thumb(hue)} alt="" />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>image-{i() + 1}.png</AttachmentTitle>
                  <AttachmentDescription>PNG</AttachmentDescription>
                </AttachmentContent>
              </Attachment>
            )}
          </For>
        </AttachmentGroup>
      </Section>

      {/* ── Live: rendering FileUpload files as Attachments ───────────────── */}
      <Section
        title="With file upload"
        description="Pick files — each accepted file renders as an Attachment with a working remove."
      >
        <FileUpload maxFiles={6} class="w-full">
          <FileUploadLabel>Attachments</FileUploadLabel>
          <FileUploadTrigger class="gap-2 self-start">
            <PaperclipIcon class="size-4" />
            Choose file(s)
          </FileUploadTrigger>
          <FileUploadContext>
            {(api) => (
              <div class="flex flex-col gap-2">
                <For each={api().acceptedFiles}>
                  {(file) => {
                    const isImage = file.type.startsWith("image/");
                    return (
                      <Attachment class="w-full min-w-0">
                        <AttachmentMedia variant={isImage ? "image" : "icon"}>
                          {isImage ? (
                            <img src={URL.createObjectURL(file)} alt="" />
                          ) : (
                            <FileIcon />
                          )}
                        </AttachmentMedia>
                        <AttachmentContent class="flex-1">
                          <AttachmentTitle>{file.name}</AttachmentTitle>
                          <AttachmentDescription>
                            {api().getFileSize(file)}
                          </AttachmentDescription>
                        </AttachmentContent>
                        <AttachmentActions class="pr-2">
                          <AttachmentAction
                            aria-label={`Remove ${file.name}`}
                            onClick={() => api().deleteFile(file)}
                          >
                            <XIcon />
                          </AttachmentAction>
                        </AttachmentActions>
                      </Attachment>
                    );
                  }}
                </For>
              </div>
            )}
          </FileUploadContext>
        </FileUpload>
      </Section>
    </div>
  );
}
