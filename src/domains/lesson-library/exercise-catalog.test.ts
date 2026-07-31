import { describe, expect, it } from "vitest";
import {
  exerciseCatalog,
  libraryViewportChecks,
} from "./exercise-catalog";

describe("exercise catalog contract", () => {
  it("keeps stable and unique exercise identities", () => {
    const ids = exerciseCatalog.map((exercise) => exercise.id);
    const routes = exerciseCatalog.map((exercise) => exercise.sourceRoute);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(routes).size).toBe(routes.length);
    expect(ids).toEqual(["EX-01", "EX-02", "EX-03", "EX-04", "EX-05"]);
  });

  it("requires author, library, responsive, and dependency documentation", () => {
    for (const exercise of exerciseCatalog) {
      expect(exercise.authorFields.length).toBeGreaterThan(0);
      expect(exercise.protectedBehavior.length).toBeGreaterThan(0);
      expect(exercise.dependencies.length).toBeGreaterThan(0);
      expect(exercise.responsiveContract.desktop).toBeTruthy();
      expect(exercise.responsiveContract.tablet).toBeTruthy();
      expect(exercise.responsiveContract.phone).toBeTruthy();
    }

    expect(libraryViewportChecks).toHaveLength(5);
  });
});
