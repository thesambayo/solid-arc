import { createListCollection } from "@ark-ui/solid/combobox";
import { createFileRoute } from "@tanstack/solid-router";
import { createSignal, For } from "solid-js";

import {
  Combobox,
  ComboboxLabel,
  ComboboxControl,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxClearTrigger,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxItemText,
  ComboboxItemIndicator,
  ComboboxItemGroup,
  ComboboxItemGroupLabel,
} from "../../components/ui/combobox";

export const Route = createFileRoute("/previews/combobox")({
  component: RouteComponent,
});

const ALL_FRAMEWORKS = [
  "SolidJS",
  "React",
  "Vue",
  "Svelte",
  "Angular",
  "Preact",
  "Qwik",
];

const GROUPED_ITEMS = [
  { label: "SolidJS", value: "solid", group: "Reactive" },
  { label: "Vue", value: "vue", group: "Reactive" },
  { label: "React", value: "react", group: "Virtual DOM" },
  { label: "Preact", value: "preact", group: "Virtual DOM" },
];

function BasicCombobox() {
  const [items, setItems] = createSignal(ALL_FRAMEWORKS);
  const collection = () => createListCollection({ items: items() });

  return (
    <Combobox
      collection={collection()}
      onInputValueChange={({ inputValue }) =>
        setItems(
          ALL_FRAMEWORKS.filter((f) =>
            f.toLowerCase().includes(inputValue.toLowerCase()),
          ),
        )
      }
    >
      <ComboboxLabel>Framework</ComboboxLabel>
      <ComboboxControl>
        <ComboboxInput placeholder="Search…" />
        <ComboboxClearTrigger />
        <ComboboxTrigger />
      </ComboboxControl>
      <ComboboxContent>
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <For each={collection().items}>
          {(item) => (
            <ComboboxItem item={item}>
              <ComboboxItemText>{item}</ComboboxItemText>
              <ComboboxItemIndicator />
            </ComboboxItem>
          )}
        </For>
      </ComboboxContent>
    </Combobox>
  );
}

function GroupedCombobox() {
  const [items, setItems] = createSignal(GROUPED_ITEMS);
  const collection = () =>
    createListCollection({
      items: items(),
      itemToString: (i) => i.label,
      itemToValue: (i) => i.value,
    });

  return (
    <Combobox
      collection={collection()}
      onInputValueChange={({ inputValue }) =>
        setItems(
          GROUPED_ITEMS.filter((f) =>
            f.label.toLowerCase().includes(inputValue.toLowerCase()),
          ),
        )
      }
    >
      <ComboboxLabel>Framework (grouped)</ComboboxLabel>
      <ComboboxControl>
        <ComboboxInput placeholder="Search…" />
        <ComboboxClearTrigger />
        <ComboboxTrigger />
      </ComboboxControl>
      <ComboboxContent>
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <ComboboxItemGroup>
          <ComboboxItemGroupLabel>Reactive</ComboboxItemGroupLabel>
          <For each={items().filter((i) => i.group === "Reactive")}>
            {(item) => (
              <ComboboxItem item={item}>
                <ComboboxItemText>{item.label}</ComboboxItemText>
                <ComboboxItemIndicator />
              </ComboboxItem>
            )}
          </For>
        </ComboboxItemGroup>
        <ComboboxItemGroup>
          <ComboboxItemGroupLabel>Virtual DOM</ComboboxItemGroupLabel>
          <For each={items().filter((i) => i.group === "Virtual DOM")}>
            {(item) => (
              <ComboboxItem item={item}>
                <ComboboxItemText>{item.label}</ComboboxItemText>
                <ComboboxItemIndicator />
              </ComboboxItem>
            )}
          </For>
        </ComboboxItemGroup>
      </ComboboxContent>
    </Combobox>
  );
}

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      <div class="max-w-sm">{props.children}</div>
    </div>
  );
}

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Combobox</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Searchable select built on Ark UI.
        </p>
      </div>

      <Section title="Basic">
        <BasicCombobox />
      </Section>

      <Section title="Grouped items">
        <GroupedCombobox />
      </Section>
    </div>
  );
}
