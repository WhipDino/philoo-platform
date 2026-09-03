export type LibraryEraId =
  | "ancient"
  | "medieval"
  | "modern"
  | "contemporary";

export type LibraryGroupStatus =
  | "current"
  | "seen"
  | "on-path"
  | "unseen"
  | "coming";

export type LibraryChapterStatus = "in-progress" | "available" | "locked";

export type LibraryPhilosopher = {
  id: string;
  name: string;
};

export type LibraryChapter = {
  id: string;
  title: string;
  href?: string;
  status: LibraryChapterStatus;
  progressPct: number;
  guide: string;
  stageLabel: string;
};

export type LibraryGroup = {
  id: string;
  eraId: LibraryEraId;
  title: string;
  philosophers: readonly LibraryPhilosopher[];
  lessonCount: number;
  status: LibraryGroupStatus;
  seenCount?: number;
  href?: string;
  chapters: readonly LibraryChapter[];
};

export type LibraryEra = {
  id: LibraryEraId;
  label: string;
  dates: string;
  blurb: string;
};

export const libraryEras: readonly LibraryEra[] = [
  {
    id: "ancient",
    label: "Antiga",
    dates: "séc. VI a.C. a V d.C.",
    blurb:
      "Do primeiro porquê sobre o mundo até as escolas que tentaram viver bem juntas.",
  },
  {
    id: "medieval",
    label: "Medieval",
    dates: "séc. V a XIV",
    blurb: "Fé, razão e a pergunta de como viver quando o mundo muda de eixo.",
  },
  {
    id: "modern",
    label: "Moderna",
    dates: "séc. XV a XVIII",
    blurb: "O sujeito, a ciência e o contrato: quem pensa, quem governa, quem sabe.",
  },
  {
    id: "contemporary",
    label: "Contemporânea",
    dates: "séc. XIX a hoje",
    blurb: "Liberdade, técnica, poder e o que ainda cabe a cada pessoa decidir.",
  },
] as const;

export const libraryGroups: readonly LibraryGroup[] = [
  {
    id: "cave",
    eraId: "ancient",
    title: "A Caverna de Platão",
    philosophers: [{ id: "plato", name: "Platão" }],
    lessonCount: 3,
    status: "current",
    seenCount: 1,
    href: "/inicio?view=journey",
    chapters: [
      {
        id: "as-sombras",
        title: "As Sombras",
        href: "/aula/as-sombras/doxa",
        status: "in-progress",
        progressPct: 67,
        guide: "com Platão",
        stageLabel: "Capítulo 7",
      },
      {
        id: "a-subida",
        title: "A Subida",
        href: "/aula/a-subida/depois-da-virada",
        status: "available",
        progressPct: 0,
        guide: "com Platão",
        stageLabel: "Ainda não começada",
      },
      {
        id: "o-retorno",
        title: "O Retorno",
        href: "/aula/o-retorno/na-boca",
        status: "locked",
        progressPct: 0,
        guide: "com Platão",
        stageLabel: "Abre depois da Subida",
      },
    ],
  },
  {
    id: "presocratics",
    eraId: "ancient",
    title: "Pré-socráticos",
    philosophers: [
      { id: "thales", name: "Tales" },
      { id: "heraclitus", name: "Heráclito" },
      { id: "parmenides", name: "Parmênides" },
      { id: "democritus", name: "Demócrito" },
    ],
    lessonCount: 4,
    status: "on-path",
    chapters: [
      {
        id: "thales",
        title: "Tales e a arché",
        status: "locked",
        progressPct: 0,
        guide: "com Tales",
        stageLabel: "Abre depois da Caverna",
      },
      {
        id: "heraclitus",
        title: "Heráclito e a mudança",
        status: "locked",
        progressPct: 0,
        guide: "com Heráclito",
        stageLabel: "Em breve",
      },
      {
        id: "parmenides",
        title: "Parmênides e o que permanece",
        status: "locked",
        progressPct: 0,
        guide: "com Parmênides",
        stageLabel: "Em breve",
      },
      {
        id: "democritus",
        title: "Demócrito e os átomos",
        status: "locked",
        progressPct: 0,
        guide: "com Demócrito",
        stageLabel: "Em breve",
      },
    ],
  },
  {
    id: "sophists-socrates",
    eraId: "ancient",
    title: "Sofistas e Sócrates",
    philosophers: [
      { id: "sophists", name: "Sofistas" },
      { id: "socrates", name: "Sócrates" },
    ],
    lessonCount: 4,
    status: "on-path",
    chapters: [],
  },
  {
    id: "plato-aristotle",
    eraId: "ancient",
    title: "Platão e Aristóteles",
    philosophers: [
      { id: "plato-ideas", name: "Platão" },
      { id: "aristotle", name: "Aristóteles" },
    ],
    lessonCount: 4,
    status: "unseen",
    chapters: [],
  },
  {
    id: "hellenism",
    eraId: "ancient",
    title: "Helenismo",
    philosophers: [
      { id: "epicurus", name: "Epicuro" },
      { id: "stoics", name: "Estoicos" },
    ],
    lessonCount: 0,
    status: "coming",
    chapters: [],
  },
] as const;

