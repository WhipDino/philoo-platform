import type { LessonJourneyStage } from "../philoo-lesson-journey-rail";

export const A_SUBIDA_JOURNEY_STAGES = [
  {
    id: "virar-o-corpo",
    label: "Virar o corpo",
    sceneIds: ["primeiro-olhar"],
    href: "/aula/a-subida/primeiro-olhar",
  },
  {
    id: "atras-da-parede",
    label: "Atrás da parede",
    sceneIds: ["o-fogo", "duas-explicacoes"],
    href: "/aula/a-subida/o-fogo",
  },
  {
    id: "subida",
    label: "A subida",
    sceneIds: ["a-subida-doi"],
    href: "/aula/a-subida/a-subida-doi",
  },
  {
    id: "olhos-se-acostumam",
    label: "Os olhos se acostumam",
    sceneIds: ["ate-onde-posso-afirmar", "aprender-a-ver"],
    href: "/aula/a-subida/ate-onde-posso-afirmar",
  },
  {
    id: "periagoge",
    label: "Uma palavra de Platão",
    sceneIds: ["periagoge"],
    href: "/aula/a-subida/periagoge",
  },
  {
    id: "revisar",
    label: "Revisar o mundo",
    sceneIds: ["revisar-o-mundo"],
    href: "/aula/a-subida/revisar-o-mundo",
  },
  {
    id: "decisao",
    label: "A decisão",
    sceneIds: ["a-decisao"],
    href: "/aula/a-subida/a-decisao",
  },
] as const satisfies readonly LessonJourneyStage[];

export type ASubidaSceneId =
  (typeof A_SUBIDA_JOURNEY_STAGES)[number]["sceneIds"][number];

export function getASubidaChapterLabel(sceneId: string): string {
  const index = A_SUBIDA_JOURNEY_STAGES.findIndex((stage) =>
    stage.sceneIds.some((id) => id === sceneId),
  );
  const stage = A_SUBIDA_JOURNEY_STAGES[index];

  return stage ? `Capítulo ${index + 1} · ${stage.label}` : "A Subida";
}

