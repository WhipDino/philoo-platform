# Heráclito de Éfeso — Contrato de exercícios

**Agente:** exercise-designer  
**Base:** `content/heraclitus/01-philosophy.md` (sem `02-story.md` ainda),  
`docs/reference/EXERCISE_SELECTION.md`, `docs/reference/SCALABLE_CONTENT_SYSTEM.md`,  
`docs/reference/PHILOSOPHER_LESSON.md`, `docs/reference/FOLIO_LAYOUT_CONTRACT.md`,  
`content/tales/05-exercises.md`,  
`src/domains/lesson-library/exercise-catalog.ts`,  
`src/domains/lesson-library/select-exercises.ts`.

**Passo 4 (mechanic-ideator):** pulado. Os dois `thinkingMove` já têm motor publicado.

**Nota de roteiro:** o dossiê fixa **dois** exercícios no estágio 5 (`Praticar o fluxo`). EX-09
(`pair-connect`) serviria a um terceiro beat de ligação oposto–exemplo, mas ficaria fora do
tamanho desta aula. Se o story-writer abrir um terceiro gesto no estágio 5, reavaliar EX-09.

---

## `selectExercisesForChapter` (resultado)

**Beats**

| beatId | thinkingMove | Motor publicado que casa |
|--------|----------------|--------------------------|
| `5.1` | `classify` | **EX-05** `GuidedClassificationExercise` (`any-lesson`, foundation) |
| `5.2` | `compare-models` | **EX-06** `PredictionConsequence` (`any-lesson`, candidate) |

EX-07 e EX-08 fora (`avoid-by-default`; humano não pediu).  
EX-09: gesto válido (`pair-connect`), mas **cortado** porque a aula leva só dois EX.  
EX-01, EX-02, EX-04, EX-10: `publicExport` nulo ou gesto errado (dual-lens pede duas artes
da mesma cena; aqui o gesto é classificar e comparar modelos, não wipe).  
EX-03, EX-11: ordem causal / peso; os itens **coexistem** (aparência + nome + fluxo), não
empilham peso nem formam cadeia A→B→C.

**`recentExerciseIds` da jornada** (As Sombras, A Subida, O Retorno, Tales):

`EX-01`, `EX-02`, `EX-03`, `EX-04`, `EX-05`, `EX-06` (As Sombras),  
`EX-09`, `EX-06` (A Subida),  
`EX-10`, `EX-06`, `EX-11` (O Retorno),  
`EX-05`, `EX-06`, `EX-09` (Tales).

Cada gesto tem **um** motor elegível. A penalidade de recência não troca o gesto.

| pick | exerciseId | score (aprox.) | nota |
|------|------------|----------------|------|
| 5.1 | EX-05 | 7 | 2 usos recentes (As Sombras, Tales); foundation + `any-lesson` |
| 5.2 | EX-06 | 3 | 4+ usos recentes; ainda é o único `compare-models` publicado |

**Parâmetros:** `targetCount: 2` (dossiê: dois exercícios no estágio 5).

**Resultado:** `ok: true`. `picks.length === 2`. **`trimRequired`: false.**

Não voltar ao story-writer. Não inventar motor.

---

## Regras transversais

1. **Importar** de `@/domains/lesson-library`. Não copiar JSX/CSS da Caverna nem de Tales.
2. **Continuar do Folio** (`action`) só depois do acerto. Nunca Continuar cinza.
3. **Erro sem punição.** “Ainda não é isso.” Retry imediato. Sem vidas, sem culpa.
4. **Heráclito fora do tabuleiro.** Voz (`PhilooFolioVoice`) + coluna esquerda do
   `PhilooActivityBriefing`. Nunca PNG do guia na mesa, nos cestos ou nas cartas. Não usar
   `getGuidedClassificationGuide("plato")`. O campo `guide` do EX-05 fica **omitido**.
5. **Como jogar** = passos do motor (não reescrever). **Por que nesta cena** = `purpose` abaixo.
6. Copy do aluno **sem travessão**. Sem nomear Tales, Parmênides, Demócrito. Sem “tudo é fogo”
   como palavra-conceito (já foi `panta rhei` no estágio 4).
7. Alvos ≥ 44 px. Cartão no miolo do Folio. Sem rolagem de página.

---

## Beat 5.1 — EX-05 · Aparência, nome, fluxo

**Título de tela:** Aparência, nome, fluxo  
**Rail:** estágio 5  
**`publicExport`:** `GuidedClassificationExercise`  
**Import:** `GuidedClassificationExercise`, `type GuidedClassificationConfig`, `GUIDED_CLASSIFICATION_SCHEMA_VERSION`

### Purpose desta cena

O que parece parado, o que ainda chamamos de mesmo e o que flui de verdade não são a mesma
coisa.

### Passos do motor (não reescrever)

1. Ver o exemplo resolvido (três frases já classificadas).  
2. Arrastar o cartão ou tocar nele e escolher um cesto.  
3. Conferir. Cartões no cesto errado voltam; os certos ficam. Sem penalidade.  
4. Continuar do Folio só quando os três cestos estiverem certos.

