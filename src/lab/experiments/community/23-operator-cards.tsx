import { useState } from 'react'
import { CONTRIBUTIONS, type Contribution } from '../../../data/community-fixtures'
import { CONTRACTS, status, type Contract } from '../../../data/connection-contracts'

// 23 · Several Operators. Six assembly policies, written as cards. Deal one
// card to each of two seats; both operators assemble the same eight fixture
// contributions and nine contracts, unchanged, and a difference sheet lists
// what one shows that the other does not, and what each puts first.

interface Policy {
  id: string
  name: string
  rule: string
  edge: (k: Contract) => boolean
  shows: (c: Contribution) => boolean
  /** Lower comes first. The essay is always pinned at the top. */
  rank: (c: Contribution, edges: Contract[]) => number
}

const available = (c: Contribution) => c.availability === 'available'
const degree = (c: Contribution, edges: Contract[]) => edges.filter((k) => k.from === c.id || k.to === c.id).length
const incoming = (c: Contribution, edges: Contract[], type?: string) =>
  edges.filter((k) => k.to === c.id && (!type || k.type === type)).length
const idNo = (c: Contribution) => Number(c.id.slice(1))
const KIND_ORDER = ['correction', 'dispute', 'evidence', 'reply', 'endorsement', 'recommend', 'article']

const POLICIES: Policy[] = [
  {
    id: 'authors',
    name: 'The authors’ word',
    rule: 'Only links an author wrote. Most-answered first.',
    edge: (k) => k.proposer === 'author' && status(k) !== 'withdrawn',
    shows: available,
    rank: (c, e) => -incoming(c, e) * 10 + idNo(c),
  },
  {
    id: 'desk',
    name: 'The editor’s desk',
    rule: 'Authors’ links plus the editor’s accepted ones. Corrections and disputes first.',
    edge: (k) => (k.proposer === 'author' || (k.proposer === 'editor' && status(k) === 'accepted')) && status(k) !== 'withdrawn',
    shows: available,
    rank: (c) => KIND_ORDER.indexOf(c.kind) * 10 + idNo(c),
  },
  {
    id: 'open',
    name: 'Open door',
    rule: 'Every link not withdrawn, a model’s included. Placeholders for missing records. Most-linked first.',
    edge: (k) => status(k) !== 'withdrawn',
    shows: () => true,
    rank: (c, e) => -degree(c, e) * 10 + idNo(c),
  },
  {
    id: 'quiet',
    name: 'Quiet room',
    rule: 'No disputes and no disputed links. Oldest first, by record id when dates tie.',
    edge: (k) => k.type !== 'disputes' && status(k) !== 'disputed' && status(k) !== 'withdrawn',
    shows: (c) => available(c) && c.kind !== 'dispute',
    rank: (c) => idNo(c),
  },
  {
    id: 'agree',
    name: 'Agreement first',
    rule: 'Endorsed contributions first. Disputed links hidden.',
    edge: (k) => status(k) !== 'disputed' && status(k) !== 'withdrawn',
    shows: available,
    rank: (c, e) => -incoming(c, e, 'endorses') * 10 + idNo(c),
  },
  {
    id: 'archive',
    name: 'The archivist',
    rule: 'Everything, withdrawn links and missing records too. Record id order.',
    edge: () => true,
    shows: () => true,
    rank: (c) => idNo(c),
  },
]

function assemble(p: Policy) {
  const shown = CONTRIBUTIONS.filter(p.shows)
  const ids = new Set(shown.map((c) => c.id))
  const edges = CONTRACTS.filter((k) => p.edge(k) && ids.has(k.from) && ids.has(k.to))
  const order = [...shown].sort((a, b) => (a.kind === 'article' ? -1 : b.kind === 'article' ? 1 : p.rank(a, edges) - p.rank(b, edges)))
  return { order, edges, ids, edgeIds: new Set(edges.map((k) => k.id)) }
}

