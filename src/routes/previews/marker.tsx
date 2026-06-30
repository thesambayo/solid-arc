import { createFileRoute } from "@tanstack/solid-router";
import {
  CheckIcon,
  FileTextIcon,
  GitPullRequestIcon,
  InfoIcon,
  SparklesIcon,
} from "lucide-solid";

import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "../../components/ui/marker";
import { Spinner } from "../../components/ui/spinner";

export const Route = createFileRoute("/previews/marker")({
  component: RouteComponent,
});

function Section(props: { title: string; description?: string; children: any }) {
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
      {props.children}
    </div>
  );
}

function RouteComponent() {
  return (
    <div class="flex max-w-lg flex-col gap-6 p-8">
      <div>
        <h1 class="text-lg font-semibold">Marker</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Inline status, system note, bordered row, or labeled separator.
        </p>
      </div>

      <Section title="Variants">
        <div class="flex flex-col gap-3">
          <Marker>
            <MarkerIcon>
              <CheckIcon />
            </MarkerIcon>
            <MarkerContent>Explored 4 files</MarkerContent>
          </Marker>
          <Marker variant="border">
            <MarkerIcon>
              <FileTextIcon />
            </MarkerIcon>
            <MarkerContent>Opened implementation notes</MarkerContent>
          </Marker>
          <Marker variant="separator">
            <MarkerContent>Today</MarkerContent>
          </Marker>
        </div>
      </Section>

      <Section
        title="Status"
        description="role=status + a Spinner so in-progress updates are announced."
      >
        <Marker role="status">
          <MarkerIcon>
            <Spinner />
          </MarkerIcon>
          <MarkerContent>Compacting conversation…</MarkerContent>
        </Marker>
      </Section>

      <Section
        title="Separator"
        description="Labeled dividers for dates or section breaks."
      >
        <div class="flex flex-col gap-3">
          <Marker variant="separator">
            <MarkerContent>Yesterday</MarkerContent>
          </Marker>
          <Marker variant="separator">
            <MarkerIcon>
              <SparklesIcon />
            </MarkerIcon>
            <MarkerContent>New messages</MarkerContent>
          </Marker>
        </div>
      </Section>

      <Section
        title="Border"
        description="Status rows that separate the next row with a bottom border."
      >
        <div class="flex flex-col">
          <Marker variant="border" class="py-2">
            <MarkerIcon>
              <InfoIcon />
            </MarkerIcon>
            <MarkerContent>Model switched to Opus 4.8</MarkerContent>
          </Marker>
          <Marker variant="border" class="py-2">
            <MarkerIcon>
              <CheckIcon />
            </MarkerIcon>
            <MarkerContent>Applied 3 edits</MarkerContent>
          </Marker>
        </div>
      </Section>

      <Section
        title="With icon (stacked)"
        description="Use flex-col to stack the icon above the content."
      >
        <Marker class="flex-col items-start gap-1">
          <MarkerIcon>
            <GitPullRequestIcon />
          </MarkerIcon>
          <MarkerContent>Opened PR #128 — registry add flow</MarkerContent>
        </Marker>
      </Section>

      <Section
        title="Links and buttons"
        description="Use asChild on Marker to render an <a> or <button>."
      >
        <div class="flex flex-col gap-3">
          <Marker asChild={(p) => <a href="https://ark-ui.com" {...p()} />}>
            <MarkerIcon>
              <GitPullRequestIcon />
            </MarkerIcon>
            <MarkerContent>View the pull request</MarkerContent>
          </Marker>
          <Marker
            asChild={(p) => (
              <button type="button" onClick={() => alert("Expanded")} {...p()} />
            )}
          >
            <MarkerIcon>
              <FileTextIcon />
            </MarkerIcon>
            <MarkerContent>Explored 4 files</MarkerContent>
          </Marker>
        </div>
      </Section>
    </div>
  );
}
