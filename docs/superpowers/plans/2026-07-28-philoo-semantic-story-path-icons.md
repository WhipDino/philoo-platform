# Philoo Semantic Story Path Icons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Story Path numbers with compact semantic Phosphor icons and let learners revisit every story beat they have already opened.

**Architecture:** `PhilooStoryPathStage` owns the reusable content-kind vocabulary, icon rendering, step-state visuals, accessibility, and visited-step controls. `CavePrisonerWallScene` owns the current and furthest-opened dialogue beats so selecting a visited chip restores the matching copy and Plato pose through the existing Motion transition.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, Motion, Vitest, Testing Library, `@phosphor-icons/react`

## Global Constraints

- Use `@phosphor-icons/react`; do not draw custom SVG icons.
- Import only the named icons used by the vocabulary; never import the complete Phosphor catalog.
- Keep the Philoo colors `#33BFED`, `#5BB8F5`, `#FBF8F3`, and `#17324A`.
- Keep the current pill compact and prevent the connector from crossing any chip.
- Preserve semantic icons after completion and add a small Phosphor check seal to visited steps.
- Permit navigation only to steps at or below `furthestStep`; returning backward must not reduce `furthestStep`.
- Preserve the existing synchronized copy/Plato Motion transition.
- Change only `/aula/as-sombras/so-a-parede`; do not change lesson copy, Plato assets, the journey rail, or other lesson routes.
- Preserve no-scroll behavior at `1280×720`, `1024×768`, `768×1024`, and `390×844`.

---

### Task 1: Semantic Story Path Primitive

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/domains/lessons/philoo-story-path-stage.tsx`
- Modify: `src/domains/lessons/philoo-story-path-stage.module.css`
- Modify: `src/domains/lessons/philoo-story-primitives.test.tsx`

**Interfaces:**
- Consumes: existing `PhilooStoryPathStage` layout and Motion `layoutId` transition.
- Produces:

```ts
export type PhilooStoryPathKind =
  | "story"
  | "lesson"
  | "definition"
  | "concept"
  | "activity"
  | "reflection"
  | "conversation";

export type PhilooStoryPathStep = {
  id: string;
  label: string;
  kind: PhilooStoryPathKind;
};

export type PhilooStoryPathStageProps = {
  eyebrow: string;
  title: string;
  titleId: string;
  context: string;
  steps: readonly PhilooStoryPathStep[];
  currentStep: number;
  furthestStep: number;
  onStepSelect: (step: number) => void;
  transitionKey: string | number;
  guide: ReactNode;
  speaker: string;
  children: ReactNode;
  action: ReactNode;
};
```

- [ ] **Step 1: Install the tree-shakeable React icon package**

Run:

```bash
npm install @phosphor-icons/react
```

Expected: `package.json` and `package-lock.json` record `@phosphor-icons/react`.

- [ ] **Step 2: Write the failing primitive test**

Update the Story Path fixtures to supply `kind`, `furthestStep`, and
`onStepSelect`, then add:

```tsx
it("uses semantic icons and exposes only visited Story Path beats as controls", () => {
  const onStepSelect = vi.fn();
  const { container } = render(
    <PhilooStoryPathStage
      eyebrow="Cena 3 · A descida"
      title="Mais fundo"
      titleId="semantic-story-path-title"
      context="Siga Platão até a parede"
      steps={[
        { id: "luz", label: "A luz fica para trás", kind: "story" },
        { id: "pessoas", label: "Quem vive aqui", kind: "lesson" },
        { id: "parede", label: "O mundo na parede", kind: "concept" },
      ]}
      currentStep={1}
      furthestStep={1}
      onStepSelect={onStepSelect}
      transitionKey={1}
      guide={<span>Platão</span>}
      speaker="Platão"
      action={<button type="button">Continuar</button>}
    >
      <span>História</span>
    </PhilooStoryPathStage>,
  );

  expect(container.querySelector('[data-story-step-kind="story"] svg'))
    .toBeInTheDocument();
  expect(container.querySelector('[data-story-step-kind="lesson"] svg'))
    .toBeInTheDocument();
  expect(container.querySelector('[data-story-step-kind="concept"] svg'))
    .toBeInTheDocument();
  expect(within(screen.getByRole("list", { name: "Caminho nesta cena" }))
    .queryByText(/^2$/)).not.toBeInTheDocument();
  expect(within(screen.getByRole("list", { name: "Caminho nesta cena" }))
    .queryByText(/^3$/)).not.toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", {
      name: "Voltar para História: A luz fica para trás",
    }),
  );
  expect(onStepSelect).toHaveBeenCalledWith(0);

  expect(
    screen.queryByRole("button", { name: /Explicação: Quem vive aqui/ }),
  ).not.toBeInTheDocument();
  expect(
    container.querySelector(
      '[data-story-step-kind="concept"] [aria-disabled="true"]',
    ),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /Ideia: O mundo na parede/ }),
  ).not.toBeInTheDocument();
});
```

- [ ] **Step 3: Run the focused test to verify it fails**

Run:

```bash
npm test -- src/domains/lessons/philoo-story-primitives.test.tsx
```

Expected: FAIL because semantic kinds, icons, visited controls, and the new
props do not exist.

- [ ] **Step 4: Implement the semantic icon vocabulary and step controls**

Add named imports:

```ts
import {
  BookOpenTextIcon,
  BrainIcon,
  ChalkboardTeacherIcon,
  ChatsCircleIcon,
  CheckIcon,
  LightbulbFilamentIcon,
  PuzzlePieceIcon,
  QuotesIcon,
} from "@phosphor-icons/react";
```

Add the public kind type and internal maps:

```ts
const ICON_BY_KIND = {
  story: BookOpenTextIcon,
  lesson: ChalkboardTeacherIcon,
  definition: QuotesIcon,
  concept: LightbulbFilamentIcon,
  activity: PuzzlePieceIcon,
  reflection: BrainIcon,
  conversation: ChatsCircleIcon,
} as const;

