import { createFileRoute } from "@tanstack/solid-router";
import { XIcon } from "lucide-solid";

import { Button } from "../../components/ui/button";
import { Field, FieldLabel } from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../../components/ui/popover";

export const Route = createFileRoute("/previews/popover")({
  component: RouteComponent,
});

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      <div class="flex flex-wrap items-start gap-4">{props.children}</div>
    </div>
  );
}

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Popover</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Rich content in a portal, triggered by a button. Built on Ark UI.
        </p>
      </div>

      <Section title="Basic">
        <Popover>
          <PopoverTrigger>open popover</PopoverTrigger>
          {/*<PopoverTrigger
            asChild={(p) => (
              <Button variant="outline" {...p()}>
                Open popover
              </Button>
            )}
          />*/}
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>Monitor settings</PopoverTitle>
              <PopoverDescription>
                Adjust the check interval and alert thresholds for this monitor.
              </PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      </Section>

      <Section title="With close button">
        <Popover>
          <PopoverTrigger
            asChild={(p) => (
              <Button variant="outline" {...p()}>
                Open popover
              </Button>
            )}
          />
          <PopoverContent showCloseButton>
            <PopoverHeader>
              <PopoverTitle>Notifications</PopoverTitle>
              <PopoverDescription>
                You have 3 unread alerts from the last 24 hours.
              </PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>

        {/* Manual close button placement */}
        <Popover>
          <PopoverTrigger
            asChild={(p) => (
              <Button variant="outline" {...p()}>
                Manual close button
              </Button>
            )}
          />
          <PopoverContent>
            <div class="flex items-start justify-between gap-2">
              <PopoverHeader>
                <PopoverTitle>Custom layout</PopoverTitle>
                <PopoverDescription>
                  Close button placed manually in the header.
                </PopoverDescription>
              </PopoverHeader>
              <PopoverClose class="shrink-0">
                <XIcon class="size-4" />
              </PopoverClose>
            </div>
          </PopoverContent>
        </Popover>
      </Section>

      <Section title="With form">
        <Popover>
          <PopoverTrigger
            asChild={(p) => (
              <Button variant="outline" {...p()}>
                Edit details
              </Button>
            )}
          />
          <PopoverContent showCloseButton>
            <PopoverHeader>
              <PopoverTitle>Edit monitor</PopoverTitle>
              <PopoverDescription>
                Update the display name for this monitor.
              </PopoverDescription>
            </PopoverHeader>
            <form
              class="mt-3 flex flex-col gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input placeholder="Production API" />
              </Field>
              <Field>
                <FieldLabel>URL</FieldLabel>
                <Input placeholder="https://api.example.com/health" />
              </Field>
              <Button size="sm" class="self-end">
                Save changes
              </Button>
            </form>
          </PopoverContent>
        </Popover>
      </Section>

      <Section title="Positioning">
        <Popover positioning={{ placement: "top" }}>
          <PopoverTrigger
            asChild={(p) => (
              <Button variant="outline" size="sm" {...p()}>
                Top
              </Button>
            )}
          />
          <PopoverContent class="w-48">
            <PopoverDescription>Opens above the trigger.</PopoverDescription>
          </PopoverContent>
        </Popover>

        <Popover positioning={{ placement: "right" }}>
          <PopoverTrigger
            asChild={(p) => (
              <Button variant="outline" size="sm" {...p()}>
                Right
              </Button>
            )}
          />
          <PopoverContent class="w-48">
            <PopoverDescription>Opens to the right.</PopoverDescription>
          </PopoverContent>
        </Popover>

        <Popover positioning={{ placement: "bottom-start" }}>
          <PopoverTrigger
            asChild={(p) => (
              <Button variant="outline" size="sm" {...p()}>
                Bottom start
              </Button>
            )}
          />
          <PopoverContent class="w-48">
            <PopoverDescription>Aligned to the start.</PopoverDescription>
          </PopoverContent>
        </Popover>

        <Popover positioning={{ placement: "bottom-end" }}>
          <PopoverTrigger
            asChild={(p) => (
              <Button variant="outline" size="sm" {...p()}>
                Bottom end
              </Button>
            )}
          />
          <PopoverContent class="w-48">
            <PopoverDescription>Aligned to the end.</PopoverDescription>
          </PopoverContent>
        </Popover>
      </Section>
    </div>
  );
}
