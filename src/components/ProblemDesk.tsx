import { useMemo, useState } from 'react'
import { buildIndex, search } from '../lib/retrieval'
import { STRUCTURED_WEIGHTS, recordFields, type ProblemRecord } from '../lib/records'
import { artifact, recordBySource } from '../lib/four-words-data'
import { CORRECTION_RECORD, DESK_QUERY_ID, LOOP, PARTS } from '../data/problem-desk'
import queryFile from '../../corpus/queries.json'

const query = queryFile.queries.find((q) => q.id === DESK_QUERY_ID)!
const relevant = new Set(query.relevant)

function rankWith(records: ProblemRecord[]) {
  const index = buildIndex(
    'structured',
    'local preview',
    records.map((r) => ({ id: r.sourceId, fields: recordFields(r) })),
    STRUCTURED_WEIGHTS,
  )
  return search(index, query.query).hits.map((h) => ({ id: h.id, matched: h.matches.map((m) => m.term) }))
}

const frozen = search(artifact.indexes.structured, query.query).hits.map((h) => ({
  id: h.id,
  matched: h.matches.map((m) => m.term),
}))
const firstRelevant = (ranked: Array<{ id: string }>) => ranked.findIndex((r) => relevant.has(r.id)) + 1

function Ranking({ ranked, compare }: { ranked: Array<{ id: string; matched: string[] }>; compare?: Array<{ id: string }> }) {
  return (
    <ol className="desk__ranking">
      {ranked.slice(0, 6).map((r, i) => {
        const before = compare ? compare.findIndex((x) => x.id === r.id) + 1 : 0
        const moved = compare && before ? before - (i + 1) : 0
        return (
          <li key={r.id} className={relevant.has(r.id) ? 'is-relevant' : undefined}>
            <span className="desk__rank">{i + 1}</span>
            <span className="desk__problem">
              {recordBySource.get(r.id)?.problem}
              <span className="desk__meta">
                {relevant.has(r.id) ? 'labelled relevant in v1 · ' : ''}matched {r.matched.join(', ')}
                {moved > 0 && ` · up ${moved}`}
                {moved < 0 && ` · down ${-moved}`}
              </span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export function ProblemDesk() {
  const [accepted, setAccepted] = useState<Record<string, boolean>>({ grounded: false, inferred: false })
  const anyAccepted = Object.values(accepted).some(Boolean)

  const preview = useMemo(() => {
    if (!anyAccepted) return null
    const patched = artifact.records.map((r) => {
      const parts = PARTS.filter((p) => accepted[p.id] && p.target === r.sourceId)
      return parts.length ? { ...r, symptoms: [...r.symptoms, ...parts.map((p) => p.add)] } : r
    })
    return rankWith(patched)
  }, [accepted, anyAccepted])

  const before = firstRelevant(frozen)
  const after = preview ? firstRelevant(preview) : before

  return (
    <section className="experiment desk wide" aria-labelledby="desk-title" data-experiment="problem-desk">
      <header className="experiment__header">
        <p className="kicker">Experiment · a correction, previewed</p>
        <h2 id="desk-title">The Problem Desk</h2>
        <p>
          One query, one challenge, one preview. Everything ranked here is the frozen Four Words v1 data;
          only the challenge is invented.
        </p>
      </header>

      <ol className="desk__steps">
        <li>
          <h3>
            <span className="desk__step">1</span> Find
          </h3>
          <p>
            Someone searches <code>{query.query}</code>, the query this essay opened with. In v1 the first
            source labelled relevant arrived at rank {before}.
          </p>
          <Ranking ranked={frozen} />
        </li>

        <li>
          <h3>
            <span className="desk__step">2</span> Challenge
          </h3>
          <div className="layer layer--source">
            <p className="layer__tag">
              Contribution · {CORRECTION_RECORD.author} · <code>{CORRECTION_RECORD.nsid}</code> · no Lexicon exists
            </p>
            <p>{CORRECTION_RECORD.text}</p>
            <p className="layer__ref">
              <code className="cm-uri">{CORRECTION_RECORD.uri}</code> · invented fixture
            </p>
          </div>
          <p>It proposes two changes to the index’s description. Not to any source.</p>
          <ul className="desk__parts">
            {PARTS.map((p) => (
              <li key={p.id} className={`desk__part desk__part--${p.grounding}`}>
                <label>
                  <input
                    type="checkbox"
                    checked={accepted[p.id]}
                    onChange={(e) => setAccepted((a) => ({ ...a, [p.id]: e.target.checked }))}
                  />
                  <span>
                    <span className="desk__grounding">{p.grounding === 'source' ? 'grounded in the source' : 'inference only'}</span>
                    Add the symptom “{p.add}” to the record for <code>{p.target}</code>.
                  </span>
                </label>
                <p className="layer__ref">
                  {p.evidence}
                  {p.quote && (
                    <>
                      {' '}
                      The source: <q>{p.quote.text}</q> (snapshot line {p.quote.line}).
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </li>

        <li>
          <h3>
            <span className="desk__step">3</span> Preview
          </h3>
          <p className="desk__verdict" role="status" aria-live="polite">
            {preview
              ? `First labelled-relevant source: rank ${before} → rank ${after}.`
              : 'Accept one or both parts to rebuild the index in your browser and rerun the query.'}
          </p>
          {preview && (
            <>
              <Ranking ranked={preview} compare={frozen} />
              <p>
                {accepted.inferred && !accepted.grounded
                  ? 'The guessed part, on its own, helps exactly as much as the sourced one would have. '
                  : accepted.grounded && !accepted.inferred
                    ? 'Now try the inferred part on its own: it helps exactly as much. '
                    : 'Either part alone would have produced the same improvement. '}
                The ranking cannot tell a description grounded in its source from a plausible guess. Only the
                contribution’s evidence can, which is why the desk records which is which, and why accepting a
                change should need more than a better number.
              </p>
              <p>
                And the top result is still the dotfiles issue, matched only on <em>missing</em>, <em>after</em>{' '}
                and <em>deploy</em>. A correction can repair a description. It cannot repair the weighting that
                let generic words win, and nobody has written that correction yet.
              </p>
            </>
          )}
        </li>

        <li>
          <h3>
            <span className="desk__step">4</span> What did not change
          </h3>
          <ul className="ledger">
            <li>
              <span className="ledger__title">The sources</span>
              <span className="ledger__meta">30 pinned snapshots · lock digest {artifact.corpus.lockDigest.slice(0, 12)}</span>
            </li>
            <li>
              <span className="ledger__title">The frozen v1 index, labels and results</span>
              <span className="ledger__meta">read-only; the preview patches a copy in this tab</span>
            </li>
            <li>
              <span className="ledger__title">Lena’s contribution</span>
              <span className="ledger__meta">a separate record; accepting it in a preview does not edit it</span>
            </li>
          </ul>
        </li>
      </ol>

      <p className="loop" aria-label="A possible feedback loop">
        {LOOP.map((step, i) => (
          <span key={step} className={i === 3 || i === 4 ? 'loop__here' : undefined}>
            {step}
          </span>
        ))}
      </p>
      <p className="layer__ref">
        Highlighted: the two steps this desk lets you try. The others happen elsewhere, or not yet.
      </p>
    </section>
  )
}
