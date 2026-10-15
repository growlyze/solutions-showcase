function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function casesForTag(slug) {
  return CASE_STUDIES.filter((c) => c.tags.includes(slug));
}

// A logo ref is { file: 'logos/x.png', fill?: true } (official asset shipped locally) or
// { logo: 'slug' } (simpleicons.org brand slug, used where no reusable official file exists).
// `fill: true` means the image already has its own solid background baked in, so it's drawn
// edge-to-edge with no extra badge behind it; otherwise it sits inset on a white backing tile.
function logoBadgeHtml(ref) {
  const src = ref.file ? escapeHtml(ref.file) : `https://cdn.simpleicons.org/${escapeHtml(ref.logo)}`;
  const alt = escapeHtml(ref.file || ref.logo);
  if (ref.fill) {
    return `<img class="brand-logo brand-logo-fill" src="${src}" alt="${alt}" loading="lazy" />`;
  }
  return `<span class="logo-badge"><img class="brand-logo" src="${src}" alt="${alt}" loading="lazy" /></span>`;
}

// Small inline icon used in tag pills — multiple logos share one compact box there.
function iconHtml(cat) {
  if (cat.logos && cat.logos.length) {
    const badges = cat.logos.map((ref) => logoBadgeHtml(ref)).join('');
    return `<span class="logo-row" data-fallback-emoji="${cat.icon}">${badges}</span>`;
  }
  if (cat.logoFile) {
    return `<span data-fallback-emoji="${cat.icon}">${logoBadgeHtml({ file: cat.logoFile, fill: cat.fill })}</span>`;
  }
  if (cat.logo) {
    return `<span data-fallback-emoji="${cat.icon}">${logoBadgeHtml({ logo: cat.logo })}</span>`;
  }
  return `<span class="emoji-icon">${cat.icon}</span>`;
}

// One full-size tile for a single logo ref (or the category emoji as fallback).
// `tint` only shows through on the emoji fallback — a logo image covers the tile either way.
function iconTileHtml(ref, fallbackEmoji, tint) {
  const tintClass = tint ? ` tint-${tint}` : '';
  if (!ref) return `<div class="card-icon${tintClass}"><span class="emoji-icon">${fallbackEmoji}</span></div>`;
  return `<div class="card-icon${tintClass}" data-fallback-emoji="${fallbackEmoji}">${logoBadgeHtml(ref)}</div>`;
}

// Icon area for the big card/category-header context: a category with multiple logos
// (e.g. Make & Zapier) gets one separate tile per logo, side by side, instead of
// squeezing both brand marks into a single box.
function cardIconAreaHtml(cat) {
  if (cat.logos && cat.logos.length) {
    return `<div class="card-icon-group">${cat.logos.map((ref) => iconTileHtml(ref, cat.icon, cat.tint)).join('')}</div>`;
  }
  if (cat.logoFile) {
    return iconTileHtml({ file: cat.logoFile, fill: cat.fill }, cat.icon, cat.tint);
  }
  if (cat.logo) {
    return iconTileHtml({ logo: cat.logo }, cat.icon, cat.tint);
  }
  return iconTileHtml(null, cat.icon, cat.tint);
}

// If a brand logo image fails to load (offline, CDN hiccup, unknown slug),
// swap it for the category's emoji so the UI never shows a broken image.
function attachLogoFallbacks(root) {
  root.querySelectorAll('img.brand-logo').forEach((img) => {
    img.addEventListener('error', () => {
      const wrapper = img.closest('[data-fallback-emoji]') || img.parentElement;
      const emoji = wrapper ? wrapper.getAttribute('data-fallback-emoji') : null;
      if (img.classList.contains('brand-logo-fill')) {
        img.remove();
      } else {
        img.closest('.logo-badge')?.remove();
      }
      if (emoji && wrapper && !wrapper.querySelector('.emoji-icon')) {
        wrapper.insertAdjacentHTML('beforeend', `<span class="emoji-icon">${emoji}</span>`);
      }
    }, { once: true });
  });
}

// A lone card becomes a full-width row and two cards split the row, so a
// section never shows empty space around a single small card.
function gridClass(count) {
  if (count === 1) return 'grid grid--solo';
  if (count === 2) return 'grid grid--duo';
  return 'grid';
}

