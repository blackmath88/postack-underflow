import { useId, useState, type ReactNode } from 'react'
import { artifact, recordBySource } from '../../../lib/four-words-data'
import type { ProblemRecord } from '../../../lib/records'

// 55 · The Knowledge Fossil. A solution stays indexed after the context it
// applied to has gone. Pick a v1 record and dig down through its fields, from
// what a result list shows to the extraction note at the bottom. A pattern
// marks anything that dates the record: a version, an era, “removed”,
// “older”. The survey counts, across all 30 records, how deep you must dig
// before a record tells you when it might stop applying.

const ERA = /\b(v\d+(?:\.\d+)*|\d+\.\d+(?:\.\d+)?|era|removed|older|deprecated|legacy|no longer|GHES)\b/gi

const LAYERS: Array<{ key: string; label: string; get: (r: ProblemRecord) => string[] }> = [
  { key: 'problem', label: 'Surface: the problem, as a result list shows it', get: (r) => [r.problem] },
  { key: 'solution', label: 'The solution', get: (r) => [r.solution] },
  { key: 'aliases', label: 'Aliases', get: (r) => r.aliases },
  { key: 'symptoms', label: 'Symptoms', get: (r) => r.symptoms },
  { key: 'context', label: 'Context', get: (r) => r.context },
  { key: 'limitations', label: 'Limitations', get: (r) => r.limitations },
  { key: 'extraction', label: 'Bedrock: who wrote this record, and when', get: (r) => [`${r.extraction.by}, ${r.extraction.at}. ${r.extraction.method}`] },
]

const markers = (text: string) => [...text.matchAll(ERA)].map((m) => m[0])
const firstMarked = (r: ProblemRecord) => LAYERS.findIndex((l) => l.get(r).some((t) => markers(t).length > 0))

const SURVEY = LAYERS.map((l, i) => ({ label: l.key, n: artifact.records.filter((r) => firstMarked(r) === i).length }))
const UNMARKED = artifact.records.filter((r) => firstMarked(r) === -1).length

const ORDERED = [...artifact.records].sort((a, b) => {
  const fa = firstMarked(a)
  const fb = firstMarked(b)
  return (fa === -1 ? 99 : fa) - (fb === -1 ? 99 : fb) || a.sourceId.localeCompare(b.sourceId)
})

/** Our inference, linking two records the index does not link this way. */
const ELSEWHERE: Record<string, { other: string; layer: string; why: string }> = {
  'next-issue-15588-nojekyll': {
    other: 'next-static-exports',
    layer: 'context',
    why: 'Another record’s context says “next export removed in v14”. This record’s fix was found in the Next.js 9 era. Whether that matters for its fix is our inference, not the source’s.',
  },
}

function Marked({ text }: { text: string }) {
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(ERA)) {
    out.push(text.slice(last, m.index))
    out.push(<mark key={m.index}>{m[0]}</mark>)
    last = (m.index ?? 0) + m[0].length
  }
  out.push(text.slice(last))
  return <>{out}</>
}

export default function KnowledgeFossil() {
  const id = useId()
  const [sourceId, setSourceId] = useState('next-issue-15588-nojekyll')
  const [depth, setDepth] = useState(0)
  const r = recordBySource.get(sourceId)!
  const first = firstMarked(r)
  const found = first !== -1 && first <= depth
  const elsewhere = ELSEWHERE[sourceId]
  const dug = LAYERS.slice(0, depth + 1)

  return (
    <div className="x55">
      <div className="x55__site">
        <label htmlFor={`${id}-r`}>Excavate the record for</label>
        <select
          id={`${id}-r`}
          value={sourceId}
          onChange={(e) => {
            setSourceId(e.target.value)
            setDepth(0)
          }}
        >
          {ORDERED.map((x) => (
            <option key={x.sourceId} value={x.sourceId}>
              {x.sourceId}
              {firstMarked(x) === -1 ? ' (no dating marks)' : ''}
            </option>
          ))}
        </select>
        <div className="x55__tools">
          <button type="button" className="lab-btn" onClick={() => setDepth((d) => Math.min(LAYERS.length - 1, d + 1))} disabled={depth === LAYERS.length - 1} data-probe="click">
            Dig one layer deeper
          </button>
          <button type="button" className="lab-btn" onClick={() => setDepth(0)} disabled={depth === 0}>
            Back to the surface
          </button>
        </div>
      </div>

      <ol className="x55__pit" aria-label="Layers dug so far">
        {dug.map((l, i) => {
          const lines = l.get(r)
          const marked = lines.some((t) => markers(t).length > 0)
          return (
            <li key={l.key} className={'x55__layer' + (marked ? ' is-marked' : '')} style={{ ['--i' as string]: i }}>
              <p className="x55__label">
                {i + 1}. {l.label}
                {marked && <span className="x55__find"> · dating mark</span>}
              </p>
              {lines.length === 0 ? (
                <p className="x55__empty">empty</p>
              ) : (
                <ul>
                  {lines.map((t) => (
                    <li key={t}>
                      <Marked text={t} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
        {depth < LAYERS.length - 1 && (
          <li className="x55__undug" aria-hidden="true">
            {LAYERS.length - depth - 1} layers not yet dug
          </li>
        )}
      </ol>

      <div className="x55__log" data-observe role="status">
        <p>
          Dug to layer {depth + 1} of {LAYERS.length}.{' '}
          {found
            ? `The first dating mark is in layer ${first + 1}, ${LAYERS[first]!.key}: “${LAYERS[first]!.get(r).flatMap(markers).join('”, “')}”.`
            : first === -1
              ? depth === LAYERS.length - 1
                ? 'Bedrock reached. Nothing in this record says when it might stop applying; only the extraction date dates it.'
                : 'No dating mark yet.'
              : 'No dating mark yet.'}
        </p>
        {elsewhere && depth >= LAYERS.findIndex((l) => l.key === elsewhere.layer) && (
          <p className="x55__else">
            <strong>Found nearby:</strong> {elsewhere.why} (<code>{elsewhere.other}</code>)
          </p>
        )}
      </div>

      <aside className="x55__survey" aria-label="All 30 records">
        <p>Across all {artifact.records.length} records, the layer where a dating mark first appears:</p>
        <ul>
          {SURVEY.map((s) => (
            <li key={s.label}>
              <span className="x55__bar" style={{ inlineSize: `${(100 * s.n) / artifact.records.length}%` }} aria-hidden="true" />
              {s.label}: {s.n}
            </li>
          ))}
          <li>
            <span className="x55__bar x55__bar--none" style={{ inlineSize: `${(100 * UNMARKED) / artifact.records.length}%` }} aria-hidden="true" />
            nowhere: {UNMARKED}
          </li>
        </ul>
      </aside>
    </div>
  )
}
