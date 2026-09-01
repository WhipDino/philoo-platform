import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import StudentHome from "./inicio/page";

it("opens a student portal with one clear next lesson action", () => {
  render(<StudentHome />);

  expect(
    screen.getByRole("heading", { name: /^as sombras$/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /continuar aula/i }),
  ).toHaveAttribute("href", "/aula/as-sombras/doxa");
});
