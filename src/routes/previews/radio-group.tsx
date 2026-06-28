import { createFileRoute } from "@tanstack/solid-router";

import { Badge } from "../../components/ui/badge";
import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupItem,
  RadioGroupCard,
  RadioGroupItemText,
} from "../../components/ui/radio-group";

export const Route = createFileRoute("/previews/radio-group")({
  component: RouteComponent,
});

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      {props.children}
    </div>
  );
}

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">RadioGroup</h1>
        <p class="mt-1 text-sm text-muted-foreground">Built on Ark UI.</p>
      </div>

      <Section title="Vertical (default)">
        <RadioGroup defaultValue="solid">
          <RadioGroupLabel class="mb-1">Framework</RadioGroupLabel>
          <RadioGroupItem value="solid">SolidJS</RadioGroupItem>
          <RadioGroupItem value="react">React</RadioGroupItem>
          <RadioGroupItem value="vue">Vue</RadioGroupItem>
        </RadioGroup>
      </Section>

      <Section title="Horizontal">
        <RadioGroup defaultValue="30s" orientation="horizontal">
          <RadioGroupItem value="30s">30s</RadioGroupItem>
          <RadioGroupItem value="1m">1m</RadioGroupItem>
          <RadioGroupItem value="5m">5m</RadioGroupItem>
        </RadioGroup>
      </Section>

      <Section title="Disabled item">
        <RadioGroup defaultValue="solid">
          <RadioGroupItem value="solid">SolidJS</RadioGroupItem>
          <RadioGroupItem value="svelte" disabled>
            Svelte (unavailable)
          </RadioGroupItem>
        </RadioGroup>
      </Section>

      <Section title="Card variant">
        <RadioGroup defaultValue="pro" class="gap-3">
          <RadioGroupCard value="solo">
            <div class="flex flex-col gap-0.5">
              <RadioGroupItemText class="font-medium">Solo</RadioGroupItemText>
              <span class="text-xs text-muted-foreground">
                Just me, free forever
              </span>
            </div>
          </RadioGroupCard>
          <RadioGroupCard value="pro">
            <div class="flex flex-1 flex-col gap-1">
              <div class="flex items-center gap-2">
                <RadioGroupItemText class="font-medium">Pro</RadioGroupItemText>
                <Badge variant="success">Popular</Badge>
              </div>
              <span class="text-xs text-muted-foreground">$12/month</span>
            </div>
          </RadioGroupCard>
          <RadioGroupCard value="team" disabled>
            <div class="flex flex-col gap-0.5">
              <RadioGroupItemText class="font-medium">Team</RadioGroupItemText>
              <span class="text-xs text-muted-foreground">Coming soon</span>
            </div>
          </RadioGroupCard>
        </RadioGroup>
      </Section>
    </div>
  );
}
