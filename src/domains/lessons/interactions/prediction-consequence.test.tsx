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
