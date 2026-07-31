import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  technicalDocuments,
  type TechnicalDocument,
} from "./technical-docs-registry";

export type TechnicalDocumentHeading = {
  id: string;
  level: 2 | 3;
  text: string;
};

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("pt-BR");
}

export function slugifyTechnicalHeading(value: string) {
  return normalizeSearchText(value)
    .replace(/[`*_~[\](){}:;,.!?/\\|"'’“”]/g, "")
    .replace(/&/g, " e ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function readTechnicalDocument(document: TechnicalDocument) {
  let absolutePath: string;

  if (document.sourcePath.startsWith("docs/")) {
    absolutePath = join(
      /*turbopackIgnore: true*/ process.cwd(),
      "docs",
      document.sourcePath.slice("docs/".length),
    );
  } else if (document.sourcePath === "CONTRIBUTING.md") {
    absolutePath = join(
      /*turbopackIgnore: true*/ process.cwd(),
      "CONTRIBUTING.md",
    );
  } else if (
    document.sourcePath === "src/domains/lesson-library/README.md"
  ) {
    absolutePath = join(
      /*turbopackIgnore: true*/ process.cwd(),
      "src",
      "domains",
      "lesson-library",
      "README.md",
    );
  } else {
    throw new Error(
      `Technical document source is outside the approved roots: ${document.sourcePath}`,
    );
  }

  return readFileSync(/*turbopackIgnore: true*/ absolutePath, "utf8")
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")
    .trim();
}

export function getTechnicalDocumentHeadings(markdown: string) {
  const seen = new Map<string, number>();

  return markdown
    .split(/\r?\n/)
    .flatMap<TechnicalDocumentHeading>((line) => {
      const match = /^(##|###)\s+(.+?)\s*$/.exec(line);
      if (!match) {
        return [];
      }

      const text = match[2].replace(/[`*_~]/g, "").trim();
      const base = slugifyTechnicalHeading(text) || "secao";
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);

      return [
        {
          id: count === 0 ? base : `${base}-${count + 1}`,
          level: match[1].length as 2 | 3,
          text,
        },
      ];
    });
}

export function searchTechnicalDocuments(query: string) {
  const normalizedQuery = normalizeSearchText(query.trim());
  if (!normalizedQuery) {
    return [];
  }

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  return technicalDocuments
    .map((document) => {
      const markdown = readTechnicalDocument(document);
      const searchable = normalizeSearchText(
        [
          document.title,
          document.description,
          document.sourcePath,
          ...document.keywords,
          markdown,
        ].join(" "),
      );
      const score = terms.reduce(
        (total, term) =>
          total +
          (normalizeSearchText(document.title).includes(term) ? 5 : 0) +
          (normalizeSearchText(document.description).includes(term) ? 3 : 0) +
          (normalizeSearchText(document.keywords.join(" ")).includes(term)
            ? 2
            : 0) +
          (searchable.includes(term) ? 1 : 0),
        0,
      );

      const firstTerm = terms[0];
      const plainMarkdown = markdown
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/[#>*_`[\]()|~-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const normalizedMarkdown = normalizeSearchText(plainMarkdown);
      const matchIndex = normalizedMarkdown.indexOf(firstTerm);
      const excerptStart = Math.max(0, matchIndex - 90);
      const excerpt = plainMarkdown
        .slice(excerptStart, excerptStart + 260)
        .trim();

      return {
        document,
        score,
        excerpt:
          excerptStart > 0
            ? `…${excerpt}${plainMarkdown.length > excerptStart + 260 ? "…" : ""}`
            : `${excerpt}${plainMarkdown.length > 260 ? "…" : ""}`,
      };
    })
    .filter(({ score }) => score >= terms.length)
    .sort((left, right) => right.score - left.score);
}
