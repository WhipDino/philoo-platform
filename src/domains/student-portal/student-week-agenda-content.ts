import { portalHomeworkAssignments } from "./student-homework-content";

/** Semana do preview (terça, 8 de setembro de 2026). */
export const portalWeekAnchorIso = "2026-09-08";

export const WEEKDAY_DEFS = [
  { id: "seg", label: "Segunda" },
  { id: "ter", label: "Terça" },
  { id: "qua", label: "Quarta" },
  { id: "qui", label: "Quinta" },
  { id: "sex", label: "Sexta" },
  { id: "sab", label: "Sábado" },
  { id: "dom", label: "Domingo" },
] as const;

export type WeekdayId = (typeof WEEKDAY_DEFS)[number]["id"];

export type WeekPlan = {
  weekdayIds: readonly WeekdayId[];
  minutes: number;
};

export const defaultWeekPlan: WeekPlan = {
  weekdayIds: ["ter", "sex"],
  minutes: 40,
};

export const WEEK_PLAN_STORAGE_KEY = "philoo:week-plan";

export type AgendaEventKind = "homework" | "study" | "continue";

export type AgendaEvent = {
  id: string;
  kind: AgendaEventKind;
  title: string;
  detail: string;
  href?: string;
};

export type AgendaDay = {
  id: WeekdayId;
  label: string;
  iso: string;
  dateNum: string;
  isToday: boolean;
  events: readonly AgendaEvent[];
};

function parseIso(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function mondayOf(iso: string) {
  const date = parseIso(iso);
  const weekday = date.getDay();
  const shift = weekday === 0 ? -6 : 1 - weekday;
  date.setDate(date.getDate() + shift);
  return date;
}

function addDaysIso(iso: string, days: number) {
  const date = parseIso(iso);
  date.setDate(date.getDate() + days);
  return toIso(date);
}

export function getWeekRangeLabel(anchorIso = portalWeekAnchorIso) {
  const monday = toIso(mondayOf(anchorIso));
  const sunday = addDaysIso(monday, 6);
  const start = parseIso(monday);
  const end = parseIso(sunday);
  const startDay = start.getDate();
  const endDay = end.getDate();
  const month = start.toLocaleDateString("pt-BR", { month: "long" });
  return `${startDay} a ${endDay} de ${month}`;
}

export function parseWeekPlan(raw: string | null): WeekPlan {
  if (!raw) {
    return defaultWeekPlan;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<WeekPlan>;
    const ids = (parsed.weekdayIds ?? []).filter((id): id is WeekdayId =>
      WEEKDAY_DEFS.some((day) => day.id === id),
    );
    const minutes = Number(parsed.minutes);
    return {
      weekdayIds: ids.length > 0 ? ids : defaultWeekPlan.weekdayIds,
      minutes: minutes > 0 && minutes <= 180 ? minutes : defaultWeekPlan.minutes,
    };
  } catch {
    return defaultWeekPlan;
  }
}

export function buildWeekAgenda({
  plan,
  continueTitle,
  continueHref,
  anchorIso = portalWeekAnchorIso,
}: {
  plan: WeekPlan;
  continueTitle: string;
  continueHref: string;
  anchorIso?: string;
}) {
  const mondayIso = toIso(mondayOf(anchorIso));
  const sundayIso = addDaysIso(mondayIso, 6);

  const openHomework = portalHomeworkAssignments.filter(
    (item) => item.listStatus === "open" || item.listStatus === "overdue",
  );

  const days: AgendaDay[] = WEEKDAY_DEFS.map((day, index) => {
    const iso = addDaysIso(mondayIso, index);
    const events: AgendaEvent[] = [];

    for (const item of openHomework) {
      if (item.dueIso === iso) {
        events.push({
          id: `hw-${item.id}`,
          kind: "homework",
          title: item.title,
          detail: item.listStatus === "overdue" ? "Venceu" : "Entregar",
          href: `/inicio?view=homework&homework=${item.id}`,
        });
      }
    }

    if (plan.weekdayIds.includes(day.id)) {
      events.push({
        id: `study-${day.id}`,
        kind: iso === anchorIso ? "continue" : "study",
        title: iso === anchorIso ? continueTitle : "Ler na Philoo",
        detail: `${plan.minutes} min`,
        href: iso === anchorIso ? continueHref : undefined,
      });
    }

    return {
      id: day.id,
      label: day.label,
      iso,
      dateNum: String(parseIso(iso).getDate()),
      isToday: iso === anchorIso,
      events,
    };
  });

  const todo: AgendaEvent[] = openHomework
    .filter((item) => item.dueIso < mondayIso || item.dueIso > sundayIso || item.listStatus === "overdue")
    .map((item) => ({
      id: `todo-${item.id}`,
      kind: "homework" as const,
      title: item.title,
      detail: item.listStatus === "overdue" ? "Atrasada" : item.dueDetail,
      href: `/inicio?view=homework&homework=${item.id}`,
    }));

  return {
    weekLabel: getWeekRangeLabel(anchorIso),
    days,
    todo,
    plan,
  };
}
