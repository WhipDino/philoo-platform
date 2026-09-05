import { buildPathLessons } from "./student-path-model";
import { cavePathCatalog, previewStudentProgress } from "./student-path-content";

export type NotebookEraId = "mito-da-caverna" | "presocraticos";

export type NotebookReviewCard = {
  id: string;
  prompt: string;
  answer: string;
};

export type NotebookSection = {
  heading: string;
  points: readonly string[];
};

export type PortalLessonNotebook = {
  id: string;
  lessonSlug: string;
  eraId: NotebookEraId;
  eraLabel: string;
  title: string;
  guide: string;
  lessonHref: string;
  keyConcept: {
    word: string;
    greek: string;
    definition: string;
  };
  summary: string;
  sections: readonly NotebookSection[];
  reviewCards: readonly NotebookReviewCard[];
};

export const portalNotebookMeta = {
  teacherTip:
    "Use o caderno para rever o que a aula já mostrou — e escreva um exemplo seu antes da prova.",
  searchPlaceholder: "Buscar lição ou conceito…",
  emptyLocked:
    "Quando você terminar uma lição, o resumo dela aparece aqui para revisar antes da prova.",
  emptySearch: "Nenhum caderno bate com essa busca. Tente outro nome ou filtro de era.",
  reviewModeLabel: "Modo revisão",
  reviewModeHint:
    "Toque num cartão para virar e conferir se você lembrou. Escolha as lições que quer revisar.",
  notesLabel: "Suas anotações",
  notesPlaceholder:
    "Escreva um exemplo seu, uma dúvida ou o que você quer lembrar na prova…",
  notesSaved: "Salvo neste aparelho",
  backToCadernos: "Todos os cadernos",
  reviewThisLesson: "Revisar esta lição",
  whatToKnow: "O que é importante saber",
  keyConceptLabel: "Conceito-chave da lição",
  refazerAula: "Refazer a lição",
} as const;

/**
 * Preview: libera todos os cadernos das lições já construídas.
 * Quando o progresso real existir, mude `unlockAllBuiltLessons` para false.
 */
export const notebookPreviewUnlocks = {
  unlockAllBuiltLessons: true,
  completedPresocraticLessons: [] as readonly string[],
} as const;

export const notebookEraTabs = [
  { id: "all" as const, label: "Todas as eras" },
  { id: "mito-da-caverna" as const, label: "Mito da caverna" },
  { id: "presocraticos" as const, label: "Pré-socráticos" },
] as const;

export type NotebookEraFilter = (typeof notebookEraTabs)[number]["id"];

