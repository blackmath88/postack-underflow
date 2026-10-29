// Constellations: hand-drawn groups of experiments that argue about the same
// thing from different sides. Written after building, during critique.
export interface Constellation {
  title: string
  note: string
  members: string[]
}

export const CONSTELLATIONS: Constellation[] = []
