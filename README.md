# Solid Foundation

A shadcn-style component library for **SolidJS + Ark UI**. Beautifully designed,
accessible components you copy into your app and own outright — open code, no
black boxes. Built on [Ark UI](https://ark-ui.com) headless primitives and
styled with Tailwind v4 tokens in shadcn's vocabulary, so the whole system
restyles from one file.

## Stack

- **[SolidJS](https://solidjs.com)** — fine-grained reactivity, no virtual DOM
- **[Ark UI](https://ark-ui.com)** — accessible headless primitives (keyboard + ARIA)
- **[Tailwind CSS v4](https://tailwindcss.com)** — token-based theming via `@tailwindcss/vite`
- **[TanStack Router](https://tanstack.com/router)** — type-safe, file-based routing
- **[TanStack Form](https://tanstack.com/form)** — headless form state
- **[CVA](https://cva.style)** — variant management
- **[lucide-solid](https://lucide.dev)** — icons

## Getting started

```bash
npm install
npm run dev      # Vite dev server on http://localhost:9500
```

Other scripts:

| Script              | What it does                          |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Dev server (port 9500)                |
| `npm run build`     | Production build + `tsc --noEmit`     |
| `npm run serve`     | Preview the production build          |
| `npm run lint`      | `oxlint`                              |
| `npm run fmt`       | `oxfmt`                               |

## Component gallery

Every component has a live preview. Run the dev server and open
[`/previews`](http://localhost:9500/previews) — the sidebar lists all of them,
each route is a working demo of every variant.

## Project layout

```
src/
├── components/ui/<name>/   # the component layer — one folder per component
│   ├── <name>.tsx          #   implementation (cva variants, data-slot, etc.)
│   └── index.ts            #   barrel export
├── routes/
│   ├── index.tsx           # landing page
│   └── previews/           # one route per component — the live gallery
├── styles/                 # Tailwind v4 + design tokens (styles.css, foundation.css)
└── lib/cn.ts               # className merge helper
```

## Conventions

- Each component lives in `src/components/ui/<name>/` and re-exports from `index.ts`.
- Parts carry a `data-slot="<name>"` attribute for styling hooks and testing.
- Props are split with `splitProps`; `class` always merges last via `cn`.
- Variants use CVA; polymorphism uses Ark's `asChild` render-prop pattern.
- Custom Tailwind variants (`data-open`, `data-horizontal`, …) live in
  `src/styles/foundation.css`.

## Notes

- **Dev runs on port 9500** (`server.port` in `vite.config.js`).
- `autoCodeSplitting` is enabled only for production builds — leaving it on in
  dev breaks Solid HMR (route components get extracted into split chunks that
  aren't refresh boundaries).
