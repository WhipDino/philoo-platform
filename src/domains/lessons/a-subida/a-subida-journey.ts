import type { LessonJourneyStage } from "../philoo-lesson-journey-rail";

export const A_SUBIDA_JOURNEY_STAGES = [
  {
    id: "depois-da-virada",
    label: "Depois da virada",
    sceneIds: ["depois-da-virada"],
    href: "/aula/a-subida/depois-da-virada",
  },
  {
    id: "fogo-e-estatuas",
    label: "Fogo e estátuas",
    sceneIds: ["fogo-e-estatuas"],
    href: "/aula/a-subida/fogo-e-estatuas",
  },
  {
    id: "a-subida-dolorosa",
    label: "A subida dói",
    sceneIds: ["a-subida-dolorosa"],
    href: "/aula/a-subida/a-subida-dolorosa",
  },
  {
    id: "periagoge",
    label: "Uma palavra de Platão",
    sceneIds: ["periagoge"],
    href: "/aula/a-subida/periagoge",
  },
  {
    id: "sombras-la-fora",
    label: "Sombras lá fora",
    sceneIds: ["sombras-la-fora"],
    href: "/aula/a-subida/sombras-la-fora",
  },
  {
    id: "reflexos-na-agua",
    label: "Reflexos na água",
    sceneIds: ["reflexos-na-agua"],
    href: "/aula/a-subida/reflexos-na-agua",
  },
  {
    id: "objetos-estrelas-e-lua",
    label: "Objetos, estrelas e lua",
    sceneIds: ["objetos-estrelas-e-lua"],
    href: "/aula/a-subida/objetos-estrelas-e-lua",
  },
  {
    id: "o-sol",
    label: "O sol",
    sceneIds: ["o-sol"],
    href: "/aula/a-subida/o-sol",
  },
  {
    id: "a-decisao",
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

  return stage ? `Beat ${index + 1} · ${stage.label}` : "A Subida";
}
