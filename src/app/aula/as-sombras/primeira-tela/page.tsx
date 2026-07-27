import type { Metadata } from "next";
import { CaveInvitationScene } from "@/domains/lessons/as-sombras/cave-invitation-scene";

export const metadata: Metadata = {
  title: "Primeira tela de As Sombras",
};

export default function FirstLivingStoryScreenPage() {
  return <CaveInvitationScene />;
}
