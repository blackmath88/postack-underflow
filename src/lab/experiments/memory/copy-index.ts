// Small helpers shared by memory pilots that rebuild a structured index from
// an in-browser copy of the frozen v1 records. The frozen artifact itself is
// only ever read. Rankings built here are demonstrations of a mechanism, not
// evaluation results.
import queriesFile from '../../../../corpus/queries.json'
import { buildIndex, search, type Index } from '../../../lib/retrieval'
import { STRUCTURED_WEIGHTS, recordFields, type ProblemRecord } from '../../../lib/records'

export interface FrozenQuery {
  id: string
  query: string
  relevant: string[]
}

export const QUERIES = queriesFile.queries as FrozenQuery[]

export const indexCopy = (records: ProblemRecord[]): Index =>
  buildIndex(
    'structured',
    'in-browser copy',
    records.map((r) => ({ id: r.sourceId, fields: recordFields(r) })),
    STRUCTURED_WEIGHTS,
  )

/** Rank (1-based) of the first source labelled relevant, or 0 if none matches. */
export const firstRelevant = (index: Index, q: FrozenQuery, relevant: readonly string[] = q.relevant) =>
  search(index, q.query).hits.findIndex((h) => relevant.includes(h.id)) + 1

export const topIds = (index: Index, query: string, k = 3) =>
  search(index, query)
    .hits.slice(0, k)
    .map((h) => h.id)
