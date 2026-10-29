import { useId, useMemo, useState } from 'react'
import { artifact, sourceById } from '../../../lib/four-words-data'
import type { ProblemRecord } from '../../../lib/records'
import { shortName } from './logic'

// 07 · The Held Place. All 30 frozen v1 records on one shelf, filed under one
// of their own controlled terms. The scheme decides which: the first term the
// record writer listed (the drawer of pilot 31), the last, the rarest in the
// corpus, or the commonest. Hold one record and its slot stays put while the
// other 29 refile around it. The question is what the held place is still
// worth: does the record keep neighbours it has anything in common with?

const RECORDS = artifact.records
const FREQ: Record<string, number> = {}
for (const r of RECORDS) for (const t of r.terms) FREQ[t] = (FREQ[t] ?? 0) + 1

type SchemeId = 'first' | 'last' | 'rarest' | 'commonest'
const SCHEMES: Array<{ id: SchemeId; name: string; mark: (r: ProblemRecord) => string }> = [
  { id: 'first', name: 'first term listed', mark: (r) => r.terms[0]! },
  { id: 'last', name: 'last term listed', mark: (r) => r.terms[r.terms.length - 1]! },
  {
    id: 'rarest',
    name: 'rarest term',
    mark: (r) => [...r.terms].sort((a, b) => FREQ[a]! - FREQ[b]! || a.localeCompare(b))[0]!,
  },
  {
    id: 'commonest',
    name: 'commonest term',
    mark: (r) => [...r.terms].sort((a, b) => FREQ[b]! - FREQ[a]! || a.localeCompare(b))[0]!,
  },
]
const schemeOf = (id: SchemeId) => SCHEMES.find((s) => s.id === id)!

function shelve(id: SchemeId) {
  const mark = schemeOf(id).mark
  return [...RECORDS].sort((a, b) => mark(a).localeCompare(mark(b)) || a.sourceId.localeCompare(b.sourceId)).map((r) => r.sourceId)
}

/** Keep `held` at `slot`; let everything else take the scheme's order around it. */
function hold(order: string[], held: string, slot: number) {
  const rest = order.filter((x) => x !== held)
  rest.splice(slot, 0, held)
  return rest
}

const byId = new Map(RECORDS.map((r) => [r.sourceId, r]))
const shared = (a: string, b?: string) => (b ? byId.get(a)!.terms.filter((t) => byId.get(b)!.terms.includes(t)) : [])
const sides = (order: string[], id: string) => {
  const i = order.indexOf(id)
  return [order[i - 1], order[i + 1]]
}

const HOME: SchemeId = 'first'
const HOME_ORDER = shelve(HOME)

/** For every record, held from the first-term shelf into `to`: does a neighbour share a term? */
function tally(to: SchemeId) {
  const natural = shelve(to)
  let held = 0
  let filed = 0
  for (const r of RECORDS) {
    const id = r.sourceId
    if (sides(hold(natural, id, HOME_ORDER.indexOf(id)), id).some((n) => shared(id, n).length)) held++
    if (sides(natural, id).some((n) => shared(id, n).length)) filed++
  }
  return { held, filed }
}

export default function HeldPlace() {
  const id = useId()
  const [scheme, setScheme] = useState<SchemeId>(HOME)
  const [heldId, setHeldId] = useState('tanstack-router-deploy')
  const [holding, setHolding] = useState(true)

  const natural = useMemo(() => shelve(scheme), [scheme])
  const slot = HOME_ORDER.indexOf(heldId)
  const order = holding ? hold(natural, heldId, slot) : natural
  const mark = schemeOf(scheme).mark
  const t = useMemo(() => tally(scheme), [scheme])
  const [left, right] = sides(order, heldId)
  const wouldBe = natural.indexOf(heldId)

  return (
    <div className="x07">
      <div className="x07__controls">
        <div role="group" aria-label="File the shelf by" className="x07__schemes">
          <span className="x07__lab">File each record under its</span>
          {SCHEMES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className="lab-btn"
              aria-pressed={scheme === s.id}
              onClick={() => setScheme(s.id)}
              data-probe={i === 2 ? 'click' : undefined}
            >
              {s.name}
            </button>
          ))}
        </div>
        <div className="x07__hold">
          <label htmlFor={`${id}-held`}>Hold the place of</label>
          <select id={`${id}-held`} value={heldId} onChange={(e) => setHeldId(e.target.value)}>
            {HOME_ORDER.map((r) => (
              <option key={r} value={r}>
                {shortName(sourceById.get(r)!, 60)}
              </option>
            ))}
          </select>
          <label className="x07__toggle">
            <input type="checkbox" checked={holding} onChange={(e) => setHolding(e.target.checked)} /> keep it at slot {slot + 1},
            where the first-term shelf put it
          </label>
        </div>
      </div>

      <ol className="x07__shelf" aria-label={`Shelf filed by ${schemeOf(scheme).name}`}>
        {order.flatMap((r, i) => {
          const m = mark(byId.get(r)!)
          const isHeld = r === heldId
          // A guide card goes in front of the first spine of each term; the
          // held record does not get one, since it is not filed there.
          const before = order.slice(0, i).filter((x) => x !== heldId)
          const prev = before[before.length - 1]
          const guide = !isHeld && (!prev || mark(byId.get(prev)!) !== m)
          const spine = (
            <li key={r} className={`x07__spine${isHeld ? ' x07__spine--held' : ''}`}>
              <span className="x07__slot">{i + 1}</span>
              <span className="x07__name">{shortName(sourceById.get(r)!, 24)}</span>
              <span className="x07__mark">{isHeld ? `held · ${m}` : m}</span>
            </li>
          )
          return guide
            ? [
                <li key={`g-${m}`} className="x07__guide" aria-hidden="true">
                  {m}
                </li>,
                spine,
              ]
            : [spine]
        })}
      </ol>

      <section className="x07__read" data-observe aria-live="polite">
        <p>
          <strong>{shortName(sourceById.get(heldId)!, 60)}</strong> is filed under <code>{mark(byId.get(heldId)!)}</code> in
          this scheme.{' '}
          {holding
            ? wouldBe === slot
              ? `The scheme would put it at slot ${slot + 1} anyway, so holding costs nothing here.`
              : `The scheme would put it at slot ${wouldBe + 1}; it is held at slot ${slot + 1}.`
            : `It sits at slot ${wouldBe + 1}.`}
        </p>
        <ul className="x07__sides">
          {[left, right].map((n, i) =>
            n ? (
              <li key={n}>
                {i === 0 ? 'Left' : 'Right'}: {shortName(sourceById.get(n)!, 50)}:{' '}
                {shared(heldId, n).length ? `shares ${shared(heldId, n).join(', ')}` : 'shares no term'}
              </li>
            ) : (
              <li key={i}>{i === 0 ? 'Left' : 'Right'}: end of the shelf</li>
            ),
          )}
        </ul>
        <p className="lab-out">
          {scheme === HOME
            ? 'This is the shelf the places were taken from. Choose another scheme to refile around the held record.'
            : `Holding each of the 30 in turn from the first-term shelf: ${t.held} keep a neighbour that shares a term. Filed where this scheme puts them: ${t.filed}.`}
        </p>
      </section>
    </div>
  )
}
