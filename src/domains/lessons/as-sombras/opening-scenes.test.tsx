import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import type {
  AttemptSnapshot,
  AttemptStore,
  JsonObject,
  ResponseEnvelope,
} from "../contracts";
import { createInitialSnapshot } from "../runtime";
import { PLATO_POSES } from "../plato-pose-catalog";
import { AnomalyScene } from "./anomaly-scene";
import { AsSombrasLesson } from "./as-sombras-player";
import { EvidenceInvestigationScene } from "./evidence-investigation-scene";
import { asSombrasManifest } from "./manifest";
import {
  PredictionMasteryScene,
  sanitizeWallForecasts,
} from "./prediction-mastery-scene";
import { PrisonerViewScene } from "./prisoner-view-scene";
import { PrologueScene } from "./prologue-scene";

afterEach(cleanup);

it("uses the first-question pose for the prologue prompt", () => {
  render(
    <PrologueScene
      hypothesis=""
      onHypothesisChange={vi.fn()}
      onRegister={vi.fn()}
      onContinue={vi.fn()}
    />,
  );

  expect(
    screen.getByRole("img", { name: PLATO_POSES["first-question"].alt }),
  ).toHaveAttribute(
    "src",
    expect.stringContaining(encodeURIComponent(PLATO_POSES["first-question"].src)),
  );
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
    this.snapshot = next;
  }
}

function snapshotAt(
  sceneId: AttemptSnapshot["currentSceneId"],
  options: {
    responses?: Readonly<Record<string, ResponseEnvelope>>;
    sceneState?: JsonObject;
  } = {},
): AttemptSnapshot {
  const initial = createInitialSnapshot(asSombrasManifest);
  return {
    ...initial,
    currentSceneId: sceneId,
    visitedSceneIds: ["prologue_corte_de_luz", sceneId],
    sceneState: options.sceneState
      ? { [sceneId]: options.sceneState }
      : {},
    responses: options.responses ?? {},
  };
}

it("distinguishes a constrained observation from an inference in Scene 1", () => {
  const onClassify = vi.fn();

  render(
    <PrisonerViewScene
      classifications={{}}
      onClassify={onClassify}
      onContinue={vi.fn()}
    />,
  );

  expect(screen.getByText("Um contorno com asas passou.")).toBeInTheDocument();
  expect(screen.getByText("Um pássaro passou.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Observar" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Escutar" })).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: "Tentar olhar para trás" }),
  );
  expect(
    screen.getByText(
      /as correntes limitam o movimento\. você pode testar apenas as pistas que chegam daqui/i,
    ),
  ).toBeInTheDocument();

  const perceived = screen.getAllByRole("radio", { name: "Percebi" });
  const inferred = screen.getAllByRole("radio", { name: "Concluí" });
  fireEvent.click(perceived[0]);
  fireEvent.click(inferred[1]);

  expect(onClassify).toHaveBeenNthCalledWith(1, "winged_outline", "percebi");
  expect(onClassify).toHaveBeenNthCalledWith(2, "bird_claim", "conclui");
  expect(
    screen.getByText(
      /você percebeu um contorno\. “pássaro” já é uma explicação/i,
    ),
  ).toBeInTheDocument();
});

it("offers four forecasts and a supported fifth round below three matches in Scene 2", () => {
  const onForecast = vi.fn();

  render(
    <PredictionMasteryScene
      forecasts={[]}
      onForecast={onForecast}
      onComplete={vi.fn()}
    />,
  );

  expect(screen.getByText("Demonstração 1 de 2")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Começar previsões" }));

  for (let round = 1; round <= 4; round += 1) {
    expect(
      screen.getByText(`Previsão ${round} de 4`),
    ).toBeInTheDocument();
    const choices = screen.getAllByRole("radio");
    fireEvent.click(choices[choices.length - 1]);
    fireEvent.click(
      screen.getByRole("button", { name: "Confirmar previsão" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Próxima previsão" }),
    );
  }

  expect(onForecast).toHaveBeenCalledTimes(4);
  expect(screen.getAllByText(/regra em foco/i)).not.toHaveLength(0);
  expect(screen.getByText("Previsão apoiada · 5 de 5")).toBeInTheDocument();
  expect(screen.queryByText(/falhou|fracasso/i)).not.toBeInTheDocument();
});

it("coordinates the bird silhouette, heavy footsteps, and human voice in Scene 3", () => {
  const onFirstClue = vi.fn();

  render(
    <AnomalyScene
      onAnomalyNoticed={vi.fn()}
      onFirstClue={onFirstClue}
      onContinue={vi.fn()}
    />,
  );

  expect(
    screen.getByRole("region", { name: "Transcrição do acontecimento" }),
  ).toHaveTextContent(/passos pesados.*voz humana: “mais devagar”/i);
  expect(
    screen.queryByText(/o que falhou: o que você percebeu/i),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("img", { name: /platão/i }),
  ).not.toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: "Reproduzir acontecimento" }),
  );

  expect(screen.getByLabelText("Silhueta com asas")).toBeInTheDocument();
  expect(screen.getByText("passos pesados")).toBeInTheDocument();
  expect(screen.getByText("voz humana: “mais devagar”")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Reproduzir novamente" }),
  ).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: /investigar primeiro: som/i }),
  );

  expect(onFirstClue).toHaveBeenCalledWith("som");
  expect(
    screen.getByText(
      /o que falhou: o que você percebeu ou a explicação/i,
    ),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("img", { name: PLATO_POSES["diagnose-anomaly"].alt }),
  ).toHaveAttribute(
    "src",
    expect.stringContaining(encodeURIComponent(PLATO_POSES["diagnose-anomaly"].src)),
  );
});

