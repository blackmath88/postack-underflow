import { Link, createFileRoute } from '@tanstack/react-router'
import { Switchboard } from '../components/Switchboard'
import { PageIntro } from '../components/PageIntro'
import { Src } from '../components/Src'
import { Status } from '../components/Status'
import { StudyNote } from '../components/StudyNote'
import { pageTitle } from '../content/site'
import { repoFile } from '../content/sources'

export const Route = createFileRoute('/community')({
  head: () => ({ meta: [{ title: pageTitle('Community') }] }),
  component: Community,
})

const SIGNALS: Array<[string, string, string]> = [
  ['Public question', 'Made the problem findable and quotable', 'Many questions were duplicates or poorly scoped'],
  ['Votes', 'Aggregated many small judgements', 'Rewarded early and popular answers'],
  ['Accepted answer', 'Recorded what worked for the asker', 'One person’s context, frozen in time'],
  ['Comments', 'Caught edge cases and breakage', 'Easy to miss, sometimes hostile'],
  ['Edits', 'Let answers improve after posting', 'Blurred authorship'],
  ['Reputation', 'Gave strangers a reason to trust', 'Identity is not correctness'],
  ['Moderation and duplicates', 'Kept one thread per problem', 'Could feel unwelcoming to newcomers'],
]

const PROTOCOL: Array<[string, string, 'exists' | 'niche' | 'proposal' | 'missing']> = [
  ['Publish an article on your own site, as a record', 'site.standard.document', 'exists'],
  ['Point at one exact version of a record', 'com.atproto.repo.strongRef (uri + cid)', 'exists'],
  ['Reply in a thread', 'app.bsky.feed.post reply (root, parent)', 'exists'],
  ['Use a Bluesky thread as a blog’s comments', 'site.standard.document bskyPostRef', 'exists'],
  ['Recommend a document', 'site.standard.graph.recommend', 'niche'],
  ['Comment on a document', 'pub.leaflet.comment, fyi.frontpage.feed.comment', 'niche'],
  ['Vote on a link or post', 'fyi.frontpage.feed.vote', 'niche'],
  ['Ask an author a question; the author answers', 'pub.leaflet.interactions.question / .answer', 'niche'],
  ['Label content for moderation', 'com.atproto.label.defs#label', 'exists'],
  ['Groups with shared spaces', 'Atmospheric Groups / opensocial.group', 'proposal'],
  ['Endorse a specific solution', '—', 'missing'],
  ['Correct one version of a claim', '—', 'missing'],
  ['Record a disagreement', '—', 'missing'],
  ['Mark an accepted answer', '—', 'missing'],
  ['Problem and solution records with evidence', '—', 'missing'],
]

const PROTOCOL_LABEL = {
  exists: 'Exists, in use',
  niche: 'Exists; app-specific or adoption unmeasured',
  proposal: 'Proposal',
  missing: 'No Lexicon found',
}

