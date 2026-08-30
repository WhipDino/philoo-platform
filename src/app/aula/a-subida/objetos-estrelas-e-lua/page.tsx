import type { Metadata } from "next";
import { ASubidaScene } from "@/domains/lessons/a-subida/a-subida-scene";

export const metadata: Metadata = {
  title: "Objetos, estrelas e lua · A Subida",
};

export default function Page() {
  return <ASubidaScene sceneId="objetos-estrelas-e-lua" />;
}
