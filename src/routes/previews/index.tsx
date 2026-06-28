import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/previews/")({
  component: PreviewsIndex,
});

function PreviewsIndex() {
  return (
    <div class="p-8">
      <p class="text-sm text-muted-foreground">
        Select a component from the sidebar.
      </p>
    </div>
  );
}
