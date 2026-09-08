import {
  getHomeworkAttentionCount,
  portalHomeworkAssignments,
} from "./student-homework-content";
import {
  homeCurrentLesson,
  homeModuleTrail,
  homeNextChapter,
  homeTask,
  portalAnnouncements,
  portalStudent,
} from "./student-portal-content";

export type HomeBoardKind = "lesson" | "teacher" | "recommend";

export type HomeBoardPost = {
  id: string;
  kind: HomeBoardKind;
  tag: string;
  title: string;
  body: string;
  source: string;
  href: string;
  cta: string;
  pinned?: boolean;
};

export type HomeSequenceDay = {
  id: string;
  label: string;
  done: boolean;
  today?: boolean;
};

export const homeSequenceMeta = {
  title: "Sequência",
  lead: "Três dias seguidos lendo. Se um dia pular, a sequência só espera você voltar.",
} as const;

export function getHomeSequence(): {
  count: number;
  days: readonly HomeSequenceDay[];
} {
  return {
    count: 3,
    days: [
      { id: "seg", label: "S", done: true },
      { id: "ter", label: "T", done: true },
      { id: "qua", label: "Q", done: true, today: true },
      { id: "qui", label: "Q", done: false },
      { id: "sex", label: "S", done: false },
      { id: "sab", label: "S", done: false },
      { id: "dom", label: "D", done: false },
    ],
  };
}

export function getHomeBoardPosts(): readonly HomeBoardPost[] {
  const teacherNote = portalAnnouncements[0];

  return [
    {
      id: "board-lesson-heraclitus",
      kind: "lesson",
      tag: "Lição nova",
      title: "Heráclito e a mudança",
      body: "A professora liberou esta lição na trilha. Fica no mural até você abrir — e ela pode fixar o recado da sala.",
      source: portalStudent.teacher,
      href: "/aula/heraclitus/ola",
      cta: "Abrir lição",
      pinned: true,
    },
    {
      id: `board-${teacherNote.id}`,
      kind: "teacher",
      tag: "Recado da professora",
      title: teacherNote.title,
      body: teacherNote.body,
      source: `${teacherNote.author} · ${teacherNote.date}`,
      href: "/inicio?view=announcements",
      cta: "Ler recado",
      pinned: true,
    },
    {
      id: "board-recommend-doxa",
      kind: "recommend",
      tag: "Recomendação",
      title: "Voltar a dóxa no caderno",
      body: "Você parou em As Sombras, no capítulo da palavra. Uma releitura curta do caderno ajuda a guardar o conceito antes da prova.",
      source: "Com base no ponto em que você parou",
      href: "/inicio?view=notebook",
      cta: "Abrir caderno",
    },
  ];
}

export type NextStepKind = "continue" | "homework" | "chapter";

export type NextStepItem = {
  id: string;
  kind: NextStepKind;
  rank: number;
  eyebrow: string;
  title: string;
  detail: string;
  href: string;
  cta: string;
  progressPct?: number;
  imageSrc?: string;
  imageAlt?: string;
};

/** Fila orientada ao mercado: um próximo passo claro + poucos itens seguintes. */
export function buildNextStepQueue(): readonly NextStepItem[] {
  const queue: NextStepItem[] = [
    {
      id: "continue-lesson",
      kind: "continue",
      rank: 1,
      eyebrow: "Seu próximo passo",
      title: homeCurrentLesson.moduleTitle,
      detail: homeCurrentLesson.support,
      href: homeCurrentLesson.continueHref,
      cta: "Continuar aula",
      progressPct: homeCurrentLesson.progress,
    },
  ];

  const homeworkCount = getHomeworkAttentionCount();
  const homework = portalHomeworkAssignments.find(
    (item) => item.listStatus === "open" || item.listStatus === "overdue",
  );
  if (homework && homeworkCount > 0) {
    queue.push({
      id: `homework-${homework.id}`,
      kind: "homework",
      rank: 2,
      eyebrow: homework.listStatus === "overdue" ? "Atrasado" : "Lição de casa",
      title: homework.title,
      detail: `${homework.dueLabel} · ${homework.moduleLabel}`,
      href: `/inicio?view=homework&homework=${homework.id}`,
      cta: homeTask.cta,
    });
  }

  if (homeNextChapter.href) {
    queue.push({
      id: "next-chapter",
      kind: "chapter",
      rank: 4,
      eyebrow: `Capítulo ${homeNextChapter.n}`,
      title: homeNextChapter.title,
      detail: homeNextChapter.synopsis,
      href: homeNextChapter.href,
      cta: "Abrir capítulo",
      imageSrc: homeNextChapter.image,
      imageAlt: `Capa do capítulo ${homeNextChapter.title}`,
    });
  }

  return queue.sort((a, b) => a.rank - b.rank);
}

export function getNextStepHero() {
  const [primary] = buildNextStepQueue();
  const moduleProgressPct = Math.round(
    (homeCurrentLesson.readCount / homeCurrentLesson.chapterCount) * 100,
  );
  return {
    greeting: `Olá, ${portalStudent.firstName}`,
    lead: "Platão está na entrada da caverna. Capítulo 7 te espera.",
    primary,
    sceneImage: homeCurrentLesson.sceneImage,
    moduleChip: "Saindo da Caverna",
    chapterLabel: `Capítulo ${homeCurrentLesson.chapterIndex} de ${homeCurrentLesson.chapterCount}`,
    hook: "Platão está esperando na entrada da caverna para descer com você.",
    moduleProgressPct,
    chaptersRead: homeCurrentLesson.readCount,
    chapterCount: homeCurrentLesson.chapterCount,
    focusWord: homeCurrentLesson.word,
    chapters: homeModuleTrail,
    currentChapter:
      homeModuleTrail.find((chapter) => chapter.status === "atual") ?? homeModuleTrail[6],
    nextChapter: homeNextChapter,
  };
}
