import { Link, createFileRoute } from '@tanstack/react-router'
import { RabbitHoles } from '../components/RabbitHoles'
import { Src } from '../components/Src'
import { Status } from '../components/Status'
import { pageTitle } from '../content/site'

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: pageTitle() }] }),
  component: Home,
})

function Home() {
  return (
    <>
      <div className="opening">
        <p className="kicker">An open research essay · draft</p>
        <h1>We already solved this.</h1>
        <p className="question">So why are we solving it again?</p>
      </div>

      <hr />

      <h2>Four words and someone else’s afternoon</h2>
      <p>
        For a long stretch of software history, being stuck went something like this. You typed
        four or five words into a search box, half a phrase and half an error message, and landed
        on a question someone had asked years earlier. Underneath it sat an accepted answer, a few
        competing ones, a comment pointing out that the accepted answer broke in version 3, and an
        edit fixing it. Somebody had spent an afternoon on your problem so that you could spend
        five minutes.
      </p>
      <p>
        That shortcut was never a single product. It was a habit spread across a lot of people:
        ask in public, answer in public, vote, correct, link. Search engines made the result
        findable, and a Q&amp;A site made it legible. None of it was guaranteed to be right, but
        all of it was out in the open.
      </p>

      <h2>The observation</h2>
      <p>
        <Status kind="paraphrase" />
        In <Src id="syntax1050">Syntax episode #1050</Src>, CJ worries about what happens to that
        shortcut now that developers increasingly ask agents instead of each other. An agent can
        read the code, reason about it and arrive at a working fix. Then the next person’s agent
        does the same work again, privately, and the solution never lands anywhere others can find
        it. The main party that learns from the repetition, CJ suggests, is whoever trains the
        models. The question CJ leaves on the table is whether there is a better way to share.
      </p>
      <p>
        The hosts do not simply agree. Scott points to projects where reusable building blocks are
        shared in a community space so they need not be reinvented each time. Wes notes that some
        sharing is already happening: Stack Overflow has added agent access, and agents now open
        issues and pull requests on public repositories. He also floats the idea of agents
        publishing write-ups of what they fixed. When a listener objects that solutions are on
        GitHub anyway, CJ clarifies that much problem solving happens in private codebases, where
        anonymised public questions used to be the bridge.
      </p>
      <p className="aside">
        This is our paraphrase of a spoken conversation, not a quotation. The discussion runs from
        roughly 55 minutes into the episode. Read <Src id="syntax1050">the transcript</Src> for
        the exact wording. Postack Underflow is not affiliated with or endorsed by the show.
      </p>

      <h2>Retrieving is not the same as reconstructing</h2>
      <p>
        An agent that reconstructs a solution and a reader who retrieves one may end up with the
        same code. What they do not end up with is the same knowledge. A retrieved answer arrives
        with context: who wrote it, when, under which versions, who disagreed, and what was
        corrected later. A reconstructed answer arrives clean, confident and alone.
      </p>
      <p className="pull">
        Reconstruction is a cost paid again on every attempt. Retrieval is a cost paid once and
        shared.
      </p>
      <p>
        This does not mean agents are the problem. They are very good at the reconstructing, and
        the reconstructing is sometimes the right thing to do. The question is about
        infrastructure: where solutions go once they exist, and whether anyone, human or agent,
        can find them again without doing the work twice.
      </p>

      <h2>Two problems that keep each other up at night</h2>
      <p>
        Pull on that question and it splits in two.
      </p>
      <p>
        <strong>The first problem is indexing.</strong> Public code already contains an enormous
        number of solved problems, but we organise it by repository, file and commit, not by
        problem solved. To find a fix you often have to know where it lives before you know that it
        exists.
      </p>
      <p>
        <strong>The second problem is community.</strong> The judgement that made old answers
        trustworthy (votes, accepted answers, corrections, reputation, moderation) belonged to a
        community, and that community lived on one platform. Problem solving is now moving into
        private chats and one-off agent sessions where none of those signals form at all.
      </p>
      <p>
        <Status kind="hypothesis" />
        Each problem is easier to see through the other. An excellent index of unreviewed answers
        is fragile. A thoughtful community that nobody can discover is just as fragile. That
        coupling is what this project wants to test.
      </p>

      <h2>Choose a rabbit hole</h2>
      <p>Both lead to the same place eventually. Start wherever your curiosity is.</p>
      <RabbitHoles />

      <h2>Where they meet</h2>
      <p>
        At the bottom of both holes is the same idea: a <em>portable problem commons</em>. Problems
        and solutions published where their authors control them, discussed from wherever people
        already are, and indexed by anyone who wants to build a better way to find them. This essay
        is meant to become its first record.
      </p>
      <p>
        <Link to="/convergence/">Read the convergence</Link>, or check{' '}
        <Link to="/notes/">the notes</Link> to see what is actually built and what is still a
        hypothesis.
      </p>
    </>
  )
}
