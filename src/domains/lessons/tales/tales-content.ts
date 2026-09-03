import type { TalesAssetKey } from "./tales-assets";
import type { TalesSceneId } from "./tales-journey";

export type ThalesPoseId =
  | "identity-anchor"
  | "point-harbor"
  | "present-panel"
  | "open-hands-variety"
  | "hold-question"
  | "water-answer"
  | "present-word"
  | "hook-open";

export type TalesSceneMeta = {
  eyebrow: string;
  title: string;
  context: string;
  footer: string;
  previousHref: string;
  nextHref?: string;
  nextLabel?: string;
};

export const TALES_SCENE_META: Record<TalesSceneId, TalesSceneMeta> = {
  ola: {
    eyebrow: "Tales de Mileto",
    title: "Olá, eu sou Tales",
    context: "",
    footer: "Um guia novo assume a sala",
    previousHref: "/inicio",
    nextHref: "/aula/tales/mileto",
    nextLabel: "Ver o porto",
  },
  mileto: {
    eyebrow: "Tales de Mileto",
    title: "Olha o meu porto",
    context: "",
    footer: "As coisas do cais parecem muitas",
    previousHref: "/aula/tales/ola",
    nextHref: "/aula/tales/o-principio",
    nextLabel: "Ouvir a pergunta",
  },
  "o-principio": {
    eyebrow: "Tales de Mileto",
    title: "Um fundo comum",
    context: "",
    footer: "A pergunta, a água, o chão",
    previousHref: "/aula/tales/mileto",
    nextHref: "/aula/tales/arche",
    nextLabel: "Ouvir o nome disso",
  },
  arche: {
    eyebrow: "Momento da palavra",
    title: "Arché",
    context: "",
    footer: "A pergunta tem um nome",
    previousHref: "/aula/tales/o-principio",
    nextHref: "/aula/tales/tres-cestos",
    nextLabel: "Separar as frases",
  },
  "tres-cestos": {
    eyebrow: "Tales de Mileto",
    title: "Cara, pergunta, resposta",
    context: "",
    footer: "Separar o que estava misturado",
    previousHref: "/aula/tales/arche",
    nextHref: "/aula/tales/o-um-e-os-muitos",
    nextLabel: "Ligar as caras",
  },
  "o-um-e-os-muitos": {
    eyebrow: "Fim do capítulo",
    title: "Variedade, mesmo gesto",
    context: "",
    footer: "O fundo é um. Como ele se mostra ainda fica em aberto.",
    previousHref: "/aula/tales/tres-cestos",
    nextHref: "/inicio",
    nextLabel: "Voltar ao meu caminho",
  },
};

export type TalesActivityBriefing = {
  title: string;
  purpose: string;
  steps: readonly string[];
  startLabel: string;
  guidePoseId: ThalesPoseId;
  demoNote?: string;
};

export type TalesPredictionChoice = {
  value: string;
  label: string;
};

export type TalesFolioBeat =
  | {
      kind: "guide-voice";
      pose: ThalesPoseId;
      guideSide: "start" | "end";
      title: string;
      lead: string;
      guidance?: string;
      actionLabel: string;
      moment?: "concept";
    }
  | {
      kind: "story-panel";
      pose: ThalesPoseId;
      guideSide: "start" | "end";
      imageKey: TalesAssetKey;
      text: string;
      actionLabel: string;
      moment?: "concept";
    }
  | {
      kind: "classification";
      briefing: TalesActivityBriefing;
      actionLabel: string;
    }
  | {
      kind: "prediction";
      prompt: string;
      imageKey?: TalesAssetKey;
      choices: readonly TalesPredictionChoice[];
      match: string;
      matchedFeedback: string;
      unmatchedFeedback: string;
      matchedStatus?: string;
      unmatchedStatus?: string;
      confirmLabel?: string;
      retryLabel?: string;
      retryWhen?: "always" | "unmatched";
      unlockOnMiss?: boolean;
      briefing: TalesActivityBriefing;
      actionLabel: string;
    }
  | {
      kind: "pair-connect";
      prompt: string;
      sources: readonly { id: string; label: string }[];
      targets: readonly { id: string; label: string }[];
      matches: Readonly<Record<string, string>>;
      checkLabel: string;
      successTitle: string;
      successBody: string;
      retryBody: string;
      activityLabel: string;
      briefing: TalesActivityBriefing;
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
    title: "Olá, eu sou Tales",
    lead: "Você viu que a primeira imagem não era o mundo inteiro. Olá, eu sou Tales.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "point-harbor" as const,
    guideSide: "start" as const,
    title: "Eu vim de Mileto",
    lead: "Eu vim de Mileto, uma cidade de porto na Jônia. Lá a água está em todo lado: mar, rio, chuva, o que a terra bebe para nascer planta.",
    actionLabel: "Ver o porto",
  },
] as const satisfies readonly TalesFolioBeat[];

