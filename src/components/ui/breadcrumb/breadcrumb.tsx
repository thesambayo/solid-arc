/**
 * Breadcrumb — navigation trail showing the path to the current resource.
 *
 * Composition:
 *   Breadcrumb
 *   └── BreadcrumbList
 *       ├── BreadcrumbItem
 *       │   └── BreadcrumbLink   (polymorphic via `asChild`)
 *       ├── BreadcrumbSeparator
 *       ├── BreadcrumbItem
 *       │   └── BreadcrumbPage   (current page, non-clickable)
 *       └── BreadcrumbEllipsis   (collapsed-state indicator)
 */
import { ark, type HTMLArkProps } from "@ark-ui/solid";
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-solid";
import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";

// ─── Breadcrumb (root) ────────────────────────────────────────────────────────

function Breadcrumb(props: ComponentProps<"nav">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      class={cn(local.class)}
      {...rest}
    />
  );
}

// ─── BreadcrumbList ───────────────────────────────────────────────────────────

function BreadcrumbList(props: ComponentProps<"ol">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ol
      data-slot="breadcrumb-list"
      class={cn(
        "flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── BreadcrumbItem ───────────────────────────────────────────────────────────

function BreadcrumbItem(props: ComponentProps<"li">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <li
      data-slot="breadcrumb-item"
      class={cn("inline-flex items-center gap-1", local.class)}
      {...rest}
    />
  );
}

// ─── BreadcrumbLink ───────────────────────────────────────────────────────────
// Built on ark.a so it can become a router <Link/> via `asChild`.

function BreadcrumbLink(props: HTMLArkProps<"a">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ark.a
      data-slot="breadcrumb-link"
      class={cn("transition-colors hover:text-foreground", local.class)}
      {...rest}
    />
  );
}

// ─── BreadcrumbPage ───────────────────────────────────────────────────────────
// The current page — not a link, so it's announced as the page, not as an item.

function BreadcrumbPage(props: ComponentProps<"span">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      class={cn("font-normal text-foreground", local.class)}
      {...rest}
    />
  );
}

// ─── BreadcrumbSeparator ──────────────────────────────────────────────────────

function BreadcrumbSeparator(props: ComponentProps<"li">) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      class={cn("[&>svg]:size-3.5", local.class)}
      {...rest}
    >
      {local.children ?? <ChevronRightIcon />}
    </li>
  );
}

// ─── BreadcrumbEllipsis ───────────────────────────────────────────────────────

function BreadcrumbEllipsis(props: ComponentProps<"span">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      class={cn(
        "flex size-5 items-center justify-center [&>svg]:size-4",
        local.class,
      )}
      {...rest}
    >
      <MoreHorizontalIcon />
      <span class="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
