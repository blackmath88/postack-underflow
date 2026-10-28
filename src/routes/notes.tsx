import { createFileRoute } from '@tanstack/react-router'
import { PageIntro } from '../components/PageIntro'
import { Status } from '../components/Status'
import { pageTitle } from '../content/site'
import { SOURCES, repoFile, type Source } from '../content/sources'

export const Route = createFileRoute('/notes')({
  head: () => ({ meta: [{ title: pageTitle('Notes') }] }),
  component: Notes,
})

const KIND_LABEL: Record<Source['kind'], string> = {
  conversation: 'Conversation',
  'prior-work': 'Prior work',
  protocol: 'Protocol',
  practice: 'Practice',
}

const EXPERIMENTS = [
  {
    name: 'P0 · Editorial showcase',
    status: 'implemented' as const,
    text: 'This site: the narrative, the source trail, four working experiments and the essay as a structured record. Visual design is preliminary.',
  },
  {
    name: 'P1 · Four Words',
    status: 'implemented' as const,
    text: 'Index-first retrieval over 30 pinned public sources on GitHub Pages subpath deployment, with 27 queries labelled before any record existed. Measured once against plain keyword search; see the Indexing page and FOUR-WORDS.md.',
  },
  {
    name: 'P2 · Portable discussion',
    status: 'demonstrated' as const,
    text: 'Partly, through the Connection Contract: fixture contributions, relationship claims with histories, offline and deleted records. No real ATProto reads; publishing only with explicit review.',
  },
  {
    name: 'The Disputed Neighbour',
    status: 'demonstrated' as const,
    text: 'Two frozen v1 records filed under one term; source evidence that their causes differ; a local verdict and a URL check. Uses real sources; the shared heading is hypothetical.',
  },
  {
    name: 'The Connection Contract and the Operator Leaves',
    status: 'demonstrated' as const,
    text: 'Nine relationship claims over eight fixture contributions, each with proposer, reason, evidence and status history. Model and reader proposals can never become author statements.',
  },
  {
    name: 'The Problem Desk',
    status: 'demonstrated' as const,
    text: 'One invented correction previewed against the frozen index (rank 7 → 2). Illustrates, by construction, that a better number is not evidence a change is supported.',
  },
  {
    name: 'P3 · Community signals',
    status: 'not-built' as const,
    text: 'Test whether endorsements and corrections improve retrieval, including manipulation and cold-start cases. A null result counts.',
  },
]

const DOCS = [
  ['The problem and hypotheses', 'docs/PROBLEM.md'],
  ['Concept and architecture', 'docs/CONCEPT.md'],
  ['Origins and provenance', 'docs/PROVENANCE.md'],
  ['Experiments and decision gates', 'docs/EXPERIMENTS.md'],
  ['Essay draft', 'writing/WE-ALREADY-SOLVED-THIS.md'],
  ['Four Words: method and results', 'docs/research/FOUR-WORDS.md'],
  ['ATProto and portable communities', 'docs/research/ATPROTO-COMMUNITY.md'],
  ['Corpus: sources, queries, records', 'corpus/'],
  ['Evaluation results', 'results/four-words-v1.json'],
  ['The essay as a structured record', 'knowledge/we-already-solved-this.json'],
  ['The photo-frame case study', 'docs/research/CASE-PHOTO-FRAME.md'],
  ['What building it changed', 'docs/REFLECTION.md'],
  ['Verification evidence', 'docs/VERIFICATION.md'],
  ['Architecture decisions', 'docs/adr/'],
] as const

function Notes() {
  return (
    <>
      <PageIntro kicker="Research journal" title="Notes">
        <p>
          Sources, provenance, experiments and open questions. This is where the essay shows its
          working.
        </p>
      </PageIntro>

      <h2>How to read claims on this site</h2>
      <p>Statements are labelled when their status matters:</p>
      <ul>
        <li>
          <Status kind="observation" /> something we noticed, with a source where there is one;
        </li>
        <li>
          <Status kind="paraphrase" /> our wording of what someone else said, never a quotation;
        </li>
        <li>
          <Status kind="hypothesis" /> an idea we want to test and have not;
        </li>
        <li>
          <Status kind="implemented" /> exists and can be inspected in the repository;
        </li>
        <li>
          <Status kind="tested" /> measured, with the result and its caveats published;
        </li>
        <li>
          <Status kind="demonstrated" /> shown working on fixtures or in part, not proven at scale;
        </li>
        <li>
          <Status kind="not-built" /> planned or imagined, with nothing to show yet.
        </li>
      </ul>
      <p>
        The only measured result on this site is the Four Words evaluation, and it is reported
        with its weaknesses. No user activity or community participation in this project is reported:
        every community contribution in the experiments is an invented fixture under a reserved name.
        The photo-frame figures on the home page describe a real, separate repository.
      </p>

      <h2>Sources and provenance</h2>
      <ul className="ledger wide">
        {Object.values(SOURCES).map((source) => (
          <li key={source.id}>
            {'private' in source && source.private ? (
              <span className="ledger__title ledger__title--block">{source.title}</span>
            ) : (
              <a className="ledger__title" href={source.url}>
                {source.title}
              </a>
            )}
            <span className="ledger__meta">
              {KIND_LABEL[source.kind]}
              {'private' in source && source.private ? ' · private repository, not linked' : ''}
              {'checked' in source ? ` · ${source.checked}` : ''}
            </span>
            <p>{source.contribution}</p>
          </li>
        ))}
      </ul>
      <p className="aside">
        Stack Overflow and web search are discussed as prior practice from general experience; no
        claims about their internal ranking or performance are made. Visual references supplied by
        the project owner are inspiration only and are not used as assets.
      </p>

      <h2>Experiments</h2>
      <ul className="ledger wide">
        {EXPERIMENTS.map((experiment) => (
          <li key={experiment.name}>
            <Status kind={experiment.status} />
            <span className="ledger__title">{experiment.name}</span>
            <p>{experiment.text}</p>
          </li>
        ))}
      </ul>

      <h2>Open questions</h2>
      <ul>
        <li>Should endorsement, correction and dispute reuse the nearest niche patterns (Leaflet’s author-curated interactions, Frontpage’s versioned comments) or get a new shared Lexicon, and who would maintain it?</li>
        <li>Is a problem a stable enough unit to index, or does it fragment into versions and contexts too quickly?</li>
        <li>How should an index represent disagreement without either hiding it or amplifying noise?</li>
        <li>What stops a portable community from becoming one more aggregator that everyone depends on?</li>
        <li>What would an agent need in order to publish a useful, sanitised write-up of a fix without leaking private context?</li>
      </ul>

      <h2>In the repository</h2>
      <ul>
        {DOCS.map(([label, path]) => (
          <li key={path}>
            <a href={repoFile(path)}>{label}</a> <code>{path}</code>
          </li>
        ))}
      </ul>
    </>
  )
}
