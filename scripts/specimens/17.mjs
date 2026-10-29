// 17 · Three Kinds of Proof. Admitting only stronger proof must empty the
// visitor's scale, and the empty scale must read exactly like the full one.
export const n = '17'

export async function run({ page, check }) {
  const root = page.locator('.x17')
  const dials = root.locator('.x17__dial')
  const reads = root.locator('.x17__reads')
  const beam = (i) => root.locator('.x17__beam').nth(i).evaluate((l) => ['x1', 'y1', 'x2', 'y2'].map((a) => l.getAttribute(a)).join(','))

  check((await dials.allInnerTexts()).every((t) => /level/i.test(t)), 'with every kind admitted both scales read level')
  check((await reads.nth(1).innerText()).includes('for 3 · against 3'), 'six reports sit on the scale, 3 to 3')

  await root.getByLabel('only reproduced or regression-tested proof').check()
  const verdict = await root.locator('.x17__verdict').innerText()
  check(/Your scale is empty: all 6 exhibits in scope are reports/.test(verdict), `the stronger rule empties the scale (“${verdict}”)`)
  check(/the same as the scale with six reports on it/.test(verdict), 'the verdict says the empty scale reads like the full one')
  check((await reads.nth(1).innerText()).includes('for 0 · against 0'), 'nothing is left on the visitor’s scale')
  check((await dials.allInnerTexts()).every((t) => /level/i.test(t)), 'both dials still read level')
  check((await beam(0)) === (await beam(1)), 'the empty beam is drawn at exactly the same position as the full one')
  check((await root.locator('.lab-out').innerText()).includes('all 6 exhibits are reports'), 'all six exhibits are reports')
}
