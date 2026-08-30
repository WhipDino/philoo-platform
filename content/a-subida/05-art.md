# A Subida — Direção de arte e prompts de imagem

**Agente:** art-director  
**Base:** `02-story.md` (beats 1–8), `04-exercises.md`  
**Lição:** A Subida (capítulo 2 de 3 — A Caverna de Platão)  
**Status geral:** variações escolhidas — **delegado ao image-generator** (`06-images.md`)

## Escolhas finais (delegadas pelo humano via agente)

| Beat | Escolha | Motivo (missão Philoo) |
|------|---------|------------------------|
| 1 | **C** | Descoberta cautelosa; virada, não triunfo |
| 2 | **B** | Ângulo lateral legível: fogo → objetos → sombras |
| 3 | **B** | Subida penosa vista de trás; contraste caverna/luz |
| 4 | **C** | Platão sereno, duas mãos; acolhe o desconforto |
| 5 | **B** | Sombra no chão em destaque; não antecipa exercício |
| 6 | **B** | Reflexo em primeiro plano; caminho causal visível |
| 7 | **A** | Objetos + céu; prisioneiro pequeno no horizonte |
| 8 | **C** | Sol no horizonte; compreensão sem epifania triunfalista |

---

## Regras compartilhadas (todas as imagens)

**Referência de identidade e mundo:** `public/images/reference/plato-reference-01.jpeg`

**Prisioneiro (beats 1–3, 5–8):** jovem adulto, pele morena, cabelo escuro curto, túnica azul clara desgastada, descalço, corpo ainda curvado pelo tempo acorrentado mas em movimento de reorientação. Mesmas proporções chibi 3D Pixar da referência Philoo — cabeça grande, corpo pequeno, olhos expressivos — personagem distinto mas claramente do mesmo mundo.

**Paleta:** azul bebê `#33BFED`, `#5BB8F5`, fundo creme `#FBF8F3`. Sem roxo nem dourado nas cenas ambientais.

**Estilo:** ilustração 3D chibi estilo Pixar, materiais quentes e cinematográficos, adequada a 13–16 anos.

**Proibições:** sem Platão nas cenas ambientais; sem texto, legendas, números, rótulos, diagramas ou anotações de qualquer tipo na imagem.

**Formato `cena_completa`:** composição larga 16:9 (1672 × 941 px), personagem e ambiente visíveis juntos, ação central com espaço negativo útil para mobile — alinhado a `a-subida-assets.ts`.

**Âncora de estilo para cenas:** capítulo anterior — preferência `public/images/story/cave-first-turn-cliffhanger-v1.png` ou `public/images/story/cave-behind-wall-layers-v1.webp` (As Sombras). A partir do beat 2 desta lição, incluir também `public/images/story/a-subida/beat-01-depois-da-virada-v1.png` quando disponível.

**Coordenação com exercise-designer:** nenhum beat desta lição exige zona clicável sobre forma específica da imagem gerada. Exercícios usam motores de UI (classificação, predição, caminho causal, revisão de modelo) — sem SVG sobre pixels.

**Beat 9:** sem imagem (`necessidade_de_imagem: nenhuma`).

---

## Beat 1 — Depois da virada

**Tipo:** `cena_completa`  
**Arquivo de saída:** `beat-01-depois-da-virada-v1.png`  
**Status:** aguardando escolha humana

### Variação A

