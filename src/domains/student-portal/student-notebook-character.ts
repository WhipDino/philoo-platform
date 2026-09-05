import type { CharacterId } from "@/domains/character-library";
import type { PortalLessonNotebook } from "./student-notebook-content";

export type NotebookCharacterConfig = {
  characterId: CharacterId;
  speaker: string;
  cardPoseId: string;
  conceptPoseId: string;
  sectionPoseId: string;
  notesPoseId: string;
};

export type NotebookFolioPageKind = "concept" | "section" | "notes";

export type NotebookFolioPage = {
  id: string;
  kind: NotebookFolioPageKind;
  poseId: string;
  tone: "dialogue" | "concept";
  title?: string;
  lead?: string;
  greek?: string;
  bullets?: readonly string[];
};

const notebookCharacters = {
  "as-sombras": {
    characterId: "plato",
    speaker: "Platão",
    cardPoseId: "first-wall-reveal",
    conceptPoseId: "first-question",
    sectionPoseId: "observe-with-them",
    notesPoseId: "review-evidence",
  },
  "a-subida": {
    characterId: "plato",
    speaker: "Platão",
    cardPoseId: "descent",
    conceptPoseId: "celebrate-discovery",
    sectionPoseId: "teaching-pointer",
    notesPoseId: "revision-change",
  },
  "o-retorno": {
    characterId: "plato",
    speaker: "Platão",
    cardPoseId: "teaching-pointer",
    conceptPoseId: "review-argument",
    sectionPoseId: "prisoners-empathy",
    notesPoseId: "revision-maintain",
  },
  tales: {
    characterId: "thales",
    speaker: "Tales",
    cardPoseId: "identity-anchor",
    conceptPoseId: "present-word",
    sectionPoseId: "open-hands-variety",
    notesPoseId: "hold-question",
  },
  heraclitus: {
    characterId: "heraclitus",
    speaker: "Heráclito",
    cardPoseId: "identity-anchor",
    conceptPoseId: "present-word",
    sectionPoseId: "open-hands-flow",
    notesPoseId: "hold-paradox",
  },
} as const satisfies Record<string, NotebookCharacterConfig>;

export function getNotebookCharacter(notebookId: string): NotebookCharacterConfig {
  const config = notebookCharacters[notebookId as keyof typeof notebookCharacters];
  if (!config) {
    throw new Error(`Caderno "${notebookId}" não tem personagem configurado.`);
  }
  return config;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildNotebookFolioPages(
  notebook: PortalLessonNotebook,
): readonly NotebookFolioPage[] {
  const character = getNotebookCharacter(notebook.id);

  const pages: NotebookFolioPage[] = [
    {
      id: `${notebook.id}-concept`,
      kind: "concept",
      poseId: character.conceptPoseId,
      tone: "concept",
      title: notebook.keyConcept.word,
      greek: notebook.keyConcept.greek,
      lead: notebook.keyConcept.definition,
      bullets: [notebook.summary],
    },
  ];

  for (const section of notebook.sections) {
    pages.push({
      id: `${notebook.id}-${slugify(section.heading)}`,
      kind: "section",
      poseId: character.sectionPoseId,
      tone: "dialogue",
      title: section.heading,
      bullets: section.points,
    });
  }

  pages.push({
    id: `${notebook.id}-notes`,
    kind: "notes",
    poseId: character.notesPoseId,
    tone: "dialogue",
    title: "Suas anotações",
    lead: "Escreva um exemplo seu, uma dúvida ou o que você quer lembrar na prova.",
  });

  return pages;
}
