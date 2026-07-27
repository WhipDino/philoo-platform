# Philoo Cave Descent Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the approved `Venha comigo` screen to a polished, responsive story-only Screen 2 called `A descida`.

**Architecture:** Keep each story beat as a dedicated Next.js route and focused scene component. The first scene becomes a link to `/aula/as-sombras/a-descida`; the new scene owns its responsive composition and temporary review stop. Reuse a high-resolution Philoo Cave environment, create one identity-preserving Plato cutout from the approved `plato-welcome-v2.png`, and keep all educational text in semantic HTML.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, Next Image, Vitest, Testing Library, built-in image generation plus local chroma-key removal.

## Global Constraints

- Implement only Screen 2; Screen 3 remains out of scope.
- Preserve the approved Screen 1 composition and Plato asset.
- Primary blue is `#33BFED`; supporting blue is `#5BB8F5`; cream is `#FBF8F3`.
- The wordmark is `Philoo` with a capital `P`.
- Plato remains a full-scale guide, not an avatar.
- Screen 2 is story-only and requires no learner answer.
- Copy frames the prisoners' limitation as missing perspective, not missing intelligence.
- No sound, image manipulation, canvas, simulation, activity library, authentication, deployment, or infrastructure work.
- Meaningful content remains reachable at 1440×900, 1366×768, 1024×768, 820×1180, 390×844, and 360×800.
- Reduced-motion mode preserves all meaning.

---

### Task 1: Connect Screen 1 to the new route

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-invitation-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-invitation-scene.module.css`

**Interfaces:**
- Consumes: the existing `CaveInvitationScene` component.
- Produces: a semantic link named `Entrar na caverna` whose `href` is `/aula/as-sombras/a-descida`.

- [ ] **Step 1: Replace the review-stop test with a failing navigation contract**

```tsx
it("continues to the descent story beat", () => {
  render(<CaveInvitationScene />);

  expect(
    screen.getByRole("link", { name: /entrar na caverna/i }),
  ).toHaveAttribute("href", "/aula/as-sombras/a-descida");
});
```

Remove the now-unused `fireEvent` import and change the first test's primary-action query from `button` to `link`.

- [ ] **Step 2: Run the focused test and verify the link contract fails**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx
```

Expected: FAIL because `Entrar na caverna` is still a button.

- [ ] **Step 3: Replace the temporary local review state with a Next Link**

Remove `useState`, `isPausedForReview`, and the conditional review message. Render:

```tsx
<Link
  className={styles.primaryAction}
  href="/aula/as-sombras/a-descida"
>
  Entrar na caverna
  <span aria-hidden="true">→</span>
</Link>
```

Remove the unused `.reviewPause` styles without changing the approved visual styles of `.primaryAction`.

- [ ] **Step 4: Run the focused test**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit the navigation change**

```bash
git add src/domains/lessons/as-sombras/cave-invitation-scene.tsx src/domains/lessons/as-sombras/cave-invitation-scene.module.css src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx
git commit -m "feat: connect Cave invitation to descent"
```

### Task 2: Create the `A descida` story scene

**Files:**
- Create: `src/domains/lessons/as-sombras/cave-descent-scene.test.tsx`
- Create: `src/domains/lessons/as-sombras/cave-descent-scene.tsx`
- Create: `src/domains/lessons/as-sombras/cave-descent-scene.module.css`
- Create: `src/app/aula/as-sombras/a-descida/page.tsx`
- Create: `public/images/story/cave-descent-background.webp`
- Create: `public/images/story/plato-descent-v1.png`

**Interfaces:**
- Consumes: `/images/story/cave-descent-background.webp`, `/images/story/plato-descent-v1.png`, and `/aula/as-sombras/primeira-tela` as the Back destination.
- Produces: `CaveDescentScene(): JSX.Element` and the route `/aula/as-sombras/a-descida`.

- [ ] **Step 1: Write the failing scene contract**

```tsx
it("presents the prisoners' limited perspective without questioning the learner", () => {
  render(<CaveDescentScene />);

  expect(
    screen.getByRole("heading", { name: /eles nunca olharam para trás/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("img", { name: /platão guia você pela descida/i }),
  ).toHaveAttribute("src", expect.stringContaining("plato-descent-v1.png"));
  expect(
    screen.getByText(/não lhes falta inteligência/i),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("textbox"),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /voltar/i }),
  ).toHaveAttribute("href", "/aula/as-sombras/primeira-tela");
});

it("stops after the descent beat for visual review", () => {
  render(<CaveDescentScene />);

  fireEvent.click(
    screen.getByRole("button", { name: /chegar mais perto/i }),
  );

  expect(
    screen.getByRole("status"),
  ).toHaveTextContent(/a próxima parte começa na parede/i);
});
```