const LABEL_BY_KIND: Record<PhilooStoryPathKind, string> = {
  story: "História",
  lesson: "Explicação",
  definition: "Definição",
  concept: "Ideia",
  activity: "Atividade",
  reflection: "Reflexão",
  conversation: "Conversa",
};
```

For every step, derive:

```ts
const state =
  index === currentStep
    ? "current"
    : index <= furthestStep
      ? "visited"
      : "upcoming";
const StepIcon = ICON_BY_KIND[step.kind];
const kindLabel = LABEL_BY_KIND[step.kind];
```

Build the reusable chip content and choose a control only for visited steps:

```tsx
const chipContent = (
  <>
    {state === "current" ? (
      <m.span
        className={styles.activeStep}
        layoutId={`${titleId}-active-step`}
        transition={{
          layout: {
            type: "spring",
            stiffness: 420,
            damping: 25,
            mass: 0.7,
          },
        }}
        aria-hidden="true"
      />
    ) : null}
    <span className={styles.stepIcon} aria-hidden="true">
      <StepIcon
        size={18}
        weight={state === "current" ? "fill" : "duotone"}
      />
      {state === "visited" ? (
        <span className={styles.visitedSeal}>
          <CheckIcon size={9} weight="bold" />
        </span>
      ) : null}
    </span>
    <span className={styles.stepLabel}>{step.label}</span>
  </>
);

return (
  <li
    key={step.id}
    data-story-step-state={state}
    data-story-step-kind={step.kind}
  >
    {state === "visited" ? (
      <button
        type="button"
        className={styles.stepChip}
        aria-label={`Voltar para ${kindLabel}: ${step.label}`}
        title={kindLabel}
        onClick={() => onStepSelect(index)}
      >
        {chipContent}
      </button>
    ) : (
      <span
        className={styles.stepChip}
        aria-current={state === "current" ? "step" : undefined}
        aria-disabled={state === "upcoming" ? "true" : undefined}
        aria-label={`${kindLabel}: ${step.label}${
          state === "current" ? " (etapa atual)" : " (indisponível)"
        }`}
        title={kindLabel}
      >
        {chipContent}
      </span>
    )}
  </li>
);
```

- [ ] **Step 5: Implement the compact tactile styling**

Change each grid-cell `li` to `width: fit-content` and align the first,
middle, and final cells with:

```css
.path li:first-child {
  justify-self: start;
}

.path li:nth-child(2) {
  justify-self: center;
}

.path li:last-child {
  justify-self: end;
}
```

Move padding and the opaque surface to `.stepChip`, add cream upcoming,
pale-blue visited, and baby-blue current surfaces, and keep the active
underside at `#5BB8F5`. The connector remains behind each opaque chip and is
visible only between chips. Add hover lift and `:focus-visible` treatment only
to visited buttons. Size icon medallions at 28–30px on desktop and 24px in the
existing compact container breakpoints; labels remain visible and may wrap to
two lines.

Use these core rules:

```css
.path li {
  position: relative;
  z-index: 0;
  width: fit-content;
  min-width: 0;
  padding: 0;
}

.stepChip {
  position: relative;
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
  padding: 6px 11px;
  border: 1px solid rgba(23, 50, 74, 0.12);
  border-radius: 999px;
  background: var(--story-path-cream);
  color: inherit;
  font: inherit;
  isolation: isolate;
}

button.stepChip {
  appearance: none;
  cursor: pointer;
}

.path li[data-story-step-state="visited"] .stepChip {
  background: var(--story-path-pale-blue);
}

.path li[data-story-step-state="current"] .stepChip {
  border-color: transparent;
  background: transparent;
}

button.stepChip:hover {
  transform: translateY(-2px);
}

button.stepChip:focus-visible {
  outline: 3px solid var(--story-path-ink);
  outline-offset: 3px;
}

.stepIcon {
  position: relative;
  z-index: 1;
  display: grid;
  flex: 0 0 29px;
  width: 29px;
  height: 29px;
  place-items: center;
  border-radius: 50%;
  background: #ffffff;
}

.visitedSeal {
  position: absolute;
  right: -4px;
  bottom: -3px;
  display: grid;
  width: 14px;
  height: 14px;
  place-items: center;
  border: 2px solid var(--story-path-pale-blue);
  border-radius: 50%;
  background: var(--story-path-blue);
  color: var(--story-path-ink);
}

@container philoo-story-path (max-width: 760px) {
  .stepChip {
    min-height: 34px;
    gap: 5px;
    padding: 4px 6px;
  }

  .stepIcon {
    flex-basis: 24px;
    width: 24px;
    height: 24px;
  }
}

@media (min-width: 721px) and (max-width: 820px) {
  .stepChip {
    min-height: 34px;
    gap: 5px;
    padding: 4px 6px;
  }

  .stepIcon {
    flex-basis: 24px;
    width: 24px;
    height: 24px;
  }
}
```