Ilustração 3D chibi estilo Pixar em composição larga 16:9, paleta azul bebê `#33BFED` e `#5BB8F5` com pedra da caverna em tons creme `#FBF8F3`. No chão rochoso da caverna, um jovem prisioneiro de pele morena, cabelo escuro curto, túnica azul clara desgastada e pés descalços ajoelha-se com o tronco virado para trás e para o lado, como quem acaba de se reorientar; os olhos estão firmemente fechados diante da luz ofuscante que vem de trás da parede, e o rosto contrai-se numa careta de dor e estranheza, não de triunfo. Atrás dele, o brilho quente de um fogo alto banha a pedra irregular ao redor, pintando o ambiente com claridade repentina enquanto o restante da caverna permanece em penumbra acolhedora. O prisioneiro tem as mesmas proporções chibi 3D Pixar da referência Philoo — cabeça grande, corpo pequeno, olhos expressivos — personagem distinto mas claramente do mesmo mundo. Enquadramento médio-largo com o personagem ligeiramente deslocado à esquerda e a parede iluminada ocupando o terço direito. Sem Platão, sem texto, sem legendas, sem rótulos, sem diagramas.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/cave-first-turn-cliffhanger-v1.png`; `imagePath`: `public/images/story/cave-first-turn-cliffhanger-v1.png`.

### Variação B

Cena narrativa 3D chibi Pixar em 16:9, tons azul bebê e creme quente. O jovem prisioneiro — pele morena, cabelo escuro curto, túnica azul clara surrada, descalço, proporções chibi da referência Philoo — permanece de joelhos no chão áspero da caverna, mas inclina o tronco mais acentuadamente para trás, uma mão apoiada no chão para não perder o equilíbrio enquanto a outra sobe instintivamente em direção ao rosto; os olhos semicerrados ainda não suportam o clarão. Por trás da parede baixa, a luz alaranjada do fogo irradia sobre rochas e sombras, transformando pedra familiar em superfície estranha e dolorosa de olhar. Plano mais fechado no personagem, com rosto e gesto de proteção ocupando metade do quadro e o fogo sugerido como halo quente no fundo. Sem Platão, sem qualquer texto ou anotação visual.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/cave-first-turn-cliffhanger-v1.png`; `imagePath`: `public/images/story/cave-first-turn-cliffhanger-v1.png`.

### Variação C

Composição cinematográfica 16:9 em render 3D chibi Pixar, paleta `#33BFED`, `#5BB8F5`, `#FBF8F3`. Visto de um ângulo ligeiramente elevado, o prisioneiro jovem de pele morena e túnica azul desgastada ajoelha-se no centro-inferior do quadro, corpo torcido numa virada incompleta; os olhos fechados e a mandíbula tensa comunicam ofuscamento imediato após anos voltado apenas para sombras. A luz do fogo, escondida atrás da parede, derrama-se sobre o chão e a rocha ao redor como uma maré quente que revela textura onde antes havia apenas contorno. Mesmas proporções chibi 3D Pixar da referência Philoo. Mais espaço negativo acima do personagem para respiro narrativo. Sem Platão, sem texto, sem rótulos.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/cave-first-turn-cliffhanger-v1.png`; `imagePath`: `public/images/story/cave-first-turn-cliffhanger-v1.png`.

---

## Beat 2 — Fogo e estátuas

**Tipo:** `cena_completa`  
**Arquivo de saída:** `beat-02-fogo-e-estatuas-v1.png`  
**Status:** aguardando escolha humana  
**Nota de exercício:** a cena deve tornar visualmente legível o mecanismo causa→efeito (fogo, portadores, objetos, sombras) para o EX-05 de classificação — sem rótulos na imagem.

### Variação A

Ilustração 3D chibi Pixar em 16:9, paleta azul bebê e creme. Atrás da parede baixa da caverna, o jovem prisioneiro de pele morena, cabelo escuro curto, túnica azul clara e pés descalços está em pé pela primeira vez, uma mão apoiada na pedra para se equilibrar enquanto observa, boquiaberto e concentrado, o mecanismo que sempre esteve oculto: um fogo alto lança luz quente sobre figuras humanas simplificadas que passam carregando objetos sólidos, e esses objetos projetam sombras nítidas contra a parede oposta da caverna. O prisioneiro mantém as mesmas proporções chibi 3D Pixar da referência Philoo, expressão de descoberta pensativa, não de vitória. Plano geral mostra parede, fogo, passagem das figuras e parede das sombras num único eixo legível. Sem Platão, sem texto, sem legendas.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/a-subida/beat-01-depois-da-virada-v1.png` (ou `public/images/story/cave-behind-wall-layers-v1.webp` se beat 1 ainda não existir); `imagePath`: `public/images/story/cave-behind-wall-layers-v1.webp`.

