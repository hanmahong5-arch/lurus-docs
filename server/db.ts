import { Database } from 'bun:sqlite';
import type { Product, Update, UpdateStatus } from './types';

const DB_PATH = process.env.DB_PATH || '/data/updates.db';

let db: Database;

export function getDb(): Database {
  if (!db) {
    db = new Database(DB_PATH, { create: true });
    db.exec('PRAGMA journal_mode = WAL');
    db.exec('PRAGMA foreign_keys = ON');
  }
  return db;
}

export function runMigrations(): void {
  const d = getDb();

  d.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      icon       TEXT NOT NULL DEFAULT '',
      color      TEXT NOT NULL DEFAULT '#C67B5C',
      status     TEXT NOT NULL DEFAULT 'active'
                   CHECK(status IN ('planning','beta','active','maintenance','deprecated','sunset')),
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS updates (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      title       TEXT NOT NULL,
      content     TEXT NOT NULL DEFAULT '',
      type        TEXT NOT NULL DEFAULT 'feature'
                    CHECK(type IN ('feature','improvement','bugfix','security','deprecation','launch','sunset')),
      version     TEXT,
      is_major    INTEGER NOT NULL DEFAULT 0,
      status      TEXT NOT NULL DEFAULT 'draft'
                    CHECK(status IN ('draft','published','archived')),
      source      TEXT NOT NULL DEFAULT 'manual'
                    CHECK(source IN ('manual','webhook')),
      published_at TEXT,
      created_at   TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_updates_published
      ON updates(status, published_at DESC) WHERE status = 'published';
    CREATE INDEX IF NOT EXISTS idx_updates_product
      ON updates(product_id, status, published_at DESC);
  `);
}

// ─── Product queries ────────────────────────────────────────

export function listProducts(status?: string): Product[] {
  const d = getDb();
  if (status) {
    return d.prepare('SELECT * FROM products WHERE status = ? ORDER BY sort_order, name')
      .all(status) as Product[];
  }
  return d.prepare('SELECT * FROM products ORDER BY sort_order, name').all() as Product[];
}

export function getProduct(id: string): Product | null {
  return getDb().prepare('SELECT * FROM products WHERE id = ?').get(id) as Product | null;
}

export function createProduct(p: { id: string; name: string; icon?: string; color?: string; status?: string; sort_order?: number }): Product {
  const d = getDb();
  d.prepare(`
    INSERT INTO products (id, name, icon, color, status, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    p.id,
    p.name,
    p.icon || '',
    p.color || '#C67B5C',
    p.status || 'active',
    p.sort_order ?? 0
  );
  return getProduct(p.id)!;
}

export function updateProduct(id: string, p: { name?: string; icon?: string; color?: string; status?: string; sort_order?: number }): Product | null {
  const d = getDb();
  const existing = getProduct(id);
  if (!existing) return null;

  d.prepare(`
    UPDATE products SET
      name = ?, icon = ?, color = ?, status = ?, sort_order = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(
    p.name ?? existing.name,
    p.icon ?? existing.icon,
    p.color ?? existing.color,
    p.status ?? existing.status,
    p.sort_order ?? existing.sort_order,
    id
  );
  return getProduct(id)!;
}

// ─── Update queries ─────────────────────────────────────────

interface ListUpdatesOpts {
  product?: string;
  type?: string;
  status?: UpdateStatus;
  page?: number;
  limit?: number;
  since?: string;
}

export function listUpdates(opts: ListUpdatesOpts): { data: Update[]; total: number } {
  const d = getDb();
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (opts.status) {
    conditions.push('status = ?');
    params.push(opts.status);
  }
  if (opts.product) {
    conditions.push('product_id = ?');
    params.push(opts.product);
  }
  if (opts.type) {
    conditions.push('type = ?');
    params.push(opts.type);
  }
  if (opts.since) {
    conditions.push('published_at >= ?');
    params.push(opts.since);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const page = Math.max(1, opts.page || 1);
  const limit = Math.min(100, Math.max(1, opts.limit || 20));
  const offset = (page - 1) * limit;

  const total = (d.prepare(`SELECT COUNT(*) as cnt FROM updates ${where}`).get(...params) as { cnt: number }).cnt;
  const data = d.prepare(`
    SELECT * FROM updates ${where}
    ORDER BY COALESCE(published_at, created_at) DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset) as Update[];

  return { data, total };
}

export function getUpdate(id: number): Update | null {
  return getDb().prepare('SELECT * FROM updates WHERE id = ?').get(id) as Update | null;
}

export function createUpdate(u: {
  product_id: string;
  title: string;
  content?: string;
  type?: string;
  version?: string;
  is_major?: boolean;
  status?: string;
  source?: string;
}): Update {
  const d = getDb();
  const status = u.status || 'draft';
  const publishedAt = status === 'published' ? new Date().toISOString().replace('T', ' ').slice(0, 19) : null;

  const result = d.prepare(`
    INSERT INTO updates (product_id, title, content, type, version, is_major, status, source, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    u.product_id,
    u.title,
    u.content || '',
    u.type || 'feature',
    u.version || null,
    u.is_major ? 1 : 0,
    status,
    u.source || 'manual',
    publishedAt
  );
  return getUpdate(result.lastInsertRowid as number)!;
}

export function editUpdate(id: number, u: {
  title?: string;
  content?: string;
  type?: string;
  version?: string;
  is_major?: boolean;
  product_id?: string;
}): Update | null {
  const d = getDb();
  const existing = getUpdate(id);
  if (!existing) return null;

  d.prepare(`
    UPDATE updates SET
      title = ?, content = ?, type = ?, version = ?, is_major = ?, product_id = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(
    u.title ?? existing.title,
    u.content ?? existing.content,
    u.type ?? existing.type,
    u.version ?? existing.version,
    u.is_major !== undefined ? (u.is_major ? 1 : 0) : existing.is_major,
    u.product_id ?? existing.product_id,
    id
  );
  return getUpdate(id)!;
}

export function publishUpdate(id: number): Update | null {
  const d = getDb();
  const existing = getUpdate(id);
  if (!existing) return null;

  d.prepare(`
    UPDATE updates SET
      status = 'published',
      published_at = datetime('now'),
      updated_at = datetime('now')
    WHERE id = ?
  `).run(id);
  return getUpdate(id)!;
}

export function archiveUpdate(id: number): Update | null {
  const d = getDb();
  const existing = getUpdate(id);
  if (!existing) return null;

  d.prepare(`
    UPDATE updates SET status = 'archived', updated_at = datetime('now')
    WHERE id = ?
  `).run(id);
  return getUpdate(id)!;
}

export function deleteUpdate(id: number): boolean {
  const d = getDb();
  const existing = getUpdate(id);
  if (!existing || existing.status !== 'draft') return false;

  d.prepare('DELETE FROM updates WHERE id = ?').run(id);
  return true;
}
