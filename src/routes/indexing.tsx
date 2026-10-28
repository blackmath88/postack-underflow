import { Link, createFileRoute } from '@tanstack/react-router'
import { DisputedNeighbour } from '../components/DisputedNeighbour'
import { FourWords } from '../components/FourWords'
import { PageIntro } from '../components/PageIntro'
import { Src } from '../components/Src'
import { Status } from '../components/Status'
import { StudyNote } from '../components/StudyNote'
import { pageTitle } from '../content/site'
import { repoFile } from '../content/sources'
import { STRUCTURED_WEIGHTS } from '../lib/records'
import results from '../../results/four-words-v1.json'
import queryFile from '../../corpus/queries.json'

export const Route = createFileRoute('/indexing')({
  head: () => ({ meta: [{ title: pageTitle('Indexing') }] }),
  component: Indexing,
})

const SYSTEM_LABEL: Record<string, string> = {
  baseline: 'Plain keyword search (BM25, raw source text)',
  structured: 'Problem-oriented index (BM25F, records)',
  'structured-without-aliases-symptoms': 'Ablation: records without aliases and symptoms',
}

const pct = (x: number) => `${(x * 100).toFixed(1)}%`
const queryText = new Map(queryFile.queries.map((q) => [q.id, q.query]))
const rankOf = (system: string, id: string) =>
  results.perQuery.find((p) => p.system === system && p.query === id)?.firstRelevantRank ?? null
const fmtRank = (r: number | null) => (r === null ? 'not found' : String(r))
const successAt1 = (system: string) =>
  results.perQuery.filter((p) => p.system === system && p.firstRelevantRank === 1).length

/**
 * Post-hoc analysis (2026-10-28, after run v1): queries the structured index
 * won where its first relevant record matched a query word absent from that
 * source's snapshot text. Computed with the shared tokenizer against
 * corpus/.cache; see docs/research/FOUR-WORDS.md.
 */
const INJECTED = [
  { query: 'blank page github pages', word: 'blank' },
  { query: 'underscore folder not served', word: 'underscore' },
  { query: 'refresh gives 404', word: 'refresh' },
  { query: 'custom not found page', word: 'found' },
  { query: 'artifact too large', word: 'large' },
  { query: 'site shows 404 everywhere', word: 'shows' },
  { query: 'trailing slash index html', word: 'trailing slash' },
]

