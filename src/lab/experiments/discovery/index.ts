import type { ComponentType } from 'react'
import NoWords from './01-no-words'
import Neighbour from './02-neighbour'
import LostSynonym from './03-lost-synonym'
import ExplainsItself from './04-explains-itself'
import WrongDoor from './05-wrong-door'
import UnfinishedIndex from './06-unfinished-index'
import HeldPlace from './07-held-place'
import Catalogues from './08-catalogues'
import Footnote from './09-footnote'
import Relay from './10-relay'

// Experiment number → component.
export const DISCOVERY_EXPERIMENTS: Record<string, ComponentType> = {
  '01': NoWords,
  '02': Neighbour,
  '03': LostSynonym,
  '04': ExplainsItself,
  '05': WrongDoor,
  '06': UnfinishedIndex,
  '07': HeldPlace,
  '08': Catalogues,
  '09': Footnote,
  '10': Relay,
}
