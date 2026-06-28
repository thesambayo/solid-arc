import { createFileRoute } from "@tanstack/solid-router";
import {
  BellIcon,
  CalendarIcon,
  ChartNoAxesColumnIcon,
  CreditCardIcon,
  FileIcon,
  GlobeIcon,
  HouseIcon,
  LogOutIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-solid";
import { For, Show, createSignal, onCleanup, onMount } from "solid-js";

import { Button } from "../../components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../../components/ui/command";

export const Route = createFileRoute("/previews/command")({
  component: RouteComponent,
});

function Section(props: {
  title: string;
  description?: string;
  children: any;
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

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-10 p-8">
      <div>
        <h1 class="text-lg font-semibold">Command</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Command palette for search and quick actions. Fuzzy match by default
          (port of cmdk's <code>command-score</code>). Supports keywords,
          highlight callbacks, async loading, and dynamic results.
        </p>
      </div>

      <BasicExample />
      <WithShortcutsExample />
      <WithKeywordsExample />
      <CustomFilterExample />
      <HighlightCallbackExample />
      <AsyncResultsExample />
      <DynamicResultsExample />
      <DialogExample />
    </div>
  );
}

// ─── 1. Basic ────────────────────────────────────────────────────────────────

function BasicExample() {
  return (
    <Section
      title="Basic"
      description="Groups + separator + disabled item + empty state. Try typing 'prfl' — the fuzzy matcher tolerates skipped letters."
    >
      <Command class="max-w-sm rounded-xl border border-border">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem value="calendar" label="Calendar">
              <CalendarIcon />
              Calendar
            </CommandItem>
            <CommandItem disabled value="search-emoji" label="Search Emoji">
              <SearchIcon />
              Search Emoji
            </CommandItem>
            <CommandItem value="settings" label="Settings">
              <SettingsIcon />
              Settings
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Account">
            <CommandItem value="profile" label="Profile">
              <UserIcon />
              Profile
            </CommandItem>
            <CommandItem value="billing" label="Billing">
              <CreditCardIcon />
              Billing
            </CommandItem>
            <CommandItem value="logout" label="Logout">
              <LogOutIcon />
              Logout
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </Section>
  );
}

// ─── 2. With shortcuts ───────────────────────────────────────────────────────

function WithShortcutsExample() {
  return (
    <Section
      title="With shortcuts"
      description="CommandShortcut renders a trailing keyboard hint inside an item."
    >
      <Command class="max-w-sm rounded-xl border border-border">
        <CommandInput placeholder="Type a command..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem value="go-home" label="Home">
              <HouseIcon />
              Home
              <CommandShortcut>⌘H</CommandShortcut>
            </CommandItem>
            <CommandItem value="go-monitors" label="Monitors">
              <ChartNoAxesColumnIcon />
              Monitors
              <CommandShortcut>⌘M</CommandShortcut>
            </CommandItem>
            <CommandItem value="go-alerts" label="Alerts">
              <BellIcon />
              Alerts
              <CommandShortcut>⌘A</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem value="go-profile" label="Profile">
              <UserIcon />
              Profile
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem value="go-billing" label="Billing" disabled>
              <CreditCardIcon />
              Billing
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </Section>
  );
}

// ─── 3. With keywords ────────────────────────────────────────────────────────

function WithKeywordsExample() {
  return (
    <Section
      title="With keywords"
      description="Pass `keywords` to match synonyms. Try 'cfg' → Preferences, 'logout' → Sign out, 'account' → Profile."
    >
      <Command class="max-w-sm rounded-xl border border-border">
        <CommandInput placeholder="Try 'cfg' or 'logout'..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Settings">
            <CommandItem
              value="profile"
              label="Profile"
              keywords={["account", "user", "me"]}
            >
              <UserIcon />
              Profile
            </CommandItem>
            <CommandItem
              value="preferences"
              label="Preferences"
              keywords={["cfg", "config", "settings"]}
            >
              <SettingsIcon />
              Preferences
            </CommandItem>
            <CommandItem
              value="signout"
              label="Sign out"
              keywords={["logout", "exit", "quit"]}
            >
              <LogOutIcon />
              Sign out
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </Section>
  );
}

// ─── 4. Custom filter ────────────────────────────────────────────────────────

function CustomFilterExample() {
  // Strict substring — opts out of the default fuzzy matcher.
  // Won't tolerate skipped characters or transpositions.
  // Useful when fuzzy noise hurts more than fuzzy reach helps (long lists of
  // very similar labels, exact-command-name palettes, etc).
  const strictFilter = (label: string, query: string) =>
    label.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;

  return (
    <Section
      title="Custom filter"
      description="Override the default fuzzy matcher. This one is strict substring — type 'prof' (matches) vs 'prfl' (no match)."
    >
      <Command
        class="max-w-sm rounded-xl border border-border"
        filter={strictFilter}
      >
        <CommandInput placeholder="Strict substring..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Account">
            <CommandItem value="profile" label="Profile">
              <UserIcon />
              Profile
            </CommandItem>
            <CommandItem value="settings" label="Settings">
              <SettingsIcon />
              Settings
            </CommandItem>
            <CommandItem value="billing" label="Billing">
              <CreditCardIcon />
              Billing
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </Section>
  );
}

// ─── 5. Highlight callback ───────────────────────────────────────────────────

function HighlightCallbackExample() {
  const [hint, setHint] = createSignal("Hover or arrow-key over an item");

  return (
    <Section
      title="Highlight callback"
      description="`onHighlight` fires when an item becomes active (hover or keyboard). Drive a footer hint, a copy preview, anything contextual."
    >
      <div class="flex max-w-sm flex-col gap-2">
        <Command class="rounded-xl border border-border">
          <CommandInput placeholder="Navigate with ↑↓..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem
                value="hl-home"
                label="Home"
                onHighlight={() => setHint("→ Go to the dashboard home page")}
              >
                <HouseIcon />
                Home
              </CommandItem>
              <CommandItem
                value="hl-monitors"
                label="Monitors"
                onHighlight={() => setHint("→ View all monitors in a list")}
              >
                <ChartNoAxesColumnIcon />
                Monitors
              </CommandItem>
              <CommandItem
                value="hl-alerts"
                label="Alerts"
                onHighlight={() => setHint("→ Open the incident log")}
              >
                <BellIcon />
                Alerts
              </CommandItem>
              <CommandItem
                value="hl-settings"
                label="Settings"
                onHighlight={() => setHint("→ Adjust your preferences")}
              >
                <SettingsIcon />
                Settings
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
        <div class="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          {hint()}
        </div>
      </div>
    </Section>
  );
}

// ─── 6. Async results (loading state) ────────────────────────────────────────

function AsyncResultsExample() {
  type Result = { id: string; name: string };

  const ALL: Result[] = [
    { id: "m1", name: "google.com" },
    { id: "m2", name: "github.com" },
    { id: "m3", name: "stackoverflow.com" },
    { id: "m4", name: "argus.dev" },
    { id: "m5", name: "anthropic.com" },
  ];

  const [query, setQuery] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [results, setResults] = createSignal<Result[]>([]);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    const q = e.currentTarget.value;
    setQuery(q);

    if (timeoutId) clearTimeout(timeoutId);
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Simulate a network round-trip.
    timeoutId = setTimeout(() => {
      setResults(
        ALL.filter((r) => r.name.toLowerCase().includes(q.toLowerCase())),
      );
      setLoading(false);
    }, 700);
  };

  onCleanup(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });

  return (
    <Section
      title="Async results (loading state)"
      description="`loading` suppresses CommandEmpty while a fetch is in flight, avoiding the 'No results' flash. Try typing 'go' — wait for the 700ms simulated fetch."
    >
      <Command
        class="max-w-sm rounded-xl border border-border"
        loading={loading()}
      >
        <div class="relative">
          <CommandInput
            placeholder="Search monitors..."
            onInput={handleInput}
          />
          {loading() && (
            <span class="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
              Searching…
            </span>
          )}
        </div>
        <CommandList>
          <CommandEmpty>
            {query().trim()
              ? `No monitors match "${query()}"`
              : "Type to search."}
          </CommandEmpty>
          <Show when={results().length > 0}>
            <CommandGroup heading="Monitors">
              <For each={results()}>
                {(monitor) => (
                  <CommandItem
                    value={monitor.id}
                    label={monitor.name}
                    onSelect={() => console.log("open monitor:", monitor.id)}
                  >
                    <GlobeIcon />
                    {monitor.name}
                  </CommandItem>
                )}
              </For>
            </CommandGroup>
          </Show>
        </CommandList>
      </Command>
    </Section>
  );
}