- [ ] **Step 2: Run the new test and verify it fails**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-descent-scene.test.tsx
```

Expected: FAIL because `CaveDescentScene` does not exist.

- [ ] **Step 3: Prepare the Cave background**

Use `/Users/jv/philoo/philoo_app/assets/images/tela2_caverna.webp` as the source. Resize it proportionally to approximately 2200 pixels wide and save it as:

```text
public/images/story/cave-descent-background.webp
```

Confirm the saved image retains the Cave entrance, floor chains, and open center composition while avoiding a multi-megabyte page asset.

- [ ] **Step 4: Generate and extract the new Plato pose**

Use `/images/story/plato-welcome-v2.png` as the identity reference and generate one opaque cutout source with this production prompt:

```text
Use case: identity-preserve
Asset type: transparent full-body character cutout for Philoo Cave story Screen 2
Primary request: recreate the exact same Plato character identity in a new guiding pose
Input image: the approved plato-welcome-v2.png is the canonical identity reference
Subject: the same stylized 3D Plato, full body, carefully stepping forward as if guiding a learner down into a cave; one hand gently gestures forward and slightly downward; the other holds a small warm ancient Greek oil lamp; calm, protective, curious expression; same face, eyes, white sculpted hair, white beard, proportions, lavender toga, belt, sandals, and rendering language as the reference
Composition: entire character visible with generous padding; three-quarter view facing slightly left so he can stand on the right side of the screen and look toward the dialogue
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background
Constraints: preserve character identity exactly; background must be one uniform color with no shadows, gradient, texture, floor, or reflection; crisp opaque silhouette; no cast shadow; no text; no watermark; do not use #00ff00 on the character
Avoid: different face, realistic adult anatomy, toddler proportions, extra fingers, floating props, modern flashlight, cropped feet, cave background
```

Run the installed chroma-key remover with auto border sampling, soft matte, and despill. Save the validated alpha output as:

```text
public/images/story/plato-descent-v1.png
```

Validate that the corners are transparent, the lamp is attached naturally, the face matches the approved reference, and no green fringe is visible.

- [ ] **Step 5: Implement the semantic scene**

Create `CaveDescentScene` as a client component with:

- the same three-column header vocabulary as Screen 1;
- a Back link to `/aula/as-sombras/primeira-tela`;
- chapter label `Capítulo 1 · A descida`;
- heading `Eles nunca olharam para trás.`;
- lead copy `Desde crianças, essas pessoas enxergam apenas a parede à frente. Não conhecem outro caminho, outra luz, outro mundo.`;
- reassurance `Não lhes falta inteligência. Falta-lhes uma perspectiva que nunca puderam experimentar.`;
- primary button `Chegar mais perto`;
- after-click status `A próxima parte começa na parede. Paramos aqui para você observar esta cena antes de continuar.`;
- a decorative baby-blue SVG inquiry thread;
- the Cave environment as a decorative CSS background;
- the generated Plato cutout as the only meaningful image.

- [ ] **Step 6: Implement the responsive composition**

Desktop:

- keep the dialogue on the left and Plato on the right;
- preserve the Cave entrance, chains, and center depth;
- keep persistent surfaces cream and baby blue;
- use rounded tactile controls and the approved soft lower blue edge.

Tablet and phone:

- use normal document flow inside one rounded scene;
- place Plato above the dialogue without covering his face, lamp, or feet;
- keep the complete dialogue and action reachable by page scroll;
- remove decorative thread motion under `prefers-reduced-motion`;
- avoid nested scroll containers and fixed-height clipping.

- [ ] **Step 7: Add the Next route**

```tsx
import type { Metadata } from "next";
import { CaveDescentScene } from "@/domains/lessons/as-sombras/cave-descent-scene";

export const metadata: Metadata = {
  title: "A descida · As Sombras",
};

export default function CaveDescentPage() {
  return <CaveDescentScene />;
}
```

- [ ] **Step 8: Run focused tests**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx src/domains/lessons/as-sombras/cave-descent-scene.test.tsx
```

Expected: 4 tests pass.

- [ ] **Step 9: Run production verification**

Run:

```bash
npm test
npm run build
```

Expected: all tests pass and Next.js builds both story routes.

- [ ] **Step 10: Verify the experience in a real browser**

Open `/aula/as-sombras/primeira-tela`, follow `Entrar na caverna`, and inspect the scene at all reference sizes. Confirm:

- route navigation works;
- no console errors appear;
- no text, Plato, lamp, chain, or button is clipped;
- visual order remains clear on phone and tablet;
- reduced motion removes decorative travel without losing meaning;
- the review stop appears after `Chegar mais perto`.

- [ ] **Step 11: Commit Screen 2**

```bash
git add public/images/story/cave-descent-background.webp public/images/story/plato-descent-v1.png src/app/aula/as-sombras/a-descida/page.tsx src/domains/lessons/as-sombras/cave-descent-scene.tsx src/domains/lessons/as-sombras/cave-descent-scene.module.css src/domains/lessons/as-sombras/cave-descent-scene.test.tsx
git commit -m "feat: add Cave descent story scene"
```

