# A Subida — Formalização dos exercícios

**Agente:** exercise-designer  
**Atualização:** 2026-08-31 — três exercícios novos, depois que a história mostrou o gesto. Nenhum exercício na segunda tela (o fogo). Nenhuma mecânica nova: EX-03, EX-04 (padrão do giz) e `PredictionConsequence`.

| Depois de | Movimento | Motor |
|-----------|-----------|--------|
| Ele toca a árvore | luz → objeto → sombra lá fora | `PhilooCausalPath` (EX-03) |
| O paralelo contemporâneo da periagōgē | recorte de vídeo × quadro inteiro | crop-reveal da Lição 1 / EX-04 |
| Ele tem medo de voltar | o que ele teme (ridículo) | `PredictionConsequence` |

O brief antigo (EX-05 no fogo, EX-06/07/08) **não vale** para este pass.

---

## Inventário de motores consultado

Componentes existentes em `src/domains/lessons/interactions/`:

- `philoo-activity-briefing.tsx` — briefing modal compartilhado
- `philoo-causal-path.tsx` — sequência causal (EX-03, candidato)
- `philoo-discovery-table.tsx` — mesa de classificação (base do EX-05)
- `prediction-consequence.tsx` — predição com consequência revelada
- `revision-map.tsx` — revisão de hipótese com pista decisiva
- `evidence-inspector.tsx`, `cer-response.tsx`, `confidence-control.tsx`, `transfer-classification.tsx` — disponíveis, não usados neste capítulo

Componentes estáveis em `src/domains/lesson-library/`:

- `GuidedClassificationExercise` (EX-05, foundation v1) — única engine de classificação pronta para autoria simples
- `exercise-catalog.ts` — registra EX-06, EX-07, EX-08 como experimentos do capítulo 2

---

## Nota de divergência em relação ao brief

O brief original previa EX-06 (teste entre modelos), EX-07 (horizonte de evidências) e EX-08 (revisão visível) em beats próprios (`duas-explicacoes`, `ate-onde-posso-afirmar`, `revisar-o-mundo`). O roteiro aprovado (`02-story.md`) reorganizou o capítulo em 9 beats e concentrou os exercícios em 2, 5, 6 e 8, com movimentos de pensamento que mapeiam diretamente para motores já existentes:

| Beat | Movimento (roteiro) | Motor existente | Status |
|------|---------------------|-----------------|--------|
| 2 | Classificação causa/efeito/aparência | `GuidedClassificationExercise` (EX-05) | Foundation v1 |
| 5 | Predição sob incerteza | `PredictionConsequence` | Engine de fundação |
| 6 | Caminho causal (reflexo → objeto → luz) | `PhilooCausalPath` (EX-03) | Candidato (acoplado à Caverna) |
| 8 | Revisão de modelo | `RevisionMap` | Engine de fundação |

EX-06, EX-07 e EX-08 permanecem catalogados como experimentos do capítulo, mas **não são acionados nesta sequência de beats**. Se a intenção for preservar os três experimentos como telas independentes, isso é uma decisão de produto que excede o papel do exercise-designer e deve voltar ao humano antes da implementação. O restante deste documento formaliza os quatro beats conforme o mapeamento acima.

---

## Beat 2 — Atrás da parede (classificação)

**Movimento:** classificar o que é causa, o que é efeito e o que é apenas aparência no mecanismo por trás da parede.  
**Motor:** `GuidedClassificationExercise` (EX-05).  
**Import path:** `@/domains/lesson-library` (`GuidedClassificationExercise`, `getGuidedClassificationGuide`, `type GuidedClassificationConfig`).

### Por que este motor

EX-05 é a única engine de classificação com conteúdo totalmente externalizado, estado serializável e personagem resolvido por pose semântica. O movimento do beat 2 — distinguir três categorias já visíveis na cena — é exatamente o learning move documentado do EX-05. Não há motivo para originar mecânica nova.

### Categorias (CategoryId)

Três categorias, alinhadas ao roteiro ("causa", "efeito", "aparência"):

