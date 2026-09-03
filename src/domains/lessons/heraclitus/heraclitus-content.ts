import type { HeraclitusAssetKey } from "./heraclitus-assets";
import type { HeraclitusSceneId } from "./heraclitus-journey";

export type HeraclitusPoseId =
  | "identity-anchor"
  | "point-river"
  | "present-panel"
  | "open-hands-flow"
  | "hold-paradox"
  | "opposites-gesture"
  | "present-word"
  | "hook-open";

export type HeraclitusSceneMeta = {
  eyebrow: string;
  title: string;
  context: string;
  footer: string;
  previousHref: string;
  nextHref?: string;
  nextLabel?: string;
};

export const HERACLITUS_SCENE_META: Record<HeraclitusSceneId, HeraclitusSceneMeta> =
  {
    ola: {
      eyebrow: "Heráclito de Éfeso",
      title: "Olá, eu sou Heráclito",
      context: "",
      footer: "Um guia novo assume a sala",
      previousHref: "/inicio",
      nextHref: "/aula/heraclitus/efeso",
      nextLabel: "Ver Éfeso",
    },
    efeso: {
      eyebrow: "Heráclito de Éfeso",
      title: "Olha Éfeso",
      context: "",
      footer: "O que parece parado também muda",
      previousHref: "/aula/heraclitus/ola",
      nextHref: "/aula/heraclitus/o-rio",
      nextLabel: "Ir ao rio",
    },
    "o-rio": {
      eyebrow: "Heráclito de Éfeso",
      title: "O mesmo rio, outras águas",
      context: "",
      footer: "O nome fica, a água corre",
      previousHref: "/aula/heraclitus/efeso",
      nextHref: "/aula/heraclitus/panta-rhei",
      nextLabel: "Ouvir o nome disso",
    },
    "panta-rhei": {
      eyebrow: "Momento da palavra",
      title: "Panta rhei",
      context: "",
      footer: "Tudo flui, mesmo quando parece parado",
      previousHref: "/aula/heraclitus/o-rio",
      nextHref: "/aula/heraclitus/praticar",
      nextLabel: "Praticar o fluxo",
    },
    praticar: {
      eyebrow: "Heráclito de Éfeso",
      title: "Nome e substância",
      context: "",
      footer: "Separar o que ficou misturado",
      previousHref: "/aula/heraclitus/panta-rhei",
      nextHref: "/aula/heraclitus/fecho",
      nextLabel: "E o que fica?",
    },
    fecho: {
      eyebrow: "Fim do capítulo",
      title: "E o que fica?",
      context: "",
      footer: "O movimento continua. A conta, ainda não.",
      previousHref: "/aula/heraclitus/praticar",
      nextHref: "/inicio",
      nextLabel: "Voltar ao meu caminho",
    },
  };

export type HeraclitusActivityBriefing = {
  title: string;
  purpose: string;
  steps: readonly string[];
  startLabel: string;
  guidePoseId: HeraclitusPoseId;
  demoNote?: string;
};

export type HeraclitusPredictionChoice = {
  value: string;
  label: string;
};

export type HeraclitusFolioBeat =
  | {
      kind: "guide-voice";
      pose: HeraclitusPoseId;
      guideSide: "start" | "end";
      title: string;
      lead: string;
      guidance?: string;
      actionLabel: string;
      moment?: "concept";
    }
  | {
      kind: "story-panel";
      pose: HeraclitusPoseId;
      guideSide: "start" | "end";
      imageKey: HeraclitusAssetKey;
      text: string;
      actionLabel: string;
      moment?: "concept";
    }
  | {
      kind: "classification";
      briefing: HeraclitusActivityBriefing;
      actionLabel: string;
    }
  | {
      kind: "prediction";
      prompt: string;
      imageKey?: HeraclitusAssetKey;
      choices: readonly HeraclitusPredictionChoice[];
      match: string;
      matchedFeedback: string;
      unmatchedFeedback: string;
      matchedStatus?: string;
      unmatchedStatus?: string;
      confirmLabel?: string;
      retryLabel?: string;
      retryWhen?: "always" | "unmatched";
      unlockOnMiss?: boolean;
      briefing: HeraclitusActivityBriefing;
      actionLabel: string;
    }
  | {
      kind: "reward";
      pointsLabel: string;
      title: string;
      badgeName: string;
      takeaways: readonly string[];
      unlockedTitle: string;
      unlockedBody: string;
      actionLabel: string;
    };

