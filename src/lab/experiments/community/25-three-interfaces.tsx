import { useState, type KeyboardEvent } from 'react'
import { CONTRIBUTIONS, ARTICLE_URI, type Contribution } from '../../../data/community-fixtures'
import { CONTRACTS, status, type Contract } from '../../../data/connection-contracts'

// 25 · One Conversation, Three Interfaces. The same eight fixture
// contributions and nine connection contracts from the Community page,
// unchanged, rendered three ways. Each renderer is a short policy; the seams
// ledger lists the decisions it had to make that the records did not.

type View = 'thread' | 'channel' | 'graph'

const byId = new Map(CONTRIBUTIONS.map((c) => [c.id, c]))
const article = CONTRIBUTIONS.find((c) => c.uri === ARTICLE_URI)!
const handle = (c: Contribution) => c.author.handle.replace('.example', '')

// Thread: what a reply-tree renderer would show. Only `parent` references nest.
const threadReplies = CONTRIBUTIONS.filter((c) => c.refs.some((r) => r.role === 'parent' && r.uri === ARTICLE_URI))
const threadOutside = CONTRIBUTIONS.filter((c) => c !== article && !threadReplies.includes(c))

// Channel: one flat stream of available messages, in an order the records do not give.
const channel = CONTRIBUTIONS.filter((c) => c.availability === 'available').sort(
  (a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id),
)
const sameDay = new Set(CONTRIBUTIONS.map((c) => c.createdAt)).size === 1

// Graph: every contract that has not been withdrawn becomes an edge.
const edges = CONTRACTS.filter((k) => status(k) !== 'withdrawn')

const SEAMS: Record<View, { shows: number; lines: string; decisions: string[] }> = {
  thread: {
    shows: 1 + threadReplies.length,
    lines: `${threadReplies.length} reply lines, all declared by their authors`,
    decisions: [
      'Only a reply’s own “parent” reference places it in the thread.',
      `${threadOutside.length} contributions that address the essay as a subject (a correction, a dispute, an endorsement, a blog post) have no place in it.`,
      'Unreachable and deleted replies keep their slot as placeholders, because their parent reference is still known.',
    ],
  },
  channel: {
    shows: channel.length,
    lines: 'no lines: who answers whom is gone',
    decisions: [
      sameDay
        ? 'Every record carries the same date and no time, so this order is invented: by date, then by record id.'
        : 'Ordered by date.',
      'Unavailable and deleted records are silently left out of the stream.',
      'Corrections, disputes and endorsements are flattened into ordinary messages; their kind survives only as a label.',
    ],
  },
  graph: {
    shows: CONTRIBUTIONS.length,
    lines: `${edges.length} edges: ${edges.filter((k) => k.proposer === 'author').length} by authors, ${edges.filter((k) => k.proposer === 'editor').length} by the editor, ${edges.filter((k) => k.proposer === 'model').length} by a model`,
    decisions: [
      'Withdrawn connections are hidden; disputed ones are still drawn.',
      'An editor’s grouping and a model’s guess are drawn in the same space as the authors’ own replies.',
      'Position on the page is ours: nothing in the records says where a contribution sits.',
    ],
  },
}

const LABEL: Record<View, string> = { thread: 'Thread', channel: 'Channel', graph: 'Graph' }
const VIEWS = Object.keys(LABEL) as View[]

export default function ThreeInterfaces() {
  const [view, setView] = useState<View>('thread')
  const [focus, setFocus] = useState<string>('c4')

  const onTabKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const next = VIEWS[(i + d + VIEWS.length) % VIEWS.length]!
    setView(next)
    document.getElementById(`x25-tab-${next}`)?.focus()
  }

  const where = (id: string): Record<View, string> => {
    const c = byId.get(id)!
    return {
      thread: c === article ? 'the root' : threadReplies.includes(c) ? (c.availability === 'available' ? 'a reply' : 'a placeholder') : 'absent',
      channel: channel.includes(c) ? `message ${channel.indexOf(c) + 1} of ${channel.length}` : 'absent',
      graph: `a node with ${edges.filter((k) => k.from === id || k.to === id).length} edges`,
    }
  }
  const w = where(focus)
  const seams = SEAMS[view]

  return (
    <div className="x25">
      <div className="x25__tabs" role="tablist" aria-label="Interface">
        {VIEWS.map((v, i) => (
          <button
            key={v}
            id={`x25-tab-${v}`}
            role="tab"
            type="button"
            aria-selected={view === v}
            aria-controls="x25-panel"
            tabIndex={view === v ? 0 : -1}
            onClick={() => setView(v)}
            onKeyDown={(e) => onTabKey(e, i)}
            data-probe={v === 'channel' ? 'click' : undefined}
          >
            {LABEL[v]}
          </button>
        ))}
      </div>

      <div className="x25__body">
        <div id="x25-panel" role="tabpanel" aria-labelledby={`x25-tab-${view}`} className={`x25__panel x25__panel--${view}`}>
          {view === 'thread' && <Thread focus={focus} onFocus={setFocus} />}
          {view === 'channel' && <Channel focus={focus} onFocus={setFocus} />}
          {view === 'graph' && <Graph focus={focus} onFocus={setFocus} />}
        </div>

        <aside className="x25__seams" aria-label="Seams" data-observe>
          <h3>Where interpretation entered</h3>
          <p className="lab-out">
            {seams.shows} of {CONTRIBUTIONS.length} contributions · {seams.lines}
          </p>
          <ol>
            {seams.decisions.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ol>
          <h3>Follow one contribution</h3>
          <label className="x25__follow">
            <span className="visually-hidden">Contribution to follow</span>
            <select value={focus} onChange={(e) => setFocus(e.target.value)}>
              {CONTRIBUTIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {handle(c)} · {c.kind}
                </option>
              ))}
            </select>
          </label>
          <dl className="x25__where">
            {VIEWS.map((v) => (
              <div key={v} className={v === view ? 'is-current' : undefined}>
                <dt>{LABEL[v]}</dt>
                <dd>{w[v]}</dd>
              </div>
            ))}
          </dl>
          <p className="x25__same">The records are the same in all three. Nothing above edits them.</p>
        </aside>
      </div>
    </div>
  )
}

