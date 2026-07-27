# Philoo “As Sombras” Session One Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing Corte de Luz prologue into the entry to a complete, beautiful, scene-based first Cave session with reusable lesson-runtime foundations, local resume, meaningful activities, and accessible alternatives.

**Architecture:** The stable `/aula/as-sombras` route remains a Server Component that renders a client-side `AsSombrasPlayer`. A thin generic lesson domain validates a directed graph, commits versioned attempt snapshots through an asynchronous store, and renders a stable scene shell. Reusable interaction families surround three bespoke Cave scenes: prisoner viewpoint, anomaly playback, and the semantic HTML/SVG Shadow Laboratory.

**Tech Stack:** Next.js 16.2.12 App Router, React 19.2.4, strict TypeScript, CSS Modules, Vitest, Testing Library, semantic HTML/SVG, browser `localStorage`, Next Image, generated WebP environment assets.

## Global Constraints

- Keep `/aula/as-sombras` and all current public/student entry links stable.
- Treat the complete current Corte de Luz content as an ungraded prologue outside the eight-scene progress count.
- Preserve the prologue's copy, order, LightCut behavior, Plato disclosure, class names, metadata, and `/inicio` exit links except for the truthful persistence note and the new `Começar a investigação` action.
- Student copy is Brazilian Portuguese and aimed primarily at ages 13–16, with supports suitable for approximately ages 11–17.
- Use the Philoo brand colors `#33BFED`, `#5BB8F5`, and `#FBF8F3`; the visible name is always `Philoo`.
- Keep Bricolage Grotesque, Public Sans, and IBM Plex Mono in their existing roles.
- Plato is a Socratic companion, never a narrator, scorekeeper, answer machine, or decorative mascot.
- Use only the checksum-verified canonical `public/images/plato/platao-master.webp` in this slice.
- No XP, coins, lives, streaks, public rankings, speed bonuses, hint penalties, confetti, or punitive failure screens.
- Every activity follows `attempt → evidence/consequence → unresolved tension → next move → revision`.
- No audio-dependent evidence. Sound clues use visible timing, captions, and text until audio production is implemented.
- Every target is at least 44 × 44 CSS pixels, keyboard reachable, screen-reader named, and usable with reduced motion.
- Dragging is optional enhancement only; every ordering or placement interaction has explicit controls.
- Color never carries status alone; text contrast meets WCAG 2.2 AA.
- Use CSS Modules for the player and new scenes; do not expand the existing 2,454-line global stylesheet except where preserving the prologue requires it.
- Keep the route page as a Server Component so it continues to own metadata.
- Keep manifests JSON-like; do not store React components or callbacks in lesson data.
- Use named graph transitions, never numeric page jumps.
- Persist versioned local state through an asynchronous `AttemptStore` interface so Supabase can replace the adapter later.
- Raw hypotheses and revised prose use `private_reflection`; do not copy them into telemetry.
- Do not connect to or mutate Supabase, GitHub remotes, or Vercel in this implementation slice.
- Every Philoo-specific behavior follows red → green TDD.

---

## File structure

| File | Responsibility |
|---|---|
| `docs/product/philoo-learning-activity-library.md` | Reusable activity selection and feedback standard. |
| `docs/superpowers/specs/2026-07-27-philoo-lesson-player-design.md` | Approved scene-player and Session 1 design. |
| `public/images/cave/cave-player-stage.webp` | Generated open Cave environment. |
| `public/images/cave/cave-wall-stage.webp` | Generated wall stage for deterministic overlays. |
| `src/domains/lessons/contracts.ts` | JSON-safe lesson, scene, response, snapshot, and store contracts. |
| `src/domains/lessons/graph.ts` | Manifest validation, named transition resolution, and reachability. |
| `src/domains/lessons/runtime.ts` | Initial snapshot and immutable scene-commit reducer. |
| `src/domains/lessons/local-attempt-store.ts` | Safe asynchronous browser persistence. |
| `src/domains/lessons/lesson-player.tsx` | Stable scene shell, restore/commit behavior, focus, progress, back, and completion. |
| `src/domains/lessons/lesson-player.module.css` | Responsive shell and living-fissure path. |
| `src/domains/lessons/scene-error-boundary.tsx` | Recoverable scene failure UI. |
| `src/domains/lessons/interactions/prediction-consequence.tsx` | Commit-before-reveal prediction loop. |
| `src/domains/lessons/interactions/evidence-inspector.tsx` | Required clue inspection and model comparison. |
| `src/domains/lessons/interactions/cer-response.tsx` | Claim–evidence–reason–acknowledgment assembly. |
| `src/domains/lessons/interactions/confidence-control.tsx` | Named low/medium/high confidence input. |
| `src/domains/lessons/interactions/revision-map.tsx` | Before/after hypothesis comparison. |
| `src/domains/lessons/interactions/transfer-classification.tsx` | Representation/source/claim/evidence transfer task. |
| `src/domains/lessons/as-sombras/manifest.ts` | Typed nine-node graph, six acts, copy, options, assets, and required evidence. |
| `src/domains/lessons/as-sombras/state.ts` | Cave-specific snapshot state and response keys. |
| `src/domains/lessons/as-sombras/as-sombras-player.tsx` | Local store composition and exhaustive Cave scene renderer. |
| `src/domains/lessons/as-sombras/prologue-scene.tsx` | Extracted current Corte de Luz experience plus start transition. |
| `src/domains/lessons/as-sombras/prisoner-view-scene.tsx` | Scene 1 constrained viewpoint and observation/inference task. |
| `src/domains/lessons/as-sombras/prediction-mastery-scene.tsx` | Scene 2 wall-rule forecasts. |
| `src/domains/lessons/as-sombras/anomaly-scene.tsx` | Scene 3 bird/voice/footstep mismatch. |
| `src/domains/lessons/as-sombras/evidence-investigation-scene.tsx` | Scene 4 clue branches and model fit. |
| `src/domains/lessons/as-sombras/shadow-model.ts` | Pure deterministic light/object/projection model. |
| `src/domains/lessons/as-sombras/shadow-laboratory.tsx` | Scene 5 spatial lab plus equivalent causal stepper. |
| `src/domains/lessons/as-sombras/defend-model-scene.tsx` | Scene 6 rival argument and response. |
| `src/domains/lessons/as-sombras/revision-scene.tsx` | Scene 7 saved-hypothesis revision. |
| `src/domains/lessons/as-sombras/transfer-scene.tsx` | Scene 8 fictional school-council transfer. |
| `src/domains/lessons/as-sombras/as-sombras.module.css` | Cave scenes, coded silhouettes, lab, and responsive trays. |
| `src/app/aula/as-sombras/page.tsx` | Stable metadata route rendering `AsSombrasPlayer`. |
| `src/components/hypothesis-note.tsx` | Backward-compatible controlled/uncontrolled hypothesis editor. |

