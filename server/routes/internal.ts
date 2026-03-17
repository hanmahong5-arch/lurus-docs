import { Hono } from 'hono';
import { join, resolve } from 'path';

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

const CONTENT_DIR = resolve(import.meta.dir, '../internal-content');

const SLUG_PATTERN = /^[a-z0-9-]+$/;

const app = new Hono();

// Bearer token auth middleware
app.use('*', async (c, next) => {
  if (!INTERNAL_API_KEY) {
    return c.json({ error: 'Server misconfigured: INTERNAL_API_KEY not set' }, 500);
  }
  const auth = c.req.header('Authorization');
  if (!auth || auth !== `Bearer ${INTERNAL_API_KEY}`) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
});

// Verify key validity
app.get('/verify', (c) => {
  return c.json({ ok: true });
});

// Fetch protected markdown content by slug
app.get('/content/:slug', async (c) => {
  const slug = c.req.param('slug');

  if (!SLUG_PATTERN.test(slug)) {
    return c.json({ error: 'Invalid slug format' }, 400);
  }

  const filePath = join(CONTENT_DIR, `${slug}.md`);
  const resolved = resolve(filePath);

  // Path traversal guard
  if (!resolved.startsWith(CONTENT_DIR)) {
    return c.json({ error: 'Invalid slug' }, 400);
  }

  const file = Bun.file(resolved);
  const exists = await file.exists();

  if (!exists) {
    return c.json({ error: 'Content not found' }, 404);
  }

  const content = await file.text();
  return c.json({ content });
});

export default app;
