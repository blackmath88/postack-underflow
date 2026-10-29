#!/usr/bin/env node
// Behaviour checks for the laboratory's developed specimens (Level C). Each
// file in scripts/specimens/ exports `n` (the pilot number) and
// `run({ page, site, check })`, and checks that the specimen's documented
// finding can be reproduced through its interface, not only computed.
import { existsSync, readdirSync } from 'node:fs'
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

const dir = new URL('./specimens/', import.meta.url)
const files = readdirSync(dir).filter((f) => f.endsWith('.mjs')).sort()
const failures = []
const passes = []
const local = await startPagesServer(0)
const site = `${local.origin}${BASE}`
const browser = await chromium.launch({ executablePath, headless: true })

try {
  for (const f of files) {
    const mod = await import(new URL(f, dir))
    for (const scheme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: scheme })
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', (e) => errors.push(e.message))
      const check = (ok, label) => (ok ? passes : failures).push(`specimen ${mod.n} (${scheme}): ${label}`)
      await page.goto(`${site}lab/${mod.n}/`)
      await page.waitForSelector('[data-lab][data-live]', { timeout: 5000 })
      // The scheme only matters for legibility; the behaviour checks run once.
      if (scheme === 'light') await mod.run({ page, site, check })
      const contrast = await page.evaluate(() => {
        const el = document.querySelector('.lab-specimen')
        const fg = getComputedStyle(el).color
        const bg = getComputedStyle(document.body).backgroundColor
        return { fg, bg }
      })
      check(contrast.fg !== contrast.bg, `text and ground differ (${contrast.fg} on ${contrast.bg})`)
      check(errors.length === 0, `no page errors ${errors.join(' | ')}`)
      await context.close()
    }
  }
} finally {
  await browser.close()
  local.server.close()
}

for (const f of failures) console.error(`✖ ${f}`)
console.log(`Specimen checks: ${passes.length} passed, ${failures.length} failed, ${files.length} specimens`)
process.exit(failures.length ? 1 : 0)
