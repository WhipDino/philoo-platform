# Philoo Story Folio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current `Mais fundo` lesson scene into the first reusable Philoo Story Folio without changing the journey rail or redesigning other scenes.

**Architecture:** Add a reusable slotted folio primitive that owns the layered paper construction, attached chapter tab, and responsive scene composition. Add an explicit folio surface treatment to `PhilooStoryShell`, then opt only `CavePrisonerWallScene` into the new primitive. Existing dialogue, Plato pose, navigation, focus, and journey behavior remain intact.

**Tech Stack:** Next.js 16.2.12, React 19.2.4, TypeScript, CSS Modules, Motion 12.42.2, Next Image, Vitest, Testing Library

## Global Constraints

- The first implementation trial applies only to `/aula/as-sombras/so-a-parede`.
- Keep the journey rail, header, baby-blue outer background, dialogue copy, Plato artwork, and scene navigation behavior unchanged.
- Use `#FBF8F3` for the cream top sheet, `#DDF4FC` for the pale middle sheet, `#33BFED` for the cyan backing sheet, `#5BB8F5` for tactile controls, and `#17324A` for primary ink.
- Do not add dependencies, generated images, decorative SVG backgrounds, canvas, WebGL, Lottie, or a component framework.
- Keep the outer lesson page fixed to `100dvh`; the narrative trial must not require page scrolling at the representative laptop, tablet, or mobile viewports.
- Preserve semantic headings, focus order, keyboard behavior, minimum 44px touch targets, and `prefers-reduced-motion`.
- Treat the chapter tab as heading presentation, not an interactive tab control.
- Keep physical depth concentrated in the folio and pressable controls; do not add stronger independent shadows to Plato or the dialogue card.

---

## File Structure

- Create `src/domains/lessons/philoo-story-folio.tsx`
  - Owns the public Story Folio slot API and semantic chapter heading.
- Create `src/domains/lessons/philoo-story-folio.module.css`
  - Owns folio material layers, composition modes, container-query behavior, and short-screen rules.
- Modify `src/domains/lessons/philoo-story-primitives.test.tsx`
  - Covers the primitive contract and the shell's folio treatment.
- Modify `src/domains/lessons/philoo-story-shell.tsx`
  - Adds an explicit, opt-in `surfaceTreatment` contract without changing the default surface.
- Modify `src/domains/lessons/philoo-story-shell.module.css`
  - Makes the shell wrapper visually neutral only when a child folio owns the material.
- Modify `src/domains/lessons/as-sombras/cave-prisoner-wall-scene.tsx`
  - Adopts the folio for the current `Mais fundo` scene.
- Modify `src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx`
  - Preserves story behavior while verifying the new composition.

---

### Task 1: Add the reusable Story Folio primitive

**Files:**
- Create: `src/domains/lessons/philoo-story-folio.tsx`
- Create: `src/domains/lessons/philoo-story-folio.module.css`
- Modify: `src/domains/lessons/philoo-story-primitives.test.tsx`

**Interfaces:**
- Consumes: `ReactNode` from React and the existing font/color custom properties supplied by `PhilooStoryShell`.
- Produces:

```ts
export type PhilooStoryFolioMode =
  | "conversation"
  | "illustrated"
  | "workbench"
  | "reflection";

export type PhilooStoryFolioProps = {
  title: string;
  titleId: string;
  mode: PhilooStoryFolioMode;
  character: ReactNode;
  primary: ReactNode;
  secondary?: ReactNode;
  activity?: ReactNode;
  className?: string;
};
```

- Produces stable inspection hooks: `data-philoo-story-folio`, `data-folio-mode`, `data-folio-chapter-tab`, and `data-folio-slot`.

- [ ] **Step 1: Write the failing primitive contract test**

Add the import:

```tsx
import { PhilooStoryFolio } from "./philoo-story-folio";
```

Add this focused test to `philoo-story-primitives.test.tsx`:

```tsx
it("renders one layered story folio with semantic named slots", () => {
  const { container } = render(
    <PhilooStoryFolio
      title="Mais fundo"
      titleId="folio-title"
      mode="conversation"
      character={<div>Platão guia</div>}
      primary={<div>Fala de Platão</div>}
    />,
  );

  const folio = container.querySelector("[data-philoo-story-folio]");

  expect(folio).toHaveAttribute("data-folio-mode", "conversation");
  expect(
    screen.getByRole("heading", { name: "Mais fundo", level: 1 }),
  ).toHaveAttribute("data-folio-chapter-tab");
  expect(
    container.querySelector('[data-folio-slot="character"]'),
  ).toHaveTextContent("Platão guia");
  expect(
    container.querySelector('[data-folio-slot="primary"]'),
  ).toHaveTextContent("Fala de Platão");
  expect(
    container.querySelector('[data-folio-slot="secondary"]'),
  ).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```bash
npm test -- src/domains/lessons/philoo-story-primitives.test.tsx
```

Expected: FAIL because `./philoo-story-folio` does not exist.

- [ ] **Step 3: Implement the slotted folio component**

Create `philoo-story-folio.tsx` with this structure:

```tsx
import type { ReactNode } from "react";
import styles from "./philoo-story-folio.module.css";

export type PhilooStoryFolioMode =
  | "conversation"
  | "illustrated"
  | "workbench"
  | "reflection";

export type PhilooStoryFolioProps = {
  title: string;
  titleId: string;
  mode: PhilooStoryFolioMode;
  character: ReactNode;
  primary: ReactNode;
  secondary?: ReactNode;
  activity?: ReactNode;
  className?: string;
};