export const MILETO_BEATS = [
  {
    kind: "story-panel" as const,
    pose: "present-panel" as const,
    guideSide: "start" as const,
    imageKey: "portoMileto" as const,
    text: "Olha o meu porto. Barcos, ânforas, gente, o mar no horizonte.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "open-hands-variety" as const,
    guideSide: "end" as const,
    title: "Parecem muitas",
    lead: "No cais as coisas mudam de cara o tempo todo. Onda, vinho, seiva, chuva. Parecem muitas.",
    actionLabel: "Ouvir a pergunta",
  },
] as const satisfies readonly TalesFolioBeat[];

export const O_PRINCIPIO_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "hold-question" as const,
    guideSide: "end" as const,
    title: "Um fundo comum",
    lead: "Eu fiquei famoso por insistir numa só direção. Terra, planta, animal, nuvem: por baixo dessa variedade, existe um começo e um fundo comum?",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "water-answer" as const,
    guideSide: "end" as const,
    title: "Eu digo que é a água",
    lead: "Eu digo que esse princípio é a água. Não que o mundo seja um copo cheio. O que parece seco, sólido ou vivo ainda depende, no fundo, desse úmido.",
    actionLabel: "Continuar",
  },
  {
    kind: "story-panel" as const,
    pose: "present-panel" as const,
    guideSide: "start" as const,
    imageKey: "terraSobreAgua" as const,
    text: "Até o chão, para mim, não é o fundo último. A terra se apoia sobre água.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "open-hands-variety" as const,
    guideSide: "end" as const,
    title: "Um jeito de imaginar o porquê",
    lead: "Por que água? Quem veio depois tentou adivinhar: o alimento é úmido, o vivo parece precisar do úmido, o morto seca. Eu não deixei isso escrito. É um jeito de imaginar o porquê, não uma prova de laboratório.",
    actionLabel: "Ouvir o nome disso",
  },
] as const satisfies readonly TalesFolioBeat[];

export const ARCHE_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "present-word" as const,
    guideSide: "end" as const,
    moment: "concept" as const,
    title: "Arché",
    lead: "Essa pergunta tem um nome: arché. Em grego, ἀρχή. Princípio: o começo e o fundo. Não é o nome da água. É o nome do tipo de coisa que eu estava procurando.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "open-hands-variety" as const,
    guideSide: "start" as const,
    moment: "concept" as const,
    title: "No porto, um só princípio",
    lead: "No porto de Mileto as coisas mudam de cara. Eu trato essa variedade como tendo o mesmo princípio. A água é a minha resposta. Arché é a pergunta.",
    actionLabel: "Continuar",
  },
  {
    kind: "story-panel" as const,
    pose: "present-panel" as const,
    guideSide: "start" as const,
    moment: "concept" as const,
    imageKey: "mesaAlmoco" as const,
    text: "Na mesa do almoço o pão, a fruta e o suco também são muitas caras. A pergunta continua: de que isso é feito, no fundo? É essa forma que arché nomeia.",
    actionLabel: "Separar as frases",
  },
] as const satisfies readonly TalesFolioBeat[];

export const TRES_CESTOS_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "hold-question" as const,
    guideSide: "start" as const,
    title: "Cara, pergunta, resposta",
    lead: "Vamos separar. Uma coisa é a cara no cais. Outra é perguntar pelo começo e pelo fundo. Outra é a minha resposta: a água.",
    actionLabel: "Separar as frases",
  },
  {
    kind: "classification" as const,
    briefing: {
      title: "Três cestos",
      purpose:
        "Nesta cena a cara das coisas, a pergunta da arché e a resposta da água não são a mesma coisa.",
      steps: [
        "Ver o exemplo resolvido (três frases já classificadas).",
        "Arrastar o cartão ou tocar nele e escolher um cesto.",
        "Conferir. Cartões no cesto errado voltam; os certos ficam. Sem penalidade.",
        "Continuar do Folio só quando os três cestos estiverem certos.",
      ],
      startLabel: "Separar as frases",
      guidePoseId: "hold-question",
      demoNote:
        "Primeiro aparece um exemplo já resolvido. Depois você coloca cada frase num cesto e confere.",
    },
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "water-answer" as const,
    guideSide: "start" as const,
    title: "Não é um copo",
    lead: "Tem gente que me ouve assim: ele achava que tudo está molhado agora. Eu não disse isso. Eu disse origem e fundo, mesmo do que parece seco.",
    actionLabel: "Escolher um jeito",
  },
  {
    kind: "prediction" as const,
    imageKey: "terraSobreAgua" as const,
    prompt:
      "A ânfora está seca por fora. A terra parece firme. Tales ainda diz que o princípio é a água. Qual jeito de ouvir isso casa com o que ele contou?",
    choices: [
      { value: "molhado-agora", label: "Tudo está molhado agora." },
      {
        value: "origem-fundo",
        label: "A água é origem e fundo, mesmo do que parece seco.",
      },
    ],
    match: "origem-fundo",
    matchedStatus: "Você acertou",
    unmatchedStatus: "Ainda não é isso",
    matchedFeedback:
      "É isso. Ele não disse que o mundo é um copo cheio. Disse origem e fundo, inclusive do que parece seco.",
    unmatchedFeedback:
      "Esse jeito transforma a tese num copo. Ele falou de origem e fundo, não de tudo molhado agora. Tente de novo.",
    retryWhen: "unmatched",
    unlockOnMiss: true,
    confirmLabel: "Confirmar",
    retryLabel: "Confirmar",
    briefing: {
      title: "Dois jeitos de ouvir",
      purpose:
        "Há dois jeitos de ouvir a tese da água. Só um casa com o que Tales acabou de contar.",
      steps: [
        "Ler a evidência. Os dois modelos estão à vista como alternativas.",
        "Tocar na alternativa e em Confirmar.",
        "Se não for essa, o motor avisa e libera outra escolha na hora. Sem penalidade.",
        "Continuar do Folio só no acerto.",
      ],
      startLabel: "Escolher um jeito",
      guidePoseId: "water-answer",
    },
    actionLabel: "Ligar as caras",
  },
] as const satisfies readonly TalesFolioBeat[];

