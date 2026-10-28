import { Link, createFileRoute } from '@tanstack/react-router'
import { PageIntro } from '../components/PageIntro'
import { ProblemDesk } from '../components/ProblemDesk'
import { Status, type StatusKind } from '../components/Status'
import { pageTitle } from '../content/site'

export const Route = createFileRoute('/convergence')({
  head: () => ({ meta: [{ title: pageTitle('The Problem Desk') }] }),
  component: Convergence,
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

function Convergence() {
  return (
    <>
      <PageIntro index="C" kicker="Convergence" title="Where the two problems meet">
        <p>
          The two rabbit holes meet at one small desk: a problem found through an index, challenged by
          somebody else, and corrected in a preview, while every source stays as it was.
        </p>
      </PageIntro>

      <p>
        The Impossible Index showed that an index is made of descriptions somebody wrote, and that a
        description can be findable and wrong. The Switchboard showed that a contribution can respond to
        something without the interface owning either of them. Put those together and you get the
        smallest version of the loop this essay is about: someone finds a record, someone else challenges
        how it was described, and the next search is better for it.
      </p>
      <p>
        The desk uses the case Four Words got most wrong: <code>css missing after deploy</code>, the example
        the essay opened with.
      </p>

      <ProblemDesk />

      <h2>What the desk illustrates</h2>
      <p>
        Not a discovery: it is true by construction that a guessed correction moves the ranking as much as a
        supported one, because the ranking cannot see where a word came from. But building the desk made the
        consequence hard to ignore. A better retrieval number is not evidence that a change is right, so the
        weight of the whole idea moves from the index to the review: who accepts a change, on what evidence,
        and where that decision is recorded.
      </p>
      <p>
        The essay supplies its own example. An early draft of the Disputed Neighbour flagged a symptom as
        missing from its source; an independent review found it there, worded differently. The flag looked
        authoritative and was wrong, and only checking the source caught it.
      </p>
      <p>
        <Status kind="hypothesis" />
        So the convergence is not a master graph or a new platform. It is maintenance: corrections that
        are themselves attributable records, pointing at an exact version of an index’s claim, kept apart
        from the sources they never touch. Whether that works anywhere beyond this page depends on people
        doing the reviewing, which no interface can supply.
      </p>
      <p>
        Maintenance is also where the photo-frame repository from the opening lives. Its strangers’ pull
        requests are corrections and additions; one person reads and merges them. The desk is a tiny model
        of that labour, with the review made visible.
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

      <nav className="next" aria-label="Continue reading">
        <p className="kicker">Last</p>
        <p>
          <Link to="/afterword/">Afterword: how this essay was made, and what it got wrong</Link>
        </p>
        <p>
          Or go back to <Link to="/indexing/">the Impossible Index</Link> ·{' '}
          <Link to="/community/">the Switchboard</Link>
        </p>
      </nav>
    </>
  )
}
