import { createFileRoute } from "@tanstack/solid-router";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  TerminalIcon,
} from "lucide-solid";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "../../components/ui/alert";
import { Button } from "../../components/ui/button";

export const Route = createFileRoute("/previews/alert")({
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
        <h1 class="text-lg font-semibold">Alert</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Inline contextual feedback. Children can be in any order — icon,
          title, description, action — the grid arranges them.
        </p>
      </div>

      {/* ── Default ───────────────────────────────────────────────────────── */}
      <Section title="Default">
        <Alert>
          <TerminalIcon />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can add components and dependencies to your app using the CLI.
          </AlertDescription>
        </Alert>
      </Section>

      {/* ── Without icon ──────────────────────────────────────────────────── */}
      <Section
        title="Without icon"
        description="The icon column collapses when no svg child is present."
      >
        <Alert>
          <AlertTitle>Update available</AlertTitle>
          <AlertDescription>
            Version 1.2.0 is ready to install.
          </AlertDescription>
        </Alert>
      </Section>

      {/* ── Title only ────────────────────────────────────────────────────── */}
      <Section title="Title only">
        <Alert>
          <CheckCircle2Icon />
          <AlertTitle>Changes saved.</AlertTitle>
        </Alert>
      </Section>

      {/* ── With action ───────────────────────────────────────────────────── */}
      <Section
        title="With action"
        description="Action sits in the last column, vertically centered. Long titles wrap naturally."
      >
        <Alert>
          <InfoIcon />
          <AlertTitle>New monitor detected</AlertTitle>
          <AlertDescription>
            A new endpoint was added to your account. Enable monitoring to start
            tracking uptime.
          </AlertDescription>
          <AlertAction>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </AlertAction>
        </Alert>
      </Section>

      {/* ── Destructive ───────────────────────────────────────────────────── */}
      <Section title="Destructive">
        <Alert variant="destructive">
          <AlertTriangleIcon />
          <AlertTitle>Monitor is down</AlertTitle>
          <AlertDescription>
            api.example.com hasn't responded in 8 minutes. Last successful check
            was at 14:32.
          </AlertDescription>
          <AlertAction>
            <Button variant="outline" size="sm">
              Investigate
            </Button>
          </AlertAction>
        </Alert>
      </Section>

      {/* ── Long content wrapping with action ─────────────────────────────── */}
      <Section
        title="Long title with action"
        description="Demonstrates the flex/grid layout — action stays put, title wraps cleanly without being hidden behind the button."
      >
        <Alert>
          <InfoIcon />
          <AlertTitle>
            This is a deliberately long title that should wrap nicely without
            being overlapped by the action button on the right
          </AlertTitle>
          <AlertDescription>
            Notice how the action stays in its column regardless of title
            length.
          </AlertDescription>
          <AlertAction>
            <Button variant="outline" size="sm">
              OK
            </Button>
          </AlertAction>
        </Alert>
      </Section>
    </div>
  );
}
