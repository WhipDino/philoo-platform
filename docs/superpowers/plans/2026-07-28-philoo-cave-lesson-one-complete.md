# Philoo Cave Lesson One Complete Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the first Cave lesson as a nine-stage, 12–15 minute story that teaches how appearances become beliefs, introduces dóxa, includes two scaffolded activities, and ends at the prisoner's first turn.

**Architecture:** Preserve the existing `PhilooStoryShell` and folio composition, expanding the journey from five to nine semantic stages. Add one reusable accessible activity-briefing dialog and two focused interaction primitives, then implement each new stage as an isolated route/component with its own test. Existing discovery-table mechanics remain reusable, but the Cave classification content becomes a four-card, prisoner-viewpoint application after the concept has been taught.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, CSS Modules, Motion 12, Phosphor Icons, Vitest 4, Testing Library, Next Image, image generation with the canonical Platão reference.

## Global Constraints

- Preserve Philoo blues `#33BFED` and `#5BB8F5`, cream `#FBF8F3`, and deep navy text.
- Preserve the approved folio surface, right journey rail, tactile offset layers, rounded typography, and cartoonish-but-not-infantile rendering.
- Platão must match the canonical approved face, height, proportions, clothing, and rendering style.
- Each new Platão pose must face or gesture toward the element referenced by its dialogue.
- Use nine visible journey stages; internal dialogue beats do not create extra rail entries.
- Keep the experience complete without a teacher and free of points, lives, streaks, punishment, or countdown timers.
- Show an accessible briefing dialog before each substantial activity and keep a persistent `Como jogar` control.
- Desktop/tablet may drag; phone and keyboard always receive equivalent tap/button placement.
- Never animate height or width during route transitions.
- Reserve image dimensions before decode.
- Resolve the transient oversized-card navigation defect before completion.
- No sound design, teacher dashboard, analytics UI, Lesson Two, or Lesson Three implementation.

---

## File structure

### Shared interaction units

- `src/domains/lessons/interactions/philoo-activity-briefing.tsx` — native modal dialog, focus lifecycle, Platão guide, instructions, and demonstration slot.
- `src/domains/lessons/interactions/philoo-activity-briefing.module.css` — tactile Philoo dialog layout across desktop, tablet, and phone.
- `src/domains/lessons/interactions/philoo-activity-briefing.test.tsx` — open, close, reopen, focus, and content behavior.
- `src/domains/lessons/interactions/philoo-causal-path.tsx` — ordered light/object/shadow/name activity with drag and tap equivalence.
- `src/domains/lessons/interactions/philoo-causal-path.module.css` — connected causal path and responsive sequential layout.
- `src/domains/lessons/interactions/philoo-causal-path.test.tsx` — ordering, correction, completion, and keyboard behavior.

### Cave stages

- `src/domains/lessons/as-sombras/cave-shadow-game-scene.tsx` — non-punitive fast-recognition participation stage.
- `src/domains/lessons/as-sombras/cave-shadow-game-scene.module.css`
- `src/domains/lessons/as-sombras/cave-shadow-game-scene.test.tsx`
- `src/domains/lessons/as-sombras/cave-behind-wall-scene.tsx` — three-step causal reveal.
- `src/domains/lessons/as-sombras/cave-behind-wall-scene.module.css`
- `src/domains/lessons/as-sombras/cave-behind-wall-scene.test.tsx`
- `src/domains/lessons/as-sombras/cave-shadow-path-scene.tsx` — briefing plus causal-path activity.
- `src/domains/lessons/as-sombras/cave-shadow-path-scene.module.css`
- `src/domains/lessons/as-sombras/cave-shadow-path-scene.test.tsx`
- `src/domains/lessons/as-sombras/cave-doxa-scene.tsx` — concept, Greek form, cave example, modern example, and application.
- `src/domains/lessons/as-sombras/cave-doxa-scene.module.css`
- `src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx`
- `src/domains/lessons/as-sombras/cave-first-doubt-scene.tsx` — anomaly, reflection, Platão response, and cliffhanger.
- `src/domains/lessons/as-sombras/cave-first-doubt-scene.module.css`
- `src/domains/lessons/as-sombras/cave-first-doubt-scene.test.tsx`

### Routes

- `src/app/aula/as-sombras/jogo-da-parede/page.tsx`
- `src/app/aula/as-sombras/o-que-existe-atras/page.tsx`
- `src/app/aula/as-sombras/caminho-da-sombra/page.tsx`
- `src/app/aula/as-sombras/doxa/page.tsx`
- `src/app/aula/as-sombras/a-primeira-duvida/page.tsx`

### Existing units modified

- `src/domains/lessons/as-sombras/as-sombras-journey.ts`
- `src/domains/lessons/as-sombras/cave-shadow-names-scene.tsx`
- `src/domains/lessons/as-sombras/cave-evidence-sort-scene.tsx`
- `src/domains/lessons/as-sombras/cave-evidence-sort-scene.test.tsx`
- `src/domains/lessons/as-sombras/cave-evidence-sort-scene.module.css`
- `src/domains/lessons/plato-pose-catalog.ts`
- `src/domains/lessons/philoo-story-shell.tsx`
- `src/domains/lessons/philoo-story-shell.module.css`
- `src/domains/lessons/use-story-scene-transition.ts`
- `src/domains/lessons/use-story-scene-transition.test.tsx`

### Generated assets

