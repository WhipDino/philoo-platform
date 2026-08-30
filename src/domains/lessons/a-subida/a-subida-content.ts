import {
  GUIDED_CLASSIFICATION_SCHEMA_VERSION,
  getGuidedClassificationGuide,
  type GuidedClassificationConfig,
} from "@/domains/lesson-library";
import type { PlatoPoseKey } from "../plato-pose-catalog";
import type { ASubidaAssetKey } from "./a-subida-assets";
import type { ASubidaSceneId } from "./a-subida-journey";

export type ASubidaSceneMeta = {
  eyebrow: string;
  title: string;
  context: string;
  footer: string;
  previousHref: string;
  nextHref?: string;
  nextLabel?: string;
};

export const A_SUBIDA_SCENE_META: Record<ASubidaSceneId, ASubidaSceneMeta> = {
  "depois-da-virada": {
    eyebrow: "A Caverna de Platão · Capítulo 2",
    title: "Depois da virada",
    context:
      "No capítulo anterior, o prisioneiro notou que uma sombra não chegava sozinha. Agora ele vira o corpo. O que vem primeiro não é clareza, é dor.",
    footer: "Da sombra à primeira dor",
    previousHref: "/aula/as-sombras/a-primeira-duvida",
    nextHref: "/aula/a-subida/fogo-e-estatuas",
    nextLabel: "Olhar atrás da parede",
  },
  "fogo-e-estatuas": {
    eyebrow: "Atrás da parede · Capítulo 2",
    title: "O que existe atrás da parede?",
    context:
      "Entre o fogo e a parede, passam objetos e pessoas. O que parecia uma única realidade se divide em causa, efeito e aparência.",
    footer: "Classifique o mecanismo antes de seguir",
    previousHref: "/aula/a-subida/depois-da-virada",
    nextHref: "/aula/a-subida/a-subida-dolorosa",
    nextLabel: "Começar a subida",
  },
  "a-subida-dolorosa": {
    eyebrow: "A subida · Capítulo 2",
    title: "A subida dói",
    context:
      "Alguém o arrasta. A passagem é íngreme. Ele quer voltar — o novo mundo ainda não parece melhor.",
    footer: "O desconforto da mudança",
    previousHref: "/aula/a-subida/fogo-e-estatuas",
    nextHref: "/aula/a-subida/periagoge",
    nextLabel: "Dar um nome a essa virada",
  },
  periagoge: {
    eyebrow: "Uma palavra de Platão · Capítulo 2",
    title: "O nome da virada",
    context:
      "Platão dá um nome para essa mudança de direção. A palavra em grego é periagōgē.",
    footer: "O conceito da jornada",
    previousHref: "/aula/a-subida/a-subida-dolorosa",
    nextHref: "/aula/a-subida/sombras-la-fora",
    nextLabel: "Ver o que dá para afirmar lá fora",
  },
  "sombras-la-fora": {
    eyebrow: "Atividade · Horizonte de evidência",
    title: "Sombras lá fora",
    context:
      "Fora da caverna, o primeiro estágio são as sombras. Elas existem, mas não contam tudo — nem toda hipótese cabe ainda na evidência disponível.",
    footer: "Cada horizonte permite uma afirmação, não mais que isso",
    previousHref: "/aula/a-subida/periagoge",
    nextHref: "/aula/a-subida/reflexos-na-agua",
    nextLabel: "Seguir para os reflexos",
  },
  "reflexos-na-agua": {
    eyebrow: "Atividade · Caminho causal",
    title: "Reflexos na água",
    context:
      "A luz melhora. Ele vê reflexos na água e começa a ligar causa e efeito: o reflexo tem uma direção.",
    footer: "A evidência aponta para uma causa",
    previousHref: "/aula/a-subida/sombras-la-fora",
    nextHref: "/aula/a-subida/objetos-estrelas-e-lua",
    nextLabel: "Deixar a noite cair",
  },
  "objetos-estrelas-e-lua": {
    eyebrow: "A Subida · Fora da caverna",
    title: "Objetos, estrelas e lua",
    context:
      "A noite cai. Os olhos descansam. Ele vê as coisas e depois os astros — cada estágio prepara o próximo.",
    footer: "A sequência não pode ser apressada",
    previousHref: "/aula/a-subida/reflexos-na-agua",
    nextHref: "/aula/a-subida/o-sol",
    nextLabel: "Esperar o amanhecer",
  },
  "o-sol": {
    eyebrow: "Atividade · Revisão de modelo",
    title: "O sol",
    context:
      "O sol aparece. O prisioneiro entende que tudo o que via era causado por algo maior — a caverna, as sombras, o fogo, o mundo exterior se encaixam em uma ordem.",
    footer: "Revisar não é apagar o que você viu antes",
    previousHref: "/aula/a-subida/objetos-estrelas-e-lua",
    nextHref: "/aula/a-subida/a-decisao",
    nextLabel: "Decidir o que fazer agora",
  },
  "a-decisao": {
    eyebrow: "Fim do Capítulo 2",
    title: "A decisão",
    context:
      "Agora que conhece um mundo maior, o prisioneiro se lembra de quem ainda está diante da parede. A subida acabou. A próxima pergunta é como voltar.",
    footer: "O Retorno · Como conversar com quem ainda vê outro mundo?",
    previousHref: "/aula/a-subida/o-sol",
    nextHref: "/inicio",
    nextLabel: "Voltar ao meu caminho",
  },
};

