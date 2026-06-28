import { createFileRoute } from "@tanstack/solid-router";

import { Spinner } from "../../components/ui/spinner";

export const Route = createFileRoute("/previews/spinner")({
  component: RouteComponent,
});

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      <div class="flex flex-wrap items-center gap-4">{props.children}</div>
    </div>
  );
}

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Spinner</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Animated loading indicator.
        </p>
      </div>

      <Section title="Sizes">
        <Spinner class="size-4" />
        <Spinner class="size-5" />
        <Spinner class="size-6" />
        <Spinner class="size-8" />
      </Section>

      <Section title="Colours">
        <Spinner class="size-5 text-foreground" />
        <Spinner class="size-5 text-brand" />
        <Spinner class="size-5 text-destructive" />
        <Spinner class="size-5 text-success" />
      </Section>
    </div>
  );
}
