# Philoo Causal Path Activity Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade “O caminho da sombra” so learners see a real drag demonstration, understand every causal step, can revise placements, and use a balanced responsive activity board.

**Architecture:** `PhilooCausalPath` remains the single owner of learner state, validation, announcements, removal, and focus. A new isolated `PhilooCausalPathDemonstration` component renders the briefing-only animation without accessing learner state, while `CaveShadowPathScene` supplies lesson-specific Portuguese copy, hints, and completion state.

**Tech Stack:** Next.js App Router, React 19, TypeScript, CSS Modules, Phosphor Icons, Vitest, Testing Library.

## Global Constraints

- Preserve the causal objective exactly as `Luz → Objeto → Sombra → Nomeiam`.
- Keep native drag, pointer drag, and select-then-place controls.
- Use the exact four approved Portuguese hints from the design specification.
- The demonstrated `Luz` position is fixed and cannot be removed.
- Clicking a learner-controlled filled position returns its piece to the tray and returns focus to it.
- Reduced motion shows the demonstration’s stable final state without cursor travel, looping, or pulsing.
- Desktop and tablet use a horizontal path; phone uses a sequential vertical path without horizontal overflow.
- Do not add a new dependency.

---

### Task 1: Reversible Causal Path State

**Files:**
- Modify: `src/domains/lessons/interactions/philoo-causal-path.tsx`
- Modify: `src/domains/lessons/interactions/philoo-causal-path.module.css`
- Test: `src/domains/lessons/interactions/philoo-causal-path.test.tsx`

**Interfaces:**
- Consumes: `CausalPathItem[]`, `correctOrder`, `demonstratedItemId`, and lesson-supplied `positionHints`.
- Produces: `positionHints: readonly string[]`, `onIncomplete?: () => void`, removable learner positions, restored focus, and synchronized completion state.

- [ ] **Step 1: Write failing behavior and accessibility tests**

Add focused tests that render:

```tsx
<PhilooCausalPath
  items={items}
  correctOrder={["light", "object", "shadow", "name"]}
  demonstratedItemId="light"
  positionHints={[
    "A fogueira produz a luz.",
    "O que a luz encontra pelo caminho?",
    "O que aparece quando a luz é bloqueada?",
    "O que as pessoas fazem quando reconhecem a forma?",
  ]}
  onComplete={onComplete}
  onIncomplete={onIncomplete}
/>
```

Assert that all four hints appear, placement replaces a hint with the piece explanation, a filled learner position exposes `Posição 2, Objeto. Devolver peça`, clicking it restores the original hint and tray focus, `Luz` has no removal action, and removal after completion calls `onIncomplete`.

- [ ] **Step 2: Run the focused test and verify failure**

Run:

```bash
npm test -- src/domains/lessons/interactions/philoo-causal-path.test.tsx
```

Expected: FAIL because `positionHints`, removal behavior, and `onIncomplete` are not implemented.

- [ ] **Step 3: Implement one-state placement and removal**

Add the props:

```ts
positionHints: readonly string[];
onIncomplete?: () => void;
```

Track tray button refs by item id and a pending focus id. Implement `removeItem(destinationIndex)` so it:

- refuses the demonstrated position;
- replaces the learner position with `null`;
- clears selection and completion;
- resets the completion-report guard so a corrected path can complete again;
- calls `onIncomplete` only when the path had been complete;
- announces `Peça devolvida. Continue montando o caminho.`;
- restores focus to the returned tray button after React commits the state.

Use `positionHints[positionIndex]` for empty positions and the placed item explanation for filled positions. Keep the filled position as the explicit removal control while the demonstrated position remains non-removable.

- [ ] **Step 4: Improve tactile and responsive position styling**

Increase path-card height and spacing without changing the Philoo blue/cream identity. Give filled removable positions a clear hover/focus affordance, preserve the fixed light styling, and ensure the vertical phone path has no forced horizontal minimum.

- [ ] **Step 5: Run focused tests**

