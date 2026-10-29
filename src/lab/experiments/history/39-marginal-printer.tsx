import { useState, type ReactNode } from 'react'
import { recordBySource } from '../../../lib/four-words-data'
import { ANNOTATIONS, REVISIONS, SOURCE_ID } from '../../data/history-printer'

// 39 · The Marginal Printer. A page printed from three plates: the text, a
// plate of marginal annotations, and an archival stamp. When the text is
// revised, each plate has to find its place again. Annotations can be
// registered by position (a character offset) or by quotation (the words they
// mark). The stamp is registered to a revision and cannot move. Revision 0 is
// a frozen v1 record field; the later revisions are invented edits.

type Mode = 'position' | 'quote'
const BASE = REVISIONS[0]!.text
const EXTRACTION = recordBySource.get(SOURCE_ID)?.extraction
const ANCHORS = ANNOTATIONS.map((a) => ({ ...a, start: BASE.indexOf(a.quote), length: a.quote.length }))

interface Placed {
  id: string
  note: string
  start: number | null
  /** How far, in characters, the plate sits from where its words are now. Null when the words are gone. */
  drift: number | null
  printsOver: string | null
}

function place(text: string, mode: Mode): Placed[] {
  return ANCHORS.map((a) => {
    const now = text.indexOf(a.quote)
    if (mode === 'quote') return { id: a.id, note: a.note, start: now === -1 ? null : now, drift: now === -1 ? null : 0, printsOver: now === -1 ? null : a.quote }
    const over = text.slice(a.start, a.start + a.length)
    return { id: a.id, note: a.note, start: a.start, drift: now === -1 ? null : Math.abs(now - a.start), printsOver: over }
  })
}

function printed(text: string, placed: Placed[]): ReactNode[] {
  const spans = placed.filter((p) => p.start !== null).sort((x, y) => x.start! - y.start!)
  const out: ReactNode[] = []
  let at = 0
  for (const p of spans) {
    const s = Math.max(p.start!, at)
    const e = p.start! + (ANCHORS.find((a) => a.id === p.id)?.length ?? 0)
    if (e <= s) continue
    out.push(text.slice(at, s))
    out.push(
      <mark key={p.id} className={'x39__hit' + (p.drift !== 0 ? ' is-off' : '')}>
        <sup>{p.id}</sup>
        {text.slice(s, e)}
      </mark>,
    )
    at = e
  }
  out.push(text.slice(at))
  return out
}

export default function MarginalPrinter() {
  const [rev, setRev] = useState(0)
  const [mode, setMode] = useState<Mode>('position')
  const text = REVISIONS[rev]!.text
  const placed = place(text, mode)
  const off = placed.filter((p) => p.drift !== null && p.drift > 0).length
  const lost = placed.filter((p) => p.drift === null)
  const silentMisprint = mode === 'position' ? placed.filter((p) => p.printsOver !== null && p.drift !== 0).length : 0
  const worst = Math.max(0, ...placed.map((p) => (p.drift === null ? (mode === 'position' ? 18 : 0) : p.drift)))
  const shift = Math.min(18, worst)

  return (
    <div className="x39">
      <div className="x39__controls">
        <fieldset>
          <legend>Register the annotation plate by</legend>
          <label>
            <input type="radio" name="x39-mode" checked={mode === 'position'} onChange={() => setMode('position')} /> position (a character offset)
          </label>
          <label>
            <input type="radio" name="x39-mode" checked={mode === 'quote'} onChange={() => setMode('quote')} /> quotation (the words it marks)
          </label>
        </fieldset>
        <div className="x39__press">
          <button type="button" className="lab-btn" onClick={() => setRev((r) => Math.min(REVISIONS.length - 1, r + 1))} disabled={rev === REVISIONS.length - 1} data-probe="click">
            Print the next revision
          </button>
          <button type="button" className="lab-btn" onClick={() => setRev(0)} disabled={rev === 0}>
            Back to revision 0
          </button>
        </div>
      </div>

      <div className="x39__sheet">
        <span className="x39__reg x39__reg--tl" aria-hidden="true" />
        <span className="x39__reg x39__reg--tr" aria-hidden="true" />
        <span className="x39__reg x39__reg--rose" aria-hidden="true" style={{ transform: `translate(${shift}px, ${shift / 3}px)` }} />
        <p className="x39__rev">
          Revision {rev} of {REVISIONS.length - 1}: {REVISIONS[rev]!.edit}
        </p>
        <p className="x39__text">{printed(text, placed)}</p>
        <ul className="x39__margin" aria-label="Annotation plate">
          {placed.map((p) => (
            <li key={p.id} className={p.drift === null ? 'is-lost' : p.drift ? 'is-off' : undefined}>
              <sup>{p.id}</sup> {p.note}
            </li>
          ))}
        </ul>
        <p className={'x39__stamp' + (rev > 0 ? ' is-stale' : '')}>
          {EXTRACTION ? `Extracted ${EXTRACTION.at} by ${EXTRACTION.by.split(',')[0]}. Not reviewed.` : 'Extraction unknown.'} Stamped on revision 0.
        </p>
      </div>

      <div className="x39__proof" data-observe role="status">
        <p>
          Revision {rev}, registered by {mode}.{' '}
          {off === 0 && lost.length === 0
            ? 'All three annotations sit on their words.'
            : `${off} ${off === 1 ? 'annotation prints' : 'annotations print'} off its words${lost.length ? `; ${lost.length} cannot find them` : ''}.`}{' '}
          {rev > 0 ? `The stamp still describes revision 0.` : 'The stamp describes this text.'}
        </p>
        <ul>
          {placed.map((p) => (
            <li key={p.id}>
              <sup>{p.id}</sup>{' '}
              {p.drift === null
                ? mode === 'quote'
                  ? 'its words are gone: left off the sheet, visibly'
                  : `its words are gone, and it still prints over “${p.printsOver}”`
                : p.drift === 0
                  ? 'registered'
                  : `${p.drift} characters out, printed over “${p.printsOver}”`}
            </li>
          ))}
        </ul>
        {silentMisprint > 0 && <p className="x39__warn">Nothing on the sheet says these are misprints: the plate prints confidently in the wrong place.</p>}
      </div>
    </div>
  )
}
