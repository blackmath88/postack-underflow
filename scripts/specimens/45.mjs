// 45 · The Story You Can Interrupt. Read the chapter straight through: the
// ledger at the end names exactly one unsafe skip, "Is this a real thread?",
// and flags the thread it was the only caveat for. Read it again opening only
// that aside, and no pass is unsafe.
export const n = '45'

export async function run({ page, check }) {
  check((await page.locator('.x45__ledger').count()) === 0, 'no ledger before the end of the chapter')
  await page.click('.x45 [data-probe]')
  check((await page.locator('.x45__pause').innerText()).includes('Is this a real thread?'), 'the first pause offers “Is this a real thread?”')

  await page.click('text=Read straight through, passing every aside')
  const log = await page.locator('.x45__log').innerText()
  check(log.includes('314 of 314 words') && log.includes('passed 11 (623 words)'), 'straight through: 314 words read, 11 asides (623 words) passed')
  check(log.includes('One pass was unsafe'), 'the log says one pass was unsafe')

  const unsafe = page.locator('.x45__ledger li.is-only-here')
  check((await unsafe.count()) === 1, 'the ledger marks exactly one aside as stated nowhere else')
  const row = await unsafe.innerText()
  check(row.includes('Is this a real thread?') && /unsafe skip/i.test(row), 'and names it: “Is this a real thread?”, an unsafe skip')
  check((await page.locator('.x45__ledger li.is-restated').count()) === 2, 'two other caveats are found on the surface')
  check((await page.locator('#x45-thread.is-flagged').count()) === 1, 'the four-step thread is flagged in the story')

  await page.click('text=Start again')
  await page.click('.x45 [data-probe]')
  await page.click('text=Open the aside')
  await page.click('text=Read straight through, passing every aside')
  check((await page.locator('.x45__log').innerText()).includes('No pass was unsafe'), 'opening only that aside makes every other pass safe')
  check((await page.locator('#x45-thread.is-flagged').count()) === 0, 'and the thread is not flagged')
}
