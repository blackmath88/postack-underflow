// 35 · The Switchboard Operator: a turn-based model of an operator's acts.
// Pure, so a Node script can play the same board. Every act costs one tick of
// the clock. The timings (when calls ring, how long callers wait, how long a
// conversation lasts) are ours, invented for this model; so is the one-headset
// rule. The acts themselves follow PR #5's reported list: answer, plug in,
// ring, supervise, release. Not independently verified.

export type Phase =
  | 'quiet' // has not rung yet
  | 'ringing' // caller's lamp lit
  | 'answered' // operator on the caller's line
  | 'plugged' // cord in the called party's jack
  | 'signalling' // ringing the called party
  | 'talking'
  | 'finished' // supervision lamps lit: both have hung up
  | 'released' // cord pulled after the call
  | 'cut-off' // cord pulled during the call
  | 'abandoned' // caller gave up waiting

export type Act = 'answer' | 'plug' | 'ring' | 'release' | 'watch'

export interface CallSpec {
  id: string
  rings: number
  /** A caller whose line is dead: offline or deleted. */
  silent: boolean
}

export interface Line {
  phase: Phase
  since: number
}

export interface Entry {
  tick: number
  act: Act
  id?: string
  note: string
}

export interface Board {
  tick: number
  lines: Record<string, Line>
  log: Entry[]
}

export const PATIENCE = 5
export const TALK = 3

export function open(calls: CallSpec[]): Board {
  return tick({ tick: -1, lines: Object.fromEntries(calls.map((c) => [c.id, { phase: 'quiet', since: 0 }])), log: [] }, calls)
}

/** What the operator may do to a line now. */
export function allowed(b: Board, calls: CallSpec[], id: string, act: Act): boolean {
  const line = b.lines[id]
  const spec = calls.find((c) => c.id === id)
  if (!line || !spec) return false
  const onHeadset = Object.values(b.lines).some((l) => l.phase === 'answered')
  switch (act) {
    case 'answer':
      return line.phase === 'ringing' && !onHeadset
    case 'plug':
      return line.phase === 'answered' && !spec.silent
    case 'ring':
      return line.phase === 'plugged'
    case 'release':
      return ['answered', 'plugged', 'signalling', 'talking', 'finished'].includes(line.phase)
    case 'watch':
      return true
  }
}

const NOTE: Record<Act, (silent: boolean, phase: Phase) => string> = {
  answer: (silent) => (silent ? 'answered: nobody on the line' : 'answered: “Number, please?”'),
  plug: () => 'plugged a cord into the called jack',
  ring: () => 'rang the called party',
  release: (_s, phase) => (phase === 'talking' || phase === 'signalling' ? 'pulled the cord while the call was live' : 'pulled the cord'),
  watch: () => 'watched the board',
}

/** Advance the clock one tick: lamps light, callers give up, calls connect and end. */
function tick(b: Board, calls: CallSpec[]): Board {
  const t = b.tick + 1
  const lines: Record<string, Line> = {}
  for (const c of calls) {
    const l = b.lines[c.id]!
    const age = t - l.since
    let next: Line = l
    if (l.phase === 'quiet' && c.rings <= t) next = { phase: 'ringing', since: t }
    else if (l.phase === 'ringing' && age >= PATIENCE) next = { phase: 'abandoned', since: t }
    else if (l.phase === 'signalling' && age >= 1) next = { phase: 'talking', since: t }
    else if (l.phase === 'talking' && age >= TALK) next = { phase: 'finished', since: t }
    lines[c.id] = next
  }
  return { ...b, tick: t, lines }
}

export function act(b: Board, calls: CallSpec[], a: Act, id: string): Board {
  if (a !== 'watch' && !allowed(b, calls, id, a)) return b
  const spec = calls.find((c) => c.id === id)
  const line = b.lines[id]
  const lines = { ...b.lines }
  if (a !== 'watch' && line && spec) {
    const phase: Phase =
      a === 'answer' ? 'answered' : a === 'plug' ? 'plugged' : a === 'ring' ? 'signalling' : line.phase === 'talking' || line.phase === 'signalling' ? 'cut-off' : 'released'
    lines[id] = { phase, since: b.tick }
  }
  const entry: Entry = { tick: b.tick, act: a, id: a === 'watch' ? undefined : id, note: NOTE[a](spec?.silent ?? false, line?.phase ?? 'quiet') }
  return tick({ ...b, lines, log: [...b.log, entry] }, calls)
}

export function outcome(b: Board) {
  const ls = Object.values(b.lines)
  const n = (p: Phase) => ls.filter((l) => l.phase === p).length
  return { released: n('released'), cutOff: n('cut-off'), abandoned: n('abandoned'), open: ls.length - n('released') - n('cut-off') - n('abandoned') - n('quiet'), quiet: n('quiet') }
}

/** The schedule: when each contract's call rings. Ours, fixed so the board can be replayed. */
export const RING_AT = [0, 2, 3, 6, 8, 9, 12, 14, 16]

export function callsFrom(
  contracts: ReadonlyArray<{ id: string; from: string }>,
  contributions: ReadonlyArray<{ id: string; availability: string }>,
): CallSpec[] {
  return contracts.map((k, i) => ({
    id: k.id,
    rings: RING_AT[i] ?? i,
    silent: contributions.find((c) => c.id === k.from)?.availability !== 'available',
  }))
}
