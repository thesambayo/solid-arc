import { createFileRoute } from "@tanstack/solid-router";
import { For } from "solid-js";

import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
  type BubbleVariantProps,
} from "../../components/ui/bubble";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible";
import { Separator } from "../../components/ui/separator";

export const Route = createFileRoute("/previews/bubble")({
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
      {props.children}
    </div>
  );
}

const VARIANTS: NonNullable<BubbleVariantProps["variant"]>[] = [
  "default",
  "secondary",
  "muted",
  "tinted",
  "outline",
  "ghost",
  "destructive",
];

// A realistic thread — `default` (brand) is "me" on the end, `secondary` is
// "them" on the start.
function ChatDemo() {
  return (
    <div class="flex flex-col gap-5 rounded-xl border border-border bg-background p-4">
      <Bubble variant="default" align="end">
        <BubbleContent>Hey there! What's up?</BubbleContent>
      </Bubble>

      <BubbleGroup>
        <Bubble variant="secondary" align="start">
          <BubbleContent>Hey! Want to see chat bubbles?</BubbleContent>
        </Bubble>
        <Bubble variant="secondary" align="start">
          <BubbleContent>
            I can group messages, switch sides, and keep the whole thread easy
            to scan.
          </BubbleContent>
          <BubbleReactions role="img" aria-label="Reaction: thumbs up">
            <span>👍</span>
          </BubbleReactions>
        </Bubble>
      </BubbleGroup>

      <Bubble variant="default" align="end">
        <BubbleContent>Sure. Hit me with your best demo.</BubbleContent>
      </Bubble>

      <Bubble variant="secondary" align="start">
        <BubbleContent>
          Yes. You are reading a demo that is demoing itself. Very meta. Very
          on-brand.
        </BubbleContent>
        <BubbleReactions
          role="img"
          aria-label="Reactions: thumbs up, fire, eyes, and 2 more"
        >
          <span>👍</span>
          <span>🔥</span>
          <span>👀</span>
          <span class="text-muted-foreground">+2</span>
        </BubbleReactions>
      </Bubble>
    </div>
  );
}

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-6 p-8">
      <div>
        <h1 class="text-lg font-semibold">Bubble</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          A framed surface for conversational content.
        </p>
      </div>

      <ChatDemo />

      <Separator />

      <Section title="Variants">
        <div class="flex flex-col gap-2">
          <For each={VARIANTS}>
            {(variant) => (
              <Bubble variant={variant}>
                <BubbleContent>
                  <span class="font-medium">{variant}</span> — I checked the
                  registry output and removed the stale route.
                </BubbleContent>
              </Bubble>
            )}
          </For>
        </div>
      </Section>

      <Separator />

      <Section
        title="Alignment"
        description="Receiver on the start, sender on the end."
      >
        <div class="flex flex-col gap-2">
          <Bubble variant="secondary" align="start">
            <BubbleContent>Did the deploy go through?</BubbleContent>
          </Bubble>
          <Bubble variant="default" align="end">
            <BubbleContent>Yep — green across the board. 🎉</BubbleContent>
          </Bubble>
        </div>
      </Section>

      <Separator />

      <Section
        title="Bubble group"
        description="Consecutive bubbles from the same sender."
      >
        <BubbleGroup>
          <Bubble variant="secondary" align="start">
            <BubbleContent>I pushed the combobox fix.</BubbleContent>
          </Bubble>
          <Bubble variant="secondary" align="start">
            <BubbleContent>
              Empty state only shows when filtered now.
            </BubbleContent>
          </Bubble>
          <Bubble variant="secondary" align="start">
            <BubbleContent>Mind taking a look?</BubbleContent>
          </Bubble>
        </BubbleGroup>
      </Section>

      <Separator />

      <Section
        title="Links and buttons"
        description="Use asChild on BubbleContent to render an <a> or <button>."
      >
        <div class="flex flex-col gap-2">
          <Bubble variant="muted" align="end">
            <BubbleContent
              asChild={(p) => (
                <button
                  type="button"
                  onClick={() => alert("Replied!")}
                  {...p()}
                />
              )}
            >
              I forgot my password
            </BubbleContent>
          </Bubble>
          <Bubble variant="outline">
            <BubbleContent
              asChild={(p) => (
                <a href="https://ark-ui.com" target="_blank" {...p()} />
              )}
            >
              Open the Ark UI docs →
            </BubbleContent>
          </Bubble>
        </div>
      </Section>

      <Separator />

      <Section
        title="Reactions"
        description="Anchored to an edge; note the extra vertical gap so rows don't clip."
      >
        <div class="flex flex-col gap-6">
          <Bubble variant="secondary" align="start">
            <BubbleContent>Shipped the new tokens.</BubbleContent>
            <BubbleReactions
              role="img"
              aria-label="Reactions: thumbs up, fire, and 8 more"
            >
              <span>👍</span>
              <span>🔥</span>
              <span class="text-muted-foreground">+8</span>
            </BubbleReactions>
          </Bubble>

          <Bubble variant="default" align="end">
            <BubbleContent>Looks great.</BubbleContent>
            <BubbleReactions side="top" align="start">
              <span>❤️</span>
            </BubbleReactions>
          </Bubble>
        </div>
      </Section>

      <Separator />

      <Section
        title="Show more / collapsible"
        description="Compose with Collapsible for long content."
      >
        <Bubble variant="secondary" align="start">
          <BubbleContent>
            <Collapsible>
              <p>
                The registry build emitted 34 component entries. I noticed three
                had stale internal import paths…
              </p>
              <CollapsibleContent class="pt-1 text-muted-foreground">
                …so I rewrote them against the alias placeholder and re-ran the
                build. All green now, and the bundle dropped a few KB since the
                duplicate cn helper is gone.
              </CollapsibleContent>
              <CollapsibleTrigger class="mt-1 text-xs font-medium text-brand hover:underline">
                Show more
              </CollapsibleTrigger>
            </Collapsible>
          </BubbleContent>
        </Bubble>
      </Section>
    </div>
  );
}
