import { useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { pageTitle } from '../../content/site'
import { repoFile } from '../../content/sources'
import {
  CATALOGUE,
  ENCOUNTER_LABEL,
  FAMILIES,
  FAMILY,
  KIND_LABEL,
  STATUS_GLOSS,
  STATUS_LABEL,
  TRANSFORMATION_LABEL,
} from '../../lab/catalogue'
import { CONSTELLATIONS, RECURRING, type Constellation } from '../../lab/catalogue/map'
import type { Encounter, LabEntry, Status, Transformation } from '../../lab/types'
import labStylesUrl from '../../lab/styles/lab.css?url'

export const Route = createFileRoute('/lab/')({
  head: () => ({
    meta: [
      { title: pageTitle('Laboratory') },
      { name: 'description', content: 'Small, executable propositions about indexing, community, collective memory and historical interfaces.' },
    ],
    links: [{ rel: 'stylesheet', href: labStylesUrl }],
  }),
  component: LabIndex,
})

type Facet = 'all' | string
type Reading = 'question' | 'finding'

const count = <K extends string>(pick: (e: LabEntry) => K) => {
  const m = new Map<K, number>()
  for (const e of CATALOGUE) m.set(pick(e), (m.get(pick(e)) ?? 0) + 1)
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}

function LabIndex() {
  const [encounter, setEncounter] = useState<Facet>('all')
  const [transformation, setTransformation] = useState<Facet>('all')
  const [status, setStatus] = useState<Facet>('all')
  const [reading, setReading] = useState<Reading>('question')

  const shown = useMemo(
    () =>
      CATALOGUE.filter(
        (e) =>
          (encounter === 'all' || e.encounter === encounter) &&
          (transformation === 'all' || e.transformation === transformation) &&
          (status === 'all' || e.status === status),
      ),
    [encounter, transformation, status],
  )
  const filtered = shown.length !== CATALOGUE.length
  const reset = () => {
    setEncounter('all')
    setTransformation('all')
    setStatus('all')
  }

  return (
    <div className="lab-index">
      <header className="lab-index__head">
        <p className="kicker">Optional · beside the essay</p>
        <h1>The Laboratory</h1>
        <p className="lab-index__lede">
          Small working propositions about how knowledge gets found, connected, challenged and remembered. Each one
          does something. Some are useful, some are strange, and some show a weakness in our own ideas.
        </p>
        <p className="lab-index__method">
          Every pilot states a proposition that could be false, what you can change, and what it cannot change. Its
          notebook says where the idea came from, what the source actually showed, and what remains uncertain. Nothing
          here is a user study or a benchmark. <a href={repoFile('docs/lab/METHOD.md')}>The method</a> ·{' '}
          <a href={repoFile('docs/lab/EVALUATION.md')}>the critique</a> ·{' '}
          <Link to="/">back to the essay</Link>
        </p>
        <nav className="lab-index__jump" aria-label="On this page">
          <a href="#lab-start">Start with eight specimens</a>
          <a href="#lab-recurring">What kept coming back</a>
          <a href="#lab-all">All {CATALOGUE.length}</a>
          <a href="#lab-map">The map</a>
        </nav>
      </header>

      <section className="lab-start" aria-labelledby="lab-start">
        <h2 id="lab-start">Start here</h2>
        <p className="lab-family__q">
          Eight pilots developed further after the critique, one or more from each family. Each sentence is what it found.
        </p>
        <ol className="lab-start__list">
          {SPECIMENS.map((e) => (
            <li key={e.n}>
              <Link to="/lab/$n/" params={{ n: e.n }} className="lab-start__link">
                <span className="lab-register__n">{e.n}</span> {e.title}
              </Link>
              <span className="lab-start__finding">{e.finding}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="lab-recurring" aria-labelledby="lab-recurring">
        <h2 id="lab-recurring">What kept coming back</h2>
        <p className="lab-family__q">
          Six families were built independently, and the frozen corpus kept giving the same four answers.
        </p>
        <Groups groups={RECURRING} />
      </section>

      <h2 id="lab-all" className="lab-index__all">
        All {CATALOGUE.length} experiments
      </h2>

      <form className="lab-filters" aria-label="Filter the experiments" onSubmit={(e) => e.preventDefault()}>
        <FacetSelect
          label="Source or encounter"
          value={encounter}
          onChange={setEncounter}
          options={count((e) => e.encounter).map(([k, c]) => [k, `${ENCOUNTER_LABEL[k as Encounter]} (${c})`])}
        />
        <FacetSelect
          label="Transformation"
          value={transformation}
          onChange={setTransformation}
          options={count((e) => e.transformation).map(([k, c]) => [k, `${TRANSFORMATION_LABEL[k as Transformation]} (${c})`])}
        />
        <FacetSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={count((e) => e.status).map(([k, c]) => [k, `${STATUS_LABEL[k as Status]} (${c})`])}
        />
        <fieldset className="lab-reading">
          <legend>Read each line as its</legend>
          {(['question', 'finding'] as const).map((r) => (
            <label key={r}>
              <input type="radio" name="reading" value={r} checked={reading === r} onChange={() => setReading(r)} />{' '}
              {r === 'question' ? 'research question' : 'finding'}
            </label>
          ))}
        </fieldset>
        <p className="lab-filters__count" role="status">
          {filtered ? `${shown.length} of ${CATALOGUE.length} experiments` : `${CATALOGUE.length} experiments`}
          {filtered && (
            <>
              {' '}
              <button type="button" className="lab-linkbutton" onClick={reset}>
                Show all
              </button>
            </>
          )}
        </p>
      </form>

      {FAMILIES.map((f) => {
        const rows = shown.filter((e) => e.family === f)
        if (!rows.length) return null
        return (
          <section key={f} className={`lab-family lab-family--${f}`} aria-labelledby={`fam-${f}`}>
            <h2 id={`fam-${f}`}>
              <span className="lab-family__no">Lab {FAMILY[f].no}</span> {FAMILY[f].label}
            </h2>
            <p className="lab-family__q">{FAMILY[f].question}</p>
            <ol className="lab-register">
              {rows.map((e) => (
                <li key={e.n} className="lab-register__row">
                  <Link to="/lab/$n/" params={{ n: e.n }} className="lab-register__link">
                    <span className="lab-register__n">{e.n}</span>
                    <span className="lab-register__title">{e.title}</span>
                  </Link>
                  <span className="lab-register__text">{reading === 'question' ? e.question : e.finding}</span>
                  <span className="lab-register__meta">
                    {KIND_LABEL[e.kind]} · {TRANSFORMATION_LABEL[e.transformation]} ·{' '}
                    <span className={`lab-stamp lab-stamp--${e.status}`} title={STATUS_GLOSS[e.status]}>
                      {STATUS_LABEL[e.status]}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )
      })}

      {CONSTELLATIONS.length > 0 && (
        <section className="lab-map" aria-labelledby="lab-map">
          <h2 id="lab-map">A map of related experiments</h2>
          <p>Groups that ask the same question from different sides. The families are themes; these are arguments.</p>
          <Groups groups={CONSTELLATIONS} />
        </section>
      )}
    </div>
  )
}

const SPECIMENS = CATALOGUE.filter((e) => e.status === 'specimen' || e.assessment?.verdict === 'develop')

function Groups({ groups }: { groups: Constellation[] }) {
  return (
    <dl className="lab-map__list">
      {groups.map((c) => (
        <div key={c.title}>
          <dt>{c.title}</dt>
          <dd>
            <p>{c.note}</p>
            <ul>
              {c.members.map((n) => {
                const e = CATALOGUE.find((x) => x.n === n)
                return e ? (
                  <li key={n}>
                    <Link to="/lab/$n/" params={{ n }}>
                      {n} {e.title}
                    </Link>
                  </li>
                ) : null
              })}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  )
}

function FacetSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: Array<[string, string]>
}) {
  return (
    <label className="lab-facet">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="all">All</option>
        {options.map(([k, l]) => (
          <option key={k} value={k}>
            {l}
          </option>
        ))}
      </select>
    </label>
  )
}
