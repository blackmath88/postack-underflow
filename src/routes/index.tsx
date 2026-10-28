import { Link, createFileRoute } from '@tanstack/react-router'
import { Ref } from '../components/Margin'
import { RabbitHoles } from '../components/RabbitHoles'
import { Scrolly } from '../components/Scrolly'
import { ShortcutDiagram, type ShortcutStep } from '../components/ShortcutDiagram'
import { pageTitle } from '../content/site'

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: pageTitle() }] }),
  component: Home,
})

// One idea per step: observation, change, insight, next question.
const SHORTCUT_STEPS = [
  <>
    <h3>Four words and someone else’s afternoon</h3>
    <p>
      Your site deploys, but loads without its styles. You type four words:{' '}
      <code>css missing after deploy</code>. A search finds a question someone asked years ago, an accepted
      answer, and a comment saying the fix changed in a later version. Someone spent an afternoon so you could
      spend five minutes.
    </p>
  </>,
  <>
    <h3>An agent rebuilds the answer</h3>
    <p>
      Today you ask an agent. It reads your project and the documentation, works out where the files went
      astray, and proposes a fix. That is good engineering, fitted to your project.
    </p>
  </>,
  <>
    <h3>And then again</h3>
    <p>
      The next person with the same problem gets the same careful exploration, from the beginning. Their agent
      cannot see what yours found.
    </p>
  </>,
  <>
    <h3>Little comes back</h3>
    <p>
      Most of these explorations end in a working fix and a private transcript. Little of it lands anywhere the
      next person could find it.
    </p>
  </>,
]

const ROUTE = [
  ['Curiosity', 'A frame that could do more'],
  ['Discovery', 'It is a small computer'],
  ['Written down', 'A public repository'],
  ['Found', 'Strangers with other frames'],
  ['Extended', 'Their notes, merged back'],
] as const

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
        <p className="statement">It starts with a cheap photo frame.</p>
        <p className="beat">
          A small screen that shows your pictures the way its maker decided. Some models also talk to the
          maker’s servers.
        </p>
        <p className="beat">
          <Ref id="episode">Wes Bos wanted his to do something else.</Ref> For months, he says, the AI models he
          asked told him it could not be done. He kept trying. The frame turned out to be a small Android
          computer, and he got in.
        </p>
        <p className="beat">
          Then he did the thing this essay is about. <Ref id="frameRepo">He wrote it all down, in public.</Ref>
        </p>

        <ol className="route wide" aria-label="From curiosity to shared knowledge">
          {ROUTE.map(([label, text]) => (
            <li key={label}>
              <span className="route__label">{label}</span>
              <span className="route__text">{text}</span>
            </li>
          ))}
        </ol>

        <p className="beat">
          Strangers with other frames found it. They tried the steps on their own boards and sent back what they
          learned: a firmware string, a cable that does not work, a failed attempt.{' '}
          <Ref id="frameCounts">Most of it was merged.</Ref>
        </p>
        <p className="beat">
          Many of them did not type the notes themselves. They pointed their AI agents at it.{' '}
          <Ref id="forAgents">The repository asks for exactly that.</Ref>
        </p>
        <p className="statement statement--quiet">
          A problem, an exploration, an explanation, and a route back. This is shared knowledge working.
        </p>
      </section>

      <section className="movement" aria-labelledby="m2">
        <p className="movement__number" aria-hidden="true">
          II
        </p>
        <h2 id="m2">The lost shortcut</h2>
        <p className="beat">
          The same episode ends on a worry. When developers ask agents instead of each other,{' '}
          <Ref id="cjWorry">what is left for the next person?</Ref>
        </p>
        <p className="statement">
          <Ref id="googleSo">Someone had already done the work.</Ref> The trick was finding it.
        </p>

        <Scrolly
          label="The lost shortcut, in four steps"
          steps={SHORTCUT_STEPS}
          figure={(step) => <ShortcutDiagram step={step as ShortcutStep} />}
        />

        <p className="beat">
          An agent and a search can end with the same code.{' '}
          <Ref id="sameCode">They do not end with the same knowledge.</Ref>
        </p>
        <p className="beat">
          <Ref id="notNostalgia">This is not nostalgia.</Ref> Rebuilding an answer is often the right call. It is
          also easy to do without noticing. <Ref id="ownExample">We did it twice making this site.</Ref>
        </p>
        <p className="statement statement--quiet">When a useful investigation ends, where does it go?</p>
      </section>

      <section className="movement" aria-labelledby="m3">
        <p className="movement__number" aria-hidden="true">
          III
        </p>
        <h2 id="m3">Two problems, at least</h2>
        <p className="beat">Look closely at the photo-frame repository and two different things come apart.</p>

        <div className="pair wide">
          <div className="pair__item">
            <p className="pair__label">01 · Finding</p>
            <p className="pair__question">The answer exists. Why can’t we find it?</p>
            <p className="pair__example">
              Notes filed by circuit board help someone who{' '}
              <Ref id="findingFrame">already knows which board is in their frame.</Ref>
            </p>
          </div>
          <div className="pair__item pair__item--community">
            <p className="pair__label">02 · Keeping</p>
            <p className="pair__question">The knowledge exists. Who keeps it alive?</p>
            <p className="pair__example">
              The notes stay true because strangers keep checking them, and{' '}
              <Ref id="keepingCost">one person keeps merging.</Ref>
            </p>
          </div>
        </div>

        <p className="beat">
          <Ref id="eachThroughOther">Each is easier to see through the other.</Ref>{' '}
          They are <Ref id="otherProblems">not the only problems.</Ref> But they are two you can try for yourself.
        </p>

        <h3>Choose a rabbit hole</h3>
        <RabbitHoles />
        <p>
          Both lead to <Link to="/convergence/">the Problem Desk</Link>, where they meet. The numbered phrases
          open notes in the margin; the <Link to="/archive/">archive</Link> holds the full research.
        </p>
      </section>
    </>
  )
}
