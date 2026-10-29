import type { ComponentType } from 'react'
import CorrectionTravels from './51-correction-travels'
import DeskReassembled from './52-desk-reassembled'
import AnswerWithAPast from './53-answer-with-a-past'
import DuplicateInvestigation from './54-duplicate-investigation'
import KnowledgeFossil from './55-knowledge-fossil'
import ForkedInterpretation from './56-forked-interpretation'
import AgentNote from './57-agent-note'
import MemoryLoop from './58-memory-loop'
import PortableProblem from './59-portable-problem'
import IndexesItself from './60-indexes-itself'

// Experiment number → component.
export const MEMORY_EXPERIMENTS: Record<string, ComponentType> = {
  '51': CorrectionTravels,
  '52': DeskReassembled,
  '53': AnswerWithAPast,
  '54': DuplicateInvestigation,
  '55': KnowledgeFossil,
  '56': ForkedInterpretation,
  '57': AgentNote,
  '58': MemoryLoop,
  '59': PortableProblem,
  '60': IndexesItself,
}
