// Catalogue metadata for one laboratory pilot. This is what the lab index can
// browse and what the notebook under each experiment prints. It deliberately
// does not describe how an experiment looks or behaves: that lives in the
// experiment's own component, which is free to be anything.

export type Family = 'discovery' | 'classification' | 'community' | 'history' | 'editorial' | 'memory'

/** The four kinds of experiment named in docs/lab/METHOD.md. */
export type Kind = 'behavioural' | 'epistemic' | 'editorial' | 'architectural'

/**
 * Where the work stands. Only `kernel` and `specimen` are implemented pilots;
 * the rest are verdicts recorded during critique, kept next to the working code.
 *   kernel     — Level B: the smallest working interaction that tests the proposition
 *   specimen   — Level C: refined, tested, with a reflection
 *   challenged — works, but the critique found a problem with the proposition
 *   combined   — works, but should merge with a related pilot
 *   retired    — a direction we would not develop; kept for its history
 */
export type Status = 'kernel' | 'specimen' | 'challenged' | 'combined' | 'retired'

/** How the visitor's action transforms the material. Used only for browsing. */
export type Transformation =
  | 'reorder'
  | 'reveal'
  | 'remove'
  | 'translate'
  | 'compare'
  | 'constrain'
  | 'trace'
  | 'predict'
  | 'perturb'

/** What the idea was taken from, used for browsing by source. */
export type Encounter =
  | 'four-words'
  | 'disputed-neighbour'
  | 'switchboard'
  | 'problem-desk'
  | 'photo-frame'
  | 'card-catalogue'
  | 'essay'
  | 'atproto'
  | 'motte'
  | 'print'
  | 'desktop'
  | 'museum'
  | 'lab'

/** How firm a provenance statement is. Mirrors the margin-note evidence labels. */
export type Firmness = 'fact' | 'reported' | 'metaphor' | 'speculation'

export interface SourceLink {
  label: string
  /** An external or repository URL. Omit for an in-repo idea with no page. */
  url?: string
  firmness: Firmness
}

/** One sentence each, answered after building, not before. */
export interface Assessment {
  specificity: string
  interaction: string
  insight: string
  integrity: string
  experience: string
  /** What we would do next with it. */
  verdict: 'develop' | 'challenge' | 'combine' | 'retire' | 'transfer' | 'keep'
}

export interface LabEntry {
  /** Two-digit number, also the URL segment: /lab/07/. */
  n: string
  title: string
  family: Family
  kind: Kind
  status: Status
  transformation: Transformation
  encounter: Encounter

  /** The research question, phrased as a question. */
  question: string
  /** A statement that could turn out to be false. */
  proposition: string
  /** What the visitor may manipulate. */
  manipulate: string
  /** What changes because of that action. */
  changes: string
  /** What the action cannot change. */
  unchanged: string

  provenance: {
    /** What gave us this idea. */
    idea: string
    /** The physical, technical, social or editorial mechanism behind it. */
    mechanism: string
    /** What the source actually demonstrated, without our reading. */
    sourceShowed: string
    /** Our interpretation, marked as such. */
    interpretation: string
    sources: SourceLink[]
    /** Earlier work this resembles. */
    priorArt: string[]
  }

  /** What we built, in one or two sentences. */
  built: string
  /** What happened when we built and used it. Never a user study. */
  happened: string
  /** What remains uncertain. */
  uncertain: string
  /** The observation that would show the proposition is wrong. */
  falsifier: string
  /** A plainer control that might do the same job. */
  simpler: string
  /** Where the material comes from: frozen data, fixtures, or the visitor. */
  data: string

  /** Short, browsable statement of the most interesting finding. */
  finding: string
  related: string[]
  assessment?: Assessment
}
