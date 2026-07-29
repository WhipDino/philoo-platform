# First Doubt Split Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Scene 9 a narrow narration column and a substantially larger adjacent image on wide screens while preserving the stacked reading order on smaller screens.

**Architecture:** Keep the existing `CaveFirstDoubtScene` state flow and markup. Change only the scene-specific CSS grid so both narrative beats use a 35/65 horizontal split above the responsive breakpoint and return to text-first stacking below it.

**Tech Stack:** React, Next.js, CSS Modules, Vitest, Testing Library

## Global Constraints

- Preserve Philoo’s cream, baby-blue, rounded folio identity.
- Keep narration before the image in DOM order.
- Use the split layout only where both columns remain readable.
- Preserve keyboard focus and reduced-motion behavior.

---

### Task 1: Responsive split narrative layout

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-first-doubt-scene.module.css`
- Test: `src/domains/lessons/as-sombras/cave-first-doubt-scene.test.tsx`

**Interfaces:**
- Consumes: Existing `.storyReveal`, `.storyCaption`, and `.storyFrame` classes.
- Produces: A 35/65 wide-screen grid with a text-first stacked fallback at `max-width: 880px`.

- [ ] **Step 1: Preserve narrative order coverage**

Keep the existing DOM-order assertion proving the narration precedes the image.

- [ ] **Step 2: Implement the wide-screen grid**

Set `.storyReveal` to two columns, place the narration in the first column and the image in the second, and make both fill the available scene height. Remove the horizontal-card assumptions from `.storyCaption` so its action sits beneath the copy.

- [ ] **Step 3: Restore the stacked responsive layout**

At `max-width: 880px`, switch `.storyReveal` back to a single-column, text-first layout with a large 16:10 image.

- [ ] **Step 4: Verify**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-first-doubt-scene.test.tsx
npm run build
```

Expected: four focused tests pass and the production build completes.
