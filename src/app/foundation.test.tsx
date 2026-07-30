import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import PublicHome from "./page";
import StudentHome from "./inicio/page";

it("frames Philoo as an investigation, not a points game", () => {
  render(<PublicHome />);

  expect(
    screen.getByRole("heading", {
      name: /uma sombra basta para explicar o que você vê/i,
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /começar uma investigação/i }),
  ).toHaveAttribute("href", "/aula/as-sombras");
  expect(
    screen.queryByText(/\bXP\b|ranking|sequência diária/i),
  ).not.toBeInTheDocument();
});

it("opens a student portal with one clear next lesson action", () => {
  render(<StudentHome />);

  expect(
    screen.getByRole("heading", { name: /seu próximo passo já está aberto/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /continuar aula/i }),
  ).toHaveAttribute("href", "/aula/as-sombras/primeira-tela");
});
