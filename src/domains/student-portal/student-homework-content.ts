export type HomeworkFilter =
  | "all"
  | "open"
  | "due-this-week"
  | "overdue"
  | "submitted"
  | "graded";

export const HOMEWORK_BOARD_PAGE_SIZE = 3;

export type HomeworkListStatus = "overdue" | "open" | "submitted" | "graded";

export type HomeworkUrgency = "now" | "open";

export type HomeworkOrigin = "trail" | "teacher";

/** Flip to false to restore the list + sidebar + calendar layout. */
export const USE_HOMEWORK_OFFER_BOARD = true;

export type HomeworkQuestionKind = "choice" | "text";

export type HomeworkChoiceOption = {
  id: string;
  label: string;
};

export type HomeworkQuestion = {
  id: string;
  kind: HomeworkQuestionKind;
  prompt: string;
  hint?: string;
  options?: readonly HomeworkChoiceOption[];
};

export type PortalHomeworkAssignment = {
  id: string;
  title: string;
  description: string;
  moduleLabel: string;
  listStatus: HomeworkListStatus;
  urgency?: HomeworkUrgency;
  dueLabel: string;
  dueDetail: string;
  dueIso: string;
  imageSrc?: string;
  imageAlt?: string;
  lessonHref?: string;
  teacherMessage: string;
  teacherNote?: string;
  questions: readonly HomeworkQuestion[];
  filters: readonly HomeworkFilter[];
};

export const portalHomeworkMeta = {
  teacher: "Profª Marina Alves",
  classroom: "2º ano B",
  monthLabel: "Setembro",
  weekLabel: "Semana de 7 a 13 de setembro",
  weekSummary:
    "Uma venceu na quarta e ainda dá para entregar — a profª aceita atraso com desconto.",
  teacherTip:
    "Faça a de dóxa antes da prova de outubro. As outras podem esperar.",
} as const;

