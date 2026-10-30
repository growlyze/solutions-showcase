// Where edits made in the browser are kept. public/data.js stays the original content; an edit is
// stored as an override for one case study (its title, description, tags and content) and laid
// over the original whenever the site is drawn. Case studies created on the site are stored the
// same way, marked isNew. Uploaded images are kept here too, because
// Railway wipes the server's own files on every deploy.
//
//  - DATABASE_URL set (Railway Postgres): two tables, created on first start.
//  - otherwise (local development): a JSON file and an uploads folder under .data/.

const fs = require('fs');
const path = require('path');

function postgresStore(url) {
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: url,
    ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
  });
  return {
    kind: 'postgres',
    async init() {
      await pool.query(`CREATE TABLE IF NOT EXISTS case_overrides (
        id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
      await pool.query(`CREATE TABLE IF NOT EXISTS uploads (
        name TEXT PRIMARY KEY, mime TEXT NOT NULL, data BYTEA NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
      await pool.query(`CREATE TABLE IF NOT EXISTS admin_settings (
        key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
    },
    async allOverrides() {
      const { rows } = await pool.query('SELECT id, data, updated_at FROM case_overrides');
      return new Map(rows.map((r) => [r.id, { ...r.data, updatedAt: r.updated_at.toISOString() }]));
    },
    async saveOverride(id, data) {
      await pool.query(
        `INSERT INTO case_overrides (id, data, updated_at) VALUES ($1, $2, now())
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
        [id, data],
      );
    },
    async deleteOverride(id) {
      await pool.query('DELETE FROM case_overrides WHERE id = $1', [id]);
    },
    async getAdminPasswordHash() {
      const { rows } = await pool.query("SELECT value FROM admin_settings WHERE key = 'password_hash'");
      return rows[0]?.value || '';
    },
    async saveAdminPasswordHash(hash) {
      await pool.query(
        `INSERT INTO admin_settings (key, value, updated_at) VALUES ('password_hash', $1, now())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
        [hash],
      );
    },
    // Case studies hidden from the public site, as a JSON array of ids.
    async getHiddenCaseIds() {
      const { rows } = await pool.query("SELECT value FROM admin_settings WHERE key = 'hidden_cases'");
      return rows[0] ? JSON.parse(rows[0].value) : [];
    },
    async saveHiddenCaseIds(ids) {
      await pool.query(
        `INSERT INTO admin_settings (key, value, updated_at) VALUES ('hidden_cases', $1, now())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
        [JSON.stringify(ids)],
      );
    },
    async saveUpload(name, mime, buffer) {
      await pool.query('INSERT INTO uploads (name, mime, data) VALUES ($1, $2, $3)', [name, mime, buffer]);
    },
    async getUpload(name) {
      const { rows } = await pool.query('SELECT mime, data FROM uploads WHERE name = $1', [name]);
      return rows[0] ? { mime: rows[0].mime, buffer: rows[0].data } : null;
    },
  };
}

function fileStore(dir) {
  const file = path.join(dir, 'overrides.json');
  const adminFile = path.join(dir, 'admin.json');
  const hiddenFile = path.join(dir, 'hidden.json');
  const uploadDir = path.join(dir, 'uploads');
  const read = () => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {});
  const write = (obj) => fs.writeFileSync(file, JSON.stringify(obj, null, 2));
  const readAdmin = () => (fs.existsSync(adminFile) ? JSON.parse(fs.readFileSync(adminFile, 'utf8')) : {});
  return {
    kind: 'file',
    async init() { fs.mkdirSync(uploadDir, { recursive: true }); },
    async allOverrides() { return new Map(Object.entries(read())); },
    async saveOverride(id, data) {
      const all = read();
      all[id] = { ...data, updatedAt: new Date().toISOString() };
      write(all);
    },
    async deleteOverride(id) {
      const all = read();
      delete all[id];
      write(all);
    },
    async getAdminPasswordHash() { return readAdmin().passwordHash || ''; },
    async saveAdminPasswordHash(passwordHash) {
      const temp = `${adminFile}.tmp`;
      fs.writeFileSync(temp, JSON.stringify({ passwordHash }, null, 2), { mode: 0o600 });
      fs.renameSync(temp, adminFile);
    },
    async getHiddenCaseIds() { return fs.existsSync(hiddenFile) ? JSON.parse(fs.readFileSync(hiddenFile, 'utf8')) : []; },
    async saveHiddenCaseIds(ids) { fs.writeFileSync(hiddenFile, JSON.stringify(ids, null, 2)); },
    async saveUpload(name, mime, buffer) { fs.writeFileSync(path.join(uploadDir, name), buffer); },
    async getUpload(name) {
      const p = path.join(uploadDir, name);
      if (!fs.existsSync(p)) return null;
      return { mime: MIME_BY_EXT[path.extname(name).slice(1)], buffer: fs.readFileSync(p) };
    },
  };
}

const MIME_BY_EXT = { png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' };

function createStore() {
  return process.env.DATABASE_URL
    ? postgresStore(process.env.DATABASE_URL)
    : fileStore(path.join(__dirname, '.data'));
}

module.exports = { createStore, MIME_BY_EXT };
