import { useId, useState } from 'react'
import { RECORDS, record, shortName, source, termAttested, termWords, sourceSays } from './words'

// 13 · Who Put This Here? A forensic ledger for one classification decision:
// one controlled term on one frozen v1 record. Every row is read from the
// record, its source entry or the repository's history. A second placement
// can be set beside it, and the ledger marks which rows differ. The commits
// below were read with `git log` on 2026-10-29; nothing else is invented.

const COMMITS = {
  vocabulary: { sha: '7bb828f', at: '2026-10-28 12:28', what: 'controlled vocabulary of 16 terms added to src/lib/records.ts' },
  pinned: { sha: '619bd6d', at: '2026-10-28 12:28', what: 'sources pinned and 27 queries labelled, before any record existed' },
  records: { sha: '9ad53a3', at: '2026-10-28 12:34', what: 'all 30 records added in one commit' },
}

const PLACEMENTS = RECORDS.flatMap((r) => r.terms.map((term) => ({ sourceId: r.sourceId, term, k: `${r.sourceId}|${term}` })))
const byKey = new Map(PLACEMENTS.map((p) => [p.k, p]))
const termCount = (t: string) => PLACEMENTS.filter((p) => p.term === t).length

interface Row {
  label: string
  value: string
}

function trail(k: string): Row[] {
  const p = byKey.get(k)!
  const r = record(p.sourceId)
  const s = source(p.sourceId)
  const unsaid = termWords(p.term).filter((w) => !sourceSays(w, p.sourceId))
  return [
    { label: 'Term defined', value: `${COMMITS.vocabulary.at} · ${COMMITS.vocabulary.sha} · ${COMMITS.vocabulary.what}` },
    { label: 'Source pinned', value: `${s.repo} at ${s.revision.slice(0, 10)} (${s.kind})` },
    { label: 'Record written', value: `${COMMITS.records.at} · ${COMMITS.records.sha} · ${COMMITS.records.what}` },
    { label: 'Committed by', value: 'the repository owner, with Claude Opus 5.5 as co-author (from the commit)' },
    { label: 'Placed by', value: r.extraction.by },
    { label: 'Dated', value: r.extraction.at },
    { label: 'Method', value: r.extraction.method },
    { label: 'Why this term', value: 'Not recorded.' },
    { label: 'From which passage', value: 'Not recorded.' },
    {
      label: 'Source uses the words',
      value: termAttested(p.term, p.sourceId) ? `yes: ${termWords(p.term).join(', ')}` : `no: never says ${unsaid.join(', ')}`,
    },
    { label: 'Same term elsewhere', value: `${termCount(p.term) - 1} other records` },
  ]
}

// Across all 80 placements: which rows ever vary?
const VARYING = (() => {
  const first = trail(PLACEMENTS[0]!.k)
  return first.map((row, i) => PLACEMENTS.some((p) => trail(p.k)[i]!.value !== row.value))
})()
const CONSTANT_ROWS = VARYING.filter((v) => !v).length
const EXTRACTION_VARIANTS = new Set(RECORDS.map((r) => JSON.stringify(r.extraction))).size

function Picker({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (k: string) => void }) {
  return (
    <div className="x13__pick">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {RECORDS.map((r) => (
          <optgroup key={r.sourceId} label={shortName(r.sourceId)}>
            {r.terms.map((t) => (
              <option key={t} value={`${r.sourceId}|${t}`}>
                {t} on {shortName(r.sourceId).slice(0, 40)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}

export default function WhoPutThisHere() {
  const id = useId()
  const [a, setA] = useState('vite-issue-8073-base-mime|asset-404')
  const [b, setB] = useState('vite-issue-9119-underscore-chunk|asset-404')
  const ta = trail(a)
  const tb = trail(b)
  const differ = ta.filter((row, i) => row.value !== tb[i]!.value).length

  const nextB = () => {
    const i = PLACEMENTS.findIndex((p) => p.k === b)
    let j = (i + 1) % PLACEMENTS.length
    if (PLACEMENTS[j]!.k === a) j = (j + 1) % PLACEMENTS.length
    setB(PLACEMENTS[j]!.k)
  }

  return (
    <div className="x13">
      <div className="x13__picks">
        <Picker id={`${id}-a`} label="Exhibit A: a term on a record" value={a} onChange={setA} />
        <Picker id={`${id}-b`} label="Exhibit B, for comparison" value={b} onChange={setB} />
        <button type="button" className="lab-btn" onClick={nextB} data-probe="click">
          Bring in the next placement as B
        </button>
      </div>

      <div className="x13__scroll" data-scroll tabIndex={0} role="region" aria-label="Ledger">
        <table className="x13__ledger" data-observe>
          <caption>
            Ledger · {byKey.get(a)!.term} on {shortName(byKey.get(a)!.sourceId)} against {byKey.get(b)!.term} on{' '}
            {shortName(byKey.get(b)!.sourceId)} · {differ} of {ta.length} rows differ
          </caption>
          <thead>
            <tr>
              <th scope="col">Entry</th>
              <th scope="col">A</th>
              <th scope="col">B</th>
            </tr>
          </thead>
          <tbody>
            {ta.map((row, i) => {
              const other = tb[i]!.value
              const same = row.value === other
              const silent = row.value === 'Not recorded.'
              return (
                <tr key={row.label} className={(same ? 'is-same' : 'is-diff') + (silent ? ' is-silent' : '')}>
                  <th scope="row">
                    <span className="x13__mark" aria-label={same ? 'same' : 'differs'}>
                      {same ? '=' : '≠'}
                    </span>{' '}
                    {row.label}
                  </th>
                  <td>{row.value}</td>
                  <td>{same ? <span className="x13__ditto">same</span> : other}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="x13__summary" role="status">
        Over all {PLACEMENTS.length} placements, {CONSTANT_ROWS} of {ta.length} ledger rows never change. The 30 records carry{' '}
        {EXTRACTION_VARIANTS === 1 ? 'one identical' : EXTRACTION_VARIANTS} provenance {EXTRACTION_VARIANTS === 1 ? 'line' : 'lines'}: the
        record knows who wrote it, not who decided this term.
      </p>
    </div>
  )
}
