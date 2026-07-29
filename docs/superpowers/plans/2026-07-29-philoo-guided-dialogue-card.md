# Philoo Guided Dialogue Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Dóxa connection moment's blue character aura with a clearly attributed, tactile Philoo dialogue composition.

**Architecture:** Keep the existing four-moment state flow and `PlatoGuide` asset. Restructure only the connection moment into a character surface, a decorative voice bridge, and a semantic dialogue card; CSS owns the responsive composition and reduced-motion behavior.

**Tech Stack:** React, TypeScript, CSS Modules, Vitest, Testing Library

## Global Constraints

- Use the existing cream, navy, and Philoo baby-blue tokens.
- Do not add dependencies or generate a new Plato asset.
- Do not use a speech-balloon triangle, spotlight oval, gradient aura, or internal scrolling.
- Preserve the existing link destination and lesson progression.

---

### Task 1: Build the guided-dialogue connection moment

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-doxa-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-doxa-scene.module.css`
- Test: `src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx`

**Interfaces:**
- Consumes: existing `PlatoGuide`, `moment === "connect"`, and `primaryAction`.
- Produces: `[data-doxa-dialogue-card]`, `[data-doxa-voice-bridge]`, and the unchanged next-lesson link.

- [ ] **Step 1: Write the failing attribution test**

Add these expectations after advancing to the connection moment:

```tsx
expect(
  screen.getByText("Platão explica"),
).toBeInTheDocument();
expect(
  container.querySelector("[data-doxa-dialogue-card]"),
).toBeInTheDocument();
expect(
  container.querySelector("[data-doxa-voice-bridge]"),
).toHaveAttribute("aria-hidden", "true");
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```bash
npx vitest run src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx
```

Expected: the guided-dialogue assertions fail because the new attributes and label do not exist.

- [ ] **Step 3: Implement the semantic composition**

Replace `platoSpotlight` and the unframed copy with:

```tsx
<div className={styles.platoSurface}>
  <PlatoGuide className={styles.plato} pose="doxa" stageBeat={1} />
</div>
<div
  className={styles.voiceBridge}
  data-doxa-voice-bridge
  aria-hidden="true"
>
  <span />
  <span />
</div>
<div className={styles.dialogueCard} data-doxa-dialogue-card>
  <span className={styles.dialogueQuote} aria-hidden="true">“</span>
  <div className={styles.connectionCopy}>
    <p className={styles.beatLabel}>Platão explica</p>
    {/* Preserve the existing heading, paragraphs, and link. */}
  </div>
</div>
```

Use a three-column desktop grid, a soft natural character shadow, a rounded
cream dialogue card with a baby-blue lower layer, and two staggered voice dots.
At phone width, stack the character above the card and rotate the bridge into a
short vertical connector. Disable bridge animation for reduced motion.

- [ ] **Step 4: Run focused and full verification**

Run:

```bash
npx vitest run src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx
npm test -- --run
npm run lint
git diff --check
```

Expected: focused and full tests pass; lint reports no errors; diff check is clean.

- [ ] **Step 5: Verify the visual result**

Open `/aula/as-sombras/doxa`, advance to the fourth moment, and confirm:

- Plato has no oval or blue aura.
- The quotation card and Plato read as one composition.
- The card, action, and character remain inside the lesson frame at desktop,
  tablet, and phone widths.
- Reduced-motion mode has no voice-dot animation.

- [ ] **Step 6: Commit**

```bash
git add src/domains/lessons/as-sombras/cave-doxa-scene.tsx \
  src/domains/lessons/as-sombras/cave-doxa-scene.module.css \
  src/domains/lessons/as-sombras/cave-doxa-scene.test.tsx \
  docs/superpowers/plans/2026-07-29-philoo-guided-dialogue-card.md
git commit -m "feat: connect Plato to guided dialogue"
```
