#!/usr/bin/env node
// Real-browser checks of the built site served the way GitHub Pages serves it.
// Uses an installed Chromium (CHROME_PATH, or a common system path).
// Usage: node scripts/browser-check.mjs [--screenshots <dir>]
import { existsSync, mkdirSync } from 'node:fs'
import { chromium } from 'playwright-core'
import { startPagesServer } from './serve-pages.mjs'
import { BASE, ROUTES } from './pages-config.mjs'

const executablePath = [process.env.CHROME_PATH, '/usr/bin/chromium', '/usr/bin/google-chrome', '/usr/bin/chromium-browser']
  .filter(Boolean)
  .find((p) => existsSync(p))
if (!executablePath) {
  console.error('No Chromium found; set CHROME_PATH')
  process.exit(1)
}
const shotIndex = process.argv.indexOf('--screenshots')
const shotDir = shotIndex > -1 ? process.argv[shotIndex + 1] : null
if (shotDir) mkdirSync(shotDir, { recursive: true })

const PAPER = 'rgb(245, 243, 236)'
const NIGHT = 'rgb(22, 25, 29)'
const failures = []
const passes = []
const check = (ok, label) => (ok ? passes : failures).push(label)

const { server, origin } = await startPagesServer(0)
const site = `${origin}${BASE}`
const browser = await chromium.launch({ executablePath, headless: true })

async function newPage(options = {}) {
  const context = await browser.newContext({ colorScheme: 'light', ...options })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (m) => {
    // The 404 page is expected to produce one failed document request.
    if (m.type() === 'error' && !/status of 404/.test(m.text())) errors.push(`console: ${m.text()}`)
  })
  return { context, page, errors }
}

