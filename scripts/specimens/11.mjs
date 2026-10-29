// 11 · Above the Rod. Handing review to the word rule must drop 50 of 80
// cards, hold 30, and leave the underscore-paths drawer empty to a patron,
// while it rightly holds vite#8073 under asset-404.
export const n = '11'

export async function run({ page, check }) {
  const root = page.locator('.x11')
  const note = root.locator('.x11__note')
  const finds = root.locator('.x11__finds')

  check((await finds.innerText()).includes('empty drawer'), 'before review the patron finds an empty drawer')

  await root.locator('.x11__lever').click()
  const said = await note.innerText()
  check(/dropped 50 of 80 cards and held 30/.test(said), `the rule drops 50 of 80 and holds 30 (“${said}”)`)
  check(/underscore-paths and trailing-slash/.test(said), 'the status names the drawers left empty')
  check((await finds.innerText()).includes('The word rule held all 5'), 'the open underscore-paths drawer is empty to a patron')
  check((await root.locator('.x11__void').count()) === 1, 'the patron side is drawn as an empty drawer')
  check((await root.locator('.x11__front.is-empty').count()) === 2, 'two drawer fronts are stamped empty')

  await root.locator('.x11__front', { hasText: 'asset-404' }).click()
  const held = root.locator('.x11__cards--above .x11__card', { hasText: 'vite#8073' })
  check((await held.count()) === 1, 'vite#8073 stays above the rod under asset-404')
  check((await held.innerText()).includes('never writes “404”'), 'vite#8073 is held because it never writes 404')

  await held.getByRole('button', { name: 'Drop on judgement' }).click()
  check((await finds.innerText()).includes('finds 2 cards of 7'), 'dropping on judgement puts the card in the patron’s drawer')
}
