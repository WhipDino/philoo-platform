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

- EX-05 `GuidedClassificationExercise` (foundation)
- EX-06 `PredictionConsequence` (candidate)
- EX-09 `PhilooPairConnect` (candidate)
- EX-03 `PhilooCausalPath` (candidate)
- EX-11 `PhilooDecisionLayers` (candidate)
- EX-10 `PhilooDualLens` (experiment export; needs paired art)

Do not copy these into a lesson. Configure them. Picker:
`selectExercisesForChapter`. Catalog fields `thinkingMove` and `publicExport`
say when a template exists. Experiments without `publicExport` are not
callable yet.