Tests are colocated beside their production files using `*.test.ts` or `*.test.tsx`.

### Task 1: Commit the product standard and optimized Cave environments

**Files:**
- Create: `docs/product/philoo-learning-activity-library.md`
- Create: `docs/superpowers/specs/2026-07-27-philoo-lesson-player-design.md`
- Create: `public/images/cave/cave-player-stage.webp`
- Create: `public/images/cave/cave-wall-stage.webp`

**Interfaces:**
- Produces: the curriculum activity-selection standard used by every later task.
- Produces: two environment assets referenced by the Cave manifest.

- [ ] **Step 1: Copy the approved source images into a temporary conversion directory**

Use these exact built-in generation outputs:

```text
/Users/jv/.codex/generated_images/019fa061-90c8-7fc0-94b4-ea3d4725f71d/call_9TxXPDwLRvffoNRMAhypYbqO.png
/Users/jv/.codex/generated_images/019fa061-90c8-7fc0-94b4-ea3d4725f71d/call_L8UTYQu2ox8msLIzOhdWtOy5.png
```

- [ ] **Step 2: Create responsive WebP production assets**

Use the repository's installed `sharp` package to resize each image to 1600 × 900 with cover cropping and encode WebP at quality 82:

```js
const sharp = require("sharp");

await sharp(openCaveSource)
  .resize(1600, 900, { fit: "cover", position: "centre" })
  .webp({ quality: 82, effort: 6 })
  .toFile("public/images/cave/cave-player-stage.webp");

await sharp(wallSource)
  .resize(1600, 900, { fit: "cover", position: "centre" })
  .webp({ quality: 82, effort: 6 })
  .toFile("public/images/cave/cave-wall-stage.webp");
```

- [ ] **Step 3: Verify the assets**

Run:

```bash
file public/images/cave/cave-player-stage.webp public/images/cave/cave-wall-stage.webp
du -h public/images/cave/cave-player-stage.webp public/images/cave/cave-wall-stage.webp
```

Expected:

- both report WebP at 1600 × 900;
- each is below 1.5 MB;
- neither source PNG is added to Git.

- [ ] **Step 4: Commit**

```bash
git add docs/product docs/superpowers/specs public/images/cave
git commit -m "docs: define Philoo lesson activity system"
```

### Task 2: Build and validate the named lesson graph

**Files:**
- Create first: `src/domains/lessons/graph.test.ts`
- Create: `src/domains/lessons/contracts.ts`
- Create: `src/domains/lessons/graph.ts`

**Interfaces:**
- Produces: `LessonManifest<TScene>`, `SceneNode`, `NamedTransition`, `AttemptSnapshot`, `AttemptStore`, `SceneCommit`, and response visibility types.
- Produces: `validateLessonManifest(manifest): readonly string[]`.
- Produces: `resolveNamedTransition(manifest, sceneId, transitionName): string | "$complete"`.
- Produces: `getRequiredSceneOrder(manifest): readonly string[]`.

- [ ] **Step 1: Write the graph contract test**

```ts
import { describe, expect, it } from "vitest";
import type { LessonManifest, SceneNode } from "./contracts";
import {
  getRequiredSceneOrder,
  resolveNamedTransition,
  validateLessonManifest,
} from "./graph";

const scenes = [
  {
    id: "prologue",
    arcId: "entry",
    kind: "prologue",
    mode: "custom",
    title: "Prólogo",
    savePoint: true,
    config: {},
    transitions: [{ name: "enter_wall", to: "wall" }],
  },
  {
    id: "wall",
    arcId: "act-1",
    kind: "wall",
    mode: "custom",
    title: "Só a parede",
    savePoint: true,
    config: {},
    transitions: [{ name: "finish", to: "$complete" }],
  },
] as const satisfies readonly SceneNode[];

const manifest: LessonManifest<(typeof scenes)[number]> = {
  identity: {
    id: "lesson.test",
    slug: "test",
    locale: "pt-BR",
    version: "1.0.0",
    contentHash: "test-v1",
  },
  title: "Teste",
  entrySceneId: "prologue",
  arcs: [
    { id: "entry", title: "Entrada", sceneIds: ["prologue"] },
    { id: "act-1", title: "Ato 1", sceneIds: ["wall"] },
  ],
  scenes,
};

describe("lesson graph", () => {
  it("resolves transitions by name and exposes the required order", () => {
    expect(resolveNamedTransition(manifest, "prologue", "enter_wall")).toBe("wall");
    expect(getRequiredSceneOrder(manifest)).toEqual(["prologue", "wall"]);
  });

  it("rejects duplicate IDs, missing targets, and unreachable nodes", () => {
    const broken = {
      ...manifest,
      scenes: [
        ...manifest.scenes,
        {
          ...manifest.scenes[1],
          transitions: [{ name: "missing", to: "nowhere" }],
        },
      ],
    };

    expect(validateLessonManifest(broken)).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/duplicate scene id/i),
        expect.stringMatching(/unknown target/i),
      ]),
    );
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
npm test -- src/domains/lessons/graph.test.ts
```

