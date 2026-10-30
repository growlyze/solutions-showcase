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
    document.querySelector('.ed-savebar')?.remove();
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
        document.querySelector('.ed-savebar')?.remove();
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
      <button type="button" class="ed-btn" data-act="toggle-hidden">${hiddenIds.has(id) ? 'Unhide (show on public site)' : 'Hide from public site'}</button>
      ${hiddenIds.has(id) ? '<span class="ed-badge" title="Visitors cannot see this case study. Only admins can.">Hidden</span>' : ''}
      ${editedIds().includes(id) ? '<span class="ed-badge" title="This case study has been edited on the site. The original is kept in data.js.">Edited</span>' : ''}`;
    bar.addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act === 'edit') startEditing(id);
      if (act === 'discard') { state.stashed.delete(id); refreshCaseToolbar(); }
      if (act === 'toggle-hidden') setHidden(id, !hiddenIds.has(id)).then(refreshCaseToolbar, (err) => toast(err.message));
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
      dirty: Boolean(stashed),
      draft: stashed || clone({ title: cs.title, description: cs.description, tags: cs.tags, content: cs.content, cover: cs.cover || '', icon: cs.icon || '' }),
    };
    openEditor();
  }

  // A case study that doesn't exist yet (id null): Save creates it. `draft` may come from an
  // imported file.
  function startNewCase(draft) {
    state.editing = { id: null, dirty: true, draft };
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
    document.querySelector('.ed-savebar')?.remove();
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
      case 'list': return `<ul class="content-list" ${CE_RICH} data-k="items">${listItemsHtml(b.items)}</ul>`;
      case 'olist': return `<ol class="content-list content-olist" ${CE_RICH} data-k="items">${listItemsHtml(b.items)}</ol>`;
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
        const head = b.headers.map((h, c) => `<th><div class="ed-cell" ${CE} data-placeholder="Column">${esc(h)}</div><button type="button" class="ed-x" data-act="del-col" data-i="${i}" data-j="${c}" aria-label="Remove this column" title="Remove column">×</button></th>`).join('');
        const rows = b.rows.map((r, ri) => `<tr>${b.headers.map((_, c) => `<td><div class="ed-cell" ${CE_RICH}>${inlineHtml(r[c] || '')}</div></td>`).join('')}<td class="ed-row-x"><button type="button" class="ed-x" data-act="del-row" data-i="${i}" data-j="${ri}" aria-label="Remove this row" title="Remove row">×</button></td></tr>`).join('');
        return `
          <div class="content-table-wrap"><table class="content-table"><thead><tr>${head}<th class="ed-row-x"></th></tr></thead><tbody>${rows}</tbody></table></div>
          <div class="ed-inline-actions">
            <button type="button" class="ed-btn ed-btn--small" data-act="add-row" data-i="${i}">+ Row</button>
            <button type="button" class="ed-btn ed-btn--small" data-act="add-col" data-i="${i}">+ Column</button>
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
    return `
      <div class="ed-block ed-block--${b.type}" data-i="${i}">
        <div class="ed-tools" role="toolbar" aria-label="Block ${i + 1} controls">
          <span class="ed-tool ed-handle" draggable="true" data-i="${i}" title="Drag to move" aria-hidden="true">⋮⋮</span>
          ${typeControl}${alignControl}${toneControl}
          <button type="button" class="ed-tool" data-act="up" data-i="${i}" aria-label="Move up" title="Move up"${i === 0 ? ' disabled' : ''}>↑</button>
          <button type="button" class="ed-tool" data-act="down" data-i="${i}" aria-label="Move down" title="Move down"${i === count - 1 ? ' disabled' : ''}>↓</button>
          <button type="button" class="ed-tool" data-act="duplicate" data-i="${i}" aria-label="Duplicate block" title="Duplicate">⧉</button>
          <button type="button" class="ed-tool" data-act="add" data-i="${i}" aria-label="Add a block below" title="Add a block below">+</button>
          <button type="button" class="ed-tool ed-tool--danger" data-act="delete" data-i="${i}" aria-label="Delete block" title="Delete block">🗑</button>
        </div>
        <div class="ed-body"${ALIGNABLE.includes(b.type) ? ` style="text-align:${ALIGNMENTS.some(([value]) => value === b.align) ? b.align : 'left'}"` : ''}>${blockBodyHtml(b, i)}</div>
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
    if (focus) focusBlock(focus.index, focus.at);
  }

  function drawSaveBar(id) {
    document.querySelector('.ed-savebar')?.remove();
    const bar = document.createElement('div');
    bar.className = 'ed-savebar';
    bar.innerHTML = `
      <div class="container ed-savebar-inner">
        <div class="ed-savebar-left">
          <button type="button" class="ed-tool" data-act="undo" title="Undo (Ctrl+Z)" aria-label="Undo"${history.undo.length ? '' : ' disabled'}>↶</button>
          <button type="button" class="ed-tool" data-act="redo" title="Redo (Ctrl+Shift+Z)" aria-label="Redo"${history.redo.length ? '' : ' disabled'}>↷</button>
          <span class="ed-status" aria-live="polite">${state.editing.dirty ? 'Unsaved changes' : 'No changes yet'}</span>
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
  // undo step, applies the change to the draft and redraws the editor.
  function restructure(fn, focus) {
    collect();
    history.undo.push(clone(state.editing.draft));
    if (history.undo.length > 100) history.undo.shift();
    history.redo = [];
    history.lastWasStructural = true;
    fn(state.editing.draft.content, state.editing.draft);
    markDirty();
    drawEditor(focus);
  }

  function undo() {
    if (!history.undo.length) return;
    history.redo.push(clone(collect()));
    state.editing.draft = history.undo.pop();
    history.lastWasStructural = true;
    markDirty();
    drawEditor();
  }

  function redo() {
    if (!history.redo.length) return;
    history.undo.push(clone(collect()));
    state.editing.draft = history.redo.pop();
    history.lastWasStructural = true;
    markDirty();
    drawEditor();
  }

  // Turn a block into another type, keeping its text.
  function convert(b, type) {
    if (b.type === type) return b;
    if (LISTS.includes(b.type) && LISTS.includes(type)) return { type, items: b.items, ...(b.align ? { align: b.align } : {}) };
    const align = ALIGNABLE.includes(type) && b.align ? { align: b.align } : {};
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
        <button type="button" data-fmt="clear" title="Clear formatting" aria-label="Clear formatting">T<sub>x</sub></button>`;
      bar.addEventListener('mousedown', (e) => e.preventDefault()); // keep the selection
      bar.addEventListener('click', (e) => {
        const b = e.target.closest('[data-fmt]');
        if (b) format(b.dataset.fmt);
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
    } else if (cmd === 'clear') {
      document.execCommand('removeFormat');
      document.execCommand('unlink');
    } else {
      document.execCommand(cmd);
    }
    markDirty();
    collect();
    history.lastWasStructural = false;
    updateFormatBar();
  }

  document.addEventListener('selectionchange', () => { if (state.editing) updateFormatBar(); });

  // ---------- events inside the editor ----------
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.ed-menu') && !e.target.closest('[data-act="add"], [data-act="icon-pick"], [data-act="cover-pick"], [data-act="callout-icon"]')) {
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
      case 'del-row': restructure((c) => c[i].rows.splice(j, 1)); break;
      case 'del-col': restructure((c) => { c[i].headers.splice(j, 1); c[i].rows.forEach((r) => r.splice(j, 1)); }); break;
      case 'callout-icon': openEmojiPicker(btn, (emoji) => restructure((c) => { c[i].icon = emoji || '💡'; })); break;
      case 'icon-pick': openEmojiPicker(btn, (emoji) => restructure((c, d) => { d.icon = emoji; }), Boolean(state.editing.draft.icon)); break;
      case 'cover-pick': openCoverMenu(btn); break;
      case 'cover-remove': restructure((c, d) => { d.cover = ''; }); break;
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
    const link = e.target.closest('a[href], [data-back]');
    if (!link || link.closest('.ed-editing [contenteditable]')) return;
    if (!confirm('You have unsaved changes. Leave without saving?')) {
      e.preventDefault();
      e.stopImmediatePropagation();
    } else {
      state.editing = null;
      document.querySelector('.ed-savebar')?.remove();
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
    document.querySelector('.ed-savebar')?.remove();
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
        document.querySelector('.ed-savebar')?.remove();
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
      document.querySelector('.ed-savebar')?.remove();
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

  // ---------- importing files ----------
  const LIBS = {
    pdf: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    pdfWorker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
    mammoth: 'https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js',
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
