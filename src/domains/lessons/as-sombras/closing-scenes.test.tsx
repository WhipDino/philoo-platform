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
import { AsSombrasLesson } from "./as-sombras-player";
import { DefendModelScene } from "./defend-model-scene";
import { asSombrasManifest } from "./manifest";
import { RevisionScene } from "./revision-scene";
import { TransferScene } from "./transfer-scene";

afterEach(cleanup);

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

const noOpCerCallbacks = {
  onClaimBuilt: vi.fn(),
  onEvidenceLinked: vi.fn(),
  onRivalAcknowledged: vi.fn(),
  onConfidenceRecorded: vi.fn(),
  onReview: vi.fn(),
  onContinue: vi.fn(),
};

it("keeps the Pattern-Keeper central and shows the exact strong argument before Plato reviews", () => {
  const { rerender } = render(
    <DefendModelScene
      inspectedClueIds={["som", "forma"]}
      value={{}}
      {...noOpCerCallbacks}
    />,
  );

  expect(
    screen.getByText(
      "A parede é a única evidência que todos podem conferir. Ela sempre nos ajudou a prever. Um som estranho não prova um mundo invisível.",
    ),
  ).toBeInTheDocument();
  expect(screen.getByText("Guardiã do Padrão")).toBeInTheDocument();
  expect(screen.queryByRole("img", { name: /platão/i })).not.toBeInTheDocument();

  rerender(
    <DefendModelScene
      inspectedClueIds={["som", "forma"]}
      value={{
        claim: "hidden_source",
        clue: "som",
        bridge: "independent_channels",
        acknowledgment: "predictive",
        confidence: "media",
        reviewed: true,
        coherent: true,
      }}
      {...noOpCerCallbacks}
    />,
  );

  expect(
    screen.getByRole("img", { name: "Platão revisa sua resposta" }),
  ).toHaveAttribute("src", expect.stringContaining("platao-master.webp"));
});

it("restores the exact private prologue hypothesis and uses exact strategy feedback", () => {
  render(
    <RevisionScene
      initialHypothesis="Talvez as sombras sejam seres reais."
      value={{
        strategy: "maintain",
        decisiveClue: "som",
        recorded: true,
      }}
      privateNote=""
      onHypothesisRevisited={vi.fn()}
      onRevisionRecorded={vi.fn()}
      onContinue={vi.fn()}
    />,
  );

  expect(
    screen.getAllByText("Talvez as sombras sejam seres reais."),
  ).not.toHaveLength(0);
  expect(
    screen.getByText(
      "Manter uma ideia depois de testá-la não é o mesmo que ignorar evidência.",
    ),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("img", { name: "Platão comenta sua estratégia" }),
  ).toHaveAttribute("src", expect.stringContaining("platao-master.webp"));
});

it("shows the neutral revision path when no prologue hypothesis exists", () => {
  render(
    <RevisionScene
      initialHypothesis={null}
      value={{}}
      privateNote=""
      onHypothesisRevisited={vi.fn()}
      onRevisionRecorded={vi.fn()}
      onContinue={vi.fn()}
    />,
  );

  expect(
    screen.getByText("Você ainda pode registrar sua leitura de agora"),
  ).toBeInTheDocument();
});

it("renders a deterministic crop before reveal and visible disagreement after it", () => {
  const { rerender } = render(
    <TransferScene
      value={{ confidence: "media" }}
      canComplete
      onConfidenceRecorded={vi.fn()}
      onContextRevealed={vi.fn()}
      onClassified={vi.fn()}
      onComplete={vi.fn()}
    />,
  );

  expect(screen.getByText("Todos apoiaram a nova regra")).toBeInTheDocument();
  expect(screen.queryByText("DISCORDO")).not.toBeInTheDocument();
  expect(screen.queryByText("2 vozes contrárias")).not.toBeInTheDocument();

  rerender(
    <TransferScene
      value={{ confidence: "media", contextRevealed: true }}
      canComplete
      onConfidenceRecorded={vi.fn()}
      onContextRevealed={vi.fn()}
      onClassified={vi.fn()}
      onComplete={vi.fn()}
    />,
  );

  expect(screen.getByText("DISCORDO")).toBeInTheDocument();
  expect(screen.getByText("2 vozes contrárias")).toBeInTheDocument();
  expect(
    screen.getByText("A imagem é falsa — ou a conclusão foi além dela?"),
  ).toBeInTheDocument();
});

