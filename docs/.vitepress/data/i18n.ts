/**
 * Data-layer i18n overlay.
 *
 * The zh-CN strings in products.ts / glossary.ts stay the single source of
 * truth (every existing consumer + llms.txt scanning still reads them). This
 * module overlays translated values on top, keyed by the VitePress locale
 * (`useData().lang`). Components that render data-layer text (ProductHero,
 * RelatedProducts, Hero, Term) call these helpers; anything not yet translated
 * falls back to the zh source, so the build never breaks on a gap.
 *
 * Translations live in the generated ./i18n-data.ts.
 */
import type { Product } from './products'
import { productTr, glossaryDefs, uiTr, type Locale, type UiTr } from './i18n-data'

const LOCALES = ['en', 'ja', 'ko', 'es', 'fr'] as const

/** Map a VitePress `lang` ('zh-CN' | 'en' | 'ja' | …) to a translated locale,
 *  or null for the zh source (no overlay). */
export function toLocale(lang: string | undefined): Locale | null {
  const id = (lang || '').toLowerCase().split('-')[0]
  return (LOCALES as readonly string[]).includes(id) ? (id as Locale) : null
}

/** Return a copy of `p` with name/fullName/tagline/nextSteps localized for
 *  `lang`. Falls back field-by-field to the zh source. */
export function localizeProduct(p: Product, lang: string | undefined): Product
export function localizeProduct(p: undefined, lang: string | undefined): undefined
export function localizeProduct(p: Product | undefined, lang: string | undefined): Product | undefined {
  if (!p) return p
  const loc = toLocale(lang)
  if (!loc) return p
  const t = productTr[loc]?.[p.id]
  if (!t) return p
  return {
    ...p,
    name: t.name || p.name,
    fullName: t.fullName || p.fullName,
    tagline: t.tagline || p.tagline,
    nextSteps: t.nextSteps?.length
      ? p.nextSteps.map((s, i) => ({ ...s, text: t.nextSteps[i] || s.text }))
      : p.nextSteps,
  }
}

/** Localized glossary definition for `term`, or the zh fallback `zh`. */
export function glossaryDef(term: string, zh: string, lang: string | undefined): string {
  const loc = toLocale(lang)
  if (!loc) return zh
  return glossaryDefs[loc]?.[term] || zh
}

/** Localized UI strings, or null on the zh source (components keep their zh literals). */
export function uiFor(lang: string | undefined): UiTr | null {
  const loc = toLocale(lang)
  return loc ? uiTr[loc] : null
}