export const portalHomeworkAssignments: readonly PortalHomeworkAssignment[] = [
  {
    id: "doxa-em-tres-perguntas",
    title: "Dóxa em três perguntas",
    description:
      "Três perguntas sobre dóxa. Responda com suas palavras — o que você escreve fica salvo sozinho e só vai para a profª quando você entregar.",
    moduleLabel: "Módulo 1 · Lição 1 · As Sombras",
    listStatus: "open",
    urgency: "now",
    dueLabel: "Entregar até",
    dueDetail: "Sex, 12/09 · faltam 2 dias",
    dueIso: "2026-09-12",
    imageSrc: "/images/story/cave-cropped-event-v1.webp",
    imageAlt: "Sombras na parede da caverna",
    lessonHref: "/aula/as-sombras/doxa",
    teacherMessage:
      "Ana, não quero definição de dicionário. Quero que você me conte uma dóxa sua — algo que você acreditou sem nunca ter olhado de frente.",
    teacherNote:
      "Duas linhas honestas valem mais que dez copiadas. Pode escrever errado, eu corrijo junto.",
    filters: ["all", "open", "due-this-week"],
    questions: [
      {
        id: "q1",
        kind: "choice",
        prompt: "Na caverna, o que os prisioneiros chamam de 'mundo'?",
        hint: "Escolha a alternativa que Platão defenderia — e repare que duas delas parecem certas.",
        options: [
          {
            id: "a",
            label:
              "O fogo que queima atrás deles, porque é a única coisa que dá luz.",
          },
          {
            id: "b",
            label:
              "As sombras na parede, porque é isso que eles veem o tempo todo.",
          },
          {
            id: "c",
            label:
              "A corrente no tornozelo, porque é o que impede de sair.",
          },
        ],
      },
      {
        id: "q2",
        kind: "text",
        prompt: "Conte uma dóxa sua — algo que você acreditou sem examinar.",
        hint: "Duas ou três frases bastam. Não precisa ser bonito.",
      },
      {
        id: "q3",
        kind: "text",
        prompt: "O que mudaria se você parasse para olhar essa crença de frente?",
        hint: "Pode ser uma dúvida, não uma resposta certa.",
      },
    ],
  },
  {
    id: "quem-sao-as-vozes",
    title: "Quem são as vozes lá fora?",
    description:
      "Três perguntas sobre quem escolhe o que aparece na parede. Use o capítulo 4 como base.",
    moduleLabel: "Módulo 1 · Capítulo 4",
    listStatus: "overdue",
    dueLabel: "Venceu em",
    dueDetail: "Qua, 03/09 · venceu há 1 dia",
    dueIso: "2026-09-03",
    imageSrc: "/images/story/cave-anomaly-v1.webp",
    imageAlt: "Silhuetas passando com objetos",
    lessonHref: "/aula/as-sombras/o-que-chegou-ate-eles",
    teacherMessage:
      "Ana, ainda dá para entregar com desconto. Quero ver se você separa quem fala de quem só repete.",
    filters: ["all", "overdue"],
    questions: [
      {
        id: "q1",
        kind: "choice",
        prompt: "Quem escolhe o que aparece na parede da caverna?",
        options: [
          { id: "a", label: "Os prisioneiros, porque eles dão os nomes." },
          { id: "b", label: "Quem carrega os objetos atrás deles." },
          { id: "c", label: "Ninguém escolhe — só acontece." },
        ],
      },
      {
        id: "q2",
        kind: "text",
        prompt: "Cite um exemplo de hoje em que alguém escolhe o que você vê.",
      },
      {
        id: "q3",
        kind: "text",
        prompt: "Por que isso importa para a dóxa?",
      },
    ],
  },
  {
    id: "mapa-da-caverna",
    title: "Mapa da caverna, do seu jeito",
    description:
      "Desenhe ou descreva a caverna como você entendeu. Pode ser esquema, lista ou texto corrido.",
    moduleLabel: "Módulo 1 · Capítulo 5 · Trilho do aluno",
    listStatus: "open",
    urgency: "open",
    dueLabel: "Entregar até",
    dueDetail: "Ter, 16/09 · faltam 6 dias",
    dueIso: "2026-09-16",
    imageSrc: "/images/story/cave-behind-wall-layers-v1.webp",
    imageAlt: "Camadas da caverna",
    teacherMessage:
      "Não quero cópia do desenho do livro. Quero o mapa que ficou na sua cabeça.",
    filters: ["all", "open"],
    questions: [
      {
        id: "q1",
        kind: "text",
        prompt: "Descreva a caverna com suas palavras — o que fica onde?",
      },
      {
        id: "q2",
        kind: "text",
        prompt: "Onde você colocaria a luz, a parede e o prisioneiro?",
      },
    ],
  },
  {
    id: "rio-de-heraclito",
    title: "O rio de Heráclito · 5 linhas",
    description:
      "Cinco linhas sobre mudança. Pode ser um rio, um feed ou qualquer coisa que nunca fica igual.",
    moduleLabel: "Módulo 2 · Heráclito",
    listStatus: "open",
    urgency: "open",
    dueLabel: "Entregar até",
    dueDetail: "Qui, 18/09 · faltam 8 dias",
    dueIso: "2026-09-18",
    imageSrc: "/images/story/heraclitus/beat-03-rio-fluxo-v1.png",
    imageAlt: "Rio em fluxo",
    lessonHref: "/aula/heraclitus/o-rio",
    teacherMessage:
      "Leia o capítulo do rio antes. Não precisa citar Heráclito — quero o seu exemplo.",
    filters: ["all", "open"],
    questions: [
      {
        id: "q1",
        kind: "text",
        prompt: "Escreva cinco linhas sobre algo que muda o tempo todo.",
      },
    ],
  },
  {
    id: "depois-da-virada-duas-frases",
    title: "Depois da virada · duas frases",
    description:
      "Quando a luz muda, o que você ainda leva da parede? Duas frases bastam — sem copiar o capítulo.",
    moduleLabel: "Módulo 1 · A Subida",
    listStatus: "open",
    urgency: "open",
    dueLabel: "Entregar até",
    dueDetail: "Seg, 22/09 · faltam 12 dias",
    dueIso: "2026-09-22",
    imageSrc: "/images/story/cave-first-turn-cliffhanger-v1.png",
    imageAlt: "Depois da virada",
    lessonHref: "/aula/a-subida/depois-da-virada",
    teacherMessage:
      "Não quero resumo. Quero o que mudou na sua cabeça quando a parede deixou de ser o mundo.",
    filters: ["all", "open"],
    questions: [
      {
        id: "q1",
        kind: "text",
        prompt: "O que a parede ainda segura em você?",
      },
      {
        id: "q2",
        kind: "text",
        prompt: "O que você já não chamaria de mundo?",
      },
    ],
  },
  {
    id: "na-boca-da-caverna",
    title: "Na boca da caverna",
    description:
      "Quem sai tem de decidir o que conta para quem ficou. Escreva o recado que você levaria.",
    moduleLabel: "Módulo 1 · O Retorno",
    listStatus: "open",
    urgency: "open",
    dueLabel: "Entregar até",
    dueDetail: "Qua, 24/09 · faltam 14 dias",
    dueIso: "2026-09-24",
    imageSrc: "/images/story/cave-cropped-event-v1.webp",
    imageAlt: "Boca da caverna",
    lessonHref: "/aula/o-retorno/na-boca",
    teacherMessage:
      "Pense em alguém da sua sala. O que você contaria sem parecer que está dando aula?",
    filters: ["all", "open"],
    questions: [
      {
        id: "q1",
        kind: "text",
        prompt: "Qual recado você levaria para quem ainda olha a parede?",
      },
    ],
  },
  {
    id: "uma-pergunta-para-marina",
    title: "Uma pergunta para a profª",
    description:
      "A Marina pediu uma dúvida honesta desta semana — pode ser da trilha ou de casa. Sem resposta certa.",
    moduleLabel: "Módulo 1 · Recado da profª",
    listStatus: "open",
    urgency: "open",
    dueLabel: "Entregar até",
    dueDetail: "Sex, 19/09 · faltam 9 dias",
    dueIso: "2026-09-19",
    teacherMessage:
      "Pode ser curta. Eu leio e devolvo na aula — não precisa ficar bonita.",
    filters: ["all", "open"],
    questions: [
      {
        id: "q1",
        kind: "text",
        prompt: "Qual pergunta ficou girando esta semana?",
      },
    ],
  },
  {
    id: "arché-em-casa",
    title: "Arché na mesa de almoço",
    description:
      "Três frases ligando a pergunta de Tales ao que você viu em casa ou na escola esta semana.",
    moduleLabel: "Módulo 2 · Tales",
    listStatus: "submitted",
    dueLabel: "Entregue em",
    dueDetail: "Seg, 01/09",
    dueIso: "2026-09-01",
    imageSrc: "/images/story/tales/beat-04-mesa-almoco-v1.png",
    imageAlt: "Mesa de almoço",
    lessonHref: "/aula/tales/arche",
    teacherMessage: "Obrigada pela entrega. A correção sai na sexta.",
    filters: ["all", "submitted"],
    questions: [
      {
        id: "q1",
        kind: "text",
        prompt: "O que seria o fundo comum de três coisas diferentes na sua mesa?",
      },
    ],
  },
  {
    id: "primeira-duvida-reflexo",
    title: "Primeira dúvida · o que você guardaria",
    description:
      "Uma pergunta honesta que ficou depois do capítulo 9. A profª vai ler na correção.",
    moduleLabel: "Módulo 1 · Capítulo 9",
    listStatus: "graded",
    dueLabel: "Corrigida em",
    dueDetail: "Sex, 29/08 · nota 8,5",
    dueIso: "2026-08-29",
    imageSrc: "/images/story/cave-first-turn-cliffhanger-v1.png",
    imageAlt: "Prisioneiro olhando para trás",
    teacherMessage: "Boa pergunta no final — isso mostra que você está pensando de verdade.",
    filters: ["all", "graded"],
    questions: [
      {
        id: "q1",
        kind: "text",
        prompt: "Qual dúvida você levaria para a aula?",
      },
    ],
  },
] as const;

