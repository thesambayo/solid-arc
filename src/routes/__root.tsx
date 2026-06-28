import { TanStackDevtools } from "@tanstack/solid-devtools";
import { formDevtoolsPlugin } from "@tanstack/solid-form-devtools";
import { Outlet, createRootRoute } from "@tanstack/solid-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/solid-router-devtools";
import { Show } from "solid-js";

import { Toaster } from "../components/ui/toast";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      {/* Toaster mounts once for all routes (auth, dashboard, onboarding). */}
      <Toaster richColors />
      <Outlet />
      <Show when={import.meta.env.DEV}>
        <TanStackDevtools
          plugins={[
            formDevtoolsPlugin(),
            {
              name: "TanStack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
          config={{
            position: "bottom-right",
          }}
        />
      </Show>
    </>
  );
}
