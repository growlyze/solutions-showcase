# Solutions Showcase

Frontend-only case study platform. Home page shows category cards (one per tool/use case); clicking a category shows the case studies tagged under it; clicking a case study opens its original source (Notion, Google Docs, Google Drive) in a new tab. A single case study can be tagged under multiple categories.

No database, no backend logic — `server.js` serves the static files in `public/` and also sends the content as plain HTML and text so AI tools and search engines can read it (see "Readable by AI tools" below).

## Project structure

```
public/
  index.html   page shell
  style.css    styling (dark theme by default, light/dark toggle, Sora + Inter type)
  data.js      <-- EDIT THIS to add/remove/retag case studies and categories
  app.js       routing + rendering (hash-based: #/ and #/tag/<slug>)
  logos/       official brand logo files (see below)
server.js      server used for deployment: static files plus the crawler-readable pages
site-content.js builds those pages and text files from public/data.js
package.json
railway.json
```

## Logos

`public/logos/` holds the official icon-only mark for every category now:

| File | Source |
|---|---|
| `n8n.png`, `zapier.png`, `make.jpg`, `clickup.png`, `looker-studio.png` | provided directly |
| `airtable.png` | airtable.com's own favicon |
| `monday.png` | monday.com's own site icon (their CDN) |
| `whatsapp.svg` | Wikimedia Commons (freely-licensed trademark file) |
| `power-bi.svg` | Microsoft's official [PowerBI-Icons](https://github.com/microsoft/PowerBI-Icons) repo |

Every logo falls back to a plain emoji automatically if it ever fails to load, so the page never shows a broken image.

## Editing content

Everything lives in `public/data.js`:
- `CATEGORIES`: the tiles on the home page (slug, icon emoji, name, description).
- `CASE_STUDIES`: each entry has a `tags` array — add multiple slugs to make one case study show up under multiple categories.

No build step. Just edit `data.js` and refresh.

## Run locally

```bash
npm install
npm start
```

Then open http://localhost:3000

## Deploy to Railway

1. Push this folder to a GitHub repo (or use the Railway CLI directly from this folder).
2. In Railway: **New Project → Deploy from GitHub repo** (or run `railway init` then `railway up` from this folder if using the CLI).
3. Railway auto-detects Node via Nixpacks and runs `npm install` then `npm start` (see `railway.json`). No environment variables are required.
4. Once deployed, Railway gives you a public `*.up.railway.app` URL (you can attach a custom domain from the Railway dashboard under Settings → Domains).

## Known gaps / needs your input

Two links you sent don't say which category they belong to, so they are intentionally NOT included in `data.js` yet:
- `https://bit.ly/4feG4oT` → a Google Doc titled "Documentation"
- `https://bit.ly/44hRCm2` → a Google Doc titled "case studies"

Tell me which categor(ies) to tag them under and I'll add them.

Also currently empty (categories exist, no case study tagged yet): AI Agents for Sales, AI Agents for Customer Support, AI Agents for WhatsApp, Power BI, Looker Studio. Send links for these whenever you have them and I'll slot them in.

Growlyze links were intentionally excluded per your instruction.

## Readable by AI tools and search engines

The app draws its pages in the browser with JavaScript, and the part of an address after `#` never reaches a server, so a fetcher that does not run JavaScript used to see an empty page. Tools that read only the text a visitor could see also skip anything hidden from view, so nothing here is hidden.

`server.js` therefore sends real pages. `site-content.js` draws each page with the app's own code (`public/app.js`) on the server, so the HTML a crawler receives is exactly what visitors see, and the links between pages are ordinary addresses that work without JavaScript. Nothing extra to maintain: edit `public/data.js` and redeploy.

| Address | What it returns |
|---|---|
| `/` | The home page with every section card; each card links to `/tag/<slug>` |
| `/tag/<slug>` | A section's page listing its case studies; each links to `/case/<id>` |
| `/case/<id>` | A case study with its full text in the HTML (people get the normal app view) |
| `/case/<id>.md` | The same case study as plain markdown |
| `/tag/<slug>.md` | The complete text of every case study in one section (largest is about 74,000 characters) |
| `/full` and `/full/<slug>` (also `/?full=1` and `/tag/<slug>?full=1`) | The complete text as one visible web page (about 270 KB for the whole site): a contents list with every title, then every case study in full. The same page is what AI tools and crawlers receive automatically at `/` and `/tag/<slug>` (see below). Works for any tool, whatever it calls itself |
| `/full/part-1`, `/full/part-2`, … | The same complete text cut into parts that each fit in one read of about 100,000 characters (shortest case studies first; part 1 also has the contents list). `/full` links to them near the top |
| `/llms.txt` | Index of everything, with links to the section and case study text files |
| `/llms-full.txt` | The whole site in one very long file (about 220,000 characters; many fetch tools stop after about 100,000, so use the section files for those) |
| `/sitemap.xml`, `/robots.txt` | For search engines and crawlers |

### AI tools get the full text at the original link

AI fetch tools read one page and do not click through, so at `/` and `/tag/<slug>` the server recognises AI tools and crawlers by their name (ChatGPT, Claude, Perplexity, Gemini, Googlebot/Bingbot and other bots, plus common scripting libraries such as python-requests, axios, curl) and sends the full-text page instead of the app. People and ordinary browsers get the normal site. A tool whose name is not recognised can use `/full` (or `/full/<slug>` for one section), which is also a clean address that no tool can have saved from before it existed. The list is `AI_OR_CRAWLER` in `server.js`; responses carry `Vary: User-Agent` so caches keep the two versions apart.

Fetch tools read only about the first 100,000 characters of a page in one go, and the whole site is about 220,000. The contents list at the top has every title, so nothing is invisible, but reading everything takes a second request for the next part (most tools support this) or the per-section files above (`/tag/<slug>.md`, at most about 74,000 characters each).

The footer of every page says "Reading this with an AI tool? Everything on one page: …/full · plain text: …/llms.txt". The browser app takes over as soon as it loads; `/case/<id>` and `/tag/<slug>` addresses are rewritten to the usual `#/case/<id>` form. Because the server page and the app use the same code, they stay identical (checked page by page when this was built).
