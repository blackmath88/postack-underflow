import { useEffect, useMemo, useState } from 'react'
import type { RelationBasis } from '../model'
import {
  BASIS_GLOSS, BASIS_LABEL, ROLE_LABEL, VIEW, basisOf, day, sourceFor, sourceLabel, who,
  type MapContribution, type MapProposal,
} from './data'
import { Inline } from './Inline'

/** A short, unambiguous name for one end of a connection. */
function endpoint(c: MapContribution): string {
  const s = sourceFor(c.refKey)
  if (!s) return c.refKey
  if (s.kind === 'doc') {
    const lines = /#L(\d+)/.exec(c.refKey)?.[1]
    return `${(s.path ?? '').split('/').pop()}${lines ? ` line ${lines}` : ''}`
  }
  return `#${s.number}${s.comment ? ` · ${who(c.authoredBy)}` : ''}`
}

const ROW = 76 // px; rows are fixed-height so cords can be drawn without measuring
const BASES: RelationBasis[] = ['source-declared', 'editorial', 'deterministic', 'machine-proposal']

/** Curated documents first (they summarise), then contributions in the order they were written. */
function ordered(cs: MapContribution[]): MapContribution[] {
  return [...cs].sort((a, b) => {
    const da = a.refKey.startsWith('docs/') ? 0 : 1
    const db = b.refKey.startsWith('docs/') ? 0 : 1
    return da - db || (a.writtenAt ?? '').localeCompare(b.writtenAt ?? '') || a.refKey.localeCompare(b.refKey)
  })
}

/** Greedy lanes so cords spanning the same rows do not sit on top of each other. */
function lanes(links: Array<{ id: string; a: number; b: number }>): Map<string, number> {
  const byLen = [...links].sort((x, y) => Math.abs(x.a - x.b) - Math.abs(y.a - y.b) || x.id.localeCompare(y.id))
  const used: Array<Array<[number, number]>> = []
  const out = new Map<string, number>()
  for (const l of byLen) {
    const lo = Math.min(l.a, l.b)
    const hi = Math.max(l.a, l.b)
    let lane = 0
    while (used[lane]?.some(([s, e]) => !(hi < s || lo > e))) lane++
    ;(used[lane] ??= []).push([lo, hi])
    out.set(l.id, lane)
  }
  return out
}

