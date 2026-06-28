import { createFileRoute } from "@tanstack/solid-router";
import { createSignal } from "solid-js";

import { Field, FieldDescription, FieldLabel } from "../../components/ui/field";
import { Switch, SwitchContext, SwitchLabel } from "../../components/ui/switch";

export const Route = createFileRoute("/previews/switch")({
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
  const [checked, setChecked] = createSignal(false);

  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Switch</h1>
        <p class="mt-1 text-sm text-muted-foreground">Built on Ark UI.</p>
      </div>

      <Section title="States">
        <Switch>
          <SwitchLabel>Off</SwitchLabel>
        </Switch>
        <Switch defaultChecked>
          <SwitchLabel>On</SwitchLabel>
        </Switch>
        <Switch disabled>
          <SwitchLabel>Disabled (off)</SwitchLabel>
        </Switch>
        <Switch defaultChecked disabled>
          <SwitchLabel>Disabled (on)</SwitchLabel>
        </Switch>
      </Section>

      <Section title="Brand variant">
        <Switch brand>
          <SwitchLabel>Off</SwitchLabel>
        </Switch>
        <Switch brand defaultChecked>
          <SwitchLabel>On</SwitchLabel>
        </Switch>
        <Switch brand disabled>
          <SwitchLabel>Disabled (off)</SwitchLabel>
        </Switch>
        <Switch brand defaultChecked disabled>
          <SwitchLabel>Disabled (on)</SwitchLabel>
        </Switch>
      </Section>

      <Section title="Sizes">
        <Switch size="sm">
          <SwitchLabel>Small</SwitchLabel>
        </Switch>
        <Switch size="sm" defaultChecked>
          <SwitchLabel>Small on</SwitchLabel>
        </Switch>
        <Switch size="default">
          <SwitchLabel>Default</SwitchLabel>
        </Switch>
        <Switch size="default" defaultChecked>
          <SwitchLabel>Default on</SwitchLabel>
        </Switch>
      </Section>

      <Section title="Controlled">
        <Switch
          checked={checked()}
          onCheckedChange={(e) => setChecked(e.checked)}
        >
          <SwitchContext>
            {(ctx) => (
              <SwitchLabel>
                Notifications are {ctx().checked ? "enabled" : "disabled"}
              </SwitchLabel>
            )}
          </SwitchContext>
        </Switch>
      </Section>

      <Section title="Without label">
        <Switch />
        <Switch defaultChecked />
        <Switch brand defaultChecked />
      </Section>

      <div class="flex flex-col gap-3">
        <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          With Field
        </p>
        <div class="flex flex-col gap-4">
          <Field>
            <div class="flex items-center justify-between">
              <div class="flex flex-col gap-0.5">
                <FieldLabel>Email notifications</FieldLabel>
                <FieldDescription>
                  Receive alerts when a monitor goes down.
                </FieldDescription>
              </div>
              <Switch name="email-notifications" />
            </div>
          </Field>

          <Field>
            <div class="flex items-center justify-between">
              <div class="flex flex-col gap-0.5">
                <FieldLabel>Weekly digest</FieldLabel>
                <FieldDescription>
                  A summary of uptime reports every Monday.
                </FieldDescription>
              </div>
              <Switch name="weekly-digest" defaultChecked brand />
            </div>
          </Field>

          <Field>
            <div class="flex items-center justify-between">
              <div class="flex flex-col gap-0.5">
                <FieldLabel>SMS alerts</FieldLabel>
                <FieldDescription>
                  Text messages for critical incidents.
                </FieldDescription>
              </div>
              <Switch name="sms-alerts" disabled />
            </div>
          </Field>
        </div>
      </div>
    </div>
  );
}
