#!/usr/bin/env node
// Serves dist/client the way GitHub Pages serves a project site: under BASE,
// redirecting folder paths without a trailing slash and falling back to
// 404.html. For local verification only.
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BASE, OUT_DIR } from './pages-config.mjs'

const out = fileURLToPath(OUT_DIR)
const port = Number(process.env.PORT ?? 4173)
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
}

const send = (res, status, file) => {
  res.writeHead(status, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
  res.end(readFileSync(file))
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  if (url.pathname === BASE.slice(0, -1)) {
    res.writeHead(301, { location: BASE }).end()
    return
  }
  if (!url.pathname.startsWith(BASE)) return send(res, 404, join(out, '404.html'))
  const path = normalize(join(out, decodeURIComponent(url.pathname.slice(BASE.length))))
  if (!path.startsWith(out)) return send(res, 404, join(out, '404.html'))
  if (existsSync(path) && statSync(path).isDirectory()) {
    if (!url.pathname.endsWith('/')) {
      res.writeHead(301, { location: `${url.pathname}/${url.search}` }).end()
      return
    }
    const index = join(path, 'index.html')
    return existsSync(index) ? send(res, 200, index) : send(res, 404, join(out, '404.html'))
  }
  if (existsSync(path)) return send(res, 200, path)
  send(res, 404, join(out, '404.html'))
}).listen(port, () => console.log(`Serving dist/client at http://localhost:${port}${BASE}`))
