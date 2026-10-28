import { PHOTO_FRAME } from '../data/photo-frame'

const c = PHOTO_FRAME.counts

/** The photo-frame repository as counted on GitHub, with how it was identified. */
export function PhotoFrameSpecimen() {
  return (
    <figure className="specimen specimen--source wide" aria-labelledby="pf-caption" id="photo-frame">
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
        Counted on GitHub, {PHOTO_FRAME.observedAt.replace('T', ' ').replace('Z', '')} UTC. Repository created{' '}
        {PHOTO_FRAME.created}; {PHOTO_FRAME.beforeEpisode.pullRequests} pull requests and{' '}
        {PHOTO_FRAME.beforeEpisode.issues} issues were opened before the episode aired. In the episode (around{' '}
        {PHOTO_FRAME.episode.agentContributionsAt}) Wes says his photo-frame repository has over 200 pull requests
        or issues from other people’s agents. The episode does not name the repository; identifying it as this one
        is our inference from its owner, subject, date and numbers.
      </figcaption>
    </figure>
  )
}