export type ASubidaImageCardContent = {
  pose: PlatoPoseKey;
  imageKey: ASubidaAssetKey;
  imageCaption: string;
  speakerLabel: string;
  body: string;
};

export const DEPOIS_DA_VIRADA_CONTENT: ASubidaImageCardContent = {
  pose: "invite-turn",
  imageKey: "depoisDaVirada",
  imageCaption:
    "Ele vira o corpo. A luz do fogo, ainda escondida atrás da parede, já pinta a pedra ao redor.",
  speakerLabel: "Platão explica",
  body: "Eu escrevi sobre um homem libertado e forçado a se levantar. A primeira coisa que ele sente é dor. Não porque a verdade seja cruel, mas porque os olhos ainda não sabem para onde olhar.",
};

export const A_SUBIDA_DOLOROSA_CONTENT: ASubidaImageCardContent = {
  pose: "light-pain-guide",
  imageKey: "aSubidaDolorosa",
  imageCaption:
    "Atrás dele, a caverna escurece. Adiante, a luz da entrada cresce.",
  speakerLabel: "Platão explica",
  body: "Não é a curiosidade que o leva. É uma força exterior. A subida é a parte mais difícil da alegoria, porque ninguém sobe sozinho nem de bom grado. Quem resiste no começo não está errado: os olhos ainda preferem o que conhecem. A dor não é um castigo. É o preço da reorientação.",
};

export const OBJETOS_ESTRELAS_LUA_CONTENT: ASubidaImageCardContent & {
  reflectionPrompt: string;
} = {
  pose: "gradual-seeing-guide",
  imageKey: "objetosEstrelasELua",
  imageCaption:
    "Uma mão se estende para a árvore e a pedra reais, antes de erguer o olhar ao céu.",
  speakerLabel: "Platão explica",
  body: "A sequência é importante: sombras, reflexos, objetos, céu noturno. Cada etapa exige tempo. Não se pula direto para o Sol. A pressa é uma forma de cegueira.",
  reflectionPrompt: "O que mudou desde as sombras lá fora?",
};

export const PERIAGOGE_CONTENT = {
  greek: "περιαγωγή",
  romanization: "periagōgē",
  gloss: "substantivo grego · a virada da alma",
  imageKey: "platoOfuscado" as ASubidaAssetKey,
  speakerLabel: "Platão explica",
  heading: "Aprender é mudar a direção do olhar.",
  body: "Eu chamo isso de periagōgē: a virada da alma. Não é colocar visão em olhos que não veem. É orientar a capacidade de ver que já existe. Educar é a arte de virar essa capacidade na direção certa.",
  reflectionPrompt: "O que, no capítulo até aqui, já foi uma virada, mesmo pequena?",
};

export const A_DECISAO_CONTENT = {
  pose: "return-compassion-guide" as PlatoPoseKey,
  speakerLabel: "Platão explica",
  kicker: "A escolha que abre o próximo capítulo",
  heading: "Ele poderia ficar. Mas se lembra dos outros.",
  lead: "Voltar não é um gesto de herói. Lembrar quem ficou na caverna importa. Não é culpa por ter visto mais: é reconhecer que aprender junto ainda conta.",
  closing:
    "A pergunta que fica é: como conversar com quem ainda vê outro mundo? Esse é o tema do próximo capítulo.",
};

export type MechanismCategoryId = "causa" | "efeito" | "aparencia";

export const FOGO_E_ESTATUAS_BANNER = {
  imageKey: "fogoEEstatuas" as ASubidaAssetKey,
  caption: "A sombra deixou de ser um fato isolado e ganhou uma história.",
};

