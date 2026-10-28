import { Link, createFileRoute } from '@tanstack/react-router'
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

function Indexing() {
  const diffs = queryFile.queries
    .map((q) => ({ id: q.id, query: q.query, b: rankOf('baseline', q.id), s: rankOf('structured', q.id) }))
    .filter((d) => d.b !== d.s)

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
        Open any code host and the organising units are familiar: a repository, a directory, a file,
        a commit, an issue. Those units serve the people who maintain the code. They say little about
        the question a stranger arrives with, which is almost never “show me this repository” and
        almost always “has someone already dealt with this?”
      </p>
      <p>
        Take the problem this site’s own deployment had to avoid: a static site published under a
        GitHub Pages subpath. The knowledge needed is scattered across a build tool’s option
        reference, a hosting provider’s note about folders that start with an underscore, a router’s
        API docs, and a three-year-old issue where someone confirmed what fixed it. None of those
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
              <th scope="col">Recall@1</th>
              <th scope="col">Recall@5</th>
              <th scope="col">MRR@10</th>
              <th scope="col">Mean query time</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(results.summary).map(([name, m]) => (
              <tr key={name}>
                <th scope="row">{SYSTEM_LABEL[name] ?? name}</th>
                <td>{pct(m.recallAt1)}</td>
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
        machine ({results.environment}) and say nothing about scale.
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
          <Link to="/community/">Community: who decides an answer is good?</Link>
        </p>
        <p>
          Or skip to <Link to="/convergence/">the convergence</Link>.
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
        On this corpus, the prior work helped. On average the problem-oriented index placed{' '}
        {pct(s.structured.recallAt5)} of each query’s relevant sources in its top five, against{' '}
        {pct(s.baseline.recallAt5)} for plain keyword search, and its first relevant result sat
        higher on average (MRR {s.structured.mrrAt10.toFixed(2)} against {s.baseline.mrrAt10.toFixed(2)}).
        The gains are concentrated in queries phrased as symptoms, such as <code>blank page github pages</code>{' '}
        or <code>trailing slash index html</code>, where raw documents bury the relevant passage in a
        long page about something broader.
      </p>
      <p>
        The ablation says part of that comes from the fields describing how people report a problem.
        Without aliases and symptoms the structured index still beat raw text (MRR{' '}
        {s['structured-without-aliases-symptoms'].mrrAt10.toFixed(2)}), so the plain statement of
        the problem and its fix already does much of the work.
      </p>
      <p>
        <strong>It failed on the essay’s own example.</strong> For <code>css missing after deploy</code>,
        plain search put a relevant source at rank {fmtRank(css.b)}; the structured index only at rank{' '}
        {fmtRank(css.s)}. The records for the base-path fix describe the symptom as a blocked JavaScript
        module and missing assets, never as missing CSS. The generic words left over, <em>missing</em>,{' '}
        <em>after</em> and <em>deploy</em>, then matched heavily weighted fields of unrelated records.
        A structured index is only as good as the vocabulary its writers anticipated, and a
        confident ranking hides that gap unless the explanation is shown.
      </p>
      <p>
        Treat all of this as one run on a small, friendly corpus. Queries and records were written
        independently but by the same project, and one AI agent wrote every record. A fair test
        needs queries collected from people who never saw the index, a corpus nobody chose to suit
        the method, and records checked by someone other than their writer.
      </p>
    </>
  )
}