export const libraryEraTabs = [
  { id: "all" as const, label: "Todas as eras" },
  ...libraryEras.map((era) => ({ id: era.id, label: era.label })),
] as const;

export type LibraryEraFilter = (typeof libraryEraTabs)[number]["id"];

export function getLibraryStats(groups: readonly LibraryGroup[] = libraryGroups) {
  const philosopherIds = new Set(
    groups.flatMap((group) => group.philosophers.map((person) => person.id)),
  );

  return {
    eraCount: libraryEras.length,
    groupCount: groups.length,
    philosopherCount: philosopherIds.size,
    playableLessonCount: groups.reduce(
      (sum, group) =>
        sum + group.chapters.filter((chapter) => chapter.href).length,
      0,
    ),
  };
}

export function getResumeChapters(
  groups: readonly LibraryGroup[] = libraryGroups,
): readonly (LibraryChapter & { groupTitle: string; eraId: LibraryEraId })[] {
  return groups.flatMap((group) =>
    group.chapters
      .filter((chapter) => chapter.status === "in-progress" && chapter.href)
      .map((chapter) => ({
        ...chapter,
        groupTitle: group.title,
        eraId: group.eraId,
      })),
  );
}

export function groupStatusLabel(group: LibraryGroup) {
  if (group.status === "current") {
    return "Você está aqui";
  }
  if (group.status === "seen") {
    return `Você viu ${group.seenCount ?? 0}`;
  }
  if (group.status === "on-path") {
    return "No seu caminho";
  }
  if (group.status === "coming") {
    return "Em breve";
  }
  return "Ainda não visto";
}

export function filterLibraryGroups(
  query: string,
  eraId: LibraryEraFilter,
  groups: readonly LibraryGroup[] = libraryGroups,
) {
  const needle = query.trim().toLocaleLowerCase("pt-BR");

  return groups.filter((group) => {
    if (eraId !== "all" && group.eraId !== eraId) {
      return false;
    }
    if (!needle) {
      return true;
    }

    const haystack = [
      group.title,
      ...group.philosophers.map((person) => person.name),
      ...group.chapters.map((chapter) => chapter.title),
    ]
      .join(" ")
      .toLocaleLowerCase("pt-BR");

    return haystack.includes(needle);
  });
}

export function groupsByEra(
  groups: readonly LibraryGroup[],
  eras: readonly LibraryEra[] = libraryEras,
) {
  return eras
    .map((era) => ({
      era,
      groups: groups.filter((group) => group.eraId === era.id),
    }))
    .filter((section) => section.groups.length > 0);
}
