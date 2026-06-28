import { createListCollection } from "@ark-ui/solid/select";
import { createForm } from "@tanstack/solid-form";
import { createFileRoute } from "@tanstack/solid-router";
import { type JSX } from "solid-js";
import { z } from "zod";

import { Button } from "../../../components/ui/button";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "../../../components/ui/field";
import {
  Select,
  SelectControl,
  SelectTrigger,
  SelectValueText,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemGroupLabel,
  SelectSeparator,
} from "../../../components/ui/select";

export const Route = createFileRoute("/previews/forms/select")({
  component: SelectPage,
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

// ─── Collections ─────────────────────────────────────────────────────────────

const intervalCollection = createListCollection({
  items: [
    { label: "Every 1 minute", value: "1m" },
    { label: "Every 5 minutes", value: "5m" },
    { label: "Every 15 minutes", value: "15m" },
    { label: "Every 30 minutes", value: "30m" },
    { label: "Every hour", value: "1h" },
  ],
});

const regionCollection = createListCollection({
  items: [
    {
      label: "US East (N. Virginia)",
      value: "us-east-1",
      group: "North America",
    },
    { label: "US West (Oregon)", value: "us-west-2", group: "North America" },
    { label: "EU West (Ireland)", value: "eu-west-1", group: "Europe" },
    { label: "EU Central (Frankfurt)", value: "eu-central-1", group: "Europe" },
    {
      label: "AP Southeast (Singapore)",
      value: "ap-southeast-1",
      group: "Asia Pacific",
    },
  ],
});

// ─── Single select ────────────────────────────────────────────────────────────
// Ark UI Select stores values as an array (supports multi-select).
// For single-select: read value[0], write [newValue].

function SingleSelectForm() {
  const form = createForm(() => ({
    defaultValues: { interval: "" },
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
        name="interval"
        validators={{
          onChange: z.string().min(1, "Please select an interval"),
        }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0} required>
            <FieldLabel>Check interval</FieldLabel>
            {/*
             * Ark UI Select quirks when used as a controlled component:
             *
             * value        — must be string[], so wrap the single value in an array
             * onValueChange — receives { value: string[] }, read [0] for single-select
             * onInteractOutside — the hook for registering "blur" (no native blur event)
             */}
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
                  <SelectValueText placeholder="Select an interval" />
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
            class="self-start"
          >
            Save
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── Select with grouped items ────────────────────────────────────────────────

function GroupedSelectForm() {
  const form = createForm(() => ({
    defaultValues: { region: "" },
    onSubmit: async ({ value }) => {
      alert(JSON.stringify(value, null, 2));
    },
  }));

  // Group items by their group label
  const groups = ["North America", "Europe", "Asia Pacific"];

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
        name="region"
        validators={{ onChange: z.string().min(1, "Please select a region") }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0} required>
            <FieldLabel>Check from region</FieldLabel>
            <Select
              collection={regionCollection}
              value={field().state.value ? [field().state.value] : []}
              onValueChange={(details) =>
                field().handleChange(details.value[0] ?? "")
              }
              onInteractOutside={() => field().handleBlur()}
            >
              <SelectControl>
                <SelectTrigger>
                  <SelectValueText placeholder="Select a region" />
                </SelectTrigger>
              </SelectControl>
              <SelectContent>
                {groups.map((group, i) => (
                  <>
                    {i > 0 && <SelectSeparator />}
                    <SelectItemGroup>
                      <SelectItemGroupLabel>{group}</SelectItemGroupLabel>
                      {regionCollection.items
                        .filter((item) => item.group === group)
                        .map((item) => (
                          <SelectItem item={item}>{item.label}</SelectItem>
                        ))}
                    </SelectItemGroup>
                  </>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>
              Monitors run from this region's infrastructure.
            </FieldDescription>
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
            class="self-start"
          >
            Save
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function SelectPage() {
  return (
    <div class="flex max-w-2xl flex-col gap-10 p-8">
      <div>
        <h1 class="text-lg font-semibold">Select</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Ark UI's Select is collection-based. It stores values as{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">string[]</code>{" "}
          internally (to support multi-select), so single-select needs the{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">[0]</code> unwrap
          pattern.
        </p>
      </div>

      <Section
        title="Single select"
        description="value={field.value ? [field.value] : []} · onValueChange={d => handleChange(d.value[0])}"
      >
        <SingleSelectForm />
      </Section>

      <Section
        title="Grouped items"
        description="SelectItemGroup + SelectItemGroupLabel for visual grouping within a single collection."
      >
        <GroupedSelectForm />
      </Section>
    </div>
  );
}
