import { useState } from 'react'
import { CARDS, QUESTIONS, type Answer, type KeyCard } from '../../data/classification-key'
import { shortName } from './words'

// 12 · The Sorting Key. The essay's Disputed Neighbour separates two records
// with one question about the failing URL. This pilot asks whether that
// question generalises: seven frozen records share the controlled term
// asset-404, and the visitor builds a dichotomous key from five questions to
// sort them by fix. A group stops splitting as soon as one fix covers it.
// Answers are our reading of each record (src/lab/data/classification-key.ts).

const ANSWERS: Answer[] = ['yes', 'no', 'not stated']
const QUESTION = new Map(QUESTIONS.map((q) => [q.id, q]))

const fixesOf = (cards: KeyCard[]) => [...new Set(cards.map((c) => c.fix))]

/** Leaves of the key for the questions asked, in order. */
function leaves(cards: KeyCard[], asked: string[], depth = 0): KeyCard[][] {
  if (fixesOf(cards).length <= 1 || depth >= asked.length) return [cards]
  const q = asked[depth]!
  return ANSWERS.flatMap((a) => {
    const sub = cards.filter((c) => c.answers[q] === a)
    return sub.length ? leaves(sub, asked, depth + 1) : []
  })
}

const sorted = (asked: string[]) => leaves(CARDS, asked).every((l) => fixesOf(l).length === 1)

// The smallest sets of questions that sort all seven, found by trying every
// subset. Order does not matter for whether a set sorts them.
const SMALLEST = (() => {
  const ids = QUESTIONS.map((q) => q.id)
  const sets: string[][] = []
  for (let mask = 1; mask < 1 << ids.length; mask++) sets.push(ids.filter((_, i) => mask & (1 << i)))
  const working = sets.filter(sorted)
  const min = Math.min(...working.map((s) => s.length))
  return { size: min, sets: working.filter((s) => s.length === min) }
})()

function Branch({ cards, asked, depth, path }: { cards: KeyCard[]; asked: string[]; depth: number; path: string }) {
  const fixes = fixesOf(cards)
  if (fixes.length <= 1 || depth >= asked.length) {
    return (
      <div className={'x12__leaf' + (fixes.length === 1 ? ' is-sorted' : ' is-mixed')}>
        <p className="x12__verdict">{fixes.length === 1 ? `→ ${fixes[0]}` : `still mixed: ${fixes.join(' / ')}`}</p>
        <ul>
          {cards.map((c) => (
            <li key={c.sourceId}>
              {shortName(c.sourceId)} <span className="x12__fix">({c.fix})</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  const q = QUESTION.get(asked[depth]!)!
  return (
    <ol className="x12__couplet" aria-label={`${path}${q.ask}`}>
      {ANSWERS.map((a) => {
        const sub = cards.filter((c) => c.answers[q.id] === a)
        if (!sub.length) return null
        return (
          <li key={a}>
            <p className="x12__lead">
              <span className="x12__q">{q.ask}</span> <strong className={`x12__a x12__a--${a.replace(' ', '-')}`}>{a}</strong>
            </p>
            <Branch cards={sub} asked={asked} depth={depth + 1} path={`${path}${q.ask} ${a}; `} />
          </li>
        )
      })}
    </ol>
  )
}

export default function SortingKey() {
  const [asked, setAsked] = useState<string[]>([])
  const result = leaves(CARDS, asked)
  const mixed = result.filter((l) => fixesOf(l).length > 1)
  const blind = CARDS.filter((c) => asked.some((q) => c.answers[q] === 'not stated')).length

  const toggle = (id: string) => setAsked((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]))

  return (
    <div className="x12">
      <div className="x12__bench">
        <p className="x12__task">
          Seven records filed under <code>asset-404</code>. Three different fixes. Ask questions, in any order, until every
          group needs only one fix.
        </p>
        <ol className="x12__questions">
          {QUESTIONS.map((q) => {
            const at = asked.indexOf(q.id)
            return (
              <li key={q.id}>
                <button
                  type="button"
                  className="lab-btn"
                  aria-pressed={at > -1}
                  onClick={() => toggle(q.id)}
                  data-probe={q.id === 'url' ? 'click' : undefined}
                >
                  {at > -1 ? `${at + 1}. ` : ''}
                  {q.ask}
                </button>
                <span className="x12__why">{q.why}</span>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="x12__key" data-observe>
        <p className="x12__status" role="status">
          {asked.length === 0
            ? 'No question asked: all seven sit in one group, and three fixes compete.'
            : mixed.length === 0
              ? `Sorted with ${asked.length} ${asked.length === 1 ? 'question' : 'questions'}.`
              : `${mixed.length} ${mixed.length === 1 ? 'group is' : 'groups are'} still mixed after ${asked.length} ${asked.length === 1 ? 'question' : 'questions'}.`}{' '}
          {asked.length > 0 && `${blind} of 7 records cannot answer at least one of them: the record does not say.`}
        </p>
        <Branch cards={CARDS} asked={asked} depth={0} path="" />
      </div>

      <details className="x12__basis">
        <summary>What each answer rests on</summary>
        <div className="x12__scroll" data-scroll tabIndex={0} role="region" aria-label="Answers and their basis">
        <table>
          <thead>
            <tr>
              <th scope="col">Record</th>
              {QUESTIONS.map((q) => (
                <th key={q.id} scope="col">
                  {q.id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CARDS.map((c) => (
              <tr key={c.sourceId}>
                <th scope="row">{shortName(c.sourceId)}</th>
                {QUESTIONS.map((q) => (
                  <td key={q.id} title={c.basis[q.id] ?? 'The record does not say.'}>
                    {c.answers[q.id]}
                    <span className="x12__cite">{c.basis[q.id] ?? 'The record does not say.'}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </details>

      <p className="x12__smallest lab-out">
        smallest sorting sets: {SMALLEST.sets.map((s) => s.join(' + ')).join(' · ')} ({SMALLEST.size} questions) · the URL
        question alone {sorted(['url']) ? 'sorts them' : 'does not'}
      </p>
    </div>
  )
}