type PartProps = { focus: string; onFocus: (id: string) => void }

function Body({ c }: { c: Contribution }) {
  if (c.availability === 'deleted') return <p className="x25__gone">Deleted by its author.</p>
  if (c.availability === 'source-offline') return <p className="x25__gone">The author’s server is unreachable.</p>
  return <p>{c.text}</p>
}

function Thread({ focus, onFocus }: PartProps) {
  return (
    <div>
      <div className={'x25__post x25__post--root' + (focus === article.id ? ' is-focus' : '')}>
        <button type="button" className="x25__who" onClick={() => onFocus(article.id)}>
          {handle(article)}
        </button>
        <Body c={article} />
      </div>
      <ul className="x25__replies">
        {threadReplies.map((c) => (
          <li key={c.id} className={'x25__post' + (focus === c.id ? ' is-focus' : '')}>
            <button type="button" className="x25__who" onClick={() => onFocus(c.id)}>
              {handle(c)}
            </button>
            <Body c={c} />
          </li>
        ))}
      </ul>
      <p className="x25__outside">
        Not in this thread: {threadOutside.map((c) => `${handle(c)} (${c.kind})`).join(', ')}.
      </p>
    </div>
  )
}

function Channel({ focus, onFocus }: PartProps) {
  return (
    <ol className="x25__stream">
      {channel.map((c) => (
        <li key={c.id} className={focus === c.id ? 'is-focus' : undefined}>
          <button type="button" className="x25__who" onClick={() => onFocus(c.id)}>
            {handle(c)}
          </button>
          {c.kind !== 'reply' && c.kind !== 'article' && <span className="x25__kind">{c.kind}</span>}
          <span className="x25__msg">{c.text}</span>
        </li>
      ))}
    </ol>
  )
}

// Fixed, hand-chosen positions: the records give none.
const POS: Record<string, [number, number]> = {
  c1: [300, 170],
  c2: [110, 60],
  c3: [90, 230],
  c4: [470, 80],
  c5: [500, 250],
  c6: [560, 20],
  c7: [210, 310],
  c8: [390, 320],
}

function Graph({ focus, onFocus }: PartProps) {
  const line = (k: Contract) => {
    const [x1, y1] = POS[k.from]!
    const [x2, y2] = POS[k.to]!
    return { x1, y1, x2, y2 }
  }
  return (
    <svg className="x25__graph" viewBox="0 0 620 360" role="img" aria-label="Contributions as nodes; connection contracts as edges">
      {edges.map((k) => (
        <g key={k.id} className={`x25__edge x25__edge--${k.proposer} x25__edge--${status(k)}`}>
          <line {...line(k)} />
          <text x={(line(k).x1 + line(k).x2) / 2} y={(line(k).y1 + line(k).y2) / 2 - 4}>
            {k.type}
          </text>
        </g>
      ))}
      {CONTRIBUTIONS.map((c) => {
        const [x, y] = POS[c.id]!
        return (
          <g
            key={c.id}
            className={'x25__node' + (focus === c.id ? ' is-focus' : '') + (c.availability !== 'available' ? ' is-gone' : '')}
            transform={`translate(${x} ${y})`}
            onClick={() => onFocus(c.id)}
          >
            <circle r={c === article ? 22 : 14} />
            <text y={c === article ? 38 : 30}>{handle(c)}</text>
          </g>
        )
      })}
    </svg>
  )
}
