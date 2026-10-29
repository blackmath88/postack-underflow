// What the Photo Frame Commons interface reads. Built by
// scripts/commons/build-view.mjs from the committed artifacts of slices A–D.
import viewJson from '../../data/commons-view.json'
import type { Correction, Problem, RelationBasis, Result, SourceRef } from '../model.ts'
import { refKey } from '../model.ts'
import type { AtRecord, Attachment, Elsewhere, IdentityNote } from '../atproto/projection.ts'

export interface SourceMeta {
  kind: 'issue' | 'pull' | 'discussion' | 'doc'
  url: string
  by: string
  byType?: string
  at?: string
  number?: number
  title?: string
  state?: string | null
  merged?: boolean
  closedAt?: string | null
  edited?: boolean
  comment?: boolean
  path?: string
}

export interface MapContribution {
  id: string
  kind: string
  label: string
  content: string
  authoredBy: string
  refKey: string
  role: string
  writtenAt: string | null
  contentIsTitle: boolean
}

export interface MapProposal {
  id: string
  kind: 'relation' | 'conflict' | 'duplicate' | 'classification'
  sourceId: string
  targetId: string | null
  relationKind: string | null
  conflictKind: string | null
  suggestedKind: string | null
  reason: string
  proposedBy: string
  onBehalfOf: string | null
  confidence: number
}

interface View {
  meta: {
    repository: string
    revision: string
    snapshotAt: string
    version: string
    recordsBy: string
    recordsReview: string
    counts: { issues: number; pulls: number; discussions: number; comments: number; people: number; docs: number }
    brainstorm: {
      repository: string
      revision: string
      proposalsBy: Record<string, number>
      unrepresented: Array<{ what: string; why: string; count: number }>
      mismatches: Array<{ id: string; contract: string; reality: string; adapter: string }>
    }
    atproto: { fetchedAt: string; coverage: Record<string, unknown> }
  }
  problems: Problem[]
  corrections: Correction[]
  sources: Record<string, SourceMeta>
  map: Record<string, { contributions: MapContribution[]; proposals: MapProposal[] }>
  elsewhere: { byProblem: Record<string, Elsewhere[]>; repository: Elsewhere[] }
  identities: IdentityNote[]
}

export const VIEW = viewJson as unknown as View
export const META = VIEW.meta
export const PROBLEMS = VIEW.problems
export const problemById = (id: string) => PROBLEMS.find((p) => p.id === id)
export const sourceFor = (ref: SourceRef | string): SourceMeta | undefined =>
  VIEW.sources[typeof ref === 'string' ? ref : refKey(ref)]

/** Which basis a map proposal stands on, from who proposed it. */
export function basisOf(p: MapProposal): RelationBasis {
  if (p.proposedBy === 'importer:github-links') return 'source-declared'
  if (p.proposedBy === 'importer:curated-docs') return 'editorial'
  if (p.proposedBy === 'curator:deterministic') return 'deterministic'
  return 'machine-proposal'
}

export const BASIS_LABEL: Record<RelationBasis, string> = {
  'source-declared': 'Author linked it',
  editorial: 'Maintainer’s table',
  deterministic: 'Lexical match',
  'machine-proposal': 'Record writer’s proposal',
}

export const BASIS_GLOSS: Record<RelationBasis, string> = {
  'source-declared': 'The author of one contribution linked the other’s thread. A link says the two are connected, not how.',
  editorial: 'A row in the maintainer’s curated table cites this report among its sources.',
  deterministic: 'br-ai-nstorm’s lexical curator found shared vocabulary. A trigger for review, not a verdict.',
  'machine-proposal': 'Suggested by the agent that wrote the records. Not accepted by anyone.',
}

export const RESULT_LABEL: Record<Result, string> = {
  worked: 'worked',
  failed: 'did not work',
  untested: 'not tested',
  unreviewed: 'unreviewed',
  'in-review': 'in review',
}

export const ATTACHMENT_LABEL: Record<Attachment, string> = {
  declared: 'Links a thread this problem cites',
  deterministic: 'Links a pull request that changed a document this problem cites',
  repository: 'Links the repository as a whole',
}

export const ROLE_LABEL: Record<string, string> = {
  report: 'Report',
  'fix-report': 'Reported fix',
  maintainer: 'Maintainer',
  synthesis: 'Curated table',
  correction: 'Correction',
  caution: 'Caution',
  proposal: 'Proposal',
}

export const who = (by: string) => (by.startsWith('repo:') ? 'the repository’s documents' : `@${by.replace(/^github:/, '')}`)

export const day = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : ''

export function sourceLabel(s: SourceMeta | undefined): string {
  if (!s) return 'unknown source'
  if (s.kind === 'doc') return s.path ?? 'document'
  const kind = s.kind === 'pull' ? 'PR' : s.kind === 'discussion' ? 'Discussion' : 'Issue'
  return `${kind} #${s.number}${s.comment ? ', comment' : ''}`
}

export function threadState(s: SourceMeta | undefined): string {
  if (!s || s.kind === 'doc') return 'pinned at the snapshot revision'
  if (s.kind === 'pull') return s.merged ? 'merged' : s.state === 'OPEN' ? 'open' : 'closed unmerged'
  return s.state === 'OPEN' ? 'open' : s.state === 'CLOSED' ? 'closed' : ''
}

export type { AtRecord, Elsewhere }
