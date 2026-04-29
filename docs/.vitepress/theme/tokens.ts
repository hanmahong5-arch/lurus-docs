/**
 * Design token TS mirror — use this when components need to bind to
 * token values programmatically (e.g. computing inline gradients).
 *
 * For plain style consumption, prefer CSS variables (`var(--lurus-*)`) —
 * this file's job is to expose the same keys for JS logic.
 */

export const productColors = {
  'lurus-api': 'var(--lurus-color-lurus-api)',
  'kova': 'var(--lurus-color-kova)',
  'memx': 'var(--lurus-color-memx)',
  'lucrum': 'var(--lurus-color-lucrum)',
  'forge': 'var(--lurus-color-forge)',
  'switch': 'var(--lurus-color-switch)',
  'creator': 'var(--lurus-color-creator)',
  'lumen': 'var(--lurus-color-lumen)',
  'platform': 'var(--lurus-color-platform)',
  'auth': 'var(--lurus-color-auth)',
  'api-ref': 'var(--lurus-color-api-ref)',
  'arch': 'var(--lurus-color-arch)',
} as const

export type ProductColorKey = keyof typeof productColors

/** CSS variable name for a product accent — use when you need the raw name. */
export const productColorVar = (key: ProductColorKey): string =>
  `--lurus-color-${key}`

export const status = {
  live: 'var(--lurus-status-live)',
  beta: 'var(--lurus-status-beta)',
  dev: 'var(--lurus-status-dev)',
  plan: 'var(--lurus-status-plan)',
} as const

export type Status = keyof typeof status

export const radii = {
  sm: 'var(--lurus-radius-sm)',
  md: 'var(--lurus-radius-md)',
  lg: 'var(--lurus-radius-lg)',
  xl: 'var(--lurus-radius-xl)',
  pill: 'var(--lurus-radius-pill)',
} as const

export const durations = {
  fast: 'var(--lurus-dur-fast)',
  base: 'var(--lurus-dur-base)',
  slow: 'var(--lurus-dur-slow)',
} as const
