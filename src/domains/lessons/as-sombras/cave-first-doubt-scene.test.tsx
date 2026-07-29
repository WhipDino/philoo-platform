import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { CaveFirstDoubtScene } from "./cave-first-doubt-scene";

afterEach(cleanup);

it("gives the anomaly one focused story action without Plato or reflection controls", () => {
  const { container } = render(<CaveFirstDoubtScene />);

  expect(
    screen.getByRole("heading", { name: "Algo não combina" }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/durante muito tempo, o jogo da parede acontecia sempre do mesmo jeito/i),
  ).toBeVisible();
  expect(
    screen.getByText(/pela primeira vez, a parede deixou uma pergunta sem resposta/i),
  ).toBeVisible();
  expect(
    screen.getByRole("button", { name: "Acompanhar a dúvida" }),
  ).toBeVisible();
  expect(
    screen.getByRole("img", {
      name: /uma sombra inesperada interrompe o padrão/i,
    }),
  ).toHaveAttribute("src", expect.stringContaining("cave-anomaly-v1.webp"));

  expect(container.querySelector("[data-plato-pose]")).not.toBeInTheDocument();
  expect(
    screen.queryByText(/se tudo o que você conhecesse/i),
  ).not.toBeInTheDocument();
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

  const narration = screen.getByText(/durante muito tempo/i).closest("div");
  const image = screen.getByRole("img", {
    name: /uma sombra inesperada interrompe o padrão/i,
  });
  expect(
    narration?.compareDocumentPosition(image) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
});

it("turns the contradiction into the prisoner's first look behind him", () => {
  const { container } = render(<CaveFirstDoubtScene />);

  fireEvent.click(
    screen.getByRole("button", { name: "Acompanhar a dúvida" }),
  );

  const heading = screen.getByRole("heading", {
    name: "Ele decide olhar",
    level: 2,
  });
  expect(heading).toHaveFocus();
  expect(
    screen.getByText(/enquanto os outros continuam o jogo/i),
  ).toBeVisible();
  expect(
    screen.getByRole("img", {
      name: /um prisioneiro começa a olhar para trás/i,
    }),
  ).toHaveAttribute(
    "src",
    expect.stringContaining("cave-first-turn-cliffhanger-v1.png"),
  );
  expect(container.querySelector("[data-plato-pose]")).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Ver o que existe atrás" }),
  ).toBeVisible();
});

it("lets Plato bridge the cliffhanger to the next lesson", () => {
  const { container } = render(<CaveFirstDoubtScene />);

  fireEvent.click(
    screen.getByRole("button", { name: "Acompanhar a dúvida" }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Ver o que existe atrás" }),
  );

  const heading = screen.getByRole("heading", {
    name: "A primeira dúvida abriu uma passagem.",
  });
  expect(heading).toHaveFocus();
  expect(
    container.querySelector('[data-plato-pose="first-doubt"]'),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/na próxima etapa, ele verá aquilo que sempre esteve atrás da parede/i),
  ).toBeVisible();
  expect(
    screen.getByRole("button", { name: "Concluir As Sombras" }),
  ).toBeVisible();
});

it("rewards curiosity with discovery points, a badge, and three takeaways", () => {
  render(<CaveFirstDoubtScene />);

  fireEvent.click(
    screen.getByRole("button", { name: "Acompanhar a dúvida" }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Ver o que existe atrás" }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Concluir As Sombras" }),
  );

  const heading = screen.getByRole("heading", {
    name: "Você conquistou o Olhar curioso",
  });
  expect(heading).toHaveFocus();
  expect(screen.getByText("+100 pontos de descoberta")).toBeVisible();
  expect(screen.getByText("Olhar curioso")).toBeVisible();
  expect(screen.getByText("Aparência não é o mesmo que origem.")).toBeVisible();
  expect(
    screen.getByText("Uma dúvida pode iniciar uma investigação."),
  ).toBeVisible();
  expect(
    screen.getByText("Procurar novas pistas amplia aquilo que sabemos."),
  ).toBeVisible();
  expect(screen.getByText("Próxima etapa desbloqueada")).toBeVisible();
  expect(
    screen.getByText("O que acontece quando ele olha para trás?"),
  ).toBeVisible();
});
