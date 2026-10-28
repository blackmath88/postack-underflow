import { useId, useMemo, useState } from 'react'
import { search } from '../lib/retrieval'
import { CLAIM, CORRECTION, EVIDENCE, NEIGHBOURS, PROBES, type Neighbour } from '../data/disputed-neighbour'
import { artifact, recordBySource, sourceById } from '../lib/four-words-data'

type Layer = 'source' | 'index' | 'both'
type Verdict = 'together' | 'split' | null

function SourceLayer({ n }: { n: Neighbour }) {
  const source = sourceById.get(n.sourceId)
  return (
    <div className="layer layer--source">
      <p className="layer__tag">Source · what the issue says</p>
      <ul>
        {n.excerpts.map((e) => (
          <li key={e.text}>
            {e.quote ? <q>{e.text}</q> : <span className="paraphrase">{e.text}</span>}
            <span className="layer__ref">
              {e.quote ? 'quote' : 'paraphrase'}, snapshot line {e.line}
            </span>
          </li>
        ))}
      </ul>
      <p className="layer__url">
        <span className="layer__ref">failing request</span>
        <code>{n.failingUrl}</code>
        {n.failingUrlNote && <span className="layer__ref">{n.failingUrlNote}</span>}
      </p>
      {source && (
        <p className="layer__ref">
          <a href={source.url}>
            {source.title.slice(0, 60)}
            {source.title.length > 60 ? '…' : ''}
          </a>{' '}
          · updated {source.revision.slice(0, 10)}, not pinned
        </p>
      )}
    </div>
  )
}

function IndexLayer({ n }: { n: Neighbour }) {
  const record = recordBySource.get(n.sourceId)
  if (!record) return null
  const flagged = new Map(n.unsupported.map((u) => [u.text, u.note]))
  const item = (text: string) => (
    <li key={text} className={flagged.has(text) ? 'is-unsupported' : undefined}>
      {text}
      {flagged.has(text) && <span className="unsupported-flag">not in source · {flagged.get(text)}</span>}
    </li>
  )
  return (
    <div className="layer layer--index">
      <p className="layer__tag">Added during indexing · frozen v1 record</p>
      <p className="layer__field">Problem, as the record writer put it</p>
      <p>{record.problem}</p>
      <p className="layer__field">Aliases</p>
      <ul>{record.aliases.map(item)}</ul>
      <p className="layer__field">Symptoms</p>
      <ul>{record.symptoms.map(item)}</ul>
      <p className="layer__field">Controlled terms</p>
      <p>
        {record.terms.map((t) => (
          <code key={t} className="term">
            {t}
          </code>
        ))}
      </p>
    </div>
  )
}

function NeighbourPanel({ n, index }: { n: Neighbour; index: number }) {
  const [layer, setLayer] = useState<Layer>('both')
  const groupId = useId()
  return (
    <article className="neighbour" aria-labelledby={`${groupId}-title`}>
      <header>
        <p className="neighbour__number">{index === 0 ? 'A' : 'B'}</p>
        <h3 id={`${groupId}-title`}>{n.label}</h3>
      </header>
      <div className="segmented" role="group" aria-label={`Layers shown for ${n.label}`}>
        {(['source', 'index', 'both'] as Layer[]).map((l) => (
          <button key={l} type="button" aria-pressed={layer === l} onClick={() => setLayer(l)}>
            {l === 'source' ? 'Source' : l === 'index' ? 'Index' : 'Both'}
          </button>
        ))}
      </div>
      {layer !== 'index' && <SourceLayer n={n} />}
      {layer !== 'source' && <IndexLayer n={n} />}
    </article>
  )
}

