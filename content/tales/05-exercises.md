# Tales de Mileto — Contrato de exercícios

**Agente:** exercise-designer  
**Base:** `content/tales/02-story.md`, `content/tales/03-engagement-review.md`,  
`docs/reference/EXERCISE_SELECTION.md`, `docs/reference/SCALABLE_CONTENT_SYSTEM.md`,  
`docs/reference/PHILOSOPHER_LESSON.md`, `docs/reference/FOLIO_LAYOUT_CONTRACT.md`,  
`src/domains/lesson-library/exercise-catalog.ts`,  
`src/domains/lesson-library/select-exercises.ts`.

**Passo 4 (mechanic-ideator):** pulado. Os três `thinkingMove` já têm motor publicado.

---

## `selectExercisesForChapter` (resultado)

**Beats**

| beatId | thinkingMove | Motor publicado que casa |
|--------|----------------|--------------------------|
| `5.1` | `classify` | **EX-05** `GuidedClassificationExercise` (`any-lesson`, foundation) |
| `5.2` | `compare-models` | **EX-06** `PredictionConsequence` (`any-lesson`, candidate) |
| `6.1` | `pair-connect` | **EX-09** `PhilooPairConnect` (`any-lesson`, candidate) |

EX-07 e EX-08 fora (`avoid-by-default`; humano não pediu).  
EX-01, EX-02, EX-04: `publicExport` nulo ou gesto errado. Não entram.

**`recentExerciseIds` da jornada da Caverna** (As Sombras, A Subida, O Retorno):

`EX-01`, `EX-02`, `EX-03`, `EX-04`, `EX-05`, `EX-06` (As Sombras, predição),  
`EX-09`, `EX-06` (A Subida),  
`EX-10`, `EX-06`, `EX-11` (O Retorno).

Cada gesto tem **um** motor elegível. A penalidade de recência não troca o gesto.

| pick | exerciseId | score (aprox.) | nota |
|------|------------|----------------|------|
| 5.1 | EX-05 | 10 | 1 uso recente (As Sombras); foundation + `any-lesson` |
| 5.2 | EX-06 | 3 | 3 usos recentes; ainda é o único `compare-models` publicado |
| 6.1 | EX-09 | 9 | 1 uso recente (A Subida) |

**Resultado:** `ok: true`. `picks.length === 3`. **`trimRequired`: false.**

Não voltar ao story-writer. Não inventar motor.

---

## Regras transversais

1. **Importar** de `@/domains/lesson-library`. Não copiar JSX/CSS da Caverna.
2. **Continuar do Folio** (`action`) só depois do acerto. Nunca Continuar cinza.
3. **Erro sem punição.** “Ainda não é isso.” Retry imediato. Sem vidas, sem culpa.
4. **Tales fora do tabuleiro.** Voz (`PhilooFolioVoice`) + coluna esquerda do `PhilooActivityBriefing`. Nunca PNG do guia na mesa, nos fios ou nas cartas. Não usar `getGuidedClassificationGuide("plato")`. O campo `guide` do EX-05 fica **omitido**.
5. **Como jogar** = passos do motor (não reescrever). **Por que nesta cena** = `purpose` abaixo.
6. Copy do aluno **sem travessão**. Sem átomos, ar, *ápeiron*, Big Bang, “ele é ingênuo”.
7. Alvos ≥ 44 px. Cartão no miolo do Folio. Sem rolagem de página.

---

## Beat 5.1 — EX-05 · Cara, pergunta, resposta

**Título de tela:** Cara, pergunta, resposta  
**Rail:** estágio 5  
**`publicExport`:** `GuidedClassificationExercise`  
**Import:** `GuidedClassificationExercise`, `type GuidedClassificationConfig`, `GUIDED_CLASSIFICATION_SCHEMA_VERSION`

### Purpose desta cena

Nesta cena a cara das coisas, a pergunta da arché e a resposta da água não são a mesma coisa.

### Passos do motor (não reescrever)

1. Ver o exemplo resolvido (três frases já classificadas).  
2. Arrastar o cartão ou tocar nele e escolher um cesto.  
3. Conferir. Cartões no cesto errado voltam; os certos ficam. Sem penalidade.  
4. Continuar do Folio só quando os três cestos estiverem certos.

### Por que EX-05

O aluno separa **três tipos de frase** depois de um exemplo. Não são dois modelos (EX-06) nem uma cadeia (EX-03).

### Categorias

| id | label | hint | tone | icon | correctionHint |
|----|-------|------|------|------|----------------|
| `cara` | Cara | O que se vê na superfície. | `blue` | `eye` | Isso descreve a cara das coisas, não a pergunta nem a resposta. |
| `pergunta` | Pergunta | O começo e o fundo. | `lavender` | `question` | Isso pergunta pelo princípio. Ainda não é a água. |
| `resposta` | Resposta | O que Tales diz que é. | `apricot` | `brain` | Isso é a resposta dele: a água. Não é o nome da pergunta. |

