# Philoo Cave Character Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the approved Plato render feel physically present inside the
Cave while preserving a reusable, responsive scene-layer grammar.

**Architecture:** Keep the existing cave, Plato, and card as independent
assets. Add semantic presentation layers for environmental light, physical
grounding, foreground depth, and a gesture-to-card connection. Prove the
pattern on this screen before extracting a generalized scene API.

**Tech Stack:** Next.js 16 App Router, React 19, CSS Modules, SVG, Vitest,
Testing Library

## Global Constraints

- Preserve rollback commit `74f9502`.
- Modify only the first screen at `/aula/as-sombras/primeira-tela`.
- Keep `/images/story/plato-welcome-v2.png` and the cave background unchanged.
- Keep Philoo blue `#33BFED` / `#5BB8F5` and cream `#FBF8F3`.
- Preserve Plato's identity, pose, costume, face, hands, and readability.
- Support desktop, tablet, and phone without clipped required content.
- Keep decorative layers non-interactive and hidden from assistive technology.
- Respect `prefers-reduced-motion`.
- Add no dependencies.

---

### Task 1: Establish the semantic scene layers

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-invitation-scene.tsx`

**Interfaces:**
- Produces: `[data-scene-depth="cave"]`
- Produces: `[data-scene-connection="plato-dialogue"]`
- Produces: decorative `.platoRelight`, `.floorContact`, and
  `.caveForeground` layers
- Preserves: the existing accessible Plato image and dialogue content

- [ ] **Step 1: Write the failing structural test**

Add this assertion to the canonical Plato test:

```tsx
const caveDepth = document.querySelector('[data-scene-depth="cave"]');
const guideConnection = document.querySelector(
  '[data-scene-connection="plato-dialogue"]',
);

expect(caveDepth).toHaveAttribute("aria-hidden", "true");
expect(guideConnection).toHaveAttribute("aria-hidden", "true");
expect(guideConnection?.querySelectorAll("path")).toHaveLength(2);
```

- [ ] **Step 2: Run the test and verify the new contract fails**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx
```

Expected: FAIL because the depth and connection elements do not exist.

- [ ] **Step 3: Add the minimum scene-layer markup**

Use this structure inside `.storyScene`:

```tsx
<div
  className={styles.environmentLight}
  data-scene-depth="cave"
  aria-hidden="true"
/>

<svg
  className={styles.inquiryThread}
  data-scene-connection="plato-dialogue"
  viewBox="0 0 1440 900"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <path
    className={styles.desktopThread}
    d="M548 638 C660 616 648 472 806 430"
  />
  <path
    className={styles.mobileThread}
    d="M890 328 C852 350 820 376 780 414"
  />
</svg>

<div className={styles.plato}>
  <span className={styles.floorContact} aria-hidden="true" />
  <Image ... />
  <span className={styles.platoRelight} aria-hidden="true" />
</div>

<div className={styles.caveForeground} aria-hidden="true" />
```

Keep the existing accessible `<Image>` attributes unchanged.

- [ ] **Step 4: Run the structural test**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx
```

Expected: 2 tests pass.

---

### Task 2: Ground and relight Plato responsively

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-invitation-scene.module.css`

**Interfaces:**
- Consumes: the semantic layers from Task 1
- Produces: desktop and mobile depth compositions with no new raster assets

- [ ] **Step 1: Add the shared depth treatment**

Implement:

- `.environmentLight` as a localized blue entrance glow and low floor bounce;
- `.plato img` with restrained cave brightness and saturation;
- `.platoRelight` masked by `plato-welcome-v2.png`, adding a cool left rim and
  subtle cream right bounce;
- `.floorContact` as a blurred perspective ellipse under the sandals;
- `.caveForeground` as a dark floor veil plus low, soft haze in front of the
  lower character plane;
- `.inquiryThread` above Plato but below the dialogue card;
- `.desktopThread` visible and `.mobileThread` hidden by default.

Use CSS masks with both standard and WebKit properties:

```css
mask: url("/images/story/plato-welcome-v2.png") center / 100% 100% no-repeat;
-webkit-mask: url("/images/story/plato-welcome-v2.png") center / 100% 100%
  no-repeat;
```

Keep the lighting restrained enough that Plato's face and amber eyes remain
clear.

- [ ] **Step 2: Add tablet and phone adaptations**

At `max-width: 900px`:

- keep the environmental light centered behind Plato;
- move and scale the contact shadow with the character;
- reduce the foreground veil so it never crosses readable card content;
- hide `.desktopThread` and show `.mobileThread`;
- keep the connection visible behind the cream card;
- preserve the current character/card stack and full-width action.

At `max-width: 380px`, reduce atmosphere and shadow scale before reducing the
character further.

- [ ] **Step 3: Preserve reduced-motion behavior**

In `prefers-reduced-motion: reduce`, disable both thread travel and atmospheric
drift while leaving all layers visible.

- [ ] **Step 4: Run code verification**

Run:

```bash
git diff --check
npm test -- src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx
npm run build
```

Expected: no whitespace errors, 2 tests pass, and the production build exits
successfully.

---

### Task 3: Perform visual acceptance and save the experiment

**Files:**
- Review: `src/domains/lessons/as-sombras/cave-invitation-scene.tsx`
- Review: `src/domains/lessons/as-sombras/cave-invitation-scene.module.css`

**Interfaces:**
- Consumes: the completed first-screen build
- Produces: an approved-or-rejected reversible integration commit

- [ ] **Step 1: Start the production preview**

Run:

```bash
npm run start -- --hostname 127.0.0.1 --port 3000
```

- [ ] **Step 2: Inspect required viewports**

Open `/aula/as-sombras/primeira-tela` at:

- `1440×900`
- `1024×768`
- `768×1024`
- `390×844`
- `360×800`

At each size verify:

- full face, hands, and required card content remain visible;
- sandals meet the contact shadow and cave floor;
- foreground depth does not look like a flat dark rectangle;
- the line begins at Plato's gesture and terminates beneath the card;
- no horizontal scroll or nested scene scroll appears;
- card contrast and action focus remain readable.

- [ ] **Step 3: Inspect runtime health**

Confirm the browser console contains no errors and that the rendered guide
image still resolves to `plato-welcome-v2.png`.

- [ ] **Step 4: Commit the reversible experiment**

```bash
git add \
  src/domains/lessons/as-sombras/cave-invitation-scene.tsx \
  src/domains/lessons/as-sombras/cave-invitation-scene.module.css \
  src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx \
  docs/superpowers/plans/2026-07-27-philoo-cave-character-integration.md
git commit -m "feat: ground Plato in the cave scene"
```

The user can compare this commit with `74f9502` and revert only the integration
commit if the result is not approved.
