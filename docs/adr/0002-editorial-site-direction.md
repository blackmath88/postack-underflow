# ADR-0002: Editorial narrative, artifact-led design, and static hosting

**Status:** Proposed — visual direction approved in conversation; framework and publishing details not yet validated.

## Context
Postack Underflow should demonstrate a two-part research problem through an editorial experience, with source provenance and two distinct interactions. It is a public GitHub repository and the intended deployment is GitHub Pages.

## Proposed decision
Use a narrative-first site with two rabbit holes: Impossible Index (selected) and a community artifact (selection pending). Apply the Lost & Found Office concept and the Colors-derived palette with blue, violet and rose. Explore TanStack Start V1 as a statically exported site, but require a successful minimal GitHub Pages subpath spike before accepting the stack. Separate live services from the static publication if needed.

## Alternatives
Astro static shell with focused React/JS islands (proven in Lumpesammlig); plain HTML/CSS/JS; full dynamic TanStack deployment on a server host. Compare complexity and maintenance before committing.

## Consequences
Original interactive specimens rather than generic product UI. A static site cannot run a federation index or server-backed comment service itself. Community and search V1 can use clearly labeled fixture-backed experiences; any later live index needs an external service.

## References
- [Art direction](../design/ART-DIRECTION.md)
- [V1 plan](../plans/EDITORIAL-SITE-V1.md)
- [Colors](https://github.com/blackmath88/colors)
- [Lumpesammlig](https://github.com/blackmath88/lumpesammlig)
