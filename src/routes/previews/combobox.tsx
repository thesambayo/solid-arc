import { useAsyncList } from "@ark-ui/solid/collection";
import {
  type ComboboxInputValueChangeDetails,
  type ComboboxOpenChangeDetails,
  type ComboboxValueChangeDetails,
  createListCollection,
  useListCollection,
} from "@ark-ui/solid/combobox";
import { useFilter } from "@ark-ui/solid/locale";
import { createFileRoute } from "@tanstack/solid-router";
import { LoaderIcon } from "lucide-solid";
import { createMemo, For, Show } from "solid-js";

import {
  Combobox,
  ComboboxClearTrigger,
  ComboboxContent,
  ComboboxContext,
  ComboboxControl,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemGroup,
  ComboboxItemGroupLabel,
  ComboboxItemIndicator,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxTrigger,
} from "../../components/ui/combobox";

export const Route = createFileRoute("/previews/combobox")({
  component: RouteComponent,
});

// After a value is selected, the input holds the selected label and the
// collection stays filtered to it — so reopening would show only that one item.
// Reset the filter when the popup opens via a click (but not while typing).
function resetFilterOnOpen(filter: (value: string) => void) {
  return (e: ComboboxOpenChangeDetails) => {
    if (e.reason === "input-click" || e.reason === "trigger-click") filter("");
  };
}

function Section(props: {
  title: string;
  description?: string;
  children: any;
}) {
  return (
    <div class="flex flex-col gap-3">
      <div>
        <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {props.title}
        </p>
        <Show when={props.description}>
          <p class="mt-0.5 text-xs text-muted-foreground">
            {props.description}
          </p>
        </Show>
      </div>
      <div class="max-w-sm">{props.children}</div>
    </div>
  );
}

// ─── Basic ──────────────────────────────────────────────────────────────────

function BasicCombobox() {
  const filterFn = useFilter({ sensitivity: "base" });
  const { collection, filter } = useListCollection({
    initialItems: [
      { label: "SolidJS", value: "solid" },
      { label: "React", value: "react" },
      { label: "Vue", value: "vue" },
      { label: "Svelte", value: "svelte" },
      { label: "Angular", value: "angular" },
      { label: "Preact", value: "preact" },
      { label: "Qwik", value: "qwik" },
    ],
    filter: filterFn().contains,
  });

  return (
    <Combobox
      collection={collection()}
      onInputValueChange={(e) => filter(e.inputValue)}
      onOpenChange={resetFilterOnOpen(filter)}
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
              <ComboboxItemText>{item.label}</ComboboxItemText>
              <ComboboxItemIndicator />
            </ComboboxItem>
          )}
        </For>
      </ComboboxContent>
    </Combobox>
  );
}

// ─── Grouped ────────────────────────────────────────────────────────────────

function GroupedCombobox() {
  const filterFn = useFilter({ sensitivity: "base" });
  const { collection, filter } = useListCollection({
    initialItems: [
      { label: "SolidJS", value: "solid", group: "Reactive" },
      { label: "Vue", value: "vue", group: "Reactive" },
      { label: "Svelte", value: "svelte", group: "Reactive" },
      { label: "React", value: "react", group: "Virtual DOM" },
      { label: "Preact", value: "preact", group: "Virtual DOM" },
    ],
    filter: filterFn().contains,
    groupBy: (item) => item.group,
  });

  return (
    <Combobox
      collection={collection()}
      onInputValueChange={(e) => filter(e.inputValue)}
      onOpenChange={resetFilterOnOpen(filter)}
    >
      <ComboboxLabel>Framework (grouped)</ComboboxLabel>
      <ComboboxControl>
        <ComboboxInput placeholder="Search…" />
        <ComboboxClearTrigger />
        <ComboboxTrigger />
      </ComboboxControl>
      <ComboboxContent>
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <For each={collection().group()}>
          {([group, items]) => (
            <ComboboxItemGroup>
              <ComboboxItemGroupLabel>{group}</ComboboxItemGroupLabel>
              <For each={items}>
                {(item) => (
                  <ComboboxItem item={item}>
                    <ComboboxItemText>{item.label}</ComboboxItemText>
                    <ComboboxItemIndicator />
                  </ComboboxItem>
                )}
              </For>
            </ComboboxItemGroup>
          )}
        </For>
      </ComboboxContent>
    </Combobox>
  );
}

// ─── Multiple selection (tags) ──────────────────────────────────────────────

