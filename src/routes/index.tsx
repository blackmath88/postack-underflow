import { Link, createFileRoute } from '@tanstack/react-router'
import { RabbitHoles } from '../components/RabbitHoles'
import { Scrolly } from '../components/Scrolly'
import { ShortcutDiagram, type ShortcutStep } from '../components/ShortcutDiagram'
import { Src } from '../components/Src'
import { Status } from '../components/Status'
import { pageTitle } from '../content/site'

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: pageTitle() }] }),
  component: Home,
})

const SHORTCUT_STEPS = [
  <>
    <h3>Four words and someone else’s afternoon</h3>
    <p>
      Say a site deployed to GitHub Pages loads without its stylesheet. For a long stretch of
      software history the next move was to type a few words, something like{' '}
      <code>github pages css 404</code>, and land on a public question someone had asked years
      earlier. Under it sat an accepted answer, a competing one, and a comment noting that the fix
      changed in a later version. Somebody spent an afternoon so that you could spend five
      minutes.
    </p>
  </>,
  <>
    <h3>An agent reconstructs the answer</h3>
    <p>
      Today you might ask an agent instead. It reads your build configuration, opens the
      framework’s documentation, compares the generated asset paths with the URL the site is
      served from, and proposes a base-path setting. That is good engineering. It works from
      primary sources rather than from a stale answer, and it adapts the fix to your project.
    </p>
  </>,
  <>
    <h3>And then again</h3>
    <p>
      The next person with the same problem gets the same careful exploration, from the
      beginning. Their agent cannot see what yours found. While this site was being built, a
      sibling project’s GitHub Pages deployment was reported by the project owner to come up largely
      unstyled despite a green workflow, and this site’s first deployment never happened because
      its <a href="https://github.com/blackmath88/postack-underflow/pull/3">pull requests were
      stacked</a> and none reached <code>main</code>. Both are small, well-documented kinds of
      problem. Both were worked out again.
    </p>
  </>,
  <>
    <h3>Nothing returns</h3>
    <p>
      Most of those explorations end in a working diff and a private transcript. Some do leave
      something public, an issue or a pull request, but rarely a question someone else could find
      by its symptom, an answer others could vote on, or a correction for the next version. The
      knowledge was produced; most of it did not go anywhere shared.
    </p>
  </>,
]

const PROBLEMS: Array<[string, string, string]> = [
  ['What is missing', 'A way to find solutions that already exist', 'A place where judgement about solutions accumulates'],
  ['The symptom', 'Rediscovering a known fix from scratch', 'Fixes that nobody else can see, check or correct'],
  ['A typical unit today', 'Repository, file, commit', 'Private chat, agent session, one platform’s thread'],
]

