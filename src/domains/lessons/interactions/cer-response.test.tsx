import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import {
  CerResponse,
  type CerResponseConfig,
} from "./cer-response";

const config: CerResponseConfig = {
  claims: [
    {
      value: "hidden_source",
      label: "Há uma fonte escondida fora da parede",
    },
    {
      value: "insufficient",
      label: "Ainda não há evidência suficiente",
      requiresNextEvidence: true,
    },
  ],
  clues: [
    {
      value: "som",
      label: "uma voz humana acompanhou a projeção",
    },
    {
      value: "forma",
      label: "a forma com asas permaneceu estável",
    },
  ],
  bridges: [
    {
      value: "independent_channels",
      label: "som e projeção podem ter fontes diferentes",
      validClaims: ["hidden_source"],
      validClues: ["som"],
    },
    {
      value: "observation_limit",
      label: "a pista ainda não mostra diretamente o mecanismo",
      validClaims: ["insufficient"],
      validClues: ["som", "forma"],
    },
  ],
  acknowledgments: [
    {
      value: "predictive",
      label: "o modelo da parede ainda permite previsões úteis",
    },
  ],
  nextEvidence: [
    {
      value: "observe_mechanism",
      label: "observar o mecanismo entre a fonte e a parede",
    },
  ],
};

afterEach(cleanup);

function renderCer(
  overrides: Partial<React.ComponentProps<typeof CerResponse>> = {},
) {
  const callbacks = {
    onClaimBuilt: vi.fn(),
    onEvidenceLinked: vi.fn(),
    onRivalAcknowledged: vi.fn(),
    onConfidenceRecorded: vi.fn(),
    onReview: vi.fn(),
  };

  render(
    <CerResponse
      config={config}
      initialValue={{}}
      {...callbacks}
      {...overrides}
    />,
  );

  return callbacks;
}

