import type { LabEntry } from '../types.ts'
import { repoFile } from '../../content/sources.ts'
import { COMMUNITY_DOC, COMMUNITY_PAGE, CONTRACTS_FILE, FIXTURES_FILE, SWITCHBOARD_FILE, SWITCHBOARD_STUDY } from './shared.ts'

const NEIGHBOURHOODS_FILE = repoFile('src/lab/data/community-neighbourhoods.ts')
const LABELS_FILE = repoFile('src/lab/data/community-labels.ts')

export const COMMUNITY: LabEntry[] = [
  {
    n: '21',
    title: 'The Connection Contract, Authored',
    family: 'community',
    kind: 'architectural',
    status: 'kernel',
    transformation: 'constrain',
    encounter: 'switchboard',
    question: 'If you have to write a connection contract yourself, which of its fields are you actually entitled to fill?',
    proposition:
      'Who may write a connection depends on who you are and on the record type, not on the relationship: most parties can only propose, and some record types cannot carry a declared link at all.',
    manipulate: 'Choose who is writing, the two contributions, the standing and the relation, one field at a time.',
    changes: 'Which choices are refused and why, where the resulting record would live, who could withdraw it, and the exported record.',
    unchanged: 'The eight fixture contributions and their record types. Nothing you write is stored or published.',
    provenance: {
      idea: 'The Connection Contract on the Community page, which lets you read nine contracts and propose one. This pilot asks the opposite question: what may each party write?',
      mechanism:
        'In ATProto a link the author declares sits inside the author’s own record, in a field its Lexicon defines; anyone else has to write a separate record in their own repository.',
      sourceShowed:
        'Our protocol notes found reply.parent and embed.record on app.bsky.feed.post, no record-reference field on site.standard.document apart from bskyPostRef, and no Lexicon for corrections, disputes or endorsements.',
      interpretation:
        'That a “contract” means two different things: for an author it is just a reference field; for everyone else it is a new record that has to say who made it. The refusals make that split visible.',
      sources: [
        {
          label: 'The Connection Contract on the Community page',
          url: COMMUNITY_PAGE,
          firmness: 'fact',
        },
        {
          label: 'Switchboard component',
          url: SWITCHBOARD_FILE,
          firmness: 'fact',
        },
        {
          label: 'ATProto and portable communities, research notes',
          url: COMMUNITY_DOC,
          firmness: 'fact',
        },
        {
          label: 'Connection contracts',
          url: CONTRACTS_FILE,
          firmness: 'fact',
        },
      ],
      priorArt: [
        'Creative Commons licence chooser',
        'Wikidata statement references and ranks',
        'W3C Web Annotation’s creator and motivation fields',
      ],
    },
    built:
      'A five-step form over the fixtures. Each step greys out and strikes through what the chosen party may not set, and lists the reason; the output is the record that would result, as text.',
    happened:
      'Only 28 of the 448 role-and-pair combinations allow a declared link: ines 14, mara 7, jun 7, and nobody else. Tomás and the essay’s author can never declare one, because their records are site.standard.document, and Rui cannot because the record is deleted. Building it exposed a tension in the fixtures: Tomás’s record carries a subject reference that this Lexicon, as far as our notes go, has no field for.',
    uncertain:
      'Our notes list standard.site’s optional links field without its shape; it may carry such a reference. The refusal rules are ours, written from the notes, and no protocol enforces them.',
    falsifier: 'If any party could fill any field for any pair, so that the role made no difference to what can be written.',
    simpler: 'A table of who may do what, by role and record type, states the same rules without the form.',
    data: 'The Community page’s fixtures, imported unchanged. Every person and identifier is invented, under .example and did:example.',
    finding:
      'Only 28 of 448 role-and-pair combinations allow a declared link. Everyone else can only propose, and two authors can never declare, because their record type has no field for it.',
    related: ['25', '22', '24', '29'],
  },
  {
    n: '22',
    title: 'The Operator Leaves, One Sheet at a Time',
    family: 'community',
    kind: 'epistemic',
    status: 'kernel',
    transformation: 'remove',
    encounter: 'switchboard',
    question: 'If the interpretation layers are removed one at a time, what can a newcomer still reconstruct, and does the order matter?',
    proposition:
      'Most of what a newcomer needs survives in the records themselves, and only questions about connections and missing records depend on the view; the order of removal changes nothing.',
    manipulate:
      'Lift four sheets (a model’s suggestions, the editor’s readings, an index’s old copies, the view’s order) in any order, and lay them back.',
    changes:
      'Eight fixed questions, re-answered from what is left, each labelled with the layer its answer came from; a log of what each lift changed.',
    unchanged: 'The six fetchable records and the references their authors wrote. They are the bottom sheet and cannot be lifted.',
    provenance: {
      idea: 'The “operator leaves” moment on the Community page, which removes the whole view at once. Here the view is split into layers.',
      mechanism:
        'An app view combines several sources over the records: its editor’s links, generated suggestions, an index’s cached copies, its own ordering.',
      sourceShowed:
        'The Community page shows that removing the view leaves the authors’ references in place. Our protocol notes say deleted records leave no tombstone and caches may still hold copies.',
      interpretation:
        'That “the view” is not one thing, and that removing its parts in different orders might leave a newcomer with different, and differently wrong, readings.',
      sources: [
        {
          label: 'The operator leaves, on the Community page',
          url: COMMUNITY_PAGE,
          firmness: 'fact',
        },
        {
          label: 'ATProto and portable communities, research notes',
          url: COMMUNITY_DOC,
          firmness: 'fact',
        },
        {
          label: 'Connection contracts',
          url: CONTRACTS_FILE,
          firmness: 'fact',
        },
        {
          label: 'Lumpesammlig 013, The Switchboard',
          url: SWITCHBOARD_STUDY,
          firmness: 'metaphor',
        },
      ],
      priorArt: ['Map overlays on tracing paper', 'Layer panels in image editors', 'Wikipedia’s “view source” and page history'],
    },
    built:
      'A stack of four labelled sheets over the records, and a ledger of eight questions whose answers are recomputed after every lift.',
    happened:
      'With every sheet lifted, six of the eight questions still have an answer from the records alone, two of them thinner (both records name H1; everything happened on one day). The order matters for one question: lift the editor before the model, and the model’s guess that Jun and Mara ask the same question stands uncontradicted. Lifting the index’s copies erases Ola and Rui completely: nothing left says they ever replied.',
    uncertain:
      'The eight questions are ours; a different set would shift the count. The fixture’s claim field (H1, H2, H4) does much of the work, and real records may not carry anything like it.',
    falsifier: 'If removing layers in different orders always left the same answers at every step, or if most questions needed the view.',
    simpler:
      'A checklist of questions with a column per layer, ticked where that layer is needed, would show the same dependencies without the lifting.',
    data: 'The Community page’s fixtures and contracts, imported unchanged. The eight questions and the layer split are ours.',
    finding:
      'With every layer gone, six of eight questions survive on the records alone. Order matters once: lift the editor before the model, and a model’s guess stands uncontradicted.',
    related: ['21', '28', '25', '26'],
  },
  {
    n: '23',
    title: 'Several Operators',
    family: 'community',
    kind: 'architectural',
    status: 'kernel',
    transformation: 'compare',
    encounter: 'atproto',
    question: 'When two operators assemble the same contributions by different policies, how different are the two accounts?',
    proposition:
      'Different assembly policies over the same records produce accounts that differ in what comes first, not only in what is shown.',
    manipulate: 'Deal any of six policy cards to seat A or seat B.',
    changes:
      'Each seat’s ordered list and link count, and a difference sheet: what comes first after the essay, and what only one seat shows or draws.',
    unchanged: 'The eight fixture contributions and nine contracts, which every policy reads unchanged.',
    provenance: {
      idea: 'Jun’s fixture dispute: “whoever runs the popular view still decides what people see.”',
      mechanism:
        'ATProto app views index the collections they choose and rank them by their own rules; several can run over the same records.',
      sourceShowed:
        'Our protocol notes found that an app view indexes only the collections it chooses, and that labels and blocks are honoured per application.',
      interpretation:
        'That “several operators” is the honest form of portability: not one neutral view, but competing policies that can be compared side by side.',
      sources: [
        {
          label: 'ATProto and portable communities, research notes',
          url: COMMUNITY_DOC,
          firmness: 'fact',
        },
        {
          label: 'Fixture contributions',
          url: FIXTURES_FILE,
          firmness: 'fact',
        },
        {
          label: 'Connection contracts',
          url: CONTRACTS_FILE,
          firmness: 'fact',
        },
      ],
      priorArt: ['Bluesky custom feeds', 'Mastodon and Fediverse instance policies', 'Reddit’s sort orders (best, new, controversial)'],
    },
    built:
      'Six policies, each a filter on contracts and contributions plus a ranking rule, written as cards; two seats; a computed difference sheet.',
    happened:
      'The proposition only half holds. Across the 15 pairs of distinct policies, 8 put a different contribution first, but across all six only two contributions ever come first: Mara’s correction under four policies, Ines’s reply under two. The four agree for four different reasons (most answered, kind, most linked, most endorsed), because the correction is the only contribution anything else points at. Four pairs show exactly the same contributions and differ only in links and order.',
    uncertain:
      'With eight records, rankings collapse onto the few that are linked at all. A larger fixture might separate the policies more, or less.',
    falsifier: 'If every pair of policies put the same contribution first and showed the same set.',
    simpler: 'A table with one column per policy and one row per contribution, holding its rank, shows all six at once.',
    data: 'The Community page’s fixtures, imported unchanged. The six policies are ours.',
    finding:
      'Six policies, only two possible front pages. Four policies put Mara’s correction first for four different reasons: it is the only contribution anything else points at.',
    related: ['25', '30', '27', '28'],
  },
  {
    n: '24',
    title: 'The Disagreement Cable',
    family: 'community',
    kind: 'epistemic',
    status: 'kernel',
    transformation: 'trace',
    encounter: 'switchboard',
    question: 'If a panel conducts only disagreement, what does each disagreement in the conversation actually rest on?',
    proposition:
      'Every disagreement in the fixture conversation can be traced to a record that says what is disputed, on what grounds, and whether it was answered.',
    manipulate:
      'Pick up a cable from one of six parties and plug it into one of five claims: three of the essay’s hypotheses and two of the view’s own links.',
    changes:
      'A cable is drawn only if some record says that party disagrees with that claim; the meter reads where it is written, the grounds, any answer and its standing. A tally counts what kind of evidence each patched disagreement rests on.',
    unchanged: 'The fixture records and contracts. The panel refuses to draw a disagreement no record states.',
    provenance: {
      idea: 'The Switchboard’s cables, which carry any kind of relationship. Here a panel carries only one kind, so it can be read closely.',
      mechanism: 'Typed records: a dispute or correction record says what it is; an ordinary reply can only say it in its text.',
      sourceShowed:
        'Our protocol notes found no existing Lexicon for a dispute or a correction. The fixtures use placeholder types, example.postack.dispute and example.postack.correction, for them.',
      interpretation: 'That disagreement looks like noise mainly when it has nowhere to be written except prose.',
      sources: [
        {
          label: 'The Switchboard on the Community page',
          url: COMMUNITY_PAGE,
          firmness: 'fact',
        },
        {
          label: 'ATProto and portable communities, research notes',
          url: COMMUNITY_DOC,
          firmness: 'fact',
        },
        {
          label: 'Fixture contributions',
          url: FIXTURES_FILE,
          firmness: 'fact',
        },
        {
          label: 'Lumpesammlig 013, The Switchboard',
          url: SWITCHBOARD_STUDY,
          firmness: 'metaphor',
        },
      ],
      priorArt: ['Argument maps (Toulmin, IBIS)', 'Wikipedia talk pages and dispute templates', 'Kialo pro and con trees'],
    },
    built:
      'A dark patch panel with eleven jacks, cables drawn in SVG behind HTML buttons, and a meter that reads the records behind each patch.',
    happened:
      'Of the 30 possible patches, 6 conduct. Only 2 rest on a record whose type says “disagreement”, and both types are our hypothetical placeholders; 1 is in prose only (Ines’s doubt about H1, in an ordinary reply); 1 cannot be read (Ola’s); 2 are the view’s own disagreements, kept in contract history. With existing Lexicons alone, every author’s disagreement would be prose.',
    uncertain:
      'Whether a reply is a disagreement is a reading; we counted Ines’s as one and Tomás’s rerun proposal as not. Another reader might draw that line elsewhere.',
    falsifier: 'If every conducting patch rested on a record typed as a disagreement, with grounds and an answer.',
    simpler: 'A list of disagreements with a “where it is written” column says the same in one glance.',
    data: 'The Community page’s fixtures and contracts, imported unchanged. Which patches conduct is derived from them.',
    finding:
      'Six patches conduct. Only two rest on a record typed as disagreement, both placeholder types; with existing Lexicons, every author’s disagreement would be prose.',
    related: ['21', '29', '30', '25'],
  },
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
  {
    n: '26',
    title: 'The Forgotten Reply',
    family: 'community',
    kind: 'architectural',
    status: 'kernel',
    transformation: 'trace',
    encounter: 'atproto',
    question: 'When a reply disappears, what could a marker for it say, and whose memory would each line be?',
    proposition:
      'A useful marker for a missing reply can be built from what other records and indexes still hold, without keeping anything its author removed.',
    manipulate: 'Choose Rui’s deleted reply or Ola’s offline one, then choose which lines to carve.',
    changes:
      'The marker’s text and shape (a headstone for a deletion, a sign on the door for an absence), and a count of lines remembered by someone other than the author, and of lines kept against a deletion.',
    unchanged: 'The fixture records and contracts. Nothing recovers the missing text: the fixtures hold no copy of it.',
    provenance: {
      idea: 'Two fixture contributions that cannot be read: one deleted, one on an unreachable server.',
      mechanism:
        'ATProto deletion leaves no tombstone; references dangle, and indexes and caches may still hold copies. An offline host is unavailable, not deleted.',
      sourceShowed:
        'Our protocol notes: “Deletion leaves no tombstone”; deleted accounts’ content “should be removed from the network”, a norm that propagates hop by hop and cannot be enforced.',
      interpretation:
        'That any tombstone is somebody else’s memory, and that each line on it can be judged separately: some only note an absence, some keep what the author took away.',
      sources: [
        {
          label: 'ATProto and portable communities, research notes',
          url: COMMUNITY_DOC,
          firmness: 'fact',
        },
        {
          label: 'Fixture contributions',
          url: FIXTURES_FILE,
          firmness: 'fact',
        },
        {
          label: 'Connection contracts',
          url: CONTRACTS_FILE,
          firmness: 'fact',
        },
        {
          label: 'Repository specification (deletion)',
          url: 'https://atproto.com/specs/repository',
          firmness: 'fact',
        },
      ],
      priorArt: ['Mastodon and Usenet “message deleted” placeholders', 'Wikipedia’s deleted-revision notices', 'The Wayback Machine'],
    },
    built: 'A chisel list of eight possible lines, each labelled with its source, and a marker that renders the chosen ones.',
    happened:
      'For Rui’s deleted reply, every one of the 7 lines that can be carved comes from someone other than the author: an index’s old copy, this view’s contract, or other records. The only line the author could vouch for, the words, is the one nothing holds. One line, what the reply was about, keeps content the author deleted. For Ola the same seven lines carry no such conflict, but any of them could be contradicted the moment the server answers.',
    uncertain:
      'That an index kept the handle, version and claim is a fixture assumption: the contracts only say an index remembers the reference. Whether carving the address alone already goes against a deletion is a judgement we have not settled.',
    falsifier: 'If a useful marker needed the deleted content itself, or if its lines came from the author.',
    simpler: 'A single grey line, “a reply was deleted”, carries the fact with almost none of the memory.',
    data: 'The Community page’s fixtures and contracts, imported unchanged. What each source would remember is our modelling.',
    finding:
      'Every line that can be carved for Rui’s deleted reply is someone else’s memory. The only line the author could vouch for, the words, is the one nothing holds.',
    related: ['28', '22', '29', '21'],
  },
  {
    n: '27',
    title: 'The Trust Neighbourhood',
    family: 'community',
    kind: 'epistemic',
    status: 'kernel',
    transformation: 'reorder',
    encounter: 'lab',
    question: 'Does “who should answer this?” have an answer before someone decides where the neighbourhood ends?',
    proposition:
      'Ranking by endorsed answers inside a local boundary picks different people from ranking by popularity, and the boundary, not the measure, decides most of the difference.',
    manipulate:
      'Pick one of four questions, slide the boundary from its district to its neighbours to the whole city, and switch between endorsed answers and followers.',
    changes: 'Which districts the map includes, the ranked residents, and who to ask.',
    unchanged: 'The invented residents, their numbers and the map. Followers ignore the boundary entirely.',
    provenance: {
      idea: 'The worry in Jun’s fixture dispute that the popular view decides what people see, and the hope that local expertise could be found instead.',
      mechanism:
        'Two kinds of reputation: a global count (followers) and a local track record (answers others endorsed), which only exists inside some boundary.',
      sourceShowed:
        'Nothing: there is no source for these numbers. Our protocol notes found likes and recommends, which carry no meaning beyond “liked”, and no Lexicon for endorsing a solution.',
      interpretation:
        'That “local expertise” always depends on an unstated choice of where local ends, and that whoever draws the boundary picks the expert.',
      sources: [
        {
          label: 'Invented neighbourhood fixture',
          url: NEIGHBOURHOODS_FILE,
          firmness: 'speculation',
        },
        {
          label: 'ATProto and portable communities, research notes',
          url: COMMUNITY_DOC,
          firmness: 'fact',
        },
        {
          label: 'Fixture contributions (Jun’s dispute)',
          url: FIXTURES_FILE,
          firmness: 'fact',
        },
      ],
      priorArt: [
        'Stack Exchange per-site and per-tag reputation',
        'PageRank versus topic-sensitive PageRank',
        'Granovetter on weak ties (1973)',
      ],
    },
    built: 'An SVG map of five invented districts, a three-stop boundary slider, a measure switch and a ranking.',
    happened:
      'The numbers were typed by us, so the outcome is built in; what the pilot shows is the mechanism. Within one district each question has its own specialist. Widening to the neighbours replaces that specialist in 3 of 4 questions, and at city scale one generalist with spread-out endorsements tops all four, which is a second kind of popularity. Followers name a third person for everything.',
    uncertain:
      'Everything about real reputation: no number here was measured. Whether real neighbourhoods have borders that anyone could agree on is untested.',
    falsifier: 'If the same person came out on top at every boundary, so that the boundary made no difference.',
    simpler: 'Two lists side by side, “most endorsed in this topic” and “most followed”, without a map or slider.',
    data: 'Invented for this pilot in src/lab/data/community-neighbourhoods.ts: eight .example residents and every number. Marked as a fixture in the interface.',
    finding:
      'On invented numbers, widening the boundary by one district replaces the local specialist in 3 of 4 questions; at city scale one generalist wins everything.',
    related: ['23', '30', '28'],
  },
  {
    n: '28',
    title: 'The Unplugged Community',
    family: 'community',
    kind: 'architectural',
    status: 'kernel',
    transformation: 'perturb',
    encounter: 'atproto',
    question: 'With the central hosts unplugged, does anything recognisable remain shared?',
    proposition:
      'Without any central index or view, the participants still share a recognisable conversation, because every reply carries its own reference.',
    manipulate: 'Unplug or replug any of nine hosts: seven authors’ hosts, a backlink index and this view. Ola’s is already offline.',
    changes:
      'What each of five starting points (a newcomer holding the essay’s address, and four authors) can reach by following references, and what all of them still share.',
    unchanged: 'The records and the references inside them. References point one way: from a reply to what it answers.',
    provenance: {
      idea: 'The essay’s question of whether a community can live in its members’ own repositories without one central interface.',
      mechanism: 'References go from reply to parent only; finding what points at a record needs a backlink index, such as Constellation.',
      sourceShowed:
        'Our protocol notes: records live in their authors’ repositories; AT URIs and strongRefs point at a record; backlink indexes such as Constellation index links across Lexicons, maturity not verified.',
      interpretation:
        'That “decentralised” conversations depend on whoever runs the backlink index, because the essay itself never learns who answered it.',
      sources: [
        {
          label: 'ATProto and portable communities, research notes',
          url: COMMUNITY_DOC,
          firmness: 'fact',
        },
        {
          label: 'Constellation backlink index, readme',
          url: 'https://tangled.org/microcosm.blue/microcosm-rs/blob/main/constellation/readme.md',
          firmness: 'reported',
        },
        {
          label: 'Fixture contributions',
          url: FIXTURES_FILE,
          firmness: 'fact',
        },
      ],
      priorArt: ['Webmention and pingback', 'Usenet propagation between servers', 'Fediverse reply fetching'],
    },
    built:
      'A strip of plug buttons, one per host, and a reachability table recomputed by a small breadth-first walk over the fixture references.',
    happened:
      'With the index up, everyone reaches all six readable contributions. Without the index, the newcomer holding the essay reaches nothing but the essay, and the view’s editor and model links are what join the rest, a disputed guess among them. Without both, each author reaches only the essay and their own neighbours; the one thing everyone shares is the essay. Unplug the essay’s host too, and four records still name the same address that nobody can open.',
    uncertain: 'Real clients may cache, crawl or ask several indexes. The walk models only references and one index.',
    falsifier: 'If, with the index and view unplugged, participants could still reach each other’s contributions.',
    simpler: 'A sentence: references point backwards, so only an index finds replies.',
    data: 'The Community page’s fixtures and contracts, imported unchanged. The hosts and the walk are our model; nothing is fetched.',
    finding:
      'Unplug the index and the essay no longer knows who answered it. What everyone still shares is the essay, then only its address.',
    related: ['22', '26', '25', '23'],
  },
  {
    n: '29',
    title: 'The Unfinished Conversation',
    family: 'community',
    kind: 'editorial',
    status: 'kernel',
    transformation: 'constrain',
    encounter: 'essay',
    question: 'Can a record of a conversation say exactly how unfinished it is, without inventing closure?',
    proposition:
      'Every item in the fixture conversation can be given a precise open status, naming who could close it, and none can honestly be closed by a summary.',
    manipulate: 'Try to close the whole conversation, mark an item resolved, summarise it as agreed, or answer it yourself.',
    changes:
      'The minutes: every attempt is recorded with its refusal; answering an item opens a new one, which only the original asker could accept.',
    unchanged: 'The fixture records. The people who could close items are invented and cannot act.',
    provenance: {
      idea: 'The essay’s concern that solved problems disappear into private sessions, and the temptation of a generated summary that ends a thread.',
      mechanism:
        'Closure as a speech act: only the asker can accept an answer, only the essay’s author can issue a corrected version, only a proposer can withdraw.',
      sourceShowed:
        'Our protocol notes found no Lexicon for an accepted answer; Leaflet’s questionVisibility.accepted means accepted for display, not answered.',
      interpretation:
        'That “unresolved” is not one state: there is waiting for someone, unanswerable, and closed by withdrawal, and a summary blurs them.',
      sources: [
        {
          label: 'ATProto and portable communities, research notes',
          url: COMMUNITY_DOC,
          firmness: 'fact',
        },
        {
          label: 'Fixture contributions',
          url: FIXTURES_FILE,
          firmness: 'fact',
        },
        {
          label: 'Connection contracts',
          url: CONTRACTS_FILE,
          firmness: 'fact',
        },
      ],
      priorArt: ['Meeting minutes and action logs', 'Stack Overflow’s accepted answer', 'GitHub issues closed “as not planned”'],
    },
    built:
      'A typed minutes sheet of eight items derived from the fixtures, with closing actions that the procedure refuses or turns into new items.',
    happened:
      'Of the eight items, 5 are open, 1 is unknowable (Ola’s), and 2 are closed, both by withdrawal: Rui deleted the reply, and the editor withdrew its own link. Nothing in the conversation was closed by being answered. Answering an item yourself makes the minutes longer, never shorter.',
    uncertain:
      'Whether a minute-taker should be allowed any closure at all. Real conversations end by fading, which no status here captures.',
    falsifier: 'If some item could be closed honestly by someone other than its opener, or by summary.',
    simpler: 'A status column on a list of questions: open, waiting for whom, closed by whom.',
    data: 'The Community page’s fixtures and contracts, imported unchanged. The eight items and their closers are our reading of them.',
    finding:
      'Eight items, two closed, both by withdrawal. Nothing in the conversation was closed by being answered, and answering one yourself only adds another item.',
    related: ['24', '26', '21'],
  },
  {
    n: '30',
    title: 'The Moderation Lens',
    family: 'community',
    kind: 'editorial',
    status: 'kernel',
    transformation: 'remove',
    encounter: 'atproto',
    question: 'How far can a visibility policy change the story a view tells about the same conversation?',
    proposition:
      'Honouring a few labels changes not just how much of a conversation is shown but what the view can truthfully say happened in it.',
    manipulate:
      'Slide a lens through five visibility policies, from showing everything to honouring two invented labelers’ labels as hiding.',
    changes: 'Which records are shown, collapsed or hidden, and the one-paragraph account the view writes from what it shows.',
    unchanged: 'The eight records and the four invented labels. A label never edits a record.',
    provenance: {
      idea: 'ATProto labels, which any labeler can attach to any record and each application decides whether to honour.',
      mechanism:
        'com.atproto.label.defs#label (src, uri, val, cts), interpreted per application; labels from one labeler have no effect elsewhere unless another interface honours them.',
      sourceShowed:
        'Our protocol notes confirm the label fields and that interpretation is left to each application. The labelers and labels here are invented.',
      interpretation:
        'That moderation is an editorial act on the account, not only a filter on items, and the account is where its effect is easiest to see.',
      sources: [
        {
          label: 'ATProto and portable communities, research notes',
          url: COMMUNITY_DOC,
          firmness: 'fact',
        },
        {
          label: 'Label specification',
          url: 'https://atproto.com/specs/label',
          firmness: 'fact',
        },
        {
          label: 'Invented labels fixture',
          url: LABELS_FILE,
          firmness: 'speculation',
        },
      ],
      priorArt: ['Bluesky’s stackable moderation services', 'Slashdot’s threshold slider', 'Content-warning collapses on Mastodon'],
    },
    built:
      'A five-stop range control, a grid of the eight records, and an account generated from whatever the current policy leaves visible.',
    happened:
      'At the strictest stop the view states that “nobody disagreed with it”, from three hidden records out of eight, and says Ines endorsed “something this view does not show”. Only the first stop mentions the two replies that cannot be read. The warning stop changes nothing in the account except one sentence: the hidden dispute is still counted.',
    uncertain:
      'The account generator is ours; a real view might not summarise at all. The four labels were chosen to make the effect visible.',
    falsifier: 'If the account stayed true to the conversation at every stop, only shorter.',
    simpler: 'A count of hidden records beside the conversation (“3 hidden by your settings”) would expose the same gap.',
    data: 'The Community page’s fixtures, unchanged, and four invented labels from two invented labelers, in src/lab/data/community-labels.ts, marked in the interface.',
    finding:
      'Hide three of eight records by label and the view can say “nobody disagreed with it”. Moderation edits the account, not just the list.',
    related: ['23', '24', '25', '27'],
  },
]