export const portalLessonNotebooks: readonly PortalLessonNotebook[] = [
  {
    id: "as-sombras",
    lessonSlug: "as-sombras",
    eraId: "mito-da-caverna",
    eraLabel: "Mito da caverna",
    title: "As Sombras",
    guide: "com Platão",
    lessonHref: "/aula/as-sombras/primeira-tela",
    keyConcept: {
      word: "dóxa",
      greek: "δόξα",
      definition:
        "Opinião que vira crença porque ninguém parou para examinar de onde ela veio.",
    },
    summary:
      "Platão leva você até uma caverna onde prisioneiros só veem sombras na parede. A lição mostra como nomes nascem, o que existe atrás da imagem, e por que a primeira desconfiança importa.",
    sections: [
      {
        heading: "A caverna e a parede",
        points: [
          "Prisioneiros acorrentados desde criança só olham para uma parede.",
          "Tudo o que conhecem chega como imagem na parede — não falta inteligência, falta chance de virar o corpo.",
          "Platão convida a descer devagar e olhar o lugar com calma.",
        ],
      },
      {
        heading: "Nomes, causa e modelo",
        points: [
          "No jogo da parede, eles dão nomes às sombras e o modelo ainda prevê o que vem depois.",
          "Atrás da parede há fogo, objetos e pessoas — a sombra não é a coisa, é efeito de luz e forma (eikón).",
          "O caminho da sombra separa: luz → objeto → sombra → nome que a parede recebe.",
        ],
      },
      {
        heading: "Dóxa e a primeira dúvida",
        points: [
          "Dóxa é tratar a aparência como se fosse o mundo inteiro, sem examinar.",
          "Episteme aparece como contraste: conhecimento que aguenta a pergunta “como você sabe?”.",
          "Uma anomalia na parede abre a primeira desconfiança — gancho para virar o olhar na lição seguinte.",
        ],
      },
    ],
    reviewCards: [
      {
        id: "as-sombras-doxa",
        prompt: "O que é dóxa?",
        answer:
          "Opinião que vira crença porque ninguém examinou de onde ela veio.",
      },
      {
        id: "as-sombras-eikon",
        prompt: "O que é eikón nesta lição?",
        answer: "Imagem ou reflexo — o que aparece sem ser a coisa mesma.",
      },
      {
        id: "as-sombras-jogo",
        prompt: "O que o jogo da parede mostra?",
        answer:
          "Dá para nomear sombras e prever — mas o modelo ainda fica preso à parede.",
      },
      {
        id: "as-sombras-anomalia",
        prompt: "Por que a anomalia importa?",
        answer:
          "Mostra que a explicação antiga não cobre tudo — abre espaço para desconfiar.",
      },
    ],
  },
  {
    id: "a-subida",
    lessonSlug: "a-subida",
    eraId: "mito-da-caverna",
    eraLabel: "Mito da caverna",
    title: "A Subida",
    guide: "com Platão",
    lessonHref: "/aula/a-subida/depois-da-virada",
    keyConcept: {
      word: "periagōgē",
      greek: "περιαγωγή",
      definition:
        "Virar o olhar — reorientar a atenção inteira, não só acrescentar um fato novo.",
    },
    summary:
      "Quem desconfia da parede vira o pescoço, vê o fogo e sobe. A luz dói, a vista adapta aos poucos, e sobra a decisão de contar o que viu — com medo.",
    sections: [
      {
        heading: "Virar e ver a causa",
        points: [
          "Uma sombra diferente leva a olhar para trás: há objetos e um fogo atrás da parede.",
          "A sombra é desenho causado por luz e forma — não é a coisa inteira.",
          "A subida é íngreme; não é curiosidade fácil, dói readaptar os olhos.",
        ],
      },
      {
        heading: "Lá fora",
        points: [
          "A luz ofusca no começo; aos poucos dá para distinguir coisa, luz e recorte no chão.",
          "Periagōgē nomeia o gesto: virar o corpo e a atenção, como na educação que Platão descreve.",
          "Paralelo da aula: cortar um vídeo no meio ou confiar só no feed também exige virar o olhar.",
        ],
      },
      {
        heading: "Medo e vontade de contar",
        points: [
          "Ver mais não é só prazer privado — nasce vontade de voltar e falar com quem ficou.",
          "Medo de ridículo aparece junto: e se rirem porque a vista ainda está se adaptando?",
          "A lição fecha na boca da caverna, pronto para O Retorno.",
        ],
      },
    ],
    reviewCards: [
      {
        id: "a-subida-periagoge",
        prompt: "O que é periagōgē?",
        answer: "Virar o olhar — reorientar a atenção, não só aprender um fato.",
      },
      {
        id: "a-subida-dor",
        prompt: "Por que a subida dói?",
        answer:
          "Readaptar olhos e crenças exige esforço; resistir no começo é esperado.",
      },
      {
        id: "a-subida-triade",
        prompt: "O que a lição separa lá fora?",
        answer: "Luz, coisa real e sombra/recorte — três papéis diferentes.",
      },
    ],
  },
  {
    id: "o-retorno",
    lessonSlug: "o-retorno",
    eraId: "mito-da-caverna",
    eraLabel: "Mito da caverna",
    title: "O Retorno",
    guide: "com Platão",
    lessonHref: "/aula/o-retorno/na-boca",
    keyConcept: {
      word: "aletheia",
      greek: "ἀλήθεια",
      definition:
        "Verdade que se mostra quando algo estava coberto — e precisa ser mostrada, não guardada só para você.",
    },
    summary:
      "Voltar à caverna custa: os olhos escurecem de novo, o jogo de sombras virou estranho, vem ridículo. Mesmo assim, contar o que viu faz parte do gesto — e fecha o mito com o amor de saber.",
    sections: [
      {
        heading: "Decidir descer",
        points: [
          "Continua da boca da caverna: quem viu lá fora decide voltar aos outros.",
          "Aletheia aparece como verdade descoberta que não deve ficar escondida.",
          "Katabainein (descer) é movimento próprio — não é só subida ao contrário.",
        ],
      },
      {
        heading: "Custo de voltar",
        points: [
          "De repente, a escuridão ofusca de novo; readaptar leva tempo.",
          "Nos jogos de sombra ele perde — prática de nomear rápido ≠ burrice, é hábito antigo.",
          "Ridículo não prova que a subida foi inútil.",
        ],
      },
      {
        heading: "Medo, obrigação e filosofia",
        points: [
          "Medo e memória dos companheiros coexistem com a vontade de contar.",
          "Platão fala também de obrigação: quem viu mais não fica só contemplando.",
          "A trilogia fecha ligando mito, Platão e philosophia — amor de saber.",
        ],
      },
    ],
    reviewCards: [
      {
        id: "o-retorno-aletheia",
        prompt: "O que é aletheia nesta lição?",
        answer: "Verdade que estava coberta e precisa ser mostrada.",
      },
      {
        id: "o-retorno-custo",
        prompt: "Por que voltar é difícil?",
        answer:
          "Olhos readaptam à escuridão; há ridículo e perda temporária no jogo de sombras.",
      },
      {
        id: "o-retorno-divida",
        prompt: "Ver mais gera o quê?",
        answer: "Uma dívida de contar — não um troféu privado.",
      },
    ],
  },
  {
    id: "tales",
    lessonSlug: "tales",
    eraId: "presocraticos",
    eraLabel: "Pré-socráticos",
    title: "Tales e a arché",
    guide: "Tales de Mileto",
    lessonHref: "/aula/tales/ola",
    keyConcept: {
      word: "arché",
      greek: "ἀρχή",
      definition:
        "Princípio — o começo e o fundo comum por trás de coisas que parecem muitas.",
    },
    summary:
      "Tales fala do porto de Mileto: onda, vinho, seiva, chuva parecem caras diferentes. A lição pergunta pelo fundo comum; a resposta dele é água, mas o gesto importante é a arché.",
    sections: [
      {
        heading: "Mileto e a variedade",
        points: [
          "Tales assume em primeira pessoa — Platão não narra esta lição.",
          "No cais, muitas aparências convivem; a pergunta é se há um fundo comum.",
          "Água (hydōr) é a resposta de Tales: origem e sustento, não “tudo molhado agora”.",
        ],
      },
      {
        heading: "Arché — nome da pergunta",
        points: [
          "Arché nomeia o tipo de crença: perguntar pelo princípio, não só listar coisas.",
          "Separar cara, pergunta e resposta evita misturar aparência com tese.",
          "Variedade e fundo único podem coexistir — como o um e os muitos no fechamento.",
        ],
      },
      {
        heading: "Fechamento",
        points: [
          "Discordar da água não invalida a pergunta pela arché.",
          "Fica aberto: se o fundo é um, como ele se mostra como muitos?",
        ],
      },
    ],
    reviewCards: [
      {
        id: "tales-arche",
        prompt: "O que é arché?",
        answer: "Princípio — começo e fundo comum por trás da variedade.",
      },
      {
        id: "tales-agua",
        prompt: "O que Tales responde como arché?",
        answer: "Água — origem e sustento, não “tudo molhado neste instante”.",
      },
      {
        id: "tales-tres-cestos",
        prompt: "O que os três cestos separam?",
        answer: "Cara (aparência), pergunta e resposta.",
      },
    ],
  },
  {
    id: "heraclitus",
    lessonSlug: "heraclitus",
    eraId: "presocraticos",
    eraLabel: "Pré-socráticos",
    title: "Heráclito e a mudança",
    guide: "Heráclito de Éfeso",
    lessonHref: "/aula/heraclitus/ola",
    keyConcept: {
      word: "panta rhei",
      greek: "πάντα ῥεῖ",
      definition: "Tudo flui — nada fica idêntico, mesmo quando parece parado.",
    },
    summary:
      "Heráclito fala de Éfeso e do rio: entram no mesmo rio, mas as águas são outras. A lição nomeia panta rhei e deixa aberta a pergunta — e o que fica?",
    sections: [
      {
        heading: "Éfeso e o rio",
        points: [
          "Heráclito assume em primeira pessoa; ponte com a pergunta pelo fundo, sem spoilers de outros filósofos.",
          "Pedra e cidade também mudam, em ritmos diferentes.",
          "O rio ensina: mesmo nome, águas novas a cada passo.",
        ],
      },
      {
        heading: "Panta rhei",
        points: [
          "Panta rhei resume a crença no fluxo — gesto dos fragmentos do rio.",
          "Opostos ligados (dia/noite, quente/frio) aparecem como tensão, não caos.",
          "Paralelo da aula: feed, corpo, estação — estrutura de “mesmo nome, conteúdo novo”.",
        ],
      },
      {
        heading: "Praticar e fechar",
        points: [
          "Exercícios separam nome de substância e testam previsão sobre águas novas.",
          "Fechamento honesto: se tudo flui, será que nada fica de verdade?",
          "Panta rhei não cancela a busca pelo que permanece.",
        ],
      },
    ],
    reviewCards: [
      {
        id: "heraclitus-panta-rhei",
        prompt: "O que significa panta rhei?",
        answer: "Tudo flui — nada permanece idêntico.",
      },
      {
        id: "heraclitus-rio",
        prompt: "O que o rio ensina?",
        answer: "Dizemos “o mesmo rio”, mas as águas são outras.",
      },
      {
        id: "heraclitus-fecho",
        prompt: "Qual pergunta fica no final?",
        answer: "Se tudo flui, será que nada fica de verdade?",
      },
    ],
  },
] as const;

