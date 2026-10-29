import { useId, useState } from 'react'
import { artifact, recordBySource, sourceById } from '../../../lib/four-words-data'
import type { ProblemRecord } from '../../../lib/records'
import { QUERIES, firstRelevant, indexCopy } from './copy-index'

// 59 · The Portable Problem. Pack one v1 record and send it through a chain
// of hosts. Each host keeps a field as a field, flattens it into prose, or
// drops it; a hop can never restore what an earlier hop flattened. On
// arrival the record is re-indexed (a copy, beside the other 29 unchanged)
// and its frozen labelled queries are rerun. The host models are our
// simplifications, not specifications of those formats.

type Keep = 'field' | 'text' | 'lost'
type FieldKey = 'problem' | 'aliases' | 'symptoms' | 'context' | 'solution' | 'terms' | 'evidence' | 'limitations' | 'related' | 'source' | 'writer'

const FIELDS: Array<{ key: FieldKey; label: string }> = [
  { key: 'problem', label: 'Problem' },
  { key: 'aliases', label: 'Aliases' },
  { key: 'symptoms', label: 'Symptoms' },
  { key: 'context', label: 'Context' },
  { key: 'solution', label: 'Solution' },
  { key: 'terms', label: 'Controlled terms' },
  { key: 'evidence', label: 'Evidence and its kind' },
  { key: 'limitations', label: 'Limitations' },
  { key: 'related', label: 'Related records' },
  { key: 'source', label: 'Pinned source link' },
  { key: 'writer', label: '“Written by an agent, not reviewed”' },
]

const all = (k: Keep) => Object.fromEntries(FIELDS.map((f) => [f.key, k])) as Record<FieldKey, Keep>

const HOSTS: Array<{ id: string; name: string; model: string; keeps: Record<FieldKey, Keep>; limit?: number }> = [
  {
    id: 'record',
    name: 'A typed record',
    model: 'A hypothetical example.postack.problem record: every field stays a field.',
    keeps: all('field'),
  },
  {
    id: 'issue',
    name: 'An issue comment',
    model: 'Markdown: everything can be written down, under headings, but nothing stays a field.',
    keeps: all('text'),
  },
  {
    id: 'qa',
    name: 'A Q&A page',
    model: 'Question title, question body, accepted answer, keywords, link. Our mapping; the rest is dropped.',
    keeps: { ...all('lost'), problem: 'field', solution: 'field', terms: 'field', source: 'field', symptoms: 'text', context: 'text' },
  },
  {
    id: 'feed',
    name: 'A feed item',
    model: 'Title, description and link only.',
    keeps: { ...all('lost'), problem: 'field', solution: 'text', source: 'field' },
  },
  {
    id: 'post',
    name: 'A short social post',
    model: 'Up to 300 characters of text plus one link (Bluesky’s post limit is 300 graphemes; counted here as characters).',
    keeps: { ...all('lost'), problem: 'text', source: 'field' },
    limit: 300,
  },
]

const RANK: Record<Keep, number> = { field: 2, text: 1, lost: 0 }
const worse = (a: Keep, b: Keep): Keep => (RANK[a] <= RANK[b] ? a : b)

function arrive(r: ProblemRecord, hops: typeof HOSTS) {
  const state = all('field')
  let problem = r.problem
  for (const h of hops) {
    for (const f of FIELDS) state[f.key] = worse(state[f.key], h.keeps[f.key])
    const url = sourceById.get(r.sourceId)?.url ?? ''
    if (h.limit) problem = problem.slice(0, Math.max(0, h.limit - url.length - 1))
  }
  // Re-index: fields stay fields; flattened text has no field, so it is indexed as context.
  const keep = (k: FieldKey, v: string[]) => (state[k] === 'field' ? v : [])
  const flat = FIELDS.filter((f) => state[f.key] === 'text').flatMap((f) => {
    if (f.key === 'problem') return [problem]
    if (f.key === 'solution') return [r.solution]
    if (f.key === 'aliases' || f.key === 'symptoms' || f.key === 'context' || f.key === 'limitations') return r[f.key]
    if (f.key === 'terms') return [r.terms.join(' ')]
    return []
  })
  const copy: ProblemRecord = {
    ...r,
    problem: state.problem === 'field' ? problem : '',
    aliases: keep('aliases', r.aliases),
    symptoms: keep('symptoms', r.symptoms),
    context: [...keep('context', r.context), ...flat],
    solution: state.solution === 'field' ? r.solution : '',
    terms: keep('terms', r.terms),
  }
  return { state, copy, truncated: problem.length < r.problem.length }
}