export const FOGO_E_ESTATUAS_CLASSIFICATION_CONFIG = {
  id: "a-subida-beat-2-mecanismo",
  schemaVersion: GUIDED_CLASSIFICATION_SCHEMA_VERSION,
  guide: getGuidedClassificationGuide("plato"),
  workedExample: {
    eyebrow: "Exemplo resolvido",
    title: "Como classificar o que está atrás da parede",
    introductionTitle: "Antes de começar, veja um exemplo diferente",
    introductionBody:
      "Use este exemplo para entender os três rótulos. Ele não fala da caverna.",
    items: [
      {
        categoryId: "causa",
        statement: "A lâmpada acesa emite luz.",
        explanation: "A lâmpada é a fonte; sem ela, nada seria visível.",
      },
      {
        categoryId: "efeito",
        statement: "O círculo de luz aparece na parede.",
        explanation: "O círculo existe porque a luz incide sobre algo.",
      },
      {
        categoryId: "aparencia",
        statement: "Parece que há um disco branco flutuando.",
        explanation: "A leitura imediata descreve aparência, não causa.",
      },
    ],
    continueLabel: "Classificar o mecanismo da caverna",
  },
  prompt: {
    title: "O que existe atrás da parede?",
    instruction:
      "Coloque cada carta na categoria que melhor descreve seu papel no mecanismo.",
    selectedInstruction: "Escolha um destino para esta carta.",
    idleInstruction: "Selecione uma carta para começar.",
  },
  categories: [
    {
      id: "causa",
      label: "Causa",
      hint: "O que produz o que se vê.",
      icon: "brain",
      tone: "blue",
      correctionHint:
        "Pergunte: sem isto, o efeito aconteceria? Se a resposta for não, é causa.",
    },
    {
      id: "efeito",
      label: "Efeito",
      hint: "O que resulta da causa.",
      icon: "eye",
      tone: "apricot",
      correctionHint:
        "Pergunte: isto aparece porque algo o produz? Se sim, é efeito.",
    },
    {
      id: "aparencia",
      label: "Aparência",
      hint: "O que parecia ser antes de saber da causa.",
      icon: "question",
      tone: "lavender",
      correctionHint:
        "Pergunte: isto descreve a leitura imediata, sem explicar? Se sim, é aparência.",
    },
  ],
  cards: [
    { id: "c1", text: "O fogo alto atrás da parede", answer: "causa" },
    { id: "c2", text: "As pessoas que carregam objetos", answer: "causa" },
    {
      id: "c3",
      text: "Os objetos reais sendo transportados",
      answer: "causa",
    },
    {
      id: "c4",
      text: "As sombras projetadas na parede da caverna",
      answer: "efeito",
    },
    {
      id: "c5",
      text: "As figuras que o prisioneiro chamava de realidade",
      answer: "aparencia",
    },
  ],
  feedback: {
    initial: "Organize o mecanismo: o que causa, o que resulta e o que apenas parecia.",
    correctPlacement: "Essa carta está no lugar certo.",
    successTitle: "O mecanismo ficou visível",
    successBody:
      "A sombra deixou de ser um fato isolado e ganhou uma história: causa, efeito e aparência agora têm papéis distintos.",
    retryTitle: "Há cartas para revisar",
  },
  labels: {
    itemSingular: "carta",
    itemPlural: "cartas",
    progressLabel: "cartas classificadas",
    check: "Verificar classificação",
  },
  table: {
    desktopAriaLabel: "Mesa de classificação do mecanismo da caverna",
    trayKicker: "Escolha uma carta",
    trayTitle: "Peças do mecanismo",
    completedTrayTitle: "Todas as cartas foram organizadas",
    completedTrayBody: "Revise as categorias antes de conferir.",
    destinationsAriaLabel: "Categorias do mecanismo",
    dropCue: "colocar",
    placeHere: "Colocar aqui",
    emptyDestination: "Ainda sem cartas",
    mobileAriaLabel: "Classificação do mecanismo atrás da parede",
    mobileItemLabel: "Carta",
    mobilePlacedLabel: "organizadas",
    mobileQuestion: "Qual categoria esta carta ocupa no mecanismo?",
    mobileDestinationsAriaLabel: "Escolha a categoria desta carta",
    mobileCompleteTitle: "Todas as cartas receberam uma categoria.",
    mobileCompleteBody: "Revise sua classificação antes de conferir.",
    mobileReviewTitle: "Sua classificação",
    mobileReviewActionPrefix: "Revisar",
  },
} satisfies GuidedClassificationConfig<MechanismCategoryId>;

export type SombraChoiceId = "arvore" | "pedra" | "animal" | "nao-sei";