- [ ] **Step 6: Run focused tests and lint**

Run:

```bash
npm test -- src/domains/lessons/philoo-story-primitives.test.tsx
npx eslint src/domains/lessons/philoo-story-path-stage.tsx src/domains/lessons/philoo-story-primitives.test.tsx
```

Expected: all focused tests pass and ESLint reports no errors.

- [ ] **Step 7: Commit the reusable primitive**

```bash
git add package.json package-lock.json src/domains/lessons/philoo-story-path-stage.tsx src/domains/lessons/philoo-story-path-stage.module.css src/domains/lessons/philoo-story-primitives.test.tsx
git commit -m "feat: add semantic Story Path icons"
```

---

### Task 2: Revisit Opened Cave Story Beats

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-prisoner-wall-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx`

**Interfaces:**
- Consumes:

```ts
type DialogueBeat = 0 | 1 | 2;
furthestStep: number;
onStepSelect: (step: number) => void;
```

- Produces: scene-owned `furthestDialogueIndex` state and deterministic
`selectDialogueBeat(nextBeat: DialogueBeat)` navigation.

- [ ] **Step 1: Write the failing scene navigation test**

After advancing to the final beat in the existing test, add:

```tsx
fireEvent.click(
  screen.getByRole("button", {
    name: "Voltar para História: A luz fica para trás",
  }),
);

expect(
  await screen.findByText(/vamos mais fundo/i),
).toBeInTheDocument();
const returnedPlato = screen
  .getAllByRole("img")
  .find((image) => image.getAttribute("data-stage-beat") === "0");
expect(returnedPlato).toHaveAttribute("data-stage-beat", "0");

expect(
  screen.getByRole("button", {
    name: "Voltar para Explicação: Quem vive aqui",
  }),
).toBeInTheDocument();
expect(
  screen.getByRole("button", {
    name: "Voltar para Ideia: O mundo na parede",
  }),
).toBeInTheDocument();

fireEvent.click(
  screen.getByRole("button", {
    name: "Voltar para Ideia: O mundo na parede",
  }),
);
expect(
  await screen.findByText(/uma parede iluminada e as sombras/i),
).toBeInTheDocument();
expect(screen.getByRole("link", { name: "Chegar mais perto" }))
  .toBeInTheDocument();
```

- [ ] **Step 2: Run the scene test to verify it fails**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx
```

Expected: FAIL because visited steps are not selectable and the scene does not
remember its furthest-opened beat.

- [ ] **Step 3: Add semantic kinds and furthest-beat state**

Define:

```ts
const STORY_PATH_STEPS = [
  { id: "luz", label: "A luz fica para trás", kind: "story" },
  { id: "pessoas", label: "Quem vive aqui", kind: "lesson" },
  { id: "parede", label: "O mundo na parede", kind: "concept" },
] as const;
```

Add:

```ts
const [furthestDialogueIndex, setFurthestDialogueIndex] =
  useState<DialogueBeat>(0);

function selectDialogueBeat(nextBeat: DialogueBeat) {
  setDialogueIndex(nextBeat);
  setFurthestDialogueIndex((furthest) =>
    Math.max(furthest, nextBeat) as DialogueBeat,
  );
}

function continueStory() {
  selectDialogueBeat(NEXT_BEAT[dialogueIndex]);
}
```

Pass:

```tsx
furthestStep={furthestDialogueIndex}
onStepSelect={(step) => selectDialogueBeat(step as DialogueBeat)}
```

The existing `dialogueIndex` continues to select copy, `transitionKey`, Plato
pose, action, and final-action focus.

- [ ] **Step 4: Run focused tests and lint**

Run:

```bash
npm test -- src/domains/lessons/philoo-story-primitives.test.tsx src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx
npx eslint src/domains/lessons/philoo-story-path-stage.tsx src/domains/lessons/as-sombras/cave-prisoner-wall-scene.tsx src/domains/lessons/philoo-story-primitives.test.tsx src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx
```

Expected: both focused suites pass and ESLint reports no errors.

- [ ] **Step 5: Verify the four responsive viewports once**

Run:

```bash
npm run check:story-folio-viewport
```

Expected: `1280×720`, `1024×768`, `768×1024`, and `390×844` pass without
horizontal or vertical page scrolling; the journey rail and action remain
usable.

- [ ] **Step 6: Commit scene navigation**

```bash
git add src/domains/lessons/as-sombras/cave-prisoner-wall-scene.tsx src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx
git commit -m "feat: revisit opened Story Path beats"
```
