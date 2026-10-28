#!/usr/bin/env node
// Offline consistency check for CI (no network, no snapshots needed):
// the shipped index artifact must match the committed corpus files, and its
// structured index must be exactly what the committed records produce.
// The baseline index needs the snapshots; rebuild it locally with
// `npm run corpus:fetch && npm run index`.
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { isDeepStrictEqual } from 'node:util'
import { buildIndex } from '../src/lib/retrieval.ts'
import { STRUCTURED_WEIGHTS, recordFields } from '../src/lib/records.ts'

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'))
const artifact = read('../src/data/four-words-index.json')
const sources = read('../corpus/sources.json')
const records = read('../corpus/records.json')
const lock = read('../corpus/snapshots.lock.json')
const errors = []

if (!isDeepStrictEqual(artifact.sources, sources)) errors.push('artifact sources differ from corpus/sources.json')
if (!isDeepStrictEqual(artifact.records, records)) errors.push('artifact records differ from corpus/records.json')
const digest = createHash('sha256').update(JSON.stringify(lock)).digest('hex')
if (artifact.corpus.lockDigest !== digest) errors.push('artifact was built from different snapshots than snapshots.lock.json')

const rebuilt = buildIndex(
  'structured',
  artifact.indexes.structured.description,
  records.map((r) => ({ id: r.sourceId, fields: recordFields(r) })),
  STRUCTURED_WEIGHTS,
)
if (!isDeepStrictEqual(JSON.parse(JSON.stringify(rebuilt)), artifact.indexes.structured)) {
  errors.push('structured index is stale; run npm run index')
}
const ids = sources.map((s) => s.id).sort()
if (!isDeepStrictEqual(artifact.indexes.baseline.docIds, ids)) errors.push('baseline index covers different sources')

if (errors.length) {
  console.error(`Index check failed:\n  ${errors.join('\n  ')}`)
  process.exit(1)
}
console.log(`Index artifact consistent: ${sources.length} sources, ${records.length} records, structured index reproduced exactly`)
