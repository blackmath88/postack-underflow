#!/usr/bin/env node
// Photo Frame Commons, slice B: builds src/data/commons-index.json from the
// snapshot manifest, its local cache and the authored records.
//   records   — BM25F over the problem records (corpus/commons/problems.json)
//   threads   — BM25 over the raw text of every issue and discussion thread
//               (title, body and comments), roughly what a reader searching
//               the repository's issues would match against
// Both use the shared Four Words tokenizer and ranking; nothing of Four Words
// itself is read or changed. The output is deterministic: same inputs,
// byte-identical file. `--check` rebuilds in memory and compares.
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { buildIndex } from '../../src/lib/retrieval.ts'
import { COMMONS_WEIGHTS, problemFields, refKey } from '../../src/commons/model.ts'

const root = new URL('../../corpus/commons/', import.meta.url)
const out = new URL('../../src/data/commons-index.json', import.meta.url)
const raw = (f) => readFileSync(new URL(f, root), 'utf8')
const manifest = JSON.parse(raw('manifest.json'))
const records = JSON.parse(raw('problems.json'))
const { corrections } = JSON.parse(raw('corrections.json'))
const sha = (t) => createHash('sha256').update(t).digest('hex')

let full
try {
  full = JSON.parse(readFileSync(new URL('.cache/threads.json', root), 'utf8'))
} catch {
  console.error('commons index: no local cache; run npm run commons:snapshot first')
  process.exit(1)
}

// --- the raw-thread baseline ------------------------------------------------
// Credentials published in threads are removed before tokenising, so the
// committed postings do not republish them. Matched case-insensitively.
const REDACT = [
  { pattern: /\bYHK8{8}\b/gi, why: 'device test-app password posted in issue #135' },
]
const redact = (text) => REDACT.reduce((t, r) => t.replace(r.pattern, ' '), text)
const byKey = new Map(manifest.threads.map((t) => [`${t.type}/${t.number}`, t]))
const threadDocs = full
  .filter((t) => t.type !== 'pull')
  .map((t) => {
    const key = `${t.type}/${t.number}`
    if (sha(t.body) !== byKey.get(key)?.sha256) throw new Error(`${key}: cache differs from the manifest`)
    return { id: key, fields: { text: redact([t.title, t.body, ...t.comments.map((c) => c.body)].join('\n\n')) } }
  })
const threads = buildIndex('baseline', 'BM25 over the raw text of every issue and discussion thread', threadDocs, { text: 1 })

// --- the record index ---------------------------------------------------------
const problems = records.problems
const structured = buildIndex(
  'structured',
  'BM25F over the authored problem records (commons-v1)',
  problems.map((p) => ({ id: p.id, fields: problemFields(p) })),
  COMMONS_WEIGHTS,
)

// --- what the interface needs to show a source without the cache -------------
const sources = {}
const cite = (ref) => {
  const key = refKey(ref)
  if (sources[key]) return
  if (ref.doc) {
    const d = manifest.docs.find((x) => x.path === ref.doc)
    sources[key] = { kind: 'doc', path: d.path, url: `${d.url}#L${ref.lines[0]}${ref.lines[1] !== ref.lines[0] ? `-L${ref.lines[1]}` : ''}`, by: `repo:${manifest.repository}` }
    return
  }
  const t = byKey.get(ref.thread)
  const base = { kind: t.type, number: t.number, title: t.title, state: t.state ?? null, ...(t.type === 'pull' ? { merged: t.merged } : {}), closedAt: t.closedAt ?? null }
  if (ref.comment) {
    const c = t.comments.find((x) => x.id === ref.comment)
    sources[key] = { ...base, url: c.url, by: c.author, byType: c.authorType, at: c.createdAt, edited: c.edited, comment: true }
  } else {
    sources[key] = { ...base, url: t.url, by: t.author, byType: t.authorType, at: t.createdAt, edited: t.edited }
  }
}
for (const p of problems) for (const e of p.evidence) cite(e.ref)
for (const c of corrections) { cite(c.ref); cite(c.qualifies.ref) }
for (const d of threadDocs) cite({ thread: d.id })

/** Which records cite each thread, so a raw-thread hit can lead to its record. */
const citedBy = {}
for (const p of problems) for (const e of p.evidence) {
  if (!('thread' in e.ref)) continue
  const list = (citedBy[e.ref.thread] ??= [])
  if (!list.includes(p.id)) list.push(p.id)
}

const artifact = {
  $schema: 'postack.commons.index/1',
  version: records.version,
  repository: manifest.repository,
  revision: manifest.revision,
  snapshotAt: manifest.snapshotAt,
  recordsBy: records.authoredBy,
  recordsReview: records.review,
  inputs: { manifest: sha(raw('manifest.json')), problems: sha(raw('problems.json')), corrections: sha(raw('corrections.json')) },
  redactions: REDACT.map((r) => r.why),
  counts: { threads: manifest.threads.length, docs: manifest.docs.length, indexedThreads: threadDocs.length, problems: problems.length },
  problems,
  corrections,
  sources: Object.fromEntries(Object.entries(sources).sort(([a], [b]) => a.localeCompare(b))),
  citedBy: Object.fromEntries(Object.entries(citedBy).sort(([a], [b]) => a.localeCompare(b))),
  indexes: { structured, threads },
}
const text = `${JSON.stringify(artifact)}\n`

if (process.argv.includes('--check')) {
  const committed = readFileSync(out, 'utf8')
  if (committed !== text) {
    console.error('commons index: src/data/commons-index.json does not match a rebuild from the inputs')
    process.exit(1)
  }
  console.log(`commons index: reproduced exactly (${sha(text).slice(0, 12)})`)
} else {
  writeFileSync(out, text)
  console.log(`commons index: ${problems.length} records, ${threadDocs.length} raw threads, ${Object.keys(sources).length} sources, ${(text.length / 1024).toFixed(0)} KiB, ${sha(text).slice(0, 12)}`)
}
