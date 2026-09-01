import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Lá fora até o Sol · A Subida" };

export default function Page() {
  redirect("/aula/a-subida/sombras-la-fora");
}
