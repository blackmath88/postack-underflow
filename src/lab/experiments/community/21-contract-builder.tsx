import { useState } from 'react'
import { CONTRIBUTIONS, type Contribution } from '../../../data/community-fixtures'
import { RELATION_TYPES, type RelationType } from '../../../data/connection-contracts'

// 21 · The Connection Contract, authored. The Community page lets you read
// the nine fixture contracts and propose one more. This pilot does the
// opposite: it walks you through writing one, field by field, as a chosen
// party, and refuses each field you are not entitled to fill, saying why.
// It reads the unchanged Community fixtures; the record it exports is local
// text and is never published.

type RoleKind = 'author' | 'editor' | 'model' | 'reader'
interface Role {
  id: string
  label: string
  kind: RoleKind
  handle?: string
  did: string
}

const ROLES: Role[] = [
  {
    id: 'ines',
    label: 'ines.example, an author',
    kind: 'author',
    handle: 'ines.example',
    did: 'did:example:ines',
  },
  {
    id: 'mara',
    label: 'mara.example, an author',
    kind: 'author',
    handle: 'mara.example',
    did: 'did:example:mara',
  },
  {
    id: 'jun',
    label: 'jun.example, an author',
    kind: 'author',
    handle: 'jun.example',
    did: 'did:example:jun',
  },
  {
    id: 'tomas',
    label: 'tomas.example, an author',
    kind: 'author',
    handle: 'tomas.example',
    did: 'did:example:tomas',
  },
  {
    id: 'rui',
    label: 'rui.example, who deleted a reply',
    kind: 'author',
    handle: 'rui.example',
    did: 'did:example:rui',
  },
  {
    id: 'editor',
    label: 'this view’s editor',
    kind: 'editor',
    did: 'did:example:postack-view',
  },
  {
    id: 'model',
    label: 'a language model',
    kind: 'model',
    did: 'did:example:postack-view',
  },
  {
    id: 'reader',
    label: 'you, a reader',
    kind: 'reader',
    did: 'did:example:you',
  },
]

type Standing = 'declared' | 'proposed' | 'accepted'
const STANDINGS: Standing[] = ['declared', 'proposed', 'accepted']

const byId = new Map(CONTRIBUTIONS.map((c) => [c.id, c]))
const who = (c: Contribution) => `${c.author.handle.replace('.example', '')} · ${c.kind}`

// Which field of the source record could carry a reference, by record type.
// Existing Lexicons from docs/research/ATPROTO-COMMUNITY.md; the example.postack
// types are our placeholders, so they say whatever we define.
const FIELDS: Record<string, Partial<Record<RelationType, string>>> = {
  'app.bsky.feed.post': { 'replies-to': 'reply.parent', cites: 'embed.record' },
  'site.standard.document': {},
  'example.postack.correction': { corrects: 'subject' },
  'example.postack.dispute': { disputes: 'subject' },
  'example.postack.endorsement': { endorses: 'subject' },
}

type Refusal = string | null

/** Why `role` may not declare anything from `from`, or null if they may. */
function declareRefusal(role: Role, from: Contribution): Refusal {
  if (role.kind !== 'author')
    return `Only ${from.author.handle} can declare a link from this record: it is written inside their repository.`
  if (role.handle !== from.author.handle) return `This is ${from.author.handle}’s record, not yours. You can only propose.`
  if (from.availability === 'deleted') return 'You deleted this record. Nothing can be written into a record that no longer exists.'
  return null
}

function relationRefusal(role: Role, from: Contribution, to: Contribution, standing: Standing, type: RelationType): Refusal {
  if (from.id === to.id) return 'A contribution cannot be linked to itself.'
  if (standing !== 'declared') return null
  if (declareRefusal(role, from)) return 'Declaring is refused above.'
  const field = FIELDS[from.nsid]?.[type]
  if (field) return null
  if (from.nsid === 'site.standard.document')
    return 'Our protocol notes found no field in site.standard.document for pointing at another record, other than bskyPostRef.'
  return `A ${from.nsid} record has no field for “${type}”.`
}

function standingRefusal(role: Role, from: Contribution, standing: Standing): Refusal {
  if (standing === 'declared') {
    const r = declareRefusal(role, from)
    if (r) return r
    if (!Object.keys(FIELDS[from.nsid] ?? {}).length)
      return `Your record is a ${from.nsid}, and our protocol notes found no field in it for pointing at another record, other than bskyPostRef.`
    return null
  }
  if (standing === 'accepted') {
    if (role.kind === 'model') return 'A model cannot accept its own suggestion.'
    if (role.kind !== 'editor') return 'Acceptance is the view’s reading, so only whoever runs the view can give it.'
  }
  return null
}

function home(role: Role, from: Contribution, standing: Standing, type: RelationType): string {
  if (standing === 'declared') return `Inside ${from.author.handle}’s own record, in its ${FIELDS[from.nsid]?.[type] ?? '?'} field.`
  if (role.kind === 'model')
    return 'A model has no repository. The suggestion is stored by whoever ran it, under their identifier, and must say a model wrote it.'
  return `A separate record in ${role.did}, of a placeholder type. Neither author’s record changes.`
}

function withdrawer(role: Role, from: Contribution, standing: Standing): string {
  if (standing === 'declared') return `Only ${from.author.handle}, by editing or deleting the record.`
  if (standing === 'accepted') return 'The editor, and the acceptance stays in the history.'
  if (role.kind === 'model') return 'Whoever ran the model. The model itself cannot.'
  return `Only ${role.kind === 'author' ? role.handle : role.label}, the proposer.`
}