Expected: FAIL because the contracts and graph functions do not exist.

- [ ] **Step 3: Add the JSON-safe contracts**

Define these exact public types in `contracts.ts`:

```ts
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };

export type JsonObject = { readonly [key: string]: JsonValue };
export type SceneMode = "composable" | "custom";
export type SceneTarget = string | "$complete";

export interface NamedTransition {
  readonly name: string;
  readonly to: SceneTarget;
}

export interface SceneNode<
  K extends string = string,
  C extends JsonObject = JsonObject,
> {
  readonly id: string;
  readonly arcId: string;
  readonly kind: K;
  readonly mode: SceneMode;
  readonly title: string;
  readonly savePoint: boolean;
  readonly config: C;
  readonly transitions: readonly NamedTransition[];
}

export interface LessonArc {
  readonly id: string;
  readonly title: string;
  readonly sceneIds: readonly string[];
}

export interface LessonManifest<TScene extends SceneNode = SceneNode> {
  readonly identity: {
    readonly id: string;
    readonly slug: string;
    readonly locale: "pt-BR";
    readonly version: string;
    readonly contentHash: string;
  };
  readonly title: string;
  readonly entrySceneId: string;
  readonly arcs: readonly LessonArc[];
  readonly scenes: readonly TScene[];
}

export type VisibilityClass =
  | "private_reflection"
  | "teacher_visible_task"
  | "derived_rubric"
  | "system_telemetry";

export interface ResponseEnvelope {
  readonly visibility: VisibilityClass;
  readonly value: JsonValue;
}

export interface AttemptSnapshot {
  readonly lessonId: string;
  readonly lessonVersion: string;
  readonly currentSceneId: string;
  readonly visitedSceneIds: readonly string[];
  readonly sceneState: Readonly<Record<string, JsonObject>>;
  readonly responses: Readonly<Record<string, ResponseEnvelope>>;
  readonly sequence: number;
  readonly status: "in_progress" | "completed";
}

export interface SceneCommit {
  readonly eventName: string;
  readonly nextSceneState: JsonObject;
  readonly responses?: Readonly<Record<string, ResponseEnvelope>>;
  readonly transition?: string;
}

export interface AttemptStore {
  restore(
    lessonId: string,
    lessonVersion: string,
  ): Promise<AttemptSnapshot | null>;
  commit(input: {
    readonly eventId: string;
    readonly next: AttemptSnapshot;
  }): Promise<void>;
}
```

- [ ] **Step 4: Implement graph validation and transition resolution**

`validateLessonManifest` must report:

- duplicate scene IDs;
- duplicate transition names within a scene;
- unknown entry scene;
- unknown transition targets;
- arc references to unknown scenes;
- scenes not assigned exactly once to an arc;
- unreachable scenes;
- no path to `$complete`.

`resolveNamedTransition` throws an `Error` containing both the scene and transition names when a transition is absent.

- [ ] **Step 5: Run GREEN**

Run:

```bash
npm test -- src/domains/lessons/graph.test.ts
npm run lint
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/domains/lessons
git commit -m "feat: add named lesson graph contracts"
```

### Task 3: Add versioned attempt snapshots and safe local persistence

**Files:**
- Create first: `src/domains/lessons/runtime.test.ts`
- Create first: `src/domains/lessons/local-attempt-store.test.ts`
- Create: `src/domains/lessons/runtime.ts`
- Create: `src/domains/lessons/local-attempt-store.ts`

**Interfaces:**
- Consumes: graph contracts and `resolveNamedTransition`.
- Produces: `createInitialSnapshot(manifest): AttemptSnapshot`.
- Produces: `applySceneCommit(manifest, snapshot, commit): AttemptSnapshot`.
- Produces: `LocalAttemptStore({ storage, keyPrefix? }): AttemptStore`.

- [ ] **Step 1: Write the runtime test**

```ts
it("preserves responses and advances only through a named transition", () => {
  const initial = createInitialSnapshot(manifest);
  const next = applySceneCommit(manifest, initial, {
    eventName: "hypothesis_registered",
    nextSceneState: { draft: "Sombras mostram contornos." },
    responses: {
      prologueHypothesis: {
        visibility: "private_reflection",
        value: "Sombras mostram contornos.",
      },
    },
    transition: "enter_wall",
  });

  expect(next.currentSceneId).toBe("wall");
  expect(next.sequence).toBe(1);
  expect(next.responses.prologueHypothesis.visibility).toBe("private_reflection");
  expect(next.visitedSceneIds).toEqual(["prologue", "wall"]);
});
```

Also test:

- a commit without `transition` updates only the current scene;
- a transition to `$complete` sets `status: "completed"`;
- unknown transitions throw without changing the original snapshot;
- snapshots remain immutable.

