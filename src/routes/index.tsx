import { Link, createFileRoute } from '@tanstack/react-router'
import { RabbitHoles } from '../components/RabbitHoles'
import { Scrolly } from '../components/Scrolly'
import { ShortcutDiagram, type ShortcutStep } from '../components/ShortcutDiagram'
import { Src } from '../components/Src'
import { Status } from '../components/Status'
import { pageTitle } from '../content/site'
import { PHOTO_FRAME } from '../data/photo-frame'

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: pageTitle() }] }),
  component: Home,
})

const c = PHOTO_FRAME.counts

const SHORTCUT_STEPS = [
  <>
    <h3>Four words and someone else’s afternoon</h3>
    <p>
      Say a site deployed to GitHub Pages loads without its stylesheet. For a long stretch of
      software history the next move was to type a few words, something like{' '}
      <code>css missing after deploy</code>. A search engine found a page; the page was a question
      someone had asked years earlier, organised by a Q&amp;A site into an accepted answer, a
      competing one, and a comment noting that the fix changed in a later version. Somebody spent
      an afternoon so that you could spend five minutes.
    </p>
  </>,
  <>
    <h3>An agent reconstructs the answer</h3>
    <p>
      Today you might ask an agent instead. It reads your build configuration, opens the framework’s
      documentation and an issue or two, compares the generated asset paths with the URL the site is
      served from, and proposes a base-path setting. That is good engineering. It works from primary
      sources rather than a stale answer, and it fits the fix to your project.
    </p>
  </>,
  <>
    <h3>And then again</h3>
    <p>
      The next person with the same problem gets the same careful exploration, from the beginning.
      Their agent cannot see what yours found. While this site was being built, a sibling project’s
      GitHub Pages deployment was reported by the project owner to come up largely unstyled despite
      a green workflow (its <a href="https://github.com/blackmath88/lumpesammlig/commit/a146191a2396ca728e2eca189472c3f9bb0ceacf">repair
      commit</a>), and this site’s first deployment never happened because its{' '}
      <a href="https://github.com/blackmath88/postack-underflow/pull/3">pull requests were stacked</a>{' '}
      and none reached <code>main</code>. Small, well-documented kinds of problem, worked out again.
    </p>
  </>,
  <>
    <h3>Little returns</h3>
    <p>
      Most of those explorations end in a working diff and a private transcript. Some leave
      something public, an issue or a pull request, but rarely a question someone else could find by
      its symptom, an answer others could vote on, or a correction for the next version. The
      knowledge was produced; most of it did not go anywhere shared.
    </p>
  </>,
]

const PROBLEMS: Array<[string, string, string]> = [
  ['The question', 'The answer exists. Why can’t we find it?', 'The knowledge exists. Who keeps it alive?'],
  ['What is missing', 'A route from a symptom to a solution someone already wrote down', 'A place where checking, correcting and disagreeing accumulate'],
  ['The symptom', 'Rediscovering a known fix from scratch', 'Fixes nobody else can see, check or improve'],
]

