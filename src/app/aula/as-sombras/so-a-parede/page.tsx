import type { Metadata } from "next";
import { CavePrisonerWallScene } from "@/domains/lessons/as-sombras/cave-prisoner-wall-scene";

export const metadata: Metadata = {
  title: "Diante da parede · As Sombras",
};

export default function PrisonerWallPage() {
  return <CavePrisonerWallScene />;
}
