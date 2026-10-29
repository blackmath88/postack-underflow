import { useId, useState } from 'react'
import { HISTORY } from '../../../data/research-history'
import { artifact, recordBySource } from '../../../lib/four-words-data'

// 53 · The Answer With a Past. The project's own answer to its first question
// (do structured records beat keyword search here?), followed through the
// real research history log, one layer at a time. Which log entries touch
// the answer, and how, is our reading of each entry's own `changed` text.
// Beside it: what the record format itself remembers of that past.

type State = 'standing' | 'revised' | 'added'
interface Statement {
  id: string
  text: string
  state: State
  note?: string
}

/** Our reading: how each history entry changes the answer. Keyed by title. */
const EFFECTS: Record<string, (s: Statement[]) => Statement[]> = {
  'Four Words: queries before records': () => [
    { id: 'won', text: 'On this corpus, structured records beat plain keyword search: better on 10 queries, worse on 1, tied on 16.', state: 'added' },
    { id: 'why', text: 'The wins come from writing the records as problems.', state: 'added' },
    { id: 'loss', text: 'The structured index lost one query, “css missing after deploy”.', state: 'added' },
  ],
  'The review that changed the reading': (s) => [
    ...s.map((x): Statement =>
      x.id === 'why'
        ? { ...x, state: 'revised', note: 'Much of the gain is vocabulary the record writer supplied, some of it unsupported.' }
        : x.id === 'loss'
          ? { ...x, state: 'revised', note: 'Partly a labelling error. The frozen labels are not changed.' }
          : { ...x, state: 'standing', note: x.id === 'won' ? 'The numbers stayed.' : x.note },
    ),
    { id: 'labels', text: 'The labelling episode lowers confidence in every label.', state: 'added' },
  ],
  'The Problem Desk, and a self-correction': (s) => [
    ...s.map((x) => ({ ...x, state: x.state === 'added' ? ('standing' as const) : x.state })),
    {
      id: 'review',
      text: 'A guessed change improves ranking as much as a sourced one, by construction. The weight moves from indexing to review.',
      state: 'added',
    },
  ],
}

const LAYERS = (() => {
  let s: Statement[] = []
  return HISTORY.map((h) => {
    const effect = EFFECTS[h.title]
    if (effect) s = effect(s)
    else s = s.map((x) => ({ ...x, state: x.state === 'added' ? ('standing' as const) : x.state }))
    return { h, touches: !!effect, statements: s }
  })
})()

const FIRST_TOUCH = LAYERS.findIndex((l) => l.touches)
const SUPERSEDES = artifact.records.flatMap((r) => r.related).filter((x) => x.relation === 'supersedes').length
const ALL_RELATIONS = artifact.records.flatMap((r) => r.related).length
const blankAlias = recordBySource.get('vite-issue-8073-base-mime')?.aliases.find((a) => /blank page/i.test(a))

const STATE_LABEL: Record<State, string> = { added: 'new in this layer', standing: 'standing', revised: 'revised' }

export default function AnswerWithAPast() {
  const id = useId()
  const [depth, setDepth] = useState(0)
  const layer = LAYERS[depth]!

  return (
    <div className="x53">
      <div className="x53__scrub">
        <label htmlFor={`${id}-r`}>
          Deposit layers of the research history log <span className="lab-out">(arrow keys)</span>
        </label>
        <input
          id={`${id}-r`}
          type="range"
          min={0}
          max={LAYERS.length - 1}
          value={depth}
          onChange={(e) => setDepth(Number(e.target.value))}
          aria-valuetext={`Layer ${depth + 1}: ${layer.h.title}`}
          data-probe="key:ArrowRight"
        />
      </div>

      <div className="x53__dig">
        <ol className="x53__strata" aria-label="The log, newest layer on top" reversed>
          {LAYERS.map((l, i) => ({ l, i }))
            .reverse()
            .map(({ l, i }) => (
              <li
                key={l.h.title}
                className={['x53__stratum', i > depth ? 'is-future' : '', i === depth ? 'is-top' : '', l.touches && i <= depth ? 'is-touch' : ''].join(' ')}
                aria-hidden={i > depth || undefined}
              >
                {i <= depth && (
                  <>
                    <span className="x53__date">{l.h.date}</span>
                    <span className="x53__kind">{l.h.kind}</span>
                    <span className="x53__title">{l.h.title}</span>
                  </>
                )}
              </li>
            ))}
        </ol>

        <section className="x53__answer" data-observe aria-live="polite">
          <p className="x53__at">
            Layer {depth + 1} of {LAYERS.length} · {layer.h.date} · {layer.h.kind}: <strong>{layer.h.title}</strong>
          </p>
          <p className="x53__what">{layer.h.what}</p>
          <h3>The answer, as of this layer</h3>
          {layer.statements.length === 0 ? (
            <p className="x53__none">
              {depth < FIRST_TOUCH ? 'No answer yet: nothing has been measured.' : 'No statement.'}
            </p>
          ) : (
            <ul className="x53__statements">
              {layer.statements.map((s) => (
                <li key={s.id} className={`x53__s x53__s--${s.state}`}>
                  <span className="x53__state">{STATE_LABEL[s.state]}</span>
                  <span className={s.state === 'revised' ? 'x53__old' : undefined}>{s.text}</span>
                  {s.note && <span className="x53__note">{s.note}</span>}
                </li>
              ))}
            </ul>
          )}
          {!layer.touches && layer.statements.length > 0 && <p className="lab-out">This layer leaves the answer as it was.</p>}
        </section>
      </div>

      <aside className="x53__record" aria-label="What the records remember">
        <h3>Meanwhile, in the records</h3>
        <p>
          The record format has a <code>supersedes</code> relation. Of {ALL_RELATIONS} relations in the 30 v1 records,{' '}
          <strong>{SUPERSEDES}</strong> use it. The vite#8073 record still carries the alias “{blankAlias}”, which the review
          found unsupported; nothing in the record says so.
        </p>
      </aside>
    </div>
  )
}
