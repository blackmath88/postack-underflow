import { useId, useState } from 'react'
import { record, shortName } from './words'

// 17 · Three Kinds of Proof. One claim, six exhibits, a balance. Each exhibit
// is an evidence note from a frozen v1 record, read live. The visitor chooses
// which kinds of proof the scale admits (reported, reproduced, guarded by a
// regression test), which situation the claim is about, and may reclassify
// any exhibit. The side each exhibit takes and its default kind are our
// reading of the record; the record's own evidence label is shown beside it.

type Proof = 'reported' | 'reproduced' | 'regression'
type Scope = 'any' | 'branch' | 'actions'

const PROOF_LABEL: Record<Proof, string> = {
  reported: 'Reported: someone says it worked',
  reproduced: 'Reproduced: we ran it and saw it',
  regression: 'Regression-tested: a test fails if it breaks',
}

interface Exhibit {
  id: string
  sourceId: string
  evidence: number
  side: 'for' | 'against'
  scope: Exclude<Scope, 'any'>
  /** Why it bears on the claim, in our words. */
  reading: string
}

const CLAIM = 'Adding a .nojekyll file fixes files missing from a GitHub Pages site.'

const EXHIBITS: Exhibit[] = [
  { id: 'e1', sourceId: 'ghdocs-create-site-nojekyll', evidence: 0, side: 'for', scope: 'branch', reading: 'GitHub documents .nojekyll for branch publishing.' },
  { id: 'e2', sourceId: 'next-issue-15588-nojekyll', evidence: 0, side: 'for', scope: 'branch', reading: 'The reporter says .nojekyll made the assets load.' },
  { id: 'e3', sourceId: 'vite-issue-9119-underscore-chunk', evidence: 1, side: 'for', scope: 'branch', reading: 'The reporter says .nojekyll also resolves the 404.' },
  { id: 'e4', sourceId: 'upload-pages-artifact-issue-129-hidden-files', evidence: 1, side: 'against', scope: 'actions', reading: 'Commenters say they tested it: with an artifact deploy, .nojekyll does nothing.' },
  { id: 'e5', sourceId: 'upload-pages-artifact-issue-129-hidden-files', evidence: 0, side: 'against', scope: 'actions', reading: 'The missing dotfiles came back through an opt-in in the action, not through .nojekyll.' },
  { id: 'e6', sourceId: 'upload-pages-artifact-readme', evidence: 0, side: 'against', scope: 'actions', reading: 'The action leaves hidden files out by default; .nojekyll does not change that.' },
]

const START_KIND: Record<string, Proof> = Object.fromEntries(EXHIBITS.map((e) => [e.id, 'reported']))

function Pan({ at, weights, side }: { at: { x: number; y: number }; weights: number; side: 'for' | 'against' }) {
  const { x, y } = at
  return (
    <g>
      <line x1={x} y1={y} x2={x - 24} y2={y + 50} />
      <line x1={x} y1={y} x2={x + 24} y2={y + 50} />
      <line x1={x - 30} y1={y + 50} x2={x + 30} y2={y + 50} />
      {Array.from({ length: weights }, (_, i) => (
        <rect key={i} x={x - 25 + i * 17} y={y + 37} width="12" height="12" className={`x17__weight x17__weight--${side}`} />
      ))}
    </g>
  )
}

