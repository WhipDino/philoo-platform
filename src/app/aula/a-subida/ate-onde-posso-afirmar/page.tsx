import type { Metadata } from "next";
import { ASubidaScene } from "@/domains/lessons/a-subida/a-subida-scene";

export const metadata: Metadata = {
  title: "Horizonte de evidências · A Subida",
};

export default function Page() {
  return <ASubidaScene sceneId="ate-onde-posso-afirmar" />;
}

