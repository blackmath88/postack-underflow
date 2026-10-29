// Invented fixture for Lab 30, The Moderation Lens. Written by hand for this
// laboratory on 2026-10-29. Two imaginary labelers attach labels to the
// Community page's fixture contributions, in the shape of
// com.atproto.label.defs#label (src, uri, val, cts). The labelers, their DIDs
// and every label are made up; no real labeler, label value or moderation
// decision is represented.
//
// It may be used to show that honouring different labels produces different
// accounts of the same records. It may not be used to claim how any real
// labeler, application or community moderates.

import { CONTRIBUTIONS } from '../../data/community-fixtures.ts'

export interface FixtureLabel {
  src: string
  uri: string
  val: string
  cts: string
}

export const LABELERS = {
  calm: { handle: 'calm-labels.example', did: 'did:example:calm-labels' },
  strict: { handle: 'strict-labels.example', did: 'did:example:strict-labels' },
} as const

const uri = (id: string) => CONTRIBUTIONS.find((c) => c.id === id)!.uri
const at = '2026-10-28T12:00:00Z'

export const LABELS: FixtureLabel[] = [
  { src: LABELERS.calm.did, uri: uri('c5'), val: 'heated', cts: at },
  { src: LABELERS.strict.did, uri: uri('c5'), val: 'off-topic', cts: at },
  { src: LABELERS.strict.did, uri: uri('c3'), val: 'self-promotion', cts: at },
  {
    src: LABELERS.strict.did,
    uri: uri('c4'),
    val: 'unverified-claim',
    cts: at,
  },
]
