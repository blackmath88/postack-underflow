#!/usr/bin/env node
// Photo Frame Commons, slice D: a read-only snapshot of public ATProto records
// that reference the photo-frame repository. No account, no authentication, no
// writes. Three public services are read:
//   - constellation.microcosm.blue: a public backlink index over the network,
//     asked which records link each thread URL in the GitHub snapshot
//   - api.bsky.app searchPosts: the Bluesky AppView's text search, for posts
//     that mention the repository without linking a thread (public.api.bsky.app
//     refuses search with 403; that refusal is recorded, not worked around)
//   - each author's own PDS (found through plc.directory), to read the record
//     where it actually lives, with its CID
// Only metadata, link targets and a short excerpt are kept. Writes
// corpus/commons/atproto.json.
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'

const root = new URL('../../corpus/commons/', import.meta.url)
const manifest = JSON.parse(readFileSync(new URL('manifest.json', root), 'utf8'))
const REPO_URL = `https://github.com/${manifest.repository}`
const UA = { 'user-agent': 'postack-underflow commons research (read-only)' }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const log = []
async function get(url) {
  const r = await fetch(url, { headers: UA })
  log.push({ url: url.replace(/\?.*/, ''), status: r.status })
  if (!r.ok) return { status: r.status }
  return { status: r.status, body: await r.json() }
}
const sha256 = (t) => createHash('sha256').update(t).digest('hex')
const excerpt = (text, words = 20) => {
  const w = text.replace(/\s+/g, ' ').trim().split(' ')
  return w.length > words ? `${w.slice(0, words).join(' ')} …` : w.join(' ')
}

// --- 1. who links which thread -------------------------------------------------
const targets = [REPO_URL, ...manifest.threads.map((t) => t.url)]
const backlinks = []
for (const url of targets) {
  for (const target of [url, `${url}/`]) {
    const all = await get(`https://constellation.microcosm.blue/links/all?target=${encodeURIComponent(target)}`)
    await sleep(120)
    for (const [collection, paths] of Object.entries(all.body?.links ?? {})) {
      for (const path of Object.keys(paths)) {
        const list = await get(`https://constellation.microcosm.blue/links?target=${encodeURIComponent(target)}&collection=${encodeURIComponent(collection)}&path=${encodeURIComponent(path)}`)
        await sleep(120)
        for (const r of list.body?.linking_records ?? []) backlinks.push({ target, collection, path, uri: `at://${r.did}/${r.collection}/${r.rkey}` })
      }
    }
  }
}

// --- 2. text search, for mentions without a link ----------------------------------
const refused = await get('https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=photo-frame-dashboard&limit=1')
const search = await get('https://api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=photo-frame-dashboard&limit=100')
const mentionUris = (search.body?.posts ?? [])
  .filter((p) => JSON.stringify(p.record).includes('github.com/wesbos/photo-frame-dashboard'))
  .map((p) => p.uri)

// --- 3. read each record where it lives -------------------------------------------
const uris = [...new Set([...backlinks.map((b) => b.uri), ...mentionUris])]
// Threads: include the parents and replies of each referencing post, so the
// discussion around a link is visible, not only the link.
const threadUris = new Set(uris)
for (const uri of uris) {
  const t = await get(`https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(uri)}&depth=4&parentHeight=4`)
  await sleep(120)
  const walk = (n) => {
    if (!n?.post) return
    threadUris.add(n.post.uri)
    for (const r of n.replies ?? []) walk(r)
  }
  walk(t.body?.thread)
  for (let p = t.body?.thread?.parent; p?.post; p = p.parent) threadUris.add(p.post.uri)
}