export const homeworkFilterTabs: readonly {
  id: HomeworkFilter;
  label: string;
}[] = [
  { id: "all", label: "Todas" },
  { id: "due-this-week", label: "Vencem esta semana" },
  { id: "overdue", label: "Atrasadas" },
  { id: "submitted", label: "Entregues" },
  { id: "graded", label: "Corrigidas" },
];

export const homeworkFolderTabs: readonly {
  id: Exclude<HomeworkFilter, "all">;
  label: string;
  title: string;
  copy: string;
}[] = [
  {
    id: "open",
    label: "Abertas",
    title: "Lições em aberto",
    copy: "O que ainda dá para fazer. Os papéis ficam presos neste fichário.",
  },
  {
    id: "due-this-week",
    label: "Esta semana",
    title: "Vencem esta semana",
    copy: "O prazo chega logo. Vale abrir antes da sexta.",
  },
  {
    id: "overdue",
    label: "Atrasadas",
    title: "Passaram do prazo",
    copy: "Ainda dá para entregar — a profª aceita atraso com desconto.",
  },
  {
    id: "submitted",
    label: "Entregues",
    title: "Já entregues",
    copy: "Foram para a profª. A correção aparece na outra pasta.",
  },
  {
    id: "graded",
    label: "Corrigidas",
    title: "A profª já viu",
    copy: "Ela leu e deixou um recado. Pode reabrir para reler.",
  },
];

