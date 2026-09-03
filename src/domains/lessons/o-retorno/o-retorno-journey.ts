import type { LessonJourneyStage } from "../philoo-lesson-journey-rail";

export const O_RETORNO_JOURNEY_STAGES = [
  {
    id: "na-boca",
    label: "Ele decide voltar",
    sceneIds: ["na-boca"],
    href: "/aula/o-retorno/na-boca",
  },
  {
    id: "katabainein",
    label: "Aletheia",
    sceneIds: ["katabainein"],
    href: "/aula/o-retorno/katabainein",
  },
  {
    id: "a-escuridao",
    label: "Os olhos escurecem de novo",
    sceneIds: ["a-escuridao"],
    href: "/aula/o-retorno/a-escuridao",
  },
  {
    id: "jogos-de-sombra",
    label: "Ele perde o jogo",
    sceneIds: ["jogos-de-sombra"],
    href: "/aula/o-retorno/jogos-de-sombra",
  },
  {
    id: "a-divida",
    label: "O medo e a obrigação",
    sceneIds: ["a-divida"],
    href: "/aula/o-retorno/a-divida",
  },
  {
    id: "a-descida",
    label: "O mito e a filosofia",
    sceneIds: ["a-descida"],
    href: "/aula/o-retorno/a-descida",
  },
] as const satisfies readonly LessonJourneyStage[];

export type ORetornoSceneId =
  (typeof O_RETORNO_JOURNEY_STAGES)[number]["sceneIds"][number];

export function getORetornoChapterLabel(sceneId: string): string {
  const index = O_RETORNO_JOURNEY_STAGES.findIndex((stage) =>
    stage.sceneIds.some((id) => id === sceneId),
  );
  const stage = O_RETORNO_JOURNEY_STAGES[index];

  return stage ? `Beat ${index + 1} · ${stage.label}` : "O Retorno";
}