function getCaveLessonCompletion(
  progress = previewStudentProgress,
): Record<string, boolean> {
  const lessons = buildPathLessons(cavePathCatalog, progress);
  return Object.fromEntries(
    lessons.map((lesson) => [lesson.id, lesson.status === "concluido"]),
  );
}

export function isLessonNotebookUnlocked(
  notebook: PortalLessonNotebook,
  unlocks = notebookPreviewUnlocks,
  progress = previewStudentProgress,
): boolean {
  if (unlocks.unlockAllBuiltLessons) {
    return true;
  }

  if (notebook.eraId === "mito-da-caverna") {
    return getCaveLessonCompletion(progress)[notebook.lessonSlug] === true;
  }
  if (notebook.eraId === "presocraticos") {
    return unlocks.completedPresocraticLessons.includes(notebook.lessonSlug);
  }
  return false;
}

export function getUnlockedLessonNotebooks(
  unlocks = notebookPreviewUnlocks,
  progress = previewStudentProgress,
) {
  return portalLessonNotebooks.filter((notebook) =>
    isLessonNotebookUnlocked(notebook, unlocks, progress),
  );
}

export function getNotebookNavMeta(
  unlocks = notebookPreviewUnlocks,
  progress = previewStudentProgress,
) {
  const unlocked = getUnlockedLessonNotebooks(unlocks, progress);
  const latest = unlocked[unlocked.length - 1];
  return {
    count: unlocked.length,
    latestTitle: latest?.title ?? null,
    latestConcept: latest?.keyConcept.word ?? null,
  };
}

