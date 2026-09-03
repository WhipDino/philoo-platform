# O Retorno — Contrato de exercícios

**Autor:** exercise-designer
**Base:** `02-story.md`, `04-mechanic-concepts.md` (escolha humana = lei),
`03-engagement-review.md`, `docs/reference/FOLIO_CHAPTER_PATTERNS.md`,
`docs/product/PHILOO_EXERCISE_CATALOG_V1.md`,
`docs/product/philoo-scene-template-catalog-v1.md`,
`src/domains/lesson-library/exercise-catalog.ts`.

**Escolha humana confirmada (2026-09-02):**

| Beat | Mecânica | ID |
|------|----------|----|
| 3 — A escuridão de voltar | **Lentes duplas** (motor novo) | **EX-10** |
| 4 — Os jogos de sombra | **Reusar EX-06** invertido (evidência → modelo) | EX-06 (variante) |
| 5 — A dívida com a cidade | **Camadas de uma decisão** (motor novo) | **EX-11** |

**Objetivo de biblioteca após este capítulo:** 8 exercícios reutilizáveis
(EX-03, EX-05, EX-06, EX-07, EX-08, EX-09 + EX-10 + EX-11).

Este documento é o **guia de reuso** de EX-10 e EX-11 em qualquer lição
futura (Tales, ética, etc.). Não é um parágrafo vago: um autor que nunca viu
a Caverna deve conseguir preencher só conteúdo e obter uma tela Philoo válida.

---

## Regras transversais (valem para os três beats)

1. **Continuar do Folio oculto até o acerto.** `action={canAdvance ? … :
   undefined}` em `PhilooFolioStage`. Nunca Continuar cinza. O aluno não pode
   pular a página. (FOLIO_CHAPTER_PATTERNS §Continuar; engagement-review
   item 1.)
2. **Erro sem punição.** Feedback "Ainda não é isso" (tom de A Subida).
   Nunca "você também seria gozado", nunca veredito moral, nunca vidas ou
   pontos perdidos.
3. **Retry imediato visível como ação principal.** Em EX-06 (beat 4) usar
   `unlockOnMiss` no estilo de `PredictionConsequence` de A Subida: o erro
   libera outra alternativa na hora, sem flag no rodapé. Em EX-10 e EX-11 o
   retry é parte do gesto (alternar lente / reempilhar).
4. **Platão fora do tabuleiro.** Platão só no modal "Como jogar"
   (`PhilooActivityBriefing`) e na voz (`PhilooFolioVoice`). Nunca dentro do
   quadro de exercício. (FOLIO_CHAPTER_PATTERNS §Personagens.)
5. **Alvo mínimo 44px** em todo controle tocável (lentes, alternativas,
   blocos, Conferir). 48px recomendado onde couber.
6. **Sem travessão** em copy do aluno. Ponto ou vírgula.
7. **Briefing "Como jogar"** via `PhilooActivityBriefing`: Platão na coluna
   esquerda, fundo `#f3f7fb`, sem rolagem no desktop, legenda do demo abaixo
   do exemplo, cursor e hover em todo controle.
8. **Estado serializável** exposto por cada motor (`onStateChange` /
   `initialState`) para o runtime persistir e restaurar após refresh.
9. **Sem rota de próxima aula inventada.** O capítulo fecha em `/inicio`.

---

## Beat 3 — EX-10 · Lentes duplas

### Movimento de pensamento (learning move)

Reconhecer que a **mesma cena física** pode ser vista de dois modos distintos
dependendo do estado de adaptação do observador, e atribuir a diferença a um
custo de readaptação (não a uma mudança no objeto, não a um esquecimento, não
a um fracasso pessoal). O aluno **alterna a lente** e vê a imagem mudar; ao
final escolhe qual diferença explica o tropeço.

### Por que é motor novo (não é clone)

- **Não é EX-02 (revelação progressiva de mecanismo).** EX-02 desmonta um
  mecanismo causal em sequência, revelando partes ocultas de um sistema.
  EX-10 não tem mecanismo para desmontar: há uma mesma cena sob duas óticas,
  simultâneas, sem "o que estava escondido atrás".
- **Não é EX-04 (revelação de conceito por enquadramento).** EX-04 alterna
  recorte parcial e visão total de um evento e pede revisão de interpretação.
  EX-10 não recorta nem amplia: troca a lente sobre o quadro inteiro.
