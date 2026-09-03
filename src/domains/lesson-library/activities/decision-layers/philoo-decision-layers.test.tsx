import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { PhilooDecisionLayers } from "./philoo-decision-layers";

afterEach(cleanup);

const LAYERS = [
  {
    id: "obrigacao",
    label: "Obrigação com a cidade",
    weightNote: "Camada estrutural, pesa mais",
    explanation: "A cidade que permitiu subir cobra parte do que ele viu.",
  },
  {
    id: "memoria",
    label: "Lembrança dos companheiros",
    weightNote: "Camada pessoal, leve",
    explanation: "Ele pensa em quem ficou.",
  },
  {
    id: "custo",
    label: "Custo de readaptar os olhos",
    weightNote: "Camada intermediária",
    explanation: "Voltar a ver no escuro tem um preço.",
  },
] as const;

const CORRECT_ORDER = ["memoria", "custo", "obrigacao"];

function renderLayers(onComplete = vi.fn()) {
  return {
    onComplete,
    ...render(
      <PhilooDecisionLayers
        prompt="Empilhe os motivos do retorno, do mais leve ao mais pesado."
        layers={LAYERS}
        correctOrder={CORRECT_ORDER}
        correctFeedback="A pilha está certa. O medo não some; a obrigação fica em cima."
        outOfPlaceFeedback={[
          {
            layerId: "obrigacao",
            message: "A obrigação pesa mais que a saudade. Ela fica no topo.",
          },
        ]}
        onComplete={onComplete}
      />,
    ),
  };
}

function placeIntoNextOpenSlot(cardLabel: RegExp) {
  fireEvent.click(screen.getByRole("button", { name: cardLabel }));
  fireEvent.click(
    screen.getAllByRole("button", { name: /solte aqui/i })[0],
  );
}

it("keeps Conferir disabled until the stack is full, then returns only the wrong layers", () => {
  const { onComplete } = renderLayers();

  expect(screen.getByRole("button", { name: "Conferir" })).toBeDisabled();

  placeIntoNextOpenSlot(/obrigação com a cidade/i);
  placeIntoNextOpenSlot(/lembrança dos companheiros/i);
  placeIntoNextOpenSlot(/custo de readaptar os olhos/i);

  expect(screen.getByRole("button", { name: "Conferir" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Conferir" }));

  expect(onComplete).not.toHaveBeenCalled();
  expect(screen.getByText(/a obrigação pesa mais que a saudade/i)).toBeVisible();
  expect(
    screen.getByRole("button", { name: /obrigação com a cidade/i }),
  ).toBeVisible();
});

it("completes and hides Conferir once the weight order is correct", () => {
  const { onComplete } = renderLayers();

  placeIntoNextOpenSlot(/lembrança dos companheiros/i);
  placeIntoNextOpenSlot(/custo de readaptar os olhos/i);
  placeIntoNextOpenSlot(/obrigação com a cidade/i);

  fireEvent.click(screen.getByRole("button", { name: "Conferir" }));

  expect(onComplete).toHaveBeenCalledTimes(1);
  expect(screen.getByText(/o medo não some/i)).toBeVisible();
  expect(
    screen.queryByRole("button", { name: "Conferir" }),
  ).not.toBeInTheDocument();
});
