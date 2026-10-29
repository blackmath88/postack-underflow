import { useState } from 'react'
import { artifact, sourceById } from '../../../lib/four-words-data'
import { CAPACITY, actual, build, byLabel, fileCard, lyingLabels, misdirected, outOfOrder, reletter, type Cabinet } from './36-cabinet'

// 36 · The Index Drawer That Lies. A cabinet front of six drawers holding the
// 30 frozen v1 records by source id, five to a drawer. The labels were
// lettered when only the 26 documentation cards were filed. The four issue
// reports arrive later; full drawers push cards back, and the labels stay.
// Which cards arrive later is our choice, made for this experiment.

const IDS = artifact.records.map((r) => r.sourceId).sort()
const isIssue = (id: string) => sourceById.get(id)?.kind === 'issue'
const FIRST = IDS.filter((id) => !isIssue(id))
const LATER = IDS.filter(isIssue)
const DRAWERS = 6
const fresh = () => build(FIRST, DRAWERS)
const cut = (id: string) => (id.length > 18 ? id.slice(0, 17) + '…' : id)

export default function IndexDrawerLies() {
  const [c, setC] = useState<Cabinet>(fresh)
  const [filed, setFiled] = useState(0)
  const [openIx, setOpenIx] = useState<number | null>(null)
  const [seen, setSeen] = useState<number[]>([])
  const [look, setLook] = useState(LATER[0]!)

  const next = LATER[filed]
  const lies = lyingLabels(c)
  const wrong = misdirected(c)
  const disorder = outOfOrder(c)
  const present = c.drawers.flat()
  const lookable = IDS.filter((id) => present.includes(id))
  const target = lookable.includes(look) ? look : lookable[0]!
  const sentTo = byLabel(c, target)
  const isIn = actual(c, target)

  const fileNext = () => {
    if (!next) return
    setC((v) => fileCard(v, next))
    setFiled((n) => n + 1)
  }
  const openDrawer = (i: number) => {
    setOpenIx((o) => (o === i ? null : i))
    setSeen((s) => (s.includes(i) ? s : [...s, i]))
  }
  const restart = () => {
    setC(fresh())
    setFiled(0)
    setOpenIx(null)
    setSeen([])
  }

  return (
    <div className="x36">
      <div className="x36__arrive">
        <p>
          {next ? (
            <>
              Waiting to be filed: <code>{next}</code> ({LATER.length - filed} of {LATER.length})
            </>
          ) : (
            'All four late cards are filed.'
          )}
        </p>
        <button type="button" className="lab-btn" onClick={fileNext} disabled={!next} data-probe="click">
          File it where the labels say
        </button>
        <button type="button" className="lab-btn" onClick={restart}>
          Restore the cabinet
        </button>
      </div>

      <div className="x36__cabinet">
        {c.drawers.map((d, i) => {
          const l = c.labels[i]!
          const known = seen.includes(i) && lies[i]
          return (
            <div key={i} className={'x36__front' + (openIx === i ? ' is-open' : '')}>
              <p className="x36__holder">
                <span className="x36__dno">{i + 1}</span>
                <span className="x36__label">
                  {l.first ? (
                    <>
                      {cut(l.first)}
                      <br />– {cut(l.last)}
                    </>
                  ) : (
                    'blank'
                  )}
                </span>
              </p>
              <button type="button" className="x36__pull" aria-expanded={openIx === i} onClick={() => openDrawer(i)}>
                {openIx === i ? 'Close' : 'Open'} drawer {i + 1}
                <span className="visually-hidden">, {d.length} cards</span>
              </button>
              {known && <span className="x36__stamp">label does not match</span>}
              <button type="button" className="x36__reletter" onClick={() => setC((v) => reletter(v, i))}>
                Re-letter<span className="visually-hidden"> drawer {i + 1}</span>
              </button>
            </div>
          )
        })}
      </div>

      {openIx !== null && (
        <div className="x36__inside" aria-label={`Inside drawer ${openIx + 1}`} role="region">
          <p>
            Drawer {openIx + 1} holds {c.drawers[openIx]!.length} of {CAPACITY}. Its label reads <strong>{c.labels[openIx]!.first}</strong> to{' '}
            <strong>{c.labels[openIx]!.last}</strong>.
          </p>
          <ol>
            {c.drawers[openIx]!.map((id) => (
              <li key={id} className={wrong.includes(id) ? 'is-astray' : undefined}>
                {id}
                {wrong.includes(id) && <span> · the labels send you to drawer {byLabel(c, id) + 1}</span>}
                {disorder.includes(id) && <span> · filed out of order</span>}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="x36__lookup">
        <label>
          Look for{' '}
          <select value={target} onChange={(e) => setLook(e.target.value)}>
            {lookable.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <p>
          The labels send you to drawer {sentTo + 1}.{' '}
          {sentTo === isIn ? 'It is there.' : `It is not there. It is in drawer ${isIn + 1}.`}
        </p>
      </div>

      <p className="x36__audit" data-observe role="status">
        {lies.filter(Boolean).length} of {DRAWERS} labels no longer match their drawers. {wrong.length} of {present.length} cards sit behind
        the wrong label; {disorder.length} {disorder.length === 1 ? 'was' : 'were'} filed out of order by trusting one. Re-lettered{' '}
        {c.relettered} {c.relettered === 1 ? 'time' : 'times'}.
      </p>
    </div>
  )
}
