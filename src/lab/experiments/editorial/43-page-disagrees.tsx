import { useState } from 'react'
import results from '../../../../results/four-words-v1.json'
import queries from '../../../../corpus/queries.json'

// 43 · The Page That Disagrees. Claims the project made about Four Words,
// quoted from the essay, its history and its write-up, arrive one at a time.
// As each claim appears, the page tests it against the frozen per-query
// results and, if the data contradicts it, pins the counterexample over it.
// Some claims cannot be tested by this data at all, and the page says so.
// Reads results/four-words-v1.json and corpus/queries.json, read-only.

type System = 'baseline' | 'structured' | 'structured-without-aliases-symptoms'
const SYSTEM_LABEL: Record<System, string> = {
  baseline: 'plain search',
  structured: 'descriptions',
  'structured-without-aliases-symptoms': 'descriptions without aliases and symptoms',
}
type Scope = 'aggregate' | 'most' | 'every'
const SCOPE_LABEL: Record<Scope, string> = {
  aggregate: 'on average (MRR@10)',
  most: 'on most queries',
  every: 'on every query',
}

const QUERY_TEXT = new Map(queries.queries.map((q) => [q.id, q.query]))
const per = (s: System, q: string) => results.perQuery.find((p) => p.system === s && p.query === q)!
const QIDS = queries.queries.map((q) => q.id)

interface Verdict {
  kind: 'contradicted' | 'holds' | 'untestable'
  why: string
  /** The query the claimed winner did worst on, relative to plain search. */
  example?: { q: string; a: number; b: number }
}

/** The query where `a` falls furthest behind `b`, if there is one. */
function worstFor(a: System, b: System): Verdict['example'] {
  const gaps = QIDS.map((q) => ({ q, gap: per(b, q).reciprocalRank - per(a, q).reciprocalRank })).filter((g) => g.gap > 0)
  const w = gaps.sort((x, y) => y.gap - x.gap || x.q.localeCompare(y.q))[0]
  return w ? { q: w.q, a: per(a, w.q).firstRelevantRank, b: per(b, w.q).firstRelevantRank } : undefined
}

/** Does system `a` beat system `b`, at this scope? */
function compare(a: System, b: System, scope: Scope): Verdict {
  if (scope === 'aggregate') {
    const ma = results.summary[a].mrrAt10
    const mb = results.summary[b].mrrAt10
    return { kind: ma > mb ? 'holds' : 'contradicted', why: `MRR@10 is ${ma.toFixed(3)} against ${mb.toFixed(3)}.`, example: worstFor(a, b) }
  }
  const better = QIDS.filter((q) => per(a, q).reciprocalRank > per(b, q).reciprocalRank)
  const worse = QIDS.filter((q) => per(a, q).reciprocalRank < per(b, q).reciprocalRank)
  const tied = QIDS.length - better.length - worse.length
  const tally = `Better on ${better.length}, worse on ${worse.length}, tied on ${tied} of ${QIDS.length}.`
  const example = worstFor(a, b)
  if (scope === 'every')
    return { kind: worse.length === 0 ? 'holds' : 'contradicted', why: tally, example }
  return better.length > QIDS.length / 2
    ? { kind: 'holds', why: tally, example }
    : { kind: 'contradicted', why: `${tally} Most queries are ties, not wins.`, example }
}

const atOne = (s: System) => QIDS.filter((q) => per(s, q).firstRelevantRank === 1)

interface Claim {
  text: (scope: Scope) => string
  from: string
  scoped?: boolean
  test: (scope: Scope) => Verdict
}

