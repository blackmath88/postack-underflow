import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SOURCES } from '../src/content/sources.ts'
import { STUDIES } from '../src/content/artifacts.ts'

test('every source has an https URL, a title and a stated contribution', () => {
  for (const [key, source] of Object.entries(SOURCES)) {
    assert.equal(source.id, key, `${key}: id must match its key`)
    assert.match(source.url, /^https:\/\//, `${key}: url must be https`)
    assert.ok(source.title.length > 0, `${key}: title`)
    assert.ok(source.contribution.length > 20, `${key}: contribution`)
  }
})

test('the provenance sources named in the brief are all registered', () => {
  const urls: string[] = Object.values(SOURCES).map((s) => s.url)
  for (const required of [
    'https://github.com/blackmath88/github-atlas',
    'https://github.com/blackmath88/br-ai-nstorm',
    'https://github.com/blackmath88/colors',
    'https://github.com/blackmath88/lumpesammlig',
    'https://atproto.com/',
    'https://standard.site/',
    'https://syntax.fm/show/1050/everyone-is-hacking-their-tv/transcript',
  ]) {
    assert.ok(urls.includes(required), `missing source ${required}`)
  }
})

test('every study reference pins the Lumpesammlig merge and states a principle', () => {
  for (const [key, study] of Object.entries(STUDIES)) {
    assert.match(study.revision, /^[0-9a-f]{40}$/, `${key}: pin a full commit SHA`)
    assert.match(study.liveUrl, /^https:\/\/blackmath88\.github\.io\/lumpesammlig\//, `${key}: liveUrl`)
    assert.ok(study.principle.length > 60, `${key}: principle`)
    assert.ok(study.appliedIn.length > 30, `${key}: appliedIn`)
  }
})

test('private repositories are flagged so they are not linked publicly', () => {
  for (const id of ['colors', 'developmentPractice'] as const) {
    assert.equal(SOURCES[id].private, true, `${id} is private on GitHub`)
  }
})
