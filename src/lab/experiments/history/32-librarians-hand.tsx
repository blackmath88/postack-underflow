import { useState } from 'react'
import { artifact, sourceById } from '../../../lib/four-words-data'
import { CONTROLLED_TERMS } from '../../../lib/records'
import { HANDS, card, cardLines, median, type Hand } from './32-hands'

// 32 · The Librarian's Hand. One frozen v1 record drawn as a catalogue card on
// which every line is inked by the hand that decided it. The first act is to
// lift the agent's hand, the record writer's: its lines go blank and the card
// shows how little was anyone else's. The other hands lift too. Below, a rack
// of all 30 cards shows the writer's share on each and the reviewer's line,
// blank on every one. Reads the frozen records and sources, read-only.

const RECORDS = [...artifact.records].sort((a, b) => a.sourceId.localeCompare(b.sourceId))
const START = Math.max(0, RECORDS.findIndex((r) => r.sourceId === 'vite-issue-9119-underscore-chunk'))
const MARK = Object.fromEntries(HANDS.map((h) => [h.id, h.mark])) as Record<Hand, string>
const NAME = Object.fromEntries(HANDS.map((h) => [h.id, h.name])) as Record<Hand, string>
const CARDS = RECORDS.map((r) => card(r, sourceById.get(r.sourceId), CONTROLLED_TERMS))
const SHARES = CARDS.map((c) => c.writerShare)
const LOW = Math.min(...SHARES)
const HIGH = Math.max(...SHARES)
const MID = Math.round(median(CARDS.map((c) => c.writerExact)))
const REVIEWED = CARDS.filter((c) => c.reviewed).length
const OTHERS = HANDS.filter((h) => h.id !== 'writer')
const WRITER = HANDS.find((h) => h.id === 'writer')!

export default function LibrariansHand() {
  const [ix, setIx] = useState(START)
  const [lifted, setLifted] = useState<Hand[]>([])
  const record = RECORDS[ix]!
  const source = sourceById.get(record.sourceId)
  const lines = cardLines(record, source)
  const on = (h: Hand) => !lifted.includes(h)
  const toggle = (h: Hand) => setLifted((l) => (l.includes(h) ? l.filter((x) => x !== h) : [...l, h]))

  const { counts, total } = CARDS[ix]!
  const left = HANDS.reduce((n, h) => n + (on(h.id) ? counts[h.id] : 0), 0)
  const ticks = on('writer') ? record.terms : []
  const filedUnder = ticks[0]
  const writerOff = !on('writer')

  const status = writerOff
    ? `${left} of ${total} words remain on this card. Without the agent’s hand it keeps a title, a repository, a licence and a date, and cannot be filed: nothing is ticked.`
    : `${left} of ${total} words remain. The record writer, an AI agent, wrote ${Math.round((100 * counts.writer) / total)}% of this card.`

  return (
    <div className={'x32' + (writerOff ? ' is-writer-lifted' : '')}>
      <div className="x32__act">
        <button
          type="button"
          className="x32__lift"
          aria-pressed={writerOff}
          onClick={() => toggle('writer')}
          data-probe="click"
        >
          <span className="x32__mark x32__mark--big" aria-hidden="true">
            {WRITER.mark}
          </span>
          <span>
            <strong>{writerOff ? 'Return the agent’s hand' : 'Lift the agent’s hand'}</strong>
            <small>D, the record writer: {WRITER.who}</small>
          </span>
        </button>
        <p className="x32__status" role="status">
          {status}
        </p>
      </div>

      <article className="x32__card" data-observe aria-label={`Catalogue card for ${record.sourceId}`}>
        <header className="x32__head">
          <span className="x32__filed">
            Filed under: {filedUnder ? <strong className="x32__ink--writer">{filedUnder}</strong> : <em>nowhere</em>}
          </span>
          <span className="x32__id">{record.sourceId}</span>
        </header>

        <dl className="x32__lines">
          {lines.map((l, i) => (
            <div key={i} className={`x32__line x32__ink--${l.hand}` + (on(l.hand) ? '' : ' is-lifted')}>
              <dt>
                <span className="x32__mark" aria-label={NAME[l.hand]}>
                  {MARK[l.hand]}
                </span>{' '}
                {l.field}
              </dt>
              <dd>{on(l.hand) ? l.text : <span className="visually-hidden">lifted</span>}</dd>
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

        <div className="x32__review">
          <p className="x32__sign">
            <span className="x32__mark" aria-label={NAME.reviewer}>
              E
            </span>{' '}
            Reviewed by:
            <span className="x32__rule" aria-label="blank">
              {' '}
            </span>
          </p>
          <p className="x32__review-note">
            Blank. The record says it is not reviewed by a human, and so do the other {RECORDS.length - 1}.
          </p>
        </div>

        <footer className="x32__tally">
          {HANDS.map((h) => (
            <span key={h.id} className={on(h.id) ? undefined : 'is-off'}>
              {h.mark} {h.name.toLowerCase()} {counts[h.id]}
            </span>
          ))}
        </footer>
      </article>

      <div className="x32__side">
        <fieldset className="x32__others">
          <legend>The other hands</legend>
          {OTHERS.map((h) => (
            <button key={h.id} type="button" className={`x32__hand x32__hand--${h.id}`} aria-pressed={!on(h.id)} onClick={() => toggle(h.id)}>
              <span className="x32__mark" aria-hidden="true">
                {h.mark}
              </span>
              <span>
                <strong>{on(h.id) ? 'Lift' : 'Return'}</strong> {h.name.toLowerCase()} · {counts[h.id]} {counts[h.id] === 1 ? 'word' : 'words'}
                <small>{h.who}</small>
              </span>
            </button>
          ))}
        </fieldset>

        <fieldset className="x32__rack">
          <legend>All {RECORDS.length} cards: the agent’s share of each, and its reviewer’s line</legend>
          <p className="x32__rack-sum">
            The record writer wrote {LOW}% to {HIGH}% of every card (median {MID}%). Reviewed: {REVIEWED} of {RECORDS.length}.
          </p>
          <div className="x32__bars">
            {RECORDS.map((r, i) => (
              <label key={r.sourceId} className={'x32__bar' + (i === ix ? ' is-on' : '')} title={`${r.sourceId}: ${SHARES[i]}%`}>
                <input
                  type="radio"
                  name="x32-card"
                  checked={i === ix}
                  onChange={() => setIx(i)}
                  aria-label={`${r.sourceId}, record writer ${SHARES[i]}%, not reviewed`}
                />
                <span className="x32__bar-ink" style={{ height: `${SHARES[i]}%` }} aria-hidden="true" />
                <span className="x32__bar-review" aria-hidden="true" />
              </label>
            ))}
          </div>
          <p className="x32__rack-key" aria-hidden="true">
            <span className="x32__key-ink" /> record writer’s share <span className="x32__key-review" /> reviewer’s line, empty
          </p>
          <p className="x32__rack-now">Showing {record.sourceId}. Arrow keys move along the rack.</p>
        </fieldset>
      </div>
    </div>
  )
}
