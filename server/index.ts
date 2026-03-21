import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { logger } from 'hono/logger';
import { runMigrations } from './db';
import { seedProducts } from './seed';
import publicRoutes from './routes/public';
import adminRoutes from './routes/admin';
import webhookRoutes from './routes/webhook';
import internalRoutes from './routes/internal';

const app = new Hono();

// Request logging
app.use('*', logger());

// Health check for K8s liveness/readiness probes
app.get('/api/health', (c) => c.json({ status: 'ok' }));

// API routes
app.route('/api', publicRoutes);
app.route('/api/admin', adminRoutes);
app.route('/api/internal', internalRoutes);
app.route('/api/webhook', webhookRoutes);

// Static files (VitePress build output)
app.use('/*', serveStatic({ root: './static' }));

// SPA fallback: non-API routes return index.html
app.use('/*', serveStatic({ root: './static', path: 'index.html' }));

// Initialize database and start server
runMigrations();
seedProducts();

const port = parseInt(process.env.PORT || '3000', 10);

console.log(`Server starting on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
