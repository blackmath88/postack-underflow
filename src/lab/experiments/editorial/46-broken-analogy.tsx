import { useState } from 'react'
import { NOTES, type NoteId } from '../../../content/margin'

// 46 · The Broken Analogy. The essay leans on two metaphors: the switchboard
// (for connections between owned contributions) and the card catalogue (for
// the index). Each press stretches the metaphor over one more feature of the
// thing it describes. Each correspondence either holds, strains or breaks,
// and the band between the two posts snaps when the strain reaches two.
// The historical side is only what the margin notes say, and is reported, not
// checked (PR #5). The order of the correspondences, and every verdict, is our
// reading; where the band snaps is therefore partly our choice, and the
// notebook says so.

type Fit = 'holds' | 'strains' | 'breaks'
const STRAIN: Record<Fit, number> = { holds: 0, strains: 1, breaks: 2 }
const SNAP_AT = 2

interface Point {
  old: string
  now: string
  fit: Fit
  why: string
  notes: NoteId[]
}

interface Analogy {
  name: string
  oldLabel: string
  nowLabel: string
  points: Point[]
}

const ANALOGIES: Analogy[] = [
  {
    name: 'The switchboard',
    oldLabel: 'A manual switchboard (reported)',
    nowLabel: 'Owned contributions and drawn connections',
    points: [
      {
        old: 'Each caller had their own line.',
        now: 'Each contribution is published by its author, where the author controls it.',
        fit: 'holds',
        why: 'Ownership of the endpoint maps cleanly.',
        notes: ['switchboardHistory', 'twoLayers'],
      },
      {
        old: 'The operator answered a request and made a temporary connection.',
        now: 'An interface draws a line between two contributions to show a thread or a map.',
        fit: 'holds',
        why: 'The view, like the operator, joins things it does not own.',
        notes: ['switchboardHistory', 'twoLayers'],
      },
      {
        old: 'Every connection was a choice, and the operator had real power over who could reach whom.',
        now: 'Whoever runs the popular view still decides what most people see.',
        fit: 'holds',
        why: 'It holds, uncomfortably: the metaphor keeps the power problem in view.',
        notes: ['switchboardHistory', 'portabilityLimits'],
      },
      {
        old: 'Pulling the cord ended the connection.',
        now: 'Removing every drawn line leaves the records, and the authors’ own references still sit inside them.',
        fit: 'strains',
        why: 'Unplugging removes the view’s reading, but not what the replies say they reply to.',
        notes: ['connectionNotEndorsement'],
      },
      {
        old: 'It kept nothing: when the cord came out, the conversation was gone.',
        now: 'The records stay; only the connections are temporary.',
        fit: 'breaks',
        why: 'Persistence is the whole point of the model, and the switchboard never had it. The note itself calls this our change to the metaphor.',
        notes: ['switchboardHistory', 'metaphorLimits'],
      },
      {
        old: 'Nothing in the notes: every connection described is the operator’s.',
        now: 'A model can propose a line; it can be disputed, but never accepted as an author’s statement.',
        fit: 'breaks',
        why: 'There is no counterpart for a third party guessing at connections.',
        notes: ['connectionNotEndorsement'],
      },
    ],
  },
  {
    name: 'The card catalogue',
    oldLabel: 'A library card catalogue (reported)',
    nowLabel: 'The Four Words description index',
    points: [
      {
        old: 'Somebody had already decided where each book belonged.',
        now: 'An AI agent wrote one description per document, and then everything was frozen.',
        fit: 'holds',
        why: 'Classification done before anyone asked, in both.',
        notes: ['cardCatalogue', 'frozenIndex'],
      },
      {
        old: 'Headings led to a book, and pointed on to neighbouring headings.',
        now: 'A shared controlled term, asset-404, made two reports neighbours.',
        fit: 'holds',
        why: 'Controlled vocabulary is the catalogue’s own idea.',
        notes: ['cardCatalogue', 'controlledVocab'],
      },
      {
        old: 'That labour shaped which books you could find.',
        now: 'Much of the advantage came from words the description writer added.',
        fit: 'holds',
        why: 'Prior labour shapes retrieval, in both.',
        notes: ['cardCatalogue', 'injected'],
      },
      {
        old: 'Classification is prior work, and it can be wrong.',
        now: 'One report never says 404; the label the index gave it does.',
        fit: 'holds',
        why: 'The metaphor predicts the error rather than hiding it.',
        notes: ['cardCatalogue', 'controlledVocab'],
      },
      {
        old: 'Catalogues distinguished provisional placements from accepted ones.',
        now: 'Each record says it is not yet reviewed by a human, and the ranking treats it exactly as if it were.',
        fit: 'strains',
        why: 'The index records the status of a classification but never acts on it.',
        notes: ['cardCatalogue', 'frozenIndex'],
      },
      {
        old: 'A catalogue’s authority came from institutions, trained staff and shared rules.',
        now: 'A loose network of contributors does not have them.',
        fit: 'breaks',
        why: 'The essay’s own counterpoint: the authority does not transfer.',
        notes: ['metaphorLimits'],
      },
    ],
  },
]

