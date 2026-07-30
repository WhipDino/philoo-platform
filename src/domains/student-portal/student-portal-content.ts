export type PortalView =
  | "today"
  | "lessons"
  | "classroom"
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
  role: string;
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
    chapter: "A Caverna de Platão · Capítulo 1",
    title: "As Sombras",
    question: "O que uma sombra explica — e o que ela deixa de fora?",
    status: "in-progress",
    progress: 67,
    href: "/aula/as-sombras/primeira-tela",
    image: "/images/story/cave-prisoner-wall-v2.webp",
  },
  {
    id: "a-subida",
    chapter: "A Caverna de Platão · Capítulo 2",
    title: "A Subida",
    question: "O que acontece quando uma nova realidade dói nos olhos?",
    status: "next",
    progress: 0,
    image: "/images/story/cave-descent-journey-v1.webp",
  },
  {
    id: "o-retorno",
    chapter: "A Caverna de Platão · Capítulo 3",
    title: "O Retorno",
    question: "Como conversar com quem ainda vê o mundo de outro jeito?",
    status: "upcoming",
    progress: 0,
    image: "/images/story/cave-entry-background.webp",
  },
] as const;

export const portalAnnouncements: readonly PortalAnnouncement[] = [
  {
    id: "next-class",
    author: "Marina Alves",
    role: "Professora de Filosofia",
    date: "Hoje, 10:20",
    title: "Uma pergunta para levar para a aula",
    body:
      "Quando terminar As Sombras, pense em uma situação em que uma primeira impressão pareceu explicar tudo. Não precisa entregar nada ainda — só guarde o exemplo.",
    tag: "Para a próxima aula",
  },
  {
    id: "class-conversation",
    author: "Marina Alves",
    role: "Professora de Filosofia",
    date: "Ontem, 16:45",
    title: "Nossa roda de conversa",
    body:
      "Na sexta-feira vamos comparar as pistas que fizeram cada pessoa mudar — ou manter — uma ideia durante a história da Caverna.",
    tag: "Turma",
  },
  {
    id: "school-library",
    author: "Biblioteca Horizonte",
    role: "Equipe da escola",
    date: "28 de julho",
    title: "Leitura opcional disponível",
    body:
      "A biblioteca separou uma versão ilustrada do mito da Caverna para quem quiser explorar a história depois da aula.",
    tag: "Leitura opcional",
  },
] as const;

export const classroomMoments = [
  {
    day: "SEX",
    date: "31",
    title: "Roda de conversa",
    detail: "Filosofia · 10:30",
  },
  {
    day: "TER",
    date: "04",
    title: "Começamos A Subida",
    detail: "Filosofia · 09:40",
  },
] as const;