export function countHomeworkByFilter(filter: HomeworkFilter): number {
  return filterHomeworkAssignments(filter).length;
}

export function filterHomeworkAssignments(filter: HomeworkFilter) {
  if (filter === "all") {
    return portalHomeworkAssignments;
  }
  if (filter === "open") {
    return portalHomeworkAssignments.filter((item) => item.listStatus === "open");
  }
  return portalHomeworkAssignments.filter((item) => item.filters.includes(filter));
}

export function homeworkShelfParts(item: PortalHomeworkAssignment) {
  const parts = item.moduleLabel.split(" · ").map((part) => part.trim());
  return {
    module: parts[0] || item.moduleLabel,
    chapter: parts.slice(1).join(" · ") || "Lição",
  };
}

export function homeworkOrigin(item: PortalHomeworkAssignment): HomeworkOrigin {
  return item.lessonHref ? "trail" : "teacher";
}

export function homeworkOriginLabel(item: PortalHomeworkAssignment) {
  return homeworkOrigin(item) === "trail" ? "Da trilha" : "Da professora";
}

export function homeworkOriginTitle(item: PortalHomeworkAssignment) {
  return homeworkOrigin(item) === "trail"
    ? "Capítulo da trilha"
    : "Lição da professora";
}

export function homeworkOriginHint(item: PortalHomeworkAssignment) {
  return homeworkOrigin(item) === "trail"
    ? "A Marina pediu um capítulo que já existe na Philoo."
    : "A Marina criou esta atividade. Não está na trilha.";
}

export type HomeworkDeskStatus = Exclude<HomeworkFilter, "all">;

export const homeworkDeskDefaultStatuses: readonly HomeworkDeskStatus[] = [
  "open",
  "due-this-week",
  "overdue",
];

