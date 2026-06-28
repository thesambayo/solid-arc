import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/previews/forms/")({
  component: FormsIndex,
});

function FormsIndex() {
  return (
    <div class="p-8">
      <p class="text-sm text-muted-foreground">
        Select an example from the sidebar.
      </p>
    </div>
  );
}
