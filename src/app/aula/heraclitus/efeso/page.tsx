import type { Metadata } from "next";
import { HeraclitusScene } from "@/domains/lessons/heraclitus/heraclitus-scene";

export const metadata: Metadata = {
  title: "Olha Éfeso · Heráclito de Éfeso",
};

export default function Page() {
  return <HeraclitusScene sceneId="efeso" />;
}
