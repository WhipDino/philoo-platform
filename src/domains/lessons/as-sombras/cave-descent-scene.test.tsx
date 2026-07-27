import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { CaveDescentScene } from "./cave-descent-scene";

afterEach(cleanup);

it("presents the prisoners' limited perspective without questioning the learner", () => {
  render(<CaveDescentScene />);

  expect(
    screen.getByRole("heading", {
      name: /eles nunca olharam para trás/i,
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("img", {
      name: /platão guia você pela descida/i,
    }),
  ).toHaveAttribute(
    "src",
    expect.stringContaining("plato-descent-v1.png"),
  );
  expect(
    screen.getByText(/não lhes falta inteligência/i),
  ).toBeInTheDocument();
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /voltar/i }),
  ).toHaveAttribute("href", "/aula/as-sombras/primeira-tela");
});

it("stops after the descent beat for visual review", () => {
  render(<CaveDescentScene />);

  fireEvent.click(
    screen.getByRole("button", { name: /chegar mais perto/i }),
  );

  expect(screen.getByRole("status")).toHaveTextContent(
    /a próxima parte começa na parede/i,
  );
});
