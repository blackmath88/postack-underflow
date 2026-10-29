// 39 · The Marginal Printer. Print revision 1: on the position sheet all three
// annotations print over the wrong words and the sheet itself carries no
// warning; on the quotation sheet all three hold. Print on to revision 3: one
// quotation annotation loses its words and says so in the margin.
export const n = '39'

const col = (mode) => `.x39__col--${mode}`

export async function run({ page, check }) {
  check((await page.locator('.x39__col').count()) === 2, 'two sheets print side by side')
  await page.click('.x39 [data-probe]')

  const posHits = await page.locator(`${col('position')} .x39__hit`).allTextContents()
  check(posHits.length === 3 && posHits[0].includes('at GitHub Page'), `by position all three still print, the first over “at GitHub Page” (${posHits.join(' / ')})`)
  const posSheet = await page.locator(`${col('position')} .x39__sheet`).innerText()
  check(!/lost|misprint|wrong|warning/i.test(posSheet), 'the position sheet itself gives no sign that anything is wrong')
  check((await page.locator(`${col('position')} .x39__check-head`).innerText()).includes('0 of 3 right, 3 misprinted'), 'the proof under the position sheet finds three misprints')
  check((await page.locator(`${col('quote')} .x39__check-head`).innerText()).includes('3 of 3 right'), 'the quotation sheet holds all three')

  await page.click('.x39 [data-probe]')
  await page.click('.x39 [data-probe]')
  check((await page.locator('.x39 [data-probe]').isDisabled()), 'the press stops at revision 3')
  const lost = page.locator(`${col('quote')} .x39__margin .is-lost`)
  check((await lost.count()) === 1 && (await lost.innerText()).includes('Lost'), 'one quotation annotation is visibly lost in the margin')
  check((await page.locator(`${col('quote')} .x39__hit`).count()) === 2, 'and two still print on their words')
  check((await page.locator(`${col('position')} .x39__margin .is-lost`).count()) === 0, 'the position sheet still shows nothing lost')
  const status = await page.locator('.x39__status').innerText()
  check(status.includes('Revision 3') && status.includes('shows no sign'), 'the status reports the silent and the visible failure together')
}
