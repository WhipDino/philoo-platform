export type PathLessonStatus = "concluido" | "atual" | "liberado" | "bloqueado";

export type PathLessonCatalog = {
  n: number;
  id: string;
  title: string;
  summary: string;
  meta: string;
  image: string;
  imageAlt: string;
  href?: string;
  parts?: number;
  minutes?: number;
};

export type PathPendencia = {
  id: string;
  label: string;
  done: boolean;
};

export type StudentPathProgress = {
  currentLessonN: number;
  currentProgressPct: number;
  remainingMinutes: number;
  continueHref: string;
  continueLabel: string;
  nextStepBody: string;
  forecastClose: string | null;
};

export type PathNextModule = {
  n: number;
  title: string;
  detail: string;
  condition: string;
  image: string;
  open: boolean;
};

export type PathTeacherNote = {
  name: string;
  initials: string;
  quote: string;
};

export type BuiltPathLesson = PathLessonCatalog & {
  status: PathLessonStatus;
  href?: string;
};

export function lessonStatus(
  n: number,
  currentLessonN: number,
  moduleComplete: boolean,
  playable: boolean,
  currentComplete = false,
): PathLessonStatus {
  if (!playable) {
    return "bloqueado";
  }
  if (moduleComplete || n < currentLessonN) {
    return "concluido";
  }
  if (n === currentLessonN) {
    return "atual";
  }
  if (n === currentLessonN + 1 && currentComplete) {
    return "liberado";
  }
  return "bloqueado";
}

export function buildPathLessons(
  catalog: readonly PathLessonCatalog[],
  progress: StudentPathProgress,
): BuiltPathLesson[] {
  const playableCount = catalog.filter((lesson) => Boolean(lesson.href)).length;
  const moduleComplete =
    progress.currentLessonN > playableCount ||
    (progress.currentLessonN === playableCount && progress.currentProgressPct >= 100);
  const currentComplete = progress.currentProgressPct >= 100;

  return catalog.map((lesson) => {
    const status = lessonStatus(
      lesson.n,
      progress.currentLessonN,
      moduleComplete,
      Boolean(lesson.href),
      currentComplete,
    );
    const href = status === "atual" ? progress.continueHref : lesson.href;

    return {
      ...lesson,
      status,
      href,
    };
  });
}

export function episodeWindow<T extends { n: number }>(
  lessons: readonly T[],
  currentN: number,
  visible = 3,
): readonly T[] {
  if (lessons.length <= visible) {
    return lessons;
  }

  const index = Math.max(
    0,
    lessons.findIndex((lesson) => lesson.n === currentN),
  );
  const maxStart = lessons.length - visible;
  const start = Math.min(maxStart, Math.max(0, index - 1));
  return lessons.slice(start, start + visible);
}

export function countCompleted(lessons: readonly BuiltPathLesson[]): number {
  return lessons.filter((lesson) => lesson.status === "concluido").length;
}

export function lessonProgressPct(status: PathLessonStatus, currentProgressPct: number): number {
  if (status === "concluido") {
    return 100;
  }
  if (status === "atual") {
    return currentProgressPct;
  }
  return 0;
}

export function railVisibleCount(width: number): 1 | 2 | 3 {
  if (width <= 519) {
    return 1;
  }
  if (width <= 839) {
    return 2;
  }
  return 3;
}