// ─── 7. Dynamic results based on search ──────────────────────────────────────

function DynamicResultsExample() {
  // Simulated app data — monitors, docs, recent actions.
  const MONITORS = [
    { id: "m1", name: "api.argus.dev", url: "https://api.argus.dev" },
    { id: "m2", name: "google.com", url: "https://google.com" },
    { id: "m3", name: "github.com", url: "https://github.com" },
  ];
  const DOCS = [
    { id: "d1", title: "How to add a monitor", section: "Getting started" },
    { id: "d2", title: "Configuring alerts", section: "Notifications" },
    { id: "d3", title: "API key authentication", section: "Reference" },
  ];

  const [query, setQuery] = createSignal("");

  const monitorMatches = () => {
    const q = query().toLowerCase().trim();
    if (!q) return [];
    return MONITORS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) || m.url.toLowerCase().includes(q),
    );
  };

  const docMatches = () => {
    const q = query().toLowerCase().trim();
    if (!q) return [];
    return DOCS.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.section.toLowerCase().includes(q),
    );
  };

  return (
    <Section
      title="Dynamic results based on search"
      description="Conditionally-rendered groups that appear only when the user types. Try 'google', 'alert', or 'api'. Combines static actions with on-demand monitor & docs results."
    >
      <Command class="max-w-sm rounded-xl border border-border">
        <CommandInput
          placeholder="Search anything..."
          onInput={(e) => setQuery(e.currentTarget.value)}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Dynamic: monitors matching the query */}
          <Show when={monitorMatches().length > 0}>
            <CommandGroup heading="Monitors">
              <For each={monitorMatches()}>
                {(m) => (
                  <CommandItem
                    value={`monitor-${m.id}`}
                    label={m.name}
                    keywords={[m.url]}
                    onSelect={() => console.log("open monitor:", m.id)}
                  >
                    <GlobeIcon />
                    <div class="flex flex-col">
                      <span>{m.name}</span>
                      <span class="text-xs text-muted-foreground">
                        Open monitor page
                      </span>
                    </div>
                  </CommandItem>
                )}
              </For>
            </CommandGroup>
          </Show>

          {/* Dynamic: docs matching the query */}
          <Show when={docMatches().length > 0}>
            <CommandGroup heading="Documentation">
              <For each={docMatches()}>
                {(d) => (
                  <CommandItem
                    value={`doc-${d.id}`}
                    label={d.title}
                    keywords={[d.section]}
                    onSelect={() => console.log("open doc:", d.id)}
                  >
                    <FileIcon />
                    <div class="flex flex-col">
                      <span>{d.title}</span>
                      <span class="text-xs text-muted-foreground">
                        {d.section}
                      </span>
                    </div>
                  </CommandItem>
                )}
              </For>
            </CommandGroup>
          </Show>

          {/* Static: always-available actions */}
          <CommandGroup heading="Actions">
            <CommandItem
              value="action-new-monitor"
              label="Create new monitor"
              onSelect={() => console.log("new monitor")}
            >
              <ChartNoAxesColumnIcon />
              Create new monitor
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem
              value="action-settings"
              label="Open settings"
              onSelect={() => console.log("settings")}
            >
              <SettingsIcon />
              Open settings
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </Section>
  );
}

