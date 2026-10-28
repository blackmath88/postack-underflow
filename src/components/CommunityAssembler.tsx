import { useState } from 'react'
import {
  CONTRIBUTIONS,
  RELATIONS,
  type Contribution,
  type Relation,
  type RelationOrigin,
} from '../data/community-fixtures'

const ORIGINS: Array<{ id: RelationOrigin; label: string; note: string }> = [
  { id: 'author-declared', label: 'Declared by authors', note: 'references written inside the records' },
  { id: 'view-curated', label: 'Curated by this view', note: 'an editor’s grouping, not the authors’' },
  { id: 'model-proposed', label: 'Proposed by a model', note: 'unreviewed suggestions' },
]

const byId = new Map(CONTRIBUTIONS.map((c) => [c.id, c]))

function Body({ c }: { c: Contribution }) {
  if (c.availability === 'source-offline') {
    return <p className="cm-unavailable">Source unreachable. The author’s repository is offline, so there is no text to show. The type and target above come from an index’s earlier copy of the record’s metadata; this view keeps no copy of its text.</p>
  }
  if (c.availability === 'deleted') {
    return <p className="cm-unavailable">Deleted by its author. Nothing remains at the source; the address and type above are an index’s memory of the reference.</p>
  }
  return <p className="cm-text">{c.text}</p>
}

function Meta({ c }: { c: Contribution }) {
  return (
    <p className="cm-meta">
      <span className="cm-handle">{c.author.handle}</span>
      <span className={`cm-kind cm-kind--${c.kind}`}>{c.kind}</span>
      {c.claim && <span>on {c.claim}</span>}
      <code>{c.nsid}</code>
      {c.nsidStatus === 'hypothetical' && <span className="cm-hypothetical">no Lexicon exists</span>}
    </p>
  )
}

function RelationNote({ r }: { r: Relation }) {
  return (
    <p className={`cm-relation cm-relation--${r.origin}`}>
      <strong>{r.kind.replace('-', ' ')}</strong> · {ORIGINS.find((o) => o.id === r.origin)?.label.toLowerCase()} · {r.reason}
    </p>
  )
}

function AlsoRelated({ c, all, shown }: { c: Contribution; all: Relation[]; shown?: Relation }) {
  const extra = all.filter((r) => r.from === c.id && r.id !== shown?.id)
  if (!extra.length) return null
  return (
    <div className="cm-also">
      {extra.map((r) => (
        <div key={r.id}>
          <RelationNote r={r} />
          <p className="cm-small">→ {byId.get(r.to)?.author.handle}’s {byId.get(r.to)?.kind}</p>
        </div>
      ))}
    </div>
  )
}

function Node({
  c,
  relations,
  all,
  via,
  depth,
}: {
  c: Contribution
  relations: Relation[]
  all: Relation[]
  via?: Relation
  depth: number
}) {
  const children = relations.filter((r) => r.to === c.id)
  return (
    <li className="cm-node" data-depth={depth}>
      {via && <RelationNote r={via} />}
      <article className={`cm-card cm-card--${c.availability}`} aria-label={`${c.kind} by ${c.author.handle}`}>
        <Meta c={c} />
        <Body c={c} />
        <AlsoRelated c={c} all={all} shown={via} />
      </article>
      {children.length > 0 && depth < 4 && (
        <ul className="cm-children">
          {children.map((r) => {
            const child = byId.get(r.from)
            return child ? <Node key={r.id} c={child} relations={relations} all={all} via={r} depth={depth + 1} /> : null
          })}
        </ul>
      )}
    </li>
  )
}

