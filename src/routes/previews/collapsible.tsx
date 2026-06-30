import { createFileRoute } from "@tanstack/solid-router";
import { ChevronRightIcon } from "lucide-solid";
import { createSignal } from "solid-js";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleIndicator,
  CollapsibleTrigger,
} from "../../components/ui/collapsible";

export const Route = createFileRoute("/previews/collapsible")({
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

// Shared trigger styling: a full-width row with the label and a chevron indicator.
function Trigger(props: { children: any }) {
  return (
    <CollapsibleTrigger class="flex w-full items-center justify-between rounded-md px-1 text-sm font-medium hover:underline data-disabled:cursor-not-allowed data-disabled:no-underline data-disabled:opacity-50">
      {props.children}
      <CollapsibleIndicator>
        <ChevronRightIcon class="size-4" />
      </CollapsibleIndicator>
    </CollapsibleTrigger>
  );
}

function RouteComponent() {
  const [open, setOpen] = createSignal(false);

  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Collapsible</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          An interactive component which expands and collapses a panel.
        </p>
      </div>

      <Section title="Basic">
        <Collapsible class="w-80 gap-2">
          <Trigger>What is Ark UI?</Trigger>
          <CollapsibleContent class="px-1 text-muted-foreground">
            A headless component library for building accessible, high-quality
            UI components for React, Solid, Vue, and Svelte.
          </CollapsibleContent>
        </Collapsible>
      </Section>

      <Section title="Disabled">
        <Collapsible disabled class="w-80 gap-2">
          <Trigger>System requirements</Trigger>
          <CollapsibleContent class="px-1 text-muted-foreground">
            This section is currently unavailable.
          </CollapsibleContent>
        </Collapsible>
      </Section>

      <Section title="Partial collapse">
        <Collapsible collapsedHeight="3.5rem" class="w-80 gap-2">
          <Trigger>Read more</Trigger>
          <CollapsibleContent class="flex flex-col gap-2 px-1 text-muted-foreground">
            <p>
              Ark UI is a headless component library for building accessible,
              high-quality UI components. It provides unstyled, fully accessible
              primitives that you customize to match your design system.
            </p>
            <p>
              Built on Zag.js state machines, it ensures consistent behavior
              across frameworks while giving you complete control over styling.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </Section>

      <Section title="Nested">
        <Collapsible class="w-80 gap-2">
          <Trigger>Getting started</Trigger>
          <CollapsibleContent class="flex flex-col gap-2 px-1 text-muted-foreground">
            <p>Some topics to explore:</p>
            <Collapsible class="gap-1 border-l border-border pl-3">
              <Trigger>Installation</Trigger>
              <CollapsibleContent class="px-1">
                <code class="text-xs text-foreground">
                  npm install @ark-ui/solid
                </code>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible class="gap-1 border-l border-border pl-3">
              <Trigger>Styling</Trigger>
              <CollapsibleContent class="px-1">
                Components are unstyled by default — use Tailwind, CSS modules,
                or any solution.
              </CollapsibleContent>
            </Collapsible>
          </CollapsibleContent>
        </Collapsible>
      </Section>

      <Section title="Controlled">
        <Collapsible
          open={open()}
          onOpenChange={(e) => setOpen(e.open)}
          class="w-80 gap-2"
        >
          <Trigger>Toggle details</Trigger>
          <CollapsibleContent class="px-1 text-muted-foreground">
            This panel's open state lives in a signal.
          </CollapsibleContent>
        </Collapsible>
        <p class="mt-2 text-xs text-muted-foreground">
          State:{" "}
          <span class="font-mono text-foreground">
            {open() ? "open" : "closed"}
          </span>
        </p>
      </Section>
    </div>
  );
}
