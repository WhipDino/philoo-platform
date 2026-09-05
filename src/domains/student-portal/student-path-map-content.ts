import type { CharacterId } from "@/domains/character-library";
import {
  cavePathCatalog,
  previewStudentProgress,
} from "./student-path-content";
import { buildPathLessons } from "./student-path-model";

export type MapCheckpointStatus = "completed" | "current" | "available" | "locked";

export type TrailAvailability = "active" | "available" | "coming" | "locked";

export type PathMapCheckpoint = {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  guide: string;
  summary: string;
  href?: string;
  status: MapCheckpointStatus;
  progressPct: number;
  characterId: CharacterId;
  coinPoseId: string;
  sceneImage: string;
  sceneAlt: string;
  parts: number;
  encounterN: number;
  briefing: {
    trailLabel: string;
    encounterLabel: string;
    title: string;
    question: string;
    portrait: string;
    portraitAlt: string;
    history: string;
    investigation: string;
    startHref: string;
    startLabel: string;
  };
};

export type PathMapTrail = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  eraLabel: string;
  blurb: string;
  coverImage: string;
  coverAlt: string;
  heroImage: string;
  heroAlt: string;
  status: TrailAvailability;
  progressPct: number;
  statusTag?: string;
  checkpoints: readonly PathMapCheckpoint[];
};

const caveImages = Object.fromEntries(
  cavePathCatalog.map((lesson) => [lesson.id, { src: lesson.image, alt: lesson.imageAlt }]),
) as Record<string, { src: string; alt: string }>;

function mapLessonStatus(
  lessonId: string,
  progress = previewStudentProgress,
): MapCheckpointStatus {
  const built = buildPathLessons(cavePathCatalog, progress);
  const lesson = built.find((item) => item.id === lessonId);
  if (!lesson) {
    return "locked";
  }
  if (lesson.status === "concluido") {
    return "completed";
  }
  if (lesson.status === "atual") {
    return "current";
  }
  if (lesson.status === "liberado") {
    return "available";
  }
  return "locked";
}

const folioStageCount = 6;

function lockedPresocraticCheckpoint(input: {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  summary: string;
  encounterN: number;
  briefingTitle: string;
  question: string;
}): PathMapCheckpoint {
  return {
    id: input.id,
    title: input.title,
    subtitle: input.subtitle,
    location: input.location,
    guide: "Em breve",
    summary: input.summary,
    status: "locked",
    progressPct: 0,
    characterId: "plato",
    coinPoseId: "first-question",
    sceneImage: "/images/story/plato-v2/plato-first-question-v2.png",
    sceneAlt: `Placeholder para ${input.title}`,
    parts: folioStageCount,
    encounterN: input.encounterN,
    briefing: {
      trailLabel: "Os Primeiros Pensadores",
      encounterLabel: `Encontro ${String(input.encounterN).padStart(2, "0")}`,
      title: input.briefingTitle,
      question: input.question,
      portrait: "/images/story/plato-v2/plato-first-question-v2.png",
      portraitAlt: "Placeholder",
      history: "Este capítulo Folio ainda está em preparação.",
      investigation: "Volte quando a trilha abrir este encontro.",
      startHref: "/inicio?view=path-map",
      startLabel: "Voltar ao mapa",
    },
  };
}

