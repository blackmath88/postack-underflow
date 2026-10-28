import type { CSSProperties } from 'react'

export type MottePose = 'idle' | 'walk' | 'flutter' | 'flag' | 'sleep'

type Props = { pose?: MottePose; facing?: 'left' | 'right'; size?: number; className?: string }

// Original, deliberately simple SVG pixel prototype. The approved generated concept sheet
// is a visual reference, not yet a production sprite atlas.
export function MotteSprite({ pose = 'idle', facing = 'right', size = 48, className }: Props) {
  const style: CSSProperties = { width: size, height: size, imageRendering: 'pixelated' }
  return (
    <svg className={className} viewBox="0 0 32 32" width={size} height={size} style={style}
      aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      <g transform={facing === 'left' ? 'translate(32 0) scale(-1 1)' : undefined}>
        <path d="M14 9V6h-2V4h-2V2H8v2h2v3h2v3M18 9V6h2V4h2V2h2v2h-2v3h-2v3" fill="#70485F"/>
        <path d="M14 10H8V8H4v2H2v4H0v5h2v3h4v3h5v-3h3M18 10h6V8h4v2h2v4h2v5h-2v3h-4v3h-5v-3h-3" fill="#252A30"/>
        <path d="M14 11H8v-1H5v2H3v7h2v2h4v2h4v-4h1M18 11h6v-1h3v2h2v7h-2v2h-4v2h-4v-4h-1" fill="#A36BFF"/>
        <path d="M13 13H8v2H5v4h4v2h4M19 13h5v2h3v4h-4v2h-4" fill="#F5F3EC"/>
        <path d="M13 18H8v2h3v3h3v-3M19 18h5v2h-3v3h-3v-3" fill="#4A6288"/>
        <path d="M13 9h6v3h2v7h-2v4h-6v-4h-2v-7h2z" fill="#70485F"/>
        <path d="M13 17h6v5h-6z" fill="#E5A57D"/>
        <rect x="13" y="12" width="2" height="2" fill="#252A30"/>
        <rect x="17" y="12" width="2" height="2" fill="#252A30"/>
        {pose === 'sleep' ? <path d="M13 14h2m2 0h2" stroke="#F5F3EC" strokeWidth="1"/> : null}
        {pose === 'flag' ? <g><path d="M25 15V1" stroke="#252A30" strokeWidth="1.5"/><path d="M26 1h6v6h-6z" fill="#EE4F7E"/></g> : null}
        {pose === 'flutter' ? <path d="M3 8h5m16 0h5" stroke="#EE4F7E" strokeWidth="1"/> : null}
        {pose === 'walk' ? <path d="M13 24v3h-3m9-3v3h3" fill="none" stroke="#252A30" strokeWidth="2"/> : null}
      </g>
    </svg>
  )
}