function Home() {
  return (
    <>
      <div className="opening">
        <p className="kicker">An open research essay · draft</p>
        <h1>We already solved this.</h1>
        <p className="question">So why are we solving it again?</p>
      </div>

      <section className="movement" aria-labelledby="m1">
        <p className="movement__number" aria-hidden="true">
          I
        </p>
        <h2 id="m1">The encounter</h2>
        <p className="lede-inline">
          It starts with a cheap photo frame and somebody who wanted it to do something else.
        </p>
        <p>
          Android photo frames are small locked-down computers: a screen, a board, a vendor app that
          shows your pictures and, on some models, talks to the vendor’s servers. In{' '}
          <Src id="syntax1050">Syntax episode #1050</Src>, Wes Bos describes getting into his. For months,
          he says, AI models told him it could not be done; progress came when he suggested connecting
          to it as an Android device or trying button combinations. The
          hosts spend a good part of the episode on the same pleasure applied to televisions: debug
          access, uninstalling bundled apps, replacing the launcher.
        </p>
        <p>
          What Wes learned did not stay in his session. His public repository,{' '}
          <Src id="photoFrame">photo-frame-dashboard</Src>, is a set of notes and scripts for taking over
          these frames: how to identify the board, get debug access, back up the firmware, root it,
          replace the vendor app and run your own dashboard full screen. Its opening summary tells
          readers to point an agent at it, and a later section headed “For agents: start here” lists rules learned the hard way: ask before every write, take a verified backup first, stop
          at the first mismatch, keep observations separate from guesses.
        </p>

        <figure className="specimen specimen--source wide" aria-labelledby="pf-caption">
          <div className="specimen__tag">
            <span>Source</span>
            <span>
              {PHOTO_FRAME.repo} · commit {PHOTO_FRAME.pinnedCommit.slice(0, 7)} · {PHOTO_FRAME.license}
            </span>
          </div>
          <dl className="tally">
            <div>
              <dt>Pull requests</dt>
              <dd>{c.pullRequests}</dd>
              <dd className="tally__sub">
                {c.merged} merged · {c.open} open · {c.closedUnmerged} closed unmerged
              </dd>
            </div>
            <div>
              <dt>Issues</dt>
              <dd>{c.issues}</dd>
              <dd className="tally__sub">{c.issuesClosed} closed</dd>
            </div>
            <div>
              <dt>Recent PRs naming an AI tool</dt>
              <dd>
                {PHOTO_FRAME.agentMentionSample.mentioning}
                <small>/{PHOTO_FRAME.agentMentionSample.of}</small>
              </dd>
              <dd className="tally__sub">keyword scan of descriptions; a crude signal</dd>
            </div>
          </dl>
          <figcaption id="pf-caption">
            Counted on GitHub, {PHOTO_FRAME.observedAt.replace('T', ' ').replace('Z', '')} UTC. Repository
            created {PHOTO_FRAME.created}; {PHOTO_FRAME.beforeEpisode.pullRequests} pull requests and{' '}
            {PHOTO_FRAME.beforeEpisode.issues} issues were opened before the episode aired. In the episode
            (around {PHOTO_FRAME.episode.agentContributionsAt}) Wes says his photo-frame repository has over
            200 pull requests or issues from other people’s agents. The episode does not name the
            repository; identifying it as this one is our inference from its owner, subject, date and
            numbers.
          </figcaption>
        </figure>

        <p>
          The repository asks for something back. Before you start, check the open issues and pull
          requests, because someone may already have your board. When you learn something, a new
          firmware string, a cable that does not work, a failed attempt, open a pull request with it,
          strip your private data first, and show the frame’s owner the diff, since it goes out under
          their name. People did. The repository fills with device notes from strangers and their
          agents, and a maintainer merges most of them.
        </p>
        <p>
          This is what a commons looks like when it works: a problem, an exploration, an explanation,
          something reusable, and a route back. It is also not quite the story we expected to tell. Here
          agents are not reconstructing in private. They are contributing, because one person built a
          place that asked them to and told them how.
        </p>
      </section>

      <section className="movement" aria-labelledby="m2">
        <p className="movement__number" aria-hidden="true">
          II
        </p>
        <h2 id="m2">The lost shortcut</h2>
        <p>
          <Status kind="paraphrase" />
          The same episode contains the worry this essay set out from. Near the end, CJ asks what
          happens to shared problem-solving knowledge now that developers increasingly ask agents rather
          than each other. An agent can read the code, reason about it and reach a working fix; then the
          next person’s agent does the same work again, and the solution never lands anywhere others can
          find it. He suggests the main party learning from the repetition is whoever trains the models.
        </p>
        <p>
          The hosts push back. Scott points to projects where reusable building blocks are shared in a
          community space. Wes notes that Stack Overflow has built agents of its own, though he doubts
          they are catching on, and points to his repository full of agents’ pull requests. When a
          listener says the solutions are on GitHub anyway, CJ answers that many developers work on
          closed-source code.
        </p>
        <p className="aside">
          Our paraphrase of a spoken conversation, not a quotation; CJ’s point starts roughly 55 minutes
          in. Read <Src id="syntax1050">the transcript</Src> for the exact wording. Not affiliated with or
          endorsed by the show.
        </p>
        <p>
          The shortcut CJ misses was never one product. A search engine found pages, by relevance and by
          how the web linked to them. A Q&amp;A site organised what was on those pages: one question per
          problem, answers ranked by people who had tried them, corrections attached to the thing they
          corrected. Together they made other people’s afternoons reusable.
        </p>

        <Scrolly
          label="The lost shortcut, in four steps"
          steps={SHORTCUT_STEPS}
          figure={(step) => <ShortcutDiagram step={step as ShortcutStep} />}
        />

        <p>
          An agent that reconstructs a solution and a reader who retrieves one may end up with the same
          code. They do not end up with the same knowledge. A retrieved answer arrives with a history of
          other people checking it: who wrote it, under which versions, who disagreed, what was
          corrected. A reconstructed answer may cite the documentation it read, but nobody else has
          looked at it yet.
        </p>
        <p>
          This is not nostalgia. Public answers went stale, duplicates were closed with a curt link, and
          some questions were never asked for fear of how they would be received. Reconstruction is
          often the right call: when the context is private, when the old answer is wrong, when nothing
          was ever written down. The photo-frame repository even shows agents leaving better notes than
          many of us did. The question is narrower: when a useful investigation ends, where does it go?
        </p>
      </section>

      <section className="movement" aria-labelledby="m3">
        <p className="movement__number" aria-hidden="true">
          III
        </p>
        <h2 id="m3">Two problems, at least</h2>
        <p>
          Look closely at what made either the old shortcut or the photo-frame repository work, and two
          different things come apart.
        </p>
        <div className="table-wrap wide">
          <table className="compare">
            <caption className="kicker table-caption">Two problems that are easy to blur together</caption>
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
          <strong>Finding.</strong> The photo-frame notes are organised by device and by phase: identify,
          get access, back up, root. That suits someone who already knows which board they have. Imagine
          instead someone who only knows that their frame went blank after an update (our example, not a
          case from the repository): they have to find their own way in. Whether they can depends on descriptions somebody wrote in advance.
        </p>
        <p>
          <strong>Keeping.</strong> Those notes stay alive because people keep checking them against their
          own units and correcting them, and because one person keeps reading and merging what arrives.
          That work is not an index. It is a community, and it has a cost.
        </p>
        <p>
          <Status kind="hypothesis" />
          Each problem is easier to see through the other. A fast index of unreviewed answers spreads
          mistakes efficiently; a thoughtful community nobody can find gets rediscovered from scratch.
        </p>
        <p>
          They are not the only problems. Whether a fix <em>applies</em> to your version, whether anyone
          has <em>verified</em> it, whether it was <em>documented</em> at all, what <em>incentive</em> anyone
          had to write it down, and who <em>maintains</em> it when the platform changes: each can lose an
          answer on its own. This essay follows two of them because they can be made into experiments you
          can try.
        </p>

        <h3>Choose a rabbit hole</h3>
        <p>Both have something to try, and both lead to the same desk at the end.</p>
        <RabbitHoles />
        <p>
          Or go straight to <Link to="/convergence/">the Problem Desk</Link>, where they meet, and the{' '}
          <Link to="/afterword/">afterword</Link>, where this essay looks at how it was made.
        </p>
      </section>
    </>
  )
}
