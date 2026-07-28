# Philoo Narrative Composition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one reusable, responsive composition that optically aligns philosopher, dialogue, and optional illustration across Philoo narrative scenes.

**Architecture:** Add a stateless `PhilooNarrativeComposition` primitive whose DOM order is illustration, dialogue, then guide and whose CSS controls desktop visual placement, guide side, scale, gaps, and narrow-screen stacking. Integrate it first inside `PhilooStoryPathStage`, then migrate the invitation, descent, and illustrated shadow-name scenes without changing their content or state.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, Motion, Vitest, Testing Library.

## Global Constraints

- Main colors remain `#33BFED`, `#5BB8F5`, and cream `#FBF8F3`.
- Text-only narrow-screen order is dialogue, then centered philosopher.
- Illustrated narrow-screen order is illustration, dialogue, then centered philosopher.
- Illustration and dialogue share the same width in illustrated mode.
- The philosopher is approximately 15–20% larger than in the current Story Path scene and remains fully contained.
- Quotation marks remain baby blue, move farther inside the dialogue surface, and reserve copy space.
- Preserve no-page-scroll behavior at `1280×720`, `1024×768`, `768×1024`, and `390×844`.
- Do not regenerate images, rewrite lesson copy, redesign the journey rail, or force narrative layout onto activities.

---

### Task 1: Reusable Narrative Composition Primitive

**Files:**
- Create: `src/domains/lessons/philoo-narrative-composition.tsx`
- Create: `src/domains/lessons/philoo-narrative-composition.module.css`
- Create: `src/domains/lessons/philoo-narrative-composition.test.tsx`

**Interfaces:**
- Consumes: React `ReactNode` and existing `PlatoGuide`, dialogue-card, and illustration nodes supplied by scenes.
- Produces:

```ts
export type PhilooNarrativeCompositionProps = {
  dialogue: ReactNode;
  guide: ReactNode;
  illustration?: ReactNode;
  guideSide?: "start" | "end";
  className?: string;
};

export function PhilooNarrativeComposition(
  props: PhilooNarrativeCompositionProps,
): JSX.Element;
```

- [ ] **Step 1: Write the failing structure tests**

Create `src/domains/lessons/philoo-narrative-composition.test.tsx`:

```tsx
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { PhilooNarrativeComposition } from "./philoo-narrative-composition";

afterEach(cleanup);

it("renders dialogue before the philosopher when there is no illustration", () => {
  const { container } = render(
    <PhilooNarrativeComposition
      dialogue={<p>Diálogo</p>}
      guide={<div>Filósofo</div>}
    />,
  );

  const composition = container.querySelector(
    "[data-philoo-narrative-composition]",
  );
  expect(composition).toHaveAttribute("data-has-illustration", "false");
  expect(composition).toHaveAttribute("data-guide-side", "end");
  expect(
    Array.from(
      composition?.querySelectorAll("[data-narrative-slot]") ?? [],
    ).map((slot) => slot.getAttribute("data-narrative-slot")),
  ).toEqual(["dialogue", "guide"]);
});

it("keeps image, dialogue, and philosopher in narrow-screen reading order", () => {
  const { container } = render(
    <PhilooNarrativeComposition
      illustration={<img src="/scene.png" alt="A cena" />}
      dialogue={<p>Diálogo</p>}
      guide={<div>Filósofo</div>}
      guideSide="start"
    />,
  );

  const composition = container.querySelector(
    "[data-philoo-narrative-composition]",
  );
  expect(composition).toHaveAttribute("data-has-illustration", "true");
  expect(composition).toHaveAttribute("data-guide-side", "start");
  expect(
    Array.from(
      composition?.querySelectorAll("[data-narrative-slot]") ?? [],
    ).map((slot) => slot.getAttribute("data-narrative-slot")),
  ).toEqual(["illustration", "dialogue", "guide"]);
  expect(screen.getByRole("img", { name: "A cena" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the component test and verify it fails**

Run:

```bash
npm test -- src/domains/lessons/philoo-narrative-composition.test.tsx
```

Expected: FAIL because `./philoo-narrative-composition` does not exist.

- [ ] **Step 3: Implement the primitive**

Create `src/domains/lessons/philoo-narrative-composition.tsx`:

```tsx
import type { ReactNode } from "react";
import styles from "./philoo-narrative-composition.module.css";

