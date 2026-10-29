import { useId, useMemo, useState } from 'react'
import queriesFile from '../../../../corpus/queries.json'
import { artifact, recordBySource, sourceById } from '../../../lib/four-words-data'
import { search } from '../../../lib/retrieval'
import { toolOf } from './logic'

// 05 · The Wrong Door. A corridor of the first six results for a frozen
// query that names no tool. You say which tool you build with, then open
// doors. Behind each is the fix its record states. A fix written for another
// tool is a wrong door: it looks like your problem and asks you to change a
// setting your project does not have. "Which tool a source is for" is read
// from the repository it lives in. Frozen v1 data, read-only.

const QUERIES = queriesFile.queries as Array<{ id: string; query: string }>
const TOOLS = [...new Set(artifact.sources.map(toolOf).filter((t): t is string => !!t))].sort()
const CORRIDOR = 6

/** Queries that name no tool, so any framework's fix could plausibly answer them. */
const TOOL_WORDS = /vite|next|react|vue|angular|svelte|astro|gatsby|jekyll|homepage|router/i
const NEUTRAL = QUERIES.filter((q) => !TOOL_WORDS.test(q.query))

type Fit = 'yours' | 'general' | 'wrong'
const fit = (id: string, tool: string): Fit => {
  const t = toolOf(sourceById.get(id)!)
  return t === null ? 'general' : t === tool ? 'yours' : 'wrong'
}

// For every query and every tool: wrong doors standing before the first door that fits.
const TALLY = (['baseline', 'structured'] as const).map((system) => {
  let cases = 0
  let wrongFirst = 0
  let wrongBefore = 0
  for (const q of QUERIES) {
    const hits = search(artifact.indexes[system], q.query).hits.map((h) => h.id)
    for (const tool of TOOLS) {
      const i = hits.findIndex((id) => fit(id, tool) !== 'wrong')
      const n = i === -1 ? hits.length : i
      cases++
      wrongBefore += n
      if (n > 0) wrongFirst++
    }
  }
  return { system, cases, wrongFirst, mean: wrongBefore / cases }
})

const VERDICT: Record<Fit, string> = {
  yours: 'Written for your tool.',
  general: 'Written for no tool in particular. It may still not apply.',
  wrong: 'Wrong door.',
}

export default function WrongDoor() {
  const id = useId()
  const [tool, setTool] = useState('Vite')
  const [qid, setQid] = useState('q03')
  const [opened, setOpened] = useState<string[]>([])
  const q = QUERIES.find((x) => x.id === qid)!
  const doors = useMemo(() => search(artifact.indexes.structured, q.query).hits.slice(0, CORRIDOR).map((h) => h.id), [q])
  const last = opened[opened.length - 1]
  const wrongOpened = opened.filter((d) => fit(d, tool) === 'wrong').length
  const firstFit = doors.findIndex((d) => fit(d, tool) !== 'wrong')

  const restart = (next: { tool?: string; qid?: string }) => {
    if (next.tool) setTool(next.tool)
    if (next.qid) setQid(next.qid)
    setOpened([])
  }

  return (
    <div className="x05">
      <div className="x05__set">
        <label htmlFor={`${id}-tool`}>I build with</label>
        <select id={`${id}-tool`} value={tool} onChange={(e) => restart({ tool: e.target.value })}>
          {TOOLS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <label htmlFor={`${id}-q`}>and searched for</label>
        <select id={`${id}-q`} value={qid} onChange={(e) => restart({ qid: e.target.value })}>
          {NEUTRAL.map((x) => (
            <option key={x.id} value={x.id}>
              {x.query}
            </option>
          ))}
        </select>
      </div>

      <ol className="x05__corridor" aria-label={`The first ${CORRIDOR} results, as doors`}>
        {doors.map((d, i) => {
          const s = sourceById.get(d)!
          const open = opened.includes(d)
          const f = fit(d, tool)
          return (
            <li key={d}>
              <button
                type="button"
                className={`x05__door${open ? ` x05__door--open x05__door--${f}` : ''}`}
                aria-pressed={open}
                onClick={() => setOpened(open ? opened : [...opened, d])}
                data-probe={i === 0 ? 'click' : undefined}
              >
                <span className="x05__no">{i + 1}</span>
                <span className="x05__plate">{s.title.replace(/[`]/g, '').slice(0, 48)}</span>
                <span className="x05__tool">{open ? (toolOf(s) ?? 'general') : 'closed'}</span>
              </button>
            </li>
          )
        })}
      </ol>

      <section className="x05__behind" aria-live="polite" data-observe>
        {last ? (
          <Behind id={last} tool={tool} />
        ) : (
          <p className="x05__closed">All doors closed. Each plate is a result title; open one to read the fix behind it.</p>
        )}
        <p className="lab-out">
          Opened {opened.length} of {doors.length}; {wrongOpened} wrong. In this corridor the first door that fits a{' '}
          {tool} project is {firstFit === -1 ? 'not among these six' : `number ${firstFit + 1}`}.
        </p>
      </section>

      <p className="x05__tally lab-out">
        Every frozen query × every one of {TOOLS.length} tools ({TALLY[0]!.cases} corridors): plain keyword search puts a
        wrong door first in {TALLY[0]!.wrongFirst}, with {TALLY[0]!.mean.toFixed(1)} wrong doors before the first that
        fits on average; the problem-oriented index in {TALLY[1]!.wrongFirst}, with {TALLY[1]!.mean.toFixed(1)}.
      </p>
    </div>
  )
}

function Behind({ id, tool }: { id: string; tool: string }) {
  const r = recordBySource.get(id)!
  const s = sourceById.get(id)!
  const f = fit(id, tool)
  const theirs = toolOf(s)
  return (
    <div className={`x05__room x05__room--${f}`}>
      <p className="x05__verdict">
        <strong>{VERDICT[f]}</strong>
        {f === 'wrong' && ` This fix is for ${theirs}; your ${tool} project has no such setting to change.`}
      </p>
      <p className="x05__fix">{r.solution}</p>
      <p className="x05__src">
        <a href={s.url}>{s.title}</a> · {s.repo}
      </p>
    </div>
  )
}
