# ADR-0005: Three levels of attention, and margin notes

**Status:** Proposed, 2026-10-28. Branch `feat/irresistible-story`.

## Context
The living essay was accurate but heavy. Before it reached the first interaction, a visitor had to read benchmark tables, protocol inventories and historical qualifications. Those belong to the argument, but not to its default path. We wanted the surface lighter without making the research shallower, and without deleting anything that a skeptical reader would need.

## Decision
1. **Three levels.**
   - The *story* is what every visitor sees: short beats, one example per idea, and the four experiments.
   - The *margin* holds notes that a phrase opens in place.
   - The *archive* (`/archive/` and three sub-pages) holds full results, method, protocol research, history and the knowledge record. `/notes/` stays as the source list.
2. **One note registry.** `src/content/margin.tsx` defines every note once, with:
   - a question as its title;
   - a kind: history, source, mechanism, counterpoint, research or connection;
   - an evidence status: checked, reported, our reading, measured or fixture;
   - its sources, and an optional link into the archive;
   - a plain `summary`.

   Pages reference a note with `<Ref id>`. The archive index lists every note. A later companion such as Motte can read `summary` and `evidence` instead of restating history. The two fields map onto Motte's `HistoryFlag.evidenceStatus`, where only *checked* would count as verified.
3. **Interaction built on links and `:target`.**
   - **Without JavaScript:** the marker is `<a href="#note-id">`, the note shows through `:target`, and a "Close note" link returns to the phrase.
   - **Once hydrated:** the marker becomes a disclosure button (`aria-expanded`, `aria-controls`). One note is open at a time; Escape or Close returns focus to the phrase. Opening a note never moves the page.
   - **Placement:** on screens of 76rem and wider, a note in the reading column sits in the right margin, level with its phrase. It moves up to clear a wide figure, and opens inline if it cannot. Narrower screens show it inline, under the phrase.
   - **Deep links:** `#note-id` links open and scroll to the note.
   - **Dependencies:** none were added.
4. **The address bar is left alone when a note opens.** TanStack Router treats history changes as navigation and scrolls to the hash, which broke "the reading position never moves". Each note carries its own "Link to this note" instead.

## Alternatives considered
- **Accordions** (`<details>`) in the flow: native, but generic. They cannot sit in the margin and push the text down.
- **The Popover API:** gives top-layer, light-dismiss behaviour, and one popover at a time. But it cannot anchor beside a phrase without CSS anchor positioning, which is not yet broadly supported, and it has no deep links.
- **A bottom sheet on mobile:** avoids splitting a sentence. But it covers the text being read and needs scroll correction. We chose inline notes, and an editorial rule that a noted phrase ends a clause.
- **Endnotes per section:** robust, but readers lose their place, which the brief rules out.

## Consequences
- Notes must contain phrasing content only, because they render inside a paragraph. `<P>` gives paragraph breaks.
- Note numbers come from a CSS counter. Screen readers get the phrase plus "margin note: <title>" rather than the number.
- The `/afterword/` route keeps its URL but no longer holds the history and record. Those moved to `/archive/history/`, which the afterword links to.
- Reproducibility and frozen data are unchanged. Only where they are presented moved.
