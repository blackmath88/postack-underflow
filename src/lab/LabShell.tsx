import { useEffect, useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import type { LabEntry } from './types'
import {
  ENCOUNTER_LABEL,
  FAMILY,
  FIRMNESS_LABEL,
  KIND_GLOSS,
  KIND_LABEL,
  STATUS_GLOSS,
  STATUS_LABEL,
  TRANSFORMATION_LABEL,
  entryFor,
  neighbours,
} from './catalogue'

// The shared frame around one pilot: what it asks, then the experiment
// itself, then the notebook. The frame never styles the experiment; the
// specimen area is a plain region the experiment fills however it needs.

export function LabShell({ entry, children }: { entry: LabEntry; children: ReactNode }) {
  const family = FAMILY[entry.family]
  const { prev, next } = neighbours(entry.n)
  // Marks hydration, so browser checks act on live controls, not prerendered ones.
  const [live, setLive] = useState(false)
  useEffect(() => setLive(true), [])
  return (
    <article className="lab-page" data-lab={entry.n} data-live={live || undefined}>
      <header className="lab-head">
        <p className="lab-head__trail">
          <Link to="/lab/">Laboratory</Link>
          <span aria-hidden="true"> / </span>
          <span>
            Lab {family.no} · {family.label}
          </span>
        </p>
        <div className="lab-head__slip">
          <p className="lab-head__no" aria-hidden="true">
            {entry.n}
          </p>
          <div>
            <h1>
              <span className="visually-hidden">Experiment {entry.n}: </span>
              {entry.title}
            </h1>
            <p className="lab-head__question">{entry.question}</p>
          </div>
        </div>
        <ul className="lab-tags" aria-label="Catalogue tags">
          <li title={KIND_GLOSS[entry.kind]}>{KIND_LABEL[entry.kind]}</li>
          <li>{TRANSFORMATION_LABEL[entry.transformation]}</li>
          <li>{ENCOUNTER_LABEL[entry.encounter]}</li>
          <li className={`lab-stamp lab-stamp--${entry.status}`} title={STATUS_GLOSS[entry.status]}>
            {STATUS_LABEL[entry.status]}
          </li>
        </ul>
        <p className="lab-proposition">
          <span className="lab-proposition__label">Proposition, which could be false</span>
          {entry.proposition}
        </p>
      </header>

      <section className="lab-specimen" aria-label={`Experiment: ${entry.title}`}>
        {children}
      </section>

      <p className="lab-data">
        <span className="lab-data__label">Material</span> {entry.data}
      </p>

      <Notebook entry={entry} />

      <nav className="lab-pager" aria-label="Other experiments">
        {prev ? (
          <Link to="/lab/$n/" params={{ n: prev.n }} rel="prev">
            ← {prev.n} {prev.title}
          </Link>
        ) : (
          <span />
        )}
        <Link to="/lab/">All experiments</Link>
        {next ? (
          <Link to="/lab/$n/" params={{ n: next.n }} rel="next">
            {next.n} {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  )
}

function Notebook({ entry }: { entry: LabEntry }) {
  const p = entry.provenance
  const rows: Array<[string, ReactNode]> = [
    ['What gave us this idea?', p.idea],
    ['Which mechanism inspired it?', p.mechanism],
    ['What did the source actually show?', p.sourceShowed],
    ['Our interpretation', p.interpretation],
    ['What we built', entry.built],
    ['What happened', entry.happened],
    ['What remains uncertain', entry.uncertain],
  ]
  const related = entry.related.map(entryFor).filter((e): e is LabEntry => Boolean(e))
  return (
    <section className="lab-notebook" aria-labelledby={`nb-${entry.n}`}>
      <h2 id={`nb-${entry.n}`}>Notebook</h2>

      <dl className="lab-mechanics">
        <div>
          <dt>You can</dt>
          <dd>{entry.manipulate}</dd>
        </div>
        <div>
          <dt>That changes</dt>
          <dd>{entry.changes}</dd>
        </div>
        <div>
          <dt>It cannot change</dt>
          <dd>{entry.unchanged}</dd>
        </div>
      </dl>

      <dl className="lab-prov">
        {rows.map(([q, a]) => (
          <div key={q}>
            <dt>{q}</dt>
            <dd>{a}</dd>
          </div>
        ))}
        <div className="lab-prov__test">
          <dt>What would show this is wrong</dt>
          <dd>{entry.falsifier}</dd>
        </div>
        <div>
          <dt>A plainer control that might do the same</dt>
          <dd>{entry.simpler}</dd>
        </div>
      </dl>

      <h3>Sources and prior art</h3>
      <ul className="lab-sources">
        {p.sources.map((s) => (
          <li key={s.label}>
            {s.url ? <a href={s.url}>{s.label}</a> : s.label}{' '}
            <span className={`lab-firm lab-firm--${s.firmness}`}>{FIRMNESS_LABEL[s.firmness]}</span>
          </li>
        ))}
      </ul>
      {p.priorArt.length > 0 && (
        <p className="lab-prior">
          <span className="lab-prior__label">Resembles</span> {p.priorArt.join('; ')}.
        </p>
      )}

      {entry.reflection && (
        <>
          <h3>Reflection after development</h3>
          <p className="lab-reflection">{entry.reflection}</p>
        </>
      )}

      {entry.assessment && (
        <>
          <h3>Assessment after building</h3>
          <dl className="lab-assess">
            {(
              [
                ['Specificity', entry.assessment.specificity],
                ['Interaction', entry.assessment.interaction],
                ['Insight', entry.assessment.insight],
                ['Integrity', entry.assessment.integrity],
                ['Experience', entry.assessment.experience],
              ] as const
            ).map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
            <div className="lab-assess__verdict">
              <dt>Verdict</dt>
              <dd>{entry.assessment.verdict}</dd>
            </div>
          </dl>
        </>
      )}

      {related.length > 0 && (
        <>
          <h3>Related experiments</h3>
          <ul className="lab-related">
            {related.map((r) => (
              <li key={r.n}>
                <Link to="/lab/$n/" params={{ n: r.n }}>
                  <span className="lab-related__n">{r.n}</span> {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
