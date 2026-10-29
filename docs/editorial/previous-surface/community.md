BRABBIT HOLE · COMMUNITY

# The Switchboard

The knowledge exists. Who keeps it alive? An answer is only as good as the people who checked, corrected and argued about it, and that work has to happen somewhere.

## Who keeps it alive

Go back to the photo-frame repository from the opening. On the day we counted, strangers and their agents had opened 201 pull requests: 150 merged, 21 waiting, 30 closed without merging. Each merge is somebody reading a stranger’s notes about a board they may not own, deciding whether to trust them, and taking responsibility for publishing them. The repository’s instructions ask contributors to check what is already open before adding more, to keep observations apart from guesses, and to strip private data first. That is a community’s rulebook, and one person enforces it.

It works, and it depends on that person. If they stop, the notes stay readable but nobody checks the next pull request. The same was true, at much larger scale, of the site that taught a generation of developers to search for their error messages.

## It was never just answers

It is tempting to remember Stack Overflow as a database of answers. It worked more like a machine for collective judgement, built from small mechanisms that each did one thing imperfectly. Together they let you rely on a stranger’s reply, or doubt it with reason.

| MECHANISM | WHAT IT CONTRIBUTED | WHAT IT COST |
| PUBLIC QUESTION | Made the problem findable and quotable | Many questions were duplicates or poorly scoped |
| VOTES | Aggregated many small judgements | Rewarded early and popular answers |
| ACCEPTED ANSWER | Recorded what worked for the asker | One person’s context, frozen in time |
| COMMENTS | Caught edge cases and breakage | Easy to miss, sometimes hostile |
| EDITS | Let answers improve after posting | Blurred authorship |
| REPUTATION | Gave strangers a reason to trust | Identity is not correctness |
| MODERATION AND DUPLICATES | Kept one thread per problem | Could feel unwelcoming to newcomers |

None of these signals proves an answer true. What they did was make disagreement and correction visible, attached to the answer itself. They also all depended on one site existing, being trusted and staying online.

## Where the conversation went

HYPOTHESIS Our reading, not a measurement: a lot of problem solving now happens in a private chat with a model, or in an agent run that leaves behind a diff. Some of it does surface. Wes mentions agents opening issues and pull requests on his repositories. But a pull request is a fix, not a question others can find by its symptom, and nobody votes on it or adds the comment saying it breaks on Windows. Much of the judgement happens in one person’s head and stays there.

Moving everyone back onto one big site is not obviously the answer. Platforms change hands, change rules and shut down, and a community’s memory goes with them. The question here is whether a community can exist without living in one place.

## A model in two layers

HYPOTHESIS Separate two things that one platform used to hold together:

- Contributions: an article, a reply, a correction, an endorsement, a dispute. Each is published by its author, in a place the author controls, under the author’s identity, and can name what it responds to.

- Relations: the lines an interface draws between contributions to show them as a thread, a forum, or a map. Some come straight from the authors’ own references; others are an editor’s grouping or a model’s guess. Every relation has a reason and an origin you can see.

An interface assembles contributions; it does not own their original context. If the interface disappears, the contributions are still where their authors put them.

## What a switchboard knew

A manual telephone switchboard joined separate lines. Each caller owned their own endpoint; the operator answered a request, made a temporary connection, could listen in to supervise, and pulled the cord when the call ended. Every connection was a choice somebody made, and the operator had real power over who could reach whom.

It also kept nothing. A switchboard routed live speech; when the cord came out, the conversation was gone. Persistent, authored records are not part of the historical object. They are the change this experiment makes to it: the voices stay, and only the connections are temporary.

