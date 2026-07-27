# Task 8 Report — Complete “As Sombras” Reasoning Arc

## Status

Implemented and verified the three closing scenes on
`codex/first-playable-foundation`:

- a configurable claim–evidence–reasoning response to the Guardiã do
  Padrão’s strongest argument;
- an explicit before/after revision map that treats maintaining,
  revising, and precise uncertainty as equally legitimate strategies;
- a transfer task that separates a cropped representation, its source
  event, a caption claim, and the sufficiency of the available evidence;
- evidence-based completion that requires engagement with every reasoning
  move without requiring correct forecasts or classifications.

The final completion line is:

```text
Você ainda não saiu da caverna. Mas a parede já não explica tudo.
```

## RED evidence

The four Task 8 suites were added before the production modules existed.

Command:

```text
npm test -- --run src/domains/lessons/interactions/cer-response.test.tsx src/domains/lessons/interactions/revision-map.test.tsx src/domains/lessons/interactions/transfer-classification.test.tsx src/domains/lessons/as-sombras/closing-scenes.test.tsx
```

Observed result:

```text
Test Files  4 failed (4)
Failed to resolve the four new production imports
```

This was the expected missing-implementation failure.

## GREEN evidence

### Focused

Final result:

```text
Test Files  4 passed (4)
Tests       22 passed (22)
```

Coverage includes:

- configurable CER choices, live sentence assembly, ordering controls,
  uncertainty evidence, async rejection, and double-submit protection;
- targeted incoherence feedback and reviewed/coherent completion gates;
- exact initial-hypothesis preservation, three equal revision strategies,
  decisive evidence, private-note separation, and resume sanitization;
- confidence before context reveal and no wider-context DOM before reveal;
- representation/source/claim/sufficiency classification plus next-source
  selection;
- exact Guardiã and Platão copy, canonical portrait, and scene order;
- completion after fully recorded but imperfect answers;
- rejection of tampered resume data that lacks required evidence.

### Full suite

Command:

```text
npm test
```

Result:

```text
Test Files  20 passed (20)
Tests       131 passed (131)
```

### Lint

Command:

```text
npm run lint
```

Result: exit `0`, no errors or warnings.

### Production build

Command:

```text
npm run build
```

Result:

```text
Compiled successfully
Finished TypeScript
Generating static pages (6/6)
/aula/as-sombras prerendered successfully
```

## Browser verification

Completed the real lesson end to end through the UI, including all three
closing scenes. Verified:

- desktop `1440 × 1000`, tablet `820 × 1180`, and phone `375 × 812`;
- no horizontal overflow at any checked closing-scene viewport;
- visible closing controls at least `44–46px` high;
- keyboard Tab reaches the skip link;
- the CER collapses to one column at the tablet breakpoint;
- the revision and transfer flows remain legible at the phone breakpoint;
- dissent is absent from the cropped DOM, then Bento, Maya, `DISCORDO`,
  the objection, and Platão’s question appear after reveal;
- the exact completion line appears after the recorded reasoning arc;
- no captured browser warnings/errors and no framework error overlay.

No visual or behavioral defect remained after the final split.

## Files

Closing scenes:

- `src/domains/lessons/as-sombras/defend-model-scene.tsx`
- `src/domains/lessons/as-sombras/revision-scene.tsx`
- `src/domains/lessons/as-sombras/transfer-scene.tsx`
- `src/domains/lessons/as-sombras/closing-scenes.test.tsx`
- `src/domains/lessons/as-sombras/as-sombras-player.tsx`

Reusable interactions:

- `src/domains/lessons/interactions/cer-response.tsx`
- `src/domains/lessons/interactions/cer-response-state.ts`
- `src/domains/lessons/interactions/confidence-control.tsx`
- `src/domains/lessons/interactions/revision-map.tsx`
- `src/domains/lessons/interactions/transfer-classification.tsx`
- colocated tests for each interaction

Styles:

- `src/domains/lessons/as-sombras/closing-scenes.module.css`
- `src/domains/lessons/as-sombras/defend-model-scene.module.css`
- `src/domains/lessons/as-sombras/revision-scene.module.css`
- `src/domains/lessons/as-sombras/transfer-scene.module.css`

Controlled deviation: the initial GREEN version placed about 1,125 lines
in one closing stylesheet and 653 lines in the CER component. With
controller authorization, stable scene-specific rules were separated from
the 429-line shared closing shell, and CER state/sanitization/assembly was
separated from its 440-line UI. Public APIs and test selectors were
preserved. The existing shared `as-sombras.module.css` remained unchanged.

No graph, runtime, shell, manifest, global CSS, asset, backend, or remote
file was changed.

## Self-review

### Reasoning and completion

- Every completion prerequisite is reconstructed from sanitized response
  evidence, not merely from current scene state.
- Incorrect forecasts and transfer classifications may complete once all
  required reasoning moves are recorded.
- CER completion requires a persisted review and a coherent explicit
  clue-to-claim bridge.
- Revision completion requires a strategy and decisive clue; the optional
  prose remains a private reflection.
- Transfer completion requires pre-reveal confidence, context reveal, all
  classifications, and a next source.

### Accessibility and visual behavior

- All controls have accessible names, native fieldset/legend grouping, and
  visible focus styling.
- Touch targets meet the 44px minimum in CSS and in browser measurements.
- Sound evidence is transcribed; the council visual has a semantic text
  equivalent.
- Reduced-motion CSS removes nonessential motion while preserving state.
- Cave navy, sky, copper, paper, and the context-frame composition continue
  the established visual language without global changes.

### File scope

- Player changes are limited to closing-scene state, persistence events,
  completion evidence, and scene integration.
- The maintainability split is colocated and scene-specific; it introduces
  no cross-domain abstraction.
- `git diff --check` is clean.

## Concerns

No Task 8 product blocker remains.

Existing tooling warnings remain outside Task 8 scope:

- Vitest reports that Vite can replace `vite-tsconfig-paths` with native
  `resolve.tsconfigPaths`.
- Next.js reports multiple lockfiles and an inferred workspace root.

Neither warning affects tests, lint, build, or browser verification.
