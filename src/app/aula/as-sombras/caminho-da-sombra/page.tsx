import type { Metadata } from "next";
import { CaveShadowPathScene } from "@/domains/lessons/as-sombras/cave-shadow-path-scene";

export const metadata: Metadata = {
  title: "O caminho da sombra · As Sombras",
};

export default function CaveShadowPathPage() {
  return <CaveShadowPathScene />;
}
