import { test } from 'node:test'
import assert from 'node:assert/strict'
import { REVISIONS } from '../src/lab/data/history-printer.ts'
import { place, proof } from '../src/lab/experiments/history/39-plates.ts'

// 39 · The Marginal Printer. The finding: anchored by character position, one
// inserted clause silently misprints all three annotations; anchored by
// quotation, they hold until their words are deleted, then fail visibly.

const text = (r: number) => REVISIONS[r]!.text

test('on revision 0 both registrations print all three annotations on their words', () => {
  for (const mode of ['position', 'quote'] as const) {
    const p = proof(text(0), mode)
    assert.deepEqual([p.right, p.wrong, p.off], [3, 0, 0])
  }
})

test('one inserted clause puts every position-registered plate 49 characters out, over the wrong words', () => {
  const p = proof(text(1), 'position')
  assert.equal(p.wrong, 3)
  assert.equal(p.off, 0)
  for (const x of p.placed) {
    assert.equal(x.drift, 49)
    assert.notEqual(x.printsOver, x.quote)
  }
  assert.equal(p.placed[0]!.printsOver, 'at GitHub Page')
})

test('by quotation the plates hold through revisions 1 and 2', () => {
  for (const r of [1, 2]) assert.equal(proof(text(r), 'quote').right, 3)
})

test('when its words are deleted, a quotation plate leaves the sheet instead of misprinting', () => {
  const q = proof(text(3), 'quote')
  assert.deepEqual([q.right, q.wrong, q.off], [2, 0, 1])
  assert.equal(q.placed.find((x) => x.printsOver === null)!.id, 'c')
  // The position plate for the same annotation still prints, over something else.
  const c = place(text(3), 'position').find((x) => x.id === 'c')!
  assert.equal(c.drift, null)
  assert.ok(c.printsOver && c.printsOver !== c.quote)
})

test('a position-registered plate never prints right after revision 0', () => {
  for (const r of [1, 2, 3]) assert.equal(proof(text(r), 'position').right, 0)
})