- **Não é EX-01 (escolha visual em rodadas), EX-05 (classificação), EX-06
  (modelos concorrentes), EX-09 (ligação entre nós).** O gesto é alternar e
  comparar, não escolher/classificar/testar/parear.

### Quando USAR

- O aprendizado exige distinguir **duas perspectivas interpretativas sobre o
  mesmo objeto**, onde nenhuma é "a verdadeira" e a diferença está no
  observador (estado, adaptação, papel, cultura, escala de tempo).
- O reframe do capítulo depende de o aluno **ver** a imagem mudar ao trocar
  de lente, não apenas ler sobre a mudança.
- Exemplos futuros: o mesmo gesto visto como coragem ou temeridade (ética);
  o mesmo enunciado lido como descrição ou prescrição (Tales/linguagem); o
  mesmo evento histórico lido por vencedor e vencido.

### Quando NÃO USAR

- Há um mecanismo causal real para desmontar em ordem → use **EX-02**.
- Há um recorte que esconde contexto relevante → use **EX-04**.
- Há dois modelos concorrentes a testar contra previsões → use **EX-06**.
- Há duas classes de itens a parear → use **EX-09**.
- A "diferença de perspectiva" é só estética, sem artefato de raciocínio
  inspecionável → **não crie a mecânica** (regra da novidade decorativa).
- A cena inteira não cabe em duas artes comparáveis; só um detalhe varia →
  considere EX-04 restrito ao detalhe, não force EX-10.

### Contrato de configuração (campos do autor)

O autor cria **conteúdo**, nunca JSX. O motor protege UI, layout, retry,
Continuar, a11y, briefing e estado.

```ts
type DualLensConfig = {
  id: string;
  schemaVersion: "1";
  briefing: ActivityBriefingConfig;        // "Como jogar"
  prompt: string;                          // pergunta curta da tela
  scene: {
    // Duas artes da MESMA composição, sob duas óticas.
    // O autor fornece duas imagens; o motor NÃO tem geometria de hotspot.
    lensA: {
      assetId: string;                      // asset A — lente 1
      alt: string;                          // alt da imagem sob a lente A
      label: string;                        // ex.: "Olho readaptando"
      caption?: string;                     // legenda curta sob a imagem
    };
    lensB: {
      assetId: string;                      // asset B — lente 2 (mesma cena, outro estado)
      alt: string;
      label: string;                        // ex.: "Olho acostumado"
      caption?: string;
    };
    initialLens: "A" | "B";                 // qual lente abre a tela
  };
  finalQuestion: {
    text: string;                           // "O que explica o tropeço?"
    alternatives: readonly {
      id: string;
      label: string;                        // ex.: "A pedra mudou"
    }[];
    correctAlternativeId: string;           // ex.: "readaptacao"
    feedback: {
      correct: string;                      // confirma custo de readaptação
      incorrect: readonly {                 // um por alternativa errada
        alternativeId: string;
        message: string;                    // ex.: "A pedra não mudou; o olho sim."
      }[];
    };
  };
  completion: {
    transition: string;                     // rótulo do Continuar do Folio
  };
};
```

**Campos obrigatórios do autor (lista explícita):**

1. `briefing` — título, propósito, 3 passos, rótulo de início, pose de
   Platão (`activity-introduction`), demo de texto ou exemplo trabalhado.
2. `prompt` — pergunta curta da tela (uma frase).
3. `scene.lensA.assetId` e `scene.lensB.assetId` — **duas imagens da mesma
   cena** (asset A lente 1, asset B lente 2). Sem geometria de hotspot.
4. `scene.lensA.alt` e `scene.lensB.alt` — alts diferentes por estado.
5. `scene.lensA.label` e `scene.lensB.label` — rótulos das lentes.
6. `scene.initialLens` — lente que abre a tela.
7. `finalQuestion.text` — pergunta final ("O que explica o tropeço?").
8. `finalQuestion.alternatives` — alternativas de resposta.
9. `finalQuestion.correctAlternativeId` — alternativa correta.
10. `finalQuestion.feedback.correct` e `.incorrect[]` — feedback por
    alternativa, sem punição.
11. `completion.transition` — rótulo do Continuar.

**Campos opcionais:** `caption` por lente.

### O que o motor protege (não configurável)

- Layout do quadro 16:9 com a imagem da lente ativa; troca de lente por
  botão/teclado sem reconstruir a moldura.
