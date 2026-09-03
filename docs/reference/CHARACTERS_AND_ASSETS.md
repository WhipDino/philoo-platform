# Reference — Characters and Assets

## Principle

Characters are part of the learning direction, not decoration. Their gaze,
gesture, crop, lighting, grounding, and scale must guide attention without
covering the work.

Keep identity across a journey: the same body, clothes, and age unless the
story itself changes them. Method: `docs/reference/STORY_THREAD.md`.
Plato stays out of environmental story art.

## Before creating an image

Record:

1. target component/scene;
2. character semantic ID;
3. canonical identity reference;
4. pose role;
5. gaze/facing direction;
6. gesture target;
7. transparent or environmental background;
8. safe area;
9. preferred source aspect ratio;
10. responsive rendered dimensions;
11. alt text;
12. provenance/license.

If the target engine exposes a character brief, that code is authoritative.

## Asset types

### Transparent character

Use for reusable guide poses. The component owns placement and environmental
relationship. Do not bake text, buttons, or lesson cards into the asset.

### Integrated environmental scene

Use when the character must share lighting, ground, perspective, and atmosphere
with the environment. The active Cave portal hero is an integrated scene and
must not be rebuilt as an obvious pasted overlay.

An environmental story scene contains only characters who exist in that
story moment. In the Cave trilogy, the prisoner is the protagonist and Plato
is the narrator. Therefore, prisoner scenes must not include Plato. When Plato
comments on the story, render a separate transparent narrator pose beside the
content through the semantic pose catalog. Never combine the stylized Plato
guide and a differently proportioned prisoner inside one generated scene.

### Lesson media

Use for evidence, artworks, diagrams, or contextual imagery. Record crop/focal
point and responsive behavior in the lesson configuration or media contract.

## Semantic access

Prefer:

```ts
getCharacter("plato")
getCharacterPose("plato", "invitation")
getGuidedClassificationGuide("plato")
```

over:

```ts
{ src: "/images/some-file.png", width: 210 }
```

The semantic registry preserves identity and lets assets change without
rewriting lessons.

## New philosopher (Tales onward)

### Validated pack (app antigo)

Source of truth for **faces, clothes, and youthfulness** of the
pre-Socratics already designed:

- GitHub: `https://github.com/WhipDino/philoo_app` → `assets/images/`
- Local clone (this machine): `Projects/Philoo/philoo_app/assets/images/`

Each philosopher has a folder (`Tales de Mileto`, `Heraclito`, `Parmenides`,
`Demócrito`, `Platao`, …) with `*_apresentacao`, numbered poses, cover, and
often a city `bg_*`. Root-level `.webp` copies also exist; prefer the
per-philosopher PNG folders.

**What the pack locks (not optional style):**

- true chibi: head roughly ⅓ of height, stocky short body, toy softness;
- large glassy eyes with bright highlights; rounded nose; soft cheeks;
- chunky stylized curls (clay/vinyl), not strand-by-strand adult hair;
- youthful feel even with a beard (not “tio maduro / salt-and-pepper”);
- cream/off-white chiton as the family default; identity via hair color,
  beard shape, mantle, and **signature trim** (Tales: blue Greek-wave
  border on cream tunic — not a rust traveler cloak as the main look);
- isolated poses on plain white (app) → platform converts to chroma
  `#00FF00` / RGBA for Folio;

### Image generation (platform, 2026-09 onward)

**Use only the native Cursor tool `GenerateImage`** (namespace `cursor`).
Do **not** use MCP `user-nano-banana`, Google Gemini, `edit_image`, or
`generate_image` from external MCP servers.

Workflow for **isolated character poses**:

1. `GenerateImage` with `reference_image_paths`: approved identity anchor
   (or `plato-reference-01.jpeg` for the **first** anchor only) + style lock.
2. Solid chroma key background **`#00FF00`** in the prompt (never ask the
   model for transparency).
3. `node scripts/chroma-key-green.mjs <file>` → PNG RGBA in
   `public/images/story/<lesson>/`.
4. Register pose in `src/domains/character-library/index.ts`.

Workflow for **16:9 environmental scenes** (`cena_completa`): `GenerateImage`
with `aspect_ratio: "16:9"`, no green screen, no philosopher pasted into the
scene. Reference prior accepted Philoo scene art for world style.

Older lessons may document historical MCP generation; **new work** follows
this rule only.
- city BGs are bright, clean, golden-hour Mediterranean miniatures — not
  gritty ruins.

`public/images/reference/plato-reference-01.jpeg` remains the **world
render** lock for new generations when the app pack has no file yet. For
any philosopher who already exists in `philoo_app`, put that pack’s
`*_apresentacao` (and pose siblings) in `referenceImages` / `imagePath`
ahead of inventing a new face. The first platform PNG for that guide
should be an edit of the validated identity, not a free regen from Plato.

A new philosopher must be recognizable in one glance. Same family of
drawing, different person:

- different face shape, eyes, hair, beard (or none), age feel, and clothes
  from the dossier **and** from the app pack when it exists — not Plato’s
  purple mantle with a palette swap;
- same height-in-heads, softness, and camera as the pack / Plato lock;
- first isolated PNG is the identity anchor; later poses edit **that**
  file, never Plato’s face again;
- the prompt must say, in words, that this is not Plato and must not share
  his face;
- if the result looks like Plato in another tunic, or like an older
  “realistic” man instead of the pack’s chibi, mark `dúvida` and
  regenerate.

Story figures (Achilles, a tortoise) follow the same world style and stay
out of the philosopher’s identity catalog. Zenão’s pack already has
`aquiles1` / `aquiles2` for `historia_contada`.

In the Cave trilogy the prisoner who looks back in As Sombras is the same
person in A Subida and O Retorno. Canonical identity:
`public/images/story/cave-first-turn-cliffhanger-v1.png` (middle prisoner at
the wall). Plato stays out of environmental scenes. More chapter rules:
`docs/reference/FOLIO_CHAPTER_PATTERNS.md`.

## Approval checklist

- identity matches the canonical reference;
- one coherent visual style across the entire image;
- hands, face, anatomy, props, and clothing are credible;
- gesture leads toward the intended content;
- no accidental AI artifacts, text, watermarks, or duplicated forms;
- transparent edges are clean when applicable;
- source resolution survives the largest rendered size;
- crop works at all required viewports;
- alt text describes function, not irrelevant appearance;
- file is committed under `public/images/` with a semantic name.

For Plato-specific identity guidance, also read
`docs/product/plato-character-generation-standard.md`.
