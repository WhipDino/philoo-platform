import { describe, expect, it } from "vitest";
import type { LessonManifest, SceneNode } from "./contracts";
import {
  getRequiredSceneOrder,
  resolveNamedTransition,
  validateLessonManifest,
} from "./graph";

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

describe("lesson graph", () => {
  it("resolves transitions by name and exposes the required order", () => {
    expect(resolveNamedTransition(manifest, "prologue", "enter_wall")).toBe("wall");
    expect(getRequiredSceneOrder(manifest)).toEqual(["prologue", "wall"]);
  });

  it("rejects duplicate IDs, missing targets, and unreachable nodes", () => {
    const broken = {
      ...manifest,
      scenes: [
        ...manifest.scenes,
        {
          ...manifest.scenes[1],
          transitions: [{ name: "missing", to: "nowhere" }],
        },
      ],
    };

    expect(validateLessonManifest(broken)).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/duplicate scene id/i),
        expect.stringMatching(/unknown target/i),
      ]),
    );
  });

  it("reports every remaining graph integrity violation", () => {
    const broken = {
      ...manifest,
      entrySceneId: "missing-entry",
      arcs: [
        { id: "entry", title: "Entrada", sceneIds: ["prologue", "missing-scene"] },
        { id: "act-1", title: "Ato 1", sceneIds: ["prologue"] },
      ],
      scenes: [
        {
          ...manifest.scenes[0],
          transitions: [
            { name: "repeat", to: "wall" },
            { name: "repeat", to: "wall" },
          ],
        },
        { ...manifest.scenes[1], transitions: [] },
      ],
    };

    expect(validateLessonManifest(broken)).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/unknown entry scene/i),
        expect.stringMatching(/duplicate transition name/i),
        expect.stringMatching(/arc.*unknown scene/i),
        expect.stringMatching(/assigned exactly once/i),
        expect.stringMatching(/unreachable/i),
        expect.stringMatching(/no path to \$complete/i),
      ]),
    );
  });

  it("names the missing scene and transition when resolution fails", () => {
    expect(() => resolveNamedTransition(manifest, "prologue", "missing"))
      .toThrow(/prologue.*missing|missing.*prologue/i);
  });

  it("rejects a scene whose declared arc differs from its assignment", () => {
    const inconsistent = {
      ...manifest,
      scenes: [
        manifest.scenes[0],
        {
          ...manifest.scenes[1],
          arcId: "entry",
        },
      ],
    };

    expect(validateLessonManifest(inconsistent)).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/scene "wall".*arc "entry".*assigned.*"act-1"/i),
      ]),
    );
  });

  it("does not include unknown targets in the required scene order", () => {
    const invalid = {
      ...manifest,
      scenes: [
        {
          ...manifest.scenes[0],
          transitions: [{ name: "missing_target", to: "nowhere" }],
        },
        manifest.scenes[1],
      ],
    };

    expect(getRequiredSceneOrder(invalid)).toEqual(["prologue"]);
  });

  it("traverses an empty-string entry scene ID", () => {
    const emptyEntryScenes = [
      {
        ...manifest.scenes[0],
        id: "",
        transitions: [{ name: "enter_wall", to: "wall" }],
      },
      manifest.scenes[1],
    ] as const satisfies readonly SceneNode[];
    const emptyEntryManifest: LessonManifest<
      (typeof emptyEntryScenes)[number]
    > = {
      ...manifest,
      entrySceneId: "",
      arcs: [
        { id: "entry", title: "Entrada", sceneIds: [""] },
        { id: "act-1", title: "Ato 1", sceneIds: ["wall"] },
      ],
      scenes: emptyEntryScenes,
    };

    expect(getRequiredSceneOrder(emptyEntryManifest)).toEqual(["", "wall"]);
    expect(validateLessonManifest(emptyEntryManifest)).toEqual([]);
  });

  it("propagates completion through an empty-string scene ID", () => {
    const completionBridgeScenes = [
      {
        ...manifest.scenes[0],
        id: "before",
        transitions: [{ name: "enter_empty", to: "" }],
      },
      {
        ...manifest.scenes[0],
        id: "",
        transitions: [{ name: "enter_wall", to: "wall" }],
      },
      manifest.scenes[1],
    ] as const satisfies readonly SceneNode[];
    const completionBridgeManifest: LessonManifest<
      (typeof completionBridgeScenes)[number]
    > = {
      ...manifest,
      entrySceneId: "before",
      arcs: [
        { id: "entry", title: "Entrada", sceneIds: ["before", ""] },
        { id: "act-1", title: "Ato 1", sceneIds: ["wall"] },
      ],
      scenes: completionBridgeScenes,
    };

    expect(validateLessonManifest(completionBridgeManifest)).toEqual([]);
  });
});
