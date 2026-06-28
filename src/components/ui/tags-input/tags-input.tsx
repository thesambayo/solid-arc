/**
 * TagsInput — Ark UI's tags machine + our dashboard styling.
 *
 * Two API shapes (same pattern as Pagination / DatePicker):
 *
 *   1) Convenience one-liner — most usages will be this:
 *
 *      <TagsInput
 *        label="Tags"
 *        placeholder="Add a tag..."
 *        value={tags()}
 *        onValueChange={(d) => setTags(d.value)}
 *      />
 *
 *   2) Compound parts — when you need to customize the chip layout,
 *      compose with Combobox for autocomplete, or render a custom delete
 *      trigger per tag:
 *
 *      <TagsInputRoot value={tags()} onValueChange={(d) => setTags(d.value)}>
 *        <TagsInputLabel>Tags</TagsInputLabel>
 *        <TagsInputControl>
 *          <TagsInputContext>
 *            {(api) => (
 *              <Index each={api().value}>
 *                {(value, index) => (
 *                  <TagsInputItem index={index} value={value()}>
 *                    <TagsInputItemPreview>
 *                      <TagsInputItemText>{value()}</TagsInputItemText>
 *                      <TagsInputItemDeleteTrigger><XIcon /></TagsInputItemDeleteTrigger>
 *                    </TagsInputItemPreview>
 *                    <TagsInputItemInput />
 *                  </TagsInputItem>
 *                )}
 *              </Index>
 *            )}
 *          </TagsInputContext>
 *          <TagsInputInput placeholder="Add tag..." />
 *        </TagsInputControl>
 *        <TagsInputHiddenInput />
 *      </TagsInputRoot>
 *
 * The HiddenInput is what makes native HTML forms work — when `name=` is set
 * on Root, the tags get submitted as repeated form values under that name.
 */
import { TagsInput as TagsInputPrimitive } from "@ark-ui/solid/tags-input";
import { XIcon } from "lucide-solid";
import {
  type ComponentProps,
  type JSX,
  Index,
  Show,
  splitProps,
} from "solid-js";

import { cn } from "../../../lib/cn";

// ─── Root ─────────────────────────────────────────────────────────────────────

function TagsInputRoot(props: ComponentProps<typeof TagsInputPrimitive.Root>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <TagsInputPrimitive.Root
      data-slot="tags-input"
      class={cn("group/tags-input flex flex-col gap-1.5", local.class)}
      {...rest}
    />
  );
}

// ─── Label ────────────────────────────────────────────────────────────────────

