# Philoo Soft Frame Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable, topic-neutral Philoo background language with pastel tactile depth.

**Architecture:** Create one decorative `PhilooSoftFrame` component that renders a soft character halo, incomplete rounded rails, and raised pebble marks. Scene content remains independent and only supplies the philosopher side.

**Tech Stack:** React 19, Next.js 16, CSS Modules, inline SVG.

## Global Constraints

- Use Philoo cream `#FBF8F3`, baby blues derived from `#33BFED` and `#5BB8F5`, and no topic-specific symbols.
- Keep the decoration `aria-hidden`, non-interactive, and behind lesson content.
- Add no new dependency.
- Preserve Scene 3 copy, controls, routes, progress, keyboard focus, and mobile layout.

---

### Task 1: Build and integrate the Philoo Soft Frame

**Files:**
- Create: `src/domains/lessons/philoo-soft-frame.tsx`
- Create: `src/domains/lessons/philoo-soft-frame.module.css`
- Modify: `src/domains/lessons/as-sombras/cave-prisoner-wall-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-prisoner-wall-scene.module.css`
- Test: `src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx`

**Interfaces:**
- Produces: `PhilooSoftFrame({ characterSide?: "left" | "right" })`
- Consumes: Scene 3 renders `<PhilooSoftFrame characterSide="right" />`.

- [ ] **Step 1: Write the failing integration assertion**

```tsx
const { container } = render(<CavePrisonerWallScene />);
expect(
  container.querySelector("[data-philoo-soft-frame]"),
).toHaveAttribute("aria-hidden", "true");
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- cave-prisoner-wall-scene.test.tsx
```

Expected: failure because the reusable frame is absent.

- [ ] **Step 3: Add the reusable decorative component**

Create `PhilooSoftFrame` with a `characterSide` prop, an accessible decorative boundary, a responsive character halo, two incomplete rounded SVG rails, and three tactile pebble marks. Use pastel-colored offset shadows to establish the Philoo physical language.

- [ ] **Step 4: Integrate beneath Scene 3 content**

Render the frame immediately after the scene heading and keep `.conversationLayout` above it with an explicit z-index. Do not change dialogue behavior.

- [ ] **Step 5: Verify GREEN and inspect responsive composition**

Run:

```bash
npm test -- cave-prisoner-wall-scene.test.tsx
```

Inspect the first beat at laptop and phone sizes. Confirm the frame does not obscure text, controls, or Platão.

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/plans/2026-07-27-philoo-soft-frame.md \
  src/domains/lessons/philoo-soft-frame.tsx \
  src/domains/lessons/philoo-soft-frame.module.css \
  src/domains/lessons/as-sombras/cave-prisoner-wall-scene.tsx \
  src/domains/lessons/as-sombras/cave-prisoner-wall-scene.module.css \
  src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx
git commit -m "feat: add reusable Philoo soft frame"
```