export const OLA_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "identity-anchor" as const,
    guideSide: "end" as const,
    title: "Olá, eu sou Heráclito",
    lead: "Se o fundo é um, ainda falta ver como ele se move. Olá, eu sou Heráclito.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "point-river" as const,
    guideSide: "start" as const,
    title: "Eu vim de Éfeso",
    lead: "Eu vim de Éfeso, na Jônia, onde o rio passa o dia inteiro e nunca traz a mesma água duas vezes. Fiquei conhecido por insistir: tudo flui, mesmo quando parece parado.",
    actionLabel: "Ver Éfeso",
  },
] as const satisfies readonly HeraclitusFolioBeat[];

export const EFESO_BEATS = [
  {
    kind: "story-panel" as const,
    pose: "present-panel" as const,
    guideSide: "start" as const,
    imageKey: "efesoPanorama" as const,
    text: "Olha Éfeso. Pedra clara, templo ao longe, o rio cortando a cidade.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "open-hands-flow" as const,
    guideSide: "end" as const,
    title: "Mesmo parado, mudando",
    lead: "A pedra parece firme. Mas ela desgasta, esquenta, esfria, fica molhada quando chove. O que parece parado também está em movimento, só que em ritmos diferentes.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "opposites-gesture" as const,
    guideSide: "start" as const,
    title: "Dia e noite se puxam",
    lead: "Dia e noite não são inimigos soltos. Quente e frio também se respondem. Eu chamo isso de harmonia de tensão, como o arco que só funciona puxando para lados opostos.",
    actionLabel: "Ir ao rio",
  },
] as const satisfies readonly HeraclitusFolioBeat[];

export const O_RIO_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "hold-paradox" as const,
    guideSide: "end" as const,
    title: "O que eu insisto",
    lead: "Eu insisto numa coisa que parece estranha: você pode entrar duas vezes no mesmo rio e, mesmo assim, nunca encontrar a mesma água.",
    actionLabel: "Continuar",
  },
  {
    kind: "story-panel" as const,
    pose: "present-panel" as const,
    guideSide: "start" as const,
    imageKey: "rioFluxo" as const,
    text: "Entra alguém no rio. A água corre. O nome “rio” fica, a água não.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "point-river" as const,
    guideSide: "start" as const,
    title: "O mesmo nome, outra água",
    lead: "Nós ainda dizemos “o mesmo rio”. Mas quem entra encontra águas novas. O nome segue. A substância não.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "open-hands-flow" as const,
    guideSide: "end" as const,
    title: "O que sobrou de mim",
    lead: "Meu livro se perdeu. Só restaram frases citadas por outros. Não tenho diário do rio. Tenho gestos como este, repetidos até virarem provérbio.",
    actionLabel: "Ouvir o nome disso",
  },
] as const satisfies readonly HeraclitusFolioBeat[];

export const PANTA_RHEI_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "present-word" as const,
    guideSide: "end" as const,
    moment: "concept" as const,
    title: "Panta rhei",
    lead: "Essa crença tem um nome: panta rhei. Em grego, πάντα ῥεῖ. Tudo flui: nada fica idêntico. Não é o nome do fogo. É o nome do tipo de coisa em que eu acredito.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "point-river" as const,
    guideSide: "start" as const,
    moment: "concept" as const,
    title: "No rio, tudo flui",
    lead: "No rio de Éfeso o nome “rio” permanece. A água não. Panta rhei nomeia isso: o que parece o mesmo também está trocando por dentro.",
    actionLabel: "Continuar",
  },
  {
    kind: "story-panel" as const,
    pose: "present-panel" as const,
    guideSide: "start" as const,
    moment: "concept" as const,
    imageKey: "paraleloFluxo" as const,
    text: "O feed atualiza. Seu corpo troca células. A estação muda de roupa. A forma é a mesma: o nome fica, o conteúdo corre.",
    actionLabel: "Praticar o fluxo",
  },
] as const satisfies readonly HeraclitusFolioBeat[];

