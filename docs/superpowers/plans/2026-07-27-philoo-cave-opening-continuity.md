# Philoo Cave Opening Continuity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the first two Cave scenes into one accurate story, animate the descent between them, and advance visible story-beat progress from 1 to 2 of 10.

**Architecture:** Store the approved first two story beats in one typed module, render their position through one semantic progress component, and use one reusable client hook to delay ordinary link navigation until the current scene finishes its exit animation. Keep the visual choreography in each scene's CSS module so later philosophers can reuse the navigation behavior without inheriting Cave-specific motion.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, Vitest, Testing Library

## Global Constraints

- Modify only the first two `As Sombras` review scenes and their directly shared Cave helpers.
- Preserve the existing cream, baby-blue, rounded Philoo visual language and the approved Plato artwork.
- Add no runtime dependency and do not enable Next.js experimental View Transitions.
- Keep a real link for semantics, prefetching, modified clicks, and no-JavaScript fallback.
- Normal transition duration must remain at or below 700 milliseconds.
- `prefers-reduced-motion: reduce` must navigate immediately and disable entrance and exit movement.
- Use `Platão · A República, Livro VII` exactly once, on Scene 1.
- Scene 1 must be `Cena 1 de 10`; Scene 2 must be `Cena 2 de 10`.
- Stop after these two revised scenes for visual review.

---

### Task 1: Cave story beats and progress

**Files:**
- Create: `src/domains/lessons/as-sombras/cave-story-beats.ts`
- Create: `src/domains/lessons/as-sombras/cave-story-progress.tsx`
- Create: `src/domains/lessons/as-sombras/cave-story-progress.module.css`
- Test: `src/domains/lessons/as-sombras/cave-story-progress.test.tsx`

**Interfaces:**
- Produces: `CAVE_STORY_TOTAL_BEATS`, `CAVE_STORY_BEATS.invitation`, and `CAVE_STORY_BEATS.descent`.
- Produces: `CaveStoryProgress({ currentBeat, totalBeats })`.
- Each beat contains `ordinal`, `label`, `title`, `story`, `guidance`, `action`, and optional `source`.

- [ ] **Step 1: Write the failing progress test**

```tsx
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { CaveStoryProgress } from "./cave-story-progress";

afterEach(cleanup);

it("marks completed, current, and future Cave story beats", () => {
  const { container } = render(
    <CaveStoryProgress currentBeat={2} totalBeats={10} />,
  );

  const progress = screen.getByRole("progressbar", {
    name: "Cena 2 de 10",
  });
  expect(progress).toHaveAttribute("aria-valuenow", "2");
  expect(progress).toHaveAttribute("aria-valuemax", "10");
  expect(
    container.querySelectorAll('[data-state="complete"]'),
  ).toHaveLength(1);
  expect(
    container.querySelectorAll('[data-state="current"]'),
  ).toHaveLength(1);
  expect(
    container.querySelectorAll('[data-state="future"]'),
  ).toHaveLength(8);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-story-progress.test.tsx
```

Expected: FAIL because `./cave-story-progress` does not exist.

- [ ] **Step 3: Add the approved story-beat source**

```ts
export const CAVE_STORY_TOTAL_BEATS = 10;

export const CAVE_STORY_BEATS = {
  invitation: {
    ordinal: 1,
    label: "Cena 1 · O começo da história",
    title: "Venha comigo até uma caverna.",
    story:
      "Quero lhe contar uma história. No fundo desta caverna, pessoas vivem presas desde crianças e só conseguem olhar para uma parede.",
    guidance:
      "Vamos descer devagar. Eu fico com você e mostro o caminho.",
    action: "Descer comigo",
    source: "Platão · A República, Livro VII",
  },
  descent: {
    ordinal: 2,
    label: "Cena 2 · A descida",
    title: "A luz fica para trás.",
    story:
      "Enquanto descemos, pense nas pessoas de quem falei. Elas nunca puderam se virar: tudo o que conhecem acontece diante da mesma parede.",
    guidance:
      "Não lhes falta inteligência. Falta-lhes a chance de enxergar o que existe atrás delas.",
    action: "Chegar até elas",
  },
} as const;
```

