# CademyOS ERP Demo

Lightweight **Vite + React + TypeScript + Tailwind** SPA demo for CademyOS — Student, Teacher, Parent, and Admin portals with shared `localStorage` state. No backend.

## Quick start

```bash
npm install
npm run dev
```

## Build for GitHub Pages

```bash
npm run build
```

Output is in `dist/`. Config already uses:

- `base: './'` in `vite.config.ts`
- `HashRouter` for deep links without server rewrites
- `public/.nojekyll`

### Deploy

1. Push this repo to GitHub.
2. Settings → Pages → Deploy from a branch, **or** use a workflow that publishes `dist/`.
3. For project sites, open `https://<user>.github.io/<repo>/#/` after deploy.

Optional one-liner with [gh-pages](https://www.npmjs.com/package/gh-pages) after build:

```bash
npx gh-pages -d dist
```

## Demo tips

- Use **Experience as** pills or the glass nav portals.
- **Reset Demo** restores seed data.
- Admin **Toggle Due/Paid** and Student/Parent **Pay** share the same Zustand store (`cademyos-demo` in localStorage).
- Theme toggle is a visual placeholder (dark UI only).

## Brand assets

- `public/assets/logo.png`
- `public/assets/hero.jpg`

Legacy HTTrack / vanilla mirror files live under `_archive/` and are not part of the app build.
