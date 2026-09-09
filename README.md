# E.S.T.E.R. — Extraction System for Transaction Entity Reconciliation

Upload a receipt or invoice image, extract structured data (vendor, line items, GL categories, totals) with a single vision-model call, edit it inline, and export to CSV / QuickBooks IIF / Excel / JSON.

Rewritten from a Vite + React (TypeScript) SPA into **Next.js 15 (App Router), plain JavaScript** — no TypeScript, no build-time type checking. The Gemini call happens in a server-side API route (`app/api/extract/route.js`), so the API key is never sent to the browser. AI usage was also reduced from three model calls (extraction, translation, batch audit) down to one — extraction only.

## Stack

- Next.js 15 / React 19 / JavaScript (JSX, no TS)
- Tailwind CSS
- `@google/genai` (Gemini 2.5 Flash), called server-side only

## Run locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```
   npm install
   ```
2. (Optional) Set `GEMINI_API_KEY` in `.env.local` — copy `.env.local.example` to `.env.local` and fill it in. Get a free key at [aistudio.google.com](https://aistudio.google.com). This is only needed for real extraction; the app also ships with a **Demo Mode** toggle in the sidebar that fakes extraction with sample data and makes zero API calls.
3. Run the app:
   ```
   npm run dev
   ```

## Project layout

```
app/
  layout.jsx          root layout
  page.jsx             renders <App />
  api/extract/route.js the only file that calls Gemini — runs server-side only
  globals.css
components/
  App.jsx              main app logic/state (client component)
  FileUpload.jsx
  InvoiceEditor.jsx
  Navbar.jsx
  SessionSidebar.jsx
lib/
  extraction.js         schema, mock-data generator (Demo Mode), quality scoring
  extractClient.js       thin fetch('/api/extract') wrapper used by the UI
  currency.js
  translations.js        static UI-language dictionary (not AI)
  exampleData.js
```

## What changed from the original

- Moved from Vite to Next.js App Router, and from TypeScript to plain JavaScript/JSX throughout.
- Gemini calls moved from the browser into `app/api/extract/route.js` (server-side). The UI calls `lib/extractClient.js`, which just does `fetch('/api/extract')`.
- Removed the AI-powered line-item **translation** feature and the AI **batch supply-chain audit** feature — both were separate Gemini calls that weren't core to the product. The static UI-language switcher (`lib/translations.js`) is unrelated to those and was kept.
- Demo Mode (mock data generator) is preserved, so the app is fully demoable without any API key.
