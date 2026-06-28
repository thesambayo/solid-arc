import { createForm } from "@tanstack/solid-form";
import { createFileRoute } from "@tanstack/solid-router";
import { For, type JSX } from "solid-js";
import { z } from "zod";

import { Button } from "../../../components/ui/button";
import { Checkbox, CheckboxLabel } from "../../../components/ui/checkbox";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "../../../components/ui/field";
import { Textarea } from "../../../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Switch, SwitchLabel } from "../../../components/ui/switch";

export const Route = createFileRoute("/previews/forms/custom-controls")({
  component: CustomControlsPage,
});

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section(props: {
  title: string;
  description?: string;
  children: JSX.Element;
}) {
  return (
    <div class="flex flex-col gap-3">
      <div>
        <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {props.title}
        </p>
        {props.description && (
          <p class="mt-0.5 text-xs text-muted-foreground">
            {props.description}
          </p>
        )}
      </div>
      {props.children}
    </div>
  );
}

// ─── Notification trigger options ─────────────────────────────────────────────

const notifyOnOptions = [
  { value: "down", label: "Monitor goes down" },
  { value: "slow", label: "Response is slow (> 2s)" },
  { value: "ssl", label: "SSL certificate expires soon" },
] as const;

// ─── Alert settings form ──────────────────────────────────────────────────────

function AlertSettingsForm() {
  const form = createForm(() => ({
    defaultValues: {
      alertType: "email" as string,
      notifyOn: ["down"] as string[],
      enabled: true as boolean,
      notes: "" as string,
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
      class="flex max-w-sm flex-col gap-6"
    >
      {/* ── RadioGroup ───────────────────────────────────────────────────── */}
      <form.Field
        name="alertType"
        validators={{
          onChange: z.string().min(1, "Please select an alert type"),
        }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0} required>
            <FieldLabel>Alert via</FieldLabel>
            {/*
             * Ark UI RadioGroup.onValueChange receives { value: string }.
             * Not a raw string — pull details.value.
             */}
            <RadioGroup
              value={field().state.value}
              onValueChange={(details) =>
                field().handleChange(details.value ?? "")
              }
            >
              <RadioGroupItem value="email">Email</RadioGroupItem>
              <RadioGroupItem value="sms">SMS</RadioGroupItem>
              <RadioGroupItem value="webhook">Webhook</RadioGroupItem>
            </RadioGroup>
            <FieldError>{field().state.meta.errors[0]?.message}</FieldError>
          </Field>
        )}
      </form.Field>

      {/* ── Checkbox group (multiple selection stored as array) ───────────── */}
      <form.Field
        name="notifyOn"
        validators={{
          onChange: z.array(z.string()).min(1, "Select at least one trigger"),
        }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0} required>
            <FieldLabel>Notify me when</FieldLabel>
            {/*
             * Each Checkbox manages its own checked state, derived from the
             * array field value. onCheckedChange adds or removes from the array.
             * Ark UI sends { checked: boolean } — not a raw boolean.
             */}
            <div class="flex flex-col gap-2">
              <For each={notifyOnOptions}>
                {(option) => (
                  <Checkbox
                    checked={(field().state.value as string[]).includes(
                      option.value,
                    )}
                    onCheckedChange={(details) => {
                      const current = field().state.value as string[];
                      field().handleChange(
                        details.checked
                          ? [...current, option.value]
                          : current.filter((v) => v !== option.value),
                      );
                    }}
                  >
                    <CheckboxLabel>{option.label}</CheckboxLabel>
                  </Checkbox>
                )}
              </For>
            </div>
            <FieldError>{field().state.meta.errors[0]?.message}</FieldError>
          </Field>
        )}
      </form.Field>

      {/* ── Switch ───────────────────────────────────────────────────────── */}
      <form.Field name="enabled">
        {(field) => (
          /*
           * Switch doesn't need a Field wrapper here — no label/error needed.
           * Ark UI sends { checked: boolean } on onCheckedChange.
           */
          <Switch
            checked={field().state.value as boolean}
            onCheckedChange={(details) => field().handleChange(details.checked)}
          >
            <SwitchLabel>Enable alerts</SwitchLabel>
          </Switch>
        )}
      </form.Field>

      {/* ── Textarea ─────────────────────────────────────────────────────── */}
      <form.Field
        name="notes"
        validators={{
          onChange: z.string().max(200, "Max 200 characters"),
        }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0}>
            <FieldLabel>Notes</FieldLabel>
            {/*
             * Textarea uses FieldPrimitive.Textarea — same wiring as Input.
             * autoresize grows the field as the user types.
             */}
            <Textarea
              value={field().state.value as string}
              onInput={(e) => field().handleChange(e.currentTarget.value)}
              onBlur={field().handleBlur}
              autoresize
              placeholder="Any additional context for this alert..."
            />
            <FieldDescription>
              {(field().state.value as string).length}/200 characters
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
            loadingText="Saving..."
            class="self-start"
          >
            Save alert settings
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function CustomControlsPage() {
  return (
    <div class="flex max-w-2xl flex-col gap-10 p-8">
      <div>
        <h1 class="text-lg font-semibold">Custom controls</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Ark UI components wired to TanStack Form. Each control type has a
          slightly different event shape — see the inline comments.
        </p>
      </div>

      <Section
        title="Alert settings"
        description="RadioGroup · Checkbox array · Switch · Textarea with autoresize"
      >
        <AlertSettingsForm />
      </Section>
    </div>
  );
}
