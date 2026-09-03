# Tales de Mileto — Arte (prompts únicos)

> **Histórico (2026-09-02):** gerado via MCP nano-banana. **Novas lições** usam
> somente Cursor `GenerateImage` — ver `docs/reference/CHARACTERS_AND_ASSETS.md`.

**Status:** gerar direto. Um prompt por arquivo. Sem variações.

**Filósofo novo:** Tales **não** é Platão. `public/images/reference/plato-reference-01.jpeg` trava **estilo e proporção** chibi 3D Pixar (cabeça grande, corpo pequeno, olhos expressivos), **não** o rosto. Outro homem: pele azeitona quente, cabelo escuro revoltado pelo vento do mar, barba cheia porém mais curta que a do Platão Philoo, quíton ocre claro, manto ferrugem (marrom-alaranjado de vela) preso de um ombro só, sandálias simples. Sem púrpura, sem louros, sem auréola, sem telescópio, sem tubo de ensaio. Se parecer Platão com túnica trocada, falhou.

**Fluxo de poses:** a primeira pose isolada (`thales-identity-anchor-v1.png`) é a **âncora de identidade** sobre chroma `#00FF00`. Toda pose seguinte edita **a partir dela**, nunca do rosto do Platão de novo. Depois de gerada, rodar `node scripts/chroma-key-green.mjs`.

**Cenas 16:9:** sem chroma, **sem** Tales colado no quadro. Ele fica na camada UI, como Platão na Caverna.

**Paleta:** azul bebê #33BFED, #5BB8F5, fundo creme #FBF8F3 — nunca roxo ou dourado.

**Âncoras de arquivo:**
- Estilo mundo Philoo: `public/images/reference/plato-reference-01.jpeg`
- Identidade Tales (após gerada): `public/images/story/tales/thales-identity-anchor-v1.png`
- Luz Mediterrâneo de dia (referência de clima, se existir): `public/images/story/a-subida/beat-08-o-sol-v1.png`

Destino: `public/images/story/tales/`

Modelo: `gemini-3.1-flash-image`. Ferramenta: `edit_image`. Sem texto na imagem.

---

## Cena 1 — Beat 2.1 · porto de Mileto

**Arquivo:** `beat-02-porto-mileto-v1.png`  
**Formato:** 16:9  
**Por quê:** o aluno **vê** o cais enquanto Tales fala de onde veio; variedade visível (barcos, ânforas, gente), sem o guia dentro do mar.

**imagePath:** `public/images/reference/plato-reference-01.jpeg`  
**referenceImages:** `plato-reference-01.jpeg`, `a-subida/beat-08-o-sol-v1.png` (se existir)

**Prompt:** Wide 16:9 environmental illustration in the Philoo chibi 3D Pixar world, cream sky #FBF8F3 and baby-blue Mediterranean light #33BFED and #5BB8F5. Ancient Ionian harbor of Miletus in the imagined sixth century BCE: wooden docks, moored boats with simple sails, stacked amphorae, small figures carrying cargo, whitewashed houses climbing a gentle hill, open sea on the horizon. Busy but readable, water everywhere — harbor, canal, wet stone. Warm daytime sun, not ruins with museum plaques, not a modern Turkish skyline. No philosopher character in the scene, no purple or gold accents, no text, labels, captions, or diagrams.

**Delegação MCP:** edit_image · 16:9 · 2K

---

## Cena 2 — Beat 3.3 · terra sobre água

**Arquivo:** `beat-03-terra-sobre-agua-v1.png`  
**Formato:** 16:9  
**Por quê:** ideia visível da tese — o chão firme também não é o último fundo; terra ou madeira sobre um grande corpo de água, sem laboratório.

**imagePath:** `public/images/story/tales/beat-02-porto-mileto-v1.png` (se já existir; senão `plato-reference-01.jpeg`)  
**referenceImages:** `plato-reference-01.jpeg`, `beat-02-porto-mileto-v1.png`

