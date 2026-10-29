import type { LabEntry } from '../types.ts'
import { COMMUNITY_DOC, CONTRACTS_FILE, FIXTURES_FILE, SWITCHBOARD_STUDY } from './shared.ts'

export const COMMUNITY: LabEntry[] = [
  {
    n: '25',
    title: 'One Conversation, Three Interfaces',
    family: 'community',
    kind: 'architectural',
    status: 'kernel',
    transformation: 'translate',
    encounter: 'atproto',
    question: 'If the records stay the same, where does each interface add its own reading of the conversation?',
    proposition:
      'A thread, a channel and a graph built from the same records each have to make decisions the records do not contain, and those decisions change what the conversation appears to say.',
    manipulate: 'Switch between thread, channel and graph; follow one contribution across all three.',
    changes: 'What is shown, what is connected, and the list of decisions the current renderer made.',
    unchanged: 'The eight fixture contributions and nine connection contracts, which no view edits.',
    provenance: {
      idea: 'The concept’s claim that community views are projections of portable records, not separate canonical truths.',
      mechanism: 'ATProto keeps records in their authors’ repositories; app views assemble them, each by its own rules.',
      sourceShowed:
        'Our protocol notes found reply threading via a post’s parent reference, and no shared convention for channels or relationship graphs.',
      interpretation:
        'That “projection” sounds neutral, but every renderer is an editor. The seams ledger is our attempt to make that editing countable.',
      sources: [
        { label: 'ATProto and portable communities, research notes', url: COMMUNITY_DOC, firmness: 'fact' },
        { label: 'Fixture contributions', url: FIXTURES_FILE, firmness: 'fact' },
        { label: 'Connection contracts', url: CONTRACTS_FILE, firmness: 'fact' },
        { label: 'Lumpesammlig 013, The Switchboard', url: SWITCHBOARD_STUDY, firmness: 'metaphor' },
      ],
      priorArt: ['Usenet threading versus IRC logs', 'Bluesky thread and quote views', 'Discourse’s flat-versus-threaded debate'],
    },
    built: 'Three small renderers over the unchanged Community fixtures, each with a ledger of what it showed, connected and decided.',
    happened:
      'The thread shows only four of eight contributions: the correction, the dispute, the endorsement and the blog post address the essay as a subject, not as a parent, so a reply tree has no place for them. The channel needed an order the records do not have: every fixture carries the same date, so the order on screen is invented. The graph is the only view that shows everything, and the only one that draws a model’s guess beside the authors’ own replies.',
    uncertain: 'Real records carry timestamps, so the channel’s invented order is partly a fixture artefact. Whether readers notice what a view drops is untested.',
    falsifier: 'If all three views showed the same contributions and connections, differing only in layout.',
    simpler: 'A single table of records with columns for “in thread”, “in channel” and “edges” would state the same differences more plainly.',
    data: 'The Community page’s fixtures, imported unchanged. Every person and identifier is invented, under .example and did:example.',
    finding: 'The thread hides half the conversation; the channel invents an order; only the graph shows everything, including a model’s guess.',
    related: ['21', '22', '23', '30'],
  },
]
