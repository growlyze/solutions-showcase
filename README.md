# Solutions Showcase

Frontend-only case study platform. Home page shows category cards (one per tool/use case); clicking a category shows the case studies tagged under it; clicking a case study opens its original source (Notion, Google Docs, Google Drive) in a new tab. A single case study can be tagged under multiple categories.

No database, no backend logic. `server.js` serves the static files in `public/` and also sends the content as plain HTML and text so AI tools and search engines can read it (see "Readable by AI tools" below).

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
- `CASE_STUDIES`: each entry has a `tags` array, so add multiple slugs to make one case study show up under multiple categories.

No build step. Just edit `data.js` and refresh.

## Editing case studies on the site

The admin workspace is at `/admin`; it is separate from the public home page and requires the admin password. The editor is not loaded on the public page.

1. Open **`/admin`** and enter the password (`ADMIN_PASSWORD`).
   - To change it, choose **Change password** in the admin header. Enter the current password and a new password of at least 12 characters; changing it logs you out.
2. Open a case study and press **Edit this case study**.
3. Edit it like a Notion page:
   - **Text:** click anything to type. Select text for the formatting bar (bold, italic, strikethrough, inline code, link, clear), or use Ctrl+B / Ctrl+I / Ctrl+Shift+S / Ctrl+E / Ctrl+K.
   - **Cover and icon:** "Add cover" (upload, or reuse an image already on the page; any image block also has "Use as cover") and "Add icon" (emoji picker). Covers also show on the case study's card.
   - **Blocks:** hover a block for its controls: drag ⋮⋮ to move it, change its type, move up/down, duplicate, add below, delete. Block types: text, heading, subheading, section heading, bold line, bulleted and numbered lists, callout (with colours), quote, image, table, stats, divider, code.
   - **Text alignment:** use a text block's alignment menu to align left, center, right or justify its text.
   - **Keyboard:** **/** in an empty paragraph opens the block menu (type to filter). Typing `- `, `1. `, `# `, `## `, `### `, `> ` or `---` at the start of a paragraph turns it into that block. **Enter** splits a paragraph, **Backspace** at the start joins it to the one above, and arrow keys move between blocks. Ctrl+Z / Ctrl+Shift+Z undo and redo block changes.
   - **Pasting:** paste a screenshot or image file and it becomes an image block; drag image files in from your computer too (PNG, JPG, WebP or GIF up to 8 MB). Copy a section from Notion, Google Docs, Word or any web page and paste it: headings, paragraphs, bold/italic/links, lists, tables, quotes, dividers and images come across as blocks. Images inside pasted content are downloaded and stored by the site (an image behind a login, such as a private Notion file, can't be fetched; paste or upload that image itself).
   - The title, the summary and the sections the case study is listed under are editable too.
4. Press **Save** (or Ctrl+S). The change is live for every visitor straight away; no redeploy needed. **Revert to original** throws away the site edits for that case study. **Delete case study** permanently removes it from the site for everyone; this cannot be undone.

Body text is stored markdown-style (`**bold**`, `*italic*`, `~~strike~~`, `` `code` ``, `[link](https://…)`), so the plain-text versions for AI tools stay readable; `inlineHtml()` in `app.js` turns it into HTML and escapes everything else.

How it is stored: `public/data.js` stays the original content. A saved edit is an override for that one case study, kept in Postgres (`case_overrides` table; uploaded images in `uploads`) and laid over `data.js` whenever the site is drawn, by the browser (`/data.js` is served with the edits applied) and by the server pages for AI tools and search engines. The changed admin password is stored as a salted scrypt hash in Postgres (`admin_settings`) or `.data/admin.json` locally. Deleting an original case study stores a tombstone in the same table so it stays removed after restarts; deleting a case study created on the site removes its stored record. If `data.js` is later changed by hand for a case study that also has a site edit, the site edit wins until it is reverted.

| File | Role |
|---|---|
| `public/editor.js` | The editor (browser only) |
| `admin.js` | Login and the editing API (`/api/session`, `/api/login`, `/api/logout`, `/api/password`, `POST`/`PUT`/`DELETE /api/cases/<id>`, `POST /api/cases/<id>/revert`, `POST /api/uploads`, `POST /api/uploads/from-url`) |
| `store.js` | Storage: Postgres when `DATABASE_URL` is set, otherwise a local `.data/` folder (for development); stores the scrypt password hash after an admin changes the password |

Environment variables:

| Variable | Needed | What it does |
|---|---|---|
| `ADMIN_PASSWORD` | yes, to edit | The initial admin password. Without it editing is switched off unless a password was already changed and stored. After changing the password in the admin menu, the stored password hash is used instead; reset it by removing the `password_hash` row from Postgres `admin_settings` or the local `.data/admin.json` file |
| `DATABASE_URL` | yes on Railway | Postgres connection string. In Railway, add a Postgres database to the project and reference its `DATABASE_URL` in this service's variables |
| `PGSSL` | no | Set to `true` if connecting to Postgres over its public URL needs SSL |
| `SESSION_SECRET` | no | Extra secret mixed into the login cookie signature |

## Run locally

```bash
npm install
npm start
```

Then open http://localhost:3000. To try editing locally, start it with a password: `ADMIN_PASSWORD=yourpassword npm start` (edits are saved in `.data/`).

## Run with Docker (Hostinger VPS)

Docker hosting requires a Hostinger VPS with Docker/Compose support; Hostinger shared web hosting does not run Docker containers. This setup keeps the existing project layout. The Compose file builds the app from this folder and persists local edits, uploaded images, and the changed admin password in a named Docker volume.

1. Install Docker Engine and the Docker Compose plugin on the VPS, then connect over SSH.
2. Get this project onto the VPS (for example, clone the GitHub repository) and enter its project folder.
3. Create the private environment file and set your own strong credentials:

   ```bash
   cp .env.example .env
   nano .env
   ```

   Set `ADMIN_PASSWORD` to a unique password of at least 12 characters. Generate a random value for `SESSION_SECRET` with `openssl rand -hex 32` and put it in `.env`. Keep `.env` private; it is excluded from Git and the Docker build. Leave `DATABASE_URL` blank to use the persistent local volume, or supply a Postgres connection string if you have a database.
4. Build and start the app:

   ```bash
   docker compose up -d --build
   docker compose logs -f
   ```

   The app listens on `127.0.0.1:3000` on the VPS so it is not exposed directly to the public internet.
5. Point your domain's DNS to the VPS IP address and configure the VPS reverse proxy/web server to provide HTTPS and forward traffic to `127.0.0.1:3000`. Do not expose the admin login over plain HTTP on a public network.

To deploy later updates, pull the latest code and run `docker compose up -d --build` again. The `showcase-data` volume remains in place when the container is rebuilt. Back it up regularly; removing that volume deletes the locally stored edits, uploads, and changed password hash.

## Deploy to Railway

1. Push this folder to a GitHub repo (or use the Railway CLI directly from this folder).
2. In Railway: **New Project → Deploy from GitHub repo** (or run `railway init` then `railway up` from this folder if using the CLI).
3. Railway auto-detects Node via Nixpacks and runs `npm install` then `npm start` (see `railway.json`). For editing, add a Postgres database to the project and set `ADMIN_PASSWORD` and `DATABASE_URL` on this service (see "Editing case studies on the site").
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
| `/` | The home page with every section card; each card links to `/tag/<slug>`. AI tools and crawlers get a section-by-section directory instead: every section with its description, its case studies and the address of its own full text (`/full/<slug>`), plus an index of case studies by tool (for example everything that uses WhatsApp) |
| `/tag/<slug>` | A section's page listing its case studies; each links to `/case/<id>` |
| `/case/<id>` | A case study with its full text in the HTML (people get the normal app view) |
| `/case/<id>.md` | The same case study as plain markdown |
| `/tag/<slug>.md` | The complete text of every case study in one section (largest is about 74,000 characters) |
| `/full` and `/full/<slug>` (also `/?full=1` and `/tag/<slug>?full=1`) | The complete text as one visible web page (about 270 KB for the whole site): a contents list with every title, then every case study in full. The same page is what AI tools and crawlers receive automatically at `/` and `/tag/<slug>` (see below). Works for any tool, whatever it calls itself |
| `/full/part-1`, `/full/part-2`, … | The same complete text cut into parts that each fit in one read of about 100,000 characters (shortest case studies first; part 1 also has the contents list). `/full` links to them near the top |
| `/llms.txt` | Index of everything, with links to the section and case study text files |
| `/llms-full.txt` | The whole site in one very long file (about 220,000 characters; many fetch tools stop after about 100,000, so use the section files for those) |
| `/sitemap.xml`, `/robots.txt` | For search engines and crawlers |

### AI tools: a section directory at the original link, full text one section at a time

AI fetch tools read one page and do not click through, and tools that read only visible text cannot see the app's own rendering. So the server recognises AI tools and crawlers by their name (ChatGPT, Claude, Perplexity, Gemini, Googlebot/Bingbot and other bots, plus common scripting libraries such as python-requests, axios, curl) and sends them plain pages instead of the app. People and ordinary browsers get the normal site.

- At `/` an AI tool gets the **directory** (about 32,000 characters): every section and case study, the address of each section's full text, and a "find by tool" index. It is built for questions like "give me the WhatsApp automation case studies": the tool picks the section and fetches only `/full/<slug>` (for example `/full/ai-whatsapp`).
- `/full/<slug>` and `/tag/<slug>` give the complete text of one section. `/full` (also `/?full=1`) gives the whole site on one page, cut into parts that each fit one read.
- A tool whose name is not recognised can open any of these addresses directly; `/full/...` addresses return the full-text pages for everyone, and are also addresses no tool can have saved from before they existed.

The list of recognised names is `AI_OR_CRAWLER` in `server.js`; responses carry `Vary: User-Agent` so caches keep the versions apart.

Fetch tools read only about the first 100,000 characters of a page in one go, and the whole site is about 220,000. The contents list at the top has every title, so nothing is invisible, but reading everything takes a second request for the next part (most tools support this) or the per-section files above (`/tag/<slug>.md`, at most about 74,000 characters each).

The full-text pages and plain-text files remain directly accessible at the addresses above; their links are not added to the visible page footer. The browser app takes over as soon as it loads; `/case/<id>` and `/tag/<slug>` addresses are rewritten to the usual `#/case/<id>` form. Because the server page and the app use the same code, they stay identical (checked page by page when this was built).
