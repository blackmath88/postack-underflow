import { useState } from 'react'
import { artifact, recordBySource } from '../../../lib/four-words-data'

// 34 · Occupied Circuits. Every "related" link written into the 30 frozen v1
// records becomes a call: one record asking for another. A cord panel holds a
// fixed number of circuits. Answering plugs a call into a free cord; a full
// panel answers nothing until you pull a cord. The ledger counts what you
// released after listening and what you released without listening.

interface Call {
  n: number
  from: string
  to: string
  relation: string
  note: string
}

const CALLS: Call[] = artifact.records.flatMap((r) => r.related.map((l) => ({ from: r.sourceId, to: l.sourceId, relation: l.relation, note: l.note })))
  .map((c, i) => ({ ...c, n: i + 1 }))

const CAPACITIES = [2, 3, 5, Infinity] as const
type Capacity = (typeof CAPACITIES)[number]
const capLabel = (c: Capacity) => (c === Infinity ? 'no limit' : `${c} cords`)

interface Circuit {
  call: Call
  /** How many calls had been answered when this one was plugged in. */
  at: number
  heard: boolean
}

interface Tally {
  answered: number
  heardThenReleased: number
  releasedUnheard: number
  most: number
}

const EMPTY: Tally = { answered: 0, heardThenReleased: 0, releasedUnheard: 0, most: 0 }
const problem = (id: string) => recordBySource.get(id)?.problem ?? id

export default function OccupiedCircuits() {
  const [cap, setCap] = useState<Capacity>(3)
  const [next, setNext] = useState(0)
  const [board, setBoard] = useState<Circuit[]>([])
  const [t, setT] = useState<Tally>(EMPTY)

  const full = board.length >= cap
  const ringing = CALLS[next]

  const restart = (c: Capacity) => {
    setCap(c)
    setNext(0)
    setBoard([])
    setT(EMPTY)
  }

  const answer = () => {
    if (!ringing || full) return
    const b = [...board, { call: ringing, at: t.answered, heard: false }]
    setBoard(b)
    setNext((n) => n + 1)
    setT((x) => ({ ...x, answered: x.answered + 1, most: Math.max(x.most, b.length) }))
  }

  const listen = (n: number) => setBoard((b) => b.map((c) => (c.call.n === n ? { ...c, heard: true } : c)))

  const release = (n: number) => {
    const c = board.find((x) => x.call.n === n)
    if (!c) return
    setBoard((b) => b.filter((x) => x.call.n !== n))
    setT((x) => (c.heard ? { ...x, heardThenReleased: x.heardThenReleased + 1 } : { ...x, releasedUnheard: x.releasedUnheard + 1 }))
  }

  const released = t.heardThenReleased + t.releasedUnheard
  const heldUnheard = board.filter((c) => !c.heard).length

  return (
    <div className="x34">
      <fieldset className="x34__cap">
        <legend>Cords on the panel</legend>
        {CAPACITIES.map((c) => (
          <label key={String(c)}>
            <input type="radio" name="x34-cap" checked={cap === c} onChange={() => restart(c)} /> {capLabel(c)}
          </label>
        ))}
      </fieldset>

      <div className="x34__panel">
        <div className="x34__pegs" aria-hidden="true">
          {cap === Infinity ? (
            <span className="x34__inf">{board.length} cords in use, more always free</span>
          ) : (
            Array.from({ length: cap }, (_, i) => <span key={i} className={'x34__peg' + (board[i] ? ' is-up' : '')} />)
          )}
        </div>
        <div className="x34__incoming">
          {ringing ? (
            <p>
              <span className="x34__lamp" aria-hidden="true" /> Call {ringing.n} of {CALLS.length}: <code>{ringing.from}</code> asks for{' '}
              <code>{ringing.to}</code> ({ringing.relation})
            </p>
          ) : (
            <p>No more calls. All {CALLS.length} have been answered.</p>
          )}
          <button type="button" className="lab-btn" onClick={answer} disabled={!ringing || full} data-probe="click">
            {full ? 'No free cord: pull one first' : 'Answer and plug in'}
          </button>
        </div>
      </div>

      <p className="x34__status" data-observe role="status">
        Holding {board.length} {board.length === 1 ? 'circuit' : 'circuits'} on {capLabel(cap)}, {heldUnheard} not yet listened to.{' '}
        {CALLS.length - next} {CALLS.length - next === 1 ? 'call waits' : 'calls wait'}.
      </p>

      <ol className="x34__board">
        {board.map((c) => (
          <li key={c.call.n} className={c.heard ? 'is-heard' : undefined}>
            <p className="x34__pair">
              <span className="x34__no">{c.call.n}</span> <code>{c.call.from}</code> ⟷ <code>{c.call.to}</code>{' '}
              <span className="x34__age">up for {t.answered - c.at - 1} later calls</span>
            </p>
            {c.heard && (
              <div className="x34__heard">
                <p>
                  <strong>{c.call.relation}:</strong> {c.call.note}
                </p>
                <p className="x34__ends">
                  {problem(c.call.from)} <span aria-hidden="true">⟷</span> <span className="visually-hidden">and</span> {problem(c.call.to)}
                </p>
              </div>
            )}
            <span className="x34__acts">
              {!c.heard && (
                <button type="button" className="lab-btn" onClick={() => listen(c.call.n)}>
                  Listen
                </button>
              )}
              <button type="button" className="lab-btn" onClick={() => release(c.call.n)}>
                Pull cord
              </button>
            </span>
          </li>
        ))}
      </ol>

      <p className="x34__ledger">
        Answered {t.answered}. Released {released}: {t.heardThenReleased} after listening, {t.releasedUnheard} without listening. Most held at
        once: {t.most}.
      </p>
    </div>
  )
}
