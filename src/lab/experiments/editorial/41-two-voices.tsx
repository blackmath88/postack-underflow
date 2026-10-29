import { useState } from 'react'
import { EVIDENCE_LABEL, NOTES, type NoteId } from '../../../content/margin'
import { BEATS, segments, textOf, words, type Beat } from './essay'

// 41 · The Essay With Two Voices. Every essay beat that carries a
// counterpoint note (the sceptic) or a history note (the historian), set in
// two columns. The countervoice has a volume. At each step it says more: its
// question, its summary, its whole note. Column widths follow the word count,
// so a louder voice takes more of the page. Reads BEATS (the essay's own text)
// and NOTES (src/content/margin.tsx); nothing is invented.

type Voice = 'counterpoint' | 'history'
const VOICE_LABEL: Record<Voice, string> = { counterpoint: 'The sceptic', history: 'The historian' }
const VOLUME = ['silent', 'asks its question', 'gives its summary', 'says everything'] as const

interface Pair {
  beat: Beat
  id: NoteId
}

const pairsFor = (voice: Voice): Pair[] =>
  BEATS.flatMap((beat) => beat.notes.filter((n) => NOTES[n.id].kind === voice).map((n) => ({ beat, id: n.id })))

const PAIRS: Record<Voice, Pair[]> = { counterpoint: pairsFor('counterpoint'), history: pairsFor('history') }

function countervoice(id: NoteId, volume: number): string {
  const note = NOTES[id]
  if (volume === 1) return note.title
  if (volume === 2) return note.summary
  if (volume === 3) return textOf(note.body).replace(/\s+/g, ' ').trim()
  return ''
}

export default function TwoVoices() {
  const [voice, setVoice] = useState<Voice>('counterpoint')
  const [volume, setVolume] = useState(0)
  const pairs = PAIRS[voice]

  const essayWords = pairs.reduce((n, p) => n + words(p.beat.text), 0)
  const voiceWords = pairs.reduce((n, p) => n + words(countervoice(p.id, volume)), 0)
  const evidence = [...new Set(pairs.map((p) => NOTES[p.id].evidence))]

  return (
    <div className="x41">
      <div className="x41__desk">
        <fieldset className="x41__voice">
          <legend>Countervoice</legend>
          {(Object.keys(VOICE_LABEL) as Voice[]).map((v) => (
            <label key={v}>
              <input type="radio" name="x41-voice" checked={voice === v} onChange={() => setVoice(v)} /> {VOICE_LABEL[v]}{' '}
              <span className="x41__count">({PAIRS[v].length} notes)</span>
            </label>
          ))}
        </fieldset>
        <label className="x41__dial">
          <span>
            Volume: <strong>{VOLUME[volume]}</strong>
          </span>
          <input
            type="range"
            min={0}
            max={3}
            step={1}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-valuetext={VOLUME[volume]}
            data-probe="key:ArrowRight"
          />
        </label>
      </div>

      <p className="x41__balance" role="status" data-observe>
        The essay says <strong>{essayWords}</strong> words in these {pairs.length} passages.{' '}
        {volume === 0 ? (
          <>{VOICE_LABEL[voice]} is silent.</>
        ) : (
          <>
            {VOICE_LABEL[voice]} answers with <strong>{voiceWords}</strong>
            {essayWords > 0 && <> ({(voiceWords / essayWords).toFixed(1)}× as many)</>}.
          </>
        )}{' '}
        Its evidence: {evidence.map((e) => EVIDENCE_LABEL[e].split(';')[0]!.toLowerCase()).join('; ')}.
      </p>

      <ol className="x41__pairs">
        {pairs.map((p) => {
          const reply = countervoice(p.id, volume)
          const a = words(p.beat.text)
          const r = words(reply)
          // Each column's share of the row follows its word count; silence keeps a sliver.
          const cols = volume === 0 ? '1fr 0.12fr' : `${Math.max(a, 4)}fr ${Math.max(r, 4)}fr`
          return (
            <li key={p.id} className="x41__pair" style={{ ['--cols' as string]: cols }}>
              <p className="x41__essay">
                <span className="x41__who">The essay · {p.beat.chapter}</span>
                {segments(p.beat).map((s, i) =>
                  s.note === p.id ? <mark key={i}>{s.text}</mark> : <span key={i}>{s.text}</span>,
                )}
              </p>
              <p className={'x41__reply' + (volume === 0 ? ' is-silent' : '')}>
                <span className="x41__who">
                  {VOICE_LABEL[voice]} · {NOTES[p.id].evidence}
                </span>
                {reply || <span className="x41__hush">…</span>}
              </p>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
