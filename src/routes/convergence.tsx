import { Link, createFileRoute } from '@tanstack/react-router'
import { PageIntro } from '../components/PageIntro'
import { Status, type StatusKind } from '../components/Status'
import { pageTitle } from '../content/site'
import { SOURCES, repoFile } from '../content/sources'
import { CONTRIBUTIONS } from '../data/community-fixtures'
import record from '../../knowledge/we-already-solved-this.json'
import recordUrl from '../../knowledge/we-already-solved-this.json?url'
import results from '../../results/four-words-v1.json'

export const Route = createFileRoute('/convergence')({
  head: () => ({ meta: [{ title: pageTitle('Convergence') }] }),
  component: Convergence,
})

const HYPOTHESIS_STATUS: Record<string, StatusKind> = {
  tested: 'tested',
  'demonstrated-on-fixtures': 'demonstrated',
  'partially-demonstrated': 'demonstrated',
  untested: 'not-built',
}

const pct = (x: number) => `${(x * 100).toFixed(0)}%`
const s = results.summary

const LEDGER: Array<{ item: string; status: StatusKind; note: string }> = [
  { item: 'Editorial site', status: 'implemented', note: 'Static pages, prerendered for GitHub Pages, with a post-deploy check of what Pages actually serves.' },
  { item: 'Four Words index and evaluation', status: 'implemented', note: `${results.sources} pinned public sources, ${results.queries} labelled queries, measured once and reported as-is.` },
  { item: 'This essay as a structured record', status: 'implemented', note: 'A JSON file in the repository, validated by tests; downloadable below.' },
  { item: 'Community demonstration', status: 'implemented', note: 'Fixture contributions and relations; invented authors under reserved names.' },
  { item: 'Publishing the record over ATProto', status: 'not-built', note: 'Needs explicit approval. No record exists on any network.' },
  { item: 'Reading real replies from other repositories', status: 'not-built', note: 'No network reads; no app view; no backlink index.' },
  { item: 'Schemas for endorsement, correction, dispute', status: 'not-built', note: 'No existing Lexicon found; placeholders only.' },
  { item: 'Community signals feeding the index', status: 'hypothesis', note: 'H3: untested.' },
]