export const O_UM_E_OS_MUITOS_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "open-hands-variety" as const,
    guideSide: "start" as const,
    title: "Variedade, mesmo gesto",
    lead: "Onda, seiva, chuva, terra seca, pão na mesa: caras diferentes. O gesto é o mesmo. Ligar cada cara ao fundo comum, não a um começo novo a cada vez.",
    actionLabel: "Ligar os pares",
  },
  {
    kind: "pair-connect" as const,
    prompt: "Ligue cada cara ao tipo de gesto.",
    sources: [
      { id: "cais", label: "Muitas caras no cais" },
      { id: "fundo", label: "Um começo e um fundo" },
      { id: "agua", label: "Eu digo que é a água" },
      { id: "mesa", label: "Pão, fruta, suco" },
    ],
    targets: [
      { id: "superficie", label: "Variedade na superfície" },
      { id: "arche", label: "A pergunta da arché" },
      { id: "resposta", label: "A resposta, não a pergunta" },
      { id: "mesma-forma", label: "A mesma forma agora" },
    ],
    matches: {
      cais: "superficie",
      fundo: "arche",
      agua: "resposta",
      mesa: "mesma-forma",
    },
    checkLabel: "Conferir",
    successTitle: "O gesto é o mesmo.",
    successBody:
      "Caras diferentes. A pergunta pelo fundo é uma só. A água é a resposta dele, não o nome da pergunta.",
    retryBody:
      "Algumas ligações ainda não combinam. Elas se soltaram para você rever.",
    activityLabel: "Ligue cada ideia da esquerda com a da direita",
    briefing: {
      title: "Ligar as caras",
      purpose:
        "Cada cara ainda pode ser ligada ao mesmo tipo de pergunta, não a um fundo diferente para cada coisa.",
      steps: [
        "Ligar cada pílula da esquerda a uma da direita (arrastar o fio ou tocar os dois nós).",
        "Ligar todas antes de Conferir.",
        "Conferir. Só as ligações erradas se soltam. Sem penalidade.",
        "Continuar do Folio só quando o mapa estiver certo.",
      ],
      startLabel: "Ligar os pares",
      guidePoseId: "open-hands-variety",
    },
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "hook-open" as const,
    guideSide: "end" as const,
    title: "Se o fundo é um",
    lead: "A tradição colocou meu nome nessa pergunta. A minha voz não chegou num livro meu. Isso não quer dizer que tanto faz. Quer dizer que herdamos a tese: o fundo é um, e eu o chamo de água. Se o fundo é um, ainda fica em aberto como o um se mostra como muitos que nascem e morrem.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "identity-anchor" as const,
    guideSide: "end" as const,
    title: "O que você levou",
    lead: "Você já pode levar a pergunta. A água fica comigo como resposta. O fundo, a gente continua olhando.",
    actionLabel: "Continuar",
  },
  {
    kind: "reward" as const,
    pointsLabel: "+100 pontos de descoberta",
    title: "Você conquistou Tales de Mileto",
    badgeName: "A pergunta da arché",
    takeaways: [
      "Arché é a pergunta pelo começo e pelo fundo, por baixo das muitas caras.",
      "A resposta de Tales é a água. A pergunta é maior do que a resposta.",
      "Primeiro não quer dizer infalível. Discordar da água não é rir de quem perguntou.",
    ],
    unlockedTitle: "A pergunta segue com você",
    unlockedBody:
      "Tales ficou com a água como resposta. A arché é a pergunta. Volte ao seu caminho.",
    actionLabel: "Voltar ao meu caminho",
  },
] as const satisfies readonly TalesFolioBeat[];

export const TALES_FOLIO_BEATS: Record<
  TalesSceneId,
  readonly TalesFolioBeat[]
> = {
  ola: OLA_BEATS,
  mileto: MILETO_BEATS,
  "o-principio": O_PRINCIPIO_BEATS,
  arche: ARCHE_BEATS,
  "tres-cestos": TRES_CESTOS_BEATS,
  "o-um-e-os-muitos": O_UM_E_OS_MUITOS_BEATS,
};
