import type { Metadata } from "next";
import { ORetornoScene } from "@/domains/lessons/o-retorno/o-retorno-scene";

export const metadata: Metadata = { title: "O medo e a obrigação · O Retorno" };

export default function Page() {
  return <ORetornoScene sceneId="a-divida" />;
}
