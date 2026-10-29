#!/usr/bin/env node
// Photo Frame Commons, slice A: a bounded, reproducible snapshot of the public
// problem-solving history of wesbos/photo-frame-dashboard.
//
// Reads, never writes, through the authenticated gh CLI (GraphQL for issues,
// pull requests and their conversations; REST for the file tree and blobs).
// Full text goes to corpus/commons/.cache/ (gitignored): comments belong to
// their authors, so the repository commits only metadata, content hashes and
// the short excerpts that authored records quote. The committed manifest is
// the provenance: what was read, when, at which revision, and how complete.
//
// Usage: node scripts/commons/snapshot.mjs [--docs-only]
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'

export const OWNER = 'wesbos'
export const NAME = 'photo-frame-dashboard'
const REPO = `${OWNER}/${NAME}`
const root = new URL('../../corpus/commons/', import.meta.url)
const cache = new URL('.cache/', root)
mkdirSync(cache, { recursive: true })

const sha256 = (text) => createHash('sha256').update(text).digest('hex')
const gh = (args) => execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })
let graphqlCalls = 0
const graphql = (query, vars) => {
  graphqlCalls++
  const args = ['api', 'graphql', '-f', `query=${query}`]
  for (const [k, v] of Object.entries(vars)) if (v !== null && v !== undefined) args.push('-F', `${k}=${v}`)
  const out = JSON.parse(gh(args))
  if (out.errors) throw new Error(JSON.stringify(out.errors))
  return out.data
}

const AUTHOR = 'author { login __typename }'
const COMMENTS = `comments(first: 100) { totalCount pageInfo { hasNextPage } nodes { databaseId url ${AUTHOR} createdAt updatedAt lastEditedAt body } }`
const XREFS = `timelineItems(first: 100, itemTypes: [CROSS_REFERENCED_EVENT, CONNECTED_EVENT, MARKED_AS_DUPLICATE_EVENT, CLOSED_EVENT]) {
  totalCount pageInfo { hasNextPage }
  nodes {
    __typename
    ... on CrossReferencedEvent { createdAt willCloseTarget source { __typename ... on Issue { number repository { nameWithOwner } } ... on PullRequest { number repository { nameWithOwner } } } }
    ... on ConnectedEvent { createdAt subject { __typename ... on Issue { number } ... on PullRequest { number } } }
    ... on MarkedAsDuplicateEvent { createdAt canonical { __typename ... on Issue { number } ... on PullRequest { number } } }
    ... on ClosedEvent { createdAt stateReason closer { __typename ... on PullRequest { number } ... on Commit { oid } } }
  } }`
const COMMON = `number url title ${AUTHOR} createdAt updatedAt lastEditedAt closedAt state body labels(first: 20) { nodes { name } } ${COMMENTS} ${XREFS}`

const ISSUES = `query($cursor: String) { repository(owner: "${OWNER}", name: "${NAME}") { issues(first: 25, after: $cursor, orderBy: {field: CREATED_AT, direction: ASC}) {
  totalCount pageInfo { hasNextPage endCursor } nodes { ${COMMON} stateReason } } } }`
const PULLS = `query($cursor: String) { repository(owner: "${OWNER}", name: "${NAME}") { pullRequests(first: 20, after: $cursor, orderBy: {field: CREATED_AT, direction: ASC}) {
  totalCount pageInfo { hasNextPage endCursor } nodes { ${COMMON} merged mergedAt mergedBy { login } mergeCommit { oid } baseRefName headRefName isDraft additions deletions
  closingIssuesReferences(first: 20) { nodes { number } }
  files(first: 100) { totalCount nodes { path additions deletions } }
  commits(first: 100) { totalCount nodes { commit { oid messageHeadline authoredDate author { name user { login } } } } }
  reviews(first: 50) { totalCount nodes { databaseId url ${AUTHOR} state submittedAt body } } } } } }`
const DISCUSSIONS = `query($cursor: String) { repository(owner: "${OWNER}", name: "${NAME}") { discussions(first: 25, after: $cursor) {
  totalCount pageInfo { hasNextPage endCursor } nodes { number url title ${AUTHOR} createdAt updatedAt body category { name }
  comments(first: 50) { totalCount nodes { databaseId url ${AUTHOR} createdAt body } } } } } }`

function pageAll(query, path) {
  const nodes = []
  let cursor = null
  let total = 0
  do {
    const data = graphql(query, { cursor })
    const conn = path(data)
    total = conn.totalCount
    nodes.push(...conn.nodes)
    cursor = conn.pageInfo.hasNextPage ? conn.pageInfo.endCursor : null
  } while (cursor)
  return { total, nodes }
}

/** Fetches the rest of a conversation when the first page was not enough. */
function restComments(number) {
  return JSON.parse(gh(['api', '--paginate', `repos/${REPO}/issues/${number}/comments`])).map((c) => ({
    databaseId: c.id, url: c.html_url, author: c.user ? { login: c.user.login, __typename: c.user.type } : null,
    createdAt: c.created_at, updatedAt: c.updated_at, lastEditedAt: null, body: c.body ?? '',
  }))
}

