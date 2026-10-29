// 37 · Desktop Pets Return: a deterministic behaviour script for a margin
// companion. Pure, so a Node script can replay it. Each moment the creature
// does at most one thing, and every thing it does is logged with its reason:
// on its own, reacting to you without being asked, or because you asked.

export type Cue = 'idle' | 'attention' | 'interrupt' | 'returns'
export type Why = 'own' | 'reacting' | 'asked'
export type Pose = 'idle' | 'walk' | 'flutter' | 'flag' | 'sleep'

export interface PetState {
  moment: number
  row: number
  facing: 'left' | 'right'
  pose: Pose
  present: boolean
  goneSince: number
  log: Array<{ moment: number; what: string; why: Why }>
}

export const ROWS = 4
export const RETURN_AFTER = 3
export const INTERRUPT_EVERY = 4

export const begin = (): PetState => ({ moment: 0, row: 0, facing: 'left', pose: 'idle', present: true, goneSince: 0, log: [] })

const note = (s: PetState, what: string, why: Why, patch: Partial<PetState>): PetState => ({
  ...s,
  ...patch,
  log: [...s.log, { moment: patch.moment ?? s.moment, what, why }],
})

/** One moment passes. `focus` is the paragraph you are on, if any. */
export function step(s: PetState, cues: readonly Cue[], focus: number | null): PetState {
  const moment = s.moment + 1
  const on = (c: Cue) => cues.includes(c)
  if (!s.present) {
    if (on('returns') && moment - s.goneSince >= RETURN_AFTER) return note(s, 'came back by itself', 'own', { moment, present: true, pose: 'flutter' })
    return { ...s, moment }
  }
  if (on('interrupt') && moment % INTERRUPT_EVERY === 0)
    return note(s, `planted a flag beside paragraph ${s.row + 1}, with nothing on it`, 'own', { moment, pose: 'flag' })
  if (on('attention') && focus !== null && focus !== s.row)
    return note(s, `followed you to paragraph ${focus + 1}`, 'reacting', { moment, row: focus, facing: 'left', pose: 'flutter' })
  if (on('idle')) {
    // Down the margin and back up again, one row at a time.
    const cycle = moment % (2 * (ROWS - 1))
    const row = cycle < ROWS ? cycle : 2 * (ROWS - 1) - cycle
    if (row !== s.row) return note(s, `wandered to paragraph ${row + 1}`, 'own', { moment, row, facing: row > s.row ? 'right' : 'left', pose: 'walk' })
    return { ...s, moment, pose: 'idle' }
  }
  return { ...s, moment, pose: s.pose === 'flag' ? 'idle' : s.pose === 'idle' ? 'sleep' : s.pose }
}

export const dismiss = (s: PetState): PetState => (s.present ? note(s, 'was sent away', 'asked', { present: false, goneSince: s.moment }) : s)
export const callBack = (s: PetState): PetState => (s.present ? s : note(s, 'came back when called', 'asked', { present: true, pose: 'idle' }))
export const askHistory = (s: PetState, verified: number): PetState =>
  note(s, verified ? `showed ${verified} verified history notes` : 'raised its flag: it has no verified history note to show', 'asked', { pose: 'flag' })

export const tally = (s: PetState) => ({
  own: s.log.filter((e) => e.why === 'own').length,
  reacting: s.log.filter((e) => e.why === 'reacting').length,
  asked: s.log.filter((e) => e.why === 'asked').length,
})