export type PhilooNarrativeCompositionProps = {
  dialogue: ReactNode;
  guide: ReactNode;
  illustration?: ReactNode;
  guideSide?: "start" | "end";
  className?: string;
};

export function PhilooNarrativeComposition({
  dialogue,
  guide,
  illustration,
  guideSide = "end",
  className,
}: PhilooNarrativeCompositionProps) {
  const hasIllustration = illustration != null;

  return (
    <div
      className={[styles.composition, className].filter(Boolean).join(" ")}
      data-philoo-narrative-composition
      data-guide-side={guideSide}
      data-has-illustration={hasIllustration ? "true" : "false"}
    >
      <div className={styles.narrativeStack}>
        {hasIllustration ? (
          <div
            className={styles.illustration}
            data-narrative-slot="illustration"
          >
            {illustration}
          </div>
        ) : null}
        <div className={styles.dialogue} data-narrative-slot="dialogue">
          {dialogue}
        </div>
      </div>
      <div className={styles.guide} data-narrative-slot="guide">
        {guide}
      </div>
    </div>
  );
}
```

Create `src/domains/lessons/philoo-narrative-composition.module.css` with
the shared sizing and order contract:

```css
.composition {
  --philoo-narrative-gap: clamp(22px, 3vw, 46px);
  --philoo-narrative-stack-gap: clamp(18px, 2.2vw, 30px);
  --philoo-guide-max-width: clamp(285px, 23vw, 330px);
  --philoo-quote-inline-inset: clamp(30px, 3vw, 42px);
  --philoo-quote-block-inset: clamp(10px, 1.5dvh, 16px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.52fr);
  width: 100%;
  height: 100%;
  min-height: 0;
  align-items: center;
  gap: var(--philoo-narrative-gap);
}

.narrativeStack {
  grid-column: 1;
  display: grid;
  width: min(100%, 720px);
  min-width: 0;
  align-self: center;
  justify-self: center;
  gap: var(--philoo-narrative-stack-gap);
}

.illustration,
.dialogue {
  width: 100%;
  min-width: 0;
}

.guide {
  grid-column: 2;
  display: grid;
  width: min(100%, var(--philoo-guide-max-width));
  height: 100%;
  min-width: 0;
  min-height: 0;
  max-height: 100%;
  align-self: center;
  justify-self: center;
  place-items: center;
  filter: drop-shadow(0 14px 12px rgba(23, 50, 74, 0.13));
}

.guide > :first-child {
  width: 100%;
  height: 100%;
  min-height: 0;
  max-height: 100%;
}

.guide img {
  display: block;
  width: auto;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
}

.composition[data-guide-side="start"] {
  grid-template-columns: minmax(260px, 0.52fr) minmax(0, 1fr);
}

.composition[data-guide-side="start"] .narrativeStack {
  grid-column: 2;
}

.composition[data-guide-side="start"] .guide {
  grid-column: 1;
  grid-row: 1;
}

@media (max-width: 820px) {
  .composition,
  .composition[data-guide-side="start"] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr);
    gap: clamp(8px, 1.8dvh, 18px);
  }

  .composition .narrativeStack,
  .composition[data-guide-side="start"] .narrativeStack {
    grid-column: 1;
    grid-row: 1;
    width: 100%;
  }

  .composition .guide,
  .composition[data-guide-side="start"] .guide {
    grid-column: 1;
    grid-row: 2;
    width: min(58vw, 270px);
    justify-self: center;
  }
}