it("keeps Scene 4 gated until two model-fit comparisons", () => {
  const onContinue = vi.fn();

  render(
    <EvidenceInvestigationScene
      firstClueId="tempo"
      inspectedClueIds={[]}
      comparisons={{}}
      onInspect={vi.fn()}
      onCompare={vi.fn()}
      onContinue={onContinue}
    />,
  );

  const continueButton = screen.getByRole("button", {
    name: "Pode continuar",
  });
  expect(continueButton).toBeDisabled();

  fireEvent.click(
    screen.getByRole("button", {
      name: /examinar passos fora do contorno/i,
    }),
  );
  fireEvent.click(
    screen.getByRole("radio", { name: "combina com uma fonte escondida" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Comparar modelos" }));
  expect(continueButton).toBeDisabled();

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
});

it("serializes observation classifications through observation_classified", async () => {
  const store = new RecordingAttemptStore(snapshotAt("prisoner_view"));

  render(<AsSombrasLesson store={store} />);

  const perceived = await screen.findAllByRole("radio", {
    name: "Percebi",
  });
  fireEvent.click(perceived[0]);
  await waitFor(() =>
    expect(store.eventIds.at(-1)).toMatch(/:observation_classified$/),
  );

  const inferred = screen.getAllByRole("radio", { name: "Concluí" });
  fireEvent.click(inferred[1]);
  await waitFor(() => expect(store.eventIds).toHaveLength(2));

  expect(store.snapshot.sceneState.prisoner_view).toEqual({
    classifications: {
      winged_outline: "percebi",
      bird_claim: "conclui",
    },
  });
  expect(
    store.snapshot.responses.observationClassification.value,
  ).toEqual({
    winged_outline: "percebi",
    bird_claim: "conclui",
  });
});

it("emits four wall_forecast events before wall_pattern_mastery", async () => {
  const store = new RecordingAttemptStore(snapshotAt("prediction_mastery"));

  render(<AsSombrasLesson store={store} />);

  fireEvent.click(
    await screen.findByRole("button", { name: "Começar previsões" }),
  );

  for (let round = 1; round <= 4; round += 1) {
    fireEvent.click(screen.getAllByRole("radio")[0]);
    fireEvent.click(
      screen.getByRole("button", { name: "Confirmar previsão" }),
    );
    await waitFor(() => expect(store.eventIds).toHaveLength(round));
    expect(store.eventIds.at(-1)).toMatch(/:wall_forecast$/);
    if (round < 4) {
      fireEvent.click(
        screen.getByRole("button", { name: "Próxima previsão" }),
      );
    }
  }

  fireEvent.click(
    screen.getByRole("button", {
      name: "Confrontar o próximo acontecimento",
    }),
  );
  await waitFor(() => expect(store.eventIds).toHaveLength(5));

  expect(store.eventIds.at(-1)).toMatch(/:wall_pattern_mastery$/);
  expect(store.snapshot.responses.wallForecasts.value).toHaveLength(4);
  expect(store.snapshot.responses.wallPatternMastery.value).toEqual({
    coreMatches: 4,
    coreAttempted: 4,
    supportAttempted: false,
    supportMatched: null,
  });
  expect(store.snapshot.currentSceneId).toBe("impossible_shadow");
});

it("persists the supported round separately from the four-round mastery threshold", async () => {
  const store = new RecordingAttemptStore(snapshotAt("prediction_mastery"));

  render(<AsSombrasLesson store={store} />);

  fireEvent.click(
    await screen.findByRole("button", { name: "Começar previsões" }),
  );

  for (let round = 1; round <= 4; round += 1) {
    fireEvent.click(screen.getAllByRole("radio")[1]);
    fireEvent.click(
      screen.getByRole("button", { name: "Confirmar previsão" }),
    );
    await waitFor(() => expect(store.eventIds).toHaveLength(round));
    fireEvent.click(
      screen.getByRole("button", { name: "Próxima previsão" }),
    );
  }

  expect(
    screen.getByText("Previsão apoiada · 5 de 5"),
  ).toBeInTheDocument();
  fireEvent.click(screen.getAllByRole("radio")[0]);
  fireEvent.click(
    screen.getByRole("button", { name: "Confirmar previsão" }),
  );
  await waitFor(() => expect(store.eventIds).toHaveLength(5));

  expect(
    screen.getByText(/nas quatro previsões principais, 0 combinaram/i),
  ).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", {
      name: "Confrontar o próximo acontecimento",
    }),
  );
  await waitFor(() => expect(store.eventIds).toHaveLength(6));

  expect(store.snapshot.responses.wallForecasts.value).toHaveLength(5);
  expect(store.snapshot.responses.wallPatternMastery.value).toEqual({
    coreMatches: 0,
    coreAttempted: 4,
    supportAttempted: true,
    supportMatched: true,
  });
  expect(store.snapshot.currentSceneId).toBe("impossible_shadow");
});

