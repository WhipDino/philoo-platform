import {
  cleanup,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { CaveInvitationScene } from "./cave-invitation-scene";

afterEach(cleanup);

it("presents canonical Plato as the full-scale Cave guide", () => {
  render(<CaveInvitationScene />);

  expect(
    screen.getByRole("heading", { name: /venha comigo/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("img", { name: /platão abre os braços/i }),
  ).toHaveAttribute("src", expect.stringContaining("plato-welcome-v2.png"));
  expect(
    screen.getByText(/por alguns minutos, olhe apenas para a parede/i),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /entrar na caverna/i }),
  ).toBeInTheDocument();
});

it("continues to the descent story beat", () => {
  render(<CaveInvitationScene />);

  expect(
    screen.getByRole("link", { name: /entrar na caverna/i }),
  ).toHaveAttribute("href", "/aula/as-sombras/a-descida");
});
