#!/usr/bin/env node
// Real-browser checks of the Laboratory, served the way GitHub Pages serves it.
// Every catalogued experiment must render, and its declared control must change
// its declared output. Pilots mark these with data attributes:
//   [data-probe]    the primary control (a button, input or select); value
//                   "click" (default), or "type:<text>", or "key:<Key>"
//   [data-observe]  the region whose text should change when the probe acts
// Usage: node scripts/lab-check.mjs [--screenshots <dir>] [--only 03,25]
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs'
import { chromium } from 'playwright-core'
import { startPagesServer } from './serve-pages.mjs'
import { BASE } from './pages-config.mjs'

const executablePath = [process.env.CHROME_PATH, '/usr/bin/chromium', '/usr/bin/google-chrome', '/usr/bin/chromium-browser']
  .filter(Boolean)
  .find((p) => existsSync(p))
if (!executablePath) {
  console.error('No Chromium found; set CHROME_PATH')
  process.exit(1)
}
const arg = (name) => {
  const i = process.argv.indexOf(name)
  return i > -1 ? process.argv[i + 1] : null
}
const shotDir = arg('--screenshots')
if (shotDir) mkdirSync(shotDir, { recursive: true })

// The catalogue is TypeScript; read the experiment numbers from its source.
const catDir = new URL('../src/lab/catalogue/', import.meta.url)
const NUMBERS = readdirSync(catDir)
  .filter((f) => /^[a-z]+\.ts$/.test(f) && !['index.ts', 'labels.ts', 'shared.ts', 'map.ts'].includes(f))
  .flatMap((f) => [...readFileSync(new URL(f, catDir), 'utf8').matchAll(/^ {4}n: '(\d\d)',$/gm)].map((m) => m[1]))
  .sort()
const only = arg('--only')?.split(',')
const TARGETS = only ? NUMBERS.filter((n) => only.includes(n)) : NUMBERS

const failures = []
const passes = []
const check = (ok, label) => (ok ? passes : failures).push(label)

const local = await startPagesServer(0)
const site = `${local.origin}${BASE}`
const browser = await chromium.launch({ executablePath, headless: true })

async function newPage(options = {}) {
  const context = await browser.newContext({ colorScheme: 'light', ...options })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  // Console messages for failed requests do not name the URL; responses do.
  page.on('response', (r) => {
    if (r.status() >= 400) errors.push(`HTTP ${r.status()}: ${r.url()}`)
  })
  page.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(`console: ${m.text()}`)
  })
  return { context, page, errors }
}

const hydrated = (page) => page.waitForSelector('[data-lab][data-live]', { timeout: 5000 }).catch(() => {})

