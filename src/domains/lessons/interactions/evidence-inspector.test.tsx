import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { EvidenceInspector } from "./evidence-inspector";

const clues = [
  {
    id: "forma",
    title: "Forma estável",
    summary: "O contorno com asas não muda.",
    explanation: "A pista explica a regularidade da projeção.",
    unresolved: "Ainda não identifica o que produz a forma.",
  },
  {
    id: "som",
    title: "Voz humana",
    summary: "Uma voz diz “mais devagar”.",
    explanation: "A pista identifica uma voz humana próxima.",
    unresolved: "Ainda não mostra de onde a voz vem.",
  },
  {
    id: "tempo",
    title: "Passos fora do contorno",
    summary: "Os passos começam antes e terminam depois.",
    explanation: "A pista separa o tempo do som e da projeção.",
    unresolved: "Ainda não identifica quem caminha.",
  },
  {
    id: "repeticao",
    title: "A mesma voz, outra forma",
    summary: "A voz se repete com uma projeção diferente.",
    explanation: "A repetição testa se voz e forma têm a mesma fonte.",
    unresolved: "Ainda não permite observar a fonte diretamente.",
    optional: true,
  },
] as const;

const modelFits = [
  { value: "parede", label: "combina com o modelo da parede" },
  { value: "fonte", label: "combina com uma fonte escondida" },
  { value: "ambos", label: "combina com os dois" },
  { value: "incerto", label: "ainda não sei" },
] as const;

afterEach(cleanup);

it("starts with the learner-selected clue and keeps opened evidence visibly marked", () => {
  render(
    <EvidenceInspector
      clues={clues}
      firstClueId="som"
      modelFits={modelFits}
      onInspect={vi.fn()}
      onCompare={vi.fn()}
      onContinue={vi.fn()}
    />,
  );

  const clueList = screen.getByRole("list", { name: "Pistas disponíveis" });
  expect(
    within(clueList).getAllByRole("button", { name: /examinar/i })[0],
  ).toHaveAccessibleName(/voz humana/i);
  expect(
    screen.queryByRole("button", { name: /a mesma voz, outra forma/i }),
  ).not.toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: /examinar voz humana/i }),
  );

  expect(screen.getByText("Uma voz diz “mais devagar”.")).toBeInTheDocument();
  expect(
    screen.getByText(/pista aberta/i, { selector: "span" }),
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/pista examinada/i)).toHaveTextContent("✓");
  expect(
    screen.getByRole("button", { name: /examinar voz humana.*pista aberta/i }),
  ).toBeInTheDocument();
});

it("reveals and orders the optional repeated-source clue first when the learner selected it", () => {
  render(
    <EvidenceInspector
      clues={clues}
      firstClueId="repeticao"
      modelFits={modelFits}
      onInspect={vi.fn()}
      onCompare={vi.fn()}
      onContinue={vi.fn()}
    />,
  );

  const clueList = screen.getByRole("list", { name: "Pistas disponíveis" });
  expect(
    within(clueList).getAllByRole("button", { name: /examinar/i })[0],
  ).toHaveAccessibleName(/a mesma voz, outra forma/i);
  expect(
    screen.queryByRole("button", { name: /expor teste mais forte/i }),
  ).not.toBeInTheDocument();
});

it("ignores comparisons for unopened clues when calculating the gate", () => {
  render(
    <EvidenceInspector
      clues={clues}
      firstClueId="som"
      modelFits={modelFits}
      completedComparisons={{
        forma: "ambos",
        som: "fonte",
      }}
      onInspect={vi.fn()}
      onCompare={vi.fn()}
      onContinue={vi.fn()}
    />,
  );

  expect(screen.getByText("0 de 2 comparações feitas")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Pode continuar" }),
  ).toBeDisabled();
});

