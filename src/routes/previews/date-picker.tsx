import type { DateValue } from "@ark-ui/solid/date-picker";
import { createFileRoute } from "@tanstack/solid-router";
import { createSignal } from "solid-js";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
  DatePicker,
  DatePickerAllViews,
  DatePickerClearTrigger,
  DatePickerContext,
  DatePickerControl,
  DatePickerDayView,
  DatePickerInline,
  DatePickerInput,
  DatePickerLabel,
  DatePickerPopover,
  DatePickerPresetTrigger,
  DatePickerRoot,
  DatePickerTrigger,
  parseDate,
} from "../../components/ui/date-picker";

export const Route = createFileRoute("/previews/date-picker")({
  component: RouteComponent,
});

function Section(props: {
  title: string;
  description?: string;
  children: any;
}) {
  return (
    <section class="flex flex-col gap-3">
      <div class="flex flex-col gap-1">
        <h2 class="text-sm font-medium text-foreground">{props.title}</h2>
        {props.description && (
          <p class="text-xs text-muted-foreground">{props.description}</p>
        )}
      </div>
      <div class="flex flex-wrap items-start gap-4">{props.children}</div>
    </section>
  );
}

// Disable weekends for the "unavailable" example.
const isWeekend = (date: DateValue) => {
  const day = date.toDate("UTC").getDay();
  return day === 0 || day === 6;
};

