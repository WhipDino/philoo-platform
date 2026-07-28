# Responsive Classification Activity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the approved desktop discovery board while adding a purpose-built sequential phone interaction and fixing the collapsed tablet journey rail.

**Architecture:** `CaveEvidenceSortScene` remains the single owner of clue selection, placements, feedback, and scoring. `PhilooDiscoveryTable` renders both the existing board and a mobile-only guided classifier from the same props, with CSS container queries selecting the presentation. The story shell constrains the tablet journey rail independently of activity state.

**Tech Stack:** React 19, TypeScript, CSS Modules, Motion for React, Vitest, Testing Library, Phosphor Icons.

## Global Constraints

- Preserve the current desktop board and its drag-and-drop interaction.
- Portrait phones must not require dragging, rotation, or horizontal scrolling.
- Tablet collapsed journey navigation is a compact 68 × 68 control.
- All responsive modes share the same placement state and scoring callbacks.
- Retain Philoo cream, baby blue, apricot, lavender, rounded typography, and tactile shadows.
- Respect keyboard navigation and `prefers-reduced-motion`.

---

### Task 1: Guided phone classifier

**Files:**
- Modify: `src/domains/lessons/interactions/philoo-discovery-table.tsx`
- Modify: `src/domains/lessons/interactions/philoo-discovery-table.module.css`
- Test: `src/domains/lessons/interactions/philoo-discovery-table.test.tsx`

**Interfaces:**
- Consumes: existing `cards`, `destinations`, `placements`, `selectedCardId`, `onSelectCard`, `onPlaceCard`, and `onMoveCard` props.
- Produces: `[data-mobile-discovery]`, a mobile presentation that invokes `onMoveCard(cardId, destinationId)` directly.

- [ ] **Step 1: Write the failing mobile-flow test**

Render the table and assert that a guided classifier exposes the current clue and all destination buttons:

```tsx
expect(container.querySelector("[data-mobile-discovery]")).toBeInTheDocument();
expect(
  within(container.querySelector("[data-mobile-discovery]")!).getByText(
    "Uma forma cruzou a parede.",
  ),
).toBeInTheDocument();
fireEvent.click(
  within(container.querySelector("[data-mobile-discovery]")!).getByRole(
    "button",
    { name: "Vi — A parede mostrou isso." },
  ),
);
expect(onMoveCard).toHaveBeenCalledWith("shape", "observed");
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```bash
npm test -- src/domains/lessons/interactions/philoo-discovery-table.test.tsx
```

Expected: failure because `[data-mobile-discovery]` does not exist.

- [ ] **Step 3: Implement the shared-state mobile classifier**

Add a `mobileActiveCard` derived from the selected card or first unplaced card.
Render a sibling mobile section containing the active clue, three destination
buttons, progress, and a compact review list. Destination buttons call:

```tsx
onClick={() => onMoveCard(mobileActiveCard.id, destination.id)}
```

Keep the existing `.table` board in the DOM and use container queries:

```css
.mobileDiscovery {
  display: none;
}

@container discovery-table (max-width: 520px) {
  .table {
    display: none;
  }

  .mobileDiscovery {
    display: grid;
  }
}
```

- [ ] **Step 4: Run the focused tests**

Run:

```bash
npm test -- src/domains/lessons/interactions/philoo-discovery-table.test.tsx src/domains/lessons/as-sombras/cave-evidence-sort-scene.test.tsx
```

Expected: all tests pass.

### Task 2: Phone guide composition

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-evidence-sort-scene.module.css`
- Test: `src/domains/lessons/as-sombras/cave-evidence-sort-scene.test.tsx`

**Interfaces:**
- Consumes: existing `.guidance`, `.activityGuide`, and `.guideCopy`.
- Produces: a mobile guide with a larger Plato, readable dialogue, and no overlap.

- [ ] **Step 1: Add a stable activity-layout marker assertion**

Assert the scene retains the guide and discovery contracts:

```tsx
expect(container.querySelector("[data-activity-guidance]")).toBeInTheDocument();
expect(container.querySelector("[data-mobile-discovery]")).toBeInTheDocument();
```

- [ ] **Step 2: Add `data-activity-guidance` to the guide card**

```tsx
<div className={styles.guidance} data-activity-guidance>
```

- [ ] **Step 3: Implement the phone composition**

At `max-width: 540px`, give the guide a two-row layout, enlarge Plato to at
least 176 px wide, position him against the bottom-left edge, and place the
dialogue in a readable right-hand area without clipping the head.

- [ ] **Step 4: Run the scene test**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-evidence-sort-scene.test.tsx
```

Expected: both scene tests pass.

### Task 3: Tablet journey bounds

**Files:**
- Modify: `src/domains/lessons/philoo-story-shell.module.css`
- Modify: `src/domains/lessons/philoo-lesson-journey-rail.module.css`
- Test: `src/domains/lessons/philoo-story-primitives.test.tsx`

**Interfaces:**
- Consumes: `[data-journey-state="collapsed"]` and `[data-philoo-journey-rail]`.
- Produces: a compact collapsed tablet control and a bounded expanded overlay.

- [ ] **Step 1: Preserve journey state contracts in component tests**

Keep the existing expanded/collapsed assertions and add an assertion that the
rail exposes `data-expanded="false"` after clicking the collapse button.

- [ ] **Step 2: Fix the tablet collapsed rail**

Within `721px–1180px`, set the collapsed rail and its layers to 68 px:

```css
.journeyLayout[data-journey-state="collapsed"]
  > [data-philoo-journey-rail] {
  top: auto;
  width: 68px;
  height: 68px;
  min-height: 0;
}
```

Apply the compact-card rules currently limited to phone widths to tablet
collapsed mode as well. Keep the expanded overlay bounded by `top: 82px` and
`bottom: 18px`, with internal scrolling.

- [ ] **Step 3: Run shell and rail tests**

Run:

```bash
npm test -- src/domains/lessons/philoo-story-primitives.test.tsx src/domains/lessons/philoo-lesson-journey-rail.test.tsx
```

Expected: all tests pass.

### Task 4: Responsive verification

**Files:**
- Verify: `src/domains/lessons/interactions/philoo-discovery-table.module.css`
- Verify: `src/domains/lessons/as-sombras/cave-evidence-sort-scene.module.css`
- Verify: `src/domains/lessons/philoo-story-shell.module.css`

**Interfaces:**
- Consumes: the complete responsive activity.
- Produces: verified phone, tablet, and desktop behavior.

- [ ] **Step 1: Run static verification**

```bash
npm run lint -- --quiet
npm test
git diff --check
```

Expected: lint and all tests pass with no whitespace errors.

- [ ] **Step 2: Verify representative viewports**

Inspect the lesson at 390 × 844, 768 × 1024, 1024 × 768, and 1440 × 900.
Confirm no horizontal overflow, the phone classifier is sequential, the tablet
collapsed rail is 68 × 68 and does not overlap content, expanded rail stays
within the lesson bounds, and the desktop board remains unchanged.

- [ ] **Step 3: Commit and push**

```bash
git add src docs/superpowers/plans/2026-07-28-responsive-classification-activity.md
git commit -m "feat: adapt classification activity across screens"
git push origin codex/story-folio
```
