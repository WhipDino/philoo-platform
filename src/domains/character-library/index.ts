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

export const characterLibrary = {
  plato: {
    id: "plato",
    displayName: "Platão",
    identityAnchorSrc: getPlatoPose("invitation").src,
    chromaKey: "#00FF00",
    poses: platoPoses(),
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
