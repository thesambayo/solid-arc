import { createForm } from "@tanstack/solid-form";
import { createFileRoute } from "@tanstack/solid-router";
import { XIcon, PlusIcon } from "lucide-solid";
import { Index, Show } from "solid-js";
import { z } from "zod";

import { Button } from "../../../components/ui/button";
import { Field, FieldLabel, FieldError } from "../../../components/ui/field";
import { Input } from "../../../components/ui/input";

export const Route = createFileRoute("/previews/forms/array-fields")({
  component: ArrayFieldsPage,
});

// ─── Monitor endpoints form ───────────────────────────────────────────────────

function MonitorEndpointsForm() {
  const form = createForm(() => ({
    defaultValues: {
      name: "",
      urls: [""] as string[],
    },
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
      class="flex max-w-lg flex-col gap-5"
    >
      {/* ── Scalar field ─────────────────────────────────────────────────── */}
      <form.Field
        name="name"
        validators={{ onChange: z.string().min(2, "At least 2 characters") }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0} required>
            <FieldLabel>Monitor name</FieldLabel>
            <Input
              value={field().state.value}
              onInput={(e) => field().handleChange(e.currentTarget.value)}
              onBlur={field().handleBlur}
              placeholder="my-api-monitor"
            />
            <FieldError>{field().state.meta.errors[0]?.message}</FieldError>
          </Field>
        )}
      </form.Field>

      {/* ── Array field ───────────────────────────────────────────────────── */}
      {/*
       * mode="array" unlocks field().pushValue() and field().removeValue(i).
       *
       * IMPORTANT: use Index (not For) from solid-js.
       * For re-creates components when the array mutates, which destroys the
       * subfield's internal state and clears its value.
       * Index keeps components stable by index position.
       */}
      <form.Field name="urls" mode="array">
        {(field) => (
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">
                Endpoints
                <span class="ml-1 text-destructive" aria-hidden>
                  *
                </span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => field().pushValue("")}
                class="gap-1.5"
              >
                <PlusIcon class="size-3.5" />
                Add URL
              </Button>
            </div>

            <Show
              when={(field().state.value as string[]).length > 0}
              fallback={
                <p class="py-2 text-sm text-muted-foreground">
                  No endpoints yet — click "Add URL" to start.
                </p>
              }
            >
              <Index each={field().state.value as string[]}>
                {(_, i) => (
                  /*
                   * Sub-field name uses bracket notation: urls[0], urls[1], etc.
                   * Each sub-field gets its own independent validation state.
                   */
                  <form.Field
                    name={`urls[${i}]`}
                    validators={{
                      onChange: z
                        .string()
                        .min(1, "URL is required")
                        .url("Must be a valid URL"),
                    }}
                  >
                    {(subField) => (
                      <Field invalid={subField().state.meta.errors.length > 0}>
                        <div class="flex items-start gap-2">
                          <div class="flex-1">
                            <Input
                              value={subField().state.value as string}
                              onInput={(e) =>
                                subField().handleChange(e.currentTarget.value)
                              }
                              onBlur={subField().handleBlur}
                              placeholder="https://api.example.com/health"
                              type="url"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => field().removeValue(i)}
                            aria-label={`Remove URL ${i + 1}`}
                            class="mt-0 shrink-0"
                          >
                            <XIcon class="size-4" />
                          </Button>
                        </div>
                        <FieldError>
                          {subField().state.meta.errors[0]?.message}
                        </FieldError>
                      </Field>
                    )}
                  </form.Field>
                )}
              </Index>
            </Show>
          </div>
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

function ArrayFieldsPage() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Array fields</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Dynamic lists where items can be added and removed. Each item is its
          own sub-field with independent validation.
        </p>
      </div>

      <div class="space-y-1.5 rounded-xl border border-border bg-muted/30 p-4 text-sm">
        <p class="font-medium text-foreground">Two things to remember</p>
        <p class="text-muted-foreground">
          1.{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">mode="array"</code>{" "}
          on the parent field unlocks{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">pushValue</code>{" "}
          and{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">removeValue</code>.
        </p>
        <p class="text-muted-foreground">
          2. Use{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">
            &lt;Index&gt;
          </code>{" "}
          from solid-js, not{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">&lt;For&gt;</code>.{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">For</code>{" "}
          re-creates components on every mutation and clears field values.
        </p>
      </div>

      <MonitorEndpointsForm />
    </div>
  );
}
