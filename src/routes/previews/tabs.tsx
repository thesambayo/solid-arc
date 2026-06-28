import { createFileRoute } from "@tanstack/solid-router";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

export const Route = createFileRoute("/previews/tabs")({
  component: RouteComponent,
});

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      <div class="flex flex-wrap items-start gap-6">{props.children}</div>
    </div>
  );
}

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Tabs</h1>
        <p class="mt-1 text-sm text-muted-foreground">Built on Ark UI.</p>
      </div>

      <Section title="Default variant">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monitors">Monitors</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" class="pt-2">
            <p class="text-sm text-muted-foreground">Overview content.</p>
          </TabsContent>
          <TabsContent value="monitors" class="pt-2">
            <p class="text-sm text-muted-foreground">Monitors content.</p>
          </TabsContent>
          <TabsContent value="settings" class="pt-2">
            <p class="text-sm text-muted-foreground">Settings content.</p>
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Line variant">
        <Tabs defaultValue="overview" class="w-full">
          <TabsList variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monitors">Monitors</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" class="pt-3">
            <p class="text-sm text-muted-foreground">Overview content.</p>
          </TabsContent>
          <TabsContent value="monitors" class="pt-3">
            <p class="text-sm text-muted-foreground">Monitors content.</p>
          </TabsContent>
          <TabsContent value="settings" class="pt-3">
            <p class="text-sm text-muted-foreground">Settings content.</p>
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="With disabled trigger">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monitors">Monitors</TabsTrigger>
            <TabsTrigger value="billing" disabled>
              Billing
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" class="pt-2">
            <p class="text-sm text-muted-foreground">Overview content.</p>
          </TabsContent>
          <TabsContent value="monitors" class="pt-2">
            <p class="text-sm text-muted-foreground">Monitors content.</p>
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Vertical orientation">
        <Tabs
          defaultValue="overview"
          orientation="vertical"
          class="flex-row gap-6"
        >
          <TabsList class="h-auto flex-col items-stretch">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monitors">Monitors</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <div class="flex-1">
            <TabsContent value="overview">
              <p class="text-sm text-muted-foreground">Overview content.</p>
            </TabsContent>
            <TabsContent value="monitors">
              <p class="text-sm text-muted-foreground">Monitors content.</p>
            </TabsContent>
            <TabsContent value="settings">
              <p class="text-sm text-muted-foreground">Settings content.</p>
            </TabsContent>
          </div>
        </Tabs>
      </Section>
    </div>
  );
}
