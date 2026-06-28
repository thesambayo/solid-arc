import { createFileRoute } from "@tanstack/solid-router";
import { CalendarIcon, LinkIcon } from "lucide-solid";

import { Button } from "../../components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../components/ui/hover-card";

export const Route = createFileRoute("/previews/hover-card")({
  component: RouteComponent,
});

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      <div class="flex flex-wrap gap-6">{props.children}</div>
    </div>
  );
}

function UserCard() {
  return (
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between gap-4">
        <img
          src="https://i.pravatar.cc/300?u=sarah"
          alt="Sarah Chen"
          class="size-10 rounded-full"
        />
        <Button size="xs">Follow</Button>
      </div>
      <div>
        <p class="font-medium">Sarah Chen</p>
        <p class="text-muted-foreground">@sarah_chen</p>
      </div>
      <p class="text-muted-foreground">
        Design Engineer at Acme Inc. Building beautiful interfaces and design
        systems.
      </p>
      <div class="flex gap-4 text-muted-foreground">
        <span>
          <span class="font-medium text-foreground">2,456</span> Following
        </span>
        <span>
          <span class="font-medium text-foreground">14.5K</span> Followers
        </span>
      </div>
    </div>
  );
}

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Hover Card</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Preview content on hover. Built on Ark UI.
        </p>
      </div>

      <Section title="Basic">
        <HoverCard>
          <p class="text-sm">
            Liked by{" "}
            <HoverCardTrigger
              asChild={(p) => (
                <a
                  href="#"
                  class="font-medium underline underline-offset-4"
                  {...p()}
                >
                  @sarah_chen
                </a>
              )}
            />{" "}
            and 3 others
          </p>
          <HoverCardContent>
            <UserCard />
          </HoverCardContent>
        </HoverCard>
      </Section>

      <Section title="Custom delays">
        <HoverCard openDelay={100} closeDelay={300}>
          <p class="text-sm">
            Fast open —{" "}
            <HoverCardTrigger
              asChild={(p) => (
                <a
                  href="#"
                  class="font-medium underline underline-offset-4"
                  {...p()}
                >
                  hover me
                </a>
              )}
            />
          </p>
          <HoverCardContent>
            <p class="text-muted-foreground">
              Opens after 100ms, closes after 300ms.
            </p>
          </HoverCardContent>
        </HoverCard>

        <HoverCard openDelay={800} closeDelay={0}>
          <p class="text-sm">
            Slow open —{" "}
            <HoverCardTrigger
              asChild={(p) => (
                <a
                  href="#"
                  class="font-medium underline underline-offset-4"
                  {...p()}
                >
                  hover me
                </a>
              )}
            />
          </p>
          <HoverCardContent>
            <p class="text-muted-foreground">
              Opens after 800ms, closes immediately.
            </p>
          </HoverCardContent>
        </HoverCard>
      </Section>

      <Section title="Custom positioning">
        <HoverCard positioning={{ placement: "right", gutter: 12 }}>
          <HoverCardTrigger
            asChild={(p) => (
              <a
                href="#"
                class="flex items-center gap-1.5 text-sm font-medium underline underline-offset-4"
                {...p()}
              >
                <LinkIcon class="size-3.5" />
                Opens to the right
              </a>
            )}
          />
          <HoverCardContent class="w-48">
            <p class="text-muted-foreground">
              Positioned to the right with a 12px gutter.
            </p>
          </HoverCardContent>
        </HoverCard>

        <HoverCard positioning={{ placement: "top" }}>
          <HoverCardTrigger
            asChild={(p) => (
              <a
                href="#"
                class="flex items-center gap-1.5 text-sm font-medium underline underline-offset-4"
                {...p()}
              >
                <LinkIcon class="size-3.5" />
                Opens above
              </a>
            )}
          />
          <HoverCardContent class="w-48">
            <p class="text-muted-foreground">Positioned above the trigger.</p>
          </HoverCardContent>
        </HoverCard>
      </Section>

      <Section title="Rich content">
        <HoverCard>
          <p class="text-sm">
            Published on{" "}
            <HoverCardTrigger
              asChild={(p) => (
                <a
                  href="#"
                  class="font-medium underline underline-offset-4"
                  {...p()}
                >
                  Argus Blog
                </a>
              )}
            />
          </p>
          <HoverCardContent>
            <div class="flex flex-col gap-2">
              <p class="font-medium">Introducing Argus v0.1</p>
              <p class="text-muted-foreground">
                A lightweight URL uptime monitor with real-time health checks
                and beautiful dashboards.
              </p>
              <div class="flex items-center gap-1.5 text-muted-foreground">
                <CalendarIcon class="size-3.5" />
                <span>Published January 2025</span>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </Section>
    </div>
  );
}