export function CommunityAssembler() {
  const [view, setView] = useState<'assembled' | 'ledger'>('assembled')
  const [enabled, setEnabled] = useState<Record<RelationOrigin, boolean>>({
    'author-declared': true,
    'view-curated': true,
    'model-proposed': false,
  })

  const relations = RELATIONS.filter((r) => enabled[r.origin])
  // Each contribution appears once in the assembled view: under the first
  // enabled relation that reaches it from the article, otherwise unconnected.
  const reached = new Set<string>(['c1'])
  let grew = true
  while (grew) {
    grew = false
    for (const r of relations) {
      if (reached.has(r.to) && !reached.has(r.from)) {
        reached.add(r.from)
        grew = true
      }
    }
  }
  const treeRelations = relations.filter((r, i) => relations.findIndex((x) => x.from === r.from) === i)
  const unconnected = CONTRIBUTIONS.filter((c) => !reached.has(c.id))
  const allOff = !Object.values(enabled).some(Boolean)

  const toggle = (origin: RelationOrigin) => setEnabled((e) => ({ ...e, [origin]: !e[origin] }))
  const setAll = (value: boolean) =>
    setEnabled({ 'author-declared': value, 'view-curated': value, 'model-proposed': value })

  return (
    <section className="assembler wide" aria-labelledby="assembler-title">
      <header className="assembler__header">
        <p className="kicker">Demonstration · fixture records</p>
        <h2 id="assembler-title">One discussion, owned by nobody here</h2>
        <p>
          Seven invented responses to this essay, plus the essay itself, each stored in its author’s
          own repository. This page only draws the connections. Turn relation layers off, or remove all of them, and
          watch what stays.
        </p>
      </header>

      <div className="assembler__controls">
        <div role="group" aria-label="View">
          <button type="button" aria-pressed={view === 'assembled'} onClick={() => setView('assembled')}>
            Assembled discussion
          </button>
          <button type="button" aria-pressed={view === 'ledger'} onClick={() => setView('ledger')}>
            Source ledger
          </button>
        </div>
        <fieldset>
          <legend>Relations drawn</legend>
          {ORIGINS.map((o) => (
            <label key={o.id} className={`cm-origin cm-origin--${o.id}`}>
              <input type="checkbox" checked={enabled[o.id]} onChange={() => toggle(o.id)} />
              {o.label} <span>({o.note})</span>
            </label>
          ))}
          <button type="button" className="cm-all" onClick={() => setAll(allOff)}>
            {allOff ? 'Reconnect everything' : 'Remove every relation'}
          </button>
        </fieldset>
      </div>

      <p className="cm-status" role="status" aria-live="polite">
        {CONTRIBUTIONS.length} contributions in {new Set(CONTRIBUTIONS.map((c) => c.author.did)).size} authors’ repositories ·{' '}
        {relations.length} relations drawn by this view · 0 contributions changed
      </p>

      {view === 'assembled' ? (
        <div className="cm-assembled">
          <ul className="cm-tree">
            <Node c={byId.get('c1')!} relations={treeRelations} all={relations} depth={0} />
          </ul>
          {unconnected.length > 0 && (
            <>
              <h3 className="cm-subhead">Not connected in this view ({unconnected.length})</h3>
              <p className="cm-note">Still published, still attributed. This view just isn’t drawing a line to them.</p>
              <ul className="cm-flat">
                {unconnected.map((c) => (
                  <li key={c.id}>
                    <article className={`cm-card cm-card--${c.availability}`} aria-label={`${c.kind} by ${c.author.handle}`}>
                      <Meta c={c} />
                      <Body c={c} />
                      <AlsoRelated c={c} all={relations} />
                    </article>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="cm-ledger">
            <caption className="kicker table-caption">
              As stored at each source, or as an index last saw it where the source is offline or the record deleted. Relation settings never change this table.
            </caption>
            <thead>
              <tr>
                <th scope="col">Author</th>
                <th scope="col">Record</th>
                <th scope="col">Type</th>
                <th scope="col">Availability</th>
                <th scope="col">References in the record</th>
              </tr>
            </thead>
            <tbody>
              {CONTRIBUTIONS.map((c) => (
                <tr key={c.id}>
                  <th scope="row">
                    {c.author.handle}
                    <br />
                    <span className="cm-small">{c.home}</span>
                  </th>
                  <td>
                    <code className="cm-uri">{c.uri}</code>
                    <br />
                    <span className="cm-small">cid {c.cid}</span>
                  </td>
                  <td>
                    <code>{c.nsid}</code>
                    <br />
                    <span className="cm-small">{c.nsidStatus === 'existing' ? 'existing Lexicon' : 'hypothetical'}</span>
                  </td>
                  <td>{c.availability.replace('-', ' ')}</td>
                  <td>
                    {c.refs.length
                      ? c.refs.map((r) => (
                          <span key={r.uri} className="cm-small">
                            {r.role} → {byId.get(CONTRIBUTIONS.find((x) => x.uri === r.uri)?.id ?? '')?.author.handle ?? r.uri}
                          </span>
                        ))
                      : <span className="cm-small">none readable</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="aside">
        Fixture data: every handle, DID, address and CID is invented and uses reserved <code>.example</code> names. Nothing is
        fetched from or published to any network.
      </p>
    </section>
  )
}