- [ ] **Step 2: Write the local-store test**

Use an in-memory `Storage` double. Cover:

- `restore` returns `null` when no record exists;
- `commit` writes JSON under `philoo:attempt:<lessonId>:<lessonVersion>`;
- invalid JSON returns `null`;
- a stored record for another lesson/version returns `null`;
- browser storage throwing during read/write does not crash restore and rejects commit with a recoverable error.

- [ ] **Step 3: Run both tests and verify RED**

Run:

```bash
npm test -- src/domains/lessons/runtime.test.ts src/domains/lessons/local-attempt-store.test.ts
```

Expected: FAIL because the runtime and store do not exist.

- [ ] **Step 4: Implement the immutable runtime**

`createInitialSnapshot` starts at `manifest.entrySceneId`, includes it in `visitedSceneIds`, has empty state/responses, `sequence: 0`, and `status: "in_progress"`.

`applySceneCommit`:

1. writes `nextSceneState` under the current scene ID;
2. merges response envelopes;
3. resolves a named transition when present;
4. appends a newly visited target once;
5. increments `sequence`;
6. returns a new object without mutating the input.

- [ ] **Step 5: Implement the async local adapter**

The adapter receives `storage` rather than reading `window.localStorage` internally during construction. The client composition passes the browser storage after mount.

Deduplicate commits by `eventId` for the life of the adapter so React retries cannot double-write a transition.

- [ ] **Step 6: Run GREEN**

Run:

```bash
npm test -- src/domains/lessons/runtime.test.ts src/domains/lessons/local-attempt-store.test.ts
npm run lint
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/domains/lessons
git commit -m "feat: persist versioned lesson attempts"
```

### Task 4: Preserve the prologue and connect its hypothesis

**Files:**
- Create first: `src/domains/lessons/as-sombras/prologue-scene.test.tsx`
- Create: `src/domains/lessons/as-sombras/prologue-scene.tsx`
- Modify: `src/components/hypothesis-note.tsx`
- Modify: `src/components/hypothesis-note.test.tsx`
- Modify: `src/app/aula/as-sombras/page.tsx`

**Interfaces:**
- Produces: `HypothesisNoteProps`.
- Produces: `PrologueScene({ hypothesis, onHypothesisChange, onRegister, onContinue })`.
- Preserves: current no-prop `HypothesisNote()` behavior.

- [ ] **Step 1: Add a prologue characterization test before extraction**

Render the current page and assert:

```tsx
expect(
  screen.getByRole("heading", { name: /o que uma sombra deixa de fora/i }),
).toBeInTheDocument();
expect(
  screen.getByRole("slider", { name: /posição do corte de luz/i }),
).toBeInTheDocument();
expect(
  screen.getByRole("button", { name: /ver aparência/i }),
).toBeInTheDocument();
expect(
  screen.getByRole("button", { name: /ver pistas/i }),
).toBeInTheDocument();
expect(
  screen.getByRole("textbox", { name: /sua hipótese provisória/i }),
).toBeInTheDocument();
expect(
  screen.getByText(/quer uma pergunta de platão/i),
).toBeInTheDocument();
expect(
  screen.getAllByRole("link", { name: /voltar ao início|encerrar e voltar/i }),
).toHaveLength(2);
```

- [ ] **Step 2: Add controlled-mode tests for `HypothesisNote`**

```tsx
it("reports draft changes and registered hypotheses in controlled mode", () => {
  const onValueChange = vi.fn();
  const onRegister = vi.fn();

  render(
    <HypothesisNote
      value="Talvez as sombras mostrem apenas contornos."
      onValueChange={onValueChange}
      onRegister={onRegister}
    />,
  );

  fireEvent.change(
    screen.getByRole("textbox", { name: /sua hipótese provisória/i }),
    { target: { value: "Uma sombra mostra efeitos, não a fonte." } },
  );
  expect(onValueChange).toHaveBeenCalledWith(
    "Uma sombra mostra efeitos, não a fonte.",
  );

  fireEvent.click(
    screen.getByRole("button", { name: /registrar hipótese/i }),
  );
  expect(onRegister).toHaveBeenCalledWith(
    "Talvez as sombras mostrem apenas contornos.",
  );
});
```

- [ ] **Step 3: Run and verify RED**

Run:

```bash
npm test -- src/components/hypothesis-note.test.tsx src/domains/lessons/as-sombras/prologue-scene.test.tsx
```

Expected: the new controlled-prop and extraction tests fail.

- [ ] **Step 4: Add the backward-compatible props**

```ts
export interface HypothesisNoteProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onRegister?: (value: string) => void;
}
```

Use an internal draft only when `value` is `undefined`. Keep the existing button labels and feedback behavior. Replace the inaccurate note with:

> Sua hipótese fica privada e volta com você nesta investigação.

- [ ] **Step 5: Extract the prologue without visual rewriting**

Move the current `<main>` sections into `PrologueScene`. Keep the header/footer in the scene so the visible result remains unchanged. Add one final cream/blue transition section with:

- heading `Pronto para pensar de dentro da caverna?`;
- copy `Você viu o mecanismo por fora. Agora use apenas as pistas que chegam à parede.`;
- button `Começar a investigação`.

The button invokes `onContinue`; it does not navigate by URL or page index.

- [ ] **Step 6: Temporarily render `PrologueScene` from the stable route**

Until Task 5 wraps it in the player, `page.tsx` passes local no-op callbacks only through a small temporary client wrapper colocated with `PrologueScene`. The route remains a Server Component and keeps its metadata.

