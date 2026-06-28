import { createFileRoute } from "@tanstack/solid-router";
import {
  ChevronRightIcon,
  CircleDashedIcon,
  GlobeIcon,
  InboxIcon,
  EllipsisIcon,
  RefreshCwIcon,
} from "lucide-solid";
import { For, Show, type JSX, createMemo, createSignal } from "solid-js";

import { Badge } from "../../components/ui/badge";
import { Button, buttonVariants } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../components/ui/empty";
import { Pagination } from "../../components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
  TableSortableHead,
} from "../../components/ui/table";

export const Route = createFileRoute("/previews/table")({
  component: RouteComponent,
});

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
      <div>{props.children}</div>
    </div>
  );
}

// ─── Fake data ────────────────────────────────────────────────────────────────

interface Invoice {
  id: string;
  status: "paid" | "pending" | "failed";
  method: string;
  amount: number;
}

const invoices: Invoice[] = [
  { id: "INV001", status: "paid", method: "Credit Card", amount: 250 },
  { id: "INV002", status: "pending", method: "PayPal", amount: 150 },
  { id: "INV003", status: "paid", method: "Bank Transfer", amount: 350 },
  { id: "INV004", status: "failed", method: "Credit Card", amount: 450 },
  { id: "INV005", status: "paid", method: "Credit Card", amount: 550 },
];

interface FakeMonitor {
  id: string;
  name: string;
  url: string;
  status: "up" | "degraded" | "down";
  method: "GET" | "POST";
  latency: number;
  uptime: number;
  region: string;
}

