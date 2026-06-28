import { createFileRoute } from "@tanstack/solid-router";

import { Checkbox, CheckboxLabel } from "../../components/ui/checkbox";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldRequiredIndicator,
} from "../../components/ui/field";
import { Input } from "../../components/ui/input";

export const Route = createFileRoute("/previews/field")({
  component: RouteComponent,
});

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      <div class="flex max-w-sm flex-col gap-4">{props.children}</div>
    </div>
  );
}

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Field</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Form field wrapper. Propagates invalid/disabled/required to child
          controls via context.
        </p>
      </div>

      <Section title="Variants">
        <Field>
          <FieldLabel>Monitor name</FieldLabel>
          <Input placeholder="Checkout API" />
        </Field>

        <Field>
          <FieldLabel>Webhook URL</FieldLabel>
          <Input type="url" placeholder="https://…" />
          <FieldDescription>Called on every status change.</FieldDescription>
        </Field>

        <Field invalid>
          <FieldLabel>URL</FieldLabel>
          <Input placeholder="https://…" />
          <FieldError>Must be a valid URL.</FieldError>
        </Field>

        <Field required>
          <FieldLabel>
            Email
            <FieldRequiredIndicator />
          </FieldLabel>
          <Input type="email" placeholder="you@example.com" />
        </Field>

        <Field disabled>
          <FieldLabel>API key</FieldLabel>
          <Input value="sk-••••••••••••••••" />
        </Field>

        <Field>
          <Checkbox>
            <CheckboxLabel>check me</CheckboxLabel>
          </Checkbox>
        </Field>
      </Section>
    </div>
  );
}
