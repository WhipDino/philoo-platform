# Philoo Scene 3 Story Stage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Scene 3's monolithic generated illustration with a responsive, layered Philoo Story Stage that advances visually with its three existing dialogue beats.

**Architecture:** Keep `CavePrisonerWallScene` responsible for dialogue and navigation. Add a focused `CavePrisonerWallStage` client component that receives only the current beat and renders the cave, inquiry path, prisoner tableau, wall glow, and approved transparent Platão asset as separate SVG/CSS/Image layers. Motion for React animates only beat-driven state changes; semantic content remains HTML.

**Tech Stack:** Next.js 16.2.12, React 19.2.4, TypeScript, CSS Modules, inline SVG, Motion for React, Vitest, Testing Library

## Global Constraints

- Modify only Scene 3 at `/aula/as-sombras/so-a-parede`.
- Keep the three existing Portuguese dialogue strings unchanged.
- Keep progress `3/10`, previous route `/aula/as-sombras/a-descida`, and next route `/aula/as-sombras/eles-dao-nomes`.
- Keep Scene 4 and `/aula/as-sombras/eles-dao-nomes` unchanged.
- Reuse `public/images/story/plato-descent-v1.png`; do not generate a new pose in this experiment.
- Stop referencing the two full-frame journey images from Scene 3, but do not delete them.
- Add only the `motion` runtime dependency.
- Respect reduced motion, keyboard focus, polite announcements, and `44×44px` touch targets.
- Verify `1440×900`, `1366×768`, `1024×768`, `768×1024`, `390×844`, and `360×800`.

---

### Task 1: Layered Story Stage

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/domains/lessons/as-sombras/cave-prisoner-wall-stage.tsx`
- Create: `src/domains/lessons/as-sombras/cave-prisoner-wall-stage.module.css`
- Create: `src/domains/lessons/as-sombras/cave-prisoner-wall-stage.test.tsx`

**Interfaces:**
- Consumes: `beat: 0 | 1 | 2`
- Produces: `CavePrisonerWallStage({ beat }: CavePrisonerWallStageProps)`
- Exposes one accessible image description and decorative layers hidden from assistive technology.

- [ ] **Step 1: Install the animation dependency**

Run:

```bash
npm install motion
```

Expected: `package.json` contains a production dependency named `motion` and
`package-lock.json` records the exact resolved version.

- [ ] **Step 2: Write the failing stage test**

Create `cave-prisoner-wall-stage.test.tsx`:

```tsx
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { CavePrisonerWallStage } from "./cave-prisoner-wall-stage";

afterEach(cleanup);

it("describes the layered descent and exposes the current story beat", () => {
  const { rerender } = render(<CavePrisonerWallStage beat={0} />);

  expect(
    screen.getByRole("img", {
      name: /platão conduz o caminho para três pessoas/i,
    }),
  ).toHaveAttribute("data-stage-beat", "0");

  rerender(<CavePrisonerWallStage beat={2} />);
  expect(screen.getByRole("img")).toHaveAttribute("data-stage-beat", "2");
});
```

- [ ] **Step 3: Run the test and confirm the missing component failure**

Run:

```bash
npm test -- cave-prisoner-wall-stage.test.tsx
```

Expected: FAIL because `./cave-prisoner-wall-stage` does not exist.

- [ ] **Step 4: Implement the stage component**

Create the component with this contract and layer order:

```tsx
"use client";

import Image from "next/image";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import * as m from "motion/react-m";
import styles from "./cave-prisoner-wall-stage.module.css";

export type CavePrisonerWallBeat = 0 | 1 | 2;

export type CavePrisonerWallStageProps = {
  beat: CavePrisonerWallBeat;
};

