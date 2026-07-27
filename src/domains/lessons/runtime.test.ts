import { describe, expect, it } from "vitest";
import type { LessonManifest, SceneNode } from "./contracts";
import { applySceneCommit, createInitialSnapshot } from "./runtime";

const scenes = [
  {
    id: "prologue",
    arcId: "entry",
    kind: "prologue",
    mode: "custom",
    title: "Prólogo",
    savePoint: true,
    config: {},
    transitions: [{ name: "enter_wall", to: "wall" }],
  },
  {
    id: "wall",
    arcId: "act-1",
    kind: "wall",
    mode: "custom",
    title: "Só a parede",
    savePoint: true,
    config: {},
    transitions: [{ name: "finish", to: "$complete" }],
  },
] as const satisfies readonly SceneNode[];

const manifest: LessonManifest<(typeof scenes)[number]> = {
  identity: {
    id: "lesson.test",
    slug: "test",
    locale: "pt-BR",
    version: "1.0.0",
    contentHash: "test-v1",
  },
  title: "Teste",
  entrySceneId: "prologue",
  arcs: [
    { id: "entry", title: "Entrada", sceneIds: ["prologue"] },
    { id: "act-1", title: "Ato 1", sceneIds: ["wall"] },
  ],
  scenes,
};

describe("lesson attempt runtime", () => {
  it("preserves responses and advances only through a named transition", () => {
    const initial = createInitialSnapshot(manifest);
    const next = applySceneCommit(manifest, initial, {
      eventName: "hypothesis_registered",
      nextSceneState: { draft: "Sombras mostram contornos." },
      responses: {
        prologueHypothesis: {
          visibility: "private_reflection",
          value: "Sombras mostram contornos.",
        },
      },
      transition: "enter_wall",
    });

    expect(next.currentSceneId).toBe("wall");
    expect(next.sequence).toBe(1);
    expect(next.responses.prologueHypothesis.visibility).toBe("private_reflection");
    expect(next.visitedSceneIds).toEqual(["prologue", "wall"]);
  });

  it("updates only the current scene when a commit has no transition", () => {
    const initial = createInitialSnapshot(manifest);
    const next = applySceneCommit(manifest, initial, {
      eventName: "draft_saved",
      nextSceneState: { draft: "Anotação em andamento" },
    });

    expect(next.currentSceneId).toBe("prologue");
    expect(next.sceneState).toEqual({
      prologue: { draft: "Anotação em andamento" },
    });
    expect(next.visitedSceneIds).toEqual(["prologue"]);
    expect(next.sequence).toBe(1);
  });

  it("marks the attempt complete when a named transition targets completion", () => {
    const atWall = applySceneCommit(manifest, createInitialSnapshot(manifest), {
      eventName: "hypothesis_registered",
      nextSceneState: {},
      transition: "enter_wall",
    });
    const completed = applySceneCommit(manifest, atWall, {
      eventName: "wall_finished",
      nextSceneState: { complete: true },
      transition: "finish",
    });

    expect(completed.status).toBe("completed");
    expect(completed.currentSceneId).toBe("wall");
    expect(completed.sequence).toBe(2);
  });

  it("rejects unknown transitions without changing the original snapshot", () => {
    const initial = createInitialSnapshot(manifest);

    expect(() =>
      applySceneCommit(manifest, initial, {
        eventName: "invalid_transition",
        nextSceneState: { draft: "Não deve ser salvo" },
        transition: "missing",
      }),
    ).toThrow(/missing.*prologue|prologue.*missing/i);
    expect(initial).toEqual({
      lessonId: "lesson.test",
      lessonVersion: "1.0.0",
      currentSceneId: "prologue",
      visitedSceneIds: ["prologue"],
      sceneState: {},
      responses: {},
      sequence: 0,
      status: "in_progress",
    });
  });

  it("returns a new immutable snapshot without mutating nested input state", () => {
    const initial = createInitialSnapshot(manifest);
    const first = applySceneCommit(manifest, initial, {
      eventName: "draft_saved",
      nextSceneState: { draft: "Primeira versão" },
      responses: {
        firstResponse: {
          visibility: "private_reflection",
          value: "Primeira reflexão",
        },
      },
    });
    const next = applySceneCommit(manifest, first, {
      eventName: "draft_revised",
      nextSceneState: { draft: "Segunda versão" },
      responses: {
        secondResponse: {
          visibility: "teacher_visible_task",
          value: "Resposta revisada",
        },
      },
    });

    expect(next).not.toBe(first);
    expect(next.sceneState).not.toBe(first.sceneState);
    expect(next.responses).not.toBe(first.responses);
    expect(first.sceneState).toEqual({ prologue: { draft: "Primeira versão" } });
    expect(first.responses).toEqual({
      firstResponse: {
        visibility: "private_reflection",
        value: "Primeira reflexão",
      },
    });
    expect(next.responses).toEqual({
      firstResponse: {
        visibility: "private_reflection",
        value: "Primeira reflexão",
      },
      secondResponse: {
        visibility: "teacher_visible_task",
        value: "Resposta revisada",
      },
    });
  });
});
