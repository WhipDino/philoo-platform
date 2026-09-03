# Philoo Lesson Library

Public imports come from `@/domains/lesson-library`.

Before using or changing an engine, read:

1. `docs/START_HERE.md`
2. `docs/product/PHILOO_EXERCISE_CATALOG_V1.md`
3. `docs/reference/LESSON_LIBRARY_API.md`
4. the engine's contract, tests, and protected CSS.

Foundation engines are configured, not reconstructed. Lesson content belongs in
lesson-owned configuration. Responsive behavior, accessibility, checking,
revision, and state safety belong in the engine.

Current public imports (`@/domains/lesson-library`):

- EX-05 `GuidedClassificationExercise` (foundation) — CSS in this folder
- EX-06 `PredictionConsequence` — CSS in `activities/prediction-consequence/`
- EX-09 `PhilooPairConnect` — CSS in `activities/pair-connect/`
- EX-03 `PhilooCausalPath` — CSS in `activities/causal-path/`
- EX-11 `PhilooDecisionLayers` — CSS in `activities/decision-layers/`
- EX-10 `PhilooDualLens` — CSS in `activities/dual-lens/`

`src/domains/lessons/interactions/` keeps compatibility shims only. Do not
put new engine CSS there.