- [ ] **Step 4: Implement semantic point progress**

```tsx
import styles from "./cave-story-progress.module.css";

type CaveStoryProgressProps = {
  currentBeat: number;
  totalBeats: number;
};

export function CaveStoryProgress({
  currentBeat,
  totalBeats,
}: CaveStoryProgressProps) {
  const label = `Cena ${currentBeat} de ${totalBeats}`;

  return (
    <div
      className={styles.progress}
      role="progressbar"
      aria-label={label}
      aria-valuemin={1}
      aria-valuenow={currentBeat}
      aria-valuemax={totalBeats}
      aria-valuetext={label}
    >
      {Array.from({ length: totalBeats }, (_, index) => {
        const beat = index + 1;
        const state =
          beat < currentBeat
            ? "complete"
            : beat === currentBeat
              ? "current"
              : "future";
        return <span key={beat} data-state={state} aria-hidden="true" />;
      })}
    </div>
  );
}
```

The CSS uses ten compact points, a 24px current segment, `#33BFED` for
complete/current state, and muted `#d5e1e7` for future state.

- [ ] **Step 5: Run the focused test and verify GREEN**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-story-progress.test.tsx
```

Expected: 1 test passes.

- [ ] **Step 6: Commit**

```bash
git add src/domains/lessons/as-sombras/cave-story-beats.ts src/domains/lessons/as-sombras/cave-story-progress.tsx src/domains/lessons/as-sombras/cave-story-progress.module.css src/domains/lessons/as-sombras/cave-story-progress.test.tsx
git commit -m "feat: add Cave story beats and progress"
```

---

### Task 2: Reusable story-scene navigation

**Files:**
- Create: `src/domains/lessons/use-story-scene-transition.ts`
- Test: `src/domains/lessons/use-story-scene-transition.test.tsx`

**Interfaces:**
- Produces: `useStorySceneTransition({ href, durationMs })`.
- Returns: `phase: "idle" | "leaving"`, `beginNavigation(event)`, and `completeExit(event)`.
- Ordinary primary activation enters `leaving`; modified activation remains native.
- Navigation runs once after the wrapper's own `animationend` or safety timeout.

- [ ] **Step 1: Read the project test rules**

Read:

```bash
sed -n '1,260p' /Users/jv/.codex/plugins/cache/claude-plugins-official/superpowers/6.2.0/skills/test-driven-development/writing-good-tests.md
```

- [ ] **Step 2: Write failing hook tests**

Create a small harness containing a real anchor and an animated wrapper.
Mock `next/navigation` with one hoisted `pushMock`. Cover:

```tsx
it("waits for the scene exit before navigating", () => {
  render(<TransitionHarness />);
  fireEvent.click(screen.getByRole("link", { name: "Continue" }));
  expect(screen.getByTestId("scene")).toHaveAttribute(
    "data-phase",
    "leaving",
  );
  expect(pushMock).not.toHaveBeenCalled();

  fireEvent.animationEnd(screen.getByTestId("scene"));
  expect(pushMock).toHaveBeenCalledOnce();
  expect(pushMock).toHaveBeenCalledWith("/next");
});

it("navigates immediately for reduced motion", () => {
  window.matchMedia = reducedMotionMatch;
  render(<TransitionHarness />);
  fireEvent.click(screen.getByRole("link", { name: "Continue" }));
  expect(pushMock).toHaveBeenCalledOnce();
});