export function CavePrisonerWallStage({
  beat,
}: CavePrisonerWallStageProps) {
  const pathProgress = [0.34, 0.7, 1][beat];
  const prisonersVisible = beat >= 1;
  const wallVisible = beat >= 2;

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <div
          className={styles.stage}
          role="img"
          aria-label="Platão conduz o caminho para três pessoas no fundo da caverna, diante de uma parede iluminada"
          data-stage-beat={beat}
        >
          <div className={styles.caveTexture} aria-hidden="true" />

          <svg
            className={styles.stageDrawing}
            viewBox="0 0 1200 760"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="scene-three-entrance">
                <stop offset="0" stopColor="#BDEEFF" stopOpacity="0.88" />
                <stop offset="1" stopColor="#5BB8F5" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="scene-three-wall">
                <stop offset="0" stopColor="#F6C66D" stopOpacity="0.78" />
                <stop offset="1" stopColor="#F6C66D" stopOpacity="0" />
              </radialGradient>
            </defs>

            <path className={styles.archBack} d="M0 0H1200V760H0Z" />
            <path
              className={styles.archMiddle}
              d="M0 0H1200V760H1020C900 635 860 420 925 0H0Z"
            />
            <path
              className={styles.archFront}
              d="M0 0H1200V760H0V0ZM210 760C278 520 430 325 650 270C815 230 986 302 1200 520V760Z"
              fillRule="evenodd"
            />

            <m.ellipse
              className={styles.entranceGlow}
              cx="292"
              cy="378"
              rx="250"
              ry="300"
              animate={{ opacity: beat === 0 ? 0.72 : 0.2 }}
              transition={{ duration: 0.55 }}
            />

            <m.path
              className={styles.inquiryPath}
              d="M850 664C790 610 727 578 693 528C660 480 663 425 633 377"
              initial={false}
              animate={{ pathLength: pathProgress, opacity: 1 }}
              transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            />

            <m.ellipse
              className={styles.wallGlow}
              cx="642"
              cy="300"
              rx="210"
              ry="245"
              initial={false}
              animate={{
                opacity: wallVisible ? 0.92 : 0,
                scale: wallVisible ? 1 : 0.9,
              }}
              transition={{ duration: 0.58 }}
            />

            <m.g
              className={styles.prisoners}
              initial={false}
              animate={{
                opacity: prisonersVisible ? 1 : 0.18,
                scale: prisonersVisible ? 1 : 0.96,
              }}
              transition={{ duration: 0.5 }}
            >
              <circle cx="596" cy="326" r="17" />
              <path d="M574 390C575 348 584 338 596 338C608 338 617 348 618 390Z" />
              <circle cx="640" cy="321" r="17" />
              <path d="M618 388C619 343 628 333 640 333C652 333 661 343 662 388Z" />
              <circle cx="684" cy="329" r="17" />
              <path d="M662 394C663 351 672 341 684 341C696 341 705 351 706 394Z" />
            </m.g>
          </svg>

          <div className={styles.platoGrounding} aria-hidden="true" />
          <Image
            className={styles.plato}
            src="/images/story/plato-descent-v1.png"
            alt=""
            width={1018}
            height={1544}
            sizes="(max-width: 620px) 150px, (max-width: 900px) 220px, 300px"
            priority
          />
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}
```

- [ ] **Step 5: Build the responsive stage styling**

Create `cave-prisoner-wall-stage.module.css` with these exact responsibilities:

```css
.stage {
  position: absolute;
  inset: 0;
  z-index: -3;
  overflow: hidden;
  background: #0a1a2b;
  pointer-events: none;
}

.caveTexture {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(7, 20, 34, 0.72), rgba(7, 20, 34, 0.2)),
    url("/images/story/cave-descent-background.webp") center / cover no-repeat;
  filter: saturate(0.72) contrast(0.92);
  opacity: 0.42;
}

.stageDrawing {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.archBack { fill: rgba(7, 20, 34, 0.34); }
.archMiddle { fill: rgba(10, 27, 45, 0.28); }
.archFront { fill: rgba(5, 15, 27, 0.36); }
.entranceGlow { fill: url("#scene-three-entrance"); }
.wallGlow { fill: url("#scene-three-wall"); transform-origin: 642px 300px; }

.inquiryPath {
  fill: none;
  stroke: #33bfed;
  stroke-width: 8;
  stroke-linecap: round;
  filter: drop-shadow(0 0 12px rgba(51, 191, 237, 0.68));
}

.prisoners {
  fill: #172637;
  stroke: rgba(246, 198, 109, 0.34);
  stroke-width: 2;
  transform-origin: 640px 365px;
}

.plato {
  position: absolute;
  right: clamp(34px, 7vw, 112px);
  bottom: -3%;
  width: clamp(220px, 22vw, 305px);
  height: auto;
  filter:
    drop-shadow(-12px 24px 24px rgba(2, 9, 17, 0.44))
    saturate(0.9)
    brightness(0.92);
}

.platoGrounding {
  position: absolute;
  right: clamp(28px, 6vw, 104px);
  bottom: 1.5%;
  width: clamp(230px, 24vw, 330px);
  height: 9%;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(2, 8, 15, 0.58), transparent 68%);
}

@media (max-width: 900px) {
  .plato { right: 4%; width: clamp(190px, 26vw, 245px); }
  .platoGrounding { right: 2%; width: 260px; }
}

@media (max-width: 620px) {
  .caveTexture { background-position: 42% center; opacity: 0.34; }
  .stageDrawing { left: -44%; width: 188%; }
  .plato { right: 4%; bottom: 1%; width: 150px; }
  .platoGrounding { right: 0; bottom: 4%; width: 175px; }
}