export const SOMBRAS_LA_FORA_BANNER = {
  imageKey: "sombrasLaFora" as ASubidaAssetKey,
  caption: "Ele hesita entre reconhecer a forma e temer o que ela pode ser.",
};

export const SOMBRAS_LA_FORA_CONTENT = {
  prompt:
    "Fora da caverna, o prisioneiro vê uma sombra no chão. O que ele pode afirmar agora?",
  choices: [
    { value: "arvore", label: "É a sombra de uma árvore" },
    { value: "pedra", label: "É a sombra de uma pedra" },
    { value: "animal", label: "É a sombra de um animal" },
    { value: "nao-sei", label: "Não dá para saber de que objeto ela vem" },
  ] as const,
  consequence:
    "A sombra existe, mas o horizonte de evidência ainda não permite nomear o objeto que a produz.",
  matchedFeedback:
    "Certo: você pode dizer que vê uma sombra, sem precisar dizer de que objeto ela vem. Cada horizonte de evidência permite uma afirmação, e não mais do que isso.",
  unmatchedFeedback:
    "Essa afirmação vai além do que a evidência atual sustenta. Você vê a sombra; ainda não vê a origem dela. Tente outra previsão.",
} satisfies {
  prompt: string;
  choices: readonly { value: SombraChoiceId; label: string }[];
  consequence: string;
  matchedFeedback: string;
  unmatchedFeedback: string;
};

export function isSombraPredictionResponsible(
  choice: SombraChoiceId,
): boolean {
  return choice === "nao-sei";
}

export type CausalItemId = "objeto" | "luz" | "reflexo";

export const REFLEXOS_NA_AGUA_BANNER = {
  imageKey: "reflexosNaAgua" as ASubidaAssetKey,
  caption: "Um reflexo tem direção: vem de algo acima da água.",
};

export const REFLEXOS_NA_AGUA_CONTENT = {
  items: [
    {
      id: "objeto",
      label: "Objeto real acima da água",
      explanation: "A árvore ou a pedra existe independentemente de ser vista.",
    },
    {
      id: "luz",
      label: "Luz que incide sobre o objeto",
      explanation: "A luz vem de uma fonte e atinge o objeto acima da água.",
    },
    {
      id: "reflexo",
      label: "Reflexo na superfície da água",
      explanation: "O reflexo é um efeito; tem direção: vem de algo acima.",
    },
  ] as const satisfies readonly {
    id: CausalItemId;
    label: string;
    explanation: string;
  }[],
  correctOrder: ["objeto", "luz", "reflexo"] as const,
  demonstratedItemId: "objeto" as const,
  positionHints: [
    "O ponto de partida: algo que existe antes de ser visto.",
    "O que faz o objeto ficar visível a partir de uma direção.",
    "O efeito final, com direção que aponta de volta para a causa.",
  ] as const,
  activityLabel: "Monte o caminho do reflexo",
  pathLabel: "Três posições do caminho causal",
  completionMessage: "Do objeto ao reflexo: o caminho está completo.",
};

export type ModelStrategy = "maintain" | "revise" | "uncertain";

export const O_SOL_BANNER = {
  imageKey: "oSol" as ASubidaAssetKey,
  caption: "Ele mantém o olhar firme diante do sol nascente.",
};

export const O_SOL_CONTENT = {
  initialHypothesis:
    "As sombras na parede eram a realidade inteira; o fogo era só o que iluminava.",
  clueOptions: [
    {
      value: "sol-causa-visibilidade",
      label: "O Sol é a causa pela qual as outras coisas ficam visíveis.",
    },
    {
      value: "sombra-era-efeito-real",
      label: "A sombra era um efeito real, não a realidade inteira.",
    },
    {
      value: "fogo-era-causa-menor",
      label: "O fogo era uma causa menor dentro de uma cadeia maior.",
    },
    {
      value: "mundo-exterior-mesma-ordem",
      label:
        "O mundo exterior segue a mesma ordem causa e efeito da caverna.",
    },
  ] as const,
  reviewerText: {
    maintain:
      "As pistas novas ainda tensionam essa leitura: o fogo e o Sol produzem visibilidade de formas muito diferentes. Vale olhar de novo antes de manter.",
    revise:
      "Você preservou o que a sombra realmente mostrava e corrigiu a explicação da causa maior. Revisar o modelo não é apagar o que você viu antes.",
    uncertain:
      "Nomear a dúvida com precisão já é um avanço. Você pode voltar a esta pista quando quiser.",
  } satisfies Record<ModelStrategy, string>,
};