- `causa` — o que produz o efeito visível (fogo, portadores, objetos reais).
- `efeito` — o que resulta da causa (sombras projetadas na parede).
- `aparencia` — o que o prisioneiro via antes, sem saber da causa (a "realidade" da parede).

### Estrutura de dados (forma tipada, ilustrativa)

```ts
type CategoryId = "causa" | "efeito" | "aparencia";

const config = {
  id: "a-subida-beat-2-mecanismo",
  schemaVersion: "1",
  guide: getGuidedClassificationGuide("plato"),
  workedExample: {
    eyebrow: "Exemplo resolvido",
    title: "Como classificar o que está atrás da parede",
    introductionTitle: "Antes de começar, veja um exemplo diferente",
    introductionBody:
      "Use este exemplo para entender os três rótulos. Ele não fala da caverna.",
    items: [
      {
        categoryId: "causa",
        statement: "A lâmpada acesa emite luz.",
        explanation: "A lâmpada é a fonte; sem ela, nada seria visível.",
      },
      {
        categoryId: "efeito",
        statement: "O círculo de luz aparece na parede.",
        explanation: "O círculo existe porque a luz incide sobre algo.",
      },
      {
        categoryId: "aparencia",
        statement: "Parece que há um disco branco flutuando.",
        explanation: "A leitura imediata descreve aparência, não causa.",
      },
    ],
    continueLabel: "Classificar o mecanismo da caverna",
  },
  prompt: {
    title: "O que existe atrás da parede?",
    instruction:
      "Coloque cada carta na categoria que melhor descreve seu papel no mecanismo.",
    selectedInstruction: "Escolha um destino para esta carta.",
    idleInstruction: "Selecione uma carta para começar.",
  },
  categories: [
    {
      id: "causa",
      label: "Causa",
      hint: "O que produz o que se vê.",
      icon: "brain",
      tone: "blue",
      correctionHint:
        "Pergunte: sem isto, o efeito aconteceria? Se a resposta for não, é causa.",
    },
    {
      id: "efeito",
      label: "Efeito",
      hint: "O que resulta da causa.",
      icon: "eye",
      tone: "apricot",
      correctionHint:
        "Pergunte: isto aparece porque algo o produz? Se sim, é efeito.",
    },
    {
      id: "aparencia",
      label: "Aparência",
      hint: "O que parecia ser antes de saber da causa.",
      icon: "question",
      tone: "lavender",
      correctionHint:
        "Pergunte: isto descreve a leitura imediata, sem explicar? Se sim, é aparência.",
    },
  ],
  cards: [
    { id: "c1", text: "O fogo alto atrás da parede", answer: "causa" },
    { id: "c2", text: "As pessoas que carregam objetos", answer: "causa" },
    { id: "c3", text: "Os objetos reais sendo transportados", answer: "causa" },
    { id: "c4", text: "As sombras projetadas na parede da caverna", answer: "efeito" },
    { id: "c5", text: "As figuras que o prisioneiro chamava de realidade", answer: "aparencia" },
  ],
  feedback: {
    initial: "Organize o mecanismo: o que causa, o que resulta e o que apenas parecia.",
    correctPlacement: "Essa carta está no lugar certo.",
    successTitle: "O mecanismo ficou visível",
    successBody:
      "A sombra deixou de ser um fato isolado e ganhou uma história: causa, efeito e aparência agora têm papéis distintos.",
    retryTitle: "Há cartas para revisar",
  },
  labels: {
    itemSingular: "carta",
    itemPlural: "cartas",
    progressLabel: "Cartas classificadas",
    check: "Verificar classificação",
  },
  table: {
    /* preencher copy de mesa conforme PhilooDiscoveryTable; linguagem neutra,
       sem termos acoplados à Caverna além do necessário ao exemplo. */
  },
} satisfies GuidedClassificationConfig<CategoryId>;
```

### Estado salvo

`GuidedClassificationState` (placements em `teacher_visible_task` quando atribuído por professor; caso contrário, `derived_rubric`). Acknowledgement do exemplo em `system_telemetry`.

### Tom de feedback (não punitivo)

