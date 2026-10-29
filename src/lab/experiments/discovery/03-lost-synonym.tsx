import { useId, useMemo, useState } from 'react'
import queriesFile from '../../../../corpus/queries.json'
import { artifact, recordBySource, sourceById } from '../../../lib/four-words-data'
import { recordFields } from '../../../lib/records'
import { search, tokenize } from '../../../lib/retrieval'

// 03 · The Lost Synonym. Two descriptions of one failure: the words of the
// person who had it (the source) and the words of someone searching for it.
// Every word is checked against the frozen v1 data, read-only: does the
// source say it, does only the index's added description say it, or does
// nobody? Nothing here re-ranks or re-labels Four Words.

const QUERIES = queriesFile.queries as Array<{ id: string; query: string; relevant: string[] }>
const postings = artifact.indexes.baseline.fields.text!.postings

type Meeting = 'source' | 'index' | 'nobody'

function recordTokens(sourceId: string) {
  const r = recordBySource.get(sourceId)
  const byField = new Map<string, string>()
  if (!r) return byField
  for (const [field, text] of Object.entries(recordFields(r))) {
    for (const t of tokenize(text)) if (!byField.has(t)) byField.set(t, field)
  }
  return byField
}

function meet(sourceId: string, text: string) {
  const fields = recordTokens(sourceId)
  return [...new Set(tokenize(text))].map((term) => {
    const meeting: Meeting = postings[term]?.[sourceId] ? 'source' : fields.has(term) ? 'index' : 'nobody'
    return { term, meeting, field: fields.get(term) }
  })
}

const rankOf = (system: 'baseline' | 'structured', q: string, id: string) => {
  const i = search(artifact.indexes[system], q).hits.findIndex((h) => h.id === id)
  return i === -1 ? null : i + 1
}

// The whole frozen label set, tallied the same way, so the visitor can set one
// example against all 64 labelled query–source pairs.
const TALLY = (() => {
  const t = { pairs: 0, words: 0, source: 0, index: 0, nobody: 0, fullyMet: 0 }
  for (const q of QUERIES)
    for (const s of q.relevant) {
      const m = meet(s, q.query)
      t.pairs++
      t.words += m.length
      for (const w of m) t[w.meeting]++
      if (m.every((w) => w.meeting === 'source')) t.fullyMet++
    }
  return t
})()

const ISSUES_FIRST = [...artifact.sources].sort(
  (a, b) => Number(b.kind === 'issue') - Number(a.kind === 'issue') || a.title.localeCompare(b.title),
)

const LABEL: Record<Meeting, string> = {
  source: 'the source says it',
  index: 'only the index’s description says it',
  nobody: 'nobody says it',
}

function Rank({ rank }: { rank: number | null }) {
  return rank ? (
    <>
      ranks this source <strong>#{rank}</strong>
    </>
  ) : (
    <strong>does not match it at all</strong>
  )
}

export default function LostSynonym() {
  const id = useId()
  const [sourceId, setSourceId] = useState('vite-issue-8073-base-mime')
  const labelled = QUERIES.filter((q) => q.relevant.includes(sourceId))
  const [text, setText] = useState(labelled[0]?.query ?? '')
  const words = useMemo(() => meet(sourceId, text), [sourceId, text])
  const source = sourceById.get(sourceId)!
  const ranks = useMemo(
    () => ({ baseline: rankOf('baseline', text, sourceId), structured: rankOf('structured', text, sourceId) }),
    [text, sourceId],
  )
  const counts = { source: 0, index: 0, nobody: 0 }
  for (const w of words) counts[w.meeting]++
  const pct = (n: number) => `${Math.round((100 * n) / TALLY.words)}%`

  return (
    <div className="x03">
      <div className="x03__controls">
        <label htmlFor={`${id}-src`}>The person who had the problem wrote</label>
        <select
          id={`${id}-src`}
          value={sourceId}
          onChange={(e) => {
            setSourceId(e.target.value)
            const first = QUERIES.find((q) => q.relevant.includes(e.target.value))
            setText(first?.query ?? '')
          }}
        >
          {ISSUES_FIRST.map((s) => (
            <option key={s.id} value={s.id}>
              {s.kind === 'issue' ? 'Issue · ' : ''}
              {s.title.slice(0, 70)}
            </option>
          ))}
        </select>
        <p className="x03__src">
          <a href={source.url}>{source.repo}</a> · {source.kind} · pinned at <code>{source.revision.slice(0, 10)}</code>
        </p>
      </div>

      <div className="x03__controls">
        <label htmlFor={`${id}-q`}>Someone looking for it types</label>
        <input id={`${id}-q`} value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} />
        {labelled.length > 0 && (
          <p className="x03__presets">
            <span>Frozen queries labelled relevant to this source:</span>
            {labelled.map((q, i) => (
              <button
                key={q.id}
                type="button"
                className="lab-btn"
                aria-pressed={text === q.query}
                onClick={() => setText(q.query)}
                data-probe={i === 1 ? 'click' : undefined}
              >
                {q.query}
              </button>
            ))}
          </p>
        )}
      </div>

      <ol className="x03__words" aria-label="Where each searched word meets the source" data-observe>
        {words.length === 0 && <li className="x03__empty">No searchable words yet.</li>}
        {words.map((w) => (
          <li key={w.term} className={`x03__w x03__w--${w.meeting}`}>
            <span className="x03__term">{w.term}</span>
            <span className="x03__how">
              {LABEL[w.meeting]}
              {w.meeting === 'index' && w.field ? ` (in its ${w.field})` : ''}
            </span>
          </li>
        ))}
      </ol>

      <p className="x03__verdict" role="status">
        {words.length > 0 && (
          <>
            {counts.source} of {words.length} words meet in the source’s own text, {counts.index} only through the
            index, {counts.nobody} nowhere. Plain keyword search <Rank rank={ranks.baseline} />; the problem-oriented
            index <Rank rank={ranks.structured} />.
          </>
        )}
      </p>

      <aside className="x03__tally" aria-label="Across every labelled pair">
        <p>
          Across all {TALLY.pairs} query–source pairs the v1 labeller marked relevant ({TALLY.words} words):
        </p>
        <div className="x03__bar" aria-hidden="true">
          <span className="x03__bar--source" style={{ flexGrow: TALLY.source }} />
          <span className="x03__bar--index" style={{ flexGrow: TALLY.index }} />
          <span className="x03__bar--nobody" style={{ flexGrow: TALLY.nobody }} />
        </div>
        <p className="lab-out">
          source {TALLY.source} ({pct(TALLY.source)}) · index only {TALLY.index} ({pct(TALLY.index)}) · nobody{' '}
          {TALLY.nobody} ({pct(TALLY.nobody)}) · pairs where every word meets the source: {TALLY.fullyMet} of{' '}
          {TALLY.pairs}
        </p>
      </aside>
    </div>
  )
}
