// Notion-style editing of case studies for the site's admin (browser only; the server never runs
// this file). It is loaded only by the authenticated /admin workspace.
//
// Logged in, a case study page gets an "Edit" button. Edit mode draws the same page with every
// piece of text editable in place:
//  - a cover photo and a page icon, like a Notion page
//  - blocks you can add (+ or "/"), drag to reorder, duplicate, delete or turn into another type
//  - bold, italic, strikethrough, inline code and links (select text, or Ctrl+B / I / K / E)
//  - pasting: images from the clipboard become image blocks, and content copied from Notion,
//    Google Docs, Word or a web page keeps its headings, lists, tables, formatting and images
//  - markdown shortcuts while typing ("- ", "1. ", "# ", "> ", "---") and undo/redo
// Save sends the whole case study to /api/cases/<id>, where it is stored (Postgres on Railway)
// and shown to every visitor from then on.
//
// Body text is kept as markdown-style text (**bold**, *italic*, [link](url)); app.js turns it
// into HTML with inlineHtml(), and this file turns edited HTML back into that text.
(function () {
  const BLOCKS = [
    // type, menu label, description, extra words the "/" filter matches
    ['p', 'Text', 'Plain paragraph', 'paragraph'],
    ['heading', 'Heading', 'Big section heading', 'h1 h2 title'],
    ['subheading', 'Subheading', 'Smaller heading', 'h3'],
    ['eyebrow', 'Section heading', 'Heading with a line above it', 'section'],
    ['label', 'Bold line', 'A short bold line', 'bold'],
    ['list', 'Bulleted list', 'Simple bullets', 'ul bullet'],
    ['olist', 'Numbered list', '1, 2, 3', 'ol number ordered'],
    ['callout', 'Callout', 'A highlighted note box', 'note tip info box'],
    ['quote', 'Quote', 'A quote or testimonial', 'blockquote testimonial'],
    ['img', 'Image', 'Upload a picture (or just paste one)', 'picture photo screenshot'],
    ['table', 'Table', 'Rows and columns', 'grid'],
    ['stats', 'Stats', 'Big numbers with labels', 'kpi numbers metrics'],
    ['divider', 'Divider', 'A horizontal line', 'hr line separator'],
    ['code', 'Code', 'A code snippet', 'pre snippet'],
  ];
  const LABEL = Object.fromEntries(BLOCKS.map((b) => [b[0], b[1]]));
  const RICH = ['p', 'quote', 'callout'];                       // main text keeps formatting
  const PLAIN = ['heading', 'subheading', 'eyebrow', 'label', 'code'];
  const LISTS = ['list', 'olist'];
  const ALIGNABLE = ['p', 'heading', 'subheading', 'eyebrow', 'label', 'list', 'olist', 'callout', 'quote'];
  const ALIGNMENTS = [['left', 'Align Left'], ['center', 'Center Align'], ['right', 'Align Right'], ['justify', 'Justify']];
  const CONVERTIBLE = [...RICH, ...PLAIN, ...LISTS];
  const TONES = [['default', 'Purple'], ['green', 'Green'], ['blue', 'Blue'], ['yellow', 'Yellow'], ['red', 'Red'], ['gray', 'Gray']];
  // Text colours and table styles (TEXT_COLORS and TABLE_STYLES come from app.js).
  const COLORABLE = [...ALIGNABLE, 'table'];
  const SIZABLE = [...COLORABLE, 'stats', 'code'];
  const COLOR_NAME = (c) => (c === 'ink' ? 'Black' : c.charAt(0).toUpperCase() + c.slice(1));
  const TABLE_STYLE_LABELS = { default: 'Standard', bordered: 'Bordered', minimal: 'Minimal', header: 'Bold header' };
  const SIZE_LABELS = { sm: 'Small', '': 'Normal', lg: 'Large', xl: 'Extra large' };
  const WEIGHT_LABELS = { regular: 'Regular', '': 'Semibold', bold: 'Bold' };
  const EMOJIS = '📲 📞 🤖 ⚡ 🚀 📊 📈 💬 🛒 🧾 🗂️ ✅ 📅 🏗️ 🏠 💼 🧠 🔗 📦 🎯 💡 🔍 📣 🛠️ ⚙️ 🧪 📝 📚 🎨 🌐 🔒 💰 ⏱️ 📧 🧩 🏥 🚚 ✈️ 🎬 ⭐ ⚠️ ❗ ℹ️ 🔥 👉 🏆'.split(' ');
  const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

  const state = {
    admin: false,
    enabled: false,
    current: null,          // case study on screen
    editing: null,          // { id, draft, dirty } while in edit mode
    stashed: new Map(),     // unsaved drafts left behind by navigating away
  };
  const onAdminPage = document.body.classList.contains('admin-page');
  const history = { undo: [], redo: [], lastWasStructural: false };

  function showAdminWorkspace(isAdmin) {
    if (!onAdminPage) return;
    document.getElementById('admin-gate').hidden = isAdmin;
    document.getElementById('app').hidden = !isAdmin;
  }

  // ---------- small helpers ----------
  const esc = escAttr; // from app.js; also escapes quotes
  const clone = (v) => JSON.parse(JSON.stringify(v));
  const editedIds = () => (typeof EDITED_CASE_IDS !== 'undefined' ? EDITED_CASE_IDS : []);
  const hiddenIds = new Set(typeof HIDDEN_CASE_IDS !== 'undefined' ? HIDDEN_CASE_IDS : []);

  async function setHidden(id, hide) {
    await api('POST', `/api/cases/${encodeURIComponent(id)}/visibility`, { hidden: hide });
    if (hide) hiddenIds.add(id); else hiddenIds.delete(id);
    toast(hide ? 'Hidden from the public site.' : 'Visible on the public site again.');
  }
  const plaintextOnly = (() => {
    const d = document.createElement('div');
    try { d.contentEditable = 'plaintext-only'; } catch (e) { return false; }
    return d.contentEditable === 'plaintext-only';
  })();
  const CE = `contenteditable="${plaintextOnly ? 'plaintext-only' : 'true'}" spellcheck="true"`;
  const CE_RICH = 'contenteditable="true" spellcheck="true" data-rich="1"';

  // Plain text typed into an element, tidied: no stray non-breaking spaces, and line breaks only
  // where the block can show them (code).
  function readText(el, keepLines) {
    if (!el) return '';
    const t = el.innerText.replace(/ /g, ' ');
    return keepLines ? t.replace(/\n+$/, '') : t.replace(/\s*\n\s*/g, ' ').trim();
  }

  // ---------- formatted text <-> markdown-style text ----------
  const escMd = (s) => String(s || '').replace(/([\\*`~[\]])/g, '\\$1');
  const stripMd = (md) => { const d = document.createElement('div'); d.innerHTML = inlineHtml(md); return d.textContent; };
  const tidy = (md) => md.replace(/\s+/g, ' ').trim();
  const isAllowedHref = (h) => /^(https?:\/\/|mailto:|\/|#)/i.test(h || '');

  function wrapMd(inner, mark) {
    const m = inner.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!m[2] || (m[2].startsWith(mark) && m[2].endsWith(mark) && m[2].length > mark.length * 2)) return inner;
    return `${m[1]}${mark}${m[2]}${mark}${m[3]}`;
  }

  // Edited HTML (or HTML pasted from another app) back to markdown-style text. Bold, italic,
  // strikethrough, code and links are kept; any other markup is dropped.
  function domToMd(node) {
    let out = '';
    node.childNodes.forEach((n) => {
      if (n.nodeType === 3) { out += escMd(n.nodeValue.replace(/ /g, ' ')); return; }
      if (n.nodeType !== 1) return;
      const tag = n.tagName.toLowerCase();
      if (tag === 'br') { out += ' '; return; }
      if (/^(script|style|meta|img|svg)$/.test(tag)) return;
      if (tag === 'code' || tag === 'kbd') {
        const t = n.textContent.replace(/`/g, '');
        out += t.trim() ? `\`${t}\`` : t;
        return;
      }
      let inner = domToMd(n);
      const style = (n.getAttribute('style') || '').toLowerCase();
      const notBold = /font-weight:\s*(normal|[1-4]00)/.test(style);
      if (!notBold && (tag === 'b' || tag === 'strong' || /font-weight:\s*(bold|[6-9]00)/.test(style))) inner = wrapMd(inner, '**');
      if (tag === 'i' || tag === 'em' || /font-style:\s*italic/.test(style)) inner = wrapMd(inner, '*');
      if (tag === 's' || tag === 'strike' || tag === 'del' || /line-through/.test(style)) inner = wrapMd(inner, '~~');
      if (tag === 'a' && isAllowedHref(n.getAttribute('href')) && inner.trim()) {
        const href = n.getAttribute('href').replace(/[()\s]/g, (c) => encodeURIComponent(c));
        inner = `[${inner.trim()}](${href})`;
      }
      const color = n.getAttribute('data-color');
      if (TEXT_COLORS.includes(color) && inner.trim()) inner = `{color:${color}}${inner}{/color}`;
      if (/^(div|p|li|h[1-6]|tr|blockquote)$/.test(tag) && out && !/\s$/.test(out)) out += ' ';
      out += inner;
    });
    return out;
  }
  const readRich = (el) => (el ? tidy(domToMd(el)) : '');

  async function api(method, url, body, contentType) {
    const opts = { method, headers: { 'X-Admin-Request': '1' }, credentials: 'same-origin' };
    if (body !== undefined) {
      opts.headers['Content-Type'] = contentType || 'application/json';
      opts.body = contentType ? body : JSON.stringify(body);
    }
    const res = await fetch(url, opts);
    let data = {};
    try { data = await res.json(); } catch (e) {}
    if (!res.ok) {
      const err = new Error(data.error || `Request failed (${res.status})`);
      err.status = res.status;
      throw err;
    }
    return data;
  }

  function toast(message, kind) {
    document.querySelector('.ed-toast')?.remove();
    const el = document.createElement('div');
    el.className = `ed-toast${kind === 'error' ? ' ed-toast--error' : ''}`;
    el.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), kind === 'error' ? 7000 : 3500);
  }

  // ---------- login ----------
  function openLogin(onSuccess) {
    document.querySelector('.ed-modal')?.remove();
    const modal = document.createElement('div');
    modal.className = 'ed-modal';
    modal.innerHTML = `
      <form class="ed-modal-box" role="dialog" aria-modal="true" aria-labelledby="ed-login-title">
        <h2 id="ed-login-title">Admin login</h2>
        <p>Log in to edit case studies. Saved changes go live for every visitor.</p>
        <label class="ed-field"><span>Password</span><input type="password" name="password" autocomplete="current-password" required /></label>
        <p class="ed-error" hidden></p>
        <div class="ed-modal-actions">
          <button type="button" class="ed-btn" data-act="close">Cancel</button>
          <button type="submit" class="ed-btn ed-btn--primary">Log in</button>
        </div>
      </form>`;
    document.body.appendChild(modal);
    const form = modal.querySelector('form');
    const input = form.querySelector('input');
    const error = form.querySelector('.ed-error');
    const close = () => modal.remove();
    input.focus();
    modal.addEventListener('click', (e) => { if (e.target === modal || e.target.dataset.act === 'close') close(); });
    modal.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      error.hidden = true;
      try {
        await api('POST', '/api/login', { password: input.value });
        state.admin = true;
        close();
        showAdminWorkspace(true);
        drawAdminChrome();
        refreshCaseToolbar();
        refreshAddCard();
        // The admin page's data was loaded before login, so it lacks the hidden case studies.
        if (onAdminPage && typeof HIDDEN_CASE_IDS === 'undefined') return window.location.reload();
        toast('Logged in. Open any case study and press Edit.');
        if (onSuccess) onSuccess();
      } catch (err) {
        error.textContent = err.message;
        error.hidden = false;
        input.select();
      }
    });
  }

  async function logout() {
    if (state.editing && state.editing.dirty && !confirm('You have unsaved changes. Log out and discard them?')) return;
    await api('POST', '/api/logout').catch(() => {});
    state.admin = false;
    state.editing = null;
    showAdminWorkspace(false);
    document.querySelectorAll('.ed-savebar, .ed-bulkbar').forEach((b) => b.remove());
    drawAdminChrome();
    router();
  }

  function openChangePassword() {
    if (state.editing && state.editing.dirty && !confirm('Changing your password will log you out and discard unsaved edits. Continue?')) return;
    document.querySelector('.ed-modal')?.remove();
    const modal = document.createElement('div');
    modal.className = 'ed-modal';
    modal.innerHTML = `
      <form class="ed-modal-box" role="dialog" aria-modal="true" aria-labelledby="ed-password-title">
        <h2 id="ed-password-title">Change admin password</h2>
        <p>Your new password must be at least 12 characters. You’ll be logged out after changing it.</p>
        <label class="ed-field"><span>Current password</span><input type="password" name="currentPassword" autocomplete="current-password" required /></label>
        <label class="ed-field"><span>New password</span><input type="password" name="newPassword" autocomplete="new-password" minlength="12" maxlength="1024" required /></label>
        <label class="ed-field"><span>Confirm new password</span><input type="password" name="confirmPassword" autocomplete="new-password" minlength="12" maxlength="1024" required /></label>
        <p class="ed-error" hidden></p>
        <div class="ed-modal-actions">
          <button type="button" class="ed-btn" data-act="close">Cancel</button>
          <button type="submit" class="ed-btn ed-btn--primary">Change password</button>
        </div>
      </form>`;
    document.body.appendChild(modal);
    const form = modal.querySelector('form');
    const current = form.elements.currentPassword;
    const next = form.elements.newPassword;
    const confirmNext = form.elements.confirmPassword;
    const error = form.querySelector('.ed-error');
    current.focus();
    modal.addEventListener('click', (e) => { if (e.target === modal || e.target.dataset.act === 'close') modal.remove(); });
    modal.addEventListener('keydown', (e) => { if (e.key === 'Escape') modal.remove(); });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      error.hidden = true;
      if (next.value !== confirmNext.value) {
        error.textContent = 'The new passwords do not match.';
        error.hidden = false;
        confirmNext.select();
        return;
      }
      try {
        await api('POST', '/api/password', { currentPassword: current.value, newPassword: next.value });
        modal.remove();
        state.admin = false;
        state.editing = null;
        showAdminWorkspace(false);
        document.querySelectorAll('.ed-savebar, .ed-bulkbar').forEach((b) => b.remove());
        drawAdminChrome();
        router();
        toast('Password changed. Log in with your new password.');
      } catch (err) {
        error.textContent = err.message;
        error.hidden = false;
        if (err.status === 401) current.select();
        else next.select();
      }
    });
  }

  // Every case study, oldest first. data.js has no dates, so its order stands in for creation order
  // and those all predate site-created ones, which carry createdAt (the merged list puts them first,
  // newest first).
  function openCaseList() {
    document.querySelector('.ed-modal')?.remove();
    const added = CASE_STUDIES.filter((c) => c.isNew)
      .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
    const ordered = [...CASE_STUDIES.filter((c) => !c.isNew), ...added];
    const dateOf = (c) => (c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Original');
    const modal = document.createElement('div');
    modal.className = 'ed-modal';
    modal.innerHTML = `
      <div class="ed-modal-box ed-case-list-box" role="dialog" aria-modal="true" aria-labelledby="ed-case-list-title">
        <h2 id="ed-case-list-title">All case studies</h2>
        <p>${ordered.length} case studies, in the order they were created.</p>
        <ol class="ed-case-list">
          ${ordered.map((c) => `
            <li><a href="#/case/${esc(c.id)}">${esc(c.title)}</a><span>${esc(dateOf(c))}<button type="button" class="ed-btn ed-case-list-toggle" data-id="${esc(c.id)}">${hiddenIds.has(c.id) ? 'Unhide' : 'Hide'}</button></span></li>`).join('')}
        </ol>
        <div class="ed-modal-actions">
          <button type="button" class="ed-btn" data-act="close">Close</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector('[data-act="close"]').focus();
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.dataset.act === 'close' || e.target.closest('.ed-case-list a')) modal.remove();
    });
    modal.addEventListener('keydown', (e) => { if (e.key === 'Escape') modal.remove(); });
    modal.querySelector('.ed-case-list').addEventListener('click', async (e) => {
      const btn = e.target.closest('.ed-case-list-toggle');
      if (!btn) return;
      btn.disabled = true;
      try {
        await setHidden(btn.dataset.id, !hiddenIds.has(btn.dataset.id));
        btn.textContent = hiddenIds.has(btn.dataset.id) ? 'Unhide' : 'Hide';
        refreshCaseToolbar();
      } catch (err) {
        toast(err.message);
      }
      btn.disabled = false;
    });
  }

  // Once logged in, show the admin menu; the login link remains only on older public shells.
  function drawAdminChrome() {
    document.querySelector('.ed-admin-chip')?.remove();
    document.querySelector('.ed-login-link')?.remove();
    const nav = document.querySelector('.header-nav');
    if (!nav) return;
    if (state.admin) {
      const chip = document.createElement('div');
      chip.className = 'ed-admin-chip';
      chip.innerHTML = `
        <button type="button" class="ed-admin-toggle" aria-haspopup="menu" aria-expanded="false">
          <span>Admin</span><span aria-hidden="true">▾</span>
        </button>
        <div class="ed-admin-menu" role="menu" hidden>
          <button type="button" role="menuitem" data-act="list-cases">All case studies</button>
          <button type="button" role="menuitem" data-act="change-password">Change password</button>
          <button type="button" role="menuitem" data-act="logout">Log out</button>
        </div>`;
      chip.querySelector('[data-act="list-cases"]').addEventListener('click', openCaseList);
      chip.querySelector('[data-act="change-password"]').addEventListener('click', openChangePassword);
      chip.querySelector('[data-act="logout"]').addEventListener('click', logout);
      const toggle = chip.querySelector('.ed-admin-toggle');
      const menu = chip.querySelector('.ed-admin-menu');
      const closeMenu = () => { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); };
      toggle.addEventListener('click', () => {
        menu.hidden = !menu.hidden;
        toggle.setAttribute('aria-expanded', String(!menu.hidden));
        if (!menu.hidden) menu.querySelector('[role="menuitem"]').focus();
      });
      chip.addEventListener('click', (e) => {
        if (e.target.closest('[role="menuitem"]')) closeMenu();
      });
      chip.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !menu.hidden) {
          closeMenu();
          toggle.focus();
        }
      });
      nav.appendChild(chip);
    } else if (state.enabled && !onAdminPage) {
      const link = document.createElement('button');
      link.type = 'button';
      link.className = 'ed-login-link';
      link.innerHTML = 'Admin<span class="ed-hide-sm"> login</span>';
      link.addEventListener('click', () => openLogin());
      nav.appendChild(link);
    }
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('.ed-admin-chip')) return;
    document.querySelectorAll('.ed-admin-menu:not([hidden])').forEach((menu) => {
      menu.hidden = true;
      menu.parentElement.querySelector('.ed-admin-toggle')?.setAttribute('aria-expanded', 'false');
    });
  });

  // ---------- view mode: the Edit button on a case study ----------
  window.onCaseRendered = (cs) => {
    state.current = cs;
    refreshCaseToolbar();
  };

  // The bar goes right under "Back", above any cover, so a page icon overlapping the cover never
  // sits on top of it.
  function refreshCaseToolbar() {
    const back = document.querySelector('.case-detail-wrap > .back-link');
    if (!back || !state.current || state.editing) return;
    document.querySelector('.ed-view-bar')?.remove();
    if (!state.admin) return;
    const id = state.current.id;
    const stashed = state.stashed.has(id);
    const bar = document.createElement('div');
    bar.className = 'ed-view-bar';
    bar.innerHTML = `
      <button type="button" class="ed-btn ed-btn--primary" data-act="edit">✎ ${stashed ? 'Resume unsaved edits' : 'Edit this case study'}</button>
      ${stashed ? '<button type="button" class="ed-btn" data-act="discard">Discard unsaved edits</button>' : ''}
      <button type="button" class="ed-btn" data-act="download">⬇ Download PDF / Word</button>
      <button type="button" class="ed-btn" data-act="toggle-hidden">${hiddenIds.has(id) ? 'Unhide (show on public site)' : 'Hide from public site'}</button>
      ${hiddenIds.has(id) ? '<span class="ed-badge" title="Visitors cannot see this case study. Only admins can.">Hidden</span>' : ''}
      ${editedIds().includes(id) ? '<span class="ed-badge" title="This case study has been edited on the site. The original is kept in data.js.">Edited</span>' : ''}`;
    bar.addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act === 'edit') startEditing(id);
      if (act === 'discard') { state.stashed.delete(id); refreshCaseToolbar(); }
      if (act === 'toggle-hidden') setHidden(id, !hiddenIds.has(id)).then(refreshCaseToolbar, (err) => toast(err.message));
      if (act === 'download') openDownloadMenu(e.target.closest('[data-act]'), () => CASE_STUDIES.find((c) => c.id === id));
    });
    back.after(bar);
  }

  // ---------- edit mode ----------
  function startEditing(id) {
    const cs = CASE_STUDIES.find((c) => c.id === id);
    if (!cs) return;
    const stashed = state.stashed.get(id);
    state.stashed.delete(id);
    state.editing = {
      id,
      picked: new Set(),      // blocks ticked for changing several at once
      dirty: Boolean(stashed),
      draft: stashed || clone({ title: cs.title, description: cs.description, tags: cs.tags, content: cs.content, cover: cs.cover || '', icon: cs.icon || '' }),
    };
    openEditor();
  }

  // A case study that doesn't exist yet (id null): Save creates it. `draft` may come from an
  // imported file.
  function startNewCase(draft) {
    state.editing = { id: null, picked: new Set(), dirty: true, draft };
    openEditor();
  }

  function openEditor() {
    history.undo = []; history.redo = []; history.lastWasStructural = false;
    try { document.execCommand('styleWithCSS', false, false); } catch (e) {}
    drawEditor();
    document.querySelector('.ed-title')?.focus({ preventScroll: true });
  }

  function stopEditing() {
    const id = state.editing.id;
    state.editing = null;
    document.querySelectorAll('.ed-savebar, .ed-bulkbar').forEach((b) => b.remove());
    closePopups();
    if (id) keepScroll(() => renderCaseDetail(id)); else router();
  }

  // Every edit (adding, moving or deleting a block, undo, save, cancel) redraws the whole page.
  // Images then have no height until they decode again, so the page briefly gets shorter and the
  // browser jumps up. The block nearest the top of the screen is noted first and put back at the
  // same spot afterwards, and the page keeps its height until the images are back.
  function pageBlocks(app) {
    const editing = app.querySelectorAll('.ed-blocks > .ed-block');
    return editing.length ? [...editing] : [...app.querySelectorAll('.case-detail-content > *')];
  }

  function keepScroll(redraw) {
    const app = document.getElementById('app');
    const y = window.scrollY;
    const before = pageBlocks(app);
    // Only anchor to a block once the reader has scrolled into the content; above it, the
    // plain scroll position is right (the header differs between view and edit mode).
    const anchor = before.length && before[0].getBoundingClientRect().top < 0
      ? before.findIndex((el) => el.getBoundingClientRect().bottom > 0)
      : -1;
    const anchorTop = anchor >= 0 ? before[anchor].getBoundingClientRect().top : 0;
    app.style.minHeight = `${app.offsetHeight}px`;
    redraw();
    const after = anchor >= 0 ? pageBlocks(app)[anchor] : null;
    window.scrollTo(0, after ? window.scrollY + after.getBoundingClientRect().top - anchorTop : y);
    const loading = [...app.querySelectorAll('img')].filter((img) => !img.complete)
      .map((img) => new Promise((done) => { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); }));
    Promise.race([Promise.all(loading), new Promise((done) => setTimeout(done, 3000))])
      .then(() => { app.style.minHeight = ''; });
  }

  function markDirty() {
    if (!state.editing || state.editing.dirty) return;
    state.editing.dirty = true;
    const status = document.querySelector('.ed-status');
    if (status) status.textContent = 'Unsaved changes';
  }

  function listItemsHtml(items) {
    return (items.length ? items : ['']).map((t) => `<li>${inlineHtml(t)}</li>`).join('');
  }

  function blockBodyHtml(b, i) {
    switch (b.type) {
      case 'heading': return `<h3 ${CE} data-k="text" data-placeholder="Heading">${esc(b.text)}</h3>`;
      case 'subheading': return `<h4 ${CE} data-k="text" data-placeholder="Subheading">${esc(b.text)}</h4>`;
      case 'eyebrow': return `<p class="content-eyebrow" ${CE} data-k="text" data-placeholder="Section heading">${esc(b.text)}</p>`;
      case 'label': return `<p class="content-label" ${CE} data-k="text" data-placeholder="Bold line">${esc(b.text)}</p>`;
      // Lists use rich editing so Enter starts a new bullet and formatting works inside items.
      case 'list': return `<ul class="content-list${TEXT_COLORS.includes(b.marker) ? ` marker-${b.marker}` : ''}" ${CE_RICH} data-k="items">${listItemsHtml(b.items)}</ul>`;
      case 'olist': return `<ol class="content-list content-olist${TEXT_COLORS.includes(b.marker) ? ` marker-${b.marker}` : ''}" ${CE_RICH} data-k="items">${listItemsHtml(b.items)}</ol>`;
      case 'callout': return `
        <div class="content-callout callout-${esc(b.tone || 'default')}">
          <button type="button" class="callout-icon ed-callout-icon" data-act="callout-icon" data-i="${i}" title="Change icon" aria-label="Change callout icon">${esc(b.icon || '💡')}</button>
          <div class="callout-text" ${CE_RICH} data-k="text" data-placeholder="Write a note">${inlineHtml(b.text)}</div>
        </div>`;
      case 'divider': return '<hr class="content-divider" />';
      case 'img': return `
        <figure class="content-figure">
          <img class="content-image ed-image" src="${esc(b.file)}" alt="" />
          <figcaption ${CE} data-k="caption" data-placeholder="Add a caption (optional)">${esc(b.caption || '')}</figcaption>
          <div class="ed-inline-actions">
            <button type="button" class="ed-btn ed-btn--small" data-act="replace-image" data-i="${i}">Replace image</button>
            <button type="button" class="ed-btn ed-btn--small" data-act="image-cover" data-i="${i}">Use as cover</button>
          </div>
        </figure>`;
      case 'stats': return `
        <div class="content-stats">${b.items.map((s, j) => `
          <div class="stat-tile ed-tile">
            <button type="button" class="ed-x" data-act="del-stat" data-i="${i}" data-j="${j}" aria-label="Remove this stat" title="Remove">×</button>
            <div class="stat-value" ${CE} data-k="value" data-placeholder="42%">${esc(s.value)}</div>
            <div class="stat-label" ${CE} data-k="label" data-placeholder="What it measures">${esc(s.label)}</div>
          </div>`).join('')}
        </div>
        <button type="button" class="ed-btn ed-btn--small" data-act="add-stat" data-i="${i}">+ Add stat</button>`;
      case 'table': {
        // ▸ picks a whole row and ▾ a whole column for colouring; dragging across cells picks a block of them.
        const pickRow = (r) => `<button type="button" class="ed-line-pick" data-act="pick-row" data-i="${i}" data-j="${r}" aria-label="Select this row" title="Select this row to colour it (Shift-click to add more rows)">▸</button>`;
        const head = b.headers.map((h, c) => `<th${classAttr(tableCellClass(headCellStyle(b, c)))}><div class="ed-cell" ${CE} data-placeholder="Column">${esc(h)}</div><button type="button" class="ed-line-pick ed-line-pick--col" data-act="pick-col" data-i="${i}" data-j="${c}" aria-label="Select this column" title="Select this column to colour it (Shift-click to add more columns)">▾</button><button type="button" class="ed-x" data-act="del-col" data-i="${i}" data-j="${c}" aria-label="Remove this column" title="Remove column">×</button></th>`).join('');
        const rows = b.rows.map((r, ri) => `<tr>${b.headers.map((_, c) => `<td${classAttr(tableCellClass(bodyCellStyle(b, ri, c)))}><div class="ed-cell" ${CE_RICH}>${inlineHtml(r[c] || '')}</div></td>`).join('')}<td class="ed-row-x">${pickRow(ri)}<button type="button" class="ed-x" data-act="del-row" data-i="${i}" data-j="${ri}" aria-label="Remove this row" title="Remove row">×</button></td></tr>`).join('');
        return `
          <div class="${tableWrapClass(b)}"><table class="content-table"><thead><tr>${head}<th class="ed-row-x">${pickRow(-1)}</th></tr></thead><tbody>${rows}</tbody></table></div>
          <div class="ed-inline-actions">
            <button type="button" class="ed-btn ed-btn--small" data-act="add-row" data-i="${i}">+ Row</button>
            <button type="button" class="ed-btn ed-btn--small" data-act="add-col" data-i="${i}">+ Column</button>
            <button type="button" class="ed-btn ed-btn--small ed-btn--ghost" data-act="pick-table" data-i="${i}" title="Select every cell, to colour or format the whole table">▦ Select all cells</button>
          </div>`;
      }
      case 'code': return `<pre class="content-code"><code ${CE} data-k="text" data-placeholder="Code">${esc(b.text)}</code></pre>`;
      case 'quote': return `
        <blockquote class="content-quote">
          <p ${CE_RICH} data-k="text" data-placeholder="Quote">${inlineHtml(b.text)}</p>
          <cite ${CE} data-k="attribution" data-placeholder="Who said it">${esc(b.attribution || '')}</cite>
        </blockquote>`;
      default: return `<p ${CE_RICH} data-k="text" data-placeholder="Type something, or press / for blocks">${inlineHtml(b.text)}</p>`;
    }
  }

  function blockHtml(b, i, count) {
    const typeControl = CONVERTIBLE.includes(b.type)
      ? `<select class="ed-type" data-i="${i}" aria-label="Block type">${CONVERTIBLE.map((t) => `<option value="${t}"${t === b.type ? ' selected' : ''}>${LABEL[t]}</option>`).join('')}</select>`
      : `<span class="ed-type ed-type--fixed">${LABEL[b.type]}</span>`;
    const alignControl = ALIGNABLE.includes(b.type)
      ? `<select class="ed-type ed-align" data-i="${i}" aria-label="Text alignment" title="Text alignment">${ALIGNMENTS.map(([value, label]) => `<option value="${value}"${value === (b.align || 'left') ? ' selected' : ''}>${label}</option>`).join('')}</select>`
      : '';
    const toneControl = b.type === 'callout'
      ? `<select class="ed-type ed-tone" data-i="${i}" aria-label="Callout colour">${TONES.map(([v, l]) => `<option value="${v}"${v === (b.tone || 'default') ? ' selected' : ''}>${l}</option>`).join('')}</select>`
      : '';
    const picked = state.editing.picked.has(i);
    const hasStyle = SIZABLE.includes(b.type);
    const colorClass = (COLORABLE.includes(b.type) && TEXT_COLORS.includes(b.color) ? ` tc tc-${b.color}` : '')
      + (TEXT_SIZES.includes(b.size) ? ` ts ts-${b.size}` : '');
    return `
      <div class="ed-block ed-block--${b.type}${picked ? ' is-picked' : ''}" data-i="${i}">
        <div class="ed-tools" role="toolbar" aria-label="Block ${i + 1} controls">
          <label class="ed-tool ed-pick-wrap" title="Select this block (to change several at once)"><input type="checkbox" class="ed-pick" data-i="${i}"${picked ? ' checked' : ''} aria-label="Select block ${i + 1}" /></label>
          <span class="ed-tool ed-handle" draggable="true" data-i="${i}" title="Drag to move" aria-hidden="true">⋮⋮</span>
          ${typeControl}${alignControl}${toneControl}
          ${hasStyle ? `<button type="button" class="ed-tool" data-act="style" data-i="${i}" aria-label="Text size and colours${b.type === 'table' ? ' and table style' : ''}" title="Text size and colours${b.type === 'table' ? ' and table style' : ''}">🎨</button>` : ''}
          <button type="button" class="ed-tool" data-act="up" data-i="${i}" aria-label="Move up" title="Move up"${i === 0 ? ' disabled' : ''}>↑</button>
          <button type="button" class="ed-tool" data-act="down" data-i="${i}" aria-label="Move down" title="Move down"${i === count - 1 ? ' disabled' : ''}>↓</button>
          <button type="button" class="ed-tool" data-act="duplicate" data-i="${i}" aria-label="Duplicate block" title="Duplicate">⧉</button>
          <button type="button" class="ed-tool" data-act="add" data-i="${i}" aria-label="Add a block below" title="Add a block below">+</button>
          <button type="button" class="ed-tool ed-tool--danger" data-act="delete" data-i="${i}" aria-label="Delete block" title="Delete block">🗑</button>
        </div>
        <div class="ed-body${colorClass}"${ALIGNABLE.includes(b.type) ? ` style="text-align:${ALIGNMENTS.some(([value]) => value === b.align) ? b.align : 'left'}"` : ''}>${blockBodyHtml(b, i)}</div>
      </div>`;
  }

  function drawEditor(focus) {
    const { draft, id } = state.editing;
    const app = document.getElementById('app');
    const tagChips = CATEGORIES.map((c) => `
      <label class="ed-chip"><input type="checkbox" value="${esc(c.slug)}"${draft.tags.includes(c.slug) ? ' checked' : ''} /> ${esc(c.name)}</label>`).join('');
    // With no cover yet, a dashed area across the top invites one; with no icon, a button does.
    const cover = draft.cover ? `
      <div class="case-cover ed-cover">
        <img src="${esc(draft.cover)}" alt="" />
        <div class="ed-cover-actions">
          <button type="button" class="ed-btn ed-btn--small" data-act="cover-pick">Change cover</button>
          <button type="button" class="ed-btn ed-btn--small" data-act="cover-remove">Remove</button>
        </div>
      </div>` : `
      <button type="button" class="ed-cover-empty" data-act="cover-pick">
        <span class="ed-cover-empty-icon" aria-hidden="true">🖼</span>
        <span><strong>Add cover photo</strong><br />Upload an image or use one from this page</span>
      </button>`;
    const icon = draft.icon
      ? `<button type="button" class="case-icon ed-icon${draft.cover ? ' case-icon--over' : ''}" data-act="icon-pick" title="Change icon" aria-label="Change page icon">${esc(draft.icon)}</button>`
      : '';
    const pageActions = !draft.icon ? `
      <div class="ed-page-actions">
        <button type="button" class="ed-btn ed-btn--small" data-act="icon-pick"><span aria-hidden="true">☺</span> Add icon</button>
      </div>` : '';
    keepScroll(() => { app.innerHTML = `
      <div class="case-detail-wrap ed-editing">
        <div class="ed-banner">Editing. Click any text to change it. Select text to format it, paste images or content from Notion and Docs, press <kbd>/</kbd> for blocks, and drag <span aria-hidden="true">⋮⋮</span> to move a block.</div>
        ${cover}
        <div class="case-detail-header">
          ${icon}${pageActions}
          <h1 class="ed-title" ${CE} data-placeholder="Case study title">${esc(draft.title)}</h1>
          <p class="ed-description" ${CE} data-placeholder="Short summary, shown on the case study cards">${esc(draft.description)}</p>
          <fieldset class="ed-tags"><legend>Show this case study under</legend>${tagChips}</fieldset>
        </div>
        <div class="case-detail-content ed-blocks">
          ${draft.content.map((b, i) => blockHtml(b, i, draft.content.length)).join('')}
          <button type="button" class="ed-add-end" data-act="add" data-i="${draft.content.length - 1}">+ Add a block</button>
        </div>
      </div>`; });
    drawSaveBar(id);
    drawBulkBar();
    drawCellPick();
    if (focus) focusBlock(focus.index, focus.at);
  }

  function drawSaveBar(id) {
    document.querySelectorAll('.ed-savebar, .ed-bulkbar').forEach((b) => b.remove());
    const bar = document.createElement('div');
    bar.className = 'ed-savebar';
    bar.innerHTML = `
      <div class="container ed-savebar-inner">
        <div class="ed-savebar-left">
          <button type="button" class="ed-tool" data-act="undo" title="Undo (Ctrl+Z)" aria-label="Undo"${history.undo.length ? '' : ' disabled'}>↶</button>
          <button type="button" class="ed-tool" data-act="redo" title="Redo (Ctrl+Shift+Z)" aria-label="Redo"${history.redo.length ? '' : ' disabled'}>↷</button>
          <span class="ed-status" aria-live="polite">${state.editing.dirty ? 'Unsaved changes' : 'No changes yet'}</span>
          <button type="button" class="ed-btn ed-btn--small ed-btn--ghost" data-act="select-all" title="Tick every block to change their alignment, colours or table style together (Ctrl+A outside a text field)">☑ Select all</button>
          <button type="button" class="ed-btn ed-btn--small ed-btn--ghost" data-act="download" title="Download this case study, with any unsaved edits, as a PDF or Word file">⬇ Download</button>
        </div>
        <div class="ed-savebar-actions">
          ${editedIds().includes(id) ? '<button type="button" class="ed-btn ed-btn--ghost" data-act="revert">Revert to original</button>' : ''}
          ${id ? '<button type="button" class="ed-btn ed-btn--ghost ed-btn--danger" data-act="delete-case">Delete case study</button>' : ''}
          <button type="button" class="ed-btn" data-act="cancel">Cancel</button>
          <button type="button" class="ed-btn ed-btn--primary" data-act="save">${id ? 'Save' : 'Create case study'} <span class="ed-kbd">Ctrl+S</span></button>
        </div>
      </div>`;
    bar.addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act === 'save') save();
      if (act === 'cancel') cancel();
      if (act === 'revert') revert();
      if (act === 'delete-case') deleteCase();
      if (act === 'undo') undo();
      if (act === 'redo') redo();
      if (act === 'select-all') toggleSelectAll();
      if (act === 'download') openDownloadMenu(e.target.closest('[data-act]'), () => collect(), true);
    });
    document.body.appendChild(bar);
  }

  // Put the caret in an element at a character offset (or 'start' / 'end').
  function placeCaret(el, at) {
    el.focus();
    const range = document.createRange();
    if (typeof at === 'number') {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let left = at, node;
      while ((node = walker.nextNode())) {
        if (left <= node.nodeValue.length) { range.setStart(node, left); range.collapse(true); break; }
        left -= node.nodeValue.length;
      }
      if (!node) { range.selectNodeContents(el); range.collapse(false); }
    } else {
      range.selectNodeContents(el);
      range.collapse(at !== 'end');
    }
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function focusBlock(index, at) {
    const block = document.querySelector(`.ed-block[data-i="${index}"]`);
    const fields = block ? [...block.querySelectorAll('[contenteditable]')] : [];
    if (!fields.length) return;
    placeCaret(at === 'end' ? fields[fields.length - 1] : fields[0], at);
  }

  // Copy everything typed on the page back into the draft. Runs on every keystroke, so the draft
  // is always current (also when the page is left with the browser's back button).
  function collect() {
    const { draft } = state.editing;
    if (!document.querySelector('.ed-editing')) return draft;
    draft.title = readText(document.querySelector('.ed-title'));
    draft.description = readText(document.querySelector('.ed-description'));
    draft.tags = [...document.querySelectorAll('.ed-tags input:checked')].map((i) => i.value);
    document.querySelectorAll('.ed-block').forEach((el) => {
      const b = draft.content[Number(el.dataset.i)];
      if (!b) return;
      const field = (k) => el.querySelector(`[data-k="${k}"]`);
      switch (b.type) {
        case 'list': case 'olist': {
          const box = field('items');
          const lis = [...box.querySelectorAll('li')];
          b.items = lis.length ? lis.map(readRich).filter(Boolean) : box.innerText.split('\n').map((t) => escMd(t.trim())).filter(Boolean);
          break;
        }
        case 'img': {
          const caption = readText(field('caption'));
          if (caption) b.caption = caption; else delete b.caption;
          break;
        }
        case 'stats':
          b.items = [...el.querySelectorAll('.stat-tile')].map((t) => ({ value: readText(t.querySelector('[data-k="value"]')), label: readText(t.querySelector('[data-k="label"]')) }));
          break;
        case 'table':
          b.headers = [...el.querySelectorAll('thead th:not(.ed-row-x) .ed-cell')].map((c) => readText(c));
          b.rows = [...el.querySelectorAll('tbody tr')].map((tr) => [...tr.querySelectorAll('td:not(.ed-row-x) .ed-cell')].map(readRich));
          break;
        case 'quote':
          b.text = readRich(field('text'));
          b.attribution = readText(field('attribution'));
          break;
        case 'callout': case 'p':
          b.text = readRich(field('text'));
          break;
        case 'code':
          b.text = readText(field('text'), true);
          break;
        case 'divider':
          break;
        default:
          b.text = readText(field('text'));
      }
    });
    return draft;
  }

  // Any change to the page's structure (blocks, cover, icon) goes through here: it records an
  // undo step, applies the change to the draft and redraws the editor. Ticked blocks stay ticked
  // only when the change keeps every block where it was (`keepPicked`).
  function restructure(fn, focus, keepPicked) {
    collect();
    history.undo.push(clone(state.editing.draft));
    if (history.undo.length > 100) history.undo.shift();
    history.redo = [];
    history.lastWasStructural = true;
    fn(state.editing.draft.content, state.editing.draft);
    if (!keepPicked) { state.editing.picked.clear(); state.editing.cellPick = null; }
    markDirty();
    drawEditor(focus);
  }

  function undo() {
    if (!history.undo.length) return;
    history.redo.push(clone(collect()));
    state.editing.draft = history.undo.pop();
    history.lastWasStructural = true;
    state.editing.picked.clear();
    state.editing.cellPick = null;
    markDirty();
    drawEditor();
  }

  function redo() {
    if (!history.redo.length) return;
    history.undo.push(clone(collect()));
    state.editing.draft = history.redo.pop();
    history.lastWasStructural = true;
    state.editing.picked.clear();
    state.editing.cellPick = null;
    markDirty();
    drawEditor();
  }

  // ---------- changing several blocks at once ----------
  // `change` is one of { align }, { color }, { marker }, { tableStyle }, { tableColor }; '' or
  // 'left'/'default' removes the setting. Blocks without that setting are skipped.
  function applyStyle(indices, change) {
    const [key, value] = Object.entries(change)[0];
    const fits = {
      align: (b) => ALIGNABLE.includes(b.type),
      color: (b) => COLORABLE.includes(b.type),
      marker: (b) => LISTS.includes(b.type),
      tableStyle: (b) => b.type === 'table',
      tableColor: (b) => b.type === 'table',
      headWeight: (b) => b.type === 'table',
      firstColWeight: (b) => b.type === 'table',
      headFill: (b) => b.type === 'table',
      stripe: (b) => b.type === 'table',
      size: (b) => SIZABLE.includes(b.type),
    }[key];
    const blocks = state.editing.draft.content;
    const targets = indices.filter((i) => blocks[i] && fits(blocks[i]));
    if (!targets.length) return toast('None of the selected blocks have that setting.', 'error');
    restructure((c) => targets.forEach((i) => {
      if (!value || value === 'left' || value === 'default') delete c[i][key];
      else c[i][key] = value;
    }), null, true);
    if (targets.length < indices.length) toast(`Changed ${targets.length} of ${indices.length} selected blocks. The others don’t have that setting.`);
  }

  function setPicked(indices, on) {
    indices.forEach((i) => (on ? state.editing.picked.add(i) : state.editing.picked.delete(i)));
    document.querySelectorAll('.ed-block').forEach((el) => {
      const isOn = state.editing.picked.has(Number(el.dataset.i));
      el.classList.toggle('is-picked', isOn);
      const box = el.querySelector(':scope > .ed-tools .ed-pick');
      if (box) box.checked = isOn;
    });
    drawBulkBar();
  }

  function toggleSelectAll() {
    const all = state.editing.draft.content.map((_, i) => i);
    setPicked(all, state.editing.picked.size < all.length);
  }

  // Bar shown while blocks are ticked: alignment, colours and table style for all of them at once.
  function drawBulkBar() {
    document.querySelector('.ed-bulkbar')?.remove();
    const n = state.editing ? state.editing.picked.size : 0;
    const selectAll = document.querySelector('.ed-savebar [data-act="select-all"]');
    if (selectAll) selectAll.textContent = n && n === state.editing.draft.content.length ? '☐ Clear selection' : '☑ Select all';
    if (!n) return;
    const bar = document.createElement('div');
    bar.className = 'ed-bulkbar';
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Change the selected blocks');
    bar.innerHTML = `
      <div class="container ed-bulkbar-inner">
        <strong>${n} block${n === 1 ? '' : 's'} selected</strong>
        <span class="ed-seg" role="group" aria-label="Text alignment">${ALIGNMENTS.map(([v, l]) => `<button type="button" class="ed-btn ed-btn--small" data-align="${v}" title="${l}">${{ left: '⇤ Left', center: '↔ Center', right: 'Right ⇥', justify: '☰ Justify' }[v]}</button>`).join('')}</span>
        <button type="button" class="ed-btn ed-btn--small" data-act="bulk-style">🎨 Text size, colours &amp; table style</button>
        <button type="button" class="ed-btn ed-btn--small ed-btn--danger" data-act="bulk-delete">Delete selected</button>
        <button type="button" class="ed-btn ed-btn--small ed-btn--ghost" data-act="bulk-clear">Clear selection</button>
      </div>`;
    bar.addEventListener('click', (e) => {
      const picked = [...state.editing.picked].sort((a, b) => a - b);
      const align = e.target.closest('[data-align]');
      if (align) return applyStyle(picked, { align: align.dataset.align });
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act === 'bulk-style') openStyleMenu(e.target.closest('[data-act]'), picked);
      if (act === 'bulk-clear') setPicked(picked, false);
      if (act === 'bulk-delete' && confirm(`Delete the ${picked.length} selected block${picked.length === 1 ? '' : 's'}?`)) {
        restructure((c) => {
          picked.slice().reverse().forEach((i) => c.splice(i, 1));
          if (!c.length) c.push({ type: 'p', text: '' });
        });
      }
    });
    document.body.appendChild(bar);
  }

  // ---------- colouring table cells, rows and columns (as in Word) ----------
  // state.editing.cellPick is { i, r1, r2, c1, c2 }: a rectangle of cells in table block i, where
  // row -1 is the header row. Picked by dragging across cells, Shift-clicking a cell, or the ▸ / ▾
  // handles for a whole row or column.
  function cellPos(cell) {
    const tr = cell.parentElement;
    const r = tr.parentElement.tagName === 'THEAD' ? -1 : [...tr.parentElement.children].indexOf(tr);
    const c = [...tr.children].filter((x) => !x.classList.contains('ed-row-x')).indexOf(cell);
    return { r, c };
  }

  function setCellPick(i, a, b) {
    state.editing.cellPick = { i, r1: Math.min(a.r, b.r), r2: Math.max(a.r, b.r), c1: Math.min(a.c, b.c), c2: Math.max(a.c, b.c) };
    drawCellPick();
  }

  function clearCellPick() {
    if (!state.editing || !state.editing.cellPick) return;
    state.editing.cellPick = null;
    drawCellPick();
  }

  function pickLine(i, kind, j, extend) {
    const t = state.editing.draft.content[i];
    const lastR = t.rows.length - 1;
    const lastC = t.headers.length - 1;
    let a = kind === 'row' ? { r: j, c: 0 } : { r: -1, c: j };
    const b = kind === 'row' ? { r: j, c: lastC } : { r: lastR, c: j };
    const prev = state.editing.cellPick;
    if (extend && prev && prev.i === i) a = kind === 'row' ? { r: j < prev.r1 ? prev.r2 : prev.r1, c: 0 } : { r: -1, c: j < prev.c1 ? prev.c2 : prev.c1 };
    setCellPick(i, a, b);
  }

  // Highlights the picked cells and shows the cell colour bar under that table.
  function drawCellPick() {
    document.querySelectorAll('.ed-cell-picked').forEach((el) => el.classList.remove('ed-cell-picked'));
    document.querySelector('.ed-cell-bar')?.remove();
    const pick = state.editing && state.editing.cellPick;
    const blockEl = pick && document.querySelector(`.ed-block[data-i="${pick.i}"]`);
    const table = blockEl && blockEl.querySelector('.content-table');
    if (!table) { if (state.editing) state.editing.cellPick = null; return; }
    let count = 0;
    [...table.rows].forEach((tr, k) => {
      const r = k - 1; // the first row is the header
      if (r < pick.r1 || r > pick.r2) return;
      [...tr.children].filter((x) => !x.classList.contains('ed-row-x')).forEach((cell, c) => {
        if (c >= pick.c1 && c <= pick.c2) { cell.classList.add('ed-cell-picked'); count++; }
      });
    });
    const t = state.editing.draft.content[pick.i];
    const all = (test) => pickedStyles(t, pick).every(test);
    const swatches = (key, label) => ['', ...TEXT_COLORS].map((c) => `
      <button type="button" class="ed-swatch${c ? ` tc-${c}` : ' ed-swatch--default'}${key === 'strongFill' && c ? ' ed-swatch--solid' : ''}" data-cell-key="${key}" data-value="${c}" title="${c ? COLOR_NAME(c) : 'None'}" aria-label="${label} ${c ? COLOR_NAME(c) : 'none'}"></button>`).join('');
    const on = (yes) => (yes ? ' is-on' : '');
    const bar = document.createElement('div');
    bar.className = 'ed-cell-bar';
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Format the selected cells');
    bar.innerHTML = `
      <div class="ed-cell-bar-row">
        <strong>${count} cell${count === 1 ? '' : 's'} selected</strong>
        <span class="ed-cell-bar-group">
          <button type="button" class="ed-cell-tool${on(all((s) => s.bold))}" data-cell-key="bold" title="Bold" aria-label="Bold"><b>B</b></button>
          <button type="button" class="ed-cell-tool${on(all((s) => s.italic))}" data-cell-key="italic" title="Italic" aria-label="Italic"><i>I</i></button>
        </span>
        <span class="ed-cell-bar-group">${CELL_ALIGNS.map((a) => `
          <button type="button" class="ed-cell-tool${on(all((s) => (s.align || 'left') === a))}" data-cell-key="align" data-value="${a}" title="Align ${a}" aria-label="Align ${a}">${{ left: '⇤', center: '↔', right: '⇥' }[a]}</button>`).join('')}
        </span>
        <button type="button" class="ed-btn ed-btn--small ed-btn--ghost" data-cell-clear>Clear formatting</button>
        <button type="button" class="ed-btn ed-btn--small ed-btn--ghost" data-cell-done aria-label="Close" title="Done (Esc)">✕</button>
      </div>
      <div class="ed-cell-bar-row"><span class="ed-cell-bar-label">Text colour</span>${swatches('color', 'Text')}</div>
      <div class="ed-cell-bar-row"><span class="ed-cell-bar-label">Light fill</span>${swatches('fill', 'Light fill')}</div>
      <div class="ed-cell-bar-row"><span class="ed-cell-bar-label">Strong fill</span>${swatches('strongFill', 'Strong fill')}</div>`;
    bar.addEventListener('mousedown', (e) => e.preventDefault()); // keep the cells picked
    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cell-key]');
      if (btn) applyCellStyle(btn.dataset.cellKey, btn.dataset.value);
      if (e.target.closest('[data-cell-clear]')) applyCellStyle(null);
      if (e.target.closest('[data-cell-done]')) clearCellPick();
    });
    blockEl.querySelector('.content-table-wrap').after(bar);
  }

  // Style objects of the picked cells as they are now ({} for a plain cell).
  function pickedStyles(t, pick) {
    const out = [];
    for (let r = pick.r1; r <= pick.r2; r++) {
      for (let c = pick.c1; c <= pick.c2; c++) out.push((r === -1 ? headCellStyle(t, c) : bodyCellStyle(t, r, c)) || {});
    }
    return out;
  }

  // Changes every picked cell. Keys: 'color', 'fill' (light tint), 'strongFill' (solid colour),
  // 'align', and 'bold' / 'italic', which turn on, or off when every picked cell already has them.
  // A '' value removes that setting; key null clears all of them.
  function applyCellStyle(key, value) {
    const pick = state.editing.cellPick;
    if (!pick) return;
    const current = pickedStyles(state.editing.draft.content[pick.i], pick);
    const toggleOn = (k) => !current.every((s) => s[k]);
    const change = (s) => {
      if (!key) return {};
      if (key === 'bold' || key === 'italic') { if (toggleOn(key)) s[key] = true; else delete s[key]; return s; }
      if (key === 'fill' || key === 'strongFill') {
        delete s.strong;
        if (!value) delete s.fill;
        else { s.fill = value; if (key === 'strongFill') s.strong = true; }
        return s;
      }
      if (key === 'align' && value === 'left') { delete s.align; return s; }
      if (value) s[key] = value; else delete s[key];
      return s;
    };
    restructure((content) => {
      const t = content[pick.i];
      const lineOf = (r) => {
        if (r === -1) return (t.headStyles = Array.isArray(t.headStyles) ? t.headStyles : []);
        if (!Array.isArray(t.cellStyles)) t.cellStyles = [];
        return (t.cellStyles[r] = Array.isArray(t.cellStyles[r]) ? t.cellStyles[r] : []);
      };
      for (let r = pick.r1; r <= pick.r2; r++) {
        const line = lineOf(r);
        for (let c = pick.c1; c <= pick.c2; c++) {
          const s = change({ ...(line[c] || {}) });
          line[c] = Object.keys(s).length ? s : null;
        }
      }
    }, null, true);
  }

  // Dragging from one cell into another picks every cell in between, instead of selecting text.
  let cellDrag = null;
  const cellAt = (target) => (target && target.closest ? target.closest('.ed-editing .content-table :is(td, th):not(.ed-row-x)') : null);
  document.addEventListener('mousedown', (e) => {
    if (!state.editing) return;
    if (e.target.closest && e.target.closest('.ed-cell-bar, [data-act="pick-row"], [data-act="pick-col"], [data-act="pick-table"], .ed-format, .ed-menu')) return;
    const cell = cellAt(e.target);
    if (!cell || e.target.closest('.ed-x')) { clearCellPick(); return; }
    const i = Number(cell.closest('.ed-block').dataset.i);
    const pos = cellPos(cell);
    const prev = state.editing.cellPick;
    if (e.shiftKey && prev && prev.i === i) {
      e.preventDefault();
      setCellPick(i, { r: prev.r1, c: prev.c1 }, pos);
      return;
    }
    clearCellPick();
    cellDrag = { i, from: pos, table: cell.closest('table') };
  });
  document.addEventListener('mouseover', (e) => {
    if (!cellDrag) return;
    const cell = cellAt(e.target);
    if (!cell || cell.closest('table') !== cellDrag.table) return;
    const pos = cellPos(cell);
    if (!state.editing.cellPick && pos.r === cellDrag.from.r && pos.c === cellDrag.from.c) return;
    cellDrag.table.classList.add('ed-cell-dragging');
    window.getSelection().removeAllRanges();
    setCellPick(cellDrag.i, cellDrag.from, pos);
  });
  document.addEventListener('mouseup', () => {
    if (cellDrag) cellDrag.table.classList.remove('ed-cell-dragging');
    cellDrag = null;
  });

  // Colour swatches and table styles for one block, or for every ticked block.
  function openStyleMenu(anchor, indices) {
    closePopups();
    const blocks = indices.map((i) => state.editing.draft.content[i]).filter(Boolean);
    const one = blocks.length === 1 ? blocks[0] : null;
    const swatches = (key, current) => `<div class="ed-swatches">${['', ...TEXT_COLORS].map((c) => `
      <button type="button" class="ed-swatch${c ? ` tc-${c}` : ' ed-swatch--default'}${one && (current || '') === c ? ' is-on' : ''}" data-key="${key}" data-value="${c}" title="${c ? COLOR_NAME(c) : 'Default'}" aria-label="${c ? COLOR_NAME(c) : 'Default colour'}"></button>`).join('')}
      </div>`;
    // A row of word buttons for one setting; '' is its default (no setting stored).
    const choices = (key, labels, current) => `<div class="ed-table-styles ed-choice-${Object.keys(labels).length}">${Object.entries(labels).map(([v, l]) => `
      <button type="button" class="${one && (current || '') === v ? 'is-on' : ''}" data-key="${key}" data-value="${v}">${l}</button>`).join('')}</div>`;
    const sections = [];
    if (blocks.some((b) => SIZABLE.includes(b.type))) sections.push(`<p class="ed-menu-title">Text size</p>${choices('size', SIZE_LABELS, one && one.size)}`);
    if (blocks.some((b) => COLORABLE.includes(b.type))) sections.push(`<p class="ed-menu-title">Text colour</p>${swatches('color', one && one.color)}`);
    if (blocks.some((b) => LISTS.includes(b.type))) sections.push(`<p class="ed-menu-title">Bullet / number colour</p>${swatches('marker', one && one.marker)}`);
    if (blocks.some((b) => b.type === 'table')) {
      sections.push(`<p class="ed-menu-title">Table style</p><div class="ed-table-styles">${Object.entries(TABLE_STYLE_LABELS).map(([v, l]) => `
        <button type="button" class="${one && (one.tableStyle || 'default') === v ? 'is-on' : ''}" data-key="tableStyle" data-value="${v}">${l}</button>`).join('')}</div>`);
      sections.push(`<p class="ed-menu-title">Table colour</p>${swatches('tableColor', one && one.tableColor)}`);
      sections.push(`<p class="ed-menu-title">Header background</p>${swatches('headFill', one && one.headFill)}`);
      sections.push(`<p class="ed-menu-title">Row stripes</p>${swatches('stripe', one && one.stripe !== 'none' ? one.stripe : '')}
        <div class="ed-table-styles ed-choice-1"><button type="button" class="${one && one.stripe === 'none' ? 'is-on' : ''}" data-key="stripe" data-value="none">No stripes (all white)</button></div>`);
      sections.push(`<p class="ed-menu-title">Header row text</p>${choices('headWeight', WEIGHT_LABELS, one && one.headWeight)}`);
      sections.push(`<p class="ed-menu-title">First column text</p>${choices('firstColWeight', WEIGHT_LABELS, one && one.firstColWeight)}`);
      sections.push('<p class="ed-menu-note">For single cells, rows or columns: select them in the table (▸ ▾ or drag).</p>');
    }
    if (!sections.length) return toast('The selected blocks have no style settings.', 'error');
    const menu = document.createElement('div');
    menu.className = 'ed-menu ed-style-menu';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-label', 'Colours and table style');
    menu.innerHTML = sections.join('');
    placePopup(menu, anchor);
    // The bulk bar is fixed on screen, so its menu must stay put when the page scrolls.
    if (anchor.closest('.ed-bulkbar')) {
      menu.style.position = 'fixed';
      menu.style.top = `${anchor.getBoundingClientRect().bottom + 6}px`;
      menu.style.left = `${parseFloat(menu.style.left) - window.scrollX}px`;
    }
    menu.querySelector('button').focus();
    menu.addEventListener('click', (e) => {
      const b = e.target.closest('[data-key]');
      if (!b) return;
      closePopups();
      applyStyle(indices, { [b.dataset.key]: b.dataset.value });
    });
    menu.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopups(); });
  }

  // Turn a block into another type, keeping its text.
  function convert(b, type) {
    if (b.type === type) return b;
    if (LISTS.includes(b.type) && LISTS.includes(type)) {
      return { type, items: b.items, ...(b.align ? { align: b.align } : {}), ...(b.color ? { color: b.color } : {}), ...(b.marker ? { marker: b.marker } : {}), ...(b.size ? { size: b.size } : {}) };
    }
    // Alignment, text colour and text size carry over to any type that has them.
    const align = {
      ...(ALIGNABLE.includes(type) && b.align ? { align: b.align } : {}),
      ...(COLORABLE.includes(type) && b.color ? { color: b.color } : {}),
      ...(SIZABLE.includes(type) && b.size ? { size: b.size } : {}),
    };
    let md;
    if (LISTS.includes(b.type)) md = b.items.join(type === 'code' ? '\n' : ' ');
    else if (RICH.includes(b.type)) md = b.text || '';
    else md = escMd(b.text || '');
    if (LISTS.includes(type)) return { type, items: md.split('\n').map((t) => t.trim()).filter(Boolean), ...align };
    if (type === 'quote') return { type, text: md, attribution: b.attribution || '', ...align };
    if (type === 'callout') return { type, text: md, icon: b.icon || '💡', tone: b.tone || 'default', ...align };
    if (type === 'p') return { type, text: md, ...align };
    if (type === 'divider') return { type };
    return { type, text: stripMd(md), ...align };
  }

  const NEW_BLOCK = {
    p: () => ({ type: 'p', text: '' }),
    heading: () => ({ type: 'heading', text: '' }),
    subheading: () => ({ type: 'subheading', text: '' }),
    eyebrow: () => ({ type: 'eyebrow', text: '' }),
    label: () => ({ type: 'label', text: '' }),
    list: () => ({ type: 'list', items: [] }),
    olist: () => ({ type: 'olist', items: [] }),
    callout: () => ({ type: 'callout', text: '', icon: '💡', tone: 'default' }),
    quote: () => ({ type: 'quote', text: '', attribution: '' }),
    code: () => ({ type: 'code', text: '' }),
    divider: () => ({ type: 'divider' }),
    stats: () => ({ type: 'stats', items: [{ value: '', label: '' }] }),
    table: () => ({ type: 'table', headers: ['Column 1', 'Column 2'], rows: [['', '']] }),
  };

  // ---------- images ----------
  async function uploadFile(file) {
    if (!IMAGE_TYPES.includes(file.type)) throw new Error('Only PNG, JPG, WebP and GIF images can be added.');
    if (file.size > 8 * 1024 * 1024) throw new Error('That image is over 8 MB. Please use a smaller one.');
    return (await api('POST', '/api/uploads', file, file.type)).file;
  }

  // An image found in pasted content: inline data is uploaded directly, a link is downloaded by
  // the server. Returns the stored path, or null if it could not be copied.
  async function uploadFromSrc(src) {
    try {
      if (/^data:image\//.test(src)) {
        const blob = await (await fetch(src)).blob();
        return await uploadFile(new File([blob], 'pasted', { type: blob.type }));
      }
      if (/^https?:\/\//.test(src)) return (await api('POST', '/api/uploads/from-url', { url: src })).file;
    } catch (e) {
      if (e.status === 401) throw e;
    }
    return null;
  }

  function handleUploadError(err, retry) {
    if (err.status === 401) { state.admin = false; openLogin(retry); }
    toast(err.message, 'error');
  }

  function pickImage(onFile) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = IMAGE_TYPES.join(',');
    input.addEventListener('change', async () => {
      const file = input.files[0];
      if (!file) return;
      toast('Uploading image…');
      try {
        onFile(await uploadFile(file));
        toast('Image added. Press Save to keep it.');
      } catch (err) {
        handleUploadError(err, () => pickImage(onFile));
      }
    });
    input.click();
  }

  // Image files (pasted or dropped) become image blocks at position `at`.
  async function insertImageFiles(files, at) {
    toast(files.length > 1 ? `Uploading ${files.length} images…` : 'Uploading image…');
    const blocks = [];
    for (const f of files) {
      try { blocks.push({ type: 'img', file: await uploadFile(f) }); } catch (err) { handleUploadError(err); return; }
    }
    restructure((c) => c.splice(at, 0, ...blocks), { index: at + blocks.length - 1, at: 'end' });
    toast(blocks.length > 1 ? `${blocks.length} images added.` : 'Image added.');
  }

  // ---------- pasted content -> blocks ----------
  const BLOCK_SEL = 'p,div,h1,h2,h3,h4,h5,h6,ul,ol,li,blockquote,pre,table,figure,img,hr,section,article,header,footer,main,aside,details';

  function htmlToBlocks(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const blocks = [];
    let inline = null;
    const flush = () => {
      if (inline) { const md = tidy(domToMd(inline)); if (md) blocks.push({ type: 'p', text: md }); inline = null; }
    };
    const plain = (el) => el.textContent.replace(/\s+/g, ' ').trim();
    const walk = (container) => {
      container.childNodes.forEach((n) => {
        if (n.nodeType === 3) { if (n.nodeValue.trim()) (inline ||= doc.createElement('span')).appendChild(n.cloneNode()); return; }
        if (n.nodeType !== 1) return;
        const tag = n.tagName.toLowerCase();
        if (/^(script|style|meta|link|title|head|svg|button)$/.test(tag)) return;
        if (!n.matches(BLOCK_SEL) && !n.querySelector(BLOCK_SEL)) { (inline ||= doc.createElement('span')).appendChild(n.cloneNode(true)); return; }
        flush();
        if (/^h[12]$/.test(tag)) blocks.push({ type: 'heading', text: plain(n) });
        else if (tag === 'h3') blocks.push({ type: 'subheading', text: plain(n) });
        else if (/^h[4-6]$/.test(tag)) blocks.push({ type: 'label', text: plain(n) });
        else if (tag === 'ul' || tag === 'ol') {
          const items = [...n.querySelectorAll('li')].map((li) => {
            const c = li.cloneNode(true);
            c.querySelectorAll('ul,ol').forEach((x) => x.remove());
            return tidy(domToMd(c));
          }).filter(Boolean);
          if (items.length) blocks.push({ type: tag === 'ol' ? 'olist' : 'list', items });
        } else if (tag === 'blockquote') blocks.push({ type: 'quote', text: tidy(domToMd(n)), attribution: '' });
        else if (tag === 'pre') blocks.push({ type: 'code', text: n.textContent.replace(/\n+$/, '') });
        else if (tag === 'hr') blocks.push({ type: 'divider' });
        else if (tag === 'img') { if (n.getAttribute('src')) blocks.push({ type: 'img', src: n.getAttribute('src') }); }
        else if (tag === 'figure' && n.querySelector('img')) {
          const cap = n.querySelector('figcaption');
          blocks.push({ type: 'img', src: n.querySelector('img').getAttribute('src'), caption: cap ? plain(cap) : '' });
        } else if (tag === 'table') {
          const rows = [...n.querySelectorAll('tr')].map((tr) => [...tr.children].map((td) => tidy(domToMd(td))));
          if (rows.length) {
            const width = Math.max(...rows.map((r) => r.length));
            const pad = (r) => [...r, ...Array(width - r.length).fill('')];
            blocks.push({ type: 'table', headers: pad(rows[0]).map(stripMd), rows: rows.slice(1).map(pad) });
          }
        } else if (n.querySelector(BLOCK_SEL)) walk(n);
        else { const md = tidy(domToMd(n)); if (md) blocks.push({ type: 'p', text: md }); }
      });
      flush();
    };
    walk(doc.body);
    return blocks.filter((b) => b.type === 'divider' || b.type === 'img' || (b.items || b.rows || (b.text || '').trim()));
  }

  // Plain text: one block per line, with markdown-style lines ("- ", "1. ", "# ", "> ", "---")
  // turned into the matching block.
  function textToBlocks(text) {
    const blocks = [];
    text.replace(/\r/g, '').split('\n').forEach((line) => {
      const t = line.trim();
      if (!t) return;
      const last = blocks[blocks.length - 1];
      let m;
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(t)) blocks.push({ type: 'divider' });
      else if ((m = t.match(/^[-*•]\s+(.*)$/))) { if (last && last.type === 'list') last.items.push(m[1]); else blocks.push({ type: 'list', items: [m[1]] }); }
      else if ((m = t.match(/^\d+[.)]\s+(.*)$/))) { if (last && last.type === 'olist') last.items.push(m[1]); else blocks.push({ type: 'olist', items: [m[1]] }); }
      else if ((m = t.match(/^###\s+(.*)$/))) blocks.push({ type: 'subheading', text: stripMd(m[1]) });
      else if ((m = t.match(/^#{1,2}\s+(.*)$/))) blocks.push({ type: 'heading', text: stripMd(m[1]) });
      else if ((m = t.match(/^>\s?(.*)$/))) blocks.push({ type: 'quote', text: m[1], attribution: '' });
      else blocks.push({ type: 'p', text: t });
    });
    return blocks;
  }

  // Pasted blocks go in below block `index` (replacing it if it is an empty paragraph).
  async function insertPastedBlocks(blocks, index) {
    const images = blocks.filter((b) => b.type === 'img');
    let failed = 0;
    if (images.length) {
      toast(`Copying ${images.length} image${images.length > 1 ? 's' : ''}…`);
      for (const b of images) {
        try { b.file = await uploadFromSrc(b.src); } catch (err) { handleUploadError(err); return; }
        if (!b.file) failed++;
        delete b.src;
        if (!b.caption) delete b.caption;
      }
    }
    const ready = blocks.filter((b) => b.type !== 'img' || b.file);
    if (!ready.length) { if (failed) toast('The pasted images could not be copied. Paste or upload the image files directly.', 'error'); return; }
    collect();
    const current = state.editing.draft.content[index];
    const replace = current && current.type === 'p' && !current.text.trim();
    const at = replace ? index : index + 1;
    restructure((c) => c.splice(at, replace ? 1 : 0, ...ready), { index: at + ready.length - 1, at: 'end' });
    toast(failed
      ? `Pasted ${ready.length} blocks. ${failed} image${failed > 1 ? 's' : ''} could not be copied; paste or upload ${failed > 1 ? 'them' : 'it'} directly.`
      : `Pasted ${ready.length} block${ready.length > 1 ? 's' : ''}.`, failed ? 'error' : undefined);
  }

  // ---------- popups: block menu, emoji picker, cover menu, formatting bar ----------
  function closePopups() {
    document.querySelectorAll('.ed-menu, .ed-format').forEach((m) => m.remove());
  }

  function placePopup(menu, anchor) {
    document.body.appendChild(menu);
    const r = anchor.getBoundingClientRect();
    const width = document.documentElement.clientWidth;
    menu.style.top = `${window.scrollY + r.bottom + 6}px`;
    menu.style.left = `${Math.max(8, Math.min(window.scrollX + r.left, window.scrollX + width - menu.offsetWidth - 8))}px`;
  }

  // Block menu, for "+" (insert below `index`) or "/" in an empty paragraph (replace it). Typing
  // filters the list; arrows and Enter pick.
  function openBlockMenu(anchor, index, replace) {
    closePopups();
    const menu = document.createElement('div');
    menu.className = 'ed-menu ed-block-menu';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-label', replace ? 'Turn into' : 'Add a block');
    menu.innerHTML = `
      <input class="ed-menu-filter" type="text" placeholder="${replace ? 'Turn into…' : 'Add a block…'} type to filter" aria-label="Filter block types" />
      <div class="ed-menu-list" role="listbox">${BLOCKS.map(([t, label, desc, words]) => `
        <button type="button" role="option" data-type="${t}" data-words="${esc(`${label} ${desc} ${words}`.toLowerCase())}">
          <span class="ed-menu-label">${label}</span><span class="ed-menu-desc">${desc}</span>
        </button>`).join('')}
      </div>`;
    placePopup(menu, anchor);
    const input = menu.querySelector('input');
    const visible = () => [...menu.querySelectorAll('[data-type]')].filter((b) => !b.hidden);
    let active = 0;
    const highlight = () => visible().forEach((b, k) => b.classList.toggle('is-active', k === active));
    highlight();
    input.focus();
    const choose = (type) => {
      closePopups();
      const at = replace ? index : index + 1;
      const place = (block) => restructure((c) => c.splice(at, replace ? 1 : 0, block), { index: at, at: 'start' });
      if (type === 'img') pickImage((file) => place({ type: 'img', file }));
      else place(NEW_BLOCK[type]());
    };
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      menu.querySelectorAll('[data-type]').forEach((b) => { b.hidden = q && !b.dataset.words.includes(q); });
      active = 0;
      highlight();
    });
    input.addEventListener('keydown', (e) => {
      const list = visible();
      if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % Math.max(1, list.length); highlight(); list[active]?.scrollIntoView({ block: 'nearest' }); }
      if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + list.length) % Math.max(1, list.length); highlight(); list[active]?.scrollIntoView({ block: 'nearest' }); }
      if (e.key === 'Enter') { e.preventDefault(); if (list[active]) choose(list[active].dataset.type); }
      if (e.key === 'Escape' || (e.key === 'Backspace' && !input.value && replace)) { e.preventDefault(); closePopups(); focusBlock(index, 'end'); }
    });
    menu.addEventListener('click', (e) => {
      const t = e.target.closest('[data-type]');
      if (t) choose(t.dataset.type);
    });
  }

  function openEmojiPicker(anchor, onPick, allowRemove) {
    closePopups();
    const menu = document.createElement('div');
    menu.className = 'ed-menu ed-emoji-menu';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-label', 'Pick an icon');
    menu.innerHTML = `
      <div class="ed-emoji-grid">${EMOJIS.map((e) => `<button type="button" data-emoji="${e}" aria-label="${e}">${e}</button>`).join('')}</div>
      <form class="ed-emoji-own"><input type="text" maxlength="8" placeholder="Or type / paste any emoji" aria-label="Any emoji" /><button type="submit" class="ed-btn ed-btn--small">Use</button></form>
      ${allowRemove ? '<button type="button" class="ed-btn ed-btn--small ed-btn--ghost" data-remove>Remove icon</button>' : ''}`;
    placePopup(menu, anchor);
    menu.querySelector('[data-emoji]').focus();
    menu.addEventListener('click', (e) => {
      const b = e.target.closest('[data-emoji]');
      if (b) { closePopups(); onPick(b.dataset.emoji); }
      if (e.target.closest('[data-remove]')) { closePopups(); onPick(''); }
    });
    menu.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      const v = menu.querySelector('input').value.trim();
      if (v) { closePopups(); onPick(v); }
    });
    menu.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopups(); });
  }

  // Cover: upload a picture, or reuse one of the images already on the page.
  function openCoverMenu(anchor) {
    closePopups();
    const pageImages = [...new Set(state.editing.draft.content.filter((b) => b.type === 'img').map((b) => b.file))];
    const menu = document.createElement('div');
    menu.className = 'ed-menu ed-cover-menu';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-label', 'Choose a cover');
    menu.innerHTML = `
      <button type="button" class="ed-btn ed-btn--small ed-btn--primary" data-upload>Upload an image</button>
      ${pageImages.length ? `<div class="ed-menu-title">Or use an image from this page</div><div class="ed-cover-grid">${pageImages.map((f) => `<button type="button" data-file="${esc(f)}"><img src="${esc(f)}" alt="" loading="lazy" /></button>`).join('')}</div>` : ''}`;
    placePopup(menu, anchor);
    menu.querySelector('[data-upload]').focus();
    const setCover = (file) => restructure((c, d) => { d.cover = file; });
    menu.addEventListener('click', (e) => {
      if (e.target.closest('[data-upload]')) { closePopups(); pickImage(setCover); }
      const f = e.target.closest('[data-file]');
      if (f) { closePopups(); setCover(f.dataset.file); }
    });
    menu.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopups(); });
  }

  // Floating bar over selected text: bold, italic, strikethrough, code, link, clear.
  function richFieldOf(node) {
    const el = node && (node.nodeType === 1 ? node : node.parentElement);
    return el ? el.closest('.ed-editing [data-rich]') : null;
  }

  function updateFormatBar() {
    const sel = window.getSelection();
    const field = state.editing && sel.rangeCount && !sel.isCollapsed ? richFieldOf(sel.anchorNode) : null;
    let bar = document.querySelector('.ed-format');
    if (!field || field !== richFieldOf(sel.focusNode)) { bar?.remove(); return; }
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'ed-format';
      bar.setAttribute('role', 'toolbar');
      bar.setAttribute('aria-label', 'Text formatting');
      bar.innerHTML = `
        <button type="button" data-fmt="bold" title="Bold (Ctrl+B)" aria-label="Bold"><b>B</b></button>
        <button type="button" data-fmt="italic" title="Italic (Ctrl+I)" aria-label="Italic"><i>I</i></button>
        <button type="button" data-fmt="strikeThrough" title="Strikethrough (Ctrl+Shift+S)" aria-label="Strikethrough"><s>S</s></button>
        <button type="button" data-fmt="code" title="Inline code (Ctrl+E)" aria-label="Inline code">&lt;/&gt;</button>
        <button type="button" data-fmt="link" title="Link (Ctrl+K)" aria-label="Link">🔗</button>
        <button type="button" data-fmt="color-menu" title="Text colour" aria-label="Text colour" aria-expanded="false"><span class="ed-color-a">A</span></button>
        <button type="button" data-fmt="clear" title="Clear formatting" aria-label="Clear formatting">T<sub>x</sub></button>
        <div class="ed-format-colors" hidden>${['', ...TEXT_COLORS].map((c) => `
          <button type="button" class="ed-swatch${c ? ` tc-${c}` : ' ed-swatch--default'}" data-fmt="color:${c}" title="${c ? COLOR_NAME(c) : 'Default colour'}" aria-label="${c ? COLOR_NAME(c) : 'Default colour'}"></button>`).join('')}
        </div>`;
      bar.addEventListener('mousedown', (e) => e.preventDefault()); // keep the selection
      bar.addEventListener('click', (e) => {
        const b = e.target.closest('[data-fmt]');
        if (!b) return;
        if (b.dataset.fmt === 'color-menu') {
          const colors = bar.querySelector('.ed-format-colors');
          colors.hidden = !colors.hidden;
          b.setAttribute('aria-expanded', String(!colors.hidden));
          return;
        }
        format(b.dataset.fmt);
      });
      document.body.appendChild(bar);
    }
    ['bold', 'italic', 'strikeThrough'].forEach((c) => {
      let on = false;
      try { on = document.queryCommandState(c); } catch (e) {}
      bar.querySelector(`[data-fmt="${c}"]`).classList.toggle('is-on', on);
    });
    const r = sel.getRangeAt(0).getBoundingClientRect();
    const width = document.documentElement.clientWidth;
    bar.style.top = `${window.scrollY + r.top - bar.offsetHeight - 8}px`;
    bar.style.left = `${Math.max(8, Math.min(window.scrollX + r.left + r.width / 2 - bar.offsetWidth / 2, window.scrollX + width - bar.offsetWidth - 8))}px`;
  }

  function format(cmd) {
    const sel = window.getSelection();
    if (!sel.rangeCount || !richFieldOf(sel.anchorNode)) return;
    const anchorEl = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement;
    if (cmd === 'code') {
      const code = anchorEl.closest('code');
      if (code) code.replaceWith(document.createTextNode(code.textContent));
      else if (!sel.isCollapsed) document.execCommand('insertHTML', false, `<code>${esc(sel.toString())}</code>`);
    } else if (cmd === 'link') {
      const existing = anchorEl.closest('a');
      const url = prompt('Link address (leave empty to remove the link)', existing ? existing.getAttribute('href') : 'https://');
      if (url === null) return;
      if (!url.trim()) document.execCommand('unlink');
      else if (!isAllowedHref(url.trim())) return toast('Links must start with https://, http://, mailto: or /', 'error');
      else document.execCommand('createLink', false, url.trim());
    } else if (cmd.startsWith('color:')) {
      colorSelection(cmd.slice(6));
    } else if (cmd === 'clear') {
      document.execCommand('removeFormat');
      document.execCommand('unlink');
      uncolorSelection();
    } else {
      document.execCommand(cmd);
    }
    markDirty();
    collect();
    history.lastWasStructural = false;
    updateFormatBar();
  }

  // Colour the selected words ({color:x}…{/color} once saved); '' takes the colour off again.
  function colorSelection(color) {
    const sel = window.getSelection();
    if (sel.isCollapsed) return;
    if (!TEXT_COLORS.includes(color)) { uncolorSelection(); return; }
    const box = document.createElement('div');
    box.appendChild(sel.getRangeAt(0).cloneContents());
    box.querySelectorAll('[data-color]').forEach((s) => s.replaceWith(...s.childNodes));
    document.execCommand('insertHTML', false, `<span class="tc tc-${color}" data-color="${color}">${box.innerHTML}</span>`);
  }

  // Coloured words the selection touches lose their colour.
  function uncolorSelection() {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const field = richFieldOf(range.commonAncestorContainer);
    if (!field) return;
    const inside = (range.commonAncestorContainer.nodeType === 1 ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement).closest('[data-color]');
    [...field.querySelectorAll('[data-color]'), ...(inside ? [inside] : [])]
      .filter((s) => s.isConnected && range.intersectsNode(s))
      .forEach((s) => s.replaceWith(...s.childNodes));
  }

  document.addEventListener('selectionchange', () => { if (state.editing) updateFormatBar(); });

  // ---------- events inside the editor ----------
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.ed-menu') && !e.target.closest('[data-act="add"], [data-act="icon-pick"], [data-act="cover-pick"], [data-act="callout-icon"], [data-act="style"], [data-act="bulk-style"], [data-act="download"]')) {
      document.querySelectorAll('.ed-menu').forEach((m) => m.remove());
    }
    if (!state.editing || !e.target.closest('.ed-editing')) return;
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const i = Number(btn.dataset.i);
    const j = Number(btn.dataset.j);
    switch (btn.dataset.act) {
      case 'up': restructure((c) => c.splice(i - 1, 0, c.splice(i, 1)[0]), { index: i - 1, at: 'end' }); break;
      case 'down': restructure((c) => c.splice(i + 1, 0, c.splice(i, 1)[0]), { index: i + 1, at: 'end' }); break;
      case 'duplicate': restructure((c) => c.splice(i + 1, 0, clone(c[i])), { index: i + 1, at: 'end' }); break;
      case 'delete': restructure((c) => c.splice(i, 1), { index: Math.max(0, i - 1), at: 'end' }); break;
      case 'add': openBlockMenu(btn, i, false); break;
      case 'replace-image': pickImage((file) => restructure((c) => { c[i].file = file; })); break;
      case 'image-cover': restructure((c, d) => { d.cover = c[i].file; }); toast('Cover set.'); break;
      case 'add-stat': restructure((c) => c[i].items.push({ value: '', label: '' })); break;
      case 'del-stat': restructure((c) => c[i].items.splice(j, 1)); break;
      case 'add-row': restructure((c) => c[i].rows.push(c[i].headers.map(() => ''))); break;
      case 'add-col': restructure((c) => { c[i].headers.push(''); c[i].rows.forEach((r) => r.push('')); }); break;
      // Cell colours move with their cells when a row or column is removed.
      case 'del-row': restructure((c) => { c[i].rows.splice(j, 1); if (Array.isArray(c[i].cellStyles)) c[i].cellStyles.splice(j, 1); }); break;
      case 'del-col': restructure((c) => {
        c[i].headers.splice(j, 1);
        c[i].rows.forEach((r) => r.splice(j, 1));
        if (Array.isArray(c[i].headStyles)) c[i].headStyles.splice(j, 1);
        if (Array.isArray(c[i].cellStyles)) c[i].cellStyles.forEach((r) => Array.isArray(r) && r.splice(j, 1));
      }); break;
      case 'pick-row': case 'pick-col': pickLine(i, btn.dataset.act === 'pick-row' ? 'row' : 'col', j, e.shiftKey); break;
      case 'pick-table': {
        const t = state.editing.draft.content[i];
        setCellPick(i, { r: -1, c: 0 }, { r: t.rows.length - 1, c: t.headers.length - 1 });
        break;
      }
      case 'callout-icon': openEmojiPicker(btn, (emoji) => restructure((c) => { c[i].icon = emoji || '💡'; })); break;
      case 'icon-pick': openEmojiPicker(btn, (emoji) => restructure((c, d) => { d.icon = emoji; }), Boolean(state.editing.draft.icon)); break;
      case 'cover-pick': openCoverMenu(btn); break;
      case 'cover-remove': restructure((c, d) => { d.cover = ''; }); break;
      // The 🎨 of a ticked block changes all ticked blocks; of any other block, just that one.
      case 'style': openStyleMenu(btn, state.editing.picked.has(i) ? [...state.editing.picked].sort((a, b) => a - b) : [i]); break;
    }
  });

  document.addEventListener('change', (e) => {
    if (!state.editing) return;
    const i = Number(e.target.dataset.i);
    if (e.target.matches('.ed-tone')) {
      restructure((c) => { c[i].tone = e.target.value; });
    } else if (e.target.matches('.ed-align')) {
      restructure((c) => {
        if (e.target.value === 'left') delete c[i].align;
        else c[i].align = e.target.value;
      });
    } else if (e.target.matches('.ed-type')) {
      const type = e.target.value;
      restructure((c) => { c[i] = convert(c[i], type); }, { index: i, at: 'end' });
    } else if (e.target.matches('.ed-pick')) {
      setPicked([i], e.target.checked);
    } else if (e.target.closest('.ed-tags')) {
      markDirty();
      collect();
    }
  });

  // Typing "- ", "1. ", "# ", "## ", "### ", "> " at the start of a paragraph, or "---", turns it
  // into that kind of block, as in Notion.
  const SHORTCUTS = [[/^[-*] $/, 'list'], [/^1[.)] $/, 'olist'], [/^### $/, 'subheading'], [/^##? $/, 'heading'], [/^> $/, 'quote'], [/^---$/, 'divider']];
  function markdownShortcut(el) {
    const blockEl = el.closest('.ed-block');
    if (!blockEl || el.dataset.k !== 'text') return false;
    const i = Number(blockEl.dataset.i);
    if (state.editing.draft.content[i].type !== 'p') return false;
    const text = el.textContent.replace(/ /g, ' ');
    const at = caretOffset(el);
    const head = text.slice(0, at);
    const hit = SHORTCUTS.find(([re]) => re.test(head));
    if (!hit) return false;
    const rest = tidy(escMd(text.slice(at)));
    const type = hit[1];
    restructure((c) => {
      c[i] = LISTS.includes(type) ? { type, items: rest ? [rest] : [] } : convert({ type: 'p', text: rest }, type);
      if (type === 'divider') c.splice(i + 1, 0, { type: 'p', text: '' });
    }, { index: type === 'divider' ? i + 1 : i, at: 'start' });
    return true;
  }

  document.addEventListener('input', (e) => {
    if (!state.editing || !e.target.closest || !e.target.closest('.ed-editing')) return;
    markDirty();
    history.lastWasStructural = false;
    if (e.target.isContentEditable && markdownShortcut(e.target)) return;
    collect();
  });

  // Pasting: image files become image blocks; content copied from Notion, Google Docs, Word or a
  // web page becomes matching blocks (headings, lists, tables, images, formatting). A short
  // snippet is pasted in place, formatted where the field allows it.
  document.addEventListener('paste', (e) => {
    if (!state.editing || !e.target.closest || !e.target.closest('.ed-editing')) return;
    const cd = e.clipboardData || window.clipboardData;
    const blockEl = e.target.closest('.ed-block');
    const index = blockEl ? Number(blockEl.dataset.i) : state.editing.draft.content.length - 1;
    const files = [...(cd.files || [])].filter((f) => IMAGE_TYPES.includes(f.type));
    if (files.length) {
      e.preventDefault();
      insertImageFiles(files, index + 1);
      return;
    }
    const field = e.target.closest('[contenteditable]');
    if (!field) return;
    e.preventDefault();
    const html = cd.getData('text/html');
    const text = cd.getData('text/plain');
    const block = blockEl ? state.editing.draft.content[index] : null;
    if (block && block.type === 'code') { document.execCommand('insertText', false, text); return; }
    const blocks = html ? htmlToBlocks(html) : textToBlocks(text);
    const isBodyBlock = block && (RICH.includes(block.type) || PLAIN.includes(block.type) || LISTS.includes(block.type)) && !field.closest('cite');
    const single = blocks.length === 1 && blocks[0].type === 'p';
    if (!blocks.length) return;
    if (single || !isBodyBlock) {
      const md = blocks.map((b) => b.text || (b.items || []).join(' ') || '').filter(Boolean).join(' ');
      if (field.dataset.rich) document.execCommand('insertHTML', false, inlineHtml(md));
      else document.execCommand('insertText', false, stripMd(md));
      return;
    }
    insertPastedBlocks(blocks, index);
  });

  // Dragging: a block by its ⋮⋮ handle to move it, or image files from the computer to add them.
  let dragFrom = null;
  const dropIndex = (y) => {
    const blocks = [...document.querySelectorAll('.ed-block')];
    const k = blocks.findIndex((b) => { const r = b.getBoundingClientRect(); return y < r.top + r.height / 2; });
    return k < 0 ? blocks.length : k;
  };
  // Line where a dragged block or image will land; -1 clears it.
  const showDropLine = (k) => {
    document.querySelectorAll('.ed-drop-before, .ed-drop-after').forEach((b) => b.classList.remove('ed-drop-before', 'ed-drop-after'));
    const blocks = document.querySelectorAll('.ed-block');
    if (k < 0) return;
    if (k < blocks.length) blocks[k].classList.add('ed-drop-before');
    else if (blocks.length) blocks[blocks.length - 1].classList.add('ed-drop-after');
  };
  document.addEventListener('dragstart', (e) => {
    const handle = e.target.closest && e.target.closest('.ed-handle');
    if (!handle || !state.editing) return;
    collect();
    dragFrom = Number(handle.dataset.i);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', 'block');
    const blockEl = handle.closest('.ed-block');
    e.dataTransfer.setDragImage(blockEl, 20, 20);
    blockEl.classList.add('ed-dragging');
  });
  document.addEventListener('dragover', (e) => {
    if (!state.editing || !e.target.closest || !e.target.closest('.ed-editing')) return;
    const files = [...(e.dataTransfer.types || [])].includes('Files');
    if (dragFrom === null && !files) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = files ? 'copy' : 'move';
    showDropLine(dropIndex(e.clientY));
  });
  document.addEventListener('drop', (e) => {
    if (!state.editing || !e.target.closest || !e.target.closest('.ed-editing')) return;
    const to = dropIndex(e.clientY);
    showDropLine(-1);
    const files = [...(e.dataTransfer.files || [])].filter((f) => IMAGE_TYPES.includes(f.type));
    if (files.length) { e.preventDefault(); insertImageFiles(files, to); return; }
    if (dragFrom === null) return;
    e.preventDefault();
    const from = dragFrom;
    dragFrom = null;
    if (to === from || to === from + 1) { drawEditor(); return; }
    restructure((c) => { const [b] = c.splice(from, 1); c.splice(to > from ? to - 1 : to, 0, b); });
  });
  document.addEventListener('dragend', () => {
    dragFrom = null;
    document.querySelectorAll('.ed-dragging').forEach((b) => b.classList.remove('ed-dragging'));
    document.querySelectorAll('.ed-drop-before, .ed-drop-after').forEach((b) => b.classList.remove('ed-drop-before', 'ed-drop-after'));
  });

  // Where the caret is inside an element, counted in characters.
  function caretOffset(el) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return 0;
    const r = sel.getRangeAt(0);
    const pre = document.createRange();
    pre.selectNodeContents(el);
    pre.setEnd(r.startContainer, r.startOffset);
    return pre.toString().length;
  }

  // Cut the text after the caret out of `el`, returning it (markdown-style for rich fields).
  function cutAfterCaret(el) {
    const sel = window.getSelection();
    const r = sel.getRangeAt(0);
    r.deleteContents();
    const after = document.createRange();
    after.selectNodeContents(el);
    after.setStart(r.endContainer, r.endOffset);
    const box = document.createElement('div');
    box.appendChild(after.extractContents());
    return el.dataset.rich ? readRich(box) : escMd(box.textContent.trim());
  }

  const TEXTY = [...RICH, 'heading', 'subheading', 'eyebrow', 'label'];

  document.addEventListener('keydown', (e) => {
    if (!state.editing) return;
    const mod = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();
    if (mod && key === 's') { e.preventDefault(); save(); return; }
    // Ctrl+A outside a text field ticks every block; inside one it selects the text as usual.
    if (mod && key === 'a' && !e.target.isContentEditable && !/^(input|textarea|select)$/i.test(e.target.tagName)) {
      e.preventDefault();
      toggleSelectAll();
      return;
    }
    if (e.key === 'Escape' && state.editing.cellPick && !document.querySelector('.ed-menu, .ed-modal')) {
      clearCellPick();
      return;
    }
    if (e.key === 'Escape' && state.editing.picked.size && !document.querySelector('.ed-menu, .ed-modal')) {
      setPicked([...state.editing.picked], false);
      return;
    }
    const el = e.target;
    const inEditor = el.closest && el.closest('.ed-editing');
    // Undo/redo of block changes; inside a text field after typing, the browser's own undo runs.
    if (mod && key === 'z' && (history.lastWasStructural || !el.isContentEditable)) {
      if (e.shiftKey ? history.redo.length : history.undo.length) { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
    }
    if (mod && key === 'y' && history.redo.length && (history.lastWasStructural || !el.isContentEditable)) { e.preventDefault(); redo(); return; }
    if (!inEditor || !el.isContentEditable) return;

    if (el.dataset.rich) {
      if (mod && key === 'k') { e.preventDefault(); format('link'); return; }
      if (mod && key === 'e') { e.preventDefault(); format('code'); return; }
      if (mod && e.shiftKey && key === 's') { e.preventDefault(); format('strikeThrough'); return; }
      if (mod && key === 'u') { e.preventDefault(); return; } // underline isn't kept, so don't offer it
    }

    const blockEl = el.closest('.ed-block');
    const i = blockEl ? Number(blockEl.dataset.i) : -1;
    const block = blockEl ? state.editing.draft.content[i] : null;
    const isMain = block && TEXTY.includes(block.type) && el.dataset.k === 'text';
    const sel = window.getSelection();

    if (e.key === 'Enter' && !e.shiftKey) {
      if (block && LISTS.includes(block.type)) {
        // Enter on an empty last bullet leaves the list, as in Notion.
        const li = sel.anchorNode && (sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement).closest('li');
        const lis = [...el.querySelectorAll('li')];
        if (li && !li.textContent.trim() && li === lis[lis.length - 1]) {
          e.preventDefault();
          li.remove();
          restructure((c) => c.splice(i + 1, 0, { type: 'p', text: '' }), { index: i + 1, at: 'start' });
        }
        return;
      }
      if (block && block.type === 'code') { e.preventDefault(); document.execCommand('insertText', false, '\n'); return; }
      e.preventDefault();
      if (isMain) {
        // Enter splits the text at the caret and continues in a new paragraph below.
        const rest = cutAfterCaret(el);
        restructure((c) => c.splice(i + 1, 0, { type: 'p', text: rest }), { index: i + 1, at: 'start' });
      }
      return;
    }
    if (e.key === 'Tab' && block && block.type === 'code') { e.preventDefault(); document.execCommand('insertText', false, '  '); return; }

    if (e.key === 'Backspace' && sel.isCollapsed && block) {
      const empty = !el.textContent.trim();
      if (LISTS.includes(block.type) && empty && el.querySelectorAll('li').length <= 1) {
        e.preventDefault();
        restructure((c) => { c[i] = { type: 'p', text: '' }; }, { index: i, at: 'start' });
        return;
      }
      if (isMain && empty) {
        e.preventDefault();
        restructure((c) => c.splice(i, 1), { index: Math.max(0, i - 1), at: 'end' });
        return;
      }
      // Backspace at the very start joins the text onto the block above, as in Notion.
      const prev = state.editing.draft.content[i - 1];
      if (isMain && caretOffset(el) === 0 && prev && TEXTY.includes(prev.type)) {
        e.preventDefault();
        collect();
        const prevRich = RICH.includes(prev.type);
        const curRich = RICH.includes(block.type);
        const joinAt = (prevRich ? stripMd(prev.text) : prev.text).length;
        const tail = prevRich ? (curRich ? block.text : escMd(block.text)) : (curRich ? stripMd(block.text) : block.text);
        restructure((c) => { c[i - 1].text = `${c[i - 1].text}${tail}`; c.splice(i, 1); });
        const prevField = document.querySelector(`.ed-block[data-i="${i - 1}"] [data-k="text"]`);
        if (prevField) placeCaret(prevField, joinAt);
        return;
      }
    }

    // Arrow keys move between blocks at the start or end of a field.
    if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && sel.isCollapsed && block && !e.shiftKey) {
      const len = el.textContent.length;
      const off = caretOffset(el);
      const fields = [...document.querySelectorAll('.ed-blocks [contenteditable]')];
      const k = fields.indexOf(el);
      if (e.key === 'ArrowUp' && off === 0 && k > 0) { e.preventDefault(); placeCaret(fields[k - 1], 'end'); }
      if (e.key === 'ArrowDown' && off === len && k >= 0 && k < fields.length - 1) { e.preventDefault(); placeCaret(fields[k + 1], 'start'); }
    }

    if (e.key === '/' && block && block.type === 'p' && el.dataset.k === 'text' && !el.textContent.trim()) {
      e.preventDefault();
      openBlockMenu(el, i, true);
    }
  });

  // Leaving edit mode by a link asks first when there are unsaved changes.
  document.addEventListener('click', (e) => {
    if (!state.editing || !state.editing.dirty) return;
    // A download link (a[download]) saves a file and does not leave the page.
    const link = e.target.closest('a[href]:not([download]), [data-back]');
    if (!link || link.closest('.ed-editing [contenteditable]')) return;
    if (!confirm('You have unsaved changes. Leave without saving?')) {
      e.preventDefault();
      e.stopImmediatePropagation();
    } else {
      state.editing = null;
      document.querySelectorAll('.ed-savebar, .ed-bulkbar').forEach((b) => b.remove());
    }
  }, true);

  // Links inside text being edited are for editing, not for following.
  document.addEventListener('click', (e) => {
    if (state.editing && e.target.closest && e.target.closest('.ed-editing [contenteditable] a')) e.preventDefault();
  });

  // Browser back/forward can't be stopped, so unsaved edits are kept in memory instead and the
  // case study offers "Resume unsaved edits" when you come back to it.
  window.addEventListener('hashchange', () => {
    closePopups();
    if (!state.editing) return;
    if (state.editing.dirty && state.editing.id) state.stashed.set(state.editing.id, state.editing.draft);
    state.editing = null;
    document.querySelectorAll('.ed-savebar, .ed-bulkbar').forEach((b) => b.remove());
  });

  window.addEventListener('beforeunload', (e) => {
    if (state.editing && state.editing.dirty) { e.preventDefault(); e.returnValue = ''; }
  });

  // ---------- save, cancel, revert ----------
  function problems(draft) {
    if (!draft.title) return 'The title can’t be empty.';
    if (!draft.tags.length) return 'Pick at least one section to show this case study under.';
    return null;
  }

  // Empty blocks left over from editing are dropped rather than saved.
  function withoutEmptyBlocks(content) {
    return content.filter((b) => {
      if (LISTS.includes(b.type)) return b.items.length;
      if (b.type === 'stats') return (b.items = b.items.filter((s) => s.value || s.label)).length;
      if (b.type === 'table') return b.headers.length;
      if (b.type === 'img') return b.file;
      if (b.type === 'divider') return true;
      return (b.text || '').trim();
    });
  }

  function applyToPage(cs, edited) {
    let target = CASE_STUDIES.find((c) => c.id === cs.id);
    if (!target) { target = { ...cs }; CASE_STUDIES.unshift(target); return; }
    Object.assign(target, { title: cs.title, description: cs.description, tags: cs.tags, content: cs.content, cover: cs.cover || '', icon: cs.icon || '' });
    if (cs.isNew) return;
    if (typeof EDITED_CASE_IDS !== 'undefined') {
      const at = EDITED_CASE_IDS.indexOf(cs.id);
      if (edited && at < 0) EDITED_CASE_IDS.push(cs.id);
      if (!edited && at >= 0) EDITED_CASE_IDS.splice(at, 1);
    }
  }

  let saving = false;
  async function save() {
    if (!state.editing || saving) return;
    const draft = collect();
    const problem = problems(draft);
    if (problem) return toast(problem, 'error');
    const body = { ...draft, content: withoutEmptyBlocks(clone(draft.content)) };
    saving = true;
    const status = document.querySelector('.ed-status');
    if (status) status.textContent = 'Saving…';
    try {
      if (!state.editing.id) {
        const res = await api('POST', '/api/cases', body);
        applyToPage(res.caseStudy, true);
        state.editing = null;
        document.querySelectorAll('.ed-savebar, .ed-bulkbar').forEach((b) => b.remove());
        window.location.hash = `#/case/${res.caseStudy.id}`;
        toast('Case study created. It is live for everyone.');
        return;
      }
      const res = await api('PUT', `/api/cases/${encodeURIComponent(state.editing.id)}`, body);
      applyToPage(res.caseStudy, true);
      stopEditing();
      toast('Saved. The change is live for everyone.');
    } catch (err) {
      if (status) status.textContent = 'Not saved';
      if (err.status === 401) { state.admin = false; openLogin(() => { state.admin = true; save(); }); }
      toast(err.message, 'error');
    } finally {
      saving = false;
    }
  }

  function cancel() {
    if (state.editing.dirty && !confirm('Discard your unsaved changes?')) return;
    stopEditing();
  }

  async function revert() {
    if (!confirm('Revert this case study to its original text? Every edit made on the site to it will be removed.')) return;
    try {
      const res = await api('POST', `/api/cases/${encodeURIComponent(state.editing.id)}/revert`);
      applyToPage(res.caseStudy, false);
      stopEditing();
      toast('Reverted to the original.');
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  async function deleteCase() {
    const id = state.editing.id;
    if (!confirm('Permanently delete this case study? It will be removed from the site for everyone. This cannot be undone.')) return;
    try {
      await api('DELETE', `/api/cases/${encodeURIComponent(id)}`);
      const cs = CASE_STUDIES.find((c) => c.id === id);
      const index = CASE_STUDIES.indexOf(cs);
      if (index >= 0) CASE_STUDIES.splice(index, 1);
      state.editing = null;
      document.querySelectorAll('.ed-savebar, .ed-bulkbar').forEach((b) => b.remove());
      window.location.hash = cs && cs.tags[0] ? `#/tag/${cs.tags[0]}` : '#/';
      toast('Case study deleted.');
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  // ---------- adding a case study ----------
  // On a category page the admin gets an "Add a case study" card. It starts a blank page in the
  // block editor, or imports a PDF, Word (.docx) or HTML file and turns it into blocks first.
  window.onCategoryRendered = (category) => {
    state.category = category;
    refreshAddCard();
  };

  // Also runs after logging in, while the category page is already showing.
  function refreshAddCard() {
    const category = state.category;
    if (!state.admin || !category || window.location.hash !== `#/tag/${category.slug}` || document.querySelector('.ed-add-case')) return;
    const app = document.getElementById('app');
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'card ed-add-case';
    card.innerHTML = `<span class="ed-add-case-plus" aria-hidden="true">+</span><h3>Add a case study</h3><p>Start from a blank page, or import a PDF, Word or HTML file.</p>`;
    card.addEventListener('click', () => openNewCaseDialog(category));
    const grid = app.querySelector('.grid');
    const empty = grid && grid.querySelector('.empty-state');
    if (empty) empty.after(card); else if (grid) grid.prepend(card);
  }

  function blankDraft(category, title) {
    return { title: title || '', description: '', tags: [category.slug], content: [{ type: 'p', text: '' }], cover: '', icon: '' };
  }

  function openNewCaseDialog(category) {
    document.querySelector('.ed-modal')?.remove();
    const modal = document.createElement('div');
    modal.className = 'ed-modal';
    modal.innerHTML = `
      <div class="ed-modal-box ed-new-box" role="dialog" aria-modal="true" aria-labelledby="ed-new-title">
        <h2 id="ed-new-title">New case study</h2>
        <p>It will be listed under <strong>${esc(category.name)}</strong>; you can add more sections in the editor.</p>
        <label class="ed-field"><span>Title <em>(optional when importing; taken from the file)</em></span><input type="text" name="title" maxlength="300" placeholder="e.g. AI Cold Call Coach for a Sales Team" /></label>
        <div class="ed-new-options">
          <button type="button" class="ed-new-option" data-act="blank">
            <span class="ed-new-option-icon" aria-hidden="true">✎</span>
            <span><strong>Start from scratch</strong><br />Build it block by block in the editor</span>
          </button>
          <label class="ed-new-option ed-drop" tabindex="0">
            <span class="ed-new-option-icon" aria-hidden="true">⇪</span>
            <span><strong>Import a file</strong><br />PDF, Word (.docx) or HTML. Drop it here or click to choose.</span>
            <input type="file" accept=".pdf,.docx,.html,.htm,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/html" hidden />
          </label>
        </div>
        <p class="ed-import-status" role="status" hidden></p>
        <p class="ed-error" hidden></p>
        <div class="ed-modal-actions"><button type="button" class="ed-btn" data-act="close">Cancel</button></div>
      </div>`;
    document.body.appendChild(modal);
    const titleInput = modal.querySelector('input[name="title"]');
    const fileInput = modal.querySelector('input[type="file"]');
    const drop = modal.querySelector('.ed-drop');
    const status = modal.querySelector('.ed-import-status');
    const error = modal.querySelector('.ed-error');
    let busy = false;
    const close = () => { if (!busy) modal.remove(); };
    titleInput.focus();
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('[data-act="close"]')) close();
      if (e.target.closest('[data-act="blank"]')) { modal.remove(); startNewCase(blankDraft(category, titleInput.value.trim())); }
    });
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
      if ((e.key === 'Enter' || e.key === ' ') && e.target === drop) { e.preventDefault(); fileInput.click(); }
    });
    const run = async (file) => {
      if (!file || busy) return;
      busy = true;
      error.hidden = true;
      status.hidden = false;
      modal.querySelectorAll('.ed-new-option, [data-act="close"]').forEach((b) => b.classList.add('is-disabled'));
      try {
        const draft = await importFile(file, category, (msg) => { status.textContent = msg; });
        if (titleInput.value.trim()) draft.title = titleInput.value.trim();
        busy = false;
        modal.remove();
        startNewCase(draft);
        toast(`Imported ${draft.content.length} blocks. Check them over, then press Create case study.`);
      } catch (err) {
        busy = false;
        status.hidden = true;
        error.textContent = err.message;
        error.hidden = false;
        modal.querySelectorAll('.is-disabled').forEach((b) => b.classList.remove('is-disabled'));
        if (err.status === 401) { modal.remove(); state.admin = false; openLogin(); }
      }
    };
    fileInput.addEventListener('change', () => run(fileInput.files[0]));
    drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('is-over'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('is-over'));
    drop.addEventListener('drop', (e) => { e.preventDefault(); drop.classList.remove('is-over'); run(e.dataTransfer.files[0]); });
  }

  // ---------- downloading a case study as PDF or Word ----------
  // Built from the blocks (not a screenshot), so the text stays selectable and editable. Colours
  // use the light theme's shades, since both files are read on white paper.
  const PRINT_COLORS = {
    orange: '#c2410c', red: '#c62828', green: '#2e7d32', blue: '#1d4ed8', purple: '#7c3aed', yellow: '#a16207', gray: '#6b6475',
    pink: '#be185d', teal: '#0f766e', indigo: '#4338ca', brown: '#8b5a2b', ink: '#140827',
  };
  // Text size of a block, as a multiple of the normal size (style.css draws them with zoom).
  const SIZE_FACTOR = { sm: 0.88, lg: 1.15, xl: 1.3 };
  // Fill of a cell on paper: the solid colour when strong, otherwise a soft tint.
  const cellFill = (s) => (s.fill ? (s.strong ? PRINT_COLORS[s.fill] : tint(PRINT_COLORS[s.fill])) : undefined);
  const PRINT = { text: '#140827', muted: '#5c5468', accent: '#f55809', link: '#b8410a', border: '#e5dac6', soft: '#faf7f1', base: '#ece4d4', code: '#f1edf6' };
  const CALLOUT_FILL = { default: '#f1ecfb', green: '#e8f5e9', blue: '#e8f0fe', yellow: '#fff8e1', red: '#fdecea', gray: '#f1f1f3' };
  // pdfmake's font has no emoji, which would print as empty boxes.
  const noEmoji = (s) => String(s || '').replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}]/gu, '').replace(/\s{2,}/g, ' ');
  const absUrl = (href) => new URL(href, `${window.location.origin}/`).href;
  // A cell fill on paper: the colour mixed into white, like the soft tint on the page.
  const tint = (hex, amount = 0.22) => `#${[1, 3, 5].map((k) => Math.round(parseInt(hex.substr(k, 2), 16) * amount + 255 * (1 - amount)).toString(16).padStart(2, '0')).join('')}`;
  const downloadName = (cs, ext) => `${(cs.title || 'case-study').replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-').slice(0, 80) || 'case-study'}.${ext}`;

  function openDownloadMenu(anchor, getCase, upward) {
    closePopups();
    const menu = document.createElement('div');
    menu.className = 'ed-menu';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-label', 'Download');
    menu.innerHTML = `
      <p class="ed-menu-title">Download${state.editing ? ' (includes unsaved edits)' : ''}</p>
      <button type="button" role="menuitem" data-format="pdf">PDF document (.pdf)</button>
      <button type="button" role="menuitem" data-format="docx">Word document (.docx)</button>`;
    placePopup(menu, anchor);
    if (upward) menu.style.top = `${window.scrollY + anchor.getBoundingClientRect().top - menu.offsetHeight - 6}px`;
    menu.querySelector('button').focus();
    menu.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopups(); });
    menu.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-format]');
      if (!b) return;
      closePopups();
      const cs = getCase();
      if (!cs) return;
      toast(`Preparing the ${b.dataset.format === 'pdf' ? 'PDF' : 'Word file'}…`);
      try {
        if (b.dataset.format === 'pdf') await downloadPdf(cs);
        else await downloadDocx(cs);
      } catch (err) {
        console.error(err);
        toast(err.message || 'The file could not be made. Please try again.', 'error');
      }
    });
  }

  // Markdown-style text to runs of text with their formatting, read from the same HTML the page shows.
  function inlineRuns(md) {
    const box = document.createElement('div');
    box.innerHTML = inlineHtml(md || '');
    const runs = [];
    (function walk(node, fmt) {
      node.childNodes.forEach((n) => {
        if (n.nodeType === 3) { if (n.nodeValue) runs.push({ ...fmt, text: n.nodeValue }); return; }
        if (n.nodeType !== 1) return;
        const tag = n.tagName.toLowerCase();
        const f = { ...fmt };
        if (tag === 'strong' || tag === 'b') f.bold = true;
        if (tag === 'em' || tag === 'i') f.italics = true;
        if (tag === 's') f.strike = true;
        if (tag === 'code') f.code = true;
        if (tag === 'a') f.link = absUrl(n.getAttribute('href'));
        if (TEXT_COLORS.includes(n.getAttribute('data-color'))) f.color = n.getAttribute('data-color');
        walk(n, f);
      });
    })(box, {});
    return runs;
  }

  // List items with their "Term:" lead-ins bolded the way the page shows them (listHtml in app.js).
  function exportItems(items) {
    const bold = items.filter(splitLeadIn).length * 2 >= items.length;
    return items.map((t) => {
      const m = bold && !/^\*\*/.test(t) && splitLeadIn(t);
      return m ? `**${m[1]}:** ${m[2]}` : t;
    });
  }

  // An image on the page as a data URL, at most 1600px wide (JPEG gets a white background).
  async function imageForFile(file, type) {
    try {
      const img = new Image();
      img.src = absUrl(file);
      await img.decode();
      const scale = Math.min(1, 1600 / img.naturalWidth);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext('2d');
      if (type === 'image/jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return { dataUrl: canvas.toDataURL(type, 0.88), width: canvas.width, height: canvas.height };
    } catch (e) {
      return null; // a missing image is left out rather than stopping the download
    }
  }

  function saveBlob(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 10000);
  }

  const defined = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== false));

  async function downloadPdf(cs) {
    await loadScript(LIBS.pdfmake);
    await loadScript(LIBS.pdfFonts);
    const W = 495; // A4 width minus the margins, in points
    const runs = (md) => inlineRuns(md).map((r) => defined({
      text: noEmoji(r.text),
      bold: r.bold,
      italics: r.italics,
      decoration: r.strike ? 'lineThrough' : undefined,
      color: r.color ? PRINT_COLORS[r.color] : (r.link ? PRINT.link : undefined),
      link: r.link,
      background: r.code ? PRINT.code : undefined,
    }));
    const lines = (style) => ({
      hLineWidth: (i, node) => (style === 'minimal' ? (i === 1 ? 1.5 : (i === 0 || i === node.table.body.length ? 0 : 0.5)) : 0.5),
      vLineWidth: (i, node) => (style === 'bordered' || ((style === 'default' || style === 'header') && (i === 0 || i === node.table.widths.length)) ? 0.5 : 0),
      hLineColor: () => PRINT.border,
      vLineColor: () => PRINT.border,
      paddingLeft: () => 6, paddingRight: () => 6, paddingTop: () => 4, paddingBottom: () => 4,
    });

    const content = [];
    if (cs.cover) {
      const im = await imageForFile(cs.cover, 'image/jpeg');
      if (im) content.push({ image: im.dataUrl, fit: [W, 200], alignment: 'center', margin: [0, 0, 0, 14] });
    }
    content.push({ text: noEmoji(cs.title), style: 'title' });
    if (cs.description) content.push({ text: noEmoji(cs.description), style: 'lead' });

    for (const b of cs.content) {
      const color = PRINT_COLORS[b.color];
      const alignment = b.align || 'left';
      const f = SIZE_FACTOR[b.size] || 1;
      const fs = (n) => (f === 1 ? n : Math.round(n * f * 10) / 10);
      const start = content.length;
      switch (b.type) {
        case 'heading': case 'eyebrow': content.push(defined({ text: noEmoji(b.text), style: 'h2', color, alignment, fontSize: f === 1 ? undefined : fs(15) })); break;
        case 'subheading': content.push(defined({ text: noEmoji(b.text), style: 'h3', color, alignment, fontSize: f === 1 ? undefined : fs(12.5) })); break;
        case 'label': content.push(defined({ text: noEmoji(b.text), bold: true, color, alignment, margin: [0, 4, 0, 4] })); break;
        case 'list': case 'olist':
          if (!b.items.length) break;
          content.push(defined({
            [b.type === 'olist' ? 'ol' : 'ul']: exportItems(b.items).map((t) => ({ text: runs(t), alignment })),
            color, markerColor: PRINT_COLORS[b.marker] || PRINT.accent, margin: [0, 0, 0, 8],
          }));
          break;
        case 'callout':
          content.push({
            table: { widths: ['*'], body: [[defined({ text: runs(b.text), fillColor: CALLOUT_FILL[b.tone] || CALLOUT_FILL.default, color, alignment, margin: [10, 8, 10, 8] })]] },
            layout: 'noBorders', margin: [0, 4, 0, 10],
          });
          break;
        case 'quote':
          content.push({
            table: { widths: ['*'], body: [[{ stack: [defined({ text: runs(b.text), italics: true, color, alignment }), b.attribution ? { text: `— ${noEmoji(b.attribution)}`, fontSize: 9, color: PRINT.muted, margin: [0, 4, 0, 0] } : ''], margin: [10, 4, 0, 4] }]] },
            layout: { hLineWidth: () => 0, vLineWidth: (i) => (i === 0 ? 3 : 0), vLineColor: () => PRINT.accent },
            margin: [0, 4, 0, 10],
          });
          break;
        case 'divider': content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: W, y2: 0, lineWidth: 0.5, lineColor: PRINT.border }], margin: [0, 8, 0, 8] }); break;
        case 'img': {
          const im = await imageForFile(b.file, 'image/jpeg');
          if (!im) break;
          const width = Math.min(W, im.width * 0.75);
          content.push(width * (im.height / im.width) > 680
            ? { image: im.dataUrl, fit: [W, 680], alignment: 'center', margin: [0, 6, 0, b.caption ? 2 : 10] }
            : { image: im.dataUrl, width, alignment: 'center', margin: [0, 6, 0, b.caption ? 2 : 10] });
          if (b.caption) content.push({ text: noEmoji(b.caption), fontSize: 9, color: PRINT.muted, alignment: 'center', margin: [0, 0, 0, 10] });
          break;
        }
        case 'stats':
          if (!b.items.length) break;
          content.push({
            table: { widths: b.items.map(() => '*'), body: [b.items.map((s) => ({ stack: [{ text: noEmoji(s.value), fontSize: fs(16), bold: true, color: PRINT.link, alignment: 'center' }, { text: noEmoji(s.label), fontSize: fs(8.5), color: PRINT.muted, alignment: 'center' }], fillColor: PRINT.soft, margin: [4, 6, 4, 6] }))] },
            layout: lines('bordered'), margin: [0, 4, 0, 10],
          });
          break;
        case 'table': {
          if (!b.headers.length) break;
          const style = b.tableStyle || 'default';
          const tc = PRINT_COLORS[b.tableColor];
          // Header: a chosen background tint, else the bold-header colour, else white as on the page.
          const headTint = b.headFill ? tint(PRINT_COLORS[b.headFill], 0.18) : undefined;
          const headFill = headTint || (style === 'header' ? (tc || PRINT.accent) : undefined);
          const headColor = style === 'header' && !headTint ? '#ffffff' : (tc || (style === 'minimal' || style === 'header' ? PRINT.text : PRINT.muted));
          // Striped rows: cream, a chosen tint, or none.
          const stripeFill = b.stripe === 'none' ? undefined : (b.stripe ? tint(PRINT_COLORS[b.stripe], 0.12) : PRINT.base);
          // Header and first column are bold unless set to regular (PDF has no semibold); a cell's own
          // bold, italic, alignment, colour and fill come on top.
          const headBold = b.headWeight !== 'regular';
          const firstBold = b.firstColWeight !== 'regular';
          const body = [
            b.headers.map((h, c) => {
              const s = headCellStyle(b, c) || {};
              return defined({
                text: noEmoji(h), bold: headBold || s.bold, italics: s.italic, alignment: s.align, fontSize: fs(9.5),
                fillColor: cellFill(s) || headFill, color: PRINT_COLORS[s.color] || (s.strong ? '#ffffff' : headColor),
              });
            }),
            ...b.rows.map((r, ri) => b.headers.map((_, c) => {
              const s = bodyCellStyle(b, ri, c) || {};
              return defined({
                text: runs(r[c] || ''), fontSize: fs(9.5), bold: (c === 0 && firstBold) || s.bold, italics: s.italic, alignment: s.align,
                color: PRINT_COLORS[s.color] || (s.strong ? '#ffffff' : color),
                fillColor: cellFill(s) || (ri % 2 ? undefined : stripeFill),
              });
            })),
          ];
          content.push({ table: { headerRows: 1, widths: b.headers.map(() => '*'), body }, layout: lines(style), margin: [0, 4, 0, 12] });
          break;
        }
        case 'code':
          content.push({ table: { widths: ['*'], body: [[{ text: b.text, fontSize: fs(8.5), preserveLeadingSpaces: true, fillColor: PRINT.code, margin: [8, 6, 8, 6] }]] }, layout: 'noBorders', margin: [0, 4, 0, 10] });
          break;
        default:
          if (b.text) content.push(defined({ text: runs(b.text), color, alignment, margin: [0, 0, 0, 8] }));
      }
      // Text without its own size (paragraphs, lists, callouts, quotes) takes the block's size from a wrapper.
      if (f !== 1 && content.length > start) content.push({ stack: content.splice(start), fontSize: fs(10.5) });
    }

    window.pdfMake.createPdf({
      pageSize: 'A4',
      pageMargins: [50, 50, 50, 56],
      info: { title: cs.title, creator: 'Growlyze Solutions Showcase' },
      content,
      footer: (page, pages) => ({ text: `${page} / ${pages}`, alignment: 'center', fontSize: 8, color: PRINT.muted, margin: [0, 20, 0, 0] }),
      defaultStyle: { fontSize: 10.5, lineHeight: 1.3, color: PRINT.text },
      styles: {
        title: { fontSize: 22, bold: true, margin: [0, 0, 0, 6] },
        lead: { fontSize: 11.5, color: PRINT.muted, margin: [0, 0, 0, 14] },
        h2: { fontSize: 15, bold: true, margin: [0, 14, 0, 6] },
        h3: { fontSize: 12.5, bold: true, margin: [0, 10, 0, 4] },
      },
    }).download(downloadName(cs, 'pdf'));
  }

  async function downloadDocx(cs) {
    await loadScript(LIBS.docx);
    const D = window.docx;
    const hex = (c) => (c ? c.replace('#', '').toUpperCase() : undefined);
    const ALIGN = { left: D.AlignmentType.LEFT, center: D.AlignmentType.CENTER, right: D.AlignmentType.RIGHT, justify: D.AlignmentType.JUSTIFIED };
    const runs = (md, base = {}) => inlineRuns(md).map((r) => {
      const run = new D.TextRun(defined({
        text: r.text,
        bold: r.bold || base.bold,
        italics: r.italics || base.italics,
        strike: r.strike,
        color: r.color ? hex(PRINT_COLORS[r.color]) : base.color,
        font: r.code ? 'Consolas' : undefined,
        shading: r.code ? { type: D.ShadingType.CLEAR, fill: hex(PRINT.code), color: 'auto' } : undefined,
        style: r.link ? 'Hyperlink' : undefined,
        size: base.size,
      }));
      return r.link ? new D.ExternalHyperlink({ link: r.link, children: [run] }) : run;
    });
    const para = (children, opts = {}) => new D.Paragraph({ children, spacing: { after: 120 }, ...opts });
    const plain = (text, opts = {}) => new D.TextRun(defined({ text: String(text || ''), ...opts }));
    const line = (color = hex(PRINT.border), size = 4) => ({ style: D.BorderStyle.SINGLE, size, color });
    const none = { style: D.BorderStyle.NONE, size: 0, color: 'FFFFFF' };
    const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

    // One numbering style per list kind and bullet colour; each list restarts its own count.
    const numbering = [];
    const numberingRefs = new Set();
    let listInstance = 0;
    const listRef = (ordered, marker) => {
      const ref = `${ordered ? 'ol' : 'ul'}-${marker || 'default'}`;
      if (!numberingRefs.has(ref)) {
        numberingRefs.add(ref);
        numbering.push({
          reference: ref,
          levels: [{
            level: 0, format: ordered ? D.LevelFormat.DECIMAL : D.LevelFormat.BULLET, text: ordered ? '%1.' : '•', alignment: D.AlignmentType.START,
            style: { run: { color: hex(PRINT_COLORS[marker] || PRINT.accent) }, paragraph: { indent: { left: 720, hanging: 360 } } },
          }],
        });
      }
      return ref;
    };
    const tableOf = (rows, borders, widths) => new D.Table({ width: { size: 100, type: D.WidthType.PERCENTAGE }, columnWidths: widths, rows, borders });
    const even = (n) => Array.from({ length: n }, () => Math.floor(9000 / n));

    const children = [];
    if (cs.cover) {
      const im = await imageForFile(cs.cover, 'image/png');
      if (im) children.push(para([new D.ImageRun({ data: im.dataUrl, transformation: { width: 600, height: Math.round(600 * im.height / im.width) } })], { alignment: D.AlignmentType.CENTER }));
    }
    children.push(new D.Paragraph({ heading: D.HeadingLevel.TITLE, children: [plain(cs.title, { color: hex(PRINT.text) })] }));
    if (cs.description) children.push(para([plain(cs.description, { color: hex(PRINT.muted), size: 24 })], { spacing: { after: 240 } }));

    for (const b of cs.content) {
      const color = hex(PRINT_COLORS[b.color]);
      const alignment = ALIGN[b.align] || undefined;
      // Text size of the block: Word sizes are in half-points (22 = 11pt, the normal size).
      const f = SIZE_FACTOR[b.size] || 1;
      const hp = (n) => (f === 1 ? undefined : Math.round(n * f));
      const sz = hp(22);
      switch (b.type) {
        case 'heading': case 'eyebrow':
          children.push(new D.Paragraph(defined({ heading: D.HeadingLevel.HEADING_1, alignment, children: [plain(b.text, { color: color || hex(PRINT.text), size: hp(32) })] })));
          break;
        case 'subheading':
          children.push(new D.Paragraph(defined({ heading: D.HeadingLevel.HEADING_2, alignment, children: [plain(b.text, { color: color || hex(PRINT.text), size: hp(26) })] })));
          break;
        case 'label': children.push(para([plain(b.text, defined({ bold: true, color, size: sz }))], defined({ alignment }))); break;
        case 'list': case 'olist': {
          const reference = listRef(b.type === 'olist', b.marker);
          const instance = ++listInstance;
          exportItems(b.items).forEach((t) => children.push(new D.Paragraph(defined({ numbering: { reference, level: 0, instance }, alignment, spacing: { after: 60 }, children: runs(t, { color, size: sz }) }))));
          children.push(para([]));
          break;
        }
        case 'callout':
          children.push(tableOf([new D.TableRow({ children: [new D.TableCell({
            margins: cellMargins,
            shading: { type: D.ShadingType.CLEAR, fill: hex(CALLOUT_FILL[b.tone] || CALLOUT_FILL.default), color: 'auto' },
            children: [new D.Paragraph(defined({ alignment, children: [...(b.icon ? [plain(`${b.icon}  `)] : []), ...runs(b.text, { color, size: sz })] }))],
          })] })], { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none }, [9000]));
          children.push(para([]));
          break;
        case 'quote':
          children.push(para(runs(b.text, { italics: true, color, size: sz }), defined({ alignment, indent: { left: 240 }, border: { left: line(hex(PRINT.accent), 18) } })));
          if (b.attribution) children.push(para([plain(`— ${b.attribution}`, { color: hex(PRINT.muted), size: 18 })], { indent: { left: 240 } }));
          break;
        case 'divider': children.push(para([], { border: { bottom: line() } })); break;
        case 'img': {
          const im = await imageForFile(b.file, 'image/png');
          if (!im) break;
          const width = Math.min(600, im.width);
          children.push(para([new D.ImageRun({ data: im.dataUrl, transformation: { width, height: Math.round(width * im.height / im.width) } })], { alignment: D.AlignmentType.CENTER, spacing: { after: b.caption ? 40 : 160 } }));
          if (b.caption) children.push(para([plain(b.caption, { color: hex(PRINT.muted), size: 18, italics: true })], { alignment: D.AlignmentType.CENTER }));
          break;
        }
        case 'stats':
          if (!b.items.length) break;
          children.push(tableOf([new D.TableRow({ children: b.items.map((s) => new D.TableCell({
            margins: cellMargins,
            shading: { type: D.ShadingType.CLEAR, fill: hex(PRINT.soft), color: 'auto' },
            children: [
              new D.Paragraph({ alignment: D.AlignmentType.CENTER, children: [plain(s.value, { bold: true, size: hp(32) || 32, color: hex(PRINT.link) })] }),
              new D.Paragraph({ alignment: D.AlignmentType.CENTER, children: [plain(s.label, { size: hp(17) || 17, color: hex(PRINT.muted) })] }),
            ],
          })) })], { top: line(), bottom: line(), left: line(), right: line(), insideHorizontal: line(), insideVertical: line() }, even(b.items.length)));
          children.push(para([]));
          break;
        case 'table': {
          if (!b.headers.length) break;
          const style = b.tableStyle || 'default';
          const tc = PRINT_COLORS[b.tableColor];
          // Header: a chosen background tint, else the bold-header colour, else white as on the page.
          const headTint = b.headFill ? tint(PRINT_COLORS[b.headFill], 0.18) : undefined;
          const headFill = headTint || (style === 'header' ? (tc || PRINT.accent) : undefined);
          const headColor = style === 'header' && !headTint ? '#ffffff' : (tc || (style === 'minimal' || style === 'header' ? PRINT.text : PRINT.muted));
          // Striped rows: cream, a chosen tint, or none.
          const stripeFill = b.stripe === 'none' ? undefined : (b.stripe ? tint(PRINT_COLORS[b.stripe], 0.12) : PRINT.base);
          const shade = (fill) => (fill ? { type: D.ShadingType.CLEAR, fill: hex(fill), color: 'auto' } : undefined);
          const headRow = new D.TableRow({ tableHeader: true, children: b.headers.map((h, c) => {
            const s = headCellStyle(b, c) || {};
            return new D.TableCell(defined({
              margins: cellMargins,
              shading: shade(cellFill(s) || headFill),
              borders: style === 'minimal' ? { bottom: line(hex(tc || PRINT.text), 12), top: none, left: none, right: none } : undefined,
              children: [new D.Paragraph(defined({ alignment: ALIGN[s.align], children: [plain(h, { bold: b.headWeight !== 'regular' || s.bold, italics: s.italic, size: sz, color: hex(PRINT_COLORS[s.color] || (s.strong ? '#ffffff' : headColor)) })] }))],
            }));
          }) });
          const rows = b.rows.map((r, ri) => new D.TableRow({ children: b.headers.map((_, c) => {
            const s = bodyCellStyle(b, ri, c) || {};
            return new D.TableCell(defined({
              margins: cellMargins,
              shading: shade(cellFill(s) || (ri % 2 ? undefined : stripeFill)),
              children: [new D.Paragraph(defined({ alignment: ALIGN[s.align], children: runs(r[c] || '', {
                color: hex(PRINT_COLORS[s.color]) || (s.strong ? 'FFFFFF' : color),
                bold: (c === 0 && b.firstColWeight !== 'regular') || s.bold, italics: s.italic, size: sz,
              }) }))],
            }));
          }) }));
          const borders = {
            default: { top: line(), bottom: line(), left: line(), right: line(), insideHorizontal: line(), insideVertical: none },
            bordered: { top: line(), bottom: line(), left: line(), right: line(), insideHorizontal: line(), insideVertical: line() },
            minimal: { top: none, bottom: none, left: none, right: none, insideHorizontal: line(), insideVertical: none },
            header: { top: line(), bottom: line(), left: line(), right: line(), insideHorizontal: line(), insideVertical: none },
          }[style] || {};
          children.push(tableOf([headRow, ...rows], borders, even(b.headers.length)));
          children.push(para([]));
          break;
        }
        case 'code':
          b.text.split('\n').forEach((t, k, all) => children.push(new D.Paragraph({
            shading: { type: D.ShadingType.CLEAR, fill: hex(PRINT.code), color: 'auto' },
            spacing: { after: k === all.length - 1 ? 160 : 0 },
            children: [plain(t, { font: 'Consolas', size: hp(18) || 18 })],
          })));
          break;
        default:
          if (b.text) children.push(para(runs(b.text, { color }), defined({ alignment })));
      }
    }

    const doc = new D.Document({
      creator: 'Growlyze Solutions Showcase',
      title: cs.title,
      styles: { default: { document: { run: { font: 'Calibri', size: 22, color: hex(PRINT.text) } } } },
      numbering: { config: numbering },
      sections: [{ children }],
    });
    saveBlob(await D.Packer.toBlob(doc), downloadName(cs, 'docx'));
  }

  // ---------- importing files ----------
  const LIBS = {
    pdf: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    pdfWorker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
    mammoth: 'https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js',
    // for downloads
    pdfmake: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.10/pdfmake.min.js',
    pdfFonts: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.10/vfs_fonts.min.js',
    docx: 'https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js',
  };
  const loaded = {};
  function loadScript(src) {
    if (!loaded[src]) {
      loaded[src] = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = () => { delete loaded[src]; reject(new Error('The file reader could not be loaded. Check your internet connection and try again.')); };
        document.head.appendChild(s);
      });
    }
    return loaded[src];
  }

  async function importFile(file, category, progress) {
    const name = file.name.toLowerCase();
    let result;
    if (name.endsWith('.pdf') || file.type === 'application/pdf') result = await pdfToBlocks(file, progress);
    else if (name.endsWith('.docx')) result = await docxToBlocks(file, progress);
    else if (/\.html?$/.test(name) || file.type === 'text/html') result = htmlFileToBlocks(await file.text());
    else if (name.endsWith('.doc')) throw new Error('Old .doc files can’t be read. Open it in Word and save it as .docx, or export it as PDF.');
    else throw new Error('Please choose a PDF, Word (.docx) or HTML file.');

    let { blocks, title, cover, icon } = result;
    if (!blocks.length && !cover) throw new Error('No text or images could be found in that file. A scanned PDF (a picture of text) can’t be read.');

    // Images: from Word and HTML they are inside the file (or linked); from PDF they are already
    // cut out as image files. Each is uploaded so the case study has its own copy.
    const images = blocks.filter((b) => b.type === 'img');
    let done = 0, failed = 0;
    for (const b of images) {
      progress(`Uploading images (${++done} of ${images.length})…`);
      if (b.blob) {
        try { b.file = await uploadFile(new File([b.blob], 'imported', { type: b.blob.type })); } catch (err) { if (err.status === 401) throw err; }
      } else if (b.src) {
        b.file = await uploadFromSrc(b.src);
      }
      if (!b.file) failed++;
      delete b.blob; delete b.src;
      if (!b.caption) delete b.caption;
    }
    let coverFile = '';
    if (cover) {
      progress('Uploading cover image…');
      try { coverFile = await uploadFile(new File([cover], 'cover', { type: cover.type })); } catch (err) { if (err.status === 401) throw err; }
    }
    blocks = blocks.filter((b) => b.type !== 'img' || b.file);
    if (failed) toast(`${failed} image${failed > 1 ? 's' : ''} in the file could not be copied; add ${failed > 1 ? 'them' : 'it'} by pasting or uploading.`, 'error');

    // The first paragraph, shortened, makes a starting summary for the card.
    const firstP = blocks.find((b) => b.type === 'p' && b.text.trim());
    let description = firstP ? stripMd(firstP.text) : '';
    if (description.length > 220) description = `${description.slice(0, 217).replace(/\s+\S*$/, '')}…`;
    return {
      title: title || file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim(),
      description,
      tags: [category.slug],
      content: blocks.length ? blocks : [{ type: 'p', text: '' }],
      cover: coverFile,
      icon: icon || '',
    };
  }

  // The first big heading of a document is its title rather than part of its body.
  function takeTitle(blocks) {
    const k = blocks.findIndex((b) => b.type !== 'img');
    if (k >= 0 && blocks[k].type === 'heading') return blocks.splice(k, 1)[0].text;
    return '';
  }

  function htmlFileToBlocks(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const docTitle = (doc.querySelector('title')?.textContent || '').trim();
    const blocks = htmlToBlocks(doc.body ? doc.body.innerHTML : html);
    const headingTitle = takeTitle(blocks);
    return { blocks, title: headingTitle || docTitle };
  }

  async function docxToBlocks(file, progress) {
    progress('Loading the Word reader…');
    await loadScript(LIBS.mammoth);
    progress('Reading the Word file…');
    const result = await window.mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() }, {
      styleMap: ["p[style-name='Title'] => h1:fresh", "p[style-name='Subtitle'] => h3:fresh"],
    });
    const blocks = htmlToBlocks(result.value);
    return { blocks, title: takeTitle(blocks) };
  }

  // PDFs have no structure inside, only positioned text and images, so the layout is read back:
  // bigger text is a heading, "•" / "1." lines are lists, lines close together form paragraphs,
  // lines split into aligned columns form tables, text repeated on every page (headers, footers,
  // page numbers) is dropped, and images are cut out where they sit. A large image above the title
  // on the first page becomes the cover.
  async function pdfToBlocks(file, progress) {
    progress('Loading the PDF reader…');
    await loadScript(LIBS.pdf);
    const pdfjs = window.pdfjsLib;
    pdfjs.GlobalWorkerOptions.workerSrc = LIBS.pdfWorker;
    const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    const pages = [];
    const seenImages = new Set();
    for (let n = 1; n <= pdf.numPages; n++) {
      progress(`Reading page ${n} of ${pdf.numPages}…`);
      const page = await pdf.getPage(n);
      const text = await page.getTextContent();
      const lines = pdfLines(text.items);
      const images = await pdfImages(page, pdfjs, seenImages);
      pages.push({ lines, images });
    }
    return pdfLayoutToBlocks(pages);
  }

  function pdfLines(items) {
    const parts = items
      .filter((it) => it.str && it.str.trim())
      .map((it) => {
        const t = it.transform;
        return { str: it.str, x: t[4], y: t[5], w: it.width, size: Math.hypot(t[2], t[3]) || it.height || 10 };
      })
      .sort((a, b) => b.y - a.y || a.x - b.x);
    const lines = [];
    for (const p of parts) {
      let line = lines.find((l) => Math.abs(l.y - p.y) <= Math.max(l.size, p.size) * 0.45);
      if (!line) { line = { y: p.y, size: p.size, parts: [] }; lines.push(line); }
      line.parts.push(p);
      line.size = Math.max(line.size, p.size);
    }
    return lines.map((l) => {
      l.parts.sort((a, b) => a.x - b.x);
      // Wide gaps split a line into cells (table columns).
      const cells = [];
      let cur = null, end = -Infinity;
      for (const p of l.parts) {
        const gap = p.x - end;
        if (!cur || gap > l.size * 0.8) { cur = { x: p.x, text: '' }; cells.push(cur); }
        else if (gap > l.size * 0.12 && !/\s$/.test(cur.text) && !/^\s/.test(p.str)) cur.text += ' ';
        cur.text += p.str;
        end = p.x + p.w;
      }
      cells.forEach((c) => { c.text = c.text.replace(/\s+/g, ' ').trim(); });
      return { kind: 'line', y: l.y, size: l.size, x: cells[0].x, cells: cells.filter((c) => c.text), text: cells.map((c) => c.text).join(' ') };
    }).filter((l) => l.cells.length);
  }

  async function pdfImages(page, pdfjs, seen) {
    const ops = await page.getOperatorList();
    const O = pdfjs.OPS;
    let ctm = [1, 0, 0, 1, 0, 0];
    const stack = [];
    const found = [];
    for (let k = 0; k < ops.fnArray.length; k++) {
      const fn = ops.fnArray[k], args = ops.argsArray[k];
      if (fn === O.save) stack.push(ctm);
      else if (fn === O.restore) ctm = stack.pop() || ctm;
      else if (fn === O.transform) ctm = pdfjs.Util.transform(ctm, args);
      else if (fn === O.paintImageXObject || fn === O.paintJpegXObject) {
        const w = Math.hypot(ctm[0], ctm[1]), h = Math.hypot(ctm[2], ctm[3]);
        // Skip small pictures (icons, bullets, logos) and images repeated on several pages.
        if (Math.min(w, h) >= 80 && w * h >= 15000 && !seen.has(args[0])) {
          seen.add(args[0]);
          found.push({ name: args[0], top: Math.max(ctm[5], ctm[5] + ctm[3]), w, h });
        }
      }
    }
    const out = [];
    for (const f of found) {
      const store = f.name.startsWith('g_') ? page.commonObjs : page.objs;
      const img = await new Promise((resolve) => {
        try { store.get(f.name, resolve); } catch (e) { resolve(null); }
        setTimeout(() => resolve(null), 5000);
      });
      const blob = img && await imageToBlob(img);
      if (blob) out.push({ kind: 'img', y: f.top, blob, w: f.w });
    }
    return out;
  }

  function imageToBlob(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let alpha = false;
    if (img.bitmap) {
      canvas.width = img.bitmap.width; canvas.height = img.bitmap.height;
      ctx.drawImage(img.bitmap, 0, 0);
      alpha = true;
    } else if (img.data && img.width && img.height) {
      canvas.width = img.width; canvas.height = img.height;
      const out = ctx.createImageData(img.width, img.height);
      const src = img.data, dst = out.data, px = img.width * img.height;
      if (img.kind === 3) { dst.set(src.subarray(0, px * 4)); alpha = true; }
      else if (img.kind === 2) { for (let i = 0, j = 0; i < px; i++, j += 3) { dst[i * 4] = src[j]; dst[i * 4 + 1] = src[j + 1]; dst[i * 4 + 2] = src[j + 2]; dst[i * 4 + 3] = 255; } }
      else if (img.kind === 1) {
        const rowBytes = (img.width + 7) >> 3;
        for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) {
          const v = (src[y * rowBytes + (x >> 3)] >> (7 - (x & 7))) & 1 ? 255 : 0;
          const o = (y * img.width + x) * 4; dst[o] = dst[o + 1] = dst[o + 2] = v; dst[o + 3] = 255;
        }
      } else return null;
      ctx.putImageData(out, 0, 0);
    } else return null;
    return new Promise((resolve) => canvas.toBlob(resolve, alpha ? 'image/png' : 'image/jpeg', 0.88));
  }

  function pdfLayoutToBlocks(pages) {
    // Text that repeats on most pages (headers, footers, page numbers) is not content.
    const key = (t) => t.replace(/\d+/g, '#').trim();
    const counts = new Map();
    pages.forEach((p) => new Set(p.lines.map((l) => key(l.text))).forEach((k) => counts.set(k, (counts.get(k) || 0) + 1)));
    const repeated = (l) => pages.length > 1 && counts.get(key(l.text)) >= Math.max(2, pages.length * 0.5);
    pages.forEach((p) => { p.lines = p.lines.filter((l) => !repeated(l) && !/^\d{1,3}$/.test(l.text)); });

    // The most common text size is body text.
    const meaningful = (line) => /[\p{L}\p{N}]/u.test(line.text);
    const textLines = pages.flatMap((p) => p.lines).filter(meaningful);
    const sizes = new Map();
    textLines.forEach((l) => { const s = Math.round(l.size); sizes.set(s, (sizes.get(s) || 0) + l.text.length); });
    const body = [...sizes.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 11;
    const biggest = Math.max(...textLines.map((l) => l.size), body);

    const blocks = [];
    let title = '', icon = '', cover = null, para = null, table = null, prev = null;
    const iconLine = pages[0]?.lines.find((line) => !meaningful(line) && /\p{Extended_Pictographic}/u.test(line.text));
    if (iconLine) icon = iconLine.text.trim();
    const titleCandidates = (pages[0]?.lines || [])
      .filter((line) => meaningful(line) && line.size >= biggest * 0.98 && line.text.length <= 160)
      .sort((a, b) => b.y - a.y);
    const titleLines = new Set();
    const titleTop = titleCandidates[0]?.y ?? -Infinity;
    if (titleCandidates.length) {
      let previous = titleCandidates[0];
      titleLines.add(previous);
      for (const line of titleCandidates.slice(1)) {
        if (Math.abs(line.size - previous.size) >= 0.5 ||
            previous.y - line.y > Math.max(previous.size, line.size) * 1.5 ||
            Math.abs(line.x - previous.x) > Math.max(24, previous.size * 2)) break;
        titleLines.add(line);
        previous = line;
      }
      title = [...titleLines].map((line) => line.text).join(' ').replace(/\s+/g, ' ').trim();
    }
    const finishTable = () => {
      if (!table) return;
      const { cols, block, entries } = table;
      const mapped = entries.slice(1).map((line) => ({
        line,
        cells: line.cells.map((cell) => ({
          col: cols.reduce((best, x, i) => Math.abs(cols[best] - cell.x) < Math.abs(x - cell.x) ? best : i, 0),
          text: escMd(cell.text.replace(/\u0000/g, ' ').replace(/\s+/g, ' ').trim()),
        })),
      }));
      const anchors = mapped.filter((entry) => entry.cells.some((cell) => cell.col === 0));
      const rows = anchors.map(() => Array(cols.length).fill(''));
      const append = (row, cell) => {
        row[cell.col] = row[cell.col] ? `${row[cell.col]} ${cell.text}` : cell.text;
      };
      mapped.forEach((entry) => {
        let rowIndex = anchors.indexOf(entry);
        if (rowIndex < 0) {
          const next = anchors.findIndex((anchor) => anchor.line.y <= entry.line.y);
          rowIndex = next < 0 ? anchors.length - 1 : next;
          const anchor = anchors[rowIndex];
          if (anchor && entry.line.y > anchor.line.y &&
              entry.line.y - anchor.line.y > entry.line.size * 2 && rowIndex > 0) rowIndex--;
        }
        if (rows[rowIndex]) entry.cells.forEach((cell) => append(rows[rowIndex], cell));
      });
      block.rows = rows.filter((row) => row.some(Boolean));
      table = null;
    };
    const flush = () => { para = null; finishTable(); };
    const BULLET = /^[•●▪◦‣·∙○■□➢►✓✔-]\s*(.+)$/;
    const NUMBERED = /^\d{1,2}[.)]\s+(.+)$/;

    pages.forEach((page, pageIndex) => {
      const entries = [...page.lines, ...page.images].sort((a, b) => b.y - a.y);
      prev = null;
      entries.forEach((e) => {
        if (e.kind === 'img') {
          flush();
          if (!cover && pageIndex === 0 && e.y > titleTop && !blocks.some((b) => b.type !== 'img')) cover = e.blob;
          else blocks.push({ type: 'img', blob: e.blob });
          prev = null;
          return;
        }
        if (e === iconLine || titleLines.has(e)) {
          prev = null;
          return;
        }
        const t = e.text;
        const gap = prev ? prev.y - e.y : Infinity;
        const close = gap <= e.size * 1.9;

        // Headings: clearly bigger than body text. The biggest one first is the title.
        if (e.size >= body * 1.18 && t.length <= 160) {
          const last = blocks[blocks.length - 1];
          const type = e.size >= body * 1.55 ? 'heading' : 'subheading';
          if (prev && prev.heading && close && last && last.type === type && Math.abs(prev.size - e.size) < 0.5) last.text += ` ${t}`;
          else { flush(); blocks.push({ type, text: t }); }
          prev = { ...e, heading: true };
          return;
        }

        // PDF tables often wrap one cell across several positioned lines.
        const tableLine = table && gap <= e.size * 3.5 &&
          e.cells.every((cell) => table.cols.some((x) => Math.abs(x - cell.x) < 5));
        if (tableLine) {
          table.entries.push(e);
          prev = e;
          return;
        }
        finishTable();
        if (e.cells.length >= 2) {
          para = null;
          table = {
            cols: e.cells.map((cell) => cell.x),
            block: { type: 'table', headers: e.cells.map((cell) => cell.text), rows: [] },
            entries: [e],
          };
          blocks.push(table.block);
          prev = e;
          return;
        }

        let m;
        if (t.includes('\u0000')) {
          const text = t.replace(/\u0000/g, ' ').replace(/\s+/g, ' ').trim();
          if (text) {
            para = null;
            const last = blocks[blocks.length - 1];
            if (prev && prev.item && gap <= e.size * 3.5 && last && last.type === 'list') last.items.push(escMd(text));
            else blocks.push({ type: 'list', items: [escMd(text)] });
            prev = { ...e, item: true };
          }
          return;
        }
        if ((m = t.match(BULLET)) || (m = t.match(NUMBERED))) {
          para = null;
          const type = BULLET.test(t) ? 'list' : 'olist';
          const last = blocks[blocks.length - 1];
          if (last && last.type === type && close) last.items.push(escMd(m[1]));
          else blocks.push({ type, items: [escMd(m[1])] });
          prev = { ...e, item: true, textX: e.x + 8 };
          return;
        }
        // A line indented under a bullet continues that bullet.
        const last = blocks[blocks.length - 1];
        if (prev && prev.item && close && last && LISTS.includes(last.type) && e.x >= prev.x - 2) {
          last.items[last.items.length - 1] += ` ${escMd(t)}`;
          prev = { ...e, item: true, x: prev.x };
          return;
        }
        // Lines close together form one paragraph; a hyphen at a line end joins the word.
        if (para && close) {
          para.text = /\w-$/.test(para.text) && /^[a-z]/.test(t) ? para.text.slice(0, -1) + escMd(t) : `${para.text} ${escMd(t)}`;
        } else {
          para = { type: 'p', text: escMd(t) };
          blocks.push(para);
        }
        prev = e;
      });
      // A paragraph runs on to the next page only if it stops mid-sentence.
      if (para && /[.!?:"”)]$/.test(para.text)) para = null;
      finishTable();
    });
    return { blocks, title, cover, icon };
  }

  // ---------- start ----------
  document.getElementById('admin-login')?.addEventListener('click', () => openLogin());

  fetch('/api/session', { credentials: 'same-origin' })
    .then((r) => (r.ok ? r.json() : { admin: false, enabled: false }))
    .then((s) => {
      state.admin = s.admin;
      state.enabled = s.enabled;
      showAdminWorkspace(state.admin);
      const status = document.getElementById('admin-status');
      const login = document.getElementById('admin-login');
      if (status) status.textContent = state.enabled
        ? 'Log in to manage categories and edit all case studies.'
        : 'Editing is disabled. Set ADMIN_PASSWORD on the server to enable admin access.';
      if (login) login.hidden = !state.enabled;
      drawAdminChrome();
      refreshCaseToolbar();
      refreshAddCard();
      if (onAdminPage && state.enabled && !state.admin) openLogin();
    })
    .catch(() => {
      if (!onAdminPage) return;
      const status = document.getElementById('admin-status');
      const login = document.getElementById('admin-login');
      if (status) status.textContent = 'Could not check admin access. Please refresh and try again.';
      if (login) login.hidden = true;
    });
})();