- `public/images/story/plato-v2/plato-shadow-celebration-v1.png`
- `public/images/story/plato-v2/plato-curious-interruption-v1.png`
- `public/images/story/plato-v2/plato-reveal-behind-v1.png`
- `public/images/story/plato-v2/plato-causal-path-v1.png`
- `public/images/story/plato-v2/plato-doxa-v1.png`
- `public/images/story/plato-v2/plato-first-doubt-v1.png`
- `public/images/story/plato-v2/plato-invite-turn-v1.png`
- `public/images/story/cave-shadow-recognition-set-v1.webp`
- `public/images/story/cave-behind-wall-layers-v1.webp`
- `public/images/story/cave-cropped-event-v1.webp`
- `public/images/story/cave-anomaly-v1.webp`

---

### Task 1: Lock the nine-stage journey and route chain

**Files:**
- Modify: `src/domains/lessons/as-sombras/as-sombras-journey.ts`
- Modify: `src/domains/lessons/as-sombras/cave-shadow-names-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-descent-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-descent-scene.test.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-prisoner-wall-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx`
- Create: `src/domains/lessons/as-sombras/as-sombras-journey.test.ts`

**Interfaces:**
- Consumes: `LessonJourneyStage` and the five existing scene IDs.
- Produces: `AS_SOMBRAS_JOURNEY_STAGES` containing nine semantic stages and the next route `/aula/as-sombras/jogo-da-parede`.

- [ ] **Step 1: Write the failing journey test**

```ts
import { expect, it } from "vitest";
import { AS_SOMBRAS_JOURNEY_STAGES } from "./as-sombras-journey";

it("defines the complete nine-stage first cave lesson", () => {
  expect(AS_SOMBRAS_JOURNEY_STAGES.map((stage) => stage.id)).toEqual([
    "comeco",
    "descida",
    "quem-vive-aqui",
    "jogo-da-parede",
    "o-que-existe-atras",
    "caminho-da-sombra",
    "doxa",
    "o-que-chegou",
    "primeira-duvida",
  ]);
  expect(AS_SOMBRAS_JOURNEY_STAGES[3].sceneIds).toEqual([
    "eles-dao-nomes",
    "jogo-da-parede",
  ]);
  expect(AS_SOMBRAS_JOURNEY_STAGES.at(-1)?.href).toBe(
    "/aula/as-sombras/a-primeira-duvida",
  );
});
```

- [ ] **Step 2: Run the test and verify the five-stage journey fails**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/as-sombras-journey.test.ts
```

Expected: FAIL because the current journey has five IDs.

- [ ] **Step 3: Replace the journey data with nine semantic stages**

```ts
export const AS_SOMBRAS_JOURNEY_STAGES = [
  { id: "comeco", label: "O começo da história", sceneIds: ["primeira-tela"], href: "/aula/as-sombras/primeira-tela" },
  { id: "descida", label: "A descida", sceneIds: ["a-descida"], href: "/aula/as-sombras/a-descida" },
  { id: "quem-vive-aqui", label: "Quem vive aqui", sceneIds: ["so-a-parede"], href: "/aula/as-sombras/so-a-parede" },
  { id: "jogo-da-parede", label: "O jogo da parede", sceneIds: ["eles-dao-nomes", "jogo-da-parede"], href: "/aula/as-sombras/eles-dao-nomes" },
  { id: "o-que-existe-atras", label: "O que existe atrás", sceneIds: ["o-que-existe-atras"], href: "/aula/as-sombras/o-que-existe-atras" },
  { id: "caminho-da-sombra", label: "O caminho da sombra", sceneIds: ["caminho-da-sombra"], href: "/aula/as-sombras/caminho-da-sombra" },
  { id: "doxa", label: "Uma palavra da filosofia", sceneIds: ["doxa"], href: "/aula/as-sombras/doxa" },
  { id: "o-que-chegou", label: "O que chegou até eles", sceneIds: ["o-que-chegou-ate-eles"], href: "/aula/as-sombras/o-que-chegou-ate-eles" },
  { id: "primeira-duvida", label: "A primeira dúvida", sceneIds: ["a-primeira-duvida"], href: "/aula/as-sombras/a-primeira-duvida" },
] as const satisfies readonly LessonJourneyStage[];
```

Change `NEXT_SCENE` in `cave-shadow-names-scene.tsx` to:

```ts
const NEXT_SCENE = "/aula/as-sombras/jogo-da-parede";
```

- [ ] **Step 4: Preserve the descent as a participation beat**

Add one ungraded light/path action inside `cave-descent-scene.tsx`. It advances
the visual path once, changes the copy from `A entrada ainda está perto` to
`A luz ficou para trás`, and only then reveals the existing route action
**Chegar até elas**. Use a normal button with `aria-pressed`, not a gesture-only
surface.

Add this test behavior:

```tsx
expect(
  screen.queryByRole("link", { name: "Chegar até elas" }),
).not.toBeInTheDocument();
fireEvent.click(screen.getByRole("button", { name: "Avançar pela passagem" }));
expect(screen.getByText("A luz ficou para trás")).toBeInTheDocument();
expect(
  screen.getByRole("link", { name: "Chegar até elas" }),
).toBeInTheDocument();
```

- [ ] **Step 5: Make the prisoners' physical limitation explicit**

Add this assertion to `cave-prisoner-wall-scene.test.tsx`:

```tsx
expect(
  screen.getByText(/não conseguem virar o corpo nem a cabeça/i),
).toBeInTheDocument();
```

Ensure the relevant dialogue beat in `cave-prisoner-wall-scene.tsx` says:

```text
Desde crianças, elas vivem presas nesta posição. Não conseguem virar o corpo
nem a cabeça: a parede é a única vista que conhecem.
```

- [ ] **Step 6: Run the journey and existing shadow-story tests**

```bash
npm test -- src/domains/lessons/as-sombras/as-sombras-journey.test.ts src/domains/lessons/as-sombras/cave-descent-scene.test.tsx src/domains/lessons/as-sombras/cave-shadow-names-scene.test.tsx src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/domains/lessons/as-sombras/as-sombras-journey.ts src/domains/lessons/as-sombras/as-sombras-journey.test.ts src/domains/lessons/as-sombras/cave-descent-scene.tsx src/domains/lessons/as-sombras/cave-descent-scene.test.tsx src/domains/lessons/as-sombras/cave-shadow-names-scene.tsx src/domains/lessons/as-sombras/cave-prisoner-wall-scene.tsx src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx
git commit -m "feat: define complete cave lesson journey"
```

---

### Task 2: Build the reusable activity briefing dialog

**Files:**
- Create: `src/domains/lessons/interactions/philoo-activity-briefing.tsx`
- Create: `src/domains/lessons/interactions/philoo-activity-briefing.module.css`
- Create: `src/domains/lessons/interactions/philoo-activity-briefing.test.tsx`

**Interfaces:**
- Consumes: `PlatoGuide`, `PlatoPoseKey`, `ReactNode`.
- Produces:

```ts
export type PhilooActivityBriefingProps = {
  open: boolean;
  title: string;
  purpose: string;
  steps: readonly string[];
  startLabel: string;
  guidePose: PlatoPoseKey;
  demonstration: ReactNode;
  onClose: () => void;
};

