import { createFileRoute } from "@tanstack/solid-router";
import {
  TextAlignStartIcon,
  TextAlignCenterIcon,
  TextAlignEndIcon,
} from "lucide-solid";

import { Button } from "../../components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "../../components/ui/button-group";

export const Route = createFileRoute("/previews/button-groups")({
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
        <h1 class="text-lg font-semibold">ButtonGroup</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Declare variant props once — every Button inside inherits them.
        </p>
      </div>

      <Section title="Shared size">
        <ButtonGroup>
          <Button variant="outline">Cancel</Button>
          <Button variant="outline">Save</Button>
        </ButtonGroup>

        <ButtonGroup size="xs" variant="outline">
          <Button>Cancel</Button>
          <Button>Save</Button>
        </ButtonGroup>
      </Section>

      <Section title="Shared variant (child can still override)">
        <ButtonGroup variant="outline">
          <Button>One</Button>
          <Button>Two</Button>
          <Button variant="brand">Three (override)</Button>
        </ButtonGroup>
      </Section>

      <Section title="Icon group">
        <ButtonGroup variant="outline" size="icon-sm">
          <Button>
            <TextAlignStartIcon />
          </Button>
          <Button>
            <TextAlignCenterIcon />
          </Button>
          <Button>
            <TextAlignEndIcon />
          </Button>
        </ButtonGroup>
      </Section>

      <Section title="Segmented control (gap-0 + merged borders)">
        <ButtonGroup variant="ghost" size="sm">
          <Button>Week</Button>
          <ButtonGroupSeparator />
          <Button>Month</Button>
        </ButtonGroup>
      </Section>
    </div>
  );
}
