import { createFileRoute } from "@tanstack/solid-router";

import { Separator } from "../../components/ui/separator";

export const Route = createFileRoute("/previews/separator")({
  component: RouteComponent,
});

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      {props.children}
    </div>
  );
}

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Separator</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Visually or semantically separates content.
        </p>
      </div>

      <Section title="Horizontal">
        <div>
          <div class="text-sm font-medium">Solid Foundation</div>
          <p class="text-sm text-muted-foreground">
            A component library for SolidJS.
          </p>
          <Separator class="my-3" />
          <div class="flex h-5 items-center gap-3 text-sm">
            <span>Docs</span>
            <Separator orientation="vertical" />
            <span>Components</span>
            <Separator orientation="vertical" />
            <span>GitHub</span>
          </div>
        </div>
      </Section>

      <Section title="Vertical">
        <div class="flex h-12 items-center gap-4 text-sm">
          <span>Profile</span>
          <Separator orientation="vertical" />
          <span>Settings</span>
          <Separator orientation="vertical" />
          <span>Logout</span>
        </div>
      </Section>

      <Section title="In a list">
        <div class="w-64 rounded-lg border border-border">
          <div class="px-4 py-2.5 text-sm">Account</div>
          <Separator decorative={false} />
          <div class="px-4 py-2.5 text-sm">Notifications</div>
          <Separator decorative={false} />
          <div class="px-4 py-2.5 text-sm">Billing</div>
        </div>
      </Section>
    </div>
  );
}