Run:

```bash
npm test -- src/domains/lessons/interactions/philoo-causal-path.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/domains/lessons/interactions/philoo-causal-path.tsx src/domains/lessons/interactions/philoo-causal-path.module.css src/domains/lessons/interactions/philoo-causal-path.test.tsx
git commit -m "feat: make causal path reversible"
```

### Task 2: Live Briefing Demonstration

**Files:**
- Create: `src/domains/lessons/interactions/philoo-causal-path-demonstration.tsx`
- Create: `src/domains/lessons/interactions/philoo-causal-path-demonstration.module.css`
- Create: `src/domains/lessons/interactions/philoo-causal-path-demonstration.test.tsx`

**Interfaces:**
- Consumes: no learner state or callbacks.
- Produces: `PhilooCausalPathDemonstration(): React.JSX.Element`, containing exact visible labels `Objeto`, `Posição 2`, and replay control `Ver novamente`.

- [ ] **Step 1: Write failing demonstration tests**

Test that the component shows `Objeto`, `Posição 2`, an accessible demonstration description, and a `Ver novamente` button. Click replay and assert the animation stage receives a new run key while no learner callbacks or progress props exist.

- [ ] **Step 2: Run the focused test and verify failure**

Run:

```bash
npm test -- src/domains/lessons/interactions/philoo-causal-path-demonstration.test.tsx
```

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Build the isolated animated miniature**

Create a client component with a replay counter:

```tsx
const [run, setRun] = useState(0);
```

Render a compact tray piece, curved guide, destination slot, and Phosphor cursor icon. Use CSS keyframes to lift and move the object, reveal the filled destination, and pulse success. Remount only the animated stage when replay increments. Keep the entire animated layer illustrative and `aria-hidden`, with a concise accessible description on the wrapper.

- [ ] **Step 4: Add reduced-motion behavior**

Within:

```css
@media (prefers-reduced-motion: reduce)
```

hide the travelling cursor/proxy, show the destination in its completed `Objeto` state immediately, and disable pulse/loop animations.

- [ ] **Step 5: Run focused tests**

Run:

```bash
npm test -- src/domains/lessons/interactions/philoo-causal-path-demonstration.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/domains/lessons/interactions/philoo-causal-path-demonstration.tsx src/domains/lessons/interactions/philoo-causal-path-demonstration.module.css src/domains/lessons/interactions/philoo-causal-path-demonstration.test.tsx
git commit -m "feat: animate causal path briefing"
```

### Task 3: Scene Copy, Completion, and Board Composition

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-shadow-path-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-shadow-path-scene.module.css`
- Test: `src/domains/lessons/as-sombras/cave-shadow-path-scene.test.tsx`

**Interfaces:**
- Consumes: `PhilooCausalPathDemonstration`, `positionHints`, and `onIncomplete`.
- Produces: the approved `Nomeiam` copy, real popup demonstration, reversible scene completion, and centered desktop/tablet/phone composition.

- [ ] **Step 1: Write failing scene integration tests**

Assert that the scene passes and displays `Nomeiam`, `Elas nomeiam a forma que interpretam.`, all four approved hints, `Objeto`, `Posição 2`, and `Ver novamente`. Complete the path, verify `Conhecer a dóxa`, remove a filled piece, and verify the completion link disappears.

- [ ] **Step 2: Run the focused test and verify failure**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-shadow-path-scene.test.tsx
```

Expected: FAIL on old `Nome` copy, static briefing, and irreversible scene completion.

- [ ] **Step 3: Integrate approved content and behavior**

Change the final item to:

```ts
{
  id: "name",
  label: "Nomeiam",
  explanation: "Elas nomeiam a forma que interpretam.",
}
```

Pass the exact four approved hints, wire `onIncomplete={() => setComplete(false)}`, and replace the static fire/arrow briefing content with `<PhilooCausalPathDemonstration />`.

- [ ] **Step 4: Rebalance the activity board**

