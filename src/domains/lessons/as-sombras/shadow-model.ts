export const SHADOW_CAUSAL_LINKS = [
  "fire_illuminates_artifact",
  "artifact_blocks_light",
  "projection_reaches_wall",
  "carrier_produces_voice_and_steps",
] as const;

export type ShadowCausalLink = (typeof SHADOW_CAUSAL_LINKS)[number];
export type CarrierVoice = "human" | "silent";
export type ShadowModelResult =
  | "projection_created"
  | "artifact_outside_light_path"
  | "invalid_position_order"
  | "non_finite_projection";

export interface ShadowModelInput {
  readonly lightPosition: number;
  readonly artifactPosition: number;
  readonly wallPosition: number;
  readonly artifactHeight: number;
  readonly carrierVoice: CarrierVoice;
  readonly artifactInLightPath?: boolean;
  readonly artifactPathOffset?: number;
  readonly lightPathHalfWidth?: number;
  readonly artifactSilhouette?: string;
  readonly artifactId?: string;
}

export interface ShadowModelOutput {
  readonly status: "productive" | "recoverable";
  readonly result: ShadowModelResult;
  readonly projectionScale: number | null;
  readonly projectionHeight: number | null;
  readonly projectionSource: string | null;
  readonly projectionCause: "artifact_light_geometry" | null;
  readonly soundSource: "human_carrier";
  readonly voiceSource: "human_carrier" | null;
  readonly footstepsSource: "human_carrier";
  readonly carrierVoice: CarrierVoice;
  readonly causalLinks: readonly ShadowCausalLink[];
}

function recoverableOutput(
  input: ShadowModelInput,
  result:
    | "artifact_outside_light_path"
    | "invalid_position_order"
    | "non_finite_projection",
): ShadowModelOutput {
  return {
    status: "recoverable",
    result,
    projectionScale: null,
    projectionHeight: null,
    projectionSource: null,
    projectionCause: null,
    soundSource: "human_carrier",
    voiceSource:
      input.carrierVoice === "human" ? "human_carrier" : null,
    footstepsSource: "human_carrier",
    carrierVoice: input.carrierVoice,
    causalLinks: [],
  };
}

function isFiniteGeometry(input: ShadowModelInput) {
  return [
    input.lightPosition,
    input.artifactPosition,
    input.wallPosition,
    input.artifactHeight,
  ].every(Number.isFinite);
}

function artifactIsInLightPath(input: ShadowModelInput) {
  if (input.artifactInLightPath === false) {
    return false;
  }

  if (input.artifactPathOffset === undefined) {
    return true;
  }

  const halfWidth = input.lightPathHalfWidth ?? 1;
  return (
    Number.isFinite(input.artifactPathOffset) &&
    Number.isFinite(halfWidth) &&
    halfWidth >= 0 &&
    Math.abs(input.artifactPathOffset) <= halfWidth
  );
}

export function runShadowModel(
  input: ShadowModelInput,
): ShadowModelOutput {
  if (
    !isFiniteGeometry(input) ||
    input.artifactHeight <= 0 ||
    input.artifactPosition <= input.lightPosition ||
    input.wallPosition <= input.artifactPosition
  ) {
    return recoverableOutput(input, "invalid_position_order");
  }

  if (!artifactIsInLightPath(input)) {
    return recoverableOutput(input, "artifact_outside_light_path");
  }

  const projectionScale =
    (input.wallPosition - input.lightPosition) /
    (input.artifactPosition - input.lightPosition);
  const silhouette = input.artifactSilhouette ?? "bird";
  const projectionSource =
    input.artifactId ?? `${silhouette}_artifact`;
  const projectionHeight = input.artifactHeight * projectionScale;

  if (
    !Number.isFinite(projectionScale) ||
    !Number.isFinite(projectionHeight)
  ) {
    return recoverableOutput(input, "non_finite_projection");
  }

  return {
    status: "productive",
    result: "projection_created",
    projectionScale,
    projectionHeight,
    projectionSource,
    projectionCause: "artifact_light_geometry",
    soundSource: "human_carrier",
    voiceSource:
      input.carrierVoice === "human" ? "human_carrier" : null,
    footstepsSource: "human_carrier",
    carrierVoice: input.carrierVoice,
    causalLinks: SHADOW_CAUSAL_LINKS,
  };
}
