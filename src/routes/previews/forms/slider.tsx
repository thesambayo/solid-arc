import { createForm } from "@tanstack/solid-form";
import { createFileRoute } from "@tanstack/solid-router";
import { For, type JSX } from "solid-js";

import { Button } from "../../../components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
} from "../../../components/ui/field";
import {
  Slider,
  SliderControl,
  SliderLabel,
  SliderMarker,
  SliderMarkerGroup,
  SliderThumb,
  SliderValueText,
} from "../../../components/ui/slider";

export const Route = createFileRoute("/previews/forms/slider")({
  component: SliderFormPage,
});

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section(props: {
  title: string;
  description?: string;
  children: JSX.Element;
}) {
  return (
    <div class="flex flex-col gap-4">
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

// ─── Single value form ────────────────────────────────────────────────────────
// Slider value in TanStack Form is always number[] — single slider = [value].
// onValueChange receives { value: number[] }, not a raw number.

function SingleSliderForm() {
  const form = createForm(() => ({
    defaultValues: {
      priority: [0] as number[],
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
      <form.Field
        name="priority"
        validators={{
          onChange: ({ value }) => {
            const [v] = value as number[];
            if (v < 25) return "Priority must be at least 25";
            return undefined;
          },
        }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0}>
            {/*
             * Slider wiring:
             * - value={...}         → controlled, reads from field state
             * - onValueChange       → receives { value: number[] }, update field
             * - onValueChangeEnd    → only fires when drag ends (for blur-like semantics)
             *
             * We use onValueChange so TanStack Form sees every drag step in real-time.
             */}
            <Slider
              value={field().state.value as number[]}
              onValueChange={(details) => field().handleChange(details.value)}
              min={0}
              max={100}
            >
              <div class="flex justify-between">
                <SliderLabel>Priority</SliderLabel>
                <SliderValueText />
              </div>
              <SliderControl>
                <SliderThumb index={0} />
              </SliderControl>
              <SliderMarkerGroup>
                <For each={[0, 25, 50, 75, 100]}>
                  {(v) => <SliderMarker value={v}>{v}</SliderMarker>}
                </For>
              </SliderMarkerGroup>
            </Slider>
            <FieldDescription>Slide to 25 or above to submit.</FieldDescription>
            <FieldError>
              {field().state.meta.errors[0] as string | undefined}
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
            Submit
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── Range slider form ────────────────────────────────────────────────────────
// Two-thumb slider — value is [min, max].
// Validate that the selected span is wide enough.

function RangeSliderForm() {
  const form = createForm(() => ({
    defaultValues: {
      budget: [20, 40] as number[],
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
      <form.Field
        name="budget"
        validators={{
          onChange: ({ value }) => {
            const [min, max] = value as number[];
            if (max - min < 20) return "Budget range must span at least $20k";
            return undefined;
          },
        }}
      >
        {(field) => (
          <Field invalid={field().state.meta.errors.length > 0}>
            <Slider
              value={field().state.value as number[]}
              onValueChange={(details) => field().handleChange(details.value)}
              min={0}
              max={100}
              minStepsBetweenThumbs={5}
            >
              <div class="flex justify-between">
                <SliderLabel>Budget range (k$)</SliderLabel>
                <SliderValueText />
              </div>
              <SliderControl>
                <SliderThumb index={0} />
                <SliderThumb index={1} />
              </SliderControl>
            </Slider>
            <FieldDescription>
              Spread the range to at least $20k apart.
            </FieldDescription>
            <FieldError>
              {field().state.meta.errors[0] as string | undefined}
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
            Submit
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function SliderFormPage() {
  return (
    <div class="flex max-w-2xl flex-col gap-10 p-8">
      <div>
        <h1 class="text-lg font-semibold">Slider</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Slider fields in TanStack Form. The value is always{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">number[]</code> — a
          single slider is{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">[value]</code>, a
          range is{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">[min, max]</code>.{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">
            onValueChange
          </code>{" "}
          fires on every drag step.
        </p>
      </div>

      <Section
        title="Single value"
        description="Validation against the current thumb value. Drag below 25 to trigger the error."
      >
        <SingleSliderForm />
      </Section>

      <Section
        title="Range"
        description="Validation against the span between two thumbs. Drag them close together to trigger the error."
      >
        <RangeSliderForm />
      </Section>
    </div>
  );
}
