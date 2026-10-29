#!/usr/bin/env node
// Photo Frame Commons, slice E: real-browser checks of the journey
// Find → Inspect → Connect → Challenge → Preview, on the built site served the
// way GitHub Pages serves it. Actual interactions, at 390, 768 and 1440 px,
// with the keyboard, with reduced motion and with JavaScript off.
// Usage: node scripts/commons/browser-check.mjs [--screenshots <dir>]
import { existsSync, mkdirSync } from 'node:fs'
import { chromium } from 'playwright-core'
import { startPagesServer } from '../serve-pages.mjs'
import { BASE } from '../pages-config.mjs'

const executablePath = [process.env.CHROME_PATH, '/usr/bin/chromium', '/usr/bin/google-chrome'].filter(Boolean).find((p) => existsSync(p))
const shotIndex = process.argv.indexOf('--screenshots')
const shotDir = shotIndex > -1 ? process.argv[shotIndex + 1] : null
if (shotDir) mkdirSync(shotDir, { recursive: true })
const passes = []
const failures = []
const check = (ok, label) => (ok ? passes : failures).push(label)

const { server, origin } = await startPagesServer(0)
const site = `${origin}${BASE}commons/`
const browser = await chromium.launch({ executablePath, headless: true })
const SOURCE = 'https://github.com/wesbos/photo-frame-dashboard/'

async function open(options = {}) {
  const context = await browser.newContext({ colorScheme: 'light', ...options })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && !/status of 404/.test(m.text()) && errors.push(m.text()))
  return { context, page, errors }
}
const hydrated = (page) => page.waitForFunction(() => !!document.querySelector('.pfc-toggle, .pfc-search input[value], .pfc-results'), null, { timeout: 8000 }).catch(() => {})
const shot = async (page, name) => shotDir && page.screenshot({ path: `${shotDir}/${name}.png`, fullPage: false })

