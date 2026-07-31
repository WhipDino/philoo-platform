import {
  GUIDED_CLASSIFICATION_SCHEMA_VERSION,
  type GuidedClassificationConfig,
} from "@/domains/lesson-library/activities/guided-classification/guided-classification-contract";
import { getGuidedClassificationGuide } from "@/domains/lesson-library/activities/guided-classification/guided-classification-character-presets";

export type CaveEvidenceCategoryId = "observed" | "concluded" | "unknown";

export const CAVE_EVIDENCE_SORT_CONFIG = {
  id: "as-sombras-evidence-classification-v1",
  schemaVersion: GUIDED_CLASSIFICATION_SCHEMA_VERSION,
  guide: {
    ...getGuidedClassificationGuide("plato"),
    priority: true,
  },
  workedExample: {
    eyebrow: "Uma pista, três jeitos de pensar",
    title: "Imagine que você encontrou pegadas.",
    introductionTitle: "Primeiro, aprenda a diferença entre os três bolsos.",
    introductionBody:
      "As pegadas não aparecem no desafio: são só um exemplo.",
    items: [
      {
        categoryId: "observed",
        statement: "Há três pegadas no chão.",
        explanation: "Use quando algo apareceu diante dos olhos deles.",
      },
      {
        categoryId: "concluded",
        statement: "Alguém passou por aqui.",
        explanation:
          "Use quando uma ideia parece verdadeira, mesmo sem eles verem sua origem.",
      },
      {
        categoryId: "unknown",
        statement: "Quem deixou as pegadas?",
        explanation: "Use quando ainda faltam pistas para responder.",
      },
    ],
    continueLabel: "Entendi os três",
  },
  prompt: {
    title: "Agora organize as pistas.",
    instruction: "Arraste cada cartão ou toque nele e escolha um bolso.",
    selectedInstruction: "Arraste ou escolha um bolso.",
    idleInstruction: "Continue investigando.",
  },
  categories: [
    {
      id: "observed",
      label: "Eles viram",
      hint: "Apareceu diante deles.",
      tone: "blue",
      icon: "eye",
      correctionHint: "Isso apareceu diretamente diante dos prisioneiros.",
    },
    {
      id: "concluded",
      label: "Eles acreditaram",
      hint: "Parecia verdade para eles.",
      tone: "apricot",
      icon: "brain",
      correctionHint:
        "Isso era uma crença criada a partir do que aparecia na parede.",
    },
    {
      id: "unknown",
      label: "Eles não sabiam",
      hint: "Ainda faltavam pistas.",
      tone: "lavender",
      icon: "question",
      correctionHint:
        "Eles ainda não tinham pistas para responder essa pergunta.",
    },
  ],
  cards: [
    {
      id: "shadow",
      text: "Uma sombra apareceu na parede.",
      answer: "observed",
    },
    {
      id: "real-object",
      text: "A sombra era o objeto verdadeiro.",
      answer: "concluded",
    },
    {
      id: "whole-world",
      text: "A parede mostrava o mundo inteiro.",
      answer: "concluded",
    },
    {
      id: "behind-wall",
      text: "O que existia atrás da parede?",
      answer: "unknown",
    },
  ],
  feedback: {
    initial: "Escolha uma pista para começar.",
    correctPlacement:
      "Essa escolha combina com o que os prisioneiros poderiam afirmar.",
    successTitle: "Perfeito: você organizou as quatro ideias.",
    successBody:
      "Você separou o que apareceu, o que eles acreditaram e o que ainda não podiam saber.",
    retryTitle: "Revise {count} {items}.",
  },
  labels: {
    itemSingular: "cartão",
    itemPlural: "cartões",
    progressLabel: "pistas organizadas",
    check: "Conferir descobertas",
  },
  table: {
    desktopAriaLabel: "Mesa de descobertas",
    trayKicker: "Escolha uma pista",
    trayTitle: "Pistas da parede",
    completedTrayTitle: "Todas as pistas foram organizadas",
    completedTrayBody: "Agora revise os bolsos antes de conferir.",
    destinationsAriaLabel: "Bolsos para organizar as pistas",
    dropCue: "guardar",
    placeHere: "Colocar aqui",
    emptyDestination: "Ainda sem pistas",
    mobileAriaLabel: "Classificação guiada das pistas",
    mobileItemLabel: "Pista",
    mobilePlacedLabel: "organizadas",
    mobileQuestion: "O que esta pista permite afirmar?",
    mobileDestinationsAriaLabel: "Escolha onde guardar esta pista",
    mobileCompleteTitle: "Todas as pistas encontraram um lugar.",
    mobileCompleteBody: "Revise suas escolhas antes de conferir.",
    mobileReviewTitle: "Suas escolhas",
    mobileReviewActionPrefix: "Revisar",
  },
} satisfies GuidedClassificationConfig<CaveEvidenceCategoryId>;