function TagsInputLabel(
  props: ComponentProps<typeof TagsInputPrimitive.Label>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <TagsInputPrimitive.Label
      data-slot="tags-input-label"
      class={cn(
        "text-sm font-medium text-foreground",
        "data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Control (the input-shaped container that holds tags + input) ─────────────

function TagsInputControl(
  props: ComponentProps<typeof TagsInputPrimitive.Control>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <TagsInputPrimitive.Control
      data-slot="tags-input-control"
      class={cn(
        // Looks like our Input — same border, bg, radius, focus ring
        "flex w-full min-w-0 flex-wrap items-center gap-1.5 rounded-md border border-border bg-popover px-2 py-1.5 text-sm",
        // Focus state mirrors aria-focus on the container — Ark sets data-focus on Control
        "transition-colors",
        "data-focus:border-ring data-focus:ring-3 data-focus:ring-ring/20",
        "data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Item (one tag chip) ──────────────────────────────────────────────────────

function TagsInputItem(props: ComponentProps<typeof TagsInputPrimitive.Item>) {
  return <TagsInputPrimitive.Item {...props} />;
}

// ItemPreview is what's *visible* when not editing. ItemInput sits in the same
// slot and only shows up in edit mode (Ark swaps them automatically).
function TagsInputItemPreview(
  props: ComponentProps<typeof TagsInputPrimitive.ItemPreview>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <TagsInputPrimitive.ItemPreview
      data-slot="tags-input-item-preview"
      class={cn(
        // Pill — matches Badge "secondary" vibe
        "inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-foreground",
        // Highlighted = keyboard-navigated to this tag (Ark sets data-highlighted)
        "data-highlighted:border-foreground data-highlighted:bg-foreground data-highlighted:text-background",
        "data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
}

function TagsInputItemText(
  props: ComponentProps<typeof TagsInputPrimitive.ItemText>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <TagsInputPrimitive.ItemText
      data-slot="tags-input-item-text"
      class={cn("max-w-50 truncate", local.class)}
      {...rest}
    />
  );
}

function TagsInputItemDeleteTrigger(
  props: ComponentProps<typeof TagsInputPrimitive.ItemDeleteTrigger>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <TagsInputPrimitive.ItemDeleteTrigger
      data-slot="tags-input-item-delete"
      class={cn(
        "inline-flex size-3.5 shrink-0 items-center justify-center rounded-sm opacity-70",
        "transition-opacity hover:opacity-100",
        "focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none",
        "[&_svg]:size-3",
        local.class,
      )}
      {...rest}
    >
      {local.children ?? <XIcon />}
    </TagsInputPrimitive.ItemDeleteTrigger>
  );
}

// ItemInput is the inline-edit input that swaps in when a tag is being edited.
function TagsInputItemInput(
  props: ComponentProps<typeof TagsInputPrimitive.ItemInput>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <TagsInputPrimitive.ItemInput
      data-slot="tags-input-item-input"
      class={cn(
        "rounded-md border border-ring bg-popover px-2 py-0.5 text-xs text-foreground outline-none",
        "ring-3 ring-ring/20",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Input (the typing-area at the end) ───────────────────────────────────────

function TagsInputInput(
  props: ComponentProps<typeof TagsInputPrimitive.Input>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <TagsInputPrimitive.Input
      data-slot="tags-input-input"
      class={cn(
        // Borderless — the Control is the "input" visually
        "min-w-[8ch] flex-1 bg-transparent text-sm text-foreground outline-none",
        "placeholder:text-muted-foreground",
        // Don't let the inner input fight the container's focus ring
        "focus:outline-none",
        local.class,
      )}
      {...rest}
    />
  );
}

// ─── Clear trigger ────────────────────────────────────────────────────────────

function TagsInputClearTrigger(
  props: ComponentProps<typeof TagsInputPrimitive.ClearTrigger>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <TagsInputPrimitive.ClearTrigger
      data-slot="tags-input-clear"
      aria-label="Clear all tags"
      class={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground",
        "transition-colors hover:bg-muted hover:text-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none",
        "[&_svg]:size-3.5",
        local.class,
      )}
      {...rest}
    >
      {local.children ?? <XIcon />}
    </TagsInputPrimitive.ClearTrigger>
  );
}

// ─── HiddenInput (for native form submission) ─────────────────────────────────

const TagsInputHiddenInput = TagsInputPrimitive.HiddenInput;

// ─── Context passthrough ──────────────────────────────────────────────────────

const TagsInputContext = TagsInputPrimitive.Context;

// ─── Convenience all-in-one ───────────────────────────────────────────────────

interface TagsInputProps extends ComponentProps<
  typeof TagsInputPrimitive.Root
> {
  /** Label rendered above the control. */
  label?: JSX.Element;
  /** Placeholder for the typing area. */
  placeholder?: string;
  /**
   * Whether to show the "clear all" button when there are tags.
   * @default false
   */
  showClear?: boolean;
  /**
   * Render the tag preview's text yourself — useful for badge styling, icons,
   * or computed display values. Receives the tag's string value.
   */
  renderTag?: (value: string, index: number) => JSX.Element;
}

function TagsInput(props: TagsInputProps) {
  const [local, rest] = splitProps(props, [
    "label",
    "placeholder",
    "showClear",
    "renderTag",
  ]);
  return (
    <TagsInputRoot {...rest}>
      <Show when={local.label}>
        <TagsInputLabel>{local.label}</TagsInputLabel>
      </Show>
      <TagsInputControl>
        <TagsInputContext>
          {(api) => (
            <>
              <Index each={api().value}>
                {(value, index) => (
                  <TagsInputItem index={index} value={value()}>
                    <TagsInputItemPreview>
                      {local.renderTag ? (
                        local.renderTag(value(), index)
                      ) : (
                        <TagsInputItemText>{value()}</TagsInputItemText>
                      )}
                      <TagsInputItemDeleteTrigger />
                    </TagsInputItemPreview>
                    <TagsInputItemInput />
                  </TagsInputItem>
                )}
              </Index>
              <TagsInputInput
                placeholder={local.placeholder ?? "Add a tag..."}
              />
              <Show when={local.showClear && api().value.length > 0}>
                <TagsInputClearTrigger />
              </Show>
            </>
          )}
        </TagsInputContext>
      </TagsInputControl>
      <TagsInputHiddenInput />
    </TagsInputRoot>
  );
}

export {
  TagsInput,
  TagsInputRoot,
  TagsInputLabel,
  TagsInputControl,
  TagsInputItem,
  TagsInputItemPreview,
  TagsInputItemText,
  TagsInputItemDeleteTrigger,
  TagsInputItemInput,
  TagsInputInput,
  TagsInputClearTrigger,
  TagsInputHiddenInput,
  TagsInputContext,
};
