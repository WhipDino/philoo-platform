import { describe, expect, it } from "vitest";
import {
  filterLibraryGroups,
  getLibraryStats,
  getResumeChapters,
  groupStatusLabel,
  libraryGroups,
} from "./library-catalog";

describe("student library catalog", () => {
  it("counts eras, groups and named philosophers from the typed catalog", () => {
    const stats = getLibraryStats();

    expect(stats.eraCount).toBe(4);
    expect(stats.groupCount).toBe(libraryGroups.length);
    expect(stats.philosopherCount).toBeGreaterThanOrEqual(8);
    expect(stats.playableLessonCount).toBe(3);
  });

  it("resumes only chapters that are actually in progress", () => {
    const resume = getResumeChapters();

    expect(resume).toHaveLength(1);
    expect(resume[0]?.title).toBe("As Sombras");
    expect(resume[0]?.progressPct).toBe(67);
  });

  it("filters by era and by philosopher name", () => {
    expect(filterLibraryGroups("", "medieval")).toEqual([]);
    expect(filterLibraryGroups("tales", "all").map((group) => group.id)).toEqual([
      "presocratics",
    ]);
    expect(filterLibraryGroups("", "ancient").some((group) => group.status === "current")).toBe(
      true,
    );
  });

  it("labels the cave group as the student's current place", () => {
    const cave = libraryGroups.find((group) => group.id === "cave");
    expect(cave).toBeDefined();
    expect(groupStatusLabel(cave!)).toBe("Você está aqui");
  });
});