- Nunca dizer "errou". Cartas mal colocadas recebem `correctionHint` como pergunta, não como verdict.
- `retryTitle` nomeia o que revisar sem expor o aluno.
- Sucesso é calmo e conceitual ("o mecanismo ficou visível"), sem celebração agressiva.

### Notas de engajamento (de `03`)

- Autonomia alta: o aluno organiza o que viu (engagement review, §"Beat 2").
- Competência imediata com suporte visual — primeiro movimento de pensamento ativo do capítulo.
- Risco mitigado: garantir que os três rótulos estejam definidos no exemplo resolvido antes do arraste (evita frustração desnecessária).
- Ancora retrieval para os beats 5 e 6.

### Pose do personagem

`getGuidedClassificationGuide("plato")` resolve pose role `guided-classification`, personagem à esquerda, voltado para a direita, apontando para cartões/destinos. Não gerar nova pose; reutilizar o preset aprovado.

---

## Beat 5 — Sombras lá fora (predição sob incerteza)

**Movimento:** propor o que aquela sombra externa pode ser, sem saltar para conclusão que ainda não cabe na evidência. Incerteza é resultado válido.  
**Motor:** `PredictionConsequence`.  
**Import path:** `@/domains/lessons/interactions/prediction-consequence` (componente `PredictionConsequence`, tipos `PredictionChoice`, `PredictionConsequenceProps`).

### Por que este motor

`PredictionConsequence` modela exatamente o contrato do beat 5: o aluno escolhe uma previsão, confirma, e a consequência revela se a hipótese cabia no horizonte de evidência. O motor já trata revisão não punitiva ("Tentar outra previsão"). A incerteza permitida pelo roteiro ("ainda não pode dizer 'sei de que objeto ela vem'") é representada pela opção de prever "não dá para saber ainda" como escolha legítima, não como erro.

### Contrato de props (forma tipada, ilustrativa)

```ts
type Choice = "arvore" | "pedra" | "nao-sei" | "animal";

const props = {
  prompt:
    "Fora da caverna, o prisioneiro vê uma sombra no chão. O que ele pode afirmar agora?",
  choices: [
    { value: "arvore", label: "É a sombra de uma árvore" },
    { value: "pedra", label: "É a sombra de uma pedra" },
    { value: "animal", label: "É a sombra de um animal" },
    { value: "nao-sei", label: "Não dá para saber de que objeto vem" },
  ],
  isMatch: (choice) => choice === "nao-sei",
  consequence:
    "A sombra existe, mas o horizonte de evidência ainda não permite nomear o objeto que a produz.",
  matchedFeedback:
    "Certo: você pode dizer 'vejo uma sombra' sem precisar dizer 'sei de que objeto ela vem'. Cada horizonte de evidência permite uma afirmação. Não mais que isso.",
  unmatchedFeedback:
    "Esta afirmação vai além do que a evidência atual sustenta. Você vê a sombra; ainda não vê sua origem. Tente outra previsão.",
  onCommit: (choice, matched) => {
    /* registrar; placements em private_reflection ou system_telemetry,
       nunca punir overclaiming como erro. */
  },
} satisfies PredictionConsequenceProps<Choice>;
```

### Decisão de autoria importante

`isMatch` retorna `true` para `nao-sei`, **não** para uma resposta "correta" de objeto. Isso formaliza a incerteza permitida do roteiro: a resposta responsável no horizonte atual é reconhecer o limite da evidência. As três opções de objeto são hipóteses legítimas que o aluno pode explorar — o feedback `unmatched` marca overclaiming como "ainda não cabe aqui", nunca como "errou", conforme exigido pelo engagement review (§"Beat 5 — Atenção").

### Estado salvo

`PredictionConsequence` mantém estado interno (`selectedChoice`, `committedChoice`). Para persistência, o runtime deve capturar `onCommit` e armazenar a escolha final em `private_reflection` (a predição é reflexão privada, não resposta avaliada).

### Tom de feedback (não punitivo)

