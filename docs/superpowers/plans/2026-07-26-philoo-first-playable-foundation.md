# Philoo First Playable Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a beautiful, responsive first web foundation with a public home, student home, and playable “Corte de Luz” preview for *As Sombras*.

**Architecture:** A fresh Next.js App Router repository uses Server Components for pages and a small client island for the tactile reveal interaction. The first slice is deliberately data-independent: it uses typed local preview content and canonical existing assets while the clean Supabase environment is prepared separately. Design tokens and semantic components establish a reusable visual language without building a generic card-based design system.

**Tech Stack:** Current stable Next.js 16+, React 19.2.4+, TypeScript strict mode, Tailwind CSS 4, Vitest, Testing Library, local WebP assets, Vercel-ready npm scripts.

## Global Constraints

- Student copy is Brazilian Portuguese and aimed primarily at ages 13–16.
- The visual direction is **Fresta de Luz**: `#16233A` ink, `#F5F7F5` paper, `#60708A` slate, `#6D52C7` Plato, `#F2B84B` lumen, `#167C78` evidence, and `#B85143` tension.
- Use Bricolage Grotesque for questions/titles, Public Sans for reading/interface text, and IBM Plex Mono only for compact evidence labels.
- The canonical Plato master is `platao_pensativo.webp`, SHA-256 `1b103b89c90cf05159276f918eebc9d570159b9d6d33255e6cf3624e62a4d028`.
- Plato is an optional Socratic companion, never a narrator who gives answers or a decorative mascot on every screen.
- Avoid XP, coins, streaks, rankings, childish praise, repeated rounded cards, and generic gradient-dashboard styling.
- Every interactive target is at least 44×44 px, keyboard reachable, screen-reader named, and usable with reduced motion.
- Color is never the only status signal; text contrast must meet WCAG 2.2 AA.
- The generated `create-next-app` scaffold is the approved TDD exception. Every Philoo-specific function and interactive behavior follows red → green.
- Do not connect to or mutate the historical Supabase or Vercel resources in this slice.
- Keep critical route JavaScript and CSS at or below 300 KB compressed; use `next/image` for raster assets.

---

## File structure

| File | Responsibility |
|---|---|
| `src/app/layout.tsx` | Global metadata, fonts, skip link, and document shell. |
| `src/app/globals.css` | Fresta de Luz tokens, typography, focus, motion, and responsive foundations. |
| `src/app/page.tsx` | Public thesis page and routes into the playable preview. |
| `src/app/inicio/page.tsx` | Student next-action home and private-reasoning preview. |
| `src/app/aula/as-sombras/page.tsx` | First playable lesson preview. |
| `src/components/site-header.tsx` | Shared responsive public/student navigation. |
| `src/components/light-cut.tsx` | Accessible client interaction comparing appearance and evidence. |
| `src/components/reasoning-path.tsx` | “parece → investiguei → modelo → revisei” progress language. |
| `src/lib/reveal.ts` | Pure reveal-position normalization. |
| `src/lib/preview-content.ts` | Typed local copy for the first preview routes. |
| `src/lib/reveal.test.ts` | Unit tests for reveal boundaries. |
| `src/components/light-cut.test.tsx` | Behavioral keyboard/button tests for the interaction. |
| `src/app/foundation.test.tsx` | Public and student route content/landmark tests. |
| `vitest.config.ts` | jsdom test environment and `@/*` path resolution. |
| `vitest.setup.ts` | Testing Library DOM matchers and cleanup. |
| `public/images/plato/platao-master.webp` | Checksum-verified canonical Plato asset. |
| `public/images/cave/cave-shadows.webp` | Existing Cave atmosphere, used as temporary non-evidentiary scenery. |
| `public/images/brand/philoo-logo.webp` | Existing high-resolution brand source. |

### Task 1: Scaffold, verify versions, and install the test harness

**Files:**
- Preserve: `docs/superpowers/plans/2026-07-26-philoo-first-playable-foundation.md`
- Create/Modify: generated Next.js scaffold files
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: npm scripts `dev`, `build`, `start`, `lint`, `test`, and `test:watch`
- Produces: a jsdom test environment resolving `@/*`

- [ ] **Step 1: Scaffold the generated foundation**

Run from `/Users/jv/philoo/philoo-platform`:

```bash
npx create-next-app@latest . --yes --force --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --use-npm
```

Keep the plan file. Confirm installed Next.js is a current stable version, React/React DOM are at least `19.2.4`, and no canary dependency is present.

- [ ] **Step 2: Install pinned test dependencies**

```bash
npm install --save-dev vitest@latest jsdom@latest @testing-library/react@latest @testing-library/jest-dom@latest vite-tsconfig-paths@latest
```

Commit the generated lockfile.

- [ ] **Step 3: Add the test configuration**

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

```ts
// vitest.setup.ts
import "@testing-library/jest-dom/vitest";
```

Add `"test": "vitest run"` and `"test:watch": "vitest"` without changing generated build scripts.

- [ ] **Step 4: Verify the clean scaffold**

Run:

```bash
npm run lint
npm run build
```

Expected: both PASS.

- [ ] **Step 5: Commit the scaffold on the isolated implementation branch**

```bash
git add .
git commit -m "chore: scaffold Philoo web platform"
```

### Task 2: Build the visual shell, public home, and student home

**Files:**
- Create: `src/components/site-header.tsx`
- Create: `src/components/reasoning-path.tsx`
- Create: `src/lib/preview-content.ts`
- Create first: `src/app/foundation.test.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/page.tsx`
- Create: `src/app/inicio/page.tsx`
- Copy: three approved assets into `public/images/**`

