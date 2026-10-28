import { Link, createFileRoute } from '@tanstack/react-router'
import { Ref } from '../components/Margin'
import { PageIntro } from '../components/PageIntro'
import { ProblemDesk } from '../components/ProblemDesk'
import { Status } from '../components/Status'
import { pageTitle } from '../content/site'

export const Route = createFileRoute('/convergence')({
  head: () => ({ meta: [{ title: pageTitle('The Problem Desk') }] }),
  component: Convergence,
})

function Convergence() {
  return (
    <>
      <PageIntro index="C" kicker="Convergence" title="Where the two problems meet">
        <p>An index can file a problem under the wrong words. A community can say so.</p>
      </PageIntro>

      <p className="beat">
        Here is the smallest version of both at once. A search puts the right page seventh. A correction arrives. You inspect it,
        accept it if you like, and watch the index change. The source it describes stays exactly as it was.
      </p>

      <ProblemDesk />

      <p className="statement">The guess helped exactly as much as the better-supported change.</p>
      <p className="beat">
        A ranking <Ref id="byConstruction">cannot tell a supported correction from a plausible one.</Ref> A
        better number is not proof that a change is right. Only review can say that.
      </p>
      <p className="beat">
        So the meeting point is not a bigger index or a new platform. <Ref id="review">It is maintenance.</Ref>
      </p>
      <p className="beat">
        <Status kind="hypothesis" />
        Corrections that are their own attributable records, pointing at the exact claim they challenge, kept
        apart from the sources they never touch. Whether that works anywhere beyond this page depends on people
        doing the reviewing.
      </p>
      <p className="beat">
        This essay <Ref id="selfCorrection">needed exactly that kind of review.</Ref>
      </p>
      <p>
        Everything on this desk is local: frozen data, one invented correction, a preview in your tab. No
        community reviewed anything here. What is real today, and what is not, is listed in{' '}
        <Link to="/archive/">the archive</Link>.
      </p>

      <nav className="next" aria-label="Continue reading">
        <p className="kicker">Last</p>
        <p>
          <Link to="/afterword/">Afterword: what making this essay changed</Link>
        </p>
        <p>
          Or go back to <Link to="/indexing/">the Impossible Index</Link> ·{' '}
          <Link to="/community/">the Switchboard</Link>
        </p>
      </nav>
    </>
  )
}
