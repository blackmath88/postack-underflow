#!/usr/bin/env node
// Counts the visible prose on each route of the built site, at 1440 px, so an
// editorial pass can be compared with the version before it. Prose means
// paragraphs, list items, headings and captions outside tables, experiments
// and figures; closed margin notes are hidden and so are not counted.
// Usage: node scripts/measure-surface.mjs [screenshot dir or ''] <route> ...
import { chromium } from 'playwright-core'
import { startPagesServer } from './serve-pages.mjs'
const out = process.argv[2]; const routes = process.argv.slice(3)
const s = await startPagesServer(0)
const b = await chromium.launch({ executablePath: '/usr/bin/chromium' })
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const rows = []
for (const r of routes) {
  await p.goto(`${s.origin}/postack-underflow/${r}`)
  const m = await p.evaluate(() => {
    const main = document.querySelector('main')
    const vis = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
    // Visible prose: paragraphs and list items outside tables and experiments, as rendered.
    const prose = [...main.querySelectorAll('p, li, h1, h2, h3, blockquote, figcaption')]
      .filter((e) => vis(e) && !e.closest('table, [data-experiment], .scrolly__figure, .fw-catalogue') && !e.parentElement.closest('p, li'))
    const words = (t) => t.trim().split(/\s+/).filter(Boolean).length
    return {
      prose: prose.reduce((n, e) => n + words(e.innerText), 0),
      all: words(main.innerText),
      tables: main.querySelectorAll('table').length,
      height: document.documentElement.scrollHeight,
    }
  })
  rows.push({ route: '/' + r, ...m })
  if (out) await p.screenshot({ path: `${out}/${(r.replace(/\//g, '-') || 'home').replace(/-$/, '')}-1440.jpg`, type: 'jpeg', quality: 60, fullPage: false })
}
console.log(JSON.stringify(rows))
await b.close(); s.server.close()
