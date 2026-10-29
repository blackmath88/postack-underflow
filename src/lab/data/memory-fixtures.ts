// Invented material for Lab 06, Collective Memory & Futures (pilots 51–60).
// Written for this laboratory by an AI agent (Claude) on 2026-10-29.
//
// Every person, handle, DID, device, address and identifier below is invented
// and uses the reserved `.example` / `did:example` namespaces or obviously
// fake values. Nothing here happened. It may not be used to claim that anyone
// made these corrections, wrote this note, or owns this hardware, nor as
// evidence about real communities, agents or devices.

/** 51 · A correction to a v1 record that nobody has actually proposed. */
export const KIT_CORRECTION = {
  author: 'kit.example',
  did: 'did:example:kit',
  uri: 'at://did:example:kit/example.postack.correction/3k-example-k',
  target: 'upload-pages-artifact-issue-129-hidden-files',
  text:
    'This record says, in its own context, that it is not relevant to branch-based publishing, yet it is filed under “jekyll”. Remove that controlled term.',
} as const

/**
 * 57 · A draft note an AI-assisted session might leave after working on an
 * invented photo frame. Each span is tagged with what it is, so the desk can
 * count what a sanitiser keeps and removes. The frame, model and firmware are
 * invented; so is everything else.
 */
export type NoteSpanKind = 'plain' | 'private' | 'needed' | 'guess'

export interface NoteSpan {
  text: string
  kind: NoteSpanKind
  /** For private and needed spans: what it is, for the ledger. */
  what?: string
}

export interface NoteLine {
  /** Which section of a reviewable note this line belongs in. */
  section: 'device' | 'tried' | 'observed' | 'guessed' | 'outcome'
  spans: NoteSpan[]
}

const p = (text: string): NoteSpan => ({ text, kind: 'plain' })
const priv = (text: string, what: string): NoteSpan => ({ text, kind: 'private', what })
const need = (text: string, what: string): NoteSpan => ({ text, kind: 'needed', what })
const guess = (text: string): NoteSpan => ({ text, kind: 'guess' })

export const AGENT_NOTE: NoteLine[] = [
  {
    section: 'device',
    spans: [p('Frame: '), need('Fictio PF-10', 'model name'), p(', serial '), priv('SN-PF10-7731-0042', 'serial number'), p(', firmware '), need('PF10-V2.3.1-2024', 'firmware build'), p('.')],
  },
  {
    section: 'device',
    spans: [p('Owner '), priv('Sam', 'first name'), p(' ('), priv('sam@home.example', 'email address'), p('), on Wi-Fi '), priv('Kitchen-5G', 'network name'), p(' at '), priv('192.168.1.23', 'local address'), p('.')],
  },
  {
    section: 'tried',
    spans: [p('Took a backup to '), priv('/home/sam/frame-backup-0412.img', 'home path'), p(' before any write; checksum matched.')],
  },
  {
    section: 'tried',
    spans: [p('Held '), need('volume-down + power for 10 s', 'button combination'), p(' while plugging in USB; '), need('adb devices', 'command'), p(' then listed the frame.')],
  },
  {
    section: 'observed',
    spans: [p('ADB accepted the key with fingerprint '), priv('3A:F1:09:C2:77', 'key fingerprint'), p('; the frame stayed on the slideshow screen.')],
  },
  {
    section: 'observed',
    spans: [p('Root shell refused: '), need('“su: not found”', 'error text'), p('.')],
  },
  {
    section: 'guessed',
    spans: [guess('Probably the same board as the PF-12, so the PF-12 root method may work. Not tried.')],
  },
  {
    section: 'outcome',
    spans: [p('ADB works on '), need('PF10-V2.3.1-2024', 'firmware build'), p('; root does not, yet. No data lost.')],
  },
]

export const NOTE_SECTION_LABEL: Record<NoteLine['section'], string> = {
  device: 'Device',
  tried: 'What was tried',
  observed: 'What was observed',
  guessed: 'What was guessed, not tested',
  outcome: 'Outcome',
}
