import { getDb, getProduct, createProduct } from './db';
import type { ProductStatus } from './types';

interface SeedProduct {
  id: string;
  name: string;
  icon: string;
  color: string;
  status: ProductStatus;
  sort_order: number;
}

const SEED_PRODUCTS: SeedProduct[] = [
  { id: 'lurus-api',          name: 'Lurus API',          icon: 'zap',          color: '#C67B5C', status: 'active',      sort_order: 1 },
  { id: 'lurus-platform',     name: 'Lurus Platform',     icon: 'shield',       color: '#6B8E7B', status: 'active',      sort_order: 2 },
  { id: 'lurus-gushen',       name: 'GuShen',             icon: 'trending-up',  color: '#7B8EC6', status: 'active',      sort_order: 3 },
  { id: 'lurus-switch',       name: 'Switch',             icon: 'toggle-right', color: '#9B7BC6', status: 'active',      sort_order: 4 },
  { id: 'lurus-memorus',      name: 'Memorus',            icon: 'brain',        color: '#C67BB8', status: 'active',      sort_order: 5 },
  { id: 'lurus-notification', name: 'Notification',       icon: 'bell',         color: '#C6A87B', status: 'active',      sort_order: 6 },
  { id: 'lurus-newapi',       name: 'NewAPI',             icon: 'layers',       color: '#7BC6B8', status: 'active',      sort_order: 7 },
  { id: 'lurus-admin',        name: 'Admin',              icon: 'settings',     color: '#8B9DAF', status: 'active',      sort_order: 8 },
  { id: 'lurus-docs',         name: 'Docs',               icon: 'book-open',    color: '#A8C67B', status: 'active',      sort_order: 9 },
  { id: 'lurus-www',          name: 'Website',            icon: 'globe',        color: '#C6C17B', status: 'active',      sort_order: 10 },
  { id: 'lurus-login',        name: 'Login',              icon: 'log-in',       color: '#7BAFC6', status: 'active',      sort_order: 11 },
  { id: 'lurus-proto',        name: 'Proto',              icon: 'code',         color: '#AF8B7B', status: 'active',      sort_order: 12 },
  { id: 'lurus-creator',      name: 'Creator',            icon: 'film',         color: '#C67B7B', status: 'beta',        sort_order: 13 },
  { id: 'lurus-game',         name: 'Game',               icon: 'gamepad-2',    color: '#7B7BC6', status: 'planning',    sort_order: 14 },
];

export function seedProducts(): void {
  const db = getDb();
  const tx = db.transaction(() => {
    for (const p of SEED_PRODUCTS) {
      if (!getProduct(p.id)) {
        createProduct(p);
      }
    }
  });
  tx();
}
