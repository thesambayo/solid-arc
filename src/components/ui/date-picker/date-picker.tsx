/**
 * DatePicker — Ark UI's date machine + our dashboard styling.
 *
 * Two API shapes (same pattern as Pagination):
 *
 *   1) Convenience one-liner — most usages will be this:
 *
 *      <DatePicker
 *        value={date()}
 *        onValueChange={(d) => setDate(d.value)}
 *        placeholder="Pick a date"
 *      />
 *
 *      Add `selectionMode="range"` for ranges, `inline` to skip the popover,
 *      `defaultView="month"` + `minView="month"` for a month-only picker.
 *
 *   2) Compound parts — for presets, custom popover footers, mixed views:
 *
 *      <DatePickerRoot selectionMode="range">
 *        <DatePickerLabel>Range</DatePickerLabel>
 *        <DatePickerControl>
 *          <DatePickerInput index={0} />
 *          <DatePickerInput index={1} />
 *          <DatePickerTrigger />
 *        </DatePickerControl>
 *        <DatePickerPresetTrigger value="last7Days">Last 7</DatePickerPresetTrigger>
 *        <DatePickerPopover>
 *          <DatePickerDayView />
 *        </DatePickerPopover>
 *      </DatePickerRoot>
 *
 * `parseDate` is re-exported for setting `defaultValue` / `min` / `max`:
 *
 *      <DatePicker defaultValue={[parseDate("2025-12-01")]} />
 *
 * Built on @ark-ui/solid/date-picker — value type is `DateValue[]` (Ark's
 * internationalized date representation), even for single selection mode.
 */
import { DatePicker as DatePickerPrimitive } from "@ark-ui/solid/date-picker";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-solid";
import {
  type ComponentProps,
  type JSX,
  Index,
  Show,
  splitProps,
} from "solid-js";
import { Portal } from "solid-js/web";

import { cn } from "../../../lib/cn";

// Re-export DateValue helpers so consumers don't need to depend on
// @internationalized/date directly.
export { parseDate } from "@ark-ui/solid/date-picker";

// ─── Root ─────────────────────────────────────────────────────────────────────

function DatePickerRoot(
  props: ComponentProps<typeof DatePickerPrimitive.Root>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.Root
      data-slot="date-picker"
      class={cn("group/datepicker flex flex-col gap-1.5", local.class)}
      {...rest}
    />
  );
}

// ─── Label ────────────────────────────────────────────────────────────────────

