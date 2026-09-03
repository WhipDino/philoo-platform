# O Retorno — Arte (prompts únicos)

**Status:** gerar direto. Um prompt por arquivo. Sem variações.

**Continuidade:** A Subida terminou **de dia** na boca da caverna (`beat-08-o-sol-v1`, `beat-07-arvore-de-dia-v2`, `beat-10-olhar-a-caverna-v1`). Fora continua dia. Dentro: fogo da parede. Descer = luz do dia **atrás**, escuridão **à frente**. O mesmo prisioneiro (túnica azul clara, pele morena, cabelo escuro curto, descalço). Platão nunca na ilustração ambiental.

**Âncoras de arquivo:**
- Identidade Platão: `public/images/reference/plato-reference-01.jpeg`
- Prisioneiro: `public/images/story/cave-first-turn-cliffhanger-v1.png`
- Boca de dia: `public/images/story/a-subida/beat-08-o-sol-v1.png`
- Olhar a entrada: `public/images/story/a-subida/beat-10-olhar-a-caverna-v1.png`
- Interior fogo: `public/images/story/a-subida/beat-02-fogo-e-estatuas-v1.png`
- Estilo Subida: `public/images/story/a-subida/beat-03-a-subida-dolorosa-v1.png`

Destino: `public/images/story/o-retorno/`

Modelo: `gemini-3.1-flash-image`. Ferramenta: `edit_image`. Sem texto na imagem.

---

## Cena 1 — Beat 1 · boca da caverna

**Arquivo:** `beat-01-boca-da-caverna-v1.png`  
**Formato:** 16:9  
**Por quê:** ele já olhou a entrada de fora; agora o corpo vira **para dentro**. Dia atrás, escuridão à frente. Hesitação, não heroísmo.

**imagePath:** `public/images/story/a-subida/beat-10-olhar-a-caverna-v1.png`  
**referenceImages:** `plato-reference-01.jpeg`, `cave-first-turn-cliffhanger-v1.png`, `beat-08-o-sol-v1.png`

**Prompt:** Keep the same Philoo chibi 3D Pixar world and the exact same young adult prisoner from the reference stills: brown skin, short dark hair, worn light-blue tunic, barefoot. Keep the cave mouth and the bright daytime landscape behind him, same time of day as the sunlit exit, never night, never a moon. Recompose so he has already turned: his back takes the daylight, his face looks into the dark tunnel ahead, body leaning a little inward, expression hesitant not heroic. Wide 16:9 cinematic illustration, no Plato in the scene, no text, labels, captions, or diagrams.

**Delegação MCP:** edit_image · 16:9 · 2K

---

## Cena 2 — Beat 3 · EX-10 lente A (olho readaptando)

**Arquivo:** `beat-03-lente-olho-readaptando-v1.png`  
**Formato:** 16:9  
**Por quê:** mesma pedra, mesma boca de luz diurna atrás; ele protege os olhos da **escuridão**, não do sol.

**imagePath:** `public/images/story/a-subida/beat-02-fogo-e-estatuas-v1.png`  
**referenceImages:** `plato-reference-01.jpeg`, `cave-first-turn-cliffhanger-v1.png`, `beat-01-boca-da-caverna-v1.png` (se já existir), `beat-08-o-sol-v1.png`

**Prompt:** Same prisoner identity as the trilogy references, Philoo chibi 3D Pixar. Wide 16:9 cave interior: a known stone on the path, warm fire glow far on the wall like the Cave lesson, a bright daytime rectangle of entrance light behind him (still day outside). He is halfway in. One hand is raised toward his face because the dark is hard after the sun, not because of glare from outside. The tunnel ahead looks muddy, dim, hard to read. Disoriented, not defeated. No Plato, no text.

**Delegação MCP:** edit_image · 16:9 · 2K

---

## Cena 3 — Beat 3 · EX-10 lente B (olho acostumado)

**Arquivo:** `beat-03-lente-olho-acostumado-v1.png`  
**Formato:** 16:9  
**Por quê:** **mesmo enquadramento** da lente A. Só a ótica muda: quem nunca saiu vê o chão.

