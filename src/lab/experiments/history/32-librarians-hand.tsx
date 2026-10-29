import { useState } from 'react'
import { artifact, sourceById } from '../../../lib/four-words-data'
import { CONTROLLED_TERMS } from '../../../lib/records'
import { HANDS, cardLines, tally, type Hand } from './32-hands'

// 32 · The Librarian's Hand. One frozen v1 record drawn as a catalogue card on
// which every line is inked by the hand that decided it. Lift a hand and its
// ink leaves the card; the tally says what is left and who it belongs to.
// Reads the frozen records and sources, read-only.

const RECORDS = [...artifact.records].sort((a, b) => a.sourceId.localeCompare(b.sourceId))
const START = Math.max(0, RECORDS.findIndex((r) => r.sourceId === 'vite-issue-9119-underscore-chunk'))
const MARK = Object.fromEntries(HANDS.map((h) => [h.id, h.mark])) as Record<Hand, string>
const NAME = Object.fromEntries(HANDS.map((h) => [h.id, h.name])) as Record<Hand, string>

export default function LibrariansHand() {
  const [ix, setIx] = useState(START)
  const [lifted, setLifted] = useState<Hand[]>([])
  const record = RECORDS[ix]!
  const source = sourceById.get(record.sourceId)
  const lines = cardLines(record, source)
  const on = (h: Hand) => !lifted.includes(h)
  const toggle = (h: Hand) => setLifted((l) => (l.includes(h) ? l.filter((x) => x !== h) : [...l, h]))

  const counts = tally(lines, CONTROLLED_TERMS, record.terms)
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const left = HANDS.reduce((n, h) => n + (on(h.id) ? counts[h.id] : 0), 0)
  const ticks = on('writer') ? record.terms : []
  const filedUnder = ticks[0]
  const visible = lines.filter((l) => on(l.hand))

  return (
    <div className="x32">
      <div className="x32__controls">
        <label className="x32__pick">
          Card
          <select value={ix} onChange={(e) => setIx(Number(e.target.value))}>
            {RECORDS.map((r, i) => (
              <option key={r.sourceId} value={i}>
                {r.sourceId}
              </option>
            ))}
          </select>
        </label>
        <div className="x32__hands" role="group" aria-label="Hands on this card. Press to lift a hand’s ink off the card.">
          {HANDS.map((h) => (
            <button
              key={h.id}
              type="button"
              className={`x32__hand x32__hand--${h.id}`}
              aria-pressed={!on(h.id)}
              onClick={() => toggle(h.id)}
              data-probe={h.id === 'writer' ? 'click' : undefined}
            >
              <span className="x32__mark" aria-hidden="true">
                {h.mark}
              </span>
              <span>
                <strong>{on(h.id) ? 'Lift' : 'Return'}</strong> {h.name.toLowerCase()}
                <small>{h.who}</small>
              </span>
            </button>
          ))}
        </div>
      </div>

      <article className="x32__card" data-observe aria-label={`Catalogue card for ${record.sourceId}`}>
        <header className="x32__head">
          <span className="x32__filed">
            Filed under: {filedUnder ? <strong className="x32__ink--writer">{filedUnder}</strong> : <em>nowhere</em>}
          </span>
          <span className="x32__id">{record.sourceId}</span>
        </header>

        <dl className="x32__lines">
          {visible.length === 0 && <p className="x32__blank">The card is blank.</p>}
          {visible.map((l, i) => (
            <div key={i} className={`x32__line x32__ink--${l.hand}`}>
              <dt>
                <span className="x32__mark" aria-label={NAME[l.hand]}>
                  {MARK[l.hand]}
                </span>{' '}
                {l.field}
              </dt>
              <dd>{l.text}</dd>
            </div>
          ))}
        </dl>

        {on('form') ? (
          <fieldset className="x32__form">
            <legend>
              <span className="x32__mark" aria-label={NAME.form}>
                C
              </span>{' '}
              Headings (tick one or more)
            </legend>
            <ul>
              {CONTROLLED_TERMS.map((t) => (
                <li key={t} className={ticks.includes(t) ? 'is-ticked' : undefined}>
                  <span aria-hidden="true">{ticks.includes(t) ? '☒' : '☐'}</span> {t}
                  {ticks.includes(t) && <span className="visually-hidden"> (ticked by the record writer)</span>}
                </li>
              ))}
            </ul>
          </fieldset>
        ) : (
          ticks.length > 0 && (
            <p className="x32__ink--writer x32__loose">
              <span className="x32__mark">D</span> Ticks with no form to sit in: {ticks.join(', ')}
            </p>
          )
        )}

        <p className="x32__review">
          <span className="x32__mark" aria-label={NAME.reviewer}>
            E
          </span>{' '}
          Reviewed by: <span className="x32__rule">{' '}</span>
        </p>

        <footer className="x32__tally" role="status">
          {left} of {total} words remain.{' '}
          {HANDS.map((h) => `${h.mark} ${counts[h.id]}`).join(' · ')}.{' '}
          {on('writer')
            ? `The record writer wrote ${Math.round((100 * counts.writer) / total)}% of this card.`
            : 'Without the record writer the card cannot be filed: nothing is ticked.'}
        </footer>
      </article>
    </div>
  )
}
