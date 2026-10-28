import { Link, createFileRoute } from '@tanstack/react-router'
import { PageIntro } from '../components/PageIntro'
import { Src } from '../components/Src'
import { Status, type StatusKind } from '../components/Status'
import { pageTitle } from '../content/site'
import { SOURCES } from '../content/sources'

export const Route = createFileRoute('/convergence')({
  head: () => ({ meta: [{ title: pageTitle('Convergence') }] }),
  component: Convergence,
})

// This essay described as the kind of record it argues for. Hand-written and
// illustrative: it is not published anywhere and has no community signals.
const ARTICLE_RECORD = {
  problem: 'Solved problems are rediscovered instead of retrieved',
  aliases: ['we already solved this', 'agents re-solve known problems', 'lost Stack Overflow shortcut'],
  subproblems: ['indexing: finding existing solutions', 'community: preserving collective judgement'],
  sources: [SOURCES.syntax1050.url, SOURCES.githubAtlas.url, SOURCES.brainstorm.url],
  proposedApproaches: ['precomputed problem-oriented index', 'portable community records'],
  evidence: [],
  openQuestions: 5,
  status: 'hypothesis',
  publication: 'not published',
}

const LEDGER: Array<{ item: string; status: StatusKind; note: string }> = [
  { item: 'This editorial site', status: 'implemented', note: 'Static pages, prerendered for GitHub Pages.' },
  { item: 'Source and provenance trail', status: 'implemented', note: 'Every external claim links to its origin on the Notes page.' },
  { item: 'The Impossible Index study', status: 'not-built', note: 'In development in Lumpesammlig (012); placeholder here.' },
  { item: 'The Switchboard study', status: 'not-built', note: 'In development in Lumpesammlig (013); placeholder here.' },
  { item: 'Four Words retrieval benchmark', status: 'not-built', note: 'No corpus, queries or results yet.' },
  { item: 'Problem-oriented index', status: 'hypothesis', note: 'Not built; whether it beats plain search is the open question.' },
  { item: 'ATProto publication of this essay', status: 'not-built', note: 'Requires explicit approval; no records exist.' },
  { item: 'Portable discussion across views', status: 'hypothesis', note: 'No live reads, writes or fixtures yet.' },
]

function Convergence() {
  return (
    <>
      <PageIntro index="03" kicker="Convergence" title="An index that remembers its arguments">
        <p>
          Indexing without community gives you confident strangers. Community without indexing
          gives you a good conversation nobody can find. Put them together and each fixes the
          other’s blind spot.
        </p>
      </PageIntro>

      <h2>Each problem is the other’s missing half</h2>
      <p>
        An index needs signals to rank by, and the most useful signals are social: someone
        confirmed the fix, someone found the edge case, someone wrote the test. A community needs
        its contributions to be findable outside its own walls, or it will be rediscovered from
        scratch by the next person, or the next agent, who never knew it existed.
      </p>
      <p>
        So the two halves trade. Community contributions become structured, attributable records
        an index can read. The index, in return, sends people back to the original contributions,
        with the disagreement still attached, instead of replacing them with a summary.
      </p>

      <h2>A portable problem commons</h2>
      <p>
        <Status kind="hypothesis" />
        Call the result a <em>portable problem commons</em>. It has five layers, each allowed to be
        built by someone different:
      </p>
      <ol>
        <li>
          <strong>Authoritative sources</strong>: blogs, repositories, issues and protocol records,
          where attribution and licence stay with the author.
        </li>
        <li>
          <strong>Interoperable records</strong> for problems, solutions, annotations, evidence and
          relations, reusing existing schemas before inventing new ones.
        </li>
        <li>
          <strong>An index</strong> that is built offline, keeps provenance, and is cheap and
          explainable at query time.
        </li>
        <li>
          <strong>Community views</strong>: comments, Q&amp;A, channels, problem maps. Projections
          of the same records, never separate truths.
        </li>
        <li>
          <strong>Optional AI</strong> that proposes relations and cites its sources. It does not
          erase originals or declare anything verified.
        </li>
      </ol>
      <p>
        Nobody has to own all five. That is rather the point.
      </p>

      <h2>This essay as its own first record</h2>
      <p>
        If the idea is any good, it should apply to itself. The essay you are reading describes a
        problem, cites sources, proposes approaches and lists open questions, which is exactly the
        shape of a record in the commons. Written down, it might look like this:
      </p>
      <figure className="wide">
        <pre className="record" aria-label="This essay as an illustrative problem record">
          {JSON.stringify(ARTICLE_RECORD, null, 2)}
        </pre>
        <figcaption className="aside">
          Hand-written and illustrative. It is not published as an ATProto or Standard.site
          record, it has no endorsements or replies, and its evidence list is empty because there
          is no evidence yet.
        </figcaption>
      </figure>
      <p>
        One day it could be published from the author’s own site as a{' '}
        <Src id="standardSite">Standard.site</Src> document, picked up by an index, and discussed
        through whatever interface a reader prefers. The Impossible Index would find it; the
        Switchboard would show who argued with it. That loop is the experiment.
      </p>

      <h2>What is real today</h2>
      <p>
        Keeping hypotheses and implementations apart is part of the argument, so here is the
        ledger.
      </p>
      <ul className="ledger wide">
        {LEDGER.map((row) => (
          <li key={row.item}>
            <Status kind={row.status} />
            <span className="ledger__title">{row.item}</span>
            <span className="ledger__meta">{row.note}</span>
          </li>
        ))}
      </ul>

      <h2>Open questions</h2>
      <ol>
        <li>Can four words find the right answer more often than plain search over the same text?</li>
        <li>Can one conversation be shown in three independent interfaces without losing identity, order, edits or attribution?</li>
        <li>Do endorsements, accepted fixes and tests improve relevance without turning into a popularity contest?</li>
        <li>Can a reader always follow an answer back to its author, revision and implementation?</li>
        <li>Can agents publish opt-in, sanitised findings without leaking private context?</li>
      </ol>
      <p>
        If you know prior work that answers any of these, or that shows the whole idea is wrong,
        that is the most useful contribution there is. The <Link to="/notes/">notes</Link> list
        what we have read so far.
      </p>
    </>
  )
}
