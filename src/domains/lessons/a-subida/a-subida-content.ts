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
    title: "Uma imagem diferente",
    context: "",
    footer: "Ele queria entender o porquê",
    previousHref: "/aula/as-sombras/a-primeira-duvida",
    nextHref: "/aula/a-subida/fogo-e-estatuas",
    nextLabel: "Ver o que tinha atrás",
  },
  "fogo-e-estatuas": {
    eyebrow: "Atrás da parede · Capítulo 2",
    title: "O fogo",
    context: "",
    footer: "A sombra tinha uma causa",
    previousHref: "/aula/a-subida/depois-da-virada",
    nextHref: "/aula/a-subida/a-subida-dolorosa",
    nextLabel: "Seguir pela passagem",
  },
  "a-subida-dolorosa": {
    eyebrow: "A passagem · Capítulo 2",
    title: "A subida era íngreme",
    context: "",
    footer: "Não estava fácil. Ele continuou.",
    previousHref: "/aula/a-subida/fogo-e-estatuas",
    nextHref: "/aula/a-subida/sombras-la-fora",
    nextLabel: "Sair da caverna",
  },
  "sombras-la-fora": {
    eyebrow: "Lá fora · Capítulo 2",
    title: "Ele saiu",
    context: "",
    footer: "A luz, a árvore, a sombra",
    previousHref: "/aula/a-subida/a-subida-dolorosa",
    nextHref: "/aula/a-subida/periagoge",
    nextLabel: "Uma palavra para isso",
  },
  periagoge: {
    eyebrow: "Momento da palavra · Capítulo 2",
    title: "Periagōgē",
    context: "",
    footer: "A palavra, o gesto, o agora",
    previousHref: "/aula/a-subida/sombras-la-fora",
    nextHref: "/aula/a-subida/a-decisao",
    nextLabel: "E os outros?",
  },
  "a-decisao": {
    eyebrow: "Fim do Capítulo 2",
    title: "Ele pensou em voltar",
    context: "",
    footer: "Contar o que viu. O medo de rirem.",
    previousHref: "/aula/a-subida/periagoge",
    nextHref: "/inicio",
    nextLabel: "Voltar ao meu caminho",
  },
};

export type ASubidaPredictionChoice = {
  value: string;
  label: string;
};

export type ASubidaFolioBeat =
  | {
      kind: "guide-voice";
      pose: PlatoPoseKey;
      guideSide: "start" | "end";
      title: string;
      lead: string;
      guidance?: string;
      actionLabel: string;
      moment?: "concept";
    }
  | {
      kind: "story-panel";
      pose: PlatoPoseKey;
      guideSide: "start" | "end";
      imageKey: ASubidaAssetKey;
      text: string;
      actionLabel: string;
      moment?: "concept";
    }
  | {
      kind: "prediction";
      prompt: string;
      choices: readonly ASubidaPredictionChoice[];
      match: string;
      consequence?: string;
      matchedFeedback: string;
      unmatchedFeedback: string;
      matchedStatus?: string;
      unmatchedStatus?: string;
      confirmLabel?: string;
      retryLabel?: string;
      retryWhen?: "always" | "unmatched";
      unlockOnMiss?: boolean;
      actionLabel: string;
    }
  | {
      kind: "pair-connect";
      prompt: string;
      sources: readonly { id: string; label: string }[];
      targets: readonly { id: string; label: string }[];
      matches: Readonly<Record<string, string>>;
      successTitle: string;
      successBody: string;
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

export const DEPOIS_DA_VIRADA_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "invitation" as PlatoPoseKey,
    guideSide: "end" as const,
    title: "Na lição passada, apareceu uma sombra nova.",
    lead: "Uma imagem que ele nunca tinha visto.",
    guidance: "Ele olhou para trás para entender por que aquilo aconteceu.",
    actionLabel: "Continuar",
  },
  {
    kind: "story-panel" as const,
    pose: "reveal-behind" as PlatoPoseKey,
    guideSide: "start" as const,
    imageKey: "depoisDaVirada" as const,
    text: "Atrás da parede, alguém carregava dois objetos. Na sombra, os dois se misturavam e viravam uma imagem que ele não conhecia.",
    actionLabel: "Ver o que tinha atrás",
  },
] as const satisfies readonly ASubidaFolioBeat[];