- Controle de alternância entre lentes (toque, teclado, setas) com alvo
  mínimo 44px e estado foco visível.
- Estado inicial = `scene.initialLens`; nunca abre na "resposta".
- `PhilooActivityBriefing` com Platão na coluna esquerda, sem rolagem no
  desktop, demo com legenda abaixo do exemplo.
- Continuar do Folio **oculto** até `finalQuestion` correta.
- Retry imediato: alternativa errada mostra feedback daquela alternativa e
  mantém o aluno na escolha (não bloqueia, não conta "vidas").
- Estado serializável (ver abaixo).
- Responsividade: imagem 16:9 preservada; lentes e alternativas empilham no
  celular sem rolagem horizontal; alvos ≥ 44px; ordem cognitiva
  (lente → comparação → pergunta) mantida em todos os breakpoints.
- Acessibilidade: alts distintos por lente, foco visível, contraste de
  rótulos, redução de movimento na troca de lente (sem flash).
- Platão **fora do quadro**; só no briefing e na voz.

### Estado serializável

```ts
type DualLensState = {
  schemaVersion: "1";
  activeLens: "A" | "B";
  visits: { A: number; B: number };        // quantas vezes cada lente foi vista
  selectedAlternativeId: string | null;
  attempts: number;
  completed: boolean;
};
```

Visibilidade padrão: `system_telemetry` para `visits` e `attempts`;
`selectedAlternativeId` é `private_reflection` se o runtime coletar resposta.

### Briefing "Como jogar" (conteúdo sugerido para O Retorno)

- **Título:** "Duas lentes, uma cena"
- **Propósito:** "Veja a mesma caverna sob dois olhos. No fim, diga o que
  explica o tropeço."
- **Passos:**
  1. Alterne entre as duas lentes. Veja a imagem mudar.
  2. Compare o que cada lente mostra da mesma pedra.
  3. Escolha o que explica o tropeço. Se errar, tente de novo sem penalidade.
- **Início:** "Começar a ver"
- **Pose:** `activity-introduction`, Platão à esquerda, olha para a direita.

### Sem Platão no tabuleiro

Platão não aparece dentro do quadro 16:9 das lentes. A voz dele
(`PhilooFolioVoice`) pode anteceder o exercício no `story-panel` do beat 3,
mas no momento da atividade ele só vive no briefing.

### Como um autor de Tales/ética preenche só conteúdo

Um autor que nunca leu a Caverna abre `DualLensConfig` e substitui apenas:

- `prompt`: "O mesmo gesto é coragem ou temeridade?"
- `scene.lensA`: imagem do gesto lido como coragem, alt, label "Leitura ética".
- `scene.lensB`: imagem do mesmo gesto lido como temeridade, alt, label
  "Leitura prudencial".
- `finalQuestion`: "O que muda entre as duas leituras?" com alternativas
  ("O gesto muda", "O agente muda", "O critério de avaliação muda" etc.).
- `feedback`: por alternativa, sem punição.

O motor, o layout, o briefing, o retry, o Continuar oculto, a a11y e o
estado serializável **não mudam**. O autor não toca em JSX, CSS nem no
runtime do Folio.

### Diferença documentada para o autor futuro (vs. EX-03)

EX-03 ordena **eventos em uma cadeia causal física** (luz → objeto → sombra),
com feedback que aponta a **primeira relação quebrada**. EX-10 não ordena
nada: **alterna lentes** sobre a mesma cena e escolhe uma explicação para um
fenômeno único. O artefato de EX-10 é um par de olhares comparados; o de
EX-03 é uma cadeia ordenada. Não confunda: "duas visões da mesma coisa"
(EX-10) ≠ "ordem de causa e efeito" (EX-03).

---

## Beat 4 — EX-06 (variante evidence-to-model) · Os jogos de sombra

### Decisão

**Reusar EX-06**, não inventar irmão. O Retorno usa a **variante
evidence-to-model**: a evidência é dada (o prisioneiro erra, é lento, é
gozado, levanta a mão devagar) e o aluno escolhe qual dos dois modelos a
explica melhor. É o mesmo domínio cognitivo de EX-06 (testar modelos
concorrentes), com a **direção da prova invertida**.

### Estado atual de EX-06 no repositório