it("restores only known forecast rounds with valid choices in canonical order", () => {
  expect(
    sanitizeWallForecasts([
      { id: "timing", choice: "third", matchedPattern: false },
      { id: "unknown", choice: "anything", matchedPattern: true },
      { id: "direction", choice: "left", matchedPattern: false },
      { id: "rhythm", choice: "invalid", matchedPattern: true },
      { id: "rhythm", choice: "long", matchedPattern: false },
      { id: "silhouette", choice: "double", matchedPattern: false },
    ]),
  ).toEqual([
    { id: "direction", choice: "left", matchedPattern: true },
    { id: "rhythm", choice: "long", matchedPattern: true },
    { id: "silhouette", choice: "double", matchedPattern: true },
    { id: "timing", choice: "third", matchedPattern: true },
  ]);
});

it("deduplicates restored forecasts and discards an unneeded support round", () => {
  expect(
    sanitizeWallForecasts([
      { id: "direction", choice: "left", matchedPattern: true },
      { id: "direction", choice: "right", matchedPattern: true },
      { id: "rhythm", choice: "long", matchedPattern: true },
      { id: "silhouette", choice: "double", matchedPattern: true },
      { id: "timing", choice: "third", matchedPattern: true },
      { id: "supported", choice: "low-high", matchedPattern: true },
    ]),
  ).toEqual([
    { id: "direction", choice: "right", matchedPattern: false },
    { id: "rhythm", choice: "long", matchedPattern: true },
    { id: "silhouette", choice: "double", matchedPattern: true },
    { id: "timing", choice: "third", matchedPattern: true },
  ]);
});

