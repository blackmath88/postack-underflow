#!/usr/bin/env node
// Offline step 3: evaluate retrieval on the labelled queries.
// Reports per-query ranks and mean Recall@1, Recall@5 and MRR@10 for the
// shipped baseline and structured indexes, plus one ablation (structured
// records without the aliases and symptoms fields). Writes results/<name>.json.
// Usage: node scripts/evaluate.mjs [run-name]
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { buildIndex, recallAt, reciprocalRank, search } from '../src/lib/retrieval.ts'
import { STRUCTURED_WEIGHTS, recordFields } from '../src/lib/records.ts'

const runName = process.argv[2] ?? 'latest'
const artifactText = readFileSync(new URL('../src/data/four-words-index.json', import.meta.url), 'utf8')
const artifact = JSON.parse(artifactText)
const queries = JSON.parse(readFileSync(new URL('../corpus/queries.json', import.meta.url), 'utf8')).queries

const { aliases: _a, symptoms: _s, ...ablationWeights } = STRUCTURED_WEIGHTS
const systems = {
  baseline: artifact.indexes.baseline,
  structured: artifact.indexes.structured,
  'structured-without-aliases-symptoms': buildIndex(
    'structured',
    'Ablation: structured records without the aliases and symptoms fields.',
    artifact.records.map((r) => ({ id: r.sourceId, fields: recordFields(r) })),
    ablationWeights,
  ),
}

const perQuery = []
const summary = {}
for (const [name, index] of Object.entries(systems)) {
  let r1 = 0, r5 = 0, mrr = 0, totalMs = 0
  const iterations = 500
  for (const q of queries) {
    const result = search(index, q.query)
    const ranked = result.hits.map((h) => h.id)
    const t0 = performance.now()
    for (let i = 0; i < iterations; i++) search(index, q.query)
    totalMs += (performance.now() - t0) / iterations
    const rr = reciprocalRank(ranked, q.relevant, 10)
    r1 += recallAt(ranked, q.relevant, 1)
    r5 += recallAt(ranked, q.relevant, 5)
    mrr += rr
    const firstRelevant = ranked.findIndex((id) => q.relevant.includes(id))
    perQuery.push({
      system: name,
      query: q.id,
      firstRelevantRank: firstRelevant === -1 ? null : firstRelevant + 1,
      reciprocalRank: rr,
      recallAt5: recallAt(ranked, q.relevant, 5),
      top3: ranked.slice(0, 3),
      unknownTerms: result.unknownTerms,
    })
  }
  const n = queries.length
  summary[name] = {
    recallAt1: r1 / n,
    recallAt5: r5 / n,
    mrrAt10: mrr / n,
    meanQueryMs: totalMs / n,
  }
}

const rr = (system, id) => perQuery.find((p) => p.system === system && p.query === id).reciprocalRank
const paired = { structuredBetter: 0, baselineBetter: 0, tied: 0 }
for (const q of queries) {
  const d = rr('structured', q.id) - rr('baseline', q.id)
  if (d > 1e-9) paired.structuredBetter++
  else if (d < -1e-9) paired.baselineBetter++
  else paired.tied++
}

let commit = 'unknown'
try {
  commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
} catch {}

const results = {
  run: runName,
  date: new Date().toISOString().slice(0, 10),
  commit,
  environment: `Node ${process.version}, ${process.platform}`,
  indexDigest: createHash('sha256').update(artifactText).digest('hex'),
  queries: queries.length,
  sources: artifact.corpus.sources,
  summary,
  paired,
  perQuery,
}
mkdirSync(new URL('../results/', import.meta.url), { recursive: true })
writeFileSync(new URL(`../results/four-words-${runName}.json`, import.meta.url), `${JSON.stringify(results, null, 2)}\n`)

const pct = (x) => `${(x * 100).toFixed(1)}%`
console.log(`| System | Recall@1 | Recall@5 | MRR@10 | Mean query (ms, Node) |`)
console.log(`|---|---|---|---|---|`)
for (const [name, s] of Object.entries(summary)) {
  console.log(`| ${name} | ${pct(s.recallAt1)} | ${pct(s.recallAt5)} | ${s.mrrAt10.toFixed(3)} | ${s.meanQueryMs.toFixed(3)} |`)
}
console.log(`\nPaired by reciprocal rank (structured vs baseline): ${JSON.stringify(paired)}`)