it("persists revision text privately and records strategy only after the first commit resolves", async () => {
  const hypothesis = "A parede mostra criaturas reais.";
  const store = new RecordingAttemptStore(
    snapshotAt("revision_map", {
      responses: {
        prologueHypothesis: {
          visibility: "private_reflection",
          value: hypothesis,
        },
      },
    }),
  );
  render(<AsSombrasLesson store={store} />);

  expect(await screen.findByText(hypothesis)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("radio", { name: "Revisar" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Registrar estratégia" }),
  );
  await waitFor(() => expect(store.eventIds).toHaveLength(1));
  expect(store.eventIds[0]).toMatch(/:hypothesis_revisited$/);

  fireEvent.click(
    screen.getByRole("radio", {
      name: "A voz humana junto da projeção",
    }),
  );
  fireEvent.change(
    screen.getByRole("textbox", { name: "Sua leitura de agora (opcional)" }),
    { target: { value: "Agora penso em uma fonte escondida." } },
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Registrar comparação" }),
  );
  await waitFor(() => expect(store.eventIds).toHaveLength(2));

  expect(store.eventIds[1]).toMatch(/:revision_recorded$/);
  expect(store.snapshot.responses.revision.value).toEqual({
    strategy: "revise",
    decisiveClue: "som",
  });
  expect(store.snapshot.responses.revisionPrivateNote).toEqual({
    visibility: "private_reflection",
    value: "Agora penso em uma fonte escondida.",
  });
});

it("does not complete a tampered resume that bypasses core reasoning evidence", async () => {
  const store = new RecordingAttemptStore(
    snapshotAt("transfer_case", {
      sceneState: {
        confidence: "alta",
        contextRevealed: true,
        representation: "representation",
        sourceEvent: "source_event",
        caption: "claim",
        sufficiency: "insufficient",
        nextEvidence: "minutes",
        classified: true,
      },
      responses: {
        wallForecasts: {
          visibility: "teacher_visible_task",
          value: [{ nope: true }, "tampered", null, false],
        },
        inspectedClues: {
          visibility: "teacher_visible_task",
          value: ["som", "invented"],
        },
        defendedModel: {
          visibility: "teacher_visible_task",
          value: { claim: "anything" },
        },
      },
    }),
  );

  render(<AsSombrasLesson store={store} />);

  const complete = await screen.findByRole("button", {
    name: "Concluir investigação",
  });
  expect(complete).toBeDisabled();
  fireEvent.click(complete);
  expect(store.eventIds).toHaveLength(0);
  expect(store.snapshot.status).toBe("in_progress");
});

it("completes after all core evidence exists even when first attempts were imperfect", async () => {
  const completeResponses: Record<string, ResponseEnvelope> = {
    wallForecasts: {
      visibility: "teacher_visible_task",
      value: [
        { id: "direction", choice: "left", matchedPattern: false },
        { id: "rhythm", choice: "three", matchedPattern: false },
        { id: "silhouette", choice: "arc", matchedPattern: false },
        { id: "timing", choice: "first", matchedPattern: false },
      ],
    },
    inspectedClues: {
      visibility: "teacher_visible_task",
      value: ["som", "tempo"],
    },
    causalModel: {
      visibility: "teacher_visible_task",
      value: {
        projectionSource: "bird_artifact",
        soundSource: "human_carrier",
        causalLinks: [
          "fire_illuminates_artifact",
          "artifact_blocks_light",
          "projection_reaches_wall",
          "carrier_produces_voice_and_steps",
        ],
      },
    },
    counterfactualPrediction: {
      visibility: "teacher_visible_task",
      value: {
        changedVariable: "artifact_distance_from_light",
        prediction: "projection_decreases",
        observedConsequence: "projection_increases",
        beforeScale: 2,
        afterScale: 3,
        matched: false,
      },
    },
    defendedModel: {
      visibility: "teacher_visible_task",
      value: {
        claim: "hidden_source",
        clue: "som",
        bridge: "independent_channels",
        acknowledgment: "predictive",
        confidence: "baixa",
        reviewed: true,
        coherent: true,
      },
    },
    revision: {
      visibility: "teacher_visible_task",
      value: {
        strategy: "uncertain",
        decisiveClue: "tempo",
      },
    },
  };
  const store = new RecordingAttemptStore(
    snapshotAt("transfer_case", {
      responses: completeResponses,
      sceneState: {
        confidence: "baixa",
        contextRevealed: true,
      },
    }),
  );
  render(<AsSombrasLesson store={store} />);

  fireEvent.click(
    await screen.findByRole("radio", {
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
      name: "Ver a gravação completa",
    }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Comparar classificações" }),
  );
  await waitFor(() =>
    expect(store.eventIds.at(-1)).toMatch(/:transfer_classified$/),
  );

  fireEvent.click(
    screen.getByRole("button", { name: "Concluir investigação" }),
  );

  expect(
    await screen.findByRole("heading", {
      name: "Investigação concluída",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      "Você ainda não saiu da caverna. Mas a parede já não explica tudo.",
    ),
  ).toBeInTheDocument();
  expect(store.eventIds.at(-1)).toMatch(/:complete_session$/);
});
