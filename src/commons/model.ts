// Photo Frame Commons: the problem-record format (commons-v1) and how a record
// becomes indexable text. Separate from Four Words on purpose: its corpus,
// records and results stay frozen, and this index is versioned on its own.
// Kept to erasable TypeScript so Node can run it without a build step.

export type SourceRef =
  | { thread: string; comment?: number }
  | { doc: string; lines: [number, number] }

export type EvidenceRole =
  | 'report'
  | 'fix-report'
  | 'maintainer'
  | 'synthesis'
  | 'correction'
  | 'caution'
  | 'proposal'

export interface Evidence {
  id: string
  ref: SourceRef
  role: EvidenceRole
  /** Verbatim from the source, or empty when only the source's metadata is cited. */
  quote: string
  /** The record writer's description of what the source says. Not the source's words. */
  says: string
}

export type Result = 'worked' | 'failed' | 'untested' | 'unreviewed' | 'in-review'

export interface Approach {
  id: string
  label: string
  scope: string
  reports: Array<{ evidence: string; result: Result }>
}

/**
 * Why a relation exists. Source-declared: the author linked the two. Deterministic:
 * derived from identifiers. Editorial: a person's classification, here the
 * maintainer's curated tables. Machine proposal: suggested, not accepted.
 */
export type RelationBasis = 'source-declared' | 'deterministic' | 'editorial' | 'machine-proposal'

export interface Related {
  to: string
  kind: 'neighbour' | 'alternative' | 'precondition'
  basis: RelationBasis
  evidence?: string
  note: string
}

export type Status =
  | 'documented'
  | 'partly-solved'
  | 'unsolved'
  | 'no-reviewed-route'
  | 'fixed-in-code'
  | 'in-review'
  | 'declined'

export interface Problem {
  id: string
  title: string
  device: string[]
  environment: string[]
  symptoms: string[]
  /** Search vocabulary added by the record writer, not found in the sources. */
  aliases: string[]
  status: Status
  statusNote: string
  evidence: Evidence[]
  approaches: Approach[]
  openQuestions: string[]
  related: Related[]
  indexing: { decisions: string[]; uncertainty: string[] }
}

export interface Correction {
  id: string
  problem: string
  kind: 'scope' | 'result' | 'status'
  by: string
  ref: SourceRef
  quote: string
  says: string
  qualifies: { ref: SourceRef; quote: string }
  absorbed: boolean
  absorbedNote: string
  preview: null | Partial<Pick<Problem, 'environment' | 'symptoms' | 'statusNote'>>
}

export const STATUS_LABEL: Record<Status, string> = {
  documented: 'Documented',
  'partly-solved': 'Partly solved',
  unsolved: 'Unsolved',
  'no-reviewed-route': 'No reviewed route',
  'fixed-in-code': 'Fixed in code',
  'in-review': 'In review',
  declined: 'Declined',
}

/** Fixed before any query was run against the index; not tuned. */
export const COMMONS_WEIGHTS = {
  title: 3,
  symptoms: 2,
  aliases: 2,
  device: 1,
  environment: 1,
  approaches: 1,
  evidence: 1,
} as const

export function problemFields(p: Problem): Record<string, string> {
  return {
    title: p.title,
    symptoms: p.symptoms.join('. '),
    aliases: p.aliases.join('. '),
    device: p.device.join('. '),
    environment: p.environment.join('. '),
    approaches: p.approaches.map((a) => `${a.label}. ${a.scope}`).join('. '),
    evidence: p.evidence.map((e) => `${e.quote} ${e.says}`).join(' '),
  }
}

/** The record as it would read if a correction were accepted. Pure: the input is not changed. */
export function applyCorrection(p: Problem, c: Correction): Problem {
  if (!c.preview || c.problem !== p.id) return p
  return {
    ...p,
    environment: [...p.environment, ...(c.preview.environment ?? [])],
    symptoms: [...p.symptoms, ...(c.preview.symptoms ?? [])],
    statusNote: c.preview.statusNote ?? p.statusNote,
  }
}

export const refKey = (r: SourceRef): string =>
  'doc' in r ? `${r.doc}#L${r.lines[0]}-L${r.lines[1]}` : r.comment ? `${r.thread}#${r.comment}` : r.thread
