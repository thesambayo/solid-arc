/**
 * Pagination — built on Ark's smart pagination machine.
 *
 * Two API shapes:
 *
 *   1) The convenience one-liner — most usages will be this:
 *
 *      <Pagination
 *        count={query.data?.totalCount ?? 0}
 *        pageSize={10}
 *        page={page()}
 *        onPageChange={(d) => setPage(d.page)}
 *      />
 *
 *   2) Compound parts — when you need a richer footer (page-size selector,
 *      "Showing X–Y of Z" range, first/last buttons):
 *
 *      <PaginationRoot count={..} pageSize={..} page={..} onPageChange={..}>
 *        <PaginationContext>
 *          {(p) => (
 *            <>
 *              Page {p().page} of {p().totalPages}
 *              <PaginationPrevTrigger />
 *              <PaginationItems />
 *              <PaginationNextTrigger />
 *            </>
 *          )}
 *        </PaginationContext>
 *      </PaginationRoot>
 *
 * Both API shapes wire to the exact same Ark state machine — the convenience
 * version is just less to write when you don't need the extras.
 */
import { Pagination as PaginationPrimitive } from "@ark-ui/solid/pagination";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  EllipsisIcon,
} from "lucide-solid";
import { type ComponentProps, For, Show, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";

// ─── Shared styles ────────────────────────────────────────────────────────────

/**
 * Base style for any clickable cell in the pagination — items, prev/next
 * triggers, first/last triggers. Use group-data-[size=sm]/pagination: to react
 * to the size prop set on the root.
 */
const cellBase = cn(
  "inline-flex shrink-0 items-center justify-center tabular-nums select-none",
  "rounded-md text-sm font-medium transition-colors",
  // size default
  "size-8 group-data-[size=sm]/pagination:size-7",
  // hover
  "hover:bg-muted",
  // focus
  "focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
  // disabled
  "disabled:pointer-events-none disabled:opacity-40 data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
  // svg sizing
  "[&_svg]:size-4 group-data-[size=sm]/pagination:[&_svg]:size-3.5",
);

/**
 * Selected item should sit louder than hover — otherwise hover (bg-muted)
 * looks more present than the active page, which inverts the visual hierarchy.
 * Filled with foreground/10 + font bumped a notch.
 */
const itemSelectedStyle = cn(
  "data-[selected]:bg-foreground/10 data-[selected]:font-semibold",
  "data-[selected]:hover:bg-foreground/10",
);

// ─── Root ─────────────────────────────────────────────────────────────────────

type PaginationSize = "default" | "sm";

interface PaginationRootProps extends ComponentProps<
  typeof PaginationPrimitive.Root
> {
  size?: PaginationSize;
}

function PaginationRoot(props: PaginationRootProps) {
  const [local, rest] = splitProps(props, ["class", "size"]);
  return (
    <PaginationPrimitive.Root
      data-slot="pagination"
      data-size={local.size ?? "default"}
      class={cn("group/pagination flex items-center gap-1", local.class)}
      {...rest}
    />
  );
}

// ─── Items (auto-rendered pages + ellipses) ───────────────────────────────────

function PaginationItems(props: { class?: string }) {
  return (
    <PaginationPrimitive.Context>
      {(p) => (
        <For each={p().pages}>
          {(page, index) =>
            page.type === "page" ? (
              <PaginationPrimitive.Item
                {...page}
                class={cn(cellBase, itemSelectedStyle, props.class)}
              >
                {page.value}
              </PaginationPrimitive.Item>
            ) : (
              <PaginationPrimitive.Ellipsis
                index={index()}
                class={cn(
                  "inline-flex shrink-0 items-center justify-center text-muted-foreground",
                  "size-8 group-data-[size=sm]/pagination:size-7",
                  "[&_svg]:size-4 group-data-[size=sm]/pagination:[&_svg]:size-3.5",
                )}
              >
                <EllipsisIcon />
                <span class="sr-only">More pages</span>
              </PaginationPrimitive.Ellipsis>
            )
          }
        </For>
      )}
    </PaginationPrimitive.Context>
  );
}

// ─── Triggers ─────────────────────────────────────────────────────────────────

function PaginationPrevTrigger(
  props: ComponentProps<typeof PaginationPrimitive.PrevTrigger>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <PaginationPrimitive.PrevTrigger
      data-slot="pagination-prev"
      aria-label="Go to previous page"
      class={cn(cellBase, local.class)}
      {...rest}
    >
      {local.children ?? <ChevronLeftIcon />}
    </PaginationPrimitive.PrevTrigger>
  );
}

function PaginationNextTrigger(
  props: ComponentProps<typeof PaginationPrimitive.NextTrigger>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <PaginationPrimitive.NextTrigger
      data-slot="pagination-next"
      aria-label="Go to next page"
      class={cn(cellBase, local.class)}
      {...rest}
    >
      {local.children ?? <ChevronRightIcon />}
    </PaginationPrimitive.NextTrigger>
  );
}

/*
 * First / Last triggers — use Ark's native primitives so disabled state
 * and ARIA come from the same state machine as Prev / Next / Items.
 */

function PaginationFirstTrigger(
  props: ComponentProps<typeof PaginationPrimitive.FirstTrigger>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <PaginationPrimitive.FirstTrigger
      data-slot="pagination-first"
      aria-label="Go to first page"
      class={cn(cellBase, local.class)}
      {...rest}
    >
      {local.children ?? <ChevronsLeftIcon />}
    </PaginationPrimitive.FirstTrigger>
  );
}

function PaginationLastTrigger(
  props: ComponentProps<typeof PaginationPrimitive.LastTrigger>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <PaginationPrimitive.LastTrigger
      data-slot="pagination-last"
      aria-label="Go to last page"
      class={cn(cellBase, local.class)}
      {...rest}
    >
      {local.children ?? <ChevronsRightIcon />}
    </PaginationPrimitive.LastTrigger>
  );
}

// ─── Context passthrough ──────────────────────────────────────────────────────
// Re-export of Ark's Context render-prop. Use it to read state for
// "Showing X–Y of Z" text, page-size selectors, "Page X of Y", etc.

const PaginationContext = PaginationPrimitive.Context;

// ─── Convenience all-in-one ───────────────────────────────────────────────────

interface PaginationProps extends PaginationRootProps {
  /**
   * Show first and last page jump buttons (« and ») alongside prev/next.
   * @default false
   */
  showFirstLast?: boolean;
}

function Pagination(props: PaginationProps) {
  const [local, rest] = splitProps(props, ["showFirstLast"]);
  return (
    <PaginationRoot {...rest}>
      <Show when={local.showFirstLast}>
        <PaginationFirstTrigger />
      </Show>
      <PaginationPrevTrigger />
      <PaginationItems />
      <PaginationNextTrigger />
      <Show when={local.showFirstLast}>
        <PaginationLastTrigger />
      </Show>
    </PaginationRoot>
  );
}

export {
  Pagination,
  PaginationRoot,
  PaginationItems,
  PaginationPrevTrigger,
  PaginationNextTrigger,
  PaginationFirstTrigger,
  PaginationLastTrigger,
  PaginationContext,
};
