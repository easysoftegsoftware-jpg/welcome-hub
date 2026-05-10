# Switch template to Vite + React (CRA-compatible)

Goal: make the Lovable preview run your existing admin dashboard (`src/App.js`, `src/pages/*`, react-router-dom v7, Bootstrap RTL) with as few code changes as possible.

## What changes

1. **Remove TanStack Start scaffolding**
   - Delete: `src/router.tsx`, `src/routes/` (entire folder including `__root.tsx`, `index.tsx`, generated `routeTree.gen.ts`), `src/server.ts`, `src/styles.css`, `src/components/landing/`, `wrangler.jsonc`, `.lovable/plan.md`.
   - Remove TanStack/Cloudflare/Tailwind packages from `package.json`: `@tanstack/*`, `@cloudflare/*`, `@lovable.dev/vite-tanstack-config`, `tailwindcss`, `@tailwindcss/vite`, `framer-motion`, shadcn deps that aren't used by your code.

2. **Set up Vite + React (replacing react-scripts)**
   - New `vite.config.ts` with `@vitejs/plugin-react`, dev server on the sandbox host/port that Lovable's preview expects (port 8080, host `::`, strictPort).
   - New `index.html` at project root that mounts `<div id="root">` and loads `/src/index.js`.
   - Keep `src/index.js` and `src/App.js` exactly as they are.
   - Update `package.json` scripts: `dev`/`build`/`preview` using vite. Keep React 19, react-router-dom 7, axios, bootstrap, bootstrap-icons.

3. **Keep your code untouched**
   - `src/App.js`, all `src/pages/**`, `src/components/**`, `src/*.css`, `src/rest_api.js`, etc. stay as-is.
   - Bootstrap RTL CSS and bootstrap-icons imports continue to work.

4. **Note about your API**
   - Your code calls `http://localhost:1150/api/...`. That host is your local machine — it won't be reachable from the Lovable preview sandbox. The UI will load, but API calls will fail until you either (a) expose your API publicly, or (b) point the frontend to a deployed backend. This isn't blocking the preview from rendering; just flagging it.

## Technical details

- `vite.config.ts`:
  ```ts
  import { defineConfig } from "vite";
  import react from "@vitejs/plugin-react";
  export default defineConfig({
    plugins: [react()],
    server: { host: "::", port: 8080, strictPort: true },
    preview: { host: "::", port: 8080, strictPort: true },
  });
  ```
- `index.html` includes `<script type="module" src="/src/index.js"></script>`.
- `package.json` scripts: `"dev": "vite"`, `"build": "vite build"`, `"preview": "vite preview"`.
- Routing: your existing `BrowserRouter` in `App.js` works on the preview (refresh/deep-link fallback handled by Vite dev middleware; for published builds we'll rely on the same SPA fallback).

## Out of scope
- No changes to your business logic, pages, or styles.
- Not enabling Lovable Cloud / TanStack server functions / SSR.
- Not migrating to Tailwind or shadcn.

After you approve, I'll implement and verify the preview boots into your sign-in screen.