### Por que EX-05

Depois do rio e de *panta rhei*, o aluno separa **três tipos de frase**: aparência fixa,
continuidade de nome, fluxo real. Não são dois modelos concorrentes (EX-06) nem pares soltos
(EX-09). A frase “mesmo rio” no desafio cai no cesto **Ainda o mesmo** (nome/leito), não em
**O que flui** (águas novas): esse contraste prepara o 5.2.

### Categorias

| id | label | hint | tone | icon | correctionHint |
|----|-------|------|------|------|----------------|
| `aparencia` | Aparência | O que parece parado ou fixo agora. | `blue` | `eye` | Isso descreve a cara, o que parece. Ainda não é o nome nem o fluxo. |
| `mesmo` | Ainda o mesmo | O que continuamos a chamar igual. | `lavender` | `anchor` | Isso fala do nome ou do leito que ainda reconhecemos. A água em si flui. |
| `flui` | O que flui | O que muda de fato a cada instante. | `apricot` | `waves` | Isso é o movimento real: água nova, corpo, estação. Não é só a cara nem só o nome. |

### Exemplo resolvido (tema diferente do desafio)

O exemplo **não** fala do Caystro nem do cais. Serve só para mostrar os três cestos.

- **eyebrow:** Exemplo resolvido  
- **title:** Três jeitos de ouvir “o mesmo”  
- **introductionTitle:** Primeiro, veja a diferença entre os três cestos.  
- **introductionBody:** Estas frases não entram no desafio. São só para treinar o olho.  
- **continueLabel:** Separar as frases do rio  

| categoryId | statement | explanation |
|------------|-----------|-------------|
| `aparencia` | O dia parece claro e parado. | Use quando a frase só descreve o que aparece agora. |
| `mesmo` | Ainda dizemos: é o mesmo sol. | Use quando falamos do nome ou do que reconhecemos como continuando. |
| `flui` | A luz muda a cada hora. | Use quando a frase aponta o que se move ou se renova de fato. |

### Prompt

- **title:** Coloque cada frase no cesto certo.  
- **instruction:** Arraste o cartão ou toque nele e escolha um cesto.  
- **selectedInstruction:** Escolha um cesto para esta frase.  
- **idleInstruction:** Continue separando aparência, nome e fluxo.

### Cartões (desafio) e gabarito

Seis frases, duas por cesto. Vocabulário de Éfeso, rio e paralelo leve (sem feed longo).

| id | text | answer |
|----|------|--------|
| `pedra-parada` | A pedra do cais parece parada. | `aparencia` |
| `templo-fixo` | De longe o templo parece fixo. | `aparencia` |
| `rio-caystro` | Ainda chamamos de rio Caystro. | `mesmo` |
| `leito-pedra` | É o mesmo leito de pedra. | `mesmo` |
| `aguas-novas` | Estas águas nunca passaram aqui antes. | `flui` |
| `entra-duas-vezes` | Quem entra duas vezes encontra água nova. | `flui` |

### Feedback (não punitivo)

- **initial:** Escolha uma frase para começar.  
- **correctPlacement:** Esse cesto combina com o que a frase está fazendo.  
- **successTitle:** Você separou os três.  
- **successBody:** Aparência no cais, nome do rio, água que flui. Três gestos, não um só.  
- **retryTitle:** Revise {count} {items}.  

Pistas de cesto (`correctionHint` acima): explicar o **tipo**, nunca “você confundiu”.

### Labels e mesa

- **itemSingular / itemPlural:** frase / frases  
- **progressLabel:** frases organizadas  
- **check:** Conferir  
- **trayTitle:** Frases do rio  
- **dropCue:** colocar  
- **placeHere:** Colocar aqui  
- **emptyDestination:** Ainda sem frases  
- **mobileQuestion:** Que tipo de frase é esta?

(Restante da `table`: mesmo padrão de `tales-classification-config.ts`, trocando “porto” por
“rio” e rótulos de cesto.)

### Config outline (implementer)

```typescript
export type HeraclitusBasketId = "aparencia" | "mesmo" | "flui";

export const HERACLITUS_CLASSIFICATION_CONFIG = {
  id: "heraclitus-aparencia-mesmo-flui-v1",
  schemaVersion: GUIDED_CLASSIFICATION_SCHEMA_VERSION,
  // workedExample, prompt, categories, cards, feedback, labels, table
  // conforme tabelas acima; guide omitido
} satisfies GuidedClassificationConfig<HeraclitusBasketId>;
```

### Briefing Folio

- **title:** Três cestos  
- **purpose:** o purpose desta cena (acima).  
- **startLabel:** Separar as frases  
- **steps:** os quatro passos do motor.  
- Guia: Heráclito na coluna esquerda (`identity-anchor` ou pose de ensino), se existir. Sem
  Platão.

### Folio

`action={undefined}` até `evaluateGuidedClassification(...).completedCorrectly`.  
**actionLabel** depois do acerto: Continuar (para o beat 5.2).

---

## Beat 5.2 — EX-06 · O mesmo rio