@media (max-height: 740px) and (min-width: 821px) {
  .composition {
    --philoo-narrative-gap: 20px;
    --philoo-guide-max-width: 290px;
  }
}
```

- [ ] **Step 4: Run the component test and verify it passes**

Run:

```bash
npm test -- src/domains/lessons/philoo-narrative-composition.test.tsx
```

Expected: 2 tests PASS.

- [ ] **Step 5: Run scoped lint**

Run:

```bash
npx eslint src/domains/lessons/philoo-narrative-composition.tsx src/domains/lessons/philoo-narrative-composition.test.tsx
```

Expected: exit 0.

- [ ] **Step 6: Commit the primitive**

```bash
git add src/domains/lessons/philoo-narrative-composition.tsx src/domains/lessons/philoo-narrative-composition.module.css src/domains/lessons/philoo-narrative-composition.test.tsx
git commit -m "feat: add narrative composition primitive"
```

---

### Task 2: Story Path Adoption and Quote Spacing

**Files:**
- Modify: `src/domains/lessons/philoo-story-path-stage.tsx`
- Modify: `src/domains/lessons/philoo-story-path-stage.module.css`
- Modify: `src/domains/lessons/philoo-story-primitives.test.tsx`
- Test: `src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx`

**Interfaces:**
- Consumes: `PhilooNarrativeComposition` from Task 1.
- Produces: every `PhilooStoryPathStage` moment rendered through the shared
  text-only composition, with inherited quote inset tokens and synchronized
  dialogue/guide transition.

- [ ] **Step 1: Add a failing integration assertion**

In the existing `PhilooStoryPathStage` test in
`src/domains/lessons/philoo-story-primitives.test.tsx`, add:

```tsx
const composition = container.querySelector(
  "[data-philoo-narrative-composition]",
);
expect(composition).toHaveAttribute("data-has-illustration", "false");
expect(composition).toHaveAttribute("data-guide-side", "end");
expect(
  Array.from(
    composition?.querySelectorAll("[data-narrative-slot]") ?? [],
  ).map((slot) => slot.getAttribute("data-narrative-slot")),
).toEqual(["dialogue", "guide"]);
```

- [ ] **Step 2: Run focused tests and verify the new assertion fails**

Run:

```bash
npm test -- src/domains/lessons/philoo-story-primitives.test.tsx src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx
```

Expected: FAIL because Story Path does not yet render the shared composition.

- [ ] **Step 3: Wrap the Story Path moment**

Import the primitive in `philoo-story-path-stage.tsx`:

```tsx
import { PhilooNarrativeComposition } from "./philoo-narrative-composition";
```

Replace the direct `.voiceSheet` and `.guide` siblings inside `.storyMoment`
with:

```tsx
<PhilooNarrativeComposition
  dialogue={
    <div
      className={styles.voiceSheet}
      data-story-path-slot="voice"
      role="status"
      aria-live="polite"
    >
      <span className={styles.quoteMark} aria-hidden="true">
        “
      </span>
      <p className={styles.speaker}>{speaker}</p>
      <div className={styles.copy}>{children}</div>
    </div>
  }
  guide={
    <div className={styles.guide} data-story-path-slot="guide">
      {guide}
    </div>
  }
/>
```

Keep the existing `AnimatePresence`, transition key, Motion wrapper, live
region, and action dock unchanged.

- [ ] **Step 4: Convert Story Path CSS to composition-owned alignment**

In `philoo-story-path-stage.module.css`:

- make `.storyMoment` a full-height block wrapper rather than a grid;
- set `.storyMoment > :first-child { height: 100%; }`;
- remove column, gap, bottom alignment, fixed `280px` guide wrapper, and
  `240px` nested image rules now owned by the primitive;
- keep `.guide` as a transparent slot with `width: 100%`, `height: 100%`,
  `min-height: 0`, and no local bottom alignment;
- update quotation and copy spacing to:

```css
.quoteMark {
  top: var(--philoo-quote-block-inset, 12px);
  right: var(--philoo-quote-inline-inset, 34px);
  font-size: clamp(4rem, 6.4vw, 6.5rem);
}