export function queryLessonNotebooks({
  query = "",
  eraId = "all",
  lessonIds,
  unlocks = notebookPreviewUnlocks,
  progress = previewStudentProgress,
}: {
  query?: string;
  eraId?: NotebookEraFilter;
  lessonIds?: readonly string[];
  unlocks?: typeof notebookPreviewUnlocks;
  progress?: typeof previewStudentProgress;
}) {
  let notebooks = getUnlockedLessonNotebooks(unlocks, progress);

  if (eraId !== "all") {
    notebooks = notebooks.filter((notebook) => notebook.eraId === eraId);
  }

  if (lessonIds && lessonIds.length > 0) {
    notebooks = notebooks.filter((notebook) => lessonIds.includes(notebook.id));
  }

  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return notebooks;
  }

  return notebooks.filter((notebook) => {
    const haystack = [
      notebook.title,
      notebook.guide,
      notebook.summary,
      notebook.keyConcept.word,
      notebook.keyConcept.definition,
      ...notebook.sections.flatMap((section) => [section.heading, ...section.points]),
      ...notebook.reviewCards.flatMap((card) => [card.prompt, card.answer]),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

export function groupNotebooksByEra(notebooks: readonly PortalLessonNotebook[]) {
  const order: NotebookEraId[] = ["mito-da-caverna", "presocraticos"];
  return order
    .map((eraId) => {
      const eraNotebooks = notebooks.filter((notebook) => notebook.eraId === eraId);
      if (eraNotebooks.length === 0) {
        return null;
      }
      const tab = notebookEraTabs.find((item) => item.id === eraId);
      return {
        eraId,
        label: tab?.label ?? eraId,
        notebooks: eraNotebooks,
      };
    })
    .filter((section): section is NonNullable<typeof section> => section !== null);
}

export function getReviewCardsForNotebooks(notebooks: readonly PortalLessonNotebook[]) {
  return notebooks.flatMap((notebook) =>
    notebook.reviewCards.map((card) => ({
      ...card,
      lessonId: notebook.id,
      lessonTitle: notebook.title,
      eraLabel: notebook.eraLabel,
    })),
  );
}

export function getNotebookNotesStorageKey(lessonId: string) {
  return `philoo:notebook-notes:${lessonId}`;
}

export function readNotebookNotes(lessonId: string) {
  if (typeof window === "undefined") {
    return "";
  }
  return window.localStorage.getItem(getNotebookNotesStorageKey(lessonId)) ?? "";
}

export function writeNotebookNotes(lessonId: string, value: string) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(getNotebookNotesStorageKey(lessonId), value);
}
