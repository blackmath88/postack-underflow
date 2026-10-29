import { useState } from 'react'
import { CONTRIBUTIONS } from '../../../data/community-fixtures'
import { CONTRACTS, status } from '../../../data/connection-contracts'

// 29 · The Unfinished Conversation. The minutes of the fixture conversation,
// kept by a procedure that may only record closure someone with the right to
// close actually wrote. Try to close items: as the minute-taker, by summary,
// or by answering yourself. Refused closures are minuted too, and your own
// answer opens a new item. Reads the unchanged Community fixtures.

type State = 'open' | 'closed' | 'unknowable'
interface Item {
  id: string
  title: string
  opener: string
  /** Only this party could close the item. */
  closer: string
  state: State
  why: string
  /** Set when a reader answered locally. */
  answered?: boolean
  mine?: boolean
}

const c = (id: string) => CONTRIBUTIONS.find((x) => x.id === id)!
const h = (id: string) => c(id).author.handle
const k = (id: string) => CONTRACTS.find((x) => x.id === id)!

// Derived from the fixtures. An item is closed only if its own opener closed it.
const START: Item[] = [
  {
    id: 'i1',
    title: 'Would queries from people who never saw the index give the same result? (H1)',
    opener: h('c2'),
    closer: h('c2'),
    state: 'open',
    why: 'No new evaluation exists, and ines has not said she is satisfied.',
  },
  {
    id: 'i2',
    title: 'A proposed rerun of Four Words from a pinned commit (H1)',
    opener: h('c3'),
    closer: h('c3'),
    state: 'open',
    why: 'A proposal. No record says the rerun happened.',
  },
  {
    id: 'i3',
    title: 'Issue snapshots are “retrieved at”, not a pinned revision (H4)',
    opener: h('c4'),
    closer: h('c1'),
    state: 'open',
    why: `Endorsed by ${h('c6')}. The essay’s record is unchanged since it was read, so its author has not acted.`,
  },
  {
    id: 'i4',
    title: 'Portability moves the power; it does not remove it (H2)',
    opener: h('c5'),
    closer: h('c1'),
    state: 'open',
    why: 'No record answers the dispute.',
  },
  {
    id: 'i5',
    title: 'Ola’s reply (H2)',
    opener: h('c7'),
    closer: h('c7'),
    state: 'unknowable',
    why: 'The server is unreachable. Whether it was open or settled cannot be known from here.',
  },
  {
    id: 'i6',
    title: 'The model’s link: jun and mara ask the same question',
    opener: 'a language model',
    closer: 'this view’s editor',
    state: status(k('k7')) === 'disputed' ? 'open' : 'closed',
    why: 'Disputed by the editor. The model cannot reply, so the dispute stands.',
  },
  {
    id: 'i7',
    title: 'Rui’s reply (H1)',
    opener: h('c8'),
    closer: h('c8'),
    state: 'closed',
    why: 'Deleted by its author. The only closure in the conversation is a withdrawal.',
  },
  {
    id: 'i8',
    title: 'The editor’s link: tomas corrects mara',
    opener: 'this view’s editor',
    closer: 'this view’s editor',
    state: status(k('k8')) === 'withdrawn' ? 'closed' : 'open',
    why: 'Withdrawn by the editor who proposed it.',
  },
]

type Attempt = 'resolve' | 'summary' | 'answer'

export default function Unfinished() {
  const [items, setItems] = useState<Item[]>(START)
  const [minutes, setMinutes] = useState<string[]>([])
  const [turn, setTurn] = useState(1)

  const note = (line: string) => {
    setMinutes((m) => [...m, `${turn}. ${line}`])
    setTurn((t) => t + 1)
  }

  const attempt = (id: string, a: Attempt) => {
    const it = items.find((x) => x.id === id)!
    if (a === 'resolve')
      return note(`Asked to mark “${it.title}” resolved. Refused: only ${it.closer} can close it, and no record of theirs does.`)
    if (a === 'summary') return note(`Asked to summarise “${it.title}” as agreed. Refused: no record says anyone agreed.`)
    const nid = `i${items.length + 1}`
    setItems((xs) => [
      ...xs.map((x) => (x.id === id ? { ...x, answered: true } : x)),
      {
        id: nid,
        title: `Does your answer to item ${id.slice(1)} hold?`,
        opener: 'you',
        closer: it.opener,
        state: 'open',
        why: `Only ${it.opener} can accept it.`,
        mine: true,
      },
    ])
    note(`You answered item ${id.slice(1)}, locally. It stays open until ${it.opener} accepts. Your answer is now item ${nid.slice(1)}.`)
  }

  const closeAll = () => {
    const open = items.filter((x) => x.state === 'open')
    note(`Asked to close the conversation. ${open.length} items open; 0 closed. Each needs someone who is not here.`)
  }

  const count = (s: State) => items.filter((x) => x.state === s).length

  return (
    <div className="x29">
      <div className="x29__sheet">
        <header className="x29__head">
          <p className="x29__kicker">Minutes · a conversation about the essay · fixture</p>
          <button type="button" className="lab-btn" onClick={closeAll} data-probe="click">
            Close the conversation
          </button>
        </header>

        <ol className="x29__items">
          {items.map((it) => (
            <li key={it.id} className={`x29__item is-${it.state}` + (it.mine ? ' is-mine' : '')}>
              <p className="x29__title">
                <span className="x29__no">Item {it.id.slice(1)}</span> {it.title}
              </p>
              <p className="x29__meta">
                <span className="x29__state">{it.state === 'open' ? (it.answered ? 'open, answered' : 'open') : it.state}</span> raised by{' '}
                {it.opener} · closable only by {it.closer}
              </p>
              <p className="x29__why">{it.why}</p>
              {it.state === 'open' && (
                <div className="x29__acts">
                  <button type="button" className="lab-btn" onClick={() => attempt(it.id, 'resolve')}>
                    Mark resolved
                  </button>
                  <button type="button" className="lab-btn" onClick={() => attempt(it.id, 'summary')}>
                    Summarise as agreed
                  </button>
                  {!it.mine && (
                    <button type="button" className="lab-btn" onClick={() => attempt(it.id, 'answer')} disabled={it.answered}>
                      Answer it yourself
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>

      <aside className="x29__minutes" data-observe aria-live="polite">
        <p className="lab-out">
          {items.length} items · {count('open')} open · {count('closed')} closed, each by whoever opened it · {count('unknowable')}{' '}
          unknowable
        </p>
        {minutes.length ? (
          <ol className="x29__log">
            {minutes.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ol>
        ) : (
          <p className="x29__empty">No attempts minuted yet.</p>
        )}
        <p className="x29__foot">Nothing you do here is sent to anyone; the people who could close these items are invented.</p>
      </aside>
    </div>
  )
}