// ─── 8. Dialog (⌘K) — everything together ────────────────────────────────────

function DialogExample() {
  const [open, setOpen] = createSignal(false);
  const [hint, setHint] = createSignal("Press ↵ to run");

  onMount(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    onCleanup(() => window.removeEventListener("keydown", handler));
  });

  return (
    <Section
      title="Dialog (⌘K) — full palette"
      description="The everything-bundled example: groups, keywords, highlight callback driving a footer, ⌘K to toggle. This is the closest to what you'd ship."
    >
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command palette
        <CommandShortcut class="ml-1">⌘K</CommandShortcut>
      </Button>

      <CommandDialog open={open()} onOpenChange={(e) => setOpen(e.open)}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem
                value="dlg-home"
                label="Go to Home"
                onHighlight={() => setHint("Navigate to the dashboard")}
                onSelect={() => setOpen(false)}
              >
                <HouseIcon />
                Go to Home
                <CommandShortcut>⌘H</CommandShortcut>
              </CommandItem>
              <CommandItem
                value="dlg-monitors"
                label="Go to Monitors"
                onHighlight={() => setHint("List all monitors")}
                onSelect={() => setOpen(false)}
              >
                <ChartNoAxesColumnIcon />
                Go to Monitors
              </CommandItem>
              <CommandItem
                value="dlg-alerts"
                label="Go to Alerts"
                keywords={["incidents", "notifications"]}
                onHighlight={() => setHint("Open the incident log")}
                onSelect={() => setOpen(false)}
              >
                <BellIcon />
                Go to Alerts
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem
                value="dlg-add-monitor"
                label="Add new monitor"
                keywords={["create", "new"]}
                onHighlight={() => setHint("Add a new URL to monitor")}
                onSelect={() => setOpen(false)}
              >
                <FileIcon />
                Add new monitor
              </CommandItem>
              <CommandItem
                value="dlg-reports"
                label="View reports"
                keywords={["analytics", "stats"]}
                onHighlight={() => setHint("View uptime + latency reports")}
                onSelect={() => setOpen(false)}
              >
                <ChartNoAxesColumnIcon />
                View reports
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Account">
              <CommandItem
                value="dlg-account-settings"
                label="Account settings"
                keywords={["profile", "preferences", "cfg"]}
                onHighlight={() => setHint("Manage your account")}
                onSelect={() => setOpen(false)}
              >
                <SettingsIcon />
                Account settings
              </CommandItem>
              <CommandItem
                value="dlg-sign-out"
                label="Sign out"
                keywords={["logout", "exit"]}
                onHighlight={() => setHint("Sign out of Argus")}
                onSelect={() => setOpen(false)}
              >
                <LogOutIcon />
                Sign out
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
        {/* Footer hint bar — sibling to <Command>, driven by onHighlight. */}
        <div class="border-t border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
          {hint()}
        </div>
      </CommandDialog>
    </Section>
  );
}
