import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type {
  AttemptSnapshot,
  AttemptStore,
  LessonManifest,
  SceneCommit,
  SceneNode,
} from "./contracts";
import { LessonPlayer, type LessonSceneRenderProps } from "./lesson-player";
import { createInitialSnapshot } from "./runtime";

const scenes = [
  {
    id: "entry",
    arcId: "entry",
    kind: "entry",
    mode: "custom",
    title: "Entrada",
    savePoint: true,
    config: { countsTowardProgress: false },
    transitions: [{ name: "begin", to: "wall" }],
  },
  {
    id: "wall",
    arcId: "act_1",
    kind: "wall",
    mode: "custom",
    title: "Só a parede",
    savePoint: true,
    config: { countsTowardProgress: true },
    transitions: [{ name: "continue", to: "model" }],
  },
  {
    id: "model",
    arcId: "act_2",
    kind: "model",
    mode: "custom",
    title: "Testar o modelo",
    savePoint: true,
    config: { countsTowardProgress: true },
    transitions: [{ name: "finish", to: "$complete" }],
  },
] as const satisfies readonly SceneNode[];

type TestScene = (typeof scenes)[number];

const manifest: LessonManifest<TestScene> = {
  identity: {
    id: "lesson.player.test",
    slug: "player-test",
    locale: "pt-BR",
    version: "1.0.0",
    contentHash: "player-test-v1",
  },
  title: "Investigação de teste",
  entrySceneId: "entry",
  arcs: [
    { id: "entry", title: "Entrada", sceneIds: ["entry"] },
    { id: "act_1", title: "A parede", sceneIds: ["wall"] },
    { id: "act_2", title: "O modelo", sceneIds: ["model"] },
  ],
  scenes,
};

class MemoryAttemptStore implements AttemptStore {
  snapshot: AttemptSnapshot | null;
  rejectNextCommit = false;
  readonly commitAttempts: {
    readonly eventId: string;
    readonly next: AttemptSnapshot;
  }[] = [];

  constructor(snapshot: AttemptSnapshot | null = null) {
    this.snapshot = snapshot;
  }

  async restore() {
    return this.snapshot;
  }

  async commit(input: { eventId: string; next: AttemptSnapshot }) {
    this.commitAttempts.push(input);
    if (this.rejectNextCommit) {
      this.rejectNextCommit = false;
      throw new Error("storage unavailable");
    }
    this.snapshot = input.next;
  }
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((next) => {
    resolve = next;
  });
  return { promise, resolve };
}

function renderTestScene({
  scene,
  sceneState,
  commit,
}: LessonSceneRenderProps<TestScene>) {
  const transitions: Record<TestScene["id"], SceneCommit> = {
    entry: {
      eventName: "entry_finished",
      nextSceneState: {},
      transition: "begin",
    },
    wall: {
      eventName: "wall_finished",
      nextSceneState: { note: "estado preservado" },
      transition: "continue",
    },
    model: {
      eventName: "model_finished",
      nextSceneState: {},
      transition: "finish",
    },
  };

  return (
    <section aria-label={`Cena ${scene.title}`}>
      <h1 tabIndex={-1}>{scene.title}</h1>
      {"note" in sceneState ? <p>{String(sceneState.note)}</p> : null}
      <button type="button" onClick={() => void commit(transitions[scene.id])}>
        Avançar
      </button>
    </section>
  );
}

function renderPlayer(store: AttemptStore) {
  return render(
    <LessonPlayer
      manifest={manifest}
      store={store}
      renderScene={renderTestScene}
      onExitHref="/inicio"
    />,
  );
}

afterEach(cleanup);

