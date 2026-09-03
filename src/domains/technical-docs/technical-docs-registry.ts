export type TechnicalTask = {
  id: string;
  title: string;
  question: string;
  outcome: string;
  primaryDocument: string;
  supportingDocuments: readonly string[];
  websiteHref?: string;
};

export const technicalTasks: readonly TechnicalTask[] = [
  {
    id: "create-lesson",
    title: "Criar uma aula",
    question: "Como transformo uma ideia filosófica em uma experiência completa?",
    outcome:
      "Contrato de aprendizagem, posição no currículo, cenas, exercícios, assets e validação.",
    primaryDocument: "docs/playbooks/CREATE_A_LESSON.md",
    supportingDocuments: [
      "docs/reference/STORY_THREAD.md",
      "docs/reference/PHILOSOPHER_LESSON.md",
      "docs/reference/EXERCISE_SELECTION.md",
      "docs/reference/SCALABLE_CONTENT_SYSTEM.md",
      "docs/reference/FOLIO_CHAPTER_PATTERNS.md",
      "docs/reference/FOLIO_LAYOUT_CONTRACT.md",
      "docs/product/CURRICULUM_MAP.md",
      "docs/reference/STUDENT_LIBRARY.md",
      "docs/product/PHILOO_EXERCISE_CATALOG_V1.md",
      "docs/reference/QUALITY_GATES.md",
    ],
    websiteHref: "/tecnico/guias/criar-uma-aula",
  },
  {
    id: "choose-exercise",
    title: "Escolher um exercício",
    question: "Qual interação combina com o raciocínio que o aluno deve fazer?",
    outcome:
      "Seleção por movimento cognitivo e maturidade: base, candidato ou experimento.",
    primaryDocument: "docs/product/PHILOO_EXERCISE_CATALOG_V1.md",
    supportingDocuments: [
      "docs/product/philoo-learning-activity-library.md",
      "docs/reference/EXERCISE_SELECTION.md",
      "docs/reference/LESSON_LIBRARY_API.md",
      "docs/reference/SCALABLE_CONTENT_SYSTEM.md",
    ],
    websiteHref: "/tecnico/biblioteca",
  },
  {
    id: "reuse-engine",
    title: "Usar a biblioteca no código",
    question: "Como reutilizo uma tela sem reconstruir comportamento e responsividade?",
    outcome:
      "Import público, configuração tipada, estado, callbacks e limites protegidos.",
    primaryDocument: "docs/reference/LESSON_LIBRARY_API.md",
    supportingDocuments: [
      "src/domains/lesson-library/README.md",
      "src/domains/lesson-library/index.ts",
      "docs/reference/SCALABLE_CONTENT_SYSTEM.md",
    ],
    websiteHref: "/tecnico/guias/api-da-biblioteca",
  },
  {
    id: "change-ui",
    title: "Mudar botão, card ou layout",
    question: "Essa mudança pertence ao conteúdo, ao componente ou ao sistema?",
    outcome:
      "Mudança feita no nível correto sem criar CSS local divergente.",
    primaryDocument: "docs/reference/DESIGN_AND_COMPONENT_RULES.md",
    supportingDocuments: [
      "docs/reference/QUALITY_GATES.md",
      "docs/reference/FOLIO_LAYOUT_CONTRACT.md",
    ],
    websiteHref: "/tecnico/guias/design-e-componentes",
  },
  {
    id: "create-asset",
    title: "Criar personagem ou imagem",
    question: "Qual pose, proporção, recorte e direção o componente exige?",
    outcome:
      "Asset semanticamente registrado, responsivo, verificável e com proveniência.",
    primaryDocument: "docs/reference/CHARACTERS_AND_ASSETS.md",
    supportingDocuments: [
      "docs/product/plato-character-generation-standard.md",
      "src/domains/character-library/index.ts",
      "src/domains/lessons/plato-pose-catalog.ts",
    ],
    websiteHref: "/tecnico/guias/personagens-e-assets",
  },
  {
    id: "review-handoff",
    title: "Validar e entregar",
    question: "O que precisa passar antes de outra pessoa ou IA continuar?",
    outcome:
      "Testes, build, viewports, documentação, estado do projeto e próximo passo.",
    primaryDocument: "docs/reference/QUALITY_GATES.md",
    supportingDocuments: [
      "CONTRIBUTING.md",
      "docs/project/DESKTOP_HANDOFF.md",
    ],
    websiteHref: "/tecnico/guias/qualidade",
  },
] as const;