### Variação B

Cena 3D chibi Pixar 16:9 com tons `#33BFED` e pedra creme. O prisioneiro jovem, pele morena, túnica azul desgastada, descalço, encosta-se com ambas as mãos na parede baixa enquanto inclina o tronco para ver além dela; seus olhos expressivos arregalam-se diante do fogo alto e das silhuetas em movimento que carregam formas reconhecíveis, percebendo pela primeira vez que as sombras na parede distante nascem daquele vaivém iluminado. Enquadramento lateral três-quartos enfatiza a profundidade entre fogo, objetos e parede das sombras. Proporções chibi Philoo idênticas à referência. Sem Platão, sem anotações visuais de qualquer tipo.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/a-subida/beat-01-depois-da-virada-v1.png` (ou `public/images/story/cave-behind-wall-layers-v1.webp`); `imagePath`: `public/images/story/cave-behind-wall-layers-v1.webp`.

### Variação C

Composição narrativa 16:9 em 3D chibi Pixar. O prisioneiro, jovem adulto de pele morena e túnica azul clara surrada, permanece em pé atrás da parede com uma mão na pedra e a outra suspensa no ar, gesto interrompido de quem acaba de ligar causa e efeito; o foco visual recai sobre o fogo alto e as figuras estatuárias que transportam objetos enquanto sombras dançam na parede ao fundo. Plano mais próximo no rosto do prisioneiro no terço esquerdo, com o mecanismo luminoso ocupando o centro-direita. Mesmas proporções chibi 3D Pixar da referência Philoo. Sem Platão, sem texto, sem rótulos.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/a-subida/beat-01-depois-da-virada-v1.png` (ou `public/images/story/cave-behind-wall-layers-v1.webp`); `imagePath`: `public/images/story/cave-behind-wall-layers-v1.webp`.

---

## Beat 3 — A subida dolorosa

**Tipo:** `cena_completa`  
**Arquivo de saída:** `beat-03-a-subida-dolorosa-v1.png`  
**Status:** aguardando escolha humana

### Variação A

Ilustração 3D chibi Pixar em 16:9, paleta azul bebê e creme. O jovem prisioneiro de pele morena, cabelo escuro curto, túnica azul clara e pés descalços sobe uma rampa rochosa íngreme e irregular, um braço cruzado sobre os olhos para se proteger da luz crescente que invade a passagem à frente; o corpo inclina-se para trás num esforço visível, pernas tensas, expressão de resistência e cansaço. Atrás dele, a caverna mergulha em escuridão familiar; adiante, a abertura da galeria brilha com claridade dolorosa. Proporções chibi Philoo da referência. Plano geral mostra toda a inclinação da rampa. Sem Platão, sem texto, sem legendas.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`; `imagePath`: `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`.

### Variação B

Cena 3D chibi Pixar 16:9. Visto de trás, o prisioneiro jovem — pele morena, túnica azul desgastada, descalço, chibi Philoo — avança a custo pela passagem rochosa, ombros curvados, uma mão no antebraço sobre os olhos; a caverna escura recua como um túnel acolhedor que ele hesita em abandonar, enquanto à frente a luz branca da saída cresce num contraste quase insuportável. Enquadramento que enfatiza o contraste escuro/claro e a inclinação da subida. Sem Platão, sem anotações.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`; `imagePath`: `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`.

### Variação C