### Exemplo resolvido (tema diferente do desafio)

O exemplo **não** fala do porto nem da mesa. Serve só para mostrar os três cestos.

- **eyebrow:** Exemplo resolvido  
- **title:** Três jeitos de ouvir uma frase  
- **introductionTitle:** Primeiro, veja a diferença entre os três cestos.  
- **introductionBody:** Estas frases não entram no desafio. São só para treinar o olho.  
- **continueLabel:** Separar as frases do porto  

| categoryId | statement | explanation |
|------------|-----------|-------------|
| `cara` | A pedra no sol parece seca. | Use quando a frase só descreve a cara, o que aparece. |
| `pergunta` | De que a pedra e o rio são, no fundo? | Use quando alguém pergunta pelo começo e pelo fundo. |
| `resposta` | Alguém diz: o princípio é a água. | Use quando a frase já escolhe uma resposta, não só pergunta. |

### Prompt

- **title:** Coloque cada frase no cesto certo.  
- **instruction:** Arraste o cartão ou toque nele e escolha um cesto.  
- **selectedInstruction:** Escolha um cesto para esta frase.  
- **idleInstruction:** Continue separando cara, pergunta e resposta.

### Cartões (desafio) e gabarito

Seis frases, duas por cesto. Vocabulário da história (cais, ânfora, mesa).

| id | text | answer |
|----|------|--------|
| `anfora-seca` | A ânfora está seca por fora. | `cara` |
| `mudam-cara` | No cais as coisas mudam de cara. | `cara` |
| `de-que-fundo` | De que tudo isso é, no fundo? | `pergunta` |
| `fundo-comum` | Existe um começo e um fundo comum? | `pergunta` |
| `principio-agua` | O princípio é a água. | `resposta` |
| `chao-agua` | A terra se apoia sobre água. | `resposta` |

### Feedback (não punitivo)

- **initial:** Escolha uma frase para começar.  
- **correctPlacement:** Esse cesto combina com o que a frase está fazendo.  
- **successTitle:** Você separou os três.  
- **successBody:** Cara no cais, pergunta da arché, resposta da água. Não são a mesma coisa.  
- **retryTitle:** Revise {count} {items}.  

Pistas de cesto (`correctionHint` acima): explicar o **tipo**, nunca “você confundiu”.

### Labels e mesa

- **itemSingular / itemPlural:** frase / frases  
- **progressLabel:** frases organizadas  
- **check:** Conferir  
- **trayTitle:** Frases do porto  
- **dropCue:** colocar  
- **placeHere:** Colocar aqui  
- **emptyDestination:** Ainda sem frases  
- **mobileQuestion:** Que tipo de frase é esta?

(Restante da `table`: mesmo padrão de `cave-evidence-sort-config.ts`, trocando “pista” por “frase” e “bolso” por “cesto”.)

### Briefing Folio

- **title:** Três cestos  
- **purpose:** o purpose desta cena (acima).  
- **startLabel:** Separar as frases  
- **steps:** os quatro passos do motor.  
- Guia: Tales na coluna esquerda, se o asset isolado existir. Sem Platão.

### Folio

`action={undefined}` até `evaluateGuidedClassification(...).completedCorrectly`.  
**actionLabel** depois do acerto: Continuar (para o beat 5.2).

---

## Beat 5.2 — EX-06 · Não é um copo

**Título de tela:** Não é um copo  
**Rail:** estágio 5  
**`publicExport`:** `PredictionConsequence`  
**Variante:** **evidence-to-model** (igual ao Retorno, beat 4). A evidência já está dada; o aluno escolhe qual modelo a explica. Não é teste diagnóstico (não inventar terceira observação). Não é EX-08.

### Purpose desta cena

Há dois jeitos de ouvir a tese da água. Só um casa com o que Tales acabou de contar.

### Passos do motor (não reescrever)

1. Ler a evidência. Os dois modelos estão à vista como alternativas.  
2. Tocar na alternativa e em Confirmar.  
3. Se não for essa, o motor avisa e libera outra escolha na hora (`unlockOnMiss`). Sem penalidade.  
4. Continuar do Folio só no acerto.

### Por que EX-06

Dois modelos concorrentes. Não são três gavetas (já foi o 5.1) nem pares (6.1).

### Evidência (fenômeno observado)

Texto do prompt (imagem opcional: reusar o quadro 3.3, terra sobre água. Sem laboratório, sem fórmula):

A ânfora está seca por fora. A terra parece firme. Tales ainda diz que o princípio é a água. Qual jeito de ouvir isso casa com o que ele contou?

### Modelos (alternativas) e gabarito

| value | label | gabarito |
|-------|-------|----------|
| `molhado-agora` | Tudo está molhado agora. | errado |
| `origem-fundo` | A água é origem e fundo, mesmo do que parece seco. | **certo** |

