import type { PlatoPoseKey } from "../plato-pose-catalog";
import type { ORetornoAssetKey } from "./o-retorno-assets";
import type { ORetornoSceneId } from "./o-retorno-journey";

export type ORetornoSceneMeta = {
  eyebrow: string;
  title: string;
  context: string;
  footer: string;
  previousHref: string;
  nextHref?: string;
  nextLabel?: string;
};

export const O_RETORNO_SCENE_META: Record<ORetornoSceneId, ORetornoSceneMeta> = {
  "na-boca": {
    eyebrow: "A Caverna de Platão · Capítulo 3",
    title: "Ele decide voltar",
    context: "",
    footer: "A decisão da lição passada continua aqui",
    previousHref: "/aula/a-subida/a-decisao",
    nextHref: "/aula/o-retorno/katabainein",
    nextLabel: "Ouvir o nome disso",
  },
  katabainein: {
    eyebrow: "Momento da palavra · Capítulo 3",
    title: "Aletheia",
    context: "",
    footer: "A verdade que estava coberta",
    previousHref: "/aula/o-retorno/na-boca",
    nextHref: "/aula/o-retorno/a-escuridao",
    nextLabel: "Ver o que a escuridão custa",
  },
  "a-escuridao": {
    eyebrow: "A escuridão de voltar · Capítulo 3",
    title: "Os olhos escurecem de novo",
    context: "",
    footer: "Duas lentes, uma pedra",
    previousHref: "/aula/o-retorno/katabainein",
    nextHref: "/aula/o-retorno/jogos-de-sombra",
    nextLabel: "Ver o jogo por dentro",
  },
  "jogos-de-sombra": {
    eyebrow: "Os jogos de sombra · Capítulo 3",
    title: "Ele perde o jogo",
    context: "",
    footer: "Ridículo não é burrice",
    previousHref: "/aula/o-retorno/a-escuridao",
    nextHref: "/aula/o-retorno/a-divida",
    nextLabel: "Seguir a história",
  },
  "a-divida": {
    eyebrow: "Mesmo assim · Capítulo 3",
    title: "O medo e a obrigação",
    context: "",
    footer: "O medo não some. Mesmo assim ele conta.",
    previousHref: "/aula/o-retorno/jogos-de-sombra",
    nextHref: "/aula/o-retorno/a-descida",
    nextLabel: "Fechar o mito",
  },
  "a-descida": {
    eyebrow: "Fim do Capítulo 3",
    title: "O mito da caverna",
    context: "",
    footer: "O mito, Platão, a filosofia",
    previousHref: "/aula/o-retorno/a-divida",
    nextHref: "/inicio",
    nextLabel: "Voltar ao meu caminho",
  },
};

export type ORetornoActivityBriefing = {
  title: string;
  purpose: string;
  steps: readonly string[];
  startLabel: string;
  guidePose: PlatoPoseKey;
};

export type ORetornoPredictionChoice = {
  value: string;
  label: string;
};

export type ORetornoDualLensAlternative = {
  id: string;
  label: string;
};

export type ORetornoDecisionLayer = {
  id: string;
  label: string;
  weightNote: string;
  explanation: string;
};

export type ORetornoFolioBeat =
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
      imageKey: ORetornoAssetKey;
      text: string;
      actionLabel: string;
      moment?: "concept";
    }
  | {
      kind: "prediction";
      prompt: string;
      imageKey?: ORetornoAssetKey;
      choices: readonly ORetornoPredictionChoice[];
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
      briefing: ORetornoActivityBriefing;
      actionLabel: string;
    }
  | {
      kind: "dual-lens";
      prompt: string;
      lensAKey: ORetornoAssetKey;
      lensBKey: ORetornoAssetKey;
      initialLens?: "A" | "B";
      finalQuestion: string;
      alternatives: readonly ORetornoDualLensAlternative[];
      correctAlternativeId: string;
      correctFeedback: string;
      incorrectFeedback: readonly { alternativeId: string; message: string }[];
      briefing: ORetornoActivityBriefing;
      actionLabel: string;
    }
  | {
      kind: "decision-layers";
      prompt: string;
      layers: readonly ORetornoDecisionLayer[];
      correctOrder: readonly string[];
      correctFeedback: string;
      outOfPlaceFeedback: readonly { layerId: string; message: string }[];
      briefing: ORetornoActivityBriefing;
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

export const NA_BOCA_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "invitation" as PlatoPoseKey,
    guideSide: "end" as const,
    title: "Na lição passada, ele saiu da caverna.",
    lead: "Lá fora ele viu o que a parede não mostrava. A sombra não era o mundo inteiro.",
    guidance: "Ele ficou na boca, pensando se voltava para contar isso.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "thoughtful-chin" as PlatoPoseKey,
    guideSide: "start" as const,
    title: "Ele ficou inseguro.",
    lead: "Lá dentro os outros ainda olhavam só a parede. Voltar podia doer.",
    guidance: "Mesmo assim ele decidiu voltar.",
    actionLabel: "Continuar",
  },
  {
    kind: "story-panel" as const,
    pose: "invite-turn" as PlatoPoseKey,
    guideSide: "start" as const,
    imageKey: "bocaDaCaverna" as const,
    text: "Ele respira e dá o primeiro passo para dentro. A decisão de voltar começa aqui.",
    actionLabel: "Ouvir o nome disso",
  },
] as const satisfies readonly ORetornoFolioBeat[];