**imagePath:** `public/images/story/o-retorno/beat-03-lente-olho-readaptando-v1.png` (gerar DEPOIS da lente A)  
**referenceImages:** `plato-reference-01.jpeg`, `cave-first-turn-cliffhanger-v1.png`

**Prompt:** Edit only the seeing, keep the identical composition, camera, prisoner body pose, tunic, stone, fire, and daytime entrance light behind. Now the same cave reads as a place a chained prisoner knows: the floor stone is clear, the path is readable, the fire-lit wall is familiar, not blinding dark. He still stands in the same spot; the world is simply visible. No new objects, no Plato, no text, no night sky.

**Delegação MCP:** edit_image · 16:9 · 2K · depende da lente A

---

## Cena 4 — Beat 4 · jogos de sombra

**Arquivo:** `beat-04-jogos-de-sombra-v2.png`  
**Formato:** 16:9  
**Por quê:** interior da parede, fogo, outros prisioneiros. Ele erra o ritmo. Riso desconfortável, não violência. Ainda **dentro**, não noite lá fora.

**imagePath:** `public/images/story/cave-first-turn-cliffhanger-v1.png`  
**referenceImages:** `plato-reference-01.jpeg`, `beat-02-fogo-e-estatuas-v1.png`

**Prompt:** Same Philoo style and the same freed prisoner in the worn light-blue tunic standing among the seated prisoners who still watch the wall. Fire behind the low wall throws sharp shadows. He raises a hand too slowly toward a shadow, missing the game. Two seated prisoners laugh without cruelty or weapons, a socially awkward moment. He remains standing, off-rhythm, not kneeling. Warm cave interior only, no daylight landscape, no night sky, no Plato, no text.

**Delegação MCP:** edit_image · 16:9 · 2K

---

## Cena 5 — Beat 6 · a descida

**Arquivo:** `beat-06-a-descida-v1.png`  
**Formato:** 16:9  
**Por quê:** ele segue. Corpo menor no quadro. Luz do dia da boca **atrás**. Não olha para trás.

**imagePath:** `public/images/story/a-subida/beat-03-a-subida-dolorosa-v1.png`  
**referenceImages:** `plato-reference-01.jpeg`, `cave-first-turn-cliffhanger-v1.png`, `beat-08-o-sol-v1.png`

**Prompt:** Reverse the painful ascent: the same prisoner walks deeper down a sloping cave path. He is small in a wide 16:9 frame. Behind him a shrinking bright daytime mouth of the cave, still sunlit day, never night. Ahead is darker tunnel. He does not look back. Determined and afraid at once. Same tunic and face. No Plato, no text.

**Delegação MCP:** edit_image · 16:9 · 2K

---

## Pose Platão 1 — Beat 1 · aponta para a escuridão

**Arquivo:** `plato-point-into-darkness-v1.png`  
**Formato:** 2:3  
**Por quê:** guia à esquerda, conteúdo (caverna) à direita.

**imagePath:** `public/images/reference/plato-reference-01.jpeg`

**Prompt:** Keep this exact Plato identity, clothes, beard, and chibi 3D Pixar proportions. Solid chromakey green background #00FF00 only, edge to edge. He stands facing the viewer’s right, open left hand extended toward the right as if showing a dark path downward into a cave, serious and gentle, not celebrating. Full figure, empty space on the right of the canvas for UI. No text, no props with writing, no transparency checkerboard.

**Delegação MCP:** edit_image · 2:3 · 2K · chroma `#00FF00` · `node scripts/chroma-key-green.mjs`

---

## Pose Platão 2 — Beat 3 · tateia no escuro

**Arquivo:** `plato-feeling-dark-v1.png`  
**Formato:** 2:3  
**imagePath:** `public/images/reference/plato-reference-01.jpeg`

**Prompt:** Keep this exact Plato. Solid chromakey green background #00FF00. He faces right. One hand is lifted near his eyes as if the dark is hard to see, the other hand reaches forward slowly as if feeling the air in a dim cave. Empathy, not fear-mongering. Same identity as the reference. No text, no checkerboard.

