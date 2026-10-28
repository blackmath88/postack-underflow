# Motte — isolated module integration contract

**Status:** implemented as isolated source module on a feature branch, not integrated or deployed.

## Integration
```tsx
import { Motte } from '../features/motte'

// In a client-rendered React subtree, ideally outside the main article:
<Motte chapter="indexing" flags={verifiedHistoryFlags} />
```

The module lives entirely under `src/features/motte/`. It does not modify `__root.tsx`, any route, site-wide styles, data or dependency declarations. Claude can continue working on the editorial shell independently.

## Current behaviour
- Original vector pixel moth with `idle`, `walk`, `flutter`, `flag`, `sleep` poses; these are a functional stand-in, **not the approved production sprite sheet**.
- Fixed bottom-edge roaming, pausing and dismissal; no page content inspection, agent logic, pointer chasing or external calls.
- On narrow viewports or reduced motion, the character becomes stationary.
- Historical note display is opt-in; there are **no verified notes shipped yet**. Supply independently verified `HistoryFlag[]` to show factual content.
- No local storage, tracking or persistent state.

## Important limitations
- The approved generated concept-sheet PNG has not yet been committed to the repository. Replace the temporary vector sprite with a transparent pixel sprite atlas after reviewing that asset.
- The roaming behavior is intentionally constrained to the bottom edge, not free-form wandering across article content. A more adventurous safe-anchor system needs layout coordination.
- The module is not yet integrated in a route and has not received a live-browser accessibility review.
- No visual changes to Claude's work are made by this branch.

## Acceptance before integration
Verify the component in a real browser at 390, 768 and 1440 px; check it doesn't cover content or controls at any scroll position, including mobile and zoom. Ensure a reachable history list exists when the character is dismissed. Validate note sources and keyboard/focus, reduced motion and contrast. Build and typecheck the merged integration branch. Do not treat the module as production-ready merely because it compiles.

## Parallel work
Merge or cherry-pick this module after Claude's editorial branch is stable. Avoid simultaneous edits to root routes. The final integration should be a small independent PR or a reviewed merge.