it("ignores repeated activation while leaving", () => {
  render(<TransitionHarness />);
  const link = screen.getByRole("link", { name: "Continue" });
  fireEvent.click(link);
  fireEvent.click(link);
  fireEvent.animationEnd(screen.getByTestId("scene"));
  expect(pushMock).toHaveBeenCalledOnce();
});
```

- [ ] **Step 3: Run the focused test and verify RED**

Run:

```bash
npm test -- src/domains/lessons/use-story-scene-transition.test.tsx
```

Expected: FAIL because the hook does not exist.

- [ ] **Step 4: Implement the minimal hook**

Use `useRouter`, `useRef`, `useState`, and `useEffect`. Intercept only an
unmodified left click with no non-default target. Call
`window.matchMedia("(prefers-reduced-motion: reduce)")`; reduced motion
calls `router.push(href)` immediately. Otherwise set `phase` to
`leaving`, arm a timeout no longer than `durationMs`, and let
`completeExit` navigate when `event.target === event.currentTarget`.
Use a ref to prevent duplicate pushes and clear the timeout on unmount.

- [ ] **Step 5: Run the focused test and verify GREEN**

Run:

```bash
npm test -- src/domains/lessons/use-story-scene-transition.test.tsx
```

Expected: all transition-hook tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/domains/lessons/use-story-scene-transition.ts src/domains/lessons/use-story-scene-transition.test.tsx
git commit -m "feat: add story scene navigation transition"
```

---

### Task 3: Rewrite and animate the invitation scene

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-invitation-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-invitation-scene.module.css`

**Interfaces:**
- Consumes: `CAVE_STORY_BEATS.invitation`.
- Consumes: `CAVE_STORY_TOTAL_BEATS`.
- Consumes: `CaveStoryProgress`.
- Consumes: `useStorySceneTransition({ href, durationMs: 560 })`.

- [ ] **Step 1: Rewrite the invitation contract test**

Assert:

```tsx
expect(
  screen.getByRole("heading", {
    name: "Venha comigo até uma caverna.",
  }),
).toBeInTheDocument();
expect(
  screen.getByText(/pessoas vivem presas desde crianças/i),
).toBeInTheDocument();
expect(
  screen.getByText("Platão · A República, Livro VII"),
).toBeInTheDocument();
expect(
  screen.getByRole("progressbar", { name: "Cena 1 de 10" }),
).toBeInTheDocument();
expect(
  screen.getByRole("link", { name: "Descer comigo" }),
).toHaveAttribute("href", "/aula/as-sombras/a-descida");
expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
```

Mock the transition hook in this scene-level test so hook timing remains
owned by Task 2.

- [ ] **Step 2: Run the invitation test and verify RED**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx
```

Expected: FAIL on the new heading, copy, source, and progress.

- [ ] **Step 3: Consume the approved beat and transition**

Make the component a client component. Replace duplicated copy and
progress markup with the approved beat and `CaveStoryProgress`. Add
`data-phase={phase}` and `onAnimationEnd={completeExit}` to the story
scene. Keep the CTA as Next `Link`, attach `onClick={beginNavigation}`,
and expose `aria-disabled={phase === "leaving"}` while leaving.

- [ ] **Step 4: Add the Cave-depth exit choreography**

Add one absolute navy `.transitionVeil`. Under
`data-phase="leaving"`:

```css
.storyScene[data-phase="leaving"] {
  animation: scene-deepen 560ms ease-in both;
}

.storyScene[data-phase="leaving"] .dialogue {
  animation: invitation-card-leave 300ms ease-in both;
}

.storyScene[data-phase="leaving"] .plato {
  animation: invitation-plato-leave 380ms 55ms ease-in both;
}

.storyScene[data-phase="leaving"] .transitionVeil {
  animation: cave-veil-close 560ms ease-in both;
}
```

Move the card and Plato no more than 22px on desktop and 10px on narrow
screens. The veil ends below 30% opacity. Disable all four animations
inside the existing reduced-motion query.

- [ ] **Step 5: Run the invitation and hook tests**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx src/domains/lessons/use-story-scene-transition.test.tsx
```

Expected: all focused tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx src/domains/lessons/as-sombras/cave-invitation-scene.tsx src/domains/lessons/as-sombras/cave-invitation-scene.module.css
git commit -m "feat: connect the Cave opening story"
```

---

