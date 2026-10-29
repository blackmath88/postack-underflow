import { useState, type KeyboardEvent } from 'react'
import { artifact } from '../../../lib/four-words-data'
import type { ProblemRecord } from '../../../lib/records'

// 31 · Card Friction. The 30 frozen v1 records filed in one drawer, behind
// guide cards, in an order we chose: by each record's first controlled term,
// then by source id. You look for one card. Flipping costs one press per card
// and shows you everything on the way; jumping costs nothing and shows you
// nothing. The ledger counts what the way past showed you.

const UNFILED = 'unfiled'
const guideOf = (r: ProblemRecord) => r.terms[0] ?? UNFILED

const DRAWER = [...artifact.records].sort(
  (a, b) => guideOf(a).localeCompare(guideOf(b)) || a.sourceId.localeCompare(b.sourceId),
)

const FIRST = DRAWER[0]!.sourceId

const TARGETS = [
  { sourceId: 'vite-issue-9119-underscore-chunk', ask: 'the underscore file that GitHub Pages would not serve' },
  { sourceId: 'ghdocs-custom-404', ask: 'how to make a custom not-found page' },
  { sourceId: 'tanstack-router-deploy', ask: 'deploying a TanStack Router app' },
] as const

type Friction = 'flip' | 'riffle' | 'jump'
const STEP: Record<Friction, number> = { flip: 1, riffle: 5, jump: 0 }

const shares = (a: ProblemRecord, b: ProblemRecord) => a.terms.some((t) => b.terms.includes(t))

export default function CardFriction() {
  const [targetIx, setTargetIx] = useState(0)
  const [friction, setFriction] = useState<Friction>('flip')
  const [pos, setPos] = useState(0)
  const [passed, setPassed] = useState<string[]>([FIRST])
  const [presses, setPresses] = useState(0)

  const target = TARGETS[targetIx]!
  const targetRecord = DRAWER.find((r) => r.sourceId === target.sourceId)!
  const front = DRAWER[pos]!
  const found = front.sourceId === target.sourceId

  const restart = (ix: number) => {
    setTargetIx(ix)
    setPos(0)
    setPassed([FIRST])
    setPresses(0)
  }

  const move = (dir: 1 | -1) => {
    if (friction === 'jump') return
    const next = Math.max(0, Math.min(DRAWER.length - 1, pos + dir * STEP[friction]))
    if (next === pos) return
    // Riffling past cards shows their tabs, not their faces: only the card you
    // stop on is read. Flipping stops on, and reads, every card.
    const landed = DRAWER[next]!.sourceId
    setPassed((p) => (p.includes(landed) ? p : [...p, landed]))
    setPresses((n) => n + 1)
    setPos(next)
  }

  const jump = () => {
    setPos(DRAWER.indexOf(targetRecord))
    setPresses((n) => n + 1)
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      move(1)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      move(-1)
    }
  }

  const behind = DRAWER.slice(pos + 1, pos + 7)
  const read = passed.filter((s) => s !== target.sourceId).map((s) => DRAWER.find((r) => r.sourceId === s)!)
  const related = read.filter((r) => shares(r, targetRecord))
  const relatedByGuide = related.filter((r) => guideOf(r) === guideOf(targetRecord))

  return (
    <div className="x31">
      <div className="x31__task">
        <p className="x31__ask">
          Find the card about <strong>{target.ask}</strong>.
        </p>
        <div className="x31__choose" role="group" aria-label="Choose a card to look for">
          {TARGETS.map((t, i) => (
            <button key={t.sourceId} type="button" className="lab-btn" aria-pressed={i === targetIx} onClick={() => restart(i)}>
              Card {i + 1}
            </button>
          ))}
        </div>
        <fieldset className="x31__friction">
          <legend>Friction</legend>
          {(
            [
              ['flip', 'Flip one card at a time'],
              ['riffle', 'Riffle five at a time'],
              ['jump', 'Jump straight there'],
            ] as const
          ).map(([f, label]) => (
            <label key={f}>
              <input type="radio" name="x31-friction" checked={friction === f} onChange={() => setFriction(f)} /> {label}
            </label>
          ))}
        </fieldset>
      </div>

      <div
        className="x31__drawer"
        role="group"
        aria-roledescription="card drawer"
        aria-label={`Card drawer, card ${pos + 1} of ${DRAWER.length}. Use the arrow keys to flip.`}
        tabIndex={0}
        onKeyDown={onKey}
      >
        <div className="x31__stack" aria-hidden="true">
          {behind
            .slice()
            .reverse()
            .map((r, i, arr) => {
              const depth = arr.length - i
              const isGuide = guideOf(r) !== guideOf(DRAWER[DRAWER.indexOf(r) - 1] ?? r)
              return (
                <div key={r.sourceId} className="x31__edge" style={{ ['--d' as string]: depth }}>
                  {isGuide && <span className="x31__tab">{guideOf(r)}</span>}
                </div>
              )
            })}
        </div>
        <article key={front.sourceId} className={'x31__card' + (found ? ' is-found' : '')} data-observe>
          <p className="x31__guide">
            Filed under <strong>{guideOf(front)}</strong> · card {pos + 1} of {DRAWER.length}
          </p>
          <h3>{front.problem}</h3>
          <p className="x31__terms">{front.terms.join(' · ') || 'no controlled terms'}</p>
          <p className="x31__srcid">{front.sourceId}</p>
        </article>
      </div>

      <div className="x31__hands">
        <button type="button" className="lab-btn" onClick={() => move(-1)} disabled={friction === 'jump' || pos === 0}>
          ← Back
        </button>
        <button
          type="button"
          className="lab-btn"
          onClick={() => move(1)}
          disabled={friction === 'jump' || pos === DRAWER.length - 1}
          data-probe="click"
        >
          {friction === 'riffle' ? 'Riffle forward →' : 'Flip forward →'}
        </button>
        <button type="button" className="lab-btn" onClick={jump} disabled={friction !== 'jump' || found}>
          Jump to it
        </button>
      </div>

      <div className="x31__ledger" role="status">
        <p>
          {found ? 'Found it' : 'Still looking'} after {presses} {presses === 1 ? 'press' : 'presses'}. You read{' '}
          {read.length} other {read.length === 1 ? 'card' : 'cards'} on the way; {related.length} share a controlled
          term with the one you wanted
          {related.length > 0 && <>, and {relatedByGuide.length} of those sit behind the same guide card</>}.
        </p>
        {read.length > 0 && (
          <ul className="x31__read">
            {read.map((r) => (
              <li key={r.sourceId} className={shares(r, targetRecord) ? 'is-related' : undefined}>
                {r.sourceId}
                {shares(r, targetRecord) && <span> · shares {r.terms.filter((t) => targetRecord.terms.includes(t)).join(', ')}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
