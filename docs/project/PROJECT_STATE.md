# Philoo Platform — Current Project State

**Updated:** 2026-07-30  
**Repository:** `WhipDino/philoo-platform`  
**Current development branch:** `codex/story-folio`  
**Baseline before this handoff:** `d390bff`

## Product

Philoo is a web-first educational platform designed to help adolescents become
more thoughtful citizens. The learning experience should help students ask
better questions; distinguish observation, belief, evidence, representation,
and source; understand other perspectives; revise judgments; and communicate
disagreement responsibly.

The initial audience is centered on ages 13–16 and the initial language is
Brazilian Portuguese. Philoo must not use punitive lives, lost progress,
mandatory streaks, or public student rankings. Feedback should explain what a
learner's reasoning accounts for, what remains unresolved, and what they can try
next. Private reflection remains private unless an activity explicitly and
transparently marks a response as teacher-visible.

## Intended platform

The approved foundation is a responsive Next.js and TypeScript modular
monolith, with Supabase planned for authentication, Postgres, Row Level
Security, and storage; Vercel planned for previews and production; and GitHub
used for source control and review.

The long-term product includes public, student, teacher, school administrator,
and internal Studio spaces. The current repository is still the first playable
front-end foundation. Production authentication, organizations, teacher
dashboards, Studio publishing, immutable content snapshots, and server-backed
progress are not implemented yet.

## Current technology

- Next.js 16.2.12 with App Router
- React 19.2.4
- TypeScript 5
- Motion
- CSS Modules
- Vitest and Testing Library
- ESLint

Next.js rules in `AGENTS.md` are mandatory. Read the relevant documentation in
`node_modules/next/dist/docs/` before changing Next.js behavior.

## Current experience

The student entry route, `/inicio`, is now a learning-first front-end platform
preview rather than a lesson placeholder or school-management dashboard. It
establishes the product space students will see after authentication:

- a persistent platform header and responsive bottom navigation;
- a dominant active-lesson workspace with exact resume point, progress, and a
  single `Continuar aula` action;
- a purpose-built unified Cave scene in which Plato is physically grounded,
  receives the environment's light, and gestures toward the active lesson;
- a curriculum hierarchy of era → journey → chapter, beginning with
  `Filosofia Antiga`;
- the three-chapter Cave journey (`As Sombras`, `A Subida`, and `O Retorno`),
  followed by short journeys through the Presocratics, Sophists, Socrates,
  Plato, and Aristotle;
- a streaming-inspired visual path: chapters behave like episode cards with
  artwork, progress, play/lock state, and horizontally browsable shelves;
- a reference-guided Plato journey hero, stored at
  `public/images/portal/plato-learning-journey-hero-v1.png`;
- a rounded typography system: Fredoka for expressive headings, Nunito for
  reading/UI/wordmark, and IBM Plex Mono only for evidence-style microcopy;
- a practical 60-30-10 color hierarchy: warm white/cream is the dominant
  canvas, pale blue is reserved for supporting surfaces, and saturated Philoo
  blue marks actions, progress, and active states;
- the same color hierarchy continues into the lesson shell and its top bar, so
  moving from the portal into a chapter does not return to a baby-blue canvas;
- an exploration library organized around philosophical questions;
- quiet teacher activities plus an animated notification preview from the
  bell, with a secondary route to the complete announcement history;
- a student profile/preferences view;
- direct entry from `As Sombras` into the existing Story Folio lesson.

The portal currently uses preview data in
`src/domains/student-portal/student-portal-content.ts`. Authentication,
role-aware routing, and server-backed assignments/announcements remain future
work. The active lesson uses the single integrated scene
`public/images/portal/plato-cave-active-lesson-v1.png`, replacing the former
separate cave background and transparent Plato overlay. This hero is served as
its original PNG rather than a recompressed derivative. On desktop, the red
notebook margin aligns with the scene/paper boundary; on stacked mobile layouts
it returns to the normal inset. Other lesson and journey covers reuse existing
artwork. A second reference-guided Plato hero illustrates the curriculum path.
The Philoo wordmark is text-only and uses Nunito; no platform icon is shown.
Bricolage Grotesque and Public Sans are no longer loaded.