Make the scene body a centered board with deliberate vertical gaps between heading, tray, path, and feedback. Use the available lower stage space rather than pinning content to the top. Preserve a horizontal desktop/tablet path and allow a comfortable vertical phone layout inside the lesson surface.

- [ ] **Step 5: Run scene and interaction tests**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-shadow-path-scene.test.tsx src/domains/lessons/interactions/philoo-causal-path.test.tsx src/domains/lessons/interactions/philoo-causal-path-demonstration.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/domains/lessons/as-sombras/cave-shadow-path-scene.tsx src/domains/lessons/as-sombras/cave-shadow-path-scene.module.css src/domains/lessons/as-sombras/cave-shadow-path-scene.test.tsx
git commit -m "feat: upgrade shadow path lesson"
```

### Task 4: Looping Trail Demonstration Refinement

**Files:**
- Modify: `src/domains/lessons/interactions/philoo-causal-path-demonstration.tsx`
- Modify: `src/domains/lessons/interactions/philoo-causal-path-demonstration.module.css`
- Test: `src/domains/lessons/interactions/philoo-causal-path-demonstration.test.tsx`

**Interfaces:**
- Consumes: the reviewed isolated briefing demonstration.
- Produces: a cursor-free automatic loop with a larger moving `Objeto` pill and a dotted trail that progressively draws behind it.

- [ ] **Step 1: Write failing refinement tests**

Assert that the component has no cursor icon/hook or replay button, exposes an automatic-loop stage hook, and renders separate stable hooks for the moving pill and progressively drawn trail.

- [ ] **Step 2: Run the focused test and verify failure**

Run:

```bash
npm test -- src/domains/lessons/interactions/philoo-causal-path-demonstration.test.tsx
```

Expected: FAIL because the current demonstration still includes a cursor and manual replay control.

- [ ] **Step 3: Implement the automatic trail loop**

Remove the cursor completely. Enlarge the travelling `Objeto` pill while keeping it inside the miniature tray and destination. Animate the pill repeatedly along the existing curve, and animate the dotted SVG path’s dash offset so the visible trail grows from the tray to the current pill position rather than appearing all at once.

Pause briefly in the completed state before resetting the animation. Keep the wrapper’s concise accessible description and ensure `prefers-reduced-motion: reduce` still renders only the stable final state with no loop, travel, or pulse.

- [ ] **Step 4: Run focused tests and lint**

Run:

```bash
npm test -- src/domains/lessons/interactions/philoo-causal-path-demonstration.test.tsx
npm run lint -- src/domains/lessons/interactions/philoo-causal-path-demonstration.tsx src/domains/lessons/interactions/philoo-causal-path-demonstration.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domains/lessons/interactions/philoo-causal-path-demonstration.tsx src/domains/lessons/interactions/philoo-causal-path-demonstration.module.css src/domains/lessons/interactions/philoo-causal-path-demonstration.test.tsx
git commit -m "refactor: loop causal path demonstration"
```

### Task 5: Full Verification and Publication

**Files:**
- Modify only if verification finds a regression in the files listed above.

**Interfaces:**
- Consumes: completed Tasks 1–4.
- Produces: verified and pushed `codex/story-folio`.

- [ ] **Step 1: Run the complete automated checks**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all tests pass, lint exits cleanly, and all lesson routes build.

- [ ] **Step 2: Verify the real route visually**

Inspect `/aula/as-sombras/o-que-existe-atras` at `1280×720`, `768×1024`, and `390×844`. At each viewport verify:

- popup animation and replay;
- no horizontal overflow or clipped controls;
- path cards and hints remain readable;
- clicking a filled slot returns its piece;
- phone order is sequential;
- lower stage space is balanced.

- [ ] **Step 3: Review the diff against the specification**

Confirm the exact labels and hint copy, absence of new dependencies, reduced-motion CSS, fixed light behavior, completion reversal, and focus restoration.

- [ ] **Step 4: Push the branch**

```bash
git push origin codex/story-folio
```
