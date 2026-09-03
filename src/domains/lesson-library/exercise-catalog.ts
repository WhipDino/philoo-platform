export type LibraryStatus =
  | "foundation"
  | "candidate"
  | "experiment";

export type ThinkingMove =
  | "label-image"
  | "reveal-regions"
  | "order-cause"
  | "crop-reveal"
  | "classify"
  | "compare-models"
  | "evidence-horizon"
  | "revise-model"
  | "pair-connect"
  | "dual-lens"
  | "weight-layers";

export type ExerciseCatalogEntry = {
  id: string;
  name: string;
  status: LibraryStatus;
  learningMove: string;
  thinkingMove: ThinkingMove;
  publicExport: string | null;
  reuseScope: "any-lesson" | "when-move-fits" | "avoid-by-default";
  whenToUse: string;
  doNotUseWhen: string;
  sourceRoute: string;
  sourceLabel: string;
  interaction: string;
  authorFields: readonly string[];
  protectedBehavior: readonly string[];
  responsiveContract: {
    desktop: string;
    tablet: string;
    phone: string;
  };
  dependencies: readonly string[];
};

export const libraryStatuses: Record<
  LibraryStatus,
  { label: string; description: string }
> = {
  foundation: {
    label: "Base",
    description: "Contrato compartilhado e pronto para sustentar novas telas.",
  },
  candidate: {
    label: "Candidato",
    description:
      "Comportamento promissor, ainda precisa remover conteúdo acoplado.",
  },
  experiment: {
    label: "Experimento",
    description:
      "Tela validada na aula, ainda não extraída como componente genérico.",
  },
};

