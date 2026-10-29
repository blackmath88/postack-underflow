import type { ReactNode } from 'react'

/**
 * Renders the two bits of Markdown that appear inside quoted GitHub text,
 * **bold** and `code`, so a quote reads as its author wrote it. Nothing else
 * is interpreted; the text is never treated as HTML.
 */
export function Inline({ text }: { text: string }) {
  const out: ReactNode[] = []
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g
  let last = 0
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const t = m[0]
    out.push(t.startsWith('`') ? <code key={m.index}>{t.slice(1, -1)}</code> : <strong key={m.index}><Inline text={t.slice(2, -2)} /></strong>)
    last = m.index + t.length
  }
  if (last < text.length) out.push(text.slice(last))
  return <>{out}</>
}
