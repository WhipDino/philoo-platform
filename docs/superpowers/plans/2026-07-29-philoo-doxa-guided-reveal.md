# Philoo Dóxa Guided Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Dóxa scene visually teach the image reveal, explicitly connect the crayon event to Plato’s prisoners, and rebalance Plato across desktop, tablet, and phone.

**Architecture:** `CaveDoxaScene` continues to own the single `revealed` state and gains a separate one-way `hasRevealed` state for the tap cue. Its CSS Module owns the decorative cue animation and responsive composition; no new shared abstraction or dependency is needed.

**Tech Stack:** React 19, Next.js App Router, TypeScript, CSS Modules, Phosphor Icons, Vitest, Testing Library.

## Global Constraints

- Preserve the accepted image asset `/images/story/cave-cropped-event-v1.webp` for both crop states.
- Keep the full image surface as a native button with `aria-expanded`.
- The animated tap cue is decorative, loops only before the first reveal, and remains hidden from assistive technology.
- With reduced motion, the tap cue is stable and all reveal motion is disabled.
- Use the approved concrete crayon explanation and Plato cave analogy verbatim.
- Introduce no grading, score, or right/wrong language.
- Preserve the current tablet composition while improving desktop Plato scale and phone stacking.
- Add no dependency.

---

### Task 1: Guided Dóxa Reveal

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-doxa-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-doxa-scene.module.css`
- Test: `src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx`

**Interfaces:**
- Consumes: existing `revealed` crop state, `PlatoGuide`, accepted crayon image, and Phosphor `HandTapIcon`.
- Produces: one-way `hasRevealed` cue state, decorative `[data-doxa-tap-cue]`, concrete reveal copy, direct Plato analogy, and responsive larger guide layout.

- [ ] **Step 1: Write failing behavior tests**

Add tests proving:

```tsx
expect(container.querySelector("[data-doxa-tap-cue]")).toBeInTheDocument();
fireEvent.click(screen.getByRole("button", { name: /ver o que ficou fora/i }));
expect(container.querySelector("[data-doxa-tap-cue]")).not.toBeInTheDocument();
expect(screen.getByText(/no recorte, parecia que as crianças disputavam o giz/i)).toBeInTheDocument();
expect(screen.getByText(/os prisioneiros faziam o mesmo com as sombras/i)).toBeInTheDocument();
fireEvent.click(screen.getByRole("button", { name: /voltar ao recorte/i }));
expect(container.querySelector("[data-doxa-tap-cue]")).not.toBeInTheDocument();
```

Also assert that the cue wrapper has `aria-hidden="true"` and that the existing image source remains unchanged.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx
```

Expected: FAIL because the cue, concrete crayon copy, and direct Plato analogy do not exist.

- [ ] **Step 3: Implement the one-way cue and teaching sequence**

Import `HandTapIcon`, add:

```ts
const [hasRevealed, setHasRevealed] = useState(false);
```

Change the image button handler so the first opening sets `hasRevealed(true)` and every click still toggles `revealed`. Render the decorative hand cue inside `.imageMat` only while `hasRevealed` is false.

Replace the generic cave and reveal copy with the approved concrete text:

```text
No recorte, parecia que as crianças disputavam o giz. Ao abrir o quadro, vemos que uma estava entregando o giz à outra.
```

```text
Você não inventou a disputa: formou uma ideia com a parte que conseguiu ver. Os prisioneiros faziam o mesmo com as sombras — transformavam uma pista incompleta em uma crença sobre o mundo.
```

Keep the definition as the single abstract explanation and remove the redundant generic paragraphs.

- [ ] **Step 4: Build the visual cue and responsive composition**

Style the cue as a baby-blue tactile circular badge centered over a subtle interaction point on the image. Animate two tap compressions followed by a pause, loop them before reveal, and add a small contact ripple. Use `pointer-events: none`.

On desktop, increase the Plato region and guide image so he fills the lower concept card and aligns with the analogy. At the existing 820px container breakpoint, preserve the two-card tablet row. At 620px, stack compactly without cropping Plato’s face, overlapping copy, or causing horizontal overflow.

Disable cue, image, corner, and reveal animations under `prefers-reduced-motion: reduce`.

- [ ] **Step 5: Run focused tests and lint**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx
npm run lint -- src/domains/lessons/as-sombras/cave-doxa-scene.tsx src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/domains/lessons/as-sombras/cave-doxa-scene.tsx src/domains/lessons/as-sombras/cave-doxa-scene.module.css src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx
git commit -m "feat: guide the doxa image reveal"
```

### Task 2: Responsive and Release Verification

**Files:**
- Modify only the three Task 1 files if verification identifies a regression.

**Interfaces:**
- Consumes: completed guided Dóxa scene.
- Produces: verified and published `codex/story-folio`.

- [ ] **Step 1: Run automated checks**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all tests pass, lint exits cleanly, and all lesson routes build.

- [ ] **Step 2: Inspect the real route**

At `/aula/as-sombras/doxa`, inspect 1280×720, 768×1024, and 390×844. Verify Plato scale, tap cue placement and disappearance, crop expansion, concrete copy, scrolling, keyboard focus, and absence of overlap or horizontal overflow.

- [ ] **Step 3: Push the verified branch**

```bash
git push origin codex/story-folio
```