function MultipleCombobox() {
  const filterFn = useFilter({ sensitivity: "base" });
  const { collection, filter } = useListCollection({
    initialItems: [
      { label: "JavaScript", value: "js" },
      { label: "TypeScript", value: "ts" },
      { label: "Python", value: "python" },
      { label: "Go", value: "go" },
      { label: "Rust", value: "rust" },
      { label: "Java", value: "java" },
    ],
    filter: filterFn().contains,
  });

  return (
    <Combobox
      multiple
      collection={collection()}
      onInputValueChange={(e) => filter(e.inputValue)}
      onOpenChange={resetFilterOnOpen(filter)}
    >
      <ComboboxLabel>Skills</ComboboxLabel>
      <ComboboxContext>
        {(combobox) => (
          <div class="mb-1.5 flex flex-wrap gap-1">
            <Show
              when={combobox().selectedItems.length > 0}
              fallback={
                <span class="text-xs text-muted-foreground">None selected</span>
              }
            >
              <For
                each={
                  combobox().selectedItems as { label: string; value: string }[]
                }
              >
                {(item) => (
                  <span class="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium">
                    {item.label}
                  </span>
                )}
              </For>
            </Show>
          </div>
        )}
      </ComboboxContext>
      <ComboboxControl>
        <ComboboxInput placeholder="e.g. TypeScript" />
        <ComboboxTrigger />
      </ComboboxControl>
      <ComboboxContent>
        <ComboboxEmpty>No skills found.</ComboboxEmpty>
        <For each={collection().items}>
          {(item) => (
            <ComboboxItem item={item}>
              <ComboboxItemText>{item.label}</ComboboxItemText>
              <ComboboxItemIndicator />
            </ComboboxItem>
          )}
        </For>
      </ComboboxContent>
    </Combobox>
  );
}

// ─── Creatable (+ persist new options to a "backend") ───────────────────────

interface Tag {
  label: string;
  value: string;
  __new__?: boolean;
}

const NEW_OPTION = "[[new]]";

// Pretend API — in real life this POSTs and returns the saved record.
async function saveTagToBackend(label: string): Promise<Tag> {
  await new Promise((r) => setTimeout(r, 400));
  return { label, value: label.toLowerCase().replace(/\s+/g, "-") };
}

function CreatableCombobox() {
  const filterFn = useFilter({ sensitivity: "base" });
  const { collection, filter, upsert, update, remove } = useListCollection<Tag>(
    {
      initialItems: [
        { label: "Bug", value: "bug" },
        { label: "Feature", value: "feature" },
        { label: "Enhancement", value: "enhancement" },
        { label: "Documentation", value: "docs" },
      ],
      filter: filterFn().contains,
    },
  );

  let inputValue = "";

  const isValidNewOption = (value: string) => {
    const v = value.trim().toLowerCase();
    if (!v) return false;
    return !collection().items.some((i) => i.label.toLowerCase() === v);
  };

  const handleInputChange = (e: ComboboxInputValueChangeDetails) => {
    if (e.reason === "input-change" || e.reason === "item-select") {
      if (isValidNewOption(e.inputValue)) {
        // Show a synthetic "+ Create" row at the top.
        upsert(NEW_OPTION, { label: e.inputValue, value: NEW_OPTION });
      } else {
        remove(NEW_OPTION);
      }
      filter(e.inputValue);
    }
    inputValue = e.inputValue;
  };

  const handleValueChange = async (e: ComboboxValueChangeDetails<Tag>) => {
    if (!e.value.includes(NEW_OPTION)) return;
    const label = inputValue.trim();
    // Persist, then swap the synthetic row for the real saved record.
    const saved = await saveTagToBackend(label);
    update(NEW_OPTION, { ...saved, __new__: true });
  };

  return (
    <Combobox
      allowCustomValue
      collection={collection()}
      onInputValueChange={handleInputChange}
      onValueChange={handleValueChange}
      onOpenChange={resetFilterOnOpen(filter)}
    >
      <ComboboxLabel>Labels</ComboboxLabel>
      <ComboboxControl>
        <ComboboxInput placeholder="e.g. Bug — or type a new one" />
        <ComboboxClearTrigger />
        <ComboboxTrigger />
      </ComboboxControl>
      <ComboboxContent>
        <ComboboxEmpty>Type to create a label.</ComboboxEmpty>
        <For each={collection().items}>
          {(item) => (
            <ComboboxItem item={item}>
              <Show
                when={item.value === NEW_OPTION}
                fallback={
                  <ComboboxItemText>
                    {item.label}
                    <Show when={item.__new__}>
                      <span class="ml-1 text-xs text-muted-foreground">
                        (new)
                      </span>
                    </Show>
                  </ComboboxItemText>
                }
              >
                <ComboboxItemText>+ Create “{item.label}”</ComboboxItemText>
              </Show>
              <ComboboxItemIndicator />
            </ComboboxItem>
          )}
        </For>
      </ComboboxContent>
    </Combobox>
  );
}

// ─── Async search ───────────────────────────────────────────────────────────

interface Movie {
  id: string;
  title: string;
  year: number;
  director: string;
}