### Task 4: Rewrite and animate the descent scene

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-descent-scene.test.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-descent-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-descent-scene.module.css`

**Interfaces:**
- Consumes: `CAVE_STORY_BEATS.descent`.
- Consumes: `CAVE_STORY_TOTAL_BEATS`.
- Consumes: `CaveStoryProgress`.

- [ ] **Step 1: Rewrite the descent contract test**

Assert:

```tsx
expect(
  screen.getByRole("heading", { name: "A luz fica para trás." }),
).toBeInTheDocument();
expect(
  screen.getByText(/pessoas de quem falei/i),
).toBeInTheDocument();
expect(
  screen.getByText(/elas nunca puderam se virar/i),
).toBeInTheDocument();
expect(
  screen.getByText(/não lhes falta inteligência/i),
).toBeInTheDocument();
expect(
  screen.getByRole("progressbar", { name: "Cena 2 de 10" }),
).toBeInTheDocument();
expect(
  screen.getByRole("button", { name: "Chegar até elas" }),
).toBeInTheDocument();
expect(
  screen.queryByText("Platão · A República, Livro VII"),
).not.toBeInTheDocument();
```

Preserve the no-textbox, back-link, Plato-image, and temporary review
pause assertions.

- [ ] **Step 2: Run the descent test and verify RED**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-descent-scene.test.tsx
```

Expected: FAIL on the new story, action, and progress.

- [ ] **Step 3: Consume the approved descent beat**

Replace duplicated copy and progress markup with
`CAVE_STORY_BEATS.descent` and `CaveStoryProgress`. Keep the temporary
review stop but change its heading to `As pessoas estão logo adiante.`
and its support text to `Paramos aqui para revisar a descida antes de
entrar na próxima cena.`

- [ ] **Step 4: Add the entrance choreography**

Animate the veil clearing for 480ms, Plato settling first, and the
dialogue settling 70–90ms later. Use opacity and no more than 20px
lateral travel on desktop or 8px on narrow screens. Do not replace the
responsive positioning transforms; animate the nested image or use the
CSS `translate` property. Disable all entrance animations under reduced
motion.

- [ ] **Step 5: Run all Cave opening tests**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-story-progress.test.tsx src/domains/lessons/use-story-scene-transition.test.tsx src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx src/domains/lessons/as-sombras/cave-descent-scene.test.tsx
```

Expected: all focused tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/domains/lessons/as-sombras/cave-descent-scene.test.tsx src/domains/lessons/as-sombras/cave-descent-scene.tsx src/domains/lessons/as-sombras/cave-descent-scene.module.css
git commit -m "feat: continue the Cave descent story"
```

---

### Task 5: Production and browser verification

**Files:**
- Modify only if verification exposes a scoped defect in Tasks 1–4.

- [ ] **Step 1: Run complete automated verification**

Run each command independently:

```bash
npm test
npm run lint
npm run build
git diff --check
```

Expected: zero test failures, zero lint errors, successful static route
generation, and no whitespace errors.

- [ ] **Step 2: Verify the real transition**

In the local production preview:

1. Open `/aula/as-sombras/primeira-tela`.
2. Confirm `Cena 1 de 10`, the approved copy, and the source mark.
3. Activate `Descer comigo`.
4. Confirm the exit choreography occurs once and lands at
   `/aula/as-sombras/a-descida`.
5. Confirm `Cena 2 de 10`, the referential phrase
   `as pessoas de quem falei`, and the new action.
6. Activate `Chegar até elas` and confirm the temporary review stop.
7. Confirm Back returns to Scene 1.

- [ ] **Step 3: Verify responsive and accessible variants**

Review 1440×900, 1024×768, 820×1180, 390×844, 360×800, and 844×390.
Confirm no horizontal overflow, no clipped educational content, and no
browser console error. Emulate reduced motion and verify that navigation
is immediate and entrance/exit animations are disabled.

- [ ] **Step 4: Leave the review route open**

Reset the viewport override, reload Scene 1 to clear transition state,
show the in-app browser, and keep the Scene 1 tab as the deliverable.