function DatePickerLabel(
  props: ComponentProps<typeof DatePickerPrimitive.Label>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.Label
      data-slot="date-picker-label"
      class={cn(
        "text-sm font-medium text-foreground",
        "data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Control (input + trigger row) ────────────────────────────────────────────

function DatePickerControl(
  props: ComponentProps<typeof DatePickerPrimitive.Control>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.Control
      data-slot="date-picker-control"
      class={cn("flex items-center gap-2", local.class)}
      {...rest}
    />
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

function DatePickerInput(
  props: ComponentProps<typeof DatePickerPrimitive.Input>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.Input
      data-slot="date-picker-input"
      class={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-border bg-popover px-3 py-1 text-sm text-foreground tabular-nums outline-none",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20",
        "data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20",
        "disabled:pointer-events-none disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Trigger (calendar icon button) ───────────────────────────────────────────

function DatePickerTrigger(
  props: ComponentProps<typeof DatePickerPrimitive.Trigger>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <DatePickerPrimitive.Trigger
      data-slot="date-picker-trigger"
      aria-label="Open calendar"
      class={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-popover text-muted-foreground",
        "transition-colors hover:bg-muted hover:text-foreground",
        "focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:size-4",
        local.class,
      )}
      {...rest}
    >
      {local.children ?? <CalendarIcon />}
    </DatePickerPrimitive.Trigger>
  );
}

// ─── ClearTrigger ─────────────────────────────────────────────────────────────

function DatePickerClearTrigger(
  props: ComponentProps<typeof DatePickerPrimitive.ClearTrigger>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.ClearTrigger
      data-slot="date-picker-clear"
      class={cn(
        "inline-flex h-9 items-center justify-center rounded-md px-3 text-sm text-muted-foreground",
        "transition-colors hover:bg-muted hover:text-foreground",
        "focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Popover (Portal + Positioner + Content) ──────────────────────────────────
// One component wraps all three; same shape as our PopoverContent.

function DatePickerPopover(
  props: ComponentProps<typeof DatePickerPrimitive.Content>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <Portal>
      <DatePickerPrimitive.Positioner>
        <DatePickerPrimitive.Content
          data-slot="date-picker-content"
          class={cn(
            "z-50 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            local.class,
          )}
          {...rest}
        >
          {local.children}
        </DatePickerPrimitive.Content>
      </DatePickerPrimitive.Positioner>
    </Portal>
  );
}

// ─── Inline wrapper (for `inline` mode — no Portal) ───────────────────────────
// When the DatePicker is inline, Content/Positioner aren't used. Provide a
// styled container so the inline calendar still gets the popover-ish chrome.

function DatePickerInline(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="date-picker-inline"
      class={cn(
        "rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-sm",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── View (day / month / year switching container) ────────────────────────────

function DatePickerView(
  props: ComponentProps<typeof DatePickerPrimitive.View>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.View
      data-slot="date-picker-view"
      class={cn("flex flex-col gap-2", local.class)}
      {...rest}
    />
  );
}

// ─── ViewControl (header: prev | title | next) ────────────────────────────────

function DatePickerViewControl(
  props: ComponentProps<typeof DatePickerPrimitive.ViewControl>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.ViewControl
      data-slot="date-picker-view-control"
      class={cn("flex items-center justify-between gap-1", local.class)}
      {...rest}
    />
  );
}

// Shared style for prev/next icon buttons in the header.
const navTriggerStyle = cn(
  "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground",
  "transition-colors hover:bg-muted hover:text-foreground",
  "focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
  "disabled:pointer-events-none disabled:opacity-40",
  "[&_svg]:size-4",
);

function DatePickerPrevTrigger(
  props: ComponentProps<typeof DatePickerPrimitive.PrevTrigger>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <DatePickerPrimitive.PrevTrigger
      data-slot="date-picker-prev"
      aria-label="Previous"
      class={cn(navTriggerStyle, local.class)}
      {...rest}
    >
      {local.children ?? <ChevronLeftIcon />}
    </DatePickerPrimitive.PrevTrigger>
  );
}

function DatePickerNextTrigger(
  props: ComponentProps<typeof DatePickerPrimitive.NextTrigger>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <DatePickerPrimitive.NextTrigger
      data-slot="date-picker-next"
      aria-label="Next"
      class={cn(navTriggerStyle, local.class)}
      {...rest}
    >
      {local.children ?? <ChevronRightIcon />}
    </DatePickerPrimitive.NextTrigger>
  );
}

// ViewTrigger — the clickable title that cycles day → month → year view.
function DatePickerViewTrigger(
  props: ComponentProps<typeof DatePickerPrimitive.ViewTrigger>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.ViewTrigger
      data-slot="date-picker-view-trigger"
      class={cn(
        "inline-flex h-7 items-center justify-center rounded-md px-2 text-sm font-medium text-foreground",
        "transition-colors hover:bg-muted",
        "focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
        local.class,
      )}
      {...rest}
    />
  );
}

function DatePickerRangeText(
  props: ComponentProps<typeof DatePickerPrimitive.RangeText>,
) {
  return <DatePickerPrimitive.RangeText {...props} />;
}

// ─── Table (the grid) ─────────────────────────────────────────────────────────

function DatePickerTable(
  props: ComponentProps<typeof DatePickerPrimitive.Table>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.Table
      data-slot="date-picker-table"
      class={cn("w-full border-collapse", local.class)}
      {...rest}
    />
  );
}

function DatePickerTableHead(
  props: ComponentProps<typeof DatePickerPrimitive.TableHead>,
) {
  return <DatePickerPrimitive.TableHead {...props} />;
}

function DatePickerTableBody(
  props: ComponentProps<typeof DatePickerPrimitive.TableBody>,
) {
  return <DatePickerPrimitive.TableBody {...props} />;
}

function DatePickerTableRow(
  props: ComponentProps<typeof DatePickerPrimitive.TableRow>,
) {
  return <DatePickerPrimitive.TableRow {...props} />;
}

function DatePickerTableHeader(
  props: ComponentProps<typeof DatePickerPrimitive.TableHeader>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.TableHeader
      data-slot="date-picker-table-header"
      class={cn(
        "h-8 w-8 text-center text-xs font-medium text-muted-foreground",
        local.class,
      )}
      {...rest}
    />
  );
}

function DatePickerTableCell(
  props: ComponentProps<typeof DatePickerPrimitive.TableCell>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.TableCell
      data-slot="date-picker-table-cell"
      class={cn("p-0 text-center", local.class)}
      {...rest}
    />
  );
}

// TableCellTrigger — the actual clickable day/month/year button.
// Big bag of data-attribute states; see Ark UI's docs for the full list.
function DatePickerTableCellTrigger(
  props: ComponentProps<typeof DatePickerPrimitive.TableCellTrigger>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.TableCellTrigger
      data-slot="date-picker-table-cell-trigger"
      class={cn(
        // Base: square 8, centered, small, tabular for grid alignment.
        // group-data-[view=month]/datepicker-view & year get bumped wider below.
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-sm tabular-nums",
        "transition-colors",
        // Idle hover
        "hover:bg-muted",
        // Today indicator — subtle muted background, no border
        "data-today:font-semibold data-today:underline data-today:underline-offset-4",
        // Days outside the current month
        "data-outside-range:text-muted-foreground/60",
        // Unavailable (e.g. weekends in our example)
        "data-unavailable:text-muted-foreground/40 data-unavailable:line-through",
        // Disabled (e.g. outside min/max)
        "data-disabled:pointer-events-none data-disabled:opacity-40",
        // Selected single — strong foreground fill
        "data-selected:bg-foreground data-selected:font-semibold data-selected:text-background",
        "data-selected:hover:bg-foreground",
        // Range middle — subtle band
        "data-in-range:rounded-none data-in-range:bg-muted",
        // Range edges — foreground fill + matching radius
        "data-range-start:rounded-l-md data-range-start:rounded-r-none data-range-start:bg-foreground data-range-start:text-background",
        "data-range-end:rounded-l-none data-range-end:rounded-r-md data-range-end:bg-foreground data-range-end:text-background",
        // Focus
        "focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
        local.class,
      )}
      {...rest}
    />
  );
}

