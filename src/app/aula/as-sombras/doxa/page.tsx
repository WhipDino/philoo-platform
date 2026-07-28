import type { Metadata } from "next";
import { CaveDoxaScene } from "@/domains/lessons/as-sombras/cave-doxa-scene";

export const metadata: Metadata = {
  title: "Dóxa · As Sombras",
};

export default function CaveDoxaPage() {
  return <CaveDoxaScene />;
}
