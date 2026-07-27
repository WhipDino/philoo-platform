# Philoo Soft-Story Identity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> `superpowers:subagent-driven-development` (recommended) or
> `superpowers:executing-plans` to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved Philoo cream/baby-blue story identity to every
currently implemented “As Sombras” surface and give every authored Platão
dialogue beat a context-matched character pose.

**Architecture:** Add a semantic Platão pose catalog and small shared story
primitives, then migrate the cinematic scenes and the persisted lesson without
changing their learning logic. Route and beat transitions remain centralized
and reduced-motion safe.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, Motion, Vitest,
Testing Library, generated transparent PNG assets.

## Global Constraints

- Primary blue is `#33BFED`; supporting blue is `#5BB8F5`; canvas is `#FBF8F3`.
- Platão generation uses only `/public/images/story/plato-welcome-v2.png` as
  the identity reference.
- No character halo or oval backdrop.
- Every distinct cinematic Platão dialogue beat selects a matching pose.
- Preserve persisted lesson data contracts, graph transitions, and pedagogy.
- All motion must provide a reduced-motion path.

---

### Task 1: Add the semantic pose catalog and shared story primitives

**Files:**
- Create: `src/domains/lessons/plato-pose-catalog.ts`
- Create: `src/domains/lessons/philoo-story-shell.tsx`
- Create: `src/domains/lessons/philoo-story-shell.module.css`
- Create: `src/domains/lessons/philoo-dialogue-card.tsx`
- Create: `src/domains/lessons/philoo-dialogue-card.module.css`
- Create: `src/domains/lessons/plato-guide.tsx`
- Create: `src/domains/lessons/plato-guide.module.css`
- Create: `src/domains/lessons/philoo-story-primitives.test.tsx`

**Interfaces:**
- Produces: `PlatoPoseKey`, `PLATO_POSES`, and `getPlatoPose(key)`.
- Produces: shared shell, dialogue-card, and guide components.

- [ ] Write tests that require semantic pose lookup, contextual alt text, a
  stable guide image box, dialogue live-region semantics, and decorative
  `aria-hidden` frame treatment.
- [ ] Run the focused test and confirm it fails because the modules do not
  exist.
- [ ] Implement the catalog and components with the approved tokens.
- [ ] Run the focused test and confirm it passes.

### Task 2: Generate and validate Platão pose assets

**Files:**
- Create: `public/images/story/plato-*-v1.png` for every new semantic pose in
  the design specification.

**Interfaces:**
- Consumed by: `PLATO_POSES`.

- [ ] Inspect the canonical reference.
- [ ] Generate each distinct pose from the same reference with identity
  invariants and a transparent background.
- [ ] Validate identity, action, alpha channel, transparent corners, padding,
  and absence of text/background/watermark.
- [ ] Optimize only when needed without reducing visible quality.

### Task 3: Migrate cinematic Scenes 1–3

**Files:**
- Modify: `cave-invitation-scene.tsx` and its CSS/test.
- Modify: `cave-descent-scene.tsx` and its CSS/test.
- Modify: `cave-prisoner-wall-scene.tsx` and its CSS/test.

**Interfaces:**
- Consumes: shared story primitives and pose catalog.

- [ ] Add failing assertions for the shared identity contract and per-beat
  Scene 3 pose changes.
- [ ] Confirm the focused tests fail for the missing behavior.
- [ ] Migrate the three scenes and map every dialogue beat to a semantic pose.
- [ ] Add coordinated card/pose transitions with reduced-motion handling.
- [ ] Confirm focused tests pass.

### Task 4: Migrate cinematic Scene 4 and the first activity

**Files:**
- Modify: `cave-shadow-names-scene.tsx` and its CSS/test.
- Modify: `cave-evidence-sort-scene.tsx` and its CSS/test.

**Interfaces:**
- Consumes: shared story primitives and pose catalog.

- [ ] Add failing assertions for per-beat Scene 4 pose changes, removal of the
  AI-composite active artwork, and Philoo activity materials.
- [ ] Confirm the focused tests fail.
- [ ] Recompose Scene 4 with deterministic CSS/SVG shadow motifs and
  context-matched Platão poses.
- [ ] Restyle Scene 5 without changing its evidence-placement logic.
- [ ] Confirm focused tests pass.

### Task 5: Restyle the persisted lesson and map authored guide poses

**Files:**
- Modify: `src/domains/lessons/lesson-player.module.css`
- Modify: `src/domains/lessons/as-sombras/as-sombras.module.css`
- Modify: authored guide image references in the existing As Sombras scene
  components.
- Modify: existing player/opening/closing scene tests as required.

**Interfaces:**
- Preserves: manifest, attempt store, response envelopes, transition names.
- Consumes: semantic pose catalog.

- [ ] Add failing visual-contract assertions for the light Philoo shell and
  semantic guide pose sources.
- [ ] Confirm focused tests fail.
- [ ] Replace permanent dark chrome with the approved materials and map guide
  appearances to semantic poses.
- [ ] Keep evidence stages localized and readable.
- [ ] Confirm focused and persistence tests pass.

### Task 6: Verify, review, and commit

**Files:**
- Modify only when verification reveals a defect.

**Interfaces:**
- Produces: a reviewed, local-only branch state.

- [ ] Run all focused cinematic and persisted-lesson tests.
- [ ] Run `npm test`, `npm run lint`, and `npm run build`.
- [ ] Review the cinematic route and persisted lesson at desktop, tablet, and
  mobile sizes; fix clipping, overflow, layout shift, and pose mismatches.
- [ ] Check reduced-motion behavior.
- [ ] Run a final code review over the complete diff.
- [ ] Commit the verified result without pushing or deploying.
