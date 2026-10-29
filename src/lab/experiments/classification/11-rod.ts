// Pure helpers for 11 · Above the Rod. Nothing here imports data: the
// component passes the frozen v1 records and the baseline index's postings,
// and so does tests/lab-specimen-11.test.ts. Read-only throughout.
import { tokenize } from '../../../lib/retrieval.ts'

/** token → sourceId → count, as in the baseline index's `text` field. */
export type Postings = Record<string, Record<string, number>>

export interface Placement {
  sourceId: string
  term: string
}

export const placementKey = (p: Placement) => `${p.sourceId}|${p.term}`

/** Every controlled term on every record: one card filed under one guide. */
export const placementsOf = (records: ReadonlyArray<{ sourceId: string; terms: readonly string[] }>): Placement[] =>
  records.flatMap((r) => r.terms.map((term) => ({ sourceId: r.sourceId, term })))

export const termWords = (term: string) => tokenize(term.replace(/-/g, ' '))

/** The words of a term that the pinned source never uses. Empty means the card passes. */
export const missingWords = (postings: Postings, p: Placement) => termWords(p.term).filter((w) => !postings[w]?.[p.sourceId])

export const passesWordCheck = (postings: Postings, p: Placement) => missingWords(postings, p).length === 0

export interface Drawer {
  term: string
  cards: Placement[]
  /** Cards the word check lets drop below the rod. */
  passing: Placement[]
}

/** One drawer per term, in the order given. */
export const drawersOf = (terms: readonly string[], placements: readonly Placement[], postings: Postings): Drawer[] =>
  terms.map((term) => {
    const cards = placements.filter((p) => p.term === term)
    return { term, cards, passing: cards.filter((c) => passesWordCheck(postings, c)) }
  })

/** What the word check does to the whole catalogue. */
export function wordCheckTally(drawers: readonly Drawer[]) {
  const total = drawers.reduce((s, d) => s + d.cards.length, 0)
  const passed = drawers.reduce((s, d) => s + d.passing.length, 0)
  return {
    total,
    passed,
    held: total - passed,
    /** Drawers a patron would find empty once only rodded cards count. */
    emptied: drawers.filter((d) => d.cards.length > 0 && d.passing.length === 0).map((d) => d.term),
  }
}
