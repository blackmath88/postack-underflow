import { Link, createFileRoute } from '@tanstack/react-router'
import { PageIntro } from '../../components/PageIntro'
import { PhotoFrameSpecimen } from '../../components/PhotoFrameSpecimen'
import { Status, type StatusKind } from '../../components/Status'
import {
  CHAPTER_LABEL,
  CHAPTER_ROUTE,
  EVIDENCE_LABEL,
  KIND_LABEL,
  NOTES,
  type Chapter,
  type NoteId,
} from '../../content/margin'
import { pageTitle } from '../../content/site'
import { repoFile } from '../../content/sources'

export const Route = createFileRoute('/archive/')({
  head: () => ({ meta: [{ title: pageTitle('Archive') }] }),
  component: ArchiveIndex,
})

const LEDGER: Array<{ item: string; status: StatusKind; note: string }> = [
  { item: 'Four Words v1 and its evaluation', status: 'tested', note: 'Frozen: 30 pinned sources, 27 labelled queries, one run with its audit.' },
  { item: 'The Disputed Neighbour', status: 'demonstrated', note: 'Real sources and frozen records; the shared heading is a hypothetical claim.' },
  { item: 'The Connection Contract', status: 'demonstrated', note: 'Fixture contributions and contracts; invented people under reserved names.' },
  { item: 'The Problem Desk', status: 'demonstrated', note: 'Frozen query and records; an invented correction; a local, in-browser preview.' },
  { item: 'Corrections that change a published index', status: 'not-built', note: 'No index reads contributions; nothing is accepted outside your tab.' },
  { item: 'Reading or publishing ATProto records', status: 'not-built', note: 'Needs explicit approval. No records exist on any network.' },
  { item: 'Community signals improving retrieval (H3)', status: 'hypothesis', note: 'Untested. The desk shows one mechanism, not an effect.' },
]

const DOCS: Array<[string, string, string]> = [
  ['Four Words write-up', 'docs/research/FOUR-WORDS.md', 'The experiment in full, with its post-hoc audit.'],
  ['ATProto and community research', 'docs/research/ATPROTO-COMMUNITY.md', 'Field names, pinned lexicon revisions, caveats.'],
  ['The photo-frame case', 'docs/research/CASE-PHOTO-FRAME.md', 'How the repository was identified, and what it shows.'],
  ['Reflection', 'docs/REFLECTION.md', 'What building the essay changed, and what we would test next.'],
  ['Editorial inventory', 'docs/editorial/CONTENT-INVENTORY.md', 'What stayed on the surface, what moved, and why.'],
  ['Architecture decisions', 'docs/adr/', 'Accepted and proposed ADRs.'],
  ['Verification', 'docs/VERIFICATION.md', 'What was checked in a real browser, and what was not.'],
]

const CHAPTERS: Chapter[] = ['opening', 'indexing', 'community', 'convergence', 'afterword']

function ArchiveIndex() {
  const ids = Object.keys(NOTES) as NoteId[]
  return (
    <>
      <PageIntro index="§" kicker="Archive" title="The archive">
        <p>
          Everything the story leaves out of its way: full results, methods, protocol research, history and
          provenance. Nothing here is needed to follow the essay; all of it is here to check it.
        </p>
      </PageIntro>

      <ul className="archive-map wide">
        <li>
          <Link to="/archive/four-words/">Four Words v1</Link>
          <p>Benchmark tables, the ablation, the post-hoc audit, method and how to reproduce it.</p>
        </li>
        <li>
          <Link to="/archive/community/">Community and protocols</Link>
          <p>A Q&amp;A site’s signals and their costs, the two-layer model, the ATProto inventory and its limits.</p>
        </li>
        <li>
          <Link to="/archive/history/">Research history and the record</Link>
          <p>How the essay was made, its corrections, and the essay as a structured knowledge record.</p>
        </li>
        <li>
          <Link to="/notes/">Sources and provenance</Link>
          <p>Every source the essay draws on, the experiments’ status, and where each idea came from.</p>
        </li>
      </ul>

      <h2 id="real">What is real today</h2>
      <ul className="ledger wide">
        {LEDGER.map((row) => (
          <li key={row.item}>
            <Status kind={row.status} />
            <span className="ledger__title">{row.item}</span>
            <span className="ledger__meta">{row.note}</span>
          </li>
        ))}
      </ul>

      <h2>The photo-frame repository, counted</h2>
      <p>The opening’s encounter, as numbers, with how the repository was identified.</p>
      <PhotoFrameSpecimen />

      <h2 id="notes">Every margin note</h2>
      <p>
        Each numbered phrase in the essay opens one of these notes. They are listed here so they can be read,
        searched and checked without the story. Each says how far its claims are checked.
      </p>
      {CHAPTERS.map((chapter) => (
        <section key={chapter} aria-labelledby={`notes-${chapter}`}>
          <h3 id={`notes-${chapter}`}>{CHAPTER_LABEL[chapter]}</h3>
          <ul className="note-index">
            {ids
              .filter((id) => NOTES[id].chapter === chapter)
              .map((id) => {
                const n = NOTES[id]
                return (
                  <li key={id}>
                    <span className="note-index__meta">
                      {KIND_LABEL[n.kind]} · {EVIDENCE_LABEL[n.evidence]}
                    </span>
                    <a href={`${import.meta.env.BASE_URL}${CHAPTER_ROUTE[chapter].slice(1)}#note-${id}`}>{n.title}</a>
                    <span className="note-index__summary">{n.summary}</span>
                  </li>
                )
              })}
          </ul>
        </section>
      ))}

      <h2>Research documents</h2>
      <ul className="ledger wide">
        {DOCS.map(([title, path, note]) => (
          <li key={path}>
            <span className="ledger__title">
              <a href={repoFile(path)}>{title}</a>
            </span>
            <span className="ledger__meta">{note}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