The first vertical slice is Session 1 of Plato's Allegory of the Cave:
**As Sombras**. It combines a reusable lesson foundation with a highly authored
"living story" used to discover Philoo's canonical lesson grammar.

The current route-based journey is:

1. O começo da história — `/aula/as-sombras/primeira-tela`
2. A descida — `/aula/as-sombras/a-descida`
3. Quem vive aqui — `/aula/as-sombras/so-a-parede`
4. O jogo da parede — `/aula/as-sombras/eles-dao-nomes` and
   `/aula/as-sombras/jogo-da-parede`
5. O que existe atrás — `/aula/as-sombras/o-que-existe-atras`
6. O caminho da sombra — `/aula/as-sombras/caminho-da-sombra`
7. Uma palavra da filosofia — `/aula/as-sombras/doxa`
8. O que chegou até eles — `/aula/as-sombras/o-que-chegou-ate-eles`
9. A primeira dúvida — `/aula/as-sombras/a-primeira-duvida`

The current ending is the first prisoner noticing an inconsistency and turning
to look behind him.

## Learning progression

The session teaches students to distinguish what appeared from what was
inferred, see how repeated predictions can stabilize a belief, discover the
source-to-shadow causal path, understand `doxa` as an accepted belief shaped by
appearances, classify what the prisoners saw/believed/could not know, and
recognize doubt as the beginning of inquiry.

The classification activity uses:

- **Eles viram** — something appeared directly before them.
- **Eles acreditaram** — an interpretation seemed true to them.
- **Eles não sabiam** — the available evidence could not answer it.

The worked example uses footprints before asking students to classify claims
about the Cave.

## Experience system

The current visual grammar includes:

- `PhilooStoryShell`
- `PhilooFolioStage`
- Story Folio composition
- lesson journey rail
- narrative compositions
- character and media stages
- dialogue cards
- activity briefings
- discovery tables
- causal-path interactions
- responsive scene-specific composition

Plato is both the guide and a character inside the story. Use the semantic pose
catalog rather than choosing an image path directly. Preserve character
continuity, gaze direction, grounding, and the distinction between transparent
character art and environmental artwork.

## Lesson foundation

The repository also contains a general lesson manifest/runtime with versioned
identity, arcs, scenes, named transitions, save points, attempt snapshots,
scene state, local restoration, and response visibility classes:

- `private_reflection`
- `teacher_visible_task`
- `derived_rubric`
- `system_telemetry`

Do not discard this foundation while refining the route-based living story. A
future architecture decision must reconcile the general runtime with the
authored route experience.

## Branches

- `codex/first-playable-foundation` is a historical milestone and should not
  receive new work.
- `main` is the stable integration baseline but is behind the current lesson.
- `codex/story-folio` is the current source of truth and the base for new work.

For concurrent work, create a focused branch from `codex/story-folio` rather
than allowing two machines to push unrelated changes to the same branch.

## Validation baseline

At handoff:

- 45 test files pass.
- 268 tests pass.
- ESLint has zero errors.
- ESLint has three minor unused-variable warnings in test files.
- The production build passes.
- `/inicio` has been visually verified at desktop, tablet, and phone widths
  with no horizontal overflow. The unified Plato Cave scene, notification
  preview, and curriculum path were rechecked at desktop and phone widths.

The Story Folio viewport script is `scripts/check-story-folio-viewport.mjs`.
Visual/browser verification remains necessary even when unit tests pass.

## Important gaps

- Replace the generated Next.js README.
- Resolve the three lint warnings.
- Run full desktop, tablet, and phone browser verification.
- Check reduced motion, keyboard navigation, focus flow, and screen-reader
  labels.
- Reconcile route-based scenes with the general lesson runtime.
- Connect the student portal to authentication, role-aware routing, and
  server-backed progress only after the portal and first lesson are accepted.
- Replace portal preview announcements, class details, and lesson assignments
  with real data in that same integration phase.
- Review and merge `codex/story-folio` into `main` after acceptance.
