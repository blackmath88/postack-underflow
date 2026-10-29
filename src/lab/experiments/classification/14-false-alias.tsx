import { useId, useState } from 'react'
import { tokenize } from '../../../lib/retrieval'
import { RECORDS, record, shortName, source, sourceNearlySays, sourceSays } from './words'

// 14 · The False Alias. A frozen v1 record printed as a dictionary entry: its
// aliases and symptoms are the senses, and every word the pinned source never
// uses is starred, as a lexicographer marks an unattested form. Two checkers
// read the same entry: the strict one the v1 audit used (exact tokens), and a
// lenient one that folds a few suffixes and looks inside longer tokens. The
// audit's own false flag ("locally") is in this entry. Read-only.

type Checker = 'strict' | 'lenient'

const check = (c: Checker) => (c === 'strict' ? sourceSays : sourceNearlySays)

/** Split a phrase into printable words, each with the tokens it stands for. */
function words(text: string) {
  return text.split(/(\s+)/).map((w) => ({ w, tokens: /\s/.test(w) ? [] : tokenize(w) }))
}

function unattested(text: string, sourceId: string, c: Checker) {
  return [...new Set(tokenize(text))].filter((t) => !check(c)(t, sourceId))
}

const SENSES = RECORDS.flatMap((r) => [...r.aliases, ...r.symptoms].map((text) => ({ text, sourceId: r.sourceId })))
const tally = (c: Checker) => {
  let clean = 0
  let stars = 0
  for (const s of SENSES) {
    const u = unattested(s.text, s.sourceId, c).length
    stars += u
    if (u === 0) clean++
  }
  return { clean, stars }
}
const TALLY = { strict: tally('strict'), lenient: tally('lenient') }

export default function FalseAlias() {
  const id = useId()
  const [sourceId, setSourceId] = useState('vite-issue-8073-base-mime')
  const [checker, setChecker] = useState<Checker>('strict')
  const r = record(sourceId)
  const s = source(sourceId)
  const senses = [
    ...r.aliases.map((text) => ({ text, field: 'alias' })),
    ...r.symptoms.map((text) => ({ text, field: 'symptom' })),
  ]
  const starred = senses.reduce((n, x) => n + unattested(x.text, sourceId, checker).length, 0)
  const other: Checker = checker === 'strict' ? 'lenient' : 'strict'
  const cleared = senses.flatMap((x) =>
    unattested(x.text, sourceId, 'strict').filter((t) => !unattested(x.text, sourceId, 'lenient').includes(t)),
  )

  return (
    <div className="x14">
      <div className="x14__controls">
        <label htmlFor={`${id}-r`}>Entry</label>
        <select id={`${id}-r`} value={sourceId} onChange={(e) => setSourceId(e.target.value)}>
          {RECORDS.map((x) => (
            <option key={x.sourceId} value={x.sourceId}>
              {shortName(x.sourceId).slice(0, 60)}
            </option>
          ))}
        </select>
        <button type="button" className="lab-btn" aria-pressed={checker === 'lenient'} onClick={() => setChecker(other)} data-probe="click">
          {checker === 'strict' ? 'Read with the lenient checker' : 'Back to the strict checker'}
        </button>
      </div>

      <article className="x14__entry" data-observe>
        <header>
          <h3 className="x14__head">{shortName(sourceId)}</h3>
          <span className="x14__pos">n., problem.</span>{' '}
          <span className="x14__def">{r.problem}</span>
        </header>
        <ol className="x14__senses">
          {senses.map((x, i) => {
            const u = unattested(x.text, sourceId, checker)
            return (
              <li key={i} className={u.length ? 'has-stars' : undefined}>
                <span className="x14__field">{x.field}</span>{' '}
                {words(x.text).map((w, j) =>
                  w.tokens.some((t) => u.includes(t)) ? (
                    <span key={j} className="x14__star" title={`Not attested in the pinned source (${checker})`}>
                      *{w.w}
                    </span>
                  ) : (
                    <span key={j}>{w.w}</span>
                  ),
                )}
              </li>
            )
          })}
        </ol>
        <footer className="x14__foot">
          {starred === 0
            ? `Every word attested in the ${s.kind} at ${s.revision.slice(0, 10)}.`
            : `${starred} starred ${starred === 1 ? 'word' : 'words'}: the ${s.kind} at ${s.revision.slice(0, 10)} never uses ${starred === 1 ? 'it' : 'them'} (${checker} checker).`}
          {checker === 'lenient' && cleared.length > 0 && ` Leniency cleared: ${[...new Set(cleared)].join(', ')}.`}
        </footer>
      </article>

      <p className="x14__key">
        <span className="x14__star">*word</span> = not attested in the pinned source. Strict compares the v1 tokens exactly. Lenient
        also accepts the word without -ly, -ed, -ing, -er or -d, or a word of four letters or more inside a longer token.
      </p>

      <p className="lab-out" role="status">
        whole corpus, {SENSES.length} aliases and symptoms · strict: {TALLY.strict.clean} fully attested, {TALLY.strict.stars} starred
        words · lenient: {TALLY.lenient.clean} fully attested, {TALLY.lenient.stars} starred words
      </p>
    </div>
  )
}