Só estes dois. Sem carta “ele é ingênuo”. Sem química escolar.

Props:

- `match`: `origem-fundo`  
- `unlockOnMiss`: `true`  
- `retryWhen`: `"unmatched"`  
- `confirmLabel`: Confirmar  
- `retryLabel`: Confirmar  
- `matchedStatus`: Você acertou  
- `unmatchedStatus`: Ainda não é isso  

### Feedback

- **matchedFeedback:** É isso. Ele não disse que o mundo é um copo cheio. Disse origem e fundo, inclusive do que parece seco.  
- **unmatchedFeedback:** Esse jeito transforma a tese num copo. Ele falou de origem e fundo, não de tudo molhado agora. Tente de novo.

`onCommit`: `setExerciseReady(matched)` apenas. Erro não libera Continuar.

### Briefing Folio

- **title:** Dois jeitos de ouvir  
- **purpose:** o purpose desta cena.  
- **startLabel:** Escolher um jeito  
- **steps:** os quatro passos do motor.  
- Guia: Tales só no modal e na voz.

### Folio

Continuar só com `origem-fundo` confirmado.  
**actionLabel:** Continuar (para o estágio 6).

---

## Beat 6.1 — EX-09 · Variedade, mesmo gesto

**Título de tela:** Variedade, mesmo gesto  
**Rail:** estágio 6  
**`publicExport`:** `PhilooPairConnect`

### Purpose desta cena

Cada cara ainda pode ser ligada ao mesmo tipo de pergunta, não a um fundo diferente para cada coisa.

### Passos do motor (não reescrever)

1. Ligar cada pílula da esquerda a uma da direita (arrastar o fio ou tocar os dois nós).  
2. Ligar todas antes de Conferir.  
3. Conferir. Só as ligações erradas se soltam. Sem penalidade.  
4. Continuar do Folio só quando o mapa estiver certo.

### Por que EX-09

Pares ideia–exemplo / nome–sentido. Não é ordem causal (EX-03) nem pirâmide (EX-11). Não é quiz de grego decorativo: arché aparece **uma** vez, como tipo de pergunta já nomeada na história.

### Prompt

Ligue cada cara ao tipo de gesto.

### Itens e gabarito

Pílulas curtas (contrato EX-09: não esticar na largura do card). Quatro pares: porto, palavra, resposta, mesa de agora.

**Esquerda (`sources`)**

| id | label |
|----|-------|
| `cais` | Muitas caras no cais |
| `fundo` | Um começo e um fundo |
| `agua` | Eu digo que é a água |
| `mesa` | Pão, fruta, suco |

**Direita (`targets`)**

| id | label |
|----|-------|
| `superficie` | Variedade na superfície |
| `arche` | A pergunta da arché |
| `resposta` | A resposta, não a pergunta |
| `mesma-forma` | A mesma forma agora |

**`matches`**

```
cais → superficie
fundo → arche
agua → resposta
mesa → mesma-forma
```

Não ligar cada cara a um princípio novo. Não abrir átomos, ar ou *ápeiron*.

### Feedback

- **checkLabel:** Conferir  
- **successTitle:** O gesto é o mesmo.  
- **successBody:** Caras diferentes. A pergunta pelo fundo é uma só. A água é a resposta dele, não o nome da pergunta.  
- **retryBody:** Algumas ligações ainda não combinam. Elas se soltaram para você rever.  
- **activityLabel:** Ligue cada ideia da esquerda com a da direita  

### Briefing Folio

- **title:** Ligar as caras  
- **purpose:** o purpose desta cena.  
- **startLabel:** Ligar os pares  
- **steps:** os quatro passos do motor.  
- Demo: `PhilooPairConnectDemonstration` (mecânica), não conteúdo de Tales.  
- Guia: Tales só no modal e na voz. Fora do tabuleiro de fios.

### Folio

`onComplete` → Continuar visível. `onIncomplete` → Continuar some de novo.  
Conferir visível **sem** rolagem interna do card.  
**actionLabel:** Continuar (para o gancho 6.2). Sem rota da aula seguinte.

---

## O que o implementer não faz

- Não colar Tales no panorama nem no tabuleiro.  
- Não reabrir Platão como narrador.  
- Não usar EX-07, EX-08, EX-10, EX-11 nesta aula.  
- Não criar `.module.css` local do cartão / Conferir.  
- Não traduzir arché por átomo, partícula, energia ou Big Bang.  
- Recompensa 6.3 e destino `/inicio` já estão no roteiro; este arquivo não os redesenha.

---

## Checklist

- [x] `ok: true`, três EX, `trimRequired: false`  
- [x] EX-07 e EX-08 fora  
- [x] Copy PT-BR, gabarito, feedback não punitivo  
- [x] Continuar só no acerto  
- [x] Guia fora do tabuleiro  
- [x] Sem JSX neste arquivo  
