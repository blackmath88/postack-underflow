import { Link, createFileRoute } from '@tanstack/react-router'
import { DisputedNeighbour } from '../components/DisputedNeighbour'
import { FourWords } from '../components/FourWords'
import { Ref } from '../components/Margin'
import { PageIntro } from '../components/PageIntro'
import { StudyNote } from '../components/StudyNote'
import { pageTitle } from '../content/site'
import results from '../../results/four-words-v1.json'

export const Route = createFileRoute('/indexing')({
  head: () => ({ meta: [{ title: pageTitle('Indexing') }] }),
  component: Indexing,
})

const atOne = (system: string) =>
  results.perQuery.filter((p) => p.system === system && p.firstRelevantRank === 1).length

function Indexing() {
  return (
    <>
      <PageIntro index="A" kicker="Rabbit hole · indexing" title="The Impossible Index">
        <p>The answer exists. Why can’t we find it?</p>
      </PageIntro>

      <p className="statement">Same words. Different problems.</p>
      <p className="beat">
        Two people hit what looks like the same bug. A site works on their own machine. Published on GitHub
        Pages, a free host for websites built from code, one of its script files will not load.
      </p>
      <p className="beat">
        One fix is a setting that puts the repository’s name in front of every path. The other is renaming a file,
        or adding an empty <code>.nojekyll</code> file, so that GitHub Pages stops skipping names that start with
        an underscore. Neither fix repairs the other case.
      </p>
      <p className="beat">
        <Ref id="frozenIndex">Our small index gave both the same label.</Ref> Suppose an editor then files them
        under one heading. Look at what each report says, and <Ref id="rawVsAuthored">what the index added.</Ref>
      </p>

      <DisputedNeighbour />

      <p className="beat">
        The resemblance was partly written in.{' '}
        One report never says “404”; <Ref id="controlledVocab">the label the index gave it does.</Ref>
      </p>

      <h2>An index is somebody’s reading</h2>
      <p className="beat">
        <Ref id="whatIndexAdds">An index never just stores its sources.</Ref> It adds a description of each
        one, in the words people search with. That is how four words can find a page that never uses them.
      </p>
      <p className="beat">
        Try it. <Ref id="ranking">The search runs in your browser.</Ref>
      </p>

      <FourWords />

      <h2>Did the descriptions help?</h2>
      <p className="beat">
        In one small test, yes: a right answer came first for {atOne('structured')} of {results.queries} short
        queries, <Ref id="result">against {atOne('baseline')} for plain search.</Ref>
      </p>
      <p className="beat">
        Then we looked at why.{' '}
        Much of the advantage came from words the description writer added, and{' '}
        <Ref id="injected">some of them the sources never said.</Ref>
      </p>
      <p className="statement statement--quiet">A description can be very findable and slightly false.</p>
      <p>
        This was one run, on {results.sources} documents about one narrow problem, with questions we wrote
        ourselves. It shows a mechanism, not that this works in general. Results, method and every caveat are in{' '}
        <Link to="/archive/four-words/">the archive</Link>.
      </p>

      <h2>Who decides?</h2>
      <p className="beat">
        <Ref id="cardCatalogue">Classification is a claim.</Ref> Somebody decides which problems are neighbours,
        and that decision shapes what you can find.
      </p>
      <p className="beat">
        <Ref id="githubAtlas">Code hosts file knowledge by where it lives.</Ref> Strangers arrive with problems.
        Somebody has to describe them, and somebody else should be able to say the description is wrong.
      </p>
      <p className="beat">That second somebody is the other rabbit hole.</p>

      <StudyNote id="impossibleIndex" />

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
