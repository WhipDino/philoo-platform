import { describe, expect, it } from "vitest";
import {
  filterLibraryGroups,
  getLibraryStats,
  getResumeChapters,
  groupStatusLabel,
  isPlayableLibraryChapter,
  libraryGroups,
} from "./library-catalog";

describe("student library catalog", () => {
  it("counts eras, groups and named philosophers from the typed catalog", () => {
    const stats = getLibraryStats();

    expect(stats.eraCount).toBe(4);
    expect(stats.groupCount).toBe(libraryGroups.length);
    expect(stats.philosopherCount).toBeGreaterThanOrEqual(8);
    expect(stats.playableLessonCount).toBe(4);
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

  it("unlocks Tales after the Cave without making it the current module", () => {
    const tales = libraryGroups
      .find((group) => group.id === "presocratics")
      ?.chapters.find((chapter) => chapter.id === "thales");

    expect(tales?.status).toBe("available");
    expect(tales?.href).toBe("/aula/tales/ola");
  });

  it("treats Tales as playable without unlocking locked neighbors or adding a cave chapter", () => {
    const cave = libraryGroups.find((group) => group.id === "cave");
    const presocratics = libraryGroups.find((group) => group.id === "presocratics");
    const tales = presocratics?.chapters.find((chapter) => chapter.id === "thales");
    const heraclitus = presocratics?.chapters.find((chapter) => chapter.id === "heraclitus");

    expect(cave?.chapters).toHaveLength(3);
    expect(isPlayableLibraryChapter(tales!)).toBe(true);
    expect(isPlayableLibraryChapter(heraclitus!)).toBe(false);
  });
});
