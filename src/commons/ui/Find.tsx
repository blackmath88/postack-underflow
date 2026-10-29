import { useId, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import indexJson from '../../data/commons-index.json'
import { search, tokenize, type Index } from '../../lib/retrieval'
import { STATUS_LABEL, problemFields, type Problem } from '../model'
import { PROBLEMS, problemById, sourceFor, sourceLabel, threadState } from './data'

const INDEXES = (indexJson as unknown as { indexes: { structured: Index; threads: Index } }).indexes

const FIELD_LABEL: Record<string, string> = {
  title: 'title',
  symptoms: 'symptoms',
  aliases: 'words the index added',
  device: 'device',
  environment: 'environment',
  approaches: 'approaches',
  evidence: 'evidence',
}

const EXAMPLES = ['only the sd card shows up', 'computer does not see the frame', 'stuck on boot animation', 'error -71 january', 'dashboard slow']

/** Terms a record matched only because the index writer added them. */
function onlyInAliases(p: Problem, term: string): boolean {
  const f = problemFields(p)
  const has = (t: string) => tokenize(t).includes(term)
  return has(f.aliases ?? '') && !Object.entries(f).some(([k, v]) => k !== 'aliases' && has(v))
}

export function Find({ initial = '' }: { initial?: string }) {
  const [query, setQuery] = useState(initial)
  const inputId = useId()
  const records = useMemo(() => (query.trim() ? search(INDEXES.structured, query) : null), [query])
  const threads = useMemo(() => (query.trim() ? search(INDEXES.threads, query) : null), [query])
  const hits = records?.hits.slice(0, 6) ?? []
  const threadHits = threads?.hits.slice(0, 6) ?? []
  const unknown = records?.unknownTerms ?? []

  return (
    <section className="pfc-find" aria-labelledby="find-title" id="find">
      <p className="pfc-step" aria-hidden="true">01 · Find</p>
      <h2 id="find-title">What is your frame doing?</h2>
      <form className="pfc-search" role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor={inputId}>Describe it in ordinary words</label>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. the backup disk never appears"
          autoComplete="off"
          spellCheck={false}
        />
      </form>
      <noscript>
        <p className="pfc-empty">Search runs in your browser and needs JavaScript. Every problem is listed in the drawers below.</p>
      </noscript>
      <p className="pfc-examples">
        Try:{' '}
        {EXAMPLES.map((q, i) => (
          <span key={q}>
            {i > 0 && ' · '}
            <button type="button" className="pfc-linkish" onClick={() => setQuery(q)}>
              {q}
            </button>
          </span>
        ))}
      </p>

      <div className="pfc-results" aria-live="polite">
        {!records && (
          <p className="pfc-hint">
            Search runs in your browser over {PROBLEMS.length} problem records and, beside them, the raw text of every
            issue thread. Nothing leaves this page.
          </p>
        )}
        {records && (
          <>
            <div className="pfc-results__col">
              <h3>
                Problem records <span className="pfc-count">{records.hits.length}</span>
              </h3>
              {hits.length === 0 && (
                <p className="pfc-empty">
                  No record matches {unknown.length ? <>(none of the records use {unknown.map((t) => `“${t}”`).join(', ')})</> : null}.
                  Try the words you would type into GitHub, or browse the drawer below.
                </p>
              )}
              <ol className="pfc-hits">
                {hits.map((h, rank) => {
                  const p = problemById(h.id)!
                  return (
                    <li key={h.id}>
                      <span className="pfc-hits__rank">{rank + 1}</span>
                      <div>
                        <Link to="/commons/$problem/" params={{ problem: p.id }} className="pfc-hits__title">
                          {p.title}
                        </Link>
                        <p className="pfc-hits__meta">
                          <span className={`pfc-stamp pfc-stamp--${p.status}`}>{STATUS_LABEL[p.status]}</span> {p.device.join(' · ')}
                        </p>
                        <p className="pfc-why">
                          <span className="pfc-why__label">Why it matched:</span>{' '}
                          {h.matches.map((m, i) => (
                            <span key={m.term}>
                              {i > 0 && ', '}
                              <code>{m.term}</code> in {Object.keys(m.fields).map((f) => FIELD_LABEL[f] ?? f).join(' and ')}
                              {onlyInAliases(p, m.term) && <span className="pfc-flag"> (only in words the index added)</span>}
                            </span>
                          ))}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
            <div className="pfc-results__col pfc-results__col--raw">
              <h3>
                The same words over raw issue threads <span className="pfc-count">{threads!.hits.length}</span>
              </h3>
              <p className="pfc-hint">What a search of the repository’s issues would rank, with no index between.</p>
              <ol className="pfc-hits pfc-hits--raw">
                {threadHits.map((h, rank) => {
                  const s = sourceFor(h.id)
                  const cited = (indexJson as unknown as { citedBy: Record<string, string[]> }).citedBy[h.id] ?? []
                  return (
                    <li key={h.id}>
                      <span className="pfc-hits__rank">{rank + 1}</span>
                      <div>
                        <a href={s?.url} className="pfc-hits__title">
                          {s?.title}
                        </a>
                        <p className="pfc-hits__meta">
                          {sourceLabel(s)} · {threadState(s)}
                          {cited.length > 0 && (
                            <>
                              {' '}· cited by{' '}
                              {cited.map((c, i) => (
                                <span key={c}>
                                  {i > 0 && ', '}
                                  <Link to="/commons/$problem/" params={{ problem: c }}>
                                    {problemById(c)?.title.split(/[,:]/)[0]}
                                  </Link>
                                </span>
                              ))}
                            </>
                          )}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