EX-06 existe **apenas como contrato no catálogo**
(`src/domains/lesson-library/exercise-catalog.ts`, id `EX-06`, status
`experiment`). A rota fonte `/aula/a-subida/duas-explicacoes` **não tem
`page.tsx`** hoje (confirmado: não há cena extraída). O implementer de O
Retorno vai construir o renderer scene-local já com suporte às duas
direções da prova, sem criar novo ID no catálogo.

### Direção original vs. direção de O Retorno

- **Direção original (model → test):** o aluno vê dois modelos concorrentes
  e escolhe uma **observação diagnóstica** capaz de fazê-los prever
  resultados diferentes. O artefato é "qual teste distingue os modelos".
- **Direção de O Retorno (evidence → model):** o aluno recebe uma observação
  (o tropeço no jogo de sombras) e escolhe qual **modelo** a explica
  melhor. O artefato é "qual explicação se sustenta diante da evidência".

O motor é o mesmo. O que muda é qual pergunta vem primeiro (teste ou modelo)
e qual o aluno escolhe.

### O que o implementer precisa estender (sem novo ID)

O contrato atual de EX-06 no catálogo lista campos para a direção
model → test. Para suportar a variante evidence-to-model em O Retorno, o
implementer deve:

1. Adicionar um campo opcional `direction: "model-to-test" | "evidence-to-model"`
   na configuração de EX-06 (default `"model-to-test"` para preservar A
   Subida). Não criar novo `kind`, novo `id` nem novo componente.
2. Em `"evidence-to-model"`, o motor recebe `evidence` (a observação dada)
   e `models` (os dois concorrentes), e pede ao aluno que escolha um modelo.
   O feedback explicativo por alternativa continua idêntico ao da direção
   original.
3. Manter `unlockOnMiss` (estilo `PredictionConsequence` de A Subida): erro
   libera outra alternativa na hora, sem flag no rodapé, sem "vidas".
4. Manter Continuar do Folio oculto até o acerto.
5. Manter o briefing "Como jogar" com Platão na coluna esquerda; o tom do
   briefing **desarma ridículo = burrice** (engagement-review §Beat 4).
6. Documentar a variante no catálogo (`exercise-catalog.ts`) como nota no
   campo `interaction` de EX-06, **sem** criar EX-06b.

### Configuração de O Retorno (preenchida em prosa + tipos)

```ts
const beat4 = {
  id: "o-retorno-jogos-de-sombra",
  schemaVersion: "1",
  kind: "competing-model-test",          // EX-06, sem novo kind
  config: {
    direction: "evidence-to-model",       // variante de O Retorno
    briefing: {
      title: "Ridículo não é burrice",
      purpose:
        "Diante do que aconteceu no jogo, escolha qual explicação se sustenta.",
      steps: [
        "Leia a observação: ele erra, é lento, é gozado.",
        "Compare os dois modelos concorrentes.",
        "Escolha o que explica melhor. Se errar, tente de novo.",
      ],
      startLabel: "Avaliar a evidência",
      guide: {
        characterId: "plato",
        poseRole: "activity-introduction",
        faces: "right",
      },
      demonstration: { kind: "text", text: "..." },
    },
    prompt: "O que explica ele perder o jogo de sombras?",
    evidence: {
      // fenômeno observado, dado ao aluno
      assetId: "o-retorno-jogos-de-sombra-cena",   // imagem do beat 4
      alt: "Prisioneiro de pé, fora do ritmo, outros rindo.",
      description:
        "Ele erra o nome da sombra. Demora. Os outros riem. Levanta a mão mais devagar.",
    },
    models: [
      {
        id: "burrice",
        label: "Ele ficou burro",
        predictionIfTrue: "Erraria qualquer coisa, em qualquer contexto.",
      },
      {
        id: "perda-de-pratica",
        label: "Ele perdeu a prática de uma habilidade específica",
        predictionIfTrue:
          "Erraria só neste jogo; fora dele, saberia o que viu lá fora.",
      },
    ],
    alternatives: [
      { id: "burrice", label: "Ele ficou burro" },
      { id: "perda-de-pratica", label: "Ele perdeu prática num jogo específico" },
    ],
    correctAlternativeId: "perda-de-pratica",
    feedback: {
      correct:
        "Ainda não é isso. Ele perdeu a prática de nomear sombras rápido. " +
        "Fora deste jogo, ele continua sabendo o que viu lá fora.",
      incorrect: [
        {
          alternativeId: "burrice",
          message:
            "Ainda não é isso. Se fosse burrice, ele erraria em qualquer " +
            "contexto. Ele só erra neste jogo específico.",
        },
      ],
    },
    completion: { transition: "Continuar" },
  },
} satisfies CompetingModelConfig;
```

