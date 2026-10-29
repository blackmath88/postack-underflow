// 30 · The Moderation Lens. Turn the lens to its strictest stop with the
// keyboard: three readable records leave the view, and the account in the
// viewfinder strikes out the correction and the dispute and writes in
// "Nobody disagreed with it."
export const n = '30'

export async function run({ page, check }) {
  const said = page.locator('.x30__said')
  const before = (await said.innerText()).trim()
  check(before.includes('mara corrected H4 and jun disputed H2.'), 'through clear glass the account names the correction and the dispute')
  check((await page.locator('.x30__said ins, .x30__said del').count()) === 0, 'through clear glass nothing is struck out or written in')

  // The lens ring is a native radio group: arrow keys turn it.
  await page.locator('.x30 [data-probe]').focus()
  for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowRight')
  check((await page.locator('.x30__stop.is-on .x30__name').innerText()) === 'Both, hide', 'four presses of the right arrow reach “Both, hide”')

  const ins = (await page.locator('.x30__said ins').allTextContents()).map((t) => t.replace('written in: ', '').trim())
  const del = (await page.locator('.x30__said del').allTextContents()).map((t) => t.replace('struck out: ', '').trim())
  check(ins.includes('Nobody disagreed with it.'), `the lens writes in “Nobody disagreed with it.” (${ins.join(' / ')})`)
  check(del.includes('mara corrected H4 and jun disputed H2.'), 'the lens strikes out the correction and the dispute')

  const hiddenReadable = await page.locator('.x30__rec.is-hidden').evaluateAll((els) => els.filter((e) => !/source offline|deleted/.test(e.textContent ?? '')).length)
  check(hiddenReadable === 3, `three readable records are hidden by label (${hiddenReadable})`)
  check((await page.locator('.x30__rec').count()) === 8, 'the strip still holds all eight records')

  const live = (await page.locator('.x30 [aria-live="polite"]').innerText()).trim()
  check(live.includes('3 of 8 records shown') && live.includes('Nobody disagreed with it.'), 'the change is announced in one live region')
}