.copy {
  padding-inline-end: clamp(48px, 5vw, 72px);
}
```

At the existing compact breakpoint, use:

```css
.quoteMark {
  top: var(--philoo-quote-block-inset, 9px);
  right: var(--philoo-quote-inline-inset, 22px);
  font-size: 3.6rem;
}

.copy {
  padding-inline-end: 44px;
}
```

Remove obsolete Story Path column overrides from the `760px`, `820px`,
`1180px`, and short-height rules. Do not alter masthead, path, footer, or
navigation styling.

- [ ] **Step 5: Run focused tests**

Run:

```bash
npm test -- src/domains/lessons/philoo-story-primitives.test.tsx src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx
```

Expected: all focused tests PASS, including revisit focus, pose synchronization,
and final navigation.

- [ ] **Step 6: Run scoped lint and diff validation**

Run:

```bash
npx eslint src/domains/lessons/philoo-story-path-stage.tsx src/domains/lessons/philoo-story-primitives.test.tsx
git diff --check
```

Expected: both commands exit 0.

- [ ] **Step 7: Commit Story Path adoption**

```bash
git add src/domains/lessons/philoo-story-path-stage.tsx src/domains/lessons/philoo-story-path-stage.module.css src/domains/lessons/philoo-story-primitives.test.tsx
git commit -m "feat: align story dialogue with philosopher"
```

---

### Task 3: Opening and Illustrated Scene Adoption

**Files:**
- Modify: `src/domains/lessons/philoo-dialogue-card.module.css`
- Modify: `src/domains/lessons/as-sombras/cave-soft-story-layout.module.css`
- Modify: `src/domains/lessons/as-sombras/cave-invitation-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-descent-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-shadow-names-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-descent-scene.test.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-shadow-names-scene.test.tsx`

**Interfaces:**
- Consumes: `PhilooNarrativeComposition` from Task 1.
- Produces: pure-dialogue and illustrated story scenes that share the same
  philosopher scale, optical alignment, quote inset, and responsive DOM order.

- [ ] **Step 1: Add failing adoption assertions**

Add to the invitation test:

```tsx
const composition = container.querySelector(
  "[data-philoo-narrative-composition]",
);
expect(composition).toHaveAttribute("data-guide-side", "end");
expect(composition).toHaveAttribute("data-has-illustration", "false");
```

Add to the descent test:

```tsx
const composition = container.querySelector(
  "[data-philoo-narrative-composition]",
);
expect(composition).toHaveAttribute("data-guide-side", "start");
expect(composition).toHaveAttribute("data-has-illustration", "false");
```

Replace the shadow-name scene's old `data-story-stage`/`data-story-stack`
structure assertions with:

```tsx
const composition = container.querySelector(
  "[data-philoo-narrative-composition]",
);
expect(composition).toHaveAttribute("data-guide-side", "start");
expect(composition).toHaveAttribute("data-has-illustration", "true");
expect(
  Array.from(
    composition?.querySelectorAll("[data-narrative-slot]") ?? [],
  ).map((slot) => slot.getAttribute("data-narrative-slot")),
).toEqual(["illustration", "dialogue", "guide"]);
```

After advancing to the final beat, assert:

```tsx
expect(
  container.querySelector("[data-philoo-narrative-composition]"),
).toHaveAttribute("data-has-illustration", "false");
```

- [ ] **Step 2: Run scene tests and verify they fail**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx src/domains/lessons/as-sombras/cave-descent-scene.test.tsx src/domains/lessons/as-sombras/cave-shadow-names-scene.test.tsx
```

Expected: FAIL because the scenes still use local grids.

- [ ] **Step 3: Migrate invitation and descent**

Import the primitive into both scene files:

```tsx
import { PhilooNarrativeComposition } from "../philoo-narrative-composition";
```