function Convergence() {
  const sourceTitle = (id: string) => (SOURCES as Record<string, { title: string; url: string }>)[id]
  return (
    <>
      <PageIntro index="03" kicker="Convergence" title="An index that remembers its arguments">
        <p>
          Indexing without community gives you confident strangers. Community without indexing gives
          you a good conversation nobody can find. Each is the other’s missing half.
        </p>
      </PageIntro>

      <h2>What each half needs from the other</h2>
      <p>
        Four Words ranks records by how well their words fit a query. That is all it can do. It
        cannot tell a fix that works from a fix that once worked, because nothing in the record says
        who checked it. The signals that would (a confirmation, a correction, a dispute) are exactly
        what the community layer produces.
      </p>
      <p>
        The community demonstration, in turn, assembles a conversation around one record. Its
        contributions only matter if someone with the same problem can find the record in the first
        place. Without an index, the next person never arrives at the thread.
      </p>
      <p>
        The trade is concrete. Records give the community something stable to point at: a specific
        problem and a specific claim, at a specific version. Contributions give the index something
        it cannot compute by itself: evidence about whether the claim holds up.
      </p>

      <h2>A portable problem commons</h2>
      <p>
        <Status kind="hypothesis" />
        Put together, the two layers suggest five pieces, each of which someone different could
        build:
      </p>
      <ol>
        <li>
          <strong>Sources</strong> where the knowledge originates: documentation, issues, blogs,
          protocol records. Attribution and licence stay there.
        </li>
        <li>
          <strong>Records</strong> describing problems, solutions, evidence and relations, reusing
          existing schemas wherever they exist.
        </li>
        <li>
          <strong>Indexes</strong> built offline from those records, cheap and explainable at query
          time.
        </li>
        <li>
          <strong>Community views</strong> that assemble contributions into threads, forums or maps,
          without owning them.
        </li>
        <li>
          <strong>Optional models</strong> that propose relations and cite sources, and whose
          proposals stay marked until a person accepts them.
        </li>
      </ol>

      <h2>This essay, as its own first record</h2>
      <p>
        If the idea holds, it should apply to itself. This essay is written down in the repository as
        a structured record: the problem it describes, its hypotheses with their current status, the
        sources it relies on, the evidence for each claim, and what is still open. The page below is
        rendered from that file. Nothing here is decorative sample data.
      </p>

      <article className="krecord wide" aria-labelledby="krecord-title">
        <header>
          <div>
            <p className="kicker">
              {record.type} · v{record.revision.version} · {record.revision.date}
            </p>
            <h3 id="krecord-title" style={{ margin: 0 }}>
              {record.title}
            </h3>
          </div>
          <p>
            <a href={recordUrl} download="we-already-solved-this.json">
              Download JSON
            </a>{' '}
            · <a href={repoFile('knowledge/we-already-solved-this.json')}>Source on GitHub</a>
          </p>
        </header>
        <div className="krecord__body">
          <dl>
            <dt>Problem</dt>
            <dd>{record.problem}</dd>
            <dt>Sub-problems</dt>
            <dd>
              <ul>
                {record.subproblems.map((p) => (
                  <li key={p.id}>
                    <strong>{p.id}</strong>: {p.statement}
                  </li>
                ))}
              </ul>
            </dd>
            <dt>Hypotheses</dt>
            <dd>
              <ul>
                {record.hypotheses.map((h) => (
                  <li key={h.id}>
                    <Status kind={HYPOTHESIS_STATUS[h.status] ?? 'hypothesis'} />
                    <strong>{h.id}</strong> ({h.status.replace(/-/g, ' ')}): {h.statement}
                    {h.id === 'H1' && (
                      <span className="krecord__result">
                        {' '}
                        Result: structured index Recall@5 {pct(s.structured.recallAt5)} and MRR@10{' '}
                        {s.structured.mrrAt10.toFixed(2)}, against plain keyword search{' '}
                        {pct(s.baseline.recallAt5)} and {s.baseline.mrrAt10.toFixed(2)}, on{' '}
                        {results.queries} queries. <Link to="/indexing/" hash="results">Details and caveats</Link>.
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </dd>
            <dt>Approaches</dt>
            <dd>
              <ul>
                {record.approaches.map((a) => (
                  <li key={a.id}>
                    <strong>{a.name}</strong>: {a.summary} <code>{a.implementation}</code>
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
            <dd>
              <ul>
                {record.sources.map((id) => {
                  const src = sourceTitle(id)
                  return <li key={id}>{src ? src.title : id}</li>
                })}
              </ul>
            </dd>
            <dt>Open questions</dt>
            <dd>
              <ul>
                {record.openQuestions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </dd>
            <dt>Provenance</dt>
            <dd>
              {record.provenance.author}. {record.provenance.assistance}
            </dd>
            <dt>Publication</dt>
            <dd>
              <Status kind="not-built" />
              {record.publication.status.replace('-', ' ')}. Planned carrier: {record.publication.plannedCarrier}.
            </dd>
          </dl>
        </div>
      </article>

      <h2>How a discussion attaches without moving in</h2>
      <p>
        Published, the record would live on the author’s site and in the author’s repository as a{' '}
        <code>site.standard.document</code>, an existing record type, carrying the structured record
        as its payload. Nothing reads that payload today; that part is ours to propose.
      </p>
      <p>
        A reply would live in its author’s repository and point at the essay by address and content
        hash, optionally naming the hypothesis it is about. The community demonstration does exactly
        that with its {CONTRIBUTIONS.length} fixture contributions: Mara’s correction targets H4,
        Jun’s dispute targets H2, Ines’s doubt targets H1. An index could follow those references
        back and show, next to H1, that someone questioned how its queries were written. That is
        the loop: <em>record → index → discussion → evidence → revised record</em>.
      </p>
      <p>
        <Status kind="not-built" />
        None of that loop runs over a network yet. The record is a file; the discussion is fixtures;
        the index does not read contributions. Each step is small, and each is separately testable.
      </p>

      <h2>What is real today</h2>
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
      <p>
        If you know prior work that answers one of the record’s open questions, or that shows the
        whole idea is wrong, that is the most useful contribution there is. The{' '}
        <Link to="/notes/">notes</Link> list what has been read so far, and the{' '}
        <a href={repoFile('CONTRIBUTING.md')}>contribution guide</a> explains how to send it.
      </p>

      <nav className="next" aria-label="Return to a rabbit hole">
        <p className="kicker">Back to</p>
        <p>
          <Link to="/indexing/">Indexing</Link> · <Link to="/community/">Community</Link> ·{' '}
          <Link to="/">The beginning</Link>
        </p>
      </nav>
    </>
  )
}