**Prompt:** Same Philoo chibi 3D Pixar style and Mediterranean palette. Wide 16:9 conceptual scene, not a chemistry lab: a clear island of earth or a wooden raft-like mass floating on a vast calm body of water, natural daylight, gentle ripples around the edges showing the land is supported by water beneath. Simple, child-readable metaphor — solid ground that is not the deepest layer. No human figures, no philosopher, no formulas, no H₂O labels, no purple or gold, no text.

**Delegação MCP:** edit_image · 16:9 · 2K

---

## Cena 3 — Beat 4.3 · mesa de almoço agora

**Arquivo:** `beat-04-mesa-almoco-v1.png`  
**Formato:** 16:9  
**Por quê:** paralelo de **agora** — muitas caras na mesa, mesma forma de pergunta; estrutura, não dever de casa.

**imagePath:** `public/images/reference/plato-reference-01.jpeg`  
**referenceImages:** `plato-reference-01.jpeg`, `beat-02-porto-mileto-v1.png`

**Prompt:** Same Philoo chibi 3D Pixar world, cream and baby-blue palette. Wide 16:9 contemporary lunch table seen from a friendly three-quarter angle: bread on a board, fruit in a bowl, a glass of juice, simple plates on a light table, warm indoor daylight from a window. Feels like a Brazilian school-age meal, cozy and ordinary, many different foods as many faces. No people, no philosopher, no periodic table, no food packaging labels, no purple or gold, no text or writing anywhere.

**Delegação MCP:** edit_image · 16:9 · 2K

---

## Pose 1 — Beat 1.1 · âncora de identidade

**Arquivo:** `thales-identity-anchor-v1.png`  
**Formato:** 2:3  
**Por quê:** primeira pose = âncora de identidade; Tales se apresenta de frente, mãos abertas vazias, convite.

**imagePath:** `public/images/reference/plato-reference-01.jpeg`  
**referenceImages:** `plato-reference-01.jpeg`

**Prompt:** Use the reference only for chibi 3D Pixar body proportion, render softness, and Philoo world style — this must be a **different man**, not Plato's face. Create Thales of Miletus: mature Mediterranean olive skin, warm brown eyes, marked nose, light horizon-watcher wrinkles, dark thick hair a little wind-tousled and shorter on the sides than a statue mane, a full but **shorter** beard than Plato's long philosopher beard. Ochre-linen chiton to the knee, rust-colored travel mantle pinned on one shoulder only, simple sandals. He stands facing the viewer, both empty hands open at chest height in a welcoming gesture, direct gentle eye contact, mouth slightly open as if saying hello. Solid chromakey green background #00FF00 edge to edge, full figure. No purple robe, no laurel wreath, no crown, no props, no text, no transparency checkerboard.

**Delegação MCP:** edit_image · 2:3 · 2K · chroma `#00FF00` · `node scripts/chroma-key-green.mjs`

---

## Pose 2 — Beat 1.2 · aponta para a cidade

**Arquivo:** `thales-point-harbor-v1.png`  
**Formato:** 2:3  
**Por quê:** corpo virado, olhar para o lado de onde virá o porto, uma mão indica “lá”, como quem lembra o mar.

**imagePath:** `public/images/story/tales/thales-identity-anchor-v1.png`  
**referenceImages:** `thales-identity-anchor-v1.png`

**Prompt:** Keep this exact Thales identity — same face, hair, beard, ochre chiton, rust mantle, sandals, chibi proportions. Solid chromakey green background #00FF00. Turn his torso and gaze toward the viewer's right, one open hand extended to the right as if indicating a distant harbor and sea he came from, the other hand relaxed near his body, expression remembering home with quiet pride. Full figure, empty space on the right for UI. No text, no amphora prop required, no checkerboard.

**Delegação MCP:** edit_image · 2:3 · 2K · chroma `#00FF00` · `node scripts/chroma-key-green.mjs`