const pds = {}
const records = []
for (const uri of [...threadUris].sort()) {
  const [, , did, collection, rkey] = uri.split('/')
  if (!pds[did]) {
    const doc = await get(`https://plc.directory/${did}`)
    pds[did] = {
      handle: doc.body?.alsoKnownAs?.[0]?.replace('at://', '') ?? null,
      pds: doc.body?.service?.find((s) => s.id === '#atproto_pds')?.serviceEndpoint ?? null,
    }
  }
  const where = pds[did].pds
  const rec = where ? await get(`${where}/xrpc/com.atproto.repo.getRecord?repo=${did}&collection=${collection}&rkey=${rkey}`) : { status: 0 }
  await sleep(120)
  if (!rec.body) {
    records.push({ uri, did, handle: pds[did].handle, pds: where, available: false, status: rec.status })
    continue
  }
  const v = rec.body.value
  const links = [
    ...(v.facets ?? []).flatMap((f) => f.features.filter((x) => x.uri).map((x) => x.uri)),
    ...(v.embed?.external?.uri ? [v.embed.external.uri] : []),
    ...(v.embed?.media?.external?.uri ? [v.embed.media.external.uri] : []),
  ]
  const mentions = (v.facets ?? []).flatMap((f) => f.features.filter((x) => x.did).map((x) => x.did))
  records.push({
    uri, cid: rec.body.cid, did, handle: pds[did].handle, pds: where, collection, available: true,
    createdAt: v.createdAt, excerpt: excerpt(v.text ?? ''), textSha256: sha256(v.text ?? ''),
    links: [...new Set(links)], mentions: [...new Set(mentions)],
    reply: v.reply ? { parent: v.reply.parent.uri, root: v.reply.root.uri } : null,
    github: [...new Set(links.filter((l) => l.startsWith(REPO_URL)).map((l) => l.replace(/\/$/, '')))],
  })
}

// Keep what bears on the repository: records that link it, and replies in the
// same threads by the authors of those records. Other people's replies are
// counted, not stored; their being near a link does not make them part of it.
const linking = records.filter((r) => r.github?.length)
const linkers = new Set(linking.map((r) => r.did))
const roots = new Set(linking.map((r) => r.reply?.root ?? r.uri))
const kept = records.filter((r) => r.github?.length || (linkers.has(r.did) && r.reply && roots.has(r.reply.root)))
const dropped = records.length - kept.length
// Text is kept only where it is context for a link: the linking records and the
// posts they reply to, up the chain. Other kept replies keep metadata only.
const byUri = new Map(records.map((r) => [r.uri, r]))
const context = new Set()
for (const r of linking) for (let x = r; x; x = x.reply ? byUri.get(x.reply.parent) : undefined) context.add(x.uri)
for (const r of kept) if (!context.has(r.uri)) { r.excerpt = null; r.textKept = false }

const out = {
  $schema: 'postack.commons.atproto/1',
  fetchedAt: new Date().toISOString(),
  method: 'Unauthenticated, read-only HTTP. No account was used and nothing was written.',
  services: {
    backlinks: 'https://constellation.microcosm.blue (links/all and links, per thread URL with and without a trailing slash)',
    search: 'https://api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=photo-frame-dashboard',
    records: "each author's PDS via com.atproto.repo.getRecord, PDS found through plc.directory",
  },
  coverage: {
    targetsQueried: targets.length * 2,
    backlinks: backlinks.length,
    searchHits: search.body?.posts?.length ?? 0,
    searchHitsLinkingRepo: mentionUris.length,
    publicSearchRefused: refused.status,
    recordsRead: records.length,
    recordsKept: kept.length,
    repliesByOthersNotKept: dropped,
    unavailable: records.filter((r) => !r.available).length,
    limits: [
      'Constellation indexes what it has seen on the firehose; records outside its window or collections it does not track are not counted.',
      'Search finds text, so posts that link only through a shortened URL or an image are missed.',
      'Likes, reposts and follows are not read.',
    ],
  },
  backlinks,
  identities: Object.fromEntries(Object.entries(pds).filter(([did]) => kept.some((r) => r.did === did))),
  records: kept,
}
writeFileSync(new URL('atproto.json', root), `${JSON.stringify(out, null, 1)}\n`)
console.log(`atproto: ${backlinks.length} backlinks, ${mentionUris.length} linking search hits, ${kept.length} records kept of ${records.length} read (${out.coverage.unavailable} unavailable); public search ${refused.status}`)