Inside each existing heading layout, replace the separate guide/dialogue
siblings with one composition. Invitation uses:

```tsx
<PhilooNarrativeComposition
  className={styles.narrativeComposition}
  guideSide="end"
  dialogue={
    <PhilooDialogueCard
      speaker="Platão"
      action={
        <Link
          href="/aula/as-sombras/a-descida"
          onClick={beginNavigation}
          aria-disabled={phase === "leaving"}
        >
          {beat.action}
          <span className={styles.actionArrow} aria-hidden="true">
            →
          </span>
        </Link>
      }
    >
      <h2 className={styles.title}>{beat.title}</h2>
      <p className={styles.lead}>{beat.story}</p>
      <p className={styles.guidance}>{beat.guidance}</p>
      <p className={styles.source}>{beat.source}</p>
    </PhilooDialogueCard>
  }
  guide={<PlatoGuide pose="invitation" priority />}
/>
```

Descent uses:

```tsx
<PhilooNarrativeComposition
  className={styles.narrativeComposition}
  guideSide="start"
  dialogue={
    <PhilooDialogueCard
      speaker="Platão"
      action={
        <Link
          href={nextScene}
          onClick={beginNavigation}
          aria-disabled={phase === "leaving"}
        >
          {CAVE_STORY_BEATS.descent.action}
          <span className={styles.actionArrow} aria-hidden="true">
            →
          </span>
        </Link>
      }
    >
      <h2 className={styles.title}>{CAVE_STORY_BEATS.descent.title}</h2>
      <p className={styles.lead}>{CAVE_STORY_BEATS.descent.story}</p>
      <p className={styles.guidance}>
        {CAVE_STORY_BEATS.descent.guidance}
      </p>
    </PhilooDialogueCard>
  }
  guide={<PlatoGuide pose="descent" priority />}
/>
```

Do not change headings, copy, links, or transitions.

- [ ] **Step 4: Migrate the illustrated shadow-name scene**

Import the primitive and replace `.storyStage`, `.guideSlot`, and
`.dialogueSlot` siblings with:

```tsx
<PhilooNarrativeComposition
  className={styles.storyStage}
  guideSide="start"
  illustration={
    "storyPanel" in dialogueBeat ? (
      <figure
        className={styles.storyPanel}
        data-story-panel
        key={dialogueBeat.storyPanel.src}
      >
        <Image
          src={dialogueBeat.storyPanel.src}
          alt={dialogueBeat.storyPanel.alt}
          width={1600}
          height={900}
          sizes="(max-width: 620px) calc(100vw - 52px), (max-width: 900px) 52vw, 600px"
        />
      </figure>
    ) : undefined
  }
  dialogue={
    <PhilooDialogueCard
      speaker={dialogueBeat.speaker}
      currentBeat={dialogueIndex + 1}
      totalBeats={DIALOGUE_BEATS.length}
      tone={dialogueBeat.kind === "prisoner" ? "prisoner" : "dialogue"}
      density="compact"
      action={
        isLastBeat ? (
          <Link
            ref={finalActionRef}
            href={NEXT_SCENE}
            onClick={beginNavigation}
            aria-disabled={phase === "leaving"}
          >
            Observar as sombras
            <span className={styles.actionArrow} aria-hidden="true">
              →
            </span>
          </Link>
        ) : (
          <button type="button" onClick={continueStory}>
            Continuar
            <span className={styles.actionArrow} aria-hidden="true">
              →
            </span>
          </button>
        )
      }
    >
      <p className={styles.beatCopy} key={dialogueIndex}>
        {dialogueBeat.text}
      </p>
    </PhilooDialogueCard>
  }
  guide={
    <PlatoGuide
      pose={PLATO_BY_BEAT[dialogueIndex]}
      stageBeat={dialogueIndex}
      priority
    />
  }
/>
```

Keep the existing image assets, alt text, beat state, focus management, and
actions.

