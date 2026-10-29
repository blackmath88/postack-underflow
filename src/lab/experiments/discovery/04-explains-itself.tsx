import { useId, useMemo, useRef, useState } from 'react'
import queriesFile from '../../../../corpus/queries.json'
import { artifact, sourceById } from '../../../lib/four-words-data'
import { search } from '../../../lib/retrieval'
import { allEqual, byField, changedFirsts, firstResults, withWeights, type Weights } from './04-weights'
import { shortName } from './logic'

// 04 · A Search That Explains Itself. A mixing desk over the frozen v1
// problem-oriented index: one fader per record field, and above them a meter
// of 27 lamps, one per frozen query, that lights when that query's first
// result differs from the frozen weights' first result. Moving a fader
// changes only the BM25F field weight; the postings, lengths and queries stay
// as frozen. This is a demonstration of the mechanism, not an evaluation: the
// labelled queries are the test set, so no score against them is ever shown.

const QUERIES = queriesFile.queries as Array<{ id: string; query: string }>
const TEXTS = QUERIES.map((q) => q.query)
const FROZEN = artifact.indexes.structured
const FIELDS = Object.keys(FROZEN.weights)
const FROZEN_TOPS = firstResults(FROZEN, TEXTS)
const MAX = 6
const SHOWN = 6

const same = (a: Weights, b: Weights) => FIELDS.every((f) => a[f] === b[f])

