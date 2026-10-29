// Pure helpers for 56 · The Forked Interpretation. Nothing here imports data:
// the component passes the frozen v1 indexes and queries in, and so does
// tests/lab-specimen-56.test.ts. Labels are read, never written: the review's
// reading is applied in memory, to q01 only.
import { reciprocalRank, search, type Index } from '../../../lib/retrieval.ts'

export type Reading = 'labeller' | 'review'

export interface Query {
  id: string
  query: string
  relevant: string[]
}

export const FORK_QUERY = 'q01'

/** The two records the post-hoc review reads as answering q01 (FOUR-WORDS.md). */
export const REVIEW_ADDS = ['angular-router-reference', 'tanstack-router-deploy'] as const

export const relevantFor = (q: Query, reading: Reading): string[] =>
  q.id === FORK_QUERY && reading === 'review' ? [...q.relevant, ...REVIEW_ADDS] : q.relevant

/** Rank (1-based) of the first relevant hit, or 0. */
export const firstAnswer = (ranked: readonly string[], relevant: readonly string[]) => ranked.findIndex((id) => relevant.includes(id)) + 1

/** MRR@10 over all queries, with q01's labels read one way or the other. */
export const mrrAt10 = (index: Index, queries: readonly Query[], reading: Reading) =>
  queries.reduce((sum, q) => sum + reciprocalRank(search(index, q.query).hits.map((h) => h.id), relevantFor(q, reading), 10), 0) / queries.length

export interface Branch {
  reading: Reading
  /** First answer to q01 in the structured ranking. */
  structuredRank: number
  /** First answer to q01 in plain keyword search. */
  keywordRank: number
  structured: number
  keyword: number
  winner: 'structured' | 'keyword' | 'tie'
}

export function branchOf(structured: Index, baseline: Index, queries: readonly Query[], reading: Reading): Branch {
  const q = queries.find((x) => x.id === FORK_QUERY)!
  const rel = relevantFor(q, reading)
  const s = mrrAt10(structured, queries, reading)
  const k = mrrAt10(baseline, queries, reading)
  return {
    reading,
    structuredRank: firstAnswer(search(structured, q.query).hits.map((h) => h.id), rel),
    keywordRank: firstAnswer(search(baseline, q.query).hits.map((h) => h.id), rel),
    structured: s,
    keyword: k,
    winner: Math.abs(s - k) < 1e-12 ? 'tie' : s > k ? 'structured' : 'keyword',
  }
}
