import { createListCollection } from "@ark-ui/solid/select";
import { createForm } from "@tanstack/solid-form";
import { createFileRoute } from "@tanstack/solid-router";
import { type JSX } from "solid-js";
import { z } from "zod";

import { Button } from "../../../components/ui/button";
import { Field, FieldLabel, FieldError } from "../../../components/ui/field";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectControl,
  SelectTrigger,
  SelectValueText,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";

export const Route = createFileRoute("/previews/forms/basic")({
  component: BasicFormPage,
});

// ─── Shared collection used by both forms ─────────────────────────────────────

const intervalCollection = createListCollection({
  items: [
    { label: "Every 1 minute", value: "1m" },
    { label: "Every 5 minutes", value: "5m" },
    { label: "Every 15 minutes", value: "15m" },
    { label: "Every 30 minutes", value: "30m" },
    { label: "Every hour", value: "1h" },
  ],
});

// ─── Form-level schema (only used by the second form) ─────────────────────────

const monitorSchema = z.object({
  name: z.string().min(2, "At least 2 characters"),
  url: z.url("Must be a valid URL"),
  interval: z.string().min(1, "Please select an interval"),
});

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section(props: {
  title: string;
  description: string;
  children: JSX.Element;
}) {
  return (
    <div class="flex flex-col gap-4">
      <div>
        <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {props.title}
        </p>
        <p class="mt-0.5 text-xs text-muted-foreground">{props.description}</p>
      </div>
      {props.children}
    </div>
  );
}

// ─── Part 1: field-level Zod ──────────────────────────────────────────────────
// Each form.Field declares its own validator. Errors live on the field itself.

function FieldLevelForm() {
  const form = createForm(() => ({
    defaultValues: { name: "", url: "", interval: "" },
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
      class="flex max-w-sm flex-col gap-4"
    >
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

      <form.Field
        name="url"
        validators={{ onChange: z.url("Must be a valid URL") }}
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
            <FieldError>{field().state.meta.errors[0]?.message}</FieldError>
          </Field>
        )}
      </form.Field>

      <form.Field
        name="interval"
        validators={{
          onChange: z.string().min(1, "Please select an interval"),
        }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0} required>
            <FieldLabel>Check interval</FieldLabel>
            <Select
              collection={intervalCollection}
              value={field().state.value ? [field().state.value] : []}
              onValueChange={(details) =>
                field().handleChange(details.value[0] ?? "")
              }
              onInteractOutside={() => field().handleBlur()}
            >
              <SelectControl>
                <SelectTrigger>
                  <SelectValueText placeholder="Select interval" />
                </SelectTrigger>
              </SelectControl>
              <SelectContent>
                {intervalCollection.items.map((item) => (
                  <SelectItem item={item}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError onClick={() => console.log(field().state)}>
              {field().state.meta.errors[0]?.message}
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

// ─── Part 2: form-level Zod ───────────────────────────────────────────────────
// One z.object schema on createForm. Individual fields need no validators —
// TanStack Form routes errors from the schema to each field automatically.

function FormLevelForm() {
  const form = createForm(() => ({
    defaultValues: { name: "", url: "", interval: "" },
    validators: { onChange: monitorSchema },
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
      class="flex max-w-sm flex-col gap-4"
    >
      {/* No validators on the fields — they arrive from the form-level schema */}
      <form.Field name="name">
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

      <form.Field name="url">
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
            <FieldError>{field().state.meta.errors[0]?.message}</FieldError>
          </Field>
        )}
      </form.Field>

      <form.Field name="interval">
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0} required>
            <FieldLabel>Check interval</FieldLabel>
            <Select
              collection={intervalCollection}
              value={field().state.value ? [field().state.value] : []}
              onValueChange={(details) =>
                field().handleChange(details.value[0] ?? "")
              }
              onInteractOutside={() => field().handleBlur()}
            >
              <SelectControl>
                <SelectTrigger>
                  <SelectValueText placeholder="Select interval" />
                </SelectTrigger>
              </SelectControl>
              <SelectContent>
                {intervalCollection.items.map((item) => (
                  <SelectItem item={item}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>{field().state.meta.errors[0]?.message}</FieldError>
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

function BasicFormPage() {
  return (
    <div class="flex max-w-2xl flex-col gap-10 p-8">
      <div>
        <h1 class="text-lg font-semibold">Basic form</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Two identical "Create Monitor" forms. One uses field-level Zod
          validators; the other uses a single form-level schema — the field
          bridge pattern is the same in both.
        </p>
      </div>

      <Section
        title="Field-level validation"
        description="Each form.Field declares its own validators prop. Errors belong to that field only."
      >
        <FieldLevelForm />
      </Section>

      <Section
        title="Form-level validation"
        description="One z.object schema on createForm's validators. Fields carry no validators — TanStack Form routes errors from the schema to each field automatically."
      >
        <FormLevelForm />
      </Section>
    </div>
  );
}
