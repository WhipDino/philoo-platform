import type { Metadata } from "next";
import { CaveDescentScene } from "@/domains/lessons/as-sombras/cave-descent-scene";

export const metadata: Metadata = {
  title: "A descida · As Sombras",
};

export default function CaveDescentPage() {
  return <CaveDescentScene />;
}
