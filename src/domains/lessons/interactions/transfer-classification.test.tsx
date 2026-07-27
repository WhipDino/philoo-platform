import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { TransferClassification } from "./transfer-classification";

afterEach(cleanup);

function CouncilFrame({ expanded }: { expanded: boolean }) {
  return expanded ? (
    <div aria-label="Conselho escolar em contexto amplo">
      <span>Grupo que apoia</span>
      <span>Duas participantes discordam</span>
      <strong>Objeção: a regra exclui parte dos estudantes</strong>
    </div>
  ) : (
    <div aria-label="Recorte do conselho escolar">
      <span>Grupo que apoia</span>
    </div>
  );
}

function renderTransfer(
  overrides: Partial<
    React.ComponentProps<typeof TransferClassification>
  > = {},
) {
  const callbacks = {
    onConfidenceRecorded: vi.fn(),
    onContextRevealed: vi.fn(),
    onClassified: vi.fn(),
    onComplete: vi.fn(),
  };
  render(
    <TransferClassification
      caption="Todos apoiaram a nova regra"
      renderRepresentation={(expanded) => (
        <CouncilFrame expanded={expanded} />
      )}
      initialValue={{}}
      canComplete
      {...callbacks}
      {...overrides}
    />,
  );
  return callbacks;
}

it("records confidence before revealing any wider context", async () => {
  let resolve!: (accepted: boolean) => void;
  const pending = new Promise<boolean>((next) => {
    resolve = next;
  });
  const onConfidenceRecorded = vi.fn(() => pending);

  renderTransfer({ onConfidenceRecorded });

  expect(
    screen.getByLabelText("Recorte do conselho escolar"),
  ).toBeInTheDocument();
  expect(
    screen.queryByText("Duas participantes discordam"),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Revelar contexto mais amplo" }),
  ).toBeDisabled();

  fireEvent.click(screen.getByRole("radio", { name: "Alta" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Registrar confiança" }),
  );

  expect(
    screen.getByRole("button", { name: "Revelar contexto mais amplo" }),
  ).toBeDisabled();
  resolve(true);

  expect(
    await screen.findByRole("button", {
      name: "Revelar contexto mais amplo",
    }),
  ).toBeEnabled();
});

it("reveals visible disagreement while keeping the caption visible as a claim", () => {
  renderTransfer({
    initialValue: { confidence: "media" },
  });

  fireEvent.click(
    screen.getByRole("button", { name: "Revelar contexto mais amplo" }),
  );

  expect(
    screen.getByLabelText("Conselho escolar em contexto amplo"),
  ).toBeInTheDocument();
  expect(screen.getByText("Duas participantes discordam")).toBeInTheDocument();
  expect(
    screen.getByText("Objeção: a regra exclui parte dos estudantes"),
  ).toBeInTheDocument();
  expect(screen.getByText("Todos apoiaram a nova regra")).toBeInTheDocument();
  expect(screen.getByText("Afirmação da legenda")).toBeInTheDocument();
});

it("requires every classification and one next evidence source", () => {
  const callbacks = renderTransfer({
    initialValue: {
      confidence: "media",
      contextRevealed: true,
    },
  });
  const classify = screen.getByRole("button", {
    name: "Comparar classificações",
  });
  expect(classify).toBeDisabled();

  fireEvent.click(
    screen.getByRole("radio", {
      name: "A imagem recortada: representação",
    }),
  );
  fireEvent.click(
    screen.getByRole("radio", {
      name: "A reunião: acontecimento-fonte",
    }),
  );
  fireEvent.click(
    screen.getByRole("radio", {
      name: "A legenda: afirmação",
    }),
  );
  fireEvent.click(
    screen.getByRole("radio", {
      name: "A evidência atual para “todos”: insuficiente",
    }),
  );
  expect(classify).toBeDisabled();

  fireEvent.click(
    screen.getByRole("radio", {
      name: "Consultar a ata da reunião",
    }),
  );
  expect(classify).toBeEnabled();
  fireEvent.click(classify);

  expect(callbacks.onClassified).toHaveBeenCalledWith({
    representation: "representation",
    sourceEvent: "source_event",
    caption: "claim",
    sufficiency: "insufficient",
    nextEvidence: "minutes",
  });
  expect(
    screen.getByText("Imagem recortada → representação"),
  ).toBeInTheDocument();
  expect(screen.getByText("Reunião → acontecimento-fonte")).toBeInTheDocument();
  expect(screen.getByText("Legenda → afirmação")).toBeInTheDocument();
  expect(
    screen.getByText("Evidência atual → insuficiente para “todos”"),
  ).toBeInTheDocument();
});

it("lets a first imperfect classification reach feedback without treating it as failure", () => {
  renderTransfer({
    initialValue: {
      confidence: "baixa",
      contextRevealed: true,
    },
  });

  fireEvent.click(
    screen.getByRole("radio", {
      name: "A imagem recortada: afirmação",
    }),
  );
  fireEvent.click(
    screen.getByRole("radio", {
      name: "A reunião: representação",
    }),
  );
  fireEvent.click(
    screen.getByRole("radio", {
      name: "A legenda: acontecimento-fonte",
    }),
  );
  fireEvent.click(
    screen.getByRole("radio", {
      name: "A evidência atual para “todos”: suficiente",
    }),
  );
  fireEvent.click(
    screen.getByRole("radio", {
      name: "Ouvir relatos de participantes",
    }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Comparar classificações" }),
  );

  expect(
    screen.getByRole("button", { name: "Concluir investigação" }),
  ).toBeEnabled();
  expect(screen.queryByText(/fracasso|falhou/i)).not.toBeInTheDocument();
});
