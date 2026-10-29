import type { ComponentType } from 'react'
import ContractBuilder from './21-contract-builder'
import PeelingLayers from './22-peeling-layers'
import OperatorCards from './23-operator-cards'
import DisagreementCable from './24-disagreement-cable'
import ThreeInterfaces from './25-three-interfaces'
import ForgottenReply from './26-forgotten-reply'
import TrustNeighbourhood from './27-trust-neighbourhood'
import Unplugged from './28-unplugged'
import Unfinished from './29-unfinished'
import ModerationLens from './30-moderation-lens'

// Experiment number → component.
export const COMMUNITY_EXPERIMENTS: Record<string, ComponentType> = {
  '21': ContractBuilder,
  '22': PeelingLayers,
  '23': OperatorCards,
  '24': DisagreementCable,
  '25': ThreeInterfaces,
  '26': ForgottenReply,
  '27': TrustNeighbourhood,
  '28': Unplugged,
  '29': Unfinished,
  '30': ModerationLens,
}
