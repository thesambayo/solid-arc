import { createListCollection } from "@ark-ui/solid/select";
import { createFileRoute } from "@tanstack/solid-router";
import { CircleDashedIcon } from "lucide-solid";
import {
  For,
  Show,
  type JSX,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
} from "solid-js";

import {
  Pagination,
  PaginationContext,
  PaginationFirstTrigger,
  PaginationItems,
  PaginationLastTrigger,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectControl,
  SelectItem,
  SelectTrigger,
  SelectValueText,
} from "../../components/ui/select";

export const Route = createFileRoute("/previews/pagination")({
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

const FAKE_USERS = Array.from({ length: 47 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@argus.dev`,
  joined: new Date(2024, 0, (i % 28) + 1).toLocaleDateString(),
}));

const pageSizeCollection = createListCollection({
  items: [
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "50", value: "50" },
  ],
});

// ─── Fake server query — simulates TanStack Query with latency ───────────────
// Returns { items, totalCount, isLoading }. Resembles what a real
// useQuery({ queryKey: ['monitors', page] }) returns.

function useFakeServerQuery(args: () => { page: number; pageSize: number }) {
  const [isLoading, setIsLoading] = createSignal(false);
  const [data, setData] = createSignal<{
    items: typeof FAKE_USERS;
    totalCount: number;
  }>({ items: FAKE_USERS.slice(0, 10), totalCount: FAKE_USERS.length });

  // Re-fetch whenever args change. createEffect is the right primitive for
  // side effects (memos are for derived values — using them for effects works
  // by accident but is an anti-pattern).
  createEffect(() => {
    const a = args();
    setIsLoading(true);
    const start = (a.page - 1) * a.pageSize;
    const end = start + a.pageSize;

    const timer = setTimeout(() => {
      setData({
        items: FAKE_USERS.slice(start, end),
        totalCount: FAKE_USERS.length,
      });
      setIsLoading(false);
    }, 500);

    // Cancel the pending fetch if args change before it resolves
    onCleanup(() => clearTimeout(timer));
  });

  return { isLoading, data };
}

function RouteComponent() {
  // local state for various controlled examples
  const [page1, setPage1] = createSignal(1);
  const [page2, setPage2] = createSignal(3);
  const [page3, setPage3] = createSignal(1);
  const [pageClient, setPageClient] = createSignal(1);
  const [pageSizeClient, setPageSizeClient] = createSignal(10);
  const [pageServer, setPageServer] = createSignal(1);
  const [pageSizeServer, setPageSizeServer] = createSignal(10);

  // server-side simulation
  const serverQuery = useFakeServerQuery(() => ({
    page: pageServer(),
    pageSize: pageSizeServer(),
  }));

  // client-side slice
  const clientSlice = createMemo(() => {
    const start = (pageClient() - 1) * pageSizeClient();
    return FAKE_USERS.slice(start, start + pageSizeClient());
  });

  return (
    <div class="flex max-w-3xl flex-col gap-10 p-8">
      <div>
        <h1 class="text-lg font-semibold">Pagination</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Smart pagination — Ark computes the page window + ellipses; you only
          pass <code class="rounded bg-muted px-1 py-0.5 text-xs">count</code>,{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">page</code>, and{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">onPageChange</code>
          .
        </p>
      </div>

      {/* ── 1. Default convenience API ───────────────────────────────────── */}
      <Section
        title="Default"
        description="The one-liner — covers prev, pages, next. 100 items at 10 per page = 10 pages."
      >
        <Pagination
          count={100}
          pageSize={10}
          page={page1()}
          onPageChange={(d) => setPage1(d.page)}
        />
        <p class="mt-2 text-xs text-muted-foreground">
          Current page: <span class="font-mono">{page1()}</span>
        </p>
      </Section>

      {/* ── 2. Small size ────────────────────────────────────────────────── */}
      <Section
        title="Small size"
        description='size="sm" gives you size-7 cells with smaller text/icons. Use in table footers.'
      >
        <Pagination
          size="sm"
          count={100}
          pageSize={10}
          page={page2()}
          onPageChange={(d) => setPage2(d.page)}
        />
      </Section>

      {/* ── 3. First / last jump buttons ─────────────────────────────────── */}
      <Section
        title="With first/last"
        description="showFirstLast adds « and » buttons for jumping to page 1 / last page."
      >
        <Pagination
          showFirstLast
          count={1000}
          pageSize={10}
          page={page3()}
          onPageChange={(d) => setPage3(d.page)}
        />
      </Section>

      {/* ── 4. Many pages — ellipsis behavior ────────────────────────────── */}
      <Section
        title="Many pages (ellipsis)"
        description="Ark computes ellipses automatically. Same component, just different counts."
      >
        <div class="flex flex-col gap-3">
          <div>
            <p class="mb-1 text-xs text-muted-foreground">
              50 items / 10 per page
            </p>
            <Pagination count={50} pageSize={10} defaultPage={1} />
          </div>
          <div>
            <p class="mb-1 text-xs text-muted-foreground">
              200 items / 10 per page
            </p>
            <Pagination count={200} pageSize={10} defaultPage={10} />
          </div>
          <div>
            <p class="mb-1 text-xs text-muted-foreground">
              10000 items / 10 per page
            </p>
            <Pagination count={10000} pageSize={10} defaultPage={500} />
          </div>
        </div>
      </Section>

      {/* ── 5. Sibling count variations ──────────────────────────────────── */}
      <Section
        title="Sibling count"
        description="How many page numbers to show on each side of the current page. Default is 1."
      >
        <div class="flex flex-col gap-3">
          <div>
            <p class="mb-1 text-xs text-muted-foreground">
              siblingCount=0 (tightest)
            </p>
            <Pagination
              count={500}
              pageSize={10}
              defaultPage={25}
              siblingCount={0}
            />
          </div>
          <div>
            <p class="mb-1 text-xs text-muted-foreground">
              siblingCount=1 (default)
            </p>
            <Pagination
              count={500}
              pageSize={10}
              defaultPage={25}
              siblingCount={1}
            />
          </div>
          <div>
            <p class="mb-1 text-xs text-muted-foreground">siblingCount=3</p>
            <Pagination
              count={500}
              pageSize={10}
              defaultPage={25}
              siblingCount={3}
            />
          </div>
        </div>
      </Section>

      {/* ── 6. Uncontrolled ──────────────────────────────────────────────── */}
      <Section
        title="Uncontrolled"
        description="Skip page/onPageChange. Use defaultPage for the starting page. Ark manages state internally."
      >
        <Pagination count={100} pageSize={10} defaultPage={5} />
      </Section>

      {/* ── 7. Compound: Page X of Y indicator ───────────────────────────── */}
      <Section
        title="Compound — Page X of Y"
        description="Drop the convenience component and compose. Pull state from PaginationContext."
      >
        <PaginationRoot count={250} pageSize={10} defaultPage={3}>
          <PaginationContext>
            {(p) => (
              <div class="flex w-full items-center justify-between">
                <span class="text-sm text-muted-foreground">
                  Page{" "}
                  <span class="font-medium text-foreground">{p().page}</span> of{" "}
                  <span class="font-medium text-foreground">
                    {p().totalPages}
                  </span>
                </span>
                <div class="flex gap-1">
                  <PaginationPrevTrigger />
                  <PaginationNextTrigger />
                </div>
              </div>
            )}
          </PaginationContext>
        </PaginationRoot>
      </Section>

      {/* ── 8. Compound: Range info ──────────────────────────────────────── */}
      <Section
        title="Compound — Showing X–Y of Z"
        description="pageRange.start / pageRange.end give you the visible item indices."
      >
        <PaginationRoot count={487} pageSize={10} defaultPage={4}>
          <PaginationContext>
            {(p) => (
              <div class="flex w-full items-center justify-between">
                <p class="text-sm text-muted-foreground">
                  Showing{" "}
                  <span class="font-medium text-foreground">
                    {p().pageRange.start + 1}
                  </span>
                  –
                  <span class="font-medium text-foreground">
                    {p().pageRange.end}
                  </span>{" "}
                  of{" "}
                  <span class="font-medium text-foreground">
                    {p().count.toLocaleString()}
                  </span>{" "}
                  monitors
                </p>
                <div class="flex gap-1">
                  <PaginationPrevTrigger />
                  <PaginationItems />
                  <PaginationNextTrigger />
                </div>
              </div>
            )}
          </PaginationContext>
        </PaginationRoot>
      </Section>

      {/* ── 9. Compound: page-size selector ──────────────────────────────── */}
      <Section
        title="Compound — page-size selector"
        description="Wire onPageSizeChange and reset page to 1 (otherwise you can land past the new total)."
      >
        <PaginationRoot
          count={487}
          pageSize={pageSizeClient()}
          page={pageClient()}
          onPageChange={(d) => setPageClient(d.page)}
          onPageSizeChange={(d) => {
            setPageSizeClient(d.pageSize);
            setPageClient(1); // reset to first page on size change
          }}
        >
          <PaginationContext>
            {(p) => (
              <div class="flex w-full items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-muted-foreground">Per page</span>
                  <Select
                    collection={pageSizeCollection}
                    value={[String(p().pageSize)]}
                    onValueChange={(d) => p().setPageSize(Number(d.value[0]))}
                  >
                    <SelectControl class="h-8 w-20">
                      <SelectTrigger>
                        <SelectValueText />
                      </SelectTrigger>
                    </SelectControl>
                    <SelectContent>
                      <For each={pageSizeCollection.items}>
                        {(item) => (
                          <SelectItem item={item}>{item.label}</SelectItem>
                        )}
                      </For>
                    </SelectContent>
                  </Select>
                </div>
                <div class="flex gap-1">
                  <PaginationPrevTrigger />
                  <PaginationItems />
                  <PaginationNextTrigger />
                </div>
              </div>
            )}
          </PaginationContext>
        </PaginationRoot>
      </Section>

      {/* ── 10. Client-side data slicing demo ────────────────────────────── */}
      <Section
        title="Client-side data slicing"
        description="Full pattern — render the sliced array under the table, pagination under that."
      >
        <div class="flex flex-col gap-3 rounded-lg border border-border">
          <table class="w-full text-sm">
            <thead class="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground uppercase">
              <tr>
                <th class="px-3 py-2 font-medium">Name</th>
                <th class="px-3 py-2 font-medium">Email</th>
                <th class="px-3 py-2 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              <For each={clientSlice()}>
                {(u) => (
                  <tr class="border-b border-border last:border-b-0">
                    <td class="px-3 py-2 font-medium">{u.name}</td>
                    <td class="px-3 py-2 text-muted-foreground">{u.email}</td>
                    <td class="px-3 py-2 text-muted-foreground tabular-nums">
                      {u.joined}
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
          <div class="flex items-center justify-between border-t border-border bg-muted/50 px-3 py-2">
            <p class="text-xs text-muted-foreground">
              Showing {(pageClient() - 1) * pageSizeClient() + 1}–
              {Math.min(pageClient() * pageSizeClient(), FAKE_USERS.length)} of{" "}
              {FAKE_USERS.length}
            </p>
            <Pagination
              size="sm"
              count={FAKE_USERS.length}
              pageSize={pageSizeClient()}
              page={pageClient()}
              onPageChange={(d) => setPageClient(d.page)}
            />
          </div>
        </div>
      </Section>

      {/* ── 11. Simulated server-side ────────────────────────────────────── */}
      <Section
        title="Simulated server-side"
        description="Fake 500ms latency. In production, replace with TanStack Query — use placeholderData: keepPreviousData to avoid the table going blank between pages."
      >
        <div class="flex flex-col gap-3 rounded-lg border border-border">
          {/* Loading indicator overlays the table */}
          <div class="relative">
            <Show when={serverQuery.isLoading()}>
              <div class="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-popover px-2 py-1 text-xs shadow-sm ring-1 ring-border">
                <CircleDashedIcon class="size-3 animate-spin" />
                Loading
              </div>
            </Show>
            <table
              class={`w-full text-sm transition-opacity ${
                serverQuery.isLoading() ? "opacity-50" : "opacity-100"
              }`}
            >
              <thead class="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground uppercase">
                <tr>
                  <th class="px-3 py-2 font-medium">Name</th>
                  <th class="px-3 py-2 font-medium">Email</th>
                </tr>
              </thead>
              <tbody>
                <For each={serverQuery.data().items}>
                  {(u) => (
                    <tr class="border-b border-border last:border-b-0">
                      <td class="px-3 py-2 font-medium">{u.name}</td>
                      <td class="px-3 py-2 text-muted-foreground">{u.email}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
          <div class="flex items-center justify-between border-t border-border bg-muted/50 px-3 py-2">
            <p class="text-xs text-muted-foreground tabular-nums">
              {serverQuery.data().totalCount} monitors
            </p>
            <Pagination
              size="sm"
              count={serverQuery.data().totalCount}
              pageSize={pageSizeServer()}
              page={pageServer()}
              onPageChange={(d) => setPageServer(d.page)}
            />
          </div>
        </div>
      </Section>

      {/* ── 12. TanStack Router URL pattern ──────────────────────────────── */}
      <Section
        title="With TanStack Router (URL search params)"
        description="The production pattern for Argus — URL is the single source of truth. Reference code below."
      >
        <pre class="overflow-auto rounded-lg border border-border bg-muted/50 p-4 text-xs leading-relaxed">
          <code>{`// route file: routes/monitors.tsx
export const Route = createFileRoute('/monitors')({
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().default(10),
  }),
  component: MonitorsPage,
});

function MonitorsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const query = createQuery(() => ({
    queryKey: ['monitors', search()],
    queryFn: () => api.get(\`/monitors?page=\${search().page}&pageSize=\${search().pageSize}\`),
    placeholderData: keepPreviousData,  // ← no flicker between pages
  }));

  return (
    <>
      <For each={query.data?.items ?? []}>{(m) => <MonitorRow monitor={m} />}</For>

      <Pagination
        count={query.data?.totalCount ?? 0}
        pageSize={search().pageSize}
        page={search().page}
        onPageChange={(d) => navigate({ search: (prev) => ({ ...prev, page: d.page }) })}
      />
    </>
  );
}`}</code>
        </pre>
      </Section>
    </div>
  );
}