The operational details are reported in research compiled for this project and not independently verified here (PR #5).

EXPERIMENT · RELATIONSHIP CLAIMS OVER FIXTURE RECORDS

## The Connection Contract

Eight invented contributions sit in their authors’ own repositories. Every line between them is a claim with a contract: who proposed it, why, on what evidence, and where it stands. Select a line to read its contract, or propose one of your own. (H1, H2 and H4 are hypotheses in this essay’s own record; see the afterword.)

- solid · declared by an author

- dashed · this view’s editor

- dotted · a language model

- dash-dot · you

7 connections drawn · 8 contributions · 0 proposed by you

### Connections

- c2 → c1 replies to — declared by the author · declared

- c4 → c1 corrects — declared by the author · declared

- c6 → c4 endorses — declared by the author · declared

- c5 → c1 disputes — declared by the author · declared

- c7 → c1 replies to — declared by the author · declared

- c3 → c2 same question — proposed by this view’s editor · accepted

- c5 → c4 same question — proposed by a language model · disputed

CONNECTION CONTRACT K7
DISPUTED

- Overlapping vocabulary: “record”, “trust”.

- proposed by a language model. Generated suggestion.

- disputed by this view’s editor. Jun’s dispute is about who controls attention; Mara’s correction is about revision pinning. Shared words, different questions.

### Propose a connection

Your proposal is a reading, like the editor’s. It cannot become an author’s statement, and it stays in this tab.

LEARNED FROM · LUMPESAMMLIG 013-SWITCHBOARD, AN INDEPENDENT COLLECTION OF INTERACTION STUDIES

Contributions exist independently of the connections between them. Unplug every cable and the relationships leave the view while every voice stays intact.

The community demonstration separates records from relations; removing every relation changes nothing in the source ledger.

Open The Switchboard · The Switchboard study notes at 23c9c44

Look at the model’s proposal first. It sits beside the authors’ own references with a different line, a different label and a history that ends in a dispute. It may sometimes be right. It never becomes an author’s statement, and neither does yours.

Then let the operator leave. Every line goes, including the ones you drew, and the eight records remain, each with its own references inside it. Two of them show what portability cannot fix: one author’s server is offline, so there is nothing to show; one author deleted their reply, and the protocol keeps no tombstone. An honest interface says so rather than quietly serving a stale copy.

## What exists today, and what does not

The AT Protocol already provides much of the first layer. Accounts own repositories of signed records; anyone with a domain can define a schema, called a Lexicon; and a reference can pin one exact version of another record. Standard.site defines records for publications and documents, including a field linking a document to a Bluesky thread that acts as its comment section. What we could not find is any shared schema for the judgement layer.

| NEED | EXISTING RECORD TYPE | STATUS |
| PUBLISH AN ARTICLE ON YOUR OWN SITE, AS A RECORD | site.standard.document | Exists, in use |
| POINT AT ONE EXACT VERSION OF A RECORD | com.atproto.repo.strongRef (uri + cid) | Exists, in use |
| REPLY IN A THREAD | app.bsky.feed.post reply (root, parent) | Exists, in use |
| USE A BLUESKY THREAD AS A BLOG’S COMMENTS | site.standard.document bskyPostRef | Exists, in use |
| RECOMMEND A DOCUMENT | site.standard.graph.recommend | Exists; app-specific or adoption unmeasured |
| COMMENT ON A DOCUMENT | pub.leaflet.comment, fyi.frontpage.feed.comment | Exists; app-specific or adoption unmeasured |
| VOTE ON A LINK OR POST | fyi.frontpage.feed.vote | Exists; app-specific or adoption unmeasured |
| ASK AN AUTHOR A QUESTION; THE AUTHOR ANSWERS | pub.leaflet.interactions.question / .answer | Exists; app-specific or adoption unmeasured |
| LABEL CONTENT FOR MODERATION | com.atproto.label.defs#label | Exists, in use |
| GROUPS WITH SHARED SPACES | Atmospheric Groups / opensocial.group | Proposal |
| ENDORSE A SPECIFIC SOLUTION | — | No Lexicon found |
| CORRECT ONE VERSION OF A CLAIM | — | No Lexicon found |
| RECORD A DISAGREEMENT | — | No Lexicon found |
| MARK AN ACCEPTED ANSWER | — | No Lexicon found |
| PROBLEM AND SOLUTION RECORDS WITH EVIDENCE | — | No Lexicon found |

Two details matter more than they look. Records can be edited in place and deleted without a tombstone; a reference that pins a version can tell that its target changed, but not what it used to say, though caches may still hold copies. So a correction needs to point at the exact version it corrects. And the main Bluesky app view indexes only its own record types: a reply aimed at a blog document is stored, but judging from the app view’s code (not tested live) it would be treated as an invalid reply. Portability of records is real; portability of conversation is not automatic.

Full notes with field names, pinned lexicon revisions and caveats: ATPROTO-COMMUNITY.md. The demonstration above uses real record types where they exist and a placeholder example.postack.* namespace where they do not.

## What portability does not buy

Owning your records does not mean anyone sees them, that they stay online, or that they are right. Moderation labels apply only where an interface chooses to honour them. Whoever runs the popular view still decides what most people see; portability moves that power around rather than removing it. The fixture dispute above stands in for that objection; it is a real problem, and this project does not have an answer to it yet.

NEXT

The Problem Desk: where a correction meets the index

Or go back to the Impossible Index and try Four Words.
