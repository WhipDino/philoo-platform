export type PortalView =
  | "home"
  | "explore"
  | "journey"
  | "homework"
  | "announcements"
  | "profile"
  | "notebook";

export type PortalLesson = {
  id: string;
  chapter: string;
  title: string;
  question: string;
  status: "in-progress" | "next" | "upcoming";
  progress: number;
  href?: string;
  image: string;
};

export type PortalAnnouncement = {
  id: string;
  author: string;
  date: string;
  title: string;
  body: string;
  tag: string;
};

export type PortalJourney = {
  id: string;
  order: number;
  title: string;
  question: string;
  status: "active" | "next" | "upcoming";
  chapters: readonly string[];
  cover: string;
};

export const portalStudent = {
  firstName: "Ana",
  fullName: "Ana Nascimento",
  initials: "AN",
  classroom: "2º ano B",
  school: "Colégio Horizonte",
  teacher: "Profª Marina Alves",
  email: "ana.nascimento@aluno.philoo",
} as const;

export const portalLessons: readonly PortalLesson[] = [
  {
    id: "as-sombras",
    chapter: "Lição 1",
    title: "O começo",
    question: "O que uma sombra explica, e o que ela deixa de fora?",
    status: "in-progress",
    progress: 67,
    href: "/aula/as-sombras/primeira-tela",
    image: "/images/story/cave-entry-background.webp",
  },
  {
    id: "a-subida",
    chapter: "Lição 2",
    title: "A saída",
    question: "O que acontece quando uma nova realidade dói nos olhos?",
    status: "next",
    progress: 0,
    href: "/aula/a-subida/depois-da-virada",
    image: "/images/story/a-subida/beat-03-a-subida-dolorosa-v1.png",
  },
  {
    id: "o-retorno",
    chapter: "Lição 3",
    title: "O retorno",
    question: "Como conversar com quem ainda vê o mundo de outro jeito?",
    status: "next",
    progress: 0,
    href: "/aula/o-retorno/na-boca",
    image: "/images/story/o-retorno/beat-01-boca-da-caverna-v1.png",
  },
] as const;

export const portalIntro = {
  eyebrow: "Introdução",
  title: "As Sombras",
  description:
    "Três lições seguidas: a caverna, a saída e o retorno. Elas ensinam o caminho e por que a filosofia importa.",
} as const;

export const explorationQuestions = [
  {
    id: "truth",
    number: "01",
    title: "Como saber se algo é verdade?",
    description: "Aparência, evidência e as histórias que contamos.",
    accent: "light",
  },
  {
    id: "justice",
    number: "02",
    title: "O que torna uma escolha justa?",
    description: "Regras, consequências e diferentes pontos de vista.",
    accent: "mid",
  },
  {
    id: "identity",
    number: "03",
    title: "Continuamos sendo a mesma pessoa?",
    description: "Mudança, memória e aquilo que nos faz ser quem somos.",
    accent: "deep",
  },
] as const;

export const portalAnnouncements: readonly PortalAnnouncement[] = [
  {
    id: "next-class",
    author: "Profª Marina Alves",
    date: "Hoje",
    title: "Uma pergunta para levar com você",
    body:
      "Quando terminar As Sombras, pense em uma situação em que uma primeira impressão pareceu explicar tudo.",
    tag: "Atividade",
  },
  {
    id: "class-conversation",
    author: "Profª Marina Alves",
    date: "Ontem",
    title: "Nossa roda de conversa",
    body:
      "Amanhã a gente conversa sobre a Caverna. Terminem a lição de casa antes, para comparar as primeiras impressões.",
    tag: "Recado",
  },
  {
    id: "school-library",
    author: "Biblioteca Horizonte",
    date: "28 de julho",
    title: "Leitura opcional disponível",
    body:
      "A biblioteca separou uma versão ilustrada do mito da Caverna para quem quiser explorar a história.",
    tag: "Descoberta",
  },
] as const;

export const portalEra = {
  number: "Era 1",
  title: "Pré-socráticos",
  description:
    "Cada lição apresenta um filósofo e a pergunta que ele deixou no mundo.",
} as const;

