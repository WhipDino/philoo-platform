# Philoo Discovery Table Activity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current form-like evidence sorter with a reusable, tactile “Mesa de Descobertas” while preserving its existing learning logic and formative feedback.

**Architecture:** Extract the visual and interactive card/pocket surface into a generic `PhilooDiscoveryTable` component. Keep answer validation, Plato pose choice, copy, and scene state inside `CaveEvidenceSortScene`; the primitive receives cards, destinations, placement state, and callbacks only.

**Tech Stack:** React 19, TypeScript, Motion 12, Phosphor Icons, CSS Modules, Vitest, Testing Library.

## Global Constraints

- Preserve cream `#FBF8F3`, baby blue `#33BFED`, soft blue `#5BB8F5`, and ink `#17324A`.
- Use blue, apricot, and lavender destination tones with labels and icons; color cannot be the only semantic signal.
- Keep click/tap placement as the primary interaction; do not require drag-and-drop.
- Preserve selection, placement, revision, answer checking, and non-punitive feedback behavior.
- Keep controls at least 44px high and fully keyboard operable.
- Respect `prefers-reduced-motion`.
- Do not add a runtime dependency or generate new images.
- Preserve the lesson shell, journey rail, and document-level no-scroll contract.

---

### Task 1: Reusable discovery-table interaction

**Files:**
- Create: `src/domains/lessons/interactions/philoo-discovery-table.tsx`
- Create: `src/domains/lessons/interactions/philoo-discovery-table.module.css`
- Create: `src/domains/lessons/interactions/philoo-discovery-table.test.tsx`

**Interfaces:**
- Consumes: `ReactNode`, Motion’s `LayoutGroup`, `LazyMotion`, `MotionConfig`, `domAnimation`, `useReducedMotion`, and `motion/react-m`.
- Produces:

```ts
export type DiscoveryCard = {
  id: string;
  text: string;
};

export type DiscoveryDestination<DestinationId extends string> = {
  id: DestinationId;
  label: string;
  hint: string;
  tone: "blue" | "apricot" | "lavender";
  icon: ReactNode;
};

export type PhilooDiscoveryTableProps<DestinationId extends string> = {
  cards: readonly DiscoveryCard[];
  destinations: readonly DiscoveryDestination<DestinationId>[];
  placements: Readonly<Record<string, DestinationId>>;
  selectedCardId: string | null;
  onSelectCard: (cardId: string) => void;
  onPlaceCard: (destinationId: DestinationId) => void;
};
```

- [ ] **Step 1: Write failing behavior tests**

Write tests using real buttons and callbacks:

```tsx
it("exposes cards and pockets as keyboard-operable placement controls", () => {
  const onSelectCard = vi.fn();
  const onPlaceCard = vi.fn();
  render(
    <PhilooDiscoveryTable
      cards={[{ id: "shape", text: "Uma forma cruzou a parede." }]}
      destinations={[{
        id: "observed",
        label: "Vi",
        hint: "A parede mostrou isso.",
        tone: "blue",
        icon: <span aria-hidden="true">○</span>,
      }]}
      placements={{}}
      selectedCardId={null}
      onSelectCard={onSelectCard}
      onPlaceCard={onPlaceCard}
    />,
  );

  fireEvent.click(
    screen.getByRole("button", { name: "Uma forma cruzou a parede." }),
  );
  expect(onSelectCard).toHaveBeenCalledWith("shape");
  expect(screen.getByRole("button", { name: /Vi.*A parede mostrou isso/i }))
    .toBeDisabled();
});
```

Add a controlled rerender test proving a selected card enables pockets and a
placed card renders inside the matching pocket while remaining selectable.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- src/domains/lessons/interactions/philoo-discovery-table.test.tsx
```

Expected: FAIL because `philoo-discovery-table` does not exist.

- [ ] **Step 3: Implement the semantic primitive**

Render:

```tsx
<MotionConfig reducedMotion="user">
  <LazyMotion features={domAnimation} strict>
    <LayoutGroup id="philoo-discovery-table">
      <section data-philoo-discovery-table>
        <section aria-labelledby="discovery-tray-title">
          <h2 id="discovery-tray-title">Pistas da parede</h2>
          {unplacedCards.map(renderCard)}
        </section>
        <div aria-label="Bolsos para organizar as pistas">
          {destinations.map(renderPocket)}
        </div>
      </section>
    </LayoutGroup>
  </LazyMotion>
</MotionConfig>
```

Use native buttons, `aria-pressed` on cards, disabled pockets until selection,
`layoutId={`discovery-card-${card.id}`}` for shared-layout travel, and a
destination `data-tone` for semantic styling. The component must not calculate
correctness.

- [ ] **Step 4: Build the tactile table styling**

Implement:

- a compact paper tray with a baby-blue layered underlay;
- a two-column desktop layout;
- three thick rounded pockets with colored tabs and inset slots;
- 44px minimum card and pocket targets;
- selected-card lift using transform and shadow;
- two-column tablet cards and stacked phone pockets;
- reduced-motion overrides that remove transform and transition travel.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run:

```bash
npm test -- src/domains/lessons/interactions/philoo-discovery-table.test.tsx
```

Expected: PASS with card selection, disabled/enabled pocket behavior, and
revision behavior verified.

- [ ] **Step 6: Commit**

```bash
git add src/domains/lessons/interactions/philoo-discovery-table.tsx \
  src/domains/lessons/interactions/philoo-discovery-table.module.css \
  src/domains/lessons/interactions/philoo-discovery-table.test.tsx
