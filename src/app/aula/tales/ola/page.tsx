import type { Metadata } from "next";
import { TalesScene } from "@/domains/lessons/tales/tales-scene";

export const metadata: Metadata = { title: "Olá, eu sou Tales · Tales de Mileto" };

export default function Page() {
  return <TalesScene sceneId="ola" />;
}
