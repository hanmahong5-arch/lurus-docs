import { Hono } from 'hono';
import {
  listUpdates,
  createUpdate,
  editUpdate,
  publishUpdate,
  archiveUpdate,
  deleteUpdate,
  getUpdate,
  listProducts,
  createProduct,
  updateProduct,
  getProduct,
} from '../db';
import type { CreateUpdateBody, EditUpdateBody, CreateProductBody, EditProductBody } from '../types';

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

const app = new Hono();

// Auth middleware
app.use('*', async (c, next) => {
  if (!ADMIN_API_KEY) {
    return c.json({ error: 'Service temporarily unavailable' }, 503);
  }
  const auth = c.req.header('Authorization');
  if (!auth || auth !== `Bearer ${ADMIN_API_KEY}`) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
});

// ─── Updates ────────────────────────────────────────────────

app.get('/updates', (c) => {
  const product = c.req.query('product');
  const type = c.req.query('type');
  const status = c.req.query('status') as 'draft' | 'published' | 'archived' | undefined;
  const page = parseInt(c.req.query('page') || '1', 10);
  const limit = parseInt(c.req.query('limit') || '20', 10);

  const { data, total } = listUpdates({ product, type, status, page, limit });

  return c.json({
    data,
    total,
    page,
    limit,
    hasMore: page * limit < total,
  });
});

app.post('/updates', async (c) => {
  const body = await c.req.json<CreateUpdateBody>();

  if (!body.product_id || !body.title) {
    return c.json({ error: 'product_id and title are required' }, 400);
  }
  if (!getProduct(body.product_id)) {
    return c.json({ error: `Product '${body.product_id}' not found` }, 400);
  }

  const update = createUpdate({
    product_id: body.product_id,
    title: body.title,
    content: body.content,
    type: body.type,
    version: body.version,
    is_major: body.is_major,
    status: body.status,
    source: 'manual',
  });

  return c.json({ data: update }, 201);
});

app.put('/updates/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) return c.json({ error: 'Invalid update ID' }, 400);

  const body = await c.req.json<EditUpdateBody>();
  if (body.product_id && !getProduct(body.product_id)) {
    return c.json({ error: `Product '${body.product_id}' not found` }, 400);
  }

  const update = editUpdate(id, body);
  if (!update) return c.json({ error: 'Update not found' }, 404);

  return c.json({ data: update });
});

app.post('/updates/:id/publish', (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) return c.json({ error: 'Invalid update ID' }, 400);

  const update = publishUpdate(id);
  if (!update) return c.json({ error: 'Update not found' }, 404);

  return c.json({ data: update });
});

app.post('/updates/:id/archive', (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) return c.json({ error: 'Invalid update ID' }, 400);

  const update = archiveUpdate(id);
  if (!update) return c.json({ error: 'Update not found' }, 404);

  return c.json({ data: update });
});

app.delete('/updates/:id', (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) return c.json({ error: 'Invalid update ID' }, 400);

  const existing = getUpdate(id);
  if (!existing) return c.json({ error: 'Update not found' }, 404);
  if (existing.status !== 'draft') {
    return c.json({ error: 'Only draft updates can be deleted' }, 400);
  }

  deleteUpdate(id);
  return c.json({ success: true });
});

// ─── Products ───────────────────────────────────────────────

app.get('/products', (c) => {
  const products = listProducts();
  return c.json({ data: products });
});

app.post('/products', async (c) => {
  const body = await c.req.json<CreateProductBody>();

  if (!body.id || !body.name) {
    return c.json({ error: 'id and name are required' }, 400);
  }
  if (getProduct(body.id)) {
    return c.json({ error: `Product '${body.id}' already exists` }, 409);
  }

  const product = createProduct(body);
  return c.json({ data: product }, 201);
});

app.put('/products/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<EditProductBody>();

  const product = updateProduct(id, body);
  if (!product) return c.json({ error: 'Product not found' }, 404);

  return c.json({ data: product });
});

export default app;