git commit -m "feat: add reusable discovery table"
```

---

### Task 2: Adopt the discovery table in the Cave activity

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-evidence-sort-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-evidence-sort-scene.module.css`
- Modify: `src/domains/lessons/as-sombras/cave-evidence-sort-scene.test.tsx`

**Interfaces:**
- Consumes: `PhilooDiscoveryTable`, `DiscoveryCard`, and `DiscoveryDestination`.
- Produces: the existing `CaveEvidenceSortScene` with unchanged answer mapping and a redesigned activity layout.

- [ ] **Step 1: Write failing scene tests**

Extend the existing integration test with learner-visible behavior:

```tsx
expect(
  container.querySelector("[data-philoo-discovery-table]"),
).toBeInTheDocument();
expect(screen.getByRole("heading", { name: "Pistas da parede" }))
  .toBeInTheDocument();
expect(screen.getByText("0 de 6 pistas organizadas")).toBeInTheDocument();
expect(screen.queryByRole("button", { name: "Conferir descobertas" }))
  .not.toBeInTheDocument();
```

After placing all cards, assert “Conferir descobertas” appears. Add a fully
correct arrangement and assert the celebration Plato asset is rendered. Keep
the existing incorrect/revision assertions.

- [ ] **Step 2: Run the scene test and verify RED**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-evidence-sort-scene.test.tsx
```

Expected: FAIL because the current scene has no discovery-table primitive and
uses the old copy.

- [ ] **Step 3: Replace the old table markup**

Define destinations with Phosphor icons:

```tsx
const DESTINATIONS = [
  {
    id: "observed",
    label: "Vi",
    hint: "A parede mostrou isso.",
    tone: "blue",
    icon: <EyeIcon weight="duotone" />,
  },
  {
    id: "concluded",
    label: "Concluí",
    hint: "Completei o que faltava com uma ideia.",
    tone: "apricot",
    icon: <BrainIcon weight="duotone" />,
  },
  {
    id: "unknown",
    label: "Ainda não sei",
    hint: "A parede não permite confirmar.",
    tone: "lavender",
    icon: <QuestionIcon weight="duotone" />,
  },
] satisfies readonly DiscoveryDestination<DestinationId>[];
```

Keep the existing `CARDS`, `placements`, `chooseCard`, `placeIn`,
`incorrectCount`, and Plato pose logic. Replace `evidenceTable`,
`EvidenceButton`, and destination markup with:

```tsx
<PhilooDiscoveryTable
  cards={CARDS}
  destinations={DESTINATIONS}
  placements={placements}
  selectedCardId={selectedId}
  onSelectCard={chooseCard}
  onPlaceCard={placeIn}
/>
```

Change progress to “N de 6 pistas organizadas” and the check action to
“Conferir descobertas.”

- [ ] **Step 4: Reshape the guide and feedback**

Keep `PlatoGuide` and its semantic poses. Make the guide strip shorter, align
Plato with the instruction, remove the decorative `wallMark`, and give feedback
a compact paper-note treatment with green used only for successful validation.
Incorrect feedback stays baby-blue/lavender and says which cards need another
look.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-evidence-sort-scene.test.tsx \
  src/domains/lessons/interactions/philoo-discovery-table.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/domains/lessons/as-sombras/cave-evidence-sort-scene.tsx \
  src/domains/lessons/as-sombras/cave-evidence-sort-scene.module.css \
  src/domains/lessons/as-sombras/cave-evidence-sort-scene.test.tsx
git commit -m "feat: redesign cave evidence activity"
```

---

### Task 3: Responsive and full-story verification

**Files:**
- Modify if verification exposes a defect:
  `src/domains/lessons/interactions/philoo-discovery-table.module.css`
- Modify if verification exposes a defect:
  `src/domains/lessons/as-sombras/cave-evidence-sort-scene.module.css`

**Interfaces:**
- Consumes: the finished activity route and existing viewport-check script.
- Produces: a verified activity with no regressions to the lesson journey.

- [ ] **Step 1: Run the focused and full automated suite**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/cave-evidence-sort-scene.test.tsx \
  src/domains/lessons/interactions/philoo-discovery-table.test.tsx
npm test
npm run lint
npm run build
```

Expected: all tests pass, lint has no new errors, and the production build
completes.

- [ ] **Step 2: Check established viewport containment**

Run:

```bash
npm run check:story-folio-viewport
```

Expected: no document-level vertical overflow at `1280×720`, `1024×768`,
`768×1024`, and `390×844`.

- [ ] **Step 3: Verify the live activity states**

Open `/aula/as-sombras/o-que-chegou-ate-eles` and inspect:

- untouched table;
- selected card;
- one card in each pocket;
- revised placement;
- incorrect feedback and retry Plato;
- correct feedback and celebration Plato.

Confirm the journey rail remains usable and the activity surface scrolls
internally only when required.

- [ ] **Step 4: Commit verification fixes**

If verification required CSS corrections:

```bash
git add src/domains/lessons/interactions/philoo-discovery-table.module.css \
  src/domains/lessons/as-sombras/cave-evidence-sort-scene.module.css
git commit -m "fix: contain discovery table across viewports"
```

If no corrections were needed, do not create an empty commit.
