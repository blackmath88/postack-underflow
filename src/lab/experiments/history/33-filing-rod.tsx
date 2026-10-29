import { useState } from 'react'
import { artifact, sourceById } from '../../../lib/four-words-data'
import { canFile, file, home, loose, pull, push, reject, slot, start, travelInOnePass, travelOneByOne } from './33-rod'

// 33 · The Filing Rod. A side view of one drawer of the 30 frozen v1 records,
// in source-id order. The 26 documentation cards are on the rod; the four
// issue reports stand above it, tentative. Filing one means drawing the rod
// back past it, card by card, and pushing it home again. Rejecting one costs
// nothing. The rod model is ours; see 33-rod.ts.

const IDS = artifact.records.map((r) => r.sourceId).sort()
const isIssue = (id: string) => sourceById.get(id)?.kind === 'issue'
const ACCEPTED = IDS.filter((id) => !isIssue(id))
const TENTATIVE = IDS.filter(isIssue)
const ONE_BY_ONE = travelOneByOne(ACCEPTED, TENTATIVE)
const ONE_PASS = travelInOnePass(ACCEPTED, TENTATIVE)

const W = 20
const X0 = 46
const short = (id: string) => (id.length > 26 ? id.slice(0, 25) + '…' : id)

export default function FilingRod() {
  const [s, setS] = useState(() => start(ACCEPTED, TENTATIVE))
  const reset = () => setS(start(ACCEPTED, TENTATIVE))

  // Everything in the drawer, front to back, tentative cards standing in place.
  const drawer = [...s.accepted.map((id, i) => ({ id, state: i < s.tip ? 'rodded' : 'loose' })), ...s.tentative.map((id) => ({ id, state: 'tentative' }))].sort(
    (a, b) => a.id.localeCompare(b.id),
  )
  const width = X0 + drawer.length * W + 30
  const tipIx = drawer.findIndex((c) => c.id === s.accepted[s.tip])
  const rodEnd = X0 + (tipIx === -1 ? drawer.length : tipIx) * W - 4
  const locked = home(s)
  const settled = s.tentative.length === 0

  return (
    <div className="x33">
      <div className="x33__scroll" data-scroll>
        <svg className="x33__svg" viewBox={`0 0 ${width} 150`} role="img" aria-label={`Side view of the drawer: the rod passes through ${s.tip} cards, ${loose(s)} accepted cards are loose, ${s.tentative.length} tentative cards stand above the rod.`}>
          <rect x="6" y="20" width="22" height="118" className="x33__front" />
          <line x1="4" y1="122" x2="34" y2="122" className="x33__knob" />
          <line x1="28" y1="136" x2={width - 6} y2="136" className="x33__floor" />
          {drawer.map((c, i) => {
            const x = X0 + i * W
            const y = c.state === 'tentative' ? 6 : c.state === 'loose' ? 28 : 36
            return (
              <g key={c.id} className={`x33__c x33__c--${c.state}`}>
                <rect x={x} y={y} width={W - 6} height="100" />
                {c.state !== 'tentative' && <circle cx={x + (W - 6) / 2} cy={y + 86} r="3" className="x33__hole" />}
              </g>
            )
          })}
          <line x1="16" y1="122" x2={Math.max(16, rodEnd)} y2="122" className="x33__rod" />
        </svg>
      </div>

      <div className="x33__levers">
        <div role="group" aria-label="Rod">
          <button type="button" className="lab-btn" onClick={() => setS((v) => pull(v, 1))} disabled={s.tip === 0} data-probe="click">
            Draw rod back 1
          </button>
          <button type="button" className="lab-btn" onClick={() => setS((v) => pull(v, 5))} disabled={s.tip === 0}>
            Back 5
          </button>
          <button type="button" className="lab-btn" onClick={() => setS((v) => push(v, 1))} disabled={locked}>
            Push in 1
          </button>
          <button type="button" className="lab-btn" onClick={() => setS((v) => push(v, 5))} disabled={locked}>
            In 5
          </button>
          <button type="button" className="lab-btn" onClick={reset}>
            Empty and restart
          </button>
        </div>
      </div>

      <p className="x33__status" data-observe>
        {locked
          ? `Rod home and locked through all ${s.accepted.length} accepted cards.`
          : `Rod drawn back: it holds the first ${s.tip} cards; ${loose(s) === 1 ? 'the last one is' : `the last ${loose(s)} are`} loose and would spill if the drawer tipped.`}{' '}
        Rod travel so far: {s.travel} {s.travel === 1 ? 'card-width' : 'card-widths'}.
      </p>

      <ul className="x33__tentative" aria-label="Tentative cards above the rod">
        {s.tentative.map((id) => {
          const p = slot(s.accepted, id)
          const ok = canFile(s, id)
          const before = s.accepted[p - 1]
          return (
            <li key={id}>
              <span className="x33__id">{id}</span>
              <span className="x33__where">
                belongs after {before ? short(before) : 'the front'} (position {p + 1}).{' '}
                {ok ? 'Loose here: it can go on the rod.' : `Draw the rod back ${s.tip - p} more to reach it.`}
              </span>
              <span className="x33__acts">
                <button type="button" className="lab-btn" onClick={() => setS((v) => file(v, id))} disabled={!ok}>
                  File it
                </button>
                <button type="button" className="lab-btn" onClick={() => setS((v) => reject(v, id))}>
                  Lift it out
                </button>
              </span>
            </li>
          )
        })}
      </ul>

      <div className="x33__ledger" role="status">
        <p>
          Filed {s.filed.length}, lifted out {s.rejected.length}, still tentative {s.tentative.length}. The rod was drawn {s.openings}{' '}
          {s.openings === 1 ? 'time' : 'times'}, and at worst {s.mostLoose} {s.mostLoose === 1 ? 'card' : 'cards'} stood loose at once.
        </p>
        <p className="x33__compare">
          For comparison, from this drawer: filing all four one at a time costs {ONE_BY_ONE} card-widths of rod travel; filing them in one
          opening costs {ONE_PASS}. Lifting all four out costs nothing.
          {settled && locked && ` You spent ${s.travel}.`}
        </p>
      </div>
    </div>
  )
}
