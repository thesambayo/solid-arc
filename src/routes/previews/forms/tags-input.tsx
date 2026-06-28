import { createForm } from "@tanstack/solid-form";
import { createFileRoute } from "@tanstack/solid-router";
import { MailIcon } from "lucide-solid";
import { type JSX, Show } from "solid-js";
import { z } from "zod";

import { Button } from "../../../components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../../../components/ui/field";
import { TagsInput } from "../../../components/ui/tags-input";

export const Route = createFileRoute("/previews/forms/tags-input")({
  component: TagsInputFormsPage,
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

// ─── 1. Basic ─────────────────────────────────────────────────────────────────
// Simplest wiring. value is string[], onValueChange receives { value: string[] }.

function BasicForm() {
  const form = createForm(() => ({
    defaultValues: { tags: [] as string[] },
    onSubmit: async ({ value }) => {
      alert(`Tags: ${JSON.stringify(value.tags)}`);
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
      <form.Field name="tags">
        {(field) => (
          <Field>
            {/*
             * TagsInput wiring is the cleanest of all the Ark form controls
             * because the value type is already string[] — no DateValue, no
             * `.value[0]` unwrap, no array-of-one trick. Just pass through.
             */}
            <TagsInput
              label="Tags"
              value={field().state.value}
              onValueChange={(d) => field().handleChange(d.value)}
              placeholder="Add a tag..."
            />
            <FieldDescription>
              Press Enter to commit. Backspace removes the last one.
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

// ─── 2. Required + min count ──────────────────────────────────────────────────
// Zod is at its happiest here — value is just string[], so all the array
// schemas (.min, .max, element validation) work natively.

function RequiredForm() {
  const form = createForm(() => ({
    defaultValues: { labels: [] as string[] },
    onSubmit: async ({ value }) => {
      alert(`Labels: ${JSON.stringify(value.labels)}`);
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
        name="labels"
        validators={{
          onChange: z.array(z.string()).min(2, "Add at least 2 labels"),
        }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0} required>
            <TagsInput
              label="Labels"
              value={field().state.value}
              onValueChange={(d) => field().handleChange(d.value)}
              placeholder="add at least 2..."
            />
            <FieldError>{field().state.meta.errors[0]?.message}</FieldError>
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

// ─── 3. Validate each tag (Zod element schema) ────────────────────────────────
// Zod's z.array(z.string().email()) validates every element. The error message
// includes the offending index.

function EmailListForm() {
  const form = createForm(() => ({
    defaultValues: { recipients: [] as string[] },
    onSubmit: async ({ value }) => {
      alert(`Recipients:\n${value.recipients.join("\n")}`);
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
        name="recipients"
        validators={{
          onChange: z
            .array(z.string().email("Invalid email"))
            .min(1, "Add at least one recipient"),
        }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0} required>
            <TagsInput
              label="Recipients"
              value={field().state.value}
              onValueChange={(d) => field().handleChange(d.value)}
              placeholder="alice@argus.dev"
              sanitizeValue={(v) => v.trim().toLowerCase()}
              delimiter={/[,;\s]/}
              renderTag={(value) => (
                <span class="inline-flex items-center gap-1.5">
                  <MailIcon class="size-3" />
                  {value}
                </span>
              )}
            />
            <FieldDescription>
              Paste a comma-separated list — they'll split into separate tags.
            </FieldDescription>
            <FieldError>{field().state.meta.errors[0]?.message}</FieldError>
          </Field>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => s.canSubmit}>
        {(canSubmit) => (
          <Button type="submit" disabled={!canSubmit()} class="self-start">
            Send
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── 4. Block-at-input vs validate-on-submit ──────────────────────────────────
// Two ways to enforce rules — show the difference side-by-side.
//
// `validate` (on the TagsInput) STOPS bad tags from being added — they never
// enter the form state. Good for "no duplicates" UX.
//
// `validators.onChange` (on the form.Field) lets tags in but reports errors.
// Good for "you need at least N" rules.

function ValidationLayersForm() {
  const form = createForm(() => ({
    defaultValues: { tags: [] as string[] },
    onSubmit: async ({ value }) => {
      alert(`Final: ${JSON.stringify(value.tags)}`);
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
        name="tags"
        validators={{
          // Form-level rule: minimum count. Caught at submit, surfaced as error.
          onChange: z.array(z.string()).min(3, "Need at least 3 tags"),
        }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0} required>
            <TagsInput
              label="Tags (min 3, lowercase alphanumeric, no duplicates)"
              value={field().state.value}
              onValueChange={(d) => field().handleChange(d.value)}
              placeholder="add tag..."
              // Input-level rule: prevent bad tags from ever entering state.
              // The block is silent — Ark just doesn't add the tag.
              validate={({ value, inputValue }) => {
                if (value.includes(inputValue)) return false;
                if (!/^[a-z0-9-]+$/.test(inputValue)) return false;
                return true;
              }}
              sanitizeValue={(v) => v.trim().toLowerCase()}
            />
            <FieldDescription>
              Two layers — `validate` blocks bad entries silently, the form
              validator catches "not enough."
            </FieldDescription>
            <FieldError>{field().state.meta.errors[0]?.message}</FieldError>
          </Field>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => s.canSubmit}>
        {(canSubmit) => (
          <Button type="submit" disabled={!canSubmit()} class="self-start">
            Save
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── 5. Max tags ──────────────────────────────────────────────────────────────
// `max` is enforced at the input level. Pair with allowOverflow + invalid wiring
// to let the user temporarily exceed and show the error.

function MaxTagsForm() {
  const form = createForm(() => ({
    defaultValues: { regions: [] as string[] },
    onSubmit: async ({ value }) => {
      alert(`Regions: ${JSON.stringify(value.regions)}`);
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
        name="regions"
        validators={{
          onChange: z
            .array(z.string())
            .min(1, "Pick at least one region")
            .max(3, "Up to 3 regions"),
        }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0} required>
            <TagsInput
              label="Monitor from regions"
              value={field().state.value}
              onValueChange={(d) => field().handleChange(d.value)}
              placeholder="us-east-1, eu-west-1..."
              max={3}
              delimiter=","
            />
            <FieldError>{field().state.meta.errors[0]?.message}</FieldError>
          </Field>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => s.canSubmit}>
        {(canSubmit) => (
          <Button type="submit" disabled={!canSubmit()} class="self-start">
            Save
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── 6. Conditional reveal ────────────────────────────────────────────────────
// Show the tags input only when a switch is on. Validator skips when hidden.

function ConditionalForm() {
  const form = createForm(() => ({
    defaultValues: {
      notifyTeam: false,
      teamMembers: [] as string[],
    },
    onSubmit: async ({ value }) => {
      if (value.notifyTeam) {
        alert(`Notifying: ${value.teamMembers.join(", ")}`);
      } else {
        alert("No notifications sent");
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
      class="flex max-w-md flex-col gap-4"
    >
      <form.Field name="notifyTeam">
        {(field) => (
          <Field>
            <label class="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={field().state.value}
                onChange={(e) => field().handleChange(e.currentTarget.checked)}
                class="rounded border-border"
              />
              Notify team on incident
            </label>
          </Field>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => s.values.notifyTeam}>
        {(notifyTeam) => (
          <Show when={notifyTeam()}>
            <form.Field
              name="teamMembers"
              validators={{
                onChange: ({ value, fieldApi }) => {
                  if (!fieldApi.form.getFieldValue("notifyTeam"))
                    return undefined;
                  if (value.length === 0) return "Add at least one team member";
                  // Validate each is an email
                  const bad = value.find(
                    (v) => !z.string().email().safeParse(v).success,
                  );
                  if (bad) return `"${bad}" isn't a valid email`;
                  return undefined;
                },
              }}
            >
              {(field) => (
                <Field invalid={field().state.meta.errors.length > 0} required>
                  <TagsInput
                    label="Team members"
                    value={field().state.value}
                    onValueChange={(d) => field().handleChange(d.value)}
                    placeholder="alice@argus.dev"
                    sanitizeValue={(v) => v.trim().toLowerCase()}
                  />
                  <FieldError>
                    {/* This field uses a function validator (not Zod), so errors[0] is a plain string */}
                    {field().state.meta.errors[0] as string | undefined}
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
            Save settings
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── 7. Native form via HiddenInput (no TanStack Form) ────────────────────────
// Bonus: TagsInput emits each tag as a repeated form value when `name` is set.
// formData.getAll(name) recovers the array. Useful for server-rendered forms
// or anywhere you don't want the TanStack Form dependency.

function NativeFormDemo() {
  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const tags = formData.getAll("tags");
    alert(`FormData.getAll("tags"):\n${JSON.stringify(tags, null, 2)}`);
  };

  return (
    <form class="flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>
      <Field>
        <FieldLabel>Tags</FieldLabel>
        <TagsInput
          name="tags"
          defaultValue={["go", "solid", "uptime"]}
          placeholder="add tag..."
        />
        <FieldDescription>
          The hidden input emits one entry per tag — `getAll("tags")` returns
          the array.
        </FieldDescription>
      </Field>
      <Button type="submit" class="self-start">
        Submit (native)
      </Button>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function TagsInputFormsPage() {
  return (
    <div class="flex max-w-2xl flex-col gap-10 p-8">
      <div>
        <h1 class="text-lg font-semibold">Tags input</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          TagsInput's value is plain{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">string[]</code> —
          the simplest of all the Ark form controls to wire up. Zod array
          schemas work natively, and the input has two validation hooks worth
          knowing about:{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">validate</code>{" "}
          (block at input) vs the field's{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">validators</code>{" "}
          (report at submit).
        </p>
      </div>

      <Section
        title="Basic"
        description="value ↔ field.state.value, onValueChange passes d.value through. defaultValues: { tags: [] }."
      >
        <BasicForm />
      </Section>

      <Section
        title="Required + min count"
        description="Zod's z.array(z.string()).min(N, msg) for 'at least N tags' rules."
      >
        <RequiredForm />
      </Section>

      <Section
        title="Validate each element"
        description="z.array(z.string().email()) validates every tag. Combine with sanitizeValue to normalize before validating."
      >
        <EmailListForm />
      </Section>

      <Section
        title="Two layers: input-level vs form-level"
        description="TagsInput's `validate` silently blocks bad entries. The field's Zod validator reports rule violations after the fact. Use both for the best UX."
      >
        <ValidationLayersForm />
      </Section>

      <Section
        title="Max tags"
        description="max={N} on the input + z.array().max(N) on the field. Belt and suspenders, but the UX matches the validation."
      >
        <MaxTagsForm />
      </Section>

      <Section
        title="Conditional"
        description="Tags input only when 'notify team' is on. Validator reads the other field via fieldApi.form."
      >
        <ConditionalForm />
      </Section>

      <Section
        title="Native form (no TanStack Form)"
        description="Bonus: TagsInput emits each tag as a repeated form value. formData.getAll(name) gets the array back."
      >
        <NativeFormDemo />
      </Section>
    </div>
  );
}