- [ ] **Step 7: Run GREEN and inspect the route**

Run:

```bash
npm test -- src/components/hypothesis-note.test.tsx src/domains/lessons/as-sombras/prologue-scene.test.tsx
npm run lint
npm run build
```

Expected: PASS and no prologue copy or behavior regression.

- [ ] **Step 8: Commit**

```bash
git add src/app/aula/as-sombras src/components/hypothesis-note* src/domains/lessons/as-sombras
git commit -m "refactor: preserve Corte de Luz as prologue"
```

### Task 5: Build the scene player shell and Cave manifest

**Files:**
- Create first: `src/domains/lessons/as-sombras/manifest.test.ts`
- Create first: `src/domains/lessons/lesson-player.test.tsx`
- Create: `src/domains/lessons/as-sombras/manifest.ts`
- Create: `src/domains/lessons/as-sombras/state.ts`
- Create: `src/domains/lessons/lesson-player.tsx`
- Create: `src/domains/lessons/lesson-player.module.css`
- Create: `src/domains/lessons/scene-error-boundary.tsx`
- Create: `src/domains/lessons/as-sombras/as-sombras-player.tsx`
- Create: `src/domains/lessons/as-sombras/as-sombras.module.css`
- Modify: `src/app/aula/as-sombras/page.tsx`

**Interfaces:**
- Consumes: graph/runtime/store, `PrologueScene`, and the stable route.
- Produces: `asSombrasManifest`.
- Produces: `CaveSceneId`, `CaveSceneState`, response-key constants, and initial state.
- Produces: generic `LessonPlayer({ manifest, store, renderScene, onExitHref })`.
- Produces: `AsSombrasPlayer()`.

- [ ] **Step 1: Write the manifest contract test**

Assert:

- `validateLessonManifest(asSombrasManifest)` returns `[]`;
- nine nodes exist;
- entry is `prologue_corte_de_luz`;
- exactly eight nodes are counted after the prologue;
- six numbered acts exist after the ungraded entry;
- the named path is:

```text
prologue_corte_de_luz
→ prisoner_view
→ prediction_mastery
→ impossible_shadow
→ evidence_investigation
→ shadow_laboratory
→ defend_model
→ revision_map
→ transfer_case
→ $complete
```

- `shadow_laboratory` uses custom mode;
- assets reference `/images/cave/cave-player-stage.webp`, `/images/cave/cave-wall-stage.webp`, and the canonical Plato master.

- [ ] **Step 2: Write player behavior tests**

Use a memory `AttemptStore` and a two-scene test manifest. Assert:

- restore occurs before a scene is shown;
- the current scene heading receives focus after a named transition;
- progress says `1 de 2` and excludes an ungraded entry when configured;
- Back returns to a visited scene and preserves state;
- commit resolves before the next scene renders;
- store rejection exposes `Não foi possível guardar esta etapa` with `Tentar de novo`;
- completion exposes `Investigação concluída` and a link to `/inicio`.

- [ ] **Step 3: Run and verify RED**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/manifest.test.ts src/domains/lessons/lesson-player.test.tsx
```

Expected: FAIL because the manifest and player do not exist.

- [ ] **Step 4: Create the Cave manifest**

Use these exact node IDs and named exits:

```ts
export const cavePath = [
  ["prologue_corte_de_luz", "enter_the_wall"],
  ["prisoner_view", "begin_prediction_training"],
  ["prediction_mastery", "confront_impossible_shadow"],
  ["impossible_shadow", "inspect_evidence"],
  ["evidence_investigation", "enter_thought_space"],
  ["shadow_laboratory", "defend_model"],
  ["defend_model", "revisit_first_view"],
  ["revision_map", "test_transfer"],
  ["transfer_case", "complete_session"],
] as const;
```

The six act titles are:

1. `A parede`
2. `Tornar-se especialista`
3. `A sombra impossível`
4. `Reconstruir a caverna`
5. `Defender ou revisar`
6. `O que é uma sombra?`

- [ ] **Step 5: Implement the generic shell**

The shell:

- restores once;
- renders a busy state labeled `Abrindo sua investigação…`;
- commits before navigation;
- keeps a history derived from `visitedSceneIds`;
- uses the manifest's named arcs for the path;
- moves focus to an `h1` with `tabIndex={-1}` after a forward transition;
- retains focus context on Back;
- uses `aria-current="step"` on the active path node;
- exposes a clear `/inicio` exit;
- catches scene rendering errors and offers a route-safe retry.

- [ ] **Step 6: Compose `AsSombrasPlayer`**

`AsSombrasPlayer` is a Client Component. It creates a `LocalAttemptStore` after mount and uses an exhaustive switch over the scene kind.

Until later tasks add each scene, every post-prologue branch renders a simple, truthful scene heading and the scene's actual purpose plus a disabled `Continuar` button. This temporary state is not committed independently and is replaced before the branch is considered complete.

The prologue branch:

- reads/writes the `prologueHypothesis` private response;
- commits `hypothesis_registered` without transitioning;
- commits `enter_the_wall` when Start is activated.

- [ ] **Step 7: Style the stable shell**

Implement:

- `min-height: 100dvh`;
- no page-level scroll at 1366 × 768 or larger;
- cream contextual tray;
- generated environment stage;
- living baby-blue fissure path;
- fixed/reachable phone actions;
- scene stage `min-height: 0`;
- reduced-motion removal of ambient transitions;
- no rounded-card dashboard pattern.

- [ ] **Step 8: Run GREEN**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/manifest.test.ts src/domains/lessons/lesson-player.test.tsx
npm test
npm run lint
npm run build
```

