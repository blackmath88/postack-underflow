#!/usr/bin/env node
// Offline step 1: fetch every source in corpus/sources.json at its pinned
// revision into corpus/.cache/ (gitignored) and record a sha256 per snapshot
// in corpus/snapshots.lock.json. Re-running against an existing lock fails if
// a pinned file changed, so the index can be rebuilt from identical inputs.
// Issues are not revisioned; their lock entry records the snapshot hash and
// any drift is reported rather than silently accepted.
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const root = new URL('../corpus/', import.meta.url)
const cache = new URL('.cache/', root)
const lockFile = new URL('snapshots.lock.json', root)
mkdirSync(cache, { recursive: true })

const sources = JSON.parse(readFileSync(new URL('sources.json', root), 'utf8'))
const lock = existsSync(lockFile) ? JSON.parse(readFileSync(lockFile, 'utf8')) : {}
const update = process.argv.includes('--update-lock')

async function fetchText(source) {
  if (source.kind === 'issue' || source.kind === 'discussion') {
    // Title, body and comments as plain text, via the authenticated gh CLI.
    const api = source.rawUrl.replace('https://api.github.com/', '')
    const issue = JSON.parse(execFileSync('gh', ['api', api], { encoding: 'utf8' }))
    const comments = JSON.parse(
      execFileSync('gh', ['api', '--paginate', `${api}/comments`], { encoding: 'utf8' }),
    )
    return [issue.title, issue.body ?? '', ...comments.map((c) => c.body ?? '')].join('\n\n')
  }
  const res = await fetch(source.rawUrl)
  if (!res.ok) throw new Error(`${source.id}: HTTP ${res.status} for ${source.rawUrl}`)
  return res.text()
}

let drift = 0
for (const source of sources) {
  const text = await fetchText(source)
  const sha256 = createHash('sha256').update(text).digest('hex')
  writeFileSync(new URL(`${source.id}.txt`, cache), text)
  const previous = lock[source.id]?.sha256
  if (previous && previous !== sha256) {
    drift++
    console.warn(`drift: ${source.id} changed since the lock (${previous.slice(0, 12)} → ${sha256.slice(0, 12)})`)
    if (!update) continue
  }
  lock[source.id] = { sha256, bytes: Buffer.byteLength(text), revision: source.revision }
  console.log(`${source.id}: ${Buffer.byteLength(text)} bytes`)
}

const sorted = Object.fromEntries(Object.entries(lock).sort(([a], [b]) => a.localeCompare(b)))
writeFileSync(lockFile, `${JSON.stringify(sorted, null, 2)}\n`)
if (drift && !update) {
  console.error(`${drift} snapshot(s) drifted; rerun with --update-lock to accept new versions`)
  process.exit(1)
}
