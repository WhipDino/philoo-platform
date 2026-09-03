# Padrões de capítulo no Folio

Fonte de verdade para qualquer lição no Folio. A trilogia da Caverna
(`As Sombras`, `A Subida`, `O Retorno`) está **fechada e jogável**. Agentes
leem este arquivo **e** as ferramentas:

- `docs/reference/STORY_THREAD.md` — como não perder o fio
- `docs/reference/FOLIO_LAYOUT_CONTRACT.md` — espaçamento, cartão, colunas, EX-10/11

Chat antigo não vale como regra.

Público: cerca de 12 a 17 anos, português do Brasil. Tom de história, não de
aula universitária nem de desenho com “no próximo episódio”.

## Quem lê o quê

| Agente | O que tira daqui |
| --- | --- |
| story-writer | voz, texto curto com imagem, gancho, sem travessão; fio em `STORY_THREAD.md` |
| engagement-specialist | Continuar escondido, erro sem punição, recompensa de capítulo |
| exercise-designer | EX-09, EX-10, EX-11, previsão, briefing em duas camadas |
| implementer | Folio, layout (`FOLIO_LAYOUT_CONTRACT.md`), briefing, reward |
| validator | checklist de produto **depois** das rotas existirem |
| art-director | prisioneiro contínuo, Platão fora da cena |

## Folio

- Sem rolagem de página. O aluno avança pelo rodapé.
- `PhilooStoryShell` + `PhilooFolioStage` + `PhilooFolioVoice` +
  `PhilooNarrativeComposition` + `PlatoGuide`.
- CSS do quadro: `philoo-soft-story-layout.module.css`. Não recrie a moldura.
- Templates: `guide-voice`, `story-panel`, `named-concept`, `reward`.
  Catálogo: `docs/product/philoo-scene-template-catalog-v1.md`.
- Em tela curta, o conteúdo cabe sem scroll interno. Se não cabe, enxugue
  texto ou compacte o exercício. Não empurre o botão para baixo de uma barra.

## Texto

- Sem travessão (`—`) em texto do aluno. Soa a máquina. Use ponto ou vírgula.
- Texto nunca compete com imagem. Cena (`story-panel`): uma fala curta.
  Explicação longa fica em `guide-voice` sem quadro.
- A fala não pode passar por baixo do rodapé nem ficar ilegível no fade.
- História primeiro. O exercício só aparece depois que a cena já mostrou o
  movimento. Não use o exercício para contar o que a imagem deveria contar.
- Gancho de capítulo: dúvida genuína, não spoiler da próxima aula, não
  “descubra no próximo episódio”. Em A Subida ele para na boca da caverna;
  a decisão de descer é da Lição 3.

## Personagens

- O prisioneiro de A Subida é o mesmo que olhou para trás em As Sombras.
  Identidade: `cave-first-turn-cliffhanger-v1.png` (prisioneiro do meio).
- Platão narra numa camada UI transparente. Não entre na ilustração ambiental.
- Tela de exercício: sem Platão no tabuleiro. Platão só no modal “Como jogar”.
- Pose aponta para o conteúdo. Se o guia está à esquerda, olha e gesticula
  para a direita.

## Briefing (“Antes de começar” / “Como jogar”)

Componente: `philoo-activity-briefing`. Contrato visual:
`docs/reference/FOLIO_LAYOUT_CONTRACT.md`.

Duas camadas:

- **Como jogar** (motor): passos e demo. Não reescrever por lição.
- **Por que nesta cena** (lição): `purpose`, `prompt`, `startLabel`. Uma ou
  duas frases desta história.

- Platão preenche a coluna esquerda (não um bonequinho no rodapé com vazio em cima).
- Fundo do diálogo: `#f3f7fb` (azul-acinzentado limpo). Evite creme sujo tipo
  papel velho no modal.
- Sem rolagem no modal em desktop. Demo + 3 passos + botão cabem.
- Legenda do demo fica **abaixo** do exemplo, com respiro até a borda.
  Nunca sobre o botão Confirmar. Demo em grid empilhado, não `position: absolute`.
- Cursor e hover de clique em todo controle que o aluno precisa acionar.

## Continuar

- Enquanto o exercício não estiver certo, o botão de avançar do Folio
  **não aparece**. Não deixe um Continuar cinza: o aluno tenta pular a página.
- `action={canAdvance ? … : undefined}` em `PhilooFolioStage`.
- Vale para todos os exercícios do Folio.

## Previsão / escolher alternativa

`PredictionConsequence` em `src/domains/lessons/interactions/`.

- Confirmar tem `cursor: pointer` e hover, como “Como jogar”.
- Erro: feedback sem punição (“Ainda não é isso”). O aluno escolhe outra
  alternativa na hora. Em A Subida use `unlockOnMiss`.
- Se ainda existir “Tentar outra previsão”, tem que parecer botão de verdade
  (não uma flag). A Lição 1 pode manter o lock até o retry; não quebre os testes.
- Continuar do Folio só depois do acerto.

## Ligação entre nós (EX-09)

Arquivos: `philoo-pair-connect.tsx` + CSS. Catálogo: experimento.