Expected: all PASS.

- [ ] **Step 9: Commit**

```bash
git add src/app/aula/as-sombras src/domains/lessons
git commit -m "feat: add Philoo scene lesson player"
```

### Task 6: Implement Scenes 1–4 and their reusable prediction/evidence interactions

**Files:**
- Create first: `src/domains/lessons/interactions/prediction-consequence.test.tsx`
- Create first: `src/domains/lessons/interactions/evidence-inspector.test.tsx`
- Create first: `src/domains/lessons/as-sombras/opening-scenes.test.tsx`
- Create: `src/domains/lessons/interactions/prediction-consequence.tsx`
- Create: `src/domains/lessons/interactions/evidence-inspector.tsx`
- Create: `src/domains/lessons/as-sombras/prisoner-view-scene.tsx`
- Create: `src/domains/lessons/as-sombras/prediction-mastery-scene.tsx`
- Create: `src/domains/lessons/as-sombras/anomaly-scene.tsx`
- Create: `src/domains/lessons/as-sombras/evidence-investigation-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/as-sombras-player.tsx`
- Modify: `src/domains/lessons/as-sombras/as-sombras.module.css`

**Interfaces:**
- Produces: `PredictionConsequence<TChoice>`.
- Produces: `EvidenceInspector<TClueId, TModelFit>`.
- Emits: `observation_classified`, `wall_forecast`, `wall_pattern_mastery`, `anomaly_noticed`, `first_clue_selected`, `clue_inspected`, and `model_fit_compared`.

- [ ] **Step 1: Write the prediction interaction test**

Assert:

- consequence is hidden before a choice is committed;
- one committed choice reveals consequence and feedback;
- changing the choice is unavailable until `Tentar outra previsão`;
- `onCommit` receives the choice and whether it matched;
- keyboard and button operation require no timer.

- [ ] **Step 2: Write the evidence inspector test**

Assert:

- the learner chooses which clue to inspect;
- opened clues remain marked with text and an icon;
- each clue requires a model-fit response;
- `Pode continuar` remains disabled before two completed clues;
- clue order begins with the Scene 3 selection;
- a button exposes the repeated-source clue as an optional stronger test.

- [ ] **Step 3: Write integrated opening-scene tests**

Cover:

- Scene 1 distinguishes `Um contorno com asas passou` from `Um pássaro passou`;
- Scene 2 requests four forecasts and provides a fifth supported round below three matches;
- Scene 3 shows visible cues `passos pesados` and `voz humana` alongside the bird silhouette;
- Scene 3 requires one first clue choice;
- Scene 4 requires two model comparisons.

- [ ] **Step 4: Run and verify RED**

Run:

```bash
npm test -- src/domains/lessons/interactions/prediction-consequence.test.tsx src/domains/lessons/interactions/evidence-inspector.test.tsx src/domains/lessons/as-sombras/opening-scenes.test.tsx
```

Expected: FAIL because the interactions and scenes do not exist.

- [ ] **Step 5: Implement Scene 1**

Use the generated wall stage and deterministic coded silhouettes. Present:

- `Observar`;
- `Escutar`;
- `Tentar olhar para trás`.

The last action responds:

> As correntes limitam o movimento. Você pode testar apenas as pistas que chegam daqui.

Classification feedback:

> Você percebeu um contorno. “Pássaro” já é uma explicação. Você consegue verificar a fonte daqui?

- [ ] **Step 6: Implement Scene 2**

Use two guided patterns and four novel forecasts. Save each result. After four:

- three or four matches emits mastery;
- zero to two matches reveals one focused rule and a fifth forecast;
- no path displays failure or removes progress.

Use consequence-first feedback:

> Sua previsão combinou com o padrão. Isso mostra que o padrão é útil — ainda não mostra o que o produz.

- [ ] **Step 7: Implement Scene 3**

Create one coordinated reveal:

- bird-shaped coded silhouette;
- visual footstep track starting before and ending after the silhouette;
- caption `voz humana: “mais devagar”`;
- replay button;
- static transcript available before replay;
- Plato enters after the learner selects one clue.

Plato asks:

> O que falhou: o que você percebeu ou a explicação?

- [ ] **Step 8: Implement Scene 4**

Provide the four approved clues and model-fit choices:

- `combina com o modelo da parede`;
- `combina com uma fonte escondida`;
- `combina com os dois`;
- `ainda não sei`.

Feedback names what the clue explains and leaves unresolved.

- [ ] **Step 9: Run GREEN**

Run:

```bash
npm test -- src/domains/lessons/interactions/prediction-consequence.test.tsx src/domains/lessons/interactions/evidence-inspector.test.tsx src/domains/lessons/as-sombras/opening-scenes.test.tsx
npm test
npm run lint
```

Expected: all PASS.

- [ ] **Step 10: Commit**

```bash
git add src/domains/lessons
git commit -m "feat: investigate the impossible shadow"
```

### Task 7: Build the accessible Shadow Laboratory

**Files:**
- Create first: `src/domains/lessons/as-sombras/shadow-model.test.ts`
- Create first: `src/domains/lessons/as-sombras/shadow-laboratory.test.tsx`
- Create: `src/domains/lessons/as-sombras/shadow-model.ts`
- Create: `src/domains/lessons/as-sombras/shadow-laboratory.tsx`
- Modify: `src/domains/lessons/as-sombras/as-sombras-player.tsx`
- Modify: `src/domains/lessons/as-sombras/as-sombras.module.css`