- `unmatchedFeedback` elogia a observação parcial e localiza o excesso ("vai além do que a evidência sustenta"), sem julgar o aluno.
- `matchedFeedback` valida explicitamente que não saber é um resultado genuíno.
- O botão "Tentar outra previsão" reabre sem penalidade.

### Notas de engajamento (de `03`)

- Incerteza modelada explicitamente: "ainda não pode dizer 'sei de que objeto ela vem'" (engagement review, §"Beat 5").
- Autonomia plena na formulação; competência medida por adequação ao horizonte, não por acertar objeto.
- Nível moderado-alto, dificuldade desejável bem calibrada.
- Atenção do revisor: feedback deve elogiar observações parciais e marcar overclaiming como "ainda não cabe aqui", nunca como "errou" — incorporado acima.

---

## Beat 6 — Reflexos na água (caminho causal)

**Movimento:** traçar a cadeia que liga o objeto, a luz e o reflexo, dentro do horizonte de evidência atual.  
**Motor:** `PhilooCausalPath` (EX-03, candidato).  
**Import path:** `@/domains/lessons/interactions/philoo-causal-path` (componente `PhilooCausalPath`, tipo `CausalPathItem`).

### Por que este motor

EX-03 é o motor de sequência causal da Philoo. O movimento do beat 6 — ordenar causa → efeito com direção visível — é exatamente o learning move do EX-03. Variação de interação em relação ao beat 2 (traçar/setas vs. classificar), conforme recomendado pelo engagement review (§"Beat 6 — Risco") para evitar sensação de repetição mecânica.

### Acoplamento a remover antes da implementação

`PhilooCausalPath` ainda contém lógica acoplada à Caverna (IDs `shadow`/`object`/`name`, mensagens de feedback sobre luz/parede/sombra, texto de conclusão "Da luz ao nome", ARIA Cave-specific). Isso é **trabalho de extração**, não invenção de conceito. Antes de usar neste beat, o motor precisa:

1. Externalizar `firstBreakMessage` para receber mensagens de configuração (o contrato-alvo em EX-03 do catálogo já prevê `feedback.breaks[]` com `beforeId`/`actualId`/`expectedId`/`message`).
2. Remover IDs hardcoded e ARIA Cave-specific.
3. Aceitar `completion.transition` configurável.

O exercise-designer formaliza o contrato; a extração é responsabilidade de implementação. Se a extração não for feita a tempo, este beat deve usar a versão configurável do EX-03 assim que disponível — não duplicar a cena.

### Contrato de props (forma tipada, ilustrativa)

```ts
const items: CausalPathItem[] = [
  {
    id: "objeto",
    label: "Objeto real acima da água",
    explanation: "A árvore ou pedra existe independentemente de ser vista.",
    icon: /* Phosphor icon, semântico */,
  },
  {
    id: "luz",
    label: "Luz que incide sobre o objeto",
    explanation: "A luz vem de uma fonte e atinge o objeto acima da água.",
    icon: /* Phosphor icon */,
  },
  {
    id: "reflexo",
    label: "Reflexo na superfície da água",
    explanation: "O reflexo é um efeito; tem direção: vem de algo acima.",
    icon: /* Phosphor icon */,
  },
];

PhilooCausalPath({
  items,
  correctOrder: ["objeto", "luz", "reflexo"],
  demonstratedItemId: "objeto",
  positionHints: [
    "O ponto de partida: algo que existe antes de ser visto.",
    "O que faz o objeto ficar visível a partir de uma direção.",
    "O efeito final, com direção que aponta de volta para a causa.",
  ],
  onComplete: () => { /* avançar para o beat 7 */ },
  onIncomplete: () => { /* opcional */ },
});
```

### Decisão de autoria importante

A ordem causal escolhida é `objeto → luz → reflexo`, **não** `luz → objeto → reflexo`. Justificativa: o roteiro enfatiza que o reflexo "vem de algo acima da água" — o objeto é a origem ontológica, a luz é o meio que torna o reflexo visível. O item demonstrado (`objeto`) ancora o ponto de partida, deixando ao aluno ordenar a relação causal intermediária e o efeito final. Isso difere do EX-03 original (que demonstrava a sombra) e justifica a variação.

