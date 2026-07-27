# Philoo Scene Three Voice Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Scene 3's generic dialogue card into a recognizable Philoo voice card without changing its artwork or story.

**Architecture:** Preserve the existing React state, navigation, and dialogue data. Add one decorative quotation-mark element to the existing card and implement the visual distinction entirely in the component's CSS module.

**Tech Stack:** Next.js, React, TypeScript, CSS Modules, Vitest, Testing Library

## Global Constraints

- Keep `/images/story/cave-descent-journey-v1.webp` and `/images/story/cave-descent-journey-mobile-v2.webp` unchanged.
- Keep all dialogue copy, routes, progress, and transitions unchanged.
- Do not add a speech tail, triangle, new dependency, or explicit “Platão diz” label.

---

### Task 1: Scene 3 voice card

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-prisoner-wall-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-prisoner-wall-scene.module.css`
- Test: `src/domains/lessons/as-sombras/cave-prisoner-wall-scene.test.tsx`

**Interfaces:**
- Consumes: `DIALOGUE_BEATS[dialogueIndex]` and the existing Scene 3 card.
- Produces: a decorative `.quoteMark` and responsive voice-card styling.

- [ ] **Step 1: Preserve the focused behavior contract**

Keep the existing component test unchanged because the experiment must preserve
the three dialogue beats and the final `Chegar mais perto` route.

- [ ] **Step 2: Add the spoken-dialogue signature**

Add the decorative mark and remove the quotation glyphs embedded around the
dialogue string:

```tsx
<span className={styles.quoteMark} aria-hidden="true">
  “
</span>
<p className={styles.speaker}>Platão</p>
<p className={styles.dialogue}>{DIALOGUE_BEATS[dialogueIndex]}</p>
```

- [ ] **Step 3: Implement the responsive card**

Use a `330px–380px` desktop width, equal rounded corners, a prominent
`#33bfed` quotation mark, shorter dialogue lines, and a quiet divider above the
existing footer. At `620px` and below, keep the card within the artwork's upper
safe region with reduced padding and type size.

- [ ] **Step 4: Run the focused test**

Run:

```bash
npm test -- cave-prisoner-wall-scene.test.tsx
```

Expected: the Scene 3 test passes without copy or navigation changes.

- [ ] **Step 5: Review the experiment**

Open `/aula/as-sombras/so-a-parede`, inspect the first and longest dialogue
beats at desktop width, then inspect the same route at a phone-sized viewport.
Confirm the card reads as dialogue and does not cover Platão or the three
distant people.