export default function ThreeKindsOfProof() {
  const id = useId()
  const [scope, setScope] = useState<Scope>('any')
  const [admit, setAdmit] = useState<Record<Proof, boolean>>({ reported: true, reproduced: true, regression: true })
  const [kind, setKind] = useState<Record<string, Proof>>(START_KIND)

  const counted = EXHIBITS.filter((e) => admit[kind[e.id]!] && (scope === 'any' || e.scope === scope))
  const pro = counted.filter((e) => e.side === 'for')
  const con = counted.filter((e) => e.side === 'against')
  const tilt = (Math.max(-3, Math.min(3, pro.length - con.length)) * 5 * Math.PI) / 180
  // The beam turns about the pivot; the pans hang plumb from its ends.
  const left = { x: 160 - 120 * Math.cos(tilt), y: 30 + 120 * Math.sin(tilt) }
  const right = { x: 160 + 120 * Math.cos(tilt), y: 30 - 120 * Math.sin(tilt) }
  const verdict =
    counted.length === 0
      ? 'Both pans are empty. The beam is level because nothing is on it.'
      : pro.length === con.length
        ? `Level: ${pro.length} against ${con.length}. It looks exactly like the empty scale.`
        : pro.length > con.length
          ? `Tips for the claim, ${pro.length} to ${con.length}.`
          : `Tips against the claim, ${con.length} to ${pro.length}.`
  const reproducedAny = Object.values(kind).some((k) => k !== 'reported')

  return (
    <div className="x17">
      <p className="x17__claim">
        <span className="x17__label">The claim</span> {CLAIM}
      </p>

      <div className="x17__controls">
        <div>
          <label htmlFor={`${id}-scope`} className="x17__label">
            About which sites
          </label>
          <select id={`${id}-scope`} value={scope} onChange={(e) => setScope(e.target.value as Scope)} data-probe="select">
            <option value="any">any GitHub Pages site</option>
            <option value="branch">sites published from a branch</option>
            <option value="actions">sites published with an Actions artifact</option>
          </select>
        </div>
        <fieldset className="x17__admit">
          <legend className="x17__label">The scale admits</legend>
          {(Object.keys(PROOF_LABEL) as Proof[]).map((p) => (
            <label key={p}>
              <input type="checkbox" checked={admit[p]} onChange={() => setAdmit((a) => ({ ...a, [p]: !a[p] }))} /> {PROOF_LABEL[p]}
            </label>
          ))}
        </fieldset>
      </div>

      <div className="x17__balance" data-observe>
        <svg viewBox="0 0 320 175" className="x17__svg" aria-hidden="true">
          <line x1="160" y1="30" x2="160" y2="150" className="x17__post" />
          <line x1="120" y1="150" x2="200" y2="150" className="x17__post" />
          <line x1={left.x} y1={left.y} x2={right.x} y2={right.y} />
          <Pan at={left} weights={pro.length} side="for" />
          <Pan at={right} weights={con.length} side="against" />
          <circle cx="160" cy="30" r="4" className="x17__pivot" />
          <text x="40" y="170" textAnchor="middle">
            for · {pro.length}
          </text>
          <text x="280" y="170" textAnchor="middle">
            against · {con.length}
          </text>
        </svg>
        <p className="x17__verdict" role="status">
          {verdict}
        </p>
      </div>

      <ol className="x17__exhibits">
        {EXHIBITS.map((e) => {
          const ev = record(e.sourceId).evidence[e.evidence]!
          const on = counted.includes(e)
          return (
            <li key={e.id} className={on ? 'is-on' : 'is-off'}>
              <p className="x17__ex-head">
                <span className={`x17__side x17__side--${e.side}`}>{e.side === 'for' ? '◀ for' : 'against ▶'}</span>{' '}
                {shortName(e.sourceId)} · about {e.scope === 'branch' ? 'branch' : 'Actions'} publishing
              </p>
              <p className="x17__note">
                <span className="x17__kind">record says: {ev.kind}</span> {ev.note}
              </p>
              <p className="x17__reading">Our reading: {e.reading}</p>
              <label className="x17__reclass">
                Kind of proof{' '}
                <select value={kind[e.id]} onChange={(x) => setKind((k) => ({ ...k, [e.id]: x.target.value as Proof }))}>
                  <option value="reported">reported</option>
                  <option value="reproduced">reproduced</option>
                  <option value="regression">regression-tested</option>
                </select>
              </label>
            </li>
          )
        })}
      </ol>
      <p className="lab-out">
        {reproducedAny
          ? 'You have reclassified an exhibit. Nothing in its record shows a reproduction or a test; the record says what someone reported.'
          : 'As read: all 6 exhibits are reports. The four evidence labels in the corpus (official-docs, reporter-confirmed, community-report, merged-fix) are all kinds of report.'}
      </p>
    </div>
  )
}
