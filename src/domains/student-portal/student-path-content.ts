import {
  homeCurrentLesson,
  homeSavedWord,
  homeTeacherNote,
  portalHomework,
} from "./student-portal-content";
import {
  buildPathLessons,
  countCompleted,
  type PathLessonCatalog,
  type PathNextModule,
  type PathPendencia,
  type PathTeacherNote,
  type StudentPathProgress,
} from "./student-path-model";

export const cavePathCatalog: readonly PathLessonCatalog[] = [
  {
    n: 1,
    id: "as-sombras",
    title: "As Sombras",
    summary:
      "Platão te leva até um lugar onde as pessoas só conhecem o que a parede mostra. Você vai ver o jogo de dar nome às sombras, e o que muda quando alguém desconfia daquela imagem.",
    meta: "com Platão",
    image: "/images/story/cave-wall-observers-v5.png",
    imageAlt: "Prisioneiros sentados diante da parede, vendo só as sombras",
    href: "/aula/as-sombras/primeira-tela",
    parts: 9,
    minutes: 18,
  },
  {
    n: 2,
    id: "a-subida",
    title: "A Subida",
    summary:
      "Quem vira o pescoço descobre que a parede não era o mundo inteiro. A luz lá fora dói, a vista muda aos poucos, e sobra uma decisão: voltar para quem ficou.",
    meta: "com Platão",
    image: "/images/story/a-subida/beat-03-a-subida-dolorosa-v1.png",
    imageAlt: "A subida dolorosa rumo à luz, fora da caverna",
    href: "/aula/a-subida/depois-da-virada",
    parts: 9,
  },
  {
    n: 3,
    id: "o-retorno",
    title: "O Retorno",
    summary:
      "Voltar não é só contar o que você viu. É tentar conversar com quem ainda confia na parede, sem tratar essa pessoa como inimiga.",
    meta: "em breve",
    image: "/images/story/cave-first-turn-cliffhanger-v1.png",
    imageAlt: "O prisioneiro que virou o pescoço e olhou para trás",
  },
];

export const previewStudentProgress: StudentPathProgress = {
  currentLessonN: 1,
  currentProgressPct: homeCurrentLesson.progress,
  remainingMinutes: 6,
  continueHref: homeCurrentLesson.continueHref,
  continueLabel: "Retomar a conversa",
  nextStepBody:
    "Você parou no meio da conversa com Platão, em As Sombras. Faltam a última fala dele e o exercício de dóxa para seguir nesta lição.",
  forecastClose: null,
};

export const cavePathModule = {
  n: 1,
  title: "O mito da caverna",
  guide: "trilogia com Platão",
  rule:
    "As lições abrem em ordem. Esta trilogia é o mito da caverna: As Sombras, A Subida e O Retorno.",
  intent:
    "Este módulo é a porta de entrada do Philoo. Três lições com Platão, nesta ordem: As Sombras, A Subida e O Retorno. A ideia é aprender a olhar de novo o que parecia o mundo inteiro.",
  portrait: homeCurrentLesson.heroImage,
  portraitAlt: "Platão na entrada da caverna, à espera de continuar com você",
} as const;

export const caveNextModule: PathNextModule = {
  n: 2,
  title: "Pré-socráticos",
  detail: "Cada lição é um filósofo, começando por Tales.",
  condition: "Abre quando você terminar o mito da caverna.",
  image: "/images/story/plato-v2/plato-first-question-v2.png",
  open: false,
};

export const cavePathTeacher: PathTeacherNote = {
  name: homeTeacherNote.name,
  initials: homeTeacherNote.initials,
  quote: homeTeacherNote.quote,
};

export function buildCavePendencias(
  progress: StudentPathProgress,
  lessons: readonly { n: number; title: string; status: string }[],
): PathPendencia[] {
  const current = lessons.find((lesson) => lesson.n === progress.currentLessonN);
  const remaining = lessons.filter(
    (lesson) => lesson.status === "liberado" || lesson.status === "bloqueado",
  );

  return [
    {
      id: "finish-current",
      label: current ? `Terminar ${current.title}` : "Terminar a lição de agora",
      done: progress.currentProgressPct >= 100,
    },
    {
      id: "rest-of-trilogy",
      label:
        remaining.length > 0
          ? `Seguir ${remaining.map((lesson) => lesson.title).join(" e ")}`
          : "Fechar a trilogia",
      done: remaining.length === 0,
    },
    {
      id: "homework",
      label: portalHomework.assigned
        ? portalHomework.title
        : "Nenhuma lição da professora agora",
      done: !portalHomework.assigned,
    },
    {
      id: "notebook",
      label: "Guardar 10 palavras no caderno",
      done: homeSavedWord.notebookCount >= 10,
    },
  ];
}

export function getCavePathView(progress: StudentPathProgress = previewStudentProgress) {
  const lessons = buildPathLessons(cavePathCatalog, progress);
  const completed = countCompleted(lessons);
  const current = lessons.find((lesson) => lesson.status === "atual");
  const previous = lessons.find((lesson) => lesson.n === progress.currentLessonN - 1);

  return {
    module: cavePathModule,
    progress,
    lessons,
    completed,
    total: lessons.length,
    current,
    previous,
    nextModule: caveNextModule,
    pendencias: buildCavePendencias(progress, lessons),
    teacher: cavePathTeacher,
  };
}
