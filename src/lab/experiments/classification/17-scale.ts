// Pure helpers and exhibits for 17 · Three Kinds of Proof. Nothing here
// imports data: each exhibit points at one evidence note of a frozen v1
// record, which the component (and tests/lab-specimen-17.test.ts) read
// themselves. The side each exhibit takes, its scope and its default kind are
// our reading of the record, not the record's own label.

export type Proof = 'reported' | 'reproduced' | 'regression'
export type Scope = 'any' | 'branch' | 'actions'
export type Admit = 'every' | 'stronger'

export interface Exhibit {
  id: string
  sourceId: string
  /** Index into that record's `evidence` array. */
  evidence: number
  side: 'for' | 'against'
  scope: Exclude<Scope, 'any'>
  /** Why it bears on the claim, in our words. */
  reading: string
}

export const CLAIM = 'Adding a .nojekyll file fixes files missing from a GitHub Pages site.'

export const EXHIBITS: Exhibit[] = [
  { id: 'e1', sourceId: 'ghdocs-create-site-nojekyll', evidence: 0, side: 'for', scope: 'branch', reading: 'GitHub documents .nojekyll for branch publishing.' },
  { id: 'e2', sourceId: 'next-issue-15588-nojekyll', evidence: 0, side: 'for', scope: 'branch', reading: 'The reporter says .nojekyll made the assets load.' },
  { id: 'e3', sourceId: 'vite-issue-9119-underscore-chunk', evidence: 1, side: 'for', scope: 'branch', reading: 'The reporter says .nojekyll also resolves the 404.' },
  { id: 'e4', sourceId: 'upload-pages-artifact-issue-129-hidden-files', evidence: 1, side: 'against', scope: 'actions', reading: 'Commenters say they tested it: with an artifact deploy, .nojekyll does nothing.' },
  { id: 'e5', sourceId: 'upload-pages-artifact-issue-129-hidden-files', evidence: 0, side: 'against', scope: 'actions', reading: 'The missing dotfiles came back through an opt-in in the action, not through .nojekyll.' },
  { id: 'e6', sourceId: 'upload-pages-artifact-readme', evidence: 0, side: 'against', scope: 'actions', reading: 'The action leaves hidden files out by default; .nojekyll does not change that.' },
]

/** The record's evidence labels, every one of which is a kind of report: someone said so. */
export const REPORT_KINDS = ['official-docs', 'reporter-confirmed', 'community-report', 'merged-fix'] as const

/** As read, every exhibit is a report. */
export const START_KIND: Record<string, Proof> = Object.fromEntries(EXHIBITS.map((e) => [e.id, 'reported']))

export const admits = (admit: Admit, kind: Proof) => admit === 'every' || kind !== 'reported'

export interface Weighing {
  pro: Exhibit[]
  con: Exhibit[]
  /** Exhibits in scope that the admission rule set aside. */
  aside: Exhibit[]
  /** Beam angle in degrees; positive tips towards the claim. Capped at ±15. */
  tilt: number
  /** What a reader of the beam alone would say. */
  reads: 'level' | 'tips for' | 'tips against'
  empty: boolean
}

export function weigh(admit: Admit, scope: Scope, kind: Record<string, Proof> = START_KIND, exhibits = EXHIBITS): Weighing {
  const inScope = exhibits.filter((e) => scope === 'any' || e.scope === scope)
  const counted = inScope.filter((e) => admits(admit, kind[e.id] ?? 'reported'))
  const pro = counted.filter((e) => e.side === 'for')
  const con = counted.filter((e) => e.side === 'against')
  const diff = pro.length - con.length
  return {
    pro,
    con,
    aside: inScope.filter((e) => !counted.includes(e)),
    tilt: Math.max(-3, Math.min(3, diff)) * 5,
    reads: diff === 0 ? 'level' : diff > 0 ? 'tips for' : 'tips against',
    empty: counted.length === 0,
  }
}
