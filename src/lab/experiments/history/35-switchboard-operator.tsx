import { useState } from 'react'
import { CONTRIBUTIONS } from '../../../data/community-fixtures'
import { CONTRACTS } from '../../../data/connection-contracts'
import { PATIENCE, TALK, act, allowed, callsFrom, open, outcome, type Act, type Phase } from './35-protocol'

// 35 · The Switchboard Operator. The nine connection contracts of the
// Community fixtures arrive as calls on a turn-based board. The operator has
// five acts, and each costs one tick. The log translates every act into the
// contract vocabulary and says when that vocabulary has no word for it.
// Timings are invented; see 35-protocol.ts.

const CALLS = callsFrom(CONTRACTS, CONTRIBUTIONS)
const byId = new Map(CONTRIBUTIONS.map((c) => [c.id, c]))
const who = (id: string) => byId.get(id)?.author.handle.replace('.example', '') ?? id
const contract = new Map(CONTRACTS.map((k) => [k.id, k]))

const ACTS: Array<{ act: Act; label: string; record: string | null }> = [
  { act: 'answer', label: 'Answer', record: null },
  { act: 'plug', label: 'Plug in', record: 'proposed' },
  { act: 'ring', label: 'Ring', record: null },
  { act: 'release', label: 'Release', record: 'withdrawn' },
  { act: 'watch', label: 'Watch the board', record: null },
]
const RECORD = Object.fromEntries(ACTS.map((a) => [a.act, a.record])) as Record<Act, string | null>

const LAMP: Record<Phase, string> = {
  quiet: 'dark',
  ringing: 'calling',
  answered: 'on your headset',
  plugged: 'cord in',
  signalling: 'ringing the other end',
  talking: 'talking',
  finished: 'both hung up',
  released: 'cleared',
  'cut-off': 'cut off',
  abandoned: 'gave up',
}

export default function SwitchboardOperator() {
  const [board, setBoard] = useState(() => open(CALLS))
  const [sel, setSel] = useState(CALLS[0]!.id)
  const o = outcome(board)
  const completed = CALLS.filter((c) => !c.silent && board.lines[c.id]?.phase === 'released').length
  const unrecorded = board.log.filter((e) => !RECORD[e.act]).length
  const [refusal, setRefusal] = useState<string | null>(null)
  // A disallowed act is refused, costs nothing, and says why: the protocol is the point.
  const doAct = (a: Act) => {
    if (a !== 'watch' && !allowed(board, CALLS, sel, a)) {
      const onHeadset = Object.entries(board.lines).find(([, l]) => l.phase === 'answered')?.[0]
      setRefusal(
        a === 'answer' && onHeadset && board.lines[sel]?.phase === 'ringing'
          ? `Cannot answer ${sel}: you are still on ${onHeadset}. Plug it in or release it first.`
          : `Cannot ${ACTS.find((x) => x.act === a)!.label.toLowerCase()} ${sel} while it is ${LAMP[board.lines[sel]!.phase]}.`,
      )
      return
    }
    setRefusal(null)
    setBoard((b) => act(b, CALLS, a, sel))
  }

  return (
    <div className="x35">
      <p className="x35__clock" aria-live="polite">
        Tick {board.tick}. A caller waits {PATIENCE} ticks before giving up; a call lasts {TALK} ticks.
      </p>

      <div className="x35__lines" role="group" aria-label="Lines. Choose one to act on.">
        {CALLS.map((c) => {
          const k = contract.get(c.id)!
          const line = board.lines[c.id]!
          return (
            <button
              key={c.id}
              type="button"
              className={`x35__line x35__line--${line.phase}`}
              aria-pressed={sel === c.id}
              onClick={() => setSel(c.id)}
            >
              <span className="x35__lamp" aria-hidden="true" />
              <span className="x35__who">
                {who(k.from)} → {who(k.to)}
              </span>
              <span className="x35__phase">{LAMP[line.phase]}</span>
            </button>
          )
        })}
      </div>

      <div className="x35__acts" role="group" aria-label={`Act on line ${sel}`}>
        {ACTS.map((a) => (
          <button
            key={a.act}
            type="button"
            className="lab-btn"
            onClick={() => doAct(a.act)}
            aria-disabled={a.act !== 'watch' && !allowed(board, CALLS, sel, a.act) ? true : undefined}
            data-probe={a.act === 'answer' ? 'click' : undefined}
          >
            {a.label}
          </button>
        ))}
        <button
          type="button"
          className="lab-btn"
          onClick={() => {
            setBoard(open(CALLS))
            setRefusal(null)
          }}
        >
          New shift
        </button>
      </div>

      <div className="x35__log" data-observe>
        <p className="x35__sum">
          {completed} of {CALLS.length} calls completed, {o.cutOff} cut off, {o.abandoned} callers gave up. {board.log.length}{' '}
          {board.log.length === 1 ? 'act' : 'acts'}, {unrecorded} of them with no word in the contract vocabulary.
        </p>
        {refusal && <p className="x35__refusal">{refusal}</p>}
        {board.log.length === 0 ? (
          <p className="x35__empty">The log is empty. Line {sel} is {LAMP[board.lines[sel]!.phase]}.</p>
        ) : (
          <ol reversed>
            {[...board.log].reverse().map((e, i) => (
              <li key={i}>
                <span className="x35__t">t{e.tick}</span> {e.id && <code>{e.id}</code>} {e.note}
                <span className={'x35__rec' + (RECORD[e.act] ? '' : ' is-none')}>
                  {RECORD[e.act] ? `records as “${RECORD[e.act]}”` : 'no contract status'}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
