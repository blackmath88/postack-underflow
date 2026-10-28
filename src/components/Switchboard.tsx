import { useId, useState, type FormEvent } from 'react'
import { CONTRIBUTIONS, type Contribution } from '../data/community-fixtures'
import {
  CONTRACTS,
  PROPOSER_LABEL,
  RELATION_TYPES,
  status,
  type Contract,
  type RelationType,
} from '../data/connection-contracts'

// Two rails of endpoints. Positions are fixed so the drawing never reflows.
const LEFT = ['c2', 'c3', 'c5', 'c7']
const RIGHT = ['c1', 'c4', 'c6', 'c8']
const W = 640
const RAIL_X = { left: 170, right: 470 }
const rowY = (i: number) => 46 + i * 78
const H = rowY(3) + 46

const byId = new Map(CONTRIBUTIONS.map((c) => [c.id, c]))

function anchor(id: string): { x: number; y: number; side: 'left' | 'right' } {
  const l = LEFT.indexOf(id)
  if (l > -1) return { x: RAIL_X.left, y: rowY(l), side: 'left' }
  return { x: RAIL_X.right, y: rowY(RIGHT.indexOf(id)), side: 'right' }
}

function pathFor(c: Contract) {
  const a = anchor(c.from)
  const b = anchor(c.to)
  if (a.side === b.side) {
    // Same rail: bow towards the middle so the cable stays visible.
    const bow = a.side === 'left' ? 90 : -90
    return `M${a.x} ${a.y} C ${a.x + bow} ${a.y}, ${b.x + bow} ${b.y}, ${b.x} ${b.y}`
  }
  const mid = (a.x + b.x) / 2
  return `M${a.x} ${a.y} C ${mid} ${a.y}, ${mid} ${b.y}, ${b.x} ${b.y}`
}

function short(c: Contribution) {
  return `${c.author.handle.replace('.example', '')} · ${c.kind}`
}

