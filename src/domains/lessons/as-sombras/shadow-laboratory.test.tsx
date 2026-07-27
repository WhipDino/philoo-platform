import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  AttemptSnapshot,
  AttemptStore,
  JsonObject,
} from "../contracts";
import { createInitialSnapshot } from "../runtime";
import { AsSombrasLesson } from "./as-sombras-player";
import { asSombrasManifest } from "./manifest";
import {
  ShadowLaboratory,
  createInitialShadowLaboratoryState,
  sanitizeShadowLaboratoryState,
  type CounterfactualEvidence,
  type LaboratoryMode,
  type ModelRunEvidence,
  type ShadowLaboratoryState,
} from "./shadow-laboratory";

afterEach(cleanup);

const expectedCausalEvidence = {
  projectionSource: "bird_artifact",
  soundSource: "human_carrier",
  causalLinks: [
    "fire_illuminates_artifact",
    "artifact_blocks_light",
    "projection_reaches_wall",
    "carrier_produces_voice_and_steps",
  ],
};

interface HarnessProps {
  readonly initialMode?: LaboratoryMode;
  readonly initialState?: ShadowLaboratoryState;
  readonly onModelEvidence?: (evidence: ModelRunEvidence | null) => void;
  readonly onCounterfactualEvidence?: (
    evidence: CounterfactualEvidence,
  ) => void;
}

function LaboratoryHarness({
  initialMode = "spatial",
  initialState,
  onModelEvidence,
  onCounterfactualEvidence,
}: HarnessProps) {
  const [state, setState] = useState(
    initialState ?? {
      ...createInitialShadowLaboratoryState(),
      mode: initialMode,
    },
  );

  return (
    <ShadowLaboratory
      state={state}
      onStateChange={setState}
      onModelRun={({ evidence, nextState }) => {
        setState(nextState);
        onModelEvidence?.(evidence);
      }}
      onCounterfactual={({ evidence, nextState }) => {
        setState(nextState);
        onCounterfactualEvidence?.(evidence);
      }}
      onContinue={vi.fn()}
    />
  );
}

function placePiece(pieceName: string, slotName: string) {
  fireEvent.click(
    screen.getByRole("button", { name: `Selecionar ${pieceName}` }),
  );
  fireEvent.click(
    screen.getByRole("button", {
      name: `Colocar seleção no lugar de ${slotName}`,
    }),
  );
}

function completeSpatialModel() {
  placePiece("fogo", "fogo");
  placePiece("carregador humano", "carregador");
  placePiece("artefato com pássaro", "artefato");
  placePiece("parede", "parede");
  placePiece("prisioneiro", "prisioneiro");
  fireEvent.click(screen.getByRole("button", { name: "Executar arranjo" }));
}

