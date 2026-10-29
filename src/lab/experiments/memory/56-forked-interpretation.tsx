import { useState } from 'react'
import { artifact, recordBySource } from '../../../lib/four-words-data'
import { reciprocalRank, search } from '../../../lib/retrieval'
import { QUERIES } from './copy-index'

// 56 · The Forked Interpretation. One query, one frozen ranking, the same
// source records, and two readings of which records answer it: the v1
// labeller's frozen labels, and the post-hoc review's reading that two more
// records describe missing CSS (FOUR-WORDS.md). You walk down either branch
// of the fork, record by record. The v1 labels stay frozen; the right branch
// is a reading, shown beside them, never written back.

type Branch = 'labeller' | 'review'

const q01 = QUERIES.find((q) => q.id === 'q01')!
const REVIEW_ADDS = ['angular-router-reference', 'tanstack-router-deploy']
const RELEVANT: Record<Branch, string[]> = { labeller: q01.relevant, review: [...q01.relevant, ...REVIEW_ADDS] }
const BRANCH_LABEL: Record<Branch, string> = {
  labeller: 'Left: the v1 labeller (frozen labels)',
  review: 'Right: the post-hoc review',
}

const RANKED = search(artifact.indexes.structured, q01.query).hits.slice(0, 8).map((h) => h.id)
const BASE_RANKED = search(artifact.indexes.baseline, q01.query).hits.map((h) => h.id)
const divergeAt = RANKED.findIndex((id) => RELEVANT.labeller.includes(id) !== RELEVANT.review.includes(id))

/** Mean reciprocal rank @10 over all 27 queries, with q01's labels read by a branch. */
function mrr(system: 'baseline' | 'structured', branch: Branch) {
  const total = QUERIES.reduce((sum, q) => {
    const ranked = search(artifact.indexes[system], q.query).hits.map((h) => h.id)
    return sum + reciprocalRank(ranked, q.id === 'q01' ? RELEVANT[branch] : q.relevant, 10)
  }, 0)
  return total / QUERIES.length
}
const MRR = {
  labeller: { structured: mrr('structured', 'labeller'), baseline: mrr('baseline', 'labeller') },
  review: { structured: mrr('structured', 'review'), baseline: mrr('baseline', 'review') },
}

const firstRel = (ids: string[], b: Branch) => ids.findIndex((id) => RELEVANT[b].includes(id)) + 1

export default function ForkedInterpretation() {
  const [branch, setBranch] = useState<Branch | null>(null)
  const [step, setStep] = useState(0)
  const walked = RANKED.slice(0, step)
  const other: Branch = branch === 'review' ? 'labeller' : 'review'
  const found = branch ? walked.findIndex((id) => RELEVANT[branch].includes(id)) + 1 : 0

  return (
    <div className="x56">
      <p className="x56__trunk">
        The trunk, shared by both readings: the query <strong>“{q01.query}”</strong>, the 30 pinned sources, their v1
        records and the frozen structured ranking.
      </p>

      <div className="x56__fork" role="group" aria-label="Choose a branch">
        {(['labeller', 'review'] as const).map((b) => (
          <button
            key={b}
            type="button"
            className={`x56__branch x56__branch--${b}`}
            aria-pressed={branch === b}
            onClick={() => {
              setBranch(b)
              setStep(0)
            }}
          >
            {BRANCH_LABEL[b]}
          </button>
        ))}
      </div>

      <div className="x56__walk">
        <div className="x56__feet">
          <button
            type="button"
            className="lab-btn"
            onClick={() => {
              if (!branch) setBranch('labeller')
              setStep((s) => Math.min(RANKED.length, s + 1))
            }}
            disabled={step === RANKED.length}
            data-probe="click"
          >
            {branch ? 'Walk to the next record' : 'Start down the left branch'}
          </button>
          <button type="button" className="lab-btn" onClick={() => branch && setBranch(other)} disabled={!branch}>
            Cross to the other branch here
          </button>
        </div>

        <ol className="x56__path" data-observe aria-label="Records walked past">
          {!branch && <li className="x56__empty">Choose a branch, or start walking.</li>}
          {branch && walked.length === 0 && <li className="x56__empty">At the fork, on the {branch === 'review' ? 'right' : 'left'}.</li>}
          {branch &&
            walked.map((id, i) => {
              const here = RELEVANT[branch].includes(id)
              const there = RELEVANT[other].includes(id)
              return (
                <li key={id} className={'x56__stop' + (here ? ' is-answer' : '') + (here !== there ? ' is-split' : '')}>
                  <span className="x56__rank">#{i + 1}</span>
                  <span className="x56__problem">{recordBySource.get(id)?.problem}</span>
                  <span className="x56__verdict">
                    {here ? 'answers the query on this branch' : 'does not answer it on this branch'}
                    {here !== there && ' · the other branch reads it the other way'}
                  </span>
                </li>
              )
            })}
          {branch && (
            <li className="x56__sum" role="status">
              {found
                ? `On this branch, the first answer is at rank ${found}. Plain keyword search had one at rank ${firstRel(BASE_RANKED, branch)}.`
                : `On this branch, no answer in the first ${step} ${step === 1 ? 'record' : 'records'} yet.`}
            </li>
          )}
        </ol>
      </div>

      <aside className="x56__map" aria-label="Where the branches lead">
        <p>
          The branches part at rank {divergeAt + 1}. What the summary number would read on each, over all {QUERIES.length}{' '}
          queries (MRR@10; the published v1 figures are the left branch’s):
        </p>
        <table>
          <thead>
            <tr>
              <th scope="col">Branch</th>
              <th scope="col">Structured</th>
              <th scope="col">Keyword</th>
            </tr>
          </thead>
          <tbody>
            {(['labeller', 'review'] as const).map((b) => (
              <tr key={b} aria-current={branch === b || undefined}>
                <th scope="row">{b === 'labeller' ? 'Left' : 'Right'}</th>
                <td>{MRR[b].structured.toFixed(3)}</td>
                <td>{MRR[b].baseline.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </aside>
    </div>
  )
}
