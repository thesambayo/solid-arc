import { createForm } from "@tanstack/solid-form";
import { createFileRoute } from "@tanstack/solid-router";
import { Show } from "solid-js";
import { z } from "zod";

import { Button } from "../../../components/ui/button";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "../../../components/ui/field";
import { Input } from "../../../components/ui/input";
import { Spinner } from "../../../components/ui/spinner";

export const Route = createFileRoute("/previews/forms/async-validation")({
  component: AsyncValidationPage,
});

// ─── Simulated server check ───────────────────────────────────────────────────
// In a real app this would be a fetch() call.

const TAKEN_NAMES = ["my-monitor", "prod-api", "taken"];

async function checkNameAvailability(
  name: string,
): Promise<string | undefined> {
  await new Promise((r) => setTimeout(r, 800));
  if (TAKEN_NAMES.includes(name.toLowerCase())) {
    return `"${name}" is already taken`;
  }
  return undefined;
}

// ─── Monitor name form ────────────────────────────────────────────────────────

function MonitorNameForm() {
  const form = createForm(() => ({
    defaultValues: { name: "", url: "" },
    onSubmit: async ({ value }) => {
      alert(JSON.stringify(value, null, 2));
    },
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class="flex max-w-sm flex-col gap-5"
    >
      {/*
       * Async validation flow:
       *
       * 1. onChange (sync) runs first — must pass before async is even attempted.
       * 2. After asyncDebounceMs of idle time, onChangeAsync fires.
       * 3. While waiting: field().state.meta.isValidating === true.
       * 4. Error returned from async validator lands in state.meta.errors like any other.
       *
       * Try: "taken", "my-monitor", or "prod-api" to trigger the async error.
       */}
      <form.Field
        name="name"
        asyncDebounceMs={500}
        validators={{
          onChange: z.string().min(2, "At least 2 characters"),
          onChangeAsync: async ({ value }) => checkNameAvailability(value),
        }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0} required>
            <FieldLabel>Monitor name</FieldLabel>
            <div class="relative">
              <Input
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                onBlur={field().handleBlur}
                placeholder="my-api-monitor"
                // Pad right side so text doesn't flow under the spinner
                class="pr-9"
              />
              {/*
               * isValidating is true while the async check is in-flight.
               * The sync validator already passed at this point.
               */}
              <Show when={field().state.meta.isValidating}>
                <Spinner class="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
              </Show>
            </div>
            <FieldDescription>
              Try "taken", "my-monitor", or "prod-api" — they're reserved.
            </FieldDescription>
            <FieldError>
              {/* Async validators can return either a Zod issue or a plain string — handle both */}
              {(() => {
                const e = field().state.meta.errors[0];
                return typeof e === "string" ? e : e?.message;
              })()}
            </FieldError>
          </Field>
        )}
      </form.Field>

      <form.Field
        name="url"
        validators={{ onChange: z.string().url("Must be a valid URL") }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0} required>
            <FieldLabel>URL</FieldLabel>
            <Input
              value={field().state.value}
              onInput={(e) => field().handleChange(e.currentTarget.value)}
              onBlur={field().handleBlur}
              placeholder="https://api.example.com/health"
              type="url"
            />
            <FieldError>
              {/* Async validators can return either a Zod issue or a plain string — handle both */}
              {(() => {
                const e = field().state.meta.errors[0];
                return typeof e === "string" ? e : e?.message;
              })()}
            </FieldError>
          </Field>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {(state) => (
          <Button
            type="submit"
            disabled={!state().canSubmit}
            loading={state().isSubmitting}
            loadingText="Saving..."
            class="self-start"
          >
            Create monitor
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function AsyncValidationPage() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Async validation</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Field-level async validation with debouncing. The sync check runs
          first; the async check only fires if sync passes.
        </p>
      </div>

      <div class="space-y-1.5 rounded-xl border border-border bg-muted/30 p-4 text-sm">
        <p class="font-medium text-foreground">How it works</p>
        <p class="text-muted-foreground">
          <code class="rounded bg-muted px-1 py-0.5 text-xs">
            asyncDebounceMs={500}
          </code>{" "}
          — waits 500 ms of idle time before firing the async check. Keeps you
          from hitting the server on every keystroke.
        </p>
        <p class="text-muted-foreground">
          <code class="rounded bg-muted px-1 py-0.5 text-xs">
            field().state.meta.isValidating
          </code>{" "}
          — true while the async check is in-flight. Use it to show a spinner.
        </p>
        <p class="text-muted-foreground">
          Sync{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">onChange</code>{" "}
          runs first. If it fails, the async check is skipped entirely.
        </p>
      </div>

      <MonitorNameForm />
    </div>
  );
}
