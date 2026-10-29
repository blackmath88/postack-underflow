import { useId, useRef, useState } from 'react'
import { artifact } from '../../../lib/four-words-data'
import { CONTROLLED_TERMS } from '../../../lib/records'
import { drawersOf, missingWords, placementKey, placementsOf, wordCheckTally, termWords, type Placement, type Postings } from './11-rod'
import { RECORDS, shortName } from './words'

// 11 · Above the Rod. Every controlled term in the frozen v1 records is a
// placement: one record filed under one guide. None of the 80 has been
// reviewed, so they all start above the rod, loose in the drawer, and a patron
// (who only sees rodded cards) finds every drawer empty. The visitor hands
// review to a word rule, which drops a card only when the pinned source uses
// every word of the term, and then looks into the drawers it leaves empty.
// A card can also be dropped on judgement, or lifted back. Reads records and
// baseline postings from the frozen artifact; writes nothing.

const POSTINGS = artifact.indexes.baseline.fields.text!.postings as Postings
const PLACEMENTS = placementsOf(RECORDS)
const DRAWERS = drawersOf(CONTROLLED_TERMS, PLACEMENTS, POSTINGS)
const TALLY = wordCheckTally(DRAWERS)
const START = 'underscore-paths'

/** Our reading of a few held cards, so the rule's mistakes and its one good catch are named. */
const READING: Record<string, string> = {
  'underscore-paths': 'Our reading: all five belong here. The sources write “_”, not the word, so a word rule cannot see it.',
  'trailing-slash': 'Our reading: both belong here. The sources write trailingSlash as one word.',
  'asset-404': 'Our reading: the rule is right once, about vite#8073, which never reports a 404. The other holds are wrong.',
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

export default function AboveTheRod() {
  const id = useId()
  const [rodded, setRodded] = useState<Set<string>>(() => new Set())
  const [ruled, setRuled] = useState(false)
  const [open, setOpen] = useState(START)
  const [note, setNote] = useState('Nothing has been reviewed. Every card is above the rod, so a patron finds every drawer empty.')
  const panel = useRef<HTMLDivElement>(null)

  const drawer = DRAWERS.find((d) => d.term === open)!
  const isIn = (p: Placement) => rodded.has(placementKey(p))
  const above = drawer.cards.filter((c) => !isIn(c))
  const below = drawer.cards.filter(isIn)
  const emptied = DRAWERS.filter((d) => d.cards.every((c) => !isIn(c))).map((d) => d.term)

  const runRule = () => {
    setRodded((s) => {
      const n = new Set(s)
      for (const d of DRAWERS) for (const c of d.passing) n.add(placementKey(c))
      return n
    })
    setRuled(true)
    setNote(
      `The word rule dropped ${TALLY.passed} of ${TALLY.total} cards and held ${TALLY.held}. ${plural(TALLY.emptied.length, 'drawer is', 'drawers are')} now empty to a patron: ${TALLY.emptied.join(' and ')}.`,
    )
  }

  const reset = () => {
    setRodded(new Set())
    setRuled(false)
    setNote('Back to the start: every card above the rod, every drawer empty to a patron.')
  }

  const drop = (c: Placement) => {
    setRodded((s) => new Set(s).add(placementKey(c)))
    setNote(`Dropped ${shortName(c.sourceId)} below the rod on judgement. A patron opening ${c.term} now finds it.`)
  }

  const lift = (c: Placement) => {
    setRodded((s) => {
      const n = new Set(s)
      n.delete(placementKey(c))
      return n
    })
    setNote(`Lifted ${shortName(c.sourceId)} above the rod. It is a proposal again, and a patron no longer sees it.`)
  }

  const choose = (term: string) => {
    setOpen(term)
    panel.current?.focus()
  }

  const patron =
    below.length > 0
      ? `A patron opening ${open} finds ${plural(below.length, 'card', 'cards')} of ${drawer.cards.length}.`
      : ruled && drawer.passing.length === 0
        ? `A patron opening ${open} finds an empty drawer. The word rule held all ${drawer.cards.length}.`
        : `A patron opening ${open} finds an empty drawer. Nothing in it has been reviewed.`

  return (
    <div className="x11">
      <div className="x11__desk">
        <p className="x11__lede">
          The frozen v1 index serves all {TALLY.total} placements as if a reviser had accepted them. Nobody has. Hand the
          review to a rule: a card drops below the rod only if its source uses every word of the guide’s term.
        </p>
        <div className="x11__acts">
          <button type="button" className={"x11__lever" + (ruled ? " is-done" : "")} onClick={runRule} data-probe="click">
            Let the word rule review all {TALLY.total} cards
          </button>
          <button type="button" className="lab-btn" onClick={reset} disabled={rodded.size === 0}>
            Put every card back above the rod
          </button>
        </div>
      </div>

      <div data-observe className="x11__observe">
        <p className="x11__note" role="status">
          {note}
        </p>

        <ul className="x11__cabinet" aria-label="The catalogue cabinet, one drawer per term">
          {DRAWERS.map((d) => {
            const held = d.cards.filter(isIn).length
            const empty = emptied.includes(d.term)
            return (
              <li key={d.term}>
                <button
                  type="button"
                  className={'x11__front' + (empty && ruled ? ' is-empty' : '')}
                  aria-pressed={open === d.term}
                  aria-label={`${d.term}: ${held} of ${d.cards.length} cards held by the rod${empty ? ', empty to a patron' : ''}`}
                  onClick={() => choose(d.term)}
                >
                  <span className="x11__holder">{d.term}</span>
                  <span className="x11__ticks" aria-hidden="true">
                    {d.cards.map((c) => (
                      <span key={c.sourceId} className={isIn(c) ? 'is-in' : undefined} />
                    ))}
                  </span>
                  <span className="x11__count" aria-hidden="true">
                    {held}/{d.cards.length}
                  </span>
                  {empty && ruled && (
                    <span className="x11__stamp" aria-hidden="true">
                      empty
                    </span>
                  )}
                  <span className="x11__pull" aria-hidden="true" />
                </button>
              </li>
            )
          })}
        </ul>

        <div className="x11__open" ref={panel} tabIndex={-1} aria-label={`Open drawer: ${open}`} role="region">
          <section className="x11__drawer" aria-label="The reviser’s side">
            <p className="x11__tab">{open}</p>
            <p className="x11__zone">Above the rod · proposed, {above.length}</p>
            <ul className="x11__cards x11__cards--above">
              {above.length === 0 && <li className="x11__none">Nothing loose.</li>}
              {above.map((c) => {
                const missing = missingWords(POSTINGS, c)
                return (
                  <li key={c.sourceId} className="x11__card">
                    <span className="x11__name">{shortName(c.sourceId)}</span>
                    <Check term={open} missing={missing} />
                    {ruled && missing.length > 0 && (
                      <span className="x11__why">held: the source never writes {missing.map((w) => `“${w}”`).join(' or ')}</span>
                    )}
                    <button type="button" className="lab-btn x11__act" onClick={() => drop(c)}>
                      Drop on judgement
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="x11__rod" aria-hidden="true" />
            <p className="x11__zone">Below the rod · accepted, {below.length}</p>
            <ul className="x11__cards x11__cards--below">
              {below.length === 0 && <li className="x11__none">The rod holds nothing here.</li>}
              {below.map((c) => (
                <li key={c.sourceId} className="x11__card is-rodded">
                  <span className="x11__name">{shortName(c.sourceId)}</span>
                  <Check term={open} missing={missingWords(POSTINGS, c)} />
                  <button type="button" className="lab-btn x11__act" onClick={() => lift(c)}>
                    Lift above
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className={'x11__patron' + (below.length === 0 ? ' is-empty' : '')} aria-label="The patron’s side">
            <p className="x11__zone">What a patron finds</p>
            <p className="x11__finds">{patron}</p>
            {below.length === 0 ? (
              <div className="x11__void" aria-hidden="true">
                <span>empty</span>
              </div>
            ) : (
              <ul className="x11__list">
                {below.map((c) => (
                  <li key={c.sourceId}>{shortName(c.sourceId)}</li>
                ))}
              </ul>
            )}
            {below.length < drawer.cards.length && (
              <p className="x11__still">
                A search still returns all {drawer.cards.length}: the frozen index never asks about the rod.
              </p>
            )}
            {ruled && READING[open] && <p className="x11__reading">{READING[open]}</p>}
          </section>
        </div>

        <p className="lab-out">
          held by the rod {rodded.size} of {TALLY.total} · the word rule alone would hold {TALLY.passed} · drawers empty to a
          patron {emptied.length} of {DRAWERS.length}
        </p>
      </div>
    </div>
  )
}

function Check({ term, missing }: { term: string; missing: string[] }) {
  return (
    <span className="x11__check">
      <span className="visually-hidden">Word check: {missing.length ? `the source never uses ${missing.join(', ')}` : 'the source uses every word'}.</span>
      {termWords(term).map((w) => {
        const said = !missing.includes(w)
        return (
          <span key={w} className={said ? 'is-said' : 'is-unsaid'} aria-hidden="true">
            {said ? '✓' : '✗'} {w}
          </span>
        )
      })}
    </span>
  )
}
