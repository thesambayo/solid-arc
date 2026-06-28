/**
 * Table — semantic HTML table primitives with our dashboard-y styling.
 *
 * Aesthetic: muted-bg header with uppercase tracking, hairline row dividers,
 * matching muted footer when present. Designed to drop inside a bordered
 * container (a Card, or a plain `rounded-lg border` div).
 *
 *   <Card>
 *     <Table>
 *       <TableHeader>
 *         <TableRow>
 *           <TableHead>Name</TableHead>
 *           <TableHead>Status</TableHead>
 *         </TableRow>
 *       </TableHeader>
 *       <TableBody>
 *         <For each={items}>
 *           {(item) => (
 *             <TableRow>
 *               <TableCell>{item.name}</TableCell>
 *               <TableCell>{item.status}</TableCell>
 *             </TableRow>
 *           )}
 *         </For>
 *       </TableBody>
 *     </Table>
 *   </Card>
 *
 * For sort/filter/pagination state, use TanStack Table (or your own signals).
 * This component is markup + styling only — no built-in state machine.
 */
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsUpDownIcon,
} from "lucide-solid";
import { type ComponentProps, type JSX, For, Show, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";

// ─── Container + table ────────────────────────────────────────────────────────

function Table(props: ComponentProps<"table">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    // Outer div lets the table scroll horizontally on narrow viewports
    // instead of breaking the layout it's nested in.
    <div data-slot="table-container" class="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        class={cn("w-full caption-bottom text-sm", local.class)}
        {...rest}
      />
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function TableHeader(props: ComponentProps<"thead">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <thead
      data-slot="table-header"
      class={cn(
        "border-b border-border bg-muted/50",
        "[&_tr]:border-0", // header rows don't need their own divider
        local.class,
      )}
      {...rest}
    />
  );
}

function TableBody(props: ComponentProps<"tbody">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <tbody
      data-slot="table-body"
      class={cn("[&_tr:last-child]:border-b-0", local.class)}
      {...rest}
    />
  );
}

function TableFooter(props: ComponentProps<"tfoot">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <tfoot
      data-slot="table-footer"
      class={cn(
        "border-t border-border bg-muted/50 font-medium",
        "[&>tr]:last:border-b-0",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function TableRow(props: ComponentProps<"tr">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <tr
      data-slot="table-row"
      class={cn(
        "border-b border-border transition-colors",
        "hover:bg-muted/40",
        // Add data-state="selected" on rows you want highlighted
        "data-[state=selected]:bg-muted",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Head / cell ──────────────────────────────────────────────────────────────

function TableHead(props: ComponentProps<"th">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <th
      data-slot="table-head"
      class={cn(
        "px-3 py-2 text-left align-middle",
        "text-xs font-medium tracking-wide text-muted-foreground uppercase",
        // Avoid extra padding when the cell only contains a checkbox
        "has-[[role=checkbox]]:pr-0",
        local.class,
      )}
      {...rest}
    />
  );
}

function TableCell(props: ComponentProps<"td">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <td
      data-slot="table-cell"
      class={cn(
        "px-3 py-2 align-middle",
        "has-[[role=checkbox]]:pr-0",
        local.class,
      )}
      {...rest}
    />
  );
}

function TableCaption(props: ComponentProps<"caption">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <caption
      data-slot="table-caption"
      class={cn("mt-4 text-sm text-muted-foreground", local.class)}
      {...rest}
    />
  );
}

// ─── Sortable head ────────────────────────────────────────────────────────────
// UI affordance only — sort state lives in the consumer (or TanStack Table).

type SortDirection = "asc" | "desc" | false;

interface TableSortableHeadProps extends Omit<
  ComponentProps<"th">,
  "children"
> {
  /**
   * The current sort direction for this column.
   * Pass `false` when this column is not the active sort.
   */
  direction: SortDirection;
  /** Called when the user clicks the header to toggle sort. */
  onSort: () => void;
  children: JSX.Element;
}

function TableSortableHead(props: TableSortableHeadProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "direction",
    "onSort",
    "children",
  ]);
  return (
    <TableHead class={local.class} {...rest}>
      <button
        type="button"
        onClick={() => local.onSort}
        class={cn(
          // Compensate for negative margin so the hit area aligns visually with non-sortable headers
          "-ml-1.5 inline-flex items-center gap-1.5 rounded px-1.5 py-0.5",
          "text-xs font-medium tracking-wide text-muted-foreground uppercase",
          "transition-colors hover:bg-muted hover:text-foreground",
          "data-[active=true]:text-foreground",
        )}
        data-active={local.direction !== false}
        aria-sort={
          local.direction === "asc"
            ? "ascending"
            : local.direction === "desc"
              ? "descending"
              : "none"
        }
      >
        {local.children}
        <Show
          when={local.direction !== false}
          fallback={<ChevronsUpDownIcon class="size-3 opacity-40" />}
        >
          {local.direction === "asc" ? (
            <ChevronUpIcon class="size-3" />
          ) : (
            <ChevronDownIcon class="size-3" />
          )}
        </Show>
      </button>
    </TableHead>
  );
}

// ─── Skeleton (first-load loading rows) ───────────────────────────────────────
// Render this inside <TableBody> when the data hasn't arrived yet (e.g.
// `query.isPending && !query.data`). For *refetch* loading (have data,
// fetching again), use the dim-overlay pattern instead — wrap the table in a
// relative container and toggle opacity + show a loading pill.

interface TableSkeletonProps {
  /** How many skeleton rows to render. @default 5 */
  rows?: number;
  /** How many cells per row. Should match your real column count. @default 4 */
  columns?: number;
}

function TableSkeleton(props: TableSkeletonProps) {
  const rows = () => props.rows ?? 5;
  const columns = () => props.columns ?? 4;
  // Cycle through varied widths so the grid looks natural, not robotic
  const widths = ["80%", "60%", "70%", "50%", "75%", "65%"];
  return (
    <For each={Array.from({ length: rows() })}>
      {(_, rowIdx) => (
        <TableRow>
          <For each={Array.from({ length: columns() })}>
            {(_, colIdx) => (
              <TableCell>
                <div
                  class="h-3.5 animate-pulse rounded bg-muted"
                  style={{
                    width: widths[(rowIdx() + colIdx() * 2) % widths.length],
                  }}
                />
              </TableCell>
            )}
          </For>
        </TableRow>
      )}
    </For>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableSortableHead,
  TableSkeleton,
};
