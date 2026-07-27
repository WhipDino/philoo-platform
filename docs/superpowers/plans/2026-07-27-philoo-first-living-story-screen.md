# Philoo First Living-Story Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one real, responsive review screen in which canonical Plato welcomes the learner into the Cave, then stop before creating screen two.

**Architecture:** Add an isolated Next.js route at `/aula/as-sombras/primeira-tela` backed by a reusable `CaveInvitationScene` component. Reuse the canonical Flutter Plato and Cave artwork locally, without changing the current lesson graph or any later scene until the user approves this screen.

**Tech Stack:** Next.js 16, React 19, CSS Modules, Vitest, Testing Library

## Global Constraints

- Implement only the first screen; do not integrate or redesign later lesson screens.
- Use `#33BFED`, `#5BB8F5`, and `#FBF8F3` as the persistent interface palette.
- Use canonical Plato from `/Users/jv/philoo/philoo_app/assets/images/bem_vindo.webp`.
- Use the Flutter Cave artwork only as an environment reference/source.
- Use one normal page scroll context; no fixed-height clipping or nested scrolling.
- Make the screen usable at 1440×900, 1366×768, 820×1180, 390×844, and 360×800.
- Add no new runtime dependency.

---

### Task 1: Canonical Cave invitation review screen

**Files:**
- Create: `src/domains/lessons/as-sombras/cave-invitation-scene.tsx`
- Create: `src/domains/lessons/as-sombras/cave-invitation-scene.module.css`
- Create: `src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx`
- Create: `src/app/aula/as-sombras/primeira-tela/page.tsx`
- Create: `public/images/story/cave-entry-background.webp`
- Create: `public/images/story/plato-welcome.webp`
- Create: `public/fonts/nunito-variable.ttf`

**Interfaces:**
- Consumes: canonical Plato and Cave assets from the shipped Flutter app.
- Produces: `CaveInvitationScene(): JSX.Element`, rendered by the review route.

- [ ] **Step 1: Write the failing component test**

```tsx
it("presents canonical Plato as the full-scale guide and stops after screen one", () => {
  render(<CaveInvitationScene />);

  expect(
    screen.getByRole("heading", { name: /venha comigo/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("img", { name: /platão abre os braços/i }),
  ).toHaveAttribute("src", expect.stringContaining("plato-welcome.webp"));
  expect(
    screen.getByText(/por alguns minutos, olhe apenas para a parede/i),
  ).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: /entrar na caverna/i }),
  );

  expect(
    screen.getByText(/paramos aqui por enquanto/i),
  ).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx
```

Expected: FAIL because `CaveInvitationScene` does not exist.

- [ ] **Step 3: Prepare the three local assets**

Copy `bem_vindo.webp` to `public/images/story/plato-welcome.webp`.

Resize `tela2_caverna.webp` to a maximum width of 2200px and encode it as `public/images/story/cave-entry-background.webp`.

Copy `Nunito-Variable.ttf` to `public/fonts/nunito-variable.ttf`.

- [ ] **Step 4: Implement the component**

The component must render:

- a cream page and rounded Cave scene;
- a quiet top row with `Sair`, `As Sombras`, and three chapter indicators;
- canonical Plato at large scale;
- the heading `Venha comigo`;
- the dialogue `Por alguns minutos, olhe apenas para a parede. Depois me conte: o que ela deixa você conhecer?`;
- a rounded blue `Entrar na caverna` button;
- an `aria-live` pause note after the button is pressed: `Paramos aqui por enquanto. A próxima cena só nasce depois da sua aprovação.`;
- decorative baby-blue inquiry thread;
- no quiz, score, technical labels, or lower worksheet panel.

Use `useState` only for the pause note. The image must use `next/image`, with `priority` on Plato.

- [ ] **Step 5: Add responsive CSS**

Desktop:

- one composed Cave canvas;
- Plato occupies approximately one third of the scene;
- the cream dialogue bubble overlaps the environment;
- all content remains visible at 1366×768.

Phone:

- Cave background fills the rounded scene;
- Plato remains large and identifiable;
- dialogue follows Plato inside the same scene composition;
- the page scrolls normally when height is short;
- button and exit target are at least 44px.

Honor `prefers-reduced-motion`.

- [ ] **Step 6: Add the real review route**

`src/app/aula/as-sombras/primeira-tela/page.tsx` renders only:

```tsx
import { CaveInvitationScene } from "@/domains/lessons/as-sombras/cave-invitation-scene";

export default function FirstLivingStoryScreenPage() {
  return <CaveInvitationScene />;
}
```

- [ ] **Step 7: Run focused and project checks**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-invitation-scene.test.tsx
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 8: Verify the real browser screen**

Open `/aula/as-sombras/primeira-tela` at:

- 1440×900;
- 1366×768;
- 390×844;
- 360×800.

Verify:

- no clipping;
- no horizontal overflow;
- Plato remains the visual lead;
- baby blue and cream dominate the interface;
- the primary button reveals the pause note;
- the old dark lesson shell does not appear.

- [ ] **Step 9: Stop**

Give the user the local review URL. Do not create, redesign, or plan screen two until the user evaluates this screen.
