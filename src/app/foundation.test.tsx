import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import StudentHome from "./inicio/page";

it("opens a student portal with one clear next lesson action", () => {
  render(<StudentHome />);

  expect(
    screen.getByRole("heading", { name: /seu próximo passo já está aberto/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /continuar aula/i }),
  ).toHaveAttribute("href", "/aula/as-sombras/primeira-tela");
});