Composição 16:9 em 3D chibi Pixar, tons `#5BB8F5` e pedra quente. Plano baixo olhando para cima: o prisioneiro jovem de túnica azul clara e pele morena escala a rampa íngreme quase de perfil, rosto virado para a luz ofuscante da entrada, olhos apertados atrás do antebraço, mandíbula cerrada numa mistura de medo e obediência forçada; paredes rochosas estreitam o corredor. Mesmas proporções chibi 3D Pixar da referência Philoo. Sem Platão, sem texto, sem rótulos.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`; `imagePath`: `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`.

---

## Beat 4 — Periagoge (Platão, cartão de conceito)

**Tipo:** `personagem_isolado`  
**Arquivo de saída:** `beat-04-plato-ofuscado-v1.png` (PNG com alfa após rembg; exportar WebP para composição UI)  
**Status:** aguardando escolha humana  
**Pipeline pós-geração:** (1) gerar sobre fundo sólido branco ou verde chroma; (2) remover fundo com `rembg`; (3) exportar WebP para asset de personagem. Nunca pedir “fundo transparente” ao modelo.

### Variação A

Edição da referência canônica de Platão Philoo: corpo inteiro em 3D chibi Pixar, mantendo fielmente a aparência fixa da referência `plato-reference-01.jpeg` (proporções, rosto, vestimenta, cabelo e barba). Platão está de frente ligeiramente voltado para a direita da tela, expressão serena e atenta, e estende a mão direita aberta para a direita como quem apresenta uma ideia ao espaço reservado ao cartão de conceito na interface — gesto de acolhida, sem objeto nem texto visível. A mão esquerda repousa aberta junto ao corpo. Fundo sólido branco uniforme, sem chão, sem ambiente, sem outros personagens. Sem texto, sem legendas, sem cartão legível na imagem.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`; `imagePath`: `public/images/reference/plato-reference-01.jpeg`. Pós-processamento: `rembg` → WebP.

### Variação B

Edição a partir de `plato-reference-01.jpeg`: Platão Philoo em corpo inteiro, chibi 3D Pixar, identidade visual idêntica à referência. Voltado três-quartos para a direita, olhar calmo fixo na direção do cartão de conceito fora da tela; apenas a mão direita estende-se com palma aberta num gesto de oferta paciente, enquanto a esquerda toca levemente o peito, como quem nomeia uma mudança interior. Expressão de professor atento, não triunfante. Fundo sólido verde chroma uniforme. Sem ambiente, sem texto, sem props legíveis.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`; `imagePath`: `public/images/reference/plato-reference-01.jpeg`. Pós-processamento: `rembg` → WebP.

### Variação C

Edição da referência Philoo de Platão: figura completa em estilo chibi 3D Pixar, aparência estritamente conforme `plato-reference-01.jpeg`. Platão inclina levemente a cabeça, olhos expressivos semicerrados com gentileza, e abre ambas as mãos — a direita estendida para a direita da tela num gesto de apresentação, a esquerda ligeiramente elevada como complemento explicativo — convidando atenção para o espaço do cartão de conceito na UI. Fundo sólido branco. Sem chão, sem caverna, sem prisioneiro, sem qualquer texto ou rótulo.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`; `imagePath`: `public/images/reference/plato-reference-01.jpeg`. Pós-processamento: `rembg` → WebP.

---

## Beat 5 — Sombras lá fora

**Tipo:** `cena_completa`  
**Arquivo de saída:** `beat-05-sombras-la-fora-v1.png`  
**Status:** aguardando escolha humana  
**Nota de exercício:** a sombra no chão deve ser legível como forma ambígua (predição EX — árvore, pedra, animal ou incerteza), sem revelar o objeto causador.

### Variação A

Ilustração 3D chibi Pixar em 16:9, crepúsculo suave com paleta azul bebê e creme. Do lado de fora da caverna, o jovem prisioneiro de pele morena, túnica azul clara desgastada e pés descalços senta-se numa pedra baixa, tronco inclinado para a frente enquanto observa uma sombra alongada projetada no chão rochoso sob luz fraca e difusa; o rosto oscila entre reconhecimento e receio, olhos semicerrados ainda pouco acostumados ao mundo aberto. A boca da caverna permanece visível ao fundo em penumbra. Proporções chibi Philoo da referência. Plano geral equilibrando personagem, sombra e horizonte. Sem Platão, sem texto, sem rótulos.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`; `imagePath`: `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`.

### Variação B

Cena 16:9 em 3D chibi Pixar, luz de crepúsculo azulada. O prisioneiro jovem, pele morena, cabelo escuro curto, túnica azul clara, está sentado numa rocha achatada com cotovelos apoiados nos joelhos e olhar fixo na sombra escura estendida diante dele no solo pedregoso; a postura comunica hesitação — quer nomear o que vê, mas ainda não ousa concluir. Enquadramento mais fechado, sombra ocupando o terço inferior direito, rocha da caverna ao fundo esquerdo. Mesmas proporções chibi 3D Pixar da referência Philoo. Sem Platão, sem anotações visuais.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`; `imagePath`: `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`.

