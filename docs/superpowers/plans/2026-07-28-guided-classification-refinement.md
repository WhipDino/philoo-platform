# Guided Classification Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the first Cave classification activity with an anchored Plato portrait, visible drag layering, clear progress, purposeful completion, and responsive desktop/tablet/mobile layouts.

**Architecture:** Keep Cave-specific learning state in `CaveEvidenceSortScene` and presentation in `PhilooDiscoveryTable`. Add explicit visual state attributes for dragging and completion instead of creating lesson-specific forks. Generate one activity-specific Plato portrait from the canonical reference and register it semantically.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, Motion 12, Vitest, Testing Library, built-in image generation.

## Global Constraints

- Preserve `#33BFED`, `#5BB8F5`, `#FBF8F3`, ink, apricot, and lavender activity colors.
- Dragging remains primary; click/tap and keyboard placement remain available.
- Philosopher identity comes only from `public/images/plato/reference/plato-canonical.png`.
- Do not finalize the activity as a permanent library standard until the complete first lesson is approved.
- Desktop and tablet are primary, with a fully usable phone layout.

---

### Task 1: Working-draft documentation state

**Files:**
- Modify: `docs/product/activity-patterns/guided-classification-board.md`
- Modify: `docs/superpowers/specs/2026-07-28-philoo-discovery-table-activity-design.md`

**Interfaces:**
- Consumes: the approved visual direction.
- Produces: an explicit experimental status that can be finalized after lesson approval.

- [ ] Mark both documents as working drafts/reference experiments.
- [ ] State that final library extraction happens after the first lesson is complete.
- [ ] Run `git diff --check`.

### Task 2: Canonical Plato activity portrait

**Files:**
- Create: `public/images/story/plato-v2/plato-guided-classification-v1.png`
- Modify: `src/domains/lessons/plato-pose-catalog.ts`
- Modify: `src/domains/lessons/as-sombras/cave-evidence-sort-scene.tsx`

**Interfaces:**
- Consumes: canonical Plato reference and semantic pose catalog.
- Produces: pose key `"guided-classification"` rendered by `PlatoGuide`.

- [ ] Generate a chroma-key portrait showing canonical Plato from upper chest upward, warmly speaking and gesturing toward screen-right.
- [ ] Remove the chroma key and verify alpha, face, clothing, laurels, hands, and edge quality.
- [ ] Add the semantic pose to the catalog with contextual alt text.
- [ ] Use the pose in the untouched activity state and preserve feedback poses.

### Task 3: Drag visibility and purposeful board states

**Files:**
- Modify: `src/domains/lessons/interactions/philoo-discovery-table.tsx`
- Modify: `src/domains/lessons/interactions/philoo-discovery-table.module.css`
- Test: `src/domains/lessons/interactions/philoo-discovery-table.test.tsx`

**Interfaces:**
- Consumes: `draggedCardId`, placements, cards, and destinations.
- Produces: `data-dragging`, `data-drag-source`, `data-complete`, and `data-empty` visual contracts.

- [ ] Write failing tests asserting the dragging and completion state attributes.
- [ ] Run the focused test and verify it fails because the attributes are absent.
- [ ] Add the minimal attributes and completed-tray copy.
- [ ] Raise the source stacking context while dragging so cards cross above every pocket.
- [ ] Keep tray height stable while cards remain; when the final card is placed, switch once to a compact completion strip above widened pockets.
- [ ] Run the focused tests and verify they pass.

### Task 4: Guide card, fraction badge, and responsive composition

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-evidence-sort-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-evidence-sort-scene.module.css`
- Test: `src/domains/lessons/as-sombras/cave-evidence-sort-scene.test.tsx`

**Interfaces:**
- Consumes: the `"guided-classification"` pose and `placedCount`.
- Produces: emerging portrait composition and accessible `current / total` progress.

- [ ] Write a failing scene test for the spoken challenge, secondary fallback guidance, and fraction labels.
- [ ] Run the scene test and verify the missing semantic fraction fails.
- [ ] Place the portrait behind a foreground card lip so shoulders appear anchored.
- [ ] Separate Plato's spoken challenge from the smaller fallback instruction.
- [ ] Replace the uneven inline fraction with centered numerator, rule, and denominator using tabular numerals.
- [ ] Tune desktop, tablet, and phone container queries without narrowing readable copy.
- [ ] Run the scene and interaction tests.

### Task 5: Visual and branch verification

**Files:**
- Verify: `/aula/as-sombras/o-que-chegou-ate-eles`

**Interfaces:**
- Consumes: the finished activity.
- Produces: verified screenshots and committed branch state.

- [ ] Verify untouched, partial, dragging, and completed states.
- [ ] Verify desktop, landscape tablet, portrait tablet, and phone layouts.
- [ ] Run focused tests and lint.
- [ ] Commit implementation changes.
- [ ] Push `codex/story-folio`.
