import type { LabEntry } from '../types.ts'
import {
  COMMUNITY_PAGE,
  CONTRACTS_FILE,
  FOUR_WORDS_DOC,
  IMPOSSIBLE_INDEX_STUDY,
  MARGIN_FILE,
  MOTTE_CONTRACT,
  MOTTE_DOC,
  MOTTE_FLAGS_FILE,
  PR5,
  PR5_RESEARCH,
  RECORDS_FILE,
  RESEARCH_HISTORY_FILE,
  SWITCHBOARD_STUDY,
} from './shared.ts'

export const HISTORY: LabEntry[] = [
  {
    n: '31',
    title: 'Card Friction',
    family: 'history',
    kind: 'behavioural',
    status: 'kernel',
    transformation: 'constrain',
    encounter: 'card-catalogue',
    question: 'Does the cost of flipping through a drawer show you things a direct jump never would?',
    proposition:
      'Browsing friction is not only cost: flipping past a card’s neighbours shows you related records that a zero-cost jump skips.',
    manipulate: 'Choose a card to find, then flip one card at a time, riffle five at a time, or jump straight to it.',
    changes: 'Which cards you read on the way, and how many of them share a controlled term with the card you wanted.',
    unchanged: 'The drawer’s order, which is ours: each record is filed under its first controlled term.',
    provenance: {
      idea: 'The card catalogue as an encounter in the Lumpesammlig study “The Impossible Index”, and the essay’s reading of classification as prior labour.',
      mechanism: 'A physical drawer only shows one card face at a time; the edges and guide tabs of the cards behind it are visible but unread.',
      sourceShowed:
        'The study and PR #5 describe catalogue browsing and guide cards. Operational details there are reported, not independently verified.',
      interpretation:
        'We assumed the friction produced serendipity. Building the drawer suggests the friction only exposes the filer’s decisions.',
      sources: [
        { label: 'Lumpesammlig 012, The Impossible Index', url: IMPOSSIBLE_INDEX_STUDY, firmness: 'metaphor' },
        { label: 'PR #5, physical information systems research', url: PR5, firmness: 'reported' },
        { label: 'The 30 frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
      ],
      priorArt: ['Library shelf browsing and “virtual shelf” browsers', 'Rolodex and card-file interfaces', 'Bates on berrypicking (1989)'],
    },
    built:
      'A drawer of the 30 frozen records behind guide cards, with three levels of friction and a ledger of what each search passed on the way. Arrow keys flip when the drawer has focus.',
    happened:
      'Two of the three searches contradict each other. Flipping to the underscore issue passes 29 cards, 11 of them related, but none behind its own guide: its four closest neighbours are filed under “jekyll”, five cards earlier. Flipping to the custom 404 page passes 11 cards and not one is related; its neighbours are filed later, under “spa-fallback”. What friction reveals depends entirely on where the filer put things.',
    uncertain:
      'Whether a reader notices or uses the passed cards. The ledger counts them; it cannot say they were read with attention.',
    falsifier:
      'If, for most targets, the cards passed on the way shared no term with the target. Here one of three did; the drawer is too small to say more.',
    simpler: 'A “nearby in the index” list beside a search result shows the same neighbours without the cost, and without the wrong ones.',
    data: 'Frozen Four Words v1 records, read-only. The filing order (first controlled term, then source id) is a choice made for this experiment.',
    finding:
      'Friction exposes the filer, not serendipity: one search passes 11 related cards, another passes none, because of where each card was filed.',
    related: ['07', '08', '32', '33', '36'],
  },
  {
    n: '32',
    title: 'The Librarian’s Hand',
    family: 'history',
    kind: 'epistemic',
    status: 'kernel',
    transformation: 'remove',
    encounter: 'card-catalogue',
    question: 'If every line of a record is inked by the hand that decided it, whose labour is the classification?',
    proposition:
      'Classification is prior labour you can attribute: every line of a frozen record can be traced to one hand, and lifting that hand shows what it contributed.',
    manipulate: 'Choose one of the 30 frozen records, then lift or return any of five hands: source author, selector, printed form, record writer, reviewer.',
    changes: 'Which lines stay on the card, whether the card can still be filed under a heading, and the word count left in each hand.',
    unchanged: 'The record itself. The attribution follows what the corpus says about its own making; nothing is re-read from the sources.',
    provenance: {
      idea: 'The essay’s margin note on the card catalogue, which calls classification work done before anyone asked, and Lumpesammlig 012.',
      mechanism: 'A catalogue card carries typed, printed and handwritten marks; each is a decision by a different person at a different time.',
      sourceShowed:
        'The corpus records say every field was paraphrased by an AI agent and that no person has reviewed any of them. The source documents name an AI research agent as selector.',
      interpretation:
        'We expected a card of several human hands. The hands are real, but on these cards the librarian is a machine, and the human hand is the blank one.',
      sources: [
        { label: 'The essay’s margin note: has anyone faced this before?', url: MARGIN_FILE, firmness: 'reported' },
        { label: 'Lumpesammlig 012, The Impossible Index', url: IMPOSSIBLE_INDEX_STUDY, firmness: 'metaphor' },
        { label: 'The 30 frozen v1 records and their extraction notes', url: RECORDS_FILE, firmness: 'fact' },
        { label: 'Four Words method: who selected, who wrote, who reviewed', url: FOUR_WORDS_DOC, firmness: 'fact' },
      ],
      priorArt: ['Library catalogue cards with tracings and cataloguer’s marks', 'Wikipedia’s page history and blame views', 'git blame', 'W3C PROV provenance model'],
    },
    built:
      'One record as a ruled card, each line marked A to E by its hand and set in that hand’s ink. The printed form lists all 16 controlled terms; the writer’s ticks sit in it. Lifting a hand removes its ink and recounts the words.',
    happened:
      'On all 30 cards the record writer, an AI agent, wrote between 81% and 92% of the words (median 89%). The reviewer’s line is blank on every one. Lifting the writer leaves a title, a repository, a licence and an untouched form: the card can no longer be filed, because nothing is ticked. The vocabulary’s author cannot be named from the record at all.',
    uncertain:
      'Our split is coarse: the selector may also have shaped the record writer’s brief, and the source author’s words survive inside the paraphrases. Counting words treats a heading tick and a sentence alike.',
    falsifier: 'Lines whose hand cannot be read from the record’s own provenance. One hand, the vocabulary’s author, already cannot; for the rest the attribution held.',
    simpler: 'A one-line provenance stamp on each record (“written by an AI agent, not reviewed”) says most of this without the card.',
    data: 'Frozen Four Words v1 records and source metadata, read-only. The five-hand split is our reading of the corpus documentation.',
    finding:
      'The prior labour on these cards is not human: an AI agent wrote 81–92% of every card’s words, and the reviewer’s line is blank on all 30.',
    related: ['31', '36', '38', '39'],
  },
  {
    n: '33',
    title: 'The Filing Rod',
    family: 'history',
    kind: 'behavioural',
    status: 'kernel',
    transformation: 'constrain',
    encounter: 'card-catalogue',
    question: 'What does it cost to turn a tentative placement into an accepted order, if the order is held by a rod?',
    proposition:
      'A rod that locks the accepted order makes acceptance expensive and rejection free, so it rewards accepting cards in batches.',
    manipulate: 'Draw the rod back or push it in, one or five card-widths at a time; file a tentative card where the cards are loose, or lift it out.',
    changes: 'Which cards are held, how many stand loose, which tentative cards can be filed, and the rod travel spent so far.',
    unchanged: 'The order itself: every card belongs at the same place by source id. Lifting a tentative card out never touches the rod.',
    provenance: {
      idea:
        'PR #5’s research lists “tentative insertion above retaining rod prior to review” among card-catalogue mechanisms, citing a National Library of Medicine example.',
      mechanism:
        'Cards are punched at the foot and held in order by a rod; a card standing above the rod is in place but not held. In our model the rod enters from the drawer’s front and frees the back cards first.',
      sourceShowed: 'PR #5 reports the retaining rod and the tentative insertion. We have not read its cited source; the front-entry geometry is our assumption.',
      interpretation:
        'The rod is a lock with a price that depends on position. A tentative card near the front costs more to accept than one near the back, whatever it says.',
      sources: [
        { label: 'PR #5 research synthesis: card-catalogue mechanisms', url: PR5_RESEARCH, firmness: 'reported' },
        {
          label: 'Cited by PR #5 for the retaining rod (NLM, Circulating Now); not read by us',
          url: 'https://circulatingnow.nlm.nih.gov/2020/02/06/card-tricks-the-decline-fall-of-a-bibliographic-tool/',
          firmness: 'reported',
        },
        { label: 'The front-entry rod geometry and its cost model', firmness: 'speculation' },
        { label: 'The 30 frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
      ],
      priorArt: ['Database transactions and table locks', 'Pull-request review and merge queues', 'Staging areas such as git’s index'],
    },
    built:
      'A side view of one drawer: 26 documentation cards on a rod, four issue reports standing above it. The rod moves card by card; filing is only allowed where cards are loose. The ledger prices the four filings one at a time and in one opening.',
    happened:
      'Accepting all four in one opening costs 26 card-widths of rod travel; one at a time, front to back, costs 44, and back to front 56. Alone, the Next.js issue costs 23 and either Vite issue 5, only because of where they sort. Lifting a card out costs nothing. The lock does reward batching, and it also taxes the front of the alphabet.',
    uncertain:
      'Whether real rods entered from the front, and whether cataloguers batched because of them. A digital lock has no travel, so the cost would have to be designed in, and it is not clear it should be.',
    falsifier: 'If accepting cards together cost the same rod travel as accepting them one by one. It costs 26 against 44 here.',
    simpler: 'A “pending” flag and a batch “accept selected” button express the same distinction without any cost.',
    data: 'Frozen Four Words v1 records, read-only. Which cards start tentative (the four issues) and the rod geometry are our choices.',
    finding: 'The rod rewards batched review, 26 card-widths against 44, and taxes position: a card near the front costs 23 to accept, one near the back 5.',
    related: ['11', '31', '36', '34'],
  },
  {
    n: '34',
    title: 'Occupied Circuits',
    family: 'history',
    kind: 'behavioural',
    status: 'kernel',
    transformation: 'constrain',
    encounter: 'switchboard',
    question: 'Does a fixed number of cords make you attend to the connections you hold, or only make you drop them?',
    proposition:
      'A finite number of circuits supports attention: when holding a connection open has a visible cost, you listen to it and then release it, instead of letting connections pile up.',
    manipulate: 'Choose 2, 3 or 5 cords, or no limit; answer the next call, listen to a circuit, or pull its cord.',
    changes: 'How many circuits are up, whether a new call can be answered, and the ledger of releases after listening and without listening.',
    unchanged: 'The 60 calls and what they say: each is one “related” link written into a frozen record, in record order.',
    provenance: {
      idea: 'PR #5 reports that a manual switchboard had a limited number of cord circuits, and that releasing a call restored capacity.',
      mechanism: 'Each cord pair can carry one connection. When all are up, the operator cannot connect anyone else until one comes down.',
      sourceShowed: 'PR #5 lists limited cord circuits, occupied circuits and release among switchboard mechanisms. Reported, not independently verified.',
      interpretation:
        'We read the limit as an attention device. Building it, the limit turned out to enforce clearing, which is not the same thing.',
      sources: [
        { label: 'PR #5 research synthesis: switchboard mechanisms', url: PR5_RESEARCH, firmness: 'reported' },
        { label: 'The essay’s margin note on what a switchboard did', url: MARGIN_FILE, firmness: 'reported' },
        { label: 'Lumpesammlig 013, The Switchboard', url: SWITCHBOARD_STUDY, firmness: 'metaphor' },
        { label: 'The related links in the 30 frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
      ],
      priorArt: ['Work-in-progress limits on kanban boards', 'Browser tab limits and tab-suspending extensions', 'Miller’s “seven, plus or minus two” as folk design advice'],
    },
    built:
      'A cord shelf over a list of open circuits. A full panel blocks the next call. Each circuit can be listened to, which shows the relation note and both problems, and released; the ledger tells the two kinds of release apart.',
    happened:
      'With three cords, the fourth call is blocked until a cord comes down, and every later call needs a release first. Nothing makes that release follow listening: pulling an unheard cord costs the same one press, and clearing a full three-cord panel to take the next call never requires hearing anything. With no limit the board simply grew. 40 of the 60 calls have a twin going the other way, so the panel carries 20 connections twice.',
    uncertain:
      'Whether any cost at all would make release follow attention, or whether attention needs a different instrument, such as a required note on release.',
    falsifier: 'If the limit made releases follow listening. It cannot: the panel treats a heard and an unheard release alike, so the limit produces eviction.',
    simpler: 'A counter of open items with a soft warning above three gives the same pressure, and the same eviction.',
    data: 'The related links of the frozen Four Words v1 records, read-only, as 60 calls in record order.',
    finding: 'A fixed number of cords forces a release before every new call, but not attention: pulling an unheard cord costs exactly as much as pulling a heard one.',
    related: ['35', '33', '25', '51'],
  },
  {
    n: '35',
    title: 'The Switchboard Operator',
    family: 'history',
    kind: 'architectural',
    status: 'kernel',
    transformation: 'trace',
    encounter: 'switchboard',
    question: 'If acknowledgement, connection and release are separate acts with a cost, which of them does a digital contract record?',
    proposition:
      'Making each of the operator’s acts explicit, and costing each one tick, shows that the order of acknowledgement decides who gets through, and that our contract vocabulary records only some of the acts.',
    manipulate: 'Choose a line and act on it: answer, plug in, ring, release, or watch the board. Every act moves the clock one tick.',
    changes: 'Each line’s lamp, which callers give up, which calls finish or are cut off, and a log that translates every act into a contract status, or into none.',
    unchanged: 'The nine connection contracts and eight contributions of the Community fixtures. Who calls whom comes from them; the timing does not.',
    provenance: {
      idea: 'PR #5’s list of switchboard acts: request and acknowledgement, plugs and ringing keys, supervision, and release after the call.',
      mechanism: 'An operator answers a lit line, plugs a cord into the called jack, rings, watches the supervision lamps, and pulls the cord when both parties hang up.',
      sourceShowed: 'PR #5 reports the acts and a request, acknowledge, establish, supervise, release rhythm. Not independently verified.',
      interpretation:
        'The essay’s Switchboard is about lines as claims and the operator leaving. This pilot is about the operator’s acts in time, which the essay does not model.',
      sources: [
        { label: 'PR #5 research synthesis: switchboard acts', url: PR5_RESEARCH, firmness: 'reported' },
        { label: 'The essay’s Switchboard and connection contracts (a different angle)', url: COMMUNITY_PAGE, firmness: 'fact' },
        { label: 'Connection contracts fixture', url: CONTRACTS_FILE, firmness: 'fact' },
        { label: 'Lumpesammlig 013, The Switchboard', url: SWITCHBOARD_STUDY, firmness: 'metaphor' },
      ],
      priorArt: ['TCP’s handshake and teardown', 'Read receipts and typing indicators', 'Session Initiation Protocol (INVITE, RINGING, ACK, BYE)'],
    },
    built:
      'A turn-based board of nine lines with lamps, five operator acts, and a log. The timings, one headset and a caller’s patience are invented; the model is pure and replayable. Each log line says which contract status, if any, could record the act.',
    happened:
      'Replaying three fixed strategies in code: finishing each call before touching the next loses 6 of 9 callers; releasing first loses 3; answering every ringing line first loses none and completes all 7 live calls. Two lines are dead (an offline and a deleted contribution) and cost two acts to discover. Of the five acts, only plugging and releasing have a status; answering, ringing and watching leave no trace.',
    uncertain:
      'The ordering result is partly by construction: callers here are patient for five ticks and nothing else can go wrong. Whether a digital acknowledgement should be a record at all is open.',
    falsifier:
      'If the order of acts made no difference to who got through, or if every act already had a contract status. Neither held.',
    simpler: 'A sequence diagram of the five acts makes the vocabulary gap visible without the clock.',
    data: 'Community fixtures and connection contracts, imported unchanged. Ring times, patience, call length and the one-headset rule are ours.',
    finding: 'Answering first saves every caller; finishing each call first loses 6 of 9. And three of the operator’s five acts have no word in our contract vocabulary.',
    related: ['34', '25', '22', '37'],
  },
  {
    n: '36',
    title: 'The Index Drawer That Lies',
    family: 'history',
    kind: 'epistemic',
    status: 'kernel',
    transformation: 'perturb',
    encounter: 'card-catalogue',
    question: 'How does a drawer label come to lie, and what does trusting it do to the order inside?',
    proposition:
      'Drawer labels go stale through ordinary filing, not neglect: a few late cards push others back, the labels stay, and a label that looks as authoritative as ever sends you to the wrong drawer.',
    manipulate: 'File the four late cards where the labels say, open drawers, look a card up by its labels, and re-letter any drawer.',
    changes: 'Which cards sit behind which label, which labels no longer match, which lookups the labels misdirect, and which cards were misfiled.',
    unchanged: 'The cards and their names. A label changes only when you re-letter it.',
    provenance: {
      idea: 'Lumpesammlig 012 and the essay’s card-catalogue note: classification is prior work, and it can be wrong.',
      mechanism: 'A drawer holds a fixed number of cards. When it is full, filing a card means shifting the last one into the next drawer, past a label lettered earlier.',
      sourceShowed:
        'PR #5 reports drawers, dividers and bounded filing positions, and maintenance and corrections. The overflow rule here is our model, not a documented practice.',
      interpretation:
        'A lying label is the drawer’s version of a stale index: its authority comes from looking official, not from being current.',
      sources: [
        { label: 'Lumpesammlig 012, The Impossible Index', url: IMPOSSIBLE_INDEX_STUDY, firmness: 'metaphor' },
        { label: 'PR #5 research synthesis: drawers and maintenance', url: PR5_RESEARCH, firmness: 'reported' },
        { label: 'The overflow rule and capacities', firmness: 'speculation' },
        { label: 'The 30 frozen v1 records', url: RECORDS_FILE, firmness: 'fact' },
      ],
      priorArt: ['Stale caches and cache invalidation', 'Out-of-date tables of contents and site maps', 'B-tree page splits, which update their keys'],
    },
    built:
      'A cabinet front of six drawers, five cards each, lettered when the 26 documentation cards were filed. The four issue reports arrive one by one and are filed where the labels say. Opening a drawer shows its cards and marks a label that no longer matches.',
    happened:
      'After the four late cards, three of six labels no longer match and six of 30 cards sit behind the wrong label. Two cards were filed out of order because the clerk trusted a lying label, and re-lettering afterwards cannot repair that: it still leaves two misdirected. Re-lettering after every filing, five times in all, keeps the cabinet true.',
    uncertain: 'Whether real cabinets were refiled like this or simply given new drawers. The misfiling depends on our rule for where a clerk inserts a card.',
    falsifier: 'If filing a few cards left every label true, or if re-lettering later fixed everything. Neither held.',
    simpler: 'Labels computed from the contents at every look, which is what software does, and which removes the lie and the cost together.',
    data: 'Frozen Four Words v1 source ids, read-only. Which cards arrive late, the capacity and the overflow rule are ours.',
    finding:
      'Four late cards make three labels lie; trusting them misfiles two cards, and re-lettering afterwards cannot undo it. Only re-lettering after every filing keeps the cabinet true.',
    related: ['31', '33', '13', '52'],
  },
  {
    n: '37',
    title: 'Desktop Pets Return',
    family: 'history',
    kind: 'behavioural',
    status: 'kernel',
    transformation: 'perturb',
    encounter: 'desktop',
    question: 'Which small cues make an interface companion seem to act on its own, and what does each one cost the reader?',
    proposition:
      'A companion seems autonomous through a few separable cues: idle movement, attention, interruption and returning after dismissal. Each cue adds acts nobody asked for.',
    manipulate: 'Switch any of the four cues on or off, let time pass one moment or twelve, move through the paragraphs, send Motte away, call it back, or ask it for history.',
    changes: 'Where Motte sits, which pose it shows, and a log of its acts sorted into on its own, reacting to you unasked, and because you asked.',
    unchanged: 'The four paragraphs, which are real margin-note summaries, and Motte’s sprite, imported unchanged. Motte never has a verified history note to show.',
    provenance: {
      idea: 'The Archive Moth design note describes Motte as a harmless descendant of desktop pets and animated desktop sprites.',
      mechanism: 'Desktop pets walk, react to the pointer, interrupt with speech, and come back; each behaviour is a short script on a timer.',
      sourceShowed:
        'The design note and the integration contract require bounded, infrequent, deterministic motion and clear pause and dismiss controls. They do not say which cues matter.',
      interpretation:
        'Our reading: autonomy is not one property. Each cue is a separate act on a clock, and each can be counted as an interruption.',
      sources: [
        { label: 'Motte, the Archive Moth: design note', url: MOTTE_DOC, firmness: 'fact' },
        { label: 'Motte integration contract', url: MOTTE_CONTRACT, firmness: 'fact' },
        { label: 'Desktop pets as a lineage', firmness: 'speculation' },
      ],
      priorArt: ['Neko and other desktop pets', 'Microsoft’s Office Assistant', 'Tamagotchi', 'Shimeji desktop mascots'],
    },
    built:
      'Four paragraphs with a margin beside them where Motte’s sprite lives. A pure, deterministic script decides one act per moment from the cues that are on. A run of twelve moments stops by itself and passes at once under reduced motion.',
    happened:
      'Idle movement alone produces an act in each of 12 moments; attention alone acts once and then stays still. With all four on and a paragraph in focus, 11 of 12 moments carry an act, 7 on its own and 4 reacting to us. With every cue off it is a static icon, and we no longer read it as a companion; that reading is ours.',
    uncertain:
      'Whether a reader would tolerate any of these cues beside real reading. Our sense that attention, not idle movement, makes it seem alive is a single impression, not a measurement.',
    falsifier: 'If switching cues off one at a time changed nothing about how often it acted unasked. Each cue changed the count.',
    simpler: 'A static History button in the margin, which is what Motte becomes on narrow screens and under reduced motion.',
    data: 'Four margin-note summaries from the essay and Motte’s sprite, both read-only. The behaviour script and its timings are ours.',
    finding: 'Idle movement alone makes Motte act in every one of 12 moments; attention alone acts once. Each autonomy cue is an interruption you can count.',
    related: ['38', '35', '45'],
  },
  {
    n: '38',
    title: 'Motte’s Historical Flags',
    family: 'history',
    kind: 'editorial',
    status: 'kernel',
    transformation: 'reveal',
    encounter: 'motte',
    question: 'What can a history companion say when it may only say what has been verified?',
    proposition:
      'Running the essay’s real margin notes through Motte’s own filter shows that it has almost nothing to say, and that its silence is the honest result, not a bug.',
    manipulate: 'Choose a chapter, and switch our extra test, that only history notes may pass, on or off.',
    changes: 'The count at each stage of the sieve, whether Motte raises or furls its flag, and which notes it is not allowed to raise.',
    unchanged: 'Motte’s module, its empty historyFlags list and its publicHistoryFlags filter, and every margin note. Nothing is rewritten as history.',
    provenance: {
      idea: 'The Motte integration contract: no verified notes are shipped, and only checked margin notes could ever pass the filter.',
      mechanism:
        'publicHistoryFlags keeps a flag only if its evidence status is verified and its source is an https link. The margin notes carry five evidence labels, of which only “checked” could map to verified.',
      sourceShowed: 'The module ships an empty list. The margin notes include four history notes; none is checked.',
      interpretation:
        'The filter tests evidence and link, never kind. With our history test off, true but unhistorical notes would be allowed under Motte’s “What history tells us”.',
      sources: [
        { label: 'Motte’s history flags and filter', url: MOTTE_FLAGS_FILE, firmness: 'fact' },
        { label: 'Motte integration contract', url: MOTTE_CONTRACT, firmness: 'fact' },
        { label: 'The essay’s margin notes and their evidence labels', url: MARGIN_FILE, firmness: 'fact' },
        { label: 'Motte, the Archive Moth: design note', url: MOTTE_DOC, firmness: 'fact' },
      ],
      priorArt: ['Wikipedia’s “citation needed”', 'Fact-check labels on news sites', 'Content filters that check form rather than meaning'],
    },
    built:
      'A sieve of four stages, from Motte’s own list to the notes that pass its filter, with the sprite beneath. The mapping from a note to a flag (checked becomes verified, the first source becomes its link) is ours, written only to run the filter.',
    happened:
      'Motte’s own list is empty, and in no chapter does a history note pass: the four history notes are measured, reported or a reading, never checked. With our history test off, the filter lets through checked source and research notes, such as how many people joined the photo-frame repository, which would appear under “What history tells us”.',
    uncertain:
      'Whether checking the two reported notes against primary sources is feasible soon, which is the only honest way for Motte to speak.',
    falsifier: 'If any history note passed the filter, Motte would have something verified to say. None does.',
    simpler: 'A sentence in the design note: “Motte has no verified history notes yet.”',
    data: 'The essay’s margin notes and Motte’s module, read-only. The note-to-flag mapping is ours.',
    finding:
      'No history note passes Motte’s filter in any chapter. The filter checks evidence and links, never kind, so unhistorical facts could fly the history flag.',
    related: ['37', '32', '43'],
  },
  {
    n: '39',
    title: 'The Marginal Printer',
    family: 'history',
    kind: 'architectural',
    status: 'kernel',
    transformation: 'translate',
    encounter: 'print',
    question: 'When the text under an annotation changes, should the annotation keep its place or its words?',
    proposition:
      'Print registration translates into annotation anchoring: a plate registered by position misprints silently when the text moves, a plate registered by quotation fails visibly, and an archival stamp cannot move at all.',
    manipulate: 'Print the next revision of one passage, and register the annotation plate by position or by quotation.',
    changes: 'Where each annotation prints, how far its plate is out, which annotations lose their words, and whether the stamp still describes the text.',
    unchanged: 'The three annotations and the stamp. Revision 0 is a frozen record’s solution field, verbatim.',
    provenance: {
      idea: 'Printed sheets made from several plates, where each plate must be registered against the others, and marginalia added later by other hands.',
      mechanism:
        'Registration marks show whether plates align; a plate that is out prints in the wrong place with full confidence. Web annotations face the same problem when a page changes.',
      sourceShowed: 'Nothing in the project’s research covers printing. This is a metaphor, tested on our own text.',
      interpretation:
        'A stamp that dates a state of the text is a different kind of mark from an annotation about some words, and needs a different rule.',
      sources: [
        { label: 'Print registration as a metaphor for anchoring', firmness: 'metaphor' },
        { label: 'The frozen record vite-issue-9119-underscore-chunk', url: RECORDS_FILE, firmness: 'fact' },
        { label: 'W3C Web Annotation Data Model (text position and quote selectors)', url: 'https://www.w3.org/TR/annotation-model/', firmness: 'fact' },
      ],
      priorArt: ['W3C Web Annotation selectors', 'Hypothesis’s fuzzy anchoring', 'Comments in collaborative editors', 'Colour separation and registration marks in print'],
    },
    built:
      'A sheet with an ink plate, a rose plate of three annotations in the margin, and a blue extraction stamp. Revisions 1 to 3 are edits we invented to move the text. The rose registration mark shifts as far as the worst annotation is out.',
    happened:
      'By position, one inserted clause puts all three annotations out by 49 characters, each printing confidently over the wrong words. By quotation, they stay on their words through two revisions and the third loses one annotation, which drops off the sheet instead of misprinting. The stamp is wrong from revision 1 on, and neither rule can help it.',
    uncertain:
      'Real anchoring combines both rules with context and fuzzy matching; ours is the bare contrast. Whether a lost annotation should be shown orphaned or hidden is open.',
    falsifier: 'If position anchoring survived ordinary edits, or quotation anchoring misprinted silently. Neither happened with these edits.',
    simpler: 'Keep annotations only on immutable revisions, so nothing ever needs re-registering.',
    data: 'One frozen record field, read-only, and invented revisions and annotations in src/lab/data/history-printer.ts; the annotation notes come from the same record.',
    finding:
      'Registered by position, one inserted clause misprints all three annotations without a warning; by quotation, they hold until their words go, then fail visibly.',
    related: ['32', '52', '03'],
  },
  {
    n: '40',
    title: 'The Museum That Rearranges Itself',
    family: 'history',
    kind: 'editorial',
    status: 'kernel',
    transformation: 'reorder',
    encounter: 'museum',
    question: 'Can an exhibition reorganise around a visitor’s question without rewriting a single label?',
    proposition:
      'A collection can answer a question by rearrangement alone, with every object label unchanged, as long as something can connect the question to the labels.',
    manipulate: 'Type a question or choose a prepared one, and choose who arranges the rooms: the labels’ own words or a curator’s map.',
    changes: 'Which room each exhibit stands in, the wall text that says why, and which words on each label matched.',
    unchanged: 'The twelve labels, rendered from the project’s research history exactly as written. Nothing is summarised or reworded.',
    provenance: {
      idea: 'Museums that rehang a collection around a theme, and the essay’s own archive of how it was made.',
      mechanism:
        'An exhibition makes an argument by placement and wall text; the objects and their labels stay the same while the rooms change.',
      sourceShowed: 'Nothing here comes from museum research; the mechanism is a metaphor. The exhibits are the project’s own dated history entries.',
      interpretation:
        'Rearrangement without relabelling works only through the labels’ vocabulary or through a curator’s prior judgement. Both are prior labour, again.',
      sources: [
        { label: 'The project’s research history', url: RESEARCH_HISTORY_FILE, firmness: 'fact' },
        { label: 'A museum rehang as a metaphor', firmness: 'metaphor' },
        { label: 'Generous interfaces for digital cultural collections, cited in PR #5', url: 'https://mtchl.net/generous-interfaces-for-digital-cultural-collections/', firmness: 'reported' },
      ],
      priorArt: ['Faceted browsing', 'Museum rehangs and thematic hangs', 'Generous interfaces (Whitelaw)', 'Search results grouped by relevance tier'],
    },
    built:
      'A floor plan of three rooms, or two under the curator. Each question either matches words between the question and the labels, using the essay’s tokenizer, or looks up a curator’s map from four prepared questions to kinds of event.',
    happened:
      '“What went wrong” brings forward one exhibit, through the single word “wrong”; asking “correction”, the labels’ own word, brings forward three. The curator’s map finds both corrections, but answers no question it was not prepared for. “What is still unverified” brings forward the one label that says “not independently verified”, but only through the word “still”: “unverified” never meets “verified”.',
    uncertain: 'Whether a stemmer or synonym list would help without becoming a hidden curator of its own.',
    falsifier: 'If ordinary questions found the relevant exhibits through the labels’ words. Most of ours did not.',
    simpler: 'A search box over the history list with results highlighted; the rooms add the visible store.',
    data: 'The project’s research history entries, read-only. The curator’s map is ours. Ranking uses the shared tokenizer to demonstrate a mechanism, not to evaluate anything.',
    finding:
      'Without rewriting labels, the museum can only answer in their words: “what went wrong” finds one exhibit, “correction” finds three, and a curator answers only questions prepared for.',
    related: ['31', '03', '32', '53'],
  },
]
