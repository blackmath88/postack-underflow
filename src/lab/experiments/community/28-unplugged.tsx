import { useState } from 'react'
import { CONTRIBUTIONS, ARTICLE_URI, type Contribution } from '../../../data/community-fixtures'
import { CONTRACTS, status } from '../../../data/connection-contracts'

// 28 · The Unplugged Community. Every fixture contribution lives on its
// author's host; two more hosts belong to nobody in the conversation: a
// backlink index and this view. Unplug hosts one at a time. For each
// participant, the pilot follows only what can still be fetched: references
// point one way, from a reply to what it answers, so without an index nobody
// can find what points at them. Reads the unchanged Community fixtures; no
// host here is real and nothing is fetched.

type HostId = 'postack' | 'ines' | 'tomas' | 'mara' | 'jun' | 'ola' | 'rui' | 'index' | 'view'

const HOSTS: Array<{
  id: HostId
  name: string
  holds: string
  fixed?: string
}> = [
  { id: 'postack', name: 'postack’s site', holds: 'the essay' },
  {
    id: 'ines',
    name: 'ines’s repository',
    holds: 'a reply and an endorsement',
  },
  { id: 'tomas', name: 'tomas’s blog', holds: 'an evidence write-up' },
  { id: 'mara', name: 'mara’s repository', holds: 'a correction' },
  { id: 'jun', name: 'jun’s repository', holds: 'a dispute' },
  {
    id: 'ola',
    name: 'ola’s server',
    holds: 'a reply',
    fixed: 'already offline in the fixtures',
  },
  {
    id: 'rui',
    name: 'rui’s repository',
    holds: 'nothing now: the reply was deleted',
  },
  { id: 'index', name: 'a backlink index', holds: 'who points at what' },
  { id: 'view', name: 'this view', holds: 'the editor’s and model’s links' },
]

const hostOf = (c: Contribution): HostId => c.author.handle.replace('.example', '') as HostId
const byUri = new Map(CONTRIBUTIONS.map((c) => [c.uri, c]))
const ESSAY = byUri.get(ARTICLE_URI)!
const name = (c: Contribution) => (c === ESSAY ? 'the essay' : `${c.author.handle.replace('.example', '')}’s ${c.kind}`)

const VANTAGES: Array<{ id: string; label: string; start: string[] }> = [
  { id: 'new', label: 'A newcomer with the essay’s address', start: ['c1'] },
  { id: 'ines', label: 'ines', start: ['c2', 'c6'] },
  { id: 'tomas', label: 'tomas', start: ['c3'] },
  { id: 'mara', label: 'mara', start: ['c4'] },
  { id: 'jun', label: 'jun', start: ['c5'] },
]

function reach(start: string[], up: (h: HostId) => boolean): Set<string> {
  const readable = (c: Contribution) => c.availability === 'available' && up(hostOf(c))
  const seen = new Set<string>()
  const queue = CONTRIBUTIONS.filter((c) => start.includes(c.id) && readable(c))
  while (queue.length) {
    const c = queue.shift()!
    if (seen.has(c.id)) continue
    seen.add(c.id)
    const next: Contribution[] = []
    // Forward: the references this record's author wrote.
    for (const r of c.refs) {
      const t = byUri.get(r.uri)
      if (t) next.push(t)
    }
    // Backward: only an index knows what points here.
    if (up('index')) next.push(...CONTRIBUTIONS.filter((x) => x.refs.some((r) => r.uri === c.uri)))
    // The view's own links, editor's and model's, if the view is up.
    if (up('view'))
      for (const k of CONTRACTS)
        if (k.proposer !== 'author' && status(k) !== 'withdrawn' && (k.from === c.id || k.to === c.id))
          next.push(CONTRIBUTIONS.find((x) => x.id === (k.from === c.id ? k.to : k.from))!)
    queue.push(...next.filter(readable))
  }
  return seen
}

export default function Unplugged() {
  const [down, setDown] = useState<HostId[]>(['ola'])
  const up = (h: HostId) => !down.includes(h)
  const toggle = (h: HostId) => setDown((d) => (d.includes(h) ? d.filter((x) => x !== h) : [...d, h]))

  const reaches = VANTAGES.map((v) => ({ v, set: reach(v.start, up) }))
  const live = reaches.filter((x) => x.set.size > 0)
  const shared = live.length ? [...live[0]!.set].filter((id) => live.every((x) => x.set.has(id))) : []
  const stillNamed = CONTRIBUTIONS.filter(
    (c) => c.availability === 'available' && up(hostOf(c)) && c.refs.some((r) => r.uri === ARTICLE_URI),
  )

  return (
    <div className="x28">
      <ul className="x28__strip" aria-label="Hosts">
        {HOSTS.map((h) => (
          <li
            key={h.id}
            className={'x28__host' + (up(h.id) ? '' : ' is-down') + (h.id === 'index' || h.id === 'view' ? ' is-central' : '')}
          >
            <button
              type="button"
              className="x28__plug"
              aria-pressed={!up(h.id)}
              onClick={() => toggle(h.id)}
              disabled={!!h.fixed}
              data-probe={h.id === 'index' ? 'click' : undefined}
            >
              <span className="x28__prong" aria-hidden="true" />
              <span className="x28__hname">{h.name}</span>
              <span className="x28__state">{h.fixed ?? (up(h.id) ? 'plugged in' : 'unplugged')}</span>
            </button>
            <p className="x28__holds">{h.holds}</p>
          </li>
        ))}
      </ul>

      <div className="x28__out" data-observe>
        <p className="x28__verdict">
          {shared.length ? (
            <>
              Everyone who can read anything shares:{' '}
              <strong>{shared.map((id) => name(CONTRIBUTIONS.find((c) => c.id === id)!)).join(', ')}</strong>
              {shared.length === 1 && shared[0] === ESSAY.id ? ', and nothing else' : ''}.
            </>
          ) : stillNamed.length ? (
            <>
              Nothing readable is shared. But {stillNamed.length} records still name the same address, <code>{ARTICLE_URI}</code>, which
              nobody can open.
            </>
          ) : (
            <>Nothing is shared, and no readable record names anything in common.</>
          )}
        </p>
        <table className="x28__reach">
          <caption className="visually-hidden">What each participant can reach by following references</caption>
          <thead>
            <tr>
              <th scope="col">Starting from</th>
              <th scope="col">Can reach</th>
            </tr>
          </thead>
          <tbody>
            {reaches.map(({ v, set }) => (
              <tr key={v.id}>
                <th scope="row">{v.label}</th>
                <td>
                  {set.size
                    ? `${set.size}: ${[...set].map((id) => name(CONTRIBUTIONS.find((c) => c.id === id)!)).join(', ')}`
                    : 'nothing: their own record cannot be fetched'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
