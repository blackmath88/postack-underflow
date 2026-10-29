import { useMemo, useState } from 'react'
import { artifact, sourceById } from '../../../lib/four-words-data'
import { narrow, nextQuestion, shortName, simulate, TERM_QUESTIONS, type Answer, type Knowing } from './logic'

// 01 · Four Words, No Words. Twenty questions instead of a query. The pilot
// asks yes/no questions about the frozen v1 records' controlled terms, always
// the one that splits what is left most evenly, and crosses records off a
// board of all 30. You type nothing. You choose which kinds of question you
// can answer: what you can see, what you know about your setup, or what you
// would only know once you had the fix. Reads the frozen records only.

const RECORDS = artifact.records

const KNOWING: Array<[Knowing, string]> = [
  ['see', 'what I can see on the broken site'],
  ['know', 'what I know about my setup'],
  ['fix', 'what I would only know once I had the fix'],
]

const KNOWING_TAG: Record<Knowing, string> = { see: 'you can see this', know: 'you know this', fix: 'you know this only with the answer' }

function summary(allowed: Set<Knowing>) {
  const runs = RECORDS.map((r) => simulate(RECORDS, r, allowed))
  return {
    alone: runs.filter((x) => x.left.length === 1).length,
    meanLeft: runs.reduce((s, x) => s + x.left.length, 0) / runs.length,
    maxLeft: Math.max(...runs.map((x) => x.left.length)),
    meanQ: runs.reduce((s, x) => s + x.questions, 0) / runs.length,
  }
}

export default function NoWords() {
  const [allowed, setAllowed] = useState<Set<Knowing>>(() => new Set<Knowing>(['see', 'know', 'fix']))
  const [answers, setAnswers] = useState<Array<[string, Answer]>>([])

  const remaining = useMemo(() => narrow(RECORDS, answers), [answers])
  const asked = new Set(answers.map(([t]) => t))
  const term = remaining.length > 1 ? nextQuestion(remaining, asked, allowed) : null
  const q = term ? TERM_QUESTIONS[term]! : null
  const left = new Set(remaining.map((r) => r.sourceId))
  const stats = useMemo(() => summary(allowed), [allowed])

  const toggle = (k: Knowing) => {
    const next = new Set(allowed)
    if (next.has(k)) next.delete(k)
    else next.add(k)
    setAllowed(next)
  }
  const answer = (a: Answer) => term && setAnswers([...answers, [term, a]])

  return (
    <div className="x01">
      <fieldset className="x01__can">
        <legend>Ask me only about</legend>
        {KNOWING.map(([k, label]) => (
          <label key={k}>
            <input type="checkbox" checked={allowed.has(k)} onChange={() => toggle(k)} /> {label}
          </label>
        ))}
      </fieldset>

      <div className="x01__desk">
        <section className="x01__card" aria-live="polite" data-observe>
          <p className="x01__count">
            <span className="x01__big">{remaining.length}</span> of {RECORDS.length} records still possible
            {answers.length > 0 && ` after ${answers.length} answer${answers.length === 1 ? '' : 's'}`}
          </p>
          {q && term ? (
            <>
              <p className="x01__q">{q.ask}</p>
              <p className="x01__meta">
                controlled term <code>{term}</code> · {KNOWING_TAG[q.knowing]} · held by{' '}
                {remaining.filter((r) => r.terms.includes(term)).length} of the {remaining.length}
              </p>
              <div className="x01__answers">
                <button type="button" className="lab-btn" onClick={() => answer('yes')} data-probe>
                  Yes
                </button>
                <button type="button" className="lab-btn" onClick={() => answer('no')}>
                  No
                </button>
                <button type="button" className="lab-btn" onClick={() => answer('unsure')}>
                  Not sure
                </button>
              </div>
            </>
          ) : remaining.length === 0 ? (
            <p className="x01__q">No record has that combination. One of the answers rules out everything the corpus holds.</p>
          ) : remaining.length === 1 ? (
            <Found id={remaining[0]!.sourceId} />
          ) : (
            <p className="x01__q">
              No question I may ask separates these {remaining.length}. With these kinds of question, the controlled
              vocabulary cannot tell them apart.
            </p>
          )}
          {answers.length > 0 && (
            <button type="button" className="lab-btn x01__restart" onClick={() => setAnswers([])}>
              Start again
            </button>
          )}
        </section>

        <ol className="x01__board" aria-label="All 30 records; crossed-off records are ruled out">
          {RECORDS.map((r) => {
            const s = sourceById.get(r.sourceId)!
            const on = left.has(r.sourceId)
            return (
              <li key={r.sourceId} className={on ? 'x01__tile' : 'x01__tile x01__tile--out'}>
                <span className="visually-hidden">{on ? 'possible: ' : 'ruled out: '}</span>
                {shortName(s, 34)}
              </li>
            )
          })}
        </ol>
      </div>

      {answers.length > 0 && (
        <ol className="x01__trail" aria-label="Your answers">
          {answers.map(([t, a]) => (
            <li key={t}>
              <code>{t}</code> {a === 'unsure' ? 'not sure' : a}
            </li>
          ))}
        </ol>
      )}

      <p className="x01__all lab-out">
        Answering truthfully for each of the 30 records in turn, with these kinds of question: {stats.alone} end on a
        single record; on average {stats.meanLeft.toFixed(1)} remain (at worst {stats.maxLeft}) after{' '}
        {stats.meanQ.toFixed(1)} questions.
      </p>
    </div>
  )
}

function Found({ id }: { id: string }) {
  const r = RECORDS.find((x) => x.sourceId === id)!
  const s = sourceById.get(id)!
  return (
    <div className="x01__found">
      <p className="x01__q">
        <a href={s.url}>{s.title}</a>
      </p>
      <p>{r.problem}</p>
      <p className="x01__fix">
        <strong>Fix, as the record states it:</strong> {r.solution}
      </p>
    </div>
  )
}
