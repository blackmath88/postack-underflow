import type { ComponentType } from 'react'
import TwoVoices from './41-two-voices'
import RabbitHole from './42-rabbit-hole'
import PageDisagrees from './43-page-disagrees'
import OneSentence from './44-one-sentence'
import InterruptibleStory from './45-interruptible-story'
import BrokenAnalogy from './46-broken-analogy'
import ReadersHypothesis from './47-readers-hypothesis'
import InvisibleAppendix from './48-invisible-appendix'
import HistoricalIntruder from './49-historical-intruder'
import TwentySeconds from './50-twenty-seconds'

// Experiment number → component.
export const EDITORIAL_EXPERIMENTS: Record<string, ComponentType> = {
  '41': TwoVoices,
  '42': RabbitHole,
  '43': PageDisagrees,
  '44': OneSentence,
  '45': InterruptibleStory,
  '46': BrokenAnalogy,
  '47': ReadersHypothesis,
  '48': InvisibleAppendix,
  '49': HistoricalIntruder,
  '50': TwentySeconds,
}
