import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StudentNextStepView } from "./student-next-step-view";

afterEach(cleanup);

describe("StudentNextStepView", () => {
  it("shows a clear primary next step and study queue", () => {
    render(<StudentNextStepView onOpenModuleMap={() => {}} onOpenLibrary={() => {}} />);

    expect(screen.getByRole("heading", { name: /olá, ana/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /as sombras/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /continuar aula/i })).toHaveAttribute(
      "href",
      "/aula/as-sombras/doxa",
    );
    expect(screen.getByRole("heading", { name: /na sua fila/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /mapa do módulo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /explorar o acervo/i })).toBeInTheDocument();
  });
});
