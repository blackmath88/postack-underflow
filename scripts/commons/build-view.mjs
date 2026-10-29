#!/usr/bin/env node
// Photo Frame Commons, slice E: assembles what the interface reads from the
// committed artifacts of slices A–D. No source text is read here, so it runs
// without the snapshot cache (and in CI). Writes:
//   src/data/commons-view.json   problems, sources, map/thread data, elsewhere
//   src/data/commons-heads.json  id → title and status, for route heads
// `--check` compares with the committed files.
import { readFileSync, writeFileSync } from 'node:fs'
import { projectElsewhere } from '../../src/commons/atproto/projection.ts'
import { IDENTITIES } from '../../src/commons/atproto/identities.ts'
import { STATUS_LABEL } from '../../src/commons/model.ts'

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'))
const index = read('../../src/data/commons-index.json')
const brain = read('../../src/data/commons-brainstorm.json')
const manifest = read('../../corpus/commons/manifest.json')
const live = read('../../corpus/commons/atproto.json')
const fixtures = read('../../corpus/commons/atproto-fixtures.json')

const pullFiles = Object.fromEntries(manifest.threads.filter((t) => t.type === 'pull').map((t) => [`pull/${t.number}`, t.files]))
const elsewhere = projectElsewhere({ records: [...live.records, ...fixtures.records], problems: index.problems, pullFiles })

const map = {}
for (const s of brain.states) {
  map[s.problem.id] = {
    contributions: s.contributions.map((c) => {
      const m = brain.contributionMeta[c.id]
      return { id: c.id, kind: c.kind, label: c.label, content: c.content, authoredBy: c.provenance.authoredBy, refKey: m.refKey, role: m.role, writtenAt: m.writtenAt, contentIsTitle: m.contentIsTitle }
    }),
    proposals: s.proposals.map((p) => ({
      id: p.id, kind: p.kind, sourceId: p.sourceId, targetId: p.targetId ?? null,
      relationKind: p.relationKind ?? null, conflictKind: p.conflictKind ?? null, suggestedKind: p.suggestedKind ?? null,
      reason: p.reason, proposedBy: p.proposedBy, onBehalfOf: p.onBehalfOf ?? null, confidence: p.confidence,
    })),
  }
}

const view = {
  meta: {
    repository: index.repository,
    revision: index.revision,
    snapshotAt: index.snapshotAt,
    version: index.version,
    recordsBy: index.recordsBy,
    recordsReview: index.recordsReview,
    counts: {
      issues: manifest.totals.issues, pulls: manifest.totals.pulls, discussions: manifest.totals.discussions,
      comments: manifest.threads.reduce((n, t) => n + t.comments.length, 0),
      people: new Set(manifest.threads.flatMap((t) => [t.author, ...t.comments.map((c) => c.author)]).filter(Boolean)).size,
      docs: manifest.docs.length,
    },
    brainstorm: { ...brain.brainstorm, proposalsBy: brain.adapter.proposalsBy, unrepresented: brain.adapter.unrepresented, mismatches: brain.adapter.mismatches },
    atproto: { fetchedAt: live.fetchedAt, coverage: live.coverage },
  },
  problems: index.problems,
  corrections: index.corrections,
  sources: index.sources,
  map,
  elsewhere,
  identities: IDENTITIES,
}
const heads = Object.fromEntries(index.problems.map((p) => [p.id, { title: p.title, status: STATUS_LABEL[p.status] }]))

const outView = new URL('../../src/data/commons-view.json', import.meta.url)
const outHeads = new URL('../../src/data/commons-heads.json', import.meta.url)
const v = `${JSON.stringify(view)}\n`
const h = `${JSON.stringify(heads, null, 1)}\n`
if (process.argv.includes('--check')) {
  if (readFileSync(outView, 'utf8') !== v || readFileSync(outHeads, 'utf8') !== h) {
    console.error('commons view: committed view data does not match a rebuild')
    process.exit(1)
  }
  console.log('commons view: reproduced exactly')
} else {
  writeFileSync(outView, v)
  writeFileSync(outHeads, h)
  console.log(`commons view: ${(v.length / 1024).toFixed(0)} KiB, ${Object.keys(heads).length} problems`)
}
