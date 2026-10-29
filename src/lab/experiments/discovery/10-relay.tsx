import { useMemo, useState } from 'react'
import queriesFile from '../../../../corpus/queries.json'
import { artifact, recordBySource, sourceById } from '../../../lib/four-words-data'
import { search, tokenize } from '../../../lib/retrieval'
import { firstRelevant, harvest, shortName, swap } from './logic'

// 10 · The Four-Word Relay. Start from a frozen query whose first plain
// keyword result is not one the labeller marked relevant. That wrong result
// still hands you words: its record's problem sentence and controlled terms.
// Pick a slot, then pick a word to put in it, and search again. Each search
// is a leg of the relay. The goal: a labelled-relevant source at rank 1.
// Plain keyword search over the frozen v1 index; nothing is re-ranked.

const QUERIES = queriesFile.queries as Array<{ id: string; query: string; relevant: string[] }>
const INDEX = artifact.indexes.baseline
const SLOTS = 4

const topOf = (words: string[]) => search(INDEX, words.filter(Boolean).join(' ')).hits
const STARTS = QUERIES.filter((q) => {
  const top = topOf(tokenize(q.query))[0]
  return top && !q.relevant.includes(top.id)
})

// For every start: does any single replacement from the first result's words reach rank 1?
const TALLY = (() => {
  let rescued = 0
  let swaps = 0
  let good = 0
  for (const q of STARTS) {
    const words = tokenize(q.query)
    const pool = harvest(recordBySource.get(topOf(words)[0]!.id)!).filter((w) => !words.includes(w))
    let ok = false
    for (const w of pool)
      for (let i = 0; i < words.length; i++) {
        swaps++
        if (firstRelevant(INDEX, swap(words, i, w), q.relevant) === 1) {
          good++
          ok = true
        }
      }
    if (ok) rescued++
  }
  return { rescued, swaps, good }
})()

const pad = (w: string[]) => [...w, ...Array<string>(SLOTS).fill('')].slice(0, SLOTS)

export default function Relay() {
  const [qid, setQid] = useState(STARTS[0]!.id)
  const q = STARTS.find((x) => x.id === qid)!
  const [legs, setLegs] = useState<string[][]>([pad(tokenize(q.query))])
  const [slot, setSlot] = useState(0)
  const words = legs[legs.length - 1]!
  const hits = useMemo(() => topOf(words).slice(0, 3), [words])
  const top = hits[0]
  const pool = top ? harvest(recordBySource.get(top.id)!).filter((w) => !words.includes(w)) : []
  const rank = firstRelevant(INDEX, words.filter(Boolean), q.relevant)

  const start = (id: string) => {
    const next = STARTS.find((x) => x.id === id)!
    setQid(id)
    setLegs([pad(tokenize(next.query))])
    setSlot(0)
  }
  const place = (w: string) => setLegs([...legs, swap(words, slot, w)])

  return (
    <div className="x10">
      <label className="x10__start">
        Starting query, whose first result is wrong{' '}
        <select value={qid} onChange={(e) => start(e.target.value)}>
          {STARTS.map((x) => (
            <option key={x.id} value={x.id}>
              {x.query}
            </option>
          ))}
        </select>
      </label>

      <div className="x10__slots" role="group" aria-label="Your four words; choose the slot the next word goes into">
        {words.map((w, i) => (
          <button key={i} type="button" className="x10__slot" aria-pressed={slot === i} onClick={() => setSlot(i)}>
            <span className="x10__n">{i + 1}</span>
            <span className="x10__w">{w || '—'}</span>
          </button>
        ))}
      </div>

      <div className="x10__track" data-observe>
        <p className={rank === 1 ? 'x10__goal x10__goal--won' : 'x10__goal'}>
          Leg {legs.length}:{' '}
          {rank === 1
            ? `a labelled-relevant source is first. Reached in ${legs.length - 1} relay${legs.length - 1 === 1 ? '' : 's'}.`
            : rank
              ? `the first relevant source is at rank ${rank}.`
              : 'no relevant source is ranked at all.'}
        </p>
        <ol className="x10__hits">
          {hits.map((h) => (
            <li key={h.id}>
              {shortName(sourceById.get(h.id)!, 56)} {q.relevant.includes(h.id) ? <strong>· relevant</strong> : '· not labelled relevant'}
            </li>
          ))}
        </ol>
      </div>

      {top && rank !== 1 && (
        <div className="x10__pool">
          <p>
            Words handed over by result 1, <em>{shortName(sourceById.get(top.id)!, 50)}</em>. Each one goes into slot {slot + 1}:
          </p>
          <ul>
            {pool.map((w, i) => (
              <li key={w}>
                <button type="button" className="lab-btn x10__chip" onClick={() => place(w)} data-probe={i === 0 ? 'click' : undefined}>
                  {w}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ol className="x10__legs" aria-label="Every leg so far">
        {legs.map((l, i) => (
          <li key={i}>
            {i > 0 ? (
              <button type="button" className="lab-linkbutton" onClick={() => setLegs(legs.slice(0, i + 1))}>
                {l.filter(Boolean).join(' ')}
              </button>
            ) : (
              <span>{l.filter(Boolean).join(' ')}</span>
            )}
          </li>
        ))}
      </ol>

      <p className="lab-out x10__all">
        Of the {STARTS.length} frozen queries whose first plain result is wrong, {TALLY.rescued} can reach a relevant
        first result by replacing one word with a word from that wrong result. But only {TALLY.good} of the{' '}
        {TALLY.swaps} possible single replacements do it.
      </p>
    </div>
  )
}
