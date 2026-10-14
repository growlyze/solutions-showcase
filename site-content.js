// Turns the case-study data (public/data.js) into plain HTML and plain text that
// crawlers and AI tools can read without running JavaScript. The browser app
// still draws the real pages; this is what the server sends first.

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, 'public');
const SITE_NAME = 'Solutions Showcase';
const SITE_TAGLINE = 'Browse case studies by tool and use case — automations, AI agents, dashboards, and custom platforms.';

function loadData() {
  const src = fs.readFileSync(path.join(PUBLIC_DIR, 'data.js'), 'utf8');
  return new Function(src + ';return { CATEGORIES, GROUPS, CASE_STUDIES };')();
}

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const itemText = (i) => (typeof i === 'string' ? i : Object.values(i).join(' '));
const normalize = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

function create() {
  const data = loadData();
  const categories = data.CATEGORIES;
  const cases = data.CASE_STUDIES.filter((c) => c.content && c.content.length);
  const caseById = new Map(cases.map((c) => [c.id, c]));
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
  const casesFor = (slug) => cases.filter((c) => c.tags.includes(slug));
  const categoriesOf = (cs) => cs.tags.map((t) => categoryBySlug.get(t)).filter(Boolean);

  // The header summary is skipped on the page when the body already says it (same rule as the app).
  const descriptionRepeated = (cs) => {
    const d = normalize(cs.description).slice(0, 60);
    if (!d) return false;
    return cs.content.some((b) => normalize(b.type === 'list' ? (b.items || []).map(itemText).join(' ') : b.text).includes(d));
  };

  // ---------- HTML ----------
  function blockHtml(b) {
    switch (b.type) {
      case 'heading': case 'eyebrow': return `<h2>${esc(b.text)}</h2>`;
      case 'subheading': return `<h3>${esc(b.text)}</h3>`;
      case 'label': return `<p><strong>${esc(b.text)}</strong></p>`;
      case 'list': return `<ul>${b.items.map((i) => `<li>${esc(itemText(i))}</li>`).join('')}</ul>`;
      case 'img': return `<figure><img src="/${esc(b.file)}" alt="${esc(b.caption || '')}" loading="lazy">${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ''}</figure>`;
      case 'stats': return `<ul>${b.items.map((s) => `<li>${esc(s.value)} — ${esc(s.label)}</li>`).join('')}</ul>`;
      case 'table': return `<table><thead><tr>${b.headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
      case 'quote': return `<blockquote><p>${esc(b.text)}</p><footer>${esc(b.attribution)}</footer></blockquote>`;
      default: return `<p>${esc(b.text)}</p>`;
    }
  }

  const caseListHtml = (list) => `<ul>${list.map((c) => `<li><a href="/case/${esc(c.id)}">${esc(c.title)}</a> — ${esc(c.description)}</li>`).join('')}</ul>`;

  // The home page keeps this index in the page for good (screen-reader-only, so it does not change
  // what people see). It is plain, present text for anything that reads the page, whether or not it
  // runs JavaScript or applies CSS, and it gives screen-reader users a full site index.
  function homeIndex(base) {
    const sections = categories.map((cat) => {
      const list = casesFor(cat.slug);
      return `<section><h2><a href="/tag/${esc(cat.slug)}">${esc(cat.name)}</a></h2><p>${esc(cat.description)}</p>${list.length ? caseListHtml(list) : ''}</section>`;
    }).join('');
    return `<section class="sr-only" aria-label="All case studies"><h1>${SITE_NAME}</h1><p>${esc(SITE_TAGLINE)}</p>`
      + `<p>This page lists every section and case study with a short summary. The complete written text is available as plain text, one file per section (below), or everything in one very long file: <a href="/llms-full.txt">${esc(base)}/llms-full.txt</a>. Each case study also has its own page and a markdown version, linked in the sections after the list.</p>`
      + `<h2>Complete text by section</h2><ul>${sectionsWithCases().map((cat) => { const n = casesFor(cat.slug).length; return `<li><a href="/tag/${esc(cat.slug)}.md">${esc(cat.name)} — all ${n} case ${n === 1 ? 'study' : 'studies'} in full</a></li>`; }).join('')}</ul>${sections}</section>`;
  }

  function tagBody(cat) {
    return `<div class="ssr"><p><a href="/">&larr; All categories</a></p><h1>${esc(cat.name)}</h1><p>${esc(cat.description)}</p>${caseListHtml(casesFor(cat.slug))}<p>The complete text of every case study in this section is in <a href="/tag/${esc(cat.slug)}.md">/tag/${esc(cat.slug)}.md</a>.</p></div>`;
  }

  function caseBody(cs) {
    const cats = categoriesOf(cs).map((c) => `<a href="/tag/${esc(c.slug)}">${esc(c.name)}</a>`).join(', ');
    return `<div class="ssr"><p><a href="/">&larr; All categories</a></p><h1>${esc(cs.title)}</h1>`
      + (descriptionRepeated(cs) ? '' : `<p>${esc(cs.description)}</p>`)
      + (cats ? `<p>Section: ${cats}</p>` : '')
      + cs.content.map(blockHtml).join('')
      + `<p><a href="/case/${esc(cs.id)}.md">Plain-text version of this case study</a></p></div>`;
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
    return `# ${SITE_NAME}\n\n> ${SITE_TAGLINE} Each case study link below is its plain-text version. To read many at once, use the per-section files (each holds the complete text of every case study in that section) or the whole site in one very long file: ${base}/llms-full.txt\n\n## Full text by section\n\n${sectionFileLines(base)}\n\n${sections}\n`;
  }

  function llmsFullTxt(base) {
    return `# ${SITE_NAME}\n\n> ${SITE_TAGLINE}\n\nThis file holds every case study in full and is very long (about ${Math.round(cases.reduce((n, c) => n + caseMarkdown(c, base).length, 0) / 1000)},000 characters). If your tool cuts long files short, read one section at a time instead — each of these files has the complete text of every case study in that section:\n\n${sectionFileLines(base)}\n\n---\n\n` + cases.map((c) => caseMarkdown(c, base)).join('\n---\n\n');
  }

  function sitemapXml(base) {
    const urls = ['/', ...categories.map((c) => `/tag/${c.slug}`), ...cases.map((c) => `/case/${c.id}`)];
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
      + urls.map((u) => `  <url><loc>${esc(base + u)}</loc></url>`).join('\n') + '\n</urlset>\n';
  }

  const robotsTxt = (base) => `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`;

  // ---------- page shell: the real index.html with content filled in ----------
  const template = fs.readFileSync(path.join(PUBLIC_DIR, 'index.html'), 'utf8');
  const anchors = [
    `<title>${SITE_NAME}</title>`,
    '<main id="app" class="container"></main>',
    '</head>',
    'href="style.css"', 'src="data.js"', 'src="app.js"',
  ];
  for (const a of anchors) if (!template.includes(a)) throw new Error('index.html is missing: ' + a);
  if (!/<meta name="description" content="[^"]*" \/>/.test(template)) throw new Error('index.html is missing the description meta tag');

  // .ssr: the text inside #app that the browser app replaces on load. It is made transparent (never
  // display:none or visibility:hidden, which text extractors skip) so it does not flash on screen.
  // .sr-only: text that stays in the page but off-screen (the home page index).
  // Without JavaScript both simply show.
  const SHOW_STYLE = '<style>'
    + '.ssr{opacity:0;pointer-events:none}'
    + '.sr-only{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);border:0}'
    + '.sr-only:focus-within{position:static;width:auto;height:auto;margin:24px auto;overflow:visible;clip:auto;max-width:1100px;padding:0 24px}'
    + '</style>\n'
    + '<noscript><style>.ssr{opacity:1;pointer-events:auto}.sr-only{position:static;width:auto;height:auto;margin:24px auto;overflow:visible;clip:auto;max-width:1100px;padding:0 24px}</style></noscript>\n';

  function page({ title, description, path: urlPath, body, afterMain = '', base, alternate }) {
    const fullTitle = title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;
    const desc = String(description || SITE_TAGLINE).slice(0, 300);
    const head = `<link rel="canonical" href="${esc(base + urlPath)}" />\n`
      + (alternate ? `<link rel="alternate" type="text/markdown" href="${esc(base + alternate)}" />\n` : '')
      + SHOW_STYLE + '</head>';
    return template
      .replace(`<title>${SITE_NAME}</title>`, `<title>${esc(fullTitle)}</title>`)
      .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(desc)}" />`)
      .replace('</head>', head)
      .replace('<main id="app" class="container"></main>', `<main id="app" class="container">${body}</main>${afterMain}`)
      .replace('href="style.css"', 'href="/style.css"')
      .replace('src="data.js"', 'src="/data.js"')
      .replace('src="app.js"', 'src="/app.js"');
  }

  return {
    categories, cases, caseById, categoryBySlug,
    homePage: (base) => page({ title: SITE_NAME, description: SITE_TAGLINE, path: '/', body: '', afterMain: homeIndex(base), base }),
    tagPage: (cat, base) => page({ title: cat.name, description: cat.description, path: `/tag/${cat.slug}`, body: tagBody(cat), base, alternate: `/tag/${cat.slug}.md` }),
    casePage: (cs, base) => page({ title: cs.title, description: cs.description, path: `/case/${cs.id}`, body: caseBody(cs), base, alternate: `/case/${cs.id}.md` }),
    notFoundPage: (base) => page({ title: 'Not found', description: SITE_TAGLINE, path: '/', body: `<div class="ssr"><h1>Page not found</h1><p><a href="/">Back to all case studies</a></p></div>`, base }),
    caseMarkdown, tagMarkdown, llmsTxt, llmsFullTxt, sitemapXml, robotsTxt,
  };
}

module.exports = { create };
