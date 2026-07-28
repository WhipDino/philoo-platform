import type { Metadata } from "next";
import { CaveFirstDoubtScene } from "@/domains/lessons/as-sombras/cave-first-doubt-scene";

export const metadata: Metadata = {
  title: "A primeira dúvida · As Sombras",
};

export default function CaveFirstDoubtPage() {
  return <CaveFirstDoubtScene />;
}