---

## Pose 3 — Beats 2.1, 3.3, 4.3 · apresenta o quadro

**Arquivo:** `thales-present-panel-v1.png`  
**Formato:** 2:3  
**Por quê:** guia à esquerda (`guideSide="start"`), corpo aberto para a direita, mão que **apresenta** o story-panel — porto, terra sobre água ou mesa.

**imagePath:** `public/images/story/tales/thales-identity-anchor-v1.png`  
**referenceImages:** `thales-identity-anchor-v1.png`

**Prompt:** Keep this exact Thales identity and clothes. Solid chromakey green background #00FF00. He stands on the left of the frame, body and face turned toward the viewer's right, one open hand extended palm-up as if presenting a wide picture beside him, the other hand lightly open near his chest, calm teaching energy — showing the scene, not pointing blame. Leave generous empty space on the right for the 16:9 panel. Full figure. No text, no checkerboard.

**Delegação MCP:** edit_image · 2:3 · 2K · chroma `#00FF00` · `node scripts/chroma-key-green.mjs`

---

## Pose 4 — Beats 2.2, 3.4, 4.2 · mãos abertas, variedade

**Arquivo:** `thales-open-hands-variety-v1.png`  
**Formato:** 2:3  
**Por quê:** duas palmas para cima mostrando muitas coisas diferentes; também serve para o “talvez” honesto e para juntar variedade num fundo.

**imagePath:** `public/images/story/tales/thales-identity-anchor-v1.png`  
**referenceImages:** `thales-identity-anchor-v1.png`

**Prompt:** Keep this exact Thales identity. Solid chromakey green background #00FF00. He faces the viewer with both open palms turned upward at waist height, as if holding up many different things at once — wave, wine, sap, rain — an gesture of visible variety without literal objects in his hands. Attentive face, not clowning, shoulders relaxed. Full figure. No text, no checkerboard.

**Delegação MCP:** edit_image · 2:3 · 2K · chroma `#00FF00` · `node scripts/chroma-key-green.mjs`

---

## Pose 5 — Beat 3.1 · pergunta no ar

**Arquivo:** `thales-hold-question-v1.png`  
**Formato:** 2:3  
**Por quê:** uma mão à frente como quem segura uma pergunta no ar; rosto atento, seriedade da arché antes da piada sobre água.

**imagePath:** `public/images/story/tales/thales-identity-anchor-v1.png`  
**referenceImages:** `thales-identity-anchor-v1.png`

**Prompt:** Keep this exact Thales identity. Solid chromakey green background #00FF00. He faces the viewer, one hand lifted in front of his chest with open fingers curved gently as if cradling an invisible question in the air, the other hand resting near his side, eyes focused and serious, mouth closed in thought. Grave but inviting, not lecturing. Full figure. No text, no checkerboard.

**Delegação MCP:** edit_image · 2:3 · 2K · chroma `#00FF00` · `node scripts/chroma-key-green.mjs`

---

## Pose 6 — Beat 3.2 · resposta: a água

**Arquivo:** `thales-water-answer-v1.png`  
**Formato:** 2:3  
**Por quê:** uma mão em copo vazio (gesto de úmido/origem), a outra aberta para o aluno; tese firme sem virar “copo cheio”.

**imagePath:** `public/images/story/tales/thales-identity-anchor-v1.png`  
**referenceImages:** `thales-identity-anchor-v1.png`

**Prompt:** Keep this exact Thales identity. Solid chromakey green background #00FF00. He faces the viewer, one cupped hand at mid-chest as if holding invisible water — origin, not a full glass — the other hand open toward the student, steady gaze, firm calm expression explaining a deep answer. No literal amphora, no laboratory flask. Full figure. No text, no checkerboard.

**Delegação MCP:** edit_image · 2:3 · 2K · chroma `#00FF00` · `node scripts/chroma-key-green.mjs`

