// The problem–solution record format of the Four Words corpus, and how a
// record becomes indexable text. Weights were fixed before the first
// evaluation run and are not tuned against the labelled queries.

export type EvidenceKind =
  | 'official-docs'
  | 'maintainer-response'
  | 'merged-fix'
  | 'reporter-confirmed'
  | 'community-report'
  | 'none'

export type RelationKind = 'alternative' | 'complements' | 'conflicts' | 'supersedes' | 'explains'

export interface ProblemRecord {
  id: string
  sourceId: string
  problem: string
  aliases: string[]
  symptoms: string[]
  context: string[]
  solution: string
  evidence: Array<{ kind: EvidenceKind; note: string }>
  limitations: string[]
  related: Array<{ sourceId: string; relation: RelationKind; note: string }>
  terms: string[]
  extraction: { by: string; at: string; method: string }
}

/** Controlled vocabulary, defined before records were written. */
export const CONTROLLED_TERMS = [
  'base-path',
  'asset-404',
  'spa-fallback',
  'client-routing',
  'router-basename',
  'hash-routing',
  'prerender',
  'static-export',
  'jekyll',
  'underscore-paths',
  'trailing-slash',
  'custom-404',
  'actions-deploy',
  'pages-artifact',
  'custom-domain',
  'relative-urls',
] as const

export const STRUCTURED_WEIGHTS = {
  problem: 3,
  aliases: 2,
  symptoms: 2,
  terms: 2,
  context: 1,
  solution: 1,
} as const

export function recordFields(record: ProblemRecord): Record<string, string> {
  return {
    problem: record.problem,
    aliases: record.aliases.join('. '),
    symptoms: record.symptoms.join('. '),
    terms: record.terms.join(' '),
    context: record.context.join('. '),
    solution: record.solution,
  }
}
