import { Link, createFileRoute } from '@tanstack/react-router'
import { ArtifactSlot } from '../components/ArtifactSlot'
import { PageIntro } from '../components/PageIntro'
import { Src } from '../components/Src'
import { Status } from '../components/Status'
import { pageTitle } from '../content/site'

export const Route = createFileRoute('/indexing')({
  head: () => ({ meta: [{ title: pageTitle('Indexing') }] }),
  component: Indexing,
})

const EXAMPLE_RECORD = `{
  "problem": "Refresh an expired OAuth access token",
  "aliases": ["token refresh", "refresh_token expired"],
  "constraints": ["provider", "SDK version", "security requirements"],
  "solutions": [{ "sourceUri": "https://example.org/source", "status": "unverified" }],
  "evidence": [],
  "provenance": { "indexedFrom": "<source URI>", "retrievedAt": "<timestamp>" }
}`

function Indexing() {
  return (
    <>
      <PageIntro index="01" kicker="Rabbit hole" title="Indexing">
        <p>
          The answer is probably already out there. The hard part is that it was filed under the
          wrong thing.
        </p>
      </PageIntro>

      <h2>Everything is filed by where it lives</h2>
      <p>
        Open any code host and the organising units are familiar: a repository, a directory, a
        file, a commit, an issue thread. Those units are excellent for the people who maintain the
        code. They say who owns what and how it changed. They say very little about the question a
        stranger arrives with, which is almost never “show me this repository” and almost always
        “has someone already dealt with this?”
      </p>
      <p>
        A solved problem rarely respects repository boundaries. The fix might be three lines in a
        commit, explained in a pull request, debated in an issue, and only made safe by a test
        someone added a month later. Code search finds the three lines if you already know what
        they look like. It does not find the problem they solve.
      </p>
      <p className="aside">
        <Src id="githubAtlas">GitHub Atlas</Src>, an earlier project, maps repositories, topics
        and ecosystem health. Postack Underflow starts from the itch it left: what would change if
        the unit on the map were the problem solved rather than the repository it sits in?
      </p>

      <h2>Why agents keep rediscovering it</h2>
      <p>
        An agent asked to fix something does roughly what a careful developer would. It reads the
        code, searches, opens files, follows references, forms a theory and tests it. That is
        expensive, but it works, which is exactly why it repeats. Nothing in the process leaves
        behind a cheaper path for the next agent. Each one walks the archive from the front door.
      </p>
      <p>
        <Status kind="hypothesis" />
        Much of that walking happens because the archive is not organised for the question. If the
        useful structure were computed once, ahead of time, a short query could land close to the
        answer without anyone browsing at all.
      </p>

      <h2>A precomputed, problem-oriented index</h2>
      <p>
        The idea is old-fashioned on purpose. Libraries did not ask readers to walk the stacks;
        they built a catalogue first. Here the catalogue would be built offline from public
        sources (code, issues, pull requests, documentation, articles) and each entry would
        describe a <em>problem</em>:
      </p>
      <ul>
        <li>the problem in plain words, plus the phrasings people actually search with;</li>
        <li>the constraints under which a solution holds: versions, platforms, trade-offs;</li>
        <li>where each candidate solution lives, linked to its exact source and revision;</li>
        <li>what evidence supports it, such as a test, a merged fix or a correction;</li>
        <li>where people disagree, kept visible rather than averaged away.</li>
      </ul>
      <p>
        At query time nothing clever needs to happen. Plain lexical ranking such as BM25 over
        well-structured records, with a few transparent signals, may be enough to beat raw text.
        No model has to roam the web while you wait. The expensive thinking happened once, when
        the entry was written, and every result can show why it ranked where it did.
      </p>
      <figure className="wide">
        <pre className="record" aria-label="Illustrative index record">
          {EXAMPLE_RECORD}
        </pre>
        <figcaption className="aside">
          An illustrative shape, not a real record and not an ATProto Lexicon. The source link is
          a placeholder.
        </figcaption>
      </figure>

      <h2>What could go wrong</h2>
      <p>
        Plenty, which is why this is a hypothesis. Extracting problems from code is itself an act
        of interpretation, and an index can be confidently wrong at scale. Freshness is hard: a
        record that was true for version 2 can quietly mislead someone on version 4. And an index
        with no human judgement behind it is a very tidy pile of unreviewed answers. That last
        point is where this rabbit hole joins <Link to="/community/">the other one</Link>.
      </p>

      <h2>How we would know</h2>
      <p>
        <Status kind="not-built" />
        The planned experiment, nicknamed <em>Four Words</em>, is deliberately small: a corpus of
        20–50 public documents, 15–25 short problem queries labelled with their correct answers{' '}
        <em>before</em> any ranking is run, and a comparison of plain keyword search, BM25, and
        BM25 over extracted problem records. It would report recall, rank of the first correct
        answer, latency, build cost and every failure. No corpus has been assembled and no result
        exists yet.
      </p>

      <ArtifactSlot id="impossibleIndex" />

      <p>
        The Impossible Index is not a search engine and does not query anything live. It is an
        interaction study: a way to feel what it would be like if the catalogue already existed.
        The name is honest. Indexing every solved problem is impossible. Indexing some of them
        well might not be.
      </p>

      <nav className="next" aria-label="Continue reading">
        <p className="kicker">Next</p>
        <p>
          <Link to="/community/">Community: who decides an answer is good?</Link>
        </p>
      </nav>
    </>
  )
}
