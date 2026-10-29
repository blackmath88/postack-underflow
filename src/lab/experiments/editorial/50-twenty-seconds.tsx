import { useEffect, useRef, useState } from 'react'
import { artifact } from '../../../lib/four-words-data'
import { tokenize } from '../../../lib/retrieval'
import results from '../../../../results/four-words-v1.json'
import queries from '../../../../corpus/queries.json'

// 50 · The Twenty-Second Explanation. One research finding, two forms: the
// essay's own paragraph, and a diagram computed from the frozen data. You
// choose one, a clock runs, you stop it when you think you have it, and you
// answer one question. The finding: in the queries the descriptions won, the
// winning record often matched a query word its source never uses. The
// diagram is derived from the frozen v1 results and indexes; the clock times
// one person in one tab and claims nothing about anyone else.

const LIMIT = 20
const CAP = 60

const per = (system: string, q: string) => results.perQuery.find((p) => p.system === system && p.query === q)!
const srcHas = (term: string, id: string) => Boolean(artifact.indexes.baseline.fields.text?.postings[term]?.[id])
const recHas = (term: string, id: string) =>
  Object.values(artifact.indexes.structured.fields).some((f) => Boolean(f.postings[term]?.[id]))

type Mark = 'both' | 'supplied' | 'neither'
const WINS = queries.queries
  .filter((q) => per('structured', q.id).reciprocalRank > per('baseline', q.id).reciprocalRank)
  .map((q) => {
    const win = per('structured', q.id).top3.find((id) => q.relevant.includes(id)) ?? ''
    const words = [...new Set(tokenize(q.query))].map((t) => ({
      t,
      mark: (srcHas(t, win) ? 'both' : recHas(t, win) ? 'supplied' : 'neither') as Mark,
    }))
    return { id: q.id, query: q.query, win, words, supplied: words.some((w) => w.mark === 'supplied') }
  })
const SUPPLIED = WINS.filter((w) => w.supplied).length

// 6 is the paragraph's count before it adds the tokenizer artefact.
const CHOICES = [...new Set([2, 6, SUPPLIED, WINS.length])].sort((a, b) => a - b)

type Form = 'paragraph' | 'diagram'
interface Attempt {
  form: Form
  seconds: number
  answer: number
  primed: boolean
}

export default function TwentySeconds() {
  const [form, setForm] = useState<Form | null>(null)
  const [started, setStarted] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [stopped, setStopped] = useState<number | null>(null)
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const timer = useRef<number | undefined>(undefined)

  const running = form !== null && stopped === null

  useEffect(() => {
    if (!running) return
    timer.current = window.setInterval(() => {
      const s = (performance.now() - started) / 1000
      setElapsed(s)
      if (s >= CAP) setStopped(CAP)
    }, 100)
    return () => window.clearInterval(timer.current)
  }, [running, started])

  const begin = (f: Form) => {
    if (running) return
    setForm(f)
    setStarted(performance.now())
    setElapsed(0)
    setStopped(null)
  }
  const stop = () => setStopped(elapsed)
  const answer = (n: number) => {
    if (form === null || stopped === null) return
    setAttempts((a) => [...a, { form, seconds: stopped, answer: n, primed: a.length > 0 }])
    setForm(null)
    setStopped(null)
    setElapsed(0)
  }

  const shown = stopped ?? elapsed
  const clock =
    form === null
      ? attempts.length === 0
        ? 'Clock not started.'
        : 'Clock reset. Try the other form, knowing you are no longer new to this finding.'
      : stopped === null
        ? `${shown.toFixed(1)} s, reading the ${form}.`
        : `Stopped at ${shown.toFixed(1)} s. Now answer the question.`

  return (
    <div className="x50">
      <div className="x50__start" role="group" aria-label="Choose a form and start the clock">
        <button type="button" className="lab-btn" onClick={() => begin('paragraph')} aria-disabled={running} data-probe="click">
          Start with the paragraph
        </button>
        <button type="button" className="lab-btn" onClick={() => begin('diagram')} aria-disabled={running}>
          Start with the diagram
        </button>
      </div>

      <div className="x50__clock" role="status" data-observe>
        <p>{clock}</p>
        <div className="x50__bar" aria-hidden="true">
          <span style={{ width: `${Math.min(100, (shown / LIMIT) * 100)}%` }} className={shown > LIMIT ? 'is-over' : undefined} />
        </div>
        <p className="x50__limit" aria-hidden="true">
          {LIMIT} s
        </p>
      </div>

      <div className="x50__stage">
        {form === null ? (
          <p className="x50__cover">The explanation appears when the clock starts.</p>
        ) : form === 'paragraph' ? (
          <div className="x50__paragraph">
            <p>
              Much of the advantage came from words the description writer added, and some of them the sources
              never said.
            </p>
            <p>
              The descriptions ranked a right answer higher on 10 queries and lower on 1. In six of those ten wins,
              plus one tokenizer artefact, the winning record matched a query word that never appears in its source:
              blank, underscore, refresh, found, large, shows.
            </p>
            <p className="x50__credit">The Impossible Index, and its margin note “Which words did the writer add?”</p>
          </div>
        ) : (
          <figure className="x50__diagram">
            <figcaption>
              The {WINS.length} queries the descriptions won. Each word of the query, checked against the winning record’s
              source.
            </figcaption>
            <ul className="x50__key">
              <li>
                <span className="x50__w is-both">word</span> in the source
              </li>
              <li>
                <span className="x50__w is-supplied">word</span> only in the description
              </li>
              <li>
                <span className="x50__w is-neither">word</span> in neither
              </li>
            </ul>
            <ol className="x50__rows">
              {WINS.map((w) => (
                <li key={w.id} className={w.supplied ? 'is-hit' : undefined}>
                  <span className="x50__flag">{w.supplied ? 'added word' : ''}</span>
                  {w.words.map((x) => (
                    <span key={x.t} className={`x50__w is-${x.mark}`}>
                      {x.t}
                      <span className="visually-hidden">
                        {x.mark === 'both' ? ' (in the source)' : x.mark === 'supplied' ? ' (only in the description)' : ' (in neither)'}
                      </span>
                    </span>
                  ))}
                </li>
              ))}
            </ol>
          </figure>
        )}
      </div>

      {running && (
        <button type="button" className="lab-btn" onClick={stop}>
          I have it: stop the clock
        </button>
      )}
      {form !== null && stopped !== null && (
        <fieldset className="x50__q">
          <legend>In how many of the {WINS.length} wins did the winning record match a query word its source never uses?</legend>
          {CHOICES.map((n) => (
            <button key={n} type="button" className="lab-btn" onClick={() => answer(n)}>
              {n}
            </button>
          ))}
        </fieldset>
      )}

      {attempts.length > 0 && (
        <table className="x50__log">
          <caption>This tab only. Nothing is stored or sent.</caption>
          <thead>
            <tr>
              <th scope="col">Form</th>
              <th scope="col">Time</th>
              <th scope="col">Answer</th>
              <th scope="col">Fresh?</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((a, i) => (
              <tr key={i}>
                <td>{a.form}</td>
                <td>{a.seconds.toFixed(1)} s</td>
                <td>
                  {a.answer}{' '}
                  {a.answer === SUPPLIED
                    ? '(matches the data)'
                    : a.answer === 6
                      ? `(the paragraph’s six; the data counts ${SUPPLIED}, with the tokenizer artefact)`
                      : `(the data says ${SUPPLIED})`}
                </td>
                <td>{a.primed ? 'no, already seen' : 'yes'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
