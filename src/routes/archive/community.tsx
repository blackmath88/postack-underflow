import { Link, createFileRoute } from '@tanstack/react-router'
import { PageIntro } from '../../components/PageIntro'
import { Src } from '../../components/Src'
import { Status } from '../../components/Status'
import { pageTitle } from '../../content/site'
import { repoFile } from '../../content/sources'

export const Route = createFileRoute('/archive/community')({
  head: () => ({ meta: [{ title: pageTitle('Archive: community and protocols') }] }),
  component: CommunityArchive,
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

function CommunityArchive() {
  return (
    <>
      <PageIntro index="§" kicker="Archive · community" title="Community, judgement and protocols">
        <p>
          The longer version of the Switchboard: what a Q&amp;A site’s mechanisms did, the two-layer model,
          what existing protocols provide and what they do not.
        </p>
      </PageIntro>
      <p className="archive-banner">
        Story: <Link to="/community/">The Switchboard</Link> · <Link to="/archive/">Archive index</Link>
      </p>

      <h2 id="signals">It was never just answers</h2>
      <p>
        It is tempting to remember Stack Overflow as a database of answers. It worked more like a machine for
        collective judgement, built from small mechanisms that each did one thing imperfectly (its own{' '}
        <Src id="soTour">tour</Src> describes them). Together they let you rely on a stranger’s reply, or doubt
        it with reason.
      </p>
      <div className="table-wrap wide">
        <table>
          <caption className="kicker table-caption">Signals and their costs (our reading, not a measured study)</caption>
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
        None of these signals proves an answer true. What they did was make disagreement and correction{' '}
        <em>visible</em>, attached to the answer itself. They also all depended on one site existing, being
        trusted and staying online.
      </p>

      <h2 id="model">A model in two layers</h2>
      <p>
        <Status kind="hypothesis" />
        Separate two things that one platform used to hold together:
      </p>
      <ol>
        <li>
          <strong>Contributions</strong>: an article, a reply, a correction, an endorsement, a dispute. Each is
          published by its author, in a place the author controls, under the author’s identity, and can name
          what it responds to.
        </li>
        <li>
          <strong>Relations</strong>: the lines an interface draws between contributions to show them as a
          thread, a forum, or a map. Some come straight from the authors’ own references; others are an
          editor’s grouping or a model’s guess. Every relation has a reason and an origin you can see.
        </li>
      </ol>
      <p>
        An interface assembles contributions; it does not own their original context. If the interface
        disappears, the contributions are still where their authors put them.
      </p>
      <p>
        Writing connections as contracts with histories forced distinctions that simple on/off layers hid. An
        author-declared reply cannot be accepted or disputed by a view at all. A model’s suggestion can be
        proposed and disputed, but never accepted as the author’s word. A deleted record is a withdrawal only
        its author could make.
      </p>

      <h2 id="protocol">What exists today, and what does not</h2>
      <p>
        The <Src id="atproto">AT Protocol</Src> already provides much of the first layer. Accounts own
        repositories of signed records; anyone with a domain can define a schema, called a Lexicon; and a
        reference can pin one exact version of another record. <Src id="standardSite">Standard.site</Src>{' '}
        defines records for publications and documents, including a field linking a document to a Bluesky
        thread that acts as its comment section. What we could not find is any shared schema for the judgement
        layer.
      </p>
      <div className="table-wrap wide">
        <table>
          <caption className="kicker table-caption">Checked against lexicon sources on 2026-10-28</caption>
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
        Two details matter more than they look. Records can be edited in place and deleted without a
        tombstone; a reference that pins a version can tell that its target changed, but not what it used to
        say, though caches may still hold copies. So a correction needs to point at the exact version it
        corrects. And the main Bluesky app view indexes only its own record types: a reply aimed at a blog
        document is stored, but judging from the app view’s code (not tested live) it would be treated as an
        invalid reply. Portability of records is real; portability of conversation is not automatic.
      </p>
      <p className="aside">
        Full notes with field names, pinned lexicon revisions and caveats:{' '}
        <a href={repoFile('docs/research/ATPROTO-COMMUNITY.md')}>ATPROTO-COMMUNITY.md</a>. The Switchboard uses
        real record types where they exist and a placeholder <code>example.postack.*</code> namespace where they
        do not. Nothing is read from or published to any network.
      </p>

      <h2 id="limits">What portability does not buy</h2>
      <p>
        Owning your records does not mean anyone sees them, that they stay online, or that they are right.
        Moderation labels apply only where an interface chooses to honour them. Whoever runs the popular view
        still decides what most people see; portability moves that power around rather than removing it. The
        fixture dispute on the Switchboard stands in for that objection; it is a real problem, and this project
        does not have an answer to it yet.
      </p>
    </>
  )
}
