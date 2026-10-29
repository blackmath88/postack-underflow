// Photo Frame Commons, slice C: a bounded adapter from source-linked GitHub
// evidence to br-ai-nstorm's semantic model (contract v0.4, pinned at
// blackmath88/br-ai-nstorm@a96c2dbb). This module only maps data. Event
// construction, ids, lexical curation and the projection are br-ai-nstorm's
// own code, run by scripts/commons/brainstorm.mjs; nothing here reimplements
// them. Kept to erasable TypeScript so Node can run it without a build step.
//
// What maps, and where the contract does not fit, is written down in
// MISMATCHES and in docs/research/COMMONS-BRAINSTORM.md.

import type { Correction, EvidenceRole, Problem, SourceRef } from '../model.ts'

export const BRAINSTORM_REPOSITORY = 'blackmath88/br-ai-nstorm'
export const BRAINSTORM_REVISION = 'a96c2dbb6fb6caf9cbf648107827fec88e3c0961'

/** The importing agent. It submits; it never authors. */
export const IMPORTER = 'import:postack-commons'
/** Relations a GitHub author declared by linking, carried by the importer on their behalf. */
export const LINK_IMPORTER = 'importer:github-links'
/** Relations taken from the maintainer's curated tables. */
export const CURATED_IMPORTER = 'importer:curated-docs'
/** The record writer. In br-ai-nstorm terms an agent: it may propose, never author or accept. */
export const RECORD_WRITER = 'agent:claude-opus-5-5'

type Kind = 'question' | 'claim' | 'evidence' | 'assumption' | 'approach' | 'contradiction' | 'synthesis'

/** What the record writer would call each piece of evidence, offered as a classification proposal. */
export const ROLE_KIND: Record<EvidenceRole, Kind> = {
  report: 'evidence',
  'fix-report': 'evidence',
  maintainer: 'claim',
  synthesis: 'synthesis',
  correction: 'claim', // a contradiction is a relation between statements; review establishes it
  caution: 'assumption',
  proposal: 'approach',
}

export interface SourceMeta {
  kind: string
  url: string
  by: string
  byType?: string
  at?: string
  number?: number
  title?: string
  comment?: boolean
}

export interface PlannedContribution {
  /** Postack's key for the cited source, stable across imports. */
  refKey: string
  problemId: string
  content: string
  /** True when the source is cited by metadata only and the content is its title. */
  contentIsTitle: boolean
  role: EvidenceRole
  authoredBy: string
  sourceRef: { repository: string; revision?: string; path: string; startLine: number; endLine: number; url: string; section?: string }
  sourceDetail: string
  /** When the author wrote it, which br-ai-nstorm's provenance has no field for. */
  writtenAt?: string
}

export interface PlannedLink {
  problemId: string
  from: string
  to: string
  basis: 'source-declared' | 'editorial' | 'machine-proposal'
  kind: 'relation' | 'conflict'
  relationKind?: 'supports' | 'relates' | 'contradicts'
  conflictKind?: 'source_conflict' | 'knowledge_conflict'
  proposedBy: string
  onBehalfOf?: string
  reason: string
  confidence: number
}

export interface Unrepresented {
  what: string
  why: string
  count: number
}

const refKey = (r: SourceRef): string =>
  'doc' in r ? `${r.doc}#L${r.lines[0]}-L${r.lines[1]}` : r.comment ? `${r.thread}#${r.comment}` : r.thread

/** `issue/99` → `issues/99`; a comment adds its anchor. Paths, not files: see MISMATCHES. */
function pseudoPath(r: SourceRef): string {
  if ('doc' in r) return r.doc
  const [type, n] = r.thread.split('/')
  const base = `${type === 'pull' ? 'pull' : type === 'discussion' ? 'discussions' : 'issues'}/${n}`
  return r.comment ? `${base}#issuecomment-${r.comment}` : base
}

export interface AdapterInput {
  repository: string
  revision: string
  problems: Problem[]
  corrections: Correction[]
  sources: Record<string, SourceMeta>
  /** For each `type/number`, the thread numbers its text or timeline references. */
  threadRefs: Record<string, number[]>
  /** For each comment id, the thread numbers it references. */
  commentRefs: Record<string, number[]>
  /** Text of the document lines a record cites, keyed by refKey; needed to read the rows' citations. */
  docLines: Record<string, string>
}

