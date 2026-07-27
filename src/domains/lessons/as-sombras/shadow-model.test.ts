import { describe, expect, it } from "vitest";
import { runShadowModel } from "./shadow-model";

const baseInput = {
  lightPosition: 0,
  artifactPosition: 4,
  wallPosition: 10,
  artifactHeight: 2,
  carrierVoice: "human",
} as const;

describe("runShadowModel", () => {
  it("derives projection scale from the light, artifact, and wall geometry", () => {
    expect(runShadowModel(baseInput).projectionScale).toBeCloseTo(2.5);
  });

  it("makes the projection larger when the artifact moves closer to the light", () => {
    const original = runShadowModel(baseInput);
    const closer = runShadowModel({
      ...baseInput,
      artifactPosition: 2,
    });

    expect(closer.projectionScale).toBeGreaterThan(
      original.projectionScale ?? 0,
    );
  });

  it("produces no projection when the artifact is outside the light path", () => {
    const result = runShadowModel({
      ...baseInput,
      artifactInLightPath: false,
    });

    expect(result.result).toBe("artifact_outside_light_path");
    expect(result.projectionScale).toBeNull();
    expect(result.projectionSource).toBeNull();
  });

  it("keeps a human voice attached to the carrier regardless of silhouette", () => {
    const bird = runShadowModel({
      ...baseInput,
      artifactSilhouette: "bird",
    });
    const horse = runShadowModel({
      ...baseInput,
      artifactSilhouette: "horse",
    });

    expect(bird.voiceSource).toBe("human_carrier");
    expect(horse.voiceSource).toBe("human_carrier");
    expect(horse.carrierVoice).toBe("human");
  });

  it("assigns footsteps and voice to the carrier", () => {
    const result = runShadowModel(baseInput);

    expect(result.soundSource).toBe("human_carrier");
    expect(result.voiceSource).toBe("human_carrier");
    expect(result.footstepsSource).toBe("human_carrier");
  });

  it("assigns the projection to artifact and light geometry", () => {
    const result = runShadowModel(baseInput);

    expect(result.projectionSource).toBe("bird_artifact");
    expect(result.projectionCause).toBe("artifact_light_geometry");
    expect(result.causalLinks).toEqual([
      "fire_illuminates_artifact",
      "artifact_blocks_light",
      "projection_reaches_wall",
      "carrier_produces_voice_and_steps",
    ]);
  });

  it.each([
    {
      name: "artifact at the light",
      input: { ...baseInput, artifactPosition: 0 },
    },
    {
      name: "wall before the artifact",
      input: { ...baseInput, wallPosition: 3 },
    },
    {
      name: "non-finite geometry",
      input: { ...baseInput, artifactPosition: Number.NaN },
    },
  ])("returns a recoverable named result for $name", ({ input }) => {
    const result = runShadowModel(input);

    expect(result.status).toBe("recoverable");
    expect(result.result).toBe("invalid_position_order");
    expect(result.projectionScale).toBeNull();
    expect(Number.isNaN(result.projectionScale)).toBe(false);
  });
});
