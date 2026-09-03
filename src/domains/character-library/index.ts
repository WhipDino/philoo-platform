import { PLATO_POSES, getPlatoPose, type PlatoPoseKey } from "@/domains/lessons/plato-pose-catalog";

export type CharacterPose = {
  id: string;
  src: string;
  alt: string;
  whenToUse: string;
};

export type CharacterRecord = {
  id: string;
  displayName: string;
  identityAnchorSrc: string;
  chromaKey: "#00FF00";
  poses: Readonly<Record<string, CharacterPose>>;
};

function platoPoses(): Record<string, CharacterPose> {
  return Object.fromEntries(
    (Object.keys(PLATO_POSES) as PlatoPoseKey[]).map((id) => {
      const pose = getPlatoPose(id);
      return [
        id,
        {
          id,
          src: pose.src,
          alt: pose.alt,
          whenToUse: pose.alt,
        },
      ];
    }),
  );
}

const THALES_POSE_DIR = "/images/story/tales";

const thalesPoses = {
  "identity-anchor": {
    id: "identity-anchor",
    src: `${THALES_POSE_DIR}/thales-identity-anchor-v1.png`,
    alt: "Tales de frente, mãos abertas na altura do peito, como quem se apresenta",
    whenToUse: "Apresentação inicial (beat 1.1): Olá, eu sou Tales.",
  },
  "point-harbor": {
    id: "point-harbor",
    src: `${THALES_POSE_DIR}/thales-point-harbor-v1.png`,
    alt: "Tales virado, uma mão indicando o porto de onde ele veio",
    whenToUse: "Lembra Mileto antes do quadro (beat 1.2).",
  },
  "present-panel": {
    id: "present-panel",
    src: `${THALES_POSE_DIR}/thales-present-panel-v1.png`,
    alt: "Tales à esquerda, mão aberta apresentando o quadro ao lado",
    whenToUse:
      "Story-panel à direita: porto (2.1), terra sobre água (3.3), mesa agora (4.3).",
  },
  "open-hands-variety": {
    id: "open-hands-variety",
    src: `${THALES_POSE_DIR}/thales-open-hands-variety-v1.png`,
    alt: "Tales com as duas palmas abertas, mostrando que as coisas parecem muitas",
    whenToUse:
      "Muitas caras no cais (2.2); o talvez do porquê (3.4); variedade vs um princípio (4.2).",
  },
  "hold-question": {
    id: "hold-question",
    src: `${THALES_POSE_DIR}/thales-hold-question-v1.png`,
    alt: "Tales com uma mão à frente, como quem segura uma pergunta no ar",
    whenToUse:
      "Pergunta pelo fundo comum (3.1); voz dos exercícios 5.1 a 6.1.",
  },
  "water-answer": {
    id: "water-answer",
    src: `${THALES_POSE_DIR}/thales-water-answer-v1.png`,
    alt: "Tales com uma mão em copo vazio e a outra aberta para o aluno",
    whenToUse: "Tese da água como origem (3.2); briefing do exercício 5.2.",
  },
  "present-word": {
    id: "present-word",
    src: `${THALES_POSE_DIR}/thales-present-word-v1.png`,
    alt: "Tales apresenta a palavra arché no ar, na altura do peito",
    whenToUse: "Momento da palavra arché (4.1).",
  },
  "hook-open": {
    id: "hook-open",
    src: `${THALES_POSE_DIR}/thales-hook-open-v1.png`,
    alt: "Tales com o olhar um pouco baixo e uma mão ainda aberta, sem fechar a conta",
    whenToUse:
      "Gancho final: um fundo, muitos que nascem e morrem (6.2).",
  },
} as const satisfies Record<string, CharacterPose>;

export const characterLibrary = {
  plato: {
    id: "plato",
    displayName: "Platão",
    identityAnchorSrc: getPlatoPose("invitation").src,
    chromaKey: "#00FF00",
    poses: platoPoses(),
  },
  thales: {
    id: "thales",
    displayName: "Tales",
    identityAnchorSrc: thalesPoses["identity-anchor"].src,
    chromaKey: "#00FF00",
    poses: thalesPoses,
  },
} as const satisfies Record<string, CharacterRecord>;

export type CharacterId = keyof typeof characterLibrary;

export function getCharacter(id: CharacterId) {
  return characterLibrary[id];
}

export function getCharacterPose(id: CharacterId, poseId: string) {
  const pose = characterLibrary[id].poses[poseId];
  if (!pose) {
    throw new Error(`Pose "${poseId}" não está no catálogo de ${id}.`);
  }
  return pose;
}