**Interfaces:**
- Produces: `ShadowModelInput`, `ShadowModelOutput`, and `runShadowModel(input)`.
- Produces: rich spatial and structured-stepper modes that emit identical `model_run` and `counterfactual_predicted` evidence.

- [ ] **Step 1: Write pure causal-model tests**

Cover:

```ts
expect(
  runShadowModel({
    lightPosition: 0,
    artifactPosition: 4,
    wallPosition: 10,
    artifactHeight: 2,
    carrierVoice: "human",
  }).projectionScale,
).toBeCloseTo(2.5);
```

Also verify:

- moving the artifact closer to the light increases projection scale;
- an artifact outside the light path produces no projection;
- a human carrier preserves a human voice regardless of artifact silhouette;
- footsteps and voice belong to the carrier;
- the projection belongs to the artifact/light geometry;
- invalid position order returns a named recoverable result rather than `NaN`.

- [ ] **Step 2: Write rich/fallback parity tests**

Complete the core model once through button-based spatial placement and once through `Usar versão em etapas`.

Assert both emit:

```ts
{
  projectionSource: "bird_artifact",
  soundSource: "human_carrier",
  causalLinks: [
    "fire_illuminates_artifact",
    "artifact_blocks_light",
    "projection_reaches_wall",
    "carrier_produces_voice_and_steps",
  ],
}
```

Also assert:

- hints are unavailable before one run;
- after one unproductive run `Pedir uma pergunta a Platão` appears;
- the hint supplies one connection only;
- no interaction is drag-only;
- reduced-motion mode can use `Comparar antes e depois`.

- [ ] **Step 3: Run and verify RED**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/shadow-model.test.ts src/domains/lessons/as-sombras/shadow-laboratory.test.tsx
```

Expected: FAIL because the model and lab do not exist.

- [ ] **Step 4: Implement the pure model**

Use the projection scale:

```ts
const projectionScale =
  (wallPosition - lightPosition) / (artifactPosition - lightPosition);
