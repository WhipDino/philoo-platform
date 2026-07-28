import { describe, expect, it } from "vitest";
import { resolveNamedTransition, validateLessonManifest } from "../graph";
import { asSombrasManifest, cavePath } from "./manifest";

describe("As Sombras manifest", () => {
  it("defines the valid nine-scene Cave investigation", () => {
    expect(validateLessonManifest(asSombrasManifest)).toEqual([]);
    expect(asSombrasManifest.scenes).toHaveLength(9);
    expect(asSombrasManifest.entrySceneId).toBe("prologue_corte_de_luz");
    expect(
      asSombrasManifest.scenes.filter(
        (scene) => scene.config.countsTowardProgress,
      ),
    ).toHaveLength(8);
  });

  it("groups the counted investigation into the six approved acts", () => {
    const acts = asSombrasManifest.arcs.filter((arc) =>
      arc.id.startsWith("act_"),
    );

    expect(acts.map((act) => act.title)).toEqual([
      "A parede",
      "Tornar-se especialista",
      "A sombra impossível",
      "Reconstruir a caverna",
      "Defender ou revisar",
      "O que é uma sombra?",
    ]);
    expect(acts.flatMap((act) => act.sceneIds)).toHaveLength(8);
  });

  it("follows the exact named path through completion", () => {
    expect(cavePath).toEqual([
      ["prologue_corte_de_luz", "enter_the_wall"],
      ["prisoner_view", "begin_prediction_training"],
      ["prediction_mastery", "confront_impossible_shadow"],
      ["impossible_shadow", "inspect_evidence"],
      ["evidence_investigation", "enter_thought_space"],
      ["shadow_laboratory", "defend_model"],
      ["defend_model", "revisit_first_view"],
      ["revision_map", "test_transfer"],
      ["transfer_case", "complete_session"],
    ]);
    expect(
      cavePath.map(([sceneId, transitionName]) =>
        resolveNamedTransition(
          asSombrasManifest,
          sceneId,
          transitionName,
        ),
      ),
    ).toEqual([
      "prisoner_view",
      "prediction_mastery",
      "impossible_shadow",
      "evidence_investigation",
      "shadow_laboratory",
      "defend_model",
      "revision_map",
      "transfer_case",
      "$complete",
    ]);
  });

  it("uses context-matched Plato poses instead of the master asset", () => {
    expect(
      asSombrasManifest.scenes.find(
        (scene) => scene.id === "shadow_laboratory",
      )?.mode,
    ).toBe("custom");

    const serializedManifest = JSON.stringify(asSombrasManifest);
    expect(serializedManifest).toContain(
      "/images/cave/cave-player-stage.webp",
    );
    expect(serializedManifest).toContain(
      "/images/cave/cave-wall-stage.webp",
    );
    expect(serializedManifest).not.toContain("/images/plato/platao-master.webp");

    expect(
      Object.fromEntries(
        asSombrasManifest.scenes
          .filter((scene) => scene.config.platoAsset)
          .map((scene) => [scene.id, scene.config.platoAsset]),
      ),
    ).toEqual({
      prologue_corte_de_luz: "/images/story/plato-v2/plato-first-question-v2.png",
      impossible_shadow: "/images/story/plato-v2/plato-diagnose-anomaly-v2.png",
      evidence_investigation: "/images/story/plato-v2/plato-review-evidence-v2.png",
      shadow_laboratory: "/images/story/plato-v2/plato-prediction-model-v2.png",
      defend_model: "/images/story/plato-v2/plato-review-argument-v2.png",
      revision_map: "/images/story/plato-v2/plato-revision-change-v2.png",
      transfer_case: "/images/story/plato-v2/plato-frame-versus-claim-v2.png",
    });
  });
});
