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
import {
  glossaryPageTr,
  integrationsPageTr,
  modelsTableTr,
  type GlossaryPageTr,
  type IntegrationsPageTr,
  type ModelsTableTr,
} from './i18n-pages-data'

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

// ── Data-driven pages (glossary / integrations / models) ──────────────────

/** Glossary page overlay (group labels + UI strings), or null on the zh source. */
export function glossaryPage(lang: string | undefined): GlossaryPageTr | null {
  const loc = toLocale(lang)
  return loc ? glossaryPageTr[loc] : null
}

/** Integrations page overlay (UI strings + frontmatter), or null on the zh source. */
export function integrationsPage(lang: string | undefined): IntegrationsPageTr | null {
  const loc = toLocale(lang)
  return loc ? integrationsPageTr[loc] : null
}

/** Models table overlay (headers / status / vendor / tagline / tag maps), or null on the zh source. */
export function modelsTable(lang: string | undefined): ModelsTableTr | null {
  const loc = toLocale(lang)
  return loc ? modelsTableTr[loc] : null
}

/** Merge the integrations overlay text positionally onto the zh base categories
 *  (base carries icon/link/external/id; overlay carries title/lede/item text). */
export function localizeIntegrations<T extends { title: string; lede: string; items: any[] }>(
  baseCats: T[],
  lang: string | undefined,
): T[] {
  const loc = toLocale(lang)
  if (!loc) return baseCats
  const tr = integrationsPageTr[loc]
  if (!tr) return baseCats
  return baseCats.map((c, ci) => {
    const ct = tr.categories[ci]
    if (!ct) return c
    return {
      ...c,
      title: ct.title || c.title,
      lede: ct.lede || c.lede,
      items: c.items.map((it, ii) => {
        const itt = ct.items[ii]
        if (!itt) return it
        return { ...it, name: itt.name || it.name, desc: itt.desc || it.desc, tag: itt.tag ?? it.tag }
      }),
    }
  })
}
