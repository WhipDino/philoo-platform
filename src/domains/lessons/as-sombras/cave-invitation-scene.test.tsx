import {
  cleanup,
  fireEvent,
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
    screen.getByRole("button", { name: /entrar na caverna/i }),
  ).toBeInTheDocument();

  const caveDepth = document.querySelector('[data-scene-depth="cave"]');
  const guideConnection = document.querySelector(
    '[data-scene-connection="plato-dialogue"]',
  );

  expect(caveDepth).toHaveAttribute("aria-hidden", "true");
  expect(guideConnection).toHaveAttribute("aria-hidden", "true");
  expect(guideConnection?.querySelectorAll("path")).toHaveLength(2);
});

it("stops after the first screen instead of advancing", () => {
  render(<CaveInvitationScene />);

  fireEvent.click(
    screen.getByRole("button", { name: /entrar na caverna/i }),
  );

  expect(
    screen.getByText(/paramos aqui por enquanto/i),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /entrar na caverna/i }),
  ).not.toBeInTheDocument();
});