export const FOGO_E_ESTATUAS_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "invitation" as PlatoPoseKey,
    guideSide: "end" as const,
    title: "Atrás da parede havia um fogo.",
    lead: "Pessoas passavam carregando objetos. A luz batia neles.",
    guidance: "A sombra na parede era só o desenho disso.",
    actionLabel: "E a outra luz?",
  },
] as const satisfies readonly ASubidaFolioBeat[];

export const A_SUBIDA_DOLOROSA_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "descent" as PlatoPoseKey,
    guideSide: "start" as const,
    title: "Depois do fogo, ele viu outro clarão.",
    lead: "Um raio de luz vinha lá do fundo da passagem. Não era a fogueira.",
    guidance: "A pergunta voltou: o que tem além daqui?",
    actionLabel: "Continuar",
  },
  {
    kind: "story-panel" as const,
    pose: "reveal-behind" as PlatoPoseKey,
    guideSide: "start" as const,
    imageKey: "feixeDeLuz" as const,
    text: "Ele olha o feixe e segue a passagem para saber de onde a luz vem.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "reveal-behind" as PlatoPoseKey,
    guideSide: "start" as const,
    title: "Ele decidiu seguir aquela luz.",
    lead: "Ainda não sabia que ela vinha de fora. Queria descobrir o que era.",
    guidance:
      "Para ir até ela, a passagem era íngreme. Não estava fácil. Ele pensou se valia continuar. Mesmo assim, ele seguiu.",
    actionLabel: "Continuar",
  },

  {
    kind: "story-panel" as const,
    pose: "reveal-behind" as PlatoPoseKey,
    guideSide: "start" as const,
    imageKey: "aSubidaDolorosa" as const,
    text: "Ele sobe em direção à entrada. A luz lá na frente cresce.",
    actionLabel: "Sair da caverna",
  },
] as const satisfies readonly ASubidaFolioBeat[];

export const LA_FORA_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "light-pain-guide" as PlatoPoseKey,
    guideSide: "start" as const,
    title: "Ele saiu da caverna.",
    lead: "Lá fora a luz era tão forte que ele cobriu os olhos.",
    guidance: "Os olhos doíam. Pela primeira vez, ele estava no mundo aberto.",
    actionLabel: "Continuar",
  },
  {
    kind: "story-panel" as const,
    pose: "reveal-behind" as PlatoPoseKey,
    guideSide: "start" as const,
    imageKey: "oSol" as const,
    text: "A mão nos olhos. O sol no horizonte. Ele tinha chegado.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "gradual-seeing-guide" as PlatoPoseKey,
    guideSide: "start" as const,
    title: "Depois ele viu uma árvore de verdade.",
    lead: "Viu a pedra. Viu a sombra no chão.",
    guidance:
      "A sombra vinha da luz batendo na árvore. A árvore era a coisa. A sombra era só o recorte.",
    actionLabel: "Continuar",
  },
  {
    kind: "story-panel" as const,
    pose: "reveal-behind" as PlatoPoseKey,
    guideSide: "start" as const,
    imageKey: "objetosEstrelasELua" as const,
    text: "Ele toca a árvore. O sol bate nela. A verdade é o objeto, não a sombra.",
    actionLabel: "Continuar",
  },
  {
    kind: "pair-connect" as const,
    prompt: "Ligue o que ele viu com o que isso é.",
    sources: [
      { id: "luz", label: "A luz do sol" },
      { id: "arvore", label: "A árvore" },
      { id: "sombra", label: "A forma no chão" },
    ],
    targets: [
      { id: "recorte", label: "Só o recorte" },
      { id: "coisa", label: "A coisa de verdade" },
      { id: "ilumina", label: "O que ilumina" },
    ],
    matches: {
      luz: "ilumina",
      arvore: "coisa",
      sombra: "recorte",
    },
    successTitle: "A luz, a coisa, o recorte.",
    successBody: "A sombra existe porque a luz bate na árvore.",
    actionLabel: "Uma palavra para isso",
  },
] as const satisfies readonly ASubidaFolioBeat[];