export default function BrokenAnalogy() {
  const [which, setWhich] = useState(0)
  const [stretched, setStretched] = useState(1)
  const a = ANALOGIES[which]!
  const used = a.points.slice(0, stretched)
  const strainAt = (k: number) => a.points.slice(0, k).reduce((n, p) => n + STRAIN[p.fit], 0)
  const strain = strainAt(stretched)
  const snapped = strain >= SNAP_AT
  const snapIx = a.points.findIndex((_, i) => strainAt(i + 1) >= SNAP_AT)

  // The band: the right post moves out with each stretch; it thins with strain.
  const right = 120 + (stretched / a.points.length) * 440
  const thick = Math.max(2, 12 - strain * 4)
  const mid = (120 + right) / 2

  return (
    <div className="x46">
      <div className="x46__choose" role="group" aria-label="Choose a metaphor">
        {ANALOGIES.map((x, i) => (
          <button
            key={x.name}
            type="button"
            className="lab-btn"
            aria-pressed={i === which}
            onClick={() => {
              setWhich(i)
              setStretched(1)
            }}
          >
            {x.name}
          </button>
        ))}
      </div>

      <figure className="x46__rig">
        <svg viewBox="90 10 500 100" role="img" aria-label={snapped ? 'The band between the two posts has snapped.' : `The band is under strain ${strain} of ${SNAP_AT}.`}>
          <rect x="100" y="20" width="20" height="70" className="x46__post" />
          <rect x={right} y="20" width="20" height="70" className="x46__post" />
          {snapped ? (
            <>
              <path d={`M120 55 Q ${mid - 40} 62 ${mid - 14} 80`} className="x46__band" strokeWidth={3} />
              <path d={`M${right} 55 Q ${mid + 40} 62 ${mid + 14} 80`} className="x46__band" strokeWidth={3} />
              <text x={mid} y="40" textAnchor="middle" className="x46__label">
                snap
              </text>
            </>
          ) : (
            <line x1="120" y1="55" x2={right} y2="55" className="x46__band" strokeWidth={thick} />
          )}
          <text x="110" y="106" textAnchor="middle" className="x46__label">
            then
          </text>
          <text x={right + 10} y="106" textAnchor="middle" className="x46__label">
            now
          </text>
        </svg>
        <figcaption>
          {a.oldLabel} ↔ {a.nowLabel}
        </figcaption>
      </figure>

      <div className="x46__hands">
        <button type="button" className="lab-btn" onClick={() => setStretched((n) => Math.min(a.points.length, n + 1))} disabled={stretched === a.points.length} data-probe="click">
          Stretch it over one more feature
        </button>
        <button type="button" className="lab-btn" onClick={() => setStretched(1)} disabled={stretched === 1}>
          Let go
        </button>
      </div>

      <p className="x46__status" role="status" data-observe>
        {used.length} of {a.points.length} features mapped. Strain {Math.min(strain, SNAP_AT)} of {SNAP_AT}.{' '}
        {snapped ? (
          <>
            It snapped at feature {snapIx + 1}: “{a.points[snapIx]!.old}”
          </>
        ) : (
          <>Still holding.</>
        )}
      </p>

      <ol className="x46__points">
        {used.map((p, i) => (
          <li key={i} className={`x46__point is-${p.fit}${snapped && i > snapIx ? ' is-past' : ''}`}>
            <p className="x46__fit">
              {p.fit}
              {snapped && i > snapIx ? ' · past the break' : ''}
            </p>
            <div className="x46__sides">
              <p>
                <span className="x46__side">Then</span>
                {p.old}
              </p>
              <p>
                <span className="x46__side">Now</span>
                {p.now}
              </p>
            </div>
            <p className="x46__why">
              {p.why} <span className="x46__src">From: {p.notes.map((n) => NOTES[n].title).join(' · ')}</span>
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}
