import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { PredictionConsequence } from "./prediction-consequence";

afterEach(cleanup);

it("keeps the consequence hidden until a prediction is committed", () => {
  render(
    <PredictionConsequence
      prompt="De onde o contorno vai entrar?"
      choices={[
        { value: "left", label: "Pela esquerda" },
        { value: "right", label: "Pela direita" },
      ]}
      isMatch={(choice) => choice === "left"}
      consequence="O contorno entrou pela esquerda."
      matchedFeedback="Sua previsão combinou com o padrão."
      unmatchedFeedback="O resultado mostrou uma regra que vale revisar."
      onCommit={vi.fn()}
    />,
  );

  expect(
    screen.queryByText("O contorno entrou pela esquerda."),
  ).not.toBeInTheDocument();
  expect(screen.queryByRole("timer")).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Confirmar previsão" }),
  ).toBeDisabled();
});
it("locks one committed choice until the learner explicitly tries another", () => {
  const onCommit = vi.fn();

  render(
    <PredictionConsequence
      prompt="De onde o contorno vai entrar?"
      choices={[
        { value: "left", label: "Pela esquerda" },
        { value: "right", label: "Pela direita" },
      ]}
      isMatch={(choice) => choice === "left"}
      consequence="O contorno entrou pela esquerda."
      matchedFeedback="Sua previsão combinou com o padrão."
      unmatchedFeedback="O resultado mostrou uma regra que vale revisar."
      onCommit={onCommit}
    />,
  );

  fireEvent.click(screen.getByRole("radio", { name: "Pela esquerda" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Confirmar previsão" }),
  );

  expect(onCommit).toHaveBeenCalledWith("left", true);
  expect(
    screen.getByText("O contorno entrou pela esquerda."),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Sua previsão combinou com o padrão."),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("radio", { name: "Pela direita" }),
  ).toBeDisabled();

  fireEvent.click(
    screen.getByRole("button", { name: "Tentar outra previsão" }),
  );

  expect(
    screen.queryByText("O contorno entrou pela esquerda."),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("radio", { name: "Pela direita" }),
  ).toBeEnabled();
});

it("isolates radio groups when two predictions render together", () => {
  render(
    <>
      <PredictionConsequence
        prompt="Primeira previsão"
        choices={[
          { value: "left", label: "Primeira: esquerda" },
          { value: "right", label: "Primeira: direita" },
        ]}
        isMatch={(choice) => choice === "left"}
        consequence="Primeiro resultado"
        matchedFeedback="Combinou."
        unmatchedFeedback="Não combinou."
        onCommit={vi.fn()}
      />
      <PredictionConsequence
        prompt="Segunda previsão"
        choices={[
          { value: "left", label: "Segunda: esquerda" },
          { value: "right", label: "Segunda: direita" },
        ]}
        isMatch={(choice) => choice === "right"}
        consequence="Segundo resultado"
        matchedFeedback="Combinou."
        unmatchedFeedback="Não combinou."
        onCommit={vi.fn()}
      />
    </>,
  );

  const firstChoice = screen.getByRole("radio", {
    name: "Primeira: esquerda",
  });
  const secondChoice = screen.getByRole("radio", {
    name: "Segunda: direita",
  });

  fireEvent.click(firstChoice);
  fireEvent.click(secondChoice);

  expect(firstChoice).toBeChecked();
  expect(secondChoice).toBeChecked();
  expect(firstChoice).not.toHaveAttribute(
    "name",
    secondChoice.getAttribute("name"),
  );
});

it("hides retry after a matched prediction when retryWhen is unmatched", () => {
  render(
    <PredictionConsequence
      prompt="O que é de verdade?"
      choices={[
        { value: "tree", label: "A árvore" },
        { value: "shadow", label: "A sombra" },
      ]}
      isMatch={(choice) => choice === "tree"}
      matchedFeedback="A árvore é a coisa."
      unmatchedFeedback="Olha de novo."
      matchedStatus="Você acertou"
      retryWhen="unmatched"
      onCommit={vi.fn()}
    />,
  );

  fireEvent.click(screen.getByRole("radio", { name: "A sombra" }));
  fireEvent.click(screen.getByRole("button", { name: "Confirmar previsão" }));
  expect(screen.getByRole("button", { name: "Tentar outra previsão" })).toBeVisible();

  fireEvent.click(screen.getByRole("button", { name: "Tentar outra previsão" }));
  fireEvent.click(screen.getByRole("radio", { name: "A árvore" }));
  fireEvent.click(screen.getByRole("button", { name: "Confirmar previsão" }));

  expect(screen.getByText("Você acertou")).toBeVisible();
  expect(
    screen.queryByRole("button", { name: "Tentar outra previsão" }),
  ).not.toBeInTheDocument();
});

it("unlocks choices after a miss when unlockOnMiss is true", () => {
  const onCommit = vi.fn();

  render(
    <PredictionConsequence
      prompt="O que ele teme?"
      choices={[
        { value: "laugh", label: "Que riam dele" },
        { value: "fire", label: "Que o fogo apague" },
      ]}
      isMatch={(choice) => choice === "laugh"}
      matchedFeedback="É o medo de rirem."
      unmatchedFeedback="Ainda não é o que ele sente."
      unmatchedStatus="Ainda não é isso"
      unlockOnMiss
      retryWhen="unmatched"
      onCommit={onCommit}
    />,
  );

  fireEvent.click(screen.getByRole("radio", { name: "Que o fogo apague" }));
  fireEvent.click(screen.getByRole("button", { name: "Confirmar previsão" }));

  expect(onCommit).toHaveBeenCalledWith("fire", false);
  expect(screen.getByText("Ainda não é isso")).toBeVisible();
  expect(screen.getByText("Ainda não é o que ele sente.")).toBeVisible();
  expect(
    screen.queryByRole("button", { name: "Tentar outra previsão" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("radio", { name: "Que riam dele" })).toBeEnabled();
  expect(
    screen.getByRole("button", { name: "Confirmar previsão" }),
  ).toBeVisible();

  fireEvent.click(screen.getByRole("radio", { name: "Que riam dele" }));
  expect(screen.queryByText("Ainda não é isso")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Confirmar previsão" }));
  expect(onCommit).toHaveBeenCalledWith("laugh", true);
  expect(screen.getByText("É o medo de rirem.")).toBeVisible();
  expect(screen.getByRole("radio", { name: "Que o fogo apague" })).toBeDisabled();
});
