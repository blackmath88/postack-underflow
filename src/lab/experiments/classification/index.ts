import type { ComponentType } from 'react'
import AboveTheRod from './11-above-the-rod'
import SortingKey from './12-sorting-key'
import WhoPutThisHere from './13-who-put-this-here'
import FalseAlias from './14-false-alias'
import ExpiredAnswer from './15-expired-answer'
import ConfidenceCostume from './16-confidence-costume'
import ThreeKindsOfProof from './17-three-kinds-of-proof'
import MissingContext from './18-missing-context'
import ClassificationTrial from './19-classification-trial'
import UnverifiedStamp from './20-unverified-stamp'

// Experiment number → component.
export const CLASSIFICATION_EXPERIMENTS: Record<string, ComponentType> = {
  '11': AboveTheRod,
  '12': SortingKey,
  '13': WhoPutThisHere,
  '14': FalseAlias,
  '15': ExpiredAnswer,
  '16': ConfidenceCostume,
  '17': ThreeKindsOfProof,
  '18': MissingContext,
  '19': ClassificationTrial,
  '20': UnverifiedStamp,
}
