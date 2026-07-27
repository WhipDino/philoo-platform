# Philoo Scene Four Shadow Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Scene 4 with a cinematic story moment in which the learner witnesses a prisoner name a shadow before Platão explains the difference between recognizing an appearance and knowing its source.

**Architecture:** Keep the existing route boundary and shared navigation/progress helpers. Add dedicated desktop and mobile artwork, then rebuild `CaveShadowNamesScene` as a four-beat client-side dialogue sequence using the established Scene 3 voice-card pattern.

**Tech Stack:** Next.js, React, TypeScript, CSS Modules, `next/image`, Vitest, Testing Library, OpenAI image generation

## Global Constraints

- Keep `/aula/as-sombras/o-que-chegou-ate-eles` and every `CaveEvidenceSortScene` source, style, and test file unchanged.
- Preserve Scene 4 progress `currentBeat={4}`, `totalBeats={10}`, back route `/aula/as-sombras/so-a-parede`, next route `/aula/as-sombras/o-que-chegou-ate-eles`, and the shared `useStorySceneTransition`.
- Do not reveal the hidden fire, source objects, or puppeteers.
- Do not add a speech tail, triangle, headline panel, floating name tags, miniature separate Platão, dependency, or sound.
- Use Philoo baby blue `#33BFED` / `#5BB8F5`, cream `#FBF8F3`, and the approved voice-card language.

---

### Task 1: Generate Scene 4 artwork

**Files:**
- Create: `public/images/story/cave-shadow-game-v1.webp`
- Create: `public/images/story/cave-shadow-game-mobile-v1.webp`
- Reference only: `public/images/story/cave-descent-journey-v1.webp`
- Reference only: `public/images/story/cave-descent-journey-mobile-v2.webp`
- Reference only: `public/images/story/cave-recurring-shadows-v1.webp`

**Interfaces:**
- Consumes: the approved Scene 3 Platão identity, cave lighting, and the old wall/shadow arrangement as a content reference.
- Produces: one `16:9` desktop artwork and one native `9:16` mobile artwork with safe dialogue regions.

- [ ] **Step 1: Generate the desktop composition**

Use `cave-descent-journey-v1.webp` as the strict Platão/cave continuity
reference and `cave-recurring-shadows-v1.webp` only as a shadow-content
reference. Generate this composition:

```text
Create a premium cinematic 16:9 Philoo story illustration that continues
directly from the attached cave-descent scene. Preserve Platão's exact face,
amber-brown eyes, rounded nose, swept white hair, full white beard, stylized
proportions, purple himation with gold trim, cream tunic, sandals, and clay
lamp. The camera is just behind and slightly above three seated prisoners, all
shown from behind and facing a warm cave wall. Platão is physically integrated
into the lower-left foreground in three-quarter profile, looking partly toward
the learner and directing one open hand toward the wall. His lamp is held low
and lights only him and nearby stone. The wall occupies the right half and
shows three soft projected silhouettes: a bird, a Greek amphora, and a horse.
Do not reveal the fire, objects, or people producing them. Preserve dark
blue-black cave stone, cool baby-blue rim light, warm amber wall light,
believable contact shadows, shared perspective, and sophisticated stylized 3D
animated-film quality for ages 12–16. Reserve the upper-left 38% as quiet dark
cave rock for external dialogue. Keep Platão, all prisoners, and all three
shadows outside that region. No text, labels, cards, UI, extra limbs, or
malformed hands.
```

- [ ] **Step 2: Reject or keep the desktop output**

Keep only an output where Platão matches Scene 3, all people share the same
lighting and perspective, prisoners face the wall, all shadows read as
projected silhouettes, and the upper-left dialogue region contains no focal
detail.

- [ ] **Step 3: Generate the native mobile composition**

Use `cave-descent-journey-mobile-v2.webp` as the strict Platão/cave continuity
reference and generate:

```text
Create a native 9:16 portrait version of the same Philoo cave scene, composed
for mobile rather than cropped from landscape. Preserve Platão's identity
exactly. Leave the upper 38% as quiet dark-blue cave rock for an external scene
label and cream dialogue card. Across the middle, reveal the warm amber cave
wall with three soft projected shadows: a bird, a Greek amphora, and a horse.
Place Platão as a principal character in the lower-left foreground, grounded in
the cave, body facing the wall, head partly toward the learner, one open hand
pointing diagonally toward the shadows, clay lamp held low. Place three seated
prisoners from behind in the lower-middle and lower-right, all facing the wall.
Preserve shared perspective, contact shadows, cool baby-blue ambient light,
warm amber wall light, and premium sophisticated stylized 3D animation quality
for ages 12–16. Do not reveal the shadow source. No text, UI, labels, floating
objects, extra limbs, or malformed hands.
```

