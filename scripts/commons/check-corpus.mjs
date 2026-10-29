#!/usr/bin/env node
// Photo Frame Commons: checks the committed snapshot manifest, and, when the
// local cache from `npm run commons:snapshot` exists, that every cached text
// still has the hash the manifest recorded. Without the cache the hash check is
// skipped and says so; it never passes silently.
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'

const root = new URL('../../corpus/commons/', import.meta.url)
const manifest = JSON.parse(readFileSync(new URL('manifest.json', root), 'utf8'))
const sha256 = (t) => createHash('sha256').update(t).digest('hex')
const errors = []
const fail = (m) => errors.push(m)

if (manifest.$schema !== 'postack.commons.snapshot/1') fail('unknown manifest schema')
if (!/^[0-9a-f]{40}$/.test(manifest.revision)) fail('revision is not a commit SHA')
for (const [kind, type] of [['issues', 'issue'], ['pulls', 'pull'], ['discussions', 'discussion']]) {
  const got = manifest.threads.filter((t) => t.type === type).length
  if (got !== manifest.totals[kind]) fail(`${kind}: totals say ${manifest.totals[kind]}, manifest holds ${got}`)
}
const seen = new Set()
for (const t of manifest.threads) {
  const key = `${t.type}:${t.number}`
  if (seen.has(key)) fail(`duplicate ${key}`)
  seen.add(key)
  if (!t.url.startsWith(`https://github.com/${manifest.repository}/`)) fail(`${key}: url outside the repository`)
  if (!/^[0-9a-f]{64}$/.test(t.sha256)) fail(`${key}: missing body hash`)
  for (const c of t.comments) if (!c.url || !/^[0-9a-f]{64}$/.test(c.sha256)) fail(`${key}: comment ${c.id} lacks url or hash`)
}
for (const d of manifest.docs) if (!d.url.includes(manifest.revision)) fail(`${d.path}: doc url not pinned to the revision`)

const cache = new URL('.cache/', root)
let checked = 0
if (existsSync(new URL('threads.json', cache))) {
  const full = JSON.parse(readFileSync(new URL('threads.json', cache), 'utf8'))
  const byKey = new Map(full.map((t) => [`${t.type}:${t.number}`, t]))
  for (const t of manifest.threads) {
    const f = byKey.get(`${t.type}:${t.number}`)
    if (!f) { fail(`cache lacks ${t.type}:${t.number}`); continue }
    if (sha256(f.body) !== t.sha256) fail(`${t.type}:${t.number}: body differs from the manifest hash`)
    checked++
    const comments = new Map(f.comments.map((c) => [c.id, c.body]))
    for (const c of t.comments) {
      if (!comments.has(c.id)) fail(`cache lacks comment ${c.id}`)
      else if (sha256(comments.get(c.id)) !== c.sha256) fail(`comment ${c.id} differs from the manifest hash`)
      else checked++
    }
  }
  for (const d of manifest.docs) {
    const file = new URL(`doc--${d.path.replace(/\//g, '--')}`, cache)
    if (!existsSync(file)) fail(`cache lacks ${d.path}`)
    else if (sha256(readFileSync(file, 'utf8')) !== d.sha256) fail(`${d.path}: differs from the manifest hash`)
    else checked++
  }
} else {
  console.log('commons corpus: no local cache, so content hashes were not checked (run npm run commons:snapshot)')
}

if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`)
  process.exit(1)
}
console.log(
  `commons corpus: ${manifest.threads.length} threads and ${manifest.docs.length} docs at ${manifest.revision.slice(0, 12)}, snapshot ${manifest.snapshotAt}` +
    (checked ? `; ${checked} cached texts match their hashes` : ''),
)