const login = (a) => (a ? a.login : null)
const actorType = (a) => (a ? (a.__typename === 'Bot' || /\[bot\]$/.test(a.login) ? 'bot' : 'user') : 'ghost')

/** Explicit textual references to other threads in this repository: #123 and full URLs. */
export function textRefs(body) {
  const refs = new Set()
  for (const m of (body ?? '').matchAll(/(?:^|[^\w&/])#(\d{1,4})\b/g)) refs.add(Number(m[1]))
  for (const m of (body ?? '').matchAll(/github\.com\/wesbos\/photo-frame-dashboard\/(?:issues|pull)\/(\d+)/g)) refs.add(Number(m[1]))
  return [...refs].sort((a, b) => a - b)
}

const commentMeta = (c, parent) => ({
  id: c.databaseId, url: c.url, author: login(c.author), authorType: actorType(c.author),
  createdAt: c.createdAt, updatedAt: c.updatedAt ?? null, edited: !!c.lastEditedAt,
  bytes: Buffer.byteLength(c.body ?? ''), sha256: sha256(c.body ?? ''),
  refs: textRefs(c.body).filter((n) => n !== parent),
})

function xrefsOf(node) {
  const out = []
  for (const t of node.timelineItems.nodes) {
    if (t.__typename === 'CrossReferencedEvent' && t.source?.repository?.nameWithOwner === REPO) {
      out.push({ kind: t.willCloseTarget ? 'will-close' : 'cross-referenced', from: t.source.number, at: t.createdAt })
    } else if (t.__typename === 'ConnectedEvent' && t.subject?.number) {
      out.push({ kind: 'connected', to: t.subject.number, at: t.createdAt })
    } else if (t.__typename === 'MarkedAsDuplicateEvent' && t.canonical?.number) {
      out.push({ kind: 'duplicate-of', to: t.canonical.number, at: t.createdAt })
    } else if (t.__typename === 'ClosedEvent') {
      out.push({ kind: 'closed', at: t.createdAt, reason: t.stateReason ?? null, ...(t.closer?.number ? { byPull: t.closer.number } : {}), ...(t.closer?.oid ? { byCommit: t.closer.oid } : {}) })
    }
  }
  return out
}

const coverage = []
function thread(node, type) {
  let comments = node.comments.nodes
  if (node.comments.pageInfo?.hasNextPage) {
    comments = restComments(node.number)
    coverage.push(`#${node.number}: ${node.comments.totalCount} comments, fetched beyond the first page via REST`)
  }
  if (node.timelineItems.pageInfo.hasNextPage) coverage.push(`#${node.number}: timeline truncated at 100 of ${node.timelineItems.totalCount} events`)
  const full = {
    number: node.number, type, title: node.title, body: node.body ?? '',
    comments: comments.map((c) => ({ id: c.databaseId, author: login(c.author), body: c.body ?? '' })),
  }
  const meta = {
    number: node.number, type, url: node.url, title: node.title,
    author: login(node.author), authorType: actorType(node.author),
    createdAt: node.createdAt, updatedAt: node.updatedAt, closedAt: node.closedAt, edited: !!node.lastEditedAt,
    state: node.state, ...(node.stateReason ? { stateReason: node.stateReason } : {}),
    labels: node.labels.nodes.map((l) => l.name),
    bytes: Buffer.byteLength(node.body ?? ''), sha256: sha256(node.body ?? ''),
    refs: textRefs(node.body).filter((n) => n !== node.number),
    timeline: xrefsOf(node),
    comments: comments.map((c) => commentMeta(c, node.number)),
  }
  if (type === 'pull') {
    if (node.files.totalCount > 100) coverage.push(`#${node.number}: ${node.files.totalCount} files, first 100 recorded`)
    if (node.commits.totalCount > 100) coverage.push(`#${node.number}: ${node.commits.totalCount} commits, first 100 recorded`)
    Object.assign(meta, {
      merged: node.merged, mergedAt: node.mergedAt, mergedBy: node.mergedBy?.login ?? null,
      mergeCommit: node.mergeCommit?.oid ?? null, base: node.baseRefName, head: node.headRefName, draft: node.isDraft,
      additions: node.additions, deletions: node.deletions,
      closes: node.closingIssuesReferences.nodes.map((n) => n.number),
      files: node.files.nodes.map((f) => f.path),
      commits: node.commits.nodes.map((c) => ({
        oid: c.commit.oid, headline: c.commit.messageHeadline, at: c.commit.authoredDate,
        author: c.commit.author?.user?.login ?? null,
      })),
      reviews: node.reviews.nodes.map((r) => ({
        id: r.databaseId, url: r.url, author: login(r.author), authorType: actorType(r.author), state: r.state,
        at: r.submittedAt, bytes: Buffer.byteLength(r.body ?? ''), sha256: sha256(r.body ?? ''),
      })),
    })
    full.reviews = node.reviews.nodes.filter((r) => r.body).map((r) => ({ id: r.databaseId, author: login(r.author), body: r.body }))
  }
  return { meta, full }
}

// --- the repository at one revision --------------------------------------
const snapshotAt = new Date().toISOString()
const head = JSON.parse(gh(['api', `repos/${REPO}/commits/main`]))
const repo = JSON.parse(gh(['api', `repos/${REPO}`]))
const tree = JSON.parse(gh(['api', `repos/${REPO}/git/trees/${head.sha}?recursive=1`]))
if (tree.truncated) coverage.push('file tree truncated by the API')
const docPaths = tree.tree
  .filter((t) => t.type === 'blob' && /\.md$/i.test(t.path) && !t.path.startsWith('.agents/'))
  .map((t) => ({ path: t.path, blob: t.sha, bytes: t.size }))
const docs = []
for (const d of docPaths) {
  const text = gh(['api', '-H', 'Accept: application/vnd.github.raw', `repos/${REPO}/contents/${d.path}?ref=${head.sha}`])
  writeFileSync(new URL(`doc--${d.path.replace(/\//g, '--')}`, cache), text)
  docs.push({ ...d, sha256: sha256(text), url: `https://github.com/${REPO}/blob/${head.sha}/${d.path}` })
}

let threads = []
const full = []
let totals = {}
if (!process.argv.includes('--docs-only')) {
  const issues = pageAll(ISSUES, (d) => d.repository.issues)
  const pulls = pageAll(PULLS, (d) => d.repository.pullRequests)
  const discussions = pageAll(DISCUSSIONS, (d) => d.repository.discussions)
  totals = { issues: issues.total, pulls: pulls.total, discussions: discussions.total }
  for (const n of issues.nodes) { const t = thread(n, 'issue'); threads.push(t.meta); full.push(t.full) }
  for (const n of pulls.nodes) { const t = thread(n, 'pull'); threads.push(t.meta); full.push(t.full) }
  for (const n of discussions.nodes) {
    if (n.comments.totalCount > 50) coverage.push(`discussion ${n.number}: ${n.comments.totalCount} comments, first 50 recorded`)
    threads.push({
      number: n.number, type: 'discussion', url: n.url, title: n.title, author: login(n.author), authorType: actorType(n.author),
      createdAt: n.createdAt, updatedAt: n.updatedAt, category: n.category?.name ?? null,
      bytes: Buffer.byteLength(n.body ?? ''), sha256: sha256(n.body ?? ''), refs: textRefs(n.body),
      comments: n.comments.nodes.map((c) => commentMeta(c, null)),
    })
    full.push({ number: n.number, type: 'discussion', title: n.title, body: n.body ?? '', comments: n.comments.nodes.map((c) => ({ id: c.databaseId, author: login(c.author), body: c.body ?? '' })) })
  }
  threads.sort((a, b) => a.type.localeCompare(b.type) || a.number - b.number)
  for (const want of ['issues', 'pulls', 'discussions']) {
    const got = threads.filter((t) => `${t.type}s` === want || (want === 'pulls' && t.type === 'pull')).length
    if (got !== totals[want]) coverage.push(`${want}: API reported ${totals[want]}, received ${got}`)
  }
  writeFileSync(new URL('threads.json', cache), `${JSON.stringify(full, null, 1)}\n`)
}

const rate = JSON.parse(gh(['api', 'rate_limit'])).resources
const manifest = {
  $schema: 'postack.commons.snapshot/1',
  repository: REPO,
  url: repo.html_url,
  license: repo.license?.spdx_id ?? null,
  licenseNote:
    'The repository is MIT-licensed. Issue and pull request text is not covered by that file and stays with its authors: only metadata, hashes and short quoted excerpts are committed here.',
  defaultBranch: repo.default_branch,
  revision: head.sha,
  revisionDate: head.commit.committer.date,
  snapshotAt,
  method: 'gh CLI, authenticated read-only: GraphQL for threads, REST for tree, blobs and overflow comments',
  apiCalls: { graphql: graphqlCalls, rateRemaining: { core: rate.core.remaining, graphql: rate.graphql.remaining } },
  totals: { ...totals, docs: docs.length },
  coverage: coverage.length ? coverage : ['complete: every thread and comment the API reported was received'],
  exclusions: [
    'Inline review comments on diff lines (only review summaries are recorded)',
    'Reactions, assignees, milestones and project boards',
    'Files under .agents/ and all non-Markdown files (code is linked by path, not snapshotted)',
    'Content of forks, linked external sites and attachments',
  ],
  docs,
  threads,
}
writeFileSync(new URL('manifest.json', root), `${JSON.stringify(manifest, null, 1)}\n`)
console.log(`snapshot ${snapshotAt} @ ${head.sha.slice(0, 12)}: ${threads.length} threads, ${docs.length} docs, ${graphqlCalls} GraphQL calls`)
for (const c of manifest.coverage) console.log(`  coverage: ${c}`)
