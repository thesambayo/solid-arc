import { createFileRoute, Link, Outlet } from "@tanstack/solid-router";

import { cn } from "../../lib/cn";

export const Route = createFileRoute("/previews/forms")({
  component: FormsLayout,
});

const sections = [
  { to: "/previews/forms/basic", label: "Basic" },
  { to: "/previews/forms/validation-timing", label: "Validation timing" },
  { to: "/previews/forms/custom-controls", label: "Custom controls" },
  { to: "/previews/forms/select", label: "Select" },
  { to: "/previews/forms/date-picker", label: "Date picker" },
  { to: "/previews/forms/tags-input", label: "Tags input" },
  { to: "/previews/forms/array-fields", label: "Array fields" },
  { to: "/previews/forms/async-validation", label: "Async validation" },
  { to: "/previews/forms/slider", label: "Slider" },
  { to: "/previews/forms/file-upload", label: "File upload" },
] as const;

function FormsLayout() {
  return (
    <div class="flex min-h-screen">
      <aside class="flex w-48 shrink-0 flex-col gap-0.5 border-r border-border p-4">
        <p class="mb-2 px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Forms
        </p>
        {sections.map((s) => (
          <Link
            to={s.to}
            class={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted",
            )}
            activeProps={{ class: "bg-muted font-medium" }}
          >
            {s.label}
          </Link>
        ))}
      </aside>
      <div class="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
