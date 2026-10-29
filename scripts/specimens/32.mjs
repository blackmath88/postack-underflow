// 32 · The Librarian's Hand. Lift the agent's hand: the writer's lines go
// blank, 36 of 230 words remain and the card can no longer be filed. The rack
// reports 81–92% (median 89%) across all 30 cards, and the reviewer's line is
// blank on every one, including a second card chosen from the rack.
export const n = '32'

export async function run({ page, check }) {
  const card = page.locator('.x32__card')
  check((await card.locator('.x32__filed').innerText()).includes('underscore-paths'), 'before lifting, the card is filed under a heading')

  await page.click('.x32 [data-probe]')
  check((await page.locator('.x32__lift').getAttribute('aria-pressed')) === 'true', 'the agent’s hand is lifted')
  const status = await page.locator('.x32__status').innerText()
  check(status.includes('36 of 230 words remain'), `almost nothing is left (${status.split('.')[0]})`)
  check((await card.locator('.x32__filed').innerText()).includes('nowhere'), 'the card can no longer be filed')
  const inked = await card.locator('.x32__line:not(.is-lifted)').count()
  const blank = await card.locator('.x32__line.is-lifted').count()
  check(inked === 4 && blank > 15, `four lines keep their ink, ${blank} go blank`)

  const sum = await page.locator('.x32__rack-sum').innerText()
  check(sum.includes('81% to 92%') && sum.includes('median 89%'), 'the rack reports 81–92%, median 89%')
  check(sum.includes('Reviewed: 0 of 30'), 'the rack reports no reviewed card')
  check((await page.locator('.x32__bar').count()) === 30, 'the rack holds thirty cards')

  // Choose another card from the rack with the keyboard; the reviewer's line stays blank.
  await page.locator('.x32__bar.is-on input').focus()
  await page.keyboard.press('ArrowRight')
  const id = await card.locator('.x32__id').innerText()
  check(id !== 'vite-issue-9119-underscore-chunk', `the arrow key moves to another card (${id})`)
  check((await card.locator('.x32__rule').innerText()).trim() === '', 'its reviewer’s line is blank too')
}
