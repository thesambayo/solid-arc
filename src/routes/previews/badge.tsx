import { createFileRoute } from "@tanstack/solid-router";

import { Badge, BadgeDot, BadgeSpinner } from "../../components/ui/badge";

export const Route = createFileRoute("/previews/badge")({
  component: RouteComponent,
});

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      <div class="flex flex-wrap items-center gap-2">{props.children}</div>
    </div>
  );
}

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Badge</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Composable label/pill component.
        </p>
      </div>

      <Section title="All variants">
        <Badge variant="default">
          <BadgeDot />
          Default
        </Badge>
        <Badge variant="brand">
          <BadgeDot />
          Brand
        </Badge>
        <Badge variant="outline">
          <BadgeDot />
          Outline
        </Badge>
        <Badge variant="secondary">
          <BadgeDot />
          Secondary
        </Badge>
        <Badge variant="success">
          <BadgeDot />
          Good
        </Badge>
        <Badge variant="warning">
          <BadgeDot />
          Warn
        </Badge>
        <Badge variant="destructive">
          <BadgeDot />
          Down
        </Badge>
      </Section>

      <Section title="Generic variants">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
      </Section>
      <Section title="Status variants">
        <Badge variant="brand">
          <BadgeDot />
          Brand
        </Badge>
        <Badge variant="destructive">Default</Badge>
        <Badge variant="success">Secondary</Badge>
        <Badge variant="warning">Outline</Badge>
      </Section>

      <Section title="Loading state">
        <Badge variant="success">
          <BadgeSpinner />
          Checking…
        </Badge>
        <Badge variant="destructive">
          <BadgeSpinner />
          Checking…
        </Badge>
      </Section>

      <Section title="Method badge">
        <Badge variant="outline">GET</Badge>
        <Badge variant="outline">POST</Badge>
        <Badge variant="outline">DELETE</Badge>
      </Section>

      <Section title="Dot on the right">
        <Badge variant="warning">
          <span>Degraded</span>
          <BadgeDot />
        </Badge>
      </Section>
    </div>
  );
}
