import { createFileRoute } from "@tanstack/solid-router";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../components/ui/accordion";

export const Route = createFileRoute("/previews/accordion")({
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
        <h1 class="text-lg font-semibold">Accordion</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Collapsible sectionsss.
        </p>
      </div>

      <Section title="Single open (default)">
        <Accordion class="rounded-lg border border-border px-4">
          <AccordionItem value="q1">
            <AccordionTrigger>What is Argus?</AccordionTrigger>
            <AccordionContent>
              Argus is a URL uptime monitor. It checks your endpoints on a
              schedule and alerts you when something goes down.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>How often does it check?</AccordionTrigger>
            <AccordionContent>
              Every 30s, 1m, or 5m — your choice per monitor.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>What counts as "down"?</AccordionTrigger>
            <AccordionContent>
              A non-2xx status code or a timeout after the configured threshold.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="Multiple open">
        <Accordion multiple class="rounded-lg border border-border px-4">
          <AccordionItem value="a1">
            <AccordionTrigger>Section one</AccordionTrigger>
            <AccordionContent>
              Both sections can be open at the same time.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="a2">
            <AccordionTrigger>Section two</AccordionTrigger>
            <AccordionContent>
              Opening one does not close the other.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>
    </div>
  );
}