- [ ] **Step 5: Simplify local layout CSS and share quote tokens**

In `cave-soft-story-layout.module.css`:

- add `.narrativeComposition` spanning the heading layout's second row;
- reduce `.storyStage` to width/height/max-width constraints and remove its
  local grid columns;
- remove obsolete direct-child guide/dialogue placement rules;
- retain scene heading, illustration frame, typography, and arrival effects;
- do not duplicate philosopher width or vertical alignment.

In `philoo-dialogue-card.module.css`, inherit the composition tokens:

```css
.quoteMark {
  top: var(--philoo-quote-block-inset, 13px);
  right: var(--philoo-quote-inline-inset, 30px);
}

.copy {
  padding-inline-end: clamp(48px, 5vw, 66px);
}
```

At `max-width: 620px`, use a `22px` quote inset and `42px` copy reserve.

- [ ] **Step 6: Run the scene and primitive suites**

Run:

```bash
npm test -- src/domains/lessons/philoo-narrative-composition.test.tsx src/domains/lessons/philoo-story-primitives.test.tsx src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx src/domains/lessons/as-sombras/cave-descent-scene.test.tsx src/domains/lessons/as-sombras/cave-shadow-names-scene.test.tsx
```

Expected: all focused suites PASS.

- [ ] **Step 7: Run responsive and static verification**

Run:

```bash
npm run check:story-folio-viewport
npx eslint src/domains/lessons/philoo-narrative-composition.tsx src/domains/lessons/philoo-narrative-composition.test.tsx src/domains/lessons/philoo-story-path-stage.tsx src/domains/lessons/as-sombras/cave-invitation-scene.tsx src/domains/lessons/as-sombras/cave-descent-scene.tsx src/domains/lessons/as-sombras/cave-shadow-names-scene.tsx
git diff --check
```

Expected: viewport harness passes all four sizes, ESLint exits 0, and Git reports
no whitespace errors.

- [ ] **Step 8: Perform a focused browser visual review**

Review:

- `/aula/as-sombras/so-a-parede` at each of its three beats;
- `/aula/as-sombras/primeira-tela`;
- `/aula/as-sombras/a-descida`;
- `/aula/as-sombras/eles-dao-nomes` with and without an illustration.

Confirm:

- philosopher and dialogue share an optical center;
- philosopher is visibly larger but fully contained;
- quote marks do not touch edges or collide with copy;
- illustration and dialogue widths align;
- narrow-screen order matches the approved design;
- no page requires vertical scrolling.

- [ ] **Step 9: Commit migrated scenes**

```bash
git add src/domains/lessons/philoo-dialogue-card.module.css src/domains/lessons/as-sombras/cave-soft-story-layout.module.css src/domains/lessons/as-sombras/cave-invitation-scene.tsx src/domains/lessons/as-sombras/cave-descent-scene.tsx src/domains/lessons/as-sombras/cave-shadow-names-scene.tsx src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx src/domains/lessons/as-sombras/cave-descent-scene.test.tsx src/domains/lessons/as-sombras/cave-shadow-names-scene.test.tsx
git commit -m "feat: align illustrated philosopher scenes"
```

---

### Task 4: Final Regression Verification

**Files:**
- No production files expected.
- Modify only the files from Tasks 1–3 if a verification failure exposes an
  in-scope regression.

**Interfaces:**
- Consumes: the completed narrative primitive and all adopted scenes.
- Produces: verified branch ready for GitHub publication.

- [ ] **Step 1: Run the complete test suite**

Run:

```bash
npm test
```

Expected: every test file and test passes with zero failures.

- [ ] **Step 2: Run the production build**

Run:

```bash
npm run build
```

Expected: Next.js production build exits 0.

- [ ] **Step 3: Verify repository state**

Run:

```bash
git status --short
git log -4 --oneline
```

Expected: no uncommitted implementation changes and three focused feature
commits after the design and plan commits.
