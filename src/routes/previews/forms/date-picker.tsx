import type { DateValue } from "@ark-ui/solid/date-picker";
import { createForm } from "@tanstack/solid-form";
import { createFileRoute } from "@tanstack/solid-router";
import { type JSX, Show } from "solid-js";

// TanStack Form's `meta.errors[0]` is `string | StandardSchemaV1Issue` depending
// on whether you used a function validator or a schema (Zod/Standard Schema).
// This tiny helper renders both shapes — saves repeating the typeof check
// at every <FieldError> site.
const errText = (e: unknown): string | undefined => {
  if (typeof e === "string") return e;
  if (e && typeof e === "object" && "message" in e) {
    return (e as { message?: string }).message;
  }
  return undefined;
};
import { Button } from "../../../components/ui/button";
import { DatePicker, parseDate } from "../../../components/ui/date-picker";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../../../components/ui/field";
import { Switch } from "../../../components/ui/switch";

export const Route = createFileRoute("/previews/forms/date-picker")({
  component: DatePickerFormsPage,
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

// ─── 1. Basic single date ─────────────────────────────────────────────────────
// The minimal wiring. value is DateValue[], onValueChange receives { value }.
// Note: DatePicker's value is *always* an array, even for single selection.

function BasicForm() {
  const form = createForm(() => ({
    defaultValues: { dueDate: [] as DateValue[] },
    onSubmit: async ({ value }) => {
      // .toString() on DateValue gives an ISO-ish "YYYY-MM-DD" string
      alert(`Due: ${value.dueDate[0]?.toString() ?? "(none)"}`);
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
      <form.Field name="dueDate">
        {(field) => (
          <Field>
            {/*
             * DatePicker quirks when used as a controlled form field:
             *
             * value        — must be DateValue[] (single-mode = array of one)
             * onValueChange — receives { value: DateValue[] }, pass the whole array
             * label         — convenience prop renders DatePickerLabel for you
             */}
            <DatePicker
              label="Due date"
              value={field().state.value}
              onValueChange={(details) => field().handleChange(details.value)}
            />
            <FieldDescription>
              Stored as a DateValue from @internationalized/date.
            </FieldDescription>
          </Field>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" loading={isSubmitting()} class="self-start">
            Save
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── 2. Required validation ───────────────────────────────────────────────────
// DateValue isn't a Zod-native type, so we use a function validator. Returns
// undefined when ok, a string when invalid. Same pattern for value constraints
// further down (min/max, end-after-start).

function RequiredForm() {
  const form = createForm(() => ({
    defaultValues: { startDate: [] as DateValue[] },
    onSubmit: async ({ value }) => {
      alert(`Start: ${value.startDate[0]?.toString()}`);
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
        name="startDate"
        validators={{
          onChange: ({ value }: { value: DateValue[] }) =>
            value.length === 0 ? "Please pick a start date" : undefined,
        }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0} required>
            <DatePicker
              label="Start date"
              value={field().state.value}
              onValueChange={(details) => field().handleChange(details.value)}
              showClear
            />
            <FieldError>{errText(field().state.meta.errors[0])}</FieldError>
          </Field>
        )}
      </form.Field>

      <form.Subscribe
        selector={(s) => ({
          canSubmit: s.canSubmit,
          isSubmitting: s.isSubmitting,
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

// ─── 3. Min / max constraint validation ───────────────────────────────────────
// Skip Zod for value constraints — DateValue has a .compare() method that's
// way nicer than coercing through native Date. Function validators take
// `{ value }` and return undefined (ok) or a string (error).

function MinMaxForm() {
  const today = parseDate(new Date().toISOString().slice(0, 10));
  const maxDate = today.add({ days: 30 });

  const form = createForm(() => ({
    defaultValues: { appointment: [] as DateValue[] },
    onSubmit: async ({ value }) => {
      alert(`Appointment: ${value.appointment[0]?.toString()}`);
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
        name="appointment"
        validators={{
          // Function validator — runs alongside any DatePicker-level min/max.
          // The DatePicker min/max props *prevent* invalid selection in the UI;
          // this function backs it up if someone types into the input directly.
          onChange: ({ value }) => {
            const picked = value[0];
            if (!picked) return "Pick an appointment date";
            if (picked.compare(today) < 0) return "Can't be in the past";
            if (picked.compare(maxDate) > 0)
              return "Must be within the next 30 days";
            return undefined;
          },
        }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0} required>
            <DatePicker
              label="Appointment"
              value={field().state.value}
              onValueChange={(details) => field().handleChange(details.value)}
              min={today}
              max={maxDate}
            />
            <FieldDescription>
              Available within the next 30 days.
            </FieldDescription>
            <FieldError>{errText(field().state.meta.errors[0])}</FieldError>
          </Field>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => s.canSubmit}>
        {(canSubmit) => (
          <Button type="submit" disabled={!canSubmit()} class="self-start">
            Book
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── 4. Default value (pre-filled, "edit" form) ───────────────────────────────
// Common case: loading an existing record. defaultValues for DateValue fields
// should be an array (matching the field's runtime type), not a bare DateValue.

function DefaultValueForm() {
  const form = createForm(() => ({
    defaultValues: {
      createdAt: [parseDate("2025-11-15")] as DateValue[],
    },
    onSubmit: async ({ value }) => {
      alert(`Updated to: ${value.createdAt[0]?.toString()}`);
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
      <form.Field name="createdAt">
        {(field) => (
          <Field>
            <DatePicker
              label="Created at"
              value={field().state.value}
              onValueChange={(details) => field().handleChange(details.value)}
              showClear
            />
            <FieldDescription>
              Pre-filled from server — wrap your existing date in{" "}
              <code class="rounded bg-muted px-1 py-0.5 text-xs">
                [parseDate(...)]
              </code>
              .
            </FieldDescription>
          </Field>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => s.isDirty}>
        {(isDirty) => (
          <Button type="submit" disabled={!isDirty()} class="self-start">
            {isDirty() ? "Save changes" : "No changes"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── 5. Range selection ───────────────────────────────────────────────────────
// selectionMode="range" gives you two inputs sharing one calendar. Value is
// [startDate, endDate] — validate both exist.

function RangeForm() {
  const form = createForm(() => ({
    defaultValues: { dateRange: [] as DateValue[] },
    onSubmit: async ({ value }) => {
      const [start, end] = value.dateRange;
      alert(`Range: ${start?.toString()} → ${end?.toString()}`);
    },
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class="flex max-w-md flex-col gap-4"
    >
      <form.Field
        name="dateRange"
        validators={{
          onChange: ({ value }) => {
            if (value.length < 2 || !value[0] || !value[1]) {
              return "Pick a start and end date";
            }
            return undefined;
          },
        }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0} required>
            <DatePicker
              label="Booking window"
              selectionMode="range"
              value={field().state.value}
              onValueChange={(details) => field().handleChange(details.value)}
              showClear
            />
            <FieldError>{errText(field().state.meta.errors[0])}</FieldError>
          </Field>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => s.canSubmit}>
        {(canSubmit) => (
          <Button type="submit" disabled={!canSubmit()} class="self-start">
            Book range
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── 6. Cross-field validation (end after start) ──────────────────────────────
// Two separate date fields with a form-level validator that checks them
// against each other. Errors get routed to the right field via `fields`.

function CrossFieldForm() {
  const form = createForm(() => ({
    defaultValues: {
      startDate: [] as DateValue[],
      endDate: [] as DateValue[],
    },
    // Form-level validator runs whenever ANY field changes. Return per-field
    // errors via `fields` — TanStack Form routes them to the matching field's
    // meta.errors automatically.
    validators: {
      onChange: ({ value }) => {
        const start = value.startDate[0];
        const end = value.endDate[0];
        if (start && end && end.compare(start) < 0) {
          return {
            fields: { endDate: "End date must be after start date" },
          };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      alert(
        `Trip: ${value.startDate[0]?.toString()} → ${value.endDate[0]?.toString()}`,
      );
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
        name="startDate"
        validators={{
          onChange: ({ value }: { value: DateValue[] }) =>
            value.length === 0 ? "Pick a start date" : undefined,
        }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0} required>
            <DatePicker
              label="Trip start"
              value={field().state.value}
              onValueChange={(details) => field().handleChange(details.value)}
            />
            <FieldError>{errText(field().state.meta.errors[0])}</FieldError>
          </Field>
        )}
      </form.Field>

      <form.Field
        name="endDate"
        validators={{
          onChange: ({ value }: { value: DateValue[] }) =>
            value.length === 0 ? "Pick an end date" : undefined,
        }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0} required>
            <DatePicker
              label="Trip end"
              value={field().state.value}
              onValueChange={(details) => field().handleChange(details.value)}
            />
            <FieldError>{errText(field().state.meta.errors[0])}</FieldError>
          </Field>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => s.canSubmit}>
        {(canSubmit) => (
          <Button type="submit" disabled={!canSubmit()} class="self-start">
            Book trip
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── 7. Conditional reveal ────────────────────────────────────────────────────
// Show the date picker only when a switch is on. Validator is skipped while
// hidden so the form is still submittable.

function ConditionalForm() {
  const form = createForm(() => ({
    defaultValues: {
      scheduleLater: false,
      scheduledFor: [] as DateValue[],
    },
    onSubmit: async ({ value }) => {
      if (value.scheduleLater) {
        alert(`Scheduled for: ${value.scheduledFor[0]?.toString()}`);
      } else {
        alert("Published immediately");
      }
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
      <form.Field name="scheduleLater">
        {(field) => (
          <Field>
            <Switch
              checked={field().state.value}
              onCheckedChange={(d) => field().handleChange(d.checked)}
            >
              Schedule for later
            </Switch>
          </Field>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => s.values.scheduleLater}>
        {(scheduleLater) => (
          <Show when={scheduleLater()}>
            <form.Field
              name="scheduledFor"
              validators={{
                // Only validate when actually scheduling — read other field's
                // value via the validator's formApi argument.
                onChange: ({ value, fieldApi }) => {
                  if (!fieldApi.form.getFieldValue("scheduleLater"))
                    return undefined;
                  if (value.length === 0) return "Pick a date and time";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <Field invalid={field().state.meta.errors.length > 0} required>
                  <DatePicker
                    label="Publish on"
                    value={field().state.value}
                    onValueChange={(details) =>
                      field().handleChange(details.value)
                    }
                  />
                  <FieldError>
                    {errText(field().state.meta.errors[0])}
                  </FieldError>
                </Field>
              )}
            </form.Field>
          </Show>
        )}
      </form.Subscribe>

      <form.Subscribe selector={(s) => s.canSubmit}>
        {(canSubmit) => (
          <Button type="submit" disabled={!canSubmit()} class="self-start">
            Publish
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── 8. Inline calendar (no popover) ──────────────────────────────────────────
// The inline mode wires up identically — same value / onValueChange contract.
// Good for "step 2 of 3" wizard screens or sidebar filters.

function InlineForm() {
  const form = createForm(() => ({
    defaultValues: { day: [] as DateValue[] },
    onSubmit: async ({ value }) => {
      alert(`Showing data for: ${value.day[0]?.toString()}`);
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
        name="day"
        validators={{
          onChange: ({ value }: { value: DateValue[] }) =>
            value.length === 0 ? "Pick a day" : undefined,
        }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0}>
            <DatePicker
              inline
              value={field().state.value}
              onValueChange={(details) => field().handleChange(details.value)}
            />
            <FieldError>{errText(field().state.meta.errors[0])}</FieldError>
          </Field>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => s.canSubmit}>
        {(canSubmit) => (
          <Button type="submit" disabled={!canSubmit()} class="self-start">
            Show data
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function DatePickerFormsPage() {
  return (
    <div class="flex max-w-2xl flex-col gap-10 p-8">
      <div>
        <h1 class="text-lg font-semibold">Date picker</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          DatePicker's value is always{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">DateValue[]</code>{" "}
          (Ark's internationalized date type), even for single-select.{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">
            onValueChange
          </code>{" "}
          receives{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">
            {"{ value: DateValue[] }"}
          </code>{" "}
          — pass the whole array straight to{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">
            field().handleChange
          </code>
          .
        </p>
      </div>

      <Section
        title="Basic"
        description="The minimum wiring. defaultValues: { dueDate: [] } — empty array, not undefined."
      >
        <BasicForm />
      </Section>

      <Section
        title="Required"
        description="DateValue isn't Zod-native — a tiny function validator beats a coerced Zod schema."
      >
        <RequiredForm />
      </Section>

      <Section
        title="Min / max"
        description="Function validators beat Zod for date constraints — DateValue.compare() is right there."
      >
        <MinMaxForm />
      </Section>

      <Section
        title="Default value"
        description="Pre-fill with [parseDate('2025-11-15')] — the wrapping array matches the field's runtime type."
      >
        <DefaultValueForm />
      </Section>

      <Section
        title="Range"
        description="selectionMode='range' gives [start, end]. Validator checks both slots are filled."
      >
        <RangeForm />
      </Section>

      <Section
        title="Cross-field validation"
        description="End date must be after start date. Form-level validator returns { fields: { fieldName: msg } }."
      >
        <CrossFieldForm />
      </Section>

      <Section
        title="Conditional"
        description="Date picker only when 'schedule later' is on. Validator reads the other field via fieldApi.form."
      >
        <ConditionalForm />
      </Section>

      <Section
        title="Inline"
        description="Same value / onValueChange contract — just inline={true} on the picker."
      >
        <InlineForm />
      </Section>
    </div>
  );
}
