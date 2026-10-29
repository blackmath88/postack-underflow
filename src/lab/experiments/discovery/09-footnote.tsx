import { useMemo, useState } from 'react'
import { artifact, recordBySource, sourceById } from '../../../lib/four-words-data'
import { shortName } from './logic'

// 09 · Follow the Footnote. Each frozen v1 record printed as a short page:
// its problem and fix, then footnotes made from its `related` field, in the
// record writer's own notes. You read by following footnotes, never by
// searching. A second switch adds the citation-index move: also listing the
// records that cite this one. A trail keeps every step. The pilot counts
// what footnotes alone can reach, and which records no footnote leads to.

const RECORDS = artifact.records
const OUT = new Map(RECORDS.map((r) => [r.sourceId, r.related.map((x) => x.sourceId)]))
const CITED_BY = new Map<string, Array<{ sourceId: string; relation: string; note: string }>>()
for (const r of RECORDS)
  for (const x of r.related) CITED_BY.set(x.sourceId, [...(CITED_BY.get(x.sourceId) ?? []), { sourceId: r.sourceId, relation: x.relation, note: x.note }])

function reach(start: string, backwards: boolean) {
  const seen = new Set([start])
  const stack = [start]
  while (stack.length) {
    const c = stack.pop()!
    const next = [...(OUT.get(c) ?? []), ...(backwards ? (CITED_BY.get(c) ?? []).map((x) => x.sourceId) : [])]
    for (const n of next)
      if (!seen.has(n)) {
        seen.add(n)
        stack.push(n)
      }
  }
  return seen
}

const UNCITED = RECORDS.filter((r) => !CITED_BY.has(r.sourceId)).map((r) => r.sourceId)
const FORWARD = RECORDS.map((r) => reach(r.sourceId, false).size)
const BOTH = RECORDS.map((r) => reach(r.sourceId, true).size)
const SUP = ['¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹']

export default function Footnote() {
  const [trail, setTrail] = useState<string[]>(['mdn-base-element'])
  const [backwards, setBackwards] = useState(false)
  const here = trail[trail.length - 1]!
  const r = recordBySource.get(here)!
  const s = sourceById.get(here)!
  const visited = new Set(trail)
  const reachable = useMemo(() => reach(trail[0]!, backwards), [trail, backwards])
  const citedBy = CITED_BY.get(here) ?? []

  const go = (to: string) => setTrail([...trail, to])
  const back = (i: number) => setTrail(trail.slice(0, i + 1))

  return (
    <div className="x09">
      <div className="x09__top">
        <label className="x09__start">
          Start from{' '}
          <select value={trail[0]} onChange={(e) => setTrail([e.target.value])}>
            {RECORDS.map((x) => (
              <option key={x.sourceId} value={x.sourceId}>
                {shortName(sourceById.get(x.sourceId)!, 56)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <input type="checkbox" checked={backwards} onChange={(e) => setBackwards(e.target.checked)} /> also show who cites this page
        </label>
      </div>

      <nav aria-label="Your trail" className="x09__trail">
        <ol>
          {trail.map((t, i) => (
            <li key={`${t}-${i}`}>
              {i === trail.length - 1 ? (
                <span aria-current="page">{shortName(sourceById.get(t)!, 28)}</span>
              ) : (
                <button type="button" className="lab-linkbutton" onClick={() => back(i)}>
                  {shortName(sourceById.get(t)!, 28)}
                </button>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <article className="x09__page" data-observe aria-live="polite">
        <p className="x09__kicker">
          {s.repo} · {s.kind} · page {trail.length}
        </p>
        <h3 className="x09__title">{s.title.replace(/[`]/g, '')}</h3>
        <p className="x09__body">
          {r.problem}
          {r.related.map((_, i) => (
            <sup key={i}>{SUP[i]}</sup>
          ))}
        </p>
        <p className="x09__body x09__body--fix">{r.solution}</p>

        <ol className="x09__notes" aria-label="Footnotes">
          {r.related.length === 0 && <li>This record has no footnotes.</li>}
          {r.related.map((x, i) => (
            <li key={x.sourceId}>
              <span className="x09__sup">{SUP[i]}</span>
              <span>
                <em>{x.relation}</em> {x.note}{' '}
                <button type="button" className="lab-btn x09__follow" onClick={() => go(x.sourceId)} data-probe={i === 0 ? 'click' : undefined}>
                  {visited.has(x.sourceId) ? 'back to ' : 'follow to '}
                  {shortName(sourceById.get(x.sourceId)!, 36)}
                </button>
              </span>
            </li>
          ))}
        </ol>

        {backwards && (
          <div className="x09__citedby">
            <p className="x09__kicker">Cited by</p>
            {citedBy.length === 0 ? (
              <p>No record cites this page. Only a search, or a starting point, brings anyone here.</p>
            ) : (
              <ul>
                {citedBy.map((c) => (
                  <li key={c.sourceId}>
                    <button type="button" className="lab-linkbutton" onClick={() => go(c.sourceId)}>
                      {shortName(sourceById.get(c.sourceId)!, 40)}
                    </button>{' '}
                    calls it <em>{c.relation}</em>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <p className="lab-out">
          Read {visited.size} of {RECORDS.length}. From where you started, {backwards ? 'footnotes and citing records' : 'footnotes alone'} can
          reach {reachable.size} of {RECORDS.length}.
        </p>
      </article>

      <p className="lab-out x09__all">
        Over all 30 starting pages: footnotes alone reach between {Math.min(...FORWARD)} and {Math.max(...FORWARD)} records. With citing
        records too, every start reaches {Math.min(...BOTH) === Math.max(...BOTH) ? Math.min(...BOTH) : `${Math.min(...BOTH)}–${Math.max(...BOTH)}`}.{' '}
        {UNCITED.length} records are cited by no other: {UNCITED.map((u) => shortName(sourceById.get(u)!, 34)).join('; ')}.
      </p>
    </div>
  )
}