export const PRATICAR_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "hold-paradox" as const,
    guideSide: "start" as const,
    title: "Nome e substância",
    lead: "Vamos separar. Uma coisa é o nome que ficou. Outra é a água, o corpo, o feed, que já trocou.",
    actionLabel: "Separar as frases",
  },
  {
    kind: "classification" as const,
    briefing: {
      title: "Três cestos",
      purpose:
        "Nesta cena o que permanece de nome e o que muda de fato não são a mesma coisa.",
      steps: [
        "Ver o exemplo resolvido (três frases já classificadas).",
        "Arrastar o cartão ou tocar nele e escolher um cesto.",
        "Conferir. Cartões no cesto errado voltam; os certos ficam. Sem penalidade.",
        "Continuar do Folio só quando os três cestos estiverem certos.",
      ],
      startLabel: "Separar as frases",
      guidePoseId: "hold-paradox",
      demoNote:
        "Primeiro aparece um exemplo já resolvido. Depois você coloca cada frase num cesto e confere.",
    },
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "opposites-gesture" as const,
    guideSide: "start" as const,
    title: "Dois jeitos de ouvir",
    lead: "Tem gente que me ouve assim: se a água muda, não é mais o mesmo rio. Eu não disse isso. Eu disse: o nome fica, a água corre.",
    actionLabel: "Escolher um jeito",
  },
  {
    kind: "prediction" as const,
    imageKey: "rioFluxo" as const,
    prompt:
      "Você entra no rio hoje e amanhã de novo. A água é outra. Ainda dizemos: é o mesmo rio. Qual jeito de ouvir isso combina com o que Heráclito contou?",
    choices: [
      {
        value: "agua-parada",
        label: "É literalmente a mesma água parada no lugar.",
      },
      {
        value: "nome-aguas-novas",
        label: "O mesmo nome e leito, mas águas sempre novas.",
      },
    ],
    match: "nome-aguas-novas",
    matchedStatus: "Você acertou",
    unmatchedStatus: "Ainda não é isso",
    matchedFeedback:
      "É isso. O rio continua no nome e no leito. A água que passa é sempre outra.",
    unmatchedFeedback:
      "Esse jeito congela a água. Heráclito disse o contrário: mesmo rio, águas novas. Tente de novo.",
    retryWhen: "unmatched",
    unlockOnMiss: true,
    confirmLabel: "Confirmar",
    retryLabel: "Confirmar",
    briefing: {
      title: "Dois jeitos de ouvir",
      purpose:
        "Há dois jeitos de ouvir a cena do rio. Só um casa com o que Heráclito acabou de contar.",
      steps: [
        "Ler a evidência. Os dois modelos estão à vista como alternativas.",
        "Tocar na alternativa e em Confirmar.",
        "Se não for essa, o motor avisa e libera outra escolha na hora. Sem penalidade.",
        "Continuar do Folio só no acerto.",
      ],
      startLabel: "Escolher um jeito",
      guidePoseId: "hold-paradox",
    },
    actionLabel: "E o que fica?",
  },
] as const satisfies readonly HeraclitusFolioBeat[];

export const FECHO_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "hook-open" as const,
    guideSide: "end" as const,
    title: "E o que fica?",
    lead: "Se tudo flui, será que nada fica de verdade? Eu insisto no movimento. Ainda não fecho essa conta.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "identity-anchor" as const,
    guideSide: "end" as const,
    title: "O que você levou",
    lead: "Você já pode olhar o que parece parado e perguntar o que está correndo por baixo. Panta rhei fica comigo como nome. O que permanece, a gente ainda olha.",
    actionLabel: "Continuar",
  },
  {
    kind: "reward" as const,
    pointsLabel: "+100 pontos de descoberta",
    title: "Você conquistou Heráclito de Éfeso",
    badgeName: "Panta rhei",
    takeaways: [
      "Panta rhei é a crença de que tudo flui: o nome pode ficar enquanto a substância muda.",
      "O rio ensina: “o mesmo” no linguajar não é “o mesmo” na água.",
      "Insistir no movimento não é dizer que buscar o que permanece é inútil.",
    ],
    unlockedTitle: "O fluxo segue com você",
    unlockedBody:
      "Heráclito ficou com panta rhei como nome. O que permanece, a gente ainda olha. Volte ao seu caminho.",
    actionLabel: "Voltar ao meu caminho",
  },
] as const satisfies readonly HeraclitusFolioBeat[];

export const HERACLITUS_FOLIO_BEATS: Record<
  HeraclitusSceneId,
  readonly HeraclitusFolioBeat[]
> = {
  ola: OLA_BEATS,
  efeso: EFESO_BEATS,
  "o-rio": O_RIO_BEATS,
  "panta-rhei": PANTA_RHEI_BEATS,
  praticar: PRATICAR_BEATS,
  fecho: FECHO_BEATS,
};
