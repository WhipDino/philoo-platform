import {
  exerciseCatalog,
  type ExerciseCatalogEntry,
  type ThinkingMove,
} from "./exercise-catalog";

export type ExerciseBeat = {
  id: string;
  thinkingMove: ThinkingMove;
};

export type ExercisePick = {
  beatId: string;
  exerciseId: string;
  score: number;
};

export type ExerciseSelectionResult =
  | {
      ok: true;
      picks: readonly ExercisePick[];
      trimRequired: boolean;
    }
  | {
      ok: false;
      beatId: string;
      thinkingMove: ThinkingMove;
      reason: string;
    };

const TARGET_COUNT = 3;

function scoreEngine(
  engine: ExerciseCatalogEntry,
  recentExerciseIds: readonly string[],
  alreadyPicked: ReadonlySet<string>,
) {
  if (alreadyPicked.has(engine.id)) {
    return -1000;
  }

  const recentUses = recentExerciseIds.filter((id) => id === engine.id).length;
  let score = 10;
  score -= recentUses * 3;
  if (recentUses === 0) {
    score += 2;
  }
  if (engine.status === "foundation") {
    score += 2;
  } else if (engine.status === "candidate") {
    score += 1;
  }
  if (engine.reuseScope === "any-lesson") {
    score += 1;
  }
  if (engine.reuseScope === "when-move-fits") {
    score -= 1;
  }
  return score;
}

export function selectExercisesForChapter({
  beats,
  recentExerciseIds = [],
  catalog = exerciseCatalog,
  targetCount = TARGET_COUNT,
}: {
  beats: readonly ExerciseBeat[];
  recentExerciseIds?: readonly string[];
  catalog?: readonly ExerciseCatalogEntry[];
  targetCount?: number;
}): ExerciseSelectionResult {
  const picks: ExercisePick[] = [];
  const alreadyPicked = new Set<string>();

  for (const beat of beats) {
    const candidates = catalog.filter(
      (engine) =>
        engine.thinkingMove === beat.thinkingMove &&
        engine.reuseScope !== "avoid-by-default" &&
        engine.publicExport,
    );

    if (candidates.length === 0) {
      return {
        ok: false,
        beatId: beat.id,
        thinkingMove: beat.thinkingMove,
        reason:
          "Nenhum motor publicado casa com este gesto. Não invente um exercício novo e não escolha outro EX só para variar.",
      };
    }

    const ranked = [...candidates].sort(
      (left, right) =>
        scoreEngine(right, recentExerciseIds, alreadyPicked) -
        scoreEngine(left, recentExerciseIds, alreadyPicked),
    );
    const winner = ranked[0];
    const score = scoreEngine(winner, recentExerciseIds, alreadyPicked);

    if (score < 0) {
      return {
        ok: false,
        beatId: beat.id,
        thinkingMove: beat.thinkingMove,
        reason:
          "O gesto casou, mas o motor já foi usado nesta aula. Junte os beats ou corte um exercício.",
      };
    }

    picks.push({ beatId: beat.id, exerciseId: winner.id, score });
    alreadyPicked.add(winner.id);
  }

  return {
    ok: true,
    picks,
    trimRequired: picks.length > targetCount,
  };
}