function ref(c: Contribution) {
  if (c.availability === 'deleted') return { uri: c.uri, cid: '(unknown at source; an index’s old copy only)' }
  if (c.availability === 'source-offline') return { uri: c.uri, cid: `${c.cid} (cannot be checked: source offline)` }
  return { uri: c.uri, cid: c.cid }
}

function exportRecord(role: Role, from: Contribution, to: Contribution, standing: Standing, type: RelationType) {
  if (standing === 'declared') {
    const field = FIELDS[from.nsid]?.[type] ?? 'subject'
    return {
      $type: from.nsid,
      note: 'only the reference field is shown; the rest of the record is the author’s',
      [field]: ref(to),
    }
  }
  return {
    $type: 'example.postack.connection',
    from: ref(from),
    to: ref(to),
    relation: type,
    standing,
    proposedBy: role.did,
    ...(role.kind === 'model' ? { generatedBy: 'a language model, unreviewed' } : {}),
    reason: '(free text; required, and not checked by anything)',
    createdAt: '2026-10-28',
  }
}

export default function ContractBuilder() {
  const [roleId, setRoleId] = useState('ines')
  const [fromId, setFromId] = useState('c2')
  const [toId, setToId] = useState('c1')
  const [standing, setStanding] = useState<Standing>('declared')
  const [type, setType] = useState<RelationType>('replies-to')

  const role = ROLES.find((r) => r.id === roleId)!
  const from = byId.get(fromId)!
  const to = byId.get(toId)!

  // If the current choice becomes refused, fall back to the first allowed one.
  const standingOk = (s: Standing) => !standingRefusal(role, from, s)
  const effStanding: Standing = standingOk(standing) ? standing : STANDINGS.find(standingOk)!
  const relOk = (t: RelationType) => !relationRefusal(role, from, to, effStanding, t)
  const effType: RelationType | undefined = relOk(type) ? type : RELATION_TYPES.find(relOk)

  const refusals = [
    ...STANDINGS.flatMap((s) => {
      const r = standingRefusal(role, from, s)
      return r ? [`${s}: ${r}`] : []
    }),
    ...RELATION_TYPES.flatMap((t) => {
      const r = relationRefusal(role, from, to, effStanding, t)
      return r && r !== 'Declaring is refused above.' ? [`${t}: ${r}`] : []
    }),
  ]
  const unique = [...new Set(refusals)]

  return (
    <div className="x21">
      <ol className="x21__form">
        <li>
          <label htmlFor="x21-role">Who is writing this contract?</label>
          <select id="x21-role" value={roleId} onChange={(e) => setRoleId(e.target.value)} data-probe="click">
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </li>
        <li>
          <div className="x21__pair">
            <div>
              <label htmlFor="x21-from">From</label>
              <select id="x21-from" value={fromId} onChange={(e) => setFromId(e.target.value)}>
                {CONTRIBUTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} {who(c)}
                    {c.availability !== 'available' ? ` (${c.availability.replace('-', ' ')})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="x21-to">To</label>
              <select id="x21-to" value={toId} onChange={(e) => setToId(e.target.value)}>
                {CONTRIBUTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} {who(c)}
                    {c.availability !== 'available' ? ` (${c.availability.replace('-', ' ')})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </li>
        <li>
          <fieldset>
            <legend>Standing</legend>
            {STANDINGS.map((s) => {
              const r = standingRefusal(role, from, s)
              return (
                <label key={s} className={r ? 'is-refused' : undefined}>
                  <input type="radio" name="x21-standing" checked={effStanding === s} disabled={!!r} onChange={() => setStanding(s)} /> {s}
                  {r && <span className="x21__why">refused</span>}
                </label>
              )
            })}
          </fieldset>
        </li>
        <li>
          <fieldset>
            <legend>Relation</legend>
            {RELATION_TYPES.map((t) => {
              const r = relationRefusal(role, from, to, effStanding, t)
              return (
                <label key={t} className={r ? 'is-refused' : undefined}>
                  <input type="radio" name="x21-type" checked={effType === t} disabled={!!r} onChange={() => setType(t)} />{' '}
                  {t.replace('-', ' ')}
                  {r && <span className="x21__why">refused</span>}
                </label>
              )
            })}
          </fieldset>
        </li>
      </ol>

      <div className="x21__out" data-observe>
        <p className="x21__stamp">
          {effType ? (
            <>
              <strong>{role.kind === 'author' ? role.handle : role.label}</strong> may write: {from.id} <em>{effType.replace('-', ' ')}</em>{' '}
              {to.id}, {effStanding}.
            </>
          ) : (
            <>
              <strong>No contract can be written</strong> by {role.kind === 'author' ? role.handle : role.label} from {from.id} to {to.id}.
            </>
          )}
        </p>
        {effType && (
          <dl className="x21__terms">
            <dt>Where it lives</dt>
            <dd>{home(role, from, effStanding, effType)}</dd>
            <dt>Who may withdraw it</dt>
            <dd>{withdrawer(role, from, effStanding)}</dd>
          </dl>
        )}
        {effType && (
          <div data-scroll className="x21__record">
            <pre>{JSON.stringify(exportRecord(role, from, to, effStanding, effType), null, 2)}</pre>
          </div>
        )}
        <h3>Refused for {role.kind === 'author' ? role.handle : role.label}</h3>
        {unique.length ? (
          <ul className="x21__refusals">
            {unique.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        ) : (
          <p>Nothing is refused for this pair.</p>
        )}
        <p className="x21__local">Local text only. Nothing here is signed, stored or published.</p>
      </div>
    </div>
  )
}
