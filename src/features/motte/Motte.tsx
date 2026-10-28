import { useEffect, useMemo, useState } from 'react'
import { MotteSprite, type MottePose } from './MotteSprite'
import { historyFlags, publicHistoryFlags, type HistoryChapter, type HistoryFlag } from './history'
import './motte.css'

type Props = {
  chapter?: HistoryChapter
  flags?: readonly HistoryFlag[]
  enabled?: boolean
  /** Disables motion for a static specimen or embedding. */
  staticMode?: boolean
  onDismiss?: () => void
}

type Position = { x: number; y: number }
const INITIAL: Position = { x: 22, y: 80 }

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return reduced
}

export function Motte({
  chapter = 'opening',
  flags = historyFlags,
  enabled = true,
  staticMode = false,
  onDismiss,
}: Props) {
  const reduced = useReducedMotion()
  const [narrow, setNarrow] = useState(true)
  const [paused, setPaused] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [position, setPosition] = useState<Position>(INITIAL)
  const [pose, setPose] = useState<MottePose>('idle')
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const available = useMemo(() => publicHistoryFlags(flags).filter(f => f.chapter === chapter), [flags, chapter])
  const motionAllowed = enabled && !staticMode && !reduced && !narrow && !paused && !dismissed

  useEffect(() => {
    const query = window.matchMedia('(max-width: 700px)')
    const update = () => setNarrow(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!motionAllowed) { setPose('idle'); return }
    // Stay in the viewport's bottom margin; never roam through the article body.
    let step = 0
    const timer = window.setInterval(() => {
      step += 1
      setPosition(({ x }) => ({ x: Math.max(16, Math.min(window.innerWidth - 90, x + (step % 8 < 4 ? 22 : -22))), y: 80 }))
      setPose(step % 5 === 0 ? 'flutter' : 'walk')
    }, 2800)
    return () => window.clearInterval(timer)
  }, [motionAllowed])

  useEffect(() => { setOpen(false); setIndex(0) }, [chapter])
  if (!enabled || dismissed) return null
  const note = available[index % Math.max(available.length, 1)]
  const stationary = staticMode || reduced || narrow
  const showNote = open && Boolean(note)
  const dismiss = () => { setDismissed(true); onDismiss?.() }

  return (
    <aside className={'motte' + (stationary ? ' motte--stationary' : '')} aria-label="Motte: historical notes">
      <div className="motte__sprite" aria-hidden="true"
        style={stationary ? undefined : { transform: `translateX(${position.x}px)` }}>
        <MotteSprite pose={showNote ? 'flag' : pose} size={48}/>
      </div>
      <div className="motte__controls">
        <button type="button" aria-expanded={open} aria-controls="motte-note"
          onClick={() => setOpen(value => !value)}>
          {showNote ? 'Close history' : 'History'}
        </button>
        {!stationary && <button type="button" onClick={() => setPaused(value => !value)}>
          {paused ? 'Resume Motte' : 'Pause Motte'}
        </button>}
        <button type="button" onClick={dismiss} aria-label="Dismiss Motte">×</button>
      </div>
      {showNote && <section id="motte-note" className="motte__note" aria-label="What history tells us">
        <span className="motte__eyebrow">WHAT HISTORY TELLS US</span>
        <h3>{note.heading}</h3>
        <p>{note.observation}</p>
        {note.counterpoint && <p className="motte__counterpoint">{note.counterpoint}</p>}
        <a href={note.sourceUrl} target="_blank" rel="noopener noreferrer">Source: {note.sourceLabel}</a>
        {available.length > 1 && <button type="button" onClick={() => setIndex(i => i + 1)}>
          Next historical note
        </button>}
      </section>}
    </aside>
  )
}
