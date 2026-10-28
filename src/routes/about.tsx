import { Link, createFileRoute } from '@tanstack/react-router'
import { PageIntro } from '../components/PageIntro'
import { Src } from '../components/Src'
import { pageTitle } from '../content/site'
import { REPO_URL } from '../content/sources'

export const Route = createFileRoute('/about')({
  head: () => ({ meta: [{ title: pageTitle('About') }] }),
  component: About,
})

function About() {
  return (
    <>
      <PageIntro kicker="About" title="About this project">
        <p>
          Postack Underflow is an open research and prototype project about two intertwined
          failures: finding problems that are already solved, and keeping shared knowledge alive
          outside any one platform.
        </p>
      </PageIntro>

      <h2>Where it came from</h2>
      <p>
        The project began as a response to a conversation on{' '}
        <Src id="syntax1050">Syntax #1050</Src>, in which CJ asked what happens to shared
        problem-solving knowledge once most of it flows through private agent sessions. The essay
        paraphrases that discussion and links to the transcript. It is an attributed inspiration,
        not an endorsement: the project is not affiliated with Syntax or its hosts.
      </p>

      <h2>What it is not</h2>
      <ul>
        <li>Not a replacement for Stack Overflow, and not a new centralised social network.</li>
        <li>Not a live search service. The Four Words index is a static file built offline; there is no backend, crawler or AI service behind this site.</li>
        <li>Not a claim that the approach works. That is what the experiments are for.</li>
      </ul>

      <h2>Related projects</h2>
      <ul>
        <li>
          <Src id="githubAtlas">GitHub Atlas</Src>: repository and ecosystem maps; the starting point
          for asking what a problem-oriented map would look like.
        </li>
        <li>
          <Src id="brainstorm">br-ai-nstorm</Src>: shared problem memory with provenance, visible
          conflicts and several projections of one record.
        </li>
        <li>
          <Src id="lumpesammlig">Lumpesammlig</Src>: the specimen collection where The Impossible
          Index and The Switchboard are being developed.
        </li>
        <li>
          <Src id="colors">Colors</Src>: palette studies behind the preliminary paper, ink, blue,
          violet and rose.
        </li>
        <li>
          <Src id="atproto">AT Protocol</Src> and <Src id="standardSite">Standard.site</Src>: the
          protocol layer the community experiments would build on.
        </li>
      </ul>

      <h2>Credits and process</h2>
      <p>
        Research, direction and editorial decisions by the project owner. Drafting and
        implementation were assisted by AI coding agents working under the repository’s{' '}
        <Src id="developmentPractice">development practice</Src>; the two interactive studies are
        developed separately in Lumpesammlig. Contributions, critique and prior art are welcome on{' '}
        <a href={REPO_URL}>GitHub</a>.
      </p>
      <p>
        Want the evidence first? Go to the <Link to="/notes/">notes</Link>.
      </p>
    </>
  )
}