export const lessonCreationSteps = [
  {
    number: "01",
    title: "Contrato de aprendizagem",
    detail:
      "Defina afirmação, pergunta, movimento cognitivo, evidência do raciocínio, erro provável e revisão.",
  },
  {
    number: "02",
    title: "Lugar no currículo",
    detail:
      "Posicione em era → jornada → capítulo → cenas e preserve a pergunta que conecta a jornada.",
  },
  {
    number: "03",
    title: "Escolha do motor",
    detail:
      "Procure uma base por movimento cognitivo; só extraia ou invente quando o catálogo não resolver.",
  },
  {
    number: "04",
    title: "Conteúdo tipado",
    detail:
      "A aula fornece texto, cartões, respostas, feedback, asset semântico e transição.",
  },
  {
    number: "05",
    title: "Composição e assets",
    detail:
      "Use presets de personagem e registre pose, gaze, crop, safe area, resolução e alt text.",
  },
  {
    number: "06",
    title: "Qualidade completa",
    detail:
      "Teste acerto, erro, revisão, estado restaurado, teclado, toque e os cinco viewports.",
  },
] as const;

export const documentationLayers = [
  {
    label: "Entrada",
    files: "README.md · AGENTS.md · docs/START_HERE.md",
    purpose: "Leva qualquer pessoa ou IA ao caminho certo.",
  },
  {
    label: "Estado",
    files: "PROJECT_STATE.md · DESKTOP_HANDOFF.md",
    purpose: "Diz o que existe agora e onde o trabalho parou.",
  },
  {
    label: "Decisão",
    files: "playbooks · product · architecture",
    purpose: "Explica por que, quando e como construir.",
  },
  {
    label: "Execução",
    files: "types · componentes · registries · testes",
    purpose: "É a verdade executável que a aula consome.",
  },
  {
    label: "Verificação",
    files: "QUALITY_GATES.md · testes · browser",
    purpose: "Prova que a entrega funciona e preserva a aprendizagem.",
  },
] as const;

export const sourceMap = [
  ["Contexto atual", "docs/project/PROJECT_STATE.md"],
  ["Próximo trabalho", "docs/project/DESKTOP_HANDOFF.md"],
  ["Como criar aula", "docs/playbooks/CREATE_A_LESSON.md"],
  ["Fio da história", "docs/reference/STORY_THREAD.md"],
  ["Aula de filósofo", "docs/reference/PHILOSOPHER_LESSON.md"],
  ["Quando usar cada exercício", "docs/reference/EXERCISE_SELECTION.md"],
  ["Contrato de layout do Folio", "docs/reference/FOLIO_LAYOUT_CONTRACT.md"],
  ["Currículo", "docs/product/CURRICULUM_MAP.md"],
  ["Catálogo de exercícios", "docs/product/PHILOO_EXERCISE_CATALOG_V1.md"],
  ["API pública", "src/domains/lesson-library/index.ts"],
  ["Padrões visuais", "docs/reference/DESIGN_AND_COMPONENT_RULES.md"],
  ["Personagens e assets", "docs/reference/CHARACTERS_AND_ASSETS.md"],
  ["Qualidade", "docs/reference/QUALITY_GATES.md"],
] as const;

export const contextFreeAiChecklist = [
  "Leia AGENTS.md e docs/START_HERE.md antes de alterar código.",
  "Declare qual rota de tarefa foi escolhida.",
  "Confira o status do exercício antes de reutilizar ou extrair.",
  "Leia o tipo público e o exemplo completo antes de criar configuração.",
  "Use registries semânticos; não codifique caminho de imagem, pose ou tamanho.",
  "Atualize testes, documentação, estado e handoff junto com a mudança.",
] as const;

export type TechnicalDocumentSectionId =
  | "start"
  | "project"
  | "lesson"
  | "library"
  | "design"
  | "architecture";

export type TechnicalDocument = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  section: TechnicalDocumentSectionId;
  sourcePath: string;
  audience: "everyone" | "developer" | "ai" | "product";
  keywords: readonly string[];
};

