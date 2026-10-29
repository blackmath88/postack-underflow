// Pure helpers for 04 · A Search That Explains Itself. Nothing here imports
// data: the component passes the frozen v1 structured index and the 27 frozen
// query texts in, and so does tests/lab-specimen-04.test.ts. Weights change
// in memory only; the frozen index is never written. This is a demonstration
// of the mechanism, not an evaluation: no score against the labels is taken.
import { BM25_B, search, type Index } from '../../../lib/retrieval.ts'

export type Weights = Record<string, number>

export const withWeights = (index: Index, weights: Weights): Index => ({ ...index, weights })

/** The first result of each query, or undefined when nothing matches. */
export const firstResults = (index: Index, queries: readonly string[]) => queries.map((q) => search(index, q).hits[0]?.id)

/**
 * Which queries get a different first result under `weights` than under the
 * index's own (frozen) weights. Returns their positions in `queries`.
 */
export function changedFirsts(frozen: Index, weights: Weights, queries: readonly string[], frozenTops = firstResults(frozen, queries)) {
  const index = withWeights(frozen, weights)
  const out: number[] = []
  queries.forEach((q, i) => {
    if (search(index, q).hits[0]?.id !== frozenTops[i]) out.push(i)
  })
  return out
}

/** Every field weighted 1. */
export const allEqual = (frozen: Index): Weights => Object.fromEntries(Object.keys(frozen.weights).map((f) => [f, 1]))

/**
 * Split one hit's score into fields. BM25F sums weighted, length-normalised
 * term frequencies before saturating them, so a term's contribution has no
 * exact per-field share; we divide it in proportion to each field's part of
 * the weighted sum. That proportional split is our choice, said so on screen.
 */
export function byField(index: Index, id: string, matches: Array<{ contribution: number; fields: Record<string, number> }>) {
  const out: Record<string, number> = {}
  for (const m of matches) {
    const parts: Record<string, number> = {}
    let total = 0
    for (const [f, tf] of Object.entries(m.fields)) {
      const field = index.fields[f]!
      const norm = 1 - BM25_B + BM25_B * ((field.lengths[id] ?? 0) / (field.avgLength || 1))
      const part = ((index.weights[f] ?? 0) * tf) / norm
      parts[f] = part
      total += part
    }
    for (const [f, p] of Object.entries(parts)) out[f] = (out[f] ?? 0) + (total ? (m.contribution * p) / total : 0)
  }
  return out
}