**Interfaces:**
- Produces: `SiteHeader({ context }: { context: "public" | "student" })`
- Produces: `ReasoningPath({ activeStep }: { activeStep: 0 | 1 | 2 | 3 })`
- Produces: `previewLesson` with `title`, `eyebrow`, `resumeLabel`, `question`, and `steps`

- [ ] **Step 1: Write the route-content test**

```tsx
import { render, screen } from "@testing-library/react";
import PublicHome from "./page";
import StudentHome from "./inicio/page";

it("frames Philoo as an investigation, not a points game", () => {
  render(<PublicHome />);
  expect(
    screen.getByRole("heading", {
      name: /uma sombra basta para explicar o que você vê/i,
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /começar uma investigação/i }),
  ).toHaveAttribute("href", "/aula/as-sombras");
  expect(screen.queryByText(/xp|ranking|sequência diária/i)).not.toBeInTheDocument();
});

it("gives the student one clear next action", () => {
  render(<StudentHome />);
  expect(
    screen.getByRole("heading", { name: /continue a investigação/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /retomar as sombras/i }))
    .toHaveAttribute("href", "/aula/as-sombras");
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- src/app/foundation.test.tsx`

Expected: FAIL because the Philoo routes/components do not exist.

- [ ] **Step 3: Copy and verify the canonical assets**

Copy the exact files named in the file map. Run:

```bash
shasum -a 256 public/images/plato/platao-master.webp
```

Expected: `1b103b89c90cf05159276f918eebc9d570159b9d6d33255e6cf3624e62a4d028`.

- [ ] **Step 4: Implement the Fresta de Luz shell**

Use semantic landmarks, a visible skip link, Portuguese metadata, a 1200 px content maximum, restrained squared/soft corners, and one coordinated page-load reveal disabled by `prefers-reduced-motion`. The public hero uses a single thesis question and two clear paths. The student home prioritizes one resume action and a reasoning path instead of activity statistics.

- [ ] **Step 5: Run GREEN and quality checks**

```bash
npm test -- src/app/foundation.test.tsx
npm run lint
npm run build
```

Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add src public package.json package-lock.json
git commit -m "feat: create Philoo visual foundation"
```

### Task 3: Build the playable Corte de Luz lesson preview

**Files:**
- Create first: `src/lib/reveal.test.ts`
- Create first: `src/components/light-cut.test.tsx`
- Create: `src/lib/reveal.ts`
- Create: `src/components/light-cut.tsx`
- Create: `src/app/aula/as-sombras/page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: `clampReveal(value: number): number`
- Produces: `LightCut({ initialReveal?: number }: { initialReveal?: number })`
- The interaction exposes range input label `Posição do corte de luz`, live text for the current view, and buttons `Ver aparência` and `Ver pistas`

- [ ] **Step 1: Write the pure-function test**

```ts
import { describe, expect, it } from "vitest";
import { clampReveal } from "./reveal";

describe("clampReveal", () => {
  it.each([
    [-20, 0],
    [0, 0],
    [48, 48],
    [100, 100],
    [130, 100],
  ])("normalizes %s to %s", (input, expected) => {
    expect(clampReveal(input)).toBe(expected);
  });
});
```

- [ ] **Step 2: Write the interaction behavior test**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { LightCut } from "./light-cut";

it("offers an equivalent button path to the draggable reveal", () => {
  render(<LightCut initialReveal={50} />);
  fireEvent.click(screen.getByRole("button", { name: /ver pistas/i }));
  expect(screen.getByText(/pistas em primeiro plano/i)).toBeInTheDocument();
  expect(screen.getByRole("slider", { name: /posição do corte de luz/i }))
    .toHaveValue("100");
});
```

- [ ] **Step 3: Run both tests and verify RED**

Run:

```bash
npm test -- src/lib/reveal.test.ts src/components/light-cut.test.tsx
```

Expected: FAIL because the reveal module and component do not exist.

- [ ] **Step 4: Add the minimal accessible interaction**

`clampReveal` returns `Math.min(100, Math.max(0, value))`. `LightCut` uses a native range input and two equivalent buttons. The reveal mask is CSS-only, the cave artwork is explicitly labeled temporary atmosphere rather than historical evidence, and reduced-motion mode removes continuous animation.

- [ ] **Step 5: Build the lesson preview route**

The route opens with “Antes de procurar a resposta, observe o mecanismo.” It asks the learner to compare appearance and clues, provides one uncertainty-friendly reflection prompt, and lets Plato offer a question rather than an answer.

- [ ] **Step 6: Run the complete verification**

```bash
npm test
npm run lint
npm run build
```

Expected: all PASS with no warnings from Philoo code.

- [ ] **Step 7: Perform browser verification**

Verify `/`, `/inicio`, and `/aula/as-sombras` at 390×844, 768×1024, and 1440×1000. Check keyboard navigation, visible focus, 44 px targets, reduced motion, no horizontal overflow, canonical Plato rendering, and the reveal/button equivalence.

- [ ] **Step 8: Commit**

```bash
git add src
git commit -m "feat: add playable Corte de Luz preview"
```

## Completion

This slice is complete when a clean checkout installs, tests, lints, builds, and renders all three routes responsively; the canonical Plato checksum matches; the public and student pages have clear next actions; and the lesson preview is playable with pointer, keyboard, and equivalent buttons.
