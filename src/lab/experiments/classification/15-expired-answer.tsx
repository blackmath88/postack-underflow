import { useId, useState } from 'react'
import { ANSWERS, DIALS, type ExpiringAnswer, type Verdict } from '../../data/classification-expiry'
import { RECORDS, shortName } from './words'

// 15 · The Expired Answer. A compatibility matrix you set with five
// environment dials. Each row is a frozen v1 record whose own context or
// limitations name a version, host or publishing method; each cell is what
// that record says about the current setting, or "silent". The verdict column
// is for your setup. The conditions are our reading of the records
// (src/lab/data/classification-expiry.ts); nothing outside them is used.

type Setup = Record<string, string>

const START: Setup = Object.fromEntries(DIALS.map((d) => [d.id, d.options[0]!.value]))

function verdictFor(a: ExpiringAnswer, setup: Setup): Verdict | 'silent' {
  const said = DIALS.map((d) => a.when[d.id]?.[setup[d.id]!]).filter((c) => c !== undefined)
  if (said.length === 0) return 'silent'
  if (said.some((c) => c.verdict === 'does not apply')) return 'does not apply'
  if (said.some((c) => c.verdict === 'unknown')) return 'unknown'
  return 'applies'
}

const MARK: Record<Verdict | 'silent', string> = {
  applies: '● applies',
  'does not apply': '○ does not apply',
  unknown: '? unknown',
  silent: '· silent',
}

const VERSIONED = RECORDS.filter((r) => [...r.context, ...r.limitations].some((t) => /\b(v\d+|\d+\.\d+(\.\d+)?)\b/i.test(t))).length

const IN_MATRIX = new Set(ANSWERS.map((a) => a.sourceId))
const LEFT_OUT_PUBLISHING = RECORDS.filter(
  (r) => !IN_MATRIX.has(r.sourceId) && [...r.context, ...r.limitations].some((t) => /\bbranch\b|\bactions\b/i.test(t)),
).length

export default function ExpiredAnswer() {
  const id = useId()
  const [setup, setSetup] = useState<Setup>(START)
  const verdicts = ANSWERS.map((a) => verdictFor(a, setup))
  const count = (v: Verdict) => verdicts.filter((x) => x === v).length

  return (
    <div className="x15">
      <fieldset className="x15__dials">
        <legend>Your setup</legend>
        {DIALS.map((d, i) => (
          <div key={d.id} className="x15__dial">
            <label htmlFor={`${id}-${d.id}`}>{d.label}</label>
            <select
              id={`${id}-${d.id}`}
              value={setup[d.id]}
              onChange={(e) => setSetup((s) => ({ ...s, [d.id]: e.target.value }))}
              data-probe={i === 0 ? 'select' : undefined}
            >
              {d.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </fieldset>

      <div className="x15__scroll" data-scroll tabIndex={0} role="region" aria-label="Compatibility matrix">
        <table className="x15__matrix">
          <thead>
            <tr>
              <th scope="col">Answer, from its record</th>
              {DIALS.map((d) => (
                <th key={d.id} scope="col">
                  {d.label}
                </th>
              ))}
              <th scope="col">For you</th>
            </tr>
          </thead>
          <tbody>
            {ANSWERS.map((a, i) => {
              const v = verdicts[i]!
              return (
                <tr key={a.sourceId} className={`is-${v.replace(/ /g, '-')}`}>
                  <th scope="row">
                    <span className="x15__ans">{a.answer}</span>
                    <span className="x15__src">{shortName(a.sourceId)}</span>
                  </th>
                  {DIALS.map((d) => {
                    const c = a.when[d.id]?.[setup[d.id]!]
                    return (
                      <td key={d.id} className={c ? `x15__cell is-${c.verdict.replace(/ /g, '-')}` : 'x15__cell is-silent'}>
                        {c ? (
                          <>
                            <span className="x15__v">{MARK[c.verdict]}</span>
                            <span className="x15__says">{c.says}</span>
                          </>
                        ) : (
                          <span className="x15__v">·</span>
                        )}
                      </td>
                    )
                  })}
                  <td className="x15__for">{MARK[v]}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="x15__sum" data-observe role="status">
        For this setup: {count('applies')} of {ANSWERS.length} answers apply, {count('does not apply')} do not, and {count('unknown')}{' '}
        {count('unknown') === 1 ? 'is' : 'are'} unknown from the record.
        {verdicts
          .map((v, i) => (v === 'does not apply' ? shortName(ANSWERS[i]!.sourceId) : null))
          .filter(Boolean)
          .join('; ')
          .replace(/^(.+)$/, ' Expired here: $1.')}
      </p>
      <p className="lab-out">
        {RECORDS.length - ANSWERS.length} of {RECORDS.length} records are not in the matrix; {LEFT_OUT_PUBLISHING} of those mention a
        branch or Actions in their context, unencoded here · {VERSIONED} of {RECORDS.length} records name a version number at all
      </p>
    </div>
  )
}
