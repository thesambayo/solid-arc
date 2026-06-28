import { createFileRoute, Link, Outlet } from "@tanstack/solid-router";
import { For } from "solid-js";

import { cn } from "../../lib/cn";

export const Route = createFileRoute("/previews")({
  component: PreviewsLayout,
});

const components = [
  "accordion",
  "alert",
  "avatar",
  "badge",
  "button",
  "button-groups",
  "card",
  "checkbox",
  "combobox",
  "command",
  "date-picker",
  "dialog",
  "dropdown-menu",
  "empty",
  "field",
  "file-upload",
  "forms",
  "hover-card",
  "input",
  "input-group",
  "kbd",
  "pagination",
  "popover",
  "radio-group",
  "select",
  "separator",
  "sheet",
  "slider",
  "spinner",
  "switch",
  "table",
  "tabs",
  "tags-input",
  "toast",
  "tooltip",
] as const;

function PreviewsLayout() {
  return (
    <div class="flex min-h-screen">
      <aside class="flex w-48 shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-border p-4">
        <Link
          to="/previews"
          class="mb-2 px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase hover:text-foreground"
          activeOptions={{ exact: true }}
        >
          Components
        </Link>
        <For each={components}>
          {(name) => (
            <Link
              to={`/previews/${name}`}
              class={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted",
              )}
              activeProps={{ class: "bg-muted font-medium" }}
            >
              {name}
            </Link>
          )}
        </For>
      </aside>
      <div class="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
