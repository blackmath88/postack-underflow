// The encounter: Wes Bos's photo-frame repository, as observed on
// 2026-10-28. The Syntax #1050 episode does not name the repository; the
// identification is ours (see docs/research/CASE-PHOTO-FRAME.md).

export const PHOTO_FRAME = {
  repo: 'wesbos/photo-frame-dashboard',
  url: 'https://github.com/wesbos/photo-frame-dashboard',
  pinnedCommit: '0bff55ef3fb2a3bfdab05bc8e3bd0c9d69f63189',
  license: 'MIT',
  created: '2026-10-08',
  observedAt: '2026-10-28T13:05Z',
  counts: {
    pullRequests: 201,
    merged: 150,
    open: 21,
    closedUnmerged: 30,
    issues: 56,
    issuesClosed: 49,
    deviceIndexRows: 72,
  },
  /** Crude heuristic: PR descriptions mentioning an AI tool or agent. */
  agentMentionSample: { mentioning: 33, of: 40 },
  readmeUrl: 'https://github.com/wesbos/photo-frame-dashboard/blob/0bff55ef3fb2a3bfdab05bc8e3bd0c9d69f63189/README.md',
  episode: {
    url: 'https://syntax.fm/show/1050/everyone-is-hacking-their-tv/transcript',
    frameHackingAt: '~31:03',
    agentContributionsAt: '~59:30',
  },
} as const
