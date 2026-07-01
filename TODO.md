# TODO

A shadcn-style component library for **SolidJS + Ark UI**. The component layer
lives in `src/components/ui/<name>/`. This file tracks what's next.

---

## 🅿️ Parked (not now)

### Make it distributable
Turn the `ui/` folder into an installable registry like shadcn — so components
can be pulled into other projects instead of living only inside this app.
- [ ] `components.json` (style, aliases, tailwind config, icon library)
- [ ] `registry.json` + per-component registry entries (files + dependencies)
- [ ] Resolve internal imports (`~/lib/cn`, cross-component deps) to registry refs
- [ ] `add` flow — shadcn CLI registry support, or a small custom `add` script
- [ ] Publish registry (static JSON host) + install docs

### Missing components
Ark UI primitives / common shadcn components not yet ported.
- [x] Separator  *(implemented — component, preview, sidebar entry)*
- [x] Attachment  *(implemented — media/content/actions/trigger/group, states, preview)*
- [x] Progress  *(implemented — root/label/value-text/track/range, h+v orientation, indeterminate; preview, sidebar entry. Later extended with circle/circle-track/circle-range for the circular variant — see Ring. Indeterminate now actually animates (sliding shimmer / traveling arc) instead of rendering a static shape — Ark clears width/dasharray when value=null and expects consumer CSS for the `[data-state=indeterminate]` visual, per its styling guide. Also fixed a double-rotation bug: `ProgressCircle` no longer applies its own `-rotate-90` since Ark's `CircleRange` already rotates -90deg internally (zag-js v1.41.2) — the extra rotation was putting the arc start at 6 o'clock instead of 12)*
- [x] Ring  *(user-contributed, ported from an app, then redesigned for correctness — circular gauge composing the Progress circle primitives. Now extends Ark `Progress.Root` props verbatim (no more custom `value: number|null` that shadowed Ark and broke indeterminate); adds only `size`/`stroke`/`label`/`tone`. Indeterminate is `defaultValue={null}` (a controlled `value={null}` is ambiguous → Ark falls back to default = determinate). Uptime threshold coloring moved out of the library into an app helper in the preview — lib provides the `tone` mechanism, app owns the policy. own `ui/ring/` folder; preview, sidebar entry)*
- [ ] Skeleton
- [x] Collapsible  *(implemented — root/trigger/indicator/content, height + partial-collapse animation, rotating indicator, disabled/nested/controlled; preview, sidebar entry)*
- [x] Bubble  *(new shadcn component — presentational; root/content/reactions/group, 7 variants, start/end align, asChild link/button content, reactions side/align, collapsible compose; preview, sidebar entry)*
- [x] Marker  *(new shadcn component — presentational; root/icon/content, default/border/separator variants, asChild link/button root, role=status; preview, sidebar entry. Shimmer example skipped — utility not in repo)*
- [x] Message  *(new shadcn component — presentational row layout; group/avatar/content/header/footer, start/end align, avatar footer-shift, ghost px-0; composes Avatar+Bubble+Marker; preview, sidebar entry. Also added `group-data-[align=end]/message:self-end` to Bubble)*
- [ ] **MessageScroller — parked (big: it's a scroll-behavior engine, not a
      styling port).** Unlike Bubble/Marker/Message, its value is the headless
      logic in shadcn's `@shadcn/react/message-scroller` package — there is **no
      Ark/Solid primitive**, so it'd be a from-scratch reimplementation of the
      scroll state machine in SolidJS (~300–500 lines). Parts to build:
      `MessageScrollerProvider` (state owner) + `MessageScroller` (frame) +
      `Viewport` + `Content` + `Item` (with `messageId` + `scrollAnchor`) +
      `Button`, plus hooks `useMessageScroller` (scrollToEnd/Start/Message),
      `useMessageScrollerVisibility` (currentAnchorId/visibleMessageIds),
      `useMessageScrollerScrollable` (start/end edges). Behaviors: follow live
      edge only while at it, release on any interaction, anchor new turn near
      top with `scrollPreviousItemPeek`, `defaultScrollPosition="last-anchor"`,
      `preserveScrollOnPrepend` (the fiddly one), `data-autoscrolling`,
      `content-visibility:auto` rows. Composes the Message component as rows.
      **Decide scope when picking up:** core-behavior MVP vs full fidelity.