try {
  // 1. Layout: every Commons page at three widths, no overflow, no errors.
  for (const width of [390, 768, 1440]) {
    const { context, page, errors } = await open({ viewport: { width, height: 900 } })
    for (const path of ['', 'emmc-not-exposed/', 'gadget-error-71/', 'compromised-ca-roots/', 'frameo-159k-no-adb/', 'today-view-fifth-person/']) {
      const res = await page.goto(`${site}${path}`)
      await page.waitForLoadState('networkidle')
      const s = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        wide: [...document.querySelectorAll('.pfc *')].filter((e) => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1 && !e.closest('.pfc-row, .pfc-diff')).length,
        styled: getComputedStyle(document.querySelector('.pfc-band')).borderTopStyle === 'solid',
      }))
      check(res.ok() && !s.overflow && s.wide === 0 && s.styled, `${width}px /commons/${path}: styled, no horizontal overflow`)
    }
    check(errors.length === 0, `${width}px: no console or page errors${errors.length ? ` (${errors[0]})` : ''}`)
    await context.close()
  }

  // 2. Find: ordinary language, why it matched, the raw-thread baseline, the empty state.
  {
    const { context, page } = await open({ viewport: { width: 1440, height: 900 } })
    await page.goto(site)
    await page.waitForLoadState('networkidle')
    const input = page.getByLabel('Describe it in ordinary words')
    await input.fill('the backup disk never appears, only the sd card')
    await page.waitForSelector('.pfc-hits li')
    const first = await page.locator('.pfc-results__col').first().locator('.pfc-hits__title').first().textContent()
    check(/eMMC never appears/.test(first ?? ''), 'Find: an ordinary-language query reaches the eMMC record first')
    check(await page.locator('.pfc-why').first().isVisible(), 'Find: each hit says why it matched')
    check((await page.locator('.pfc-results__col--raw .pfc-hits li').count()) > 0, 'Find: raw issue threads are shown beside the records')
    const rawHref = await page.locator('.pfc-results__col--raw .pfc-hits__title').first().getAttribute('href')
    check(rawHref?.startsWith(SOURCE), 'Find: raw hits link to the original GitHub thread')
    await shot(page, 'commons-find-1440')
    await input.fill('qqzzx flibbertigibbet')
    check(await page.locator('.pfc-empty', { hasText: 'No record matches' }).isVisible(), 'Find: a query nothing matches says so, with what to do')
    // Keyboard: an example query from the keyboard alone.
    await input.fill('')
    await input.focus()
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    check((await input.inputValue()) === 'only the sd card shows up', 'Find: example queries work from the keyboard')
    // Into a record, by keyboard.
    await page.locator('.pfc-hits__title').first().focus()
    await page.keyboard.press('Enter')
    await page.waitForURL(/\/commons\/emmc-not-exposed\/$/)
    check(true, 'Find → Inspect: a result opens its problem page')
    await context.close()
  }

  // 3. Inspect: sources in their own words, linked to GitHub; the five questions.
  {
    const { context, page } = await open({ viewport: { width: 1440, height: 900 } })
    await page.goto(`${site}emmc-not-exposed/`)
    await page.waitForLoadState('networkidle')
    const links = await page.locator('.pfc-entry__meta a').evaluateAll((as) => as.map((a) => a.getAttribute('href')))
    check(links.length >= 8 && links.every((h) => h?.startsWith(SOURCE)), 'Inspect: every source links to the original on GitHub')
    check(links.some((h) => /#issuecomment-\d+$/.test(h)) && links.some((h) => /\/blob\/[0-9a-f]{40}\/docs\/.+#L\d+/.test(h)), 'Inspect: comments link to the comment; documents to pinned lines')
    check((await page.locator('.pfc-five li').count()) === 5, 'Inspect: the page answers the five questions')
    check((await page.locator('.pfc-outcome--failed').count()) >= 1, 'Inspect: a failed report is shown as failed, beside the reports that worked')
    await shot(page, 'commons-inspect-1440')

    // 4. Connect: map and thread, inspect a connection, unplug a proposal.
    await page.locator('#connect').scrollIntoViewIfNeeded()
    const declared = page.locator('.pfc-wire.pfc-basis--source-declared').first()
    await declared.focus()
    await page.keyboard.press('Enter')
    check(await page.locator('.pfc-inspector').isVisible(), 'Connect: Enter on a connection opens why it exists')
    check(await page.locator('.pfc-inspector', { hasText: 'on behalf of' }).isVisible(), 'Connect: an author-declared link names the author it was carried for')
    check((await page.locator('.pfc-inspector button', { hasText: 'Unplug' }).count()) === 0, 'Connect: a source-declared link cannot be unplugged')
    const before = await page.locator('.pfc-cord').count()
    await page.locator('.pfc-wire.pfc-basis--machine-proposal').first().click()
    await page.locator('.pfc-inspector button', { hasText: 'Unplug' }).click()
    const after = await page.locator('.pfc-cord').count()
    check(after === before - 1 && (await page.locator('.pfc-unplugged').isVisible()), 'Connect: unplugging a machine proposal removes its cord and lists it')
    await page.locator('.pfc-unplugged button').click()
    check((await page.locator('.pfc-cord').count()) === before, 'Connect: a proposal can be plugged back in')
    await page.getByLabel('Record writer’s proposal').uncheck()
    check((await page.locator('.pfc-cord.pfc-basis--machine-proposal').count()) === 0, 'Connect: a kind of connection can be hidden')
    await page.getByLabel('Record writer’s proposal').check()
    await shot(page, 'commons-map-1440')
    await page.getByRole('button', { name: 'Thread' }).press('Space')
    check((await page.locator('.pfc-thread').isVisible()) && !(await page.locator('.pfc-board').isVisible()), 'Connect: Space switches to the thread view')
    const times = await page.locator('.pfc-thread__item time').evaluateAll((ts) => ts.map((t) => t.getAttribute('datetime')))
    check(times.length > 0, 'Connect: the thread view dates each contribution')
    await context.close()
  }

  // 5. Challenge → Preview on the real -71 correction; the source stays as it is.
  {
    const { context, page } = await open({ viewport: { width: 768, height: 1000 } })
    await page.goto(`${site}gadget-error-71/`)
    await page.waitForLoadState('networkidle')
    check(await page.locator('.pfc-correction', { hasText: 'Not absorbed' }).isVisible(), 'Challenge: the #12 correction is shown as not absorbed')
    const said = await page.locator('.pfc-said footer a').first().getAttribute('href')
    check(said === `${SOURCE}issues/12#issuecomment-6137133782`, 'Challenge: the correction links to its comment on #12')
    check(await page.locator('.pfc-at--fixture', { hasText: 'nobody posted this' }).isVisible(), 'Challenge: the ATProto version is labelled as a fixture')
    const toggle = page.locator('.pfc-preview button[aria-controls]').first()
    check((await toggle.getAttribute('aria-expanded')) === 'false', 'Preview: closed until asked for')
    await toggle.focus()
    await page.keyboard.press('Enter')
    check((await toggle.getAttribute('aria-expanded')) === 'true' && (await page.locator('.pfc-diff td.is-changed').count()) >= 2, 'Preview: the record’s changed fields are shown side by side')
    check(await page.locator('.pfc-probe', { hasText: 'does not move' }).isVisible(), 'Preview: it says honestly that the ranking does not move')
    check(await page.locator('.pfc-preview', { hasText: 'stay exactly as they are' }).isVisible(), 'Preview: it says the sources are unchanged')
    await shot(page, 'commons-preview-768')
    await context.close()
  }

  // 6. Elsewhere: a live ATProto record, its identity note, and its disappearance.
  {
    const { context, page } = await open({ viewport: { width: 390, height: 900 } })
    await page.goto(`${site}compromised-ca-roots/`)
    await page.waitForLoadState('networkidle')
    const card = page.locator('#elsewhere .pfc-at').first()
    check(await card.locator('text=shindakun.net').first().isVisible(), 'Elsewhere: the live post that links #229 is attached')
    check(await card.locator('text=implies authorship; nothing verifies it').isVisible(), 'Elsewhere: the GitHub ↔ ATProto identity is graded, not assumed')
    await page.locator('#elsewhere button', { hasText: 'Simulate' }).click()
    check(await page.locator('#elsewhere .pfc-at--gone', { hasText: 'keeps its address and hash, not its words' }).isVisible(), 'Elsewhere: a deleted record keeps its address, not its words')
    await shot(page, 'commons-elsewhere-390')
    await context.close()
  }

  // 7. Reduced motion, no JavaScript, unknown problem, base path.
  {
    const { context, page } = await open({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
    await page.goto(`${site}emmc-not-exposed/`)
    const t = await page.locator('.pfc-cord').first().evaluate((e) => getComputedStyle(e).transitionDuration)
    check(t === '0s', 'Reduced motion: cords do not animate')
    const internal = await page.locator('.pfc a[href^="/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')))
    check(internal.length > 0 && internal.every((h) => h.startsWith(BASE)), 'Base path: every internal link stays under /postack-underflow/')
    await context.close()
  }
  {
    const { context, page } = await open({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false })
    await page.goto(`${site}emmc-not-exposed/`)
    check((await page.locator('.pfc-board').isVisible()) && (await page.locator('.pfc-thread').isVisible()), 'No JS: both projections are shown')
    check((await page.locator('.pfc-entry__quote q').count()) >= 8, 'No JS: every source and its quote is readable')
    await page.goto(site)
    check((await page.locator('.pfc-drawer li').count()) === 18, 'No JS: all 18 problems can be browsed')
    check(await page.locator('noscript').count() > 0, 'No JS: the search says it needs JavaScript')
    const missing = await page.goto(`${site}not-a-problem/`)
    check(missing.status() === 404 && (await page.locator('h1').first().isVisible()), 'Unknown problem: the site’s 404 page, not a crash')
    await context.close()
  }
  {
    const { context, page } = await open({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' })
    await page.goto(`${site}gadget-error-71/`)
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    check(bg === 'rgb(22, 25, 29)', 'Dark mode: the Commons uses the night ground')
    await shot(page, 'commons-dark-1440')
    await context.close()
  }
} finally {
  await browser.close()
  server.close()
}

for (const f of failures) console.error(`✗ ${f}`)
console.log(`Commons browser checks: ${passes.length} passed, ${failures.length} failed`)
process.exit(failures.length ? 1 : 0)
