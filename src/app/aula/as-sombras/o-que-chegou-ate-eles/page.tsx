import type { Metadata } from "next";
import { CaveEvidenceSortScene } from "@/domains/lessons/as-sombras/cave-evidence-sort-scene";

export const metadata: Metadata = {
  title: "O que chegou até elas? · As Sombras",
};

export default function CaveEvidenceSortPage() {
  return <CaveEvidenceSortScene />;
}
