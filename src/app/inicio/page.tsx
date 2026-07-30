import type { Metadata } from "next";
import { StudentPortal } from "@/domains/student-portal/student-portal";

export const metadata: Metadata = {
  title: "Meu espaço | Philoo",
  description:
    "Aulas, recados e descobertas reunidos no espaço do estudante Philoo.",
};

export default function StudentHome() {
  return <StudentPortal />;
}
