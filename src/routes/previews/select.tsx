import { createListCollection } from "@ark-ui/solid/collection";
import { createFileRoute } from "@tanstack/solid-router";
import { Index } from "solid-js";

import {
  Select,
  SelectTrigger,
  SelectValueText,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectControl,
  SelectItemGroup,
  SelectItemGroupLabel,
  SelectEmpty,
} from "../../components/ui/select";
import { SelectSeparator } from "../../components/ui/select/select";

export const Route = createFileRoute("/previews/select")({
  component: RouteComponent,
});

const frameworks = createListCollection({
  items: [
    { label: "React", value: "react" },
    { label: "Solid", value: "solid" },
    { label: "Vue", value: "vue" },
    { label: "Svelte", value: "svelte" },
  ],
});

const intervals = createListCollection({
  items: [
    { label: "Every 30 seconds", value: "30s" },
    { label: "Every 1 minute", value: "1m" },
    { label: "Every 5 minutes", value: "5m" },
    { label: "Every 15 minutes", value: "15m" },
  ],
});

const grouped = createListCollection({
  items: [
    { label: "SolidJS", value: "solid", group: "Reactive" },
    { label: "Vue", value: "vue", group: "Reactive" },
    { label: "React", value: "react", group: "Virtual DOM" },
    { label: "Preact", value: "preact", group: "Virtual DOM" },
  ],
});

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      <div class="flex max-w-sm flex-col gap-4">{props.children}</div>
    </div>
  );
}

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Select</h1>
        <p class="mt-1 text-sm text-muted-foreground">Built on Ark UI.</p>
      </div>

      <Section title="Basic">
        <Select collection={frameworks}>
          <SelectLabel>Framework</SelectLabel>
          <SelectControl>
            <SelectTrigger>
              <SelectValueText placeholder="Pick one" />
            </SelectTrigger>
          </SelectControl>
          <SelectContent>
            <Index each={frameworks.items}>
              {(item) => <SelectItem item={item()}>{item().label}</SelectItem>}
            </Index>
          </SelectContent>
        </Select>
      </Section>

      <Section title="Object items">
        <Select collection={intervals}>
          <SelectLabel>Check interval</SelectLabel>
          <SelectControl>
            <SelectTrigger>
              <SelectValueText placeholder="Select interval" />
            </SelectTrigger>
          </SelectControl>
          <SelectContent>
            <Index each={intervals.items}>
              {(item) => <SelectItem item={item()}>{item().label}</SelectItem>}
            </Index>
          </SelectContent>
        </Select>
      </Section>

      <Section title="No clear button">
        <Select collection={frameworks}>
          <SelectLabel>Framework</SelectLabel>
          <SelectControl clearTrigger={false}>
            <SelectTrigger>
              <SelectValueText placeholder="Pick one" />
            </SelectTrigger>
          </SelectControl>
          <SelectContent>
            <Index each={frameworks.items}>
              {(item) => <SelectItem item={item()}>{item().label}</SelectItem>}
            </Index>
          </SelectContent>
        </Select>
      </Section>

      <Section title="With empty state">
        <Select collection={createListCollection({ items: [] })}>
          <SelectLabel>Framework</SelectLabel>
          <SelectControl>
            <SelectTrigger>
              <SelectValueText placeholder="Pick one" />
            </SelectTrigger>
          </SelectControl>
          <SelectContent>
            <SelectEmpty>No frameworks found</SelectEmpty>
          </SelectContent>
        </Select>
      </Section>

      <Section title="With groups">
        <Select collection={grouped}>
          <SelectLabel>Framework</SelectLabel>
          <SelectControl>
            <SelectTrigger>
              <SelectValueText placeholder="Pick one" />
            </SelectTrigger>
          </SelectControl>
          <SelectContent>
            <SelectItemGroup>
              <SelectItemGroupLabel>Reactive</SelectItemGroupLabel>
              {grouped.items
                .filter((i) => i.group === "Reactive")
                .map((item) => (
                  <SelectItem item={item}>{item.label}</SelectItem>
                ))}
            </SelectItemGroup>
            <SelectSeparator />
            <SelectItemGroup>
              <SelectItemGroupLabel>Virtual DOM</SelectItemGroupLabel>
              {grouped.items
                .filter((i) => i.group === "Virtual DOM")
                .map((item) => (
                  <SelectItem item={item}>{item.label}</SelectItem>
                ))}
            </SelectItemGroup>
          </SelectContent>
        </Select>
      </Section>

      <Section title="Multi-select">
        <Select collection={frameworks} multiple>
          <SelectLabel>Frameworks</SelectLabel>
          <SelectControl>
            <SelectTrigger>
              <SelectValueText placeholder="Pick any" />
            </SelectTrigger>
          </SelectControl>
          <SelectContent>
            <Index each={frameworks.items}>
              {(item) => <SelectItem item={item()}>{item().label}</SelectItem>}
            </Index>
          </SelectContent>
        </Select>
      </Section>
    </div>
  );
}
