# Motte — the Archive Moth

**Status:** selected character concept; visual reference generated 2026-10-28; implementation proposed, not yet built.

## The encounter

A harmless descendant of desktop pets, animated desktop sprites, and the strange little companions that used to wander across the computer screen. Not a chatbot, onboarding wizard, surveillance agent, or sticky help button.

**Motte** is a tiny pixel-art archive moth. It roams the margins of the Postack Underflow editorial site and occasionally plants a rose-coloured flag labelled **WHAT HISTORY TELLS US**. Its historical interventions provide a third narrative thread: the essay investigates the present, the Index and Switchboard explore possible futures, and Motte reminds the visitor that earlier systems had already confronted related problems.

Motte can disagree with the essay. Its notes are short, curated, sourced and occasionally counterintuitive. The creature's behaviour is mischievous; the factual claims must remain precise.

## Visual reference

**Owner-approved direction:** a moth in the pixel-art style shown in the conversation, recoloured for Postack's palette. The reference is a generated **wide dark pixel-art concept sheet**, depicting idle, walk, flight, landing, flagging, sleep, inspection, carrying a find, planting a flag and perching on UI. This generated PNG was produced in the project conversation on 2026-10-28. **The PNG binary is not yet in this repository; do not pretend this text document embeds it.** Source file for handoff: `wide_dark_minimalist_pixel_art_concept_sheet_u.png` (downloadable from the conversation attachment). When available, commit it as `public/characters/motte/concept-sheet.png` in a follow-up PR; record provenance and licensing before shipping. This plan can proceed independently of binary transfer.

Related visual systems: [Weavr pixel/sprite assets](https://github.com/blackmath88/weavr/tree/main/cloud/public/ori) and [soul.me](https://github.com/blackmath88/soul.me), as reference points for the user's preferred compact symbolic pixel aesthetic. Do not copy unrelated Weavr icons as Motte assets.

## Palette and pixel grammar

Use Postack's established editorial colours:
- Paper `#F5F3EC` — light wing highlights / tooltip ground
- Ink `#252A30` — outlines and legibility
- Archive blue `#4A6288` — secondary shadows and structural accents
- Signal violet `#A36BFF` — wing details / personality
- Signal rose `#EE4F7E` — the flag and exceptional history signals

The generated concept also includes warmer moth-specific peach/plum tones; these may remain as limited creature colours, not become a new global page palette. Favor a **limited intentional sprite palette**, consistent pixel scale, no antialiasing or blurry resampling. Avoid generic AI eyes, glossy gradients, mascot branding, or pixel-perfect copying of third-party sprite art.

## Character and animation

Small enough to live in the page margins: approximately 24–40 CSS px at default scale, with optional 2× accessible scaling. Sprite states: `idle`, `walk`, `flutter`, `land`, `inspect`, `carry`, `plant-flag`, `sleep`, `dismissed`. Begin with fewer states if needed; each state must communicate a meaningful action. Pixel art is an aesthetic, not a reason to make controls hard to use.

Motion should be bounded, infrequent and deterministic enough to test. Do not cross interactive controls, obscure body text, trap focus or chase the pointer. Prefer precomputed safe anchors in page margins or section edges rather than unconstrained physics. No random movement that impedes reading. Mobile uses a stationary, clickable history marker; reduced-motion preference uses static markers with all content still available.

## Editorial behaviour

Each history flag is a curated source-linked object, not generated on the fly:

```ts
type HistoryFlag = {
  id: string;
  chapter: "opening" | "indexing" | "community" | "convergence";
  heading: string;
  observation: string;
  sourceUrl: string;
  sourceLabel: string;
  evidenceStatus: "verified" | "needs-review";
  counterpoint?: string;
};
```

Only `verified` flags may be shown as factual historical notes in the public experience. `needs-review` entries remain research drafts. Do not fabricate quotes or use an LLM to generate live history facts.

Example themes to research and verify before publication:
- Card catalogues: controlled headings and prior descriptive labour; contested classifications.
- Switchboards: requests, connection, operator attention, release and the difference between routing and owning speech.
- Stack Overflow: questions, votes, accepted answers, duplicate handling and limits of popularity.
- Early web/desktop companions: a self-referential history of small animated interface creatures.

## Experience

Motte enters quietly after the reader has started. At specific editorial anchors it may pause, plant a flag, and reveal a small, dismissible note with a direct source link. Readers may summon the history notes from a persistent but unobtrusive menu even when Motte is disabled.

No user tracking, microphone, external API, background automation, or agent behavior. The creature does not claim to be alive or intelligent.

### Accessibility and performance
- Fully usable without canvas; semantic DOM source notes and buttons are canonical.
- Canvas or sprite layer is decorative with `pointer-events: none`; interactive controls live outside it.
- Keyboard and screen-reader equivalent for history notes.
- Clear pause/dismiss controls and persistence only if user explicitly opts in.
- `prefers-reduced-motion` disables roaming.
- Test at 390/768/1440 px and zoomed text.
- Lazy-load sprite assets; never block content or delay first meaningful paint.
- Respect dark/light contrast and source-link visibility.

## Why Motte belongs

Motte makes the project's thesis tangible: knowledge has a history, and every new interface inherits ideas from previous systems. The character is not a gimmick to hide weak content; it should surface surprising, sourced counterexamples and remind readers that technical progress often means revisiting forgotten patterns.

## Boundaries

No change to frozen Four Words evaluation. No live AI, chat UI, publication action, or Weavr mission. This is an editorial companion and a visual design experiment. Implement on a reviewed feature branch after the sprite sheet is properly added.
