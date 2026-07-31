import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TechnicalGuidePage, {
  generateMetadata,
  generateStaticParams,
} from "./page";

describe("TechnicalGuidePage", () => {
  it("renders the complete repository guide inside the documentation shell", async () => {
    render(
      await TechnicalGuidePage({
        params: Promise.resolve({ slug: "criar-uma-aula" }),
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Criar uma aula Philoo", level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "1. Define the learning contract",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Abrir fonte no GitHub" }),
    ).toHaveAttribute(
      "href",
      expect.stringContaining("docs/playbooks/CREATE_A_LESSON.md"),
    );
    expect(
      screen.getAllByRole("searchbox", {
        name: "Pesquisar na documentação",
      }).length,
    ).toBeGreaterThan(0);
  });

  it("prebuilds every registered guide with private metadata", async () => {
    expect(generateStaticParams().length).toBeGreaterThanOrEqual(15);
    expect(
      await generateMetadata({
        params: Promise.resolve({ slug: "qualidade" }),
      }),
    ).toMatchObject({
      title: "Portões de qualidade",
      robots: { index: false, follow: false },
    });
  });
});
