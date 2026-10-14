const express = require('express');
const path = require('path');
const { create } = require('./site-content');

const app = express();
const PORT = process.env.PORT || 3000;

// Railway terminates HTTPS in front of the app; trust it so absolute links use https.
app.set('trust proxy', true);

const site = create();
const baseUrl = (req) => `${req.protocol}://${req.get('host')}`;
const CACHE = 'public, max-age=300';

function send(res, type, body, status = 200) {
  res.status(status).set({ 'Content-Type': type, 'Cache-Control': CACHE }).send(body);
}

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
app.get('/full/:slug', (req, res) => {
  const cat = site.categoryBySlug.get(req.params.slug);
  if (!cat) return send(res, 'text/html; charset=utf-8', site.notFoundPage(baseUrl(req)), 404);
  send(res, 'text/html; charset=utf-8', site.tagFullPage(cat, baseUrl(req)));
});

app.get('/', (req, res) => {
  res.vary('User-Agent');
  const html = wantsFullText(req) ? site.homeFullPage(baseUrl(req)) : site.homePage(baseUrl(req));
  send(res, 'text/html; charset=utf-8', html);
});

app.use(express.static(path.join(__dirname, 'public'), { index: false }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
