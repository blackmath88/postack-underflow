import { useState } from 'react'
import { artifact, recordBySource, sourceById } from '../../../lib/four-words-data'
import { search, tokenize } from '../../../lib/retrieval'
import type { ProblemRecord } from '../../../lib/records'

// 54 · The Duplicate Investigation. Two GitHub issues from different projects,
// years apart, that each ended at the same fix. Their v1 records (paraphrases
// written by an agent) are laid out as two notebooks. You align lines that
// say the same thing; the ledger counts the words they share and asks what
// the index already knows about the pair. A second pair shares a symptom but
// not a finding, as a control.

interface Line {
  key: string
  field: string
  text: string
}

const notebook = (r: ProblemRecord): Line[] => [
  { key: 'problem', field: 'problem', text: r.problem },
  ...r.symptoms.map((t, i) => ({ key: `symptom${i}`, field: 'symptom', text: t })),
  ...r.context.map((t, i) => ({ key: `context${i}`, field: 'context', text: t })),
  { key: 'solution', field: 'solution', text: r.solution },
  ...r.evidence.map((e, i) => ({ key: `evidence${i}`, field: `evidence · ${e.kind}`, text: e.note })),
  ...r.limitations.map((t, i) => ({ key: `limit${i}`, field: 'limitation', text: t })),
]

const PAIRS = [
  {
    a: 'vite-issue-9119-underscore-chunk',
    b: 'next-issue-15588-nojekyll',
    label: 'vite#9119 and next.js#15588',
    // Our reading of which lines say the same thing. Offered, never applied unasked.
    ours: [
      ['solution', 'solution'],
      ['context0', 'context1'],
      ['problem', 'limit1'],
      ['symptom1', 'evidence0'],
    ],
  },
  {
    a: 'vite-issue-8073-base-mime',
    b: 'next-issue-15588-nojekyll',
    label: 'vite#8073 and next.js#15588 (control)',
    ours: [['symptom1', 'symptom0']],
  },
] as const

const shared = (x: string, y: string) => {
  const b = new Set(tokenize(y))
  return [...new Set(tokenize(x))].filter((t) => b.has(t))
}

function indexKnows(a: ProblemRecord, b: ProblemRecord) {
  const rankOf = (from: ProblemRecord, to: string) =>
    search(artifact.indexes.structured, from.problem).hits.findIndex((h) => h.id === to) + 1
  return {
    links: a.related.some((r) => r.sourceId === b.sourceId) || b.related.some((r) => r.sourceId === a.sourceId),
    terms: a.terms.filter((t) => b.terms.includes(t)),
    aToB: rankOf(a, b.sourceId),
    bToA: rankOf(b, a.sourceId),
  }
}

export default function DuplicateInvestigation() {
  const [pairIx, setPairIx] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [links, setLinks] = useState<Array<[string, string]>>([])
  const pair = PAIRS[pairIx]!
  const A = recordBySource.get(pair.a)!
  const B = recordBySource.get(pair.b)!
  const left = notebook(A)
  const right = notebook(B)
  const knows = indexKnows(A, B)
  const text = (side: Line[], key: string) => side.find((l) => l.key === key)?.text ?? ''
  const linkedL = new Set(links.map((l) => l[0]))
  const linkedR = new Set(links.map((l) => l[1]))
  const pairNo = (side: 0 | 1, key: string) => links.findIndex((l) => l[side] === key) + 1

  const choosePair = (i: number) => {
    setPairIx(i)
    setPicked(null)
    setLinks([])
  }
  const pickRight = (key: string) => {
    if (!picked) return
    setLinks((ls) => [...ls.filter((l) => l[0] !== picked && l[1] !== key), [picked, key]])
    setPicked(null)
  }
  const sharedWords = links.map(([l, r]) => shared(text(left, l), text(right, r)))
  const unalignedA = left.filter((l) => !linkedL.has(l.key)).length

  const book = (side: 0 | 1, lines: Line[], rec: ProblemRecord) => {
    const src = sourceById.get(rec.sourceId)!
    return (
      <section className="x54__book" aria-label={`Notebook ${side === 0 ? 'A' : 'B'}: ${src.repo}`}>
        <h3>
          {side === 0 ? 'A' : 'B'} · <a href={src.url}>{src.repo}</a>
        </h3>
        <ol>
          {lines.map((l, i) => {
            const no = pairNo(side, l.key)
            const active = side === 0 ? picked === l.key : false
            return (
              <li key={l.key}>
                <button
                  type="button"
                  className={'x54__line' + (no ? ' is-linked' : '') + (active ? ' is-picked' : '')}
                  aria-pressed={side === 0 ? active : undefined}
                  disabled={side === 1 && !picked}
                  onClick={() => (side === 0 ? setPicked(active ? null : l.key) : pickRight(l.key))}
                  data-probe={side === 0 && i === 0 ? 'click' : undefined}
                >
                  <span className="x54__field">
                    {l.field}
                    {no > 0 && <span className="x54__no"> · pair {no}</span>}
                  </span>
                  {l.text}
                </button>
              </li>
            )
          })}
        </ol>
      </section>
    )
  }

  return (
    <div className="x54">
      <div className="x54__bar" role="group" aria-label="Choose two notebooks">
        {PAIRS.map((p, i) => (
          <button key={p.label} type="button" className="lab-btn" aria-pressed={i === pairIx} onClick={() => choosePair(i)}>
            {p.label}
          </button>
        ))}
        <button type="button" className="lab-linkbutton" onClick={() => setLinks(pair.ours.map(([l, r]) => [l, r] as [string, string]))}>
          Show our alignment
        </button>
        <button type="button" className="lab-linkbutton" onClick={() => setLinks([])} disabled={links.length === 0}>
          Clear
        </button>
      </div>
      <p className="x54__how">Pick a line in A, then the line in B that says the same thing.</p>

      <div className="x54__books" data-scroll>
        {book(0, left, A)}
        {book(1, right, B)}
      </div>

      <div className="x54__ledger" data-observe role="status">
        {picked ? (
          <p>
            Holding A’s {left.find((l) => l.key === picked)?.field}. Choose its counterpart in B.
          </p>
        ) : (
          <p>
            {links.length} {links.length === 1 ? 'pair' : 'pairs'} aligned; {unalignedA} of {left.length} lines in A have no
            counterpart.
          </p>
        )}
        {links.length > 0 && (
          <ol className="x54__pairs">
            {links.map(([l, r], i) => (
              <li key={`${l}-${r}`}>
                A {left.find((x) => x.key === l)?.field} ↔ B {right.find((x) => x.key === r)?.field}:{' '}
                {sharedWords[i]!.length ? `shares “${sharedWords[i]!.join('”, “')}”` : 'shares no searchable word'}
              </li>
            ))}
          </ol>
        )}
        <p className="lab-out">
          What the index already knows: the records {knows.links ? 'link' : 'do not link'} each other; they share{' '}
          {knows.terms.length} controlled {knows.terms.length === 1 ? 'term' : 'terms'} ({knows.terms.join(', ') || 'none'});
          searching A’s problem ranks B {knows.aToB ? `#${knows.aToB}` : 'nowhere'}, and B’s ranks A{' '}
          {knows.bToA ? `#${knows.bToA}` : 'nowhere'}.
        </p>
      </div>
    </div>
  )
}