```

Return named output fields rather than rendering concerns. Reject:

- `artifactPosition <= lightPosition`;
- `wallPosition <= artifactPosition`;
- artifact outside the configured light path.

- [ ] **Step 5: Implement the rich semantic lab**

Use HTML controls and an SVG presentation layer:

- named slots for fire, carrier, artifact, wall, and prisoner;
- tap/select/place as the primary input;
- `Mover para a esquerda`, `Mover para a direita`, `Aproximar da luz`, and `Afastar da luz`;
- SVG rays marked `aria-hidden="true"` while the text result remains live;
- result text names projection and sound sources.

Plato's line:

> Um modelo merece confiança quando consegue prever.

Unproductive configuration:

> Neste arranjo, a luz não envia o contorno à parede. Qual peça precisa mudar?

- [ ] **Step 6: Implement the equivalent stepper**

The stepper asks:

1. what produces light;
2. what blocks it;
3. where the projection appears;
4. who produces the voice and steps;
5. which variable changes projection size.

It emits the same causal evidence object and named transition as the spatial mode.

- [ ] **Step 7: Run GREEN**

Run:

```bash
npm test -- src/domains/lessons/as-sombras/shadow-model.test.ts src/domains/lessons/as-sombras/shadow-laboratory.test.tsx
npm test
npm run lint
```

Expected: all PASS.

- [ ] **Step 8: Commit**

```bash
git add src/domains/lessons
git commit -m "feat: add accessible Shadow Laboratory"
```

### Task 8: Implement argument, revision, transfer, and completion

**Files:**
- Create first: `src/domains/lessons/interactions/cer-response.test.tsx`
- Create first: `src/domains/lessons/interactions/revision-map.test.tsx`
- Create first: `src/domains/lessons/interactions/transfer-classification.test.tsx`
- Create first: `src/domains/lessons/as-sombras/closing-scenes.test.tsx`
- Create: `src/domains/lessons/interactions/cer-response.tsx`
- Create: `src/domains/lessons/interactions/confidence-control.tsx`
- Create: `src/domains/lessons/interactions/revision-map.tsx`
- Create: `src/domains/lessons/interactions/transfer-classification.tsx`
- Create: `src/domains/lessons/as-sombras/defend-model-scene.tsx`
- Create: `src/domains/lessons/as-sombras/revision-scene.tsx`
- Create: `src/domains/lessons/as-sombras/transfer-scene.tsx`
- Modify: `src/domains/lessons/as-sombras/as-sombras-player.tsx`
- Modify: `src/domains/lessons/as-sombras/as-sombras.module.css`

**Interfaces:**
- Produces: reusable CER, confidence, revision, and classification controls.
- Emits: `claim_built`, `evidence_linked`, `rival_acknowledged`, `confidence_recorded`, `hypothesis_revisited`, `revision_recorded`, `transfer_classified`, and `complete_session`.

- [ ] **Step 1: Write interaction behavior tests**

`CerResponse`:

- requires one claim, inspected clue, reasoning bridge, fair acknowledgment, and confidence;
- allows `Ainda não há evidência suficiente`;
- requires that uncertainty name evidence to seek;
- reads the assembled response as one coherent sentence through an `aria-live` region;
- offers explicit move controls rather than drag-only ordering.

`RevisionMap`:

- restores exact initial hypothesis;
- accepts maintain, revise, or uncertain;
- requires one decisive clue;
- keeps optional text private;
- shows before/after without implying revision is always superior.

`TransferClassification`:

- records confidence before wider context;
- does not expose the full context before the reveal action;
- requires classification of representation, source event, claim, and evidence sufficiency;
- requires one next evidence source.

- [ ] **Step 2: Write integrated closing-scene tests**

Assert:

- the Pattern-Keeper's argument is shown verbatim;
- response feedback asks for a missing bridge when clue and claim are disconnected;
- revision restores a saved prologue hypothesis;
- no saved hypothesis produces a neutral `Você ainda pode registrar sua leitura de agora` path;
- wider council context includes visible disagreement;
- final copy is `Você ainda não saiu da caverna. Mas a parede já não explica tudo.`;
- completion requires all core evidence but never perfect first-attempt results.

- [ ] **Step 3: Run and verify RED**

Run:

```bash
npm test -- src/domains/lessons/interactions/cer-response.test.tsx src/domains/lessons/interactions/revision-map.test.tsx src/domains/lessons/interactions/transfer-classification.test.tsx src/domains/lessons/as-sombras/closing-scenes.test.tsx
```

Expected: FAIL because the interactions and scenes do not exist.

- [ ] **Step 4: Implement Scene 6**

Display the Pattern-Keeper's full argument:

> A parede é a única evidência que todos podem conferir. Ela sempre nos ajudou a prever. Um som estranho não prova um mundo invisível.

Feedback examples:

> Sua pista descreve o som, mas sua conclusão é sobre a forma. Que relação liga os dois?

> O que o modelo antigo ainda explica bem?

Plato appears only during review.

- [ ] **Step 5: Implement Scene 7**

Restore the private hypothesis and provide:

- `Manter`;
- `Revisar`;
- `Ainda não sei`.

Plato's strategy responses are:

- revise: `Você mudou o modelo porque uma pista exigiu isso.`;
- maintain: `Manter uma ideia depois de testá-la não é o mesmo que ignorar evidência.`;
- uncertain: `Uma dúvida precisa pode indicar o próximo teste.`;

- [ ] **Step 6: Implement Scene 8**

Create a deterministic fictional school-council composition in HTML/CSS:

- initial crop shows the speaking group and caption `Todos apoiaram a nova regra`;
- wider view reveals two disagreeing participants and a raised objection card;
- the caption remains visible as a claim;
- no generated image is trusted to render evidence-critical details.

Required classification:

- cropped image → representation;
- meeting → source event;
- caption → claim;
- current evidence → insufficient for `todos`.

Next evidence options:

- minutes;
- full recording;
- accounts from participants.

Plato asks:

> A imagem é falsa — ou a conclusão foi além dela?

- [ ] **Step 7: Run GREEN**

Run:

```bash
npm test -- src/domains/lessons/interactions/cer-response.test.tsx src/domains/lessons/interactions/revision-map.test.tsx src/domains/lessons/interactions/transfer-classification.test.tsx src/domains/lessons/as-sombras/closing-scenes.test.tsx
npm test
npm run lint
npm run build
```

Expected: all PASS.

- [ ] **Step 8: Commit**

```bash
git add src/domains/lessons
git commit -m "feat: complete As Sombras reasoning arc"
```

### Task 9: Verify the complete lesson visually and behaviorally

**Files:**
- Modify only when a verified defect requires it.

**Interfaces:**
- Consumes: the complete Session 1.
- Produces: evidence that the session works across required devices and access paths.

- [ ] **Step 1: Run the full automated gate**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all PASS with no skipped Philoo-specific test.

- [ ] **Step 2: Start the production-like local server**

Run:

```bash
npm run dev
```

Open `/aula/as-sombras`.

- [ ] **Step 3: Complete the happy path at 1366 × 768**

Verify:

- prologue appearance is preserved;
- hypothesis returns in Scene 7;
- the Start action enters `Só a parede`;
- path says `1 de 8`;
- no page-level scroll is required;
- all eight scenes can complete;
- state survives refresh;
- final completion returns to `/inicio`.

- [ ] **Step 4: Verify required viewport fixtures**

Check:

```text
360 × 800
768 × 1024
1366 × 768
1920 × 1080
```

At each size verify:

- environment remains primary;
- action tray is reachable;
- no horizontal overflow;
- Plato never covers required evidence;
- generated image crops preserve useful negative space;
- player actions do not jump when copy changes.

- [ ] **Step 5: Verify access paths**

Complete with keyboard only:

- prologue slider alternatives;
- every choice;
- ordering and placement;
- evidence lenses;
- Back and Continue;
- completion.

Then verify:

- focus moves to each new scene heading;
- live feedback is announced once;
- reduced motion replaces causal animation with named before/after state;
- every sound clue has visible timing and text;
- every drag affordance has buttons;
- no status depends on color.

- [ ] **Step 6: Verify recovery**

Manually place invalid JSON under the attempt storage key and refresh. Expected:

- the route opens a clean attempt;
- no raw exception is visible;
- the prologue remains usable.

Simulate a store write error in the test adapter. Expected:

- current scene remains visible;
- `Não foi possível guardar esta etapa` appears;
- `Tentar de novo` retries without duplicating responses.

- [ ] **Step 7: Inspect asset and route budgets**

Run:

```bash
du -h public/images/cave/cave-player-stage.webp public/images/cave/cave-wall-stage.webp
npm run build
```

Expected:

- each new asset remains below 1.5 MB;
- no new heavy graphics or drag-and-drop dependency appears;
- `/aula/as-sombras` builds successfully.

- [ ] **Step 8: Commit verified fixes**

If verification required changes:

```bash
git add src public
git commit -m "fix: polish As Sombras across devices"
```

If no changes were required, do not create an empty commit.

