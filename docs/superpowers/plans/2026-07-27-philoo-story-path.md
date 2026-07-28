# Philoo Story Path Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the visually subtle Story Folio trial on `Mais fundo` with a visibly authored Philoo Story Path that joins a normal masthead, micro-progress route, Plato, dialogue, and action into one tactile composition.

**Architecture:** Replace the unused one-scene `PhilooStoryFolio` primitive with `PhilooStoryPathStage`. The new primitive owns the physical page, semantic masthead, labelled three-step scene path, coordinated Motion transitions, integrated voice sheet, and action dock; the scene continues to own dialogue state, Plato poses, navigation, and copy. The outer shell and journey rail remain unchanged.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, Motion 12, Vitest, Testing Library.

## Global Constraints

- Trial route only: `/aula/as-sombras/so-a-parede`.
- Keep colors `#33BFED`, `#5BB8F5`, `#FBF8F3`, and ink `#17324A`.
- Restore the title to a normal internal masthead; no attached title tab.
- Preserve all three dialogue strings, Plato pose changes, focus transfer, final href, transition phase, and journey state.
- Keep the journey rail visually and behaviorally unchanged.
- Do not add a dependency, illustration, sound, activity, portal change, or global type/palette change.
- Use the installed `motion` package and respect `prefers-reduced-motion`.
- No horizontal or vertical page scroll at `1280×720`, `1024×768`, `768×1024`, or `390×844`.
- The final visual change must be unmistakable in a before/after screenshot.

---

### Task 1: Replace the Folio Primitive with the Story Path Stage

**Files:**
- Create: `src/domains/lessons/philoo-story-path-stage.tsx`
- Create: `src/domains/lessons/philoo-story-path-stage.module.css`
- Modify: `src/domains/lessons/philoo-story-primitives.test.tsx`

**Interfaces:**
- Consumes: React `ReactNode`; Motion `AnimatePresence`, `LayoutGroup`, `LazyMotion`, `MotionConfig`, `domMax`, `useReducedMotion`.
- Produces:

```tsx
export type PhilooStoryPathStep = {
  id: string;
  label: string;
};

export type PhilooStoryPathStageProps = {
  eyebrow: string;
  title: string;
  titleId: string;
  context: string;
  steps: readonly PhilooStoryPathStep[];
  currentStep: number;
  transitionKey: string | number;
  guide: ReactNode;
  speaker: string;
  children: ReactNode;
  action: ReactNode;
};

export function PhilooStoryPathStage(
  props: PhilooStoryPathStageProps,
): React.ReactElement;
```

- DOM contract:
  - root: `[data-philoo-story-path-stage]`;
  - normal `h1` labelled by `titleId`;
  - path: `ol[aria-label="Caminho nesta cena"]`;
  - steps: `[data-story-step-state="completed|current|upcoming"]`;
  - current step label has `aria-current="step"`;
  - guide: `[data-story-path-slot="guide"]`;
  - voice sheet: `[data-story-path-slot="voice"][role="status"]`;
  - action: `[data-story-path-slot="action"]`.

- [ ] **Step 1: Replace primitive tests with the Story Path contract**

Remove the two `PhilooStoryFolio` tests and import. Add:

```tsx
import { PhilooStoryPathStage } from "./philoo-story-path-stage";

it("renders one semantic Philoo story path with a normal masthead", () => {
  const { container } = render(
    <PhilooStoryPathStage
      eyebrow="Cena 3 · A descida"
      title="Mais fundo"
      titleId="story-path-title"
      context="Siga Platão até a parede"
      steps={[
        { id: "luz", label: "A luz fica para trás" },
        { id: "pessoas", label: "Quem vive aqui" },
        { id: "parede", label: "O mundo na parede" },
      ]}
      currentStep={1}
      transitionKey={1}
      guide={<div>Platão guia</div>}
      speaker="Platão"
      action={<button type="button">Continuar</button>}
    >
      <p>É aqui embaixo.</p>
    </PhilooStoryPathStage>,
  );

  expect(
    screen.getByRole("heading", { name: "Mais fundo", level: 1 }),
  ).not.toHaveAttribute("data-folio-chapter-tab");
  expect(
    screen.getByRole("list", { name: "Caminho nesta cena" }),
  ).toBeInTheDocument();
  expect(screen.getByText("A luz fica para trás").closest("li")).toHaveAttribute(
    "data-story-step-state",
    "completed",
  );
  expect(screen.getByText("Quem vive aqui")).toHaveAttribute(
    "aria-current",
    "step",
  );
  expect(
    container.querySelector('[data-story-path-slot="guide"]'),
  ).toHaveTextContent("Platão guia");
  expect(
    container.querySelector('[data-story-path-slot="voice"]'),
  ).toHaveTextContent("É aqui embaixo.");
  expect(
    container.querySelector('[data-story-path-slot="action"]'),
  ).toContainElement(screen.getByRole("button", { name: "Continuar" }));
});
```