export function PhilooStoryFolio({
  title,
  titleId,
  mode,
  character,
  primary,
  secondary,
  activity,
  className,
}: PhilooStoryFolioProps) {
  return (
    <div
      className={[styles.folio, className].filter(Boolean).join(" ")}
      data-philoo-story-folio
      data-folio-mode={mode}
    >
      <span className={styles.backSheet} aria-hidden="true" />
      <span className={styles.middleSheet} aria-hidden="true" />

      <div className={styles.page}>
        <h1
          id={titleId}
          className={styles.chapterTab}
          data-folio-chapter-tab
        >
          {title}
        </h1>

        <div className={styles.composition}>
          <div className={styles.character} data-folio-slot="character">
            {character}
          </div>
          <div className={styles.primary} data-folio-slot="primary">
            {primary}
          </div>
          {secondary ? (
            <div className={styles.secondary} data-folio-slot="secondary">
              {secondary}
            </div>
          ) : null}
          {activity ? (
            <div className={styles.activity} data-folio-slot="activity">
              {activity}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Implement the folio material and layout contract**

Create `philoo-story-folio.module.css` around these exact rules:

```css
.folio {
  --folio-cream: #fbf8f3;
  --folio-pale-blue: #ddf4fc;
  --folio-cyan: #33bfed;
  --folio-blue: #5bb8f5;
  --folio-ink: #17324a;
  position: relative;
  height: 100%;
  min-height: 0;
  container: philoo-folio / inline-size;
  isolation: isolate;
}

.backSheet,
.middleSheet,
.page {
  position: absolute;
  border-radius: clamp(26px, 3vw, 44px);
}

.backSheet {
  z-index: 0;
  inset: 10px 0 0 10px;
  background: var(--folio-cyan);
  box-shadow: 0 18px 36px rgba(23, 50, 74, 0.14);
}

.middleSheet {
  z-index: 1;
  inset: 5px 5px 5px 5px;
  background: var(--folio-pale-blue);
  border: 2px solid rgba(255, 255, 255, 0.86);
}

.page {
  z-index: 2;
  inset: 0 10px 10px 0;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.96);
  background: var(--folio-cream);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.98),
    0 8px 18px rgba(47, 101, 126, 0.08);
}

.chapterTab {
  position: absolute;
  z-index: 4;
  top: 0;
  left: 50%;
  margin: 0;
  padding: 10px 22px 9px;
  border: 2px solid rgba(91, 184, 245, 0.24);
  border-top: 0;
  border-radius: 0 0 18px 18px;
  background: rgba(221, 244, 252, 0.92);
  color: var(--folio-ink);
  box-shadow:
    0 5px 0 rgba(91, 184, 245, 0.24),
    inset 0 1px rgba(255, 255, 255, 0.92);
  font-family: var(--font-display), "Baloo 2", sans-serif;
  font-size: clamp(1.1rem, 1.6vw, 1.4rem);
  font-weight: 900;
  line-height: 1;
  transform: translateX(-50%);
}

.composition {
  height: 100%;
  min-height: 0;
  padding: clamp(76px, 10dvh, 104px) clamp(30px, 4.5vw, 66px)
    clamp(28px, 4dvh, 48px);
  display: grid;
  align-items: center;
  gap: clamp(28px, 4vw, 64px);
}

.folio[data-folio-mode="conversation"] .composition {
  grid-template-areas: "primary character";
  grid-template-columns: minmax(330px, 0.96fr) minmax(280px, 0.78fr);
  justify-content: center;
}

.character {
  grid-area: character;
  min-width: 0;
  align-self: end;
  justify-self: center;
}

.primary {
  grid-area: primary;
  min-width: 0;
  justify-self: center;
}

.secondary {
  grid-area: secondary;
  min-width: 0;
}

.activity {
  grid-area: activity;
  min-width: 0;
  min-height: 0;
}

.folio[data-folio-mode="illustrated"] .composition {
  grid-template-areas: "character secondary" "character primary";
  grid-template-columns: minmax(260px, 0.7fr) minmax(420px, 1fr);
  grid-template-rows: minmax(0, 1fr) auto;
}

.folio[data-folio-mode="workbench"] .composition {
  grid-template-areas: "character primary" "activity activity";
  grid-template-columns: minmax(180px, 0.32fr) minmax(0, 1fr);
  grid-template-rows: auto minmax(0, 1fr);
}

.folio[data-folio-mode="reflection"] .composition {
  grid-template-areas: "primary character";
  grid-template-columns: minmax(0, 1fr) minmax(230px, 0.48fr);
}

@container philoo-folio (max-width: 760px) {
  .folio[data-folio-mode] .composition {
    grid-template-columns: minmax(0, 1fr);
    padding: 70px 20px 18px;
    gap: 10px;
  }

  .folio[data-folio-mode="conversation"] .composition,
  .folio[data-folio-mode="reflection"] .composition {
    grid-template-areas: "primary" "character";
    grid-template-rows: auto minmax(0, 1fr);
  }

  .folio[data-folio-mode="illustrated"] .composition {
    grid-template-areas: "secondary" "primary" "character";
    grid-template-rows: auto auto minmax(0, 1fr);
  }

  .folio[data-folio-mode="workbench"] .composition {
    grid-template-areas: "primary" "activity" "character";
    grid-template-rows: auto minmax(0, 1fr) auto;
  }
}

@media (max-height: 740px) and (min-width: 621px) {
  .composition {
    padding-top: 64px;
    padding-bottom: 18px;
  }

  .chapterTab {
    padding-block: 8px 7px;
    font-size: 1.08rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .folio *,
  .folio *::before,
  .folio *::after {
    scroll-behavior: auto;
  }
}
```

The implementation may tighten individual numeric values during the final visual check, but it must preserve this three-layer construction, attached chapter tab, named grid areas, and query boundaries.

- [ ] **Step 5: Run the primitive test and lint**

Run:

```bash
npm test -- src/domains/lessons/philoo-story-primitives.test.tsx
npx eslint src/domains/lessons/philoo-story-folio.tsx src/domains/lessons/philoo-story-primitives.test.tsx
```

Expected: all focused tests PASS and ESLint reports no errors.

- [ ] **Step 6: Commit the primitive**

```bash
git add src/domains/lessons/philoo-story-folio.tsx src/domains/lessons/philoo-story-folio.module.css src/domains/lessons/philoo-story-primitives.test.tsx
git commit -m "feat: add Philoo story folio primitive"
```

---

### Task 2: Add the opt-in folio treatment to the shared shell

**Files:**
- Modify: `src/domains/lessons/philoo-story-shell.tsx`
- Modify: `src/domains/lessons/philoo-story-shell.module.css`
- Modify: `src/domains/lessons/philoo-story-primitives.test.tsx`

**Interfaces:**
- Consumes: the existing `PhilooStoryShellProps`.
- Produces: `surfaceTreatment?: "standard" | "folio"` with default `"standard"`, exposed as `data-surface-treatment` on the story surface.
- Preserves: existing `data-phase`, `data-surface-width`, `PhilooSoftFrame`, journey layout, and leaving animation contracts.

- [ ] **Step 1: Write the failing shell-treatment test**

Add this test:

```tsx
it("lets a folio own the main surface material without changing shell semantics", () => {
  const { container } = render(
    <PhilooStoryShell
      backHref="/aula/as-sombras/a-descida"
      currentBeat={3}
      totalBeats={10}
      labelledBy="folio-shell-title"
      phase="idle"
      surfaceWidth="narrative"
      surfaceTreatment="folio"
      showSoftFrame={false}
    >
      <PhilooStoryFolio
        title="Mais fundo"
        titleId="folio-shell-title"
        mode="conversation"
        character={<span>Platão</span>}
        primary={<span>História</span>}
      />
    </PhilooStoryShell>,
  );

  const surface = container.querySelector("[data-philoo-story-shell]");

  expect(surface).toHaveAttribute("data-surface-treatment", "folio");
  expect(surface).toHaveAttribute("aria-labelledby", "folio-shell-title");
  expect(container.querySelector("[data-philoo-soft-frame]")).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```bash
npm test -- src/domains/lessons/philoo-story-primitives.test.tsx
```

Expected: FAIL because `surfaceTreatment` is not part of `PhilooStoryShellProps`.

- [ ] **Step 3: Add the shell prop and data contract**

Extend the prop type:

```ts
surfaceTreatment?: "standard" | "folio";
```

Default it in the function signature:

```ts
surfaceTreatment = "standard",
```

Add the attribute to the existing story `<section>`:

```tsx
data-surface-treatment={surfaceTreatment}
```

- [ ] **Step 4: Make only the opted-in wrapper visually neutral**

Add to `philoo-story-shell.module.css`:

```css
.storySurface[data-surface-treatment="folio"] {
  overflow: visible;
  border-color: transparent;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.storySurface[data-surface-treatment="folio"] .storyContent {
  height: 100%;
  min-height: 0;
}
```

Do not change the default `.storySurface` rules.

- [ ] **Step 5: Run the shell tests and lint**

Run:

```bash
npm test -- src/domains/lessons/philoo-story-primitives.test.tsx
npx eslint src/domains/lessons/philoo-story-shell.tsx src/domains/lessons/philoo-story-primitives.test.tsx
```

Expected: all focused tests PASS and ESLint reports no errors.

- [ ] **Step 6: Commit the shell contract**

```bash
git add src/domains/lessons/philoo-story-shell.tsx src/domains/lessons/philoo-story-shell.module.css src/domains/lessons/philoo-story-primitives.test.tsx
git commit -m "feat: let story folios own lesson surfaces"
```

---

### Task 3: Convert `Mais fundo` to the Story Folio

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-prisoner-wall-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx`

**Interfaces:**
- Consumes: `PhilooStoryFolio`, `surfaceTreatment="folio"`, `PhilooDialogueCard`, and `PlatoGuide`.
- Produces: the current scene as `data-folio-mode="conversation"` with its heading in `data-folio-chapter-tab`.
- Preserves: all three dialogue beats, Plato pose changes, focus transfer, final href, phase handling, and journey state.

- [ ] **Step 1: Extend the scene test with the folio acceptance contract**

In the existing story-beat test, add:

```tsx
const folio = container.querySelector("[data-philoo-story-folio]");

expect(folio).toHaveAttribute("data-folio-mode", "conversation");
expect(container.querySelector("[data-philoo-story-shell]")).toHaveAttribute(
  "data-surface-treatment",
  "folio",
);
expect(
  screen.getByRole("heading", { name: "Mais fundo", level: 1 }),
).toHaveAttribute("data-folio-chapter-tab");
expect(
  container.querySelector('[data-folio-slot="character"]'),
).toContainElement(screen.getByRole("img"));
expect(
  container.querySelector('[data-folio-slot="primary"]'),
).toContainElement(screen.getByRole("status"));
```

- [ ] **Step 2: Run the scene test to verify it fails**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx
```

Expected: FAIL because the scene has not adopted the folio.

- [ ] **Step 3: Replace the independent scene layout with the folio**

Add:

```tsx
import { PhilooStoryFolio } from "../philoo-story-folio";
```

Pass this prop to `PhilooStoryShell`:

```tsx
surfaceTreatment="folio"
```

Replace the `storyLayout` wrapper, floating heading, `dialogueSlot`, and `guideSlot` with:

```tsx
<PhilooStoryFolio
  title={SCENE_TITLE}
  titleId="descent-journey-title"
  mode="conversation"
  character={
    <PlatoGuide
      pose={PLATO_BY_BEAT[dialogueIndex]}
      stageBeat={dialogueIndex}
      priority
    />
  }
  primary={
    <PhilooDialogueCard
      speaker="Platão"
      currentBeat={dialogueIndex + 1}
      totalBeats={DIALOGUE_BEATS.length}
      action={
        isLastBeat ? (
          <Link
            ref={finalActionRef}
            href={NEXT_SCENE}
            onClick={beginNavigation}
            aria-disabled={phase === "leaving"}
          >
            Chegar mais perto
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
        {DIALOGUE_BEATS[dialogueIndex]}
      </p>
    </PhilooDialogueCard>
  }
/>
```

Do not remove shared classes from `cave-soft-story-layout.module.css`; the other scenes still use them.

- [ ] **Step 4: Run the scene and primitive tests**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx src/domains/lessons/philoo-story-primitives.test.tsx
```

Expected: all focused tests PASS, including dialogue progression and focus assertions.

- [ ] **Step 5: Verify the one-scene trial visually**

Open `/aula/as-sombras/so-a-parede` and inspect these viewports:

- `1280 × 720`: folio and journey rail fit without page scrolling; Plato and dialogue share a visual baseline.
- `1024 × 768`: the composition remains legible with the journey rail expanded.
- `768 × 1024`: the fixed journey overlay does not cover the dialogue action.
- `390 × 844`: chapter tab, dialogue, Plato, and action fit within the lesson viewport; no horizontal overflow.

At each viewport verify:

- the cyan backing is visible only down and right;
- the chapter tab reads as attached to the folio;
- Plato is grounded rather than floating;
- dialogue and Plato read as one composition;
- no notebook lines were copied into the folio;
- the journey rail did not visually or behaviorally change;
- all three dialogue beats remain usable.

- [ ] **Step 6: Run focused quality checks**

Run:

```bash
npx eslint src/domains/lessons/philoo-story-folio.tsx src/domains/lessons/philoo-story-shell.tsx src/domains/lessons/as-sombras/cave-prisoner-wall-scene.tsx src/domains/lessons/philoo-story-primitives.test.tsx src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx
git diff --check
```

Expected: no lint errors and no whitespace errors.

- [ ] **Step 7: Commit the first Story Folio scene**

```bash
git add src/domains/lessons/as-sombras/cave-prisoner-wall-scene.tsx src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx
git commit -m "feat: present Mais fundo as a story folio"
```
