import { Link } from '@tanstack/react-router'
import { STATUS_LABEL, type Problem } from '../model'
import { RESULT_LABEL, ROLE_LABEL, VIEW, day, sourceFor, sourceLabel, threadState, who } from './data'
import { Connect } from './Connect'
import { Challenge } from './Challenge'
import { ElsewhereSection } from './Elsewhere'
import { CommonsBand, Journey } from './Shell'
import { Inline } from './Inline'

export function ProblemView({ problem: p }: { problem: Problem }) {
  const people = [...new Set(p.evidence.map((e) => sourceFor(e.ref)?.by).filter((x): x is string => !!x))]
  const evidenceById = new Map(p.evidence.map((e) => [e.id, e]))
  const corrections = VIEW.corrections.filter((c) => c.problem === p.id)
  const related = p.related.map((r) => ({ ...r, target: VIEW.problems.find((x) => x.id === r.to)! }))

  return (
    <div className="pfc">
      <CommonsBand />
      <Journey active="inspect" hasChallenge={corrections.length > 0} />
      <header className="pfc-problem-head" id="inspect">
        <p className="pfc-crumbs">
          <Link to="/commons/">Photo Frame Commons</Link> / problem
        </p>
        <h1>{p.title}</h1>
        <p className="pfc-status">
          <span className={`pfc-stamp pfc-stamp--${p.status}`}>{STATUS_LABEL[p.status]}</span> {p.statusNote}
        </p>
        <dl className="pfc-facts">
          <dt>Device</dt>
          <dd>{p.device.join(' · ')}</dd>
          <dt>Where</dt>
          <dd>{p.environment.join(' · ')}</dd>
          <dt>Symptoms, as indexed</dt>
          <dd>{p.symptoms.join(' · ')}</dd>
          <dt>Search words added by the index</dt>
          <dd className="pfc-authored">{p.aliases.join(' · ')}</dd>
        </dl>
      </header>

      <nav className="pfc-five" aria-label="What this page answers">
        <ol>
          <li><span>What do we know?</span> <a href="#known">{p.approaches.length} approach{p.approaches.length === 1 ? '' : 'es'}</a></li>
          <li><span>What supports it?</span> <a href="#evidence">{p.evidence.length} sources</a></li>
          <li><span>Who contributed?</span> <a href="#evidence">{people.length} people and documents</a></li>
          <li><span>What is uncertain?</span> <a href="#uncertain">{p.openQuestions.length + p.indexing.uncertainty.length} open points</a></li>
          <li><span>What next?</span> <a href={corrections.length ? '#challenge' : '#connect'}>{corrections.length ? 'a correction to inspect' : 'follow the connections'}</a></li>
        </ol>
      </nav>

      <section className="pfc-known" aria-labelledby="known-title" id="known">
        <p className="pfc-step" aria-hidden="true">02 · Inspect</p>
        <h2 id="known-title">What people tried</h2>
        {p.approaches.length === 0 && <p className="pfc-empty">No approach has been reported for this problem.</p>}
        <ul className="pfc-approaches">
          {p.approaches.map((a) => (
            <li key={a.id}>
              <p className="pfc-approach__label">{a.label}</p>
              <p className="pfc-approach__scope">Reported for: {a.scope}</p>
              <ul className="pfc-outcomes">
                {a.reports.map((r) => {
                  const e = evidenceById.get(r.evidence)!
                  const s = sourceFor(e.ref)
                  return (
                    <li key={r.evidence} className={`pfc-outcome pfc-outcome--${r.result}`}>
                      <span className="pfc-outcome__mark">{RESULT_LABEL[r.result]}</span>{' '}
                      <a href={`#ev-${e.id}`}>{sourceLabel(s)}</a> · {who(s?.by ?? '')}
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ul>
        <p className="pfc-hint">
          An outcome is what one report says happened on one unit. A merged pull request or a closed issue is not counted as
          proof that a fix works elsewhere.
        </p>
      </section>

      <section className="pfc-evidence" aria-labelledby="evidence-title" id="evidence">
        <h2 id="evidence-title">The sources</h2>
        <p className="pfc-lede">
          <q className="pfc-key-quote">Quoted</q> text is the source’s own words. The line beneath it is the index’s description.
        </p>
        <ol className="pfc-ledger">
          {p.evidence.map((e) => {
            const s = sourceFor(e.ref)
            return (
              <li key={e.id} id={`ev-${e.id}`} className={`pfc-entry pfc-entry--${e.role}`}>
                <p className="pfc-entry__meta">
                  <span className="pfc-entry__role">{ROLE_LABEL[e.role]}</span>
                  <a href={s?.url}>{sourceLabel(s)}</a>
                  <span>{who(s?.by ?? '')}</span>
                  {s?.at && <time dateTime={s.at}>{day(s.at)}</time>}
                  <span>{threadState(s)}</span>
                  {s?.edited && <span title="GitHub marks this text as edited; earlier versions are not in the snapshot">edited</span>}
                  {s?.byType === 'bot' && <span>bot</span>}
                </p>
                {e.quote ? <p className="pfc-entry__quote"><q><Inline text={e.quote} /></q></p> : <p className="pfc-entry__quote pfc-entry__quote--none">Cited by its title: <em>{s?.title}</em></p>}
                <p className="pfc-entry__says">{e.says}</p>
              </li>
            )
          })}
        </ol>
      </section>

      <Connect problemId={p.id} />
      <ElsewhereSection problemId={p.id} />
      <Challenge problem={p} />

      <section className="pfc-uncertain" aria-labelledby="uncertain-title" id="uncertain">
        <h2 id="uncertain-title">What remains uncertain</h2>
        {p.openQuestions.length > 0 && (
          <>
            <h3>Open questions</h3>
            <ul>{p.openQuestions.map((q) => <li key={q}>{q}</li>)}</ul>
          </>
        )}
        <h3>How this record was made</h3>
        <ul>
          {p.indexing.decisions.map((d) => <li key={d}>{d}</li>)}
          {p.indexing.uncertainty.map((d) => <li key={d} className="pfc-unsure">{d}</li>)}
          <li>Written by <code>{VIEW.meta.recordsBy}</code>, {VIEW.meta.recordsReview}.</li>
        </ul>
        {related.length > 0 && (
          <>
            <h3>Neighbouring problems</h3>
            <ul>
              {related.map((r) => (
                <li key={r.to}>
                  <Link to="/commons/$problem/" params={{ problem: r.to }}>{r.target.title}</Link>{' '}
                  <span className={`pfc-basis-tag pfc-basis--${r.basis}`}>{r.basis.replace('-', ' ')}</span> {r.note}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  )
}
