import type { Metadata } from "next";
import { TalesScene } from "@/domains/lessons/tales/tales-scene";

export const metadata: Metadata = { title: "Olha o meu porto · Tales de Mileto" };

export default function Page() {
  return <TalesScene sceneId="mileto" />;
}
