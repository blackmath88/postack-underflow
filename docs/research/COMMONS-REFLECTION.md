# Photo Frame Commons — what the real repository taught us

**Pilot 001 · 2026-10-29. This reflection was written by the agent that built the pilot. It has not been reviewed by a person. Its findings come from one repository, read once.**

The working proposition was:

> *A problem can become a shared place without requiring everyone to move their contributions to the same platform.*

The real repository partly supports it. It also showed that the place already existed before we arrived, and that it had its own index, its own curator and its own agents. What Postack can add is narrower than we assumed, and more specific.

## The biggest surprise: the commons was already there, and already agent-run

The pilot began from the Syntax #1050 worry: agents solving problems in private, with nothing landing anywhere public. In this repository the opposite is happening at scale.

- **Contributors' agents write in public.** The repository has 206 pull requests and 57 issues in under three weeks. 100 of the 265 threads mention an agent or a model by name, for example "below with Claude's help" and "Agent summary below". That count is a crude text match, not a measure of who wrote what.
- **The maintainer curates with an agent.** The repository ships an agent skill, `.agents/skills/triage-contributions/SKILL.md`, read at the snapshot revision. It reviews and merges pull requests, comments on and closes issues, and keeps `docs/pf1007l-start-here.md` and `docs/devices.md` consistent.
- **So there is a hand-made index.** Its symptom → fix → reports table is a problem index, built before Postack arrived and maintained continuously, at least partly by an agent working for the maintainer.

**Consequence for provenance.** The GitHub data cannot say which comments under the maintainer's account were typed by a person. br-ai-nstorm's rule is that `authoredBy` is never an AI. Faithfully importing this repository means that rule cannot be guaranteed: we know which account spoke, not who or what composed the words. A pilot that assumed human authorship would have been wrong without noticing.

## Questions from the brief

**Which problems were genuinely reusable?**
- **Across devices.** Several findings travel beyond the unit that produced them:
  - the USB-C cable rule: the same no-power, no-data behaviour was seen on a Frameo ZC002;
  - continuous animations pinning a WebView on low-end Android;
  - the compromised certificate roots;
  - CRLF scripts passing hash checks on Windows.
- **Reusable as a procedure, not as an answer.** The eMMC and `ums` family is reusable as a decision procedure: try 4-bit 26 MHz, then 12 MHz with the low-power build, then no-HS. No one fix is reusable as such. The maintainer's table already encodes that procedure.

**Which were too context-specific?** Most of the corpus.
- 180 of 206 pull requests touch `docs/`, most of them as one unit report: one firmware string, one eMMC size, one host, one boot hash.
- Their value is as data points in a table, not as standalone answers.
- The erased FRAME156 and the locked PF1506 are single-unit predicaments.

**How much interpretation did search need?** A lot, and most of it was already done by the maintainer.
- The 18 records required reading about 40 threads in full.
- Every record carries search words the record writer added (aliases), which the interface labels.
- Every status is a reading. For example, #208 is open on GitHub, yet its reporter says they succeeded. #12 is closed, yet its reporter corrected it the next day.
- Nine records lean on the maintainer's tables.
- The interpretive work with the most value was not ours.

**Did br-ai-nstorm's model fit the real contributions?** Partly. (See [COMMONS-BRAINSTORM.md](COMMONS-BRAINSTORM.md).)
- **Fitted:** provenance and the "inclusion is not endorsement" default.
- **Did not fit:**
  - repository adoption, which only reads Markdown files;
  - one author per repository;
  - line-anchored references for comments;
  - kind from headings (comments have none);
  - its lexical classifier, which read 65 of 74 real contributions as `claim`.
- **Could not be represented:** relations between problems, and anything the record writer wrote.

**Which relationships were explicit, and which had to be proposed?**
- **Explicit:** 31 links that authors declared themselves ("#113 reports your exact symptom"), and 10 citations in the maintainer's tables.
- **Proposed:** br-ai-nstorm's lexical curator proposed 2. The record writer proposed 65: 58 classifications, plus 7 possible conflicts, such as the no-HS patch working on January units and failing on #98.
- **The disappointment:** the contract can only carry the 41 explicit ones as pending proposals, no different in standing from the record writer's guesses. The interface separates them again by who proposed them. That separation lives in Postack, not in br-ai-nstorm's canonical state.

**Could the same discussion be shown faithfully in different views?** Not fully, and each view now says what it drops.
- **Thread:** keeps time and conversation, loses relations.
- **Map:** keeps relations and their reasons, loses time.
- **br-ai-nstorm's static view:** keeps kinds and source links. It prints `#L0` for comments and shows no dates.
- **All three:** carry excerpts, not the authors' full text. Excerpts are 25 words at most, by our own rule, because comment text belongs to its authors.