@media (prefers-reduced-motion: reduce) {
  .stage * { animation: none !important; transition: none !important; }
}
```

Tune only geometry and color after browser inspection; do not replace the
layered model with a new full-frame illustration.

- [ ] **Step 6: Run the stage test**

Run:

```bash
npm test -- cave-prisoner-wall-stage.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit the stage**

```bash
git add package.json package-lock.json \
  src/domains/lessons/as-sombras/cave-prisoner-wall-stage.tsx \
  src/domains/lessons/as-sombras/cave-prisoner-wall-stage.module.css \
  src/domains/lessons/as-sombras/cave-prisoner-wall-stage.test.tsx
git commit -m "feat: add layered Cave story stage"
```

---

### Task 2: Integrate Scene 3 and preserve its interaction contract

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-prisoner-wall-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-prisoner-wall-scene.module.css`
- Modify: `src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx`

**Interfaces:**
- Consumes: `CavePrisonerWallStage` and `CavePrisonerWallBeat`
- Produces: Scene 3 with unchanged copy/routes and a beat-driven visual stage.

- [ ] **Step 1: Extend the existing test before integration**

Add focus and stage assertions:

```tsx
expect(screen.getByRole("img")).toHaveAttribute("data-stage-beat", "0");

const continueButton = screen.getByRole("button", { name: "Continuar" });
continueButton.focus();
fireEvent.click(continueButton);
expect(screen.getByRole("img")).toHaveAttribute("data-stage-beat", "1");
expect(screen.getByRole("button", { name: "Continuar" })).toHaveFocus();

fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
expect(screen.getByRole("img")).toHaveAttribute("data-stage-beat", "2");
const finalAction = screen.getByRole("link", { name: "Chegar mais perto" });
expect(finalAction).toHaveFocus();
```

Retain every existing content and route assertion.

- [ ] **Step 2: Run the focused test and confirm failure**

Run:

```bash
npm test -- cave-prisoner-wall-scene.test.tsx
```

Expected: FAIL because the current full-frame image has no `data-stage-beat`
and the final link does not receive focus.

- [ ] **Step 3: Integrate the layered stage**

In `cave-prisoner-wall-scene.tsx`:

- remove the `next/image` import and both full-frame `<Image>` elements;
- import `useEffect`, `useRef`, and the new stage;
- type `dialogueIndex` as `CavePrisonerWallBeat`;
- render `<CavePrisonerWallStage beat={dialogueIndex} />`;
- keep the card mounted and key only a `.dialogueContent` child;
- attach `finalActionRef` to the final link and focus it when `isLastBeat`
  changes to `true`.

Use this state transition:

```tsx
const NEXT_BEAT: Record<CavePrisonerWallBeat, CavePrisonerWallBeat> = {
  0: 1,
  1: 2,
  2: 2,
};

const [dialogueIndex, setDialogueIndex] =
  useState<CavePrisonerWallBeat>(0);
const finalActionRef = useRef<HTMLAnchorElement>(null);

useEffect(() => {
  if (isLastBeat) finalActionRef.current?.focus();
}, [isLastBeat]);

function continueStory() {
  setDialogueIndex((current) => NEXT_BEAT[current]);
}
```

- [ ] **Step 4: Remove obsolete artwork styling**

Delete `.journeyArtwork`, `.desktopArtwork`, `.mobileArtwork`, and their image
breakpoint rules from `cave-prisoner-wall-scene.module.css`. Preserve the page,
topbar, stage shell, card, CTA, transition, and reduced-motion rules.

Move `dialogue-arrives` from the entire `.speechBubble` to a new
`.dialogueContent` so the focused button is not remounted between beats.

- [ ] **Step 5: Run both focused tests**

Run:

```bash
npm test -- cave-prisoner-wall-stage.test.tsx cave-prisoner-wall-scene.test.tsx
```

Expected: 2 test files pass.

- [ ] **Step 6: Verify the browser composition**

Inspect all three beats at:

- `1440×900`
- `1366×768`
- `1024×768`
- `768×1024`
- `390×844`
- `360×800`

Confirm:

- the card never covers Platão, the prisoner tableau, or the path destination;
- Platão's face and lamp remain legible;
- beat 1 emphasizes the entrance;
- beat 2 reveals the prisoners;
- beat 3 reveals the wall;
- no monolithic journey image is requested by the route;
- reduced motion shows each beat's completed state without spatial travel;
- Scene 4 is unchanged.

- [ ] **Step 7: Run the full suite**

Run:

```bash
npm test
```

Expected: all test files pass with zero unhandled errors.

- [ ] **Step 8: Commit the integration**

```bash
git add src/domains/lessons/as-sombras/cave-prisoner-wall-scene.tsx \
  src/domains/lessons/as-sombras/cave-prisoner-wall-scene.module.css \
  src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx
git commit -m "feat: turn Scene 3 into a Philoo story stage"
```
