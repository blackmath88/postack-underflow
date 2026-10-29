import { CONTRIBUTIONS, type Contribution } from '../../../data/community-fixtures.ts'
import { LABELERS, LABELS } from '../../data/community-labels.ts'

// 30 · The Moderation Lens: the visibility policies and the account a view
// writes from what it shows. Pure, so a Node test can run it. The account is
// kept as keyed clauses, so the interface can set the account at any stop
// against the account through clear glass and show what the lens rewrote.

export type Fate = 'shown' | 'warned' | 'hidden' | 'placeholder'

export const STOPS = [
  { name: 'Clear glass', rule: 'Show everything, with placeholders for records that cannot be read.' },
  { name: 'Tidy', rule: 'Leave out records that cannot be read.' },
  { name: 'Calm, warn', rule: `Also put a warning over anything ${LABELERS.calm.handle} labels.` },
  { name: 'Calm, hide', rule: `Hide anything ${LABELERS.calm.handle} labels.` },
  { name: 'Both, hide', rule: `Hide anything ${LABELERS.calm.handle} or ${LABELERS.strict.handle} labels.` },
] as const

const labelsOn = (c: Contribution, src: string) => LABELS.filter((l) => l.uri === c.uri && l.src === src)

export function fate(c: Contribution, stop: number): { fate: Fate; why?: string } {
  if (c.availability !== 'available')
    return stop === 0 ? { fate: 'placeholder' } : { fate: 'hidden', why: c.availability.replace('-', ' ') }
  const calm = labelsOn(c, LABELERS.calm.did)
  const strict = labelsOn(c, LABELERS.strict.did)
  if (stop >= 4 && (calm.length || strict.length)) return { fate: 'hidden', why: [...calm, ...strict].map((l) => l.val).join(', ') }
  if (stop >= 3 && calm.length) return { fate: 'hidden', why: calm.map((l) => l.val).join(', ') }
  if (stop >= 2 && calm.length) return { fate: 'warned', why: calm.map((l) => l.val).join(', ') }
  return { fate: 'shown' }
}

/** Records the lens itself takes out of view: readable, but hidden by a label. */
export const hiddenByLabel = (stop: number) =>
  CONTRIBUTIONS.filter((c) => c.availability === 'available' && fate(c, stop).fate === 'hidden')

export const who = (c: Contribution) => c.author.handle.replace('.example', '')
const list = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}`)

export type ClauseKey = 'count' | 'against' | 'endorse' | 'rerun' | 'warned' | 'unread'
export interface Clause {
  key: ClauseKey
  text: string
}

/** The account the view would print, from what it shows and nothing else. */
export function account(stop: number): Clause[] {
  const seen = CONTRIBUTIONS.filter((c) => c.kind !== 'article' && ['shown', 'warned'].includes(fate(c, stop).fate))
  const has = (id: string) => seen.some((c) => c.id === id)
  const out: Clause[] = [{ key: 'count', text: `The essay drew ${seen.length} ${seen.length === 1 ? 'response' : 'responses'}.` }]
  const against = seen.filter((c) => c.kind === 'dispute' || c.kind === 'correction')
  out.push({
    key: 'against',
    text: against.length
      ? `${list(against.map((c) => `${who(c)} ${c.kind === 'dispute' ? 'disputed' : 'corrected'} ${c.claim}`))}.`
      : 'Nobody disagreed with it.',
  })
  if (has('c6')) out.push({ key: 'endorse', text: has('c4') ? 'ines endorsed mara’s correction.' : 'ines endorsed something this view does not show.' })
  if (has('c3')) out.push({ key: 'rerun', text: 'tomas wrote up how to rerun the evaluation.' })
  const warned = seen.filter((c) => fate(c, stop).fate === 'warned')
  if (warned.length) out.push({ key: 'warned', text: `${warned.length} sits behind a warning.` })
  if (stop === 0) out.push({ key: 'unread', text: `${CONTRIBUTIONS.filter((c) => c.availability !== 'available').length} more replies could not be read.` })
  return out
}

export const sentence = (clauses: Clause[]) => clauses.map((c) => c.text).join(' ')

export type Edit = { kind: 'kept' | 'rewritten' | 'cut' | 'added'; key: ClauseKey; was?: string; now?: string }

/** How the account at `stop` differs from the account through clear glass, clause by clause. */
export function rewrite(stop: number): Edit[] {
  const base = account(0)
  const now = account(stop)
  const edits: Edit[] = []
  for (const b of base) {
    const n = now.find((c) => c.key === b.key)
    if (!n) edits.push({ kind: 'cut', key: b.key, was: b.text })
    else if (n.text === b.text) edits.push({ kind: 'kept', key: b.key, now: n.text })
    else edits.push({ kind: 'rewritten', key: b.key, was: b.text, now: n.text })
  }
  for (const n of now) if (!base.some((b) => b.key === n.key)) edits.push({ kind: 'added', key: n.key, now: n.text })
  // Keep the order in which the view would print its clauses.
  const order: ClauseKey[] = ['count', 'against', 'endorse', 'rerun', 'warned', 'unread']
  return edits.sort((x, y) => order.indexOf(x.key) - order.indexOf(y.key))
}