function Indexing() {
  const diffs = queryFile.queries
    .map((q) => ({ id: q.id, query: q.query, b: rankOf('baseline', q.id), s: rankOf('structured', q.id) }))
    .filter((d) => d.b !== d.s)

  return (
    <>
      <PageIntro index="A" kicker="Rabbit hole · indexing" title="The Impossible Index">
        <p>
          The answer exists. Why can’t we find it? Usually because it was described in words other than
          the ones you are searching with, and somebody else decided which words those would be.
        </p>
      </PageIntro>

      <h2>Everything is filed by where it lives</h2>
      <p>
        Open any code host and the organising units are familiar: a repository, a directory, a file,
        a commit, an issue. Those units serve the people who maintain the code. They say little about
        the question a stranger arrives with, which is almost never “show me this repository” and
        almost always “has someone already dealt with this?”
      </p>
      <p>
        Take the problem this site’s own deployment had to avoid: a static site published under a
        GitHub Pages subpath. The knowledge needed is scattered across a build tool’s option
        reference, a hosting provider’s note about folders that start with an underscore, a router’s
        API docs, and a years-old issue where someone confirmed what fixed it. None of those
        documents is <em>about</em> “my CSS is missing after deploy”. Each one solves a piece of it.
      </p>
      <p className="aside">
        <Src id="githubAtlas">GitHub Atlas</Src>, an earlier project, maps repositories, topics and
        ecosystem health. Postack Underflow starts from the itch it left: what changes if the unit on
        the map is the problem solved rather than the repository it sits in?
      </p>

      <h2>Indexing as work done before the question</h2>
      <p>
        An agent asked to fix that deployment does roughly what a careful developer would: reads,
        searches, opens files, forms a theory and tests it. That works, which is exactly why it
        repeats. Nothing in the process leaves a cheaper path for the next attempt.
      </p>
      <p>
        <Status kind="hypothesis" />
        The alternative is old-fashioned on purpose. A library catalogue is labour done before
        anyone asks. Here the catalogue is a set of <em>problem records</em>, written offline from
        pinned public sources. Each names the problem in plain words, the phrasings and symptoms
        people report, the constraints under which a fix holds, the fix itself, the evidence for it,
        its known limits, and related or competing approaches. At query time nothing clever happens:
        a transparent ranking over those fields, in your browser, with every match explained.
      </p>

      <h2>What an index adds</h2>
      <p>
        An index never just stores its sources. It adds things: a plain statement of the problem, the
        other ways people phrase it, the symptoms they report, the headings it is filed under. Those
        additions are what make a four-word query land. They are also interpretations, written by
        somebody, that the source never said.
      </p>
      <p>
        This is not a new idea. Information retrieval has long expanded documents with the vocabulary
        people are likely to search for; one well-known version, <Src id="doc2query">doc2query</Src>,
        predicts queries for each document and indexes them alongside it. Four Words does the same thing
        by hand, or rather by an AI agent writing records. Each result below explains which of those
        added fields a match came from, and links the source it was written from. Further down, the
        Disputed Neighbour puts a source and its additions side by side.
      </p>

      <FourWords />

      <StudyNote id="impossibleIndex" />

      <h2 id="results">Does the prior work help? What we measured</h2>
      <p>
        The same 30 sources were indexed twice: once as their raw text, the way plain keyword search
        sees them, and once as one structured record per source. Both use the same tokenizer and the
        same BM25 family of ranking, so differences come from <em>what</em> was indexed, not from a
        cleverer algorithm.
      </p>
      <div className="table-wrap wide">
        <table className="metrics">
          <caption className="kicker table-caption">
            {results.queries} queries · run “{results.run}” · {results.date} · index{' '}
            {results.indexDigest.slice(0, 10)}
          </caption>
          <thead>
            <tr>
              <th scope="col">System</th>
              <th scope="col">Rank 1 correct</th>
              <th scope="col">Recall@5</th>
              <th scope="col">MRR@10</th>
              <th scope="col">Mean query time</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(results.summary).map(([name, m]) => (
              <tr key={name}>
                <th scope="row">{SYSTEM_LABEL[name] ?? name}</th>
                <td>
                  {successAt1(name)} / {results.queries}
                </td>
                <td>{pct(m.recallAt5)}</td>
                <td>{m.mrrAt10.toFixed(3)}</td>
                <td>{m.meanQueryMs.toFixed(3)} ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="aside">
        Paired by query, the structured index ranked the first relevant source higher on{' '}
        {results.paired.structuredBetter}, lower on {results.paired.baselineBetter} and the same on{' '}
        {results.paired.tied} of {results.queries} queries. Query times were measured in Node on one
        machine ({results.environment}) and say nothing about scale. “Rank 1 correct” counts queries whose
        top result is labelled relevant; Recall@5 is the average share of each query’s relevant sources in
        the top five.
      </p>

      <h3>Where the two disagreed</h3>
      <div className="table-wrap wide">
        <table className="metrics">
          <caption className="kicker table-caption">
            Rank of the first relevant source; queries where both systems agree are omitted
          </caption>
          <thead>
            <tr>
              <th scope="col">Query</th>
              <th scope="col">Plain keyword search</th>
              <th scope="col">Problem-oriented index</th>
            </tr>
          </thead>
          <tbody>
            {diffs.map((d) => (
              <tr key={d.id}>
                <th scope="row">
                  <code>{d.query}</code>
                </th>
                <td>{fmtRank(d.b)}</td>
                <td>{fmtRank(d.s)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>How to read this</h3>
      <ResultsReading />

      <h3>Method, briefly</h3>
      <ul>
        <li>
          <strong>Corpus</strong>: {results.sources} public documents on one problem area: build-tool
          and framework docs, hosting docs, README files and four GitHub issues. Files are pinned to
          a commit; issues to their last-updated time. Licences are recorded per source.
        </li>
        <li>
          <strong>Queries</strong>: {results.queries} queries of at most four words, with binary
          relevance labels, written and committed <em>before</em> any record existed and before
          ranking ran. The same project wrote both queries and labels, which is the experiment’s
          biggest weakness.
        </li>
        <li>
          <strong>Records</strong>: one per source, written by an AI agent that was instructed not
          to read the queries, and not yet reviewed by a person. Field weights were fixed in advance:{' '}
          {Object.entries(STRUCTURED_WEIGHTS)
            .map(([f, w]) => `${f} ${w}`)
            .join(', ')}
          .
        </li>
        <li>
          <strong>Ranking</strong>: BM25 (k1 1.2, b 0.75) for raw text, the simple BM25F variant for
          records, plural folding only. Run once; nothing was tuned afterwards.
        </li>
      </ul>
      <p>
        Everything is reproducible from the repository: <code>npm run corpus:fetch</code>,{' '}
        <code>npm run index</code>, <code>npm run evaluate</code>. Corpus, queries, records and
        results: <a href={repoFile('corpus/')}>corpus/</a>,{' '}
        <a href={repoFile('results/four-words-v1.json')}>results/four-words-v1.json</a>, and the
        write-up in <a href={repoFile('docs/research/FOUR-WORDS.md')}>FOUR-WORDS.md</a>.
      </p>

      <h2>Classification is a claim</h2>
      <p>
        The library card catalogue made this visible. Somebody had already decided where each book
        belonged, which headings led to it, and which neighbouring headings to point to. That labour
        happened before your question, and it shaped which books you could find. The research
        collected for this project describes catalogues distinguishing provisional placements from
        accepted ones, and headings that were contested for years.
      </p>
      <p className="aside">
        Those historical details come from research compiled for this project and are reported, not
        independently verified here (<Src id="pr5">PR #5</Src>). The behaviour worth keeping does not
        depend on them: classification is prior work, it creates neighbourhoods, and it can be wrong.
      </p>
      <p>
        Four Words’ v1 audit found the digital version of a contested heading. Part of the index’s
        advantage came from vocabulary its writer supplied, and some of that vocabulary has no basis in
        the source. A description can be very findable and slightly false. The experiment below takes one
        such neighbourhood apart.
      </p>

      <DisputedNeighbour />

      <h2>What this does not show</h2>
      <p>
        Thirty documents on one narrow topic, and {results.queries} queries written by the same
        project, cannot show that problem-oriented indexing works in general. Extracting problems is
        itself interpretation, and an index can be confidently wrong at scale. A record says nothing
        about whether its fix still works, because no one has confirmed or corrected it. That last
        gap is where this rabbit hole joins <Link to="/community/">the other one</Link>.
      </p>

      <nav className="next" aria-label="Continue reading">
        <p className="kicker">Next</p>
        <p>
          <Link to="/community/">The Switchboard: who keeps it alive?</Link>
        </p>
        <p>
          Or skip to <Link to="/convergence/">the Problem Desk</Link>, where a correction meets this index.
        </p>
      </nav>
    </>
  )
}

function ResultsReading() {
  const s = results.summary
  const css = { b: rankOf('baseline', 'q01'), s: rankOf('structured', 'q01') }
  return (
    <>
      <p>
        <Status kind="observation" />
        In this one run the structured index did better: a relevant source at rank 1 for{' '}
        {successAt1('structured')} of {results.queries} queries, against {successAt1('baseline')} for
        plain keyword search, and MRR {s.structured.mrrAt10.toFixed(2)} against{' '}
        {s.baseline.mrrAt10.toFixed(2)}. Why it did better matters more than the margin.
      </p>
      <p>
        <strong>Much of the gain is vocabulary the record writer added.</strong> In {INJECTED.length} of
        the {results.paired.structuredBetter} queries where the structured index won, its first relevant
        record matched on at least one query word that never appears in that source’s text:{' '}
        {INJECTED.map((x, i) => (
          <span key={x.query}>
            {i > 0 && ', '}
            <code>{x.word}</code> for <code>{x.query}</code>
          </span>
        ))}
        . That is what editorial work is supposed to add, the words people use rather than the words
        documentation uses. It is also a risk: one record describes a “blank page” symptom its source
        never mentions. One win, <code>trailing slash index html</code>, is partly a tokenizer artefact:
        the source writes <code>trailingSlash</code>, which this tokenizer keeps as one word.
      </p>
      <p>
        The ablation points the same way. Without the aliases and symptoms fields the structured index
        still beat raw text (MRR {s['structured-without-aliases-symptoms'].mrrAt10.toFixed(2)}), so a short,
        plain statement of problem and fix does real work, but the reader-facing vocabulary adds more.
      </p>
      <p>
        <strong>The one loss was a labelling mistake as much as a ranking one.</strong> For the essay’s
        own example, <code>css missing after deploy</code>, plain search put a labelled source at rank{' '}
        {fmtRank(css.b)} and the structured index only at rank {fmtRank(css.s)}. But the structured
        index’s second and fourth results (Angular’s router reference and TanStack Router’s deploy guide)
        both describe missing CSS after deployment, and neither was labelled relevant. A post-hoc audit
        that adds them would put the structured index’s first relevant result at rank 2. The labels were
        frozen before the run and are not changed here; the miss says as much about the labels as about
        the index.
      </p>
      <p className="aside">
        <strong>Read these numbers with the caveats beside them.</strong> One run, 30 documents on one
        narrow topic, all but one of them labelled relevant to something. The same project wrote the
        queries and the labels, and the labeller had read summaries of every source. The baseline indexes
        whole documents, not passages, which handicaps long pages. One AI agent wrote every record, and
        no person has reviewed them. A fair test needs queries from people who have never seen the
        index, a passage-level baseline, and reviewed records.
      </p>
    </>
  )
}
