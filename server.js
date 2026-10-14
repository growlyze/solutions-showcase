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

app.get('/tag/:slug', (req, res) => {
  const cat = site.categoryBySlug.get(req.params.slug);
  if (!cat) return send(res, 'text/html; charset=utf-8', site.notFoundPage(baseUrl(req)), 404);
  send(res, 'text/html; charset=utf-8', site.tagPage(cat, baseUrl(req)));
});

// The home page carries the full list of sections and case studies in its HTML.
app.get('/', (req, res) => send(res, 'text/html; charset=utf-8', site.homePage(baseUrl(req))));

app.use(express.static(path.join(__dirname, 'public'), { index: false }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
