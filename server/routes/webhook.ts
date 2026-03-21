import { Hono } from 'hono';
import { createUpdate, getProduct } from '../db';
import type { WebhookDeployBody } from '../types';

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

const app = new Hono();

async function verifySignature(body: string, signature: string | undefined): Promise<boolean> {
  if (!WEBHOOK_SECRET || !signature) return false;

  const expected = signature.replace('sha256=', '');
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(WEBHOOK_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const hex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return hex === expected;
}

app.post('/deploy', async (c) => {
  if (!WEBHOOK_SECRET) {
    return c.json({ error: 'Service temporarily unavailable' }, 503);
  }

  const rawBody = await c.req.text();
  const signature = c.req.header('X-Webhook-Signature');

  const valid = await verifySignature(rawBody, signature);
  if (!valid) {
    return c.json({ error: 'Invalid signature' }, 401);
  }

  let body: WebhookDeployBody;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  if (!body.product || !body.version || !body.title) {
    return c.json({ error: 'product, version, and title are required' }, 400);
  }

  if (!getProduct(body.product)) {
    return c.json({ error: `Product '${body.product}' not found` }, 400);
  }

  const update = createUpdate({
    product_id: body.product,
    title: body.title,
    content: body.content || '',
    type: body.type || 'improvement',
    version: body.version,
    is_major: body.isMajor || false,
    status: 'draft',
    source: 'webhook',
  });

  return c.json({ data: update }, 201);
});

export default app;
