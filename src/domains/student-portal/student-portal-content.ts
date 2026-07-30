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
    image: "/images/story/cave-prisoner-wall-v2.webp",
  },
  {
    id: "a-subida",
    chapter: "Capítulo 2",
    title: "A Subida",
    question: "O que acontece quando uma nova realidade dói nos olhos?",
    status: "next",
    progress: 0,
    image: "/images/story/cave-descent-journey-v1.webp",
  },
  {
    id: "o-retorno",
    chapter: "Capítulo 3",
    title: "O Retorno",
    question: "Como conversar com quem ainda vê o mundo de outro jeito?",
    status: "upcoming",
    progress: 0,
    image: "/images/story/cave-entry-background.webp",
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
