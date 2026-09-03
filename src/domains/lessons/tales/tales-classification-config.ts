import {
  GUIDED_CLASSIFICATION_SCHEMA_VERSION,
  type GuidedClassificationConfig,
} from "@/domains/lesson-library";

export type TalesBasketId = "cara" | "pergunta" | "resposta";

export const TALES_CLASSIFICATION_CONFIG = {
  id: "tales-cara-pergunta-resposta-v1",
  schemaVersion: GUIDED_CLASSIFICATION_SCHEMA_VERSION,
  workedExample: {
    eyebrow: "Exemplo resolvido",
    title: "Três jeitos de ouvir uma frase",
    introductionTitle: "Primeiro, veja a diferença entre os três cestos.",
    introductionBody:
      "Estas frases não entram no desafio. São só para treinar o olho.",
    items: [
      {
        categoryId: "cara",
        statement: "A pedra no sol parece seca.",
        explanation: "Use quando a frase só descreve a cara, o que aparece.",
      },
      {
        categoryId: "pergunta",
        statement: "De que a pedra e o rio são, no fundo?",
        explanation:
          "Use quando alguém pergunta pelo começo e pelo fundo.",
      },
      {
        categoryId: "resposta",
        statement: "Alguém diz: o princípio é a água.",
        explanation:
          "Use quando a frase já escolhe uma resposta, não só pergunta.",
      },
    ],
    continueLabel: "Separar as frases do porto",
  },
  prompt: {
    title: "Coloque cada frase no cesto certo.",
    instruction: "Arraste o cartão ou toque nele e escolha um cesto.",
    selectedInstruction: "Escolha um cesto para esta frase.",
    idleInstruction: "Continue separando cara, pergunta e resposta.",
  },
  categories: [
    {
      id: "cara",
      label: "Cara",
      hint: "O que se vê na superfície.",
      tone: "blue",
      icon: "eye",
      correctionHint:
        "Isso descreve a cara das coisas, não a pergunta nem a resposta.",
    },
    {
      id: "pergunta",
      label: "Pergunta",
      hint: "O começo e o fundo.",
      tone: "lavender",
      icon: "question",
      correctionHint: "Isso pergunta pelo princípio. Ainda não é a água.",
    },
    {
      id: "resposta",
      label: "Resposta",
      hint: "O que Tales diz que é.",
      tone: "apricot",
      icon: "brain",
      correctionHint:
        "Isso é a resposta dele: a água. Não é o nome da pergunta.",
    },
  ],
  cards: [
    {
      id: "anfora-seca",
      text: "A ânfora está seca por fora.",
      answer: "cara",
    },
    {
      id: "mudam-cara",
      text: "No cais as coisas mudam de cara.",
      answer: "cara",
    },
    {
      id: "de-que-fundo",
      text: "De que tudo isso é, no fundo?",
      answer: "pergunta",
    },
    {
      id: "fundo-comum",
      text: "Existe um começo e um fundo comum?",
      answer: "pergunta",
    },
    {
      id: "principio-agua",
      text: "O princípio é a água.",
      answer: "resposta",
    },
    {
      id: "chao-agua",
      text: "A terra se apoia sobre água.",
      answer: "resposta",
    },
  ],
  feedback: {
    initial: "Escolha uma frase para começar.",
    correctPlacement: "Esse cesto combina com o que a frase está fazendo.",
    successTitle: "Você separou os três.",
    successBody:
      "Cara no cais, pergunta da arché, resposta da água. Não são a mesma coisa.",
    retryTitle: "Revise {count} {items}.",
  },
  labels: {
    itemSingular: "frase",
    itemPlural: "frases",
    progressLabel: "frases organizadas",
    check: "Conferir",
  },
  table: {
    desktopAriaLabel: "Mesa das frases do porto",
    trayKicker: "Escolha uma frase",
    trayTitle: "Frases do porto",
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
} satisfies GuidedClassificationConfig<TalesBasketId>;
