// Editing API for the site's admin. ADMIN_PASSWORD initializes access; a changed password is
// stored as a scrypt hash and takes precedence over the environment variable.
//
// Login gives a signed cookie, so no session table is needed. Changing the admin password signs
// everyone out. Every request that changes something must also carry the
// X-Admin-Request header, which a page on another site cannot add without a CORS preflight.

const crypto = require('crypto');
const express = require('express');
const { MIME_BY_EXT } = require('./store');

const COOKIE = 'admin_session';
const SESSION_DAYS = 7;
const BLOCK_TYPES = ['eyebrow', 'heading', 'subheading', 'label', 'p', 'list', 'olist', 'callout', 'divider', 'img', 'stats', 'table', 'code', 'quote'];
const CALLOUT_TONES = ['default', 'green', 'blue', 'yellow', 'red', 'gray'];
const ALIGNABLE_BLOCKS = ['eyebrow', 'heading', 'subheading', 'label', 'p', 'list', 'olist', 'callout', 'quote'];
const TEXT_ALIGNMENTS = ['left', 'center', 'right', 'justify'];
const IMAGE_PATH = /^(case-content\/[\w.-]+\/[\w.-]+\.(png|jpe?g|webp|gif)|uploads\/[a-f0-9]{24}\.(png|jpg|webp|gif))$/i;

const password = () => process.env.ADMIN_PASSWORD || '';
const passwordValue = (config) => config.hash || config.value || '';
const signingKey = (config) => crypto.createHash('sha256').update('admin-session:' + passwordValue(config) + (process.env.SESSION_SECRET || '')).digest();
const sign = (value, config) => crypto.createHmac('sha256', signingKey(config)).update(value).digest('hex');

