import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { SOURCES } from '../src/content/sources.ts'

// The note registry is JSX, which Node cannot import, so these checks read the
// source text: every note is used exactly once, and its links resolve.
const src = (path: string) => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8')
const registry = src('content/margin.tsx')
const noteIds = [...registry.matchAll(/^ {2}(\w+): \{\n {4}title:/gm)].map((m) => m[1]!)

const routeFiles = (dir: string): string[] =>
  readdirSync(new URL(`../src/${dir}`, import.meta.url), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? routeFiles(`${dir}/${e.name}`) : e.name.endsWith('.tsx') ? [`${dir}/${e.name}`] : [],
  )
const pages = Object.fromEntries(routeFiles('routes').map((f) => [f, src(f)]))
const uses = Object.entries(pages).flatMap(([file, text]) =>
  [...text.matchAll(/<Ref id="(\w+)"/g)].map((m) => ({ file, id: m[1]! })),
)

test('the registry has notes', () => {
  assert.ok(noteIds.length >= 30, `found ${noteIds.length}`)
})

test('every margin note is placed in the essay exactly once', () => {
  for (const id of noteIds) {
    const at = uses.filter((u) => u.id === id)
    assert.equal(at.length, 1, `${id} is used ${at.length} times`)
  }
  for (const u of uses) assert.ok(noteIds.includes(u.id), `${u.file} uses unknown note ${u.id}`)
})

test('each note sits on the page of its chapter', () => {
  const chapterFile: Record<string, string> = {
    opening: 'routes/index.tsx',
    indexing: 'routes/indexing.tsx',
    community: 'routes/community.tsx',
    convergence: 'routes/convergence.tsx',
    afterword: 'routes/afterword.tsx',
  }
  for (const id of noteIds) {
    const block = registry.slice(registry.indexOf(`  ${id}: {`))
    const chapter = /chapter: '(\w+)'/.exec(block)![1]!
    assert.equal(uses.find((u) => u.id === id)?.file, chapterFile[chapter], `${id} belongs to ${chapter}`)
  }
})

test('notes cite registered sources and link to archive anchors that exist', () => {
  for (const m of registry.matchAll(/sources: \[([^\]]*)\]/g)) {
    for (const id of m[1]!.match(/'(\w+)'/g) ?? []) assert.ok(id.slice(1, -1) in SOURCES, `unknown source ${id}`)
  }
  for (const m of registry.matchAll(/<Src id="(\w+)"/g)) assert.ok(m[1]! in SOURCES, `unknown source ${m[1]}`)
  const routeFor: Record<string, string> = {
    '/archive/': 'routes/archive/index.tsx',
    '/archive/four-words/': 'routes/archive/four-words.tsx',
    '/archive/community/': 'routes/archive/community.tsx',
    '/archive/history/': 'routes/archive/history.tsx',
  }
  for (const m of registry.matchAll(/to: '([^']+)', hash: '([^']+)'/g)) {
    const file = routeFor[m[1]!]
    assert.ok(file, `unknown archive route ${m[1]}`)
    const text = pages[file]! + (m[2] === 'photo-frame' ? src('components/PhotoFrameSpecimen.tsx') : '')
    assert.ok(text.includes(`id="${m[2]}"`), `${m[1]}#${m[2]} has no matching id`)
  }
})

test('history notes that are not checked against a source say so', () => {
  for (const id of noteIds) {
    const block = registry.slice(registry.indexOf(`  ${id}: {`)).split(/\n {2}\w+: \{\n/)[0]!
    if (/kind: 'history'/.test(block) && /evidence: 'reported'/.test(block)) {
      assert.match(block, /not\s+independently verified/, `${id} must state that it is reported, not verified`)
    }
  }
})
