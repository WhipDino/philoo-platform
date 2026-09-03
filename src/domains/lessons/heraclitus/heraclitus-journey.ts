import type { LessonJourneyStage } from "../philoo-lesson-journey-rail";

export const HERACLITUS_JOURNEY_STAGES = [
  {
    id: "ola",
    label: "Eu sou Heráclito",
    sceneIds: ["ola"],
    href: "/aula/heraclitus/ola",
  },
  {
    id: "efeso",
    label: "Éfeso",
    sceneIds: ["efeso"],
    href: "/aula/heraclitus/efeso",
  },
  {
    id: "o-rio",
    label: "O rio",
    sceneIds: ["o-rio"],
    href: "/aula/heraclitus/o-rio",
  },
  {
    id: "panta-rhei",
    label: "Panta rhei",
    sceneIds: ["panta-rhei"],
    href: "/aula/heraclitus/panta-rhei",
  },
  {
    id: "praticar",
    label: "Praticar",
    sceneIds: ["praticar"],
    href: "/aula/heraclitus/praticar",
  },
  {
    id: "fecho",
    label: "E o que fica?",
    sceneIds: ["fecho"],
    href: "/aula/heraclitus/fecho",
  },
] as const satisfies readonly LessonJourneyStage[];

export type HeraclitusSceneId =
  (typeof HERACLITUS_JOURNEY_STAGES)[number]["sceneIds"][number];
