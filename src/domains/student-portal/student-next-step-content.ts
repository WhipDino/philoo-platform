import {
  getHomeworkAttentionCount,
  portalHomeworkAssignments,
} from "./student-homework-content";
import {
  homeCurrentLesson,
  homeModuleTrail,
  homeNextChapter,
  homeTask,
  portalStudent,
} from "./student-portal-content";

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
