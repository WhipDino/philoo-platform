import {
  GUIDED_CLASSIFICATION_SCHEMA_VERSION,
  type GuidedClassificationConfig,
} from "./guided-classification-contract";

type SocraticMoveId = "claim" | "reason" | "question";

export const SOCRATIC_DIALOGUE_CLASSIFICATION_EXAMPLE = {
  id: "socratic-dialogue-moves-v1",
  schemaVersion: GUIDED_CLASSIFICATION_SCHEMA_VERSION,
  workedExample: {
    eyebrow: "Três movimentos de uma conversa",
    title: "Uma ideia fica mais forte quando sabemos o que ela está fazendo.",
    introductionTitle: "Primeiro, reconheça cada movimento.",
    introductionBody:
      "O tema muda, mas afirmações, razões e perguntas cumprem papéis diferentes.",
    items: [
      {
        categoryId: "claim",
        statement: "Coragem não é ausência de medo.",
        explanation: "Apresenta uma posição que pode ser examinada.",
      },
      {
        categoryId: "reason",
        statement: "Pois alguém pode ter medo e ainda agir.",
        explanation: "Oferece apoio para uma afirmação.",
      },
      {
        categoryId: "question",
        statement: "Toda ação arriscada é corajosa?",
        explanation: "Abre um ponto que ainda precisa ser investigado.",
      },
    ],
    continueLabel: "Analisar o diálogo",
  },
  prompt: {
    title: "Qual é o papel de cada frase?",
    instruction: "Organize os movimentos do diálogo.",
    selectedInstruction: "Escolha o papel desta frase.",
    idleInstruction: "Continue examinando o raciocínio.",
  },
  categories: [
    {
      id: "claim",
      label: "Afirmação",
      hint: "Defende uma posição.",
      tone: "blue",
      icon: "dialogue",
      correctionHint: "Esta frase apresenta uma posição para ser examinada.",
    },
    {
      id: "reason",
      label: "Razão",
      hint: "Apoia outra ideia.",
      tone: "apricot",
      icon: "scales",
      correctionHint: "Esta frase oferece apoio para uma afirmação.",
    },
    {
      id: "question",
      label: "Pergunta",
      hint: "Abre a investigação.",
      tone: "lavender",
      icon: "question",
      correctionHint: "Esta frase abre algo que ainda precisa ser respondido.",
    },
  ],
  cards: [
    {
      id: "courage-claim",
      text: "Agir sem pensar não basta para chamar alguém de corajoso.",
      answer: "claim",
    },
    {
      id: "courage-reason",
      text: "Um impulso pode ignorar o perigo em vez de enfrentá-lo.",
      answer: "reason",
    },
    {
      id: "courage-question",
      text: "O que diferencia coragem de imprudência?",
      answer: "question",
    },
  ],
  feedback: {
    initial: "Escolha uma frase para começar.",
    correctPlacement: "Esse papel combina com o movimento da frase.",
    successTitle: "Você reconstruiu o movimento do diálogo.",
    successBody:
      "Agora afirmação, razão e pergunta podem ser avaliadas separadamente.",
    retryTitle: "Revise {count} {items}.",
  },
  labels: {
    itemSingular: "frase",
    itemPlural: "frases",
    progressLabel: "frases organizadas",
    check: "Conferir análise",
  },
  table: {
    desktopAriaLabel: "Mesa de análise do diálogo",
    trayKicker: "Escolha uma frase",
    trayTitle: "Movimentos do diálogo",
    completedTrayTitle: "Todas as frases foram organizadas",
    completedTrayBody: "Revise os papéis antes de conferir.",
    destinationsAriaLabel: "Papéis possíveis no diálogo",
    dropCue: "colocar",
    placeHere: "Colocar aqui",
    emptyDestination: "Ainda sem frases",
    mobileAriaLabel: "Classificação dos movimentos do diálogo",
    mobileItemLabel: "Frase",
    mobilePlacedLabel: "organizadas",
    mobileQuestion: "Qual papel esta frase cumpre?",
    mobileDestinationsAriaLabel: "Escolha o papel desta frase",
    mobileCompleteTitle: "Todas as frases receberam um papel.",
    mobileCompleteBody: "Revise sua análise antes de conferir.",
    mobileReviewTitle: "Sua análise",
    mobileReviewActionPrefix: "Revisar",
  },
} satisfies GuidedClassificationConfig<SocraticMoveId>;