it("recomputes restored matches instead of trusting persisted flags", () => {
  expect(
    sanitizeWallForecasts([
      { id: "direction", choice: "right", matchedPattern: true },
      { id: "rhythm", choice: "three", matchedPattern: true },
      { id: "silhouette", choice: "arc", matchedPattern: true },
      { id: "timing", choice: "first", matchedPattern: true },
      { id: "supported", choice: "low-high", matchedPattern: false },
    ]),
  ).toEqual([
    { id: "direction", choice: "right", matchedPattern: false },
    { id: "rhythm", choice: "three", matchedPattern: false },
    { id: "silhouette", choice: "arc", matchedPattern: false },
    { id: "timing", choice: "first", matchedPattern: false },
    { id: "supported", choice: "low-high", matchedPattern: true },
  ]);
});

it("persists anomaly_noticed before the learner-selected first clue", async () => {
  const store = new RecordingAttemptStore(snapshotAt("impossible_shadow"));

  render(<AsSombrasLesson store={store} />);

  fireEvent.click(
    await screen.findByRole("button", {
      name: "Reproduzir acontecimento",
    }),
  );
  await waitFor(() => expect(store.eventIds).toHaveLength(1));
  expect(store.eventIds[0]).toMatch(/:anomaly_noticed$/);

  fireEvent.click(
    screen.getByRole("button", { name: /investigar primeiro: som/i }),
  );
  await waitFor(() => expect(store.eventIds).toHaveLength(2));

  expect(store.eventIds[1]).toMatch(/:first_clue_selected$/);
  expect(store.snapshot.responses.anomalyNotice.value).toEqual({
    noticed: true,
  });
  expect(store.snapshot.responses.firstClue.value).toBe("som");
});

it("refuses an invalid restored first clue until the learner selects a valid one", async () => {
  const store = new RecordingAttemptStore(
    snapshotAt("impossible_shadow", {
      sceneState: {
        anomalyNoticed: true,
        firstClue: "inventada",
      },
    }),
  );

  render(<AsSombrasLesson store={store} />);

  const continueButton = await screen.findByRole("button", {
    name: "Seguir a incompatibilidade",
  });
  expect(continueButton).toBeDisabled();
  expect(
    screen.queryByRole("img", { name: /platão/i }),
  ).not.toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", {
      name: /investigar primeiro: repetição/i,
    }),
  );
  await waitFor(() => expect(store.eventIds).toHaveLength(1));
  fireEvent.click(continueButton);
  await waitFor(() =>
    expect(store.snapshot.currentSceneId).toBe("evidence_investigation"),
  );

  expect(store.snapshot.sceneState.impossible_shadow).toMatchObject({
    firstClue: "repeticao",
  });
  const clueList = await screen.findByRole("list", {
    name: "Pistas disponíveis",
  });
  expect(
    clueList.querySelector("button"),
  ).toHaveAccessibleName(/a mesma voz, outra forma/i);
  expect(
    screen.queryByRole("button", { name: /expor teste mais forte/i }),
  ).not.toBeInTheDocument();
});

it("repairs a missing first-clue response from valid restored Scene 3 state", async () => {
  const store = new RecordingAttemptStore(
    snapshotAt("impossible_shadow", {
      sceneState: {
        anomalyNoticed: true,
        firstClue: "tempo",
      },
    }),
  );

  render(<AsSombrasLesson store={store} />);

  const continueButton = await screen.findByRole("button", {
    name: "Seguir a incompatibilidade",
  });
  expect(continueButton).toBeEnabled();
  fireEvent.click(continueButton);

  await waitFor(() =>
    expect(store.snapshot.currentSceneId).toBe("evidence_investigation"),
  );
  expect(store.snapshot.responses.firstClue).toEqual({
    visibility: "teacher_visible_task",
    value: "tempo",
  });
  expect(
    await screen.findByRole("button", {
      name: /examinar passos fora do contorno/i,
    }),
  ).toBeInTheDocument();
});

