import { useState } from 'react'
import { BORDERS, DISTRICTS, QUESTIONS, RESIDENTS, type District, type Resident } from '../../data/community-neighbourhoods'

// 27 · The Trust Neighbourhood. A small invented city of five districts and
// eight residents. Pick a question; it sits in one district. Widen the
// boundary from that district to its neighbours to the whole city, and switch
// the measure between endorsed answers and followers. Every number is
// invented (src/lab/data/community-neighbourhoods.ts) and is no real signal.

const SCALES = ['This district', 'With its neighbours', 'The whole city'] as const
type Measure = 'endorsed' | 'followers'

const ALL = Object.keys(DISTRICTS) as District[]
const neighbours = (d: District) => BORDERS.flatMap(([a, b]) => (a === d ? [b] : b === d ? [a] : []))

function inside(d: District, scale: number): District[] {
  if (scale === 0) return [d]
  if (scale === 1) return [d, ...neighbours(d)]
  return ALL
}

function score(r: Resident, area: District[], m: Measure) {
  if (m === 'followers') return r.followers
  return area.reduce((n, d) => n + (r.endorsed[d] ?? 0), 0)
}

function rank(area: District[], m: Measure) {
  return RESIDENTS.map((r) => ({ r, s: score(r, area, m) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.r.handle.localeCompare(b.r.handle))
}

const home = (r: Resident) => (Object.entries(r.endorsed) as Array<[District, number]>).sort((a, b) => b[1] - a[1])[0]?.[0]

export default function TrustNeighbourhood() {
  const [qid, setQid] = useState('q1')
  const [scale, setScale] = useState(0)
  const [measure, setMeasure] = useState<Measure>('endorsed')
  const q = QUESTIONS.find((x) => x.id === qid)!
  const area = inside(q.district, scale)
  const ranked = rank(area, measure)
  const top = ranked[0]
  const localTop = rank([q.district], 'endorsed')[0]

  return (
    <div className="x27">
      <p className="lab-fixture">Invented fixture: these people, districts and numbers do not exist</p>

      <div className="x27__qs" role="group" aria-label="Question">
        {QUESTIONS.map((x) => (
          <button key={x.id} type="button" className="lab-btn" aria-pressed={x.id === qid} onClick={() => setQid(x.id)}>
            {DISTRICTS[x.district].name}
          </button>
        ))}
      </div>
      <p className="x27__ask">“{q.ask}”</p>

      <div className="x27__body">
        <svg
          className="x27__map"
          viewBox="0 0 500 230"
          role="img"
          aria-label={`Map: ${area.map((d) => DISTRICTS[d].name).join(', ')} inside the boundary`}
        >
          {BORDERS.map(([a, b]) => (
            <line key={a + b} x1={DISTRICTS[a].x} y1={DISTRICTS[a].y} x2={DISTRICTS[b].x} y2={DISTRICTS[b].y} className="x27__road" />
          ))}
          {ALL.map((d) => {
            const { x, y, name } = DISTRICTS[d]
            const cls = 'x27__district' + (area.includes(d) ? ' is-inside' : '') + (d === q.district ? ' is-home' : '')
            return (
              <g key={d} className={cls} transform={`translate(${x} ${y})`}>
                <rect x={-46} y={-20} width={92} height={40} />
                <text y={4}>{name}</text>
              </g>
            )
          })}
        </svg>

        <div className="x27__controls">
          <label className="x27__scale">
            <span>Boundary: {SCALES[scale]}</span>
            <input
              type="range"
              min={0}
              max={2}
              step={1}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              aria-valuetext={SCALES[scale]}
              data-probe="key:ArrowRight"
            />
          </label>
          <fieldset>
            <legend>Measure</legend>
            <label>
              <input type="radio" name="x27-m" checked={measure === 'endorsed'} onChange={() => setMeasure('endorsed')} /> Answers others
              endorsed, inside the boundary
            </label>
            <label>
              <input type="radio" name="x27-m" checked={measure === 'followers'} onChange={() => setMeasure('followers')} /> Followers,
              anywhere
            </label>
          </fieldset>
        </div>
      </div>

      <div className="x27__answer" data-observe>
        <p className="x27__who">
          {top ? (
            <>
              Ask <strong>{top.r.handle}</strong>
              {measure === 'followers'
                ? `, with ${top.r.followers.toLocaleString('en-GB')} followers`
                : `, with ${top.s} endorsed answers inside the boundary`}
              .{measure === 'followers' && <> The boundary makes no difference: followers are counted everywhere.</>}
              {localTop && top.r.handle !== localTop.r.handle && (
                <>
                  {' '}
                  Inside {DISTRICTS[q.district].name} alone, the answer would be {localTop.r.handle}.
                </>
              )}
            </>
          ) : (
            'Nobody inside this boundary has an endorsed answer.'
          )}
        </p>
        <ol className="x27__rank">
          {ranked.slice(0, 4).map(({ r, s }) => (
            <li key={r.handle}>
              <span>{r.handle}</span>
              <span className="lab-out">
                {measure === 'followers' ? s.toLocaleString('en-GB') : s} · lives mostly in{' '}
                {home(r) ? DISTRICTS[home(r)!].name : 'no district'}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