export const KATABAINEIN_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "invitation" as PlatoPoseKey,
    guideSide: "end" as const,
    moment: "concept" as const,
    title: "Isso tem um nome: aletheia.",
    lead: "ἀλήθεια. Aletheia.",
    guidance:
      "É a verdade que estava coberta. A sombra esconde. Ele viu o que tinha atrás. Agora ele volta para mostrar isso, não para guardar só para si.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "point-into-darkness" as PlatoPoseKey,
    guideSide: "start" as const,
    moment: "concept" as const,
    title: "Não é só entrar de novo.",
    lead: "Entrar é o caminho. Aletheia é o que ele carrega nesse caminho.",
    guidance:
      "Tirar a capa da primeira imagem. Deixar ver o que a parede não mostra.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "speaking-gesture" as PlatoPoseKey,
    guideSide: "end" as const,
    moment: "concept" as const,
    title: "Isso ainda acontece com a gente.",
    lead: "Você descobre que a primeira versão da história não era o todo. Seus amigos ainda repetem aquela versão.",
    guidance:
      "Voltar e contar o que você viu também é aletheia. Dói um pouco.",
    actionLabel: "Ver o que a escuridão custa",
  },
] as const satisfies readonly ORetornoFolioBeat[];

export const A_ESCURIDAO_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "feeling-dark" as PlatoPoseKey,
    guideSide: "start" as const,
    title: "Ele entra.",
    lead: "A cada passo, a luz de fora fica mais fraca.",
    guidance: "A escuridão bate nos olhos dele como a luz bateu quando ele saiu.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "light-pain-guide" as PlatoPoseKey,
    guideSide: "start" as const,
    title: "Os olhos dele ficam cheios de escuridão de novo.",
    lead: "Não porque ele esqueceu o que viu lá fora.",
    guidance: "A visão precisa de tempo para se readaptar.",
    actionLabel: "Continuar",
  },
  {
    kind: "story-panel" as const,
    pose: "first-doubt" as PlatoPoseKey,
    guideSide: "start" as const,
    imageKey: "oTropeco" as const,
    text: "Ele tropeça numa pedra que ele conhecia. Não virou incapaz. O escuro pede um olho que ele ainda não recuperou.",
    actionLabel: "Ver com os próprios olhos",
  },
  {
    kind: "dual-lens" as const,
    prompt: "Arraste a linha e compare os dois olhos na mesma caverna.",
    lensAKey: "lenteOlhoReadaptando" as const,
    lensBKey: "lenteOlhoAcostumado" as const,
    initialLens: "A" as const,
    finalQuestion: "O que explica o tropeço dele?",
    alternatives: [
      { id: "pedra-mudou", label: "A pedra mudou de lugar" },
      { id: "readaptacao", label: "O olho precisa de tempo para readaptar" },
    ],
    correctAlternativeId: "readaptacao",
    correctFeedback:
      "Isso mesmo. A pedra é a mesma. O olho precisa de tempo para se readaptar ao escuro.",
    incorrectFeedback: [
      {
        alternativeId: "pedra-mudou",
        message:
          "A pedra não mudou de lugar. Quem muda é o olho. Tente de novo.",
      },
    ],
    briefing: {
      title: "Duas lentes, uma cena",
      purpose:
        "A mesma caverna, dois olhos. Arraste a linha no meio da imagem para ver o outro olhar. Depois escolha a carta que explica o tropeço.",
      steps: [
        "Pegue a bolinha no meio da imagem e arraste para o lado.",
        "Vá e volte. Na esquerda fica o olho ofuscado. Na direita, o olho que já vê no escuro.",
        "Quando a imagem nova aparecer por inteiro, toque em Ver perguntas e escolha uma carta. Se errar, tente de novo sem penalidade.",
      ],
      startLabel: "Começar a ver",
      guidePose: "briefing-lenses",
    },
    actionLabel: "Continuar",
  },
] as const satisfies readonly ORetornoFolioBeat[];

