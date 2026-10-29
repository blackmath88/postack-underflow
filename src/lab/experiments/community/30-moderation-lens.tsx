import { useState } from 'react'
import { CONTRIBUTIONS } from '../../../data/community-fixtures'
import { STOPS, account, fate, hiddenByLabel, rewrite, sentence, who } from './30-lens'

// 30 · The Moderation Lens. The eight Community fixtures, seen through a lens
// whose strength you turn. Each stop is a visibility policy: hide unreadable
// records, then honour one invented labeler's labels as warnings, then as
// hiding, then honour a second labeler too. The view's own account of the
// conversation sits in the viewfinder, set against the account through clear
// glass, so turning the lens shows what it struck out and what it wrote in.
// The labels are invented (src/lab/data/community-labels.ts).

const inView = (stop: number) => CONTRIBUTIONS.filter((c) => fate(c, stop).fate !== 'hidden').length

export default function ModerationLens() {
  const [stop, setStop] = useState(0)
  const s = STOPS[stop]!
  const edits = rewrite(stop)
  const changed = edits.filter((e) => e.kind !== 'kept').length
  const byLabel = hiddenByLabel(stop).length

  return (
    <div className="x30">
      <p className="lab-fixture">Invented labelers and labels; the records are the Community page fixtures</p>

      <figure className="x30__finder" data-observe>
        <figcaption className="x30__kicker">What this view says happened</figcaption>
        <p className="x30__said">
          {edits.map((e) => (
            <span key={e.key} className={`x30__clause is-${e.kind}`}>
              {e.was && e.kind !== 'kept' && (
                <del>
                  <span className="visually-hidden">struck out: </span>
                  {e.was}
                </del>
              )}
              {e.now && e.kind !== 'kept' && (
                <ins>
                  <span className="visually-hidden">written in: </span>
                  {e.now}
                </ins>
              )}
              {e.kind === 'kept' && e.now}{' '}
            </span>
          ))}
        </p>
        <p className="x30__legend">
          {stop === 0 ? (
            'Through clear glass. Turn the lens and this account is set against itself: struck through is what the lens took out, underlined is what it wrote in.'
          ) : (
            <>
              Set against clear glass: the lens changed {changed} of the account’s {edits.filter((e) => e.kind !== 'added').length} clauses
              {byLabel > 0 ? `, by hiding ${byLabel} readable ${byLabel === 1 ? 'record' : 'records'}` : ''}. No record was edited.
            </>
          )}
        </p>
      </figure>
      <p className="visually-hidden" aria-live="polite">
        {`Lens at ${s.name}. ${inView(stop)} of ${CONTRIBUTIONS.length} records shown. The view now says: ${sentence(account(stop))}`}
      </p>

      <fieldset className="x30__ring">
        <legend>Turn the lens</legend>
        <div className="x30__stops">
          {STOPS.map((st, i) => (
            <label key={st.name} className={'x30__stop' + (i === stop ? ' is-on' : '')}>
              <input
                type="radio"
                name="x30-lens"
                value={i}
                checked={i === stop}
                onChange={() => setStop(i)}
                data-probe={i === 0 ? 'key:ArrowRight' : undefined}
              />
              <span className="x30__f">{i + 1}</span>
              <span className="x30__name">{st.name}</span>
              <span className="x30__count">
                {inView(i)} of {CONTRIBUTIONS.length} shown
              </span>
            </label>
          ))}
        </div>
        <p className="x30__rule">{s.rule}</p>
      </fieldset>

      <ul className="x30__strip" aria-label="The eight records, through the lens">
        {CONTRIBUTIONS.map((c) => {
          const f = fate(c, stop)
          return (
            <li key={c.id} className={`x30__rec is-${f.fate}`}>
              <p className="x30__who">
                {who(c)} · {c.kind}
              </p>
              {f.fate === 'shown' && <p className="x30__text">{c.text}</p>}
              {f.fate === 'warned' && <p className="x30__warn">Warning: {f.why}. Content collapsed.</p>}
              {f.fate === 'placeholder' && (
                <p className="x30__warn">{c.availability === 'deleted' ? 'Deleted by its author.' : 'Source offline.'}</p>
              )}
              {f.fate === 'hidden' && <p className="x30__gone">Not in this view: {f.why}</p>}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
