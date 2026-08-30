import type { Metadata } from "next";
import { ASubidaScene } from "@/domains/lessons/a-subida/a-subida-scene";

export const metadata: Metadata = { title: "Reflexos na água · A Subida" };

export default function Page() {
  return <ASubidaScene sceneId="reflexos-na-agua" />;
}