export const PERIAGOGE_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "invitation" as PlatoPoseKey,
    guideSide: "end" as const,
    moment: "concept" as const,
    title: "Isso tem um nome: periagōgē.",
    lead: "περιαγωγή. Virar o olhar.",
    guidance: "Virar o olhar é sair do lugar antigo para ver de onde a imagem vem.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "periagoge-guide" as PlatoPoseKey,
    guideSide: "start" as const,
    moment: "concept" as const,
    title: "Foi o que ele fez.",
    lead: "Ele parou de olhar só a parede e foi ver de onde vinha a imagem.",
    guidance: "Por isso a palavra entra agora: a história já mostrou o gesto.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "invitation" as PlatoPoseKey,
    guideSide: "end" as const,
    moment: "concept" as const,
    title: "Isso ainda acontece com a gente.",
    lead: "Um vídeo cortado. Um rumor. Um feed que só mostra um lado.",
    guidance:
      "A gente olha para ali e chama aquilo de mundo. Virar o olhar é difícil porque o lugar antigo ainda parece mais seguro.",
    actionLabel: "Ver um recorte",
  },
  {
    kind: "story-panel" as const,
    pose: "reveal-behind" as PlatoPoseKey,
    guideSide: "start" as const,
    moment: "concept" as const,
    imageKey: "recorteAgora" as const,
    text: "No celular, um vídeo cortado. A gente olha para aquilo e chama de mundo.",
    actionLabel: "E os outros?",
  },
] as const satisfies readonly ASubidaFolioBeat[];

export const A_DECISAO_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "invitation" as PlatoPoseKey,
    guideSide: "end" as const,
    title: "Ele pensou nos que ficaram.",
    lead: "Na parede, ainda tem gente que só vê sombra.",
    guidance: "Ele quer contar o que viu.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "return-compassion-guide" as PlatoPoseKey,
    guideSide: "start" as const,
    title: "Mas ele tem medo.",
    lead: "E se rirem dele? E se ninguém acreditar?",
    guidance: "Esse medo de ser julgado, muita gente da sua idade conhece.",
    actionLabel: "Continuar",
  },
  {
    kind: "prediction" as const,
    prompt: "Se ele voltar para contar o que viu, o que ele teme?",
    choices: [
      {
        value: "rirem",
        label: "Que riam dele e não acreditem",
      },
      {
        value: "ja-sabem",
        label: "Que os outros já saibam de tudo",
      },
      {
        value: "parede",
        label: "Que a parede desapareça",
      },
      {
        value: "fogo",
        label: "Que o fogo apague",
      },
    ],
    match: "rirem",
    matchedStatus: "Você acertou",
    unmatchedStatus: "Ainda não é isso",
    matchedFeedback:
      "É isso. Ele quer contar, e teme que riam dele.",
    unmatchedFeedback:
      "Isso pode acontecer no mundo, mas não é o que ele sente agora. Tente de novo.",
    retryWhen: "unmatched",
    unlockOnMiss: true,
    actionLabel: "Continuar",
  },
  {
    kind: "story-panel" as const,
    pose: "return-compassion-guide" as PlatoPoseKey,
    guideSide: "start" as const,
    imageKey: "olharACaverna" as const,
    text: "Ele para na boca da caverna. Quer contar o que viu, e teme que riam. A dúvida fica aqui. Mais à frente, a gente vê o que ele faz com ela.",
    actionLabel: "Continuar",
  },
  {
    kind: "reward" as const,
    pointsLabel: "+100 pontos de descoberta",
    title: "Você conquistou o Olhar de fora",
    badgeName: "Olhar de fora",
    takeaways: [
      "A luz, a coisa e o recorte não são a mesma coisa.",
      "Virar o olhar muda o que a gente chama de mundo.",
      "Querer contar e ter medo de julgamento podem nascer juntos.",
    ],
    unlockedTitle: "Você terminou A Subida",
    unlockedBody:
      "O próximo capítulo ainda está à espera. Por agora, volte ao seu caminho.",
    actionLabel: "Voltar ao meu caminho",
  },
] as const satisfies readonly ASubidaFolioBeat[];

export const A_SUBIDA_FOLIO_BEATS: Record<
  ASubidaSceneId,
  readonly ASubidaFolioBeat[]
> = {
  "depois-da-virada": DEPOIS_DA_VIRADA_BEATS,
  "fogo-e-estatuas": FOGO_E_ESTATUAS_BEATS,
  "a-subida-dolorosa": A_SUBIDA_DOLOROSA_BEATS,
  "sombras-la-fora": LA_FORA_BEATS,
  periagoge: PERIAGOGE_BEATS,
  "a-decisao": A_DECISAO_BEATS,
};