const ALL_MOVIES: Movie[] = [
  { id: "inception", title: "Inception", year: 2010, director: "C. Nolan" },
  {
    id: "dark-knight",
    title: "The Dark Knight",
    year: 2008,
    director: "C. Nolan",
  },
  {
    id: "pulp-fiction",
    title: "Pulp Fiction",
    year: 1994,
    director: "Q. Tarantino",
  },
  {
    id: "godfather",
    title: "The Godfather",
    year: 1972,
    director: "F. Coppola",
  },
  { id: "matrix", title: "The Matrix", year: 1999, director: "The Wachowskis" },
  {
    id: "interstellar",
    title: "Interstellar",
    year: 2014,
    director: "C. Nolan",
  },
  { id: "parasite", title: "Parasite", year: 2019, director: "Bong Joon-ho" },
  {
    id: "goodfellas",
    title: "Goodfellas",
    year: 1990,
    director: "M. Scorsese",
  },
];

function AsyncCombobox() {
  const list = useAsyncList<Movie>({
    async load({ filterText, signal }) {
      if (!filterText) return { items: [] };
      await new Promise((r) => setTimeout(r, 350));
      if (signal?.aborted) return { items: [] };
      const q = filterText.toLowerCase();
      return {
        items: ALL_MOVIES.filter(
          (m) =>
            m.title.toLowerCase().includes(q) ||
            m.director.toLowerCase().includes(q),
        ),
      };
    },
  });

  const collection = createMemo(() =>
    createListCollection({
      items: list().items,
      itemToString: (m) => m.title,
      itemToValue: (m) => m.id,
    }),
  );

  return (
    <Combobox
      collection={collection()}
      onInputValueChange={(e) => {
        if (e.reason === "input-change") list().setFilterText(e.inputValue);
      }}
    >
      <ComboboxLabel>Movie</ComboboxLabel>
      <ComboboxControl>
        <ComboboxInput placeholder="e.g. Inception" />
        <ComboboxClearTrigger />
        <ComboboxTrigger />
      </ComboboxControl>
      <ComboboxContent>
        <Show
          when={!list().loading}
          fallback={
            <div class="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
              <LoaderIcon class="size-4 animate-spin" />
              Searching…
            </div>
          }
        >
          <ComboboxEmpty>
            {list().filterText ? "No results." : "Start typing to search…"}
          </ComboboxEmpty>
          <For each={collection().items}>
            {(movie) => (
              <ComboboxItem item={movie}>
                <ComboboxItemText class="flex flex-col">
                  <span>{movie.title}</span>
                  <span class="text-xs text-muted-foreground">
                    {movie.year} · {movie.director}
                  </span>
                </ComboboxItemText>
                <ComboboxItemIndicator />
              </ComboboxItem>
            )}
          </For>
        </Show>
      </ComboboxContent>
    </Combobox>
  );
}

// ─── Custom object (itemToString / itemToValue) ─────────────────────────────

function CustomObjectCombobox() {
  const filterFn = useFilter({ sensitivity: "base" });
  const { collection, filter } = useListCollection({
    initialItems: [
      { country: "United States", code: "US", flag: "🇺🇸" },
      { country: "Canada", code: "CA", flag: "🇨🇦" },
      { country: "Australia", code: "AU", flag: "🇦🇺" },
      { country: "Germany", code: "DE", flag: "🇩🇪" },
      { country: "Japan", code: "JP", flag: "🇯🇵" },
    ],
    itemToString: (item) => item.country,
    itemToValue: (item) => item.code,
    filter: filterFn().contains,
  });

  return (
    <Combobox
      collection={collection()}
      onInputValueChange={(e) => filter(e.inputValue)}
      onOpenChange={resetFilterOnOpen(filter)}
    >
      <ComboboxLabel>Country</ComboboxLabel>
      <ComboboxControl>
        <ComboboxInput placeholder="e.g. Canada" />
        <ComboboxClearTrigger />
        <ComboboxTrigger />
      </ComboboxControl>
      <ComboboxContent>
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <For each={collection().items}>
          {(item) => (
            <ComboboxItem item={item}>
              <ComboboxItemText>
                {item.flag} {item.country}
              </ComboboxItemText>
              <ComboboxItemIndicator />
            </ComboboxItem>
          )}
        </For>
      </ComboboxContent>
    </Combobox>
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

      <Section
        title="Multiple"
        description="Selected items render as tags above the input."
      >
        <MultipleCombobox />
      </Section>

      <Section
        title="Creatable"
        description="Type a new value to create it; new options persist to a mock backend."
      >
        <CreatableCombobox />
      </Section>

      <Section
        title="Async search"
        description="Loads results from an async source with a loading state."
      >
        <AsyncCombobox />
      </Section>

      <Section
        title="Custom object"
        description="Maps arbitrary objects via itemToString / itemToValue."
      >
        <CustomObjectCombobox />
      </Section>
    </div>
  );
}
