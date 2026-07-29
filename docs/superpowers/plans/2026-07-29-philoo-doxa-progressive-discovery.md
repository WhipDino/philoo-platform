# Philoo Dóxa Progressive Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the overloaded Dóxa dashboard with a four-moment guided discovery that teaches the word, incomplete evidence, the reveal, and Plato's cave connection one at a time.

**Architecture:** Keep the interaction inside `CaveDoxaScene` and model the experience with a local `DoxaMoment` state. The existing accepted image asset, lesson shell, folio stage, Plato guide, and journey panel remain unchanged; only the scene composition and its local tests/styles change.

**Tech Stack:** Next.js 16, React 19 client state, CSS Modules, Testing Library, Vitest, Phosphor icons.

## Global Constraints

- Preserve Philoo's cream `#FBF8F3`, baby-blue `#33BFED` / `#5BB8F5`, rounded tactile identity.
- Present only one cognitive task at a time.
- Keep the full image interaction keyboard accessible.
- Hide the looping tap cue from assistive technology and disable its motion under `prefers-reduced-motion`.
- Plato must not appear until the final connection moment.
- Keep the same `/aula/as-sombras/doxa` route and accepted `cave-cropped-event-v1.webp` asset.

---

### Task 1: Progressive Dóxa interaction

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-doxa-scene.tsx`
- Test: `src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx`

**Interfaces:**
- Consumes: `PhilooStoryShell`, `PhilooFolioStage`, `PlatoGuide`, `HandTapIcon`, and the existing lesson route.
- Produces: `type DoxaMoment = "meaning" | "observe" | "reveal" | "connect"` and the four-stage `CaveDoxaScene` interaction.

- [ ] **Step 1: Replace the existing simultaneous-content expectations with failing progressive-flow tests**

```tsx
it("guides the learner through meaning, observation, reveal, and connection", () => {
  const { container } = render(<CaveDoxaScene />);

  expect(screen.getByText(/dóxa é uma opinião ou crença/i)).toBeInTheDocument();
  expect(screen.queryByRole("img", { name: /duas crianças/i })).not.toBeInTheDocument();
  expect(container.querySelector('[data-plato-pose="doxa"]')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /ver um exemplo/i }));
  expect(screen.getByText(/olhando apenas para este recorte/i)).toBeInTheDocument();
  expect(container.querySelector("[data-doxa-tap-cue]")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /revelar o quadro inteiro/i }));
  expect(screen.getByText(/talvez tenha parecido/i)).toBeInTheDocument();
  expect(screen.getByText(/entregando o giz à outra/i)).toBeInTheDocument();
  expect(container.querySelector("[data-doxa-tap-cue]")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /entender o que aconteceu/i }));
  expect(container.querySelector('[data-plato-pose="doxa"]')).toBeInTheDocument();
  expect(screen.getByText(/isso é dóxa/i)).toBeInTheDocument();
  expect(screen.getByText(/os prisioneiros faziam o mesmo/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the focused test and verify the new sequence fails**

Run: `npm test -- src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx`

Expected: FAIL because the image and Plato are currently rendered together and the stage buttons do not exist.

- [ ] **Step 3: Implement the explicit moment state and stage content**

```tsx
type DoxaMoment = "meaning" | "observe" | "reveal" | "connect";

const [moment, setMoment] = useState<DoxaMoment>("meaning");

const advanceTo = (next: DoxaMoment) => {
  setMoment(next);
};
```

Render one stage at a time:

```tsx
{moment === "meaning" ? <MeaningStage onContinue={() => advanceTo("observe")} /> : null}
{moment === "observe" ? <ObserveStage onReveal={() => advanceTo("reveal")} /> : null}
{moment === "reveal" ? <RevealStage onContinue={() => advanceTo("connect")} /> : null}
{moment === "connect" ? <ConnectionStage /> : null}
```

Use the approved Portuguese copy from the design specification. Keep the image button's `aria-label` as `Revelar o quadro inteiro`, and place `data-doxa-tap-cue` only in the observe stage.

- [ ] **Step 4: Focus the new heading after explicit button transitions**

Add a stage heading ref and focus it after state changes:

```tsx
const stageHeadingRef = useRef<HTMLHeadingElement>(null);

useEffect(() => {
  if (moment !== "meaning") {
    stageHeadingRef.current?.focus();
  }
}, [moment]);
```

Give the heading `tabIndex={-1}` and preserve visible focus styling only for keyboard users.

- [ ] **Step 5: Run the focused tests and verify the sequence passes**

Run: `npm test -- src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx`

Expected: all Dóxa tests pass with the tap cue absent after reveal and Plato absent before connection.

- [ ] **Step 6: Commit the interaction**

```bash
git add src/domains/lessons/as-sombras/cave-doxa-scene.tsx src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx
git commit -m "feat: guide learners through doxa"
```

### Task 2: Single-stage Philoo composition

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-doxa-scene.module.css`
- Test: `src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx`

**Interfaces:**
- Consumes: the four moment-specific class names rendered by Task 1.
- Produces: a responsive central stage with `data-moment`-driven entrance motion and a final Plato connection layout.

- [ ] **Step 1: Add structural assertions for one active learning surface**

```tsx
expect(container.querySelectorAll("[data-doxa-moment]")).toHaveLength(1);
expect(container.querySelector("[data-doxa-stage]")).toHaveAttribute(
  "data-moment",
  "meaning",
);
```

Advance through the sequence and assert the same stage reports `observe`, `reveal`, then `connect`.

- [ ] **Step 2: Run the focused test and verify the missing stage markers fail**

Run: `npm test -- src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx`

Expected: FAIL because the new structural attributes are not yet rendered.

- [ ] **Step 3: Replace the two-column dashboard CSS with one central learning stage**

Implement:

```css
.scene {
  display: grid;
  min-height: clamp(560px, 68vh, 760px);
}

.stage {
  display: grid;
  align-content: center;
  width: min(100%, 1120px);
  margin-inline: auto;
  padding: clamp(24px, 4vw, 56px);
  border: 2px solid color-mix(in srgb, var(--philoo-blue) 24%, white);
  border-radius: clamp(28px, 3vw, 46px);
  background: rgba(255, 253, 249, 0.96);
  box-shadow: 0 12px 0 rgba(51, 191, 237, 0.24), 0 28px 60px rgba(33, 73, 96, 0.12);
}
```

Moment layouts:

- `meaning`: centered word artifact with one action.
- `observe` and `reveal`: image width `min(100%, 920px)` with copy below it.
- `connect`: two columns on desktop with Plato at least `240px` tall; stack Plato above speech below `760px`.

- [ ] **Step 4: Add restrained stage motion and reduced-motion behavior**

Use a 240ms opacity/translate transition for each new stage. Keep the existing two-tap cue loop only in `observe`. Under `prefers-reduced-motion: reduce`, remove the cue animation and stage translation.

- [ ] **Step 5: Run verification**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx
npm run lint
npm run build
git diff --check
```

Expected: Dóxa tests pass, lint has no new errors, build exits 0, and diff check is clean.

- [ ] **Step 6: Inspect real layouts**

Open `/aula/as-sombras/doxa` and verify:

- Desktop: 1280×720
- Tablet: 768×1024
- Phone: 390×844
- Image click advances once and removes the cue.
- The connection moment shows a large Plato aligned with his explanation.

- [ ] **Step 7: Commit and publish**

```bash
git add src/domains/lessons/as-sombras/cave-doxa-scene.module.css src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx
git commit -m "style: focus the doxa discovery stage"
git push origin codex/story-folio
```