**Título de tela:** O mesmo rio  
**Rail:** estágio 5 (segundo exercício, mesma etapa ou sub-beat conforme roteiro)  
**`publicExport`:** `PredictionConsequence`  
**Variante:** **evidence-to-model** (igual Tales 5.2 e Retorno beat 4). A evidência já está
dada; o aluno escolhe qual modelo a explica. Não é teste diagnóstico. Não é EX-08.

### Purpose desta cena

Há dois jeitos de ouvir “o mesmo rio”. Só um combina com o que Heráclito acabou de mostrar.

### Passos do motor (não reescrever)

1. Ler a evidência. Os dois modelos estão à vista como alternativas.  
2. Tocar na alternativa e em Confirmar.  
3. Se não for essa, o motor avisa e libera outra escolha na hora (`unlockOnMiss`). Sem penalidade.  
4. Continuar do Folio só no acerto.

### Por que EX-06

Dois modelos concorrentes sobre o **mesmo fenômeno** (entrar no rio duas vezes). Não são três
cestos (já foi o 5.1). EX-09 ligaria pares, mas não confronta modelos. EX-10 pediria duas lentes
visuais da mesma cena; aqui basta texto + opcional imagem 16:9 do rio.

### Evidência (fenômeno observado)

Texto do prompt (imagem opcional: cena 3 do dossiê, rio Caystro 16:9. Sem laboratório):

Você entra no rio hoje e amanhã de novo. A água é outra. Ainda dizemos: é o mesmo rio. Qual
jeito de ouvir isso combina com o que Heráclito contou?

### Modelos (alternativas) e gabarito

| value | label | gabarito |
|-------|-------|----------|
| `agua-parada` | É literalmente a mesma água parada no lugar. | errado |
| `nome-aguas-novas` | O mesmo nome e leito, mas águas sempre novas. | **certo** |

Só estes dois. Sem carta “Parmênides estava certo”. Sem química escolar.

Props:

- `match`: `nome-aguas-novas`  
- `unlockOnMiss`: `true`  
- `retryWhen`: `"unmatched"`  
- `confirmLabel`: Confirmar  
- `retryLabel`: Confirmar  
- `matchedStatus`: Você acertou  
- `unmatchedStatus`: Ainda não é isso  

### Feedback

- **matchedFeedback:** É isso. O rio continua no nome e no leito. A água que passa é sempre outra.  
- **unmatchedFeedback:** Esse jeito congela a água. Heráclito disse o contrário: mesmo rio,
  águas novas. Tente de novo.

`onCommit`: `setExerciseReady(matched)` apenas. Erro não libera Continuar.

### Config outline (implementer)

```typescript
// beat.kind === "prediction"
{
  kind: "prediction",
  imageKey: "rioCaystro", // opcional; asset do estágio 3
  prompt: "Você entra no rio hoje e amanhã de novo. ...",
  choices: [
    { value: "agua-parada", label: "É literalmente a mesma água parada no lugar." },
    { value: "nome-aguas-novas", label: "O mesmo nome e leito, mas águas sempre novas." },
  ],
  match: "nome-aguas-novas",
  unlockOnMiss: true,
  retryWhen: "unmatched",
  confirmLabel: "Confirmar",
  retryLabel: "Confirmar",
  matchedStatus: "Você acertou",
  unmatchedStatus: "Ainda não é isso",
  matchedFeedback: "...",
  unmatchedFeedback: "...",
  briefing: {
    title: "Dois jeitos de ouvir",
    purpose: "...",
    steps: [ /* quatro passos do motor */ ],
    startLabel: "Escolher um jeito",
    guidePoseId: "identity-anchor", // ou pose de rio quando existir
  },
  actionLabel: "Continuar", // para estágio 6
}
```

### Briefing Folio

- **title:** Dois jeitos de ouvir  
- **purpose:** o purpose desta cena.  
- **startLabel:** Escolher um jeito  
- **steps:** os quatro passos do motor.  
- Guia: Heráclito só no modal e na voz.

### Folio

Continuar só com `nome-aguas-novas` confirmado.  
**actionLabel:** Continuar (para o estágio 6, gancho “E o que fica?”).

---

## O que o implementer não faz

- Não colar Heráclito no panorama do rio nem no tabuleiro de cestos.  
- Não reabrir Platão como narrador.  
- Não nomear Tales, Parmênides ou Demócrito.  
- Não usar EX-07, EX-08, EX-09, EX-10, EX-11 nesta aula (dois EX só).  
- Não criar `.module.css` local do cartão / Conferir.  
- Não trocar *panta rhei* por “fogo” ou “logos” nestes beats.  
- Recompensa e destino do estágio 6 ficam no roteiro; este arquivo não os redesenha.

---

## Checklist

- [x] `ok: true`, dois EX, `trimRequired: false`  
- [x] EX-07 e EX-08 fora  
- [x] EX-09 considerado e cortado (tamanho da aula)  
- [x] Copy PT-BR, gabarito, feedback não punitivo  
- [x] Continuar só no acerto  
- [x] Guia fora do tabuleiro  
- [x] Sem JSX neste arquivo  

---

## EX escolhidos

**EX-05**, **EX-06**
