import type { Metadata } from "next";
import { AsSombrasPlayer } from "@/domains/lessons/as-sombras/as-sombras-player";

export const metadata: Metadata = {
  title: "As Sombras — Corte de Luz",
  description:
    "Uma investigação visual sobre aparência, mecanismo e a alegoria da caverna.",
};

export default function ShadowsLessonPage() {
  return <AsSombrasPlayer />;
}
