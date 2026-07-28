import type { Metadata } from "next";
import { CaveShadowGameScene } from "@/domains/lessons/as-sombras/cave-shadow-game-scene";

export const metadata: Metadata = {
  title: "Jogue como eles · As Sombras",
};

export default function CaveShadowGamePage() {
  return <CaveShadowGameScene />;
}
