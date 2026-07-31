import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  contextFreeAiChecklist,
  documentationLayers,
  lessonCreationSteps,
  sourceMap,
  technicalDocuments,
  technicalDocumentSections,
  technicalTasks,
} from "./technical-docs-registry";

describe("technical docs registry", () => {
  it("routes every contributor task to a primary repository document", () => {
    expect(technicalTasks).toHaveLength(6);
    expect(new Set(technicalTasks.map((task) => task.id)).size).toBe(
      technicalTasks.length,
    );

    for (const task of technicalTasks) {
      expect(task.primaryDocument).toMatch(/^(docs|CONTRIBUTING|src)/);
      expect(task.outcome.length).toBeGreaterThan(20);
    }
  });

  it("keeps onboarding, lesson creation, source mapping and AI rules visible", () => {
    expect(documentationLayers).toHaveLength(5);
    expect(lessonCreationSteps).toHaveLength(6);
    expect(sourceMap.some(([label]) => label === "API pública")).toBe(true);
    expect(
      contextFreeAiChecklist.some((rule) => rule.includes("AGENTS.md")),
    ).toBe(true);
  });

  it("does not route a contributor to a missing repository file", () => {
    const taskPaths = technicalTasks.flatMap((task) => [
      task.primaryDocument,
      ...task.supportingDocuments,
    ]);
    const mappedPaths = sourceMap.map(([, path]) => path);

    for (const path of new Set([...taskPaths, ...mappedPaths])) {
      expect(existsSync(resolve(process.cwd(), path)), path).toBe(true);
    }
  });

  it("publishes every curated guide from a real repository source", () => {
    expect(technicalDocumentSections).toHaveLength(6);
    expect(technicalDocuments.length).toBeGreaterThanOrEqual(15);
    expect(new Set(technicalDocuments.map((document) => document.slug)).size).toBe(
      technicalDocuments.length,
    );
    expect(
      new Set(technicalDocuments.map((document) => document.sourcePath)).size,
    ).toBe(technicalDocuments.length);

    for (const document of technicalDocuments) {
      expect(existsSync(resolve(process.cwd(), document.sourcePath))).toBe(true);
      expect(document.description.length).toBeGreaterThan(35);
      expect(document.keywords.length).toBeGreaterThanOrEqual(4);
    }
  });
});
