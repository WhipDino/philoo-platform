import type { Metadata } from "next";
import { CaveBehindWallScene } from "@/domains/lessons/as-sombras/cave-behind-wall-scene";

export const metadata: Metadata = {
  title: "O que existe atrás? · As Sombras",
};

export default function CaveBehindWallPage() {
  return <CaveBehindWallScene />;
}