- [x] Breadcrumb  *(implemented — root/list/item/link/page/separator/ellipsis, asChild polymorphic link (router Link compatible), custom separator, dropdown + collapsed-ellipsis compose with DropdownMenu; preview, sidebar entry)*
- [ ] Carousel
- [ ] Menubar
- [ ] Navigation Menu
- [ ] Resizable / Splitter
- [ ] Scroll Area
- [x] Pin Input  *(implemented on Ark's PinInput — root/label/control/input/hidden-input/separator; numeric/alphanumeric/mask/otp/disabled/invalid/controlled; individually-boxed gapped slots (not shadcn's input-otp connected look — that lib is React-only); re-exports usePinInput/RootProvider; preview, sidebar entry)*
- [ ] Number Input / Editable / Rating / Color Picker / Tree View
      *(Ark has primitives; decide which are in scope)*

---

## 🔎 Polish & audit (current focus)

Findings from a pass over the 34 components in `src/components/ui/`.
Evidence noted per item; nothing here is fixed yet.

### Dark mode — the big gap
- [ ] **No dark theme tokens.** `src/styles/styles.css` defines only `:root`
      (light) values for `--background`, `--foreground`, `--border`, etc. There
      is **no `.dark { … }` override**, and **zero `dark:` utilities** anywhere
      in `ui/`. Despite using shadcn's token vocabulary, the library is
      effectively light-only. Decide: `.dark` class strategy vs
      `prefers-color-scheme`, then add the full token set.
- [ ] **Hardcoded overlay/border colors** won't adapt to a theme:
      `bg-black/20` backdrops in `dialog.tsx:38`, `sheet.tsx:111`,
      `command.tsx:580`; `border-black/8` in `avatar.tsx:19`.
      Tokenize (e.g. `bg-overlay`, `border-border`).

### Consistency
- [x] **`data-slot`** added to `button` and `spinner`. (`toast` already had it
      on every part in `toaster.tsx`; the `toast.ts` singleton has no DOM.)
- [ ] **No `ui/index.ts` barrel.** Every import is by full path
      (`~/components/ui/button`). A barrel (or per-component barrels only) is a
      DX choice worth making explicit — and matters for the distribution plan.
- [x] **Empty `ui/separator/` directory** — now implemented.
- [ ] **Combobox `resetFilterOnOpen` — promote to module export?** After a
      value is selected the input holds its label and the collection stays
      filtered to it, so reopening shows only that one item. Fix is to reset the
      filter when the popup opens via click (`input-click`/`trigger-click`, not
      `input-change`). Currently a per-preview helper in
      `routes/previews/combobox.tsx`. Can't live in the `Combobox` wrapper (it
      doesn't own the collection/`filter`). **Decide:** export
      `resetFilterOnOpen(filter)` from `ui/combobox` for consumers to wire as
      `onOpenChange={resetFilterOnOpen(filter)}`, or leave as a documented
      pattern.

### Docs / hygiene
- [x] **README** rewritten — real intro, stack, scripts, dev (`port 9500`),
      `/previews` pointer, layout + conventions.

### Verified OK (not issues)
- Interactive components (dropdown-menu, combobox, command, popover, select,
  tooltip) style focus/active via Ark `data-highlighted` / `data-state`, not
  `focus-visible` — this is correct, not a gap.
- No `any` / `as any`, no stray `TODO`/`FIXME` in `ui/`.
- Icon-only triggers that need labels use `sr-only` (dialog, sheet, command,
  pagination, toaster).
