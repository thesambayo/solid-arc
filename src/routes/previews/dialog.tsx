import { createFileRoute } from "@tanstack/solid-router";
import { TrashIcon } from "lucide-solid";

import { Button } from "../../components/ui/button";
import { buttonVariants } from "../../components/ui/button/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";

export const Route = createFileRoute("/previews/dialog")({
  component: RouteComponent,
});

function Section(props: { title: string; children: any }) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {props.title}
      </p>
      <div class="flex flex-wrap gap-3">{props.children}</div>
    </div>
  );
}

function RouteComponent() {
  return (
    <div class="flex max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 class="text-lg font-semibold">Dialog</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Modal dialog built on Ark UI.
        </p>
      </div>

      <Section title="Basic">
        <Dialog>
          <DialogTrigger
            asChild={(p) => (
              <Button variant="outline" {...p()}>
                Open dialog
              </Button>
            )}
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete monitor</DialogTitle>
              <DialogDescription>
                This action cannot be undone. The monitor and all its history
                will be permanently deleted.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose />
              <Button variant="destructive">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      <Section title="Custom close text">
        <Dialog>
          <DialogTrigger
            asChild={(p) => (
              <Button variant="outline" {...p()}>
                Open dialog
              </Button>
            )}
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm action</DialogTitle>
              <DialogDescription>
                You must use the footer buttons to dismiss this dialog.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      <Section title="Custom close element">
        <Dialog>
          <DialogTrigger
            asChild={(p) => (
              <Button variant="destructive" {...p()}>
                Delete account
              </Button>
            )}
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                Your account and all associated data will be permanently
                deleted. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose class={buttonVariants({ variant: "ghost" })}>
                Never mind
              </DialogClose>
              <Button variant="destructive">
                <TrashIcon />
                Yes, delete account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      <Section title="Without ✕ button">
        <Dialog>
          <DialogTrigger
            asChild={(p) => (
              <Button variant="outline" {...p()}>
                No ✕ button
              </Button>
            )}
          />
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Forced choice</DialogTitle>
              <DialogDescription>
                You must use the footer buttons to dismiss this dialog.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <Button>Continue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>
    </div>
  );
}
