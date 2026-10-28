import { Link, createFileRoute } from '@tanstack/react-router'
import { PageIntro } from '../components/PageIntro'
import { Status, type StatusKind } from '../components/Status'
import { pageTitle } from '../content/site'
import { SOURCES, repoFile } from '../content/sources'
import { HISTORY } from '../data/research-history'
import record from '../../knowledge/we-already-solved-this.json'
import recordUrl from '../../knowledge/we-already-solved-this.json?url'

export const Route = createFileRoute('/afterword')({
  head: () => ({ meta: [{ title: pageTitle('Afterword') }] }),
  component: Afterword,
})

const HYPOTHESIS_STATUS: Record<string, StatusKind> = {
  tested: 'tested',
  'demonstrated-on-fixtures': 'demonstrated',
  'partially-demonstrated': 'demonstrated',
  untested: 'not-built',
}

const KIND_LABEL = {
  conversation: 'Conversation',
  decision: 'Decision',
  experiment: 'Experiment',
  correction: 'Correction',
  proposal: 'Proposal, open',
  encounter: 'Encounter',
}

function Afterword() {
  const sourceTitle = (id: string) => (SOURCES as Record<string, { title: string }>)[id]?.title ?? id
  return (
    <>
      <PageIntro index="∴" kicker="Afterword" title="This essay is one of its own examples">
        <p>
          It began as somebody else’s conversation, grew through conversations with machines, borrowed
          ideas from other repositories, was challenged by its own experiments, and is published here
          with its mistakes attached.
        </p>
      </PageIntro>

      <p>
        Everything the essay asks of shared knowledge applies to the essay. Can you find where an idea
        came from? Can you see what was measured and what was only argued? Can you tell where it was wrong,
        and who said so? The history below is the attempt at an answer. It is not a story of steady
        progress. Two of its most useful entries are corrections.
      </p>

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

      <h2>The record</h2>
      <p>
        The essay is also written down as a structured record in the repository: its problem, its
        hypotheses and their status, the evidence for each, its sources and open questions. This page is
        rendered from that file. If the essay is ever published to a protocol like ATProto, this is the
        object that would travel; nothing has been published.
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

      <h2>What building it changed</h2>
      <ul>
        <li>
          <strong>The opening flipped.</strong> We set out to show knowledge disappearing into private agent
          sessions. The best example we found was agents contributing to a public repository, because its
          owner asked them to. The problem did not go away; it became a question of design and maintenance.
        </li>
        <li>
          <strong>The index result became a warning.</strong> Structured records won, and the review showed the
          win was partly vocabulary we wrote in. The same quality that made a description findable made it
          capable of misleading.
        </li>
        <li>
          <strong>The convergence moved.</strong> We expected the bridge between the two problems to be a better
          index. The Problem Desk suggests it is review: a ranking cannot tell a sourced correction from a
          guess.
        </li>
        <li>
          <strong>The metaphors needed boundaries.</strong> A switchboard never stored a conversation; a card
          catalogue’s authority came from institutions we do not have. Both helped, and both had to be told
          where they stop.
        </li>
      </ul>
      <p className="aside">
        A longer reflection, with what we would test next: <a href={repoFile('docs/REFLECTION.md')}>REFLECTION.md</a>.
      </p>

      <div className="closing">
        <p className="closing__eyebrow">We already solved this.</p>
        <p className="closing__question">
          But can we find it, understand it, challenge it, and leave it better for the next person?
        </p>
      </div>
      <p>
        If you can answer any part of that better than this essay does, or show that it is asking the wrong
        question, the <a href={repoFile('CONTRIBUTING.md')}>contribution guide</a> says how. The{' '}
        <Link to="/notes/">notes</Link> list everything read so far.
      </p>
    </>
  )
}