function categoryCardHtml(cat, solo) {
  return `
    <a class="card${solo ? ' card--row' : ''}" href="#/tag/${cat.slug}">
      ${cardIconAreaHtml(cat)}
      <h3>${escapeHtml(cat.name)}</h3>
      <p>${escapeHtml(cat.description)}</p>
      <span class="card-cta">View projects <span aria-hidden="true">&rarr;</span></span>
    </a>
  `;
}

function renderHome() {
  const app = document.getElementById('app');

  const sections = GROUPS.map((group) => {
    const cats = CATEGORIES.filter((c) => c.group === group.key);
    if (!cats.length) return '';
    return `
      <section class="category-section">
        <h2 class="section-title">${escapeHtml(group.title)}</h2>
        <div class="${gridClass(cats.length)}">${cats.map((c) => categoryCardHtml(c, cats.length === 1)).join('')}</div>
      </section>
    `;
  }).join('');

  app.innerHTML = sections;
  attachLogoFallbacks(app);
}

function renderCategory(slug) {
  const app = document.getElementById('app');
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    app.innerHTML = `
      <a class="back-link" href="#/">&larr; Back to all categories</a>
      <div class="empty-state">Category not found.</div>
    `;
    return;
  }

  const cases = casesForTag(slug);
  const cardsHtml = cases.length
    ? cases.map((cs) => {
        const tags = cs.tags
          .map((t) => CATEGORIES.find((c) => c.slug === t))
          .filter(Boolean)
          .map((c) => `<span class="tag-pill">${iconHtml(c)} ${escapeHtml(c.name)}</span>`)
          .join('');
        const hasContent = cs.content && cs.content.length;
        const href = hasContent ? `#/case/${cs.id}` : cs.url;
        const linkAttrs = hasContent ? '' : ' target="_blank" rel="noopener noreferrer"';
        const ctaLabel = hasContent ? 'Read case study' : 'Open case study';
        const ctaIcon = hasContent ? '&rarr;' : '&nearr;';
        return `
          <a class="card${cases.length === 1 ? ' card--row card--row-case' : ''}" href="${escapeHtml(href)}"${linkAttrs}>
            <h3>${escapeHtml(cs.title)}</h3>
            <p>${escapeHtml(cs.description)}</p>
            <div class="tag-row">${tags}</div>
            <span class="card-cta">${ctaLabel} <span aria-hidden="true">${ctaIcon}</span></span>
          </a>
        `;
      }).join('')
    : `<div class="empty-state">No case studies tagged here yet — more coming soon.</div>`;

  app.innerHTML = `
    <a class="back-link" href="#/">&larr; Back to all categories</a>
    <div class="category-header">
      ${cardIconAreaHtml(category)}
      <div>
        <h1>${escapeHtml(category.name)}</h1>
        <p>${escapeHtml(category.description)}</p>
      </div>
    </div>
    <div class="${gridClass(cases.length)}">${cardsHtml}</div>
  `;
  attachLogoFallbacks(app);
}

// List items written as "Term: explanation" are bolded up to the colon so a
// long list can be scanned by its terms instead of read line by line.
function splitLeadIn(text) {
  const m = String(text).match(/^([^:]{2,60}):\s+(\S[\s\S]*)$/);
  return m && m[1].trim().split(/\s+/).length <= 8 ? m : null;
}

// A single bold item in an otherwise plain list looks like a mistake, so terms
// are only bolded when at least half of the list's items are written that way.
function listHtml(items) {
  const bold = items.filter(splitLeadIn).length * 2 >= items.length;
  const li = (text) => {
    const m = bold && splitLeadIn(text);
    return `<li>${m ? `<strong>${escapeHtml(m[1])}:</strong> ${escapeHtml(m[2])}` : escapeHtml(text)}</li>`;
  };
  return `<ul class="content-list">${items.map(li).join('')}</ul>`;
}

