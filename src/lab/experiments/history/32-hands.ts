import type { CorpusSource } from '../../../lib/four-words-data'
import type { ProblemRecord } from '../../../lib/records'

// 32 · The Librarian's Hand: which hand wrote which line of one frozen record's
// card. Pure, with type-only imports, so a Node script can run the same
// attribution over all 30 records. The attribution follows what the corpus
// itself says: sources keep their authors' titles; an AI research agent chose
// and pinned them; the vocabulary was fixed before any record; an AI agent
// wrote every record field; no person has reviewed any record.

export type Hand = 'source' | 'selector' | 'form' | 'writer' | 'reviewer'

export const HANDS: Array<{ id: Hand; mark: string; name: string; who: string }> = [
  { id: 'source', mark: 'A', name: 'Source author', who: 'whoever wrote the page or issue; we keep their title' },
  { id: 'selector', mark: 'B', name: 'Selector', who: 'an AI research agent that chose and pinned the source' },
  { id: 'form', mark: 'C', name: 'The printed form', who: 'the controlled vocabulary, fixed before any record; the record does not say by whom' },
  { id: 'writer', mark: 'D', name: 'Record writer', who: 'an AI agent that paraphrased the source into every field' },
  { id: 'reviewer', mark: 'E', name: 'Reviewer', who: 'nobody yet: each record says it is not reviewed by a human' },
]

export interface CardLine {
  hand: Hand
  field: string
  text: string
}

export function cardLines(r: ProblemRecord, s: CorpusSource | undefined): CardLine[] {
  const lines: CardLine[] = []
  const add = (hand: Hand, field: string, text: string | undefined) => {
    if (text && text.trim()) lines.push({ hand, field, text })
  }
  add('source', 'Title', s?.title)
  add('source', 'Repository', s?.repo)
  add('source', 'Licence', s?.license)
  add('selector', 'Pinned at', s?.revision)
  add('writer', 'Problem', r.problem)
  for (const a of r.aliases) add('writer', 'Also asked as', a)
  for (const x of r.symptoms) add('writer', 'Symptom', x)
  for (const x of r.context) add('writer', 'Context', x)
  add('writer', 'Solution', r.solution)
  for (const e of r.evidence) add('writer', `Evidence (${e.kind})`, e.note)
  for (const l of r.limitations) add('writer', 'Limitation', l)
  for (const rel of r.related) add('writer', `See also (${rel.relation})`, `${rel.sourceId}: ${rel.note}`)
  return lines
}

export const words = (t: string) => t.split(/\s+/).filter(Boolean).length

/** Words on the card per hand. The form counts one word per printed term; ticks count for the writer. */
export function tally(lines: CardLine[], terms: readonly string[], ticked: readonly string[]) {
  const t: Record<Hand, number> = { source: 0, selector: 0, form: terms.length, writer: ticked.length, reviewer: 0 }
  for (const l of lines) t[l.hand] += words(l.text)
  return t
}

/** One card's word count per hand, its total, and the record writer's share (exact, and in whole per cent). */
export function card(r: ProblemRecord, s: CorpusSource | undefined, terms: readonly string[]) {
  const counts = tally(cardLines(r, s), terms, r.terms)
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const exact = (100 * counts.writer) / total
  return { counts, total, writerExact: exact, writerShare: Math.round(exact), reviewed: counts.reviewer > 0 }
}

/** Median of a list of numbers; the mean of the middle two for an even count. */
export function median(xs: readonly number[]) {
  const s = [...xs].sort((a, b) => a - b)
  const m = s.length >> 1
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2
}