Update the shell-treatment integration test to render
`PhilooStoryPathStage` instead of `PhilooStoryFolio`, while retaining the
`data-surface-treatment="folio"` assertion because the neutral shell treatment
is still the correct contract.

- [ ] **Step 2: Run the primitive test to verify RED**

Run:

```bash
npm test -- src/domains/lessons/philoo-story-primitives.test.tsx
```

Expected: FAIL because `philoo-story-path-stage.tsx` does not exist.

- [ ] **Step 3: Implement the semantic stage**

Create `philoo-story-path-stage.tsx` with:

```tsx
"use client";

import {
  AnimatePresence,
  LayoutGroup,
  LazyMotion,
  MotionConfig,
  domMax,
  useReducedMotion,
} from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";
import styles from "./philoo-story-path-stage.module.css";

export type PhilooStoryPathStep = {
  id: string;
  label: string;
};

export type PhilooStoryPathStageProps = {
  eyebrow: string;
  title: string;
  titleId: string;
  context: string;
  steps: readonly PhilooStoryPathStep[];
  currentStep: number;
  transitionKey: string | number;
  guide: ReactNode;
  speaker: string;
  children: ReactNode;
  action: ReactNode;
};

export function PhilooStoryPathStage({
  eyebrow,
  title,
  titleId,
  context,
  steps,
  currentStep,
  transitionKey,
  guide,
  speaker,
  children,
  action,
}: PhilooStoryPathStageProps) {
  const shouldReduceMotion = useReducedMotion();
  const contentTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domMax} strict>
        <section
          className={styles.stage}
          aria-labelledby={titleId}
          data-philoo-story-path-stage
        >
          <span className={styles.underlay} aria-hidden="true" />
          <div className={styles.page}>
            <header className={styles.masthead}>
              <div>
                <span className={styles.eyebrow}>{eyebrow}</span>
                <h1 id={titleId}>{title}</h1>
                <p>{context}</p>
              </div>
              <span className={styles.beatCount}>
                {currentStep + 1} de {steps.length}
              </span>
            </header>

            <LayoutGroup id={`${titleId}-path`}>
              <ol className={styles.path} aria-label="Caminho nesta cena">
                {steps.map((step, index) => {
                  const state =
                    index < currentStep
                      ? "completed"
                      : index === currentStep
                        ? "current"
                        : "upcoming";

                  return (
                    <li key={step.id} data-story-step-state={state}>
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
                      <span className={styles.stepMarker} aria-hidden="true">
                        {state === "completed" ? "✓" : index + 1}
                      </span>
                      <span
                        className={styles.stepLabel}
                        aria-current={state === "current" ? "step" : undefined}
                      >
                        {step.label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </LayoutGroup>

            <div className={styles.storyBody}>
              <svg
                className={styles.storyThread}
                viewBox="0 0 1000 430"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M18 22 C190 35 120 178 315 190 S590 115 680 235 S850 392 982 340" />
              </svg>

              <AnimatePresence initial={false} mode="wait">
                <m.div
                  className={styles.voiceSheet}
                  data-story-path-slot="voice"
                  role="status"
                  aria-live="polite"
                  key={`voice-${transitionKey}`}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={contentTransition}
                >
                  <span className={styles.quoteMark} aria-hidden="true">“</span>
                  <p className={styles.speaker}>{speaker}</p>
                  <div className={styles.copy}>{children}</div>
                </m.div>
              </AnimatePresence>

              <AnimatePresence initial={false} mode="popLayout">
                <m.div
                  className={styles.guide}
                  data-story-path-slot="guide"
                  key={`guide-${transitionKey}`}
                  initial={{ opacity: 0, x: 12, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -8, scale: 0.98 }}
                  transition={contentTransition}
                >
                  {guide}
                </m.div>
              </AnimatePresence>
            </div>

            <footer className={styles.actionDock}>
              <span>
                Momento {currentStep + 1} de {steps.length}
              </span>
              <div data-story-path-slot="action">{action}</div>
            </footer>
          </div>
        </section>
      </LazyMotion>
    </MotionConfig>
  );
}
```

- [ ] **Step 4: Implement the visual system**

Create `philoo-story-path-stage.module.css` with these exact structural
requirements:

- `.stage`: `position:relative; height:100%; min-height:0; isolation:isolate`.
- `.underlay`: visible cyan layer at `inset: 9px -7px -9px 7px`, `30–38px`
  radius, `#33BFED`, and one soft ink-colored shadow.
- `.page`: full-height cream page, `overflow:hidden`, `2px` translucent ink
  border, `30–38px` radius, and paper grain via a low-opacity inline
  `feTurbulence` SVG plus `#FBF8F3`.
- `.masthead`: fixed top hierarchy with eyebrow, display title, context, beat
  count, and a `2px dashed rgba(23,50,74,.13)` lower rule.
- `.path`: three equal columns; a continuous cyan connector behind the steps;
  current step uses a `#A9E3FA` capsule with `0 6px 0 #5BB8F5`; completed uses
  check marker; future stays low contrast.
- `.storyBody`: two-column `minmax(330px,.95fr) minmax(250px,.7fr)` composition.
- `.voiceSheet`: no generic outer-card shadow; use a `6px #33BFED` inline-start
  rule, translucent white paper tint, quiet dashed top/bottom rules, display
  quote mark, and reading typography.
- `.guide`: align to the lower edge, preserve the existing transparent Plato
  image, and apply only `filter: drop-shadow(0 14px 12px rgba(23,50,74,.13))`.
- `.storyThread`: absolute behind content, cyan stroke only, no fill, round
  caps, low opacity; hide it at narrow layouts.
- `.actionDock`: stable bottom band with pale-blue tint and dashed top rule.
- `.actionDock :is(button,a)`: 44px minimum target, blue face `#5BB8F5`, cyan
  lower layer, rounded pill, hover lift, 4px active compression, and visible
  focus ring.
- At container width `<=760px`, use one column, compact step labels, shrink the
  guide, hide the body thread, and reserve
  `var(--philoo-folio-action-inline-end-reserve, 0)` for the action.
- At height `<=740px`, reduce masthead/path/body spacing without hiding copy.
- Under `prefers-reduced-motion`, eliminate nonessential transition duration.

The grain must remain below 6% visible opacity and must not reduce text
contrast.

- [ ] **Step 5: Run primitive tests and quality checks**

Run:

```bash
npm test -- src/domains/lessons/philoo-story-primitives.test.tsx
npx eslint src/domains/lessons/philoo-story-path-stage.tsx src/domains/lessons/philoo-story-primitives.test.tsx
git diff --check
```

Expected: primitive tests PASS; lint and whitespace checks return zero.

- [ ] **Step 6: Commit the new primitive**

Run:

```bash
git add src/domains/lessons/philoo-story-path-stage.tsx src/domains/lessons/philoo-story-path-stage.module.css src/domains/lessons/philoo-story-primitives.test.tsx
git commit -m "feat: replace story folio with Philoo Story Path"
```

Keep `philoo-story-folio.tsx` and its CSS through this commit because the
current scene still imports them. Task 2 removes both files immediately after
the route migrates, keeping every intermediate commit buildable.

### Task 2: Adopt the Story Path in `Mais fundo`

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-prisoner-wall-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx`
- Modify: `scripts/check-story-folio-viewport.mjs`
- Delete: `src/domains/lessons/philoo-story-folio.tsx`
- Delete: `src/domains/lessons/philoo-story-folio.module.css`

**Interfaces:**
- Consumes: `PhilooStoryPathStage`, `PlatoGuide`, `useStorySceneTransition`, and the existing shell journey.
- Produces: one three-beat Story Path scene with unchanged dialogue, poses, focus, and final route.

- [ ] **Step 1: Write the failing scene acceptance contract**

Replace folio assertions with:

```tsx
const storyPath = container.querySelector(
  "[data-philoo-story-path-stage]",
);

expect(storyPath).toBeInTheDocument();
expect(
  screen.getByRole("heading", { name: "Mais fundo", level: 1 }),
).not.toHaveAttribute("data-folio-chapter-tab");
expect(
  screen.getByRole("list", { name: "Caminho nesta cena" }),
).toBeInTheDocument();
expect(screen.getByText("A luz fica para trás")).toHaveAttribute(
  "aria-current",
  "step",
);
expect(
  container.querySelector('[data-story-path-slot="guide"]'),
).toContainElement(screen.getByRole("img"));
expect(
  container.querySelector('[data-story-path-slot="voice"]'),
).toHaveTextContent(/vamos mais fundo/i);
expect(
  container.querySelector('[data-story-path-slot="action"]'),
).toContainElement(screen.getByRole("button", { name: "Continuar" }));
```

After the first click, assert `Quem vive aqui` has `aria-current="step"`.
After the second click, assert `O mundo na parede` has
`aria-current="step"`. Retain all existing pose, focus, dialogue, journey, and
final-link assertions.

- [ ] **Step 2: Run the scene test to verify RED**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx
```

