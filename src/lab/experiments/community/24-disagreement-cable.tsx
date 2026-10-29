import { useState } from 'react'
import { CONTRIBUTIONS } from '../../../data/community-fixtures'
import { CONTRACTS, status } from '../../../data/connection-contracts'

// 24 · The Disagreement Cable. A patch panel that conducts only disagreement.
// The top row holds things that can be disagreed with (three of the essay's
// hypotheses and two of the view's own links); the bottom row holds the
// parties. Patch one to the other: the meter reads what the records say about
// that disagreement, or refuses if no record says there is one. Reads the
// unchanged Community fixtures; the disagreements are derived from them.

const CLAIMS = [
  {
    id: 'H1',
    label: 'essay H1',
    what: 'the essay’s hypothesis H1 (the Four Words evaluation)',
  },
  {
    id: 'H2',
    label: 'essay H2',
    what: 'the essay’s hypothesis H2 (portability)',
  },
  {
    id: 'H4',
    label: 'essay H4',
    what: 'the essay’s hypothesis H4 (pinned revisions)',
  },
  { id: 'k7', label: 'link k7', what: 'the model’s link k7, “same question”' },
  { id: 'k8', label: 'link k8', what: 'the editor’s link k8, “corrects”' },
] as const

const PARTIES = ['c2', 'c3', 'c4', 'c5', 'c7', 'editor'] as const
type Party = (typeof PARTIES)[number]
type ClaimId = (typeof CLAIMS)[number]['id']

const byId = new Map(CONTRIBUTIONS.map((c) => [c.id, c]))
const partyName = (p: Party) => (p === 'editor' ? 'the editor' : byId.get(p)!.author.handle.replace('.example', ''))
const contract = (id: string) => CONTRACTS.find((k) => k.id === id)!

interface Reading {
  typed: 'record type' | 'prose only' | 'contract history' | 'unknown'
  says: string
  basis: string
  answered: string
  standing: string
}

// What the records say about one party disagreeing with one claim, or null.
function read(p: Party, claim: ClaimId): Reading | null {
  if (p === 'editor') {
    if (claim === 'k7') {
      const k = contract('k7')
      return {
        typed: 'contract history',
        says: 'The editor disputes the model’s link.',
        basis: k.history.at(-1)!.note,
        answered: 'A model cannot reply.',
        standing: status(k),
      }
    }
    if (claim === 'k8') {
      const k = contract('k8')
      return {
        typed: 'contract history',
        says: 'The editor disagrees with its own earlier reading.',
        basis: k.history.at(-1)!.note,
        answered: 'Settled by the one who proposed it.',
        standing: status(k),
      }
    }
    return null
  }
  const c = byId.get(p)!
  if (c.claim !== claim) return null
  if (c.availability !== 'available')
    return {
      typed: 'unknown',
      says: `${partyName(p)} wrote about ${claim}, but the record cannot be read.`,
      basis: 'Known only from an index’s earlier copy of the reference.',
      answered: 'Unknown.',
      standing: c.availability.replace('-', ' '),
    }
  const endorsers = CONTRACTS.filter((k) => k.to === c.id && k.type === 'endorses').map((k) => partyName(k.from as Party))
  const replies = CONTRACTS.filter((k) => k.to === c.id && k.proposer === 'author' && k.type !== 'endorses' && status(k) !== 'withdrawn')
  const answered = replies.length
    ? `${replies.length} authored answers`
    : endorsers.length
      ? `No reply from the essay’s author. Endorsed by ${endorsers.join(', ')}.`
      : 'No reply from anyone.'
  if (c.kind === 'dispute' || c.kind === 'correction')
    return {
      typed: 'record type',
      says: `${partyName(p)}’s record is a ${c.kind} of ${claim}.`,
      basis: c.text,
      answered,
      standing: `declared (${c.nsid}, a hypothetical type)`,
    }
  if (c.kind === 'reply')
    return {
      typed: 'prose only',
      says: `${partyName(p)} raises a doubt about ${claim}, in an ordinary reply.`,
      basis: c.text,
      answered,
      standing: 'declared as a reply: the record type cannot say it disagrees',
    }
  return null
}

// Jack positions as percentages of the panel, shared by the buttons and the cables.
const X = (i: number, n: number) => 8 + (84 * i) / (n - 1)
const TOP = 14
const BOTTOM = 86

