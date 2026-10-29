#!/usr/bin/env node
// Photo Frame Commons, slice C: runs br-ai-nstorm's own domain code over the
// adapter's plan, at a pinned revision, and writes the result.
//
//   1. A read-only checkout of blackmath88/br-ai-nstorm at BRAINSTORM_REVISION
//      (cloned into corpus/commons/.cache/, or BRAINSTORM_DIR if set). Nothing
//      of it is copied into this repository, and nothing in it is modified.
//   2. Its event factory, id source, label and hash helpers build the log.
//   3. Its deterministic curator proposes, contribution by contribution, as a
//      room would on arrival.
//   4. Its projection folds each problem's events into canonical state, and its
//      Level-1 static view renders them.
//
// Outputs: src/data/commons-brainstorm.json (events, states, adapter report)
// and public/commons/brainstorm.html (br-ai-nstorm's own static view).
// `--check` rebuilds in memory and compares with the committed JSON.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  BRAINSTORM_REPOSITORY, BRAINSTORM_REVISION, IMPORTER, MISMATCHES, RECORD_WRITER, ROLE_KIND, planContributions,
} from '../../src/commons/brainstorm/adapter.ts'

const commons = new URL('../../corpus/commons/', import.meta.url)
const outJson = new URL('../../src/data/commons-brainstorm.json', import.meta.url)
const outHtml = new URL('../../public/commons/brainstorm.html', import.meta.url)