function RouteComponent() {
  // Controlled example
  const [value, setValue] = createSignal<DateValue[]>([
    parseDate("2025-12-15"),
  ]);
  // Form submission demo
  const [submitted, setSubmitted] = createSignal<string | null>(null);

  return (
    <div class="flex max-w-3xl flex-col gap-10 p-8">
      <header class="flex flex-col gap-1">
        <h1 class="text-lg font-semibold">Date Picker</h1>
        <p class="text-sm text-muted-foreground">
          Built on Ark UI's date machine. Text input + calendar popover, with
          range / multiple / inline modes and presets all sharing the same
          state.
        </p>
      </header>

      {/* ─── Basic ────────────────────────────────────────────────────── */}
      <Section
        title="Basic"
        description="One-liner. Single date, typed input + calendar popover."
      >
        <DatePicker label="Pick a date" placeholder="mm/dd/yyyy" />
      </Section>

      {/* ─── With default value ─────────────────────────────────────── */}
      <Section
        title="Default value"
        description="Pre-fill with parseDate(). Useful for forms where you have an existing record."
      >
        <DatePicker
          label="Created on"
          defaultValue={[parseDate("2025-12-15")]}
        />
      </Section>

      {/* ─── Controlled ─────────────────────────────────────────────── */}
      <Section
        title="Controlled"
        description="Drive the value from a signal — the same pattern you'd use with TanStack Form."
      >
        <div class="flex flex-col gap-3">
          <DatePicker
            label="Controlled"
            value={value()}
            onValueChange={(d) => setValue(d.value)}
            showClear
          />
          <div class="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setValue([parseDate("2026-01-01")])}
            >
              Jump to Jan 1
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setValue([])}>
              Clear from outside
            </Button>
          </div>
          <p class="text-xs text-muted-foreground">
            Current value:{" "}
            <code class="rounded bg-muted px-1.5 py-0.5">
              {value()[0]?.toString() ?? "—"}
            </code>
          </p>
        </div>
      </Section>

      {/* ─── Range ──────────────────────────────────────────────────── */}
      <Section
        title="Range"
        description="selectionMode='range' renders two inputs and a single calendar that paints the range."
      >
        <DatePicker
          label="Date range"
          selectionMode="range"
          placeholder="mm/dd/yyyy"
        />
      </Section>

      {/* ─── Min / Max ──────────────────────────────────────────────── */}
      <Section
        title="Min and max"
        description="Restrict the calendar to a window. Dates outside are unselectable."
      >
        <DatePicker
          label="Pick a date in Dec 2025"
          min={parseDate("2025-12-01")}
          max={parseDate("2025-12-31")}
          defaultValue={[parseDate("2025-12-15")]}
        />
      </Section>

      {/* ─── Unavailable dates ──────────────────────────────────────── */}
      <Section
        title="Unavailable dates"
        description="Pass isDateUnavailable to gray out specific days. Weekends here."
      >
        <DatePicker label="Weekdays only" isDateUnavailable={isWeekend} />
      </Section>

      {/* ─── Presets (compound) ─────────────────────────────────────── */}
      <Section
        title="Presets (range)"
        description="Drops to compound parts because the convenience wrapper doesn't render preset triggers."
      >
        <DatePickerRoot selectionMode="range">
          <DatePickerLabel>Date range</DatePickerLabel>
          <DatePickerControl>
            <DatePickerInput index={0} />
            <DatePickerInput index={1} />
            <DatePickerTrigger />
            <DatePickerClearTrigger>Clear</DatePickerClearTrigger>
          </DatePickerControl>
          <div class="flex flex-wrap gap-1.5">
            <DatePickerPresetTrigger value="last7Days">
              Last 7 days
            </DatePickerPresetTrigger>
            <DatePickerPresetTrigger value="last14Days">
              Last 14 days
            </DatePickerPresetTrigger>
            <DatePickerPresetTrigger value="last30Days">
              Last 30 days
            </DatePickerPresetTrigger>
            <DatePickerPresetTrigger value="thisMonth">
              This month
            </DatePickerPresetTrigger>
            <DatePickerPresetTrigger value="lastMonth">
              Last month
            </DatePickerPresetTrigger>
          </div>
          <DatePickerPopover>
            <DatePickerAllViews />
          </DatePickerPopover>
        </DatePickerRoot>
      </Section>

      {/* ─── Inline ─────────────────────────────────────────────────── */}
      <Section
        title="Inline"
        description="Skip the popover — render the calendar directly. Good for dashboards / filter sidebars."
      >
        <DatePicker inline defaultValue={[parseDate("2025-12-15")]} />
      </Section>

      {/* ─── Month picker ───────────────────────────────────────────── */}
      <Section
        title="Month picker"
        description="defaultView='month' + minView='month' restricts the picker to month/year only."
      >
        <DatePicker
          label="Billing month"
          placeholder="mm/yyyy"
          defaultView="month"
          minView="month"
        />
      </Section>

      {/* ─── Custom trigger via Context ────────────────────────────── */}
      <Section
        title="Custom trigger (no input)"
        description="Skip DatePickerInput and use DatePickerContext to render the value inside the trigger. shadcn-style."
      >
        <DatePickerRoot>
          <DatePickerControl>
            <DatePickerTrigger class="w-64 justify-between gap-2 px-3 text-sm">
              <DatePickerContext>
                {(api) => (
                  <span class="text-foreground">
                    {api().valueAsString[0] || (
                      <span class="text-muted-foreground">Pick a date</span>
                    )}
                  </span>
                )}
              </DatePickerContext>
            </DatePickerTrigger>
          </DatePickerControl>
          <DatePickerPopover>
            <DatePickerDayView />
          </DatePickerPopover>
        </DatePickerRoot>
      </Section>

      {/* ─── In a card layout ───────────────────────────────────────── */}
      <Section
        title="In a card"
        description="An Argus-ish 'filter monitors by created date' panel."
      >
        <Card class="w-80 gap-4 p-4">
          <div class="flex flex-col gap-1">
            <p class="text-sm font-medium">Filter monitors</p>
            <p class="text-xs text-muted-foreground">
              Show monitors created in this range.
            </p>
          </div>
          <DatePicker
            selectionMode="range"
            defaultValue={[parseDate("2025-12-01"), parseDate("2025-12-15")]}
            showClear
          />
          <Button size="sm" class="self-start">
            Apply filter
          </Button>
        </Card>
      </Section>

      {/* ─── Native form integration ────────────────────────────────── */}
      <Section
        title="Native form"
        description="Pass name= and Ark submits the value as a form field. No glue code."
      >
        <form
          class="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            setSubmitted(String(data.get("appointment") ?? "(none)"));
          }}
        >
          <DatePicker
            label="Appointment date"
            name="appointment"
            isDateUnavailable={isWeekend}
          />
          <Button type="submit" size="sm" class="self-start">
            Submit
          </Button>
          {submitted() !== null && (
            <p class="text-xs text-muted-foreground">
              Submitted:{" "}
              <code class="rounded bg-muted px-1.5 py-0.5">{submitted()}</code>
            </p>
          )}
        </form>
      </Section>

      {/* ─── Inline compound (just the calendar) ────────────────────── */}
      <Section
        title="Inline — day view only"
        description="If you don't want the year/month drill-down, render just DatePickerDayView."
      >
        <DatePickerRoot inline>
          <DatePickerInline>
            <DatePickerDayView />
          </DatePickerInline>
        </DatePickerRoot>
      </Section>
    </div>
  );
}
