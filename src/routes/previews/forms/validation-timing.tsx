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
import { Input } from "../../../components/ui/input";

export const Route = createFileRoute("/previews/forms/validation-timing")({
  component: ValidationTimingPage,
});

// ─── Shared email validator ───────────────────────────────────────────────────

const emailSchema = z.string().email("Enter a valid email address");

// ─── Card wrapper ─────────────────────────────────────────────────────────────

function Card(props: { title: string; detail: string; children: JSX.Element }) {
  return (
    <div class="flex flex-col gap-4 rounded-xl border border-border p-5">
      <div>
        <p class="text-sm font-medium">{props.title}</p>
        <p class="mt-0.5 font-mono text-xs text-muted-foreground">
          {props.detail}
        </p>
      </div>
      {props.children}
    </div>
  );
}

// ─── onChange: errors fire on every keystroke ─────────────────────────────────

function OnChangeForm() {
  const form = createForm(() => ({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      alert(`Submitted: ${value.email}`);
    },
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class="flex flex-col gap-4"
    >
      <form.Field name="email" validators={{ onChange: emailSchema }}>
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0}>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              value={field().state.value}
              onInput={(e) => field().handleChange(e.currentTarget.value)}
              onBlur={field().handleBlur}
              placeholder="you@example.com"
            />
            <FieldDescription>Error appears while you type</FieldDescription>
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
            Submit
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── onBlur: errors fire only when the field loses focus ──────────────────────

function OnBlurForm() {
  const form = createForm(() => ({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      alert(`Submitted: ${value.email}`);
    },
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class="flex flex-col gap-4"
    >
      <form.Field name="email" validators={{ onBlur: emailSchema }}>
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0}>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              value={field().state.value}
              onInput={(e) => field().handleChange(e.currentTarget.value)}
              onBlur={field().handleBlur}
              placeholder="you@example.com"
            />
            <FieldDescription>
              Error appears after you leave the field
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
            Submit
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── onChangeBlurred: validate on every keystroke, show only after blur or submit
//
// The best-UX pattern (github.com/TanStack/form/discussions/1983):
// - Errors are always computed (onChange), so the form knows validity at all times.
// - Errors are only *displayed* once the field has been blurred OR the user has
//   attempted to submit at least once.
// - Correcting a field clears the error immediately while typing (onChange).

function OnChangeBlurredForm() {
  const form = createForm(() => ({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      alert(`Submitted: ${value.email}`);
    },
  }));

  /*
   * form.useStore returns an accessor in SolidJS — call it with ().
   * submissionAttempts increments each time the user clicks Submit,
   * regardless of whether the form is valid or not.
   */
  const submissionAttempted = form.useStore(
    (state) => state.submissionAttempts > 0,
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class="flex flex-col gap-4"
    >
      <form.Field name="email" validators={{ onChange: emailSchema }}>
        {(field) => {
          /*
           * Gate visibility on: has the user left the field OR tried to submit?
           * The validator still runs on every keystroke — we're only controlling
           * when the error is surfaced, not when it's computed.
           */
          const showError = () =>
            (field().state.meta.isBlurred || submissionAttempted()) &&
            field().state.meta.errors.length > 0;

          return (
            <Field invalid={showError()}>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                onBlur={field().handleBlur}
                placeholder="you@example.com"
              />
              <FieldDescription>
                Hidden while typing · appears on blur or submit · clears
                immediately when fixed
              </FieldDescription>
              <FieldError>{field().state.meta.errors[0]?.message}</FieldError>
            </Field>
          );
        }}
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
            Submit
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function ValidationTimingPage() {
  return (
    <div class="flex max-w-2xl flex-col gap-10 p-8">
      <div>
        <h1 class="text-lg font-semibold">Validation timing</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Three approaches to the same field.{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">onChange</code> and{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">onBlur</code> are
          built-in timing keys.{" "}
          <span class="font-medium text-foreground">onChangeBlurred</span> is a
          pattern — validate with{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">onChange</code>,
          gate display on{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">isBlurred</code> or{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">
            submissionAttempts &gt; 0
          </code>
          . Best UX for most forms.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="onChange" detail="validators={{ onChange: schema }}">
          <OnChangeForm />
        </Card>

        <Card title="onBlur" detail="validators={{ onBlur: schema }}">
          <OnBlurForm />
        </Card>

        <Card
          title="onChangeBlurred"
          detail="validate onChange · show after blur or submit"
        >
          <OnChangeBlurredForm />
        </Card>
      </div>
    </div>
  );
}
