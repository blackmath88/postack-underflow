#!/usr/bin/env node
// Photo Frame Commons: checks that every source the interface links to still
// resolves. Network, read-only, not part of CI. Threads and pinned documents
// are fetched once each (HEAD, following redirects); comment anchors cannot be
// checked over HTTP, so their ids are checked against the manifest instead
// (scripts/commons/check-records.mjs).
import { readFileSync } from 'node:fs'

const view = JSON.parse(readFileSync(new URL('../../src/data/commons-view.json', import.meta.url), 'utf8'))
const urls = [...new Set(Object.values(view.sources).map((s) => s.url.split('#')[0]))].sort()
const bad = []
for (const url of urls) {
  const r = await fetch(url, { method: 'HEAD', redirect: 'follow', headers: { 'user-agent': 'postack-underflow link check (read-only)' } })
  if (!r.ok) bad.push(`${r.status} ${url}`)
  await new Promise((res) => setTimeout(res, 250))
}
for (const b of bad) console.error(`✗ ${b}`)
console.log(`commons links: ${urls.length - bad.length} of ${urls.length} source URLs resolve`)
process.exit(bad.length ? 1 : 0)