### Estado salvo

`CausalSequenceState` (`positions`, `completed`, `attempts`). Visibilidade `teacher_visible_task` quando a ordenação for evidência de aprendizado significativa; caso contrário, `system_telemetry`. O catálogo recomenda serialização; o motor atual ainda não externaliza isso — incluir na extração.

### Tom de feedback (não punitivo)

- `firstBreakMessage` (após extração) nomeia a primeira relação interrompida como orientação, não como erro.
- Mensagens incompletas convidam a continuar ("ainda há uma parte do caminho para completar").
- Conclusão é descritiva ("o caminho está completo"), sem pontuação ou fanfarra.
- Peças podem ser devolvidas e reorganizadas sem perda de estado.

### Notas de engajamento (de `03`)

- Retrieval espaçado do beat 2 com informação nova (direção do reflexo) (engagement review, §"Beat 6").
- Competência reforçada por repetição espaçada — tolerável e desejável em contexto escolar.
- Risco: se idêntico em formato ao beat 2, sensação de repetição mecânica. Mitigado pela variação de interação (traçar/setas vs. classificar) já prevista acima.
- Nível moderado, adequado como passo intermediário.

### Pose do personagem

Pose role `causal-sequence` (EX-03): personagem à esquerda ou acima do caminho, seguindo a direção da leitura. Reutilizar pose aprovada de Platão se a direção couber; gerar nova pose compatível apenas se o enquadramento não servir.

---

## Beat 8 — O sol (revisão de modelo)

**Movimento:** atualizar o modelo da caverna, mantendo o que as sombras realmente mostravam e corrigindo o que ele havia interpretado de forma pequena demais. Revisar não é apagar.  
**Motor:** `RevisionMap`.  
**Import path:** `@/domains/lessons/interactions/revision-map` (componente `RevisionMap`, tipos `RevisionMapProps`, `RevisionMapValue`, `RevisionStrategy`, `RevisionClueOption`, `RevisionRecord`).

### Por que este motor

`RevisionMap` é o motor de revisão de hipótese da Philoo: apresenta uma hipótese anterior, oferece estratégias (manter / revisar / ainda não sei), pede a pista decisiva e registra uma comparação antes/depois. O movimento do beat 8 — preservar observações antigas e corrigir interpretação — é exatamente o learning move do motor. A estratégia `uncertain` ("ainda não sei") formaliza a proteção contra vergonha por "ter estado errado", central para o engagement review (§"Beat 8").

### Estratégias (RevisionStrategy)

O motor já define três estratégias; o beat 8 usa-as sem alteração:

- `maintain` — as novas pistas ainda combinam com a leitura.
- `revise` — uma pista exige mudar parte da leitura.
- `uncertain` — consigo nomear a dúvida e a pista que a tornou precisa.

### Contrato de props (forma tipada, ilustrativa)

```ts
const props = {
  initialHypothesis:
    "As sombras na parede eram a realidade inteira; o fogo era só o que iluminava.",
  clueOptions: [
    {
      value: "sol-causa-visibilidade",
      label: "O Sol é a causa pela qual as outras coisas ficam visíveis.",
    },
    {
      value: "sombra-era-efeito-real",
      label: "A sombra era um efeito real, não a realidade inteira.",
    },
    {
      value: "fogo-era-causa-menor",
      label: "O fogo era uma causa menor dentro de uma cadeia maior.",
    },
    {
      value: "mundo-exterior-mesma-ordem",
      label: "O mundo exterior segue a mesma ordem causa→efeito da caverna.",
    },
  ],
  privateNote: "",
  onHypothesisRevisited: (strategy) => {
    /* registrar estratégia; placements em derived_rubric ou private_reflection */
  },
  onRevisionRecorded: (revision, privateNote) => {
    /* registrar revisão final; privateNote sempre private_reflection */
  },
  onValidityChange: (isValid) => { /* habilitar ação de conclusão */ },
  reviewer: (strategy) => {
    /* feedback contextual opcional por estratégia */
  },
} satisfies RevisionMapProps;
```

