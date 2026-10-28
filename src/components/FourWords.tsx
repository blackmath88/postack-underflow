import { useId, useMemo, useState, type FormEvent } from 'react'
import { search, type Hit, type Index, type SearchResult } from '../lib/retrieval'
import type { ProblemRecord } from '../lib/records'
import indexData from '../data/four-words-index.json'

export interface CorpusSource {
  id: string
  kind: string
  repo: string
  title: string
  url: string
  license: string
  revision: string
}

interface Artifact {
  corpus: { sources: number; records: number }
  sources: CorpusSource[]
  records: ProblemRecord[]
  indexes: { baseline: Index; structured: Index }
}

const artifact = indexData as unknown as Artifact
const recordBySource = new Map(artifact.records.map((r) => [r.sourceId, r]))
const sourceById = new Map(artifact.sources.map((s) => [s.id, s]))

/** Examples for trying the interface; deliberately not the evaluation queries. */
const EXAMPLES = ['blank page after deploy', 'images missing subfolder', 'router links wrong prefix']

const WEAK_SHARE = 0.35
const SHOWN = 5

const FIELD_LABEL: Record<string, string> = {
  problem: 'problem',
  aliases: 'alias',
  symptoms: 'symptom',
  terms: 'term',
  context: 'context',
  solution: 'solution',
  text: 'source text',
}

export function shortRevision(revision: string) {
  return /^[0-9a-f]{40}$/.test(revision) ? revision.slice(0, 7) : revision.slice(0, 10)
}

function SourceLine({ source }: { source: CorpusSource }) {
  return (
    <p className="fw-source">
      <a href={source.url}>{source.title}</a>
      <span className="fw-source__meta">
        {source.repo} · {source.kind} · {shortRevision(source.revision)} · {source.license}
      </span>
    </p>
  )
}

function WhyMatched({ hit }: { hit: Hit }) {
  return (
    <ul className="fw-why" aria-label="Why it matched">
      {hit.matches.map((m) => (
        <li key={m.term}>
          <code>{m.term}</code>
          <span>
            {Object.entries(m.fields)
              .map(([f, tf]) => `${FIELD_LABEL[f] ?? f}${tf > 1 ? ` ×${tf}` : ''}`)
              .join(', ')}
          </span>
        </li>
      ))}
    </ul>
  )
}

