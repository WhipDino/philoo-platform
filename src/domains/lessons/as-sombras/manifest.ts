import type { JsonObject, LessonManifest, SceneNode } from "../contracts";
import type { CaveSceneId } from "./state";

export type CaveSceneKind =
  | "prologue"
  | "prisoner_view"
  | "prediction_mastery"
  | "impossible_shadow"
  | "evidence_investigation"
  | "shadow_laboratory"
  | "defend_model"
  | "revision_map"
  | "transfer_case";

export type CaveSceneConfig = JsonObject & {
  readonly countsTowardProgress: boolean;
  readonly purpose: string;
  readonly environmentAsset: string;
  readonly platoAsset?: string;
  readonly usesPlayerShell?: boolean;
};

export type CaveScene = SceneNode<CaveSceneKind, CaveSceneConfig> & {
  readonly id: CaveSceneId;
};

const cavePlayerStage = "/images/cave/cave-player-stage.webp";
const caveWallStage = "/images/cave/cave-wall-stage.webp";
const platoMaster = "/images/plato/platao-master.webp";

export const cavePath = [
  ["prologue_corte_de_luz", "enter_the_wall"],
  ["prisoner_view", "begin_prediction_training"],
  ["prediction_mastery", "confront_impossible_shadow"],
  ["impossible_shadow", "inspect_evidence"],
  ["evidence_investigation", "enter_thought_space"],
  ["shadow_laboratory", "defend_model"],
  ["defend_model", "revisit_first_view"],
  ["revision_map", "test_transfer"],
  ["transfer_case", "complete_session"],
] as const;

const scenes = [
  {
    id: "prologue_corte_de_luz",
    arcId: "prologue",
    kind: "prologue",
    mode: "custom",
    title: "Corte de Luz",
    savePoint: true,
    config: {
      countsTowardProgress: false,
      usesPlayerShell: false,
      purpose:
        "Observar o mecanismo por fora e registrar uma hipótese provisória.",
      environmentAsset: cavePlayerStage,
      platoAsset: platoMaster,
    },
    transitions: [{ name: "enter_the_wall", to: "prisoner_view" }],
  },
  {
    id: "prisoner_view",
    arcId: "act_1",
    kind: "prisoner_view",
    mode: "custom",
    title: "Só a parede",
    savePoint: true,
    config: {
      countsTowardProgress: true,
      usesPlayerShell: true,
      purpose:
        "Distinguir o que chega aos sentidos da explicação que damos a isso.",
      environmentAsset: caveWallStage,
    },
    transitions: [
      { name: "begin_prediction_training", to: "prediction_mastery" },
    ],
  },
  {
    id: "prediction_mastery",
    arcId: "act_2",
    kind: "prediction_mastery",
    mode: "custom",
    title: "As regras da parede",
    savePoint: true,
    config: {
      countsTowardProgress: true,
      usesPlayerShell: true,
      purpose:
        "Descobrir por que um modelo limitado ainda pode produzir previsões úteis.",
      environmentAsset: caveWallStage,
    },
    transitions: [
      { name: "confront_impossible_shadow", to: "impossible_shadow" },
    ],
  },
  {
    id: "impossible_shadow",
    arcId: "act_3",
    kind: "impossible_shadow",
    mode: "custom",
    title: "O pássaro impossível",
    savePoint: true,
    config: {
      countsTowardProgress: true,
      usesPlayerShell: true,
      purpose:
        "Encontrar a incompatibilidade entre forma, som e tempo que o modelo atual não explica.",
      environmentAsset: caveWallStage,
      platoAsset: platoMaster,
    },
    transitions: [{ name: "inspect_evidence", to: "evidence_investigation" }],
  },
  {
    id: "evidence_investigation",
    arcId: "act_3",
    kind: "evidence_investigation",
    mode: "composable",
    title: "Siga a incompatibilidade",
    savePoint: true,
    config: {
      countsTowardProgress: true,
      usesPlayerShell: true,
      purpose:
        "Coordenar pistas de canais diferentes e comparar duas explicações possíveis.",
      environmentAsset: caveWallStage,
      platoAsset: platoMaster,
    },
    transitions: [
      { name: "recover_first_clue", to: "impossible_shadow" },
      { name: "enter_thought_space", to: "shadow_laboratory" },
    ],
  },
  {
    id: "shadow_laboratory",
    arcId: "act_4",
    kind: "shadow_laboratory",
    mode: "custom",
    title: "Espaço de Pensamento",
    savePoint: true,
    config: {
      countsTowardProgress: true,
      usesPlayerShell: true,
      purpose:
        "Construir um modelo causal e usá-lo para prever o efeito de uma mudança.",
      environmentAsset: cavePlayerStage,
      platoAsset: platoMaster,
    },
    transitions: [{ name: "defend_model", to: "defend_model" }],
  },
  {
    id: "defend_model",
    arcId: "act_5",
    kind: "defend_model",
    mode: "composable",
    title: "O melhor argumento contrário",
    savePoint: true,
    config: {
      countsTowardProgress: true,
      usesPlayerShell: true,
      purpose:
        "Defender uma conclusão com evidência sem apagar o que o modelo rival explica bem.",
      environmentAsset: cavePlayerStage,
      platoAsset: platoMaster,
    },
    transitions: [{ name: "revisit_first_view", to: "revision_map" }],
  },
  {
    id: "revision_map",
    arcId: "act_5",
    kind: "revision_map",
    mode: "composable",
    title: "Sua hipótese, de novo",
    savePoint: true,
    config: {
      countsTowardProgress: true,
      usesPlayerShell: true,
      purpose:
        "Comparar a primeira hipótese com as novas pistas e tornar a revisão visível.",
      environmentAsset: cavePlayerStage,
      platoAsset: platoMaster,
    },
    transitions: [{ name: "test_transfer", to: "transfer_case" }],
  },
  {
    id: "transfer_case",
    arcId: "act_6",
    kind: "transfer_case",
    mode: "composable",
    title: "Outro tipo de sombra",
    savePoint: true,
    config: {
      countsTowardProgress: true,
      usesPlayerShell: true,
      purpose:
        "Separar representação, fonte, afirmação e evidência em um novo caso.",
      environmentAsset: cavePlayerStage,
      platoAsset: platoMaster,
    },
    transitions: [{ name: "complete_session", to: "$complete" }],
  },
] as const satisfies readonly CaveScene[];

export const asSombrasManifest: LessonManifest<(typeof scenes)[number]> = {
  identity: {
    id: "philoo.as-sombras.session-one",
    slug: "as-sombras",
    locale: "pt-BR",
    version: "1.0.0",
    contentHash: "as-sombras-session-one-v1",
  },
  title: "As Sombras",
  entrySceneId: "prologue_corte_de_luz",
  arcs: [
    {
      id: "prologue",
      title: "Corte de Luz",
      sceneIds: ["prologue_corte_de_luz"],
    },
    { id: "act_1", title: "A parede", sceneIds: ["prisoner_view"] },
    {
      id: "act_2",
      title: "Tornar-se especialista",
      sceneIds: ["prediction_mastery"],
    },
    {
      id: "act_3",
      title: "A sombra impossível",
      sceneIds: ["impossible_shadow", "evidence_investigation"],
    },
    {
      id: "act_4",
      title: "Reconstruir a caverna",
      sceneIds: ["shadow_laboratory"],
    },
    {
      id: "act_5",
      title: "Defender ou revisar",
      sceneIds: ["defend_model", "revision_map"],
    },
    { id: "act_6", title: "O que é uma sombra?", sceneIds: ["transfer_case"] },
  ],
  scenes,
};
