# Philoo Student Portal — First Visual Foundation

**Status:** Implemented for product review
**Route:** `/inicio`
**Scope:** Front-end preview only

## Purpose

The portal is the student's learning home after login. It should answer four
questions without making the student search:

1. Where did I stop?
2. What can I learn next?
3. What philosophical question do I want to explore next?
4. Did my teacher leave anything important?

It is a learning platform, not a school-management dashboard or announcement
board. It borrows the lesson's physical notebook, tactile depth,
blue/white/cream palette, and Plato character continuity while keeping
navigation stable and predictable.

## Information architecture

- **Início:** dominant active-lesson workspace, journey progress, one teacher
  activity, and philosophical questions to explore.
- **Explorar:** a library organized around human questions rather than school
  logistics.
- **Meu caminho:** current and upcoming Cave chapters.
- **Avisos:** chronological teacher/school messages with local read state.
- **Perfil:** preview identity plus reading and motion preferences.

On wide screens, primary navigation sits in a persistent platform header.
Below the compact breakpoint, it becomes a bottom bar with large touch targets.

## Visual rules

- Philoo blue and warm paper are the dominant colors.
- The platform has no icon logo in this shell: the `Philoo` name is the
  wordmark and uses Nunito.
- Cards and actions use visible physical depth and pressed states.
- The active lesson must read as an actionable learning workspace, never as an
  advertisement.
- Plato appears inside the active learning stage, where he contributes meaning
  to the student's next action.
- Existing Cave and Plato artwork is reused; new artwork requires a separate
  reference-guided asset pass.
- Motion is restrained, respects `prefers-reduced-motion`, and can also be
  quieted in the profile preview.
- Content and navigation remain usable without horizontal scrolling.

## Current data boundary

All student, class, lesson, schedule, and announcement values are preview
content in `src/domains/student-portal/student-portal-content.ts`. This pass
does not introduce authentication, Supabase queries, schema changes, or
role-based access. Those decisions require a separate architecture discussion
before implementation.

## Acceptance checks

- Desktop, tablet, and phone layouts have no horizontal overflow.
- Primary navigation exposes the expected view and selected state.
- The current lesson CTA opens the existing `As Sombras` Story Folio.
- Announcement read state and profile preferences respond immediately.
- The production build, full test suite, and ESLint complete successfully.