- [ ] **Step 4: Reject or keep the mobile output**

Keep only an output where the upper 38% is genuinely quiet, all three shadows
remain readable, Platão and the prisoners remain visible below the dialogue
zone, and the result is a portrait recomposition rather than a crop.

- [ ] **Step 5: Save optimized assets**

Save the selected outputs as WebP at the exact paths above. Preserve enough
resolution for a `1460px` desktop scene and a high-density `390px` phone.

### Task 2: Build the four-beat story scene

**Files:**
- Modify: `src/domains/lessons/as-sombras/cave-shadow-names-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/cave-shadow-names-scene.module.css`
- Create: `src/domains/lessons/as-sombras/cave-shadow-names-scene.test.tsx`
- Modify: `src/app/aula/as-sombras/eles-dao-nomes/page.tsx`

**Interfaces:**
- Consumes: `/images/story/cave-shadow-game-v1.webp`,
  `/images/story/cave-shadow-game-mobile-v1.webp`,
  `CaveStoryProgress`, and `useStorySceneTransition`.
- Produces: a four-beat `CaveShadowNamesScene` that links to the unchanged
  activity route.

- [ ] **Step 1: Write the failing scene test**

Create a test with the existing transition hook mocked:

```tsx
vi.mock("../use-story-scene-transition", () => ({
  useStorySceneTransition: () => ({
    phase: "idle",
    beginNavigation: vi.fn(),
    completeExit: vi.fn(),
  }),
}));

it("lets the learner witness how the prisoners turn shadows into knowledge", () => {
  render(<CaveShadowNamesScene />);

  expect(
    screen.getByRole("heading", { name: "O mundo na parede" }),
  ).toBeInTheDocument();
  expect(screen.getByText(/tudo o que conseguem ver/i)).toBeInTheDocument();
  expect(
    screen.getByRole("progressbar", { name: "Cena 4 de 10" }),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
  expect(screen.getByText(/eu reconheci primeiro/i)).toBeInTheDocument();
  expect(screen.getByText("Prisioneiro")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
  expect(screen.getByText(/parece ser o mais sábio/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
  expect(screen.getByText(/nunca viram o que as produz/i)).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Observar as sombras" }),
  ).toHaveAttribute("href", "/aula/as-sombras/o-que-chegou-ate-eles");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- cave-shadow-names-scene.test.tsx
```

Expected: failure because the current scene has no sequential `Continuar`
button and does not contain the new dialogue.

- [ ] **Step 3: Implement the dialogue sequence**

Define:

```tsx
const DIALOGUE_BEATS = [
  {
    speaker: "Platão",
    kind: "plato",
    text: "Agora, olhe com elas. Tudo o que conseguem ver acontece nesta parede.",
  },
  {
    speaker: "Prisioneiro",
    kind: "prisoner",
    text: "Um pássaro! Eu reconheci primeiro!",
  },
  {
    speaker: "Platão",
    kind: "plato",
    text: "Aqui, quem reconhece as sombras mais depressa parece ser o mais sábio.",
  },
  {
    speaker: "Platão",
    kind: "plato",
    text: "Eles conhecem muito bem as aparências — mas nunca viram o que as produz. Guarde essa diferença.",
  },
] as const;
```

Use `useState(0)`, keep the existing transition hook and routes, and render:

- the persistent Philoo header and `currentBeat={4}`;
- a screen-reader heading `O mundo na parede`;
- desktop/mobile `next/image` artwork;
- `Cena 4 · O mundo na parede`;
- one live-region voice card with decorative quotation mark, speaker, text,
  four-step progress, `Continuar`, then `Observar as sombras`.

- [ ] **Step 4: Implement the responsive composition**

Replace the existing headline, shadow labels, bottom guide rail, and separate
Platão image. Follow the Scene 3 voice-card sizing and interaction style. Use a
blue quote mark for `data-speaker="plato"` and warm amber for
`data-speaker="prisoner"`. At `620px` and below, switch to the portrait artwork
and keep the full longest card within the quiet upper region.

- [ ] **Step 5: Update route metadata**

Set:

```tsx
export const metadata: Metadata = {
  title: "O mundo na parede · As Sombras",
};
```

- [ ] **Step 6: Run focused verification**

Run:

```bash
npm test -- cave-shadow-names-scene.test.tsx
```

Expected: one Scene 4 test file passes.

- [ ] **Step 7: Review the rendered scene**

Open `/aula/as-sombras/eles-dao-nomes`. Inspect the first, prisoner, and final
dialogue beats at desktop width and `390×844`. Confirm no card covers Platão,
the prisoners, or the shadows and the final link reaches the unchanged
activity.

- [ ] **Step 8: Commit**

Stage only Task 2 files and commit:

```bash
git commit -m "feat: turn Cave scene four into a shadow game"
```
