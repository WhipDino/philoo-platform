export type PortalView =
  | "home"
  | "explore"
  | "journey"
  | "announcements"
  | "profile";

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
    chapter: "Capítulo 1",
    title: "As Sombras",
    question: "O que uma sombra explica — e o que ela deixa de fora?",
    status: "in-progress",
    progress: 67,
    href: "/aula/as-sombras/primeira-tela",
    image: "/images/portal/plato-cave-active-lesson-v1.png",
  },
  {
    id: "a-subida",
    chapter: "Capítulo 2",
    title: "A Subida",
    question: "O que acontece quando uma nova realidade dói nos olhos?",
    status: "next",
    progress: 0,
    href: "/aula/a-subida/depois-da-virada",
    image: "/images/story/a-subida/beat-03-a-subida-dolorosa-v1.png",
  },
  {
    id: "o-retorno",
    chapter: "Capítulo 3",
    title: "O Retorno",
    question: "Como conversar com quem ainda vê o mundo de outro jeito?",
    status: "upcoming",
    progress: 0,
    image: "/images/story/cave-first-turn-cliffhanger-v1.png",
  },
] as const;

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
      "Vamos comparar as pistas que fizeram cada pessoa mudar — ou manter — uma ideia durante a história da Caverna.",
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
  title: "Filosofia Antiga",
  description:
    "Das primeiras perguntas sobre a natureza às grandes ideias de Sócrates, Platão e Aristóteles.",
} as const;

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
    question: "Do que o mundo é feito — e por que ele muda?",
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
