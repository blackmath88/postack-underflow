import { useId, useState } from 'react'
import { CONTROLLED_TERMS } from '../../../lib/records'
import { RECORDS, shortName, sourceSays, termAttested, termWords } from './words'

// 11 · Above the Rod. Every controlled term in the frozen v1 records is a
// placement: one record filed under one guide. None of the 80 has been
// reviewed, so here they all start above the rod, loose in the drawer. The
// visitor, as reviser, drops cards below the rod one at a time, or under a
// stricter rule that only lets a card drop when the pinned source contains
// the words of the term. A patron opening the drawer sees only rodded cards.
// Reads records and baseline postings from the frozen artifact; writes nothing.

type Rule = 'judgement' | 'literal'

const key = (sourceId: string, term: string) => `${sourceId}|${term}`

const PLACEMENTS = RECORDS.flatMap((r) => r.terms.map((term) => ({ sourceId: r.sourceId, term })))
const PASSING = PLACEMENTS.filter((p) => termAttested(p.term, p.sourceId)).length

const cardsFor = (term: string) => PLACEMENTS.filter((p) => p.term === term)

function Check({ term, sourceId }: { term: string; sourceId: string }) {
  return (
    <span className="x11__check">
      {termWords(term).map((w) => (
        <span key={w} className={sourceSays(w, sourceId) ? 'is-said' : 'is-unsaid'}>
          {sourceSays(w, sourceId) ? '✓' : '✗'} {w}
        </span>
      ))}
    </span>
  )
}

export default function AboveTheRod() {
  const id = useId()
  const [term, setTerm] = useState<string>('base-path')
  const [rule, setRule] = useState<Rule>('judgement')
  const [rodded, setRodded] = useState<Set<string>>(() => new Set())
  const [note, setNote] = useState('All 80 placements are above the rod. Nobody has reviewed any of them.')

  const cards = cardsFor(term)
  const above = cards.filter((c) => !rodded.has(key(c.sourceId, c.term)))
  const below = cards.filter((c) => rodded.has(key(c.sourceId, c.term)))

  const drop = (sourceId: string) => {
    if (rule === 'literal' && !termAttested(term, sourceId)) {
      const missing = termWords(term).filter((w) => !sourceSays(w, sourceId))
      setNote(`Refused: the source for ${shortName(sourceId)} never uses the word ${missing.map((w) => `“${w}”`).join(' or ')}. The card stays above the rod.`)
      return
    }
    setRodded((s) => new Set(s).add(key(sourceId, term)))
    setNote(`Dropped ${shortName(sourceId)} below the rod under ${term}.`)
  }

  const lift = (sourceId: string) => {
    setRodded((s) => {
      const n = new Set(s)
      n.delete(key(sourceId, term))
      return n
    })
    setNote(`Lifted ${shortName(sourceId)} back above the rod. It is a proposal again.`)
  }

  const dropPassing = () => {
    const passing = above.filter((c) => termAttested(term, c.sourceId))
    setRodded((s) => {
      const n = new Set(s)
      for (const c of passing) n.add(key(c.sourceId, term))
      return n
    })
    const failing = above.length - passing.length
    setNote(
      `${passing.length} ${passing.length === 1 ? 'card passes' : 'cards pass'} the word check and ${passing.length === 1 ? 'drops' : 'drop'}; ${failing} ${failing === 1 ? 'stays' : 'stay'} above the rod.`,
    )
  }

  return (
    <div className="x11">
      <div className="x11__desk">
        <label htmlFor={`${id}-guide`} className="x11__label">
          Guide card
        </label>
        <select id={`${id}-guide`} value={term} onChange={(e) => setTerm(e.target.value)}>
          {CONTROLLED_TERMS.map((t) => (
            <option key={t} value={t}>
              {t} ({cardsFor(t).length})
            </option>
          ))}
        </select>
        <fieldset className="x11__rule">
          <legend>The reviser may drop a card</legend>
          <label>
            <input type="radio" name={`${id}-rule`} checked={rule === 'judgement'} onChange={() => setRule('judgement')} /> on
            judgement
          </label>
          <label>
            <input type="radio" name={`${id}-rule`} checked={rule === 'literal'} onChange={() => setRule('literal')} /> only if
            the source uses the term’s words
          </label>
        </fieldset>
        <button type="button" className="lab-btn" onClick={dropPassing} disabled={above.length === 0} data-probe="click">
          Drop every card that passes the word check
        </button>
      </div>

      <div className="x11__drawer" aria-label={`Drawer behind the guide card ${term}`} role="group">
        <p className="x11__tab">{term}</p>
        <p className="x11__zone">Above the rod · proposed, {above.length}</p>
        <ul className="x11__cards x11__cards--above">
          {above.length === 0 && <li className="x11__none">Nothing loose.</li>}
          {above.map((c) => (
            <li key={c.sourceId} className="x11__card">
              <span className="x11__name">{shortName(c.sourceId)}</span>
              <Check term={term} sourceId={c.sourceId} />
              <button type="button" className="lab-btn x11__act" onClick={() => drop(c.sourceId)}>
                Drop below the rod
              </button>
            </li>
          ))}
        </ul>
        <div className="x11__rod" aria-hidden="true" />
        <p className="x11__zone">Below the rod · accepted, {below.length}</p>
        <ul className="x11__cards x11__cards--below">
          {below.length === 0 && <li className="x11__none">No card is held by the rod.</li>}
          {below.map((c) => (
            <li key={c.sourceId} className="x11__card is-rodded">
              <span className="x11__name">{shortName(c.sourceId)}</span>
              <Check term={term} sourceId={c.sourceId} />
              <button type="button" className="lab-btn x11__act" onClick={() => lift(c.sourceId)}>
                Lift above
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p className="x11__note" role="status">
        {note}
      </p>

      <section className="x11__patron" aria-label="What a patron finds" data-observe>
        <p>
          A patron opening <strong>{term}</strong> finds{' '}
          {below.length === 0 ? 'an empty drawer' : `${below.length} ${below.length === 1 ? 'card' : 'cards'}: ${below.map((c) => shortName(c.sourceId)).join('; ')}`}
          .
        </p>
        <p className="lab-out">
          rodded {rodded.size} of {PLACEMENTS.length} placements · the frozen v1 index serves all {PLACEMENTS.length} as if
          rodded · {PASSING} of {PLACEMENTS.length} would pass the word check
        </p>
      </section>
    </div>
  )
}