**What could ATProto contribute beyond GitHub?** (See [COMMONS-ATPROTO.md](COMMONS-ATPROTO.md).)
- **Contributed:**
  - authorship that travels;
  - a pinned version of each record (its CID);
  - an open side channel: the maintainer's "A bunch of people had this issue" appears only on Bluesky;
  - backlinks that can be queried: "who links #229?".
- **Did not contribute:** semantics, review or volume. Five posts link anything in the repository, against 331 GitHub comments.
- **Identity across platforms was weak.** One link was a domain claimed on both sides; one was only implied in a post.

**What was lost in translation?**
- full comment text;
- the board photographs that many reports depend on;
- the code blocks and tables that carry most of the measurements;
- edit history: GitHub keeps none through the API;
- reactions;
- the nuance of table cells that hold several outcomes in prose.

The excerpt rule is right for republication and costly for comprehension. The interface sends readers to the source for anything that matters.

## Which assumptions changed

1. **From "knowledge disappears into private sessions" to "knowledge floods into public, and curation is the bottleneck".**
   - 26 pull requests are open.
   - A Frameo route has "no reviewed route" despite several reported successes.
   - Corrections arrive after issues close.
   - The scarce resource is review, not publication.
2. **From "corrections improve findability" to "corrections change applicability".**
   - On the one real, unabsorbed correction (#12's `-71` on a January unit), plain search over the raw threads already ranks #12 first.
   - Accepting the correction changes what the record claims, not whether it is found.
   - The original Problem Desk hypothesis was that corrections would improve discovery. That hypothesis was not supported here.
3. **From "an index is a new layer" to "an index is a second reading".**
   - Where the maintainer's table exists, Postack's records mostly re-describe it.
   - Postack adds most in three places:
     - outside the curated page: Frameo, PF1506, the dashboard and security;
     - for readers without the vocabulary;
     - by keeping contrary reports apart, where the table merges them into one cell.
4. **From "portable records make a community" to "portable records make an address".** ATProto gave every post an owner and an address. It gave them no relation to the problem beyond the link their authors chose to include.

## Negative findings

- **No retrieval benchmark.** The record writer read every thread before writing anything, so no independent labelled set exists. The interface shows the record ranking and the raw-thread ranking side by side instead of claiming a metric.
- **Lexical curation is nearly silent on real excerpts:** 2 proposals across 74 contributions.
- **The tool has not been used by a real reader.** That includes the maintainer, contributors and owners of these frames. Every claim of usefulness here is the builder's own.
- **One public thread includes a device password.** The index had to redact it from its own search tokens after a first build leaked it into the postings. The redaction is now enforced by a test. Indexing public text republishes it in new shapes, and that risk is easy to miss.

## Unresolved tensions

- **Duplicating the curator.** An outside index of a well-curated repository risks competing with its maintainer, and can drift from the table it re-describes. A better shape might be the maintainer's own table, made searchable and linked to its reports. That would be an offer to the maintainer, not a product.
- **Agent-written records about agent-written reports, curated by an agent.** Every layer of this pilot has an AI in it. Postack labels its own layer. It cannot label the others.
- **Republication.** Even excerpts and tokens republish other people's words. The pilot keeps text in a gitignored cache. Whether a public research tool should hold even that much is a decision for the owner.

## Recommended next real-world pilot

**[linux-sunxi/sunxi-tools](https://github.com/linux-sunxi/sunxi-tools).** GPL-2.0, 96 issues, 168 pull requests, active as of 2026-10-20.

It is the FEL and USB tooling that every Route U report in this pilot depends on. That makes it a direct test of the part this pilot could not reach.

1. **Cross-repository problems.** Photo-frame reports cite `sunxi-fel` errors such as `usb_bulk_send ERROR -7` and corrupted large uploads. Can a problem span two repositories with different maintainers, without either one moving?
2. **An uncurated contrast.** Whether sunxi-tools has a curated symptom page like `pf1007l-start-here.md` has not been checked. If it does not, it tests the Commons where the index is not a second reading.
3. **Reader testing before building.** Put this pilot's interface in front of three real photo-frame owners first. Use what they actually look for to write an independent query set, and run the benchmark this pilot could not.

**Not recommended next:** a Markdown-native repository like `blackmath88/hack-am-rhein`. It would exercise br-ai-nstorm's adoption path, which already works, rather than the community material that does not fit it.
