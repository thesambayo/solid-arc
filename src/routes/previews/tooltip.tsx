import { createFileRoute } from "@tanstack/solid-router";
import { InfoIcon } from "lucide-solid";

import { Button } from "../../components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../../components/ui/tooltip";

export const Route = createFileRoute("/previews/tooltip")({
  component: RouteComponent,
});

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      <div class="flex flex-wrap items-center gap-4">{props.children}</div>
    </div>
  );
}

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Tooltip</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Hover/focus popup built on Ark UI.
        </p>
      </div>

      <Section title="Basic">
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>This is a tooltip</TooltipContent>
        </Tooltip>
      </Section>

      <Section title="Wrapping a button (asChild)">
        <Tooltip>
          <TooltipTrigger
            asChild={(props) => (
              <Button variant="ghost" size="icon-sm" {...props()}>
                <InfoIcon />
              </Button>
            )}
          />
          <TooltipContent>More information</TooltipContent>
        </Tooltip>
      </Section>

      <Section title="Placements">
        <Tooltip positioning={{ placement: "top" }}>
          <TooltipTrigger
            asChild={(p) => (
              <Button variant="outline" size="sm" {...p()}>
                Top
              </Button>
            )}
          />
          <TooltipContent>Top placement</TooltipContent>
        </Tooltip>
        <Tooltip positioning={{ placement: "right" }}>
          <TooltipTrigger
            asChild={(p) => (
              <Button variant="outline" size="sm" {...p()}>
                Right
              </Button>
            )}
          />
          <TooltipContent>Right placement</TooltipContent>
        </Tooltip>
        <Tooltip positioning={{ placement: "bottom" }}>
          <TooltipTrigger
            asChild={(p) => (
              <Button variant="outline" size="sm" {...p()}>
                Bottom
              </Button>
            )}
          />
          <TooltipContent>Bottom placement</TooltipContent>
        </Tooltip>
        <Tooltip positioning={{ placement: "left" }}>
          <TooltipTrigger
            asChild={(p) => (
              <Button variant="outline" size="sm" {...p()}>
                Left
              </Button>
            )}
          />
          <TooltipContent>Left placement</TooltipContent>
        </Tooltip>
      </Section>

      <Section title="No delay">
        <Tooltip openDelay={0}>
          <TooltipTrigger
            asChild={(p) => (
              <Button variant="outline" size="sm" {...p()}>
                Instant
              </Button>
            )}
          />
          <TooltipContent>Opens immediately</TooltipContent>
        </Tooltip>
      </Section>
    </div>
  );
}
