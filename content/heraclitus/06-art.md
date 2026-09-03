# Heráclito de Éfeso — Arte (prompts únicos)

**Motor:** Cursor `GenerateImage` (namespace `cursor`) — **não** MCP.  
**Referências:** `plato-reference-01.jpeg` (estilo); após âncora,
`heraclitus-identity-approved-v1.png`.  
**Poses:** chroma `#00FF00` → `node scripts/chroma-key-green.mjs`.  
**Cenas 16:9:** sem chroma, sem Heráclito no quadro.

---

## identity-anchor · personagem_isolado

**Arquivo:** `heraclitus-identity-anchor-v1.png`  
**Master:** `public/images/reference/heraclitus/heraclitus-identity-approved-v1.png`  
**Por quê:** apresentação beat 1.1; âncora para todas as poses.

Philoo chibi 3D Pixar. Heráclito maduro, pele mediterrânea, barba castanha cacheada, túnica escura, manto terracota com borda de chamas. Braços cruzados. Não Platão (sem púrpura, louros). Fundo `#00FF00`.

**Delegação GenerateImage:** `reference_image_paths`: plato-reference-01.jpeg · `aspect_ratio`: 3:4

---

## point-river · personagem_isolado

**Arquivo:** `heraclitus-point-river-v1.png`  
**Por quê:** aponta o rio (beats 1.2, 3.3, 4.2).

Mesma identidade. Aponta para rio fora de quadro. Fundo `#00FF00`.

**Delegação GenerateImage:** identity-approved + plato-reference · 3:4 · chroma

---

## present-panel · personagem_isolado

**Arquivo:** `heraclitus-present-panel-v1.png`  
**Por quê:** story-panels Éfeso, rio, paralelo.

Mão aberta apresentando painel à direita. Fundo `#00FF00`.

---

## open-hands-flow · personagem_isolado

**Arquivo:** `heraclitus-open-hands-flow-v1.png`  
**Por quê:** movimento escondido, fragmentos.

Palmas abertas mostrando fluxo. Fundo `#00FF00`.

---

## hold-paradox · personagem_isolado

**Arquivo:** `heraclitus-hold-paradox-v1.png`  
**Por quê:** paradoxo do rio; voz dos exercícios.

Pose contemplativa, paradoxo do “mesmo”. Fundo `#00FF00`.

---

## opposites-gesture · personagem_isolado

**Arquivo:** `heraclitus-opposites-gesture-v1.png`  
**Por quê:** dia/noite; dois modelos do rio.

Gestos de opostos em tensão harmoniosa. Fundo `#00FF00`.

---

## present-word · personagem_isolado

**Arquivo:** `heraclitus-present-word-v1.png`  
**Por quê:** momento panta rhei.

Apresenta palavra invisível no peito. Sem texto na imagem. Fundo `#00FF00`.

---

## hook-open · personagem_isolado

**Arquivo:** `heraclitus-hook-open-v1.png`  
**Por quê:** gancho “E o que fica?”.

Olhar baixo, mão aberta, conta em aberto. Fundo `#00FF00`.

---

## efesoPanorama · cena_completa 16:9

**Arquivo:** `beat-02-efeso-panorama-v1.png`  
**Por quê:** beat 2.1.

Éfeso jônia imaginada, pedra clara, templo ao longe, rio visível. Sem Heráclito. Sem texto.

**Delegação GenerateImage:** plato-reference + beat-02-porto-mileto-v1 (estilo) · 16:9

---

## rioFluxo · historia_contada 16:9

**Arquivo:** `beat-03-rio-fluxo-v1.png`  
**Por quê:** beat 3.2; opcional EX-06.

Rio mediterrâneo, figura entrando na água, correnteza clara. Sem Heráclito colado. Sem texto.

---

## paraleloFluxo · cena_completa 16:9

**Arquivo:** `beat-04-paralelo-fluxo-v1.png`  
**Por quê:** beat 4.3 named-concept.

Paralelo de agora: feed, estação, movimento sugerido. Sem Heráclito. Sem rótulos legíveis.
