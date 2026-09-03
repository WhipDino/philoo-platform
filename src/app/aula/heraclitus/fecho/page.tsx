import type { Metadata } from "next";
import { HeraclitusScene } from "@/domains/lessons/heraclitus/heraclitus-scene";

export const metadata: Metadata = {
  title: "E o que fica? · Heráclito de Éfeso",
};

export default function Page() {
  return <HeraclitusScene sceneId="fecho" />;
}