export function Connect({ problemId }: { problemId: string }) {
  const data = VIEW.map[problemId]
  const [view, setView] = useState<'map' | 'thread'>('map')
  const [enhanced, setEnhanced] = useState(false)
  const [shown, setShown] = useState<Record<RelationBasis, boolean>>({
    'source-declared': true, editorial: true, deterministic: true, 'machine-proposal': true,
  })
  const [unplugged, setUnplugged] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  useEffect(() => setEnhanced(true), [])

  const rows = useMemo(() => ordered(data?.contributions ?? []), [data])
  const rowOf = useMemo(() => new Map(rows.map((c, i) => [c.id, i])), [rows])
  const edges = useMemo(
    () => (data?.proposals ?? []).filter((p) => p.kind !== 'classification' && p.targetId && rowOf.has(p.sourceId) && rowOf.has(p.targetId)),
    [data, rowOf],
  )
  const visible = edges.filter((e) => shown[basisOf(e)] && !unplugged.includes(e.id))
  const lane = useMemo(() => lanes(edges.map((e) => ({ id: e.id, a: rowOf.get(e.sourceId)!, b: rowOf.get(e.targetId!)! }))), [edges, rowOf])
  const readings = new Map((data?.proposals ?? []).filter((p) => p.kind === 'classification').map((p) => [p.sourceId, p]))
  if (!data) return null

  const maxLane = Math.min(9, Math.max(0, ...lane.values()))
  const field = 28 + (maxLane + 1) * 11
  const sel = edges.find((e) => e.id === selected) ?? null
  const touches = (c: MapContribution) => !!sel && (sel.sourceId === c.id || sel.targetId === c.id)
  const byId = new Map(rows.map((c) => [c.id, c]))

  return (
    <section className="pfc-connect" aria-labelledby="connect-title" id="connect">
      <p className="pfc-step" aria-hidden="true">03 · Connect</p>
      <h2 id="connect-title">Contributions, and why they are connected</h2>
      <p className="pfc-lede">
        The same {rows.length} contributions in two projections. Both are derived views of br-ai-nstorm’s event log,
        not memory of their own. {enhanced ? null : 'With JavaScript off, both views are shown.'}
      </p>
      {enhanced && (
        <div className="pfc-toggle" role="group" aria-label="Projection">
          <button type="button" aria-pressed={view === 'map'} onClick={() => setView('map')}>
            Map
          </button>
          <button type="button" aria-pressed={view === 'thread'} onClick={() => setView('thread')}>
            Thread
          </button>
        </div>
      )}

      {(!enhanced || view === 'map') && (
        <div className="pfc-map">
          <fieldset className="pfc-filters">
            <legend>Show connections</legend>
            {BASES.map((b) => {
              const n = edges.filter((e) => basisOf(e) === b).length
              return (
                <label key={b} className={`pfc-filter pfc-basis--${b}`}>
                  <input type="checkbox" checked={shown[b]} disabled={!n} onChange={() => setShown({ ...shown, [b]: !shown[b] })} />
                  <span className="pfc-swatch" aria-hidden="true" /> {BASIS_LABEL[b]} <span className="pfc-count">{n}</span>
                </label>
              )
            })}
          </fieldset>

          <div className="pfc-board" style={{ ['--row' as string]: `${ROW}px`, ['--field' as string]: `${field}px` }}>
            <svg className="pfc-cords" width={field} height={rows.length * ROW} aria-hidden="true" focusable="false">
              {rows.map((c, i) => (
                <circle key={c.id} className="pfc-jack" cx={field - 8} cy={i * ROW + ROW / 2} r={4} />
              ))}
              {visible.map((e) => {
                const ya = rowOf.get(e.sourceId)! * ROW + ROW / 2
                const yb = rowOf.get(e.targetId!)! * ROW + ROW / 2
                const x = field - 8
                const d = 14 + Math.min(9, lane.get(e.id) ?? 0) * 11
                const conflict = e.kind === 'conflict'
                return (
                  <path
                    key={e.id}
                    className={`pfc-cord pfc-basis--${basisOf(e)}${conflict ? ' pfc-cord--conflict' : ''}${selected === e.id ? ' is-selected' : ''}`}
                    d={`M ${x} ${ya} C ${x - d} ${ya}, ${x - d} ${yb}, ${x} ${yb}`}
                  />
                )
              })}
            </svg>
            <ol className="pfc-rows">
              {rows.map((c) => {
                const s = sourceFor(c.refKey)
                const reading = readings.get(c.id)
                return (
                  <li key={c.id} className={`pfc-row${touches(c) ? ' is-touched' : ''}`}>
                    <p className="pfc-row__meta">
                      <span className="pfc-row__who">{who(c.authoredBy)}</span> · {sourceLabel(s)}
                      {s?.at ? ` · ${day(s.at)}` : ''}
                    </p>
                    <p className="pfc-row__text">
                      {c.contentIsTitle ? <em>{c.content}</em> : <q><Inline text={c.content} /></q>}
                    </p>
                    <p className="pfc-row__kinds">
                      <span title="br-ai-nstorm’s lexical classifier">lexical: {c.kind}</span>
                      {reading && <span className="pfc-basis--machine-proposal" title="The record writer’s classification proposal"> · record writer: {reading.suggestedKind}</span>}
                    </p>
                  </li>
                )
              })}
            </ol>
          </div>

          <div className="pfc-wires">
            <h3>Connections {visible.length !== edges.length && <span className="pfc-count">{visible.length} of {edges.length} shown</span>}</h3>
            {edges.length === 0 && <p className="pfc-empty">No connection was declared, derived or proposed between these contributions.</p>}
            <ul>
              {visible.map((e) => (
                <li key={e.id}>
                  <button type="button" className={`pfc-wire pfc-basis--${basisOf(e)}`} aria-expanded={selected === e.id} onClick={() => setSelected(selected === e.id ? null : e.id)}>
                    <span className="pfc-swatch" aria-hidden="true" />
                    <span>
                      {endpoint(byId.get(e.sourceId)!)} → {endpoint(byId.get(e.targetId!)!)}
                      <span className="pfc-wire__kind"> · {e.kind === 'conflict' ? `possible ${e.conflictKind?.replace('_', ' ')}` : e.relationKind}</span>
                    </span>
                  </button>
                  {selected === e.id && (
                    <Inspector p={e} a={byId.get(e.sourceId)!} b={byId.get(e.targetId!)!} onUnplug={() => { setUnplugged([...unplugged, e.id]); setSelected(null) }} />
                  )}
                </li>
              ))}
            </ul>
            {unplugged.length > 0 && (
              <div className="pfc-unplugged">
                <h4>Unplugged in this view</h4>
                <p className="pfc-hint">Removed from your view only. The sources are untouched, and the proposals still stand in the log.</p>
                <ul>
                  {unplugged.map((id) => {
                    const e = edges.find((x) => x.id === id)!
                    return (
                      <li key={id}>
                        {endpoint(byId.get(e.sourceId)!)} → {endpoint(byId.get(e.targetId!)!)}{' '}
                        <button type="button" className="pfc-linkish" onClick={() => setUnplugged(unplugged.filter((x) => x !== id))}>
                          plug back in
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {(!enhanced || view === 'thread') && <Thread problemId={problemId} rows={rows} />}

      <p className="pfc-compare">
        <strong>What each view keeps.</strong> The map shows why contributions are connected and who says so, but
        flattens time and conversation. The thread shows who said what, when and where, but cannot show that one report
        contradicts another: only the map can, and only as a proposal.
      </p>
    </section>
  )
}

function Inspector({ p, a, b, onUnplug }: { p: MapProposal; a: MapContribution; b: MapContribution; onUnplug: () => void }) {
  const basis = basisOf(p)
  return (
    <div className={`pfc-inspector pfc-basis--${basis}`} role="region" aria-label="Why this connection exists">
      <p className="pfc-inspector__basis">
        <span className="pfc-swatch" aria-hidden="true" /> {BASIS_LABEL[basis]}
      </p>
      <p>{BASIS_GLOSS[basis]}</p>
      <p className="pfc-inspector__reason">{p.reason}</p>
      <dl className="pfc-dl">
        <dt>Proposed by</dt>
        <dd>
          <code>{p.proposedBy}</code>
          {p.onBehalfOf && <> on behalf of <code>{p.onBehalfOf}</code></>}
        </dd>
        <dt>Status</dt>
        <dd>pending: no person has accepted it</dd>
        <dt>Between</dt>
        <dd>
          <a href={sourceFor(a.refKey)?.url}>{sourceLabel(sourceFor(a.refKey))}</a> ({who(a.authoredBy)}) and{' '}
          <a href={sourceFor(b.refKey)?.url}>{sourceLabel(sourceFor(b.refKey))}</a> ({who(b.authoredBy)})
        </dd>
      </dl>
      {basis === 'machine-proposal' ? (
        <button type="button" className="pfc-button" onClick={onUnplug}>
          Unplug this proposal from my view
        </button>
      ) : (
        <p className="pfc-hint">Declared by a source, so it stays plugged in. You can hide its whole kind with the filters.</p>
      )}
    </div>
  )
}

function Thread({ problemId, rows }: { problemId: string; rows: MapContribution[] }) {
  const elsewhere = VIEW.elsewhere.byProblem[problemId] ?? []
  const groups = new Map<string, MapContribution[]>()
  for (const c of rows) {
    const key = c.refKey.startsWith('docs/') ? c.refKey.split('#')[0]! : c.refKey.split('#')[0]!
    groups.set(key, [...(groups.get(key) ?? []), c])
  }
  const sorted = [...groups.entries()].sort(
    ([, a], [, b]) => (a[0]!.writtenAt ?? '').localeCompare(b[0]!.writtenAt ?? ''),
  )
  return (
    <div className="pfc-thread">
      <ol>
        {sorted.map(([key, items]) => {
          const head = sourceFor(key) ?? sourceFor(items[0]!.refKey)
          return (
            <li key={key} className="pfc-thread__group">
              <p className="pfc-thread__head">
                <a href={head?.url}>{head?.kind === 'doc' ? head.path : `${sourceLabel(head)} · ${head?.title ?? ''}`}</a>
              </p>
              <ol>
                {[...items].sort((a, b) => (a.writtenAt ?? '').localeCompare(b.writtenAt ?? '')).map((c) => {
                  const s = sourceFor(c.refKey)
                  return (
                    <li key={c.id} className="pfc-thread__item">
                      <p className="pfc-row__meta">
                        <span className="pfc-row__who">{who(c.authoredBy)}</span> · {ROLE_LABEL[c.role] ?? c.role}
                        {s?.at ? <> · <time dateTime={s.at}>{day(s.at)}</time></> : ' · curated, undated'}
                        {s?.edited ? ' · edited' : ''}
                      </p>
                      <p>{c.contentIsTitle ? <em>{c.content}</em> : <q><Inline text={c.content} /></q>}</p>
                    </li>
                  )
                })}
              </ol>
            </li>
          )
        })}
        {elsewhere.map((e) => (
          <li key={e.record.uri} className="pfc-thread__group pfc-thread__group--elsewhere">
            <p className="pfc-thread__head">
              {e.record.fixture ? 'Fixture, not a real post' : 'On Bluesky'} · {e.record.handle} · <time dateTime={e.record.createdAt}>{day(e.record.createdAt)}</time>
            </p>
            <p>{e.record.excerpt ?? e.record.text ?? <em>text not kept</em>}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