describe("LessonPlayer", () => {
  it("restores the attempt before showing any scene", async () => {
    const restoration = deferred<AttemptSnapshot | null>();
    const store: AttemptStore = {
      restore: () => restoration.promise,
      commit: async () => {},
    };

    renderPlayer(store);

    expect(
      screen.getByRole("status", { name: "Abrindo sua investigação…" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();

    restoration.resolve(null);

    expect(
      await screen.findByRole("heading", { name: "Entrada" }),
    ).toBeInTheDocument();
  });

  it("commits before rendering the next named scene", async () => {
    const pendingCommit = deferred<void>();
    const store: AttemptStore = {
      restore: async () => null,
      commit: () => pendingCommit.promise,
    };

    renderPlayer(store);
    fireEvent.click(await screen.findByRole("button", { name: "Avançar" }));

    expect(
      screen.getByRole("heading", { name: "Entrada" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Só a parede" }),
    ).not.toBeInTheDocument();

    pendingCommit.resolve();

    expect(
      await screen.findByRole("heading", { name: "Só a parede" }),
    ).toBeInTheDocument();
  });

  it("focuses the scene heading and reports counted progress after a forward transition", async () => {
    renderPlayer(new MemoryAttemptStore());

    fireEvent.click(await screen.findByRole("button", { name: "Avançar" }));

    const heading = await screen.findByRole("heading", {
      name: "Só a parede",
    });
    await waitFor(() => expect(heading).toHaveFocus());
    expect(screen.getByText("1 de 2")).toBeInTheDocument();
    expect(
      screen.getByRole("listitem", { name: "Só a parede" }),
    ).toHaveAttribute("aria-current", "step");
  });

  it("returns through visited scenes without discarding their saved state", async () => {
    const atWall = {
      ...createInitialSnapshot(manifest),
      currentSceneId: "wall",
      visitedSceneIds: ["entry", "wall"],
    };
    renderPlayer(new MemoryAttemptStore(atWall));

    fireEvent.click(await screen.findByRole("button", { name: "Avançar" }));
    expect(
      await screen.findByRole("heading", { name: "Testar o modelo" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Voltar" }));

    expect(
      await screen.findByRole("heading", { name: "Só a parede" }),
    ).toBeInTheDocument();
    expect(screen.getByText("estado preservado")).toBeInTheDocument();
  });

  it("keeps the scene visible and offers an exact retry after persistence fails", async () => {
    const store = new MemoryAttemptStore();
    store.rejectNextCommit = true;
    renderPlayer(store);

    fireEvent.click(await screen.findByRole("button", { name: "Avançar" }));

    expect(
      await screen.findByText("Não foi possível guardar esta etapa"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Entrada" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Avançar" }));

    expect(
      screen.getByRole("heading", { name: "Entrada" }),
    ).toBeInTheDocument();
    expect(store.commitAttempts).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "Tentar de novo" }));

    expect(
      await screen.findByRole("heading", { name: "Só a parede" }),
    ).toBeInTheDocument();
    expect(store.commitAttempts).toHaveLength(2);
    expect(store.commitAttempts[1]).toEqual(store.commitAttempts[0]);
  });

  it("shows the completed investigation and its exit after the final commit", async () => {
    const atModel = {
      ...createInitialSnapshot(manifest),
      currentSceneId: "model",
      visitedSceneIds: ["entry", "wall", "model"],
    };
    renderPlayer(new MemoryAttemptStore(atModel));

    fireEvent.click(await screen.findByRole("button", { name: "Avançar" }));

    expect(
      await screen.findByRole("heading", {
        name: "Investigação concluída",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voltar ao início" })).toHaveAttribute(
      "href",
      "/inicio",
    );
  });

  it("contains scene render failures and retries without leaving the route", async () => {
    let shouldThrow = true;

    render(
      <LessonPlayer
        manifest={manifest}
        store={new MemoryAttemptStore()}
        renderScene={(props) => {
          if (shouldThrow) {
            throw new Error("broken scene");
          }
          return renderTestScene(props);
        }}
        onExitHref="/inicio"
      />,
    );

    expect(
      await screen.findByRole("heading", {
        name: "Esta cena encontrou um problema",
      }),
    ).toBeInTheDocument();

    shouldThrow = false;
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(
      await screen.findByRole("heading", { name: "Entrada" }),
    ).toBeInTheDocument();
    expect(window.location.pathname).not.toBe("/inicio");
  });
});
