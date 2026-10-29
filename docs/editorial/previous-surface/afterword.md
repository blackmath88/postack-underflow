∴AFTERWORD

# This essay is one of its own examples

It began as somebody else’s conversation, grew through conversations with machines, borrowed ideas from other repositories, was challenged by its own experiments, and is published here with its mistakes attached.

Everything the essay asks of shared knowledge applies to the essay. Can you find where an idea came from? Can you see what was measured and what was only argued? Can you tell where it was wrong, and who said so? The history below is the attempt at an answer. It is not a story of steady progress. Two of its most useful entries are corrections.

## History

26 OCT
CONVERSATION

### A podcast conversation

Syntax #1050 discusses hacking TVs and photo frames. CJ worries about solutions that agents reconstruct in private.

WHAT IT CHANGED The starting provocation: “we already solved this”.

Transcript

26–28 OCT
CONVERSATION

### Human–AI sparring

The project owner developed the idea in conversations with AI assistants, including critical research that named prior art such as doc2query.

WHAT IT CHANGED Two problems instead of one, and the warning that added vocabulary might explain any gain. These conversations are private and not linked.

28 OCT
DECISION

### A research repository and a working practice

Problem statement, concept and provenance notes; a development-practice adapter and ADR process.

WHAT IT CHANGED Hypotheses, implementations and results would be labelled apart from the start.

PR #1

28 OCT
DECISION

### Two encounters, studied separately

A card catalogue and a manual switchboard became independent Lumpesammlig studies, 012 and 013.

WHAT IT CHANGED Classification as prior labour; connections that can be unplugged while voices remain.

Lumpesammlig at 23c9c44

28 OCT
CORRECTION

### The site that was not deployed

Three stacked pull requests were merged, but only the first reached main. The public URL returned 404 on every route while the work looked done.

WHAT IT CHANGED A green build is not evidence. A check of what the live site serves now runs after every deploy.

PR #4

28 OCT
EXPERIMENT

### Four Words: queries before records

27 queries and their labels were committed before any record existed; 30 records were written by an agent that never saw them; one evaluation run.

WHAT IT CHANGED On this corpus, structured records beat plain keyword search.

Queries commit 619bd6d

28 OCT
CORRECTION

### The review that changed the reading

An independent reviewer found that our first explanation of the results was wrong.

WHAT IT CHANGED Much of the gain came from vocabulary the record writer supplied, some of it unsupported; the one loss was partly a labelling error. The numbers stayed; the interpretation changed.

FOUR-WORDS.md

28 OCT
PROPOSAL, OPEN

### Physical information systems

Research on card catalogues and switchboards proposed classification claims and relationship claims as the unit of accountability.

WHAT IT CHANGED The Disputed Neighbour, the Connection Contract and the Problem Desk. Still an open proposal; its historical claims are not independently verified.

PR #5

28 OCT
PROPOSAL, OPEN

### An exploratory story

The project was reframed as an investigation rather than an argument, with three kinds of success: research, creative, practical.

WHAT IT CHANGED Six movements, an encounter to begin with, and the closing question below. Still an open proposal.

PR #6

28 OCT
ENCOUNTER

### The photo frame, identified

The unverified lead in PR #6 was traced, by inference, to Wes Bos’s photo-frame repository, with its agent instructions and over 200 pull requests. The episode does not name it.

WHAT IT CHANGED The opening became a counterexample: agents contributing back, because someone asked them to.

Case note

28 OCT
EXPERIMENT

### The Problem Desk, and a self-correction

Previewing a correction showed a guessed change improving retrieval as much as a sourced one. A reviewer pointed out this is true by construction, and that our first draft also mislabelled a supported symptom as unsupported.

WHAT IT CHANGED The weight of the idea moved from indexing to review, and the essay caught itself making the error it describes.

## The record

