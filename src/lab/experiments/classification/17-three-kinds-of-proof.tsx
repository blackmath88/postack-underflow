import { useId, useState } from 'react'
import { CLAIM, EXHIBITS, START_KIND, weigh, type Admit, type Proof, type Scope, type Weighing } from './17-scale'
import { record, shortName } from './words'

// 17 · Three Kinds of Proof. One claim, six exhibits, two balances side by
// side. The left balance admits every kind of proof; the right one admits
// what the visitor's rule admits. Each exhibit is an evidence note from a
// frozen v1 record, read live. Tighten the right scale to reproduced or
// tested proof and it empties, and an empty beam is drawn by the same
// geometry as a balanced one. The side each exhibit takes and its default
// kind are our reading of the record; the record's own label is shown beside it.

const SCOPE_LABEL: Record<Scope, string> = {
  any: 'any GitHub Pages site',
  branch: 'sites published from a branch',
  actions: 'sites published with an Actions artifact',
}

const READS_LABEL: Record<Weighing['reads'], string> = { level: 'Level', 'tips for': 'Tips for', 'tips against': 'Tips against' }

function Pan({ x, y, n, side }: { x: number; y: number; n: number; side: 'for' | 'against' }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x - 26} y2={y + 52} />
      <line x1={x} y1={y} x2={x + 26} y2={y + 52} />
      <path d={`M ${x - 34} ${y + 52} Q ${x} ${y + 66} ${x + 34} ${y + 52} Z`} className="x17__dish" />
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={x - 25 + i * 17} y={y + 39} width="13" height="13" className={`x17__weight x17__weight--${side}`} />
      ))}
    </g>
  )
}

function Balance({ w, title, rule }: { w: Weighing; title: string; rule: string }) {
  const t = (w.tilt * Math.PI) / 180
  // The beam turns about the pivot; the pans hang plumb from its ends.
  const left = { x: 160 - 120 * Math.cos(t), y: 34 + 120 * Math.sin(t) }
  const right = { x: 160 + 120 * Math.cos(t), y: 34 - 120 * Math.sin(t) }
  const desc = `${READS_LABEL[w.reads]}. For ${w.pro.length}, against ${w.con.length}.`
  return (
    <figure className={'x17__balance' + (w.empty ? ' is-empty' : '')}>
      <figcaption>
        <span className="x17__label">{title}</span>
        <span className="x17__rule">{rule}</span>
      </figcaption>
      <svg viewBox="0 0 320 200" className="x17__svg" role="img" aria-label={`${title}: ${desc}`}>
        <line x1="160" y1="34" x2="160" y2="182" className="x17__post" />
        <path d="M 112 190 L 208 190 L 196 182 L 124 182 Z" className="x17__foot" />
        <line x1={left.x} y1={left.y} x2={right.x} y2={right.y} className="x17__beam" />
        <path d="M 160 44 L 154 62 L 166 62 Z" className="x17__needle" />
        <Pan {...left} n={w.pro.length} side="for" />
        <Pan {...right} n={w.con.length} side="against" />
        <circle cx="160" cy="34" r="5" className="x17__pivot" />
      </svg>
      <p className="x17__reads" aria-hidden="true">
        <span className="x17__dial">{READS_LABEL[w.reads]}</span>
        <span>
          for {w.pro.length} · against {w.con.length}
        </span>
      </p>
    </figure>
  )
}

export default function ThreeKindsOfProof() {
  const id = useId()
  const [scope, setScope] = useState<Scope>('any')
  const [admit, setAdmit] = useState<Admit>('every')
  const [kind, setKind] = useState<Record<string, Proof>>(START_KIND)

  const every = weigh('every', scope, kind)
  const yours = weigh(admit, scope, kind)
  const reclassified = EXHIBITS.filter((e) => kind[e.id] !== 'reported')
  const sameLook = every.reads === yours.reads && every.tilt === yours.tilt

  const verdict =
    admit === 'every'
      ? `Both scales admit every kind of proof and read the same: ${every.reads === 'level' ? 'level' : every.reads}, ${every.pro.length} for, ${every.con.length} against.`
      : yours.empty
        ? `Your scale is empty: all ${yours.aside.length} exhibits in scope are reports. It reads ${yours.reads}${sameLook ? ', the same as the scale with six reports on it' : ''}.`
        : `Your scale reads ${yours.reads}, ${yours.pro.length} for, ${yours.con.length} against, only because you reclassified ${reclassified.length === 1 ? 'an exhibit' : 'exhibits'}.`

  return (
    <div className="x17">
      <p className="x17__claim">
        <span className="x17__label">The claim</span> {CLAIM}
      </p>

      <div className="x17__controls">
        <fieldset className="x17__admit">
          <legend className="x17__label">Your scale admits</legend>
          <label className={admit === 'every' ? 'is-on' : undefined}>
            <input type="radio" name={`${id}-admit`} checked={admit === 'every'} onChange={() => setAdmit('every')} /> every kind of proof
          </label>
          <label className={admit === 'stronger' ? 'is-on' : undefined}>
            <input
              type="radio"
              name={`${id}-admit`}
              checked={admit === 'stronger'}
              onChange={() => setAdmit('stronger')}
              data-probe="click"
            />{' '}
            only reproduced or regression-tested proof
          </label>
        </fieldset>
        <div>
          <label htmlFor={`${id}-scope`} className="x17__label">
            About which sites
          </label>
          <select id={`${id}-scope`} value={scope} onChange={(e) => setScope(e.target.value as Scope)}>
            {(Object.keys(SCOPE_LABEL) as Scope[]).map((s) => (
              <option key={s} value={s}>
                {SCOPE_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="x17__pair" data-observe>
        <div className="x17__scales">
          <Balance w={every} title="Every kind admitted" rule="reports count" />
          <Balance w={yours} title="Your scale" rule={admit === 'every' ? 'reports count' : 'reports set aside'} />
        </div>
        <p className="x17__verdict" role="status">
          {verdict}
        </p>
        {yours.aside.length > 0 && (
          <p className="x17__bench">
            <span className="x17__label">On the bench, set aside by your rule</span>{' '}
            {yours.aside.map((e) => shortName(e.sourceId)).join(' · ')}
          </p>
        )}
      </div>

      <ol className="x17__exhibits" aria-label="The six exhibits">
        {EXHIBITS.map((e) => {
          const ev = record(e.sourceId).evidence[e.evidence]!
          const on = yours.pro.includes(e) || yours.con.includes(e)
          return (
            <li key={e.id} className={on ? 'is-on' : 'is-off'}>
              <p className="x17__ex-head">
                <span className={`x17__side x17__side--${e.side}`}>{e.side === 'for' ? '◀ for' : 'against ▶'}</span>{' '}
                {shortName(e.sourceId)} · about {e.scope === 'branch' ? 'branch' : 'Actions'} publishing
                {!on && <span className="x17__off"> · not on your scale</span>}
              </p>
              <p className="x17__note">
                <span className="x17__kind">record says: {ev.kind}</span> {ev.note}
              </p>
              <p className="x17__reading">Our reading: {e.reading}</p>
              <label className="x17__reclass">
                Call it{' '}
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
        {reclassified.length
          ? `You have called ${reclassified.length} ${reclassified.length === 1 ? 'exhibit' : 'exhibits'} something stronger. Nothing in the records shows a reproduction or a test; they say what someone reported.`
          : 'As read: all 6 exhibits are reports. The four evidence labels in the corpus (official-docs, reporter-confirmed, community-report, merged-fix) are all kinds of report.'}
      </p>
    </div>
  )
}
