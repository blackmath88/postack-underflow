import { useState, type ReactNode } from 'react'
import { recordBySource } from '../../../lib/four-words-data'
import { REVISIONS, SOURCE_ID } from '../../data/history-printer'
import { ANCHORS, proof, type Mode, type Placed } from './39-plates'

// 39 · The Marginal Printer. The same revision printed twice, side by side.
// On the left the rose plate of annotations is registered by position (a
// character offset); on the right, by quotation (the words it marks). Each
// press prints the next revision on both sheets. The position sheet looks as
// confident as ever, and only its registration mark, off in the corner, gives
// it away; the quotation sheet holds, and when an annotation's words are
// deleted it says so in the margin. An archival stamp, registered to revision
// 0, sits under both. Revision 0 is a frozen v1 record field; the later
// revisions are invented edits (src/lab/data/history-printer.ts).

const EXTRACTION = recordBySource.get(SOURCE_ID)?.extraction
const LENGTH = Object.fromEntries(ANCHORS.map((a) => [a.id, a.length]))
const SHEETS: Array<{ mode: Mode; title: string; how: string }> = [
  { mode: 'position', title: 'Registered by position', how: 'Each annotation keeps its character offset in revision 0.' },
  { mode: 'quote', title: 'Registered by quotation', how: 'Each annotation looks for the words it marks.' },
]

function printed(text: string, placed: Placed[]): ReactNode[] {
  const spans = placed.filter((p) => p.start !== null).sort((x, y) => x.start! - y.start!)
  const out: ReactNode[] = []
  let at = 0
  for (const p of spans) {
    const s = Math.max(p.start!, at)
    const e = p.start! + (LENGTH[p.id] ?? 0)
    if (e <= s) continue
    out.push(text.slice(at, s))
    out.push(
      <mark key={p.id} className="x39__hit">
        <sup>{p.id}</sup>
        {text.slice(s, e)}
      </mark>,
    )
    at = e
  }
  out.push(text.slice(at))
  return out
}

function say(mode: Mode, p: ReturnType<typeof proof>) {
  if (p.right === 3) return 'all three on their words'
  const parts = []
  if (p.wrong) parts.push(`${p.wrong} of 3 print over the wrong words${mode === 'position' ? ', and the sheet shows no sign of it' : ''}`)
  if (p.off) parts.push(`${p.off} ${p.off === 1 ? 'is' : 'are'} left off, marked lost in the margin`)
  if (p.right) parts.push(`${p.right} on ${p.right === 1 ? 'its' : 'their'} words`)
  return parts.join('; ')
}

export default function MarginalPrinter() {
  const [rev, setRev] = useState(0)
  const text = REVISIONS[rev]!.text
  const proofs = SHEETS.map((s) => proof(text, s.mode))

  return (
    <div className="x39">
      <div className="x39__press">
        <button
          type="button"
          className="lab-btn x39__print"
          onClick={() => setRev((r) => Math.min(REVISIONS.length - 1, r + 1))}
          disabled={rev === REVISIONS.length - 1}
          data-probe="click"
        >
          {rev === 0 ? 'Print revision 1 on both sheets' : rev < REVISIONS.length - 1 ? `Print revision ${rev + 1}` : 'All revisions printed'}
        </button>
        <button type="button" className="lab-btn" onClick={() => setRev(0)} disabled={rev === 0}>
          Back to revision 0
        </button>
        <p className="x39__rev">
          On the press: revision {rev} of {REVISIONS.length - 1}. {REVISIONS[rev]!.edit}
        </p>
      </div>

      <div className="x39__pair">
        {SHEETS.map((s, i) => {
          const p = proofs[i]!
          // The rose plate's own registration mark is out by as much as its worst annotation.
          const worst = Math.max(0, ...p.placed.map((x) => (x.printsOver !== null && x.printsOver !== x.quote ? (x.drift ?? 30) : 0)))
          const shift = Math.min(14, worst / 3.5)
          return (
            <section key={s.mode} className={`x39__col x39__col--${s.mode}`} aria-labelledby={`x39-${s.mode}`}>
              <h3 id={`x39-${s.mode}`} className="x39__title">
                {s.title}
              </h3>
              <p className="x39__how">{s.how}</p>
              <div className="x39__sheet">
                <span className="x39__reg x39__reg--tl" aria-hidden="true" />
                <span className="x39__reg x39__reg--tr" aria-hidden="true" />
                <span className="x39__reg x39__reg--rose" aria-hidden="true" style={{ transform: `translate(${shift}px, ${shift / 2}px)` }} />
                <p className="x39__text">{printed(text, p.placed)}</p>
                <ul className="x39__margin" aria-label="Annotation plate">
                  {p.placed.map((x) => (
                    <li key={x.id} className={x.printsOver === null ? 'is-lost' : undefined}>
                      <sup>{x.id}</sup>{' '}
                      {x.printsOver === null ? (
                        <>
                          <span className="x39__lost">Lost: “{x.quote}” is not in this revision.</span> <s>{x.note}</s>
                        </>
                      ) : (
                        x.note
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`x39__check${p.wrong ? ' is-wrong' : ''}`}>
                <p className="x39__check-head">
                  Proof against the words: {p.right} of 3 right{p.wrong ? `, ${p.wrong} misprinted` : ''}
                  {p.off ? `, ${p.off} lost` : ''}
                </p>
                <ul>
                  {p.placed.map((x) => (
                    <li key={x.id}>
                      <sup>{x.id}</sup>{' '}
                      {x.printsOver === null
                        ? 'left off the sheet, and the margin says why'
                        : x.printsOver === x.quote
                          ? `on “${x.quote}”`
                          : `misprinted: over “${x.printsOver}”, meant for “${x.quote}”`}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )
        })}
      </div>

      <p className={'x39__stamp' + (rev > 0 ? ' is-stale' : '')}>
        {EXTRACTION ? `Extracted ${EXTRACTION.at} by ${EXTRACTION.by.split(',')[0]}. Not reviewed.` : 'Extraction unknown.'} Stamped on revision 0
        {rev > 0 ? `; this is revision ${rev}, and the stamp cannot move.` : '.'}
      </p>

      <p className="x39__status" role="status" data-observe>
        Revision {rev}. By position: {say('position', proofs[0]!)}. By quotation: {say('quote', proofs[1]!)}.
      </p>
    </div>
  )
}
