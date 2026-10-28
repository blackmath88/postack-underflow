import { Link, createFileRoute } from '@tanstack/react-router'
import { Ref } from '../components/Margin'
import { PageIntro } from '../components/PageIntro'
import { StudyNote } from '../components/StudyNote'
import { Switchboard } from '../components/Switchboard'
import { pageTitle } from '../content/site'

export const Route = createFileRoute('/community')({
  head: () => ({ meta: [{ title: pageTitle('Community') }] }),
  component: Community,
})

// An illustration of a familiar pattern, not a quoted thread.
const THREAD = [
  { who: 'Someone', what: 'posts a fix.', tag: 'answer' },
  { who: 'Another person', what: 'tries it, and it works.', tag: '+1' },
  { who: 'A third', what: 'tries it on a newer version. It fails, and they say so underneath.', tag: 'comment' },
  { who: 'Someone', what: 'edits the answer to cover both versions.', tag: 'edit' },
]

function Community() {
  return (
    <>
      <PageIntro index="B" kicker="Rabbit hole · community" title="The Switchboard">
        <p>The knowledge exists. Who keeps it alive?</p>
      </PageIntro>

      <p className="beat">
        <Ref id="illustration">Here is how an answer used to get better.</Ref>
      </p>
      <ol className="thread" aria-label="An answer improved by other people">
        {THREAD.map((t, i) => (
          <li key={i}>
            <span className="thread__who">{t.who}</span>
            <p className="thread__what">
              {t.what}
              <span className="thread__tag">{t.tag}</span>
            </p>
          </li>
        ))}
      </ol>
      <p className="beat">Now the answer is worth more than anything its author wrote.</p>
      <p className="statement">
        That is what community adds: not answers, but <Ref id="soMechanisms">judgement about them.</Ref>
      </p>

      <p className="beat">
        The photo-frame repository does the same work, <Ref id="frameMaintainer">by hand.</Ref> Strangers send
        notes; one person reads each one and decides whether to publish it. If they stop, the notes stay
        readable, but nobody checks the next one.
      </p>
      <p className="beat">
        Today much of that judgement happens <Ref id="whereJudgement">in private, one session at a time.</Ref> And
        moving everyone back onto one big site <Ref id="onePlatform">is not obviously the answer.</Ref>
      </p>

      <h2>A conversation without a home</h2>
      <p className="beat">
        What if a conversation could be assembled from pieces{' '}
        <Ref id="twoLayers">that each belong to their author?</Ref>
      </p>
      <p className="beat">
        A telephone switchboard <Ref id="switchboardHistory">did something like it with calls.</Ref> Every
        caller owned their own line. The operator joined lines for a while, then pulled the cord.
      </p>
      <p className="beat">
        Below, eight contributions sit on two rails. <Ref id="fixtures">All of them are invented.</Ref> Every line
        between them is a claim with a contract: who proposed it, why, and where it stands. Pick a line, or draw
        your own.
      </p>

      <Switchboard />

      <p className="beat">
        Look at the dotted line first: <Ref id="connectionNotEndorsement">a model’s guess.</Ref> It sits beside
        the authors’ own references, but it never becomes their statement.
      </p>
      <p className="statement statement--quiet">
        Then let the operator leave. The lines go. The words stay.
      </p>
      <p className="beat">
        The records that remain still say what they reply to. Two of them show{' '}
        <Ref id="portabilityLimits">what owning your words cannot fix.</Ref>
      </p>

      <h2>Does this exist?</h2>
      <p className="beat">
        <Ref id="atproto">Partly.</Ref> Open protocols already let people own and publish their own records.
        What we could not find is any shared way to endorse, correct or dispute one. This page is a
        demonstration on fixtures; nothing here touches a real network.
      </p>
      <p>
        The protocol inventory, the two-layer model in full and its limits are in{' '}
        <Link to="/archive/community/">the archive</Link>.
      </p>

      <StudyNote id="switchboard" />

      <nav className="next" aria-label="Continue reading">
        <p className="kicker">Next</p>
        <p>
          <Link to="/convergence/">The Problem Desk: where a correction meets the index</Link>
        </p>
        <p>
          Or go back to <Link to="/indexing/">the Impossible Index</Link> and try Four Words.
        </p>
      </nav>
    </>
  )
}