### Copy proibida (engagement-review §Beat 4)

- Nunca "você também seria gozado".
- Nunca tom de vergonha social no feedback.
- Feedback de erro = "Ainda não é isso" + explicação que desloca para
  "habilidade específica", nunca para "inteligência geral".

### Pose de Platão

No briefing: `activity-introduction`, Platão à esquerda, olha para a
direita. No tabuleiro: Platão não aparece.

---

## Beat 5 — EX-11 · Camadas de uma decisão

### Movimento de pensamento (learning move)

Reconstruir a arquitetura da decisão de descer como uma **pilha de três
camadas em ordem crescente de peso estrutural**: memória dos companheiros →
custo real de readaptar os olhos → obrigação imposta pela cidade (`anankē`).
O aluno entende que o retorno não é explicado por um único motivo, mas por
uma pilha onde **o medo não some; a obrigação fica em cima**. A ordem é
**pedagógica/estrutural**, não cronológica física.

### Por que é motor novo (não é clone de EX-03)

- **EX-03 ordena eventos em uma cadeia causal física** (luz → objeto →
  sombra), com feedback que aponta a **primeira relação causal quebrada**.
- **EX-11 empilha motivos de uma decisão** em ordem de **peso estrutural**,
  com feedback que explica **qual camada está fora de lugar e por quê**,
  sem falar em "causa quebrada" no sentido físico. O artefato é uma pilha de
  razões, não uma cadeia de eventos.
- A diferença está no **feedback semântico**: EX-03 diz "esta relação causal
  não se sustenta"; EX-11 diz "esta camada tem peso diferente nesta decisão".
- **Não é EX-09 (ligação entre nós):** não há dois conjuntos a parear; há
  uma única pilha de três camadas a ordenar.
- **Não é EX-06 (modelos concorrentes), EX-05 (classificação), EX-10
  (lentes):** o gesto é empilhar, não testar/classificar/alternar.

### Quando USAR

- O aprendizado exige que o aluno veja uma decisão complexa como uma
  **estrutura de motivos em camadas**, onde a ordem importa por **peso
  estrutural** (pessoal → estrutural), não por cronologia.
- Vale a pena tornar visível que **camadas coexistem** (o medo não é
  apagado pela obrigação) e que uma camada "fica em cima" sem eliminar as
  outras.
- Exemplos futuros: decidir se denunciar algo (medo → custo social →
  dever cívico); decidir manter um compromisso (gosto → custo → obrigação
  assumida); decidir estudar algo impopular (curiosidade → custo →
  pertencimento).

### Quando NÃO USAR

- Há uma cadeia causal física para ordenar (luz → objeto → sombra) → use
  **EX-03**.
- Há dois conjuntos de ideias a parear → use **EX-09**.
- Há modelos concorrentes a testar → use **EX-06**.
- A decisão é explicável por um único motivo, sem estrutura de camadas →
  não force EX-11; use narrativa.
- A "ordem de peso" é só estética, sem artefato de raciocínio inspecionável
  → **não crie a mecânica** (regra da novidade decorativa).
- O autor quer que o aluno diga "qual motivo é o mais forte" sem mostrar a
  pilha → isso é escolha simples (EX-01/EX-06), não EX-11.

### Contrato de configuração (campos do autor)

```ts
type DecisionLayersConfig = {
  id: string;
  schemaVersion: "1";
  briefing: ActivityBriefingConfig;        // "Como jogar"
  prompt: string;                          // pergunta curta da tela
  layers: readonly {
    id: string;
    label: string;                         // ex.: "Saudade dos companheiros"
    weightNote: string;                    // ex.: "Camada pessoal, leve"
    explanation: string;                    // por que esta camada existe
  }[];
  // Ordem correta = ordem crescente de peso estrutural (não cronológica).
  correctOrder: readonly string[];          // ex.: ["memoria", "custo", "obrigacao"]
  feedback: {
    initial: string;                       // antes de Conferir
    incomplete: string;                     // faltam camadas
    correct: string;                        // pilha certa
    outOfPlace: readonly {                  // um por camada fora do lugar
      layerId: string;
      message: string;                      // ex.: "A obrigação pesa mais que a saudade."
    }[];
    fallback: string;                       // genérico não punitivo
  };
  completion: {
    transition: string;                    // rótulo do Continuar do Folio
  };
};
```