// Wider cell trigger for month/year grids (4 columns instead of 7).
function DatePickerGridCellTrigger(
  props: ComponentProps<typeof DatePickerPrimitive.TableCellTrigger>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DatePickerTableCellTrigger
      class={cn("h-9 w-full", local.class)}
      {...rest}
    />
  );
}

// ─── PresetTrigger ────────────────────────────────────────────────────────────

function DatePickerPresetTrigger(
  props: ComponentProps<typeof DatePickerPrimitive.PresetTrigger>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.PresetTrigger
      data-slot="date-picker-preset"
      class={cn(
        "inline-flex h-7 items-center justify-center rounded-md border border-border bg-popover px-2 text-xs text-foreground",
        "transition-colors hover:bg-muted",
        "focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Context passthrough ──────────────────────────────────────────────────────

const DatePickerContext = DatePickerPrimitive.Context;

// ─── Pre-built views (the verbose parts, condensed) ───────────────────────────
// These are the day/month/year grids spelled out once so consumers don't have
// to. Use them inside <DatePickerPopover> or <DatePickerInline>.

function DatePickerDayView() {
  return (
    <DatePickerView view="day">
      <DatePickerViewControl>
        <DatePickerPrevTrigger />
        <DatePickerViewTrigger>
          <DatePickerRangeText />
        </DatePickerViewTrigger>
        <DatePickerNextTrigger />
      </DatePickerViewControl>
      <DatePickerContext>
        {(api) => (
          <DatePickerTable>
            <DatePickerTableHead>
              <DatePickerTableRow>
                <Index each={api().weekDays}>
                  {(weekDay) => (
                    <DatePickerTableHeader>
                      {weekDay().short}
                    </DatePickerTableHeader>
                  )}
                </Index>
              </DatePickerTableRow>
            </DatePickerTableHead>
            <DatePickerTableBody>
              <Index each={api().weeks}>
                {(week) => (
                  <DatePickerTableRow>
                    <Index each={week()}>
                      {(day) => (
                        <DatePickerTableCell value={day()}>
                          <DatePickerTableCellTrigger>
                            {day().day}
                          </DatePickerTableCellTrigger>
                        </DatePickerTableCell>
                      )}
                    </Index>
                  </DatePickerTableRow>
                )}
              </Index>
            </DatePickerTableBody>
          </DatePickerTable>
        )}
      </DatePickerContext>
    </DatePickerView>
  );
}

function DatePickerMonthView() {
  return (
    <DatePickerView view="month">
      <DatePickerViewControl>
        <DatePickerPrevTrigger />
        <DatePickerViewTrigger>
          <DatePickerRangeText />
        </DatePickerViewTrigger>
        <DatePickerNextTrigger />
      </DatePickerViewControl>
      <DatePickerContext>
        {(api) => (
          <DatePickerTable>
            <DatePickerTableBody>
              <Index
                each={api().getMonthsGrid({ columns: 4, format: "short" })}
              >
                {(months) => (
                  <DatePickerTableRow>
                    <Index each={months()}>
                      {(month) => (
                        <DatePickerTableCell value={month().value}>
                          <DatePickerGridCellTrigger>
                            {month().label}
                          </DatePickerGridCellTrigger>
                        </DatePickerTableCell>
                      )}
                    </Index>
                  </DatePickerTableRow>
                )}
              </Index>
            </DatePickerTableBody>
          </DatePickerTable>
        )}
      </DatePickerContext>
    </DatePickerView>
  );
}

function DatePickerYearView() {
  return (
    <DatePickerView view="year">
      <DatePickerViewControl>
        <DatePickerPrevTrigger />
        <DatePickerViewTrigger>
          <DatePickerRangeText />
        </DatePickerViewTrigger>
        <DatePickerNextTrigger />
      </DatePickerViewControl>
      <DatePickerContext>
        {(api) => (
          <DatePickerTable>
            <DatePickerTableBody>
              <Index each={api().getYearsGrid({ columns: 4 })}>
                {(years) => (
                  <DatePickerTableRow>
                    <Index each={years()}>
                      {(year) => (
                        <DatePickerTableCell value={year().value}>
                          <DatePickerGridCellTrigger>
                            {year().label}
                          </DatePickerGridCellTrigger>
                        </DatePickerTableCell>
                      )}
                    </Index>
                  </DatePickerTableRow>
                )}
              </Index>
            </DatePickerTableBody>
          </DatePickerTable>
        )}
      </DatePickerContext>
    </DatePickerView>
  );
}

/**
 * All three views (day / month / year) — Ark only renders the active one, so
 * dropping all three in lets users click the title to drill from day to month
 * to year and back. Use this as the default body for DatePickerPopover.
 */
function DatePickerAllViews() {
  return (
    <>
      <DatePickerDayView />
      <DatePickerMonthView />
      <DatePickerYearView />
    </>
  );
}

// ─── Convenience all-in-one ───────────────────────────────────────────────────

interface DatePickerProps extends ComponentProps<
  typeof DatePickerPrimitive.Root
> {
  /** Label rendered above the input. */
  label?: JSX.Element;
  /**
   * Whether to show a clear button next to the input.
   * @default false
   */
  showClear?: boolean;
  /**
   * Render as a static inline calendar with no input/trigger/popover.
   * Useful for dashboards. Implies `inline` on the root.
   * @default false
   */
  inline?: boolean;
}

function DatePicker(props: DatePickerProps) {
  const [local, rest] = splitProps(props, [
    "label",
    "showClear",
    "inline",
    "selectionMode",
  ]);
  const isRange = () => local.selectionMode === "range";

  return (
    <DatePickerRoot
      selectionMode={local.selectionMode}
      inline={local.inline}
      {...rest}
    >
      <Show when={local.label}>
        <DatePickerLabel>{local.label}</DatePickerLabel>
      </Show>

      <Show when={!local.inline}>
        <DatePickerControl>
          <Show when={isRange()} fallback={<DatePickerInput />}>
            <DatePickerInput index={0} />
            <DatePickerInput index={1} />
          </Show>
          <DatePickerTrigger />
          <Show when={local.showClear}>
            <DatePickerClearTrigger>Clear</DatePickerClearTrigger>
          </Show>
        </DatePickerControl>
      </Show>

      <Show
        when={local.inline}
        fallback={
          <DatePickerPopover>
            <DatePickerAllViews />
          </DatePickerPopover>
        }
      >
        <DatePickerInline>
          <DatePickerAllViews />
        </DatePickerInline>
      </Show>
    </DatePickerRoot>
  );
}

export {
  DatePicker,
  DatePickerRoot,
  DatePickerLabel,
  DatePickerControl,
  DatePickerInput,
  DatePickerTrigger,
  DatePickerClearTrigger,
  DatePickerPopover,
  DatePickerInline,
  DatePickerView,
  DatePickerViewControl,
  DatePickerPrevTrigger,
  DatePickerNextTrigger,
  DatePickerViewTrigger,
  DatePickerRangeText,
  DatePickerTable,
  DatePickerTableHead,
  DatePickerTableBody,
  DatePickerTableRow,
  DatePickerTableHeader,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerPresetTrigger,
  DatePickerContext,
  DatePickerDayView,
  DatePickerMonthView,
  DatePickerYearView,
  DatePickerAllViews,
};
