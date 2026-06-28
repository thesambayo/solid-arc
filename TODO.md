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
- [ ] Progress
- [ ] Skeleton
- [ ] Collapsible
- [ ] Breadcrumb
- [ ] Carousel
- [ ] Menubar
- [ ] Navigation Menu
- [ ] Resizable / Splitter
- [ ] Scroll Area
- [ ] Number Input / Pin Input / Editable / Rating / Color Picker / Tree View
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
- [ ] **`data-slot` missing** on a few components while the rest follow the
      shadcn `data-slot` convention: `button`, `spinner`, `toast`
      (and `separator`, which is empty).
- [ ] **No `ui/index.ts` barrel.** Every import is by full path
      (`~/components/ui/button`). A barrel (or per-component barrels only) is a
      DX choice worth making explicit — and matters for the distribution plan.
- [x] **Empty `ui/separator/` directory** — now implemented.

### Docs / hygiene
- [ ] **README is the Solid-CLI stub.** Replace with real intro, stack
      (TanStack Router/Form, Tailwind v4, Ark UI), dev (`port 9500`), and a
      pointer to the `/previews` gallery.

### Verified OK (not issues)
- Interactive components (dropdown-menu, combobox, command, popover, select,
  tooltip) style focus/active via Ark `data-highlighted` / `data-state`, not
  `focus-visible` — this is correct, not a gap.
- No `any` / `as any`, no stray `TODO`/`FIXME` in `ui/`.
- Icon-only triggers that need labels use `sr-only` (dialog, sheet, command,
  pagination, toaster).
