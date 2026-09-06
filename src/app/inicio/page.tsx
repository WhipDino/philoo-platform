import type { Metadata } from "next";
import { StudentPortal } from "@/domains/student-portal/student-portal";

export const metadata: Metadata = {
  title: "Meu espaço | Philoo",
  description:
    "Aulas, recados e descobertas reunidos no espaço do estudante Philoo.",
};

type StudentHomeProps = {
  searchParams: Promise<{
    view?: string;
    trail?: string;
    module?: string;
    homework?: string;
  }>;
};

export default async function StudentHome({ searchParams }: StudentHomeProps) {
  const params = await searchParams;
  return <StudentPortal initialSearchParams={params} />;
}