function Probe() {
  const [probe, setProbe] = useState(PROBES[0]!)
  const ids = NEIGHBOURS.map((n) => n.sourceId)
  const hits = useMemo(() => search(artifact.indexes.structured, probe).hits.slice(0, 4), [probe])
  return (
    <div className="probe">
      <p className="probe__label">Search the frozen v1 index:</p>
      <div className="segmented" role="group" aria-label="Probe query">
        {PROBES.map((p) => (
          <button key={p} type="button" aria-pressed={probe === p} onClick={() => setProbe(p)}>
            <code>{p}</code>
          </button>
        ))}
      </div>
      <ol className="probe__results" aria-live="polite">
        {hits.map((h) => {
          const mine = ids.indexOf(h.id)
          return (
            <li key={h.id} className={mine > -1 ? 'is-neighbour' : undefined}>
              <span className="probe__mark">{mine > -1 ? (mine === 0 ? 'A' : 'B') : '·'}</span>
              <span>{recordBySource.get(h.id)?.problem}</span>
              <span className="probe__why">
                matched {h.matches.map((m) => m.term).join(', ')}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function UrlCheck() {
  const urlId = useId()
  const repoId = useId()
  const [url, setUrl] = useState('')
  const [repo, setRepo] = useState('')
  let verdict: string | null = null
  try {
    if (url.trim() && repo.trim()) {
      const path = new URL(url.trim()).pathname
      const name = repo.trim().replace(/^\/|\/$/g, '')
      const file = path.split('/').pop() ?? ''
      if (!path.startsWith(`/${name}/`)) verdict = 'A — the URL is missing the repository name. Check the base path.'
      else if (file.startsWith('_') || path.split('/').some((seg) => seg.startsWith('_')))
        verdict = 'B — the path is right but contains a segment starting with _. Check Jekyll and .nojekyll.'
      else verdict = 'Neither — the path includes the repository and nothing starts with _. Look elsewhere.'
    }
  } catch {
    verdict = 'That does not parse as a URL. Paste the full address of the request that failed.'
  }
  return (
    <form className="urlcheck" onSubmit={(e) => e.preventDefault()}>
      <p className="probe__label">Try the question on a failing request:</p>
      <div className="urlcheck__row">
        <label htmlFor={urlId}>Failing URL</label>
        <input
          id={urlId}
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://you.github.io/assets/index.js"
          spellCheck={false}
        />
      </div>
      <div className="urlcheck__row">
        <label htmlFor={repoId}>Repository name</label>
        <input id={repoId} type="text" value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="my-site" spellCheck={false} />
      </div>
      <p className="urlcheck__result" role="status" aria-live="polite">
        {verdict ?? 'Enter both to see which neighbour applies. Nothing is sent anywhere.'}
      </p>
    </form>
  )
}

export function DisputedNeighbour() {
  const [verdict, setVerdict] = useState<Verdict>(null)
  const status = verdict === 'split' ? 'disputed' : verdict === 'together' ? 'accepted' : CLAIM.status
  return (
    <section className="experiment wide" aria-labelledby="dn-title" data-experiment="disputed-neighbour">
      <header className="experiment__header">
        <p className="kicker">Experiment · a classification claim</p>
        <h2 id="dn-title">The Disputed Neighbour</h2>
        <p>
          Two real issues from the Four Words corpus, filed side by side. Inspect what each source says,
          what the index added, and the claim that they are the same problem. Then decide.
        </p>
      </header>

      <div className={`claim claim--${status}`}>
        <p className="claim__tag">
          <span>Classification claim</span>
          <span className="claim__status">
            {status}
            {verdict && ' · in your view only'}
          </span>
        </p>
        <p className="claim__heading">{CLAIM.heading}</p>
        <p>
          <span className="claim__field">Suggested fix</span> {CLAIM.proposedFix}
        </p>
        <p>
          <span className="claim__field">Proposed by</span> {CLAIM.proposedBy}
        </p>
        <p>
          <span className="claim__field">Basis</span> {CLAIM.basis}
        </p>
      </div>

      <div className="neighbours">
        {NEIGHBOURS.map((n, i) => (
          <NeighbourPanel key={n.sourceId} n={n} index={i} />
        ))}
      </div>

      <Probe />

      <div className="evidence">
        <h3>Evidence about the claim</h3>
        <ul>
          {EVIDENCE.map((e) => (
            <li key={e.text} className={`evidence--${e.stance}`}>
              <span className="evidence__stance">{e.stance === 'supports' ? '+ supports' : '− challenges'}</span>
              {e.text}
              <span className="layer__ref">
                {' '}
                ({sourceById.get(e.sourceId)?.repo}
                {e.line ? `, snapshot line ${e.line}` : ''})
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="verdict">
        <h3>Your reading</h3>
        <div className="segmented" role="group" aria-label="Your verdict on the claim">
          <button type="button" aria-pressed={verdict === 'together'} onClick={() => setVerdict('together')}>
            Keep them together
          </button>
          <button type="button" aria-pressed={verdict === 'split'} onClick={() => setVerdict('split')}>
            Split them
          </button>
          {verdict && (
            <button type="button" onClick={() => setVerdict(null)}>
              Undo
            </button>
          )}
        </div>
        <div className="verdict__outcome" aria-live="polite">
          {verdict === 'together' && (
            <p>
              Under one heading with one fix, the reader in case B is told to check the base path. Their
              paths are already right, so the advice costs them an afternoon. The heading is easy to find
              and wrong for half its readers.
            </p>
          )}
          {verdict === 'split' && (
            <>
              <p>
                {CORRECTION.summary} <strong>{CORRECTION.question}</strong>
              </p>
              <ul className="verdict__routes">
                {CORRECTION.answers.map((a) => {
                  const n = NEIGHBOURS.find((x) => x.sourceId === a.goesTo)!
                  return (
                    <li key={a.answer}>
                      <span className="verdict__answer">{a.answer}</span> → {n.label}: {n.fix}{' '}
                      <span className="layer__ref">{n.fixEvidence}</span>
                    </li>
                  )
                })}
              </ul>
              <p className="layer__ref">
                Only this reading changes. Both issues and both v1 records stay exactly as they were.
              </p>
            </>
          )}
          {!verdict && <p className="layer__ref">No verdict yet. Nothing changes until you choose, and you can undo.</p>}
        </div>
        {verdict === 'split' && <UrlCheck />}
      </div>
    </section>
  )
}
