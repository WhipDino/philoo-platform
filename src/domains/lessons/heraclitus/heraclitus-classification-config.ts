import {
  GUIDED_CLASSIFICATION_SCHEMA_VERSION,
  type GuidedClassificationConfig,
} from "@/domains/lesson-library";

export type HeraclitusBasketId = "aparencia" | "mesmo" | "flui";

export const HERACLITUS_CLASSIFICATION_CONFIG = {
  id: "heraclitus-aparencia-mesmo-flui-v1",
  schemaVersion: GUIDED_CLASSIFICATION_SCHEMA_VERSION,
  workedExample: {
    eyebrow: "Exemplo resolvido",
    title: "Três jeitos de ouvir “o mesmo”",
    introductionTitle: "Primeiro, veja a diferença entre os três cestos.",
    introductionBody:
      "Estas frases não entram no desafio. São só para treinar o olho.",
    items: [
      {
        categoryId: "aparencia",
        statement: "O dia parece claro e parado.",
        explanation: "Use quando a frase só descreve o que aparece agora.",
      },
      {
        categoryId: "mesmo",
        statement: "Ainda dizemos: é o mesmo sol.",
        explanation:
          "Use quando falamos do nome ou do que reconhecemos como continuando.",
      },
      {
        categoryId: "flui",
        statement: "A luz muda a cada hora.",
        explanation: "Use quando a frase aponta o que se move ou se renova de fato.",
      },
    ],
    continueLabel: "Separar as frases do rio",
  },
  prompt: {
    title: "Coloque cada frase no cesto certo.",
    instruction: "Arraste o cartão ou toque nele e escolha um cesto.",
    selectedInstruction: "Escolha um cesto para esta frase.",
    idleInstruction: "Continue separando aparência, nome e fluxo.",
  },
  categories: [
    {
      id: "aparencia",
      label: "Aparência",
      hint: "O que parece parado ou fixo agora.",
      tone: "blue",
      icon: "eye",
      correctionHint:
        "Isso descreve a cara, o que parece. Ainda não é o nome nem o fluxo.",
    },
    {
      id: "mesmo",
      label: "Ainda o mesmo",
      hint: "O que continuamos a chamar igual.",
      tone: "lavender",
      icon: "anchor",
      correctionHint:
        "Isso fala do nome ou do leito que ainda reconhecemos. A água em si flui.",
    },
    {
      id: "flui",
      label: "O que flui",
      hint: "O que muda de fato a cada instante.",
      tone: "apricot",
      icon: "waves",
      correctionHint:
        "Isso é o movimento real: água nova, corpo, estação. Não é só a cara nem só o nome.",
    },
  ],
  cards: [
    {
      id: "pedra-parada",
      text: "A pedra do cais parece parada.",
      answer: "aparencia",
    },
    {
      id: "templo-fixo",
      text: "De longe o templo parece fixo.",
      answer: "aparencia",
    },
    {
      id: "rio-caystro",
      text: "Ainda chamamos de rio Caystro.",
      answer: "mesmo",
    },
    {
      id: "leito-pedra",
      text: "É o mesmo leito de pedra.",
      answer: "mesmo",
    },
    {
      id: "aguas-novas",
      text: "Estas águas nunca passaram aqui antes.",
      answer: "flui",
    },
    {
      id: "entra-duas-vezes",
      text: "Quem entra duas vezes encontra água nova.",
      answer: "flui",
    },
  ],
  feedback: {
    initial: "Escolha uma frase para começar.",
    correctPlacement: "Esse cesto combina com o que a frase está fazendo.",
    successTitle: "Você separou os três.",
    successBody:
      "Aparência no cais, nome do rio, água que flui. Três gestos, não um só.",
    retryTitle: "Revise {count} {items}.",
  },
  labels: {
    itemSingular: "frase",
    itemPlural: "frases",
    progressLabel: "frases organizadas",
    check: "Conferir",
  },
  table: {
    desktopAriaLabel: "Mesa das frases do rio",
    trayKicker: "Escolha uma frase",
    trayTitle: "Frases do rio",
    completedTrayTitle: "Todas as frases foram organizadas",
    completedTrayBody: "Agora revise os cestos antes de conferir.",
    destinationsAriaLabel: "Cestos para organizar as frases",
    dropCue: "colocar",
    placeHere: "Colocar aqui",
    emptyDestination: "Ainda sem frases",
    mobileAriaLabel: "Classificação guiada das frases",
    mobileItemLabel: "Frase",
    mobilePlacedLabel: "organizadas",
    mobileQuestion: "Que tipo de frase é esta?",
    mobileDestinationsAriaLabel: "Escolha um cesto para esta frase",
    mobileCompleteTitle: "Todas as frases encontraram um cesto.",
    mobileCompleteBody: "Revise suas escolhas antes de conferir.",
    mobileReviewTitle: "Suas escolhas",
    mobileReviewActionPrefix: "Revisar",
  },
} satisfies GuidedClassificationConfig<HeraclitusBasketId>;
