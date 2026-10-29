#!/usr/bin/env node
// Validates the static build in dist/client for GitHub Pages at BASE:
// every route has an index.html, 404.html exists, and every root-relative
// href/src stays under BASE and resolves to a file in the build.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, relative } from 'node:path'
import { BASE, OUT_DIR, ROUTES } from './pages-config.mjs'

const out = fileURLToPath(OUT_DIR)
const errors = []

const notFound = join(out, '404.html')
if (existsSync(notFound) && /<script\b/.test(readFileSync(notFound, 'utf8'))) {
  errors.push('404.html must not contain scripts (see scripts/finalize-404.mjs)')
}

if (!existsSync(out)) {
  console.error(`No build found at ${out}. Run npm run build first.`)
  process.exit(1)
}

// Every catalogued laboratory experiment needs its own prerendered page. The
// catalogue is TypeScript, so its experiment numbers are read from source.
const catDir = new URL('../src/lab/catalogue/', import.meta.url)
const LAB = readdirSync(catDir)
  .filter((f) => /^[a-z]+\.ts$/.test(f) && !['index.ts', 'labels.ts', 'shared.ts', 'map.ts'].includes(f))
  .flatMap((f) => [...readFileSync(new URL(f, catDir), 'utf8').matchAll(/^ {4}n: '(\d\d)',$/gm)].map((m) => `lab/${m[1]}/`))

for (const route of [...ROUTES.map((r) => `${r}index.html`), ...LAB.map((r) => `${r}index.html`), '404.html']) {
  if (!existsSync(join(out, route))) errors.push(`missing page: ${route}`)
}

// Jekyll-style processing on Pages drops paths whose segments start with "_"
// (the failure mode that left another project's deploy unstyled). We deploy
// via Actions without Jekyll and ship .nojekyll, but refuse such paths anyway.
if (!existsSync(join(out, '.nojekyll'))) errors.push('missing .nojekyll')

const htmlFiles = []
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (name.startsWith('_')) errors.push(`underscore path would be dropped by Jekyll: ${relative(out, path)}`)
    if (statSync(path).isDirectory()) walk(path)
    else if (name.endsWith('.html')) htmlFiles.push(path)
  }
}
walk(out)

const resolveTarget = (url) => {
  const path = decodeURIComponent(url.split(/[?#]/)[0].slice(BASE.length))
  const target = join(out, path)
  if (path === '' || path.endsWith('/')) return existsSync(join(target, 'index.html'))
  return existsSync(target)
}

let checked = 0
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8')
  const name = relative(out, file)
  // Attribute values in markup plus asset URLs inside the inline router manifest.
  const urls = [
    ...[...html.matchAll(/\s(?:href|src)="([^"]*)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/"(\/[^"\s]*\.(?:js|css))"/g)].map((m) => m[1]),
  ]
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${name}: missing <title>`)
  // Every page must link a non-trivial stylesheet; a green build with an
  // unstyled page is the regression this guards against.
  const css = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1])
  if (css.length === 0) errors.push(`${name}: no stylesheet linked`)
  for (const href of css) {
    const file = join(out, href.slice(BASE.length))
    if (href.startsWith(BASE) && existsSync(file) && statSync(file).size < 2000) {
      errors.push(`${name}: stylesheet ${href} is suspiciously small`)
    }
  }
  for (const url of urls) {
    if (!url.startsWith('/') || url.startsWith('//')) continue
    checked++
    if (!url.startsWith(BASE)) errors.push(`${name}: ${url} escapes base path ${BASE}`)
    else if (!resolveTarget(url)) errors.push(`${name}: ${url} does not resolve to a built file`)
  }
}

if (errors.length) {
  console.error(`Build validation failed (${errors.length}):\n  ${errors.join('\n  ')}`)
  process.exit(1)
}
console.log(`Build valid: ${htmlFiles.length} pages (${LAB.length} lab experiments), ${checked} internal URLs under ${BASE}`)