function contentBlockHtml(block) {
  if (block.type === 'heading') return `<h3>${escapeHtml(block.text)}</h3>`;
  if (block.type === 'subheading') return `<h4>${escapeHtml(block.text)}</h4>`;
  if (block.type === 'eyebrow') return `<p class="content-eyebrow">${escapeHtml(block.text)}</p>`;
  if (block.type === 'label') return `<p class="content-label">${escapeHtml(block.text)}</p>`;
  if (block.type === 'img') {
    // When a figcaption is present it already serves as the text alternative,
    // so the img's own alt is left empty to avoid screen readers announcing
    // the same description twice.
    const caption = block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : '';
    const alt = block.caption ? '' : escapeHtml(block.file.split('/').pop());
    const label = escapeHtml(block.caption ? `Enlarge image: ${block.caption}` : 'Enlarge image');
    return `<figure class="content-figure"><img class="content-image" src="${escapeHtml(block.file)}" alt="${alt}" loading="lazy" tabindex="0" role="button" aria-label="${label}" />${caption}</figure>`;
  }
  if (block.type === 'list') {
    return listHtml(block.items);
  }
  if (block.type === 'stats') {
    return `<div class="content-stats">${block.items.map((s) => `<div class="stat-tile"><div class="stat-value">${escapeHtml(s.value)}</div><div class="stat-label">${escapeHtml(s.label)}</div></div>`).join('')}</div>`;
  }
  if (block.type === 'table') {
    const head = `<tr>${block.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr>`;
    const body = block.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('');
    return `<div class="content-table-wrap"><table class="content-table"><thead>${head}</thead><tbody>${body}</tbody></table></div>`;
  }
  if (block.type === 'code') {
    return `<pre class="content-code" tabindex="0"><code>${escapeHtml(block.text)}</code></pre>`;
  }
  if (block.type === 'quote') {
    return `<blockquote class="content-quote"><p>${escapeHtml(block.text)}</p><cite>${escapeHtml(block.attribution)}</cite></blockquote>`;
  }
  return `<p>${escapeHtml(block.text)}</p>`;
}