### Variação C

Composição narrativa 16:9, render chibi Pixar, hora azul suave. Vista por cima do ombro do prisioneiro jovem de túnica azul desgastada: vemos suas costas curvadas e, além, a sombra indistinta no chão rochoso iluminada pelo crepúsculo tenue; a entrada escura da caverna marca o limite entre mundos. Expressão parcialmente visível de dúvida atenta. Proporções chibi Philoo. Sem Platão, sem texto, sem rótulos, sem mostrar o objeto que produz a sombra.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`; `imagePath`: `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`.

---

## Beat 6 — Reflexos na água

**Tipo:** `cena_completa`  
**Arquivo de saída:** `beat-06-reflexos-na-agua-v1.png`  
**Status:** aguardando escolha humana  
**Nota de exercício:** árvore e pedra reais devem ser claramente distinguíveis do reflexo na água para o caminho causal EX-03 — sem setas ou rótulos desenhados na imagem.

### Variação A

Ilustração 3D chibi Pixar em 16:9, luz mais clara que o crepúsculo, paleta azul bebê e verdes suaves. O jovem prisioneiro de pele morena, túnica azul clara e pés descalços ajoelha-se à beira de um riacho calmo; com uma mão estendida, aponta do reflexo tremulo de uma árvore e de uma pedra na superfície da água em direção aos objetos reais erguidos na margem oposta, como se traçasse mentalmente a ligação entre efeito e causa. Olhar concentrado e descobridor. Proporções chibi Philoo da referência. Plano médio-largo mostrando água, reflexo e objetos numa leitura clara. Sem Platão, sem texto, sem setas gráficas.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`; `imagePath`: `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`.

### Variação B

Cena 16:9 em 3D chibi Pixar. O prisioneiro jovem, pele morena, túnica azul desgastada, ajoelha-se mais próximo da água, rosto quase ao nível do reflexo; o dedo indicador une visualmente o contorno invertido da árvore na superfície líquida ao tronco real acima da margem, expressão de insight quieto. Enquadramento baixo enfatiza a superfície espelhada no primeiro plano. Mesmas proporções chibi 3D Pixar da referência Philoo. Sem Platão, sem legendas, sem diagramas.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`; `imagePath`: `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`.

### Variação C

Composição 16:9, render chibi Pixar, luz matinal suave em tons azul bebê e creme, sem roxo nem dourado. De perfil, o prisioneiro jovem de túnica azul clara permanece ajoelhado à beira da lagoa; ambas as mãos participam do gesto — uma indica o reflexo na água, a outra o objeto real — enquanto a árvore e a pedra se refletem nítidas abaixo e se erguem sólidas acima. Ambiente aberto sereno, transição da adaptação visual. Proporções chibi Philoo. Sem Platão, sem texto, sem rótulos.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`; `imagePath`: `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`.

---

## Beat 7 — Objetos, estrelas e lua

**Tipo:** `cena_completa`  
**Arquivo de saída:** `beat-07-objetos-estrelas-e-lua-v1.png`  
**Status:** aguardando escolha humana

### Variação A