it("blocks continuation while any opened clue still needs a model-fit response", () => {
  render(
    <EvidenceInspector
      clues={clues}
      firstClueId="som"
      modelFits={modelFits}
      openedClueIds={["som", "forma", "tempo"]}
      completedComparisons={{
        som: "fonte",
        forma: "ambos",
      }}
      onInspect={vi.fn()}
      onCompare={vi.fn()}
      onContinue={vi.fn()}
    />,
  );

  const continueButton = screen.getByRole("button", {
    name: "Pode continuar",
  });
  expect(screen.getByText("2 de 2 comparações feitas")).toBeInTheDocument();
  expect(
    screen.getByText(/1 pista aberta ainda precisa de comparação/i),
  ).toBeInTheDocument();
  expect(continueButton).toBeDisabled();

  fireEvent.click(
    screen.getByRole("button", { name: /examinar passos fora do contorno/i }),
  );
  fireEvent.click(
    screen.getByRole("radio", { name: "combina com uma fonte escondida" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Comparar modelos" }));

  expect(continueButton).toBeEnabled();
});

it("relocks continuation when a committed model-fit draft is changed", () => {
  const onCompare = vi.fn();

  render(
    <EvidenceInspector
      clues={clues}
      firstClueId="som"
      modelFits={modelFits}
      openedClueIds={["som", "forma"]}
      completedComparisons={{
        som: "fonte",
        forma: "ambos",
      }}
      onInspect={vi.fn()}
      onCompare={onCompare}
      onContinue={vi.fn()}
    />,
  );

  const continueButton = screen.getByRole("button", {
    name: "Pode continuar",
  });
  expect(continueButton).toBeEnabled();

  fireEvent.click(
    screen.getByRole("button", {
      name: /examinar voz humana.*pista aberta/i,
    }),
  );
  expect(
    screen.getByText(/a pista identifica uma voz humana próxima/i),
  ).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("radio", { name: "combina com o modelo da parede" }),
  );

  expect(continueButton).toBeDisabled();
  expect(
    screen.getByText(/1 pista aberta ainda precisa de comparação/i),
  ).toBeInTheDocument();
  expect(
    screen.queryByText(/a pista identifica uma voz humana próxima/i),
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Comparar modelos" }));

  expect(onCompare).toHaveBeenCalledWith("som", "parede");
  expect(continueButton).toBeEnabled();
});

it("requires two clue/model comparisons and can reveal the optional repeated-source test", () => {
  const onInspect = vi.fn();
  const onCompare = vi.fn();
  const onContinue = vi.fn();

  render(
    <EvidenceInspector
      clues={clues}
      firstClueId="som"
      modelFits={modelFits}
      onInspect={onInspect}
      onCompare={onCompare}
      onContinue={onContinue}
    />,
  );

  const continueButton = screen.getByRole("button", {
    name: "Pode continuar",
  });
  expect(continueButton).toBeDisabled();

  fireEvent.click(
    screen.getByRole("button", { name: /examinar voz humana/i }),
  );
  fireEvent.click(
    screen.getByRole("radio", {
      name: "combina com uma fonte escondida",
    }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Comparar modelos" }));

  expect(onInspect).toHaveBeenCalledWith("som");
  expect(onCompare).toHaveBeenCalledWith("som", "fonte");
  expect(continueButton).toBeDisabled();
  expect(
    screen.getByText(/a pista identifica uma voz humana próxima/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/ainda não mostra de onde a voz vem/i),
  ).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: /examinar forma estável/i }),
  );
  fireEvent.click(
    screen.getByRole("radio", { name: "combina com os dois" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Comparar modelos" }));

  expect(continueButton).toBeEnabled();
  fireEvent.click(continueButton);
  expect(onContinue).toHaveBeenCalledOnce();

  fireEvent.click(
    screen.getByRole("button", { name: /expor teste mais forte/i }),
  );
  expect(
    screen.getByRole("button", {
      name: /examinar a mesma voz, outra forma/i,
    }),
  ).toBeInTheDocument();
});