export const exerciseCatalog: readonly ExerciseCatalogEntry[] = [
  {
    id: "EX-01",
    name: "Escolha visual em rodadas",
    status: "experiment",
    learningMove:
      "Observar uma imagem, comparar hipóteses e escolher a explicação mais coerente.",
    thinkingMove: "label-image",
    publicExport: null,
    reuseScope: "when-move-fits",
    whenToUse:
      "Uma imagem mostra o fenômeno e o aluno escolhe, em rodadas, o rótulo que combina.",
    doNotUseWhen:
      "A tarefa é revelar partes de um sistema (EX-02), duas lentes da mesma cena (EX-10) ou só um quiz de texto (prefira EX-06).",
    sourceRoute: "/aula/as-sombras/jogo-da-parede",
    sourceLabel: "Jogo da parede",
    interaction: "Escolha por toque ou teclado, ajuda contextual e avanço por rodada.",
    authorFields: [
      "pergunta",
      "imagem e ponto focal",
      "alternativas",
      "resposta correta",
      "ajuda",
      "feedback",
    ],
    protectedBehavior: [
      "mídia 16:9",
      "alvo mínimo de 48 px",
      "feedback sem punição",
      "alternativas empilhadas no celular",
    ],
    responsiveContract: {
      desktop: "Imagem 16:9 e três alternativas em colunas; conteúdo até 880 px.",
      tablet: "Espaçamento comprimido sem alterar a ordem cognitiva.",
      phone:
        "Imagem 16:9 e alternativas em uma coluna; ações com pelo menos 48 px.",
    },
    dependencies: ["React state", "CSS Modules", "next/image"],
  },
  {
    id: "EX-02",
    name: "Revelação progressiva de mecanismo",
    status: "experiment",
    learningMove:
      "Construir uma explicação causal revelando partes de um sistema em sequência.",
    thinkingMove: "reveal-regions",
    publicExport: null,
    reuseScope: "when-move-fits",
    whenToUse:
      "Uma única imagem esconde o mecanismo; o aluno revela regiões em ordem e a explicação acumula.",
    doNotUseWhen:
      "Não há regiões de imagem para destacar, ou o gesto é duas óticas do mesmo quadro (EX-10).",
    sourceRoute: "/aula/as-sombras/o-que-existe-atras",
    sourceLabel: "O que existe atrás",
    interaction:
      "Avanço por etapas, destaques posicionais, ajuda e explicação acumulativa.",
    authorFields: [
      "imagem-base",
      "regiões de destaque",
      "etapas",
      "rótulos",
      "explicações",
      "conclusão",
    ],
    protectedBehavior: [
      "mídia 16:9",
      "ordem das revelações",
      "estado cumulativo",
      "controle alternativo sem gesto",
    ],
    responsiveContract: {
      desktop: "Cena principal e painel lateral de aproximadamente 230 px.",
      tablet: "Painel reduzido e espaçamento adaptado abaixo de 820 px.",
      phone: "Cena e explicação empilhadas abaixo de 640 px.",
    },
    dependencies: ["React state", "CSS Modules", "next/image"],
  },
  {
    id: "EX-03",
    name: "Sequência causal",
    status: "candidate",
    learningMove:
      "Ordenar acontecimentos e tornar visível uma cadeia de causa e consequência.",
    thinkingMove: "order-cause",
    publicExport: "PhilooCausalPath",
    reuseScope: "any-lesson",
    whenToUse:
      "O aluno precisa colocar A, depois B, depois C. Tempo ou causa em linha.",
    doNotUseWhen:
      "Os itens coexistem e se empilham por peso (EX-11) ou são pares soltos (EX-09).",
    sourceRoute: "/aula/as-sombras/caminho-da-sombra",
    sourceLabel: "Caminho da sombra",
    interaction:
      "Arrastar, tocar para posicionar, reorganizar, verificar e revisar.",
    authorFields: [
      "peças",
      "ordem correta",
      "ícones ou imagens",
      "feedback por posição",
      "conclusão",
    ],
    protectedBehavior: [
      "alternativa completa ao arrastar",
      "posições com pelo menos 94 px no desktop",
      "estado serializável",
      "revisão não punitiva",
    ],
    responsiveContract: {
      desktop: "Três peças e quatro posições visíveis na mesma composição.",
      tablet: "Peças e posições comprimidas abaixo de 720 px do contêiner.",
      phone:
        "Fluxo vertical abaixo de 520 px, com toque como interação principal.",
    },
    dependencies: [
      "React state",
      "Pointer Events",
      "HTML Drag and Drop",
      "CSS Modules",
    ],
  },
  {
    id: "EX-04",
    name: "Revelação de conceito por enquadramento",
    status: "experiment",
    learningMove:
      "Comparar uma visão parcial com o contexto completo antes de nomear um conceito.",
    thinkingMove: "crop-reveal",
    publicExport: null,
    reuseScope: "when-move-fits",
    whenToUse:
      "O recorte engana; ao abrir o quadro o aluno vê que o nome muda. Raro.",
    doNotUseWhen:
      "O objetivo é só ensinar a palavra grega: use named-concept, não este motor.",
    sourceRoute: "/aula/as-sombras/doxa",
    sourceLabel: "Doxa",
    interaction:
      "Alternância guiada entre recorte e totalidade, seguida de síntese conceitual.",
    authorFields: [
      "imagem",
      "recorte e ponto focal",
      "pergunta",
      "conceito",
      "síntese",
      "conexão seguinte",
    ],
    protectedBehavior: [
      "transição parcial → inteiro",
      "ordem narrativa",
      "foco preservado",
      "redução de movimento",
    ],
    responsiveContract: {
      desktop: "Recorte 16:8.4, visão completa 16:6.6 e síntese horizontal.",
      tablet: "Síntese reorganizada abaixo de 900 px.",
      phone:
        "Mídia 4:3 e síntese empilhada abaixo de 700 px, sem perder a comparação.",
    },
    dependencies: ["React state", "Motion", "CSS Modules", "next/image"],
  },
  {
    id: "EX-05",
    name: "Classificação guiada",
    status: "foundation",
    learningMove:
      "Usar um exemplo resolvido e classificar novas evidências em categorias.",
    thinkingMove: "classify",
    publicExport: "GuidedClassificationExercise",
    reuseScope: "any-lesson",
    whenToUse:
      "O aluno separa tipos de frase ou de evidência depois de um exemplo guiado. Preferido.",
    doNotUseWhen:
      "Há só duas explicações concorrentes (EX-06) ou uma cadeia causal (EX-03).",
    sourceRoute: "/aula/as-sombras/o-que-chegou-ate-eles",
    sourceLabel: "O que chegou até eles",
    interaction:
      "Exemplo trabalhado, arrastar ou tocar, verificar, receber pista e revisar.",
    authorFields: [
      "exemplo resolvido",
      "categorias",
      "cartões",
      "destinos",
      "pistas",
      "feedback",
      "personagem e pose",
    ],
    protectedBehavior: [
      "exemplo antes da tentativa",
      "alternativa completa ao arrastar",
      "cartões com pelo menos 48 px",
      "revisão sem perda",
      "personagem aponta para a ação",
    ],
    responsiveContract: {
      desktop: "Exemplo em duas colunas; cartões e três destinos simultâneos.",
      tablet: "Mesa em uma coluna abaixo de 780 px do contêiner.",
      phone:
        "Fluxo dedicado abaixo de 520 px; destinos com 78 px e cartões com 52 px.",
    },
    dependencies: [
      "React state",
      "Pointer Events",
      "HTML Drag and Drop",
      "CSS Modules",
      "next/image",
    ],
  },
  {
    id: "EX-06",
    name: "Teste entre modelos concorrentes",
    status: "candidate",
    learningMove:
      "Comparar duas explicações e escolher uma observação capaz de fazê-las produzir previsões diferentes.",
    thinkingMove: "compare-models",
    publicExport: "PredictionConsequence",
    reuseScope: "any-lesson",
    whenToUse:
      "Dois modelos à vista; o aluno escolhe o teste ou qual modelo a evidência confirma. Preferido. No Retorno: PredictionConsequence.",
    doNotUseWhen:
      "Três camadas de peso (EX-11) ou classificação em várias gavetas (EX-05).",
    sourceRoute: "/aula/a-subida/duas-explicacoes",
    sourceLabel: "Duas explicações",
    interaction:
      "Selecionar um teste diagnóstico, conferir a previsão e revisar sem punição. " +
      "Variante evidence-to-model (O Retorno, beat 4): a evidência já é dada e o " +
      "aluno escolhe qual dos dois modelos a explica melhor, via PredictionConsequence.",
    authorFields: [
      "fenômeno observado",
      "dois modelos concorrentes",
      "testes possíveis",
      "teste diagnóstico",
      "previsão de cada modelo",
      "feedback",
    ],
    protectedBehavior: [
      "modelos visíveis antes da escolha",
      "teste que realmente diferencia previsões",
      "feedback explicativo para toda alternativa",
      "revisão preservada",
    ],
    responsiveContract: {
      desktop: "Modelos lado a lado e testes em uma grade legível.",
      tablet: "Modelos mantêm a comparação; testes passam a duas colunas.",
      phone:
        "Modelos e testes empilhados na ordem cognitiva, com alvos de pelo menos 44 px.",
    },
    dependencies: ["React state", "CSS Modules", "@phosphor-icons/react"],
  },
  {
    id: "EX-07",
    name: "Horizonte de evidências",
    status: "experiment",
    learningMove:
      "Distinguir o que as evidências atuais sustentam de afirmações que vão além delas.",
    thinkingMove: "evidence-horizon",
    publicExport: null,
    reuseScope: "avoid-by-default",
    whenToUse:
      "Só se o humano pedir. Tela antiga da Subida, fora do rail atual.",
    doNotUseWhen:
      "Aula nova de filósofo: use EX-05 ou EX-06 para o mesmo gesto de limite da evidência.",
    sourceRoute: "/aula/a-subida/ate-onde-posso-afirmar",
    sourceLabel: "Até onde posso afirmar?",
    interaction:
      "Avançar por quatro horizontes, escolher a afirmação responsável e receber feedback imediato.",
    authorFields: [
      "etapas de observação",
      "pista disponível",
      "afirmação responsável",
      "duas extrapolações plausíveis",
      "feedback por etapa",
    ],
    protectedBehavior: [
      "progressão cumulativa",
      "uma pergunta por vez",
      "contraste entre evidência e excesso de certeza",
      "estado atual sempre visível",
    ],
    responsiveContract: {
      desktop: "Linha de progresso completa e cartão de decisão central.",
      tablet: "Etapas viram faixa horizontal rolável sem ocultar a etapa ativa.",
      phone:
        "Faixa rolável e alternativas em coluna, com estado e ação dentro do fluxo.",
    },
    dependencies: ["React state", "CSS Modules", "@phosphor-icons/react"],
  },
  {
    id: "EX-08",
    name: "Revisão visível de modelo",
    status: "experiment",
    learningMove:
      "Atualizar uma explicação preservando o que ela acertava e corrigindo o que novas relações revelaram.",
    thinkingMove: "revise-model",
    publicExport: null,
    reuseScope: "avoid-by-default",
    whenToUse:
      "Só se o humano pedir. Tela antiga da Subida, fora do rail atual.",
    doNotUseWhen:
      "Aula nova: a revisão visível já acontece no retry do EX-06 ou no reempilhar do EX-11.",
    sourceRoute: "/aula/a-subida/revisar-o-mundo",
    sourceLabel: "Revisar o mundo",
    interaction:
      "Ler a transformação do modelo, escolher uma revisão e compará-la com as evidências.",
    authorFields: [
      "modelo inicial",
      "novas relações",
      "revisões possíveis",
      "revisão responsável",
      "feedback por alternativa",
    ],
    protectedBehavior: [
      "modelo antigo não é apagado",
      "nova evidência fica visível",
      "certeza total não é premiada",
      "feedback permite nova tentativa",
    ],
    responsiveContract: {
      desktop: "Mapa antigo → relações → revisão em uma linha.",
      tablet: "Mapa reduz espaçamento, preservando a sequência.",
      phone:
        "Mapa vertical com setas rotacionadas e escolhas em coluna.",
    },
    dependencies: ["React state", "CSS Modules", "@phosphor-icons/react"],
  },
  {
    id: "EX-09",
    name: "Ligação entre nós",
    status: "candidate",
    learningMove:
      "Relacionar dois conjuntos de ideias e revisar só as ligações que não se sustentam.",
    thinkingMove: "pair-connect",
    publicExport: "PhilooPairConnect",
    reuseScope: "any-lesson",
    whenToUse:
      "Pares (palavra–sentido, causa–efeito). Ligar tudo, Conferir, só as erradas se soltam.",
    doNotUseWhen:
      "A ordem é uma linha causal de três passos (EX-03) ou uma pirâmide de peso (EX-11).",
    sourceRoute: "/aula/a-subida/sombras-la-fora",
    sourceLabel: "Ele saiu",
    interaction:
      "Puxar uma linha de um nó da esquerda até um da direita, conferir o mapa e revisar as ligações soltas.",
    authorFields: [
      "pergunta",
      "nós da esquerda",
      "nós da direita",
      "pares corretos",
      "feedback de revisão",
    ],
    protectedBehavior: [
      "conectar tudo antes de conferir",
      "só as ligações erradas se soltam",
      "feedback sem punição",
      "conteúdo só por configuração, sem zonas de imagem",
      "alvo mínimo de 44 px",
      "pílulas curtas e centralizadas, não esticadas na largura do card",
      "Conferir visível sem rolagem interna",
      "Continuar do Folio oculto até o mapa estar certo",
    ],
    responsiveContract: {
      desktop: "Duas colunas curtas no centro, fios no meio.",
      tablet: "Mesmo bloco central, colunas um pouco mais próximas.",
      phone: "Colunas empilhadas; fios continuam ligando os pares.",
    },
    dependencies: ["React state", "Pointer Events", "CSS Modules"],
  },
  {
    id: "EX-10",
    name: "Lentes duplas",
    status: "experiment",
    learningMove:
      "Comparar duas lentes interpretativas sobre a mesma cena e escolher a explicação para um fenômeno, distinguindo perspectiva de observador de mudança no objeto.",
    thinkingMove: "dual-lens",
    publicExport: "PhilooDualLens",
    reuseScope: "when-move-fits",
    whenToUse:
      "Duas artes do mesmo enquadramento; só muda a ótica. Depois uma pergunta em cartas.",
    doNotUseWhen:
      "As imagens são lugares ou tempos diferentes, ou basta um quiz sem wipe (EX-01 / EX-06).",
    sourceRoute: "/aula/o-retorno/a-escuridao",
    sourceLabel: "Os olhos escurecem de novo",
    interaction:
      "Arrastar uma linha no quadro para comparar duas artes da mesma cena; Ver perguntas só depois que a segunda lente aparece por inteiro; duas cartas sem sobreposição; Conferir vira o verso (vermelho no erro, verde no acerto); Tentar novamente após o erro.",
    authorFields: [
      "briefing",
      "prompt",
      "lente A (imagem, alt, rótulo, legenda opcional)",
      "lente B (imagem, alt, rótulo, legenda opcional)",
      "lente inicial",
      "pergunta final e alternativas",
      "alternativa correta",
      "feedback por alternativa",
      "rótulo do Continuar",
    ],
    protectedBehavior: [
      "duas imagens da mesma cena, sem geometria de hotspot",
      "comparação por linha arrastável com alvo mínimo de 44 px",
      "pergunta oculta até Ver perguntas, depois que a segunda lente aparece",
      "Continuar do Folio oculto até o acerto",
      "cartas sem sobreposição; flip no Conferir; Tentar novamente após o erro",
      "Platão fora do quadro, só no briefing e na voz",
      "estado serializável (posição da linha, revelação, tentativas)",
      "alts distintos por lente",
      "ordem cognitiva: arrastar, comparação, pergunta",
    ],
    responsiveContract: {
      desktop:
        "Quadro alto preenchendo o Folio, linha no meio; depois duas cartas em pé.",
      tablet: "Mesmo bloco; quadro usa a altura e a largura disponíveis.",
      phone:
        "Quadro na largura da tela; cartas em pé lado a lado; alvos ≥ 44 px.",
    },
    dependencies: ["React state", "CSS Modules", "next/image"],
  },
  {
    id: "EX-11",
    name: "Camadas de uma decisão",
    status: "candidate",
    learningMove:
      "Empilhar motivos de uma decisão em ordem crescente de peso, entendendo que as camadas coexistem: o medo não some, o que pesa mais fica no topo da pirâmide.",
    thinkingMove: "weight-layers",
    publicExport: "PhilooDecisionLayers",
    reuseScope: "any-lesson",
    whenToUse:
      "Três motivos que existem ao mesmo tempo; o aluno empilha do mais leve (base) ao que pesa mais (topo).",
    doNotUseWhen:
      "A ordem é causa no tempo (EX-03) ou só duas alternativas (EX-06).",
    sourceRoute: "/aula/o-retorno/a-divida",
    sourceLabel: "O medo e a obrigação",
    interaction:
      "Arrastar (ou clicar) uma camada até o degrau da pirâmide (base embaixo = mais leve); Conferir; só as camadas fora do lugar voltam.",
    authorFields: [
      "briefing",
      "prompt",
      "camadas (id, rótulo, nota de peso, explicação)",
      "ordem correta por peso estrutural",
      "feedback por camada fora do lugar",
      "feedback de conclusão e de pilha incompleta",
      "rótulo do Continuar",
    ],
    protectedBehavior: [
      "pirâmide visual com base embaixo; arrastar com ghost no cursor; clique-clique para teclado",
      "pilha empilhável com alvo mínimo de 44 px",
      "Conferir visível sem rolagem interna",
      "Continuar do Folio oculto até a pilha estar certa",
      "feedback de peso e camada, nunca de causa quebrada",
      "só as camadas fora do lugar retornam ao conjunto disponível",
      "Platão fora do tabuleiro, só no briefing e na voz",
      "estado serializável (posições, tentativas, conclusão)",
    ],
    responsiveContract: {
      desktop:
        "Duas colunas iguais; cartas centradas entre a parede e o pontilhado; pirâmide centrada entre o pontilhado e a parede; cartão no miolo do Folio com respiro vertical igual.",
      tablet: "Mesmo bloco; rail da jornada recolhido por padrão.",
      phone:
        "Uma coluna (container query ~700px); toque e arraste; alvos ≥ 44 px.",
    },
    dependencies: ["React state", "CSS Modules"],
  },
] as const;

