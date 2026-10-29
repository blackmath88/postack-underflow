import { useMemo, useState } from 'react'
import { artifact, recordBySource } from '../../../lib/four-words-data'
import type { ProblemRecord } from '../../../lib/records'
import { CORRECTION_RECORD, PARTS } from '../../../data/problem-desk'
import { KIT_CORRECTION } from '../../data/memory-fixtures'
import { QUERIES, indexCopy, topIds } from './copy-index'

// 51 · A Correction Travels. One attributable correction to one v1 record,
// applied to an in-browser copy of the records only. The map follows it to
// five places that read the records: the 27 frozen queries' top three, the
// controlled-term shelves, the records that link to it, the frozen results
// file and the source itself. A demonstration, never an evaluation.

interface Correction {
  id: string
  by: string
  provenance: string
  fixture: boolean
  target: string
  says: string
  apply: (r: ProblemRecord) => ProblemRecord
}

const lenaPart = PARTS.find((p) => p.id === 'grounded')!

const CORRECTIONS: Correction[] = [
  {
    id: 'review',
    by: 'the v1 post-hoc review',
    provenance: 'Named as a known defect in FOUR-WORDS.md; kept in v1, listed for v2.',
    fixture: false,
    target: 'vite-issue-8073-base-mime',
    says: 'Remove the alias “Vite blank page on GitHub Pages works locally”: the source does not support it.',
    apply: (r) => ({ ...r, aliases: r.aliases.filter((a) => !/blank page/i.test(a)) }),
  },
  {
    id: 'lena',
    by: CORRECTION_RECORD.author,
    provenance: 'The grounded part of the Problem Desk’s invented correction.',
    fixture: true,
    target: lenaPart.target,
    says: `Add the symptom “${lenaPart.add}”.`,
    apply: (r) => ({ ...r, symptoms: [...r.symptoms, lenaPart.add] }),
  },
  {
    id: 'kit',
    by: KIT_CORRECTION.author,
    provenance: 'Invented for this pilot.',
    fixture: true,
    target: KIT_CORRECTION.target,
    says: KIT_CORRECTION.text,
    apply: (r) => ({ ...r, terms: r.terms.filter((t) => t !== 'jekyll') }),
  },
]

const FROZEN_COPY = indexCopy(artifact.records)
const before = new Map(QUERIES.map((q) => [q.id, topIds(FROZEN_COPY, q.query)]))
const inbound = (id: string) => artifact.records.filter((r) => r.related.some((x) => x.sourceId === id))

function travel(c: Correction) {
  const records = artifact.records.map((r) => (r.sourceId === c.target ? c.apply(r) : r))
  const index = indexCopy(records)
  const moved = QUERIES.flatMap((q) => {
    const after = topIds(index, q.query)
    const was = before.get(q.id)!
    return after.join() === was.join() ? [] : [{ q, was, after }]
  })
  const old = recordBySource.get(c.target)!
  const now = records.find((r) => r.sourceId === c.target)!
  const shelvesLost = old.terms.filter((t) => !now.terms.includes(t))
  const shelvesGained = now.terms.filter((t) => !old.terms.includes(t))
  return { moved, shelvesLost, shelvesGained, links: inbound(c.target) }
}

const short = (id: string) => id.replace(/-issue-(\d+).*/, '#$1')

export default function CorrectionTravels() {
  const [which, setWhich] = useState(0)
  const [applied, setApplied] = useState(false)
  const c = CORRECTIONS[which]!
  const t = useMemo(() => travel(c), [c])
  const reached = (n: number) => (applied && n > 0 ? 'reached' : 'not reached')

  return (
    <div className="x51">
      <p className="lab-fixture">Demonstration on a copy of the frozen records, in this tab only</p>
      <div className="x51__pick" role="group" aria-label="Choose a correction">
        {CORRECTIONS.map((k, i) => (
          <button
            key={k.id}
            type="button"
            className="lab-btn"
            aria-pressed={i === which}
            onClick={() => {
              setWhich(i)
              setApplied(false)
            }}
          >
            {k.fixture ? `${k.by} (fixture)` : k.by}
          </button>
        ))}
      </div>

      <div className="x51__map" data-observe>
        <section className={'x51__origin' + (applied ? ' is-applied' : '')} aria-label="The correction">
          <p className="x51__by">
            Correction by <strong>{c.by}</strong>
            {c.fixture && <span className="lab-fixture"> · invented</span>}
          </p>
          <p className="x51__says">{c.says}</p>
          <p className="x51__target">
            to the record for <code>{c.target}</code> · {c.provenance}
          </p>
          <button type="button" className="lab-btn x51__apply" aria-pressed={applied} onClick={() => setApplied((a) => !a)} data-probe="click">
            {applied ? 'Withdraw it from the copy' : 'Apply it to the copy'}
          </button>
        </section>

        <ol className="x51__routes" aria-label="Where the correction reaches">
          <li data-state={reached(t.moved.length)}>
            <h3>The 27 frozen queries, top three</h3>
            <p className="x51__stamp">{reached(t.moved.length)}</p>
            <ul className="x51__tiles" aria-label="Queries">
              {QUERIES.map((q) => {
                const hit = applied && t.moved.some((m) => m.q.id === q.id)
                return (
                  <li key={q.id} className={hit ? 'is-moved' : undefined} title={q.query}>
                    {q.id.slice(1)}
                    {hit && <span className="visually-hidden"> changed</span>}
                  </li>
                )
              })}
            </ul>
            {applied &&
              t.moved.map((m) => (
                <p key={m.q.id} className="lab-out">
                  {m.q.id} “{m.q.query}”: {m.was.map(short).join(', ')} → {m.after.map(short).join(', ')}
                </p>
              ))}
            {applied && t.moved.length === 0 && <p className="lab-out">No query’s top three moves.</p>}
          </li>
          <li data-state={reached(t.shelvesLost.length + t.shelvesGained.length)}>
            <h3>Controlled-term shelves</h3>
            <p className="x51__stamp">{reached(t.shelvesLost.length + t.shelvesGained.length)}</p>
            <p className="lab-out">
              {applied && t.shelvesLost.length
                ? `Leaves the “${t.shelvesLost.join('”, “')}” shelf.`
                : 'Stays on every shelf it was on.'}
            </p>
          </li>
          <li data-state="not reached">
            <h3>Records that link to it</h3>
            <p className="x51__stamp">not reached</p>
            <p className="lab-out">
              {t.links.length} {t.links.length === 1 ? 'record links' : 'records link'} here (
              {t.links.map((r) => short(r.sourceId)).join(', ') || 'none'}). Their notes are their own; nothing tells them.
            </p>
          </li>
          <li data-state="not reached">
            <h3>The frozen v1 results</h3>
            <p className="x51__stamp">not reached</p>
            <p className="lab-out">Pinned. The published numbers describe the uncorrected records, permanently.</p>
          </li>
          <li data-state="not reached">
            <h3>The source</h3>
            <p className="x51__stamp">not reached</p>
            <p className="lab-out">The correction is about the index’s description. The pinned source never changes.</p>
          </li>
        </ol>
      </div>
    </div>
  )
}