export function PhilooActivityBriefing(
  props: PhilooActivityBriefingProps,
): React.JSX.Element;
```

- [ ] **Step 1: Write failing accessibility and lifecycle tests**

```tsx
it("opens with complete instructions, traps focus, and restores it", () => {
  const onClose = vi.fn();
  render(<BriefingHarness onClose={onClose} />);
  const trigger = screen.getByRole("button", { name: "Como jogar" });
  trigger.focus();
  fireEvent.click(trigger);

  expect(screen.getByRole("dialog", { name: "Monte o caminho" })).toBeVisible();
  expect(screen.getByText("luz → objeto")).toBeInTheDocument();
  expect(document.activeElement).toBe(
    screen.getByRole("button", { name: "Vamos montar" }),
  );
  fireEvent.keyDown(screen.getByRole("dialog"), { key: "Tab" });
  expect(screen.getByRole("dialog")).toContainElement(document.activeElement);
  fireEvent.click(screen.getByRole("button", { name: "Vamos montar" }));
  expect(onClose).toHaveBeenCalledOnce();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(document.activeElement).toBe(trigger);
});
```

Implement `BriefingHarness` in the test as a stateful wrapper that keeps the
trigger and briefing mounted while toggling `open`.

- [ ] **Step 2: Run the test and verify the component is missing**

```bash
npm test -- src/domains/lessons/interactions/philoo-activity-briefing.test.tsx
```

Expected: FAIL with module-not-found.

- [ ] **Step 3: Implement the controlled modal**

Use a body portal rather than relying on unsupported JSDOM
`HTMLDialogElement.showModal()`. Provide `role="dialog"`,
`aria-modal="true"`, Escape handling, initial focus, a Tab/Shift+Tab focus
loop, and focus restoration. While open, set all other direct body children to
`inert`, preserve their prior inert values, and restore them on close. Lock
body scrolling and restore its prior overflow value in the same cleanup.

```tsx
"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { PlatoGuide } from "../plato-guide";
import type { PlatoPoseKey } from "../plato-pose-catalog";
import styles from "./philoo-activity-briefing.module.css";

export type PhilooActivityBriefingProps = {
  open: boolean;
  title: string;
  purpose: string;
  steps: readonly string[];
  startLabel: string;
  guidePose: PlatoPoseKey;
  demonstration: ReactNode;
  onClose: () => void;
};

export function PhilooActivityBriefing({
  open, title, purpose, steps, startLabel, guidePose, demonstration, onClose,
}: PhilooActivityBriefingProps) {
  const actionRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    actionRef.current?.focus();
    return () => previousFocusRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") keepFocusInside(dialogRef.current, event);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} data-philoo-modal-root>
      <section ref={dialogRef} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="activity-briefing-title">
        <PlatoGuide className={styles.guide} pose={guidePose} priority />
        <div className={styles.copy}>
          <span className={styles.kicker}>Antes de começar</span>
          <h2 id="activity-briefing-title">{title}</h2>
          <p>{purpose}</p>
          <div className={styles.demonstration}>{demonstration}</div>
          <ol>{steps.map((step) => <li key={step}>{step}</li>)}</ol>
          <button ref={actionRef} type="button" onClick={onClose}>{startLabel}</button>
        </div>
      </section>
    </div>
  );
}
```

Add small `createPortal`, `keepFocusInside`, and inert-sibling helpers in this
module. The focus helper queries enabled links, buttons, inputs, selects,
textareas, and `[tabindex]:not([tabindex="-1"])`, then wraps from last to first
and first to last. The inert helper restores DOM state exactly on cleanup.

- [ ] **Step 4: Style the dialog with the approved tactile identity**

Define:

```css
.backdrop {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(23, 50, 74, 0.28);
  backdrop-filter: blur(8px);
}

.dialog {
  position: relative;
  width: min(760px, 100%);
  min-height: 430px;
  padding: 36px 38px 32px min(36vw, 300px);
  overflow: hidden;
  border: 3px solid #fff;
  border-radius: 38px;
  background: #fbf8f3;
  box-shadow: 0 10px 0 #8edcf5, 0 32px 80px rgba(23, 50, 74, 0.24);
}
```

Add phone rules that place the Platão bust across the lower-left edge without
covering the action or text. Give the primary action a `#33BFED` face and
`#159CCA` lower layer. Remove movement under `prefers-reduced-motion`.

- [ ] **Step 5: Run the focused test and lint**