const monitors: FakeMonitor[] = [
  {
    id: "m1",
    name: "API Healthcheck",
    url: "api.argus.dev/health",
    status: "up",
    method: "GET",
    latency: 94,
    uptime: 99.98,
    region: "us-east",
  },
  {
    id: "m2",
    name: "Auth Service",
    url: "auth.argus.dev/ping",
    status: "up",
    method: "GET",
    latency: 112,
    uptime: 99.94,
    region: "us-east",
  },
  {
    id: "m3",
    name: "Billing API",
    url: "billing.argus.dev/v2/status",
    status: "down",
    method: "GET",
    latency: 0,
    uptime: 87.21,
    region: "us-west",
  },
  {
    id: "m4",
    name: "Search Index",
    url: "search.argus.dev/_status",
    status: "degraded",
    method: "POST",
    latency: 1840,
    uptime: 98.55,
    region: "eu-west",
  },
  {
    id: "m5",
    name: "Marketing Site",
    url: "argus.dev",
    status: "up",
    method: "GET",
    latency: 142,
    uptime: 100,
    region: "multi",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusBadge = (status: FakeMonitor["status"]) => {
  switch (status) {
    case "up":
      return <Badge variant="success">Operational</Badge>;
    case "degraded":
      return <Badge variant="default">Degraded</Badge>;
    case "down":
      return <Badge variant="destructive">Down</Badge>;
  }
};

const uptimeColor = (u: number) =>
  u >= 99.9 ? "text-success" : u >= 99 ? "text-warning" : "text-destructive";

function RouteComponent() {
  // ── Sortable example state
  const [sortKey, setSortKey] = createSignal<keyof FakeMonitor | null>(null);
  const [sortDir, setSortDir] = createSignal<"asc" | "desc">("asc");
  const toggleSort = (key: keyof FakeMonitor) => {
    if (sortKey() === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };
  const sorted = createMemo(() => {
    const k = sortKey();
    if (!k) return monitors;
    return [...monitors].sort((a, b) => {
      const av = a[k];
      const bv = b[k];
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortDir() === "asc" ? cmp : -cmp;
    });
  });

  // ── Selectable rows state
  const [selected, setSelected] = createSignal<Set<string>>(new Set());
  const allSelected = () => selected().size === invoices.length;
  const someSelected = () => selected().size > 0 && !allSelected();
  const toggleRow = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleAll = () =>
    setSelected(
      allSelected() ? new Set<string>() : new Set(invoices.map((i) => i.id)),
    );

  // ── Pagination state
  const [page, setPage] = createSignal(1);
  const pageSize = 3;
  const paginated = createMemo(() => {
    const start = (page() - 1) * pageSize;
    return monitors.slice(start, start + pageSize);
  });

  /*
   * ── Simulated TanStack Query state for the interactive demo
   *
   * Three states, mirroring what `createQuery` exposes:
   *   - status "pending" → no data yet (show skeleton)
   *   - status "idle"    → data loaded, not fetching
   *   - status "fetching" → have data, refetching (show dim-overlay)
   */
  const [queryStatus, setQueryStatus] = createSignal<
    "pending" | "idle" | "fetching"
  >("pending");
  const [queryData, setQueryData] = createSignal<FakeMonitor[] | undefined>(
    undefined,
  );

  // Initial load — fake 1s latency, then settle
  setTimeout(() => {
    setQueryData(monitors.slice(0, 3));
    setQueryStatus("idle");
  }, 1000);

  const refetch = () => {
    if (queryStatus() === "fetching") return;
    setQueryStatus("fetching");
    setTimeout(() => {
      setQueryData(monitors.slice(0, 3));
      setQueryStatus("idle");
    }, 700);
  };

  const resetToPending = () => {
    setQueryStatus("pending");
    setQueryData(undefined);
    setTimeout(() => {
      setQueryData(monitors.slice(0, 3));
      setQueryStatus("idle");
    }, 1000);
  };

  return (
    <div class="flex max-w-4xl flex-col gap-10 p-8">
      <div>
        <h1 class="text-lg font-semibold">Table</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Semantic HTML table primitives with dashboard styling — muted header,
          hairline row dividers. Drop inside a Card or bordered container.
        </p>
      </div>

      {/* ── 1. Basic ──────────────────────────────────────────────────────── */}
      <Section
        title="Basic"
        description="Drop a Table inside any bordered container."
      >
        <div class="overflow-hidden rounded-xl border border-border bg-popover">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead class="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <For each={invoices}>
                {(inv) => (
                  <TableRow>
                    <TableCell class="font-medium">{inv.id}</TableCell>
                    <TableCell class="text-muted-foreground capitalize">
                      {inv.status}
                    </TableCell>
                    <TableCell class="text-muted-foreground">
                      {inv.method}
                    </TableCell>
                    <TableCell class="text-right tabular-nums">
                      ${inv.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
              </For>
            </TableBody>
          </Table>
        </div>
      </Section>

      {/* ── 2. With footer ────────────────────────────────────────────────── */}
      <Section
        title="With footer"
        description="TableFooter gets the same muted bg as the header for visual balance."
      >
        <div class="overflow-hidden rounded-xl border border-border bg-popover">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Method</TableHead>
                <TableHead class="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <For each={invoices}>
                {(inv) => (
                  <TableRow>
                    <TableCell class="font-medium">{inv.id}</TableCell>
                    <TableCell class="text-muted-foreground">
                      {inv.method}
                    </TableCell>
                    <TableCell class="text-right tabular-nums">
                      ${inv.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
              </For>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell class="text-right tabular-nums">
                  ${invoices.reduce((sum, i) => sum + i.amount, 0).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Section>

      {/* ── 3. With caption ───────────────────────────────────────────────── */}
      <Section
        title="With caption"
        description="Use TableCaption for accessible labels. Renders below the table by default."
      >
        <div class="overflow-hidden rounded-xl border border-border bg-popover">
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead class="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <For each={invoices.slice(0, 3)}>
                {(inv) => (
                  <TableRow>
                    <TableCell class="font-medium">{inv.id}</TableCell>
                    <TableCell class="text-muted-foreground capitalize">
                      {inv.status}
                    </TableCell>
                    <TableCell class="text-right tabular-nums">
                      ${inv.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
              </For>
            </TableBody>
          </Table>
        </div>
      </Section>

      {/* ── 4. Sortable columns ───────────────────────────────────────────── */}
      <Section
        title="Sortable columns"
        description="TableSortableHead is a UI affordance — sort state lives in your component (or TanStack Table)."
      >
        <div class="overflow-hidden rounded-xl border border-border bg-popover">
          <Table>
            <TableHeader>
              <TableRow>
                <TableSortableHead
                  direction={sortKey() === "name" ? sortDir() : false}
                  onSort={() => toggleSort("name")}
                >
                  Name
                </TableSortableHead>
                <TableHead>Status</TableHead>
                <TableSortableHead
                  direction={sortKey() === "latency" ? sortDir() : false}
                  onSort={() => toggleSort("latency")}
                >
                  Latency
                </TableSortableHead>
                <TableSortableHead
                  direction={sortKey() === "uptime" ? sortDir() : false}
                  onSort={() => toggleSort("uptime")}
                >
                  Uptime
                </TableSortableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <For each={sorted()}>
                {(m) => (
                  <TableRow>
                    <TableCell class="font-medium">{m.name}</TableCell>
                    <TableCell>{statusBadge(m.status)}</TableCell>
                    <TableCell class="tabular-nums">
                      {m.status === "down" ? "—" : `${m.latency}ms`}
                    </TableCell>
                    <TableCell
                      class={`font-medium tabular-nums ${uptimeColor(m.uptime)}`}
                    >
                      {m.uptime.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                )}
              </For>
            </TableBody>
          </Table>
        </div>
        <p class="mt-2 text-xs text-muted-foreground">
          Sorting by:{" "}
          <span class="font-mono">
            {sortKey() ?? "none"} {sortKey() ? `(${sortDir()})` : ""}
          </span>
        </p>
      </Section>

      {/* ── 5. With actions column ────────────────────────────────────────── */}
      <Section
        title="With actions"
        description="Pair the last cell with a DropdownMenu for per-row actions."
      >
        <div class="overflow-hidden rounded-xl border border-border bg-popover">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead class="text-right">Amount</TableHead>
                <TableHead class="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <For each={invoices}>
                {(inv) => (
                  <TableRow>
                    <TableCell class="font-medium">{inv.id}</TableCell>
                    <TableCell class="text-muted-foreground capitalize">
                      {inv.status}
                    </TableCell>
                    <TableCell class="text-right tabular-nums">
                      ${inv.amount.toFixed(2)}
                    </TableCell>
                    <TableCell class="w-10 p-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          class={buttonVariants({
                            variant: "ghost",
                            size: "icon-sm",
                          })}
                          aria-label="Open actions"
                        >
                          <EllipsisIcon class="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem value="view">View</DropdownMenuItem>
                          <DropdownMenuItem value="duplicate">
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem value="delete">
                            <span class="text-destructive">Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )}
              </For>
            </TableBody>
          </Table>
        </div>
      </Section>

      {/* ── 6. Selectable rows ────────────────────────────────────────────── */}
      <Section
        title="Selectable rows"
        description="Drop a Checkbox in the first cell. Toggle data-state='selected' on the row for the highlight."
      >
        <div class="overflow-hidden rounded-xl border border-border bg-popover">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-10">
                  <Checkbox
                    checked={
                      allSelected()
                        ? true
                        : someSelected()
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={() => toggleAll()}
                  />
                </TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead class="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <For each={invoices}>
                {(inv) => (
                  <TableRow
                    data-state={selected().has(inv.id) ? "selected" : undefined}
                  >
                    <TableCell class="w-10">
                      <Checkbox
                        checked={selected().has(inv.id)}
                        onCheckedChange={() => toggleRow(inv.id)}
                      />
                    </TableCell>
                    <TableCell class="font-medium">{inv.id}</TableCell>
                    <TableCell class="text-muted-foreground capitalize">
                      {inv.status}
                    </TableCell>
                    <TableCell class="text-right tabular-nums">
                      ${inv.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
              </For>
            </TableBody>
          </Table>
        </div>
        <p class="mt-2 text-xs text-muted-foreground">
          Selected: <span class="font-mono">{selected().size}</span> of{" "}
          {invoices.length}
        </p>
      </Section>

      {/* ── 7. With pagination footer ─────────────────────────────────────── */}
      <Section
        title="With pagination"
        description="Table + Pagination in a single bordered container — the production dashboard pattern."
      >
        <div class="overflow-hidden rounded-xl border border-border bg-popover">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Monitor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead class="text-right">Latency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <For each={paginated()}>
                {(m) => (
                  <TableRow>
                    <TableCell>
                      <div class="font-medium">{m.name}</div>
                      <div class="font-mono text-xs text-muted-foreground">
                        {m.url}
                      </div>
                    </TableCell>
                    <TableCell>{statusBadge(m.status)}</TableCell>
                    <TableCell class="text-right tabular-nums">
                      {m.status === "down" ? "—" : `${m.latency}ms`}
                    </TableCell>
                  </TableRow>
                )}
              </For>
            </TableBody>
          </Table>
          <div class="flex items-center justify-between border-t border-border bg-muted/50 px-3 py-2">
            <p class="text-xs text-muted-foreground">
              Showing {(page() - 1) * pageSize + 1}–
              {Math.min(page() * pageSize, monitors.length)} of{" "}
              {monitors.length}
            </p>
            <Pagination
              size="sm"
              count={monitors.length}
              pageSize={pageSize}
              page={page()}
              onPageChange={(d) => setPage(d.page)}
            />
          </div>
        </div>
      </Section>

      {/* ── 8. Empty state ────────────────────────────────────────────────── */}
      <Section
        title="Empty state"
        description="When there's no data, drop an Empty inside the container instead of an empty tbody."
      >
        <div class="overflow-hidden rounded-xl border border-border bg-popover">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead class="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <Empty class="py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <InboxIcon />
              </EmptyMedia>
              <EmptyTitle>No invoices yet</EmptyTitle>
              <EmptyDescription>
                Invoices will appear here when customers make payments.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </Section>

      {/* ── 9. Loading states ─────────────────────────────────────────────── */}
      <Section
        title="Loading states"
        description="Two patterns for two scenarios. Skeleton for first load (no data yet). Dim-overlay for refetches (have data, fetching more)."
      >
        <div class="flex flex-col gap-4">
          {/* a) Skeleton — first load */}
          <div>
            <p class="mb-1.5 text-xs text-muted-foreground">
              <strong class="text-foreground">a) Skeleton</strong> — use for
              first load (query.isPending). Drop{" "}
              <code class="rounded bg-muted px-1 py-0.5">{`<TableSkeleton />`}</code>{" "}
              inside TableBody.
            </p>
            <div class="overflow-hidden rounded-xl border border-border bg-popover">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead class="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableSkeleton rows={4} columns={3} />
                </TableBody>
              </Table>
            </div>
          </div>

          {/* b) Dim-overlay — refetch */}
          <div>
            <p class="mb-1.5 text-xs text-muted-foreground">
              <strong class="text-foreground">b) Dim-overlay</strong> — use for
              refetch (query.isFetching && query.data). Wrap the table in a{" "}
              <code class="rounded bg-muted px-1 py-0.5">relative</code> div,
              dim the content, show a pill.
            </p>
            <div class="overflow-hidden rounded-xl border border-border bg-popover">
              <div class="relative">
                <div class="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-popover px-2 py-1 text-xs font-medium shadow-sm ring-1 ring-border">
                  <CircleDashedIcon class="size-3 animate-spin" />
                  Refreshing
                </div>
                <div class="pointer-events-none opacity-50 transition-opacity">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead class="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <For each={invoices.slice(0, 3)}>
                        {(inv) => (
                          <TableRow>
                            <TableCell class="font-medium">{inv.id}</TableCell>
                            <TableCell class="text-muted-foreground capitalize">
                              {inv.status}
                            </TableCell>
                            <TableCell class="text-right tabular-nums">
                              ${inv.amount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        )}
                      </For>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 10. Full TanStack Query flow (interactive) ───────────────────── */}
      <Section
        title="Full TanStack Query flow"
        description='Click "Refetch" to see the dim-overlay during refetch. Click "Reset" to go back to the pending (skeleton) state. This is exactly what your production code will look like.'
      >
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={refetch}
              disabled={queryStatus() === "fetching" || !queryData()}
            >
              <RefreshCwIcon
                class={`size-3.5 ${queryStatus() === "fetching" ? "animate-spin" : ""}`}
              />
              Refetch
            </Button>
            <Button size="sm" variant="ghost" onClick={resetToPending}>
              Reset to pending
            </Button>
            <span class="ml-2 text-xs text-muted-foreground">
              status:{" "}
              <span class="font-mono text-foreground">{queryStatus()}</span>
            </span>
          </div>

          <div class="overflow-hidden rounded-xl border border-border bg-popover">
            <Show
              when={queryData()}
              fallback={
                // ── First load: no data → skeleton
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Monitor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead class="text-right">Latency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableSkeleton rows={3} columns={3} />
                  </TableBody>
                </Table>
              }
            >
              {(data) => (
                // ── Has data: render table + optional dim-overlay
                <div class="relative">
                  <Show when={queryStatus() === "fetching"}>
                    <div class="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-popover px-2 py-1 text-xs font-medium shadow-sm ring-1 ring-border">
                      <CircleDashedIcon class="size-3 animate-spin" />
                      Refreshing
                    </div>
                  </Show>
                  <div
                    class={`transition-opacity ${
                      queryStatus() === "fetching"
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  >
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Monitor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead class="text-right">Latency</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <For each={data()}>
                          {(m) => (
                            <TableRow>
                              <TableCell>
                                <div class="font-medium">{m.name}</div>
                                <div class="font-mono text-xs text-muted-foreground">
                                  {m.url}
                                </div>
                              </TableCell>
                              <TableCell>{statusBadge(m.status)}</TableCell>
                              <TableCell class="text-right tabular-nums">
                                {m.status === "down" ? "—" : `${m.latency}ms`}
                              </TableCell>
                            </TableRow>
                          )}
                        </For>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </Show>
          </div>

          <pre class="overflow-auto rounded-lg border border-border bg-muted/40 p-3 text-xs leading-relaxed">
            <code>{`<Show
  when={query.data}
  fallback={<TableSkeleton rows={5} columns={4} />}
>
  {(data) => (
    <div class="relative">
      <Show when={query.isFetching}>
        <LoadingPill />  {/* the dim-overlay */}
      </Show>
      <div class={query.isFetching ? "opacity-50 pointer-events-none" : ""}>
        <Table>
          <For each={data().items}>{(item) => <Row item={item} />}</For>
        </Table>
      </div>
    </div>
  )}
</Show>`}</code>
          </pre>
        </div>
      </Section>

      {/* ── 11. Argus monitors port ───────────────────────────────────────── */}
      <Section
        title="Argus monitors — full dashboard pattern"
        description="The monitors.tsx table rebuilt with primitives + design tokens. No inline styles, all semantic colors."
      >
        <div class="overflow-hidden rounded-xl border border-border bg-popover">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Monitor</TableHead>
                <TableHead class="text-right">Latency</TableHead>
                <TableHead class="text-right">Uptime (30d)</TableHead>
                <TableHead>Region</TableHead>
                <TableHead class="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <For each={monitors}>
                {(m) => (
                  <TableRow class="cursor-pointer">
                    <TableCell>{statusBadge(m.status)}</TableCell>
                    <TableCell>
                      <div class="flex items-center gap-2">
                        <Badge variant="outline" class="font-mono text-xs">
                          {m.method}
                        </Badge>
                        <div>
                          <div class="font-medium">{m.name}</div>
                          <div class="font-mono text-xs text-muted-foreground">
                            {m.url}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      class={`text-right font-medium tabular-nums ${
                        m.status === "down" ? "text-destructive" : ""
                      }`}
                    >
                      {m.status === "down" ? "— —" : `${m.latency}ms`}
                    </TableCell>
                    <TableCell
                      class={`text-right font-medium tabular-nums ${uptimeColor(m.uptime)}`}
                    >
                      {m.uptime.toFixed(2)}%
                    </TableCell>
                    <TableCell class="text-muted-foreground">
                      <div class="inline-flex items-center gap-1.5">
                        <GlobeIcon class="size-3" />
                        {m.region === "multi" ? "Multi" : m.region}
                      </div>
                    </TableCell>
                    <TableCell class="w-10 text-muted-foreground">
                      <ChevronRightIcon class="size-4" />
                    </TableCell>
                  </TableRow>
                )}
              </For>
            </TableBody>
          </Table>
        </div>
        <p class="mt-3 text-xs text-muted-foreground">
          Compare against{" "}
          <code class="rounded bg-muted px-1 py-0.5">routes/monitors.tsx</code>{" "}
          — no inline styles, no custom CSS classes, just primitives + semantic
          tokens.
        </p>
      </Section>
    </div>
  );
}
