# Catálogo de templates de cena — v1

A trilogia da Caverna (`As Sombras`, `A Subida`, `O Retorno`) está **enviada**.
É a biblioteca visual das jornadas seguintes. Não invente layout novo. Escolha
um destes esqueletos e troque só conteúdo (texto, pose, imagem).

Fio da história: `docs/reference/STORY_THREAD.md`.
Layout do Folio e dos exercícios: `docs/reference/FOLIO_LAYOUT_CONTRACT.md`.

**Regra inegociável: texto nunca compete com imagem.**

- Tela de explicação: filósofo grande + texto. Sem quadro de cena.
- Tela com cena: o quadro 16:9 em cima, fala curta embaixo, filósofo ao lado
  do bloco inteiro.
- Nunca coloque um parágrafo longo e uma ilustração larga na mesma vista.

Fonte: Fredoka (`--font-display`) no título da fala e no copy do folio;
Nunito (`--font-reading`) no chrome, botões e UI. Não force Nunito sobre o
texto da voz.

Layout compartilhado: `src/domains/lessons/philoo-soft-story-layout.module.css`.
Componentes: `PhilooStoryShell`, `PhilooFolioStage`, `PhilooFolioVoice`,
`PhilooNarrativeComposition`, `PlatoGuide`.

Referências vivas na Lição 1:

| Template | Exemplo | O que muda |
| --- | --- | --- |
| `guide-voice` | `/aula/as-sombras/primeira-tela`, `/aula/as-sombras/a-descida` | pose, lado do guia, título Fredoka, lead, guidance |
| `story-panel` | `/aula/as-sombras/eles-dao-nomes` | imagem dentro de `.storyPanel`, uma frase em `.beatCopy`, pose |
| `named-concept` | `/aula/a-subida/periagoge` | três `guide-voice`: palavra, esta cena, agora |

Referências vivas na Lição 2 (`A Subida`), para reutilizar:

| Tela | Rota | Padrão |
| --- | --- | --- |
| Abertura | `/aula/a-subida/depois-da-virada` | 2× `guide-voice` + `story-panel` |
| Mecanismo | `/aula/a-subida/fogo-e-estatuas` | 2× `guide-voice` + `story-panel` |
| Subida | `/aula/a-subida/a-subida-dolorosa` | feixe + subida em `story-panel` |
| Palavra grega | `/aula/a-subida/periagoge` | `named-concept` + quadro estático (não EX-04) |
| Sequência calma | `/aula/a-subida/sombras-la-fora` | pares voz + quadro, depois EX-09 |
| Corte aberto | `/aula/a-subida/a-decisao` | 2× `guide-voice` + previsão + gancho + `reward` |

Referências vivas na Lição 3 (`O Retorno`):

| Tela | Rota | Padrão |
| --- | --- | --- |
| Abertura | `/aula/o-retorno/na-boca` | 2× `guide-voice` + `story-panel` |
| Palavra grega | `/aula/o-retorno/katabainein` | `named-concept` |
| Escuridão | `/aula/o-retorno/a-escuridao` | voz + EX-10 |
| Jogo | `/aula/o-retorno/jogos-de-sombra` | voz + `story-panel` + EX-06 |
| Dívida | `/aula/o-retorno/a-divida` | voz + EX-11 |
| Fecho | `/aula/o-retorno/a-descida` | voz + `story-panel` + `reward` |

Padrões de Folio, briefing, Continuar e recompensa:
`docs/reference/FOLIO_CHAPTER_PATTERNS.md`.

O quadro (borda ciano, sombra, 16:9) é o esqueleto. A lição só coloca um
`next/image` dentro. Não recrie a moldura em CSS da lição.

## `guide-voice`

Platão ocupa a coluna do guia. O texto fica na outra coluna, com título
grande em Fredoka (`styles.title`), lead (`styles.lead`) e, se precisar,
guidance (`styles.guidance`).

- Classe da composição: `styles.narrativeComposition`
- `guideSide="end"`: Platão à direita (ex.: pose `invitation`)
- `guideSide="start"`: Platão à esquerda (ex.: pose `descent`)
- Sem prop `illustration`

Use quando o filósofo está explicando, retomando ou preparando o próximo
passo. Vários cliques podem avançar beats neste mesmo template.

## `story-panel`

O aluno vê a cena no quadro, lê uma fala curta e tem o filósofo guiando.

- Classe da composição: `styles.storyStage`
- Quadro: `<figure className={styles.storyPanel} data-story-panel>`
- Fala: um parágrafo curto em `styles.beatCopy` (não use `styles.title`)
- `guideSide="start"` com pose que gesticula para a direita (`reveal-behind`)

Use quando a imagem consolida o que o texto já disse. Se ainda falta
explicar, fique em `guide-voice` até a explicação caber sem a cena.

## Como o agente escolhe

O story-writer marca `necessidade_de_imagem`. O implementer mapeia:

- `nenhuma` → `guide-voice`
- `cena_completa` → `story-panel` (nunca misturar com título Fredoka longo)
- `personagem_isolado` → retrato no guia (`PlatoGuide`), não no quadro

Não copie CSS protegido para dentro da lição. Importe o módulo compartilhado.

## `named-concept`

Toda palavra grega nomeada (periagōgē, dóxa, e as que vierem depois) usa três
momentos em `guide-voice`. Não invente cartão de dicionário nem exercício de
aplicação. A palavra entra **quando o gesto da história já aconteceu**, não
num lugar fixo da lição.

O aluno precisa reconhecer essa tela como inserção conceitual, sem perder o
Folio. Use `tone="concept"` em `PhilooFolioVoice` e `moment="concept"` no
`PhilooFolioStage`: a barra da caixa fica dourada (`#d9a441`), não o ciano da
história nem o laranja da voz do prisioneiro. O eyebrow diz “Momento da
palavra”. O quadro 16:9 e o botão azul continuam iguais.

1. **A palavra** — grego, som, o que ela significa nesta história.
2. **Esta cena** — o que acabou de acontecer, comparado à palavra.
3. **Agora** — um paralelo contemporâneo que *mostra a estrutura*.

Nunca: como aplicar no dia a dia, cinco passos, lição de casa, receitas de
mindset. Trazer para o presente já basta; o aluno que quiser praticar vai
praticar sozinho.

O paralelo mostra a mesma forma, não um dilema moral. Periagōgē: olhar para o
lugar errado (rumor, recorte de vídeo, feed de um lado só); virar custa porque
o mundo antigo ainda parece mais confortável. Dilemas éticos (carro autônomo)
ficam para ética / *O Retorno*.

Referência viva: `/aula/a-subida/periagoge`. A Lição 1 (`/aula/as-sombras/doxa`)
ainda não segue este padrão; quando for revisitada, use os mesmos três momentos.

## `reward`

Tela de fim de capítulo, no padrão de As Sombras (`cave-first-doubt-scene`)
e A Subida (`a-decisao`, último beat): pontos, distintivo, takeaways, um
destino que existe. Implementação local em CSS da lição, não cópia de CSS
protegido da biblioteca. Sem rota inventada: se a próxima aula não existe,
o destino é `/inicio`.

