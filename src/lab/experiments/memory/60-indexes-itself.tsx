import { useId, useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { CATALOGUE, FAMILY, FIRMNESS_LABEL } from '../../catalogue'
import type { Firmness, LabEntry } from '../../types'
import { buildIndex, search } from '../../../lib/retrieval'

// 60 · Postack Indexes Itself. The laboratory's own catalogue, read-only,
// indexed at module load with the same BM25F code as the Four Words records.
// However many pilots the build contains, each becomes a research record:
// its question, claim, finding and what happened, linked to its sources.
// A small terminal searches it and answers a few commands.

const WEIGHTS = { title: 3, question: 2, proposition: 2, finding: 2, happened: 1, built: 1, sources: 1, prior: 1 }

const fieldsOf = (e: LabEntry) => ({
  title: e.title,
  question: e.question,
  proposition: e.proposition,
  finding: e.finding,
  happened: e.happened,
  built: e.built,
  sources: e.provenance.sources.map((s) => s.label).join('. '),
  prior: e.provenance.priorArt.join('. '),
})

const INDEX = buildIndex('structured', 'the laboratory catalogue', CATALOGUE.map((e) => ({ id: e.n, fields: fieldsOf(e) })), WEIGHTS)
const byN = new Map(CATALOGUE.map((e) => [e.n, e]))
const FAMILIES_PRESENT = [...new Set(CATALOGUE.map((e) => e.family))]

const CITED = (() => {
  const m = new Map<string, { label: string; firmness: Firmness; url?: string; by: string[] }>()
  for (const e of CATALOGUE)
    for (const s of e.provenance.sources) {
      const k = s.url ?? s.label
      const row = m.get(k) ?? { label: s.label, firmness: s.firmness, url: s.url, by: [] }
      if (!row.by.includes(e.n)) row.by.push(e.n)
      m.set(k, row)
    }
  return [...m.values()].sort((a, b) => b.by.length - a.by.length || a.label.localeCompare(b.label))
})()

const FIRMNESSES = Object.keys(FIRMNESS_LABEL) as Firmness[]

const Entry = ({ e, terms }: { e: LabEntry; terms?: string[] }) => (
  <li className="x60__hit">
    <Link to="/lab/$n/" params={{ n: e.n }}>
      {e.n} {e.title}
    </Link>
    <span className="x60__fam"> · Lab {FAMILY[e.family].no}</span>
    <span className="x60__finding">{e.finding}</span>
    <span className="x60__src">
      sources:{' '}
      {e.provenance.sources.map((s, i) => (
        <span key={s.label}>
          {i > 0 && '; '}
          {s.url ? <a href={s.url}>{s.label}</a> : s.label} [{s.firmness}]
        </span>
      ))}
    </span>
    {terms && terms.length > 0 && <span className="x60__terms">matched: {terms.join(', ')}</span>}
  </li>
)

function answer(line: string): ReactNode {
  const input = line.trim()
  const [cmd, ...rest] = input.split(/\s+/)
  const arg = rest.join(' ')
  if (!input) return <p>Type words to search {CATALOGUE.length} catalogued pilots, or “help”.</p>
  if (cmd === 'help')
    return (
      <ul className="x60__help">
        <li>any words: search the catalogue</li>
        <li>open NN: one pilot’s record</li>
        <li>sources: every cited source, most cited first</li>
        <li>firmness {FIRMNESSES.join('|')}: pilots citing a source that firm</li>
      </ul>
    )
  if (cmd === 'open') {
    const e = byN.get(arg.padStart(2, '0'))
    return e ? <ul><Entry e={e} /></ul> : <p>No pilot {arg} in this build.</p>
  }
  if (cmd === 'sources')
    return (
      <ul className="x60__list">
        {CITED.map((s) => (
          <li key={s.label}>
            {s.by.length}× {s.url ? <a href={s.url}>{s.label}</a> : s.label} [{s.firmness}] ← {s.by.join(' ')}
          </li>
        ))}
      </ul>
    )
  if (cmd === 'firmness') {
    const f = arg as Firmness
    if (!FIRMNESSES.includes(f)) return <p>Firmness is one of: {FIRMNESSES.join(', ')}.</p>
    const hits = CATALOGUE.filter((e) => e.provenance.sources.some((s) => s.firmness === f))
    return (
      <>
        <p>
          {hits.length} of {CATALOGUE.length} pilots cite a source marked “{FIRMNESS_LABEL[f]}”.
        </p>
        <ul>{hits.map((e) => <Entry key={e.n} e={e} />)}</ul>
      </>
    )
  }
  const res = search(INDEX, input)
  return (
    <>
      <p>
        {res.hits.length} of {CATALOGUE.length} pilots match
        {res.unknownTerms.length > 0 && <> · no pilot uses: {res.unknownTerms.join(', ')}</>}
      </p>
      <ol className="x60__hits">
        {res.hits.slice(0, 6).map((h) => (
          <Entry key={h.id} e={byN.get(h.id)!} terms={h.matches.map((m) => m.term)} />
        ))}
      </ol>
    </>
  )
}

export default function IndexesItself() {
  const id = useId()
  const [line, setLine] = useState('')
  const [scroll, setScroll] = useState<string[]>([])

  return (
    <div className="x60">
      <p className="x60__banner">
        postack lab index · {CATALOGUE.length} records from {FAMILIES_PRESENT.length} of 6 families in this build ·{' '}
        {Object.keys(INDEX.fields.title!.postings).length} title terms · built in your browser at load
      </p>
      <div className="x60__screen" data-observe>
        {scroll.map((s, i) => (
          <div key={i} className="x60__past">
            <p className="x60__echo">lab&gt; {s}</p>
            {answer(s)}
          </div>
        ))}
        <div className="x60__live" aria-live="polite">
          {answer(line)}
        </div>
      </div>
      <form
        className="x60__prompt"
        onSubmit={(ev) => {
          ev.preventDefault()
          if (!line.trim()) return
          setScroll((s) => [...s, line].slice(-4))
          setLine('')
        }}
      >
        <label htmlFor={`${id}-q`}>lab&gt;</label>
        <input
          id={`${id}-q`}
          value={line}
          onChange={(e) => setLine(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          placeholder="correction"
          data-probe="type:correction"
        />
      </form>
    </div>
  )
}
