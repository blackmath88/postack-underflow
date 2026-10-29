import { useId, useMemo, useState } from 'react'
import queriesFile from '../../../../corpus/queries.json'
import { artifact, sourceById } from '../../../lib/four-words-data'
import { BM25_B, search, type Index } from '../../../lib/retrieval'
import { shortName } from './logic'

// 04 · A Search That Explains Itself. A mixing desk over the frozen v1
// problem-oriented index: one fader per record field. Moving a fader changes
// only the BM25F field weight; the postings, the lengths and the query stay
// as frozen. Each result's score is split back into the fields it came from.
// This is a demonstration of the mechanism, not an evaluation: the labelled
// queries are the test set, so no score against them is ever shown.

const QUERIES = queriesFile.queries as Array<{ id: string; query: string }>
const FROZEN = artifact.indexes.structured
const FIELDS = Object.keys(FROZEN.weights) as Array<keyof typeof FROZEN.weights & string>
const SHOWN = 8

type Weights = Record<string, number>

/**
 * Split one hit's score into fields. BM25F sums weighted, length-normalised
 * term frequencies before saturating them, so a term's contribution has no
 * exact per-field share; we divide it in proportion to each field's part of
 * the weighted sum. That proportional split is our choice, said so on screen.
 */
function byField(index: Index, id: string, matches: Array<{ contribution: number; fields: Record<string, number> }>) {
  const out: Record<string, number> = {}
  for (const m of matches) {
    const parts: Record<string, number> = {}
    let total = 0
    for (const [f, tf] of Object.entries(m.fields)) {
      const field = index.fields[f]!
      const norm = 1 - BM25_B + BM25_B * ((field.lengths[id] ?? 0) / (field.avgLength || 1))
      const part = ((index.weights[f] ?? 0) * tf) / norm
      parts[f] = part
      total += part
    }
    for (const [f, p] of Object.entries(parts)) out[f] = (out[f] ?? 0) + (total ? (m.contribution * p) / total : 0)
  }
  return out
}

const withWeights = (w: Weights): Index => ({ ...FROZEN, weights: w })
const frozenTop = QUERIES.map((q) => search(FROZEN, q.query).hits[0]?.id)

export default function ExplainsItself() {
  const id = useId()
  const [weights, setWeights] = useState<Weights>({ ...FROZEN.weights })
  const [query, setQuery] = useState('css missing after deploy')
  const index = useMemo(() => withWeights(weights), [weights])
  const result = useMemo(() => search(index, query), [index, query])
  const frozenRanks = useMemo(() => search(FROZEN, query).hits.map((h) => h.id), [query])
  const changedTops = useMemo(
    () => QUERIES.filter((q, i) => search(index, q.query).hits[0]?.id !== frozenTop[i]).length,
    [index],
  )
  const top = result.hits.slice(0, SHOWN)
  const max = Math.max(...top.map((h) => h.score), 0.0001)
  const isFrozen = FIELDS.every((f) => weights[f] === FROZEN.weights[f])

  return (
    <div className="x04">
      <p className="x04__banner">
        Demonstration over frozen data, not an evaluation. No fader setting here is a better index; the labelled queries
        are the test set, so this desk never scores against them.
      </p>

      <div className="x04__query">
        <label htmlFor={`${id}-q`}>Query</label>
        <input id={`${id}-q`} value={query} onChange={(e) => setQuery(e.target.value)} spellCheck={false} />
        <select aria-label="Pick a frozen query" value="" onChange={(e) => e.target.value && setQuery(e.target.value)}>
          <option value="">or pick one of the 27 frozen queries…</option>
          {QUERIES.map((q) => (
            <option key={q.id} value={q.query}>
              {q.query}
            </option>
          ))}
        </select>
      </div>

      <div className="x04__desk" role="group" aria-label="Field weights">
        {FIELDS.map((f, i) => (
          <div key={f} className={`x04__ch x04__ch--${f}`}>
            <output className="x04__val" htmlFor={`${id}-${f}`}>
              {weights[f]}
            </output>
            <input
              id={`${id}-${f}`}
              type="range"
              min={0}
              max={6}
              step={0.5}
              value={weights[f]}
              aria-label={`${f} weight`}
              onChange={(e) => setWeights({ ...weights, [f]: Number(e.target.value) })}
              data-probe={i === 0 ? 'key:ArrowUp' : undefined}
            />
            <label htmlFor={`${id}-${f}`} className="x04__name">
              {f}
            </label>
            <span className="x04__frozen">frozen {FROZEN.weights[f]}</span>
          </div>
        ))}
        <div className="x04__presets">
          <button type="button" className="lab-btn" disabled={isFrozen} onClick={() => setWeights({ ...FROZEN.weights })}>
            Frozen weights
          </button>
          <button type="button" className="lab-btn" onClick={() => setWeights(Object.fromEntries(FIELDS.map((f) => [f, 1])))}>
            All equal
          </button>
        </div>
      </div>

      <div data-observe>
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
        <p className="lab-out">
          {isFrozen
            ? 'These are the frozen v1 weights.'
            : `With these weights, ${changedTops} of the 27 frozen queries get a different first result than with the frozen weights.`}
        </p>
      </div>
      <p className="x04__note">
        Bars split each score by field in proportion to that field’s share of the weighted term frequency, our choice of
        attribution. Arrows compare with the frozen weights.
      </p>
    </div>
  )
}
