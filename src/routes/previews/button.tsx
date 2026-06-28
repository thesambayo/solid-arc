import { createFileRoute } from "@tanstack/solid-router";
import { PlusIcon, RefreshCwIcon, TrashIcon } from "lucide-solid";
import { createSignal } from "solid-js";

import { Button } from "../../components/ui/button";

export const Route = createFileRoute("/previews/button")({
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
  const [loading, setLoading] = createSignal(false);

  function simulateLoad() {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Button</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Ark UI button with cva variants and optional loading state.
        </p>
      </div>

      <Section title="Variants">
        <Button variant="default">Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="brand">Brand</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </Section>

      <Section title="Sizes">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </Section>

      <Section title="Icon sizes">
        <Button size="icon-xs" variant="outline">
          <PlusIcon />
        </Button>
        <Button size="icon-sm" variant="outline">
          <PlusIcon />
        </Button>
        <Button size="icon" variant="outline">
          <PlusIcon />
        </Button>
        <Button size="icon-lg" variant="outline">
          <PlusIcon />
        </Button>
      </Section>

      <Section title="With icon">
        <Button>
          <PlusIcon />
          Add monitor
        </Button>
        <Button variant="outline">
          <RefreshCwIcon />
          Refresh
        </Button>
        <Button variant="destructive">
          <TrashIcon />
          Delete
        </Button>
      </Section>

      <Section title="Loading states">
        <Button loading>Save</Button>
        <Button loading loadingText="Saving…">
          Save
        </Button>
        <Button loading spinnerPlacement="end" loadingText="Saving…">
          Save
        </Button>
        <Button loading={loading()} onClick={simulateLoad} variant="brand">
          {loading() ? "Checking…" : "Run check"}
        </Button>
      </Section>

      <Section title="Disabled">
        <Button disabled>Default</Button>
        <Button disabled variant="outline">
          Outline
        </Button>
      </Section>

      <Section title="As link">
        <Button
          asChild={(p) => (
            <a href="#" {...p()}>
              Go somewhere
            </a>
          )}
          variant="ghost"
        />
      </Section>
    </div>
  );
}