function RecordDetail({ record }: { record: ProblemRecord }) {
  return (
    <div className="fw-detail">
      {record.context.length > 0 && (
        <>
          <h5>Context and constraints</h5>
          <ul>
            {record.context.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </>
      )}
      <h5>Solution</h5>
      <p>{record.solution}</p>
      <h5>Evidence</h5>
      <ul>
        {record.evidence.map((e, i) => (
          <li key={i}>
            <span className="fw-evidence-kind">{e.kind.replace(/-/g, ' ')}</span> {e.note}
          </li>
        ))}
      </ul>
      {record.limitations.length > 0 && (
        <>
          <h5>Known limitations</h5>
          <ul>
            {record.limitations.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </>
      )}
      {record.related.length > 0 && (
        <>
          <h5>Related and competing approaches</h5>
          <ul>
            {record.related.map((r) => (
              <li key={r.sourceId}>
                <span className="fw-evidence-kind">{r.relation}</span>{' '}
                {recordBySource.get(r.sourceId)?.problem ?? r.sourceId}. {r.note}
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="fw-extraction">
        Record written {record.extraction.at} by {record.extraction.by}. {record.extraction.method}
      </p>
    </div>
  )
}

function ResultList({ result, kind }: { result: SearchResult; kind: 'structured' | 'baseline' }) {
  const top = result.hits[0]?.score ?? 0
  return (
    <ol className="fw-results">
      {result.hits.slice(0, SHOWN).map((hit, i) => {
        const record = recordBySource.get(hit.id)
        const source = sourceById.get(hit.id)
        const weak = hit.score < top * WEAK_SHARE
        return (
          <li key={hit.id} className={`fw-result${weak ? ' fw-result--weak' : ''}`}>
            <p className="fw-result__rank">
              <span>{String(i + 1).padStart(2, '0')}</span>
              <span>score {hit.score.toFixed(2)}</span>
              {weak && <span className="fw-weak">weak match</span>}
            </p>
            <h4>{kind === 'structured' ? record?.problem : source?.title}</h4>
            <WhyMatched hit={hit} />
            {source && <SourceLine source={source} />}
            {kind === 'structured' && record && (
              <details>
                <summary>Inspect record and evidence</summary>
                <RecordDetail record={record} />
              </details>
            )}
          </li>
        )
      })}
    </ol>
  )
}

export function FourWords() {
  const inputId = useId()
  const [draft, setDraft] = useState('')
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return null
    return {
      structured: search(artifact.indexes.structured, query),
      baseline: search(artifact.indexes.baseline, query),
    }
  }, [query])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setQuery(draft)
  }
  const run = (q: string) => {
    setDraft(q)
    setQuery(q)
  }

  const structured = results?.structured
  const words = draft.trim().split(/\s+/).filter(Boolean).length

  let status = `${artifact.records.length} records from ${artifact.sources.length} public sources, indexed before you arrived.`
  if (results && structured) {
    if (structured.queryTerms.length === 0) status = 'That query has no searchable words left after removing common words.'
    else if (structured.hits.length === 0) status = 'No record matched. That is a gap in this index, not proof that no solution exists.'
    else status = `${structured.hits.length} of ${artifact.records.length} records matched. ${structured.unmatched.length} did not and are kept below.`
  }

  return (
    <section className="four-words wide" aria-labelledby="four-words-title">
      <header className="four-words__header">
        <p className="kicker">Experiment · index-first retrieval</p>
        <h2 id="four-words-title">Four Words</h2>
        <p>
          Describe a GitHub Pages deployment problem in a few words. The ranking runs in your browser
          over an index built offline. No request leaves this page and no model is involved.
        </p>
      </header>

      <form className="fw-form" onSubmit={submit} role="search">
        <label htmlFor={inputId}>Your problem, in a few words</label>
        <div className="fw-form__row">
          <input
            id={inputId}
            type="search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="e.g. css missing after deploy"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit">Search the index</button>
        </div>
        <p className="fw-hint">
          {words > 4 ? `${words} words. It still works, but the experiment is about short queries.` : 'Try:'}{' '}
          {words <= 4 &&
            EXAMPLES.map((ex) => (
              <button key={ex} type="button" className="fw-example" onClick={() => run(ex)}>
                {ex}
              </button>
            ))}
        </p>
      </form>

      <p className="fw-status" role="status" aria-live="polite">
        {status}
      </p>

      {structured && structured.unknownTerms.length > 0 && (
        <p className="fw-gap">
          Not in this index’s vocabulary:{' '}
          {structured.unknownTerms.map((t) => (
            <code key={t}>{t}</code>
          ))}
          . Those words contributed nothing to the ranking.
        </p>
      )}

      {results && structured && (
        <div className="fw-columns">
          <div>
            <h3 className="fw-column-title fw-column-title--structured">Problem-oriented index</h3>
            <p className="fw-column-note">BM25F over structured records: problem, aliases, symptoms, terms, context, solution.</p>
            {structured.hits.length > 0 ? <ResultList result={structured} kind="structured" /> : <p>No matches.</p>}
          </div>
          <div>
            <h3 className="fw-column-title">Plain keyword search</h3>
            <p className="fw-column-note">BM25 over the full raw text of the same sources.</p>
            {results.baseline.hits.length > 0 ? <ResultList result={results.baseline} kind="baseline" /> : <p>No matches.</p>}
          </div>
        </div>
      )}

      <details className="fw-catalogue" open={!results}>
        <summary>
          {results && structured
            ? `${structured.unmatched.length} records did not match this query`
            : `All ${artifact.records.length} records, in source order`}
        </summary>
        <ul className="ledger">
          {(results && structured ? structured.unmatched : artifact.records.map((r) => r.sourceId)).map((id) => {
            const record = recordBySource.get(id)
            const source = sourceById.get(id)
            if (!record || !source) return null
            return (
              <li key={id}>
                <span className="ledger__title">{record.problem}</span>
                <SourceLine source={source} />
                <details>
                  <summary>Inspect record</summary>
                  <RecordDetail record={record} />
                </details>
              </li>
            )
          })}
        </ul>
      </details>
    </section>
  )
}
