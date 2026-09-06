import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StudentLibraryView } from "./student-library-view";

afterEach(cleanup);

describe("StudentLibraryView", () => {
  it("shows visual shelves with playable lessons and module posters", () => {
    render(
      <StudentLibraryView searchQuery="" moduleId={null} onModuleChange={vi.fn()} />,
    );

    expect(screen.getByRole("heading", { name: /^biblioteca$/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /retomar/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /abrir agora/i })).toBeInTheDocument();
    expect(screen.getByText("Você está aqui")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /abrir mapa de a caverna de platão/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /tales e a arché/i })).toHaveAttribute(
      "href",
      "/aula/tales/ola",
    );
    expect(screen.getByRole("link", { name: /heráclito e a mudança/i })).toHaveAttribute(
      "href",
      "/aula/heraclitus/ola",
    );
    expect(screen.getByRole("link", { name: /a subida/i })).toHaveAttribute(
      "href",
      "/aula/a-subida/depois-da-virada",
    );
  });

  it("opens the module coin map when a module id is set", () => {
    render(
      <StudentLibraryView
        searchQuery=""
        moduleId="cave"
        onModuleChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /saindo da caverna/i, level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /continuar lição/i })).toHaveAttribute(
      "href",
      "/aula/as-sombras/doxa",
    );
  });
});
