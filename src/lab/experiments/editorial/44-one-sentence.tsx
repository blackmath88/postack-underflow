import { useState } from 'react'
import { artifact } from '../../../lib/four-words-data'
import { search, tokenize } from '../../../lib/retrieval'

// 44 · The One-Sentence Experiment. The whole mechanism of the Disputed
// Neighbour in one sentence: its words are the controls. Turn query words on
// and off, switch between the two frozen indexes, and the sentence rewrites
// its own ending from the ranking: where the vite#8073 report lands, and which
// of your words reached it only through words the record writer added. Ranks
// are computed live with the shared retrieval code over the frozen v1 indexes.
// This demonstrates a mechanism; it is not an evaluation.

const TARGET = 'vite-issue-8073-base-mime'
const WORDS = ['vite', 'blank', 'page', 'js', 'file', '404', 'github', 'pages'] as const
const START = new Set<string>(['vite', 'blank', 'page', 'github', 'pages'])
type Which = 'structured' | 'baseline'

const FIELD: Record<string, string> = {
  problem: 'problem statement',
  aliases: 'alternative phrasings',
  symptoms: 'symptoms',
  terms: 'controlled terms',
  context: 'context',
  solution: 'solution',
}

const inSource = (term: string) => Boolean(artifact.indexes.baseline.fields.text?.postings[term]?.[TARGET])
const ordinal = (n: number) => (n === 1 ? 'first' : n === 2 ? 'second' : n === 3 ? 'third' : `at rank ${n}`)
const list = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`)

function read(which: Which, on: Set<string>) {
  const query = WORDS.filter((w) => on.has(w)).join(' ')
  const res = search(artifact.indexes[which], query)
  const ix = res.hits.findIndex((h) => h.id === TARGET)
  const hit = res.hits[ix]
  // Words that reached the report only through fields somebody wrote for it.
  const supplied = hit ? hit.matches.filter((m) => !inSource(m.term)) : []
  const strongest = hit?.matches[0]
  return { query, rank: ix + 1, of: artifact.indexes[which].docIds.length, hit, supplied, strongest, first: res.hits[0]?.id }
}

export default function OneSentence() {
  const [on, setOn] = useState<Set<string>>(START)
  const [which, setWhich] = useState<Which>('structured')
  const r = read(which, on)

  const toggle = (w: string) =>
    setOn((s) => {
      const next = new Set(s)
      if (next.has(w)) next.delete(w)
      else next.add(w)
      return next
    })

  const tokens = new Set(tokenize(r.query))

  return (
    <div className="x44">
      <p className="x44__sentence">
        Searching{' '}
        <button type="button" className="x44__ctl x44__ctl--index" onClick={() => setWhich((w) => (w === 'structured' ? 'baseline' : 'structured'))}>
          {which === 'structured' ? 'the written descriptions' : 'the raw text of the sources'}
        </button>{' '}
        for “
        {WORDS.map((w, i) => (
          <span key={w}>
            <button
              type="button"
              className="x44__ctl x44__word"
              aria-pressed={on.has(w)}
              onClick={() => toggle(w)}
              data-probe={w === 'blank' ? 'click' : undefined}
            >
              {w}
            </button>
            {i < WORDS.length - 1 ? ' ' : ''}
          </span>
        ))}
        ”{' '}
        <span className="x44__ending" data-observe aria-live="polite">
          {tokens.size === 0 ? (
            <>finds nothing, because there is nothing to look for.</>
          ) : !r.hit ? (
            <>
              never reaches the vite#8073 report: none of these words is in {which === 'structured' ? 'its description' : 'its text'}.
            </>
          ) : (
            <>
              puts the vite#8073 report <strong>{ordinal(r.rank)}</strong> of {r.of}
              {r.rank > 1 && r.first ? <>, behind {r.first}</> : null}; its strongest word is <em>{r.strongest!.term}</em>
              {which === 'structured' && r.supplied.length > 0 ? (
                <>
                  , and <em>{list(r.supplied.map((m) => m.term))}</em> {r.supplied.length === 1 ? 'reaches' : 'reach'} it only
                  through its {list([...new Set(r.supplied.flatMap((m) => Object.keys(m.fields)))].map((f) => FIELD[f] ?? f))}, which
                  somebody wrote: the report itself never uses {r.supplied.length === 1 ? 'that word' : 'those words'}.
                </>
              ) : which === 'structured' ? (
                <>, and every matching word also occurs in the report itself.</>
              ) : (
                <>, matched in the report’s own words.</>
              )}
            </>
          )}
        </span>
      </p>

      <details className="x44__workings">
        <summary>The working behind the sentence</summary>
        {r.hit ? (
          <div className="x44__scroll" data-scroll>
          <table>
            <caption>Each word’s share of the report’s score, {which === 'structured' ? 'description index' : 'raw-text index'}</caption>
            <thead>
              <tr>
                <th scope="col">Word</th>
                <th scope="col">Score</th>
                <th scope="col">Found in</th>
                <th scope="col">In the report?</th>
              </tr>
            </thead>
            <tbody>
              {r.hit.matches.map((m) => (
                <tr key={m.term}>
                  <td>{m.term}</td>
                  <td>{m.contribution.toFixed(2)}</td>
                  <td>{Object.keys(m.fields).map((f) => FIELD[f] ?? 'text').join(', ')}</td>
                  <td>{inSource(m.term) ? 'yes' : 'no'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : (
          <p>No word matched the report.</p>
        )}
      </details>
    </div>
  )
}