const CLAIMS: Claim[] = [
  {
    text: (s) => `On this corpus, structured records beat plain keyword search${s === 'aggregate' ? '' : ` ${SCOPE_LABEL[s]}`}.`,
    from: 'Research history, “Four Words: queries before records”',
    scoped: true,
    test: (s) => compare('structured', 'baseline', s),
  },
  {
    text: () => 'A right answer came first for 25 of 27 short queries, against 17 for plain search.',
    from: 'The Impossible Index',
    test: () => {
      const s = atOne('structured')
      const b = atOne('baseline')
      const lost = b.filter((q) => !s.includes(q))
      return s.length === 25 && b.length === 17
        ? {
            kind: 'holds',
            why: `${s.length} and ${b.length}, as stated. But the sets are not nested: plain search was first on ${lost.length} ${lost.length === 1 ? 'query' : 'queries'} where the descriptions were not (${lost.map((q) => `“${QUERY_TEXT.get(q)}”`).join(', ')}).`,
          }
        : { kind: 'contradicted', why: `The data gives ${s.length} and ${b.length}.` }
    },
  },
  {
    text: () => 'Classification is a claim.',
    from: 'The Impossible Index',
    test: () => ({ kind: 'untestable', why: 'This is an argument, not a measurement. Nothing in the frozen results can confirm or contradict it.' }),
  },
  {
    text: (s) =>
      `A short, plain statement of problem and solution already beats whole-document matching${s === 'aggregate' ? '' : ` ${SCOPE_LABEL[s]}`}.`,
    from: 'FOUR-WORDS.md, “What the ablation suggests”',
    scoped: true,
    test: (s) => compare('structured-without-aliases-symptoms', 'baseline', s),
  },
  {
    text: () => 'Plain keyword search already had this query at rank 1.',
    from: 'Margin note, “Why does the guess help just as much?” (query: css missing after deploy)',
    test: () => {
      const r = per('baseline', 'q01').firstRelevantRank
      return r === 1
        ? { kind: 'holds', why: `Plain search: rank ${r}. Descriptions: rank ${per('structured', 'q01').firstRelevantRank}.` }
        : { kind: 'contradicted', why: `Plain search: rank ${r}.` }
    },
  },
  {
    text: () => 'The descriptions ranked a right answer higher on 10 queries and lower on 1.',
    from: 'Margin note, “Which words did the writer add?”',
    test: () => {
      const p = results.paired
      return p.structuredBetter === 10 && p.baselineBetter === 1
        ? { kind: 'holds', why: `${p.structuredBetter} higher, ${p.baselineBetter} lower, ${p.tied} tied.` }
        : { kind: 'contradicted', why: `${p.structuredBetter} higher, ${p.baselineBetter} lower.` }
    },
  },
]

const STAMP: Record<Verdict['kind'], string> = {
  contradicted: 'The data disagrees',
  holds: 'Holds against the data',
  untestable: 'The data cannot say',
}

export default function PageDisagrees() {
  const [shown, setShown] = useState(1)
  const [scopes, setScopes] = useState<Scope[]>(CLAIMS.map(() => 'aggregate'))

  const verdicts = CLAIMS.map((c, i) => c.test(scopes[i]!))
  const visible = CLAIMS.slice(0, shown)
  const tally = (k: Verdict['kind']) => verdicts.slice(0, shown).filter((v) => v.kind === k).length

  return (
    <div className="x43">
      <ol className="x43__page">
        {visible.map((c, i) => {
          const v = verdicts[i]!
          const scope = scopes[i]!
          return (
            <li key={i} className={`x43__claim is-${v.kind}`}>
              <p className="x43__text">{c.text(scope)}</p>
              <p className="x43__from">{c.from}</p>
              {c.scoped && (
                <label className="x43__scope">
                  Read it as{' '}
                  <select
                    value={scope}
                    onChange={(e) => setScopes((s) => s.map((x, j) => (j === i ? (e.target.value as Scope) : x)))}
                  >
                    {(Object.keys(SCOPE_LABEL) as Scope[]).map((k) => (
                      <option key={k} value={k}>
                        {SCOPE_LABEL[k]}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <div className={`x43__slip x43__slip--${v.kind}`} role="note" aria-label={STAMP[v.kind]}>
                <p className="x43__stamp">{STAMP[v.kind]}</p>
                <p>{v.why}</p>
                {v.example && (
                  <p className="x43__example">
                    {v.kind === 'contradicted' ? 'Counterexample' : 'Exception, which does not refute this reading'}: “
                    {QUERY_TEXT.get(v.example.q)}”, first right answer at rank {v.example.a} for the claimed winner,{' '}
                    {v.example.b} for {SYSTEM_LABEL.baseline}.
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      <div className="x43__foot">
        <button type="button" className="lab-btn" onClick={() => setShown((n) => Math.min(CLAIMS.length, n + 1))} disabled={shown === CLAIMS.length} data-probe="click">
          {shown === CLAIMS.length ? 'No more claims' : 'Next claim'}
        </button>
        <button type="button" className="lab-btn" onClick={() => setShown(1)} disabled={shown === 1}>
          Start again
        </button>
        <p className="x43__tally" role="status" data-observe>
          {shown} of {CLAIMS.length} claims on the page: {tally('contradicted')} contradicted, {tally('holds')} holding,{' '}
          {tally('untestable')} beyond the data.
        </p>
      </div>
    </div>
  )
}