**Delegação MCP:** edit_image · 2:3 · 2K · chroma `#00FF00` · `node scripts/chroma-key-green.mjs`

---

## Pose Platão 3 — Beat 4 · mostra o jogo sem entrar

**Arquivo:** `plato-show-shadow-game-v1.png`  
**Formato:** 2:3  
**imagePath:** `public/images/reference/plato-reference-01.jpeg`

**Prompt:** Keep this exact Plato. Solid chromakey green background #00FF00. He turns his face a little toward the right, looking sideways as if at a wall of shadows, open hand presenting that wall without stepping into the game, calm teaching. No pointing finger of blame. No text.

**Delegação MCP:** edit_image · 2:3 · 2K · chroma `#00FF00` · `node scripts/chroma-key-green.mjs`

---

## Pose Platão 4 — Beat 5 / EX-11 · convite à pilha

**Arquivo:** `plato-invite-stack-v1.png`  
**Formato:** 2:3  
**Por quê:** ao lado das camadas, mão aberta para o tabuleiro à direita, “faça isso”.

**imagePath:** `public/images/reference/plato-reference-01.jpeg`

**Prompt:** Keep this exact Plato identity from the reference. Solid chromakey green background #00FF00. He stands on the left of the frame facing the viewer’s right, torso slightly tilted forward, both hands open and inviting toward the right as if showing stacked cards the student should order, a clear “do this here” gesture, grave and kind, not scolding, not a seated teaching-pointer recycle. Full figure. No text, no diagrams in his hands.

**Delegação MCP:** edit_image · 2:3 · 2K · chroma `#00FF00` · `node scripts/chroma-key-green.mjs`

---

## Pose Platão 5 — Beat 6 · aponta para baixo

**Arquivo:** `plato-point-descent-v1.png`  
**Formato:** 2:3  
**imagePath:** `public/images/reference/plato-reference-01.jpeg`

**Prompt:** Keep this exact Plato. Solid chromakey green background #00FF00. He faces right and slightly down, one open hand indicating a downward path, as if the cave is below, solemn, not triumphant. No text.

**Delegação MCP:** edit_image · 2:3 · 2K · chroma `#00FF00` · `node scripts/chroma-key-green.mjs`

---

## Briefing EX-10 (Como jogar)

**Arquivo:** `plato-briefing-lenses-v1.png`  
**Formato:** 2:3  
**imagePath:** `public/images/reference/plato-reference-01.jpeg`

**Prompt:** Keep this exact Plato. Solid chromakey green background #00FF00. He faces right and holds an imaginary frame with both hands as if showing two ways of looking at the same picture, curious and calm. No text on the image.

**Delegação MCP:** edit_image · 2:3 · 2K · chroma `#00FF00` · `node scripts/chroma-key-green.mjs`

---

## Pose Platão — mão no queixo

**Arquivo:** `plato-thoughtful-chin-v1.png`  
**Formato:** 2:3  
**Por quê:** alternar fala pensativa entre Continuar, sem reciclar a mesma pose três vezes.

**imagePath:** `public/images/reference/plato-reference-01.jpeg`

**Prompt:** Keep this exact Plato identity. Full body. One hand on his chin as a teacher thinking while he explains, the other hand relaxed, mouth closed, eyes a little up-right. Solid chromakey green background #00FF00 edge to edge. No cream, no floor, no text.

**Delegação MCP:** edit_image · 2:3 · 2K · chroma `#00FF00` · `node scripts/chroma-key-green.mjs`

---

## Pose Platão — fala gesticulando

**Arquivo:** `plato-speaking-gesture-v1.png`  
**Formato:** 2:3  
**Por quê:** dar a impressão de que ele está explicando o que diz.

**imagePath:** `public/images/reference/plato-reference-01.jpeg`

**Prompt:** Keep this exact Plato identity. Full body. Mouth slightly open as if speaking, one open hand raised toward the viewer’s right, the other near the chest. Solid chromakey green background #00FF00 edge to edge. No cream, no floor, no text.

**Delegação MCP:** edit_image · 2:3 · 2K · chroma `#00FF00` · `node scripts/chroma-key-green.mjs`
