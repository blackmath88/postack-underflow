#!/usr/bin/env node
// Offline step 2: build the Four Words index artifact from pinned inputs.
//   baseline   — BM25 over each source snapshot's raw text (corpus/.cache/)
//   structured — BM25F over the problem–solution records (corpus/records.json)
// Writes src/data/four-words-index.json, which the site loads at query time.
// The output is deterministic: same inputs, byte-identical file.
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { buildIndex } from '../src/lib/retrieval.ts'
import { STRUCTURED_WEIGHTS, recordFields } from '../src/lib/records.ts'

const corpus = new URL('../corpus/', import.meta.url)
const read = (name) => JSON.parse(readFileSync(new URL(name, corpus), 'utf8'))
const sources = read('sources.json')
const records = read('records.json')
const lock = read('snapshots.lock.json')

const errors = []
const snapshots = {}
for (const source of sources) {
  let text
  try {
    text = readFileSync(new URL(`.cache/${source.id}.txt`, corpus), 'utf8')
  } catch {
    errors.push(`${source.id}: no snapshot; run npm run corpus:fetch`)
    continue
  }
  const sha256 = createHash('sha256').update(text).digest('hex')
  if (lock[source.id]?.sha256 !== sha256) errors.push(`${source.id}: snapshot does not match snapshots.lock.json`)
  snapshots[source.id] = text
}
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

const started = performance.now()
const baseline = buildIndex(
  'baseline',
  'BM25 over the full raw text of each source document, as fetched at its pinned revision.',
  sources.map((s) => ({ id: s.id, fields: { text: snapshots[s.id] } })),
  { text: 1 },
)
const structured = buildIndex(
  'structured',
  'BM25F over the fields of one problem–solution record per source, written before evaluation.',
  records.map((r) => ({ id: r.sourceId, fields: recordFields(r) })),
  STRUCTURED_WEIGHTS,
)
const buildMs = performance.now() - started

const artifact = {
  version: 1,
  corpus: {
    sources: sources.length,
    records: records.length,
    snapshotBytes: Object.values(snapshots).reduce((n, t) => n + Buffer.byteLength(t), 0),
    lockDigest: createHash('sha256').update(JSON.stringify(lock)).digest('hex'),
  },
  sources,
  records,
  indexes: { baseline, structured },
}
mkdirSync(new URL('../src/data/', import.meta.url), { recursive: true })
const json = JSON.stringify(artifact)
writeFileSync(new URL('../src/data/four-words-index.json', import.meta.url), json)
console.log(
  `four-words-index.json: ${sources.length} sources, ${records.length} records, ` +
    `${Object.keys(baseline.fields.text.postings).length} baseline terms, ${(json.length / 1024).toFixed(1)} KiB, ` +
    `built in ${buildMs.toFixed(1)} ms`,
)
