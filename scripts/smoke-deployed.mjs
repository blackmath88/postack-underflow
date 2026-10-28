#!/usr/bin/env node
// Checks what a deployed site actually serves, not what the build produced:
// every route returns HTML that links a real stylesheet and module script,
// those assets come back with the right content types, and unknown paths 404.
// Usage: node scripts/smoke-deployed.mjs [https://blackmath88.github.io/postack-underflow/]
import { ROUTES } from './pages-config.mjs'

const root = new URL(process.argv[2] ?? 'https://blackmath88.github.io/postack-underflow/')
const errors = []
const seen = new Map()

async function get(url) {
  if (seen.has(url)) return seen.get(url)
  const res = await fetch(url, { redirect: 'follow' })
  const body = await res.text()
  const result = { status: res.status, type: res.headers.get('content-type') ?? '', body }
  seen.set(url, result)
  return result
}

for (const route of ROUTES) {
  const url = new URL(route, root).href
  const page = await get(url)
  if (page.status !== 200) {
    errors.push(`${url}: HTTP ${page.status}`)
    continue
  }
  if (!page.type.includes('text/html')) errors.push(`${url}: content-type ${page.type}`)
  const css = [...page.body.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1])
  const js = [...page.body.matchAll(/<script type="module"[^>]*src="([^"]+)"/g)].map((m) => m[1])
  if (!css.length) errors.push(`${url}: no stylesheet`)
  if (!js.length) errors.push(`${url}: no module script`)
  for (const href of css) {
    const asset = await get(new URL(href, url).href)
    if (asset.status !== 200 || !asset.type.includes('text/css') || asset.body.length < 2000) {
      errors.push(`${href}: HTTP ${asset.status}, ${asset.type}, ${asset.body.length} bytes`)
    }
  }
  for (const src of js) {
    const asset = await get(new URL(src, url).href)
    if (asset.status !== 200 || !/javascript/.test(asset.type)) {
      errors.push(`${src}: HTTP ${asset.status}, ${asset.type}`)
    }
  }
}

const missing = await get(new URL('this-route-does-not-exist/', root).href)
if (missing.status !== 404) errors.push(`unknown route: expected 404, got ${missing.status}`)
else if (!missing.body.includes('Nobody has solved this one yet.')) errors.push('unknown route: not the site 404 page')

if (errors.length) {
  console.error(`Deployed site check failed for ${root.href} (${errors.length}):\n  ${errors.join('\n  ')}`)
  process.exit(1)
}
console.log(`Deployed site OK: ${ROUTES.length} routes, ${seen.size} URLs checked at ${root.href}`)
