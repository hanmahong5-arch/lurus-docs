// Product status lifecycle
export type ProductStatus = 'planning' | 'beta' | 'active' | 'maintenance' | 'deprecated' | 'sunset';

// Update classification
export type UpdateType = 'feature' | 'improvement' | 'bugfix' | 'security' | 'deprecation' | 'launch' | 'sunset';

// Update workflow status
export type UpdateStatus = 'draft' | 'published' | 'archived';

// Update creation source
export type UpdateSource = 'manual' | 'webhook';

export interface Product {
  id: string;
  name: string;
  icon: string;
  color: string;
  status: ProductStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Update {
  id: number;
  product_id: string;
  title: string;
  content: string;
  type: UpdateType;
  version: string | null;
  is_major: number;
  status: UpdateStatus;
  source: UpdateSource;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// API request/response types
export interface CreateUpdateBody {
  product_id: string;
  title: string;
  content?: string;
  type?: UpdateType;
  version?: string;
  is_major?: boolean;
  status?: UpdateStatus;
}

export interface EditUpdateBody {
  title?: string;
  content?: string;
  type?: UpdateType;
  version?: string;
  is_major?: boolean;
  product_id?: string;
}

export interface CreateProductBody {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  status?: ProductStatus;
  sort_order?: number;
}

export interface EditProductBody {
  name?: string;
  icon?: string;
  color?: string;
  status?: ProductStatus;
  sort_order?: number;
}

export interface WebhookDeployBody {
  product: string;
  version: string;
  title: string;
  type?: UpdateType;
  content?: string;
  isMajor?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
