# CademyOS ERP Demo

Lightweight **Vite + React + TypeScript + Tailwind** SPA demo for CademyOS — Student, Teacher, Parent, and Admin portals with shared `localStorage` state. No backend.

## Quick start

```bash
npm install
npm run dev
```

Open the local URL (usually `http://localhost:5173/`).

## Why GitHub looked blank

GitHub serves `index.html` as static files. The source file points at `/src/main.tsx`, which **only works with `npm run dev`**. Visitors need the **built** app from `dist/` (deployed via GitHub Pages).

## GitHub Pages

This repo includes `.github/workflows/deploy-pages.yml`. After you push to `main`:

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**
2. Wait for the **Deploy GitHub Pages** workflow to finish (Actions tab)
3. Open: `https://heydurjoy.github.io/cademyedu_demo/#/`

### Manual deploy (optional)

```bash
npm run build
npx gh-pages -d dist
```

Then set Pages to the `gh-pages` branch.

## Demo tips

- Use **Experience as** cards or the glass nav portals.
- **Reset Demo** restores seed data.
- Admin **Toggle Due/Paid** and Student/Parent **Pay** share the same Zustand store (`cademyos-demo` in localStorage).
- Theme toggle crossfades light/dark via CSS variables.

## Brand assets

- `public/assets/logo.png`
- `public/assets/hero.jpg`
