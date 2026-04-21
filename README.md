# Cloudflare Browser Rendering Playground

A local dev UI for exploring Cloudflare's [Browser Rendering REST API](https://developers.cloudflare.com/browser-rendering/rest-api/). Paste your API token, pick an endpoint, build a request, and inspect the response — with a dedicated crawl-job tracker that polls, persists across reloads, and paginates results.

Supports all the Browser Rendering endpoints: `content`, `markdown`, `screenshot`, `pdf`, `json`, `scrape`, `links`, and `crawl`.

## Getting started

### Prerequisites

- Node.js 20+
- A Cloudflare account with Browser Rendering enabled
- A Cloudflare API token with the **Browser Rendering — Edit** permission
  ([create one here](https://dash.cloudflare.com/profile/api-tokens))
- Your Cloudflare **Account ID** (from the dashboard sidebar)

### Install and run

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

1. Paste your API token and Account ID into the top bar. They're saved to `localStorage` — nothing leaves your browser.
2. Pick an endpoint from the tab bar.
3. Fill in the request fields (at minimum, a URL) and hit **Send**.
4. For `crawl` jobs, the right panel tracks progress. Click a job to open the paginated record browser.

### How the proxy works

Cloudflare's API doesn't set permissive CORS headers, so the dev server proxies `/cf-api/*` → `https://api.cloudflare.com/*` (see `vite.config.ts`). The app uses the proxy path directly; there's no separate backend.

This means the playground only works under `npm run dev`. `npm run build` produces static assets but there is no production proxy.

## Scripts

- `npm run dev` — start the dev server with the Cloudflare proxy
- `npm run build` — type-check and build (static assets only; no proxy)
- `npm run lint` — run ESLint
- `npm run preview` — preview the static build

## Stack

React 19 · TypeScript · Vite · Tailwind v4 · shadcn/ui (Base UI) · Lucide icons
