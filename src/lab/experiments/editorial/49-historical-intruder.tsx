import { useState } from 'react'
import { EVIDENCE_LABEL, KIND_LABEL, NOTES, type MarginNote, type NoteId } from '../../../content/margin'
import { SOURCES } from '../../../content/sources'
// Imported from the module's files, not its index, so Motte.tsx and its stylesheet stay out of the build.
import { MotteSprite } from '../../../features/motte/MotteSprite'
import { publicHistoryFlags, type HistoryFlag } from '../../../features/motte/history'
import { BEATS } from './essay'

// 49 · The Historical Intruder. Motte, the archive moth, as editorial
// marginalia: it may interrupt the reading only from the margin, and only with
// a margin note that already exists, showing that note's evidence status. A
// rule decides which notes it may bring. The strictest rule is Motte's own
// contract: each note is turned into a HistoryFlag and passed through
// publicHistoryFlags from src/features/motte, unmodified. Motte is imported,
// never changed; no history is written here.

type Rule = 'contract' | 'checked' | 'history'
const RULE_LABEL: Record<Rule, string> = {
  contract: 'Motte’s contract: history notes that pass publicHistoryFlags',
  checked: 'Any note that would pass the same filter, whatever its kind',
  history: 'Every history note, checked or not',
}

const CHAPTERS = ['opening', 'indexing', 'community', 'convergence'] as const
type FlagChapter = (typeof CHAPTERS)[number]
const isFlagChapter = (c: string): c is FlagChapter => (CHAPTERS as readonly string[]).includes(c)

/** A margin note in the shape Motte's history module accepts. */
function asFlag(id: NoteId, note: MarginNote): HistoryFlag | null {
  if (!isFlagChapter(note.chapter)) return null
  const first = note.sources?.[0]
  const src = first ? SOURCES[first] : undefined
  return {
    id,
    chapter: note.chapter,
    heading: note.title,
    observation: note.summary,
    sourceLabel: src?.title ?? '',
    sourceUrl: src && !('private' in src && src.private) ? src.url : '',
    evidenceStatus: note.evidence === 'checked' ? 'verified' : 'needs-review',
  }
}

const ALL = (Object.keys(NOTES) as NoteId[]).flatMap((id) => {
  const f = asFlag(id, NOTES[id])
  return f ? [f] : []
})

const ALLOWED: Record<Rule, Set<string>> = {
  contract: new Set(publicHistoryFlags(ALL.filter((f) => NOTES[f.id as NoteId].kind === 'history')).map((f) => f.id)),
  checked: new Set(publicHistoryFlags(ALL).map((f) => f.id)),
  history: new Set((Object.keys(NOTES) as NoteId[]).filter((id) => NOTES[id].kind === 'history')),
}

// The reading: every noted beat of the essay, in order.
const READING = BEATS.filter((b) => b.notes.length > 0)

export default function HistoricalIntruder() {
  const [rule, setRule] = useState<Rule>('contract')
  const [at, setAt] = useState(0)
  const [waved, setWaved] = useState<string[]>([])
  const [opened, setOpened] = useState<string[]>([])

  const allowed = ALLOWED[rule]
  const beat = READING[at]!
  const intruding = beat.notes.find((n) => allowed.has(n.id) && !waved.includes(n.id))
  const met = READING.slice(0, at + 1).flatMap((b) => b.notes).filter((n) => allowed.has(n.id)).length
  const possible = READING.flatMap((b) => b.notes).filter((n) => allowed.has(n.id)).length

  const changeRule = (r: Rule) => {
    setRule(r)
    setWaved([])
    setOpened([])
  }

  return (
    <div className="x49">
      <fieldset className="x49__rule">
        <legend>Motte may interrupt with</legend>
        {(Object.keys(RULE_LABEL) as Rule[]).map((r) => (
          <label key={r}>
            <input type="radio" name="x49-rule" checked={rule === r} onChange={() => changeRule(r)} /> {RULE_LABEL[r]}{' '}
            <span className="x49__n">({ALLOWED[r].size})</span>
          </label>
        ))}
      </fieldset>

      <div className="x49__spread">
        <div className="x49__column">
          <p className="x49__where">
            {beat.chapter} · passage {at + 1} of {READING.length}
          </p>
          {READING.slice(Math.max(0, at - 1), at + 1).map((b) => (
            <p key={b.text} className={b === beat ? 'x49__now' : 'x49__before'}>
              {b.text}
            </p>
          ))}
          <div className="x49__hands">
            <button type="button" className="lab-btn" onClick={() => setAt((n) => Math.max(0, n - 1))} disabled={at === 0}>
              ← Back
            </button>
            <button type="button" className="lab-btn" onClick={() => setAt((n) => Math.min(READING.length - 1, n + 1))} disabled={at === READING.length - 1} data-probe="click">
              Read on →
            </button>
          </div>
        </div>

        <aside className="x49__margin" aria-label="Margin">
          {intruding ? (
            <div className="x49__flag">
              <MotteSprite pose="flag" size={40} className="x49__motte" />
              <p className="x49__kind">
                {KIND_LABEL[NOTES[intruding.id].kind]} · <strong>{NOTES[intruding.id].evidence}</strong>
              </p>
              <p className="x49__title">{NOTES[intruding.id].title}</p>
              <p className="x49__ev">{EVIDENCE_LABEL[NOTES[intruding.id].evidence]}</p>
              {opened.includes(intruding.id) && <p className="x49__summary">{NOTES[intruding.id].summary}</p>}
              <div className="x49__flag-hands">
                {!opened.includes(intruding.id) && (
                  <button type="button" className="lab-btn" onClick={() => setOpened((o) => [...o, intruding.id])}>
                    What is it?
                  </button>
                )}
                <button type="button" className="lab-btn" onClick={() => setWaved((w) => [...w, intruding.id])}>
                  Not now
                </button>
              </div>
            </div>
          ) : (
            <div className="x49__rest">
              <MotteSprite pose="sleep" size={32} className="x49__motte" />
              <p>{possible === 0 ? 'Asleep. Nothing in the essay passes this rule.' : 'Asleep. Nothing to bring here.'}</p>
            </div>
          )}
        </aside>
      </div>

      <p className="x49__log" role="status" data-observe>
        Passage {at + 1}: Motte has had {met} {met === 1 ? 'chance' : 'chances'} to interrupt so far, of {possible} in the
        whole essay under this rule.
        {intruding ? ` It is in the margin now, with a note marked “${NOTES[intruding.id].evidence}”.` : ''}
      </p>
    </div>
  )
}
