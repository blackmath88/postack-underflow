import { useId, useState } from 'react'
import { artifact, recordBySource, sourceById } from '../../../lib/four-words-data'
import { search } from '../../../lib/retrieval'
import { FORK_QUERY, REVIEW_ADDS, branchOf, relevantFor, type Branch, type Reading } from './56-fork'
import { QUERIES } from './copy-index'

// 56 · The Forked Interpretation. One query, one frozen ranking, the same
// source records, and one labelling choice: do the two records at ranks 2 and
// 4, which describe missing CSS, answer "css missing after deploy"? The v1
// labeller said no; the post-hoc review (FOUR-WORDS.md) reads them as yes.
// The visitor throws the points one way or the other. Both branches stay
// drawn, each ending in the summary number it would have published. The v1
// labels stay frozen; the review's branch is a reading, never written back.

const q01 = QUERIES.find((q) => q.id === FORK_QUERY)!
const RANKED = search(artifact.indexes.structured, q01.query)
  .hits.slice(0, 8)
  .map((h) => h.id)
const BRANCH: Record<Reading, Branch> = {
  labeller: branchOf(artifact.indexes.structured, artifact.indexes.baseline, QUERIES, 'labeller'),
  review: branchOf(artifact.indexes.structured, artifact.indexes.baseline, QUERIES, 'review'),
}
const DISPUTED = RANKED.filter((id) => (REVIEW_ADDS as readonly string[]).includes(id))

const SIDE: Record<Reading, { name: string; who: string; answer: string }> = {
  labeller: { name: 'Left branch', who: 'the v1 labeller', answer: 'No, they do not answer it' },
  review: { name: 'Right branch', who: 'the post-hoc review', answer: 'Yes, they answer it' },
}

const name = (id: string) => {
  const s = sourceById.get(id)
  if (!s) return id
  const issue = id.match(/issue-(\d+)/)
  const repo = s.repo.split('/')[1] ?? s.repo
  return issue ? `${repo}#${issue[1]}` : `${repo}: ${s.title.length > 40 ? `${s.title.slice(0, 39)}…` : s.title}`
}

const f3 = (n: number) => n.toFixed(3)

export default function ForkedInterpretation() {
  const id = useId()
  const [reading, setReading] = useState<Reading>('labeller')
  const here = BRANCH[reading]
  const there = BRANCH[reading === 'labeller' ? 'review' : 'labeller']

  const status =
    reading === 'labeller'
      ? `On the left branch, as published: first answer at rank ${here.structuredRank}, structured MRR@10 ${f3(here.structured)} against keyword ${f3(here.keyword)}. Structured search wins.`
      : `On the right branch: first answer at rank ${here.structuredRank}, structured MRR@10 ${f3(here.structured)} instead of ${f3(there.structured)}. Keyword search stays at ${f3(here.keyword)}. Structured search still wins.`

  return (
    <div className="x56">
      <div className="x56__trunk">
        <p className="x56__label">The trunk, shared by both readings</p>
        <p>
          The query <strong>“{q01.query}”</strong>, the 30 pinned sources, their v1 records and the frozen structured
          ranking.
        </p>
      </div>

      <fieldset className="x56__points">
        <legend>
          <span className="x56__label">The fork: one labelling choice</span>
          Do these two records answer “{q01.query}”?
        </legend>
        <ul className="x56__disputed">
          {DISPUTED.map((d) => (
            <li key={d}>
              <span className="x56__rank">#{RANKED.indexOf(d) + 1}</span> <strong>{name(d)}</strong>
              <span className="x56__problem">{recordBySource.get(d)?.problem}</span>
            </li>
          ))}
        </ul>
        <div className="x56__lever">
          {(['labeller', 'review'] as const).map((r) => (
            <label key={r} className={`x56__throw x56__throw--${r}` + (reading === r ? ' is-on' : '')}>
              <input
                type="radio"
                name={`${id}-reading`}
                checked={reading === r}
                onChange={() => setReading(r)}
                data-probe={r === 'review' ? 'click' : undefined}
              />
              <span>
                <strong>{SIDE[r].answer}</strong>
                <span className="x56__who">{r === 'labeller' ? '← as the v1 labeller read them' : 'as the post-hoc review reads them →'}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="x56__result" data-observe>
        <div className="x56__branches">
          {(['labeller', 'review'] as const).map((r) => {
            const b = BRANCH[r]
            const rel = relevantFor(q01, r)
            const on = reading === r
            return (
              <section key={r} className={`x56__branch x56__branch--${r}` + (on ? ' is-taken' : '')} aria-label={`${SIDE[r].name}: ${SIDE[r].who}${on ? ', the branch you took' : ''}`}>
                <p className="x56__label">
                  {SIDE[r].name} · {SIDE[r].who}
                  {on && <span className="x56__here"> · you are here</span>}
                </p>
                <ol className="x56__path">
                  {RANKED.map((rid, i) => {
                    const answers = rel.includes(rid)
                    const first = i + 1 === b.structuredRank
                    const split = (REVIEW_ADDS as readonly string[]).includes(rid)
                    return (
                      <li key={rid} className={(answers ? 'is-answer' : '') + (first ? ' is-first' : '') + (split ? ' is-split' : '')}>
                        <span className="x56__dot" aria-hidden="true">
                          {answers ? '●' : '○'}
                        </span>
                        <span className="x56__rank">#{i + 1}</span>
                        <span className="x56__name">{name(rid)}</span>
                        <span className="visually-hidden">{answers ? ', answers the query' : ', does not answer it'}</span>
                        {first && <span className="x56__first">first answer</span>}
                      </li>
                    )
                  })}
                </ol>
                <dl className="x56__plate">
                  <div>
                    <dt>First answer</dt>
                    <dd className="x56__big">rank {b.structuredRank}</dd>
                  </div>
                  <div>
                    <dt>Structured MRR@10</dt>
                    <dd className="x56__big">{f3(b.structured)}</dd>
                  </div>
                  <div>
                    <dt>Keyword MRR@10</dt>
                    <dd>{f3(b.keyword)}</dd>
                  </div>
                  <div>
                    <dt>Who wins</dt>
                    <dd>
                      {b.winner}, by {f3(b.structured - b.keyword)}
                    </dd>
                  </div>
                </dl>
                <p className="x56__stamp">{r === 'labeller' ? 'Published in v1' : 'Not published'}</p>
              </section>
            )
          })}
        </div>
        <p className="x56__status" role="status">
          {status}
        </p>
      </div>
      <p className="x56__foot">
        MRR@10 over all {QUERIES.length} frozen queries; only q01’s labels differ between the branches. Keyword search
        finds an answer at rank {BRANCH.labeller.keywordRank} either way. The frozen labels are not edited.
      </p>
    </div>
  )
}