export default function DisagreementCable() {
  const [holding, setHolding] = useState<Party | null>(null)
  const [cables, setCables] = useState<Array<{ p: Party; c: ClaimId }>>([])
  const [last, setLast] = useState<{ p: Party; c: ClaimId } | null>(null)

  const pickParty = (p: Party) => setHolding((h) => (h === p ? null : p))
  const pickClaim = (c: ClaimId) => {
    if (!holding) return
    const hit = read(holding, c)
    if (hit && !cables.some((k) => k.p === holding && k.c === c)) setCables((k) => [...k, { p: holding, c }])
    setLast({ p: holding, c })
    setHolding(null)
  }

  const meter = last ? read(last.p, last.c) : null
  const tally = cables.map((k) => read(k.p, k.c)!.typed)
  const count = (t: Reading['typed']) => tally.filter((x) => x === t).length

  return (
    <div className="x24">
      <div className="x24__panel">
        <svg className="x24__wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {cables.map(({ p, c }) => {
            const x1 = X(PARTIES.indexOf(p), PARTIES.length)
            const x2 = X(
              CLAIMS.findIndex((k) => k.id === c),
              CLAIMS.length,
            )
            const t = read(p, c)!.typed
            return (
              <path
                key={p + c}
                className={`x24__cable x24__cable--${t.replace(' ', '-')}`}
                d={`M${x1} ${BOTTOM} C ${x1} ${BOTTOM - 40}, ${x2} ${TOP + 40}, ${x2} ${TOP}`}
                vectorEffect="non-scaling-stroke"
              />
            )
          })}
        </svg>
        {CLAIMS.map((k, i) => (
          <button
            key={k.id}
            type="button"
            className="x24__jack x24__jack--claim"
            style={{ left: `${X(i, CLAIMS.length)}%`, top: `${TOP}%` }}
            onClick={() => pickClaim(k.id)}
            disabled={!holding}
            aria-label={`Plug into ${k.what}`}
          >
            <span className="x24__hole" aria-hidden="true" />
            <span className="x24__lbl">{k.label}</span>
          </button>
        ))}
        {PARTIES.map((p, i) => (
          <button
            key={p}
            type="button"
            className="x24__jack x24__jack--party"
            style={{ left: `${X(i, PARTIES.length)}%`, top: `${BOTTOM}%` }}
            onClick={() => pickParty(p)}
            aria-pressed={holding === p}
            aria-label={`Pick up a cable from ${partyName(p)}`}
            data-probe={p === 'c5' ? 'click' : undefined}
          >
            <span className="x24__lbl">{p === 'editor' ? 'editor' : partyName(p)}</span>
            <span className="x24__hole" aria-hidden="true" />
          </button>
        ))}
      </div>

      <ul className="x24__legend" aria-label="Cable styles">
        <li>solid · a record type says it</li>
        <li>dashed · prose only</li>
        <li>thick · the view’s own history</li>
        <li>dotted · unreadable</li>
      </ul>

      <div className="x24__meter" data-observe role="status">
        {holding ? (
          <p className="x24__reading">Holding a cable from {partyName(holding)}. Plug it into something above.</p>
        ) : !last ? (
          <p className="x24__reading">Pick up a cable from a party below, then plug it into a claim above.</p>
        ) : !meter ? (
          <p className="x24__reading x24__reading--none">
            No current. No record says {partyName(last.p)} disagrees with {CLAIMS.find((k) => k.id === last.c)!.what}. The panel will not
            draw a disagreement nobody wrote.
          </p>
        ) : (
          <>
            <p className="x24__reading">{meter.says}</p>
            <dl>
              <dt>Where it is written</dt>
              <dd>{meter.typed}</dd>
              <dt>On what grounds</dt>
              <dd>{meter.basis}</dd>
              <dt>Answered</dt>
              <dd>{meter.answered}</dd>
              <dt>Standing</dt>
              <dd>{meter.standing}</dd>
            </dl>
          </>
        )}
        <p className="lab-out">
          {cables.length} patched · {count('record type')} by record type · {count('prose only')} in prose only ·{' '}
          {count('contract history')} in the view’s history · {count('unknown')} unreadable
        </p>
      </div>
    </div>
  )
}