- Conectar tudo, depois Conferir. Só as ligações erradas tremem e se soltam.
- Tabuleiro no centro, pílulas curtas (não esticar a largura do card).
- Fonte e altura um pouco maiores; não gigantes.
- Conferir fica logo abaixo dos nós, visível sem scroll interno.
- Sem zonas de imagem. Só texto + nós.

## Palavra grega

`named-concept`: três `guide-voice` (palavra, esta cena, agora).
`tone="concept"` e `moment="concept"` (barra dourada, “Momento da palavra”).
Sem cartão de dicionário e sem receita de “como aplicar no dia a dia”.

Referência viva: `/aula/a-subida/periagoge`. O paralelo de A Subida é um
recorte de vídeo no celular (imagem estática). Não reabrir EX-04 crop-reveal
nessa tela.

## Fim de capítulo

Ordem: última história (gancho) → tela de recompensa → saída.

Recompensa no padrão da Lição 1 (`cave-first-doubt-scene` reward):

- pontos de descoberta;
- distintivo;
- três takeaways;
- um destino real.

Não invente rota da próxima lição se ela ainda não existe. O Retorno manda
para `/inicio` (“Voltar ao meu caminho”).

## A Subida, como está no código

Seis estágios no rail (`a-subida-journey.ts`):

1. `/aula/a-subida/depois-da-virada` — recap + virada (imagem da Lição 1)
2. `/aula/a-subida/fogo-e-estatuas` — fogo e causa (só história)
3. `/aula/a-subida/a-subida-dolorosa` — outro brilho, feixe, subida
4. `/aula/a-subida/sombras-la-fora` — saída, árvore de dia, EX-09
5. `/aula/a-subida/periagoge` — periagōgē + imagem do celular
6. `/aula/a-subida/a-decisao` — medo, previsão, gancho, recompensa

Conteúdo: `src/domains/lessons/a-subida/a-subida-content.ts`.
Cena: `a-subida-scene.tsx`. Assets: `a-subida-assets.ts`.

Rotas antigas `/reflexos-na-agua`, `/objetos-estrelas-e-lua`, `/o-sol`
redirecionam para `sombras-la-fora`.

## Não copiar

- `beat-05-sombras-la-fora` e `beat-06-reflexos-na-agua` ainda parecem
  interior de caverna. Não use como “lá fora”.
- Brief antigo (`docs/product/a-subida-lesson-brief.md`) descreve EX-06/07/08
  numa sequência que **não** é o rail atual. O rail acima é a verdade.
- EX-06, EX-07 e EX-08 existem no catálogo como experimentos de tela antiga.
  Não religue essas rotas sem pedido humano.
- Folio com borda ciano cortada: parked. Espere print; não chute o CSS.

## O Retorno, como está no código

Seis estágios no rail (`o-retorno-journey.ts`):

1. `/aula/o-retorno/na-boca` — recap da lição 2, ele decide voltar
2. `/aula/o-retorno/katabainein` — palavra `aletheia`, `named-concept`
3. `/aula/o-retorno/a-escuridao` — os olhos escurecem de novo, EX-10 (lente dupla)
4. `/aula/o-retorno/jogos-de-sombra` — ele perde o jogo de sombras, EX-06
   variante evidence-to-model via `PredictionConsequence` (dois modelos:
   ficou burro vs. perdeu prática; match = prática; `unlockOnMiss`)
5. `/aula/o-retorno/a-divida` — o medo e a obrigação com os amigos, EX-11
6. `/aula/o-retorno/a-descida` — fecha o mito, Platão se apresenta,
   nomeia filosofia, recompensa → `/inicio`

Conteúdo: `src/domains/lessons/o-retorno/o-retorno-content.ts`.
Cena: `o-retorno-scene.tsx`. Assets: `o-retorno-assets.ts`.
Journey: `o-retorno-journey.ts`.

Mecânicas deste capítulo, em `exercise-catalog.ts` como `experiment` até
uma segunda lição extraí-las:

- **EX-10** (lentes duplas): `philoo-dual-lens.tsx`. Uma cena, duas artes, o
  aluno **arrasta** uma linha no quadro. Ver perguntas só depois que a
  segunda lente aparece. Cartas **não se sobrepõem**. Conferir: verso
  vermelho no erro (“Ainda não é isso”, depois **Tentar novamente**);
  verso verde no acerto. `onComplete` só no acerto. Detalhe:
  `FOLIO_LAYOUT_CONTRACT.md`.
- **EX-11** (camadas / pirâmide): `philoo-decision-layers.tsx`. Três camadas
  por peso (mais leve na **base visual**, embaixo). Arrastar (ghost no
  cursor) e clique-clique para teclado. Conferir: só as camadas erradas
  voltam. Feedback: o medo não some; trazer a verdade pesa mais, com os
  amigos. Não é `philoo-causal-path`.
- **EX-06** em `jogos-de-sombra`: `PredictionConsequence` com imagem à
  esquerda (`beat-04-jogos-de-sombra-v4.png`). `unlockOnMiss`.

O briefing usa Platão só no modal. Passos de mecânica vêm do motor;
`purpose` é da cena.

Siga `.cursor/rules/lesson-pipeline.mdc`, `STORY_THREAD.md` e
`FOLIO_LAYOUT_CONTRACT.md`.
