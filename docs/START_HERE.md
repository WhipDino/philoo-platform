# Philoo Documentation — Start Here

This is the single entry point for a new contributor or an AI with zero chat
context. Do not try to read the entire repository. Identify the task below,
then follow only that route plus the mandatory project state.

## Mandatory context for every task

Read in this order:

1. `AGENTS.md` — non-negotiable repository rules.
2. `docs/project/PROJECT_STATE.md` — current product and technical reality.
3. this file — task routing.
4. the task-specific documents below.
5. `docs/project/DESKTOP_HANDOFF.md` — only when continuing unfinished work or
   changing machines/sessions.

## Route by task

### Create a new lesson or chapter

Read:

1. `docs/playbooks/CREATE_A_LESSON.md`
2. `docs/reference/STORY_THREAD.md`
3. `docs/reference/PHILOSOPHER_LESSON.md` (aula de filósofo, não a Caverna)
4. `docs/reference/EXERCISE_SELECTION.md`
5. `docs/reference/SCALABLE_CONTENT_SYSTEM.md`
6. `docs/reference/FOLIO_CHAPTER_PATTERNS.md`
7. `docs/reference/FOLIO_LAYOUT_CONTRACT.md`
8. `docs/product/CURRICULUM_MAP.md`
9. `docs/reference/STUDENT_LIBRARY.md`
10. `docs/product/philoo-scene-template-catalog-v1.md`
11. `docs/product/PHILOO_EXERCISE_CATALOG_V1.md`
12. `docs/reference/LESSON_LIBRARY_API.md`
13. `docs/reference/CHARACTERS_AND_ASSETS.md`
14. `docs/reference/QUALITY_GATES.md`

Outcome: a lesson brief, scene plan, selected activity engines, typed content,
responsive assets, tests, and a verified route.

Agent order: `.cursor/rules/lesson-pipeline.mdc`. **Conferência de conteúdo**
(passo 8) lê o roteiro. **Implementer** cria rotas. **Validador de produto**
(passo 10) só depois do código: Folio, Continuar, testes, responsivo. Sem
aula implementada, não há o que validar na UI.

### Choose the best exercise for a learning goal

Read:

1. `docs/product/philoo-learning-activity-library.md`
2. `docs/reference/EXERCISE_SELECTION.md`
3. `docs/reference/SCALABLE_CONTENT_SYSTEM.md`
4. `docs/product/PHILOO_EXERCISE_CATALOG_V1.md`

Start from the student's required thinking move—not from a widget. Check the
catalog status:

- **foundation**: import and configure;
- **candidate**: import from `@/domains/lesson-library` (typed props; CSS may still live next to the first scene);
- **experiment**: do not copy; extract first or pick another move;
- custom: allowed only when existing patterns cannot express the learning
  move.

### Reuse or change an exercise engine

Read:

1. `docs/reference/LESSON_LIBRARY_API.md`
2. `docs/reference/SCALABLE_CONTENT_SYSTEM.md`
3. the engine's colocated README and types;
4. its tests;
5. `docs/reference/QUALITY_GATES.md`.

For published engines, import from `@/domains/lesson-library`. Never import an image path or
copy protected CSS into a lesson.

### Change a button, card, layout, shell, typography, or color

Read:

1. `docs/reference/DESIGN_AND_COMPONENT_RULES.md`
2. the relevant component and CSS Module;
3. `docs/reference/QUALITY_GATES.md`.

Determine whether the property is configurable content, a protected library
behavior, or a global visual token before editing it.

After the change, follow `.cursor/rules/responsive-check.md` (Playwright
MCP or `npm run check:responsive`).

### Create or replace a philosopher/scene image

Read:

1. `docs/reference/CHARACTERS_AND_ASSETS.md`
2. `src/domains/character-library/index.ts`
3. `docs/reference/STORY_THREAD.md`
4. `docs/product/plato-character-generation-standard.md`
5. the semantic pose/preset registry used by the target component.

Never guess pose, gaze, crop, safe area, or responsive `sizes`.

### Change curriculum order or lesson scope

Read:

1. `docs/product/CURRICULUM_MAP.md`
2. `docs/architecture/PHILOO_LESSON_SYSTEM_MAP_V1.md`
3. the lesson creation playbook.

### Change progress, publishing, authentication, database, storage, or runtime

Read:

1. `docs/architecture/PHILOO_LESSON_SYSTEM_MAP_V1.md`
2. `docs/project/PROJECT_STATE.md`
3. the relevant implementation plan.

Stop and align on architecture before executing. These decisions affect
versioning, privacy, cost, and future migration.

### Review, test, or hand off work

Read:

1. `docs/reference/QUALITY_GATES.md`
2. `CONTRIBUTING.md`
3. `docs/project/DESKTOP_HANDOFF.md`.

## Source map

| Concern | Source of truth |
| --- | --- |
| Current reality | `docs/project/PROJECT_STATE.md` |
| Unfinished work | `docs/project/DESKTOP_HANDOFF.md` |
| Curriculum | `docs/product/CURRICULUM_MAP.md` |
| Folio / chapter UX | `docs/reference/FOLIO_CHAPTER_PATTERNS.md` |
| Story thread | `docs/reference/STORY_THREAD.md` |
| Folio layout contract | `docs/reference/FOLIO_LAYOUT_CONTRACT.md` |
| Scene templates | `docs/product/philoo-scene-template-catalog-v1.md` |
| Learning principles | `docs/product/philoo-learning-activity-library.md` |
| Exercise inventory/status | `docs/product/PHILOO_EXERCISE_CATALOG_V1.md` |
| Public exercise code API | `src/domains/lesson-library/index.ts` |
| Exercise picker | `src/domains/lesson-library/select-exercises.ts` |
| Character poses/assets | `src/domains/character-library/` and `src/domains/lessons/plato-pose-catalog.ts` |
| Student library catalog | `src/domains/curriculum-catalog/library-catalog.ts` |
| EX-05 contract | `src/domains/lesson-library/activities/guided-classification/` |
| Technical website | `src/app/tecnico/` |
| Contributor process | `CONTRIBUTING.md` |

## Rules for context-free AI

1. Treat repository files—not remembered chat—as truth.
2. State which task route you selected before changing code.
3. Inspect a foundation engine's public type before writing configuration.
4. Do not invent a new engine until the catalog proves no existing cognitive
   pattern fits.
5. Do not hardcode asset paths, character poses, colors, or viewport sizes when
   a semantic registry or protected component already owns them.
   Import engines from `@/domains/lesson-library`; do not copy interaction JSX.
6. Keep lesson content outside generic renderers.
7. Update tests, documentation, project state, and handoff with meaningful
   changes.

## Why this stays in one repository

The documentation, library, lessons, tests, and assets currently evolve as one
product. Keeping them together gives every commit one coherent history and
prevents a separate documentation repository from drifting. A separate package
or repository should be considered only when multiple independent products
consume a versioned Philoo library.