export const technicalDocumentSections = [
  {
    id: "start",
    label: "Comece aqui",
    description: "Orientação para pessoas e IAs sem contexto.",
  },
  {
    id: "project",
    label: "Projeto agora",
    description: "Estado, continuidade e processo de contribuição.",
  },
  {
    id: "lesson",
    label: "Criar aulas",
    description: "Currículo, aprendizagem e produção de uma nova aula.",
  },
  {
    id: "library",
    label: "Biblioteca",
    description: "Exercícios, API pública e padrões reutilizáveis.",
  },
  {
    id: "design",
    label: "Design e assets",
    description: "Marca, componentes, personagens e qualidade visual.",
  },
  {
    id: "architecture",
    label: "Arquitetura",
    description: "Limites do sistema e decisões estruturais.",
  },
] as const satisfies readonly {
  id: TechnicalDocumentSectionId;
  label: string;
  description: string;
}[];

export const technicalDocuments = [
  {
    slug: "comecar",
    title: "Comece aqui",
    shortTitle: "Comece aqui",
    description:
      "O ponto de entrada oficial para uma pessoa ou inteligência artificial sem contexto.",
    section: "start",
    sourcePath: "docs/START_HERE.md",
    audience: "everyone",
    keywords: ["onboarding", "primeiros passos", "tarefa", "contexto", "ia"],
  },
  {
    slug: "sistema-de-documentacao",
    title: "Como a documentação funciona",
    shortTitle: "Sistema de documentação",
    description:
      "Onde cada tipo de conhecimento vive e como impedir que a documentação fique desatualizada.",
    section: "start",
    sourcePath: "docs/reference/DOCUMENTATION_SYSTEM.md",
    audience: "everyone",
    keywords: ["documentação", "fonte de verdade", "manutenção", "website"],
  },
  {
    slug: "estado-do-projeto",
    title: "Estado atual do projeto",
    shortTitle: "Estado do projeto",
    description:
      "A realidade atual do produto, da tecnologia, das aulas, da biblioteca e das lacunas conhecidas.",
    section: "project",
    sourcePath: "docs/project/PROJECT_STATE.md",
    audience: "everyone",
    keywords: ["estado", "status", "produto", "tecnologia", "lacunas"],
  },
  {
    slug: "continuar-o-trabalho",
    title: "Continuar o trabalho em outra sessão",
    shortTitle: "Handoff",
    description:
      "Como retomar o Philoo em outro computador ou com uma nova IA sem perder contexto.",
    section: "project",
    sourcePath: "docs/project/DESKTOP_HANDOFF.md",
    audience: "ai",
    keywords: ["handoff", "computador", "sessão", "branch", "próximo trabalho"],
  },
  {
    slug: "contribuir",
    title: "Como contribuir",
    shortTitle: "Contribuição",
    description:
      "Fluxo de trabalho, escopo, qualidade, commits e definição de pronto.",
    section: "project",
    sourcePath: "CONTRIBUTING.md",
    audience: "developer",
    keywords: ["contribuir", "commit", "teste", "workflow", "pull request"],
  },
  {
    slug: "criar-uma-aula",
    title: "Criar uma aula Philoo",
    shortTitle: "Criar uma aula",
    description:
      "Do contrato de aprendizagem à configuração, aos assets, aos testes e ao handoff.",
    section: "lesson",
    sourcePath: "docs/playbooks/CREATE_A_LESSON.md",
    audience: "everyone",
    keywords: ["aula", "capítulo", "cena", "atividade", "playbook"],
  },
  {
    slug: "padroes-do-folio",
    title: "Padrões de capítulo no Folio",
    shortTitle: "Folio",
    description:
      "Regras reutilizáveis depois de As Sombras e A Subida: texto, Continuar, briefing, exercícios e fim de capítulo.",
    section: "lesson",
    sourcePath: "docs/reference/FOLIO_CHAPTER_PATTERNS.md",
    audience: "everyone",
    keywords: [
      "folio",
      "continuar",
      "briefing",
      "travessão",
      "recompensa",
      "ex-09",
      "o retorno",
    ],
  },
  {
    slug: "fio-da-historia",
    title: "Fio da história",
    shortTitle: "Fio da história",
    description:
      "Como continuar um capítulo sem perder o protagonista, o recap e os dois papéis de quem conta e de quem vive.",
    section: "lesson",
    sourcePath: "docs/reference/STORY_THREAD.md",
    audience: "ai",
    keywords: ["fio", "recap", "personagem", "narrador", "trilogia", "roteiro"],
  },
  {
    slug: "aula-de-filosofo",
    title: "Aula de um filósofo",
    shortTitle: "Aula de filósofo",
    description:
      "Depois da Caverna: o guia é o filósofo da aula, apresentação em primeira pessoa, cidade na imagem, uma ideia completa e a palavra-conceito da crença.",
    section: "lesson",
    sourcePath: "docs/reference/PHILOSOPHER_LESSON.md",
    audience: "ai",
    keywords: [
      "tales",
      "apresentação",
      "pré-socrático",
      "palavra grega",
      "cidade",
      "guia",
    ],
  },
  {
    slug: "quando-usar-cada-exercicio",
    title: "Quando usar cada exercício",
    shortTitle: "Escolher exercício",
    description:
      "Mapa dos onze motores: o que reusar em qualquer aula, o que só cabe com o gesto certo, e o que evitar depois da Caverna.",
    section: "library",
    sourcePath: "docs/reference/EXERCISE_SELECTION.md",
    audience: "ai",
    keywords: [
      "catálogo",
      "ex-05",
      "ex-06",
      "ex-11",
      "movimento",
      "reuso",
    ],
  },
  {
    slug: "conteudo-escalavel",
    title: "Sistema de conteúdo escalável",
    shortTitle: "Conteúdo escalável",
    description:
      "Motores importados com conteúdo por parâmetro, dois ou três exercícios por aula com qualidade primeiro, e catálogos de personagem e acervo.",
    section: "library",
    sourcePath: "docs/reference/SCALABLE_CONTENT_SYSTEM.md",
    audience: "ai",
    keywords: [
      "template",
      "escala",
      "selectExercisesForChapter",
      "personagem",
      "acervo",
    ],
  },
  {
    slug: "biblioteca-do-aluno",
    title: "Biblioteca do aluno",
    shortTitle: "Biblioteca do aluno",
    description:
      "Acervo cronológico em /inicio: eras, grupos e retomada só com progresso real.",
    section: "library",
    sourcePath: "docs/reference/STUDENT_LIBRARY.md",
    audience: "product",
    keywords: ["biblioteca", "acervo", "era", "grupo", "retomar"],
  },
  {
    slug: "contrato-de-layout-do-folio",
    title: "Contrato de layout do Folio",
    shortTitle: "Layout do Folio",
    description:
      "Espaçamento igual, cartão no miolo, colunas no pontilhado, briefing em duas camadas e o que os exercícios do Retorno já fecharam.",
    section: "design",
    sourcePath: "docs/reference/FOLIO_LAYOUT_CONTRACT.md",
    audience: "developer",
    keywords: [
      "espaçamento",
      "centralizar",
      "ex-10",
      "ex-11",
      "briefing",
      "container",
    ],
  },
  {
    slug: "mapa-curricular",
    title: "Mapa curricular",
    shortTitle: "Currículo",
    description:
      "Como eras, jornadas, capítulos e cenas formam o caminho filosófico do estudante.",
    section: "lesson",
    sourcePath: "docs/product/CURRICULUM_MAP.md",
    audience: "product",
    keywords: ["currículo", "era", "jornada", "capítulo", "filósofo"],
  },
  {
    slug: "brief-a-subida",
    title: "Brief da aula A Subida",
    shortTitle: "A Subida",
    description:
      "Resultados, sequência, exercícios, contrato visual e mapa técnico do segundo capítulo da Caverna.",
    section: "lesson",
    sourcePath: "docs/product/a-subida-lesson-brief.md",
    audience: "everyone",
    keywords: ["a subida", "caverna", "periagoge", "evidência", "revisão"],
  },
  {
    slug: "principios-de-atividades",
    title: "Princípios das atividades de aprendizagem",
    shortTitle: "Princípios de aprendizagem",
    description:
      "Como escolher interações pelo raciocínio exigido, sem infantilizar adolescentes.",
    section: "lesson",
    sourcePath: "docs/product/philoo-learning-activity-library.md",
    audience: "product",
    keywords: ["aprendizagem", "cognição", "adolescente", "feedback", "atividade"],
  },
  {
    slug: "catalogo-de-exercicios",
    title: "Catálogo de exercícios",
    shortTitle: "Catálogo de exercícios",
    description:
      "Inventário, maturidade, contratos e potencial de reutilização de cada interação.",
    section: "library",
    sourcePath: "docs/product/PHILOO_EXERCISE_CATALOG_V1.md",
    audience: "developer",
    keywords: ["exercício", "catálogo", "foundation", "candidate", "experiment"],
  },
  {
    slug: "api-da-biblioteca",
    title: "API da biblioteca de aulas",
    shortTitle: "API da biblioteca",
    description:
      "Como importar, configurar e integrar os motores de atividade sem reconstruí-los.",
    section: "library",
    sourcePath: "docs/reference/LESSON_LIBRARY_API.md",
    audience: "developer",
    keywords: ["api", "componente", "typescript", "estado", "configuração"],
  },
  {
    slug: "classificacao-guiada",
    title: "Classificação guiada",
    shortTitle: "Classificação guiada",
    description:
      "Contrato pedagógico, visual e técnico do primeiro motor reutilizável da Philoo.",
    section: "library",
    sourcePath: "docs/product/activity-patterns/guided-classification-board.md",
    audience: "developer",
    keywords: ["classificação", "drag", "cartões", "EX-05", "motor"],
  },
  {
    slug: "orientacao-da-biblioteca",
    title: "Orientação para o código da biblioteca",
    shortTitle: "Código da biblioteca",
    description:
      "Mapa colocalizado dos exports, motores, contratos e regras de manutenção.",
    section: "library",
    sourcePath: "src/domains/lesson-library/README.md",
    audience: "developer",
    keywords: ["código", "export", "renderer", "registry", "readme"],
  },
  {
    slug: "design-e-componentes",
    title: "Design e regras de componentes",
    shortTitle: "Design e componentes",
    description:
      "Como decidir o que pertence ao conteúdo, ao componente ou ao sistema visual.",
    section: "design",
    sourcePath: "docs/reference/DESIGN_AND_COMPONENT_RULES.md",
    audience: "developer",
    keywords: ["design", "botão", "card", "css", "responsividade", "marca"],
  },
  {
    slug: "personagens-e-assets",
    title: "Personagens e assets",
    shortTitle: "Personagens e assets",
    description:
      "Identidade, pose, gaze, gesto, recorte, proporção, proveniência e uso responsivo.",
    section: "design",
    sourcePath: "docs/reference/CHARACTERS_AND_ASSETS.md",
    audience: "everyone",
    keywords: ["personagem", "imagem", "pose", "asset", "crop", "licença"],
  },
  {
    slug: "padrao-visual-de-platao",
    title: "Padrão visual de Platão",
    shortTitle: "Platão",
    description:
      "Referência canônica para manter Platão consistente entre cenas e exercícios.",
    section: "design",
    sourcePath: "docs/product/plato-character-generation-standard.md",
    audience: "product",
    keywords: ["platão", "personagem", "geração", "identidade", "referência"],
  },
  {
    slug: "qualidade",
    title: "Portões de qualidade",
    shortTitle: "Qualidade",
    description:
      "Testes, acessibilidade, viewports, revisão pedagógica e entrega verificável.",
    section: "design",
    sourcePath: "docs/reference/QUALITY_GATES.md",
    audience: "developer",
    keywords: ["qualidade", "teste", "viewport", "acessibilidade", "build"],
  },
  {
    slug: "mapa-do-sistema-de-aulas",
    title: "Mapa do sistema de aulas",
    shortTitle: "Sistema de aulas",
    description:
      "Arquitetura proposta, limites entre runtime, conteúdo, atividades e Studio.",
    section: "architecture",
    sourcePath: "docs/architecture/PHILOO_LESSON_SYSTEM_MAP_V1.md",
    audience: "developer",
    keywords: ["arquitetura", "runtime", "manifest", "studio", "persistência"],
  },
] as const satisfies readonly TechnicalDocument[];

export function getTechnicalDocument(slug: string) {
  return technicalDocuments.find((document) => document.slug === slug);
}

export function getTechnicalDocumentBySourcePath(sourcePath: string) {
  return technicalDocuments.find(
    (document) => document.sourcePath === sourcePath,
  );
}

export function getTechnicalDocumentNeighbors(slug: string) {
  const index = technicalDocuments.findIndex(
    (document) => document.slug === slug,
  );

  return {
    previous: index > 0 ? technicalDocuments[index - 1] : undefined,
    next:
      index >= 0 && index < technicalDocuments.length - 1
        ? technicalDocuments[index + 1]
        : undefined,
  };
}
