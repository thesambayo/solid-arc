import { createFileRoute } from "@tanstack/solid-router";
import { CommandIcon } from "lucide-solid";

import { Kbd, KbdGroup } from "../../components/ui/kbd";

export const Route = createFileRoute("/previews/kbd")({
  component: RouteComponent,
});

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      <div class="flex flex-wrap items-center gap-3">{props.children}</div>
    </div>
  );
}

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Kbd</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Keyboard shortcut display.
        </p>
      </div>

      <Section title="Single keys">
        <Kbd>K</Kbd>
        <Kbd>Enter</Kbd>
        <Kbd>Esc</Kbd>
        <Kbd>Tab</Kbd>
        <Kbd>Space</Kbd>
      </Section>

      <Section title="With icon">
        <Kbd>
          <CommandIcon />
        </Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>⌥</Kbd>
      </Section>

      <Section title="Key combinations">
        <KbdGroup>
          <Kbd>
            <CommandIcon />
          </Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>⇧</Kbd>
          <Kbd>⌘</Kbd>
          <Kbd>P</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>C</Kbd>
        </KbdGroup>
      </Section>
    </div>
  );
}
