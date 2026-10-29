#!/usr/bin/env node
// Regenerates the per-pilot table at the end of docs/lab/EVALUATION.md from
// the catalogue and the critique. Usage: node scripts/lab-evaluation.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { CATALOGUE, STATUS_LABEL } from '../src/lab/catalogue/index.ts'

const file = new URL('../docs/lab/EVALUATION.md', import.meta.url)
const marker = '<!-- The table below is generated'
const doc = readFileSync(file, 'utf8')
const head = doc.slice(0, doc.indexOf(marker))
const cell = (s) => s.replace(/\|/g, '\\|')
const rows = CATALOGUE.map((e) => {
  const a = e.assessment
  return `| ${e.n} | ${cell(e.title)} | ${STATUS_LABEL[e.status]} | ${a?.verdict ?? ''} | ${cell(a?.insight ?? '')} | ${cell(a?.experience ?? '')} |`
})
const table = [
  `${marker} from src/lab/catalogue/critique.ts by scripts/lab-evaluation.mjs. Do not edit it by hand. -->`,
  '',
  '| # | Pilot | Status | Verdict | Insight | Experience |',
  '|---|---|---|---|---|---|',
  ...rows,
  '',
].join('\n')
writeFileSync(file, head + table)
console.log(`EVALUATION.md: ${rows.length} pilots`)
