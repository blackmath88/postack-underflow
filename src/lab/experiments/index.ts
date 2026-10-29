import type { ComponentType } from 'react'
import { DISCOVERY_EXPERIMENTS } from './discovery'
import { CLASSIFICATION_EXPERIMENTS } from './classification'
import { COMMUNITY_EXPERIMENTS } from './community'
import { HISTORY_EXPERIMENTS } from './history'
import { EDITORIAL_EXPERIMENTS } from './editorial'
import { MEMORY_EXPERIMENTS } from './memory'

export const EXPERIMENTS: Record<string, ComponentType> = {
  ...DISCOVERY_EXPERIMENTS,
  ...CLASSIFICATION_EXPERIMENTS,
  ...COMMUNITY_EXPERIMENTS,
  ...HISTORY_EXPERIMENTS,
  ...EDITORIAL_EXPERIMENTS,
  ...MEMORY_EXPERIMENTS,
}