export const pathMapTrails: readonly PathMapTrail[] = [
  {
    id: "saindo-da-caverna",
    number: 1,
    title: "Saindo da Caverna",
    subtitle: "1 jornada · 3 capítulos",
    eraLabel: "Trilha 01 · Filosofia antiga",
    blurb:
      "Platão te leva da parede de sombras à luz lá fora — e de volta para quem ficou.",
    coverImage: "/images/portal/plato-cave-active-lesson-v1.png",
    coverAlt: "Platão na entrada da caverna",
    heroImage: "/images/story/cave-wall-observers-v5.png",
    heroAlt: "Prisioneiros diante da parede de sombras",
    status: "active",
    progressPct: previewStudentProgress.currentProgressPct,
    checkpoints: [
      {
        id: "as-sombras",
        title: "As Sombras",
        subtitle: "O jogo da parede",
        location: "A caverna",
        guide: "com Platão",
        summary: cavePathCatalog[0].summary,
        href: "/aula/as-sombras/doxa",
        status: mapLessonStatus("as-sombras"),
        progressPct: previewStudentProgress.currentProgressPct,
        characterId: "plato",
        coinPoseId: "invitation",
        sceneImage: caveImages["as-sombras"].src,
        sceneAlt: caveImages["as-sombras"].alt,
        parts: 9,
        encounterN: 1,
        briefing: {
          trailLabel: "Saindo da Caverna",
          encounterLabel: "Capítulo 01",
          title: "As Sombras",
          question: "O que a parede mostra — e o que fica escondido?",
          portrait: "/images/story/plato-v2/plato-first-wall-reveal-v2.png",
          portraitAlt: "Platão apresenta a parede iluminada",
          history:
            "Platão te coloca diante de prisioneiros que só conhecem sombras. A lição mostra como nomes nascem, o que existe atrás da imagem, e por que a primeira desconfiança importa.",
          investigation:
            "Sua investigação: separar o que é aparência na parede do que pode existir atrás dela — e guardar a palavra dóxa no caderno.",
          startHref: "/aula/as-sombras/doxa",
          startLabel: "Continuar lição",
        },
      },
      {
        id: "a-subida",
        title: "A Subida",
        subtitle: "Periagōgē — virar o corpo",
        location: "Fora da caverna",
        guide: "com Platão",
        summary: cavePathCatalog[1].summary,
        href: "/aula/a-subida/depois-da-virada",
        status: mapLessonStatus("a-subida"),
        progressPct: 0,
        characterId: "plato",
        coinPoseId: "invitation",
        sceneImage: caveImages["a-subida"].src,
        sceneAlt: caveImages["a-subida"].alt,
        parts: 9,
        encounterN: 2,
        briefing: {
          trailLabel: "Saindo da Caverna",
          encounterLabel: "Capítulo 02",
          title: "A Subida",
          question: "O que muda quando alguém vira o pescoço?",
          portrait: "/images/story/a-subida/plato-periagoge-guide-v1.png",
          portraitAlt: "Platão guia a subida rumo à luz",
          history:
            "Quem desconfia da parede descobre fogo, objetos e luz. A vista adapta devagar — e sobra a decisão de voltar para contar o que viu.",
          investigation:
            "Sua investigação: acompanhar o gesto de periagōgē — virar o corpo e o olhar — sem tratar a dor da luz como prova de que a caverna era o mundo inteiro.",
          startHref: "/aula/a-subida/depois-da-virada",
          startLabel: "Iniciar",
        },
      },
      {
        id: "o-retorno",
        title: "O Retorno",
        subtitle: "Voltar sem humilhar",
        location: "De volta à caverna",
        guide: "com Platão",
        summary: cavePathCatalog[2].summary,
        href: "/aula/o-retorno/na-boca",
        status: mapLessonStatus("o-retorno"),
        progressPct: 0,
        characterId: "plato",
        coinPoseId: "invitation",
        sceneImage: caveImages["o-retorno"].src,
        sceneAlt: caveImages["o-retorno"].alt,
        parts: 6,
        encounterN: 3,
        briefing: {
          trailLabel: "Saindo da Caverna",
          encounterLabel: "Capítulo 03",
          title: "O Retorno",
          question: "Como falar com quem ainda confia na parede?",
          portrait: "/images/story/o-retorno/plato-speaking-gesture-v1.png",
          portraitAlt: "Platão gesticula ao voltar para a caverna",
          history:
            "Voltar custa: os olhos escurecem de novo, o jogo de sombras virou estranho, vem ridículo. Mesmo assim, contar o que viu faz parte do gesto — e fecha o mito com o amor de saber.",
          investigation:
            "Sua investigação: tentar conversar com quem ficou sem tratar essa pessoa como inimiga — e separar o que você viu do que consegue mostrar.",
          startHref: "/aula/o-retorno/na-boca",
          startLabel: "Iniciar",
        },
      },
    ],
  },
  {
    id: "primeiros-pensadores",
    number: 2,
    title: "Os Primeiros Pensadores",
    subtitle: "1 jornada · 10 capítulos Folio",
    eraLabel: "Trilha 02 · Filosofia antiga",
    blurb:
      "De Mileto a Abdera: dez filósofos, dez capítulos completos — cada um com sua pergunta, sua palavra e seu exercício.",
    coverImage: "/images/story/heraclitus/beat-02-efeso-panorama-v1.png",
    coverAlt: "Panorama de uma cidade grega antiga",
    heroImage: "/images/story/heraclitus/beat-02-efeso-panorama-v1.png",
    heroAlt: "Éfeso e o horizonte do mundo antigo",
    status: "available",
    progressPct: 0,
    checkpoints: [
      {
        id: "tales",
        title: "Tales de Mileto",
        subtitle: "A hipótese da água",
        location: "Mileto",
        guide: "Tales de Mileto",
        summary:
          "No porto de Mileto, Tales pergunta pelo fundo comum por trás de ondas, seiva e chuva.",
        href: "/aula/tales/ola",
        status: "available",
        progressPct: 0,
        characterId: "thales",
        coinPoseId: "identity-anchor",
        sceneImage: "/images/story/tales/beat-02-porto-mileto-v1.png",
        sceneAlt: "Porto de Mileto ao entardecer",
        parts: folioStageCount,
        encounterN: 1,
        briefing: {
          trailLabel: "Os Primeiros Pensadores",
          encounterLabel: "Encontro 01",
          title: "A hipótese da água",
          question: "Do que o mundo é feito?",
          portrait: "/images/story/tales/thales-point-harbor-v1.png",
          portraitAlt: "Tales aponta para o porto de Mileto",
          history:
            "Tales vive no porto de Mileto, onde navios, peixes, seiva e chuva parecem caras diferentes. Ele pergunta se há um fundo comum — e responde com água, não como “tudo molhado agora”, mas como origem e sustento.",
          investigation:
            "Sua investigação: separar aparência, pergunta e resposta — e guardar a palavra arché como nome do gesto de buscar o princípio.",
          startHref: "/aula/tales/ola",
          startLabel: "Iniciar",
        },
      },
      lockedPresocraticCheckpoint({
        id: "anaximander",
        title: "Anaximandro",
        subtitle: "O ápeiron",
        location: "Mileto",
        summary: "O ilimitado como princípio — além de água e ar.",
        encounterN: 2,
        briefingTitle: "O ápeiron",
        question: "E se o princípio não tiver forma?",
      }),
      lockedPresocraticCheckpoint({
        id: "anaximenes",
        title: "Anaxímenes",
        subtitle: "O ar",
        location: "Mileto",
        summary: "Condensação e rarefação: o ar vira fogo, água, terra.",
        encounterN: 3,
        briefingTitle: "O ar",
        question: "Como uma só coisa vira muitas?",
      }),
      lockedPresocraticCheckpoint({
        id: "pythagoras",
        title: "Pitágoras",
        subtitle: "Harmonia e números",
        location: "Samos e Crotona",
        summary: "Ordem escondida nos números e na música.",
        encounterN: 4,
        briefingTitle: "Harmonia e números",
        question: "O mundo obedece a uma conta?",
      }),
      {
        id: "heraclitus",
        title: "Heráclito",
        subtitle: "Panta rhei",
        location: "Éfeso",
        guide: "Heráclito de Éfeso",
        summary:
          "Éfeso e o rio: entram no mesmo rio, mas as águas são outras — panta rhei.",
        href: "/aula/heraclitus/ola",
        status: "available",
        progressPct: 0,
        characterId: "heraclitus",
        coinPoseId: "identity-anchor",
        sceneImage: "/images/story/heraclitus/beat-03-rio-fluxo-v1.png",
        sceneAlt: "Rio em fluxo sob a luz de Éfeso",
        parts: folioStageCount,
        encounterN: 5,
        briefing: {
          trailLabel: "Os Primeiros Pensadores",
          encounterLabel: "Encontro 05",
          title: "O rio que não para",
          question: "Se tudo flui, o que fica de verdade?",
          portrait: "/images/story/heraclitus/heraclitus-point-river-v1.png",
          portraitAlt: "Heráclito aponta para o rio",
          history:
            "Heráclito fala de Éfeso e do rio: dizemos “o mesmo rio”, mas as águas são outras. A lição nomeia panta rhei — tudo flui — e deixa aberta a pergunta do que permanece.",
          investigation:
            "Sua investigação: observar movimento escondido no cotidiano e separar o que muda do que ainda permite dizer “o mesmo”.",
          startHref: "/aula/heraclitus/ola",
          startLabel: "Iniciar",
        },
      },
      lockedPresocraticCheckpoint({
        id: "parmenides",
        title: "Parmênides",
        subtitle: "O que permanece",
        location: "Eleia",
        summary: "O Ser é — a mudança aparente entra em crise.",
        encounterN: 6,
        briefingTitle: "O que permanece",
        question: "Dá para confiar no que muda?",
      }),
      lockedPresocraticCheckpoint({
        id: "zeno",
        title: "Zenão",
        subtitle: "Os paradoxos",
        location: "Eleia",
        summary: "Argumentos que desafiam o movimento comum.",
        encounterN: 7,
        briefingTitle: "Os paradoxos do movimento",
        question: "Como Aquiles alcança a tartaruga?",
      }),
      lockedPresocraticCheckpoint({
        id: "empedocles",
        title: "Empédocles",
        subtitle: "Quatro raízes",
        location: "Akragas",
        summary: "Terra, água, ar e fogo — Amor e Ódio misturam e separam.",
        encounterN: 8,
        briefingTitle: "Quatro raízes",
        question: "Por que o mundo parece muitas coisas?",
      }),
      lockedPresocraticCheckpoint({
        id: "anaxagoras",
        title: "Anaxágoras",
        subtitle: "O noûs",
        location: "Clazômenas e Atenas",
        summary: "Uma mente que ordena a matéria infinitamente dividida.",
        encounterN: 9,
        briefingTitle: "O noûs",
        question: "Quem pôs ordem no caos?",
      }),
      lockedPresocraticCheckpoint({
        id: "democritus",
        title: "Demócrito",
        subtitle: "Átomos e vazio",
        location: "Abdera",
        summary: "Partes indivisíveis no vazio explicam mudança e variedade.",
        encounterN: 10,
        briefingTitle: "Átomos e vazio",
        question: "O invisível também explica o mundo?",
      }),
    ],
  },
  {
    id: "estoicos",
    number: 3,
    title: "Os Estoicos",
    subtitle: "7 encontros · trilha em preparação",
    eraLabel: "Trilha 03 · Helenismo",
    blurb: "Viver com o que não controlamos — trilha ainda fechada neste protótipo.",
    coverImage: "/images/story/plato-v2/plato-teaching-seated-v1.png",
    coverAlt: "Placeholder para trilha dos estoicos",
    heroImage: "/images/story/plato-v2/plato-teaching-seated-v1.png",
    heroAlt: "Placeholder para trilha dos estoicos",
    status: "coming",
    progressPct: 0,
    statusTag: "Em preparação",
    checkpoints: [],
  },
] as const;

export function getPathMapTrail(trailId: string): PathMapTrail | undefined {
  return pathMapTrails.find((trail) => trail.id === trailId);
}

export function getPathMapCheckpoint(trailId: string, checkpointId: string) {
  const trail = getPathMapTrail(trailId);
  return trail?.checkpoints.find((checkpoint) => checkpoint.id === checkpointId);
}

export function getPathMapMeta() {
  const checkpoints = pathMapTrails.flatMap((trail) => trail.checkpoints);
  const unlocked = checkpoints.filter((checkpoint) => checkpoint.status !== "locked").length;
  const current = checkpoints.find((checkpoint) => checkpoint.status === "current");
  return {
    total: checkpoints.length,
    unlocked,
    currentTitle: current?.title ?? null,
  };
}
