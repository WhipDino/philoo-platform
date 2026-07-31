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

The proposed reconciliation and long-term contributor foundation are now
mapped in `docs/architecture/PHILOO_LESSON_SYSTEM_MAP_V1.md`. It defines a
code-first, typed lesson system; stable narrative and activity registries; a
semantic asset and character layer; an internal Lesson Lab; a controlled
custom-scene escape hatch; quality gates; versioning; and a phased migration
from the current route-authored lesson. It is a review document, not permission
to begin the runtime or storage migration.

The literal exercise-library inventory is documented separately in
`docs/product/PHILOO_EXERCISE_CATALOG_V1.md`. It maps every accepted route
interaction, separates shared shell behavior from activities, documents the
exact reusable screen contracts, proposes typed parameters and saved state,
locks character pose/direction responsibilities, and records which components
remain Cave- or Plato-coupled.

The first code-backed documentation surface is available locally at
`/tecnico/biblioteca`. Its typed source of truth is
`src/domains/lesson-library/exercise-catalog.ts`. The route documents shared
measurements, required responsive viewports, dependencies, configurable
content, protected behavior, maturity, and links to each accepted source
scene. It is outside student navigation and marked `noindex`; it is not an
authenticated authoring surface yet.

EX-05 guided classification is the first extracted activity engine. The
content-neutral implementation lives under
`src/domains/lesson-library/activities/guided-classification/` and owns the
worked example, classification state, feedback/revision behavior, responsive
composition, and state sanitization. The Cave route now supplies content
through `cave-evidence-sort-config.ts`. A separate Socratic-dialogue
configuration proves that the engine works without Cave language or a required
character and is rendered live at `/tecnico/biblioteca`.

The stable code entry point is `src/domains/lesson-library/index.ts`. Most
lessons should make one semantic call:
`<GuidedClassificationExercise config={activity} />`. The wrapper owns local
state and also accepts `initialState`, `onStateChange`, and `onComplete` for
runtime integration. The lower-level controlled
`GuidedClassificationActivity` remains available from the same import.

Character use is also code-backed:
`getGuidedClassificationGuide("plato")` resolves the approved pose and
responsive image sizes. `GUIDED_CLASSIFICATION_CHARACTER_BRIEF` stores the
generation/crop/direction/proportion contract used to approve future
philosopher assets. Lesson files must not recreate these values or import image
paths directly.

## Contributor documentation system

The repository now has one onboarding path for humans and context-free AI:

- `README.md` is the human-facing repository entry instead of the generated
  Next.js starter README;
- `AGENTS.md` automatically routes coding agents;
- `docs/START_HERE.md` selects the exact reading path by task;
- `CONTRIBUTING.md` defines workflow and definition of done;
- `docs/playbooks/CREATE_A_LESSON.md` covers the complete lesson workflow;
- `docs/reference/` owns the library API, design/component rules,
  characters/assets, quality gates, and documentation maintenance;
- colocated READMEs orient contributors inside `lesson-library/` and
  `lessons/`.

The visual entry point is `/tecnico`. It renders a task router, lesson-creation
flow, content/component/system ownership model, character preset rules, quality
gates, documentation layers, source map, and a checklist for AI with no prior
memory. `/tecnico/biblioteca` remains the live exercise/API catalog and now
links back to the manual.

The documentation is now fully readable on the website rather than being only
an index of repository paths. Seventeen curated sources are rendered at
`/tecnico/guias/[slug]` with a persistent section index, repository source
location, GitHub link, generated table of contents, previous/next navigation,
responsive mobile index, code blocks, tables, and internal links between
guides. `/tecnico/busca` performs server-side full-text search over the actual
Markdown contents. The Markdown files remain canonical; the website does not
maintain a second copy.

The website task map is typed in
`src/domains/technical-docs/technical-docs-registry.ts`. Its test verifies that
every routed repository document/source actually exists, so a file rename
cannot silently strand contributors. Documentation, code, tests, and assets
remain in this repository and commit history; a separate documentation repo is
not justified while they evolve as one product.

The three-chapter Cave journey is also the initial exercise-discovery arc.
`As Sombras`, `A Subida`, and `O Retorno` should prefer distinct patterns for
new assessable interactions. The purpose is to build a broader first library,
not to add decorative variety. After the Cave arc, later journeys should
normally reuse those engines and introduce a new one only when the required
thinking move cannot be expressed by the catalog.

## Branches

- `codex/first-playable-foundation` is a historical milestone and should not
  receive new work.
- `main` is the stable integration baseline but is behind the current lesson.
- `codex/story-folio` is the current source of truth and the base for new work.

For concurrent work, create a focused branch from `codex/story-folio` rather
than allowing two machines to push unrelated changes to the same branch.

## Validation baseline

At handoff:

- 56 test files pass.
- 293 tests pass.
- ESLint has zero errors.
- ESLint has three minor unused-variable warnings in test files.
- The production build passes.
- `/inicio` has been visually verified at desktop, tablet, and phone widths
  with no horizontal overflow. The unified Plato Cave scene, notification
  preview, and curriculum path were rechecked at desktop and phone widths.
- `/tecnico/biblioteca` has been visually verified at `390 × 844`,
  `768 × 1024`, `1024 × 768`, `1366 × 720`, and `1440 × 900`, with no
  horizontal overflow, no browser errors, and no links below the `44px`
  touch-target minimum.
- Its new public-API/code reference was rechecked at `390 × 844` and
  `1440 × 900`: the page has no horizontal overflow, code panels scroll within
  their own boundary on phone, and the minimum interactive height remains
  `44px`.
- The extracted EX-05 engine has been verified in both the migrated Cave route
  and the Socratic technical example at all five viewports, with no page or
  engine overflow and no interactive targets below `44px`.
- `/tecnico` has been verified at all five required viewports. It has no
  page-level horizontal overflow, file paths wrap safely, header/task links
  remain at least `44px` high, navigation to `/tecnico/biblioteca` works, and
  neither route reports browser warnings/errors.
- The full documentation routes generate successfully for all 17 registered
  guides. Tests cover source-path integrity, unique routes, heading anchors,
  Markdown structures, internal guide links, real-content search, metadata,
  and the article shell.

The Story Folio viewport script is `scripts/check-story-folio-viewport.mjs`.
Visual/browser verification remains necessary even when unit tests pass.

## Important gaps

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
