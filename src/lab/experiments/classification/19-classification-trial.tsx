import { useMemo, useState } from 'react'
import queriesFile from '../../../../corpus/queries.json'
import { artifact } from '../../../lib/four-words-data'
import { recordFields } from '../../../lib/records'
import { search, tokenize } from '../../../lib/retrieval'
import { record, shortName, sourceSays } from './words'

// 19 · The Classification Trial. A real conflict from the Four Words record:
// the frozen v1 labels for "css missing after deploy" leave out two records
// that the post-hoc audit says also describe missing CSS. The visitor
// examines both proposals, one question at a time; every answer is computed
// from the frozen data or quoted from the method write-up. A ruling is
// entered in the minutes. It cannot change the labels, which are frozen.

const QUERIES = queriesFile.queries as Array<{ id: string; query: string; relevant: string[] }>
const Q = QUERIES.find((q) => q.id === 'q01')!
const DISPUTED = ['angular-router-reference', 'tanstack-router-deploy']

const firstRelevant = (system: 'baseline' | 'structured', relevant: string[]) =>
  search(artifact.indexes[system], Q.query).hits.findIndex((h) => relevant.includes(h.id)) + 1

const recordSays = (sourceId: string, word: string) =>
  Object.values(recordFields(record(sourceId))).some((t) => tokenize(t).includes(word))

interface Line {
  who: 'court' | 'labels' | 'audit' | 'clerk'
  text: string
}

interface Question {
  id: string
  ask: string
  answer: () => Line[]
}

const yesNo = (b: boolean) => (b ? 'yes' : 'no')

const QUESTIONS: Question[] = [
  {
    id: 'source',
    ask: 'Do the two sources themselves use the word “css”?',
    answer: () => [
      { who: 'clerk', text: DISPUTED.map((s) => `${shortName(s)}: ${yesNo(sourceSays('css', s))}`).join('. ') + '. (Pinned source text, v1 tokens.)' },
    ],
  },
  {
    id: 'record',
    ask: 'Do their records say “css”?',
    answer: () => [{ who: 'clerk', text: DISPUTED.map((s) => `${shortName(s)}: ${yesNo(recordSays(s, 'css'))}`).join('. ') + '.' }],
  },
  {
    id: 'when',
    ask: 'When was each proposal made?',
    answer: () => [
      { who: 'labels', text: 'Committed in 619bd6d on 2026-10-28, before any record existed and before any ranking ran.' },
      { who: 'audit', text: 'After run v1, in the post-hoc analysis, with the rankings in view.' },
    ],
  },
  {
    id: 'who',
    ask: 'Who made each proposal?',
    answer: () => [
      { who: 'labels', text: 'The implementing agent, which also wrote the queries and knew the source summaries.' },
      { who: 'audit', text: 'An independent review of the run, as the method write-up calls it. Its reviewer is not named there.' },
    ],
  },
  {
    id: 'rank',
    ask: 'What does each proposal do to the result?',
    answer: () => {
      const both = [...Q.relevant, ...DISPUTED]
      return [
        { who: 'labels', text: `Problem-oriented index: first relevant at rank ${firstRelevant('structured', Q.relevant)}. Plain search: rank ${firstRelevant('baseline', Q.relevant)}.` },
        { who: 'audit', text: `Problem-oriented index: rank ${firstRelevant('structured', both)}. Plain search: rank ${firstRelevant('baseline', both)}.` },
        { who: 'court', text: 'The court notes that the audit’s proposal helps the system it was made after watching.' },
      ]
    },
  },
  {
    id: 'fix',
    ask: 'Would their fixes repair missing CSS?',
    answer: () => [
      { who: 'clerk', text: `${shortName('tanstack-router-deploy')}: “${record('tanstack-router-deploy').solution.split('. ')[0]}.”` },
      { who: 'clerk', text: `${shortName('angular-router-reference')}: “${record('angular-router-reference').solution.split('; ')[0]}.”` },
      { who: 'court', text: 'Both name a base setting. Whether it repairs this searcher’s CSS depends on a setup the four words do not state.' },
    ],
  },
  {
    id: 'power',
    ask: 'Can this court change the labels?',
    answer: () => [
      { who: 'clerk', text: 'No. The v1 labels are frozen; tests/frozen.test.ts pins their digest. A ruling is a record about them.' },
    ],
  },
]

const WHO: Record<Line['who'], string> = { court: 'The court', labels: 'For the frozen labels', audit: 'For the audit', clerk: 'The clerk' }

export default function ClassificationTrial() {
  const [asked, setAsked] = useState<string[]>([])
  const [ruling, setRuling] = useState<string | null>(null)
  const transcript = useMemo(
    () =>
      asked.flatMap((id) => {
        const q = QUESTIONS.find((x) => x.id === id)!
        return [{ who: 'court' as const, text: q.ask }, ...q.answer()]
      }),
    [asked],
  )

  const rule = (finding: string) =>
    setRuling(
      `${finding} Heard ${asked.length} of ${QUESTIONS.length} questions${asked.length ? `: ${asked.join(', ')}` : ''}. Entered as a minute. The labels for “${Q.query}” are unchanged.`,
    )

  return (
    <div className="x19">
      <header className="x19__case">
        <p className="x19__docket">Docket q01 · “{Q.query}”</p>
        <div className="x19__parties">
          <p>
            <strong>The frozen labels</strong> list {Q.relevant.length} relevant sources and leave out {DISPUTED.map(shortName).join(' and ')}.
          </p>
          <p>
            <strong>The audit</strong> says both describe missing CSS after deployment and should have been labelled relevant.
          </p>
        </div>
      </header>

      <div className="x19__floor">
        <ol className="x19__questions" aria-label="Questions for the court">
          {QUESTIONS.map((q, i) => (
            <li key={q.id}>
              <button
                type="button"
                className="lab-btn"
                aria-pressed={asked.includes(q.id)}
                onClick={() => setAsked((a) => (a.includes(q.id) ? a : [...a, q.id]))}
                data-probe={i === 0 ? 'click' : undefined}
              >
                {q.ask}
              </button>
            </li>
          ))}
        </ol>

        <div className="x19__transcript" data-observe aria-live="polite">
          {transcript.length === 0 ? (
            <p className="x19__empty">The court is in session. Nothing has been asked.</p>
          ) : (
            <dl>
              {transcript.map((l, i) => (
                <div key={i} className={`x19__line x19__line--${l.who}`}>
                  <dt>{WHO[l.who]}</dt>
                  <dd>{l.text}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      <div className="x19__bench" role="group" aria-label="Ruling">
        <button type="button" className="lab-btn" onClick={() => rule('Found for the frozen labels.')}>
          Find for the labels
        </button>
        <button type="button" className="lab-btn" onClick={() => rule('Found for the audit.')}>
          Find for the audit
        </button>
        <button type="button" className="lab-btn" onClick={() => rule('Adjourned until a second labeller is heard.')}>
          Adjourn
        </button>
        <button
          type="button"
          className="lab-btn"
          onClick={() => {
            setAsked([])
            setRuling(null)
          }}
        >
          New hearing
        </button>
      </div>
      <p className="x19__minute" role="status">
        {ruling ?? 'No ruling entered.'}
      </p>
    </div>
  )
}