// --- 1. the pinned checkout ---------------------------------------------------
const dir = process.env.BRAINSTORM_DIR ?? fileURLToPath(new URL('.cache/br-ai-nstorm', commons))
if (!existsSync(dir)) {
  execFileSync('git', ['clone', '--quiet', `https://github.com/${BRAINSTORM_REPOSITORY}.git`, dir])
}
const head = execFileSync('git', ['-C', dir, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
if (head !== BRAINSTORM_REVISION) {
  execFileSync('git', ['-C', dir, 'fetch', '--quiet', 'origin', BRAINSTORM_REVISION])
  execFileSync('git', ['-C', dir, 'checkout', '--quiet', '--detach', BRAINSTORM_REVISION])
}
if (execFileSync('git', ['-C', dir, 'status', '--porcelain'], { encoding: 'utf8' }).trim()) {
  throw new Error(`${dir} has local changes; refusing to run modified br-ai-nstorm code`)
}

// br-ai-nstorm's TypeScript is not erasable (parameter properties), so it runs
// under its own toolchain: tsx from its own lockfile (`npm ci --ignore-scripts`
// in the checkout). This script re-executes itself under that tsx once.
const tsx = `${dir}/node_modules/.bin/tsx`
if (!process.env.COMMONS_UNDER_TSX) {
  if (!existsSync(tsx)) execFileSync('npm', ['ci', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: dir, stdio: 'inherit' })
  execFileSync(tsx, [fileURLToPath(import.meta.url), ...process.argv.slice(2)], { stdio: 'inherit', env: { ...process.env, COMMONS_UNDER_TSX: '1' } })
  process.exit(0)
}
const mod = (p) => import(pathToFileURL(`${dir}/${p}`).href)
const { makeEvent, createIdSource, deriveLabel } = await mod('server/domain/events.ts')
const { project } = await mod('server/domain/projections.ts')
const { proposeDeterministically, inferKind } = await mod('server/curation/deterministic.ts')
const { stableHash } = await mod('server/adoption/plan.ts')
const { renderStaticView } = await mod('server/adoption/static-view.ts')

// --- 2. the adapter's plan ------------------------------------------------------
const artifact = JSON.parse(readFileSync(new URL('../../src/data/commons-index.json', import.meta.url), 'utf8'))
const manifest = JSON.parse(readFileSync(new URL('manifest.json', commons), 'utf8'))
const threadRefs = {}
const commentRefs = {}
for (const t of manifest.threads) {
  const key = `${t.type}/${t.number}`
  const tl = (t.timeline ?? []).flatMap((x) => [x.from, x.to, x.byPull]).filter(Boolean)
  threadRefs[key] = [...new Set([...t.refs, ...tl, ...(t.closes ?? [])])].sort((a, b) => a - b)
  for (const c of t.comments) commentRefs[String(c.id)] = c.refs
}
const docLines = {}
for (const p of artifact.problems) for (const e of [...p.evidence, ...artifact.corrections.flatMap((c) => [c, c.qualifies])]) {
  const ref = e.ref
  if (!ref?.doc) continue
  const file = new URL(`.cache/doc--${ref.doc.replace(/\//g, '--')}`, commons)
  if (!existsSync(file)) throw new Error('no local snapshot cache; run npm run commons:snapshot first')
  docLines[`${ref.doc}#L${ref.lines[0]}-L${ref.lines[1]}`] = readFileSync(file, 'utf8').split('\n').slice(ref.lines[0] - 1, ref.lines[1]).join('\n')
}
const plan = planContributions({
  repository: artifact.repository, revision: artifact.revision, problems: artifact.problems,
  corrections: artifact.corrections, sources: artifact.sources, threadRefs, commentRefs, docLines,
})

// --- 3. events, through br-ai-nstorm's own factory --------------------------------
const clock = { now: () => artifact.snapshotAt }
const deps = { clock, ids: createIdSource() }
const events = []
const states = []
const contributionId = (c) => `${c.problemId}:gh:${stableHash(`${c.problemId}\u0000${c.refKey}\u0000${c.content}`)}`

for (const p of artifact.problems) {
  const correlationId = deps.ids.next('corr')
  const own = []
  const push = (e) => { events.push(e); own.push(e) }
  push(makeEvent(deps, {
    problemId: p.id, actorId: IMPORTER, objectId: p.id, eventType: 'ProblemCreated', correlationId,
    payload: {
      title: p.title,
      shortTitle: deriveLabel(p.title, 32),
      description: `Imported from ${artifact.repository}. Framing written by ${artifact.recordsBy} (${artifact.recordsReview}).`,
      stateSummary: p.statusNote,
      // The sources' own questions are the honest first prompts, as in repository adoption.
      thinkNext: plan.contributions.filter((c) => c.problemId === p.id && /\?\s*$/.test(c.content)).slice(0, 3).map((c) => c.content),
    },
  }))

  // Arrival order is the order people wrote things in, so curation sees what a room would.
  const mine = plan.contributions
    .filter((c) => c.problemId === p.id)
    .sort((a, b) => (a.writtenAt ?? '').localeCompare(b.writtenAt ?? '') || a.refKey.localeCompare(b.refKey))
  const records = []
  const idOf = new Map()
  for (const c of mine) {
    const id = contributionId(c)
    idOf.set(c.refKey, id)
    const kind = inferKind(c.content) === 'contradiction' ? 'claim' : inferKind(c.content)
    const provenance = {
      authoredBy: c.authoredBy, submittedBy: IMPORTER, source: 'repo_import', sourceDetail: c.sourceDetail,
      sourceRef: c.sourceRef, endorsement: 'participant_review_required', timestamp: clock.now(),
    }
    const added = makeEvent(deps, {
      problemId: p.id, actorId: c.authoredBy, objectId: id, eventType: 'ContributionAdded', correlationId,
      payload: { kind, label: deriveLabel(c.content), content: c.content, visibility: 'problem', provenance },
    })
    push(added)
    const record = { id, problemId: p.id, kind, label: deriveLabel(c.content), content: c.content, status: 'active', visibility: 'problem', provenance, createdAt: clock.now() }
    for (const draft of proposeDeterministically({ problemId: p.id, contribution: record, candidates: records })) {
      const proposalId = deps.ids.next('proposal')
      push(makeEvent(deps, {
        problemId: p.id, actorId: draft.proposedBy, objectId: proposalId, causationId: added.id, correlationId,
        eventType: draft.kind === 'conflict' ? 'ConflictProposed' : 'RelationProposed', payload: { proposalId, ...draft },
      }))
    }
    // The record writer's reading of the evidence, when it differs from the lexical floor.
    const suggested = ROLE_KIND[c.role]
    if (suggested !== kind) {
      const proposalId = deps.ids.next('proposal')
      push(makeEvent(deps, {
        problemId: p.id, actorId: RECORD_WRITER, objectId: proposalId, correlationId, eventType: 'RelationProposed',
        payload: { proposalId, problemId: p.id, kind: 'classification', sourceId: id, suggestedKind: suggested, reason: `The record writer reads this ${c.role.replace('-', ' ')} as “${suggested}”.`, confidence: 0.6, proposedBy: RECORD_WRITER },
      }))
    }
    records.push(record)
  }

  for (const l of plan.links.filter((x) => x.problemId === p.id)) {
    const proposalId = deps.ids.next('proposal')
    push(makeEvent(deps, {
      problemId: p.id, actorId: l.proposedBy, objectId: proposalId, correlationId,
      eventType: l.kind === 'conflict' ? 'ConflictProposed' : 'RelationProposed',
      payload: {
        proposalId, problemId: p.id, kind: l.kind, sourceId: idOf.get(l.from), targetId: idOf.get(l.to),
        ...(l.relationKind ? { relationKind: l.relationKind } : {}), ...(l.conflictKind ? { conflictKind: l.conflictKind } : {}),
        reason: l.reason, confidence: l.confidence, proposedBy: l.proposedBy, ...(l.onBehalfOf ? { onBehalfOf: l.onBehalfOf } : {}),
      },
    }))
  }
  // --- 4. the canonical projection, by br-ai-nstorm ---------------------------
  states.push(project(own))
}

const contributionMeta = {}
for (const c of plan.contributions) {
  contributionMeta[contributionId(c)] = { refKey: c.refKey, role: c.role, contentIsTitle: c.contentIsTitle, writtenAt: c.writtenAt ?? null }
}
const report = {
  repository: artifact.repository,
  revision: artifact.revision,
  spaces: states.map((s) => ({ problemId: s.problem.id, title: s.problem.title, created: true, added: [], unchanged: 0, stale: [], missingFiles: [], skipped: { code: 0, table: 0, short: 0, leadIn: 0, tooLong: 0 } })),
}
const proposalsBy = {}
for (const s of states) for (const pr of s.proposals) proposalsBy[pr.proposedBy] = (proposalsBy[pr.proposedBy] ?? 0) + 1
const out = {
  $type: 'ai.bridgework.brainstorm.snapshot',
  schemaVersion: '0.4',
  brainstorm: { repository: BRAINSTORM_REPOSITORY, revision: BRAINSTORM_REVISION },
  generatedAt: artifact.snapshotAt,
  source: { repository: artifact.repository, revision: artifact.revision, index: artifact.version },
  adapter: {
    contributions: plan.contributions.length,
    proposalsBy,
    unrepresented: plan.unrepresented,
    mismatches: MISMATCHES,
  },
  contributionMeta,
  report,
  events,
  states,
}
const text = `${JSON.stringify(out)}\n`
if (process.argv.includes('--check')) {
  if (readFileSync(outJson, 'utf8') !== text) {
    console.error('commons brainstorm: src/data/commons-brainstorm.json does not match a rebuild')
    process.exit(1)
  }
  console.log('commons brainstorm: reproduced exactly')
} else {
  writeFileSync(outJson, text)
  mkdirSync(new URL('.', outHtml), { recursive: true })
  writeFileSync(outHtml, renderStaticView({ title: `Photo Frame Commons — br-ai-nstorm Level-1 view (${artifact.version})`, states, report, generatedAt: artifact.snapshotAt }))
  console.log(`commons brainstorm: ${events.length} events, ${plan.contributions.length} contributions, proposals ${JSON.stringify(proposalsBy)}; ${(text.length / 1024).toFixed(0)} KiB`)
}