```bash
npm test -- src/domains/lessons/interactions/philoo-activity-briefing.test.tsx
npm run lint -- --quiet
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/domains/lessons/interactions/philoo-activity-briefing.tsx src/domains/lessons/interactions/philoo-activity-briefing.module.css src/domains/lessons/interactions/philoo-activity-briefing.test.tsx
git commit -m "feat: add Philoo activity briefing dialog"
```

---

### Task 3: Generate and register the canonical Lesson One artwork

**Files:**
- Create: the eleven assets listed in the file structure.
- Modify: `src/domains/lessons/plato-pose-catalog.ts`
- Create: `src/domains/lessons/plato-pose-catalog.test.ts`

**Interfaces:**
- Consumes: canonical reference `public/images/story/plato-v2/plato-invitation-v3.png`.
- Produces seven new `PlatoPoseKey` values:
  `shadow-celebration`, `curious-interruption`, `reveal-behind`,
  `causal-path`, `doxa`, `first-doubt`, and `invite-turn`.

- [ ] **Step 1: Add a failing pose-catalog test**

```ts
import { expect, it } from "vitest";
import { getPlatoPose } from "./plato-pose-catalog";

it.each([
  "shadow-celebration",
  "curious-interruption",
  "reveal-behind",
  "causal-path",
  "doxa",
  "first-doubt",
  "invite-turn",
] as const)("registers the %s Lesson One pose", (pose) => {
  expect(getPlatoPose(pose).src).toMatch(/^\/images\/story\/plato-v2\//);
  expect(getPlatoPose(pose).alt.length).toBeGreaterThan(20);
});
```

- [ ] **Step 2: Run the test and verify the keys fail type checking**

```bash
npm test -- src/domains/lessons/plato-pose-catalog.test.ts
```

Expected: FAIL because the pose keys are absent.

- [ ] **Step 3: Generate seven transparent Platão poses**

For every generation, use only the canonical invitation image as the character
reference. Require transparent background, identical face/hair/beard/eyes/body
ratio/garment/sandals/rendering, complete visible hands, and the pose intent
encoded by the filename. Reject an output if identity, height, eye color,
costume, fingers, crop, or facing direction differs.

The exact pose actions are:

```text
shadow-celebration: delighted recognition, one hand acknowledging success
curious-interruption: warm questioning expression, one finger gently raised
reveal-behind: torso oriented right, open hand presenting evidence behind him
causal-path: eyes and both hands following a left-to-right sequence
doxa: thoughtful expression, one hand near chin and one open toward the learner
first-doubt: concerned curiosity, looking toward an inconsistency on the right
invite-turn: hopeful expression, body and open hand inviting movement forward
```

- [ ] **Step 4: Generate four story evidence panels**

Use the approved prisoner visual style as secondary style reference while
keeping figures consistent across panels:

```text
cave-shadow-recognition-set-v1.webp: three clean wall-shadow states with quiet negative space
cave-behind-wall-layers-v1.webp: fire, carrier, object, prisoners, and wall in one readable side-view mechanism
cave-cropped-event-v1.webp: a modern child-safe event whose crop creates a misleading but plausible interpretation
cave-anomaly-v1.webp: shadow and visible source cues that do not fit the prisoners' usual naming rule
```

Images contain no generated text. Encode as WebP where transparency is not
required and preserve a maximum dimension appropriate for a 1600×900 panel.

- [ ] **Step 5: Register the poses**

Add entries such as:

```ts
"causal-path": {
  src: "/images/story/plato-v2/plato-causal-path-v1.png",
  alt: "Platão acompanha com as mãos o caminho da luz até o nome dado à sombra",
},
```

Repeat with specific Portuguese alt text for all seven poses.

- [ ] **Step 6: Run the catalog test and inspect every asset**

```bash
npm test -- src/domains/lessons/plato-pose-catalog.test.ts
```

Open each asset at original detail and reject identity drift or malformed
geometry before committing.

- [ ] **Step 7: Commit**

```bash
git add public/images/story/plato-v2 public/images/story/cave-shadow-recognition-set-v1.webp public/images/story/cave-behind-wall-layers-v1.webp public/images/story/cave-cropped-event-v1.webp public/images/story/cave-anomaly-v1.webp src/domains/lessons/plato-pose-catalog.ts src/domains/lessons/plato-pose-catalog.test.ts
git commit -m "feat: add complete Cave lesson artwork"
```

---

### Task 4: Add the non-punitive wall-recognition game

**Files:**
- Create: `src/domains/lessons/as-sombras/cave-shadow-game-scene.tsx`
- Create: `src/domains/lessons/as-sombras/cave-shadow-game-scene.module.css`
- Create: `src/domains/lessons/as-sombras/cave-shadow-game-scene.test.tsx`
- Create: `src/app/aula/as-sombras/jogo-da-parede/page.tsx`

**Interfaces:**
- Consumes: new `shadow-celebration` and `curious-interruption` poses.
- Produces: route `/aula/as-sombras/jogo-da-parede`, then links to `/aula/as-sombras/o-que-existe-atras`.

- [ ] **Step 1: Write the failing scene test**

```tsx
it("lets the learner experience the prisoners' successful shadow game", () => {
  render(<CaveShadowGameScene />);
  expect(screen.getByRole("heading", { name: "Jogue como eles" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Pássaro" }));
  fireEvent.click(screen.getByRole("button", { name: "Ânfora" }));
  fireEvent.click(screen.getByRole("button", { name: "Cavalo" }));
  expect(screen.getByText(/você aprendeu o jogo da parede/i)).toBeInTheDocument();
  expect(screen.getByText(/isso significa que sabe o que a produziu/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /olhar para trás/i })).toHaveAttribute(
    "href",
    "/aula/as-sombras/o-que-existe-atras",
  );
});
```

