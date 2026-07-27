import type { Metadata } from "next";
import { CaveShadowNamesScene } from "@/domains/lessons/as-sombras/cave-shadow-names-scene";

export const metadata: Metadata = {
  title: "As sombras ganham nomes · As Sombras",
};

export default function CaveShadowNamesPage() {
  return <CaveShadowNamesScene />;
}
