# Activity briefing refinement

## Scope

- Removed persistent Plato artwork from the wall-recognition, behind-the-wall reveal, and causal-path activity canvases.
- Added the existing `PhilooActivityBriefing` to the wall-recognition and behind-the-wall activities; the causal-path briefing was retained.
- Added permanent, accessible question-mark help controls to reopen instructions.
- Reclaimed the former guide columns for the activity, progress copy, and feedback.
- Left the evidence-sort drag-and-drop activity unchanged, as requested.

## TDD evidence

RED:

- Focused suite failed 7 expected assertions before implementation: missing initial briefings/help controls and persistent Plato remaining after dismissal.

GREEN:

- `npm test -- src/domains/lessons/as-sombras/cave-shadow-game-scene.test.tsx src/domains/lessons/as-sombras/cave-behind-wall-scene.test.tsx src/domains/lessons/as-sombras/cave-shadow-path-scene.test.tsx`
- Result: 3 files passed, 8 tests passed.

Lint:

- `npx eslint` over the three owned scenes and tests.
- Result: clean.

## Responsive geometry

Browser-checked after closing each briefing at 1280×720, 768×1024, and 390×844.

- No document-level horizontal or vertical overflow at the three viewports.
- Permanent help controls remained present.
- No Plato pose remained inside any activity canvas.
- Activity containers remained within the available viewport/story surface.

## Notes

- The briefings still use canonical Plato art, so the philosopher continues to introduce each activity without competing with the exercise itself.
- Activity state remains mounted while help is reopened; completed rounds, revealed layers, and causal-path placements are preserved.
