#!/usr/bin/env node
// Real-browser checks of the built site served the way GitHub Pages serves it.
// Uses an installed Chromium (CHROME_PATH, or a common system path).
// Usage: node scripts/browser-check.mjs [--screenshots <dir>] [--url <deployed site root>]
// With --url, the checks run against a deployed site instead of a local server.
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

const urlIndex = process.argv.indexOf('--url')
const remote = urlIndex > -1 ? process.argv[urlIndex + 1].replace(/\/?$/, '/') : null
const local = remote ? null : await startPagesServer(0)
const site = remote ?? `${local.origin}${BASE}`
const server = local?.server
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
        // Elements poking past the viewport, ignoring content inside scroll containers.
        wide: [...document.querySelectorAll('body *')]
          .filter((e) => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
          .filter((e) => !e.closest('.table-wrap, pre, .record'))
          .slice(0, 4)
          .map((e) => `${e.tagName.toLowerCase()}.${e.className} "${(e.textContent ?? '').trim().slice(0, 30)}"`),
        h1: document.querySelector('h1')?.textContent ?? '',
      }))
      const label = `${width}px /${route}`
      check(res?.status() === 200, `${label}: HTTP 200`)
      check(state.bg === PAPER, `${label}: stylesheet applied (body ${state.bg})`)
      check(!state.overflow, `${label}: no horizontal overflow ${state.overflow ? state.wide.join(' | ') : ''}`)
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
      detail: document
        .getAnimations()
        .slice(0, 4)
        .map((x) => `${x.constructor.name}:${x.transitionProperty ?? x.animationName ?? ''}@${x.effect?.target?.className ?? ''}`),
    }))
    check(state.scroll === 'auto', 'reduced motion: scroll-behavior auto')
    check(state.animations === 0, `reduced motion: no running animations (${state.animations}) ${state.detail.join(' | ')}`)
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

  // 7. Disputed Neighbour: a verdict is local, and the question tells the cases apart.
  {
    const { context, page, errors } = await newPage()
    await page.goto(`${site}indexing/`)
    const dn = page.locator('[data-experiment="disputed-neighbour"]')
    check((await dn.locator('.is-unsupported').count()) >= 1, 'Disputed Neighbour flags writer-added vocabulary absent from the source')
    await dn.getByRole('button', { name: 'Split them' }).click()
    check((await dn.locator('.claim__status').textContent())?.includes('disputed') ?? false, 'splitting marks the claim disputed in this view')
    await dn.getByLabel('Failing URL').fill('https://tykavanaugh.github.io/assets/index.0c785174.js')
    await dn.getByLabel('Repository name').fill('solardeploy')
    check((await dn.locator('.urlcheck__result').textContent())?.startsWith('A') ?? false, 'URL check routes the base-path case to A')
    await dn.getByLabel('Failing URL').fill('https://you.github.io/site/assets/_plugin-vue_export-helper.js')
    await dn.getByLabel('Repository name').fill('site')
    check((await dn.locator('.urlcheck__result').textContent())?.startsWith('B') ?? false, 'URL check routes the underscore case to B')
    await dn.getByRole('button', { name: 'Undo' }).click()
    check((await dn.locator('.claim__status').textContent())?.includes('proposed') ?? false, 'verdict can be undone')
    check(errors.length === 0, `Disputed Neighbour: no errors ${errors.join(' | ')}`)
    await context.close()
  }

  // 8. Switchboard: contracts, a reader proposal, and the operator leaving.
  {
    const { context, page, errors } = await newPage()
    await page.goto(`${site}community/`)
    const sb = page.locator('[data-experiment="switchboard"]')
    await sb.getByRole('button', { name: /c5 → c4/ }).click()
    const contract = (await sb.locator('.contract').textContent()) ?? ''
    check(contract.includes('Proposed by a language model') && contract.includes('Not a statement by either author'), 'model connection is labelled as not an author statement')
    await sb.locator('.propose select').first().selectOption('c3')
    await sb.locator('.propose input[type="text"]').fill('Both ask how the queries were written')
    await sb.getByRole('button', { name: 'Add to this view' }).click()
    check((await sb.locator('.cm-status').textContent())?.includes('1 proposed by you') ?? false, 'reader can propose a connection')
    check((await sb.locator('.contract').textContent())?.includes('Proposed by you') ?? false, 'reader proposal is attributed to the reader')
    const before = await sb.locator('.cable').count()
    await sb.getByRole('button', { name: 'The operator leaves' }).click()
    await page.waitForTimeout(900) // the fade is tied to the state change and takes 600 ms
    check((await sb.locator('.cm-status').textContent())?.includes('The operator has left') ?? false, 'operator leaves')
    const opacity = await sb.locator('.cable').first().evaluate((el) => getComputedStyle(el).opacity)
    check(before > 0 && opacity === '0', `connections disappear when the operator leaves (opacity ${opacity})`)
    check((await sb.locator('.contract-list li').count()) === 8, 'all eight contributions remain listed')
    check((await sb.locator('.endpoint-detail').count()) === 1, 'a contribution can still be inspected')
    await sb.getByRole('button', { name: 'Bring the operator back' }).click()
    check((await sb.locator('.cm-status').textContent())?.includes('connections drawn') ?? false, 'operator returns')
    check(errors.length === 0, `Switchboard: no errors ${errors.join(' | ')}`)
    await context.close()
  }

  // 9. Problem Desk: a correction previewed locally.
  {
    const { context, page, errors } = await newPage()
    await page.goto(`${site}convergence/`)
    const desk = page.locator('[data-experiment="problem-desk"]')
    check((await desk.locator('.desk__verdict').textContent())?.includes('Accept one or both') ?? false, 'desk starts with no preview')
    await desk.locator('.desk__part--source input').check()
    check((await desk.locator('.desk__verdict').textContent())?.includes('rank 7 → rank 2') ?? false, 'grounded correction previews rank 7 → 2')
    await desk.locator('.desk__part--source input').uncheck()
    await desk.locator('.desk__part--inference input').check()
    check((await desk.locator('.desk__verdict').textContent())?.includes('rank 7 → rank 2') ?? false, 'guessed correction helps exactly as much')
    check(errors.length === 0, `Problem Desk: no errors ${errors.join(' | ')}`)
    await context.close()
  }

  // 10. Without JavaScript the essay and the record catalogue still read.
  {
    const { context, page } = await newPage({ javaScriptEnabled: false })
    await page.goto(`${site}indexing/`)
    const records = await page.locator('.fw-catalogue .ledger > li').count()
    check(records >= 20, `no-JS: record catalogue rendered (${records})`)
    await page.goto(site)
    check((await page.locator('.scrolly__inline-figure figure').count()) === 4, 'no-JS: every scrolly step has its figure')
    await page.goto(`${site}afterword/`)
    check((await page.locator('.krecord').count()) === 1, 'no-JS: knowledge record rendered')
    check((await page.locator('.history__entry').count()) >= 8, 'no-JS: research history rendered')
    await page.goto(`${site}community/`)
    check((await page.locator('.contract-list li').count()) === 7, 'no-JS: connection contracts listed (withdrawn hidden)')
    await page.goto(`${site}convergence/`)
    check((await page.locator('.desk__ranking li').count()) >= 5, 'no-JS: frozen ranking on the desk')
    await context.close()
  }
} finally {
  await browser.close()
  server?.close()
}

for (const f of failures) console.error(`✖ ${f}`)
console.log(`Browser checks: ${passes.length} passed, ${failures.length} failed against ${site} (Chromium at ${executablePath})`)
process.exit(failures.length ? 1 : 0)
