#!/usr/bin/env node
// GitHub Pages serves 404.html for any unknown path, but the prerendered page
// carries router state for /404, so hydrating it at another URL mismatches.
// Ship it as plain HTML instead: strip scripts and module preloads.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { OUT_DIR } from './pages-config.mjs'

const file = fileURLToPath(new URL('404.html', OUT_DIR))
const html = readFileSync(file, 'utf8')
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
  .replace(/<link rel="modulepreload"[^>]*>/g, '')
writeFileSync(file, html)
console.log('404.html: scripts removed, served as static HTML')
