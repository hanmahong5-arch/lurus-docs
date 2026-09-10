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

// VitePress 是 MPA 不是 SPA：产物是 guide/quickstart.html，
// 而站内链接与外部分享链接写的都是 /guide/quickstart（无扩展名）。
// 上面那道只按原样查找，必须再补一次带 .html 的查找，否则每个深链都会
// 落到下面的兜底里去。
app.use(
  '/*',
  serveStatic({
    root: './static',
    rewriteRequestPath: (p) => {
      // 已是目录（尾斜杠 → index.html）或已带扩展名的，保持原样
      if (p.endsWith('/') || /\.[a-z0-9]+$/i.test(p)) return p;
      return `${p}.html`;
    },
  })
);

// 真的找不到才走到这里。
// 🔴 以前这里是「无条件返回首页 + 200」的 SPA 兜底，后果是：
//    每一个无扩展名的深链（/guide/quickstart、/api/overview…）都返回首页，
//    而且带 200 —— 用户点开分享链接看到的是首页却没有任何报错，
//    搜索引擎则把首页内容重复收录在几百个不同 URL 下。
//    实测 2026-09-10：线上这类 URL 全部 200 且 size 与首页逐字节相同。
//    现在改成 VitePress 自己的 404 页 + 真正的 404 状态码。
app.notFound(async (c) => {
  const page = Bun.file('./static/404.html');
  if (await page.exists()) {
    return c.newResponse(page.stream(), 404, { 'Content-Type': 'text/html; charset=utf-8' });
  }
  return c.text('Not Found', 404);
});

// Initialize database and start server
runMigrations();
seedProducts();

const port = parseInt(process.env.PORT || '3000', 10);

console.log(`Server starting on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
