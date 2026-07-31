export type LibraryStatus =
  | "foundation"
  | "candidate"
  | "experiment";

export type ExerciseCatalogEntry = {
  id: string;
  name: string;
  status: LibraryStatus;
  learningMove: string;
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
    status: "experiment",
    learningMove:
      "Comparar duas explicações e escolher uma observação capaz de fazê-las produzir previsões diferentes.",
    sourceRoute: "/aula/a-subida/duas-explicacoes",
    sourceLabel: "Duas explicações",
    interaction:
      "Selecionar um teste diagnóstico, conferir a previsão e revisar sem punição.",
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