export default function ExplainsItself() {
  const id = useId()
  const [weights, setWeights] = useState<Weights>({ ...FROZEN.weights })
  const [query, setQuery] = useState(QUERIES[0]!.query)
  const inspect = useRef<HTMLHeadingElement>(null)

  const changed = useMemo(() => changedFirsts(FROZEN, weights, TEXTS, FROZEN_TOPS), [weights])
  const index = useMemo(() => withWeights(FROZEN, weights), [weights])
  const result = useMemo(() => search(index, query), [index, query])
  const frozenRanks = useMemo(() => search(FROZEN, query).hits.map((h) => h.id), [query])
  const isFrozen = same(weights, FROZEN.weights)
  const isEqual = same(weights, allEqual(FROZEN))
  const top = result.hits.slice(0, SHOWN)
  const max = Math.max(...top.map((h) => h.score), 0.0001)

  const reading = isFrozen
    ? 'Frozen weights. Every lamp is dark: nothing has moved yet.'
    : `${isEqual ? 'Every field weighted 1. ' : ''}${changed.length} of 27 first results changed.${
        changed.length === 0 ? ' The ranking held.' : changed.length === 1 ? ' One lamp out of 27.' : ''
      }`

  const show = (q: string) => {
    setQuery(q)
    inspect.current?.focus()
  }

  return (
    <div className="x04">
      <p className="x04__banner">
        <strong>Demonstration over frozen data, not an evaluation.</strong> No fader setting here is a better index; the
        labelled queries are the test set, so this desk never scores against them.
      </p>

      <div className="x04__console">
        <div className="x04__meter" data-observe>
          <p className="x04__dare">
            The weights were set by hand before the v1 run. <strong>Pull them anywhere</strong>, or flatten them all, and
            watch how many of the 27 frozen queries get a different first result.
          </p>
          <ol className="x04__lamps" role="img" aria-label={`${changed.length} of 27 lamps lit`}>
            {QUERIES.map((q, i) => {
              const on = changed.includes(i)
              return (
                <li key={q.id} className={on ? 'is-on' : undefined} title={`${q.id}: ${q.query}${on ? ' (first result changed)' : ''}`}>
                  <span className="x04__lamp" aria-hidden="true">
                    {on ? '●' : ''}
                  </span>
                  <span className="x04__qid">{q.id.slice(1)}</span>
                </li>
              )
            })}
          </ol>
          <p className="x04__reading" role="status">
            <span className="x04__count" aria-hidden="true">
              {changed.length}
              <span>/27</span>
            </span>
            <span>{reading}</span>
          </p>
          {changed.length > 0 && (
            <p className="x04__which">
              Changed:{' '}
              {changed.map((i, k) => (
                <span key={QUERIES[i]!.id}>
                  {k > 0 && ', '}
                  <button type="button" className="x04__link" onClick={() => show(QUERIES[i]!.query)}>
                    {QUERIES[i]!.id} “{QUERIES[i]!.query}”
                  </button>
                </span>
              ))}
            </p>
          )}
        </div>

        <div className="x04__desk" role="group" aria-label="Field weights">
          <div className="x04__scale" aria-hidden="true">
            {[6, 4, 2, 0].map((v) => (
              <span key={v}>{v}</span>
            ))}
          </div>
          {FIELDS.map((f, i) => (
            <div key={f} className={`x04__ch x04__ch--${f}`}>
              <output className="x04__val" htmlFor={`${id}-${f}`}>
                {weights[f]}
              </output>
              <span className="x04__track">
                <input
                  id={`${id}-${f}`}
                  type="range"
                  min={0}
                  max={MAX}
                  step={0.5}
                  value={weights[f]}
                  aria-label={`${f} weight`}
                  aria-valuetext={`${weights[f]}, frozen ${FROZEN.weights[f]}`}
                  onChange={(e) => setWeights({ ...weights, [f]: Number(e.target.value) })}
                  data-probe={i === 0 ? 'key:ArrowUp' : undefined}
                />
                <span className="x04__notch" style={{ bottom: `${(100 * FROZEN.weights[f]!) / MAX}%` }} aria-hidden="true" />
              </span>
              <label htmlFor={`${id}-${f}`} className="x04__name">
                {f}
              </label>
              <span className="x04__frozen">◂ frozen {FROZEN.weights[f]}</span>
            </div>
          ))}
          <div className="x04__presets">
            <button type="button" className="x04__key x04__key--main" aria-pressed={isEqual} onClick={() => setWeights(allEqual(FROZEN))}>
              All equal
            </button>
            <button type="button" className="x04__key" disabled={isFrozen} onClick={() => setWeights({ ...FROZEN.weights })}>
              Back to frozen
            </button>
          </div>
        </div>
      </div>

      <section className="x04__inspect" aria-labelledby={`${id}-inspect`}>
        <h2 id={`${id}-inspect`} className="x04__h" tabIndex={-1} ref={inspect}>
          Why it holds: one query, scored by field
        </h2>
        <div className="x04__query">
          <label htmlFor={`${id}-q`}>Query</label>
          <input id={`${id}-q`} value={query} onChange={(e) => setQuery(e.target.value)} spellCheck={false} />
          <select aria-label="Pick a frozen query" value="" onChange={(e) => e.target.value && setQuery(e.target.value)}>
            <option value="">or pick one of the 27 frozen queries…</option>
            {QUERIES.map((q) => (
              <option key={q.id} value={q.query}>
                {q.id} {q.query}
              </option>
            ))}
          </select>
        </div>
        <ol className="x04__ranks" aria-label="Ranking with these weights">
          {top.length === 0 && <li className="x04__none">No record shares a word with this query.</li>}
          {top.map((h, i) => {
            const parts = byField(index, h.id, h.matches)
            const was = frozenRanks.indexOf(h.id) + 1
            const move = was === 0 ? 'new' : was === i + 1 ? '=' : was > i + 1 ? `↑${was - (i + 1)}` : `↓${i + 1 - was}`
            return (
              <li key={h.id} className="x04__hit">
                <span className="x04__rank">{i + 1}</span>
                <span className="x04__move" title={was ? `rank ${was} with frozen weights` : 'not ranked with frozen weights'}>
                  {move}
                </span>
                <span className="x04__title">{shortName(sourceById.get(h.id)!, 52)}</span>
                <span className="x04__bar" aria-hidden="true">
                  {FIELDS.filter((f) => parts[f]).map((f) => (
                    <span key={f} className={`x04__seg x04__seg--${f}`} style={{ width: `${(100 * parts[f]!) / max}%` }} />
                  ))}
                </span>
                <span className="x04__why">
                  {h.score.toFixed(2)} ={' '}
                  {FIELDS.filter((f) => parts[f])
                    .map((f) => `${f} ${parts[f]!.toFixed(2)}`)
                    .join(' + ')}
                  {' · words '}
                  {h.matches.map((m) => m.term).join(', ')}
                </span>
              </li>
            )
          })}
        </ol>
        {result.unknownTerms.length > 0 && (
          <p className="x04__unknown">No record contains: {result.unknownTerms.join(', ')}. No weight can change that.</p>
        )}
        <p className="x04__note">
          The words a record shares with the query decide whether it is in the list at all; the weights only scale them.
          Bars split each score by field in proportion to that field’s share of the weighted term frequency, our choice of
          attribution. Arrows compare with the frozen weights.
        </p>
      </section>
    </div>
  )
}
