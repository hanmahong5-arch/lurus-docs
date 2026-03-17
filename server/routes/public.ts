import { Hono } from 'hono';
import { listProducts, listUpdates, getUpdate } from '../db';

const app = new Hono();

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/products', (c) => {
  const status = c.req.query('status');
  const products = listProducts(status);
  return c.json({ data: products });
});

app.get('/updates', (c) => {
  const product = c.req.query('product');
  const type = c.req.query('type');
  const page = parseInt(c.req.query('page') || '1', 10);
  const limit = parseInt(c.req.query('limit') || '20', 10);
  const since = c.req.query('since');

  const { data, total } = listUpdates({
    product,
    type,
    status: 'published',
    page,
    limit,
    since,
  });

  return c.json({
    data,
    total,
    page,
    limit,
    hasMore: page * limit < total,
  });
});

app.get('/updates/:id', (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) {
    return c.json({ error: 'Invalid update ID' }, 400);
  }

  const update = getUpdate(id);
  if (!update || update.status !== 'published') {
    return c.json({ error: 'Update not found' }, 404);
  }

  return c.json({ data: update });
});

export default app;
