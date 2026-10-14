// Builds what the server sends first, so the content is in the HTML itself:
//  - real pages: each page is drawn with the browser app's own rendering code (public/app.js),
//    so the HTML a crawler or AI tool receives is exactly what visitors see. Nothing is hidden.
//    Links between pages are ordinary addresses (/tag/<slug>, /case/<id>) that can be followed
//    without JavaScript; the browser app takes over as soon as it loads.
//  - plain-text versions: markdown for every case study and every section, llms.txt,
//    llms-full.txt, sitemap.xml and robots.txt.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const PUBLIC_DIR = path.join(__dirname, 'public');
const SITE_NAME = 'Solutions Showcase';
const SITE_TAGLINE = 'Browse case studies by tool and use case — automations, AI agents, dashboards, and custom platforms.';

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const itemText = (i) => (typeof i === 'string' ? i : Object.values(i).join(' '));

// ---------- run the app's rendering code on the server ----------
// app.js draws pages by writing HTML into #app. A tiny stand-in for the few browser objects it
// touches lets the same code produce the same HTML here.
function createRenderer() {
  const dataSrc = fs.readFileSync(path.join(PUBLIC_DIR, 'data.js'), 'utf8');
  const appSrc = fs.readFileSync(path.join(PUBLIC_DIR, 'app.js'), 'utf8');

  const target = { innerHTML: '', querySelectorAll: () => [] };
  const noop = () => {};
  const element = () => ({
    set textContent(v) { this._t = String(v); },
    // same escaping a browser applies when it serialises text
    get innerHTML() { return (this._t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;'); },
    setAttribute: noop, addEventListener: noop, classList: { add: noop, remove: noop },
  });
  const documentStub = {
    getElementById: (id) => (id === 'app' ? target : element()),
    createElement: element,
    querySelector: () => null, querySelectorAll: () => [], contains: () => false,
    addEventListener: noop,
    documentElement: { setAttribute: noop, getAttribute: () => 'light' },
    body: { classList: { add: noop, remove: noop }, appendChild: noop },
  };
  const windowStub = {
    location: { hash: '', pathname: '/' }, history: { length: 1, back: noop, replaceState: noop },
    addEventListener: noop, scrollTo: noop,
  };
  const context = vm.createContext({
    document: documentStub, window: windowStub, localStorage: { getItem: () => null, setItem: noop }, console,
  });
  vm.runInContext(
    `${dataSrc}\n${appSrc}\n;globalThis.__api = { CATEGORIES, CASE_STUDIES, renderHome, renderCategory, renderCaseDetail };`,
    context, { filename: 'app-and-data' },
  );
  const api = context.__api;

  // Make the HTML work as a standalone page: hash links become real addresses, and relative image
  // paths become absolute (the page may be served from /case/<id>).
  const asPage = (html) => html
    .replace(/href="#\/(tag|case)\/([a-z0-9-]+)"/gi, 'href="/$1/$2"')
    .replace(/href="#\/"/g, 'href="/"')
    .replace(/src="(?!https?:|\/|data:)([^"]+)"/g, 'src="/$1"');

  const cache = new Map();
  function render(key, draw) {
    if (!cache.has(key)) { target.innerHTML = ''; draw(); cache.set(key, asPage(target.innerHTML)); }
    return cache.get(key);
  }
  return {
    api,
    home: () => render('home', () => api.renderHome()),
    tag: (slug) => render('tag:' + slug, () => api.renderCategory(slug)),
    caseStudy: (id) => render('case:' + id, () => api.renderCaseDetail(id)),
  };
}

function create() {
  const renderer = createRenderer();
  const categories = renderer.api.CATEGORIES;
  const cases = renderer.api.CASE_STUDIES.filter((c) => c.content && c.content.length);
  const caseById = new Map(cases.map((c) => [c.id, c]));
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
  const casesFor = (slug) => cases.filter((c) => c.tags.includes(slug));
  const categoriesOf = (cs) => cs.tags.map((t) => categoryBySlug.get(t)).filter(Boolean);

  // ---------- "Full text" pages: the whole content in one visible HTML page ----------
  // Served to AI tools and crawlers (and to anyone who adds ?full=1). Plain, compact markup with the
  // app's scripts left out, so a tool that runs JavaScript sees the same text as one that does not.
  function blockHtml(b) {
    switch (b.type) {
      case 'heading': case 'eyebrow': return `<h3>${esc(b.text)}</h3>`;
      case 'subheading': return `<h4>${esc(b.text)}</h4>`;
      case 'label': return `<p><strong>${esc(b.text)}</strong></p>`;
      case 'list': return `<ul>${b.items.map((i) => `<li>${esc(itemText(i))}</li>`).join('')}</ul>`;
      case 'img': return b.caption ? `<p><em>Image: ${esc(b.caption)}</em></p>` : '';
      case 'stats': return `<ul>${b.items.map((x) => `<li>${esc(x.value)} — ${esc(x.label)}</li>`).join('')}</ul>`;
      case 'table': return `<table><thead><tr>${b.headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
      case 'quote': return `<blockquote><p>${esc(b.text)}</p><footer>${esc(b.attribution)}</footer></blockquote>`;
      default: return `<p>${esc(b.text)}</p>`;
    }
  }

  function articleHtml(cs) {
    const sections = categoriesOf(cs).map((c) => esc(c.name)).join(', ');
    return `<article id="case-${esc(cs.id)}"><h2>${esc(cs.title)}</h2><p>${esc(cs.description)}</p>`
      + (sections ? `<p>Section: ${sections}</p>` : '')
      + cs.content.map(blockHtml).join('')
      + `<p><a href="/case/${esc(cs.id)}">Page</a> · <a href="/case/${esc(cs.id)}.md">Plain text</a></p></article>`;
  }

  const contentsHtml = (cats) => cats.map((cat) => {
    const list = casesFor(cat.slug);
    return list.length
      ? `<h3>${esc(cat.name)}</h3><p>${esc(cat.description)}</p><ul>${list.map((c) => `<li><a href="#case-${esc(c.id)}">${esc(c.title)}</a> — ${esc(c.description)}</li>`).join('')}</ul>`
      : '';
  }).join('');

  function fullHomeBody() {
    return `<h1>${SITE_NAME}</h1><p>${esc(SITE_TAGLINE)}</p>`
      + `<p>This is the complete text version of the site: a contents list, then every case study in full (${cases.length} case studies).</p>`
      + `<h2>Contents</h2>${contentsHtml(categories)}<h2>Case studies in full</h2>${cases.map(articleHtml).join('')}`;
  }

  function fullTagBody(cat) {
    const list = casesFor(cat.slug);
    return `<p><a href="/?full=1">&larr; All case studies</a></p><h1>${esc(cat.name)}</h1><p>${esc(cat.description)}</p>`
      + `<p>All ${list.length} case ${list.length === 1 ? 'study' : 'studies'} in this section follow in full.</p>`
      + `<h2>Contents</h2>${contentsHtml([cat])}<h2>Case studies in full</h2>${list.map(articleHtml).join('')}`;
  }

  // ---------- Markdown / plain text ----------
  function blockMd(b, base) {
    switch (b.type) {
      case 'heading': case 'eyebrow': return `## ${b.text}`;
      case 'subheading': return `### ${b.text}`;
      case 'label': return `**${b.text}**`;
      case 'list': return b.items.map((i) => `- ${itemText(i)}`).join('\n');
      case 'img': return `Image${b.caption ? `: ${b.caption}` : ''} (${base}/${b.file})`;
      case 'stats': return b.items.map((s) => `- ${s.value} — ${s.label}`).join('\n');
      case 'table': {
        const row = (r) => `| ${r.map((c) => String(c).replace(/\|/g, '/').replace(/\n/g, ' ')).join(' | ')} |`;
        return [row(b.headers), row(b.headers.map(() => '---')), ...b.rows.map(row)].join('\n');
      }
      case 'quote': return `> ${b.text}\n> — ${b.attribution}`;
      default: return b.text;
    }
  }

  function caseMarkdown(cs, base) {
    const cats = categoriesOf(cs).map((c) => c.name).join(', ');
    return [
      `# ${cs.title}`,
      `> ${cs.description}`,
      cats ? `Section: ${cats}` : '',
      `Page: ${base}/case/${cs.id}`,
      ...cs.content.map((b) => blockMd(b, base)),
    ].filter(Boolean).join('\n\n') + '\n';
  }

  // One file per section with the full text of all its case studies. The biggest is about 74,000
  // characters, which fits inside the size AI fetch tools read in one go (the whole site does not).
  function tagMarkdown(cat, base) {
    const list = casesFor(cat.slug);
    return [`# ${cat.name}`, `> ${cat.description}`, `Page: ${base}/tag/${cat.slug}`, `${list.length} case ${list.length === 1 ? 'study' : 'studies'} in full below.`]
      .join('\n\n') + '\n\n' + list.map((c) => caseMarkdown(c, base)).join('\n---\n\n');
  }

  const sectionsWithCases = () => categories.filter((cat) => casesFor(cat.slug).length);
  const sectionFileLines = (base) => sectionsWithCases().map((cat) => {
    const n = casesFor(cat.slug).length;
    return `- [${cat.name} — ${n} case ${n === 1 ? 'study' : 'studies'} in full](${base}/tag/${cat.slug}.md)`;
  }).join('\n');

  function llmsTxt(base) {
    const sections = categories.map((cat) => {
      const list = casesFor(cat.slug);
      if (!list.length) return '';
      return `## ${cat.name}\n\n${cat.description}\n\n` + list.map((c) => `- [${c.title}](${base}/case/${c.id}.md): ${c.description}`).join('\n');
    }).filter(Boolean).join('\n\n');
    return `# ${SITE_NAME}\n\n> ${SITE_TAGLINE} Each case study link below is its plain-text version. To read many at once, use the per-section files (each holds the complete text of every case study in that section) or the whole site in one very long file: ${base}/llms-full.txt (the same content as one web page: ${base}/?full=1)\n\n## Full text by section\n\n${sectionFileLines(base)}\n\n${sections}\n`;
  }

  function llmsFullTxt(base) {
    const kchars = Math.round(cases.reduce((n, c) => n + caseMarkdown(c, base).length, 0) / 1000);
    return `# ${SITE_NAME}\n\n> ${SITE_TAGLINE}\n\nThis file holds every case study in full and is very long (about ${kchars},000 characters). If your tool cuts long files short, read one section at a time instead — each of these files has the complete text of every case study in that section:\n\n${sectionFileLines(base)}\n\n---\n\n`
      + cases.map((c) => caseMarkdown(c, base)).join('\n---\n\n');
  }

  function sitemapXml(base) {
    const urls = ['/', ...categories.map((c) => `/tag/${c.slug}`), ...cases.map((c) => `/case/${c.id}`)];
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
      + urls.map((u) => `  <url><loc>${esc(base + u)}</loc></url>`).join('\n') + '\n</urlset>\n';
  }

  const robotsTxt = (base) => `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`;

  // ---------- page shell: the real index.html with the page's HTML filled in ----------
  const template = fs.readFileSync(path.join(PUBLIC_DIR, 'index.html'), 'utf8');
  const FOOTER_LINE = '<p>Click any category to browse its case studies.</p>';
  const anchors = [
    `<title>${SITE_NAME}</title>`, '<main id="app" class="container"></main>', '</head>',
    'href="style.css"', 'src="data.js"', 'src="app.js"', FOOTER_LINE,
  ];
  for (const a of anchors) if (!template.includes(a)) throw new Error('index.html is missing: ' + a);
  if (!/<meta name="description" content="[^"]*" \/>/.test(template)) throw new Error('index.html is missing the description meta tag');

  function page({ title, description, path: urlPath, body, base, alternate, app = true }) {
    const fullTitle = title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;
    const desc = String(description || SITE_TAGLINE).slice(0, 300);
    const head = `<link rel="canonical" href="${esc(base + urlPath)}" />\n`
      + (alternate ? `<link rel="alternate" type="text/markdown" href="${esc(base + alternate)}" />\n` : '')
      + `<link rel="alternate" type="text/plain" href="${esc(base)}/llms.txt" title="Plain-text index of every case study" />\n</head>`;
    const aiLine = `${FOOTER_LINE}\n      <p>Reading this with an AI tool? Everything on one page: <a href="/?full=1">${esc(base)}/?full=1</a> · plain text: <a href="/llms.txt">${esc(base)}/llms.txt</a></p>`;
    return template
      .replace(`<title>${SITE_NAME}</title>`, `<title>${esc(fullTitle)}</title>`)
      .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(desc)}" />`)
      .replace('</head>', head)
      .replace('<main id="app" class="container"></main>', `<main id="app" class="container">${body}</main>`)
      .replace(FOOTER_LINE, aiLine)
      .replace('href="style.css"', 'href="/style.css"')
      .replace('<script src="data.js"></script>', app ? '<script src="/data.js"></script>' : '')
      .replace('<script src="app.js"></script>', app ? '<script src="/app.js"></script>' : '');
  }

  return {
    categories, cases, caseById, categoryBySlug,
    homePage: (base) => page({ title: SITE_NAME, description: SITE_TAGLINE, path: '/', body: renderer.home(), base }),
    tagPage: (cat, base) => page({ title: cat.name, description: cat.description, path: `/tag/${cat.slug}`, body: renderer.tag(cat.slug), base, alternate: `/tag/${cat.slug}.md` }),
    casePage: (cs, base) => page({ title: cs.title, description: cs.description, path: `/case/${cs.id}`, body: renderer.caseStudy(cs.id), base, alternate: `/case/${cs.id}.md` }),
    notFoundPage: (base) => page({ title: 'Not found', description: SITE_TAGLINE, path: '/', body: '<div class="empty-state">Page not found. <a href="/">Back to all case studies</a></div>', base }),
    homeFullPage: (base) => page({ title: SITE_NAME, description: SITE_TAGLINE, path: '/', body: fullHomeBody(), base, app: false }),
    tagFullPage: (cat, base) => page({ title: cat.name, description: cat.description, path: `/tag/${cat.slug}`, body: fullTagBody(cat), base, alternate: `/tag/${cat.slug}.md`, app: false }),
    caseMarkdown, tagMarkdown, llmsTxt, llmsFullTxt, sitemapXml, robotsTxt,
  };
}

module.exports = { create };
