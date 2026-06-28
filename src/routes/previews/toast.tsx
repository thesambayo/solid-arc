import { createFileRoute } from "@tanstack/solid-router";
import { ExternalLinkIcon, SparklesIcon, UndoIcon } from "lucide-solid";
import { createSignal } from "solid-js";

import { Button } from "../../components/ui/button";
import { toast } from "../../components/ui/toast";

export const Route = createFileRoute("/previews/toast")({
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
      <div class="flex flex-wrap gap-2">{props.children}</div>
    </div>
  );
}

// Simulated async operation — resolves or rejects randomly after a delay
const uploadFile = () =>
  new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.5 ? resolve() : reject(new Error("Upload failed"));
    }, 1500);
  });

function RouteComponent() {
  const [updateId, setUpdateId] = createSignal<string | undefined>();

  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Toast</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Module singleton — import{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">toast</code> from
          anywhere (components, API interceptors, mutation handlers) and call
          it. The Toaster mounts once in{" "}
          <code class="rounded bg-muted px-1 py-0.5 text-xs">__root.tsx</code>.
        </p>
        <p class="mt-2 text-xs text-muted-foreground">
          Toggle <strong>richColors</strong> on the Toaster (in __root.tsx) to
          see the bolder variant. Default is subtle (icon-colored only).
        </p>
      </div>

      {/* ── Basic ─────────────────────────────────────────────────────────── */}
      <Section title="Basic">
        <Button
          variant="outline"
          onClick={() =>
            toast.create({
              title: "Scheduled for tomorrow",
              description: "Your meeting has been scheduled for 10am.",
            })
          }
        >
          Default
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.create({ title: "Just a title" })}
        >
          Title only
        </Button>
      </Section>

      {/* ── Types ─────────────────────────────────────────────────────────── */}
      <Section
        title="Types"
        description="success · error · warning · info · loading — each gets a matching icon."
      >
        <Button
          variant="outline"
          onClick={() =>
            toast.success({
              title: "Changes saved",
              description: "Your monitor configuration has been updated.",
              duration: Infinity,
            })
          }
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.error({
              title: "Couldn't save",
              description: "The server rejected your changes. Please retry.",
            })
          }
        >
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.warning({
              title: "Low quota",
              description: "You've used 90% of your monthly check budget.",
            })
          }
        >
          Warning
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.info({
              title: "Update available",
              description: "Argus v0.3.0 is ready to deploy.",
            })
          }
        >
          Info
        </Button>
      </Section>

      {/* ── Promise ───────────────────────────────────────────────────────── */}
      <Section
        title="Promise"
        description="One call covers loading → success/error transitions. The killer feature for mutations."
      >
        <Button
          variant="outline"
          onClick={() =>
            toast.promise(uploadFile(), {
              loading: {
                title: "Uploading...",
                description: "Sending your file to the server.",
              },
              success: {
                title: "Upload complete",
                description: "Your file is now live.",
              },
              error: {
                title: "Upload failed",
                description: "Try again in a moment.",
              },
            })
          }
        >
          Run promise (50/50)
        </Button>
      </Section>

      {/* ── Rich content (JSX in title/description/action) ───────────────── */}
      <Section
        title="Rich content"
        description="title, description, and action.label all render whatever you pass — strings or JSX. Cast as any to satisfy Ark's string-only types."
      >
        <Button
          variant="outline"
          onClick={() =>
            toast.success({
              title: (
                <span class="inline-flex items-center gap-1.5">
                  <SparklesIcon class="size-3.5" />
                  Welcome back, Samuel
                </span>
              ) as any,
              description: (
                <span>
                  You have <strong>3 monitors</strong> reporting in.
                </span>
              ) as any,
            })
          }
        >
          Title with icon
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.info({
              title: "Deployment complete",
              description: (
                <span>
                  View it at{" "}
                  <a
                    href="#"
                    class="underline underline-offset-2 hover:no-underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    argus.dev/v0.3
                  </a>
                </span>
              ) as any,
            })
          }
        >
          Description with link
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.create({
              title: "Monitor deleted",
              description: (
                <span class="font-mono text-xs">api.argus.dev/health</span>
              ) as any,
              action: {
                label: (
                  <span class="inline-flex items-center gap-1">
                    <UndoIcon class="size-3" />
                    Undo
                  </span>
                ) as any,
                onClick: () => toast.success({ title: "Restored" }),
              },
            })
          }
        >
          Action with icon
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.create({
              title: (
                <span class="inline-flex items-center gap-1.5">
                  New release
                  <span class="rounded bg-foreground/10 px-1.5 py-0.5 text-xs font-medium">
                    v0.3.0
                  </span>
                </span>
              ) as any,
              description: "Includes the new dashboard view.",
              action: {
                label: (
                  <span class="inline-flex items-center gap-1">
                    Open
                    <ExternalLinkIcon class="size-3" />
                  </span>
                ) as any,
                onClick: () => console.log("open release"),
              },
            })
          }
        >
          Inline badge in title
        </Button>
      </Section>

      {/* ── Action ────────────────────────────────────────────────────────── */}
      <Section
        title="Action"
        description="Add an action button — perfect for Undo or View patterns."
      >
        <Button
          variant="outline"
          onClick={() =>
            toast.create({
              title: "Monitor deleted",
              description: "api.argus.dev/health was removed.",
              type: "info",
              action: {
                label: "Undo",
                onClick: () => {
                  toast.success({ title: "Restored" });
                },
              },
            })
          }
        >
          Delete with Undo
        </Button>
      </Section>

      {/* ── Update ────────────────────────────────────────────────────────── */}
      <Section
        title="Update"
        description="Start as loading, then update in place — useful when you have your own progress signals."
      >
        <Button
          variant="outline"
          onClick={() =>
            setUpdateId(
              toast.create({
                title: "Sending invitation...",
                description: "Please wait.",
                type: "loading",
              }),
            )
          }
        >
          Start loading
        </Button>
        <Button
          variant="outline"
          disabled={!updateId()}
          onClick={() => {
            const id = updateId();
            if (!id) return;
            toast.update(id, {
              title: "Invitation sent",
              description: "samuel@argus.dev will get an email shortly.",
              type: "success",
            });
            setUpdateId(undefined);
          }}
        >
          Mark complete
        </Button>
      </Section>

      {/* ── Duration ──────────────────────────────────────────────────────── */}
      <Section
        title="Duration"
        description="Use Infinity to keep the toast until manually dismissed."
      >
        <Button
          variant="outline"
          onClick={() => toast.create({ title: "Quick (1s)", duration: 1000 })}
        >
          1s
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.create({ title: "Default (~5s)" })}
        >
          Default
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.create({
              title: "Sticky",
              description: "Won't auto-dismiss — click X to close.",
              duration: Infinity,
            })
          }
        >
          Sticky (∞)
        </Button>
      </Section>

      {/* ── Stacking ──────────────────────────────────────────────────────── */}
      <Section
        title="Stacking"
        description="Max is set to 5. Fire 7 to see queueing — extras appear as previous ones dismiss."
      >
        <Button
          variant="outline"
          onClick={() => {
            for (let i = 1; i <= 7; i++) {
              toast.info({
                title: `Notification ${i}`,
                description: `Item ${i} of 7.`,
              });
            }
          }}
        >
          Fire 7 toasts
        </Button>
        <Button variant="ghost" onClick={() => toast.dismiss()}>
          Dismiss all
        </Button>
      </Section>
    </div>
  );
}
