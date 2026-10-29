import { useId, useMemo, useState } from 'react'
import queriesFile from '../../../../corpus/queries.json'
import { artifact, sourceById } from '../../../lib/four-words-data'
import { search } from '../../../lib/retrieval'
import { neighbours, shortName } from './logic'

// 02 · The Neighbour You Didn't Ask For. Run one frozen v1 query, take only
// its first result, and draw what stands next to that result without any
// further search: records its `related` field links to (or that link to it),
// and records sharing two or more controlled terms. A neighbour the labeller
// marked relevant, but which the search left out of its top five, is the one
// you did not ask for. Everything is read from the frozen artifact.

const QUERIES = queriesFile.queries as Array<{ id: string; query: string; relevant: string[] }>
type System = 'baseline' | 'structured'
const SYSTEM_LABEL: Record<System, string> = { baseline: 'plain keyword search', structured: 'problem-oriented index' }
const TOP = 5

function view(system: System, q: { query: string; relevant: string[] }) {
  const hits = search(artifact.indexes[system], q.query).hits.map((h) => h.id)
  const top = hits.slice(0, TOP)
  const centre = hits[0]!
  const doors = neighbours(artifact.records, centre).map((n) => {
    const rank = hits.indexOf(n.id) + 1
    const relevant = q.relevant.includes(n.id)
    return { ...n, rank: rank || null, relevant, unasked: relevant && !top.includes(n.id) }
  })
  const missed = q.relevant.filter((id) => !top.includes(id))
  return { centre, centreRelevant: q.relevant.includes(centre), doors, missed }
}

// Over every frozen query, for each system: how many relevant sources fell
// outside the top five, and how many of those stand next door to result one.
const TALLY = (['baseline', 'structured'] as const).map((system) => {
  const t = { system, missed: 0, nextDoor: 0, doors: 0, relevantDoors: 0 }
  for (const q of QUERIES) {
    const v = view(system, q)
    t.missed += v.missed.length
    t.nextDoor += v.doors.filter((d) => d.unasked).length
    t.doors += v.doors.length
    t.relevantDoors += v.doors.filter((d) => d.relevant).length
  }
  return t
})

const VW = 760
const VH = 600
const CX = VW / 2
const CY = VH / 2
const INNER = { rx: 180, ry: 120 }
const OUTER = { rx: 290, ry: 235 }

function place(i: number, n: number, ring: { rx: number; ry: number }) {
  const a = -Math.PI / 2 + (2 * Math.PI * i) / Math.max(n, 1)
  return { x: CX + ring.rx * Math.cos(a), y: CY + ring.ry * Math.sin(a) }
}

export default function Neighbour() {
  const id = useId()
  const [qid, setQid] = useState('q01')
  const [system, setSystem] = useState<System>('baseline')
  const q = QUERIES.find((x) => x.id === qid)!
  const v = useMemo(() => view(system, q), [system, q])
  const linked = v.doors.filter((d) => d.door === 'related')
  const shelf = v.doors.filter((d) => d.door === 'shelf')
  const centre = sourceById.get(v.centre)!
  const tally = TALLY.find((t) => t.system === system)!

  return (
    <div className="x02">
      <div className="x02__controls">
        <label htmlFor={`${id}-q`}>Frozen query</label>
        <select id={`${id}-q`} value={qid} onChange={(e) => setQid(e.target.value)} data-probe>
          {QUERIES.map((x) => (
            <option key={x.id} value={x.id}>
              {x.query}
            </option>
          ))}
        </select>
        <fieldset>
          <legend>Searched with</legend>
          {(['baseline', 'structured'] as const).map((s) => (
            <label key={s}>
              <input type="radio" name={`${id}-sys`} checked={system === s} onChange={() => setSystem(s)} /> {SYSTEM_LABEL[s]}
            </label>
          ))}
        </fieldset>
      </div>

      <div className="x02__plan">
        <svg viewBox={`0 0 ${VW} ${VH}`} role="img" aria-labelledby={`${id}-cap`} className="x02__svg">
          <ellipse cx={CX} cy={CY} {...INNER} className="x02__ring" />
          <ellipse cx={CX} cy={CY} {...OUTER} className="x02__ring x02__ring--outer" />
          {[...linked.map((d, i) => ({ d, p: place(i, linked.length, INNER) })), ...shelf.map((d, i) => ({ d, p: place(i + 0.5, shelf.length, OUTER) }))].map(
            ({ d, p }) => (
              <g key={d.id} className={`x02__node${d.relevant ? ' x02__node--rel' : ''}${d.unasked ? ' x02__node--unasked' : ''}`}>
                <line x1={CX} y1={CY} x2={p.x} y2={p.y} className={d.door === 'related' ? 'x02__edge' : 'x02__edge x02__edge--shelf'} />
                <circle cx={p.x} cy={p.y} r={d.unasked ? 13 : 8} />
                {d.unasked && (
                  <text x={p.x} y={p.y + 5} textAnchor="middle" className="x02__star">
                    ★
                  </text>
                )}
                <text x={p.x} y={p.y + (p.y < CY ? -18 : 28)} textAnchor="middle" className="x02__label">
                  {shortName(sourceById.get(d.id)!, 20)}
                </text>
              </g>
            ),
          )}
          <circle cx={CX} cy={CY} r={34} className={`x02__centre${v.centreRelevant ? ' x02__node--rel' : ''}`} />
          <text x={CX} y={CY + 5} textAnchor="middle" className="x02__label x02__label--centre">
            result 1
          </text>
        </svg>
        <p id={`${id}-cap`} className="x02__cap">
          Centre: <a href={centre.url}>{shortName(centre, 60)}</a>
          {v.centreRelevant ? ' (labelled relevant)' : ' (not labelled relevant)'}. Inner ring: linked by a{' '}
          <code>related</code> field. Outer ring: shares two or more controlled terms. Filled: labelled relevant. Star:
          labelled relevant and missing from the search’s top {TOP}.
        </p>
      </div>

      <div className="x02__list" data-observe>
        <p className="x02__verdict">
          {v.missed.length === 0
            ? `For “${q.query}”, the ${SYSTEM_LABEL[system]} already shows every relevant source in its top ${TOP}. The neighbours add nothing you lacked.`
            : `For “${q.query}”, the ${SYSTEM_LABEL[system]} leaves ${v.missed.length} relevant source${v.missed.length === 1 ? '' : 's'} out of its top ${TOP}; ${v.doors.filter((d) => d.unasked).length} of them stand next door to result 1, among ${v.doors.length} neighbours.`}
        </p>
        <ul>
          {v.doors.map((d) => (
            <li key={d.id} className={d.unasked ? 'x02__row x02__row--unasked' : 'x02__row'}>
              <span className="x02__mark" aria-hidden="true">
                {d.unasked ? '★' : d.relevant ? '●' : '○'}
              </span>
              <span>
                {shortName(sourceById.get(d.id)!, 60)}
                <span className="x02__why">
                  {d.door === 'related' ? `related: ${d.why}` : `shares ${d.why}`} · search rank {d.rank ?? 'none'}
                  {d.unasked ? ' · relevant, not asked for' : d.relevant ? ' · relevant' : ''}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="lab-out x02__tally">
        All 27 queries, {SYSTEM_LABEL[system]}: {tally.missed} relevant sources fall outside the top {TOP}; {tally.nextDoor}{' '}
        of them are next door to result 1. Opening every door means {tally.doors} neighbours, of which {tally.relevantDoors}{' '}
        are labelled relevant.
      </p>
    </div>
  )
}
