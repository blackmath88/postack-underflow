import { Link, createFileRoute } from '@tanstack/react-router'
import { ArtifactSlot } from '../components/ArtifactSlot'
import { PageIntro } from '../components/PageIntro'
import { Src } from '../components/Src'
import { Status } from '../components/Status'
import { pageTitle } from '../content/site'

export const Route = createFileRoute('/community')({
  head: () => ({ meta: [{ title: pageTitle('Community') }] }),
  component: Community,
})

const SIGNALS: Array<[string, string, string]> = [
  ['Public question', 'Made the problem findable and quotable', 'Many questions were duplicates or poorly scoped'],
  ['Votes', 'Aggregated many small judgements', 'Popularity and early answers were rewarded'],
  ['Accepted answer', 'Recorded what worked for the asker', 'One person’s context, frozen in time'],
  ['Comments', 'Caught edge cases and breakage', 'Easy to miss, sometimes hostile'],
  ['Edits', 'Let answers improve after posting', 'Authorship became blurred'],
  ['Reputation', 'Gave strangers a reason to trust', 'Identity is not correctness'],
  ['Moderation and duplicates', 'Kept one canonical thread per problem', 'Could feel unwelcoming to newcomers'],
]

function Community() {
  return (
    <>
      <PageIntro index="02" kicker="Rabbit hole" title="Community">
        <p>
          An answer is only as good as the people who argued about it. So where does the arguing
          happen now?
        </p>
      </PageIntro>

      <h2>It was never just answers</h2>
      <p>
        It is tempting to remember Stack Overflow as a database of answers. It was more like a
        machine for collective judgement, made of several small mechanisms that each did one thing
        imperfectly. Together they turned a stranger’s reply into something you could reasonably
        rely on, or reasonably doubt.
      </p>
      <div className="table-wrap wide">
        <table>
          <caption className="kicker table-caption">
            Signals and their costs (our reading, not a measured study)
          </caption>
          <thead>
            <tr>
              <th scope="col">Mechanism</th>
              <th scope="col">What it contributed</th>
              <th scope="col">What it cost</th>
            </tr>
          </thead>
          <tbody>
            {SIGNALS.map(([mechanism, gave, cost]) => (
              <tr key={mechanism}>
                <th scope="row">{mechanism}</th>
                <td>{gave}</td>
                <td>{cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        None of these signals proves that an answer is true. What they did was make disagreement
        and correction <em>visible</em>, attached to the answer itself. Search engines then did
        their part: links, page structure and relevance made those threads the first thing you
        found. Ranking was never just a count of visits.
      </p>

      <h2>Where the conversation went</h2>
      <p>
        <Status kind="observation" />
        A lot of problem solving now happens in a private chat with a model, or in an agent run
        that leaves behind a diff and nothing else. There is no one to vote, no comment saying “this
        breaks on Windows”, no edit two years later. The judgement still happens, inside one
        person’s head, and then it evaporates.
      </p>
      <p>
        Moving that conversation back to one big public site is not obviously the answer either.
        Platforms change hands, change rules and shut down, and a community’s whole memory goes
        with them. The question is whether a community can exist <em>without</em> living in one
        place.
      </p>

      <h2>Portable communities</h2>
      <p>
        <Status kind="hypothesis" />
        Imagine the pieces of a thread living where their authors live. The original write-up sits
        on the author’s own blog. A reply is a record in the replier’s own data repository. A
        correction, an endorsement or an objection is likewise owned by whoever made it. No site
        holds the conversation; any site can assemble it.
      </p>
      <p>
        That is roughly the shape the <Src id="atproto">AT Protocol</Src> makes possible: portable
        identities, user-owned repositories of records, shared schemas called Lexicons, and
        independent applications that read the same records and present them differently.{' '}
        <Src id="standardSite">Standard.site</Src> already defines records for blog-style
        publications, so an article does not need a bespoke format.
      </p>
      <p>
        The same contributions could then appear as comments under a blog post, as a channel in a
        chat-like client, or as a map of a problem and its branches, the way{' '}
        <Src id="brainstorm">br-ai-nstorm</Src> projects one problem memory into several views. The
        views are projections. None of them is the canonical truth, and none can quietly rewrite
        what someone said.
      </p>

      <h2>What portability does not buy</h2>
      <p>
        Owning your records does not mean anyone will see them, that they stay online, or that
        they are right. Moderation, spam, deletion and identity changes all still need answers, and
        a federated protocol spreads those problems around rather than solving them. Language
        models may be useful for <em>proposing</em> connections between contributions; they should
        not be the ones who decide consensus.
      </p>

      <ArtifactSlot id="switchboard" />

      <p>
        The Switchboard is an interaction study, not a working client. Its risk is the metaphor
        itself: a switchboard has an operator, and nobody should have that much power over a
        conversation. In this version, every connection is a proposal made by the current view,
        never a change to anyone’s record.
      </p>

      <nav className="next" aria-label="Continue reading">
        <p className="kicker">Next</p>
        <p>
          <Link to="/convergence/">Convergence: an index that remembers its arguments</Link>
        </p>
      </nav>
    </>
  )
}
