import type { ComponentType } from 'react'
import LostSynonym from './03-lost-synonym'

// Experiment number → component.
export const DISCOVERY_EXPERIMENTS: Record<string, ComponentType> = {
  '03': LostSynonym,
}
