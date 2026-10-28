import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Restrained scrollytelling. Without JavaScript (and on narrow screens) every
 * step shows its own static figure inline. Once hydrated on a wide screen, a
 * single sticky figure follows the step being read. State changes are
 * immediate; nothing animates, so reduced motion needs no special case.
 */
export function Scrolly({
  label,
  steps,
  figure,
}: {
  label: string
  steps: ReactNode[]
  figure: (step: number) => ReactNode
}) {
  const [active, setActive] = useState(0)
  const [enhanced, setEnhanced] = useState(false)
  const refs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    setEnhanced(true)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step))
        }
      },
      // A step becomes active when it crosses the middle band of the viewport.
      { rootMargin: '-45% 0px -45% 0px' },
    )
    for (const el of refs.current) if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={`scrolly wide${enhanced ? ' scrolly--enhanced' : ''}`} aria-label={label}>
      {/* Visual duplicate of the step text; the prose carries the meaning. */}
      <div className="scrolly__figure" aria-hidden="true">
        {figure(active)}
      </div>
      <div className="scrolly__steps">
        {steps.map((content, i) => (
          <div
            key={i}
            className={`scrolly__step${i === active ? ' is-active' : ''}`}
            data-step={i}
            ref={(el) => {
              refs.current[i] = el
            }}
          >
            {content}
            <div className="scrolly__inline-figure">{figure(i)}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
