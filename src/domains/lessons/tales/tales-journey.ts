import type { LessonJourneyStage } from "../philoo-lesson-journey-rail";

export const TALES_JOURNEY_STAGES = [
  {
    id: "ola",
    label: "Eu sou Tales",
    sceneIds: ["ola"],
    href: "/aula/tales/ola",
  },
  {
    id: "mileto",
    label: "O porto",
    sceneIds: ["mileto"],
    href: "/aula/tales/mileto",
  },
  {
    id: "o-principio",
    label: "A água",
    sceneIds: ["o-principio"],
    href: "/aula/tales/o-principio",
  },
  {
    id: "arche",
    label: "Arché",
    sceneIds: ["arche"],
    href: "/aula/tales/arche",
  },
  {
    id: "tres-cestos",
    label: "Três cestos",
    sceneIds: ["tres-cestos"],
    href: "/aula/tales/tres-cestos",
  },
  {
    id: "o-um-e-os-muitos",
    label: "O um e os muitos",
    sceneIds: ["o-um-e-os-muitos"],
    href: "/aula/tales/o-um-e-os-muitos",
  },
] as const satisfies readonly LessonJourneyStage[];

export type TalesSceneId =
  (typeof TALES_JOURNEY_STAGES)[number]["sceneIds"][number];