export const portalEraLessons = [
  {
    id: "thales",
    title: "Tales",
    question: "De que o mundo é feito?",
    status: "upcoming" as const,
  },
  {
    id: "heraclitus",
    title: "Heráclito",
    question: "Por que tudo parece mudar?",
    status: "upcoming" as const,
  },
  {
    id: "parmenides",
    title: "Parmênides",
    question: "Dá para confiar no que os olhos mostram?",
    status: "upcoming" as const,
  },
  {
    id: "democritus",
    title: "Demócrito",
    question: "O invisível também explica o mundo?",
    status: "upcoming" as const,
  },
] as const;

export const portalJourneys: readonly PortalJourney[] = [
  {
    id: "cave",
    order: 1,
    title: "A Caverna de Platão",
    question: "Por que não devemos aceitar a primeira aparência como toda a verdade?",
    status: "active",
    chapters: ["As Sombras", "A Subida", "O Retorno"],
    cover: "/images/story/cave-entry-background.webp",
  },
  {
    id: "first-philosophers",
    order: 2,
    title: "Os primeiros filósofos",
    question: "Do que o mundo é feito, e por que ele muda?",
    status: "next",
    chapters: ["Tales e a arché", "Heráclito", "Parmênides", "Demócrito"],
    cover: "/images/story/plato-v2/plato-first-question-v2.png",
  },
  {
    id: "sophists-socrates",
    order: 3,
    title: "Sofistas e Sócrates",
    question: "Saber convencer é o mesmo que saber a verdade?",
    status: "upcoming",
    chapters: ["O poder da palavra", "Os sofistas", "Sócrates", "O diálogo"],
    cover: "/images/story/plato-v2/plato-review-argument-v2.png",
  },
  {
    id: "plato-aristotle",
    order: 4,
    title: "Platão e Aristóteles",
    question: "Como organizar aquilo que podemos conhecer?",
    status: "upcoming",
    chapters: ["Platão", "Mundo das ideias", "Aristóteles", "Causas e conhecimento"],
    cover: "/images/story/plato-v2/plato-teaching-seated-v1.png",
  },
] as const;

export const portalClassroom = {
  live: {
    title: "Perguntas ao vivo",
    eyebrow: "Com a turma",
    body: "Quando Marina abrir a sala, todo mundo entra junto.",
    state: "Em breve",
  },
} as const;

export const portalHomework = {
  assigned: true,
  title: "Três perguntas sobre dóxa",
  due: "Até terça",
  teacher: "Profª Marina Alves",
  body: "Escreva três perguntas sobre dóxa a partir do que você viu no capítulo. Na aula a gente compara as primeiras impressões.",
  lessonTitle: "As Sombras",
  lessonHref: "/aula/as-sombras/doxa",
} as const;

export type HomeChapterStatus = "lido" | "aqui" | "seguir" | "bloqueado";

export type HomeChapter = {
  number: number;
  title: string;
  status: HomeChapterStatus;
  href?: string;
  image: string;
};

export const homeCurrentLesson = {
  moduleTitle: "As Sombras",
  word: "dóxa",
  chapterIndex: 7,
  chapterCount: 9,
  readCount: 6,
  progress: 67,
  continueHref: "/aula/as-sombras/doxa",
  support:
    "Capítulo 7 de 9 · Platão está esperando na entrada da caverna para descer com você.",
  heroImage: "/images/portal/plato-cave-active-lesson-v1.png",
} as const;

export type TrailStatus = "lido" | "atual" | "aberto" | "bloqueado";

export const homeModuleTrail: readonly {
  n: number;
  title: string;
  status: TrailStatus;
  href: string;
}[] = [
  { n: 1, title: "O começo da história", status: "lido", href: "/aula/as-sombras/primeira-tela" },
  { n: 2, title: "A descida", status: "lido", href: "/aula/as-sombras/a-descida" },
  { n: 3, title: "Quem vive aqui", status: "lido", href: "/aula/as-sombras/so-a-parede" },
  { n: 4, title: "O jogo da parede", status: "lido", href: "/aula/as-sombras/eles-dao-nomes" },
  { n: 5, title: "O que existe atrás", status: "lido", href: "/aula/as-sombras/o-que-existe-atras" },
  { n: 6, title: "O caminho da sombra", status: "lido", href: "/aula/as-sombras/caminho-da-sombra" },
  { n: 7, title: "Uma palavra da filosofia", status: "atual", href: "/aula/as-sombras/doxa" },
  { n: 8, title: "O que chegou até eles", status: "aberto", href: "/aula/as-sombras/o-que-chegou-ate-eles" },
  { n: 9, title: "A primeira dúvida", status: "bloqueado", href: "/aula/as-sombras/a-primeira-duvida" },
];