try {
  // 1. Every route at three widths: styled, no overflow, no errors.
  for (const width of [390, 768, 1440]) {
    const { context, page, errors } = await newPage({ viewport: { width, height: 900 } })
    for (const route of ROUTES) {
      const res = await page.goto(`${site}${route}`)
      const state = await page.evaluate(() => ({
        bg: getComputedStyle(document.body).backgroundColor,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        h1: document.querySelector('h1')?.textContent ?? '',
      }))
      const label = `${width}px /${route}`
      check(res?.status() === 200, `${label}: HTTP 200`)
      check(state.bg === PAPER, `${label}: stylesheet applied (body ${state.bg})`)
      check(!state.overflow, `${label}: no horizontal overflow`)
      check(state.h1.length > 0, `${label}: has h1`)
      if (shotDir) await page.screenshot({ path: `${shotDir}/${width}-${route.replace(/\//g, '') || 'home'}.png`, fullPage: true })
    }
    check(errors.length === 0, `${width}px: no console or page errors ${errors.join(' | ')}`)
    await context.close()
  }

  // 2. Dark mode, 404, direct refresh without trailing slash.
  {
    const { context, page } = await newPage({ colorScheme: 'dark' })
    await page.goto(`${site}community`)
    check(page.url().endsWith('/community/'), 'folder route without slash redirects to canonical form')
    check((await page.evaluate(() => getComputedStyle(document.body).backgroundColor)) === NIGHT, 'dark scheme applies night ground')
    const res = await page.goto(`${site}no-such-page/`)
    check(res?.status() === 404, 'unknown route returns 404')
    check((await page.textContent('h1'))?.includes('Nobody has solved this one yet.') ?? false, 'unknown route shows site 404 page')
    await context.close()
  }

  // 3. Client-side navigation keeps the document (no full reload).
  {
    const { context, page, errors } = await newPage()
    await page.goto(site)
    await page.evaluate(() => ((window).__marker = 1))
    await page.click(`header a[href="${BASE}indexing/"]`)
    await page.waitForURL(`${site}indexing/`)
    check((await page.evaluate(() => (window).__marker)) === 1, 'header navigation is client-side')
    const titled = await page
      .waitForFunction(() => document.title.startsWith('Indexing'), null, { timeout: 3000 })
      .then(() => true, () => false)
    check(titled, 'title updates on navigation')
    check(errors.length === 0, `navigation: no errors ${errors.join(' | ')}`)
    await context.close()
  }

  // 4. Keyboard: skip link first, then into main; visible focus.
  {
    const { context, page } = await newPage()
    await page.goto(`${site}notes/`)
    await page.keyboard.press('Tab')
    check((await page.evaluate(() => document.activeElement?.textContent)) === 'Skip to content', 'first Tab reaches skip link')
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle)
    check(outline === 'solid', 'focused element has a visible outline')
    await page.keyboard.press('Enter')
    check((await page.evaluate(() => document.activeElement?.id)) === 'main', 'skip link moves focus to main')
    await context.close()
  }

  // 5. Reduced motion: no smooth scrolling, nothing animating.
  {
    const { context, page } = await newPage({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } })
    await page.goto(site)
    await page.mouse.wheel(0, 2500)
    const state = await page.evaluate(() => ({
      scroll: getComputedStyle(document.documentElement).scrollBehavior,
      animations: document.getAnimations().length,
    }))
    check(state.scroll === 'auto', 'reduced motion: scroll-behavior auto')
    check(state.animations === 0, `reduced motion: no running animations (${state.animations})`)
    await context.close()
  }

  // 6. Four Words: a query, a no-match query, keyboard submit.
  {
    const { context, page, errors } = await newPage()
    await page.goto(`${site}indexing/`)
    const input = page.getByLabel('Your problem, in a few words')
    await input.fill('css missing after deploy')
    await input.press('Enter')
    const hits = await page.locator('.fw-columns .fw-results').first().locator('> li').count()
    check(hits > 0, `Four Words returns ranked records (${hits})`)
    check((await page.locator('.fw-why').count()) > 0, 'Four Words explains matches')
    check((await page.textContent('.fw-status'))?.includes('did not and are kept below') ?? false, 'unmatched records are kept')
    await input.fill('zzqx wwvy')
    await input.press('Enter')
    check((await page.textContent('.fw-status'))?.includes('No record matched') ?? false, 'no-match query states a gap')
    check((await page.locator('.fw-gap').count()) === 1, 'unknown words are reported')
    await input.fill('the and of')
    await input.press('Enter')
    check((await page.textContent('.fw-status'))?.includes('no searchable words') ?? false, 'stopword-only query handled')
    check(errors.length === 0, `Four Words: no errors ${errors.join(' | ')}`)
    await context.close()
  }

  // 7. Community: removing every relation leaves every contribution.
  {
    const { context, page } = await newPage()
    await page.goto(`${site}community/`)
    const cards = async () => page.locator('.assembler .cm-card').count()
    const before = await cards()
    await page.getByRole('button', { name: 'Remove every relation' }).click()
    check((await page.textContent('.cm-status'))?.includes('0 relations') ?? false, 'all relations removed')
    check((await cards()) === before, `every contribution still shown (${before})`)
    await page.getByRole('button', { name: 'Source ledger' }).click()
    check((await page.locator('.cm-ledger tbody tr').count()) === before, 'source ledger lists every contribution')
    await page.getByRole('button', { name: 'Assembled discussion' }).click()
    await page.getByRole('button', { name: 'Reconnect everything' }).click()
    check((await page.locator('.cm-relation--model-proposed').count()) > 0, 'model proposals visible only when switched on')
    await context.close()
  }

  // 8. Without JavaScript the essay and the record catalogue still read.
  {
    const { context, page } = await newPage({ javaScriptEnabled: false })
    await page.goto(`${site}indexing/`)
    const records = await page.locator('.fw-catalogue .ledger > li').count()
    check(records >= 20, `no-JS: record catalogue rendered (${records})`)
    await page.goto(site)
    check((await page.locator('.scrolly__inline-figure figure').count()) === 4, 'no-JS: every scrolly step has its figure')
    await page.goto(`${site}convergence/`)
    check((await page.locator('.krecord').count()) === 1, 'no-JS: knowledge record rendered')
    await context.close()
  }
} finally {
  await browser.close()
  server.close()
}

for (const f of failures) console.error(`✖ ${f}`)
console.log(`Browser checks: ${passes.length} passed, ${failures.length} failed (Chromium at ${executablePath})`)
process.exit(failures.length ? 1 : 0)
