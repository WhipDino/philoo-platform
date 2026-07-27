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
import { PLATO_POSES } from "../plato-pose-catalog";
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

function placeProjectionGeometry() {
  placePiece("fogo", "fogo");
  placePiece("artefato com pássaro", "artefato");
  placePiece("parede", "parede");
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

  it.each([
    {
      omitted: "carrier",
      prepare: () => {
        placeProjectionGeometry();
        placePiece("prisioneiro", "prisioneiro");
      },
      expectedPending: /fonte do som ainda não foi ligada/i,
    },
    {
      omitted: "prisoner",
      prepare: () => {
        placeProjectionGeometry();
        placePiece("carregador humano", "carregador");
      },
      expectedPending: /lugar de observação ainda precisa/i,
    },
  ])(
    "keeps projection geometry true when the $omitted is missing",
    ({ prepare, expectedPending }) => {
      const onModelEvidence = vi.fn();
      render(<LaboratoryHarness onModelEvidence={onModelEvidence} />);

      prepare();
      fireEvent.click(
        screen.getByRole("button", { name: "Executar arranjo" }),
      );

      const result = screen.getByRole("status", {
        name: "Resultado do modelo",
      });
      expect(result).toHaveTextContent(/projeção chegou à parede/i);
      expect(result).toHaveTextContent(expectedPending);
      expect(result).not.toHaveTextContent(/não produz uma projeção/i);
      expect(onModelEvidence).toHaveBeenCalledWith(null);
    },
  );
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
    expect(container.querySelector("[data-light-rays]")).toBeNull();

    placeProjectionGeometry();

    expect(container.querySelector("[data-light-rays]")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("derives SVG rays and projection size from the tested artifact position", () => {
    const { container } = render(<LaboratoryHarness />);
    completeSpatialModel();

    const firstProjection = container.querySelector(
      "[data-projection-mark]",
    );
    const firstPath = firstProjection?.getAttribute("d");
    const firstScale = Number(
      firstProjection?.getAttribute("data-projection-scale"),
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Aproximar da luz" }),
    );
    expect(
      container.querySelector("[data-projection-mark]"),
    ).toBeNull();
    fireEvent.click(
      screen.getByRole("button", { name: "Executar arranjo" }),
    );

    const closerProjection = container.querySelector(
      "[data-projection-mark]",
    );
    expect(closerProjection?.getAttribute("d")).not.toBe(firstPath);
    expect(
      Number(closerProjection?.getAttribute("data-projection-scale")),
    ).toBeGreaterThan(firstScale);
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
      screen.getByRole("img", { name: PLATO_POSES["prediction-model"].alt }),
    ).toHaveAttribute(
      "src",
      expect.stringContaining(
        encodeURIComponent(PLATO_POSES["prediction-model"].src),
      ),
    );
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
      expect(
        document.querySelector("[data-shadow-motion]"),
      ).toHaveAttribute("data-shadow-motion", "static");
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
    expect(store.snapshot.sceneState.shadow_laboratory).toEqual(
      expect.objectContaining({
        counterfactualRecord: expect.objectContaining({
          mode: "stepper",
          prediction: "projection_increases",
          beforeInput: expect.objectContaining({
            artifactPosition: 4,
          }),
          afterInput: expect.objectContaining({
            artifactPosition: 3,
          }),
        }),
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

  it("recomputes valid persisted evidence instead of trusting derived fields", () => {
    const completed = {
      ...createInitialShadowLaboratoryState(),
      mode: "stepper" as const,
      stepperAnswers: {
        light_source: "fire",
        light_blocker: "bird_artifact",
        projection_destination: "projection_wall",
        sound_source: "human_carrier",
        size_variable: "artifact_light_distance",
      } as const,
      runCount: 1,
      lastRunRecord: {
        mode: "stepper",
        slots: {
          fire: null,
          carrier: null,
          artifact: null,
          wall: null,
          prisoner: null,
        },
        stepperAnswers: {
          light_source: "fire",
          light_blocker: "bird_artifact",
          projection_destination: "projection_wall",
          sound_source: "human_carrier",
          size_variable: "artifact_light_distance",
        },
        artifactPosition: 4,
        carrierPosition: 5,
      } as const,
      counterfactualPrediction: "projection_increases" as const,
      counterfactualRecord: {
        mode: "stepper",
        prediction: "projection_increases",
        beforeInput: {
          lightPosition: 0,
          artifactPosition: 4,
          wallPosition: 10,
          artifactHeight: 2,
          carrierVoice: "human",
          artifactInLightPath: true,
          artifactSilhouette: "bird",
          artifactId: "bird_artifact",
        },
        afterInput: {
          lightPosition: 0,
          artifactPosition: 3,
          wallPosition: 10,
          artifactHeight: 2,
          carrierVoice: "human",
          artifactInLightPath: true,
          artifactSilhouette: "bird",
          artifactId: "bird_artifact",
        },
      },
    };
    const restored = sanitizeShadowLaboratoryState(
      JSON.parse(
        JSON.stringify({
          ...completed,
          lastModelEvidence: expectedCausalEvidence,
          counterfactualEvidence: {
            changedVariable: "artifact_distance_from_light",
            prediction: "projection_increases",
            observedConsequence: "projection_increases",
            beforeScale: 999,
            afterScale: -42,
            matched: false,
          },
          selectedPiece: "invented-piece",
        }),
      ),
    );

    expect(restored.mode).toBe("stepper");
    expect(restored.selectedPiece).toBeNull();
    expect(restored.lastModelEvidence).toEqual(expectedCausalEvidence);
    expect(restored.counterfactualEvidence?.beforeScale).toBeCloseTo(2.5);
    expect(restored.counterfactualEvidence?.afterScale).toBeCloseTo(10 / 3);
    expect(restored.counterfactualEvidence?.matched).toBe(true);
  });

  it("rejects canonical-looking evidence when the saved configuration is blank", () => {
    const restored = sanitizeShadowLaboratoryState({
      ...createInitialShadowLaboratoryState(),
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
    });

    expect(restored.lastModelEvidence).toBeNull();
    expect(restored.counterfactualEvidence).toBeNull();
  });

  it("restores a hint only after a recorded unproductive run", () => {
    const withoutFailure = sanitizeShadowLaboratoryState({
      ...createInitialShadowLaboratoryState(),
      hintVisible: true,
      unproductiveRuns: 0,
    });
    const afterFailure = sanitizeShadowLaboratoryState({
      ...createInitialShadowLaboratoryState(),
      hintVisible: true,
      runCount: 1,
      unproductiveRuns: 1,
    });

    expect(withoutFailure.hintVisible).toBe(false);
    expect(afterFailure.hintVisible).toBe(true);
  });

  it("relocks completion when switching modes and running an incomplete model", () => {
    render(<LaboratoryHarness />);
    completeSpatialModel();
    predictLargerProjection();
    expect(
      screen.getByRole("button", { name: "Defender o modelo" }),
    ).toBeEnabled();

    fireEvent.click(
      screen.getByRole("button", { name: "Usar versão em etapas" }),
    );

    expect(
      screen.getByRole("button", { name: "Defender o modelo" }),
    ).toBeDisabled();
    expect(
      screen.queryByRole("heading", {
        name: /se o artefato se aproximar/i,
      }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Executar modelo em etapas" }),
    );

    expect(
      screen.getByRole("status", { name: "Resultado do modelo" }),
    ).toHaveTextContent(/não produz uma projeção/i);
    expect(
      screen.getByRole("button", { name: "Defender o modelo" }),
    ).toBeDisabled();
  });
});
