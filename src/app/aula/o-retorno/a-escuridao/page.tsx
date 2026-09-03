import type { Metadata } from "next";
import { ORetornoScene } from "@/domains/lessons/o-retorno/o-retorno-scene";

export const metadata: Metadata = { title: "Os olhos escurecem de novo · O Retorno" };

export default function Page() {
  return <ORetornoScene sceneId="a-escuridao" />;
}
