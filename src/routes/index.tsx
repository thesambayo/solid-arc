import { createFileRoute, Link } from "@tanstack/solid-router";
import {
  ArrowRightIcon,
  BlocksIcon,
  PaletteIcon,
  StarIcon,
  ZapIcon,
} from "lucide-solid";
import { For } from "solid-js";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

const components = [
  "accordion",
  "alert",
  "attachment",
  "avatar",
  "badge",
  "button",
  "card",
  "checkbox",
  "combobox",
  "command",
  "date-picker",
  "dialog",
  "dropdown-menu",
  "field",
  "file-upload",
  "hover-card",
  "input",
  "pagination",
  "popover",
  "radio-group",
  "select",
  "separator",
  "sheet",
  "slider",
  "switch",
  "table",
  "tabs",
  "tags-input",
  "toast",
  "tooltip",
] as const;

const features = [
  {
    icon: BlocksIcon,
    title: "Built on Ark UI",
    body: "Accessible, headless primitives with full keyboard and ARIA support — you own the markup.",
  },
  {
    icon: PaletteIcon,
    title: "Tailwind v4 tokens",
    body: "A lean, themeable token set in shadcn's vocabulary. Restyle the whole system from one file.",
  },
  {
    icon: ZapIcon,
    title: "SolidJS native",
    body: "Fine-grained reactivity, no virtual DOM. splitProps, asChild polymorphism, zero ceremony.",
  },
];

function LandingPage() {
  return (
    <div class="min-h-screen">
      {/* Top bar */}
      <header class="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div class="flex items-center gap-2">
            <div class="grid size-6 place-items-center rounded-md bg-foreground text-background">
              <BlocksIcon class="size-3.5" />
            </div>
            <span class="text-sm font-semibold">Solid Foundation</span>
          </div>
          <nav class="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              asChild={(p) => (
                <Link to="/previews" {...p()}>
                  Components
                </Link>
              )}
            />
            <Button
              variant="ghost"
              size="icon-sm"
              asChild={(p) => (
                <a
                  href="https://ark-ui.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Ark UI"
                  {...p()}
                >
                  <StarIcon />
                </a>
              )}
            />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section class="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center">
        <Badge variant="secondary" class="mb-5">
          SolidJS + Ark UI
        </Badge>
        <h1 class="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          The Foundation for your Design System
        </h1>
        <p class="mx-auto mt-5 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
          A set of beautifully designed components that you can customize,
          extend, and build on. Start here, then make it your own. Open source,
          open code.
        </p>
        <div class="mt-8 flex items-center justify-center gap-3">
          <Button
            variant="brand"
            size="lg"
            asChild={(p) => (
              <Link to="/previews" {...p()}>
                Browse Components
                <ArrowRightIcon />
              </Link>
            )}
          />
          <Button
            variant="outline"
            size="lg"
            asChild={(p) => (
              <a
                href="https://ark-ui.com/docs/overview/introduction"
                target="_blank"
                rel="noreferrer"
                {...p()}
              >
                Documentation
              </a>
            )}
          />
        </div>
      </section>

      {/* Features */}
      <section class="mx-auto max-w-5xl px-6 pb-16">
        <div class="grid gap-4 sm:grid-cols-3">
          <For each={features}>
            {(f) => (
              <Card>
                <CardHeader>
                  <div class="mb-1 grid size-9 place-items-center rounded-lg bg-muted text-foreground">
                    <f.icon class="size-4.5" />
                  </div>
                  <CardTitle>{f.title}</CardTitle>
                  <CardDescription>{f.body}</CardDescription>
                </CardHeader>
              </Card>
            )}
          </For>
        </div>
      </section>

      {/* Component index */}
      <section class="mx-auto max-w-5xl px-6 pb-24">
        <div class="mb-4 flex items-end justify-between">
          <div>
            <h2 class="text-lg font-semibold">{components.length} components</h2>
            <p class="text-sm text-muted-foreground">
              Every primitive has a live preview.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild={(p) => (
              <Link to="/previews" {...p()}>
                View all
                <ArrowRightIcon />
              </Link>
            )}
          />
        </div>
        <Separator class="mb-6" />
        <div class="flex flex-wrap gap-2">
          <For each={components}>
            {(name) => (
              <Link
                to={`/previews/${name}`}
                class="rounded-md border border-border bg-background px-3 py-1.5 text-sm capitalize transition-colors hover:bg-muted hover:text-foreground"
              >
                {name.replace(/-/g, " ")}
              </Link>
            )}
          </For>
        </div>
      </section>

      <footer class="border-t border-border">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-muted-foreground">
          <span>Solid Foundation</span>
          <span>Built with SolidJS, Ark UI &amp; Tailwind v4</span>
        </div>
      </footer>
    </div>
  );
}
