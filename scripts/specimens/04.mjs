// 04 · A Search That Explains Itself. Pressing "All equal" must light exactly
// one of the 27 lamps (q26), and the reading must say 1 of 27 changed.
export const n = '04'

export async function run({ page, check }) {
  const root = page.locator('.x04')
  const status = root.locator('.x04__reading')
  const lit = root.locator('.x04__lamps li.is-on')

  check((await root.locator('.x04__banner').innerText()).includes('not an evaluation'), 'the demonstration banner is shown')
  check((await root.locator('.x04__lamps li').count()) === 27, 'the meter has 27 lamps')
  check((await lit.count()) === 0, 'with frozen weights no lamp is lit')

  await root.getByRole('button', { name: 'All equal' }).click()
  const text = await status.innerText()
  check(/1 of 27 first results changed/.test(text), `all equal reports 1 of 27 changed (“${text}”)`)
  check((await lit.count()) === 1, 'all equal lights one lamp')
  check((await root.locator('.x04__which').innerText()).includes('q26'), 'the changed query is named: q26')

  // Doubling one weight from the frozen setting changes at most one first result.
  await root.getByRole('button', { name: 'Back to frozen' }).click()
  const aliases = root.getByLabel('aliases weight')
  await aliases.focus()
  for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowUp')
  check((await aliases.inputValue()) === '4', 'the aliases fader moves by keyboard to 4')
  check((await lit.count()) <= 1, 'doubling the aliases weight lights at most one lamp')
}