Expected: FAIL because the scene still renders the rejected folio.

- [ ] **Step 3: Convert the scene**

Remove `PhilooDialogueCard` and `PhilooStoryFolio` imports. Import
`PhilooStoryPathStage`.

Add:

```tsx
const STORY_PATH_STEPS = [
  { id: "luz", label: "A luz fica para trás" },
  { id: "pessoas", label: "Quem vive aqui" },
  { id: "parede", label: "O mundo na parede" },
] as const;
```

Inside the unchanged `PhilooStoryShell`, render:

```tsx
<PhilooStoryPathStage
  eyebrow="Cena 3 · A descida"
  title={SCENE_TITLE}
  titleId="descent-journey-title"
  context="Siga Platão até a parede"
  steps={STORY_PATH_STEPS}
  currentStep={dialogueIndex}
  transitionKey={dialogueIndex}
  guide={
    <PlatoGuide
      pose={PLATO_BY_BEAT[dialogueIndex]}
      stageBeat={dialogueIndex}
      priority
    />
  }
  speaker="Platão"
  action={
    isLastBeat ? (
      <Link
        ref={finalActionRef}
        href={NEXT_SCENE}
        onClick={beginNavigation}
        aria-disabled={phase === "leaving"}
      >
        Chegar mais perto
        <span className={styles.actionArrow} aria-hidden="true">→</span>
      </Link>
    ) : (
      <button type="button" onClick={continueStory}>
        Continuar
        <span className={styles.actionArrow} aria-hidden="true">→</span>
      </button>
    )
  }
>
  <p className={styles.beatCopy} key={dialogueIndex}>
    {DIALOGUE_BEATS[dialogueIndex]}
  </p>
</PhilooStoryPathStage>
```

Keep `surfaceTreatment="folio"` only as the existing opt-in neutral shell
treatment; it has no visible attached-tab behavior.

- [ ] **Step 4: Update the real-browser regression selectors**

In `scripts/check-story-folio-viewport.mjs`:

- replace both occurrences of
  `'[data-folio-slot="primary"] button, [data-folio-slot="primary"] a'`
  with
  `'[data-story-path-slot="action"] button, [data-story-path-slot="action"] a'`;
- replace the route-ready selector
  `[data-philoo-story-folio]` with `[data-philoo-story-path-stage]`;
- update user-facing command messages from `Story Folio` to `Story Path`;
- retain all four exact viewport, no-scroll, hit-test, and cleanup assertions.

After the scene no longer imports the rejected primitive, remove
`philoo-story-folio.tsx` and `philoo-story-folio.module.css`.

- [ ] **Step 5: Run focused tests**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx src/domains/lessons/philoo-story-primitives.test.tsx
```

Expected: all focused tests PASS, including three path-state transitions, three
Plato poses, focus transfer, and final href.

- [ ] **Step 6: Verify the live design**

With the existing isolated preview at `http://localhost:4313`, verify:

- `1280×720`: main stage, rail, masthead, three-node path, voice sheet, Plato,
  and action dock fit without scroll;
- `1024×768`: rail and main stage remain balanced;
- `768×1024`: expanded rail does not cover path, copy, or action;
- `390×844`: collapsed rail does not cover the action; labels compact; no
  overflow;
- all three Continue states visibly advance the active path capsule and change
  Plato;
- title is not attached;
- the rail is pixel-unchanged.

Run the committed browser check:

```bash
PHILOO_BASE_URL=http://localhost:4313 npm run check:story-folio-viewport
```

Expected: four viewport PASS lines with no horizontal or vertical page scroll.

- [ ] **Step 7: Run scoped quality checks and commit**

Run:

```bash
npx eslint src/domains/lessons/philoo-story-path-stage.tsx src/domains/lessons/as-sombras/cave-prisoner-wall-scene.tsx src/domains/lessons/philoo-story-primitives.test.tsx src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx scripts/check-story-folio-viewport.mjs
git diff --check
git add src/domains/lessons/as-sombras/cave-prisoner-wall-scene.tsx src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx scripts/check-story-folio-viewport.mjs
git rm src/domains/lessons/philoo-story-folio.tsx src/domains/lessons/philoo-story-folio.module.css
git commit -m "feat: guide Mais fundo along a Philoo Story Path"
```

Expected: lint and whitespace checks return zero; commit succeeds.
