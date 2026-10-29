import { useState } from 'react'
import { tokenize } from '../../../lib/retrieval'
import { CARD_SOURCE, SITUATIONS, type Situation, type StripId } from '../../data/classification-context'
import { RECORDS, record, shortName } from './words'

// 18 · The Missing Context. A solution card from a frozen v1 record, with its
// problem, context and limitations as strips that can be peeled off. Six
// situations from other records stand beside it. As strips go, the card loses
// the lines that would have warned a reader off; the situations it would now
// be misapplied to are counted. Which line guards which situation is our
// reading (src/lab/data/classification-context.ts).

const R = record(CARD_SOURCE)

const STRIPS: Array<{ id: StripId; field: string; text: string }> = [
  { id: 'problem', field: 'problem', text: R.problem },
  { id: 'context-0', field: 'context', text: R.context[0]! },
  { id: 'context-1', field: 'context', text: R.context[1]! },
  { id: 'limit-0', field: 'limitation', text: R.limitations[0]! },
  { id: 'limit-1', field: 'limitation', text: R.limitations[1]! },
]
const PEEL_ORDER = [...STRIPS].reverse().map((s) => s.id)

type State = 'fits' | 'warned off' | 'misapplied' | 'check first' | 'silent'

function stateOf(s: Situation, kept: Set<StripId>): State {
  const guarded = s.guards.some((g) => g === 'solution' || kept.has(g))
  if (s.fits === 'yes') return 'fits'
  if (s.fits === 'no') return guarded ? 'warned off' : 'misapplied'
  return guarded ? 'check first' : 'silent'
}

// Across the corpus: how many context and limitation lines would travel if
// only the solution sentence were copied? A line travels if every one of its
// words is also in the solution.
const TRAVEL = (() => {
  let lines = 0
  let carried = 0
  for (const r of RECORDS) {
    const sol = new Set(tokenize(r.solution))
    for (const line of [...r.context, ...r.limitations]) {
      lines++
      if (tokenize(line).every((t) => sol.has(t))) carried++
    }
  }
  return { lines, carried }
})()

export default function MissingContext() {
  const [kept, setKept] = useState<Set<StripId>>(() => new Set(STRIPS.map((s) => s.id)))
  const states = SITUATIONS.map((s) => stateOf(s, kept))
  const misapplied = states.filter((s) => s === 'misapplied').length
  const silent = states.filter((s) => s === 'silent').length

  const peel = (id: StripId) =>
    setKept((k) => {
      const n = new Set(k)
      n.delete(id)
      return n
    })
  const peelNext = () => {
    const next = PEEL_ORDER.find((id) => kept.has(id))
    if (next) peel(next)
  }

  return (
    <div className="x18">
      <div className="x18__card">
        <p className="x18__from">Solution card · {shortName(CARD_SOURCE)}</p>
        <ul className="x18__strips">
          {STRIPS.map((s) =>
            kept.has(s.id) ? (
              <li key={s.id} className={`x18__strip x18__strip--${s.field}`}>
                <span className="x18__field">{s.field}</span>
                <span className="x18__text">{s.text}</span>
                <button type="button" className="x18__peel" onClick={() => peel(s.id)} aria-label={`Peel off the ${s.field}: ${s.text}`}>
                  peel
                </button>
              </li>
            ) : (
              <li key={s.id} className="x18__stub" aria-label={`${s.field} peeled off`}>
                <span aria-hidden="true">· · · torn · · ·</span>
              </li>
            ),
          )}
        </ul>
        <p className="x18__solution">
          <span className="x18__field">solution</span> {R.solution}
        </p>
        <div className="x18__btns">
          <button type="button" className="lab-btn" onClick={peelNext} disabled={kept.size === 0} data-probe="click">
            Peel the next strip
          </button>
          <button type="button" className="lab-btn" onClick={() => setKept(new Set(STRIPS.map((s) => s.id)))} disabled={kept.size === STRIPS.length}>
            Restore the card
          </button>
        </div>
      </div>

      <div className="x18__world" data-observe>
        <p className="x18__sum" role="status">
          {kept.size} of {STRIPS.length} strips left.{' '}
          {misapplied === 0
            ? 'Every situation it does not fit is still warned off by a line on the card.'
            : `The card would now be misapplied in ${misapplied} of ${SITUATIONS.length} situations`}
          {misapplied > 0 && (silent > 0 ? `, and is silent on ${silent} more.` : '.')}
        </p>
        <ul className="x18__situations">
          {SITUATIONS.map((s, i) => (
            <li key={s.sourceId} className={`is-${states[i]!.replace(' ', '-')}`}>
              <span className="x18__state">{states[i]}</span>
              <span className="x18__where">{s.where}</span>
              <span className="x18__why">
                {shortName(s.sourceId)} · {s.why}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="lab-out">
        corpus: of {TRAVEL.lines} context and limitation lines, {TRAVEL.carried} are carried word for word by their record’s solution
        sentence
      </p>
    </div>
  )
}
