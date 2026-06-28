import { createFileRoute } from "@tanstack/solid-router";
import {
  ChartNoAxesColumnIcon,
  InboxIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-solid";

import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../components/ui/empty";
import {
  InputGroup,
  InputAddon,
  InputGroupInput,
} from "../../components/ui/input-group";

export const Route = createFileRoute("/previews/empty")({
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
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Empty</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          A centered empty state. Compose with header (media, title,
          description) and content (actions, inputs).
        </p>
      </div>

      {/* ── Default (icon) ────────────────────────────────────────────────── */}
      <Section title="Default">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <InboxIcon />
            </EmptyMedia>
            <EmptyTitle>No monitors yet</EmptyTitle>
            <EmptyDescription>
              Add your first URL to start tracking uptime.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>
              <PlusIcon />
              Add monitor
            </Button>
          </EmptyContent>
        </Empty>
      </Section>

      {/* ── Outline ───────────────────────────────────────────────────────── */}
      <Section
        title="Outline"
        description="Pass variant='outline' to wrap in a dashed-feel border container."
      >
        <Empty variant="outline">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ChartNoAxesColumnIcon />
            </EmptyMedia>
            <EmptyTitle>No data to display</EmptyTitle>
            <EmptyDescription>
              Once your monitors start collecting checks, you'll see charts
              here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Section>

      {/* ── With avatar ───────────────────────────────────────────────────── */}
      <Section
        title="With avatar"
        description="EmptyMedia without 'icon' variant just renders its children — drop in an Avatar, group, illustration, anything."
      >
        <Empty variant="outline">
          <EmptyHeader>
            <EmptyMedia>
              <Avatar class="size-16">
                <AvatarFallback>SB</AvatarFallback>
              </Avatar>
            </EmptyMedia>
            <EmptyTitle>Welcome, Samuel</EmptyTitle>
            <EmptyDescription>
              Your team has no shared monitors yet. Create one or invite a
              teammate to get started.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div class="flex gap-2">
              <Button>Create monitor</Button>
              <Button variant="outline">Invite team</Button>
            </div>
          </EmptyContent>
        </Empty>
      </Section>

      {/* ── With search input ─────────────────────────────────────────────── */}
      <Section
        title="With input"
        description="EmptyContent can hold any UI — including an input group for inline search/jump."
      >
        <Empty variant="outline">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchIcon />
            </EmptyMedia>
            <EmptyTitle>No results found</EmptyTitle>
            <EmptyDescription>
              Try searching for something else.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <InputGroup>
              <InputAddon>
                <SearchIcon class="size-4" />
              </InputAddon>
              <InputGroupInput placeholder="Search monitors..." />
            </InputGroup>
          </EmptyContent>
        </Empty>
      </Section>

      {/* ── Minimal ───────────────────────────────────────────────────────── */}
      <Section
        title="Minimal"
        description="Header is optional — drop directly into Empty."
      >
        <Empty>
          <EmptyMedia variant="icon">
            <InboxIcon />
          </EmptyMedia>
          <EmptyTitle>Inbox zero</EmptyTitle>
        </Empty>
      </Section>
    </div>
  );
}