**Campos obrigatórios do autor (lista explícita):**

1. `briefing` — título, propósito, 3 passos, rótulo de início, pose de
   Platão (`activity-introduction`), demo de texto ou exemplo trabalhado.
2. `prompt` — pergunta curta da tela (uma frase).
3. `layers` — três (ou pequeno N) camadas, cada uma com `id`, `label`,
   `weightNote` e `explanation`.
4. `correctOrder` — ordem crescente de **peso estrutural**, não cronológica.
5. `feedback.initial`, `.incomplete`, `.correct`, `.outOfPlace[]`,
   `.fallback` — feedback por situação, sem punição.
6. `completion.transition` — rótulo do Continuar.

### O que o motor protege (não configurável)

- Layout da pilha empilhável (toque/teclado/arraste para reordenar), com
  alvo mínimo 44px por camada e por posição.
- Botão **Conferir** visível sem rolagem interna (padrão EX-09).
- Continuar do Folio **oculto** até a pilha estar correta.
- Feedback não punitivo: camada fora do lugar recebe `outOfPlace` que
  explica o peso, sem "não entendeu Platão".
- `PhilooActivityBriefing` com Platão na coluna esquerda, sem rolagem no
  desktop, demo com legenda abaixo do exemplo.
- Estado serializável (ver abaixo).
- Responsividade: pilha vertical em todos os breakpoints (já é empilhada
  por natureza); no celular, reordenação por toque é primária, arraste
  opcional; alvos ≥ 44px; ordem cognitiva preservada.
- Acessibilidade: foco visível por camada, contraste, redução de movimento
  na reordenação, leitura de ordem por screen reader.
- Platão **fora do tabuleiro**; só no briefing e na voz.

### Estado serializável

```ts
type DecisionLayersState = {
  schemaVersion: "1";
  positions: readonly (string | null)[];   // ordem atual das camadas
  attempts: number;
  hasChecked: boolean;
  completed: boolean;
};
```

Visibilidade padrão: `teacher_visible_task` para `positions` quando
atribuído por professor; caso contrário `derived_rubric` ou evidência local
da lição. `attempts` é `system_telemetry`.

### Briefing "Como jogar" (conteúdo sugerido para O Retorno)

- **Título:** "Camadas de uma decisão"
- **Propósito:** "Empilhe os motivos do retorno. A ordem é de peso, não de
  tempo. O medo não some; a obrigação fica em cima."
- **Passos:**
  1. Arraste ou toque para ordenar as três camadas.
  2. Conferir. Se alguma estiver fora do lugar, leia o porquê.
  3. Reempilhe até acertar. Sem penalidade.
- **Início:** "Empilhar os motivos"
- **Pose:** `activity-introduction`, Platão à esquerda, olha para a direita.

### Sem Platão no tabuleiro

Platão não aparece dentro da pilha. A voz dele (`PhilooFolioVoice`) pode
anteceder o exercício no `story-panel` + `guide-voice` do beat 5, mas no
momento da atividade ele só vive no briefing.

### Como um autor de Tales/ética preenche só conteúdo

Um autor que nunca leu a Caverna abre `DecisionLayersConfig` e substitui
apenas:

- `prompt`: "Por que denunciar algo mesmo com medo?"
- `layers`:
  - `{ id: "medo", label: "Medo de retaliação", weightNote: "Camada pessoal, leve", explanation: "..." }`
  - `{ id: "custo", label: "Custo social de romper com o grupo", weightNote: "Camada intermediária", explanation: "..." }`
  - `{ id: "dever", label: "Dever cívico de dizer a verdade", weightNote: "Camada estrutural, pesa mais", explanation: "..." }`
- `correctOrder`: `["medo", "custo", "dever"]`
- `feedback.outOfPlace`: por camada, explicando o peso relativo.

O motor, o layout, o Conferir, o Continuar oculto, a a11y e o estado
serializável **não mudam**. O autor não toca em JSX, CSS nem no runtime do
Folio.

### Diferença documentada para o autor futuro (vs. EX-03)

