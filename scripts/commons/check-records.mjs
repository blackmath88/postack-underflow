#!/usr/bin/env node
// Photo Frame Commons: checks the authored problem records against the
// snapshot. Structural checks always run: every reference resolves to a
// thread, comment or pinned document in the manifest, and every internal link
// resolves. When the local cache exists, every quote is also checked to be a
// verbatim substring of the text it cites (for documents, of the cited lines).
import { existsSync, readFileSync } from 'node:fs'

const root = new URL('../../corpus/commons/', import.meta.url)
const read = (f) => JSON.parse(readFileSync(new URL(f, root), 'utf8'))
const manifest = read('manifest.json')
const { problems } = read('problems.json')
const corrections = existsSync(new URL('corrections.json', root)) ? read('corrections.json').corrections : []
const errors = []
const fail = (m) => errors.push(m)

const threads = new Map(manifest.threads.map((t) => [`${t.type}/${t.number}`, t]))
const docs = new Map(manifest.docs.map((d) => [d.path, d]))
const cacheDir = new URL('.cache/', root)
const haveCache = existsSync(new URL('threads.json', cacheDir))
const full = haveCache ? new Map(JSON.parse(readFileSync(new URL('threads.json', cacheDir), 'utf8')).map((t) => [`${t.type}/${t.number}`, t])) : null

/** The text a reference points at, or undefined when only metadata is available. */
function sourceText(ref) {
  if (ref.doc) {
    if (!full) return undefined
    const lines = readFileSync(new URL(`doc--${ref.doc.replace(/\//g, '--')}`, cacheDir), 'utf8').split('\n')
    return lines.slice(ref.lines[0] - 1, ref.lines[1]).join('\n')
  }
  const t = full?.get(ref.thread)
  if (!t) return undefined
  if (ref.comment) return t.comments.find((c) => c.id === ref.comment)?.body
  return `${t.title}\n${t.body}`
}

let quotes = 0
function checkRef(where, ref, quote) {
  if (ref.doc) {
    const d = docs.get(ref.doc)
    if (!d) return fail(`${where}: document ${ref.doc} is not in the snapshot`)
    if (!Array.isArray(ref.lines) || ref.lines[0] > ref.lines[1]) fail(`${where}: bad line range`)
  } else {
    const t = threads.get(ref.thread)
    if (!t) return fail(`${where}: ${ref.thread} is not in the snapshot`)
    if (ref.comment && !t.comments.some((c) => c.id === ref.comment)) fail(`${where}: comment ${ref.comment} is not on ${ref.thread}`)
  }
  if (quote) {
    if (quote.split(/\s+/).length > 25) fail(`${where}: quote longer than 25 words`)
    const text = sourceText(ref)
    if (text !== undefined) {
      if (!text.replace(/\r/g, '').includes(quote)) fail(`${where}: quote not found verbatim in its source: "${quote}"`)
      else quotes++
    }
  }
}

const ids = new Set(problems.map((p) => p.id))
const STATUS = new Set(['documented', 'partly-solved', 'unsolved', 'no-reviewed-route', 'fixed-in-code', 'in-review', 'declined'])
const RESULT = new Set(['worked', 'failed', 'untested', 'unreviewed', 'in-review'])
const BASIS = new Set(['source-declared', 'deterministic', 'editorial', 'machine-proposal'])
if (ids.size !== problems.length) fail('duplicate problem ids')
for (const p of problems) {
  if (!STATUS.has(p.status)) fail(`${p.id}: unknown status ${p.status}`)
  const ev = new Set(p.evidence.map((e) => e.id))
  if (ev.size !== p.evidence.length) fail(`${p.id}: duplicate evidence ids`)
  for (const e of p.evidence) checkRef(`${p.id}/${e.id}`, e.ref, e.quote)
  for (const a of p.approaches) for (const r of a.reports) {
    if (!ev.has(r.evidence)) fail(`${p.id}/${a.id}: unknown evidence ${r.evidence}`)
    if (!RESULT.has(r.result)) fail(`${p.id}/${a.id}: unknown result ${r.result}`)
  }
  for (const r of p.related) {
    if (!ids.has(r.to)) fail(`${p.id}: related to unknown ${r.to}`)
    if (!BASIS.has(r.basis)) fail(`${p.id}: unknown relation basis ${r.basis}`)
    if (r.basis === 'source-declared' && !r.evidence) fail(`${p.id} → ${r.to}: a source-declared relation must cite its evidence`)
    if (r.evidence && !ev.has(r.evidence)) fail(`${p.id} → ${r.to}: unknown evidence ${r.evidence}`)
  }
}
for (const c of corrections) {
  if (!ids.has(c.problem)) fail(`correction ${c.id}: unknown problem ${c.problem}`)
  checkRef(`correction ${c.id}`, c.ref, c.quote)
  if (c.qualifies) checkRef(`correction ${c.id} (qualifies)`, c.qualifies.ref, c.qualifies.quote)
}

if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`)
  process.exit(1)
}
console.log(
  `commons records: ${problems.length} problems, ${problems.reduce((n, p) => n + p.evidence.length, 0)} evidence items, ${corrections.length} corrections; ` +
    (haveCache ? `${quotes} quotes verified verbatim` : 'no local cache, so quotes were not checked against their sources'),
)