export const JOGOS_DE_SOMBRA_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "show-shadow-game" as PlatoPoseKey,
    guideSide: "start" as const,
    title: "Lá no fundo, os amigos ainda estão.",
    lead: "Ele reencontra quem ficou. Eles ainda olham a parede. Ainda jogam quem nomeia a sombra primeiro.",
    guidance:
      "Ele tenta entrar no jogo, mas erra, porque está lento. Os olhos e a cabeça ainda estão no que ele viu lá fora.",
    actionLabel: "Continuar",
  },
  {
    kind: "story-panel" as const,
    pose: "listening-prisoner" as PlatoPoseKey,
    guideSide: "start" as const,
    imageKey: "jogosDeSombra" as const,
    text: "Fora da caverna ele olhava a verdade, não as sombras. Agora que tenta olhar de novo para a parede, fica fora do ritmo. Os amigos riem.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "first-question" as PlatoPoseKey,
    guideSide: "start" as const,
    title: "Eles riram dele.",
    lead: "Não porque ele ficou burro.",
    guidance:
      "Porque ele perdeu a prática de nomear sombras rápido. São treinos diferentes.",
    actionLabel: "Avaliar a evidência",
  },
  {
    kind: "prediction" as const,
    imageKey: "jogosDeSombra" as const,
    prompt: "Ele erra o nome da sombra, é lento, e os outros riem. O que explica isso?",
    choices: [
      { value: "burrice", label: "Ele ficou burro" },
      { value: "pratica", label: "Ele perdeu a prática de nomear sombras rápido" },
    ],
    match: "pratica",
    matchedStatus: "Você acertou",
    unmatchedStatus: "Ainda não é isso",
    matchedFeedback:
      "Isso mesmo. Ele perdeu a prática de nomear sombras rápido. Fora deste jogo, ele continua sabendo o que viu lá fora.",
    unmatchedFeedback:
      "Se fosse burrice, ele erraria em qualquer contexto. Ele só erra neste jogo específico, que exige um treino que ele não pratica mais.",
    retryWhen: "unmatched",
    unlockOnMiss: true,
    confirmLabel: "Confirmar",
    retryLabel: "Confirmar",
    briefing: {
      title: "Escolha uma alternativa",
      purpose:
        "Aqui não tem arrastar. Você lê a evidência, escolhe uma explicação e confirma.",
      steps: [
        "Toque na alternativa que combina com a evidência.",
        "Toque em Confirmar.",
        "Se for essa, a gente confirma. Se não for, a gente avisa e você tenta de novo.",
      ],
      startLabel: "Avaliar a evidência",
      guidePose: "show-shadow-game",
    },
    actionLabel: "Seguir a história",
  },
] as const satisfies readonly ORetornoFolioBeat[];

export const A_DIVIDA_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "invite-stack" as PlatoPoseKey,
    guideSide: "start" as const,
    title: "Os amigos zombam. Dói.",
    lead: "Ele acabou de errar o jogo. Eles riram de novo.",
    guidance: "Mesmo assim ele não desiste de contar o que viu lá fora.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "revision-maintain" as PlatoPoseKey,
    guideSide: "start" as const,
    title: "O medo dele não some.",
    lead: "A obrigação fica em cima dele.",
    guidance:
      "As duas coisas juntas: ter medo e mesmo assim mostrar a verdade para os amigos.",
    actionLabel: "Empilhar os motivos",
  },
  {
    kind: "decision-layers" as const,
    prompt: "Empilhe o que ele sentia, do mais leve ao mais pesado.",
    layers: [
      {
        id: "obrigacao",
        label: "Trazer a verdade para os amigos",
        weightNote: "Camada que pesa mais",
        explanation:
          "Ele viu o que a sombra esconde. Contar isso aos amigos é a obrigação que fica em cima.",
      },
      {
        id: "memoria",
        label: "A vontade de reencontrar os amigos",
        weightNote: "Camada pessoal, leve",
        explanation: "Ele pensa em quem ficou, ainda vendo só a parede.",
      },
      {
        id: "custo",
        label: "O custo de ver de novo no escuro",
        weightNote: "Camada intermediária",
        explanation: "Voltar a ver no escuro tem um preço real, não é de graça.",
      },
    ],
    correctOrder: ["memoria", "custo", "obrigacao"],
    correctFeedback:
      "A pilha está certa. O medo não some. Trazer a verdade fica em cima, sem apagar as outras camadas.",
    outOfPlaceFeedback: [
      {
        layerId: "obrigacao",
        message:
          "Trazer a verdade pesa mais que a vontade de reencontrar os amigos. Essa camada fica no topo da pilha.",
      },
      {
        layerId: "memoria",
        message:
          "A vontade de reencontrar os amigos é a camada mais leve. Ela fica na base da pilha.",
      },
      {
        layerId: "custo",
        message:
          "O custo de ver de novo no escuro pesa mais que a saudade, mas menos que trazer a verdade. Ele fica no meio.",
      },
    ],
    briefing: {
      title: "Camadas de uma decisão",
      purpose:
        "Empilhe o que ele sentia. A ordem é de peso, não de tempo. O medo não some. Trazer a verdade fica em cima.",
      steps: [
        "Arraste uma camada até o degrau da pirâmide. Embaixo fica o mais leve. Em cima, o que pesa mais.",
        "Toque em Conferir. Se alguma estiver fora do lugar, leia o porquê.",
        "Reempilhe até acertar. Sem penalidade.",
      ],
      startLabel: "Empilhar os motivos",
      guidePose: "invite-stack",
    },
    actionLabel: "Fechar o mito",
  },
] as const satisfies readonly ORetornoFolioBeat[];