EX-03 = cadeia causal **física** (luz → objeto → sombra); feedback aponta a
**primeira relação causal quebrada**; o aluno aprende **causa e efeito**.
EX-11 = pilha de **motivos de uma decisão**; feedback aponta **qual camada
tem peso diferente**; o aluno aprende **arquitetura de uma decisão**, onde
camadas coexistem e a ordem é de **peso estrutural**, não cronológica. Não
reaproveite o feedback de EX-03 ("causa quebrada") em EX-11; o feedback de
EX-11 deve falar em **peso/camada**, nunca em **causa**.

---

## Entradas prontas para o catálogo (EX-10, EX-11)

Após a aula jogável, adicionar ao array `exerciseCatalog` em
`src/domains/lesson-library/exercise-catalog.ts`. Status inicial:
`experiment` (mesma regra de EX-06/EX-09: extração estável só depois de
segundo uso não relacionado).

### EX-10 — Lentes duplas

- **id:** `EX-10`
- **name:** Lentes duplas
- **status:** `experiment`
- **learningMove:** Alternar duas lentes interpretativas sobre a mesma cena
  e escolher a explicação para um fenômeno, distinguindo perspectiva de
  valor.
- **sourceRoute:** `/aula/o-retorno/a-escuridao-de-voltar` (a confirmar no
  implementer)
- **sourceLabel:** A escuridão de voltar
- **interaction:** Alternar lente por toque/teclado, comparar duas artes da
  mesma cena, responder pergunta final com retry imediato.
- **authorFields:** `briefing`, `prompt`, `lensA (assetId, alt, label,
  caption?)`, `lensB (assetId, alt, label, caption?)`, `initialLens`,
  `finalQuestion (text, alternatives, correctAlternativeId)`,
  `feedback (correct, incorrect[])`, `completion.transition`.
- **protectedBehavior:** `duas imagens da mesma cena (sem hotspot)`,
  `alternância com alvo ≥ 44px`, `Continuar oculto até acerto`, `retry
  imediato sem vidas`, `Platão fora do quadro`, `estado serializável`,
  `alts distintos por lente`, `ordem cognitiva lente → comparação → pergunta`.
- **responsiveContract:**
  - desktop: quadro 16:9 com lente ativa; lentes e alternativas em colunas.
  - tablet: lentes e alternativas comprimidas, sem rolagem interna.
  - phone: lentes e alternativas empilhadas; alvos ≥ 44px.
- **dependencies:** `React state`, `CSS Modules`, `next/image`, `Motion`
  (reduzido).

### EX-11 — Camadas de uma decisão

- **id:** `EX-11`
- **name:** Camadas de uma decisão
- **status:** `experiment`
- **learningMove:** Empilhar motivos de uma decisão em ordem crescente de
  peso estrutural, entendendo que camadas coexistem (o medo não some; a
  obrigação fica em cima).
- **sourceRoute:** `/aula/o-retorno/a-divida-com-a-cidade` (a confirmar no
  implementer)
- **sourceLabel:** A dívida com a cidade
- **interaction:** Reordenar três camadas por toque/arraste/teclado,
  Conferir, ler feedback de peso por camada, reempilhar sem penalidade.
- **authorFields:** `briefing`, `prompt`, `layers[] (id, label, weightNote,
  explanation)`, `correctOrder`, `feedback (initial, incomplete, correct,
  outOfPlace[], fallback)`, `completion.transition`.
- **protectedBehavior:** `pilha empilhável com alvo ≥ 44px`, `Conferir
  visível sem rolagem interna`, `Continuar oculto até pilha correta`,
  `feedback de peso/camada (não de causa)`, `Platão fora do quadro`,
  `estado serializável`, `ordem de peso estrutural, não cronológica`.
- **responsiveContract:**
  - desktop: pilha vertical central; Conferir abaixo.
  - tablet: pilha comprimida, Conferir visível.
  - phone: toque primário para reordenar; alvos ≥ 44px.
- **dependencies:** `React state`, `Pointer Events`, `HTML Drag and Drop`
  (opcional), `CSS Modules`.

---

## Nota de implementação

- Não criar `page.tsx` para `/aula/o-retorno/*` neste passo (é trabalho do
  implementer, depois do validator).
- EX-06 (variante evidence-to-model) e EX-10/EX-11 devem ser testados em
  segundo contexto não relacionado antes de virar `foundation`/`candidate`
  (regra do catálogo §13).
- O implementer deve validar overflow em 320px nos três beats de exercício
  (engagement-review §recomendações downstream).
- O validator deve checar takeaways da recompensa contra a tabela de riscos
  de 517a e obrigação sem culpa (engagement-review §consertos mínimos).


