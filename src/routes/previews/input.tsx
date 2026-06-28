import { createFileRoute } from "@tanstack/solid-router";

import { Input, Textarea } from "../../components/ui/input";

export const Route = createFileRoute("/previews/input")({
  component: RouteComponent,
});

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      <div class="flex max-w-sm flex-col gap-2">{props.children}</div>
    </div>
  );
}

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Input</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Text input and textarea form controls.
        </p>
      </div>

      <Section title="Input">
        <Input placeholder="example.com" />
        <Input placeholder="Disabled" disabled />
        <Input
          placeholder="With value"
          value="https://api.example.com/health"
        />
        <Input type="url" placeholder="https://…" />
      </Section>

      <Section title="Textarea">
        <Textarea placeholder="Notes…" />
        <Textarea placeholder="Disabled" disabled />
      </Section>
    </div>
  );
}
