import { useState } from 'react'
import { CHAPTER_LABEL, EVIDENCE_LABEL, NOTES, type MarginNote } from '../../../content/margin'
import { SOURCES } from '../../../content/sources'
// Imported from the module's own files, not its index, so Motte's fixed-position
// stylesheet is not pulled onto every page.
import { MotteSprite } from '../../../features/motte/MotteSprite'
import { historyFlags, publicHistoryFlags, type HistoryChapter, type HistoryFlag } from '../../../features/motte/history'

// 38 · Motte's Historical Flags. Motte may only raise a flag that passes
// publicHistoryFlags. Its own list, historyFlags, is empty. This sieve tries
// the essay's real margin notes as candidates, one stage at a time, and shows
// what falls out where. The mapping from a note to a HistoryFlag (checked →
// verified, first source → sourceUrl) is ours, written only to run the
// filter; no note is rewritten and none is shown as a historical finding.

const CHAPTERS: HistoryChapter[] = ['opening', 'indexing', 'community', 'convergence']
const OWN = publicHistoryFlags(historyFlags)

interface Candidate {
  id: string
  note: MarginNote
  flag: HistoryFlag | null
}

const sourceUrl = (n: MarginNote) => {
  const id = n.sources?.[0]
  return id ? SOURCES[id].url : ''
}

const CANDIDATES: Candidate[] = Object.entries(NOTES).map(([id, note]) => ({
  id,
  note,
  flag: (CHAPTERS as string[]).includes(note.chapter)
    ? {
        id,
        chapter: note.chapter as HistoryChapter,
        heading: note.title,
        observation: note.summary,
        sourceLabel: note.sources?.[0] ?? '',
        sourceUrl: sourceUrl(note),
        evidenceStatus: note.evidence === 'checked' ? 'verified' : 'needs-review',
      }
    : null,
}))

export default function HistoricalFlags() {
  const [chapter, setChapter] = useState<HistoryChapter>('opening')
  const [kindTest, setKindTest] = useState(true)

  const inChapter = CANDIDATES.filter((c) => c.flag?.chapter === chapter)
  const history = inChapter.filter((c) => c.note.kind === 'history')
  const pool = kindTest ? history : inChapter
  const passIds = new Set(publicHistoryFlags(pool.map((c) => c.flag!)).map((f) => f.id))
  const passed = pool.filter((c) => passIds.has(c.id))
  const passedHistory = passed.filter((c) => c.note.kind === 'history')
  const withheld = history.filter((c) => !passIds.has(c.id))

  const stages = [
    { label: 'Motte’s own verified list', n: OWN.length },
    { label: `Margin notes in “${CHAPTER_LABEL[chapter]}”`, n: inChapter.length },
    { label: 'of which are history notes', n: history.length, skipped: !kindTest },
    { label: 'pass publicHistoryFlags (checked, with an https source)', n: passed.length },
  ]

  return (
    <div className="x38">
      <div className="x38__controls">
        <label>
          Chapter{' '}
          <select value={chapter} onChange={(e) => setChapter(e.target.value as HistoryChapter)} data-probe="click">
            {CHAPTERS.map((c) => (
              <option key={c} value={c}>
                {CHAPTER_LABEL[c]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <input type="checkbox" checked={kindTest} onChange={() => setKindTest((k) => !k)} /> Only history notes may pass (our test; the filter does
          not make it)
        </label>
      </div>

      <div className="x38__sieve" data-observe>
        <ol className="x38__stages">
          {stages.map((s, i) => (
            <li key={i} className={s.skipped ? 'is-skipped' : undefined} style={{ ['--w' as string]: Math.max(1, s.n) }}>
              <span className="x38__n">{s.skipped ? '–' : s.n}</span> {s.label}
              {s.skipped && ' (test switched off)'}
            </li>
          ))}
        </ol>

        <div className="x38__motte">
          <MotteSprite pose={passedHistory.length ? 'flag' : 'sleep'} size={56} />
          <div className="x38__flag">
            {passedHistory.length > 0 ? (
              <p>
                <strong>WHAT HISTORY TELLS US:</strong> {passedHistory.map((c) => c.note.title).join('; ')}
              </p>
            ) : (
              <p>
                <strong>Nothing verified to say</strong> about {CHAPTER_LABEL[chapter]}. The flag stays furled.
              </p>
            )}
          </div>
        </div>

        {passed.length > passedHistory.length && (
          <div className="x38__leak">
            <p>
              <strong>{passed.length - passedHistory.length} checked notes pass the filter but are not history.</strong> Motte would be allowed to
              raise them under “What history tells us”:
            </p>
            <ul>
              {passed
                .filter((c) => c.note.kind !== 'history')
                .map((c) => (
                  <li key={c.id}>
                    {c.note.title} <span className="x38__k">({c.note.kind})</span>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {withheld.length > 0 && (
          <div className="x38__withheld">
            <p>History notes Motte may not raise here:</p>
            <ul>
              {withheld.map((c) => (
                <li key={c.id}>
                  {c.note.title} <span className="x38__k">{EVIDENCE_LABEL[c.note.evidence]}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