function ContractDetail({ c, onWithdraw }: { c: Contract; onWithdraw?: () => void }) {
  const from = byId.get(c.from)!
  const to = byId.get(c.to)!
  const s = status(c)
  return (
    <div className={`contract contract--${c.proposer} contract--${s}`}>
      <p className="contract__tag">
        <span>Connection contract {c.id}</span>
        <span className="contract__status">{s}</span>
      </p>
      <dl>
        <dt>Connects</dt>
        <dd>
          <code>{from.id}</code> {short(from)} <strong>{c.type.replace('-', ' ')}</strong> <code>{to.id}</code>{' '}
          {short(to)}
        </dd>
        <dt>Original authors</dt>
        <dd>
          {from.author.handle} and {to.author.handle}
        </dd>
        <dt>Who says so</dt>
        <dd>
          {PROPOSER_LABEL[c.proposer]}: {c.proposedBy}
          {c.proposer === 'author' ? (
            <span className="contract__note"> Written inside {from.author.handle}’s own record.</span>
          ) : (
            <span className="contract__note"> Not a statement by either author.</span>
          )}
        </dd>
        <dt>Why</dt>
        <dd>{c.reason}</dd>
        <dt>Evidence</dt>
        <dd>
          <ul>
            {c.evidence.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </dd>
        <dt>History</dt>
        <dd>
          <ol className="contract__history">
            {c.history.map((h, i) => (
              <li key={i}>
                <span className="contract__status">{h.status}</span> by {h.by}. {h.note}
              </li>
            ))}
          </ol>
        </dd>
      </dl>
      {onWithdraw && s !== 'withdrawn' && (
        <button type="button" onClick={onWithdraw}>
          Withdraw my proposal
        </button>
      )}
    </div>
  )
}

function EndpointDetail({ c }: { c: Contribution }) {
  return (
    <div className="endpoint-detail">
      <p className="contract__tag">
        <span>Source record · {c.availability.replace('-', ' ')}</span>
        <span>{c.nsidStatus === 'existing' ? 'existing Lexicon' : 'hypothetical type'}</span>
      </p>
      <p className="endpoint-detail__who">
        <strong>{c.author.handle}</strong> · {c.kind} · <code>{c.nsid}</code>
      </p>
      {c.text ? (
        <p className="endpoint-detail__text">{c.text}</p>
      ) : (
        <p className="cm-unavailable">
          {c.availability === 'deleted' ? 'Deleted by its author; nothing remains at the source.' : 'Source offline; no text to show.'}
        </p>
      )}
      <p className="layer__ref">
        <code className="cm-uri">{c.uri}</code>
      </p>
      <p className="layer__ref">
        References written in this record:{' '}
        {c.refs.length
          ? c.refs.map((r) => `${r.role} → ${CONTRIBUTIONS.find((x) => x.uri === r.uri)?.author.handle ?? r.uri}`).join('; ')
          : 'none readable'}
      </p>
    </div>
  )
}

export function Switchboard() {
  const [present, setPresent] = useState(true)
  const [showWithdrawn, setShowWithdrawn] = useState(false)
  const [selected, setSelected] = useState<string>('k7')
  const [endpoint, setEndpoint] = useState<string>('c2')
  const [mine, setMine] = useState<Contract[]>([])
  const [draft, setDraft] = useState({ from: 'c3', to: 'c5', type: 'cites' as RelationType, reason: '' })
  const formId = useId()

  const all = [...CONTRACTS, ...mine]
  const visible = all.filter((c) => showWithdrawn || status(c) !== 'withdrawn')
  const current = all.find((c) => c.id === selected)

  const propose = (e: FormEvent) => {
    e.preventDefault()
    if (draft.from === draft.to || !draft.reason.trim()) return
    const id = `r${mine.length + 1}`
    const contract: Contract = {
      id,
      from: draft.from,
      to: draft.to,
      type: draft.type,
      proposer: 'reader',
      proposedBy: 'you, in this browser tab',
      reason: draft.reason.trim(),
      evidence: ['Your stated reason. No evidence attached.'],
      history: [{ status: 'proposed', by: 'you', note: 'Local only; nothing is published.' }],
    }
    setMine((m) => [...m, contract])
    setSelected(id)
    setDraft((d) => ({ ...d, reason: '' }))
  }
  const withdraw = (id: string) =>
    setMine((m) =>
      m.map((c) =>
        c.id === id ? { ...c, history: [...c.history, { status: 'withdrawn', by: 'you', note: 'You withdrew it.' }] } : c,
      ),
    )

  // Only references in records that can still be read.
  const declaredRefs = CONTRIBUTIONS.filter((c) => c.availability === 'available').reduce((n, c) => n + c.refs.length, 0)

  return (
    <section className="experiment wide" aria-labelledby="sb-title" data-experiment="switchboard" data-operator={present ? 'present' : 'gone'}>
      <header className="experiment__header">
        <p className="kicker">Experiment · relationship claims over fixture records</p>
        <h2 id="sb-title">The Connection Contract</h2>
        <p>
          Eight invented contributions in their authors’ own repositories. Select a line to read its
          contract, or propose one of your own.
        </p>
      </header>

      <div className="board">
        <svg viewBox={`0 0 ${W} ${H}`} className="board__svg" role="img" aria-label={present ? `${visible.length} connections drawn between eight contributions` : 'Eight contributions, no connections drawn'}>
          <g className="board__cables">
            {visible.map((c) => (
              <path
                key={c.id}
                d={pathFor(c)}
                className={`cable cable--${c.proposer} cable--${status(c)}${c.id === selected ? ' is-selected' : ''}`}
              />
            ))}
          </g>
          {[...LEFT, ...RIGHT].map((id) => {
            const c = byId.get(id)!
            const a = anchor(id)
            const left = a.side === 'left'
            return (
              <g key={id} className={`socket socket--${c.availability}${!present && endpoint === id ? ' is-selected' : ''}`}>
                <circle cx={a.x} cy={a.y} r={7} />
                <text x={left ? a.x - 16 : a.x + 16} y={a.y - 4} textAnchor={left ? 'end' : 'start'} className="socket__who">
                  {c.author.handle.replace('.example', '')}
                </text>
                <text x={left ? a.x - 16 : a.x + 16} y={a.y + 12} textAnchor={left ? 'end' : 'start'} className="socket__kind">
                  {c.id} · {c.kind}
                  {c.availability !== 'available' ? ` · ${c.availability.replace('-', ' ')}` : ''}
                </text>
              </g>
            )
          })}
        </svg>
        <ul className="board__legend" aria-label="Line styles">
          <li className="legend--author">solid · declared by an author</li>
          <li className="legend--editor">dashed · this view’s editor</li>
          <li className="legend--model">dotted · a language model</li>
          <li className="legend--reader">dash-dot · you</li>
        </ul>
      </div>

      <div className="operator">
        {present ? (
          <button type="button" className="operator__leave" onClick={() => setPresent(false)}>
            The operator leaves
          </button>
        ) : (
          <button type="button" className="operator__leave" onClick={() => setPresent(true)}>
            Bring the operator back
          </button>
        )}
        <label className="operator__toggle">
          <input type="checkbox" checked={showWithdrawn} onChange={(e) => setShowWithdrawn(e.target.checked)} disabled={!present} />
          Show withdrawn connections
        </label>
      </div>

      <p className="cm-status" role="status" aria-live="polite">
        {present
          ? `${visible.length} connections drawn · ${CONTRIBUTIONS.length} contributions · ${mine.length} proposed by you`
          : `The operator has left. No connections are drawn. All ${CONTRIBUTIONS.length} contributions are where their authors left them.`}
      </p>

      {!present && (
        <div className="operator__after">
          <p className="operator__line">Every line was a reading. The voices were never on the board.</p>
          <p>
            What disappeared is this view’s drawing, including your proposals. What remains is each record,
            and inside each record the {declaredRefs} references its authors wrote themselves: Ines’s reply
            still says what it replies to. Two of the eight could not be read even before: one server is
            offline, one record was deleted.
          </p>
        </div>
      )}

      <div className="board__panels">
        <div>
          <h3>{present ? 'Connections' : 'Contributions'}</h3>
          {present ? (
            <ul className="contract-list">
              {visible.map((c) => (
                <li key={c.id}>
                  <button type="button" aria-pressed={c.id === selected} onClick={() => setSelected(c.id)}>
                    <span className="contract-list__ids">
                      {c.from} → {c.to}
                    </span>{' '}
                    {c.type.replace('-', ' ')}
                    <span className="contract-list__meta">
                      {PROPOSER_LABEL[c.proposer].toLowerCase()} · {status(c)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="contract-list">
              {CONTRIBUTIONS.map((c) => (
                <li key={c.id}>
                  <button type="button" aria-pressed={c.id === endpoint} onClick={() => setEndpoint(c.id)}>
                    <span className="contract-list__ids">{c.id}</span> {short(c)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          {present && current && (
            <ContractDetail c={current} onWithdraw={current.proposer === 'reader' ? () => withdraw(current.id) : undefined} />
          )}
          {!present && byId.get(endpoint) && <EndpointDetail c={byId.get(endpoint)!} />}
        </div>
      </div>

      {present && (
        <form className="propose" onSubmit={propose} aria-labelledby={`${formId}-title`}>
          <h3 id={`${formId}-title`}>Propose a connection</h3>
          <p className="layer__ref">
            Your proposal is a reading, like the editor’s. It cannot become an author’s statement, and it stays
            in this tab.
          </p>
          <div className="propose__row">
            <label>
              From
              <select value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })}>
                {CONTRIBUTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} · {short(c)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Relationship
              <select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as RelationType })}>
                {RELATION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace('-', ' ')}
                  </option>
                ))}
              </select>
            </label>
            <label>
              To
              <select value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })}>
                {CONTRIBUTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} · {short(c)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="propose__reason">
            Why? (required)
            <input type="text" value={draft.reason} onChange={(e) => setDraft({ ...draft, reason: e.target.value })} placeholder="Both question who wrote the queries" />
          </label>
          {draft.from === draft.to && <p className="fw-gap">A contribution cannot be connected to itself.</p>}
          <button type="submit" disabled={draft.from === draft.to || !draft.reason.trim()}>
            Add to this view
          </button>
        </form>
      )}
    </section>
  )
}
