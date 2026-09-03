import { describe, expect, it } from "vitest";
import { selectExercisesForChapter } from "./select-exercises";

describe("selectExercisesForChapter", () => {
  it("picks by thinking move first, then avoids repeating the same engine from recent chapters", () => {
    const result = selectExercisesForChapter({
      beats: [
        { id: "classify", thinkingMove: "classify" },
        { id: "models", thinkingMove: "compare-models" },
        { id: "pairs", thinkingMove: "pair-connect" },
      ],
      recentExerciseIds: ["EX-05", "EX-05", "EX-06"],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.picks.map((pick) => pick.exerciseId)).toEqual([
      "EX-05",
      "EX-06",
      "EX-09",
    ]);
    expect(result.trimRequired).toBe(false);
  });

  it("never substitutes a starved engine for the wrong thinking move", () => {
    const result = selectExercisesForChapter({
      beats: [{ id: "only-classify", thinkingMove: "classify" }],
      recentExerciseIds: ["EX-05", "EX-05", "EX-05"],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.picks[0]?.exerciseId).toBe("EX-05");
  });

  it("asks the designer to trim when a chapter wants more than three exercises", () => {
    const result = selectExercisesForChapter({
      beats: [
        { id: "a", thinkingMove: "classify" },
        { id: "b", thinkingMove: "compare-models" },
        { id: "c", thinkingMove: "pair-connect" },
        { id: "d", thinkingMove: "order-cause" },
      ],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.trimRequired).toBe(true);
  });

  it("stops when the catalog has no published engine for that move", () => {
    const result = selectExercisesForChapter({
      beats: [{ id: "horizon", thinkingMove: "evidence-horizon" }],
    });

    expect(result.ok).toBe(false);
  });
});
