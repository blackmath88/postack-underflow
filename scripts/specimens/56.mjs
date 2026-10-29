// 56 · The Forked Interpretation. Both branches must show their published
// number (0.950 and 0.963), and throwing the labelling choice must move the
// first answer from rank 7 to rank 2 while keyword search stays at 0.742 and
// structured search still wins.
export const n = '56'

export async function run({ page, check }) {
  const root = page.locator('.x56')
  const status = root.locator('.x56__status')
  const plates = await root.locator('.x56__plate').allInnerTexts()

  check(plates.length === 2, 'both branches end in a number plate')
  check(/rank 7/.test(plates[0]) && /0\.950/.test(plates[0]), 'the left branch shows rank 7 and 0.950')
  check(/rank 2/.test(plates[1]) && /0\.963/.test(plates[1]), 'the right branch shows rank 2 and 0.963')
  check(plates.every((p) => /0\.742/.test(p) && /structured, by/.test(p)), 'keyword is 0.742 and structured wins on both')
  check((await status.innerText()).includes('rank 7'), 'the starting branch is the published one, rank 7')

  await root.getByLabel(/Yes, they answer it/).check()
  const said = await status.innerText()
  check(/rank 2/.test(said) && /0\.963 instead of 0\.950/.test(said), `the review's reading gives rank 2 and 0.963 (“${said}”)`)
  check(/stays at 0\.742/.test(said) && /still wins/.test(said), 'keyword stays at 0.742 and the winner does not change')
  check((await root.locator('.x56__branch--review.is-taken').count()) === 1, 'the right branch is drawn as the one taken')
}
