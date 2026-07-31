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
      "docs/product/CURRICULUM_MAP.md",
      "docs/product/PHILOO_EXERCISE_CATALOG_V1.md",
      "docs/reference/QUALITY_GATES.md",
    ],
    websiteHref: "#criar-aula",
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
      "docs/reference/LESSON_LIBRARY_API.md",
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
    ],
    websiteHref: "/tecnico/biblioteca#engine-title",
  },
  {
    id: "change-ui",
    title: "Mudar botão, card ou layout",
    question: "Essa mudança pertence ao conteúdo, ao componente ou ao sistema?",
    outcome:
      "Mudança feita no nível correto sem criar CSS local divergente.",
    primaryDocument: "docs/reference/DESIGN_AND_COMPONENT_RULES.md",
    supportingDocuments: ["docs/reference/QUALITY_GATES.md"],
    websiteHref: "#personalizar",
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
      "src/domains/lessons/plato-pose-catalog.ts",
    ],
    websiteHref: "#personagens",
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
    websiteHref: "#qualidade",
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