---

## Pose 7 — Beat 4.1 · apresenta a palavra

**Arquivo:** `thales-present-word-v1.png`  
**Formato:** 2:3  
**Por quê:** mão que apresenta *arché* no ar, altura do peito; named-concept momento 1, sem louros.

**imagePath:** `public/images/story/tales/thales-identity-anchor-v1.png`  
**referenceImages:** `thales-identity-anchor-v1.png`

**Prompt:** Keep this exact Thales identity. Solid chromakey green background #00FF00. He faces the viewer, one open hand raised to chest height palm-up as if offering a named concept into the air, the other hand lightly closed near his body, eyes on the student, mouth slightly open as if saying “arché”. Dignified naming, not a dictionary card. No floating letters, no laurel, no text rendered in the image. Full figure. No checkerboard.

**Delegação MCP:** edit_image · 2:3 · 2K · chroma `#00FF00` · `node scripts/chroma-key-green.mjs`

---

## Pose 8 — Beat 6.2 · gancho, olhar baixo

**Arquivo:** `thales-hook-open-v1.png`  
**Formato:** 2:3  
**Por quê:** olhar um pouco baixo, uma mão ainda aberta, como quem não fecha a conta — dúvida honesta sobre um fundo e muitos.

**imagePath:** `public/images/story/tales/thales-identity-anchor-v1.png`  
**referenceImages:** `thales-identity-anchor-v1.png`

**Prompt:** Keep this exact Thales identity. Solid chromakey green background #00FF00. He faces the viewer but his eyes look slightly downward in honest uncertainty, one open hand still extended loosely toward the student as if leaving the question open, the other hand relaxed at his side, expression thoughtful not defeated. Quiet cliffhanger energy, no triumph, no sadness theater. Full figure. No text, no checkerboard.

**Delegação MCP:** edit_image · 2:3 · 2K · chroma `#00FF00` · `node scripts/chroma-key-green.mjs`

---

## Character library — `whenToUse` (implementer)

Registrar em `src/domains/character-library/` como `tales`, `identityAnchorSrc: thales-identity-anchor-v1.png`, `chromaKey: "#00FF00"`.

| poseId | src | whenToUse |
|--------|-----|-----------|
| `identity-anchor` | `thales-identity-anchor-v1.png` | Apresentação inicial (beat 1.1): “Olá, eu sou Tales.” |
| `point-harbor` | `thales-point-harbor-v1.png` | Lembra Mileto antes do quadro (beat 1.2). |
| `present-panel` | `thales-present-panel-v1.png` | Story-panel à direita: porto (2.1), terra sobre água (3.3), mesa agora (4.3). |
| `open-hands-variety` | `thales-open-hands-variety-v1.png` | Muitas caras no cais (2.2); “talvez” do porquê (3.4); variedade vs um princípio (4.2). |
| `hold-question` | `thales-hold-question-v1.png` | Pergunta pelo fundo comum (3.1); reutilizar em exercícios 5.1–6.1 quando só houver voz. |
| `water-answer` | `thales-water-answer-v1.png` | Tese da água como origem (3.2); reutilizar no briefing EX-06 (5.2). |
| `present-word` | `thales-present-word-v1.png` | Momento da palavra arché (4.1). |
| `hook-open` | `thales-hook-open-v1.png` | Gancho final: um fundo, muitos que nascem e morrem (6.2). |

**Beats sem PNG novo** (reutilizar poses acima): 3.4 → `open-hands-variety`; 4.2 → `open-hands-variety`; 5.1 → `hold-question` ou `present-word`; 5.2 → `water-answer`; 6.1 → `open-hands-variety`; 6.3 reward → `identity-anchor` ou omitir guia se competir com cartão.

**Ordem de geração:** (1) âncora identidade → (2) poses 2–8 a partir dela → (3) cena porto → (4) cenas 2–3 podem usar porto como clima.
