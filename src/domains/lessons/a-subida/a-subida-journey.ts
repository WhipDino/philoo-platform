import type { LessonJourneyStage } from "../philoo-lesson-journey-rail";

export const A_SUBIDA_JOURNEY_STAGES = [
  {
    id: "depois-da-virada",
    label: "Uma imagem diferente",
    sceneIds: ["depois-da-virada"],
    href: "/aula/a-subida/depois-da-virada",
  },
  {
    id: "fogo-e-estatuas",
    label: "O fogo",
    sceneIds: ["fogo-e-estatuas"],
    href: "/aula/a-subida/fogo-e-estatuas",
  },
  {
    id: "a-subida-dolorosa",
    label: "A passagem íngreme",
    sceneIds: ["a-subida-dolorosa"],
    href: "/aula/a-subida/a-subida-dolorosa",
  },
  {
    id: "sombras-la-fora",
    label: "Ele saiu",
    sceneIds: ["sombras-la-fora"],
    href: "/aula/a-subida/sombras-la-fora",
  },
  {
    id: "periagoge",
    label: "Uma palavra",
    sceneIds: ["periagoge"],
    href: "/aula/a-subida/periagoge",
  },
  {
    id: "a-decisao",
    label: "Ele pensou em voltar",
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

  return stage ? `Beat ${index + 1} · ${stage.label}` : "A Subida";
}