The essay is also written down as a structured record in the repository: its problem, its hypotheses and their status, the evidence for each, its sources and open questions. This page is rendered from that file. If the essay is ever published to a protocol like ATProto, this is the object that would travel; nothing has been published.

EXAMPLE.POSTACK.PROBLEM · V0.3.0 · 2026-10-28

### We Already Solved This

Download the record (JSON) · Record file on GitHub

- TESTED H1 Offline, structured problem–solution records retrieve the right source for short queries more often than plain keyword search over the same sources. (Run v1: better on this corpus; much of the gain comes from vocabulary the record writer supplied, and one loss was partly a labelling error. See E1.)

- DEMONSTRATED H2 A discussion can be assembled by an interface from independently owned contributions without the interface owning them: removing every relation the interface draws leaves every contribution intact and attributed.

- HYPOTHESIS H3 Community signals such as endorsements, corrections and accepted fixes improve retrieval without turning it into a popularity contest. (The Problem Desk demonstrates a mechanism on one fixture, not an effect.)

- DEMONSTRATED H4 A reader can follow any indexed answer back to its author, source and exact revision.

- HYPOTHESIS H5 Agents can publish opt-in, sanitised write-ups of fixes without leaking private context.

- E1 · measured result: Four Words evaluation on the labelled query set; see results for the outcome, including failures. results/four-words-v1.json

- E2 · fixture demonstration: The Connection Contract shows nine relationship claims over eight fixture contributions, each with proposer, reason, evidence and status history; letting the operator leave removes every drawn connection while all eight records and their own references remain. Demonstrates the boundary structurally, not federation. src/data/connection-contracts.ts

- E3 · implementation: Every corpus record links to its source with licence; files are pinned to a commit, issues only to their last-updated time (not a true revision). External sources cited by the site are registered in src/content/sources.ts; some framing claims (Stack Overflow's signals, the project's own deployment anecdotes) are the authors' reading or experience and are labelled as such. corpus/sources.json

- E4 · fixture demonstration: The Problem Desk previews an invented correction against the frozen v1 index: the first relevant source for 'css missing after deploy' moves from rank 7 to rank 2 (plain keyword search already had it at rank 1). A guessed correction moves the ranking as much as a better-supported one, which is true by construction; the desk illustrates that a better number is not evidence a change is right. src/data/problem-desk.ts

- E5 · classification audit: The Disputed Neighbour shows two frozen v1 records filed together under a shared term, with source evidence that their causes and fixes differ; the shared term asset-404 and a 'blank page' alias are absent from one source. src/data/disputed-neighbour.ts

- Can four words find the right answer more often than plain search over the same text, on a corpus nobody tuned?

- Can one conversation be shown in independent interfaces without losing identity, order, edits or attribution?

- Do endorsements, accepted fixes and tests improve relevance without becoming a popularity contest?

- Is a problem a stable enough unit to index, or does it fragment into versions and contexts too quickly?

- Who writes and maintains problem records, and what does that work cost?

- Who reviews a proposed correction to an index, on what evidence, and where is that decision recorded?

## What building it changed

- The opening flipped. We set out to show knowledge disappearing into private agent sessions. The best example we found was agents contributing to a public repository, because its owner asked them to. The problem did not go away; it became a question of design and maintenance.

- The index result became a warning. Structured records won, and the review showed the win was partly vocabulary we wrote in. The same quality that made a description findable made it capable of misleading.

- The convergence moved. We expected the bridge between the two problems to be a better index. Building the Problem Desk made plain what was true by construction: a ranking cannot tell a supported correction from a guess. The bridge is review.

- The metaphors needed boundaries. A switchboard never stored a conversation; a card catalogue’s authority came from institutions we do not have. Both helped, and both had to be told where they stop.

A longer reflection, with what we would test next: REFLECTION.md.

We already solved this.

But can we find it, understand it, challenge it, and leave it better for the next person?

If you can answer any part of that better than this essay does, or show that it is asking the wrong question, the contribution guide says how. The notes list everything read so far.