Ilustração 3D chibi Pixar em 16:9, noite serena com céu azul profundo `#33BFED` salpicado de estrelas e uma lua crescente prateada. No mundo aberto, o jovem prisioneiro de pele morena, túnica azul clara desgastada e pés descalços está de pé numa clareira rochosa, uma mão estendida em direção a uma árvore real e a uma pedra sólida à sua frente, corpo relaxado pela primeira vez; o rosto mostra calma curiosa enquanto contempla objetos tangíveis antes de erguer levemente o olhar ao céu. Proporções chibi Philoo da referência. Plano geral com personagem pequeno diante do horizonte estrelado. Sem Platão, sem texto, sem legendas.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`; `imagePath`: `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`.

### Variação B

Cena 16:9 em 3D chibi Pixar, noturna. Enquadramento médio: o prisioneiro jovem, pele morena, cabelo escuro curto, túnica azul clara, toca quase a casca de uma árvore com a ponta dos dedos enquanto a pedra real repousa ao lado; atrás dele, o céu mostra estrelas densas e uma lua crescente inclinada, luz fria acalmando os olhos. Expressão de descanso visual e atenção renovada. Mesmas proporções chibi 3D Pixar da referência Philoo. Sem Platão, sem anotações.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`; `imagePath`: `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`.

### Variação C

Composição 16:9, render chibi Pixar, noite clara. O prisioneiro jovem de túnica azul desgastada permanece de pé numa elevação rochosa, braço estendido convidando o olhar primeiro para a árvore e a pedra no plano médio, depois para o céu estrelado que ocupa metade superior do quadro com lua crescente proeminente; postura aberta, olhos brilhantes de quem avança etapa por etapa. Proporções chibi Philoo. Sem Platão, sem texto, sem rótulos.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`; `imagePath`: `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`.

---

## Beat 8 — O sol

**Tipo:** `cena_completa`  
**Arquivo de saída:** `beat-08-o-sol-v1.png`  
**Status:** aguardando escolha humana  
**Nota de exercício:** o sol como causa metafísica da visibilidade — sem figura divina antropomórfica, sem halo rotulado.

### Variação A

Ilustração 3D chibi Pixar em 16:9, amanhecer claro com céu em gradiente de azul bebê `#5BB8F5` a creme `#FBF8F3`. O jovem prisioneiro de pele morena, túnica azul clara desgastada e pés descalços está de pé numa borda rochosa olhando para o horizonte onde o sol nasce como disco luminoso simples; uma mão ergue-se para proteger os olhos, mas o rosto permanece voltado para a luz, expressão de firmeza misturada ao desconforto residual — compreensão nascendo, não êxtase instantâneo. Proporções chibi Philoo da referência. Plano geral com sol no terço superior e personagem no terço inferior. Sem Platão, sem texto, sem legendas.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`; `imagePath`: `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`.

### Variação B

Cena 16:9 em 3D chibi Pixar, alvorecer. Plano mais fechado no prisioneiro jovem, pele morena, cabelo escuro curto, túnica azul clara: ele inclina levemente o rosto para o nascer do sol no canto superior da tela, antebraço sombreando os olhos enquanto a mandíbula relaxada sugere que desta vez não desvia o olhar; luz matinal suave em azul bebê e creme banha o ambiente aberto, sem tons dourados ou roxos. Mesmas proporções chibi 3D Pixar da referência Philoo. Sem Platão, sem anotações visuais.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`; `imagePath`: `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`.

### Variação C

Composição 16:9, render chibi Pixar, amanhecer amplo. O prisioneiro jovem de túnica azul desgastada permanece de pé numa encosta, silhueta parcialmente contra o céu clareando; o braço protege os olhos sem esconder a determinação do olhar fixo no sol nascente que irradia luz uniforme sobre paisagem aberta — pedra, céu e figura numa ordem finalmente visível. Proporções chibi Philoo. Enquadramento ligeiramente contrapicado enfatizando escala do céu. Sem Platão, sem texto, sem rótulos.

**Delegação MCP:** ferramenta `edit_image`; `referenceImages`: `public/images/reference/plato-reference-01.jpeg`, `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`; `imagePath`: `public/images/story/a-subida/beat-01-depois-da-virada-v1.png`.

---

## Próximo passo

Variações escolhidas: **1C, 2B, 3B, 4C, 5B, 6B, 7A, 8C**. Delegar ao **image-generator** via MCP `edit_image` + referências.
