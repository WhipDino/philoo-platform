import type { LessonJourneyStage } from "../philoo-lesson-journey-rail";

export const AS_SOMBRAS_JOURNEY_STAGES = [
  {
    id: "comeco",
    label: "O começo da história",
    sceneIds: ["primeira-tela"],
    href: "/aula/as-sombras/primeira-tela",
  },
  {
    id: "descida",
    label: "A descida",
    sceneIds: ["a-descida"],
    href: "/aula/as-sombras/a-descida",
  },
  {
    id: "mais-fundo",
    label: "Mais fundo",
    sceneIds: ["so-a-parede"],
    href: "/aula/as-sombras/so-a-parede",
  },
  {
    id: "mundo-na-parede",
    label: "O mundo na parede",
    sceneIds: ["eles-dao-nomes"],
    href: "/aula/as-sombras/eles-dao-nomes",
  },
  {
    id: "desafio",
    label: "Primeiro desafio",
    sceneIds: ["o-que-chegou-ate-eles"],
    href: "/aula/as-sombras/o-que-chegou-ate-eles",
  },
] as const satisfies readonly LessonJourneyStage[];