- [ ] **Step 2: Run the test and verify the scene is missing**

```bash
npm test -- src/domains/lessons/as-sombras/cave-shadow-game-scene.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Implement three recognition rounds and the interruption beat**

Use:

```ts
const ROUNDS = [
  { id: "bird", label: "Pássaro", choices: ["Pássaro", "Cavalo", "Ânfora"] },
  { id: "amphora", label: "Ânfora", choices: ["Ânfora", "Pássaro", "Cavalo"] },
  { id: "horse", label: "Cavalo", choices: ["Cavalo", "Ânfora", "Pássaro"] },
] as const;
```

Allow every learner to succeed: an incorrect tap gently pulses the selected
choice and leaves the round active; the correct tap advances. Do not display a
score. After round three, change Platão from celebration to interruption and
show the philosophical question.

- [ ] **Step 4: Style one large shadow stage and three tactile name stones**

Use the folio stage, a warm cave-wall panel, and baby-blue tactile controls.
Phone layout places controls below the shadow rather than shrinking them beside
it. All targets remain at least 44px.

- [ ] **Step 5: Add the route**

```tsx
import { CaveShadowGameScene } from "@/domains/lessons/as-sombras/cave-shadow-game-scene";

export default function Page() {
  return <CaveShadowGameScene />;
}
```

- [ ] **Step 6: Run the scene test and lint**

```bash
npm test -- src/domains/lessons/as-sombras/cave-shadow-game-scene.test.tsx
npm run lint -- --quiet
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/app/aula/as-sombras/jogo-da-parede src/domains/lessons/as-sombras/cave-shadow-game-scene.*
git commit -m "feat: add prisoners shadow recognition game"
```

---

### Task 5: Reveal what exists behind the prisoners

**Files:**
- Create: `src/domains/lessons/as-sombras/cave-behind-wall-scene.tsx`
- Create: `src/domains/lessons/as-sombras/cave-behind-wall-scene.module.css`
- Create: `src/domains/lessons/as-sombras/cave-behind-wall-scene.test.tsx`
- Create: `src/app/aula/as-sombras/o-que-existe-atras/page.tsx`

**Interfaces:**
- Consumes: `cave-behind-wall-layers-v1.webp` and `reveal-behind`.
- Produces: a three-step reveal and link to `/aula/as-sombras/caminho-da-sombra`.

- [ ] **Step 1: Write the failing causal reveal test**

```tsx
it("reveals fire, carried objects, and the resulting shadows in order", () => {
  render(<CaveBehindWallScene />);
  expect(screen.getByText(/eles não conseguem ver isto/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Revelar a luz" }));
  expect(screen.getByText(/uma fogueira permanece acesa/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Revelar os objetos" }));
  expect(screen.getByText(/pessoas carregam objetos/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Revelar o efeito" }));
  expect(screen.getByText(/a parede recebe as sombras/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /montar o caminho/i })).toHaveAttribute(
    "href",
    "/aula/as-sombras/caminho-da-sombra",
  );
});
```

- [ ] **Step 2: Run the test and verify the scene is missing**

```bash
npm test -- src/domains/lessons/as-sombras/cave-behind-wall-scene.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Implement the three controlled reveal states**

Represent reveal progress as `0 | 1 | 2 | 3`. Keep one reserved image box and
overlay three semantic highlight layers with `data-visible`. Copy changes only
after the corresponding control is activated. The final route action remains
hidden until progress is `3`.

- [ ] **Step 4: Style the mechanism as a readable side-view exhibit**

Do not animate layout dimensions. Fade and translate the highlight layer by at
most 8px. On phone, place the three reveal controls in a vertical stack below
the evidence image. Under reduced motion, switch visibility instantly.

- [ ] **Step 5: Add the route, run tests, and commit**

```bash
npm test -- src/domains/lessons/as-sombras/cave-behind-wall-scene.test.tsx
npm run lint -- --quiet
git add src/app/aula/as-sombras/o-que-existe-atras src/domains/lessons/as-sombras/cave-behind-wall-scene.*
git commit -m "feat: reveal the mechanism behind the wall"
```

---

### Task 6: Build the light-to-name causal path activity

**Files:**
- Create: `src/domains/lessons/interactions/philoo-causal-path.tsx`
- Create: `src/domains/lessons/interactions/philoo-causal-path.module.css`
- Create: `src/domains/lessons/interactions/philoo-causal-path.test.tsx`
- Create: `src/domains/lessons/as-sombras/cave-shadow-path-scene.tsx`
- Create: `src/domains/lessons/as-sombras/cave-shadow-path-scene.module.css`
- Create: `src/domains/lessons/as-sombras/cave-shadow-path-scene.test.tsx`
- Create: `src/app/aula/as-sombras/caminho-da-sombra/page.tsx`

**Interfaces:**
- Produces:

```ts
export type CausalPathItem = {
  id: string;
  label: string;
  explanation: string;
  icon: ReactNode;
};

export function PhilooCausalPath(props: {
  items: readonly CausalPathItem[];
  correctOrder: readonly string[];
  demonstratedItemId: string;
  onComplete: () => void;
}): React.JSX.Element;
```

- [ ] **Step 1: Write the failing interaction tests**

```tsx
it("keeps the demonstrated light fixed and completes the remaining path", () => {
  const onComplete = vi.fn();
  render(
    <PhilooCausalPath
      items={PATH_ITEMS}
      correctOrder={["light", "object", "shadow", "name"]}
      demonstratedItemId="light"
      onComplete={onComplete}
    />,
  );
  expect(screen.getByText("Luz")).toHaveAttribute("data-demonstrated", "true");
  fireEvent.click(screen.getByRole("button", { name: "Objeto" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 2" }));
  fireEvent.click(screen.getByRole("button", { name: "Sombra" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 3" }));
  fireEvent.click(screen.getByRole("button", { name: "Nome" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 4" }));
  expect(onComplete).toHaveBeenCalledOnce();
});
```

Add a second test that puts `shadow` before `object` and expects:

```text
A sombra precisa de algo entre a luz e a parede.
```

- [ ] **Step 2: Run the tests and verify the component is missing**

```bash
npm test -- src/domains/lessons/interactions/philoo-causal-path.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Implement shared click and drag placement state**

Store `selectedItemId` and a four-position array. Use native pointer/drag
events only as enhancement; every item and position remains a button. Validate
the complete path against `correctOrder`. On an incorrect full path, preserve
placed pieces and explain the first broken causal relation.

- [ ] **Step 4: Implement the Cave scene with briefing**

Use:

```ts
const PATH_ITEMS = [
  { id: "light", label: "Luz", explanation: "A fogueira ilumina.", icon: <FireIcon /> },
  { id: "object", label: "Objeto", explanation: "Algo bloqueia parte da luz.", icon: <JarIcon /> },
  { id: "shadow", label: "Sombra", explanation: "A forma aparece na parede.", icon: <SelectionBackgroundIcon /> },
  { id: "name", label: "Nome", explanation: "Os prisioneiros interpretam a forma.", icon: <ChatTextIcon /> },
] as const;
```

Open `PhilooActivityBriefing` on first render with:

```text
title: Monte o caminho da sombra
purpose: Descubra como uma coisa que ninguém vê termina virando um nome na parede.
steps: Escolha uma peça. / Coloque-a na próxima parte do caminho.
startLabel: Vamos montar
```

Keep `Como jogar` visible after dismissal.

- [ ] **Step 5: Add route and focused tests**

The route renders `CaveShadowPathScene`. Test that the briefing opens, closes,
reopens, the path completes, and the final link points to
`/aula/as-sombras/doxa`.

Run:

```bash
npm test -- src/domains/lessons/interactions/philoo-causal-path.test.tsx src/domains/lessons/as-sombras/cave-shadow-path-scene.test.tsx
npm run lint -- --quiet
```

- [ ] **Step 6: Commit**

```bash
git add src/app/aula/as-sombras/caminho-da-sombra src/domains/lessons/interactions/philoo-causal-path* src/domains/lessons/as-sombras/cave-shadow-path-scene.*
git commit -m "feat: add shadow causal path activity"
```

---

### Task 7: Teach dóxa through the Cave and a modern crop

**Files:**
- Create: `src/domains/lessons/as-sombras/cave-doxa-scene.tsx`
- Create: `src/domains/lessons/as-sombras/cave-doxa-scene.module.css`
- Create: `src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx`
- Create: `src/app/aula/as-sombras/doxa/page.tsx`

**Interfaces:**
- Consumes: `plato-doxa-v1.png`, `cave-cropped-event-v1.webp`.
- Produces: concept application and link to `/aula/as-sombras/o-que-chegou-ate-eles`.

- [ ] **Step 1: Write the failing concept test**

```tsx
it("names, explains, and applies dóxa without grading the learner", () => {
  render(<CaveDoxaScene />);
  expect(screen.getByRole("heading", { name: "Dóxa" })).toBeInTheDocument();
  expect(screen.getByText("δόξα")).toBeInTheDocument();
  expect(screen.getByText(/opinião ou crença formada/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /ver o que ficou fora/i }));
  expect(screen.getByText(/uma imagem pode ser verdadeira e ainda assim incompleta/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /testar essa diferença/i })).toHaveAttribute(
    "href",
    "/aula/as-sombras/o-que-chegou-ate-eles",
  );
});
```

- [ ] **Step 2: Run the test and verify the scene is missing**

```bash
npm test -- src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx
```

- [ ] **Step 3: Implement three concept beats**

Use internal beats:

```ts
const DOXA_BEATS = [
  { title: "Uma palavra da filosofia", copy: "Dóxa é uma opinião ou crença formada a partir de como algo aparece para nós." },
  { title: "Na caverna", copy: "Os prisioneiros não estão fingindo. Eles organizam o pouco que conseguem perceber." },
  { title: "Fora da caverna", copy: "Uma imagem pode ser verdadeira e ainda assim deixar algo importante fora do quadro." },
] as const;
```

The third beat reveals the uncropped interpretation through a tactile frame
control. Do not add a correctness score.

- [ ] **Step 4: Style the concept as a Philoo vocabulary artifact**

Give `Dóxa` the display role, `δόξα` a smaller linguistic role, and keep Platão
visibly connected to the explanation. The modern example uses an image frame,
not generated labels inside the image.

- [ ] **Step 5: Add route, run tests, and commit**

```bash
npm test -- src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx
npm run lint -- --quiet
git add src/app/aula/as-sombras/doxa src/domains/lessons/as-sombras/cave-doxa-scene.*
git commit -m "feat: teach doxa through the Cave story"
```

---

### Task 8: Reframe the discovery table as a four-card application

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-evidence-sort-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-evidence-sort-scene.module.css`
- Modify: `src/domains/lessons/as-sombras/cave-evidence-sort-scene.test.tsx`

**Interfaces:**
- Consumes: `PhilooActivityBriefing`, existing `PhilooDiscoveryTable`.
- Produces: worked example plus four prisoner-viewpoint cards and final link to `/aula/as-sombras/a-primeira-duvida`.

- [ ] **Step 1: Replace six-card assertions with the approved four-card content**

Define expected cards:

```ts
const CARDS = [
  { id: "shape", text: "Uma forma atravessou a parede.", answer: "observed" },
  { id: "object", text: "A forma era produzida por um objeto.", answer: "concluded" },
  { id: "voice", text: "A voz vinha da própria sombra.", answer: "concluded" },
  { id: "outside", text: "Do ponto de vista dos prisioneiros, existia um mundo fora da caverna.", answer: "unknown" },
] as const;
```

Update the test to expect:

```tsx
expect(screen.getByRole("dialog", { name: /organize as pistas/i })).toBeVisible();
fireEvent.click(screen.getByRole("button", { name: "Começar o desafio" }));
expect(screen.getByText(/Platão mostra o primeiro exemplo/i)).toBeInTheDocument();
expect(container.querySelector("[data-progress-fraction]")).toHaveAttribute(
  "aria-label",
  "0 de 4 pistas organizadas",
);
```

- [ ] **Step 2: Run the focused test and verify it fails against six cards**

```bash
npm test -- src/domains/lessons/as-sombras/cave-evidence-sort-scene.test.tsx
```

- [ ] **Step 3: Add the briefing and worked example**

Initialize `briefingOpen` to `true`. After dismissal, show a one-step worked
example card outside the independent tray:

```text
Uma forma atravessou a parede. → Vi
```

This is a non-interactive demonstration duplicate, not one of the four
independent cards. The learner acknowledges **Entendi o exemplo**, after which
the four-card board becomes active at `0 de 4`. `Como jogar` reopens the
briefing without resetting placements.

- [ ] **Step 4: Replace generic feedback with category reasoning**

Map each incorrect destination to a sentence:

```ts
const FEEDBACK = {
  observed: "Isso apareceu diretamente na parede.",
  concluded: "Essa explicação completa algo que os prisioneiros não viram.",
  unknown: "Da posição deles, ainda faltam pistas para afirmar isso.",
} as const;
```

Keep all placements revisable. After a correct completion, expose the final
link **Seguir a dúvida**.

- [ ] **Step 5: Fix the completion layout for four cards**

Preserve the approved desktop board identity. On phone, keep one clue and three
large category actions at a time. Ensure the completed-tray message remains
left aligned and its stacked-cards icon remains optically centered.

- [ ] **Step 6: Run interaction and scene tests**

```bash
npm test -- src/domains/lessons/interactions/philoo-discovery-table.test.tsx src/domains/lessons/as-sombras/cave-evidence-sort-scene.test.tsx
npm run lint -- --quiet
```

- [ ] **Step 7: Commit**

```bash
git add src/domains/lessons/as-sombras/cave-evidence-sort-scene.* src/domains/lessons/interactions/philoo-discovery-table.*
git commit -m "feat: move classification into taught Cave context"
```

---

### Task 9: End Lesson One with contradiction, reflection, and the turn

**Files:**
- Create: `src/domains/lessons/as-sombras/cave-first-doubt-scene.tsx`
- Create: `src/domains/lessons/as-sombras/cave-first-doubt-scene.module.css`
- Create: `src/domains/lessons/as-sombras/cave-first-doubt-scene.test.tsx`
- Create: `src/app/aula/as-sombras/a-primeira-duvida/page.tsx`

**Interfaces:**
- Consumes: `cave-anomaly-v1.webp`, `first-doubt`, `invite-turn`.
- Produces: a complete Lesson One terminal state without entering Lesson Two.

- [ ] **Step 1: Write the failing ending test**

```tsx
it("turns contradiction into a personal question and ends before the ascent", () => {
  render(<CaveFirstDoubtScene />);
  expect(screen.getByText(/algo não combina com o jogo da parede/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Procuraria outra pista" }));
  expect(screen.getByText(/duvidar não encerra a investigação/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
  expect(screen.getByText(/pela primeira vez, ele tenta se virar/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Quero ver além da parede" })).toBeInTheDocument();
  expect(screen.queryByText(/sol|mundo exterior/i)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test and verify the scene is missing**

```bash
npm test -- src/domains/lessons/as-sombras/cave-first-doubt-scene.test.tsx
```

- [ ] **Step 3: Implement three ending beats**

```ts
type DoubtBeat = "anomaly" | "reflection" | "turn";
const REFLECTION_OPTIONS = [
  "Procuraria outra pista",
  "Perguntaria a outra pessoa",
  "Continuaria acreditando na parede",
] as const;
```

All choices receive a distinct, non-punitive Platão response. Provide an
optional text field labelled `Escreva outra possibilidade` with a 180-character
limit. The choice or text remains local state; no analytics is added.

- [ ] **Step 4: Implement the terminal action**

`Quero ver além da parede` marks the screen complete and presents:

```text
Você concluiu: Dentro da caverna
A próxima parte começa quando o olhar se vira.
```

Do not navigate to or reveal Lesson Two. Preserve a route back through the
journey rail.

- [ ] **Step 5: Style and test responsive composition**

Desktop: anomaly image, Platão, and response occupy a balanced folio layout.
Phone: image first, choice cards second, Platão response third. No content is
hidden behind the collapsed journey control.

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-first-doubt-scene.test.tsx
npm run lint -- --quiet
```

- [ ] **Step 6: Commit**

```bash
git add src/app/aula/as-sombras/a-primeira-duvida src/domains/lessons/as-sombras/cave-first-doubt-scene.*
git commit -m "feat: complete the first Cave lesson"
```

---

### Task 10: Reproduce and fix the client-navigation layout race

**Files:**
- Modify: `src/domains/lessons/use-story-scene-transition.ts`
- Modify: `src/domains/lessons/use-story-scene-transition.test.tsx`
- Modify: `src/domains/lessons/philoo-story-shell.tsx`
- Modify: `src/domains/lessons/philoo-story-shell.module.css`
- Create: `src/domains/lessons/philoo-story-shell.test.tsx`
- Modify only the affected scene CSS after reproduction identifies it.

**Interfaces:**
- Consumes: all nine stage routes and the existing route transition hook.
- Produces: deterministic route-entry geometry with no stale phase or transform.

- [ ] **Step 1: Create a repeatable browser reproduction**

Run the production app:

```bash
npm run build
npm run start
```

At 1440×900 and 1024×768, repeat each sequence ten times:

```text
eles-dao-nomes → jogo-da-parede → back → forward
doxa → o-que-chegou-ate-eles → refresh → back → forward
journey-rail link → evidence activity → browser back → activity
```

Record computed height and transform for:

```text
[data-philoo-story-shell]
[data-philoo-folio-stage]
[data-activity-guidance]
[data-progress-fraction]
```

The failure is reproduced when the folio body or intro row exceeds the story
surface height before user scrolling.

- [ ] **Step 2: Add a failing transition regression test**

Extend `TransitionHarness` with an optional `href = "/next"` prop and pass it
to `useStorySceneTransition`. Then add:

```tsx
it("cancels a stale exit and returns to idle when its destination changes", () => {
  vi.useFakeTimers();
  const view = render(<TransitionHarness href="/first" durationMs={240} />);
  fireEvent.click(screen.getByRole("link", { name: "Continue" }));
  expect(screen.getByTestId("scene")).toHaveAttribute("data-phase", "leaving");

  view.rerender(<TransitionHarness href="/second" durationMs={240} />);
  expect(screen.getByTestId("scene")).toHaveAttribute("data-phase", "idle");
  act(() => vi.advanceTimersByTime(240));
  expect(pushMock).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole("link", { name: "Continue" }));
  fireEvent.animationEnd(screen.getByTestId("scene"));
  expect(pushMock).toHaveBeenCalledWith("/second");
});
```

Create `philoo-story-shell.test.tsx` using the smallest valid shell props and
mock `next/navigation`. Assert `[data-philoo-story-shell]` and
`[data-philoo-story-motion-slot]` exist on the first render and carry their
stable sizing classes before any image or route effect runs.

- [ ] **Step 3: Apply only the evidence-backed fix**

The acceptable fix set is:

```ts
useEffect(() => {
  clearPendingNavigation();
  phaseRef.current = "idle";
  hasNavigatedRef.current = false;
  setPhase("idle");
  return () => clearPendingNavigation();
}, [clearPendingNavigation, href]);
```

Define `clearPendingNavigation` with `useCallback`; it clears and nulls
`timeoutRef.current`. Include it in the effect dependency list.

plus CSS containment:

```css
.storyMotionSlot {
  contain: layout;
}

.storySurface,
.storyContent {
  min-height: 0;
}
```

Use only the part that matches the captured failure. Do not add arbitrary
timeouts or reload the page.

- [ ] **Step 4: Verify development and production navigation**

Run:

```bash
npm test -- src/domains/lessons/use-story-scene-transition.test.tsx src/domains/lessons/as-sombras/cave-evidence-sort-scene.test.tsx
npm run build
```

Repeat the browser sequences at least ten times without the oversized blank
surface.

- [ ] **Step 5: Commit**

```bash
git add src/domains/lessons/use-story-scene-transition* src/domains/lessons/philoo-story-shell* src/domains/lessons/as-sombras
git commit -m "fix: stabilize Cave route entry geometry"
```

---

### Task 11: Full lesson verification and template review

**Files:**
- Modify: `scripts/check-story-folio-viewport.mjs` only if new routes are not discoverable.
- Create: `docs/superpowers/reports/2026-07-28-philoo-cave-lesson-one-verification.md`

**Interfaces:**
- Consumes: all Lesson One routes and tests.
- Produces: evidence that Lesson One is ready for design-template review.

- [ ] **Step 1: Run complete automated verification**

```bash
npm test
npm run lint -- --quiet
npm run build
npm run check:story-folio-viewport
git diff --check
```

Expected: every command exits `0`.

- [ ] **Step 2: Verify the complete learner journey**

At desktop 1440×900, tablet 1024×768 and 768×1024, and phone 390×844:

```text
start at primeira-tela
complete all nine stages
reopen both Como jogar dialogs
complete both activities once incorrectly and then correctly
visit every prior journey stage through the rail
collapse and expand the rail
repeat with prefers-reduced-motion
repeat using keyboard only
```

Confirm:

- no activity precedes its instruction;
- all feedback explains;
- every Platão pose faces its referenced content;
- image panels communicate evidence rather than decoration;
- no content overlaps the rail;
- no page presents blank oversized geometry;
- phone activities use sequential controls;
- the ending reveals no outside world.

- [ ] **Step 3: Conduct a natural timing trial**

Complete the episode while reading every line at a natural adolescent reading
pace. Record total time and stage-level outliers. Accept 12–15 minutes; if the
lesson exceeds 15 minutes, shorten repeated copy before removing a learning
step.

- [ ] **Step 4: Write the verification report**

Use:

```markdown
# Cave Lesson One Verification

- Automated tests: pass/fail and counts
- Production build: pass/fail
- Viewports: desktop/tablet portrait/tablet landscape/phone
- Input: pointer/touch-equivalent/keyboard
- Reduced motion: pass/fail
- Natural completion time: minutes and seconds
- Navigation race: reproduction attempts and result
- Remaining template candidates: briefing dialog, causal path, discovery table
- Permanent-template decision: deferred until user review
```

- [ ] **Step 5: Commit and push**

```bash
git add .
git commit -m "test: verify complete Cave lesson one"
git push origin codex/story-folio
```
