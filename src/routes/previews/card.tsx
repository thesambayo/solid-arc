import { createFileRoute } from "@tanstack/solid-router";
import {
  ActivityIcon,
  ArrowUpRightIcon,
  ClockIcon,
  GlobeIcon,
} from "lucide-solid";
import { For } from "solid-js";

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export const Route = createFileRoute("/previews/card")({
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
        <h1 class="text-lg font-semibold">Card</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Surface container with optional header, content, and footer. The
          header auto-flips between 1- and 2-column based on whether you include
          a CardAction.
        </p>
      </div>

      {/* ── Full card ─────────────────────────────────────────────────────── */}
      <Section title="Full">
        <Card class="max-w-sm">
          <CardHeader>
            <CardTitle>API Health Monitor</CardTitle>
            <CardDescription>
              Tracking 12 endpoints across 3 regions.
            </CardDescription>
            <CardAction>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div class="flex flex-col gap-2 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Uptime (30d)</span>
                <span class="font-medium tabular-nums">99.94%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Avg response</span>
                <span class="font-medium tabular-nums">142 ms</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button class="w-full" variant="outline">
              View incidents
            </Button>
          </CardFooter>
        </Card>
      </Section>

      {/* ── Title + action only ───────────────────────────────────────────── */}
      <Section
        title="Header-only with action"
        description="No description → header collapses to a single row, action stays right-aligned."
      >
        <Card class="max-w-sm">
          <CardHeader>
            <CardTitle>Webhook secret</CardTitle>
            <CardAction>
              <Button variant="ghost" size="sm">
                Rotate
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <code class="block rounded-md bg-muted px-2 py-1 text-xs">
              whsec_••••••••••a9c2
            </code>
          </CardContent>
        </Card>
      </Section>

      {/* ── Small size ────────────────────────────────────────────────────── */}
      <Section
        title="Small size"
        description="Tighter padding + smaller title. Useful in dashboards / grid layouts."
      >
        <div class="grid max-w-md grid-cols-2 gap-3">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Up</CardTitle>
              <CardAction>
                <ActivityIcon class="size-4 text-muted-foreground" />
              </CardAction>
            </CardHeader>
            <CardContent>
              <p class="text-2xl font-semibold tabular-nums">11</p>
              <p class="text-xs text-muted-foreground">of 12 monitors</p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Avg latency</CardTitle>
              <CardAction>
                <ClockIcon class="size-4 text-muted-foreground" />
              </CardAction>
            </CardHeader>
            <CardContent>
              <p class="text-2xl font-semibold tabular-nums">187 ms</p>
              <p class="text-xs text-muted-foreground">last 24 hours</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ── Image card ────────────────────────────────────────────────────── */}
      <Section
        title="With image"
        description="An <img /> as the first child auto-rounds to the top corners and removes Card's top padding."
      >
        <Card class="max-w-sm">
          <img
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=60"
            alt="Laptop on desk"
            class="aspect-video w-full object-cover"
          />
          <CardHeader>
            <CardTitle>New monitor setup</CardTitle>
            <CardDescription>
              Walk through the basics of adding your first URL to Argus.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" class="w-full gap-1">
              Read guide
              <ArrowUpRightIcon class="size-4" />
            </Button>
          </CardFooter>
        </Card>
      </Section>

      {/* ── List of cards ─────────────────────────────────────────────────── */}
      <Section
        title="In a list"
        description="Cards stacked as a monitor list — the kind of pattern Argus will use on the dashboard."
      >
        <div class="flex max-w-md flex-col gap-2">
          <For
            each={[
              { name: "api.argus.dev/health", status: "up", latency: "94 ms" },
              {
                name: "auth.argus.dev/ping",
                status: "up",
                latency: "112 ms",
              },
              {
                name: "billing.argus.dev/v2/status",
                status: "down",
                latency: "—",
              },
            ]}
          >
            {(m) => (
              <Card size="sm">
                <CardHeader>
                  <CardTitle class="flex items-center gap-2">
                    <GlobeIcon class="size-4 text-muted-foreground" />
                    {m.name}
                  </CardTitle>
                  <CardAction>
                    <Badge
                      variant={m.status === "up" ? "success" : "destructive"}
                    >
                      {m.status}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p class="text-xs text-muted-foreground tabular-nums">
                    Latency · {m.latency}
                  </p>
                </CardContent>
              </Card>
            )}
          </For>
        </div>
      </Section>
    </div>
  );
}
