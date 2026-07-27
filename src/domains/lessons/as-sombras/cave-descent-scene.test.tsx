import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { CaveDescentScene } from "./cave-descent-scene";

afterEach(cleanup);

it("presents the approved descent beat without questioning the learner", () => {
  render(<CaveDescentScene />);

  expect(
    screen.getByRole("heading", {
      name: "A luz fica para trás.",
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
    screen.getByText(/pessoas de quem falei/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/elas nunca puderam se virar/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/não lhes falta inteligência/i),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("progressbar", { name: "Cena 2 de 10" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Chegar até elas" }),
  ).toBeInTheDocument();
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  expect(
    screen.queryByText("Platão · A República, Livro VII"),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /voltar/i }),
  ).toHaveAttribute("href", "/aula/as-sombras/primeira-tela");
});

it("stops after the descent beat for visual review", () => {
  render(<CaveDescentScene />);

  fireEvent.click(
    screen.getByRole("button", { name: "Chegar até elas" }),
  );

  expect(screen.getByRole("status")).toHaveTextContent(
    /as pessoas estão logo adiante/i,
  );
  expect(screen.getByRole("status")).toHaveTextContent(
    /revisar a descida antes de entrar na próxima cena/i,
  );
});
