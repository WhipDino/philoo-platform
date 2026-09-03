# Contrato de layout do Folio

Ferramenta obrigatória do **implementer** e do **validator**. Não invente
geometria de página. Os esqueletos já existem; a lição só preenche conteúdo.

Leia junto: `docs/reference/FOLIO_CHAPTER_PATTERNS.md`,
`docs/product/philoo-scene-template-catalog-v1.md`,
`.cursor/rules/responsive-check.md`.

## Princípio

Em qualquer tela, o bloco que o aluno usa fica **no meio do espaço que o Folio
lhe deu**:

- mesma distância da parede esquerda e da parede direita;
- mesma distância do pontilhado de cima (masthead) e da base de baixo,
  **incluindo a faixa 3D** do cartão (hoje `box-shadow: 0 7px 0` no cartão
  de exercício).

Não deixe uma faixa creme enorme em cima e o cartão colado embaixo. Não
centralize um cartão miúdo no vazio. O cartão de exercício **ocupa o miolo**;
o respiro igual fica na margem do Folio.

Referência viva: `.decisionStage` +
`.storyBody:has([data-philoo-decision-layers])` em
`philoo-story-path-stage.module.css`.

Quando o exercício tem duas colunas e um pontilhado no meio (EX-11):

- cartas à esquerda: equidistantes da parede esquerda e do pontilhado;
- pirâmide à direita: equidistante do pontilhado e da parede direita;
- empilhar em uma coluna quando o **container** do exercício for estreito
  (`container-type: inline-size`, corte ~700px). Não confie só em `@media`
  da janela: o Folio pode estar em escala.

## Folio (todas as telas)

- Sem rolagem de página. `PhilooStoryShell` + `PhilooFolioStage`.
- CSS do quadro 16:9: `philoo-soft-story-layout.module.css`. Não recrie a
  moldura.
- Texto nunca compete com imagem: `guide-voice` ou `story-panel`, não os dois
  longos na mesma vista.
- Continuar do Folio: `action={undefined}` até o exercício estar certo. Nunca
  um Continuar cinza.
- Rail da jornada: no tablet o padrão é **recolhido**.
  `prefersExpandedJourneyRail()` usa `(min-width: 1181px)`. Não volte a
  expandir o rail a 768 px: o exercício de duas colunas perde largura.
- Underlay ciano do Folio: fino (`inset: 9px -7px -9px 7px`). Não engrosse
  para “combinar” com cards.

## Cartões 3D

Faixa direita + baixo, **fina** (cerca de 4px nos cards de camada; 7px no
cartão-folha do exercício). Borda do card 2px. Não volte à laje de 8px.

Alvo de toque ≥ 44px. `cursor: pointer` e hover em controle clicável.

## Briefing (`PhilooActivityBriefing`)

Duas camadas, não misturar no motor:

| Camada | Dono | O que é |
| --- | --- | --- |
| Como jogar | motor (passos + demo) | arraste, conferir, o que volta, sem penalidade |
| Por que nesta cena | lição (`purpose`, `prompt`, `startLabel`) | 1–2 frases desta decisão, destes olhos, desta evidência |

O agente **não reescreve** os passos de mecânica. Reescreve o propósito.

Demo: caixa que **cresce** com o texto (stack em grid, não `position: absolute`
que corta “Ver perguntas”). Fundo `#f3f7fb`. Platão preenche a coluna
esquerda. Sem rolagem presa no desktop.

## Motores do Retorno (reutilizar, não redesenhar)

### EX-10 — Lentes duplas (`philoo-dual-lens`)

- Quadro alto **dentro** do Folio; wipe grande; “Ver perguntas” só depois que
  a segunda lente aparece de fato (~88% do wipe).
- Cartas **não se sobrepõem** (sobreposição lê como “a de cima está certa”).
- Conferir: verso vermelho + “Ainda não é isso” no erro; verso verde no
  acerto. Folio Continuar só no acerto. Depois do erro o botão vira **Tentar
  novamente**.
- Cartas no meio vertical: mesmo vão do texto de ajuda até as cartas e das
  cartas até o botão.

### EX-11 — Camadas / pirâmide (`philoo-decision-layers`)

- Ordem lógica `[base, meio, topo]` (mais leve → mais pesado). Visual:
  `flex-direction: column-reverse` + larguras 100% / 86% / 72%. Base embaixo.
- Arrastar com ghost no `document.body` (posição = cursor, sem offset do
  Folio). Clique-clique permanece para teclado e testes.
- Depois de Conferir, só as camadas erradas voltam. Sem punição.
- Cartão branco do exercício: preenche o `storyBody` com respiro igual
  (padding-top do Folio = padding-bottom visual depois da faixa 3D).

### EX-06 — Previsão com imagem (`PredictionConsequence`)

- Variante do Retorno: imagem à esquerda, pergunta à direita, **dentro** do
  Folio (`height: min(78%, 31rem)`, `margin-block: auto`).
- Empilhar só abaixo de ~620px. Em 768–1100 continua lado a lado.
- `unlockOnMiss`. Confirmar com hover.

## O que não copiar

- CSS de uma aula colado em outra. Extraia ou reutilize o módulo do motor.
- Hotspot de pixel (EX-10 não é EX-02).
- `philoo-causal-path` para peso de decisão (EX-11 não é causa).
- Regenerar o rosto do prisioneiro em pé nos jogos de sombra. A arte boa é
  `beat-04-jogos-de-sombra-v4.png`; não redesenhar o corpo.

## Verificação

Larguras 320, 375, 768, 1024, 1280, 1440, 1920 × 900. Sem overflow
horizontal. Playwright MCP ou `npm run check:responsive`. Depois de UI,
confira o comportamento, não só um print desktop.