function Community() {
  return (
    <>
      <PageIntro index="B" kicker="Rabbit hole · community" title="The Switchboard">
        <p>
          The knowledge exists. Who keeps it alive? An answer is only as good as the people who checked,
          corrected and argued about it, and that work has to happen somewhere.
        </p>
      </PageIntro>

      <h2>It was never just answers</h2>
      <p>
        It is tempting to remember Stack Overflow as a database of answers. It worked more like a
        machine for collective judgement, built from small mechanisms that each did one thing
        imperfectly. Together they let you rely on a stranger’s reply, or doubt it with reason.
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
        None of these signals proves an answer true. What they did was make disagreement and
        correction <em>visible</em>, attached to the answer itself. They also all depended on one
        site existing, being trusted and staying online.
      </p>

      <h2>Where the conversation went</h2>
      <p>
        <Status kind="hypothesis" />
        Our reading, not a measurement: a lot of problem solving now happens in a private chat with
        a model, or in an agent run that leaves behind a diff. Some of it does surface. Wes
        mentions agents opening issues and pull requests on his repositories. But a pull request
        is a fix, not a question others can find by its symptom, and nobody votes on it or adds the
        comment saying it breaks on Windows. Much of the judgement happens in one person’s head
        and stays there.
      </p>
      <p>
        Moving everyone back onto one big site is not obviously the answer. Platforms change
        hands, change rules and shut down, and a community’s memory goes with them. The question
        here is whether a community can exist <em>without</em> living in one place.
      </p>

      <h2>A model in two layers</h2>
      <p>
        <Status kind="hypothesis" />
        Separate two things that one platform used to hold together:
      </p>
      <ol>
        <li>
          <strong>Contributions</strong>: an article, a reply, a correction, an endorsement, a
          dispute. Each is published by its author, in a place the author controls, under the
          author’s identity, and can name what it responds to.
        </li>
        <li>
          <strong>Relations</strong>: the lines an interface draws between contributions to show
          them as a thread, a forum, or a map. Some come straight from the authors’ own
          references; others are an editor’s grouping or a model’s guess. Every relation has a
          reason and an origin you can see.
        </li>
      </ol>
      <p>
        An interface assembles contributions; it does not own their original context. If the
        interface disappears, the contributions are still where their authors put them.
      </p>

      <h2>What a switchboard knew</h2>
      <p>
        A manual telephone switchboard joined separate lines. Each caller owned their own endpoint; the
        operator answered a request, made a temporary connection, could listen in to supervise, and pulled
        the cord when the call ended. Every connection was a choice somebody made, and the operator had
        real power over who could reach whom.
      </p>
      <p>
        It also kept nothing. A switchboard routed live speech; when the cord came out, the conversation
        was gone. Persistent, authored records are not part of the historical object. They are the
        change this experiment makes to it: the voices stay, and only the connections are temporary.
      </p>
      <p className="aside">
        The operational details are reported in research compiled for this project and not independently
        verified here (<Src id="pr5">PR #5</Src>).
      </p>

      <Switchboard />

      <StudyNote id="switchboard" />

      <p>
        Look at the model’s proposal first. It sits beside the authors’ own references with a different
        line, a different label and a history that ends in a dispute. It may sometimes be right. It never
        becomes an author’s statement, and neither does yours.
      </p>
      <p>
        Then let the operator leave. Every line goes, including the ones you drew, and the eight records
        remain, each with its own references inside it. Two of them show what portability cannot fix: one
        author’s server is offline, so there is nothing to show; one author deleted their reply, and the
        protocol keeps no tombstone. An honest interface says so rather than quietly serving a stale copy.
      </p>

      <h2>What exists today, and what does not</h2>
      <p>
        The <Src id="atproto">AT Protocol</Src> already provides much of the first layer.
        Accounts own repositories of signed records; anyone with a domain can define a schema,
        called a Lexicon; and a reference can pin one exact version of another record.{' '}
        <Src id="standardSite">Standard.site</Src> defines records for publications and documents,
        including a field linking a document to a Bluesky thread that acts as its comment section.
        What we could not find is any shared schema for the judgement layer.
      </p>
      <div className="table-wrap wide">
        <table>
          <caption className="kicker table-caption">
            Checked against lexicon sources on 2026-10-28
          </caption>
          <thead>
            <tr>
              <th scope="col">Need</th>
              <th scope="col">Existing record type</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {PROTOCOL.map(([need, nsid, status]) => (
              <tr key={need}>
                <th scope="row">{need}</th>
                <td>
                  <code>{nsid}</code>
                </td>
                <td className={`proto-status proto-status--${status}`}>{PROTOCOL_LABEL[status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Two details matter more than they look. Records can be edited in place and deleted without
        a tombstone; a reference that pins a version can tell that its target changed, but not what
        it used to say, though caches may still hold copies. So a correction needs to point at the
        exact version it corrects. And the main Bluesky app view indexes only its own record
        types: a reply aimed at a blog document is stored, but judging from the app view’s code
        (not tested live) it would be treated as an invalid reply. Portability of records is real;
        portability of conversation is not automatic.
      </p>
      <p className="aside">
        Full notes with field names, pinned lexicon revisions and caveats:{' '}
        <a href={repoFile('docs/research/ATPROTO-COMMUNITY.md')}>ATPROTO-COMMUNITY.md</a>. The
        demonstration above uses real record types where they exist and a placeholder{' '}
        <code>example.postack.*</code> namespace where they do not.
      </p>

      <h2>What portability does not buy</h2>
      <p>
        Owning your records does not mean anyone sees them, that they stay online, or that they
        are right. Moderation labels apply only where an interface chooses to honour them.
        Whoever runs the popular view still decides what most people see; portability moves that
        power around rather than removing it. The fixture dispute above stands in for that
        objection; it is a real problem, and this project does not have an answer to it yet.
      </p>

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