it("requires claim, inspected clue, bridge, fair acknowledgment, and confidence before review", () => {
  const callbacks = renderCer();
  const review = screen.getByRole("button", {
    name: "Pedir revisão da resposta",
  });

  expect(review).toBeDisabled();

  fireEvent.click(
    screen.getByRole("radio", {
      name: "Há uma fonte escondida fora da parede",
    }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Registrar afirmação" }),
  );
  expect(callbacks.onClaimBuilt).toHaveBeenCalledWith({
    claim: "hidden_source",
    nextEvidence: null,
  });
  expect(review).toBeDisabled();

  fireEvent.click(
    screen.getByRole("radio", {
      name: "uma voz humana acompanhou a projeção",
    }),
  );
  fireEvent.click(
    screen.getByRole("radio", {
      name: "som e projeção podem ter fontes diferentes",
    }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Ligar pista e conclusão" }),
  );
  expect(callbacks.onEvidenceLinked).toHaveBeenCalledWith({
    clue: "som",
    bridge: "independent_channels",
  });
  expect(review).toBeDisabled();

  fireEvent.click(
    screen.getByRole("radio", {
      name: "o modelo da parede ainda permite previsões úteis",
    }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Registrar reconhecimento" }),
  );
  expect(callbacks.onRivalAcknowledged).toHaveBeenCalledWith("predictive");
  expect(review).toBeDisabled();

  fireEvent.click(screen.getByRole("radio", { name: "Média" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Registrar confiança" }),
  );
  expect(callbacks.onConfidenceRecorded).toHaveBeenCalledWith("media");
  expect(review).toBeEnabled();
});

it("uses the exact old-model acknowledgment prompt", () => {
  renderCer();

  expect(
    screen.getByRole("group", {
      name: "3. O que o modelo antigo ainda explica bem?",
    }),
  ).toBeInTheDocument();
});

it("keeps uncertainty legitimate only when it names the evidence to seek", () => {
  const callbacks = renderCer();

  fireEvent.click(
    screen.getByRole("radio", {
      name: "Ainda não há evidência suficiente",
    }),
  );

  const register = screen.getByRole("button", {
    name: "Registrar afirmação",
  });
  expect(register).toBeDisabled();

  fireEvent.click(
    screen.getByRole("radio", {
      name: "observar o mecanismo entre a fonte e a parede",
    }),
  );
  expect(register).toBeEnabled();
  fireEvent.click(register);

  expect(callbacks.onClaimBuilt).toHaveBeenCalledWith({
    claim: "insufficient",
    nextEvidence: "observe_mechanism",
  });
});

it("reads the assembled response as one live sentence and provides named move controls", () => {
  renderCer({
    initialValue: {
      claim: "hidden_source",
      clue: "som",
      bridge: "independent_channels",
      acknowledgment: "predictive",
      confidence: "media",
    },
  });

  const assembled = screen.getByRole("status", {
    name: "Resposta construída",
  });
  expect(assembled).toHaveTextContent(
    /minha afirmação: há uma fonte escondida.*minha pista: uma voz humana.*minha ligação: som e projeção.*ainda reconheço: o modelo da parede.*minha confiança é média/i,
  );
  expect(assembled.textContent?.match(/\./g)).toHaveLength(1);

  const moves = screen.getByRole("list", {
    name: "Ordem dos movimentos da resposta",
  });
  fireEvent.click(
    within(moves).getByRole("button", {
      name: "Mover afirmação para baixo",
    }),
  );

  expect(assembled).toHaveTextContent(
    /^minha pista: uma voz humana.*minha afirmação: há uma fonte escondida/i,
  );
});

it("asks for the missing bridge when the selected clue and claim are disconnected", () => {
  const callbacks = renderCer({
    initialValue: {
      claim: "hidden_source",
      clue: "forma",
      bridge: "independent_channels",
      acknowledgment: "predictive",
      confidence: "alta",
    },
  });

  fireEvent.click(
    screen.getByRole("button", { name: "Pedir revisão da resposta" }),
  );

  expect(callbacks.onReview).toHaveBeenCalledWith(
    expect.objectContaining({ coherent: false }),
  );
  expect(
    screen.getByText(
      "Sua pista descreve a forma, mas sua conclusão pede outra relação. Que ligação conecta as duas?",
    ),
  ).toBeInTheDocument();
});

it("does not accept a second evidence action while the first save is pending", () => {
  let resolve!: (accepted: boolean) => void;
  const pending = new Promise<boolean>((next) => {
    resolve = next;
  });
  const onEvidenceLinked = vi.fn(() => pending);

  renderCer({
    initialValue: { claim: "hidden_source" },
    onEvidenceLinked,
  });

  fireEvent.click(
    screen.getByRole("radio", {
      name: "uma voz humana acompanhou a projeção",
    }),
  );
  fireEvent.click(
    screen.getByRole("radio", {
      name: "som e projeção podem ter fontes diferentes",
    }),
  );
  const link = screen.getByRole("button", {
    name: "Ligar pista e conclusão",
  });
  fireEvent.click(link);
  fireEvent.click(link);

  expect(onEvidenceLinked).toHaveBeenCalledOnce();
  expect(link).toBeDisabled();
  resolve(true);
});

it("revokes a reviewed response after a draft change and keeps it stale after change then revert", () => {
  const onValidityChange = vi.fn();
  renderCer({
    initialValue: {
      claim: "hidden_source",
      clue: "som",
      bridge: "independent_channels",
      acknowledgment: "predictive",
      confidence: "media",
      reviewed: true,
      coherent: true,
    },
    onValidityChange,
  });

  expect(
    screen.getByText(
      "Sua pista e sua conclusão estão ligadas por uma relação explícita.",
    ),
  ).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("radio", {
      name: "a forma com asas permaneceu estável",
    }),
  );
  fireEvent.click(
    screen.getByRole("radio", {
      name: "uma voz humana acompanhou a projeção",
    }),
  );

  expect(onValidityChange).toHaveBeenCalledWith(false);
  expect(
    screen.queryByText(
      "Sua pista e sua conclusão estão ligadas por uma relação explícita.",
    ),
  ).not.toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: "Ligar pista e conclusão" }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Pedir revisão da resposta" }),
  );

  expect(onValidityChange).toHaveBeenLastCalledWith(true);
  expect(
    screen.getByText(
      "Sua pista e sua conclusão estão ligadas por uma relação explícita.",
    ),
  ).toBeInTheDocument();
});

it("keeps confidence stale after change then revert until it is recorded and reviewed again", () => {
  const onValidityChange = vi.fn();
  renderCer({
    initialValue: {
      claim: "hidden_source",
      clue: "som",
      bridge: "independent_channels",
      acknowledgment: "predictive",
      confidence: "media",
      reviewed: true,
      coherent: true,
    },
    onValidityChange,
  });

  fireEvent.click(screen.getByRole("radio", { name: "Alta" }));
  fireEvent.click(screen.getByRole("radio", { name: "Média" }));

  expect(onValidityChange).toHaveBeenCalledWith(false);
  expect(
    screen.queryByText("Confiança média registrada."),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Registrar confiança" }),
  ).toBeEnabled();

  fireEvent.click(
    screen.getByRole("button", { name: "Registrar confiança" }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Pedir revisão da resposta" }),
  );

  expect(onValidityChange).toHaveBeenLastCalledWith(true);
});

it("does not announce or validate a rejected CER review", async () => {
  const onValidityChange = vi.fn();
  const onReview = vi.fn(() =>
    Promise.reject(new Error("persistence rejected")),
  );
  renderCer({
    initialValue: {
      claim: "hidden_source",
      clue: "som",
      bridge: "independent_channels",
      acknowledgment: "predictive",
      confidence: "media",
    },
    onReview,
    onValidityChange,
  });

  fireEvent.click(
    screen.getByRole("button", { name: "Pedir revisão da resposta" }),
  );

  expect(onReview).toHaveBeenCalledOnce();
  await waitFor(() =>
    expect(
      screen.getByRole("button", {
        name: "Pedir revisão da resposta",
      }),
    ).toBeEnabled(),
  );
  expect(onValidityChange).not.toHaveBeenCalledWith(true);
  expect(
    screen.queryByText(
      "Sua pista e sua conclusão estão ligadas por uma relação explícita.",
    ),
  ).not.toBeInTheDocument();
});
