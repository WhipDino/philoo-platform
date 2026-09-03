import { describe, expect, it } from "vitest";
import { cavePathCatalog, getCavePathView, previewStudentProgress } from "./student-path-content";
import {
  buildPathLessons,
  countCompleted,
  episodeWindow,
  lessonProgressPct,
  lessonStatus,
  railVisibleCount,
} from "./student-path-model";

describe("railVisibleCount", () => {
  it("keeps three readable cards on a wide rail, then two, then one", () => {
    expect(railVisibleCount(1200)).toBe(3);
    expect(railVisibleCount(840)).toBe(3);
    expect(railVisibleCount(839)).toBe(2);
    expect(railVisibleCount(520)).toBe(2);
    expect(railVisibleCount(519)).toBe(1);
  });
});
describe("lessonProgressPct", () => {
  it("fills the bar only for the current lesson and completed ones", () => {
    expect(lessonProgressPct("bloqueado", 67)).toBe(0);
    expect(lessonProgressPct("liberado", 67)).toBe(0);
    expect(lessonProgressPct("atual", 67)).toBe(67);
    expect(lessonProgressPct("atual", 0)).toBe(0);
    expect(lessonProgressPct("concluido", 40)).toBe(100);
  });
});

describe("lessonStatus", () => {
  it("marks earlier lessons complete, the current one active, and later built lessons open until progress is stored", () => {
    expect(lessonStatus(1, 1, false, true, false)).toBe("atual");
    expect(lessonStatus(2, 1, false, true, false)).toBe("liberado");
    expect(lessonStatus(2, 1, false, true, true)).toBe("liberado");
    expect(lessonStatus(3, 1, false, false, false)).toBe("bloqueado");
  });

  it("keeps an unbuilt lesson closed even when it would be next", () => {
    expect(lessonStatus(3, 2, false, false)).toBe("bloqueado");
  });
});

describe("getCavePathView", () => {
  it("builds the cave trilogy from the real lessons and preview progress", () => {
    const view = getCavePathView();

    expect(view.module.title).toBe("O mito da caverna");
    expect(view.module.intent).toMatch(/porta de entrada/i);
    expect(view.total).toBe(3);
    expect(view.completed).toBe(0);
    expect(view.current?.n).toBe(1);
    expect(view.current?.title).toBe("As Sombras");
    expect(view.progress.continueHref).toBe("/aula/as-sombras/doxa");
    expect(view.lessons[0]?.href).toBe("/aula/as-sombras/doxa");
    expect(view.current?.summary).toContain("parede");
    expect(view.nextModule.title).toBe("Pré-socráticos");
    expect(view.nextModule.open).toBe(false);
    expect(view.lessons.map((lesson) => lesson.status)).toEqual([
      "atual",
      "liberado",
      "liberado",
    ]);
  });

  it("moves the hot lesson when progress advances to A Subida", () => {
    const view = getCavePathView({
      ...previewStudentProgress,
      currentLessonN: 2,
      currentProgressPct: 10,
      continueHref: "/aula/a-subida/depois-da-virada",
      continueLabel: "Continuar A Subida",
      nextStepBody: "Você chegou à luz. A Subida começa na virada da caverna.",
    });

    expect(view.current?.n).toBe(2);
    expect(view.current?.title).toBe("A Subida");
    expect(view.completed).toBe(1);
    expect(view.previous?.title).toBe("As Sombras");
    expect(view.lessons[2]?.status).toBe("liberado");
  });
});

describe("episodeWindow", () => {
  const catalog = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({ n }));

  it("keeps a short trilogy fully visible", () => {
    expect(episodeWindow([{ n: 1 }, { n: 2 }, { n: 3 }], 1).map((item) => item.n)).toEqual([1, 2, 3]);
  });

  it("centers the current lesson between the previous and the next", () => {
    expect(episodeWindow(catalog, 5).map((item) => item.n)).toEqual([4, 5, 6]);
    expect(episodeWindow(catalog, 6).map((item) => item.n)).toEqual([5, 6, 7]);
  });

  it("starts at the beginning and ends at the last three", () => {
    expect(episodeWindow(catalog, 1).map((item) => item.n)).toEqual([1, 2, 3]);
    expect(episodeWindow(catalog, 9).map((item) => item.n)).toEqual([7, 8, 9]);
  });
});

describe("buildPathLessons", () => {
  it("keeps catalog titles while pointing the current lesson at the resume href", () => {
    const lessons = buildPathLessons(cavePathCatalog, previewStudentProgress);
    expect(countCompleted(lessons)).toBe(0);
    expect(lessons[0]?.href).toBe("/aula/as-sombras/doxa");
    expect(lessons[1]?.href).toBe("/aula/a-subida/depois-da-virada");
    expect(lessons[2]?.href).toBe("/aula/o-retorno/na-boca");
  });
});
