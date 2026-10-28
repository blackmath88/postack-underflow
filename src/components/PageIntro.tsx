import type { ReactNode } from 'react'

export function PageIntro({
  index,
  kicker,
  title,
  children,
}: {
  index?: string
  kicker: string
  title: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="page-intro">
      <p className="kicker">
        {index && <span className="kicker__index">{index}</span>}
        {kicker}
      </p>
      <h1>{title}</h1>
      {children && <div className="lede">{children}</div>}
    </div>
  )
}
