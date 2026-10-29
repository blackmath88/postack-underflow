import { useId, useMemo, useState } from 'react'
import { artifact, sourceById } from '../../../lib/four-words-data'
import { adjacentPairs, CATALOGUES, kendall, order, shortName } from './logic'

// 08 · Multiple Catalogues. The same 30 frozen v1 sources in four catalogues
// at once, each a defensible order made from the data: by subject (first
// controlled term), by publisher (repository), by evidence (as the record
// grades it), and by length (tokens in the pinned source text). Lines join
// each source's four positions. Pick one source to see who stands beside it
// in each catalogue, and whether any neighbour survives the change of order.

const SOURCES = new Map(artifact.sources.map((s) => [s.id, s]))
const LENGTHS = artifact.indexes.baseline.fields.text!.lengths
const ORDERS = CATALOGUES.map((c) => order(artifact.records, SOURCES, LENGTHS, c))

const PAIRS = ORDERS.map(adjacentPairs)
const PAIR_COUNT = new Map<string, number>()
for (const set of PAIRS) for (const p of set) PAIR_COUNT.set(p, (PAIR_COUNT.get(p) ?? 0) + 1)
const KEPT = [1, 2, 3, 4].map((k) => [...PAIR_COUNT.values()].filter((v) => v === k).length)
const TAUS = CATALOGUES.flatMap((a, i) => CATALOGUES.slice(i + 1).map((b, j) => ({ a: a.name, b: b.name, tau: kendall(ORDERS[i]!, ORDERS[i + 1 + j]!) })))

const ROW = 19
const TOPPAD = 34
const COLW = 200
const LABELW = 180
const VW = LABELW * 2 + COLW * (CATALOGUES.length - 1)
const VH = TOPPAD + ROW * ORDERS[0]!.length + 8
const colX = (c: number) => LABELW + c * COLW

export default function Catalogues() {
  const id = useId()
  const [picked, setPicked] = useState('vite-issue-9119-underscore-chunk')
  const ids = ORDERS[0]!

  const around = useMemo(
    () =>
      ORDERS.map((o) => {
        const i = o.indexOf(picked)
        return { pos: i + 1, sides: [o[i - 1], o[i + 1]].filter((x): x is string => !!x) }
      }),
    [picked],
  )
  const counts = new Map<string, number>()
  for (const a of around) for (const s of a.sides) counts.set(s, (counts.get(s) ?? 0) + 1)
  const recurring = [...counts].filter(([, n]) => n > 1)

  return (
    <div className="x08">
      <div className="x08__pick">
        <label htmlFor={`${id}-p`}>Follow one source</label>
        <select id={`${id}-p`} value={picked} onChange={(e) => setPicked(e.target.value)} data-probe>
          {ids.map((s) => (
            <option key={s} value={s}>
              {shortName(sourceById.get(s)!, 60)}
            </option>
          ))}
        </select>
      </div>

      <div className="x08__wrap" data-scroll tabIndex={0} aria-label="Four catalogues side by side; scrolls sideways on narrow screens">
        <svg viewBox={`0 0 ${VW} ${VH}`} className="x08__svg" role="img" aria-label="The same sources in four orders, with lines joining each source’s positions">
          {CATALOGUES.map((c, ci) => (
            <text key={c.id} x={colX(ci)} y={16} textAnchor="middle" className="x08__head">
              {c.name}
            </text>
          ))}
          {ids.map((s) => {
            const ys = ORDERS.map((o) => TOPPAD + ROW * o.indexOf(s))
            const on = s === picked
            return (
              <g key={s} className={on ? 'x08__line x08__line--on' : 'x08__line'}>
                <polyline points={ys.map((y, ci) => `${colX(ci)},${y}`).join(' ')} />
              </g>
            )
          })}
          {ORDERS.map((o, ci) =>
            o.map((s, i) => {
              const y = TOPPAD + ROW * i
              const on = s === picked
              const beside = around[ci]!.sides.includes(s)
              return (
                <g key={`${ci}-${s}`} className={`x08__dot${on ? ' x08__dot--on' : ''}${beside ? ' x08__dot--beside' : ''}`} onClick={() => setPicked(s)}>
                  <circle cx={colX(ci)} cy={y} r={on ? 6 : 3.5} />
                  {(ci === 0 || ci === CATALOGUES.length - 1 || on || beside) && (
                    <text x={colX(ci) + (ci === CATALOGUES.length - 1 ? 10 : -10)} y={y + 4} textAnchor={ci === CATALOGUES.length - 1 ? 'start' : 'end'}>
                      {shortName(sourceById.get(s)!, 22)}
                    </text>
                  )}
                </g>
              )
            }),
          )}
        </svg>
      </div>

      <section className="x08__read" data-observe aria-live="polite">
        <table className="x08__table">
          <caption>Who stands beside {shortName(sourceById.get(picked)!, 60)}</caption>
          <thead>
            <tr>
              <th scope="col">Catalogue</th>
              <th scope="col">Place</th>
              <th scope="col">Neighbours</th>
            </tr>
          </thead>
          <tbody>
            {CATALOGUES.map((c, ci) => (
              <tr key={c.id}>
                <th scope="row">
                  {c.name}
                  <span className="x08__rule">{c.rule}</span>
                </th>
                <td>{around[ci]!.pos}</td>
                <td>
                  {around[ci]!.sides.map((s) => (
                    <span key={s} className={counts.get(s)! > 1 ? 'x08__nb x08__nb--again' : 'x08__nb'}>
                      {shortName(sourceById.get(s)!, 40)}
                      {counts.get(s)! > 1 && ` (beside it in ${counts.get(s)})`}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          {recurring.length === 0
            ? 'No neighbour stands beside it in more than one catalogue. Each order gives it a different street.'
            : `${recurring.length} neighbour${recurring.length === 1 ? '' : 's'} recur across catalogues; the rest change with the order.`}
        </p>
      </section>

      <p className="lab-out x08__all">
        All 30: of the side-by-side pairs these four catalogues make, {KEPT[0]} occur in one catalogue only, {KEPT[1]} in
        two, {KEPT[2]} in three and {KEPT[3]} in all four. Rank agreement (Kendall’s τ) between catalogues:{' '}
        {TAUS.map((t) => `${t.a}–${t.b} ${t.tau.toFixed(2)}`).join(', ')}.
      </p>
    </div>
  )
}
