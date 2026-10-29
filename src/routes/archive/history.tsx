import { Link, createFileRoute } from '@tanstack/react-router'
import { PageIntro } from '../../components/PageIntro'
import { Status, type StatusKind } from '../../components/Status'
import { pageTitle } from '../../content/site'
import { SOURCES, repoFile } from '../../content/sources'
import { HISTORY } from '../../data/research-history'
import record from '../../../knowledge/we-already-solved-this.json'
import recordUrl from '../../../knowledge/we-already-solved-this.json?url'

export const Route = createFileRoute('/archive/history')({
  head: () => ({ meta: [{ title: pageTitle('Archive: research history and record') }] }),
  component: HistoryArchive,
})

const HYPOTHESIS_STATUS: Record<string, StatusKind> = {
  tested: 'tested',
  'demonstrated-on-fixtures': 'demonstrated',
  'partially-demonstrated': 'demonstrated',
  untested: 'hypothesis',
}

const KIND_LABEL = {
  conversation: 'Conversation',
  decision: 'Decision',
  experiment: 'Experiment',
  correction: 'Correction',
  proposal: 'Proposal, open',
  encounter: 'Encounter',
}

function HistoryArchive() {
  const sourceTitle = (id: string) => (SOURCES as Record<string, { title: string }>)[id]?.title ?? id
  return (
    <>
      <PageIntro index="§" kicker="Archive · how it was made" title="Research history and the knowledge record">
        <p>
          How the essay came to be, with its mistakes attached, and the essay written down as a structured record
          of hypotheses, evidence and open questions.
        </p>
      </PageIntro>
      <p className="archive-banner">
        Story: <Link to="/afterword/">Afterword</Link> · <Link to="/archive/">Archive index</Link>
      </p>

      <p>
        It is not a story of steady progress. Two of the most useful entries below are corrections.
      </p>

      <h2 id="history">History</h2>
      <ol className="history wide">
        {HISTORY.map((h) => (
          <li key={h.title} className={`history__entry history__entry--${h.kind}`}>
            <p className="history__meta">
              <span>{h.date}</span>
              <span className="history__kind">{KIND_LABEL[h.kind]}</span>
            </p>
            <h3>{h.title}</h3>
            <p>{h.what}</p>
            <p className="history__changed">
              <span className="history__label">What it changed</span> {h.changed}
            </p>
            {h.link && (
              <p className="layer__ref">
                <a href={h.link.url}>{h.link.label}</a>
              </p>
            )}
          </li>
        ))}
      </ol>

      <h2 id="record">The record</h2>
      <p>
        The essay is also written down as a structured record in the repository: its problem, its hypotheses
        and their status, the evidence for each, its sources and open questions. This section is rendered from
        that file. If the essay is ever published to a protocol like ATProto, this is the object that would
        travel; nothing has been published.
      </p>

      <article className="krecord wide" aria-labelledby="krecord-title">
        <header>
          <div>
            <p className="kicker">
              {record.type} · v{record.revision.version} · {record.revision.date}
            </p>
            <h3 id="krecord-title" className="krecord__title">
              {record.title}
            </h3>
          </div>
          <p>
            <a href={recordUrl} download="we-already-solved-this.json">
              Download the record (JSON)
            </a>{' '}
            · <a href={repoFile('knowledge/we-already-solved-this.json')}>Record file on GitHub</a>
          </p>
        </header>
        <div className="krecord__body">
          <dl>
            <dt>Problem</dt>
            <dd>{record.problem}</dd>
            <dt>Hypotheses</dt>
            <dd>
              <ul>
                {record.hypotheses.map((h) => (
                  <li key={h.id}>
                    <Status kind={HYPOTHESIS_STATUS[h.status] ?? 'hypothesis'} />
                    <strong>{h.id}</strong> {h.statement}
                  </li>
                ))}
              </ul>
            </dd>
            <dt>Evidence</dt>
            <dd>
              <ul>
                {record.evidence.map((e) => (
                  <li key={e.id}>
                    <strong>{e.id}</strong> · {e.kind.replace(/-/g, ' ')}: {e.summary}{' '}
                    <a href={repoFile(e.artifact)}>
                      <code>{e.artifact}</code>
                    </a>
                  </li>
                ))}
              </ul>
            </dd>
            <dt>Sources</dt>
            <dd>{record.sources.map(sourceTitle).join(' · ')}</dd>
            <dt>Open questions</dt>
            <dd>
              <ul>
                {record.openQuestions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </dd>
            <dt>Revision</dt>
            <dd>{record.revision.changes}</dd>
            <dt>Publication</dt>
            <dd>
              <Status kind="not-built" />
              {record.publication.status.replace('-', ' ')}. {record.publication.discussion}
            </dd>
          </dl>
        </div>
      </article>

      <h2 id="changed">What building it changed, in full</h2>
      <ul>
        <li>
          <strong>The opening flipped.</strong> We set out to show knowledge disappearing into private agent
          sessions. The best example we found was agents contributing to a public repository, because its owner
          asked them to. The problem did not go away; it became a question of design and maintenance.
        </li>
        <li>
          <strong>The index result became a warning.</strong> Structured records won, and the review showed the
          win was partly vocabulary we wrote in. The same quality that made a description findable made it
          capable of misleading.
        </li>
        <li>
          <strong>The convergence moved.</strong> We expected the bridge between the two problems to be a better
          index. Building the Problem Desk made plain what was true by construction: a ranking cannot tell a
          supported correction from a guess. The bridge is review.
        </li>
        <li>
          <strong>The metaphors needed boundaries.</strong> A switchboard never stored a conversation; a card
          catalogue’s authority came from institutions we do not have. Both helped, and both had to be told where
          they stop.
        </li>
        <li>
          <strong>The story got lighter.</strong> An editorial pass moved methodology, tables and qualifications
          out of the default reading path and into margin notes and this archive, without changing the evidence.
        </li>
      </ul>
      <p className="aside">
        A longer reflection, with what we would test next:{' '}
        <a href={repoFile('docs/REFLECTION.md')}>REFLECTION.md</a>. The editorial decisions behind the lighter
        story: <a href={repoFile('docs/editorial/CONTENT-INVENTORY.md')}>CONTENT-INVENTORY.md</a>.
      </p>
    </>
  )
}
