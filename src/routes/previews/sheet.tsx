import { createFileRoute } from "@tanstack/solid-router";

import { Button } from "../../components/ui/button";
import { Field, FieldDescription, FieldLabel } from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";

export const Route = createFileRoute("/previews/sheet")({
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
        <h1 class="text-lg font-semibold">Sheet</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          A Dialog that slides in from an edge. Same state machine as Dialog,
          different positioning.
        </p>
      </div>

      {/* ── All sides ─────────────────────────────────────────────────────── */}
      <Section
        title="Sides"
        description="Use the side prop to anchor the sheet to any edge. Default is right."
      >
        <div class="flex flex-wrap gap-2">
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Sheet>
              <SheetTrigger class="rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-muted">
                Open {side}
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>Sheet from the {side}</SheetTitle>
                  <SheetDescription>
                    Anchored to the {side} edge of the viewport.
                  </SheetDescription>
                </SheetHeader>
                <div class="flex-1 overflow-auto p-4 text-sm text-muted-foreground">
                  Body content goes here. This area grows and scrolls when the
                  content is taller than the sheet.
                </div>
                <SheetFooter>
                  <SheetClose>Close</SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ))}
        </div>
      </Section>

      {/* ── Form sheet ────────────────────────────────────────────────────── */}
      <Section
        title="Form"
        description="A common pattern — edit form in a right-side sheet with footer actions."
      >
        <Sheet>
          <SheetTrigger class="rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-muted">
            Edit profile
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            <div class="flex flex-1 flex-col gap-4 overflow-auto p-4">
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input value="Samuel" />
              </Field>
              <Field>
                <FieldLabel>Username</FieldLabel>
                <Input value="@sambayo" />
                <FieldDescription>Your public display handle.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input value="sambayo28@gmail.com" type="email" />
              </Field>
            </div>
            <SheetFooter>
              <SheetClose>Cancel</SheetClose>
              <Button>Save changes</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Section>

      {/* ── Without close button ──────────────────────────────────────────── */}
      <Section
        title="Without close button"
        description="Pass showCloseButton={false} when you want the footer/escape to be the only way out."
      >
        <Sheet>
          <SheetTrigger class="rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-muted">
            Open
          </SheetTrigger>
          <SheetContent showCloseButton={false}>
            <SheetHeader>
              <SheetTitle>Confirm action</SheetTitle>
              <SheetDescription>
                The X is hidden — use a footer button or press Escape.
              </SheetDescription>
            </SheetHeader>
            <div class="flex-1 p-4 text-sm text-muted-foreground">
              Useful when you want users to explicitly accept or decline,
              instead of dismissing.
            </div>
            <SheetFooter>
              <SheetClose>Cancel</SheetClose>
              <Button>Continue</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Section>
    </div>
  );
}
