import { Link } from '@tanstack/react-router'
import { META, day } from './data'

/** The tool's identity and its provenance, on every Commons page. */
export function CommonsBand() {
  const c = META.counts
  return (
    <div className="pfc-band">
      <p className="pfc-band__name">
        <Link to="/commons/">Photo Frame Commons</Link> <span>Pilot 001 · a working instrument</span>
      </p>
      <p className="pfc-band__prov">
        Built from{' '}
        <a href={`https://github.com/${META.repository}/tree/${META.revision}`}>
          {META.repository} @ <code>{META.revision.slice(0, 7)}</code>
        </a>
        , read {day(META.snapshotAt)}: {c.issues} issues, {c.pulls} pull requests, {c.comments} comments, {c.people} people.
        The sources stay on GitHub. Records here are written by an agent and {META.recordsReview}.
      </p>
    </div>
  )
}

type Step = 'find' | 'inspect' | 'connect' | 'challenge' | 'preview'

export function Journey({ active, hasChallenge = true }: { active: Step; hasChallenge?: boolean }) {
  const steps: Array<[Step, string, string]> = [
    ['find', 'Find', active === 'find' ? '#find' : '../#find'],
    ['inspect', 'Inspect', '#known'],
    ['connect', 'Connect', '#connect'],
    ['challenge', 'Challenge', '#challenge'],
    ['preview', 'Preview', '#challenge'],
  ]
  return (
    <nav className="pfc-journey" aria-label="Journey through a problem">
      <ol>
        {steps.map(([key, label, href], i) => {
          const disabled = active === 'find' ? key !== 'find' : (key === 'preview' || key === 'challenge') && !hasChallenge
          return (
            <li key={key} className={key === active ? 'is-active' : ''}>
              <span className="pfc-journey__n">{String(i + 1).padStart(2, '0')}</span>{' '}
              {disabled ? (
                <span className="pfc-journey__off">{label}</span>
              ) : key === 'find' && active !== 'find' ? (
                <Link to="/commons/" hash="find">{label}</Link>
              ) : (
                <a href={href} aria-current={key === active ? 'step' : undefined}>{label}</a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
