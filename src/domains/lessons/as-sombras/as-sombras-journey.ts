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
    id: "quem-vive-aqui",
    label: "Quem vive aqui",
    sceneIds: ["so-a-parede"],
    href: "/aula/as-sombras/so-a-parede",
  },
  {
    id: "jogo-da-parede",
    label: "O jogo da parede",
    sceneIds: ["eles-dao-nomes", "jogo-da-parede"],
    href: "/aula/as-sombras/eles-dao-nomes",
  },
  {
    id: "o-que-existe-atras",
    label: "O que existe atrás",
    sceneIds: ["o-que-existe-atras"],
    href: "/aula/as-sombras/o-que-existe-atras",
  },
  {
    id: "caminho-da-sombra",
    label: "O caminho da sombra",
    sceneIds: ["caminho-da-sombra"],
    href: "/aula/as-sombras/caminho-da-sombra",
  },
  {
    id: "doxa",
    label: "Uma palavra da filosofia",
    sceneIds: ["doxa"],
    href: "/aula/as-sombras/doxa",
  },
  {
    id: "o-que-chegou",
    label: "O que chegou até eles",
    sceneIds: ["o-que-chegou-ate-eles"],
    href: "/aula/as-sombras/o-que-chegou-ate-eles",
  },
  {
    id: "primeira-duvida",
    label: "A primeira dúvida",
    sceneIds: ["a-primeira-duvida"],
    href: "/aula/as-sombras/a-primeira-duvida",
  },
] as const satisfies readonly LessonJourneyStage[];
