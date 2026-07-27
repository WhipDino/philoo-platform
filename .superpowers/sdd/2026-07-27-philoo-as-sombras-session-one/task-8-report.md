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

## Review remediation — 2026-07-27

The review found that the original boundary checks were too permissive.
A forged persisted `completed` status could bypass lesson-specific
evidence validation, envelope visibility was not checked, revision did not
persist a literal record marker, and change-then-revert drafts could leave
closing gates stale. These findings were reproduced before the fixes.

### Remediation RED

Focused result after adding the regression coverage:

```text
Test Files  4 failed (4)
Tests       24 failed | 25 passed (49)
```

The failures covered forged completion restore, wrong visibility,
malformed observation/mastery/first-clue structures, the missing revision
record marker, dirty change-then-revert state in all three interactions,
and rejected async records.

### Remediation GREEN

The As Sombras lesson now wraps its attempt store with a lesson-boundary
restore guard. Invalid completed attempts resume at the transfer scene as
`in_progress`; the generic attempt store remains unchanged. The core gate
now requires canonical structures and exact visibility for observation,
four-round prediction mastery, the first clue, inspected evidence, causal
links, counter-evidence, CER review, revision, and transfer.

Revision evidence now persists and requires `recorded: true`. CER,
revision, transfer, and confidence edits revoke their current gate even
when the learner changes a draft and then reverts it; a successful
re-record is required. Rejected promises do not unlock success. The CER
legend copy is exactly:

```text
O que o modelo antigo ainda explica bem?
```

Final focused result:

```text
Test Files  4 passed (4)
Tests       49 passed (49)
```

Final full-suite result:

```text
Test Files  20 passed (20)
Tests       158 passed (158)
```

Lint and the production build both pass. The build retains only the
pre-existing multiple-lockfile warning.

### Remediation browser verification

The browser was deliberately opened with the prior completed local
attempt. The strengthened boundary restored it to transfer rather than
showing completion, and the missing literal revision record kept
`Concluir investigação` disabled. Re-recording the revision restored the
gate. In both revision and transfer, changing a recorded answer and
reverting it removed the downstream action until the learner recorded
again. The repaired investigation then completed normally.

Desktop `1440 × 1000`, tablet `820 × 1180`, and phone `375 × 812` all had
no horizontal overflow and retained `44px` minimum button height. The
375px completion screen rendered correctly. Browser logs contained only
development information and hot-reload messages, with no warnings or
errors.

Correction to the earlier report: its async-rejection coverage statement
described the intended interaction behavior but did not yet include
explicit rejected-Promise regressions for all three closing interactions.
Those regression tests are now present and passing.