export const libraryViewportChecks = [
  {
    label: "Celular",
    viewport: "390 × 844",
    checks: "toque, pilha vertical, texto, rail sobreposto e foco visível",
  },
  {
    label: "Tablet retrato",
    viewport: "768 × 1024",
    checks: "composição intermediária, rail recolhível e ausência de corte",
  },
  {
    label: "Tablet paisagem",
    viewport: "1024 × 768",
    checks: "altura curta, dock de ações e leitura sem rolagem presa",
  },
  {
    label: "Notebook",
    viewport: "1366 × 720",
    checks: "altura curta, conteúdo prioritário e ações sempre alcançáveis",
  },
  {
    label: "Desktop",
    viewport: "1440 × 900",
    checks: "composição completa, proporção, respiro e hierarquia visual",
  },
] as const;

export const sharedScreenMeasurements = [
  ["Área narrativa", "até 1180 px"],
  ["Área total com trilha", "até 1536 px"],
  ["Trilha expandida", "312 px"],
  ["Trilha recolhida", "68 px no desktop; 56 × 56 px em telas menores"],
  ["Barra superior", "74 px no desktop; 64 px no celular"],
  ["Dock de ação", "mínimo de 68 px"],
  ["Alvo interativo", "48 px recomendado; nunca menor que 44 px"],
  ["Celular", "até 720 px"],
  ["Tablet", "721–1180 px"],
] as const;
