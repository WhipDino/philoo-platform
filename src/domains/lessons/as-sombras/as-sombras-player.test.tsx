import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import type { AttemptSnapshot, AttemptStore } from "../contracts";
import { createInitialSnapshot } from "../runtime";
import {
  AsSombrasLesson,
  ResilientStorage,
} from "./as-sombras-player";
import { asSombrasManifest } from "./manifest";

class MethodThrowingStorage implements Storage {
  get length(): number {
    throw new Error("storage blocked");
  }

  clear(): void {
    throw new Error("storage blocked");
  }

  getItem(): string | null {
    throw new Error("storage blocked");
  }

  key(): string | null {
    throw new Error("storage blocked");
  }

  removeItem(): void {
    throw new Error("storage blocked");
  }

  setItem(): void {
    throw new Error("storage blocked");
  }
}

class DeferredAttemptStore implements AttemptStore {
  snapshot: AttemptSnapshot | null;
  readonly commitAttempts: AttemptSnapshot[] = [];
  private firstCommitResolver: (() => void) | null = null;
  private readonly firstCommit = new Promise<void>((resolve) => {
    this.firstCommitResolver = resolve;
  });

  constructor(snapshot: AttemptSnapshot | null = null) {
    this.snapshot = snapshot;
  }

  async restore() {
    return this.snapshot;
  }

  async commit({ next }: { eventId: string; next: AttemptSnapshot }) {
    this.commitAttempts.push(next);
    if (this.commitAttempts.length === 1) {
      await this.firstCommit;
    }
    this.snapshot = next;
  }

  resolveFirstCommit() {
    this.firstCommitResolver?.();
  }
}

class RejectOnceAttemptStore implements AttemptStore {
  snapshot: AttemptSnapshot | null = null;
  commitAttempts = 0;

  async restore() {
    return this.snapshot;
  }

  async commit({ next }: { eventId: string; next: AttemptSnapshot }) {
    this.commitAttempts += 1;
    if (this.commitAttempts === 1) {
      throw new Error("storage temporarily unavailable");
    }
    this.snapshot = next;
  }
}

afterEach(cleanup);

it("falls back to volatile storage when browser storage methods throw", () => {
  const storage = new ResilientStorage(new MethodThrowingStorage());

  expect(storage.getItem("attempt")).toBeNull();

  storage.setItem("attempt", "saved");

  expect(storage.getItem("attempt")).toBe("saved");
  expect(storage.length).toBe(1);
});

it("serializes prologue registration before Start and announces only after commit", async () => {
  const store = new DeferredAttemptStore();

  render(<AsSombrasLesson store={store} />);

  fireEvent.change(
    await screen.findByRole("textbox", { name: /sua hipótese provisória/i }),
    { target: { value: "A sombra mostra um efeito, não a fonte." } },
  );
  fireEvent.click(
    screen.getByRole("button", { name: /registrar hipótese/i }),
  );

  expect(
    screen.getByRole("button", { name: /registrar hipótese/i }),
  ).toBeDisabled();
  expect(
    screen.getByRole("button", { name: /começar a investigação/i }),
  ).toBeDisabled();
  expect(
    screen.queryByText(/hipótese registrada\. você pode revisá-la/i),
  ).not.toBeInTheDocument();
  expect(store.commitAttempts).toHaveLength(1);

  fireEvent.click(
    screen.getByRole("button", { name: /começar a investigação/i }),
  );
  expect(store.commitAttempts).toHaveLength(1);

  store.resolveFirstCommit();

  expect(
    await screen.findByText(/hipótese registrada\. você pode revisá-la/i),
  ).toBeInTheDocument();
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: /começar a investigação/i }),
    ).toBeEnabled(),
  );

  fireEvent.click(
    screen.getByRole("button", { name: /começar a investigação/i }),
  );

  expect(
    await screen.findByRole("heading", { name: "Só a parede" }),
  ).toBeInTheDocument();
  expect(store.commitAttempts).toHaveLength(2);
});

it("returns Back focus to the prologue continuation context", async () => {
  const atPrisonerView = {
    ...createInitialSnapshot(asSombrasManifest),
    currentSceneId: "prisoner_view",
    visitedSceneIds: ["prologue_corte_de_luz", "prisoner_view"],
  };
  const store = new DeferredAttemptStore(atPrisonerView);
  store.resolveFirstCommit();

  render(<AsSombrasLesson store={store} />);

  fireEvent.click(await screen.findByRole("button", { name: "Voltar" }));

  await screen.findByRole("heading", {
    name: /o que uma sombra deixa de fora/i,
  });
  await waitFor(() =>
    expect(
      screen.getByRole("button", {
        name: /começar a investigação/i,
      }),
    ).toHaveFocus(),
  );
});

it("keeps both prologue actions pending until a failed registration retry succeeds", async () => {
  const store = new RejectOnceAttemptStore();

  render(<AsSombrasLesson store={store} />);

  fireEvent.change(
    await screen.findByRole("textbox", { name: /sua hipótese provisória/i }),
    { target: { value: "A forma não explica a origem." } },
  );
  fireEvent.click(
    screen.getByRole("button", { name: /registrar hipótese/i }),
  );

  expect(
    await screen.findByText("Não foi possível guardar esta etapa"),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /registrar hipótese/i }),
  ).toBeDisabled();
  expect(
    screen.getByRole("button", { name: /começar a investigação/i }),
  ).toBeDisabled();
  expect(
    screen.queryByText(/hipótese registrada\. você pode revisá-la/i),
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Tentar de novo" }));

  expect(
    await screen.findByText(/hipótese registrada\. você pode revisá-la/i),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /começar a investigação/i }),
  ).toBeEnabled();
  expect(store.commitAttempts).toBe(2);
});
