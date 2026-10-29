import { useId, useState } from 'react'
import { LOOP } from '../../../data/problem-desk'
import { RULES, SIZE, count, start, tick, type Cell, type Knobs, type World } from './loop-sim'

// 58 · The Public Memory Loop. The Problem Desk names a loop: publish,
// discover, reuse, challenge, correct, maintain. This runs it as a toy with
// three knobs and six written rules (loop-sim.ts). Each cell is one record.
// It is a simulation of our rules, not of any community.

const GLYPH: Record<Cell, string> = { empty: '·', new: 'n', live: 'L', challenged: 'c', stale: 'S' }
const NAME: Record<Cell, string> = { empty: 'empty', new: 'published, not yet found', live: 'live', challenged: 'challenged, in the queue', stale: 'stale, still indexed' }

const KNOBS: Array<{ key: keyof Knobs; label: string; min: number; max: number; unit: string }> = [
  { key: 'publish', label: 'Records published per tick', min: 0, max: 4, unit: '' },
  { key: 'capacity', label: 'Corrections maintainers can make per tick', min: 0, max: 4, unit: '' },
  { key: 'drift', label: 'Chance a reuse turns up a problem', min: 0, max: 30, unit: '%' },
]

export default function MemoryLoop() {
  const id = useId()
  const [knobs, setKnobs] = useState<Knobs>({ publish: 2, capacity: 1, drift: 10 })
  const [world, setWorld] = useState<World>(start)
  const steps = (n: number) =>
    setWorld((w) => {
      let x = w
      for (let i = 0; i < n; i++) x = tick(x, knobs)
      return x
    })
  const queue = count(world, 'challenged') + count(world, 'stale')

  return (
    <div className="x58">
      <p className="x58__loop" aria-label="The loop, as the Problem Desk names it">
        {LOOP.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </p>

      <div className="x58__panel">
        <div className="x58__knobs">
          {KNOBS.map((k) => (
            <label key={k.key} htmlFor={`${id}-${k.key}`}>
              <span>
                {k.label}: <strong>{knobs[k.key]}{k.unit}</strong>
              </span>
              <input
                id={`${id}-${k.key}`}
                type="range"
                min={k.min}
                max={k.max}
                value={knobs[k.key]}
                onChange={(e) => setKnobs((o) => ({ ...o, [k.key]: Number(e.target.value) }))}
              />
            </label>
          ))}
          <div className="x58__run">
            <button type="button" className="lab-btn" onClick={() => steps(1)} data-probe="click">
              One tick
            </button>
            <button type="button" className="lab-btn" onClick={() => steps(10)}>
              Ten ticks
            </button>
            <button type="button" className="lab-btn" onClick={() => setWorld(start())} disabled={world.t === 0}>
              Start again
            </button>
          </div>
        </div>

        <div className="x58__field">
          <ol className="x58__grid" aria-label={`${SIZE} records`}>
            {world.cells.map((c, i) => (
              <li key={i} className={`x58__c x58__c--${c}`} title={NAME[c]}>
                {GLYPH[c]}
              </li>
            ))}
          </ol>
          <ul className="x58__key" aria-label="Key">
            {(Object.keys(GLYPH) as Cell[]).map((c) => (
              <li key={c}>
                <span className={`x58__c x58__c--${c}`} aria-hidden="true">
                  {GLYPH[c]}
                </span>{' '}
                {NAME[c]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="x58__ledger" data-observe role="status">
        <p>
          Tick {world.t}. Live {count(world, 'live')}, not yet found {count(world, 'new')}, in the queue {queue} (of which stale{' '}
          {count(world, 'stale')}).
        </p>
        <p>
          Corrections made: {world.corrected}. Reuses of live records: {world.reusedLive}. Reuses of records already challenged, known to be
          wrong and still served: <strong>{world.reusedStale}</strong>.
        </p>
      </div>

      <details className="x58__rules" open>
        <summary>The rules, all of them</summary>
        <ol>
          {RULES.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
        <p className="lab-out">Seeded and deterministic: the same knobs and ticks always give the same field.</p>
      </details>
    </div>
  )
}