const BEFORE = indexCopy(artifact.records)

export default function PortableProblem() {
  const id = useId()
  const [sourceId, setSourceId] = useState('vite-issue-8073-base-mime')
  const [route, setRoute] = useState<string[]>([])
  const r = recordBySource.get(sourceId)!
  const hops = route.map((h) => HOSTS.find((x) => x.id === h)!)
  const { state, copy, truncated } = arrive(r, hops)
  const queries = QUERIES.filter((q) => q.relevant.includes(sourceId))
  const after = indexCopy(artifact.records.map((x) => (x.sourceId === sourceId ? copy : x)))
  const ranks = queries.map((q) => ({ q, before: firstRelevant(BEFORE, q, [sourceId]), after: firstRelevant(after, q, [sourceId]) }))
  const kept = FIELDS.filter((f) => state[f.key] === 'field').length
  const flat = FIELDS.filter((f) => state[f.key] === 'text').length

  return (
    <div className="x59">
      <div className="x59__pack">
        <label htmlFor={`${id}-r`}>Pack the record for</label>
        <select
          id={`${id}-r`}
          value={sourceId}
          onChange={(e) => {
            setSourceId(e.target.value)
            setRoute([])
          }}
        >
          {artifact.records
            .filter((x) => QUERIES.some((q) => q.relevant.includes(x.sourceId)))
            .map((x) => (
              <option key={x.sourceId} value={x.sourceId}>
                {x.sourceId}
              </option>
            ))}
        </select>
      </div>

      <div className="x59__hosts" role="group" aria-label="Send it to a host">
        {HOSTS.map((h) => (
          <button
            key={h.id}
            type="button"
            className="lab-btn"
            onClick={() => setRoute((rt) => [...rt, h.id].slice(-4))}
            data-probe={h.id === 'post' ? 'click' : undefined}
            title={h.model}
          >
            → {h.name}
          </button>
        ))}
        <button type="button" className="lab-linkbutton" onClick={() => setRoute([])} disabled={route.length === 0}>
          Unpack and start again
        </button>
      </div>

      <p className="x59__route" aria-label="Route so far">
        <span>Your copy</span>
        {hops.map((h, i) => (
          <span key={i}>→ {h.name}</span>
        ))}
      </p>
      {hops.length > 0 && <p className="x59__model">{hops[hops.length - 1]!.model}</p>}

      <div className="x59__case" data-observe>
        <ul className="x59__items" aria-label="What arrives">
          {FIELDS.map((f) => (
            <li key={f.key} className={`x59__item x59__item--${state[f.key]}`}>
              <span className="x59__tag">{state[f.key] === 'field' ? 'kept' : state[f.key] === 'text' ? 'flattened' : 'lost'}</span>
              {f.label}
              {f.key === 'problem' && truncated && state.problem !== 'lost' && ' (cut short)'}
            </li>
          ))}
        </ul>
        <div className="x59__arrival" role="status">
          <p>
            {hops.length === 0
              ? 'Nothing has travelled yet.'
              : `Arrives with ${kept} of ${FIELDS.length} fields kept as fields, ${flat} flattened into prose, ${FIELDS.length - kept - flat} lost.`}
          </p>
          {hops.length > 0 && (
            <ul className="lab-out">
              {ranks.map(({ q, before, after }) => (
                <li key={q.id}>
                  “{q.query}”: this record ranks {before ? `#${before}` : 'nowhere'} → {after ? `#${after}` : 'nowhere'}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