function Home() {
  return (
    <>
      <div className="opening">
        <p className="kicker">An open research essay · draft</p>
        <h1>We already solved this.</h1>
        <p className="question">So why are we solving it again?</p>
      </div>

      <hr />

      <h2>The observation</h2>
      <p>
        <Status kind="paraphrase" />
        In <Src id="syntax1050">Syntax episode #1050</Src>, CJ worries about what happens to
        shared problem-solving knowledge now that developers increasingly ask agents rather than
        each other. An agent can read the code, reason about it and reach a working fix. Then the
        next person’s agent does the same work again, privately, and the solution never lands
        anywhere others can find it. CJ suggests the main party learning from the repetition is
        whoever trains the models, and asks whether there is a better way to share.
      </p>
      <p>
        The hosts do not simply agree. Scott points to projects where reusable building blocks are
        shared in a community space so they need not be reinvented. Wes notes that sharing is
        already happening in places: Stack Overflow has built agents of its own, though he doubts
        they are catching on, and other people’s agents have opened a couple of hundred issues and
        pull requests on one of his public repositories. He floats agents publishing write-ups of
        what they fixed. When a listener objects that the solutions are on GitHub anyway, CJ answers
        that many developers work on closed-source code.
      </p>
      <p className="aside">
        Our paraphrase of a spoken conversation, not a quotation; the discussion starts roughly 55
        minutes in. Read <Src id="syntax1050">the transcript</Src> for the exact wording.
        Postack Underflow is not affiliated with or endorsed by the show.
      </p>

      <h2>The lost shortcut</h2>
      <Scrolly
        label="The lost shortcut, in four steps"
        steps={SHORTCUT_STEPS}
        figure={(step) => <ShortcutDiagram step={step as ShortcutStep} />}
      />

      <h2>Retrieving is not the same as reconstructing</h2>
      <p>
        An agent that reconstructs a solution and a reader who retrieves one may end up with the
        same code. They do not end up with the same knowledge. A retrieved answer arrives with
        context: who wrote it, under which versions, who disagreed, what was corrected later. A
        reconstructed answer may cite the documentation it read, but it arrives without that
        history of other people checking it.
      </p>
      <p className="pull">
        Reconstruction is paid for on every attempt. Retrieval shares a cost someone already paid,
        though keeping what is retrieved accurate is a cost of its own.
      </p>
      <p>
        This is not an argument against agents, nor nostalgia for an old Q&amp;A site. Public
        answers went stale, duplicates were closed with a curt link, and the questions people were
        afraid to ask never got asked. Reconstruction is often the right call: when the context is
        private, when the old answer is wrong, or when nothing has been written down. The question
        is narrower. Once a solution exists, where does it go, and can anyone, human or agent, find
        it again without doing the work twice?
      </p>

      <h2>Two problems, not one</h2>
      <p>
        Pull on that question and it comes apart into two problems that are easy to blur together.
      </p>
      <div className="table-wrap wide">
        <table className="compare">
          <caption className="kicker table-caption">Indexing and community, side by side</caption>
          <thead>
            <tr>
              <th scope="col">
                <span className="visually-hidden">Aspect</span>
              </th>
              <th scope="col" className="compare__index">
                01 · Indexing
              </th>
              <th scope="col" className="compare__community">
                02 · Community
              </th>
            </tr>
          </thead>
          <tbody>
            {PROBLEMS.map(([aspect, index, community]) => (
              <tr key={aspect}>
                <th scope="row">{aspect}</th>
                <td>{index}</td>
                <td>{community}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        <strong>Indexing</strong> is about discovery. Public repositories, documentation and issues
        hold a great many solved problems, but they are organised by project, page and thread, not
        by problem solved. To
        find a fix you often need to know where it lives before you know it exists.
      </p>
      <p>
        <strong>Community</strong> is about judgement. Votes, accepted answers, corrections and
        moderation made strangers’ answers usable, and they belonged to a community that lived on
        one platform. Problem solving is moving into places where none of those signals can form.
      </p>
      <p>
        <Status kind="hypothesis" />
        Each problem is easier to see through the other. A fast index of unreviewed answers
        spreads mistakes efficiently; a thoughtful community nobody can find gets rediscovered
        from scratch. That coupling is what this project is trying to test.
      </p>

      <h2>Choose a rabbit hole</h2>
      <p>
        Each one has something you can try. The Indexing page runs a small, measured retrieval
        experiment; the Community page assembles a conversation from records nobody on this site
        owns. Neither involves an agent yet. Four Words tests short human queries over
        documentation, the shortcut the opening describes. Whether an agent would check such an
        index before exploring, and whether agents could write records back, are open questions
        (H5 in the record).
      </p>
      <RabbitHoles />

      <h2>Where they meet</h2>
      <p>
        At the bottom of both holes is the same idea: a <em>portable problem commons</em>. This
        essay is written down as its first record, a structured object with its own problem,
        sources, evidence and open questions, which a discussion could attach to without living
        on this site.
      </p>
      <p>
        <Link to="/convergence/">Read the convergence</Link>, or check{' '}
        <Link to="/notes/">the notes</Link> for what is built and what is still a hypothesis.
      </p>
    </>
  )
}