// Many case studies open with the same sentence that is used as the card
// description. Showing it in the header and again in the body reads as a bug,
// so the header summary is dropped whenever the body already says it.
function normalizeText(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function descriptionRepeatedInBody(cs) {
  const desc = normalizeText(cs.description).slice(0, 60);
  if (!desc) return false;
  return cs.content.some((block) => {
    const text = block.type === 'list' ? (block.items || []).join(' ') : block.text;
    return normalizeText(text).includes(desc);
  });
}

// "Works with" chips at the top of a case study. Only products that are named
// in the case study's own text (or that the case is filed under) are listed,
// so the box never claims anything the page does not already say.
const TOOL_PATTERNS = [
  ['Zapier', /\bZapier\b|\bZaps?\b/],
  ['Make', /\bMake\.com\b|\bMake scenario|\bMake automation|\bIntegromat\b/],
  ['n8n', /\bn8n\b/],
  ['ClickUp', /\bClickUp\b/],
  ['monday.com', /\b[Mm]onday\.com\b/],
  ['Airtable', /\bAirtable\b/],
  ['Notion', /\bNotion\b/],
  ['Google Sheets', /\bGoogle Sheets?\b/],
  ['Google Apps Script', /\bGoogle Apps Script\b|\bApps? Script\b/],
  ['Gmail', /\bGmail\b/],
  ['Google Calendar', /\bGoogle Calendar\b/],
  ['Google Drive', /\bGoogle Drive\b/],
  ['Google Analytics', /\bGoogle Analytics\b/],
  ['Google Ads', /\bGoogle Ads\b/],
  ['BigQuery', /\bBigQuery\b/],
  ['Looker Studio', /\bLooker Studio\b/],
  ['Power BI', /\bPower BI\b/],
  ['Shopify', /\bShopify\b/],
  ['Meta Ads', /\bMeta Ads\b|\bFacebook Ads\b/],
  ['Klaviyo', /\bKlaviyo\b/],
  ['HubSpot', /\bHubSpot\b/],
  ['GoHighLevel', /\bGo ?High ?Level\b/],
  ['Slack', /\bSlack\b/],
  ['WhatsApp', /\bWhatsApp\b/],
  ['Calendly', /\bCalendly\b/],
  ['Skool', /\bSkool\b/],
  ['Clearbit', /\bClearbit\b/],
  ['Firebase', /\bFirebase\b|\bFirestore\b/],
  ['MongoDB', /\bMongoDB\b/],
  ['Cloudinary', /\bCloudinary\b/],
  ['Placid', /\bPlacid\b/],
  ['DocuSign', /\bDocuSign\b/],
  ['Google Slides', /\bGoogle Slides\b/],
  ['TidyCal', /\bTidyCal\b/],
  ['Trello', /\bTrello\b/],
  ['Facebook', /\bFacebook\b(?! [Aa]ds?\b)/],
  ['LinkedIn', /\bLinkedIn\b/],
  ['LeadConnector', /\bLead ?Connector\b/],
  ['Close', /\bin Close\b|\bClose CRM\b/],
  ['Stripe', /\bStripe\b/],
  ['Supabase', /\bSupabase\b/],
  ['OpenAI', /\bOpenAI\b|\bGPT-?4\w*\b|\bChatGPT\b/],
  ['Claude', /\bClaude\b/],
  ['Gemini', /\bGemini\b/],
  ['Whisper', /\bWhisper\b/],
  ['Pinterest', /\bPinterest\b/],
  ['Instagram', /\bInstagram\b/],
  ['YouTube', /\bYouTube\b/],
  ['TikTok', /\bTikTok\b/],
  ['Amazon', /\bAmazon\b/],
  ['Beehiiv', /\bBeehiiv\b|\bBeehiv\b/],
  ['Lemlist', /\bLemlist\b/],
  ['Typeform', /\b[Tt]ypeform\b/],
  ['Aircall', /\bAircall\b/],
  ['Pinecone', /\bPinecone\b/],
  ['Python', /(?<![Nn]o )(?<!not )\bPython\b/],
  ['Node.js', /\bNode\.js\b/],
  ['Railway', /\bRailway\b/],
  ['Next.js', /\bNext\.js\b/],
  ['TypeScript', /\bTypeScript\b/],
  ['React', /\bReact\b/],
  ['PostgreSQL', /\bPostgre(SQL|s)\b/],
  ['SQL', /\bSQL\b/],
];

// The platform a case study is filed under is always one of the tools it works with.
const TAG_TOOLS = {
  zapier: 'Zapier',
  make: 'Make',
  n8n: 'n8n',
  clickup: 'ClickUp',
  monday: 'monday.com',
  airtable: 'Airtable',
  'power-bi': 'Power BI',
  'looker-studio': 'Looker Studio',
  'google-apps-script': 'Google Apps Script',
};

function caseText(cs) {
  const parts = [cs.title, cs.description];
  (cs.content || []).forEach((b) => {
    if (b.text) parts.push(b.text);
    if (b.caption) parts.push(b.caption);
    if (b.items) parts.push(b.items.map((i) => (typeof i === 'string' ? i : Object.values(i).join(' '))).join(' '));
    if (b.headers) parts.push(b.headers.join(' '));
    if (b.rows) parts.push(b.rows.map((r) => r.join(' ')).join(' '));
  });
  return parts.join('\n');
}

function toolsFor(cs) {
  // A case study can list its own tools (taken from its own "stack" table); that list is used as is
  // instead of matching names in the text, which also picks up products mentioned only as alternatives.
  if (Array.isArray(cs.tools)) return [...new Set([...cs.tags.map((t) => TAG_TOOLS[t]).filter(Boolean), ...cs.tools])];
  const text = caseText(cs);
  const found = [];
  TOOL_PATTERNS.forEach(([name, re]) => {
    const m = re.exec(text);
    if (m) found.push({ name, at: m.index });
  });
  const filedUnder = cs.tags.map((t) => TAG_TOOLS[t]).filter(Boolean);
  const names = new Set(filedUnder);
  found.sort((a, b) => a.at - b.at).forEach((f) => names.add(f.name));
  // "Meta Ads" already covers Facebook advertising, so don't list both.
  if (names.has('Meta Ads')) names.delete('Facebook');
  return [...names];
}

function quickFactsHtml(cs) {
  const tools = toolsFor(cs);
  if (!tools.length) return '';
  return `
        <div class="quick-facts">
          <span class="quick-facts-label">Works with</span>
          <ul class="quick-facts-list">${tools.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
        </div>`;
}

function renderCaseDetail(id) {
  const app = document.getElementById('app');
  const cs = CASE_STUDIES.find((c) => c.id === id);

  if (!cs || !cs.content) {
    app.innerHTML = `
      <a class="back-link" href="#/" data-back="smart">&larr; Back</a>
      <div class="empty-state">Case study not found.</div>
    `;
    return;
  }

  const tags = cs.tags
    .map((t) => CATEGORIES.find((c) => c.slug === t))
    .filter(Boolean)
    .map((c) => `<span class="tag-pill">${iconHtml(c)} ${escapeHtml(c.name)}</span>`)
    .join('');

  app.innerHTML = `
    <div class="case-detail-wrap">
      <a class="back-link" href="#/" data-back="smart">&larr; Back</a>
      <div class="case-detail-header">
        <h1>${escapeHtml(cs.title)}</h1>
        ${descriptionRepeatedInBody(cs) ? '' : `<p>${escapeHtml(cs.description)}</p>`}
        <div class="tag-row">${tags}</div>${quickFactsHtml(cs)}
      </div>
      <div class="case-detail-content">
        ${cs.content.map(contentBlockHtml).join('')}
      </div>
    </div>
  `;
  attachLogoFallbacks(app);
}

function router() {
  const hash = window.location.hash || '#/';
  const tagMatch = hash.match(/^#\/tag\/([a-z0-9-]+)$/i);
  const caseMatch = hash.match(/^#\/case\/([a-z0-9-]+)$/i);

  if (caseMatch) {
    renderCaseDetail(caseMatch[1]);
  } else if (tagMatch) {
    renderCategory(tagMatch[1]);
  } else {
    renderHome();
  }
  window.scrollTo(0, 0);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
  try { localStorage.setItem('theme', theme); } catch (e) {}
}

function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  applyTheme(saved === 'dark' ? 'dark' : 'light');

  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-back="smart"]');
  if (!link) return;
  e.preventDefault();
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.hash = '#/';
  }
});