export const homeNextChapter = {
  n: 8,
  title: "O que chegou até eles",
  synopsis:
    "Os prisioneiros só conhecem o que a parede mostra. Você vai descobrir quem escolhe o que aparece lá.",
  duration: "7 minutos · com Platão",
  durationShort: "7 min",
  href: "/aula/as-sombras/o-que-chegou-ate-eles",
  image: "/images/story/cave-anomaly-v1.webp",
} as const;

export const homeSavedWord = {
  chapter: 7,
  word: "dóxa",
  definition: "opinião que ninguém examinou",
  notebookCount: 14,
  previous: [
    { word: "eikón", gloss: "imagem, reflexo" },
    { word: "aletheia", gloss: "aquilo que se mostra" },
  ],
} as const;

export const homeNotebookEntries = [
  { word: "dóxa", sense: "opinião sem exame", when: "Hoje" },
  { word: "eikón", sense: "imagem, reflexo", when: "Cap. 6" },
  { word: "aletheia", sense: "aquilo que se mostra", when: "Cap. 5" },
  { word: "paideía", sense: "formar alguém", when: "Cap. 4" },
] as const;

export const homeChapters: readonly HomeChapter[] = [
  {
    number: 5,
    title: "O que existe atrás",
    status: "lido",
    href: "/aula/as-sombras/o-que-existe-atras",
    image: "/images/story/cave-behind-wall-layers-v1.webp",
  },
  {
    number: 6,
    title: "O caminho da sombra",
    status: "lido",
    href: "/aula/as-sombras/caminho-da-sombra",
    image: "/images/story/cave-shadow-recognition-set-v1.webp",
  },
  {
    number: 7,
    title: "Uma palavra da filosofia",
    status: "aqui",
    href: "/aula/as-sombras/doxa",
    image: "/images/story/cave-cropped-event-v1.webp",
  },
  {
    number: 8,
    title: "O que chegou até eles",
    status: "seguir",
    href: "/aula/as-sombras/o-que-chegou-ate-eles",
    image: "/images/story/cave-anomaly-v1.webp",
  },
  {
    number: 9,
    title: "A primeira dúvida",
    status: "bloqueado",
    image: "/images/story/cave-first-turn-cliffhanger-v1.png",
  },
] as const;

export const homeTeacherNote = {
  name: "Profª Marina",
  initials: "MA",
  when: "Falou há 2 horas",
  quote:
    "Terminem o capítulo 7 hoje. Na sexta a prova cobra os capítulos 1 a 4. E tragam o caderno, vamos escrever à mão.",
} as const;

export const homeTask = {
  label: "Ela pediu · até terça",
  title: "Três perguntas sobre dóxa",
  cta: "Fazer agora",
  phoneCurrentLabel: "Onde você parou",
  phoneHomeworkLabel: "Lição que a professora passou",
  phoneHomeworkCta: "Ir para a lição",
  phoneQuickLabel: "Acesso rápido",
} as const;

export const homeClassmates = {
  count: 12,
  extra: 9,
  caption: "12 colegas no capítulo 7",
  faces: [
    { id: "lia", name: "Lia", tone: "sky" },
    { id: "pedro", name: "Pedro", tone: "sand" },
    { id: "bia", name: "Bia", tone: "blue" },
  ],
} as const;

export const homeTrailDays = [
  { label: "S", active: true },
  { label: "T", active: true },
  { label: "Q", active: true },
  { label: "Q", active: true },
  { label: "S", active: false },
  { label: "S", active: false },
  { label: "D", active: false },
] as const;

export const homeTrail = {
  streak: "4 dias seguidos",
  today: "Hoje você guardou dóxa no caderno.",
} as const;