export function planContributions(input: AdapterInput): {
  contributions: PlannedContribution[]
  links: PlannedLink[]
  unrepresented: Unrepresented[]
} {
  const contributions: PlannedContribution[] = []
  const links: PlannedLink[] = []
  let crossProblem = 0
  let recordText = 0

  for (const p of input.problems) {
    const mine = new Map<string, PlannedContribution>()
    const add = (ref: SourceRef, quote: string, role: EvidenceRole) => {
      const key = refKey(ref)
      if (mine.has(key)) return mine.get(key)!
      const s = input.sources[key]
      if (!s) throw new Error(`${p.id}: no source metadata for ${key}`)
      const lines: [number, number] = 'doc' in ref ? ref.lines : [0, 0]
      const c: PlannedContribution = {
        refKey: key,
        problemId: p.id,
        content: quote || s.title || key,
        contentIsTitle: !quote,
        role,
        authoredBy: s.by.startsWith('repo:') ? s.by : `github:${s.by}`,
        sourceRef: {
          repository: input.repository,
          ...('doc' in ref ? { revision: input.revision } : {}),
          path: pseudoPath(ref),
          startLine: lines[0],
          endLine: lines[1],
          url: s.url,
          ...(s.title ? { section: `${s.kind} #${s.number} · ${s.title}` } : {}),
        },
        sourceDetail: [
          `${input.repository}${'doc' in ref ? `@${input.revision.slice(0, 12)}` : ''}:${pseudoPath(ref)}`,
          quote ? 'excerpt' : 'title only',
          s.url,
        ].join(' · '),
        ...(s.at ? { writtenAt: s.at } : {}),
      }
      mine.set(key, c)
      contributions.push(c)
      return c
    }

    for (const e of p.evidence) add(e.ref, e.quote, e.role)
    for (const c of input.corrections.filter((x) => x.problem === p.id)) {
      const said = add(c.ref, c.quote, 'correction')
      const qualified = add(c.qualifies.ref, c.qualifies.quote, 'synthesis')
      links.push({
        problemId: p.id, from: said.refKey, to: qualified.refKey, basis: 'machine-proposal', kind: 'conflict',
        conflictKind: 'source_conflict', proposedBy: RECORD_WRITER,
        reason: `${c.absorbed ? 'A qualification the curated text already carries' : 'A correction the curated text does not yet reflect'}: ${c.says}`,
        confidence: 0.7,
      })
    }

    // Source-declared: the author of one contribution linked another's thread.
    const byThread = new Map<number, PlannedContribution>()
    for (const c of mine.values()) {
      const n = Number(c.refKey.split('#')[0]!.split('/')[1])
      if (!c.refKey.startsWith('docs/') && !byThread.has(n)) byThread.set(n, c)
    }
    for (const c of mine.values()) {
      if (c.refKey.startsWith('docs/')) continue
      const [thread = '', comment] = c.refKey.split('#')
      const refs = comment ? input.commentRefs[comment] ?? [] : input.threadRefs[thread] ?? []
      for (const n of refs) {
        const target = byThread.get(n)
        if (!target || target.refKey.split('#')[0] === thread) continue
        links.push({
          problemId: p.id, from: c.refKey, to: target.refKey, basis: 'source-declared', kind: 'relation',
          relationKind: 'relates', proposedBy: LINK_IMPORTER, onBehalfOf: c.authoredBy,
          reason: `${c.authoredBy.replace('github:', '@')} linked #${n} here. A link says the two are connected, not how.`,
          confidence: 1,
        })
      }
    }

    // Editorial: a curated table row that cites a report among its sources.
    for (const c of mine.values()) {
      if (!c.refKey.startsWith('docs/')) continue
      const text = input.docLines[c.refKey] ?? ''
      for (const m of text.matchAll(/#(\d{1,4})\b/g)) {
        const target = byThread.get(Number(m[1]))
        if (!target) continue
        links.push({
          problemId: p.id, from: target.refKey, to: c.refKey, basis: 'editorial', kind: 'relation',
          relationKind: 'supports', proposedBy: CURATED_IMPORTER, onBehalfOf: c.authoredBy,
          reason: `The curated row cites #${m[1]} among its reports.`,
          confidence: 1,
        })
      }
    }

    // Machine proposal: the same approach worked in one report and failed in another.
    for (const a of p.approaches) {
      const worked = a.reports.filter((r) => r.result === 'worked')
      const failed = a.reports.filter((r) => r.result === 'failed')
      for (const w of worked) for (const f of failed) {
        const we = p.evidence.find((e) => e.id === w.evidence)!
        const fe = p.evidence.find((e) => e.id === f.evidence)!
        links.push({
          problemId: p.id, from: refKey(fe.ref), to: refKey(we.ref), basis: 'machine-proposal', kind: 'conflict',
          conflictKind: 'knowledge_conflict', proposedBy: RECORD_WRITER,
          reason: `Same approach, different outcome: “${a.label}”. Possibly different hardware, not necessarily a disagreement.`,
          confidence: 0.55,
        })
      }
    }

    crossProblem += p.related.length
    recordText += p.approaches.length + p.openQuestions.length + p.indexing.decisions.length + p.indexing.uncertainty.length
  }

  // Deduplicate links (the same pair can be declared from both directions).
  const seen = new Set<string>()
  const unique = links.filter((l) => {
    const k = `${l.problemId}|${l.from}|${l.to}|${l.kind}|${l.basis}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })

  return {
    contributions,
    links: unique,
    unrepresented: [
      { what: 'Relations between problems', why: 'br-ai-nstorm relations and conflicts live inside one problem; Postack records relate problems to each other.', count: crossProblem },
      { what: 'The record writer’s own text (approaches, open questions, indexing notes)', why: 'authoredBy may never be an AI, so agent-written text cannot enter as contributions. It stays in the Postack record.', count: recordText },
    ],
  }
}

/**
 * Where br-ai-nstorm's contract and real GitHub material do not fit. Each entry
 * names the field and what the adapter does instead, so nothing is silently
 * coerced.
 */
export const MISMATCHES: Array<{ id: string; contract: string; reality: string; adapter: string }> = [
  {
    id: 'M1 Markdown only',
    contract: 'Repository adoption imports Markdown files named in brainstorm.config.json (docs/ADOPTION.md §3).',
    reality: 'Most of the knowledge is in issues and pull-request conversations, which are not files.',
    adapter: 'A separate adapter feeds the same event model. The manifest and Markdown extractor are not used.',
  },
  {
    id: 'M2 One author per repository',
    contract: 'Imported units are authoredBy repo:<owner/name>.',
    reality: '221 GitHub accounts wrote this material; the repository is one of them.',
    adapter: 'authoredBy is github:<login> for threads and comments, repo:<owner/name> only for documents.',
  },
  {
    id: 'M3 Line-anchored source refs',
    contract: 'SourceRef has path, startLine and endLine.',
    reality: 'A comment has a URL and an id, no file and no lines.',
    adapter: 'path is issues/<n>#issuecomment-<id>, lines are 0; the URL is kept. The static view therefore prints #L0.',
  },
  {
    id: 'M4 Excerpts, not units',
    contract: 'A unit is the full paragraph or list item, quoted for reading.',
    reality: 'Comment text belongs to its author and is not committed here.',
    adapter: 'Content is the record’s verbatim excerpt (≤25 words), or the thread title when only metadata is cited.',
  },
  {
    id: 'M5 No author-declared relations',
    contract: 'Nothing relational is derived on import; relations come from participants and curation.',
    reality: 'GitHub authors link threads (“#113 reports your exact symptom”). That link is the author’s own statement.',
    adapter: 'Linked pairs become pending proposals by importer:github-links onBehalfOf the author, never accepted relations.',
  },
  {
    id: 'M6 One timestamp',
    contract: 'Provenance.timestamp is when a contribution entered shared memory.',
    reality: 'The order people said things in is the story of a thread.',
    adapter: 'Events carry the snapshot time; the original time travels in Postack’s source metadata, not in the event.',
  },
  {
    id: 'M7 Kind from headings',
    contract: 'An imported unit’s kind comes from the author’s section heading; otherwise the lexical classifier.',
    reality: 'Comments have no headings.',
    adapter: 'Kind is br-ai-nstorm’s own inferKind(content); the record writer’s reading is a classification proposal.',
  },
]