function safeEqual(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function readCookie(req, name) {
  const header = req.get('cookie') || '';
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}

function isAdmin(req, config) {
  if (!passwordValue(config)) return false;
  const token = readCookie(req, COOKIE);
  if (!token) return false;
  const [expires, sig] = token.split('.');
  return Number(expires) > Date.now() && safeEqual(sig || '', sign(expires, config));
}

function setSession(req, res, on, config) {
  const expires = Date.now() + SESSION_DAYS * 864e5;
  const value = on ? `${expires}.${sign(String(expires), config)}` : '';
  res.cookie(COOKIE, value, {
    httpOnly: true, sameSite: 'lax', secure: req.secure, path: '/',
    maxAge: on ? SESSION_DAYS * 864e5 : 0,
  });
}

function passwordMatches(candidate, config) {
  if (!config.hash) return safeEqual(candidate, config.value || '');
  const [scheme, salt, expected] = config.hash.split('$');
  if (scheme !== 'scrypt' || !/^[a-f0-9]{32}$/i.test(salt || '') || !/^[a-f0-9]{128}$/i.test(expected || '')) return false;
  const actual = crypto.scryptSync(String(candidate), Buffer.from(salt, 'hex'), 64);
  return safeEqual(actual, Buffer.from(expected, 'hex'));
}

function hashPassword(value) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(value, salt, 64);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

// Slow down password guessing: at most 10 failed attempts per address every 15 minutes.
const failures = new Map();
function tooManyFailures(ip) {
  const now = Date.now();
  const list = (failures.get(ip) || []).filter((t) => now - t < 15 * 60e3);
  failures.set(ip, list);
  return list.length >= 10;
}

// ---------- validating an edited case study ----------
const str = (v, max = 20000) => typeof v === 'string' && v.length <= max;

function cleanBlock(b) {
  if (!b || !BLOCK_TYPES.includes(b.type)) throw new Error('Unknown block type');
  const withAlignment = (block) => {
    if (ALIGNABLE_BLOCKS.includes(b.type) && TEXT_ALIGNMENTS.includes(b.align) && b.align !== 'left') block.align = b.align;
    return block;
  };
  switch (b.type) {
    case 'list': case 'olist':
      if (!Array.isArray(b.items) || !b.items.every((i) => str(i))) throw new Error('A list has an invalid item');
      return withAlignment({ type: b.type, items: b.items });
    case 'callout':
      if (!str(b.text) || !str(b.icon || '', 16)) throw new Error('A callout is invalid');
      return withAlignment({ type: 'callout', text: b.text, icon: b.icon || '', tone: CALLOUT_TONES.includes(b.tone) ? b.tone : 'default' });
    case 'divider':
      return { type: 'divider' };
    case 'img':
      if (!str(b.file, 300) || !IMAGE_PATH.test(b.file)) throw new Error('An image has an invalid file');
      return b.caption ? { type: 'img', file: b.file, caption: String(b.caption).slice(0, 2000) } : { type: 'img', file: b.file };
    case 'stats':
      if (!Array.isArray(b.items) || !b.items.every((s) => s && str(s.value, 200) && str(s.label, 500))) throw new Error('A stats block is invalid');
      return { type: 'stats', items: b.items.map((s) => ({ value: s.value, label: s.label })) };
    case 'table':
      if (!Array.isArray(b.headers) || !b.headers.every((h) => str(h, 1000))) throw new Error('A table header is invalid');
      if (!Array.isArray(b.rows) || !b.rows.every((r) => Array.isArray(r) && r.every((c) => str(c, 5000)))) throw new Error('A table row is invalid');
      return { type: 'table', headers: b.headers, rows: b.rows };
    case 'quote':
      if (!str(b.text) || !str(b.attribution || '', 500)) throw new Error('A quote is invalid');
      return withAlignment({ type: 'quote', text: b.text, attribution: b.attribution || '' });
    case 'code':
      if (!str(b.text, 100000)) throw new Error('A code block is invalid');
      return b.language ? { type: 'code', text: b.text, language: String(b.language).slice(0, 40) } : { type: 'code', text: b.text };
    default:
      if (!str(b.text)) throw new Error('A text block is invalid');
      return withAlignment({ type: b.type, text: b.text });
  }
}

function cleanCase(body, categorySlugs) {
  if (!body || !str(body.title, 300) || !body.title.trim()) throw new Error('The title is required');
  if (!str(body.description, 2000)) throw new Error('The description is invalid');
  if (!Array.isArray(body.tags) || !body.tags.length || !body.tags.every((t) => categorySlugs.has(t))) throw new Error('Pick at least one category');
  if (!Array.isArray(body.content) || body.content.length > 1000) throw new Error('The content is invalid');
  if (body.cover && (!str(body.cover, 300) || !IMAGE_PATH.test(body.cover))) throw new Error('The cover image is invalid');
  if (body.icon && !str(body.icon, 16)) throw new Error('The page icon is invalid');
  return {
    title: body.title.trim(),
    description: body.description.trim(),
    tags: [...new Set(body.tags)],
    content: body.content.map(cleanBlock),
    cover: body.cover || '',
    icon: body.icon || '',
  };
}

// ---------- routes ----------
// `getOriginal` returns a case study as public/data.js has it; `overrides` is the server's map of
// saved edits; `onChange` is called after every save so the server can redraw its pages.
function adminRouter({ store, getOriginal, categorySlugs, overrides, hidden = new Set(), onChange, adminPassword = { value: password(), hash: '' } }) {
  const router = express.Router();
  const requireAdmin = (req, res, next) => {
    if (!isAdmin(req, adminPassword)) return res.status(401).json({ error: 'Please log in again.' });
    if (req.get('x-admin-request') !== '1') return res.status(403).json({ error: 'Missing request header.' });
    next();
  };

  router.get('/session', (req, res) => {
    res.set('Cache-Control', 'no-store').json({ admin: isAdmin(req, adminPassword), enabled: Boolean(passwordValue(adminPassword)) });
  });

  router.post('/login', express.json({ limit: '10kb' }), (req, res) => {
    if (!passwordValue(adminPassword)) return res.status(503).json({ error: 'Editing is switched off: ADMIN_PASSWORD is not set on the server.' });
    if (tooManyFailures(req.ip)) return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' });
    if (!passwordMatches((req.body && req.body.password) || '', adminPassword)) {
      failures.get(req.ip).push(Date.now());
      return res.status(401).json({ error: 'Wrong password.' });
    }
    setSession(req, res, true, adminPassword);
    res.json({ admin: true });
  });

  router.post('/password', requireAdmin, express.json({ limit: '10kb' }), async (req, res) => {
    const current = req.body && req.body.currentPassword;
    const next = req.body && req.body.newPassword;
    if (typeof current !== 'string' || current.length > 1024 || !passwordMatches(current, adminPassword)) return res.status(401).json({ error: 'Current password is incorrect.' });
    if (typeof next !== 'string' || next.length < 12 || next.length > 1024) {
      return res.status(400).json({ error: 'Choose a new password between 12 and 1024 characters.' });
    }
    if (passwordMatches(next, adminPassword)) return res.status(400).json({ error: 'Choose a password different from your current one.' });
    try {
      const hash = hashPassword(next);
      await store.saveAdminPasswordHash(hash);
      adminPassword.hash = hash;
      adminPassword.value = '';
      failures.clear();
      setSession(req, res, false, adminPassword);
      res.json({ ok: true, loggedOut: true });
    } catch (e) {
      console.error('Changing admin password failed', e);
      res.status(500).json({ error: 'Changing the password failed on the server. Please try again.' });
    }
  });

  router.post('/logout', (req, res) => {
    setSession(req, res, false, adminPassword);
    res.json({ admin: false });
  });

  // A case study created on the site: everything it has is in the store.
  const added = (id) => (overrides.get(id) && overrides.get(id).isNew ? overrides.get(id) : null);
  const asNewCase = (id, data) => ({ id, source: 'Site', url: '', isNew: true, ...data });

  // Its address comes from the title, kept unique (case studies in data.js included).
  function newId(title) {
    const base = title.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '') || 'case-study';
    let id = base;
    for (let n = 2; getOriginal(id) || overrides.has(id); n++) id = `${base}-${n}`;
    return id;
  }

  async function persist(id, data, res, respond) {
    try {
      await store.saveOverride(id, data);
      overrides.set(id, { ...data, updatedAt: new Date().toISOString() });
      onChange();
      respond();
    } catch (e) {
      console.error('Saving case study failed', e);
      res.status(500).json({ error: 'Saving failed on the server. Please try again.' });
    }
  }

  router.post('/cases', requireAdmin, express.json({ limit: '3mb' }), async (req, res) => {
    let data;
    try { data = cleanCase(req.body, categorySlugs); } catch (e) { return res.status(400).json({ error: e.message }); }
    const id = newId(data.title);
    const record = { ...data, isNew: true, createdAt: new Date().toISOString() };
    await persist(id, record, res, () => res.status(201).json({ ok: true, caseStudy: asNewCase(id, record) }));
  });

  router.post('/cases/:id/revert', requireAdmin, async (req, res) => {
    const original = getOriginal(req.params.id);
    if (!original) return res.status(404).json({ error: 'Case study not found.' });
    try {
      await store.deleteOverride(req.params.id);
      overrides.delete(req.params.id);
      onChange();
      res.json({ ok: true, caseStudy: original, edited: false });
    } catch (e) {
      console.error('Reverting case study failed', e);
      res.status(500).json({ error: 'Reverting failed on the server. Please try again.' });
    }
  });

  router.put('/cases/:id', requireAdmin, express.json({ limit: '3mb' }), async (req, res) => {
    const original = getOriginal(req.params.id);
    const existingNew = added(req.params.id);
    if ((!original && !existingNew) || (overrides.get(req.params.id) || {}).isDeleted) return res.status(404).json({ error: 'Case study not found.' });
    let data;
    try { data = cleanCase(req.body, categorySlugs); } catch (e) { return res.status(400).json({ error: e.message }); }
    if (existingNew) {
      const record = { ...data, isNew: true, createdAt: existingNew.createdAt };
      return persist(req.params.id, record, res, () => res.json({ ok: true, caseStudy: asNewCase(req.params.id, record) }));
    }
    await persist(req.params.id, data, res, () => res.json({ ok: true, caseStudy: { ...original, ...data }, edited: true }));
  });

  // Original studies are hidden with a persistent tombstone; site-created studies are removed.
  router.delete('/cases/:id', requireAdmin, async (req, res) => {
    const original = getOriginal(req.params.id);
    const existingNew = added(req.params.id);
    if ((!original && !existingNew) || (overrides.get(req.params.id) || {}).isDeleted) return res.status(404).json({ error: 'Case study not found.' });
    try {
      if (hidden.has(req.params.id)) {
        await store.saveHiddenCaseIds([...hidden].filter((h) => h !== req.params.id));
        hidden.delete(req.params.id);
      }
      if (existingNew) {
        await store.deleteOverride(req.params.id);
        overrides.delete(req.params.id);
      } else {
        const tombstone = { isDeleted: true, updatedAt: new Date().toISOString() };
        await store.saveOverride(req.params.id, tombstone);
        overrides.set(req.params.id, tombstone);
      }
      onChange();
      res.json({ ok: true, deleted: true });
    } catch (e) {
      console.error('Deleting case study failed', e);
      res.status(500).json({ error: 'Deleting failed on the server. Please try again.' });
    }
  });

  // Hiding takes a case study off the public site (pages, sitemap, llms.txt) without deleting it.
  router.post('/cases/:id/visibility', requireAdmin, express.json({ limit: '10kb' }), async (req, res) => {
    const id = req.params.id;
    if ((!getOriginal(id) && !added(id)) || (overrides.get(id) || {}).isDeleted) return res.status(404).json({ error: 'Case study not found.' });
    const hide = Boolean(req.body && req.body.hidden);
    const ids = hide ? [...new Set([...hidden, id])] : [...hidden].filter((h) => h !== id);
    try {
      await store.saveHiddenCaseIds(ids);
      if (hide) hidden.add(id); else hidden.delete(id);
      onChange();
      res.json({ ok: true, hidden: hide });
    } catch (e) {
      console.error('Changing visibility failed', e);
      res.status(500).json({ error: 'Saving failed on the server. Please try again.' });
    }
  });

  router.post('/uploads', requireAdmin, express.raw({ type: Object.values(MIME_BY_EXT), limit: '8mb' }), async (req, res) => {
    const ext = Object.keys(MIME_BY_EXT).find((k) => MIME_BY_EXT[k] === req.get('content-type'));
    if (!ext || !Buffer.isBuffer(req.body) || !req.body.length) return res.status(400).json({ error: 'Upload a PNG, JPG, WebP or GIF image (up to 8 MB).' });
    const name = `${crypto.randomBytes(12).toString('hex')}.${ext}`;
    try {
      await store.saveUpload(name, MIME_BY_EXT[ext], req.body);
      res.json({ file: `uploads/${name}` });
    } catch (e) {
      console.error('Upload failed', e);
      res.status(500).json({ error: 'Upload failed on the server. Please try again.' });
    }
  });

  // Images inside content pasted from another page (Notion, Google Docs, a website) arrive as
  // links; the server downloads each one and keeps its own copy, so the page never depends on
  // the other site. Only real images up to 8 MB are accepted.
  router.post('/uploads/from-url', requireAdmin, express.json({ limit: '10kb' }), async (req, res) => {
    const url = req.body && req.body.url;
    if (!str(url, 4000) || !/^https?:\/\//i.test(url)) return res.status(400).json({ error: 'That is not an image link.' });
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(15000), redirect: 'follow' });
      const mime = (r.headers.get('content-type') || '').split(';')[0].trim().replace('image/jpg', 'image/jpeg');
      const ext = Object.keys(MIME_BY_EXT).find((k) => MIME_BY_EXT[k] === mime);
      if (!r.ok || !ext) return res.status(400).json({ error: 'That link did not return a PNG, JPG, WebP or GIF image.' });
      if (Number(r.headers.get('content-length') || 0) > 8 * 1024 * 1024) return res.status(413).json({ error: 'That image is over 8 MB.' });
      const buffer = Buffer.from(await r.arrayBuffer());
      if (buffer.length > 8 * 1024 * 1024) return res.status(413).json({ error: 'That image is over 8 MB.' });
      const name = `${crypto.randomBytes(12).toString('hex')}.${ext}`;
      await store.saveUpload(name, mime, buffer);
      res.json({ file: `uploads/${name}` });
    } catch (e) {
      res.status(400).json({ error: 'That image could not be downloaded.' });
    }
  });

  router.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') return res.status(413).json({ error: 'That is too large to upload.' });
    next(err);
  });

  return router;
}

module.exports = { adminRouter, isAdmin };