const name = (c: Contribution) => `${c.author.handle.replace('.example', '')} (${c.kind})`
type Seat = 'A' | 'B'

export default function OperatorCards() {
  const [seats, setSeats] = useState<Record<Seat, string>>({
    A: 'authors',
    B: 'open',
  })
  const pa = POLICIES.find((p) => p.id === seats.A)!
  const pb = POLICIES.find((p) => p.id === seats.B)!
  const a = assemble(pa)
  const b = assemble(pb)

  const onlyA = a.order.filter((c) => !b.ids.has(c.id))
  const onlyB = b.order.filter((c) => !a.ids.has(c.id))
  const edgesOnlyA = a.edges.filter((k) => !b.edgeIds.has(k.id))
  const edgesOnlyB = b.edges.filter((k) => !a.edgeIds.has(k.id))
  const headA = a.order[1]
  const headB = b.order[1]

  const deal = (seat: Seat, id: string) => setSeats((s) => ({ ...s, [seat]: id }))

  return (
    <div className="x23">
      <ul className="x23__hand" aria-label="Policy cards">
        {POLICIES.map((p) => {
          const at = (['A', 'B'] as Seat[]).filter((s) => seats[s] === p.id)
          return (
            <li key={p.id} className={'x23__card' + (at.length ? ' is-dealt' : '')}>
              <p className="x23__name">{p.name}</p>
              <p className="x23__rule">{p.rule}</p>
              <div className="x23__deal">
                {(['A', 'B'] as Seat[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="lab-btn"
                    aria-pressed={seats[s] === p.id}
                    onClick={() => deal(s, p.id)}
                    data-probe={p.id === 'quiet' && s === 'B' ? 'click' : undefined}
                  >
                    <span className="visually-hidden">Deal {p.name} to </span>
                    seat {s}
                  </button>
                ))}
              </div>
            </li>
          )
        })}
      </ul>

      <div className="x23__table">
        {(
          [
            ['A', pa, a],
            ['B', pb, b],
          ] as const
        ).map(([s, p, x]) => (
          <section key={s} className="x23__seat" aria-label={`Seat ${s}`}>
            <h3>
              Seat {s}: {p.name}
            </h3>
            <ol>
              {x.order.map((c) => (
                <li key={c.id} className={c.availability !== 'available' ? 'is-gone' : undefined}>
                  {name(c)}
                  {c.availability !== 'available' && <span> · {c.availability.replace('-', ' ')}</span>}
                </li>
              ))}
            </ol>
            <p className="lab-out">{x.edges.length} links drawn</p>
          </section>
        ))}
      </div>

      <div className="x23__diff" data-observe>
        <h3>Difference sheet</h3>
        {pa.id === pb.id ? (
          <p>Both seats hold the same card. The two accounts are identical.</p>
        ) : (
          <dl>
            <dt>First after the essay</dt>
            <dd>
              A: {headA ? name(headA) : 'nothing'} · B: {headB ? name(headB) : 'nothing'}
              {headA?.id === headB?.id ? ' (the same)' : ' (different)'}
            </dd>
            <dt>Only A shows</dt>
            <dd>{onlyA.length ? onlyA.map(name).join(', ') : 'no contribution B leaves out'}</dd>
            <dt>Only B shows</dt>
            <dd>{onlyB.length ? onlyB.map(name).join(', ') : 'no contribution A leaves out'}</dd>
            <dt>Links only A draws</dt>
            <dd>{edgesOnlyA.length ? edgesOnlyA.map((k) => `${k.id} ${k.type} (${k.proposer})`).join(', ') : 'none'}</dd>
            <dt>Links only B draws</dt>
            <dd>{edgesOnlyB.length ? edgesOnlyB.map((k) => `${k.id} ${k.type} (${k.proposer})`).join(', ') : 'none'}</dd>
          </dl>
        )}
        <p className="x23__same">
          Same {CONTRIBUTIONS.length} records and {CONTRACTS.length} contracts under both. Only the card differs.
        </p>
      </div>
    </div>
  )
}
