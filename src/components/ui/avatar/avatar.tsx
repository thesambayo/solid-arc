import { Avatar as AvatarPrimitive } from "@ark-ui/solid/avatar";
import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../../../lib/cn";

interface AvatarRootProps extends ComponentProps<typeof AvatarPrimitive.Root> {
  size?: "sm" | "default" | "lg";
}

function Avatar(props: AvatarRootProps) {
  const [local, rest] = splitProps(props, ["class", "size"]);
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={local.size ?? "default"}
      class={cn(
        "group/avatar relative flex shrink-0 overflow-hidden rounded-full select-none",
        "size-8 data-[size=lg]:size-10 data-[size=sm]:size-6",
        "after:absolute after:inset-0 after:rounded-full after:border after:border-black/8",
        local.class,
      )}
      {...rest}
    />
  );
}

function AvatarImage(props: ComponentProps<typeof AvatarPrimitive.Image>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      class={cn("aspect-square size-full object-cover", local.class)}
      {...rest}
    />
  );
}

function AvatarFallback(
  props: ComponentProps<typeof AvatarPrimitive.Fallback>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      class={cn(
        "flex size-full items-center justify-center rounded-full bg-foreground/8 text-sm font-medium text-foreground",
        "group-data-[size=sm]/avatar:text-xs",
        "group-data-[size=lg]/avatar:text-base",
        local.class,
      )}
      {...rest}
    />
  );
}

function AvatarBadge(props: ComponentProps<"span">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <span
      data-slot="avatar-badge"
      class={cn(
        "absolute right-0 bottom-0 z-10 flex items-center justify-center rounded-full ring-2 ring-background",
        // default sizing — override color via class
        "size-2.5 bg-success",
        "group-data-[size=sm]/avatar:size-2",
        "group-data-[size=lg]/avatar:size-3",
        // icon sizing (for badge-with-icon pattern)
        "[&_svg]:size-1.5 group-data-[size=lg]/avatar:[&_svg]:size-2 group-data-[size=sm]/avatar:[&_svg]:hidden",
        local.class,
      )}
      {...rest}
    />
  );
}

function AvatarGroup(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="avatar-group"
      class={cn(
        "group/avatar-group flex -space-x-2",
        "*:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        "*:data-[slot=avatar-group-count]:ring-2 *:data-[slot=avatar-group-count]:ring-background",
        local.class,
      )}
      {...rest}
    />
  );
}

function AvatarGroupCount(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="avatar-group-count"
      class={cn(
        "relative flex shrink-0 items-center justify-center rounded-full select-none",
        "bg-foreground/8 text-sm font-medium text-foreground",
        // match sibling avatar size
        "size-8 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6",
        "group-has-data-[size=lg]/avatar-group:text-base group-has-data-[size=sm]/avatar-group:text-xs",
        "[&_svg]:size-4 group-has-data-[size=lg]/avatar-group:[&_svg]:size-5 group-has-data-[size=sm]/avatar-group:[&_svg]:size-3",
        local.class,
      )}
      {...rest}
    />
  );
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
};
