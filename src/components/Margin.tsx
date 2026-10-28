import { useEffect, useLayoutEffect, useState, useSyncExternalStore, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react'
import { EVIDENCE_LABEL, KIND_LABEL, NOTES, noteArchiveLink, type NoteId } from '../content/margin'
import { Src } from './Src'

/*
 * Margin notes. A phrase in the essay carries a numbered marker; opening it
 * shows a note beside the text on wide screens and directly under the phrase
 * on narrow ones. The reading position never moves.
 *
 * Without JavaScript the marker is a link to #note-<id> and the note shows
 * through :target, with a "Close" link back to the phrase. Once hydrated the
 * marker becomes a disclosure button: one note open at a time, Escape or Close
 * returns focus to the phrase, and each note offers a stable deep link.
 */

let openId: NoteId | null = null
const listeners = new Set<() => void>()
const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
const emit = () => listeners.forEach((fn) => fn())

// The address is left alone: the router treats history changes as navigation
// and would scroll to the note. Deep links come from each note's own link.
function setOpen(id: NoteId | null) {
  openId = id
  emit()
}

function fromHash(): NoteId | null {
  const m = /^#note-(.+)$/.exec(location.hash)
  return m && m[1]! in NOTES ? (m[1] as NoteId) : null
}

let listening = false
function listenGlobally() {
  if (listening) return
  listening = true
  window.addEventListener('hashchange', () => {
    openId = fromHash()
    emit()
  })
  // Escape closes the open note wherever focus is (Safari does not focus links on click).
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !openId) return
    const id = openId
    setOpen(null)
    document.getElementById(`ref-${id}`)?.focus()
  })
}

export function Ref({ id, children }: { id: NoteId; children: ReactNode }) {
  const note = NOTES[id]
  const current = useSyncExternalStore(subscribe, () => openId, () => null)
  const [enhanced, setEnhanced] = useState(false)
  const [inline, setInline] = useState(false)
  const [shift, setShift] = useState(0)
  const [layoutTick, setLayoutTick] = useState(0)
  const [copied, setCopied] = useState(false)
  const open = enhanced && current === id
  const refId = `ref-${id}`
  const noteId = `note-${id}`

  useEffect(() => {
    setEnhanced(true)
    listenGlobally()
    if (fromHash() === id) {
      openId = id
      emit()
      document.getElementById(noteId)?.scrollIntoView({ block: 'center' })
    }
    // Leaving the page closes its note, so it does not reopen on return.
    return () => {
      if (openId === id) {
        openId = null
        emit()
      }
    }
  }, [id, noteId])

  useEffect(() => {
    if (!open) return setCopied(false)
    const onResize = () => setLayoutTick((t) => t + 1)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [open])

  // A note in the margin must not cover a wide figure or experiment. If one
  // is in the way below, the note moves up to clear it, as long as it stays
  // level with its paragraph; otherwise it opens inline under its phrase.
  useLayoutEffect(() => {
    setShift(0)
    if (!open) return setInline(false)
    const el = document.getElementById(noteId)
    if (!el) return
    // Measure from the unadjusted margin position; React reapplies state below.
    el.classList.remove('mnote--inline')
    el.style.marginTop = ''
    if (getComputedStyle(el).position !== 'absolute') return setInline(false)
    const r = el.getBoundingClientRect()
    const para = el.closest('p')!.getBoundingClientRect()
    const blockers = [...document.querySelectorAll('main .wide, main .fork, main figure, main table')]
      .map((b) => b.getBoundingClientRect())
      .filter((o) => o.left < r.right && o.right > r.left && o.bottom > para.top - r.height)
    const below = blockers.filter((o) => o.top >= para.top)
    const limit = Math.min(...below.map((o) => o.top), Infinity) - 16
    const up = Math.min(0, limit - r.bottom)
    const top = r.top + up
    const clear =
      top >= para.top - 240 && !blockers.some((o) => o.top < para.top && o.bottom > top) && top + r.height <= limit
    setInline(!clear)
    setShift(clear ? up : 0)
  }, [open, noteId, layoutTick])

  const toggle = (e: MouseEvent | KeyboardEvent) => {
    e.preventDefault()
    setOpen(open ? null : id)
  }
  const close = () => {
    setOpen(null)
    document.getElementById(refId)?.focus()
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      e.stopPropagation()
      close()
    }
  }

  return (
    <span className={`mn${open ? ' is-open' : ''}`} onKeyDown={onKey}>
      <a
        id={refId}
        href={`#${noteId}`}
        className="mn-ref"
        role={enhanced ? 'button' : undefined}
        aria-expanded={enhanced ? open : undefined}
        aria-controls={enhanced ? noteId : undefined}
        onClick={enhanced ? toggle : undefined}
        onKeyDown={enhanced ? (e) => e.key === ' ' && toggle(e) : undefined}
      >
        <span className="mn-ref__phrase">{children}</span>
        <span className="mn-ref__mark" aria-hidden="true" />
        <span className="visually-hidden"> (margin note: {note.title})</span>
      </a>
      <span
        id={noteId}
        className={`mnote mnote--${note.kind}${open ? ' is-open' : ''}${inline ? ' mnote--inline' : ''}`}
        data-enhanced={enhanced ? '' : undefined}
        style={shift ? { marginTop: `calc(-0.4em + ${shift}px)` } : undefined}
        role="note"
        aria-labelledby={`${noteId}-title`}
      >
        <span className="mnote__kicker">
          <span className="mnote__num" aria-hidden="true" />
          {KIND_LABEL[note.kind]}
        </span>
        <span className="mnote__title" id={`${noteId}-title`}>
          {note.title}
        </span>
        {note.body}
        <span className="mnote__foot">
          <span className={`mnote__evidence mnote__evidence--${note.evidence}`}>{EVIDENCE_LABEL[note.evidence]}</span>
          {note.sources && note.sources.length > 0 && (
            <span className="mnote__sources">
              Sources:{' '}
              {note.sources.map((s, i) => (
                <span key={s}>
                  {i > 0 && ' · '}
                  <Src id={s} />
                </span>
              ))}
            </span>
          )}
          {note.archive && <span className="mnote__archive">Go deeper: {noteArchiveLink(note)} →</span>}
        </span>
        <a
          href={`#${noteId}`}
          className="mnote__close"
          onClick={
            enhanced
              ? (e) => {
                  // Following the link would jump the page; copy it instead.
                  e.preventDefault()
                  const url = `${location.origin}${location.pathname}#${noteId}`
                  navigator.clipboard?.writeText(url).then(() => setCopied(true), () => {})
                }
              : undefined
          }
        >
          {copied ? 'Link copied' : 'Link to this note'}
        </a>{' '}
        ·{' '}
        <a
          href={`#${refId}`}
          className="mnote__close"
          onClick={
            enhanced
              ? (e) => {
                  e.preventDefault()
                  close()
                }
              : undefined
          }
        >
          Close note <span className="visually-hidden">and return to the text</span>
        </a>
      </span>
    </span>
  )
}
