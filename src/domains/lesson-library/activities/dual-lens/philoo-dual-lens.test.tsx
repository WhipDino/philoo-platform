import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { PhilooDualLens } from "./philoo-dual-lens";

afterEach(cleanup);

const LENS_A = {
  src: "/images/story/o-retorno/beat-03-lente-olho-readaptando-v3.png",
  width: 2752,
  height: 1536,
  alt: "O prisioneiro entra na caverna escura, os olhos semicerrados tentando ver",
  label: "Olho readaptando",
};

const LENS_B = {
  src: "/images/story/o-retorno/beat-03-lente-olho-acostumado-v3.png",
  width: 2752,
  height: 1536,
  alt: "A mesma caverna um pouco mais clara, com marcas visíveis na parede",
  label: "Olho acostumado",
};

const ALTERNATIVES = [
  { id: "pedra-mudou", label: "A pedra mudou de lugar" },
  { id: "readaptacao", label: "O olho precisa de tempo para readaptar" },
] as const;

function renderLens(onComplete = vi.fn()) {
  return {
    onComplete,
    ...render(
      <PhilooDualLens
        prompt="Compare as duas lentes da mesma pedra."
        lensA={LENS_A}
        lensB={LENS_B}
        finalQuestion="O que explica o tropeço dele?"
        alternatives={ALTERNATIVES}
        correctAlternativeId="readaptacao"
        correctFeedback="Isso mesmo. O olho precisa de tempo para readaptar. Pode continuar."
        incorrectFeedback={[
          {
            alternativeId: "pedra-mudou",
            message: "A pedra não mudou. O olho ainda está se readaptando.",
          },
        ]}
        onComplete={onComplete}
      />,
    ),
  };
}

function revealOtherLens() {
  fireEvent.change(screen.getByRole("slider", { name: /comparar as duas lentes/i }), {
    target: { value: "100" },
  });
}

function openQuestions() {
  revealOtherLens();
  fireEvent.click(screen.getByRole("button", { name: "Ver perguntas" }));
}

it("keeps the image on screen and the question hidden until the student reveals the other lens", () => {
  renderLens();

  expect(
    screen.getByRole("img", { name: /entra na caverna escura/i }),
  ).toBeVisible();
  expect(screen.getByRole("button", { name: "Ver perguntas" })).toBeDisabled();
  expect(screen.queryByText(/o que explica o tropeço/i)).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /o olho precisa de tempo/i }),
  ).not.toBeInTheDocument();

  revealOtherLens();

  expect(screen.getByRole("button", { name: "Ver perguntas" })).toBeEnabled();
  expect(
    screen.queryByRole("button", { name: /a pedra mudou de lugar/i }),
  ).not.toBeInTheDocument();
});

it("swaps the image for standing cards after Ver perguntas, then retries without penalty", () => {
  const { onComplete } = renderLens();

  openQuestions();

  expect(
    screen.queryByRole("img", { name: /entra na caverna escura/i }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /o que explica o tropeço/i }),
  ).toBeVisible();
  expect(screen.getByText(/escolha uma das cartas/i)).toBeVisible();

  fireEvent.click(
    screen.getByRole("button", { name: /a pedra mudou de lugar/i }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

  expect(screen.getByText(/ainda não é isso/i)).toBeVisible();
  expect(screen.getByText(/a pedra não mudou/i)).toBeVisible();
  expect(onComplete).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Tentar novamente" })).toBeEnabled();

  fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
  expect(screen.getByRole("button", { name: "Confirmar" })).toBeDisabled();

  fireEvent.click(
    screen.getByRole("button", { name: /o olho precisa de tempo/i }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

  expect(onComplete).toHaveBeenCalledTimes(1);
  expect(screen.getByText(/isso mesmo/i)).toBeVisible();
  expect(
    screen.queryByRole("button", { name: "Confirmar" }),
  ).not.toBeInTheDocument();
});
