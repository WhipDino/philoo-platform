# Sistema de conteúdo escalável

Philoo não escala copiando tela. Escala **importando um motor** e passando
conteúdo tipado. Com 400 aulas, mudar a cor de um cartão no CSS do motor
atualiza todas. Recriar o exercício em cada rota torna isso inviável.

## Três bibliotecas

| Biblioteca | O que guarda | Quem usa |
| --- | --- | --- |
| Exercícios | motores EX-01…EX-11, CSS protegido, briefing | implementer importa; exercise-designer escolhe |
| Personagens | poses semânticas, âncora de identidade, quando usar cada PNG | art-director e implementer |
| Acervo do aluno | eras, grupos, filósofos, capítulos, progresso | portal `/inicio?view=explore` |

Código:

- `@/domains/lesson-library`
- `@/domains/character-library`
- `@/domains/curriculum-catalog/library-catalog.ts`

Quando Tales (ou qualquer filósofo) ganhar aula, **acrescente o capítulo no
acervo** no mesmo commit das rotas. A Biblioteca do aluno não se inventa na UI.

## Como uma aula puxa um exercício

```tsx
import {
  GuidedClassificationExercise,
  PredictionConsequence,
  PhilooPairConnect,
  PhilooCausalPath,
  PhilooDecisionLayers,
  type GuidedClassificationConfig,
} from "@/domains/lesson-library";
```

A aula **não** abre `src/domains/lessons/interactions/` para copiar JSX ou CSS.
Passa `config` / props de conteúdo (frases, pares, ordem, feedback). Visual,
alvo de 44 px, Conferir, retry e Folio ficam no motor.

Se o visual precisa mudar, mude o motor (ou o token global). Não crie um
`.module.css` local “só desta aula” para o mesmo cartão.

`publicExport` no catálogo diz o nome do componente. Se for `null`, aquele EX
ainda não é template: **não** reconstrua; extraia antes ou escolha outro gesto.

## Quantos exercícios

Alvo: **dois ou três** por capítulo de filósofo (cerca de 5–7 estágios no
rail). Um só vale se o roteiro tiver um único gesto avaliável. Quatro ou mais
é corte: a história ensina, o exercício confirma.

## Qualidade primeiro, variedade depois

O exercise-designer **não** escolhe o EX favorito. Roda
`selectExercisesForChapter` em `src/domains/lesson-library/select-exercises.ts`:

1. Cada beat de exercício declara um `thinkingMove`.
2. Só entram motores com esse gesto, `reuseScope` que não seja
   `avoid-by-default`, e `publicExport` preenchido.
3. Entre os que casam, penaliza o EX usado nos capítulos recentes e dá um
   bônus pequeno ao que está há tempo sem aparecer.
4. **Nunca** troca o gesto certo por um motor faminto. Se Tales precisa
   classificar, é EX-05 mesmo que tenha saído na aula anterior.

Passe `recentExerciseIds` das aulas anteriores da mesma jornada (lidos nos
`content/<lição>/04-exercises.md` ou `05-exercises.md`). Se `trimRequired`,
volte ao story-writer e corte um beat.

## Personagens

Primeira pose isolada (chroma `#00FF00`) vira âncora. Toda pose nova entra no
catálogo **daquele** filósofo, com `whenToUse`. Platão já está em
`characterLibrary.plato`. Tales ganha `characterLibrary.thales` no mesmo
commit das imagens, não caminho de PNG solto na cena.

Daqui a dois anos, a ficha do Tales (dossiê, poses, EX usados, cidade) vive
em `content/tales/` + catálogos. Não depende do chat.

## Quais dos 11 entram no ecossistema

Não force os onze em toda aula. A Caverna **descobriu** a linguagem; o
catálogo permanente é menor.

**Reutilizáveis (ecossistema).** O pipeline pode chamar. Mudar visual aqui
é o que deve espalhar para centenas de aulas:

| Id | Quando |
| --- | --- |
| EX-05 | classificar depois de um exemplo |
| EX-06 | duas explicações / um teste |
| EX-09 | ligar pares |
| EX-03 | ordem causal no tempo |
| EX-11 | pesos que coexistem (pirâmide) |
| EX-10 | duas lentes do **mesmo** quadro |
| EX-01 | rótulo em rodadas sobre **uma** imagem |
| EX-02 | revelar regiões de **um** mecanismo |
| EX-04 | raro: o recorte mente; o quadro inteiro muda o nome |

**Fora do ecossistema.** Não use em aula nova. Não extraia para a biblioteca
estável. Não conte esses ids no “mudar a cor uma vez”:

| Id | Por quê |
| --- | --- |
| EX-07 | Tela antiga da Subida, fora do rail. O gesto cabe em EX-05 / EX-06. |
| EX-08 | Idem. A revisão visível já é o retry do EX-06 ou o reempilhar do EX-11. |

`selectExercisesForChapter` já ignora `avoid-by-default`. EX-01, EX-02 e
EX-04 só entram quando o gesto **e** a arte existirem; até terem
`publicExport`, o designer não os escolhe.

## O que falta para “mudar a cor uma vez”

EX-03, EX-05, EX-06, EX-09, EX-10 e EX-11 já têm o CSS em
`src/domains/lesson-library/activities/`. Mudar o módulo do motor atualiza
toda aula que **importa** o componente. A Caverna ainda importa pelos shims
em `lessons/interactions/`; o visual é o da biblioteca.

Ainda falta:

1. **Tokens compartilhados entre motores** (um `--ex-btn` para todos, não
   um hex por arquivo). O EX-06 já usa variáveis no próprio módulo.
2. **Proibir CSS de exercício na pasta da lição.** O validador recusa
   `.module.css` local que restaure cartão, Conferir ou briefing.
3. **Tirar copy da Caverna dos motores** (ex.: mensagens de quebra do
   caminho da sombra no EX-03 viram `config`, não `if (shadow)`).
4. **Folio** (Continuar, rail, briefing) continua no shell compartilhado.
5. **Não** incluir EX-07 e EX-08. EX-01, EX-02 e EX-04 só quando tiverem
   `publicExport`.

Não copie o CSS do motor para Tales. Importe o componente.

## O que falta para o pipeline devolver a aula pronta

O contrato e os agentes já existem. O que ainda não é “aperta e dorme”:

- Você ainda diz **quando** começar (Tales ainda não tem `content/tales/`).
- A **primeira cara** de um filósofo novo pode sair errada; o validador
  aponta, não há três variações no art-director.
- Imagens de história (Aquiles, tartaruga, cidade) dependem do MCP de
  imagem e de `dúvida` no arquivo de arte.
- O validador (passo 10) continua **depois do código**: overflow, Continuar
  cedo, travessão. Sem rotas, não há aula.
- Acervo do aluno e catálogo de poses entram **no mesmo PR** das rotas.
- Progresso, desbloqueio e login ainda são preview estático. A aula pode
  ser jogável; a plataforma ainda não “sabe” que o aluno terminou de verdade.

Quando você mandar ir, o pipeline deve devolver: dossiê, roteiro, EX
escolhidos, artes, rotas Folio, entrada na Biblioteca, testes e checagem
responsiva. Para se o gesto não existir no catálogo, se a fonte for duvidosa,
ou se o validador falhar. Não inventa EX-12.

