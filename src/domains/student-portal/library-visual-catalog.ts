import {
  isPlayableLibraryChapter,
  libraryGroups,
  type LibraryChapter,
  type LibraryGroup,
} from "@/domains/curriculum-catalog/library-catalog";
import { getTrailIdForLibraryGroup } from "./library-trail-bridge";
import { pathMapTrails } from "./student-path-map-content";

export type LibraryGroupVisual = {
  coverSrc: string;
  coverAlt: string;
  accent: string;
  tagline: string;
};

export type PlayableChapterCard = LibraryChapter & {
  groupId: string;
  groupTitle: string;
  eraId: LibraryGroup["eraId"];
  coverSrc: string;
  coverAlt: string;
};

const GROUP_FALLBACKS: Record<string, LibraryGroupVisual> = {
  cave: {
    coverSrc: "/images/portal/plato-cave-active-lesson-v1.png",
    coverAlt: "Platão na entrada da caverna",
    accent: "#5bb8f5",
    tagline: "Sombras, subida e retorno com Platão",
  },
  presocratics: {
    coverSrc: "/images/portal/path-map/presocratics-trail-banner-v1.png",
    coverAlt: "Tales, Heráclito e Parmênides",
    accent: "#f0a03a",
    tagline: "Dez encontros com os primeiros pensadores",
  },
  "sophists-socrates": {
    coverSrc: "/images/story/plato-v2/plato-teaching-seated-v1.png",
    coverAlt: "Placeholder — sofistas e Sócrates",
    accent: "#8b7cf6",
    tagline: "A conversa vira método",
  },
  "plato-aristotle": {
    coverSrc: "/images/story/plato-v2/plato-first-question-v2.png",
    coverAlt: "Placeholder — Platão e Aristóteles",
    accent: "#4ecdc4",
    tagline: "Escolas, ideias e o mundo sensível",
  },
  hellenism: {
    coverSrc: "/images/story/plato-v2/plato-teaching-seated-v1.png",
    coverAlt: "Placeholder — helenismo",
    accent: "#94a8b4",
    tagline: "Como viver quando o mundo muda",
  },
};

const CHAPTER_FALLBACKS: Record<string, { coverSrc: string; coverAlt: string }> = {
  "as-sombras": {
    coverSrc: "/images/story/cave-wall-observers-v5.png",
    coverAlt: "Prisioneiros diante da parede de sombras",
  },
  "a-subida": {
    coverSrc: "/images/story/a-subida/plato-periagoge-guide-v1.png",
    coverAlt: "Platão guia a subida",
  },
  "o-retorno": {
    coverSrc: "/images/story/cave-wall-observers-v5.png",
    coverAlt: "De volta à caverna",
  },
  thales: {
    coverSrc: "/images/story/tales/beat-02-porto-mileto-v1.png",
    coverAlt: "Porto de Mileto",
  },
  heraclitus: {
    coverSrc: "/images/story/heraclitus/beat-02-efeso-panorama-v1.png",
    coverAlt: "Éfeso e o horizonte",
  },
};

function trailForGroup(groupId: string) {
  const trailId = getTrailIdForLibraryGroup(groupId);
  if (!trailId) {
    return undefined;
  }
  return pathMapTrails.find((trail) => trail.id === trailId);
}

export function getLibraryGroupVisual(groupId: string): LibraryGroupVisual {
  const trail = trailForGroup(groupId);
  const fallback = GROUP_FALLBACKS[groupId];
  if (trail) {
    return {
      coverSrc: trail.bannerImage ?? trail.coverImage,
      coverAlt: trail.bannerAlt ?? trail.coverAlt,
      accent: fallback?.accent ?? "#5bb8f5",
      tagline: trail.blurb.slice(0, 72) + (trail.blurb.length > 72 ? "…" : ""),
    };
  }
  return (
    fallback ?? {
      coverSrc: "/images/story/plato-v2/plato-first-question-v2.png",
      coverAlt: "Ilustração Philoo",
      accent: "#5bb8f5",
      tagline: "Em breve no acervo",
    }
  );
}

export function getChapterVisual(chapterId: string, groupId: string) {
  const trail = trailForGroup(groupId);
  const checkpoint = trail?.checkpoints.find((item) => item.id === chapterId);
  if (checkpoint) {
    return {
      coverSrc: checkpoint.sceneImage,
      coverAlt: checkpoint.sceneAlt,
    };
  }
  return (
    CHAPTER_FALLBACKS[chapterId] ?? {
      coverSrc: "/images/story/plato-v2/plato-first-question-v2.png",
      coverAlt: "Capítulo Philoo",
    }
  );
}

export function listPlayableChapterCards(
  groups: readonly LibraryGroup[] = libraryGroups,
): readonly PlayableChapterCard[] {
  return groups.flatMap((group) =>
    group.chapters
      .filter(isPlayableLibraryChapter)
      .map((chapter) => {
        const visual = getChapterVisual(chapter.id, group.id);
        return {
          ...chapter,
          groupId: group.id,
          groupTitle: group.title,
          eraId: group.eraId,
          coverSrc: visual.coverSrc,
          coverAlt: visual.coverAlt,
        };
      }),
  );
}
