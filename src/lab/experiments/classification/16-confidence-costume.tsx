import { useMemo, useState } from 'react'
import resultsFile from '../../../../results/four-words-v1.json'
import { artifact } from '../../../lib/four-words-data'
import { search, tokenize } from '../../../lib/retrieval'
import { RECORDS, record, shortName, source, sourceNearlySays, sourceSays } from './words'

// 16 · The Confidence Costume. One claim from a frozen v1 record, dressed in
// seven garments of authority. Every garment is real data from the frozen
// corpus or the v1 results, and every one is true. The visitor takes them off
// one by one. Underneath is the only check that is about the claim itself:
// does the pinned source use its words? Two aliases of one record can be
// swapped in: one attested, one not. The costume does not change.

const SID = 'vite-issue-8073-base-mime'
const CLAIMS = ['Vite blank page on GitHub Pages works locally', 'Loading module was blocked because of a disallowed MIME type']

const R = record(SID)
const S = source(SID)
const NEIGHBOUR = R.related.find((x) => x.relation === 'explains')!
const NEIGHBOUR_EVIDENCE = record(NEIGHBOUR.sourceId).evidence[0]!.kind
const SUMMARY = resultsFile.summary
const rankOf = (text: string) => search(artifact.indexes.structured, text).hits.findIndex((h) => h.id === SID) + 1

interface Garment {
  id: string
  name: string
  vouches: string
}

const GARMENTS: Garment[] = [
  { id: 'type', name: 'Display type', vouches: 'Nothing. It is a font size.' },
  { id: 'badge', name: `Evidence badge: ${R.evidence[0]!.kind}`, vouches: 'The record’s fix, which the reporter confirmed. Not this alias.' },
  { id: 'cite', name: `Citation: ${shortName(NEIGHBOUR.sourceId)}`, vouches: `A related record (${NEIGHBOUR.relation}), backed by ${NEIGHBOUR_EVIDENCE}. Not this alias.` },
  { id: 'rank', name: 'Search rank', vouches: 'That the index finds its own words. It would for any alias.' },
  { id: 'terms', name: `Controlled terms: ${R.terms.join(', ')}`, vouches: 'Where the record writer filed the record. The source never says 404.' },
  { id: 'chart', name: 'Performance chart', vouches: 'The whole index on 27 queries, in run v1. Not this claim.' },
  { id: 'pin', name: `Pinned revision ${S.revision.slice(0, 10)}`, vouches: 'When the source was read. Not what it says.' },
]

// Across the corpus: aliases with a word their source never uses, on records
// whose only evidence badge is official documentation.
const BORROWED = RECORDS.reduce(
  (n, r) =>
    n +
    (r.evidence.every((e) => e.kind === 'official-docs')
      ? r.aliases.filter((a) => tokenize(a).some((t) => !sourceSays(t, r.sourceId))).length
      : 0),
  0,
)
const ALIASES = RECORDS.reduce((n, r) => n + r.aliases.length, 0)

export default function ConfidenceCostume() {
  const [claimIx, setClaimIx] = useState(0)
  const [worn, setWorn] = useState<Set<string>>(() => new Set(GARMENTS.map((g) => g.id)))
  const claim = CLAIMS[claimIx]!
  const rank = useMemo(() => rankOf(claim), [claim])
  const words = [...new Set(tokenize(claim))]
  const unsaid = words.filter((w) => !sourceNearlySays(w, SID))
  const on = (id: string) => worn.has(id)
  const toggle = (id: string) =>
    setWorn((w) => {
      const n = new Set(w)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  return (
    <div className="x16">
      <div className="x16__rail" role="group" aria-label="Wardrobe">
        <p className="x16__label">Wardrobe</p>
        {GARMENTS.map((g) => (
          <label key={g.id} className="x16__hanger">
            <input type="checkbox" checked={on(g.id)} onChange={() => toggle(g.id)} />
            <span>
              <span className="x16__gname">{g.name}</span>
              <span className="x16__vouch">vouches for: {g.vouches}</span>
            </span>
          </label>
        ))}
        <div className="x16__btns">
          <button type="button" className="lab-btn" onClick={() => setWorn(new Set())} data-probe="click">
            Strip it bare
          </button>
          <button type="button" className="lab-btn" onClick={() => setWorn(new Set(GARMENTS.map((g) => g.id)))}>
            Dress it fully
          </button>
        </div>
        <div className="x16__swap" role="group" aria-label="Claim">
          {CLAIMS.map((c, i) => (
            <button key={c} type="button" className="lab-btn" aria-pressed={i === claimIx} onClick={() => setClaimIx(i)}>
              Alias {i + 1}
            </button>
          ))}
        </div>
      </div>

      <figure className={'x16__figure' + (worn.size === 0 ? ' is-bare' : '')}>
        <div className="x16__claim">
          {on('badge') && <p className="x16__badge">✓ {R.evidence[0]!.kind.replace('-', ' ')}</p>}
          {on('terms') && (
            <p className="x16__terms">
              {R.terms.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </p>
          )}
          <p className={on('type') ? 'x16__text is-display' : 'x16__text'}>
            {claim}
            {on('cite') && <sup className="x16__sup">[1]</sup>}
          </p>
          {on('rank') && <p className="x16__rank">#{rank} in the problem-oriented index for these words</p>}
          {on('chart') && (
            <svg className="x16__chart" viewBox="0 0 220 64" role="img" aria-label={`MRR at 10: structured ${SUMMARY.structured.mrrAt10.toFixed(3)}, baseline ${SUMMARY.baseline.mrrAt10.toFixed(3)}`}>
              <text x="0" y="12">MRR@10, run v1</text>
              <rect x="0" y="20" width={200 * SUMMARY.structured.mrrAt10} height="14" className="x16__bar1" />
              <text x={204 * SUMMARY.structured.mrrAt10} y="31">
                {SUMMARY.structured.mrrAt10.toFixed(2)}
              </text>
              <rect x="0" y="40" width={200 * SUMMARY.baseline.mrrAt10} height="14" className="x16__bar2" />
              <text x={204 * SUMMARY.baseline.mrrAt10} y="51">
                {SUMMARY.baseline.mrrAt10.toFixed(2)}
              </text>
            </svg>
          )}
          {on('cite') && (
            <p className="x16__foot">
              [1] {shortName(NEIGHBOUR.sourceId)}, {NEIGHBOUR_EVIDENCE}
            </p>
          )}
          {on('pin') && <p className="x16__pin">source pinned {S.revision.slice(0, 10)} · {S.repo}</p>}
        </div>
        <figcaption className="x16__under" data-observe>
          <strong>
            {worn.size} of {GARMENTS.length} garments on.
          </strong>{' '}
          None of them checks this claim. Underneath: the pinned issue uses {words.length - unsaid.length} of {words.length} of its words
          {unsaid.length > 0 ? `; it never says ${unsaid.map((w) => `“${w}”`).join(', ')}.` : ', every one.'} (lenient word check, as in 14)
        </figcaption>
      </figure>

      <p className="lab-out x16__corpus">
        corpus: {BORROWED} of {ALIASES} aliases use a word their source never does and sit on records whose only badge is
        official-docs
      </p>
    </div>
  )
}