function answerStepper() {
  fireEvent.click(
    screen.getByRole("radio", { name: "O fogo produz a luz" }),
  );
  fireEvent.click(
    screen.getByRole("radio", {
      name: "O artefato com pássaro bloqueia a luz",
    }),
  );
  fireEvent.click(
    screen.getByRole("radio", { name: "A projeção aparece na parede" }),
  );
  fireEvent.click(
    screen.getByRole("radio", {
      name: "O carregador humano produz a voz e os passos",
    }),
  );
  fireEvent.click(
    screen.getByRole("radio", {
      name: "A distância entre artefato e luz muda o tamanho",
    }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Executar modelo em etapas" }),
  );
}

function predictLargerProjection() {
  fireEvent.click(
    screen.getByRole("radio", { name: "A projeção fica maior" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Testar previsão" }));
}

describe("ShadowLaboratory causal parity", () => {
  it("emits the canonical causal evidence through spatial button placement", () => {
    const onModelEvidence = vi.fn();
    render(<LaboratoryHarness onModelEvidence={onModelEvidence} />);

    completeSpatialModel();

    expect(onModelEvidence).toHaveBeenCalledWith(expectedCausalEvidence);
    expect(
      screen.getByRole("status", { name: "Resultado do modelo" }),
    ).toHaveTextContent(/artefato com pássaro.*parede.*voz.*passos.*carregador/i);
  });

  it("emits identical model and counterfactual evidence through both modes", () => {
    const spatialRuns: (ModelRunEvidence | null)[] = [];
    const spatialPredictions: CounterfactualEvidence[] = [];
    const spatial = render(
      <LaboratoryHarness
        onModelEvidence={(evidence) => spatialRuns.push(evidence)}
        onCounterfactualEvidence={(evidence) =>
          spatialPredictions.push(evidence)
        }
      />,
    );

    completeSpatialModel();
    predictLargerProjection();
    spatial.unmount();

    const stepperRuns: (ModelRunEvidence | null)[] = [];
    const stepperPredictions: CounterfactualEvidence[] = [];
    render(
      <LaboratoryHarness
        initialMode="stepper"
        onModelEvidence={(evidence) => stepperRuns.push(evidence)}
        onCounterfactualEvidence={(evidence) =>
          stepperPredictions.push(evidence)
        }
      />,
    );

    answerStepper();
    predictLargerProjection();

    expect(spatialRuns).toEqual([expectedCausalEvidence]);
    expect(stepperRuns).toEqual(spatialRuns);
    expect(stepperPredictions).toEqual(spatialPredictions);
  });
});

describe("ShadowLaboratory access and guidance", () => {
  it("uses named buttons and semantic SVG without a drag-only dependency", () => {
    const { container } = render(<LaboratoryHarness />);

    expect(
      screen.getByRole("button", { name: "Mover para a esquerda" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mover para a direita" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Aproximar da luz" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Afastar da luz" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Selecionar fogo" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Colocar seleção no lugar de artefato",
      }),
    ).toBeInTheDocument();
    expect(container.querySelector("[draggable='true']")).toBeNull();
    expect(container.querySelector("[data-light-rays]")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("withholds Plato until an unproductive run and then reveals one link", () => {
    render(<LaboratoryHarness />);

    expect(
      screen.queryByRole("button", {
        name: "Pedir uma pergunta a Platão",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: /platão/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Executar arranjo" }),
    );

    expect(
      screen.getByText(
        "Neste arranjo, a luz não envia o contorno à parede. Qual peça precisa mudar?",
      ),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", {
        name: "Pedir uma pergunta a Platão",
      }),
    );

    expect(
      screen.getByRole("img", { name: /platão/i }),
    ).toHaveAttribute("src", expect.stringContaining("platao-master.webp"));
    expect(
      screen.getByText("Um modelo merece confiança quando consegue prever."),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("plato-single-link")).toHaveLength(1);
  });

  it("keeps a named before-and-after comparison available with reduced motion", () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    try {
      render(<LaboratoryHarness />);
      completeSpatialModel();
      predictLargerProjection();

      expect(
        screen.getByRole("button", {
          name: "Comparar antes e depois",
        }),
      ).toBeInTheDocument();
      fireEvent.click(
        screen.getByRole("button", {
          name: "Comparar antes e depois",
        }),
      );
      expect(
        screen.getByRole("region", {
          name: "Comparação antes e depois",
        }),
      ).toHaveTextContent(/antes.*depois.*maior/i);
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });
});

class RecordingAttemptStore implements AttemptStore {
  readonly eventIds: string[] = [];

  constructor(public snapshot: AttemptSnapshot) {}

  async restore() {
    return this.snapshot;
  }

  async commit({
    eventId,
    next,
  }: {
    eventId: string;
    next: AttemptSnapshot;
  }) {
    this.eventIds.push(eventId);
    this.snapshot = JSON.parse(JSON.stringify(next)) as AttemptSnapshot;
  }
}

function snapshotAtLaboratory(sceneState: JsonObject = {}): AttemptSnapshot {
  const initial = createInitialSnapshot(asSombrasManifest);
  return {
    ...initial,
    currentSceneId: "shadow_laboratory",
    visitedSceneIds: [
      "prologue_corte_de_luz",
      "prisoner_view",
      "prediction_mastery",
      "impossible_shadow",
      "evidence_investigation",
      "shadow_laboratory",
    ],
    sceneState: { shadow_laboratory: sceneState },
  };
}

describe("ShadowLaboratory persistence and gate", () => {
  it("commits named JSON-safe evidence without losing stepper state", async () => {
    const store = new RecordingAttemptStore(snapshotAtLaboratory());
    render(<AsSombrasLesson store={store} />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Usar versão em etapas",
      }),
    );
    await waitFor(() =>
      expect(store.eventIds.at(-1)).toMatch(
        /:laboratory_configuration_changed$/,
      ),
    );

    const answers = [
      "O fogo produz a luz",
      "O artefato com pássaro bloqueia a luz",
      "A projeção aparece na parede",
      "O carregador humano produz a voz e os passos",
      "A distância entre artefato e luz muda o tamanho",
    ];
    for (const answer of answers) {
      fireEvent.click(screen.getByRole("radio", { name: answer }));
      await waitFor(() =>
        expect(store.snapshot.sceneState.shadow_laboratory).toEqual(
          expect.objectContaining({
            mode: "stepper",
          }),
        ),
      );
    }

    fireEvent.click(
      screen.getByRole("button", { name: "Executar modelo em etapas" }),
    );
    await waitFor(() =>
      expect(store.eventIds.at(-1)).toMatch(/:model_run$/),
    );

    expect(store.snapshot.responses.causalModel.value).toEqual(
      expectedCausalEvidence,
    );
    expect(() =>
      JSON.stringify(store.snapshot.sceneState.shadow_laboratory),
    ).not.toThrow();
    expect(
      screen.getByRole("button", { name: "Defender o modelo" }),
    ).toBeDisabled();

    fireEvent.click(
      screen.getByRole("radio", { name: "A projeção fica maior" }),
    );
    await waitFor(() =>
      expect(
        store.snapshot.sceneState.shadow_laboratory,
      ).toEqual(
        expect.objectContaining({
          counterfactualPrediction: "projection_increases",
        }),
      ),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Testar previsão" }),
    );
    await waitFor(() =>
      expect(store.eventIds.at(-1)).toMatch(
        /:counterfactual_predicted$/,
      ),
    );

    expect(store.snapshot.responses.counterfactualPrediction.value).toEqual(
      expect.objectContaining({
        changedVariable: "artifact_distance_from_light",
        observedConsequence: "projection_increases",
      }),
    );
    expect(
      screen.getByRole("button", { name: "Defender o modelo" }),
    ).toBeEnabled();

    fireEvent.click(
      screen.getByRole("button", { name: "Defender o modelo" }),
    );
    await waitFor(() =>
      expect(store.snapshot.currentSceneId).toBe("defend_model"),
    );
  });

  it("sanitizes corrupt resume data while preserving a completed valid run", () => {
    const completed = createInitialShadowLaboratoryState();
    const restored = sanitizeShadowLaboratoryState(
      JSON.parse(
        JSON.stringify({
          ...completed,
          mode: "stepper",
          runCount: 1,
          lastModelEvidence: expectedCausalEvidence,
          counterfactualPrediction: "projection_increases",
          counterfactualEvidence: {
            changedVariable: "artifact_distance_from_light",
            prediction: "projection_increases",
            observedConsequence: "projection_increases",
            beforeScale: 2.5,
            afterScale: 5,
            matched: true,
          },
          artifactPosition: "not-a-number",
          selectedPiece: "invented-piece",
        }),
      ),
    );

    expect(restored.mode).toBe("stepper");
    expect(restored.artifactPosition).toBe(4);
    expect(restored.selectedPiece).toBeNull();
    expect(restored.lastModelEvidence).toEqual(expectedCausalEvidence);
    expect(restored.counterfactualEvidence?.matched).toBe(true);
  });

  it("rejects a resumed counterfactual without valid model evidence", () => {
    const restored = sanitizeShadowLaboratoryState({
      ...createInitialShadowLaboratoryState(),
      counterfactualPrediction: "projection_increases",
      counterfactualEvidence: {
        changedVariable: "artifact_distance_from_light",
        prediction: "projection_increases",
        observedConsequence: "projection_increases",
        beforeScale: 2.5,
        afterScale: 5,
        matched: true,
      },
    });

    expect(restored.lastModelEvidence).toBeNull();
    expect(restored.counterfactualEvidence).toBeNull();
  });
});
