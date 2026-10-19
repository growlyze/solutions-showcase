const express = require('express');
const path = require('path');
const { create, mergedDataSource, originalCaseStudies } = require('./site-content');
const { createStore } = require('./store');
const { adminRouter } = require('./admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Railway terminates HTTPS in front of the app; trust it so absolute links use https.
app.set('trust proxy', true);

// Edits saved from the browser editor live in the store (Postgres on Railway) and are laid over
// public/data.js. After every save the pages are drawn again from the merged content.
const store = createStore();
const adminPassword = { value: process.env.ADMIN_PASSWORD || '', hash: '' };
const overrides = new Map();
const original = originalCaseStudies();
const originalById = new Map(original.cases.map((c) => [c.id, c]));
let site = null;
let dataJs = '';
function rebuild() {
  site = create(overrides);
  dataJs = mergedDataSource(overrides);
}

const baseUrl = (req) => `${req.protocol}://${req.get('host')}`;
// Pages can change whenever the admin saves an edit, so browsers and proxies check back each time
// (cheap: an unchanged page is answered with "not modified").
const CACHE = 'no-cache';

function send(res, type, body, status = 200) {
  res.status(status).set({ 'Content-Type': type, 'Cache-Control': CACHE }).send(body);
}

app.use('/api', adminRouter({
  store,
  getOriginal: (id) => originalById.get(id),
  categorySlugs: new Set(original.categories.map((c) => c.slug)),
  overrides,
  adminPassword,
  onChange: rebuild,
}));

app.get(['/admin', '/admin/'], (req, res) => {
  res.set('X-Robots-Tag', 'noindex, nofollow')
    .sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// The content the browser app reads: public/data.js with the saved edits applied.
app.get('/data.js', (req, res) => send(res, 'application/javascript; charset=utf-8', dataJs));

// Images uploaded from the editor.
app.get('/uploads/:name', async (req, res) => {
  if (!/^[a-f0-9]{24}\.(png|jpg|webp|gif)$/.test(req.params.name)) return res.status(404).end();
  const file = await store.getUpload(req.params.name).catch(() => null);
  if (!file) return res.status(404).end();
  res.set({ 'Content-Type': file.mime, 'Cache-Control': 'public, max-age=31536000, immutable' }).send(file.buffer);
});

// Machine-readable files: what AI tools and search engines look for.
app.get('/robots.txt', (req, res) => send(res, 'text/plain; charset=utf-8', site.robotsTxt(baseUrl(req))));
app.get('/sitemap.xml', (req, res) => send(res, 'application/xml; charset=utf-8', site.sitemapXml(baseUrl(req))));
app.get('/llms.txt', (req, res) => send(res, 'text/plain; charset=utf-8', site.llmsTxt(baseUrl(req))));
app.get('/llms-full.txt', (req, res) => send(res, 'text/plain; charset=utf-8', site.llmsFullTxt(baseUrl(req))));

// Every case study as plain text, and as a page with the full text in the HTML.
app.get('/case/:id.md', (req, res) => {
  const cs = site.caseById.get(req.params.id);
  if (!cs) return send(res, 'text/plain; charset=utf-8', 'Not found\n', 404);
  send(res, 'text/markdown; charset=utf-8', site.caseMarkdown(cs, baseUrl(req)));
});

app.get('/case/:id', (req, res) => {
  const cs = site.caseById.get(req.params.id);
  if (!cs) return send(res, 'text/html; charset=utf-8', site.notFoundPage(baseUrl(req)), 404);
  send(res, 'text/html; charset=utf-8', site.casePage(cs, baseUrl(req)));
});

app.get('/tag/:slug.md', (req, res) => {
  const cat = site.categoryBySlug.get(req.params.slug);
  if (!cat) return send(res, 'text/plain; charset=utf-8', 'Not found\n', 404);
  send(res, 'text/markdown; charset=utf-8', site.tagMarkdown(cat, baseUrl(req)));
});

// AI tools and crawlers get the complete content on the page itself: AI fetch tools read one page and
// do not click through, and tools that read only visible text cannot see the app's own rendering.
// Everyone else (people, ordinary browsers) gets the normal site. Adding ?full=1 to a link forces the
// full-text version for any tool whose name is not recognised here.
const AI_OR_CRAWLER = /bot|crawl|spider|slurp|chatgpt|oai-|openai|claude|anthropic|perplexity|gemini|google-extended|googleother|bingpreview|duckassist|cohere|diffbot|facebookexternalhit|meta-external|mistral|deepseek|python-requests|python-urllib|aiohttp|httpx|axios|node-fetch|undici|go-http-client|okhttp|libwww|wget|curl|scrapy|java\//i;
const wantsFullText = (req) => req.query.full === '1' || AI_OR_CRAWLER.test(req.get('user-agent') || '');

app.get('/tag/:slug', (req, res) => {
  res.vary('User-Agent');
  const cat = site.categoryBySlug.get(req.params.slug);
  if (!cat) return send(res, 'text/html; charset=utf-8', site.notFoundPage(baseUrl(req)), 404);
  const html = wantsFullText(req) ? site.tagFullPage(cat, baseUrl(req)) : site.tagPage(cat, baseUrl(req));
  send(res, 'text/html; charset=utf-8', html);
});

// Short, clean links to the full-text pages for any visitor or tool (no query string, no # in it).
// An AI tool that saved the plain home link before this existed cannot have a saved copy of these.
app.get('/full', (req, res) => send(res, 'text/html; charset=utf-8', site.homeFullPage(baseUrl(req))));
app.get('/full/part-:n', (req, res) => {
  const n = Number(req.params.n);
  if (!Number.isInteger(n) || n < 1 || n > site.fullPartCount()) return send(res, 'text/html; charset=utf-8', site.notFoundPage(baseUrl(req)), 404);
  send(res, 'text/html; charset=utf-8', site.fullPartPage(n, baseUrl(req)));
});
app.get('/full/:slug', (req, res) => {
  const cat = site.categoryBySlug.get(req.params.slug);
  if (!cat) return send(res, 'text/html; charset=utf-8', site.notFoundPage(baseUrl(req)), 404);
  send(res, 'text/html; charset=utf-8', site.tagFullPage(cat, baseUrl(req)));
});

// At the main link, AI tools get a section-by-section directory (each section links to its own full text),
// so they can fetch just the section a question is about. ?full=1 and /full give the whole site on one page.
app.get('/', (req, res) => {
  res.vary('User-Agent');
  const base = baseUrl(req);
  let html;
  if (req.query.full === '1') html = site.homeFullPage(base);
  else if (AI_OR_CRAWLER.test(req.get('user-agent') || '')) html = site.directoryPage(base);
  else html = site.homePage(base);
  send(res, 'text/html; charset=utf-8', html);
});

app.use(express.static(path.join(__dirname, 'public'), { index: false }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

(async () => {
  await store.init();
  adminPassword.hash = await store.getAdminPasswordHash();
  for (const [id, o] of await store.allOverrides()) if (originalById.has(id) || o.isNew || o.isDeleted) overrides.set(id, o);
  rebuild();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (edits stored in ${store.kind}, ${overrides.size} edited case studies)`);
    if (!adminPassword.hash && !adminPassword.value) console.log('ADMIN_PASSWORD is not set: editing is switched off.');
  });
})().catch((e) => {
  console.error('Startup failed', e);
  process.exit(1);
});
