import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { PrologueScene } from "./prologue-scene";

afterEach(cleanup);

it("preserves the complete Corte de Luz prologue experience", () => {
  render(
    <PrologueScene
      hypothesis=""
      onHypothesisChange={vi.fn()}
      onRegister={vi.fn()}
      onContinue={vi.fn()}
    />,
  );

  expect(
    screen.getByRole("heading", { name: /o que uma sombra deixa de fora/i }),
  ).toHaveAttribute("tabindex", "-1");
  expect(
    screen.getByRole("slider", { name: /posição do corte de luz/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /ver aparência/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /ver pistas/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("textbox", { name: /sua hipótese provisória/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/quer uma pergunta de platão/i)).toBeInTheDocument();
  expect(
    screen.getAllByRole("link", { name: /voltar ao início|encerrar e voltar/i }),
  ).toHaveLength(2);
});

it("continues from the prologue through its callback", () => {
  const onContinue = vi.fn();

  render(
    <PrologueScene
      hypothesis=""
      onHypothesisChange={vi.fn()}
      onRegister={vi.fn()}
      onContinue={onContinue}
    />,
  );

  expect(
    screen.getByRole("heading", {
      name: /pronto para pensar de dentro da caverna/i,
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      /você viu o mecanismo por fora\. agora use apenas as pistas que chegam à parede\./i,
    ),
  ).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: /começar a investigação/i }),
  );

  expect(onContinue).toHaveBeenCalledOnce();
});

it("disables registration and Start while a prologue commit is pending", () => {
  render(
    <PrologueScene
      hypothesis="A parede mostra apenas efeitos."
      onHypothesisChange={vi.fn()}
      onRegister={vi.fn()}
      onContinue={vi.fn()}
      isBusy
    />,
  );

  expect(
    screen.getByRole("button", { name: /registrar hipótese/i }),
  ).toBeDisabled();
  expect(
    screen.getByRole("button", { name: /começar a investigação/i }),
  ).toBeDisabled();
});