it.each([
  ["ausente", undefined],
  ["inválida", "inventada"],
])(
  "blocks Scene 4 with a recoverable prerequisite when the first clue is %s",
  async (_caseName, firstClue) => {
    const responses: Readonly<Record<string, ResponseEnvelope>> =
      firstClue === undefined
        ? {}
        : {
            firstClue: {
              visibility: "teacher_visible_task",
              value: firstClue,
            },
          };
    const store = new RecordingAttemptStore(
      snapshotAt("evidence_investigation", { responses }),
    );

    render(<AsSombrasLesson store={store} />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /primeira pista válida/i,
    );
    expect(
      screen.queryByRole("list", { name: "Pistas disponíveis" }),
    ).not.toBeInTheDocument();
    expect(store.eventIds).toHaveLength(0);
  },
);

it("falls back cleanly when Scene 4 restores without usable history", async () => {
  const strandedSnapshot = snapshotAt("evidence_investigation");
  const store = new RecordingAttemptStore({
    ...strandedSnapshot,
    visitedSceneIds: ["evidence_investigation"],
  });

  render(<AsSombrasLesson store={store} />);

  expect(
    await screen.findByRole("heading", {
      name: "O que uma sombra deixa de fora?",
    }),
  ).toBeInTheDocument();
  expect(store.eventIds).toHaveLength(0);
});

it("keeps an inconsistent restored evidence gate closed until every opened clue is compared", async () => {
  const store = new RecordingAttemptStore(
    snapshotAt("evidence_investigation", {
      responses: {
        firstClue: {
          visibility: "teacher_visible_task",
          value: "som",
        },
      },
      sceneState: {
        inspectedClueIds: ["som", "forma", "tempo", "inventada"],
        comparisons: {
          som: "fonte",
          forma: "ambos",
          inventada: "parede",
        },
      },
    }),
  );

  render(<AsSombrasLesson store={store} />);

  expect(
    await screen.findByText(/1 pista aberta ainda precisa de comparação/i),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Pode continuar" }),
  ).toBeDisabled();
});

it("records clue_inspected and model_fit_compared twice before Scene 4 advances", async () => {
  const store = new RecordingAttemptStore(
    snapshotAt("evidence_investigation", {
      responses: {
        firstClue: {
          visibility: "teacher_visible_task",
          value: "tempo",
        },
      },
    }),
  );

  render(<AsSombrasLesson store={store} />);

  for (const clueName of ["passos fora do contorno", "forma estável"]) {
    fireEvent.click(
      await screen.findByRole("button", {
        name: new RegExp(`examinar ${clueName}`, "i"),
      }),
    );
    await waitFor(() =>
      expect(store.eventIds.at(-1)).toMatch(/:clue_inspected$/),
    );
    fireEvent.click(
      screen.getByRole("radio", {
        name: "combina com uma fonte escondida",
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Comparar modelos" }),
    );
    await waitFor(() =>
      expect(store.eventIds.at(-1)).toMatch(/:model_fit_compared$/),
    );
  }

  expect(store.eventIds.filter((id) => /:clue_inspected$/.test(id))).toHaveLength(
    2,
  );
  expect(
    store.eventIds.filter((id) => /:model_fit_compared$/.test(id)),
  ).toHaveLength(2);
  expect(store.snapshot.responses.inspectedClues.value).toEqual([
    "tempo",
    "forma",
  ]);
  expect(store.snapshot.responses.modelFitComparisons.value).toEqual({
    tempo: "fonte",
    forma: "fonte",
  });
  expect(screen.getByRole("button", { name: "Pode continuar" })).toBeEnabled();
});
