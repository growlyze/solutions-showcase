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
const SITE_TAGLINE = 'Browse case studies by tool and use case: automations, AI agents, dashboards, and custom platforms.';

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
    `${dataSrc}\n${appSrc}\n;globalThis.__api = { CATEGORIES, CASE_STUDIES, renderHome, renderCategory, renderCaseDetail, toolsFor };`,
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
      case 'stats': return `<ul>${b.items.map((x) => `<li>${esc(x.value)}: ${esc(x.label)}</li>`).join('')}</ul>`;
      case 'table': return `<table><thead><tr>${b.headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
      case 'code': return `<pre><code>${esc(b.text)}</code></pre>`;
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

  // Contents: section names and case study titles. For the whole-site page each title links to the
  // part it is in (partOf maps a case study id to its part number).
  const contentsHtml = (cats, partOf) => cats.map((cat) => {
    const list = casesFor(cat.slug);
    if (!list.length) return '';
    const item = (c) => {
      const n = partOf ? partOf.get(c.id) : 1;
      const href = n > 1 ? `/full/part-${n}#case-${esc(c.id)}` : `#case-${esc(c.id)}`;
      return `<li><a href="${href}">${esc(c.title)}</a>${n > 1 ? ` (part ${n})` : ''}</li>`;
    };
    return `<h3>${esc(cat.name)}</h3><ul>${list.map(item).join('')}</ul>`;
  }).join('');

  // The whole site is about 230,000 characters and many fetch tools read only about the first 100,000
  // at a time. So the same content is also cut into parts that each fit in one read, shortest case
  // studies first. /full is the whole thing on one page; /full/part-<n> are the parts.
  const PART_BUDGET = 88000; // visible characters per part, comfortably under 100,000
  const textLen = (html) => html.replace(/<[^>]+>/g, '').length;
  let partsCache = null;
  function fullParts() {
    if (partsCache) return partsCache;
    const articles = cases.map((c) => ({ c, html: articleHtml(c) })).sort((x, y) => textLen(x.html) - textLen(y.html));
    const contents = contentsHtml(categories);
    const parts = [];
    let current = [], used = textLen(contents) + 1500; // part 1 also carries the intro and contents
    for (const art of articles) {
      const n = textLen(art.html);
      if (current.length && used + n > PART_BUDGET) { parts.push(current); current = []; used = 600; }
      current.push(art); used += n;
    }
    if (current.length) parts.push(current);
    const partOf = new Map();
    parts.forEach((list, i) => list.forEach((art) => partOf.set(art.c.id, i + 1)));
    partsCache = { parts, partOf };
    return partsCache;
  }

  const partLinksHtml = (current) => {
    const { parts } = fullParts();
    return parts.map((list, i) => {
      const n = i + 1;
      const label = `Part ${n} of ${parts.length} (${list.length} case ${list.length === 1 ? 'study' : 'studies'})`;
      return n === current ? `<li>${label} (this page)</li>` : `<li><a href="/full/part-${n}">${label}</a></li>`;
    }).join('');
  };

  function fullHomeBody() {
    const { parts, partOf } = fullParts();
    const all = parts.flat();
    const kchars = Math.round(all.reduce((n, art) => n + textLen(art.html), 0) / 1000);
    return `<h1>${SITE_NAME}</h1><p>${esc(SITE_TAGLINE)}</p>`
      + `<p>This is the complete text of the site: a contents list naming every section and case study, then all ${cases.length} case studies in full, ordered from shortest to longest. Each section also has its own page at /full/&lt;section&gt;.</p>`
      + `<p><strong>If your tool shows only the first part of this page:</strong> the page is about ${kchars},000 characters and some tools read only the first 100,000 at a time. The same content is also split into ${parts.length} parts that each fit in one read. What you have read so far matches Part 1; continue with the next part:</p>`
      + `<ul>${partLinksHtml(0)}</ul>`
      + `<h2>Contents</h2>${contentsHtml(categories, partOf)}<h2>Case studies in full</h2>${all.map((art) => art.html).join('')}`;
  }

  function fullPartBody(n) {
    const { parts, partOf } = fullParts();
    const next = n < parts.length ? `<p>End of part ${n} of ${parts.length}. Continue with <a href="/full/part-${n + 1}">part ${n + 1}</a>.</p>` : `<p>End of part ${n} of ${parts.length}: that is the complete text of the site.</p>`;
    const head = n === 1
      ? `<h1>${SITE_NAME}: part 1 of ${parts.length}</h1><p>${esc(SITE_TAGLINE)}</p><p>The complete text of the site in ${parts.length} parts, shortest case studies first. Parts:</p><ul>${partLinksHtml(1)}</ul><h2>Contents (every section and case study)</h2>${contentsHtml(categories, partOf)}`
      : `<h1>${SITE_NAME}: part ${n} of ${parts.length}</h1><p>The complete text of the site in ${parts.length} parts. Parts:</p><ul>${partLinksHtml(n)}</ul><p><a href="/full/part-1">Part 1</a> has the contents list of every section and case study.</p>`;
    return `${head}<h2>Case studies in full</h2>${parts[n - 1].map((art) => art.html).join('')}${next}`;
  }

  function fullTagBody(cat) {
    const list = casesFor(cat.slug);
    return `<p><a href="/full">&larr; All case studies</a></p><h1>${esc(cat.name)}</h1><p>${esc(cat.description)}</p>`
      + `<p>All ${list.length} case ${list.length === 1 ? 'study' : 'studies'} in this section follow in full.</p>`
      + `<h2>Contents</h2>${contentsHtml([cat])}<h2>Case studies in full</h2>${list.map(articleHtml).join('')}`;
  }

  // ---------- Directory page: what AI tools get at the main link ----------
  // Section by section, so a tool can pick the section a question is about and fetch only that
  // (/full/<section>), instead of receiving the whole site at once (/full still has everything).
  function directoryBody(base) {
    const sections = sectionsWithCases().map((cat) => {
      const list = casesFor(cat.slug);
      const url = `${base}/full/${cat.slug}`;
      return `<section><h3><a href="/full/${esc(cat.slug)}">${esc(cat.name)}</a></h3><p>${esc(cat.description)}</p>`
        + `<p>${list.length} case ${list.length === 1 ? 'study' : 'studies'}. Full text of this section: <a href="/full/${esc(cat.slug)}">${esc(url)}</a> (plain text: <a href="/tag/${esc(cat.slug)}.md">${esc(base)}/tag/${esc(cat.slug)}.md</a>)</p>`
        + `<ul>${list.map((c) => `<li><a href="/case/${esc(c.id)}">${esc(c.title)}</a>: ${esc(c.description)}</li>`).join('')}</ul></section>`;
    }).join('');

    // tool -> case studies, from the same detection that fills each case study's "Works with" box
    const byTool = new Map();
    cases.forEach((c) => renderer.api.toolsFor(c).forEach((t) => { if (!byTool.has(t)) byTool.set(t, []); byTool.get(t).push(c); }));
    const tools = [...byTool.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
    const toolIndex = tools.map(([name, list]) =>
      `<li><strong>${esc(name)}</strong> (${list.length}): ${list.map((c) => `<a href="/case/${esc(c.id)}">${esc(c.title)}</a>`).join('; ')}</li>`).join('');

    return `<h1>${SITE_NAME}</h1><p>${esc(SITE_TAGLINE)}</p>`
      + `<p><strong>How to use this page:</strong> it lists every section and every case study (${cases.length} in total). Each section has its own page with the complete text of all its case studies, so you can read one topic at a time: use the address under the section name. Every case study also has its own page. To read the whole site in one page instead, use <a href="/full">${esc(base)}/full</a>.</p>`
      + `<h2>Sections</h2>${sections}`
      + `<h2>Find case studies by tool</h2><p>Tools named in the case studies, with the case studies that use each one (for example WhatsApp, Slack, Stripe, Google Sheets):</p><ul>${toolIndex}</ul>`
      + `<p>Everything on one page: <a href="/full">${esc(base)}/full</a> · plain-text index: <a href="/llms.txt">${esc(base)}/llms.txt</a></p>`;
  }

  // ---------- Markdown / plain text ----------
  function blockMd(b, base) {
    switch (b.type) {
      case 'heading': case 'eyebrow': return `## ${b.text}`;
      case 'subheading': return `### ${b.text}`;
      case 'label': return `**${b.text}**`;
      case 'list': return b.items.map((i) => `- ${itemText(i)}`).join('\n');
      case 'img': return `Image${b.caption ? `: ${b.caption}` : ''} (${base}/${b.file})`;
      case 'stats': return b.items.map((s) => `- ${s.value}: ${s.label}`).join('\n');
      case 'table': {
        const row = (r) => `| ${r.map((c) => String(c).replace(/\|/g, '/').replace(/\n/g, ' ')).join(' | ')} |`;
        return [row(b.headers), row(b.headers.map(() => '---')), ...b.rows.map(row)].join('\n');
      }
      case 'code': return '```' + (b.language || '') + '\n' + b.text + '\n```';
      case 'quote': return `> ${b.text}\n> ${b.attribution}`;
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
    return `- [${cat.name} (${n} case ${n === 1 ? 'study' : 'studies'} in full)](${base}/tag/${cat.slug}.md)`;
  }).join('\n');

  function llmsTxt(base) {
    const sections = categories.map((cat) => {
      const list = casesFor(cat.slug);
      if (!list.length) return '';
      return `## ${cat.name}\n\n${cat.description}\n\n` + list.map((c) => `- [${c.title}](${base}/case/${c.id}.md): ${c.description}`).join('\n');
    }).filter(Boolean).join('\n\n');
    return `# ${SITE_NAME}\n\n> ${SITE_TAGLINE} Each case study link below is its plain-text version. To read many at once, use the per-section files (each holds the complete text of every case study in that section) or the whole site in one very long file: ${base}/llms-full.txt (the same content as one web page: ${base}/full, also in parts that each fit in one read: ${base}/full/part-1, ${base}/full/part-2 and so on)\n\n## Full text by section\n\n${sectionFileLines(base)}\n\n${sections}\n`;
  }

  function llmsFullTxt(base) {
    const kchars = Math.round(cases.reduce((n, c) => n + caseMarkdown(c, base).length, 0) / 1000);
    return `# ${SITE_NAME}\n\n> ${SITE_TAGLINE}\n\nThis file holds every case study in full and is very long (about ${kchars},000 characters). If your tool cuts long files short, read one section at a time instead. Each of these files has the complete text of every case study in that section:\n\n${sectionFileLines(base)}\n\n---\n\n`
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
    const aiLine = `${FOOTER_LINE}\n      <p>Reading this with an AI tool? One section: <a href="/full/ai-whatsapp">${esc(base)}/full/&lt;section&gt;</a> (for example /full/ai-whatsapp) · everything on one page: <a href="/full">${esc(base)}/full</a> · plain text: <a href="/llms.txt">${esc(base)}/llms.txt</a></p>`;
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
    directoryPage: (base) => page({ title: SITE_NAME, description: SITE_TAGLINE, path: '/', body: directoryBody(base), base, app: false }),
    fullPartCount: () => fullParts().parts.length,
    fullPartPage: (n, base) => page({ title: `${SITE_NAME}: part ${n} of ${fullParts().parts.length}`, description: SITE_TAGLINE, path: `/full/part-${n}`, body: fullPartBody(n), base, app: false }),
    tagFullPage: (cat, base) => page({ title: cat.name, description: cat.description, path: `/tag/${cat.slug}`, body: fullTagBody(cat), base, alternate: `/tag/${cat.slug}.md`, app: false }),
    caseMarkdown, tagMarkdown, llmsTxt, llmsFullTxt, sitemapXml, robotsTxt,
  };
}

module.exports = { create };
