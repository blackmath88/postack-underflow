import { useId } from 'react'

// The lost shortcut, as four states of one diagram. The prose beside it says
// everything the diagram shows; the drawing is a summary, not the argument.

export type ShortcutStep = 0 | 1 | 2 | 3

export const SHORTCUT_CAPTIONS: Record<ShortcutStep, string> = {
  0: 'A short query reaches one public thread that many people shaped.',
  1: 'An agent reconstructs a fix by exploring sources directly.',
  2: 'The next person’s agent repeats the exploration from the start.',
  3: 'Each answer mostly stays in its own session; little returns to a shared place.',
}

const W = 560
const H = 310

function Thread({ x, y, faded }: { x: number; y: number; faded?: boolean }) {
  return (
    <g className={faded ? 'sd-faded' : undefined}>
      <rect x={x} y={y} width={150} height={112} className="sd-frame" />
      <text x={x + 10} y={y + 20} className="sd-label">
        PUBLIC THREAD
      </text>
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={x + 10} x2={x + 140 - i * 18} y1={y + 38 + i * 16} y2={y + 38 + i * 16} className="sd-text-line" />
      ))}
      <rect x={x + 10} y={y + 96} width={8} height={8} className="sd-mark sd-mark--blue" />
      <rect x={x + 22} y={y + 96} width={8} height={8} className="sd-mark sd-mark--violet" />
      <rect x={x + 34} y={y + 96} width={8} height={8} className="sd-mark sd-mark--rose" />
    </g>
  )
}

const SOURCES = [
  { label: 'DOCS', y: 128 },
  { label: 'ISSUE', y: 154 },
  { label: 'README', y: 180 },
]

/** Primary sources an agent reads directly. */
function Sources() {
  return (
    <g>
      {SOURCES.map((src) => (
        <g key={src.label}>
          <rect x={232} y={src.y} width={76} height={20} className="sd-frame" />
          <text x={240} y={src.y + 14} className="sd-label">
            {src.label}
          </text>
        </g>
      ))}
    </g>
  )
}

function Session({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={130} height={70} className="sd-frame sd-frame--closed" />
      <text x={x + 10} y={y + 20} className="sd-label">
        {label}
      </text>
      <path d={`M${x + 20} ${y + 48} q 15 -18 30 0 t 30 0 t 30 0`} className="sd-loop" />
    </g>
  )
}

export function ShortcutDiagram({ step }: { step: ShortcutStep }) {
  // Several copies can share a page, so ids must be unique and url()-safe.
  const uid = `sd${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    <figure className="shortcut-diagram" data-step={step}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby={`${uid}-cap`}>
        {/* Query */}
        <rect x={16} y={24} width={150} height={34} className="sd-query" />
        <text x={28} y={46} className="sd-mono">
          four words
        </text>

        {step === 0 && (
          <>
            <path d="M166 41 H 330" className="sd-route" markerEnd={`url(#${uid}-arrow)`} />
            <Thread x={340} y={10} />
            <text x={340} y={150} className="sd-note">
              asked once · answered · voted · corrected
            </text>
          </>
        )}

        {step >= 1 && (
          <>
            <Thread x={340} y={10} faded />
            <path d="M90 58 V 120" className="sd-route" markerEnd={`url(#${uid}-arrow)`} />
            <Sources />
            <Session x={24} y={126} label="AGENT · YOU" />
            {SOURCES.map((src) => (
              <line key={src.label} x1={154} y1={150} x2={232} y2={src.y + 10} className="sd-probe" />
            ))}
          </>
        )}

        {step >= 2 && (
          <>
            <Session x={200} y={216} label="AGENT · NEXT" />
            {SOURCES.map((src) => (
              <line key={src.label} x1={265} y1={216} x2={308} y2={src.y + 10} className="sd-probe" />
            ))}
          </>
        )}

        {step === 3 && (
          <>
            <Session x={400} y={216} label="AGENT · THIRD" />
            {SOURCES.map((src) => (
              <line key={src.label} x1={440} y1={216} x2={308} y2={src.y + 10} className="sd-probe" />
            ))}
            <text x={24} y={304} className="sd-note sd-note--signal">
              three working answers · little shared between them
            </text>
          </>
        )}

        <defs>
          <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className="sd-arrowhead" />
          </marker>
        </defs>
      </svg>
      <figcaption id={`${uid}-cap`} className="shortcut-diagram__caption">
        <span className="kicker__index">{String(step + 1).padStart(2, '0')}</span>
        {SHORTCUT_CAPTIONS[step]}
      </figcaption>
    </figure>
  )
}