### Decisão de autoria importante

A estratégia esperada para o beat 8 é `revise`, com pista decisiva `sol-causa-visibilidade` ou `fogo-era-causa-menor`. Mas o motor **não** deve forçar essa resposta: `uncertain` é resultado válido se o aluno ainda não consegue integrar toda a cadeia. O feedback `reviewer` deve validar revisões parciais e convidar a completar, nunca penalizar modelos incompletos (engagement review, §"Beat 8 — Atenção"). A revisão responsável preserva "a sombra era um efeito real" — não a descarta como ilusão sem valor.

### Estado salvo

`RevisionMapValue` (`strategy`, `decisiveClue`, `recorded`). Visibilidade:

- `strategy` e `decisiveClue`: `derived_rubric` (evidência de raciocínio) ou `teacher_visible_task` quando atribuído.
- `privateNote`: sempre `private_reflection` — o texto pessoal do aluno nunca é exposto.

### Tom de feedback (não punitivo)

- `reviewer` por estratégia: para `maintain`, mostrar onde a evidência nova tensiona a leitura antiga sem dizer "errado". Para `revise`, reconhecer o que foi preservado. Para `uncertain`, validar a dúvida nomeada como avanço legítimo.
- "Revisar o modelo não é apagar o que você viu antes" — frase-âncora do roteiro, refletida no feedback.
- Certeza total não é premiada; o motor não distingue "revise completo" de "revise parcial" como certo/errado.

### Notas de engajamento (de `03`)

- Pico de competência do capítulo: integrar cadeia causal mantendo observações parciais válidas (engagement review, §"Beat 8").
- Autonomia máxima: o aluno decide o que preservar e o que corrigir.
- Proteção contra vergonha por "ter estado errado" — central para Philoo; formalizada pela estratégia `uncertain` e pelo tom do `reviewer`.
- Nível alto, adequado como capstone — precedido por 6 beats de preparo.
- Risco na implementação (engagement review, §"Riscos"): se predição "errada" do beat 5 ou revisão "incompleta" do beat 8 forem tratadas como erro, vira vergonha. O motor e o feedback acima mitigam.

### Pose do personagem

`RevisionMap` não exige pose role específica no catálogo v1. O brief determina que atividades omitem Platão (a ação, escolha e feedback são o foco). Seguir o brief: **não incluir personagem neste beat**. A branding vem da "Oficina de ideias" (blue-and-white notebook workbench, cartões de transformação, conectores direcionais) conforme o brief, não de Plato como decoração.

---

## Teste da regra de novidade decorativa

Cada mecânica produz artefato de raciocínio inspecionável:

| Beat | Artefato inspecionável | Passa? |
|------|------------------------|--------|
| 2 | Classificação causa/efeito/aparência (placements salvos) | Sim |
| 5 | Predição + consequência revelada (escolha + match registrados) | Sim |
| 6 | Sequência causal ordenada (positions + firstBreak) | Sim |
| 8 | Revisão de modelo (strategy + decisiveClue + note) | Sim |

Nenhuma mecânica é puramente decorativa: cada uma deixa rastro serializável que pode ser revisado pelo professor ou pelo próprio aluno.

---

## Resumo para o implementer

1. **Beat 2:** usar `GuidedClassificationExercise` com config acima. Engine pronta; nenhum trabalho de extração.
2. **Beat 5:** usar `PredictionConsequence` com `isMatch` em `nao-sei`. Engine pronta; persistir escolha em `private_reflection`.
3. **Beat 6:** usar `PhilooCausalPath` **após extração** do acoplamento à Caverna. Sem extração, não duplicar a cena — aguardar EX-03 configurável.
4. **Beat 8:** usar `RevisionMap` sem personagem (brief: atividades omitem Platão). Tom não punitivo obrigatório; `uncertain` é resultado válido.

**Decisão pendente para o humano:** preservar EX-06/EX-07/EX-08 como telas independentes (fora dos beats 2/5/6/8) ou removê-los do catálogo do capítulo. O exercise-designer não decide; apenas sinaliza.



