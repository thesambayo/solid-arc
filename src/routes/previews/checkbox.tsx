import { Checkbox as CheckboxPrimitive } from "@ark-ui/solid/checkbox";
import { createFileRoute } from "@tanstack/solid-router";
import { CheckIcon } from "lucide-solid";
import { For } from "solid-js";

import {
  Checkbox,
  CheckboxLabel,
  CheckboxGroup,
  CheckboxContext,
} from "../../components/ui/checkbox";
import { cn } from "../../lib/cn";

export const Route = createFileRoute("/previews/checkbox")({
  component: RouteComponent,
});

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      <div class="flex flex-col gap-2">{props.children}</div>
    </div>
  );
}

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Checkbox</h1>
        <p class="mt-1 text-sm text-muted-foreground">Built on Ark UI.</p>
      </div>

      <Section title="States">
        <Checkbox>
          <CheckboxLabel>Unchecked</CheckboxLabel>
        </Checkbox>
        <Checkbox defaultChecked>
          <CheckboxLabel>Checked</CheckboxLabel>
        </Checkbox>
        <Checkbox checked="indeterminate">
          <CheckboxLabel>Indeterminate</CheckboxLabel>
        </Checkbox>
        <Checkbox disabled>
          <CheckboxLabel>Disabled (unchecked)</CheckboxLabel>
        </Checkbox>
        <Checkbox defaultChecked disabled>
          <CheckboxLabel>Disabled (checked)</CheckboxLabel>
        </Checkbox>
      </Section>

      <Section title="Brand variant">
        <Checkbox brand>
          <CheckboxLabel>Unchecked</CheckboxLabel>
        </Checkbox>
        <Checkbox brand defaultChecked>
          <CheckboxLabel>Checked</CheckboxLabel>
        </Checkbox>
        <Checkbox brand checked="indeterminate">
          <CheckboxLabel>Indeterminate</CheckboxLabel>
        </Checkbox>
        <Checkbox brand disabled>
          <CheckboxLabel>Disabled (unchecked)</CheckboxLabel>
        </Checkbox>
        <Checkbox brand defaultChecked disabled>
          <CheckboxLabel>Disabled (checked)</CheckboxLabel>
        </Checkbox>
      </Section>

      <Section title="Group">
        <CheckboxGroup name="frameworks" maxSelectedValues={2}>
          <Checkbox value="solid">
            <CheckboxLabel>SolidJS</CheckboxLabel>
          </Checkbox>
          <Checkbox value="react">
            <CheckboxLabel>React</CheckboxLabel>
          </Checkbox>
          <Checkbox value="vue">
            <CheckboxLabel>Vue</CheckboxLabel>
          </Checkbox>
          <Checkbox value="angular">
            <CheckboxLabel>Angular</CheckboxLabel>
          </Checkbox>
        </CheckboxGroup>
      </Section>

      <Section title="As part of form">
        <form
          class="flex flex-col items-start gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            console.log("terms:", formData.get("terms"));
          }}
        >
          <Checkbox name="terms">
            <CheckboxLabel>Accept Terms and conditions</CheckboxLabel>
            <CheckboxContext>
              {(checkbox) => <>Checked: {String(checkbox().checked)}</>}
            </CheckboxContext>
          </Checkbox>
          <button data-variant="solid" type="submit">
            Submit
          </button>
        </form>
      </Section>
    </div>
  );
}
