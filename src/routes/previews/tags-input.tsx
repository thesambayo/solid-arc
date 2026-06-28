import { createFileRoute } from "@tanstack/solid-router";
import { GlobeIcon, HashIcon, MailIcon, TagIcon } from "lucide-solid";
import { createSignal, Index, Show, type JSX } from "solid-js";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
  TagsInput,
  TagsInputClearTrigger,
  TagsInputContext,
  TagsInputControl,
  TagsInputHiddenInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDeleteTrigger,
  TagsInputItemInput,
  TagsInputItemPreview,
  TagsInputItemText,
  TagsInputLabel,
  TagsInputRoot,
} from "../../components/ui/tags-input";

export const Route = createFileRoute("/previews/tags-input")({
  component: RouteComponent,
});

function Section(props: {
  title: string;
  description?: string;
  children: JSX.Element;
}) {
  return (
    <section class="flex flex-col gap-3">
      <div class="flex flex-col gap-1">
        <h2 class="text-sm font-medium text-foreground">{props.title}</h2>
        {props.description && (
          <p class="text-xs text-muted-foreground">{props.description}</p>
        )}
      </div>
      <div class="flex flex-col items-start gap-3">{props.children}</div>
    </section>
  );
}

function RouteComponent() {
  // Controlled example
  const [tags, setTags] = createSignal<string[]>(["solid", "ark-ui"]);

  // Form submission demo
  const [submitted, setSubmitted] = createSignal<string | null>(null);

  // Programmatic / external control demo
  const [externalTags, setExternalTags] = createSignal<string[]>(["initial"]);

  return (
    <div class="flex max-w-3xl flex-col gap-10 p-8">
      <header class="flex flex-col gap-1">
        <h1 class="text-lg font-semibold">Tags Input</h1>
        <p class="text-sm text-muted-foreground">
          Multi-value text input. Type + Enter to add, click × or press
          Backspace to remove. Tags are stored as{" "}
          <code class="rounded bg-muted px-1.5 py-0.5 text-xs">string[]</code>.
        </p>
      </header>

      {/* ─── Basic ────────────────────────────────────────────────────── */}
      <Section
        title="Basic"
        description="Convenience wrapper — label, control, and delete trigger built-in."
      >
        <TagsInput
          label="Tags"
          placeholder="Add a tag..."
          class="w-full max-w-md"
        />
      </Section>

      {/* ─── Default value ────────────────────────────────────────────── */}
      <Section
        title="Default value"
        description="Pre-populate via defaultValue."
      >
        <TagsInput
          label="Frameworks"
          defaultValue={["solid", "react", "vue"]}
          class="w-full max-w-md"
        />
      </Section>

      {/* ─── Controlled ───────────────────────────────────────────────── */}
      <Section title="Controlled" description="Drive the value from a signal.">
        <TagsInput
          label="Controlled"
          value={tags()}
          onValueChange={(d) => setTags(d.value)}
          showClear
          class="w-full max-w-md"
        />
        <div class="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setTags([...tags(), `tag-${tags().length + 1}`])}
          >
            Add from outside
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setTags([])}>
            Reset
          </Button>
        </div>
        <p class="text-xs text-muted-foreground">
          Current value:{" "}
          <code class="rounded bg-muted px-1.5 py-0.5">
            {JSON.stringify(tags())}
          </code>
        </p>
      </Section>

      {/* ─── Delimiters ───────────────────────────────────────────────── */}
      <Section
        title="Custom delimiters"
        description="Pass a regex to delimiter — commit a tag on comma, semicolon, or space (in addition to Enter)."
      >
        <TagsInput
          label="Tags (use , ; or space to commit)"
          delimiter={/[,;\s]/}
          placeholder="type then comma..."
          class="w-full max-w-md"
        />
      </Section>

      {/* ─── Paste behavior ───────────────────────────────────────────── */}
      <Section
        title="Paste behavior"
        description={
          "addOnPaste + delimiter lets users paste 'red, green, blue' and get three tags. Try copying 'foo,bar,baz' and pasting in."
        }
      >
        <TagsInput
          label="Bulk paste"
          addOnPaste
          delimiter=","
          placeholder="paste comma-separated values..."
          class="w-full max-w-md"
        />
      </Section>

      {/* ─── Max tags ─────────────────────────────────────────────────── */}
      <Section
        title="Max tags"
        description="max={3} stops adding past the limit. Pair with allowOverflow to let the user temporarily exceed and show an invalid state."
      >
        <TagsInput
          label="Max 3 tags"
          max={3}
          placeholder="Up to 3 tags..."
          class="w-full max-w-md"
        />
        <TagsInput
          label="Max 3 + allowOverflow (data-invalid when over)"
          max={3}
          allowOverflow
          defaultValue={["one", "two", "three", "four"]}
          class="w-full max-w-md"
        />
      </Section>

      {/* ─── Max length ───────────────────────────────────────────────── */}
      <Section
        title="Max tag length"
        description="maxLength caps the length of any single tag."
      >
        <TagsInput
          label="Up to 8 characters per tag"
          maxLength={8}
          placeholder="short tags only..."
          class="w-full max-w-md"
        />
      </Section>

      {/* ─── Validate (dedupe + pattern) ──────────────────────────────── */}
      <Section
        title="Validation"
        description="validate runs before a tag is added. Block duplicates, require min length, enforce a pattern."
      >
        <TagsInput
          label="Lowercase alphanumeric, no duplicates, min 2 chars"
          validate={({ value, inputValue }) => {
            const v = inputValue.trim();
            if (v.length < 2) return false;
            if (!/^[a-z0-9-]+$/.test(v)) return false;
            if (value.includes(v)) return false;
            return true;
          }}
          placeholder="try 'abc', then again..."
          class="w-full max-w-md"
        />
      </Section>

      {/* ─── Sanitize value ───────────────────────────────────────────── */}
      <Section
        title="Sanitize value"
        description="Normalize tags before they land — trim whitespace, lowercase, strip protocols, whatever you need."
      >
        <TagsInput
          label="Emails (auto-lowercased and trimmed)"
          sanitizeValue={(value) => value.trim().toLowerCase()}
          placeholder="   USER@Example.COM   "
          class="w-full max-w-md"
        />
      </Section>

      {/* ─── Blur behavior ────────────────────────────────────────────── */}
      <Section
        title="Blur behavior"
        description={
          "blurBehavior='add' commits the typed value when the input loses focus. 'clear' throws it away. Default does nothing."
        }
      >
        <TagsInput
          label="Commits on blur"
          blurBehavior="add"
          placeholder="type then click outside..."
          class="w-full max-w-md"
        />
      </Section>

      {/* ─── Disabled ─────────────────────────────────────────────────── */}
      <Section title="Disabled">
        <TagsInput
          label="Disabled"
          defaultValue={["read", "only", "view"]}
          disabled
          class="w-full max-w-md"
        />
      </Section>

      {/* ─── Read-only ────────────────────────────────────────────────── */}
      <Section
        title="Read-only"
        description="Tags are visible but can't be added, removed, or edited."
      >
        <TagsInput
          label="Read-only"
          defaultValue={["api", "auth", "billing"]}
          readOnly
          class="w-full max-w-md"
        />
      </Section>

      {/* ─── Editable (default) vs not ────────────────────────────────── */}
      <Section
        title="Edit on double-click"
        description={
          "By default, double-clicking a tag (or focusing + Enter) puts it in edit mode. editable={false} disables that."
        }
      >
        <TagsInput
          label="Editable (try double-clicking)"
          defaultValue={["edit-me", "or-me"]}
          class="w-full max-w-md"
        />
        <TagsInput
          label="Not editable"
          defaultValue={["locked", "in"]}
          editable={false}
          class="w-full max-w-md"
        />
      </Section>

      {/* ─── Invalid state ────────────────────────────────────────────── */}
      <Section
        title="Invalid state"
        description="The invalid prop adds the destructive border + ring."
      >
        <TagsInput
          label="Invalid"
          invalid
          defaultValue={["check", "the", "border"]}
          class="w-full max-w-md"
        />
      </Section>

      {/* ─── Custom tag rendering ─────────────────────────────────────── */}
      <Section
        title="Custom tag rendering"
        description="renderTag lets you decorate each chip — icons, computed labels, badges."
      >
        <TagsInput
          label="Email recipients"
          defaultValue={["alice@argus.dev", "bob@argus.dev"]}
          placeholder="add email..."
          class="w-full max-w-md"
          renderTag={(value) => (
            <span class="inline-flex items-center gap-1.5">
              <MailIcon class="size-3" />
              {value}
            </span>
          )}
        />
        <TagsInput
          label="Topics"
          defaultValue={["go", "solidjs", "uptime"]}
          placeholder="add topic..."
          class="w-full max-w-md"
          renderTag={(value) => (
            <span class="inline-flex items-center gap-1">
              <HashIcon class="size-3 opacity-70" />
              {value}
            </span>
          )}
        />
      </Section>

      {/* ─── Compound (full custom layout) ────────────────────────────── */}
      <Section
        title="Compound parts (full custom)"
        description="Skip the convenience wrapper when you need different chip styling, layout, or to compose with other primitives."
      >
        <TagsInputRoot
          defaultValue={["us-east-1", "eu-west-1"]}
          class="w-full max-w-md"
        >
          <TagsInputLabel>AWS regions</TagsInputLabel>
          <TagsInputControl>
            <TagsInputContext>
              {(api) => (
                <>
                  <Index each={api().value}>
                    {(value, index) => (
                      <TagsInputItem index={index} value={value()}>
                        <TagsInputItemPreview class="border-success-border bg-success-subtle text-success">
                          <GlobeIcon class="size-3" />
                          <TagsInputItemText>{value()}</TagsInputItemText>
                          <TagsInputItemDeleteTrigger />
                        </TagsInputItemPreview>
                        <TagsInputItemInput />
                      </TagsInputItem>
                    )}
                  </Index>
                  <TagsInputInput placeholder="add region..." />
                  <Show when={api().value.length > 0}>
                    <TagsInputClearTrigger />
                  </Show>
                </>
              )}
            </TagsInputContext>
          </TagsInputControl>
          <TagsInputHiddenInput />
        </TagsInputRoot>
      </Section>

      {/* ─── External / programmatic control ──────────────────────────── */}
      <Section
        title="External buttons"
        description="The value is just a signal — drive it from anywhere. No need for useTagsInput / RootProvider for simple cases."
      >
        <TagsInput
          label="Recipients"
          value={externalTags()}
          onValueChange={(d) => setExternalTags(d.value)}
          placeholder="add manually too..."
          class="w-full max-w-md"
        />
        <div class="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setExternalTags([...externalTags(), "alice"])}
          >
            Add "alice"
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setExternalTags([...externalTags(), "bob"])}
          >
            Add "bob"
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setExternalTags(["everyone"])}
          >
            Replace
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setExternalTags([])}>
            Clear
          </Button>
        </div>
      </Section>

      {/* ─── Argus-ish use case ───────────────────────────────────────── */}
      <Section
        title="In a card (Argus monitor tags)"
        description="What this'd look like dropped into a 'Monitor settings' panel."
      >
        <Card class="w-full max-w-md gap-4 p-4">
          <div class="flex flex-col gap-1">
            <p class="text-sm font-medium">Monitor labels</p>
            <p class="text-xs text-muted-foreground">
              Used for filtering and grouping on the dashboard.
            </p>
          </div>
          <TagsInput
            defaultValue={["production", "api"]}
            placeholder="add label..."
            delimiter={/[,\s]/}
            sanitizeValue={(v) => v.trim().toLowerCase()}
            validate={({ value, inputValue }) =>
              inputValue.length >= 2 && !value.includes(inputValue)
            }
            renderTag={(value) => (
              <span class="inline-flex items-center gap-1">
                <TagIcon class="size-3 opacity-70" />
                {value}
              </span>
            )}
          />
          <Button size="sm" class="self-start">
            Save labels
          </Button>
        </Card>
      </Section>

      {/* ─── Native form submission ───────────────────────────────────── */}
      <Section
        title="Native form"
        description="Pass name= on Root and the HiddenInput emits each tag as a repeated form value — submit handlers see formData.getAll('tags')."
      >
        <form
          class="flex flex-col items-start gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const all = data.getAll("topics");
            setSubmitted(JSON.stringify(all));
          }}
        >
          <TagsInput
            label="Topics"
            name="topics"
            defaultValue={["go", "solid"]}
            class="w-full max-w-md"
          />
          <Button type="submit" size="sm">
            Submit
          </Button>
          <Show when={submitted() !== null}>
            <p class="text-xs text-muted-foreground">
              FormData.getAll("topics") ={" "}
              <code class="rounded bg-muted px-1.5 py-0.5">{submitted()}</code>
            </p>
          </Show>
        </form>
      </Section>
    </div>
  );
}