export const A_DESCIDA_BEATS = [
  {
    kind: "guide-voice" as const,
    pose: "return-compassion-guide" as PlatoPoseKey,
    guideSide: "start" as const,
    title: "Mesmo com medo, ele falou.",
    lead: "Contou aos amigos o que a sombra esconde. Mostrou que a parede não era o mundo inteiro.",
    guidance:
      "Essa foi a obrigação dele. O medo não foi embora. Ensinar o que se viu faz parte do mesmo gesto.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "point-into-darkness" as PlatoPoseKey,
    guideSide: "start" as const,
    title: "Esse foi o mito da caverna.",
    lead: "As sombras. A subida. A volta. Três lições, uma história.",
    guidance: "O prisioneiro viu, voltou, e tentou mostrar a verdade.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "invitation" as PlatoPoseKey,
    guideSide: "end" as const,
    title: "Eu sou Platão.",
    lead: "Eu escrevi essa história num livro chamado A República. É um mito. Uma imagem para pensar.",
    guidance:
      "Mais à frente vocês podem conhecer outras coisas que eu escrevi. Por agora, vocês já caminharam o mito.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "periagoge-guide" as PlatoPoseKey,
    guideSide: "start" as const,
    moment: "concept" as const,
    title: "Isso tem um nome: filosofia.",
    lead: "Philosophia. Amor de saber.",
    guidance:
      "Não parar na primeira imagem. Buscar o que a sombra não mostra. Virar o olhar. E, quando der, levar isso até quem ainda olha só a parede.",
    actionLabel: "Continuar",
  },
  {
    kind: "guide-voice" as const,
    pose: "celebrate-discovery" as PlatoPoseKey,
    guideSide: "end" as const,
    title: "Buscar a verdade é o bem que essa história aponta.",
    lead: "Pode ser difícil. Alguém pode rir. Isso não manda calar.",
    guidance:
      "Aletheia é descobrir o que estava coberto. Filosofia é amar essa busca.",
    actionLabel: "Continuar",
  },
  {
    kind: "reward" as const,
    pointsLabel: "+100 pontos de descoberta",
    title: "Você conquistou O Retorno",
    badgeName: "Olhar e voltar",
    takeaways: [
      "A sombra não é a verdade inteira. É um recorte.",
      "Aletheia é a verdade que estava coberta. Filosofia é amor de saber.",
      "Voltar e tentar mostrar isso aos amigos é parte do mesmo gesto.",
    ],
    unlockedTitle: "Você terminou a trilogia da Caverna",
    unlockedBody:
      "As Sombras, A Subida e O Retorno. Platão, o mito da caverna. O caminho do saber continua. Por agora, volte ao seu caminho.",
    actionLabel: "Voltar ao meu caminho",
  },
] as const satisfies readonly ORetornoFolioBeat[];

export const O_RETORNO_FOLIO_BEATS: Record<
  ORetornoSceneId,
  readonly ORetornoFolioBeat[]
> = {
  "na-boca": NA_BOCA_BEATS,
  katabainein: KATABAINEIN_BEATS,
  "a-escuridao": A_ESCURIDAO_BEATS,
  "jogos-de-sombra": JOGOS_DE_SOMBRA_BEATS,
  "a-divida": A_DIVIDA_BEATS,
  "a-descida": A_DESCIDA_BEATS,
};
