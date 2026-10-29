import { useId, useMemo, useState } from 'react'
import { buildIndex, search } from '../../lib/retrieval'
import { COMMONS_WEIGHTS, applyCorrection, problemFields, type Correction, type Problem } from '../model'
import { PROBLEMS, VIEW, day, sourceFor, sourceLabel, who, type Elsewhere } from './data'
import { AtCard } from './Elsewhere'
import { Inline } from './Inline'

const rankIn = (problems: Problem[], query: string, id: string) => {
  const idx = buildIndex('structured', 'preview', problems.map((p) => ({ id: p.id, fields: problemFields(p) })), COMMONS_WEIGHTS)
  const hits = search(idx, query).hits
  const i = hits.findIndex((h) => h.id === id)
  return { rank: i === -1 ? null : i + 1, score: i === -1 ? 0 : hits[i]!.score, of: hits.length }
}

export function Challenge({ problem }: { problem: Problem }) {
  const corrections = VIEW.corrections.filter((c) => c.problem === problem.id)
  const fixtures = (VIEW.elsewhere.byProblem[problem.id] ?? []).filter((e) => e.record.fixture)
  if (!corrections.length) {
    return (
      <section className="pfc-challenge" aria-labelledby="challenge-title" id="challenge">
        <p className="pfc-step" aria-hidden="true">04 · Challenge</p>
        <h2 id="challenge-title">Corrections</h2>
        <p className="pfc-empty">
          The record writer found no correction or qualification of this problem in the snapshot. That is not the same
          as there being none: it means nobody wrote one where this index looked.
        </p>
      </section>
    )
  }
  return (
    <section className="pfc-challenge" aria-labelledby="challenge-title" id="challenge">
      <p className="pfc-step" aria-hidden="true">04 · Challenge</p>
      <h2 id="challenge-title">Someone says this is not quite right</h2>
      {corrections.map((c) => (
        <CorrectionCard key={c.id} c={c} problem={problem} fixtures={fixtures.filter((f) => f.record.correction === c.id)} />
      ))}
    </section>
  )
}

function CorrectionCard({ c, problem, fixtures }: { c: Correction; problem: Problem; fixtures: Elsewhere[] }) {
  const said = sourceFor(c.ref)
  const qualified = sourceFor(c.qualifies.ref)
  const [preview, setPreview] = useState(false)
  const probeId = useId()
  const [probe, setProbe] = useState(c.preview?.symptoms?.[0] ?? problem.symptoms[0] ?? '')
  const after = useMemo(() => applyCorrection(problem, c), [problem, c])
  const ranks = useMemo(() => {
    if (!c.preview || !probe.trim()) return null
    const before = rankIn(PROBLEMS, probe, problem.id)
    const later = rankIn(PROBLEMS.map((p) => (p.id === problem.id ? after : p)), probe, problem.id)
    return { before, later }
  }, [c, probe, problem, after])

  return (
    <article className={`pfc-correction${c.absorbed ? ' pfc-correction--absorbed' : ''}`}>
      <div className="pfc-pair">
        <blockquote className="pfc-said">
          <p className="pfc-said__label">{c.kind === 'scope' ? 'Narrows or widens the scope' : c.kind === 'result' ? 'Reports a different result' : 'Changes the status'}</p>
          <p><q><Inline text={c.quote} /></q></p>
          <footer>
            {who(c.by)} · <a href={said?.url}>{sourceLabel(said)}</a>
            {said?.at ? ` · ${day(said.at)}` : ''}
          </footer>
        </blockquote>
        <p className="pfc-pair__against" aria-hidden="true">against</p>
        <blockquote className="pfc-said pfc-said--qualified">
          <p className="pfc-said__label">What it qualifies</p>
          <p><q><Inline text={c.qualifies.quote} /></q></p>
          <footer>
            <a href={qualified?.url}>{sourceLabel(qualified)}</a>
          </footer>
        </blockquote>
      </div>
      <p className="pfc-says">{c.says}</p>
      <p className={`pfc-absorbed${c.absorbed ? ' is-absorbed' : ''}`}>
        <strong>{c.absorbed ? 'Already absorbed.' : 'Not absorbed.'}</strong> {c.absorbedNote}
      </p>

      {fixtures.map((f) => (
        <div key={f.record.uri} className="pfc-arrives">
          <p className="pfc-hint">How it could arrive from elsewhere, published by its own author and attached here by its link:</p>
          <AtCard e={f} />
        </div>
      ))}

      {c.preview && (
        <div className="pfc-preview" id={`preview-${c.id}`}>
          <p className="pfc-step" aria-hidden="true">05 · Preview</p>
          <button type="button" className="pfc-button" aria-expanded={preview} aria-controls={`preview-body-${c.id}`} onClick={() => setPreview(!preview)}>
            {preview ? 'Hide the preview' : 'Preview this correction in the index'}
          </button>
          <div id={`preview-body-${c.id}`} hidden={!preview}>
            <p className="pfc-hint">
              The record writer’s proposal of how this record would read if the correction were accepted. It runs in your
              browser on a copy. <strong>The GitHub thread, the curated page and this index stay exactly as they are.</strong>
            </p>
            <table className="pfc-diff">
              <caption className="pfc-visually-hidden">Record fields before and after the correction</caption>
              <thead>
                <tr><th scope="col">Field</th><th scope="col">Now</th><th scope="col">With the correction</th></tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Status note</th>
                  <td>{problem.statusNote}</td>
                  <td className={after.statusNote !== problem.statusNote ? 'is-changed' : ''}>{after.statusNote}</td>
                </tr>
                <tr>
                  <th scope="row">Environment</th>
                  <td>{problem.environment.join(' · ')}</td>
                  <td className={after.environment.length !== problem.environment.length ? 'is-changed' : ''}>{after.environment.join(' · ')}</td>
                </tr>
                <tr>
                  <th scope="row">Symptoms</th>
                  <td>{problem.symptoms.join(' · ')}</td>
                  <td className={after.symptoms.length !== problem.symptoms.length ? 'is-changed' : ''}>{after.symptoms.join(' · ')}</td>
                </tr>
              </tbody>
            </table>
            <div className="pfc-probe">
              <label htmlFor={probeId}>Does it change what a search finds? Try a query:</label>
              <input id={probeId} type="search" value={probe} onChange={(e) => setProbe(e.target.value)} autoComplete="off" />
              {ranks && (
                <p>
                  This record ranks <strong>{ranks.before.rank ?? 'nowhere'}</strong> now and <strong>{ranks.later.rank ?? 'nowhere'}</strong> with
                  the correction (score {ranks.before.score.toFixed(2)} → {ranks.later.score.toFixed(2)}).{' '}
                  {ranks.before.rank === ranks.later.rank
                    ? 'The ranking does not move: here the correction changes what the record claims, not whether it is found.'
                    : 'The ranking moves, by construction: the correction added words to the record.'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