// Click (or Enter/Space) on a screenshot opens it full size; many are dense
// dashboards or workflow diagrams that are unreadable at column width.
let lightboxReturnFocus = null;

function closeLightbox() {
  const box = document.querySelector('.lightbox');
  if (!box) return;
  box.remove();
  document.body.classList.remove('lightbox-open');
  if (lightboxReturnFocus && document.contains(lightboxReturnFocus)) lightboxReturnFocus.focus();
  lightboxReturnFocus = null;
}

function openLightbox(img) {
  closeLightbox();
  lightboxReturnFocus = img;
  const caption = img.closest('figure')?.querySelector('figcaption')?.textContent || '';
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', caption || 'Enlarged image');
  box.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close enlarged image">&times;</button>
    <img class="lightbox-img" src="${escapeHtml(img.currentSrc || img.src)}" alt="${escapeHtml(caption)}" />
    ${caption ? `<p class="lightbox-caption">${escapeHtml(caption)}</p>` : ''}`;
  document.body.appendChild(box);
  document.body.classList.add('lightbox-open');
  box.querySelector('.lightbox-close').focus();
}

document.addEventListener('click', (e) => {
  if (e.target.closest('.lightbox-close') || (e.target.closest('.lightbox') && !e.target.closest('.lightbox-img'))) {
    closeLightbox();
    return;
  }
  const img = e.target.closest('.content-image');
  if (img) openLightbox(img);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('content-image')) {
    e.preventDefault();
    openLightbox(e.target);
  }
});

window.addEventListener('hashchange', closeLightbox);
window.addEventListener('hashchange', router);
// The server also answers /case/<id> and /tag/<slug> with a page whose HTML already holds the
// text (that is what crawlers and AI tools read). People who open one of those addresses get
// the same page through the app: the address is rewritten to its #/ form before anything draws.
function adoptPathRoute() {
  const m = window.location.pathname.match(/^\/(case|tag)\/([a-z0-9-]+)\/?$/i);
  if (m && !window.location.hash) window.history.replaceState(null, '', `/#/${m[1]}/${m[2]}`);
}

window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  adoptPathRoute();
  router();
});
