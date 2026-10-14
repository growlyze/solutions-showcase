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

The app draws its pages in the browser with JavaScript, and the part of an address after `#` never reaches a server. A fetcher that does not run JavaScript would therefore see an empty page. To fix that, `server.js` answers these addresses with the real content, generated from `public/data.js` (nothing extra to maintain — edit `data.js` and redeploy):

| Address | What it returns |
|---|---|
| `/` | The app, plus an index of every section and case study (title, description, link) that stays in the page as off-screen text, so it is readable with or without JavaScript or CSS |
| `/tag/<slug>` | A section's page with its case studies listed |
| `/case/<id>` | A case study with its full text in the HTML (people who open it get the normal app view) |
| `/case/<id>.md` | The same case study as plain markdown |
| `/llms.txt` | Index of all case studies with links to the markdown versions |
| `/llms-full.txt` | The whole site in one text file |
| `/sitemap.xml`, `/robots.txt` | For search engines and crawlers |

The normal browser experience is unchanged: on `/tag/<slug>` and `/case/<id>` the browser app replaces the pre-filled (transparent, never hidden with `display:none`/`visibility:hidden`, which text extractors skip) HTML as soon as it loads, and `/case/<id>` or `/tag/<slug>` addresses are rewritten to the usual `#/case/<id>` form.