export function sortHomeworkByPriority(
  items: readonly PortalHomeworkAssignment[],
) {
  const weight = (item: PortalHomeworkAssignment) => {
    if (item.listStatus === "overdue") {
      return 0;
    }
    if (item.urgency === "now") {
      return 1;
    }
    if (item.listStatus === "open") {
      return 2;
    }
    if (item.listStatus === "submitted") {
      return 3;
    }
    return 4;
  };

  return [...items].sort((left, right) => {
    const byWeight = weight(left) - weight(right);
    if (byWeight !== 0) {
      return byWeight;
    }
    return left.dueIso.localeCompare(right.dueIso);
  });
}

export function isHomeworkWaiting(item: PortalHomeworkAssignment) {
  return item.listStatus === "open" || item.listStatus === "overdue";
}

export function isHomeworkNow(item: PortalHomeworkAssignment) {
  return (
    item.listStatus === "overdue" ||
    item.urgency === "now" ||
    (item.listStatus === "open" && item.filters.includes("due-this-week"))
  );
}

export function homeworkPriority(item: PortalHomeworkAssignment) {
  if (item.listStatus === "overdue") {
    return { id: "late" as const, label: "Atrasada" };
  }
  if (item.listStatus === "graded") {
    return { id: "done" as const, label: "Corrigida" };
  }
  if (item.listStatus === "submitted") {
    return { id: "done" as const, label: "Entregue" };
  }
  if (item.urgency === "now" || item.filters.includes("due-this-week")) {
    return { id: "soon" as const, label: "Esta semana" };
  }
  return { id: "later" as const, label: "Depois" };
}

export function itemMatchesHomeworkStatuses(
  item: PortalHomeworkAssignment,
  selected: readonly HomeworkDeskStatus[],
) {
  return selected.some((id) => {
    if (id === "open") {
      return item.listStatus === "open";
    }
    return item.filters.includes(id);
  });
}

export function filterHomeworkDesk(selected: readonly HomeworkDeskStatus[]) {
  return sortHomeworkByPriority(
    portalHomeworkAssignments.filter((item) =>
      itemMatchesHomeworkStatuses(item, selected),
    ),
  );
}

export function homeworkDueShort(item: PortalHomeworkAssignment) {
  return item.dueDetail.split(" · ")[0] ?? item.dueDetail;
}

export function getHomeworkAssignment(id: string) {
  return portalHomeworkAssignments.find((item) => item.id === id);
}

export function getOpenHomeworkCount() {
  return portalHomeworkAssignments.filter(
    (item) => item.listStatus === "open" || item.listStatus === "overdue",
  ).length;
}

export function getHomeworkAttentionCount() {
  return portalHomeworkAssignments.filter(
    (item) => item.listStatus === "overdue" || item.urgency === "now",
  ).length;
}

export function groupHomeworkByDueIso() {
  const grouped = new Map<string, PortalHomeworkAssignment[]>();
  for (const item of portalHomeworkAssignments) {
    if (item.listStatus === "graded") {
      continue;
    }
    const bucket = grouped.get(item.dueIso) ?? [];
    bucket.push(item);
    grouped.set(item.dueIso, bucket);
  }
  return grouped;
}

export const homeworkCalendarMonth = {
  year: 2026,
  monthIndex: 8,
  label: "Setembro 2026",
} as const;

export function buildMonthCells(year: number, monthIndex: number) {
  const lead = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: { iso: string | null; day: number | null }[] = [];
  for (let i = 0; i < lead; i += 1) {
    cells.push({ iso: null, day: null });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const iso = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push({ iso, day });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ iso: null, day: null });
  }
  return cells;
}

/** @deprecated Use portalHomeworkAssignments — kept for home dock and path pendências */
export const portalHomework = {
  assigned: getOpenHomeworkCount() > 0,
  title: "Dóxa em três perguntas",
  due: "Até sexta",
  teacher: portalHomeworkMeta.teacher,
  body: portalHomeworkAssignments[0].description,
  lessonTitle: "As Sombras",
  lessonHref: "/aula/as-sombras/doxa",
} as const;
