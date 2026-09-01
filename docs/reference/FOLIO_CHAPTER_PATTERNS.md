# Padrões de capítulo no Folio

Fonte de verdade para qualquer lição depois de **As Sombras** e **A Subida**.
Agentes leem este arquivo. Chat antigo não vale como regra.

Público: cerca de 12 a 17 anos, português do Brasil. Tom de história, não de
aula universitária nem de desenho com “no próximo episódio”.

## Quem lê o quê

| Agente | O que tira daqui |
| --- | --- |
| story-writer | voz, texto curto com imagem, gancho, sem travessão |
| engagement-specialist | Continuar escondido, erro sem punição, recompensa de capítulo |
| exercise-designer | EX-09, previsão, briefing, exercício só depois da história |
| implementer | Folio, briefing, layout de nós, reward, rota da próxima aula |
| validator | checklist do capítulo |
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

Componente: `philoo-activity-briefing`.

- Platão preenche a coluna esquerda (não um bonequinho no rodapé com vazio em cima).
- Fundo do diálogo: `#f3f7fb` (azul-acinzentado limpo). Evite creme sujo tipo
  papel velho no modal.
- Sem rolagem no modal em desktop. Demo + 3 passos + botão cabem.
- Legenda do demo fica **abaixo** do exemplo, com respiro até a borda.
  Nunca sobre o botão Confirmar.
- Cursor e hover de clique em todo controle que o aluno precisa acionar.

## Continuar

- Enquanto o exercício não estiver certo, o botão de avançar do Folio
  **não aparece**. Não deixe um Continuar cinza: o aluno tenta pular a página.
- `action={canAdvance ? … : undefined}` em `PhilooFolioStage`.
- Vale para todos os exercícios das lições 1 e 2 (e as que vierem).

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

Não invente rota da próxima lição se ela ainda não existe. A Subida manda
para `/inicio` (“Voltar ao meu caminho”). O Retorno ainda não tem aula.

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

## Lição 3 (O Retorno)

Ainda não implementada. Portal: capítulo `upcoming`, sem `href`.
Não comece a construir até o humano pedir. Quando pedir, o prisioneiro
já está na dúvida da boca da caverna; a decisão de descer começa ali.
Siga o pipeline em `.cursor/rules/lesson-pipeline.mdc` e este arquivo.