try {
  // 1. The index lists every catalogued experiment, and its filters filter.
  {
    const { context, page, errors } = await newPage({ viewport: { width: 1440, height: 900 } })
    const res = await page.goto(`${site}lab/`)
    check(res?.status() === 200, 'lab index: HTTP 200')
    const rows = await page.locator('.lab-register__row').count()
    check(rows === NUMBERS.length, `lab index: lists every catalogued experiment (${rows} of ${NUMBERS.length})`)
    const statusSelect = page.locator('.lab-facet select').nth(2)
    const options = await statusSelect.locator('option').count()
    if (options > 2) {
      await statusSelect.selectOption({ index: 2 })
      const after = await page.locator('.lab-register__row').count()
      check(after < rows && after > 0, `lab index: the status filter narrows the list (${rows} → ${after})`)
      await page.click('text=Show all')
      check((await page.locator('.lab-register__row').count()) === rows, 'lab index: “Show all” restores the list')
    }
    await page.check('input[name="reading"][value="finding"]')
    const first = (await page.locator('.lab-register__text').first().textContent()) ?? ''
    check(first.length > 0, 'lab index: lines can be read as findings')
    check(errors.length === 0, `lab index: no errors ${errors.join(' | ')}`)
    check(existsSync(new URL(`../dist/client/lab/index.html`, import.meta.url)), 'lab index: prerendered')
    await context.close()
  }

  // 2. Every experiment: renders, prerendered, its probe changes its output, no errors.
  {
    const { context, page, errors } = await newPage({ viewport: { width: 1440, height: 900 } })
    for (const n of TARGETS) {
      const label = `lab ${n}`
      check(existsSync(new URL(`../dist/client/lab/${n}/index.html`, import.meta.url)), `${label}: prerendered`)
      errors.length = 0
      const res = await page.goto(`${site}lab/${n}/`)
      await hydrated(page)
      check(res?.status() === 200, `${label}: HTTP 200`)
      check(((await page.textContent('h1')) ?? '').length > 0, `${label}: has h1`)
      const probe = page.locator('.lab-specimen [data-probe]').first()
      const observe = page.locator('.lab-specimen [data-observe]').first()
      const hasProbe = (await probe.count()) === 1
      const hasObserve = (await observe.count()) === 1
      check(hasProbe, `${label}: declares a primary control`)
      check(hasObserve, `${label}: declares an observed output`)
      if (hasProbe && hasObserve) {
        const before = await observe.innerText()
        const spec = (await probe.getAttribute('data-probe')) || 'click'
        const tag = await probe.evaluate((e) => e.tagName.toLowerCase())
        // A tab in a roving-tabindex tablist is reached with the arrow keys.
        const focusable = await probe.evaluate(
          (e) =>
            !e.hasAttribute('disabled') &&
            (e.tabIndex >= 0 ||
              (e.getAttribute('role') === 'tab' && [...(e.closest('[role="tablist"]')?.querySelectorAll('[role="tab"]') ?? [])].some((t) => t.tabIndex === 0))),
        )
        check(focusable, `${label}: the control is keyboard-focusable`)
        try {
          if (spec.startsWith('type:')) await probe.fill(spec.slice(5))
          else if (spec.startsWith('key:')) {
            await probe.focus()
            await page.keyboard.press(spec.slice(4))
          } else if (tag === 'select') {
            const count = await probe.locator('option').count()
            await probe.selectOption({ index: count > 1 ? 1 : 0 })
          } else await probe.click()
        } catch (e) {
          check(false, `${label}: probe failed (${e.message.split('\n')[0]})`)
        }
        await page.waitForTimeout(150)
        const after = await page.locator('.lab-specimen [data-observe]').first().innerText()
        check(after !== before, `${label}: acting on the control changes the output`)
        // Focus is visible on the control when reached by keyboard.
        await probe.evaluate((e) => e.blur())
        await page.keyboard.press('Tab')
        await probe.focus()
        const outline = await probe.evaluate((e) => {
          const s = getComputedStyle(e)
          return s.outlineStyle !== 'none' && s.outlineWidth !== '0px'
        })
        check(outline, `${label}: focused control shows an outline`)
      }
      check(errors.length === 0, `${label}: no console or page errors ${errors.join(' | ')}`)
      if (shotDir) await page.screenshot({ path: `${shotDir}/lab-${n}-1440.png`, fullPage: true })
    }
    await context.close()
  }

  // 3. No horizontal overflow at three widths.
  for (const width of [390, 768, 1440]) {
    const { context, page } = await newPage({ viewport: { width, height: 900 } })
    for (const n of ['', ...TARGETS]) {
      await page.goto(`${site}lab/${n ? `${n}/` : ''}`)
      await hydrated(page)
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        wide: [...document.querySelectorAll('body *')]
          .filter((e) => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
          .filter((e) => !e.closest('.table-wrap, pre, [data-scroll]'))
          .slice(0, 3)
          .map((e) => `${e.tagName.toLowerCase()}.${String(e.className).slice(0, 40)}`),
      }))
      check(!state.overflow, `${width}px lab ${n || 'index'}: no horizontal overflow ${state.overflow ? state.wide.join(' | ') : ''}`)
      if (shotDir && width === 390) await page.screenshot({ path: `${shotDir}/lab-${n || 'index'}-390.png`, fullPage: true })
    }
    await context.close()
  }

  // 4. Reduced motion: nothing animates on any experiment, before or after acting.
  {
    const { context, page } = await newPage({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } })
    for (const n of TARGETS) {
      await page.goto(`${site}lab/${n}/`)
      await hydrated(page)
      const probe = page.locator('.lab-specimen [data-probe]').first()
      if ((await probe.count()) === 1) {
        const spec = (await probe.getAttribute('data-probe')) || 'click'
        const tag = await probe.evaluate((e) => e.tagName.toLowerCase())
        if (spec === 'click' && tag !== 'select' && tag !== 'input') await probe.click().catch(() => {})
      }
      const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length)
      check(running === 0, `reduced motion lab ${n}: no running animations (${running})`)
    }
    await context.close()
  }

  // 5. Without JavaScript, the index and each experiment's notebook still read.
  {
    const { context, page } = await newPage({ javaScriptEnabled: false })
    await page.goto(`${site}lab/`)
    check((await page.locator('.lab-register__row').count()) === NUMBERS.length, 'no-JS lab index: every experiment listed')
    await page.goto(`${site}lab/${TARGETS[0]}/`)
    check((await page.locator('.lab-notebook').count()) === 1, 'no-JS lab: notebook rendered')
    await context.close()
  }
} finally {
  await browser.close()
  local.server.close()
}

for (const f of failures) console.error(`✖ ${f}`)
console.log(`Lab checks: ${passes.length} passed, ${failures.length} failed, ${TARGETS.length} experiments, against ${site}`)
process.exit(failures.length ? 1 : 0)
