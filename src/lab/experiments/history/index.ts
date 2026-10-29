import type { ComponentType } from 'react'
import CardFriction from './31-card-friction'
import LibrariansHand from './32-librarians-hand'
import FilingRod from './33-filing-rod'
import OccupiedCircuits from './34-occupied-circuits'
import SwitchboardOperator from './35-switchboard-operator'
import IndexDrawerLies from './36-index-drawer-lies'
import DesktopPets from './37-desktop-pets'
import HistoricalFlags from './38-historical-flags'
import MarginalPrinter from './39-marginal-printer'
import MuseumRearranges from './40-museum-rearranges'

// Experiment number → component.
export const HISTORY_EXPERIMENTS: Record<string, ComponentType> = {
  '31': CardFriction,
  '32': LibrariansHand,
  '33': FilingRod,
  '34': OccupiedCircuits,
  '35': SwitchboardOperator,
  '36': IndexDrawerLies,
  '37': DesktopPets,
  '38': HistoricalFlags,
  '39': MarginalPrinter,
  '40': MuseumRearranges,
}
