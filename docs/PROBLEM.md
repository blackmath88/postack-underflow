# The problem: indexing × community

## Trigger
In Syntax.fm episode **#1050, “Everyone Is Hacking Their TV”** (October 2026), CJ raised a concern about losing the shared shortcut that let developers find a relevant Stack Overflow solution with a few words. An agent may instead inspect code, visit sources, reason, and reimplement something already solved; another agent repeats the process. This is our **paraphrase and interpretation**, not a verbatim quotation. [Episode transcript](https://syntax.fm/show/1050/everyone-is-hacking-their-tv/transcript). Recheck timestamps and exact wording before quoting publicly.

## Hypothesis A: discovery failure
Public solutions exist, but are indexed primarily as pages, repositories, or code symbols rather than **problems solved**, applicability constraints, tests and evidence. Agentic exploration can be expensive and repetitive.

## Hypothesis B: community failure
Problem solving migrates into private chats and transient agent runs. Unlike public Q&A, solutions do not reliably return to a discoverable commons. Stack Overflow used votes, accepted answers, comments, reputation, editing, duplicates and moderation; none proves truth, but together they provide useful signals. Google's ranking was not simply visit counts: relevance, linking/authority and page structure mattered. We should test which signals still help.

## The coupling
A brilliant index of unreviewed answers is fragile. A rich community that nobody can discover is equally fragile. Indexing should expose source, context, endorsement, dissent and evidence; community should produce records that are indexable outside its host.

## Questions worth falsifying
1. Does offline extraction of problem–solution pairs improve retrieval over GitHub's native search or BM25 on README/issue text?
2. Can three independent interfaces display one conversation with stable identity, ordering, edits and attribution?
3. Do endorsements, citations, accepted fixes, tests, and maintenance signals improve relevance without becoming popularity contests?
4. Can a reader follow an answer back to the original author, revision and implementation?
5. Can agents publish *opt-in, sanitized* findings without leaking private context?

## Not claims
No evidence yet that this approach beats existing search. No claim that an LLM should arbitrate consensus. No claim that decentralized hosting guarantees availability or moderation.
