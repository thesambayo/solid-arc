import { createFileRoute } from "@tanstack/solid-router";
import { SearchIcon, CopyIcon } from "lucide-solid";

import { Button } from "../../components/ui/button";
import { Field, FieldLabel, FieldError } from "../../components/ui/field";
import {
  InputGroup,
  InputAddon,
  InputGroupInput,
} from "../../components/ui/input-group";

export const Route = createFileRoute("/previews/input-group")({
  component: RouteComponent,
});

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      <div class="flex max-w-sm flex-col gap-3">{props.children}</div>
    </div>
  );
}

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">InputGroup</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Decorated input with prefix/suffix addons.
        </p>
      </div>

      <Section title="Addons">
        <InputGroup>
          <InputAddon>
            <SearchIcon class="size-4" />
          </InputAddon>
          <InputGroupInput placeholder="Search monitors…" />
        </InputGroup>

        <InputGroup>
          <InputAddon>https://</InputAddon>
          <InputGroupInput
            type="url"
            placeholder="example.com"
            class="font-mono text-xs"
          />
        </InputGroup>

        <InputGroup>
          <InputAddon>$</InputAddon>
          <InputGroupInput type="number" placeholder="0.00" />
          <InputAddon>USD</InputAddon>
        </InputGroup>

        <InputGroup>
          <InputGroupInput placeholder="sk-••••••••" />
          <Button variant="ghost" size="icon-sm" class="m-1 shrink-0">
            <CopyIcon class="size-3.5" />
          </Button>
        </InputGroup>
      </Section>

      <Section title="With Field (invalid state propagates)">
        <Field invalid>
          <FieldLabel>URL</FieldLabel>
          <InputGroup>
            <InputAddon>https://</InputAddon>
            <InputGroupInput placeholder="example.com" />
          </InputGroup>
          <FieldError>Must be a valid hostname.</FieldError>
        </Field>
      </Section>
    </div>
  );
}
