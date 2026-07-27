import { describe, expect, it } from "vitest";
import type { AttemptSnapshot } from "./contracts";
import { LocalAttemptStore } from "./local-attempt-store";

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();
  writes = 0;

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.writes += 1;
    this.values.set(key, value);
  }
}

const snapshot: AttemptSnapshot = {
  lessonId: "lesson.sombras",
  lessonVersion: "1.0.0",
  currentSceneId: "prologue",
  visitedSceneIds: ["prologue"],
  sceneState: { prologue: { draft: "Sombras mostram contornos." } },
  responses: {
    prologueHypothesis: {
      visibility: "private_reflection",
      value: "Sombras mostram contornos.",
    },
  },
  sequence: 1,
  status: "in_progress",
};

describe("local attempt store", () => {
  it("returns null when no saved attempt exists", async () => {
    const store = new LocalAttemptStore({ storage: new MemoryStorage() });

    await expect(store.restore("lesson.sombras", "1.0.0")).resolves.toBeNull();
  });

  it("writes a versioned JSON attempt record", async () => {
    const storage = new MemoryStorage();
    const store = new LocalAttemptStore({ storage });

    await store.commit({ eventId: "event-1", next: snapshot });

    expect(storage.getItem("philoo:attempt:lesson.sombras:1.0.0")).toBe(
      JSON.stringify(snapshot),
    );
  });

  it("returns null for invalid saved JSON", async () => {
    const storage = new MemoryStorage();
    storage.setItem("philoo:attempt:lesson.sombras:1.0.0", "not-json");
    const store = new LocalAttemptStore({ storage });

    await expect(store.restore("lesson.sombras", "1.0.0")).resolves.toBeNull();
  });

  it.each([
    [
      "non-object scene state",
      { ...snapshot, sceneState: { prologue: "not-an-object" } },
    ],
    ["non-envelope response", { ...snapshot, responses: { answer: 1 } }],
    [
      "unknown response visibility",
      {
        ...snapshot,
        responses: {
          answer: {
            visibility: "public",
            value: "Sombras mostram contornos.",
          },
        },
      },
    ],
    [
      "missing response value",
      {
        ...snapshot,
        responses: {
          answer: { visibility: "private_reflection" },
        },
      },
    ],
  ])("returns null for valid JSON with %s", async (_, corruptedSnapshot) => {
    const storage = new MemoryStorage();
    storage.setItem(
      "philoo:attempt:lesson.sombras:1.0.0",
      JSON.stringify(corruptedSnapshot),
    );
    const store = new LocalAttemptStore({ storage });

    await expect(store.restore("lesson.sombras", "1.0.0")).resolves.toBeNull();
  });

  it("returns null when a response number cannot round-trip through JSON", async () => {
    const storage = new MemoryStorage();
    const rawSnapshot = JSON.stringify({
      ...snapshot,
      responses: {
        answer: {
          visibility: "private_reflection",
          value: "NON_FINITE_NUMBER",
        },
      },
    }).replace('"value":"NON_FINITE_NUMBER"', '"value":1e400');
    storage.setItem(
      "philoo:attempt:lesson.sombras:1.0.0",
      rawSnapshot,
    );
    const store = new LocalAttemptStore({ storage });

    await expect(store.restore("lesson.sombras", "1.0.0")).resolves.toBeNull();
  });

  it("does not restore an attempt that belongs to another lesson version", async () => {
    const storage = new MemoryStorage();
    storage.setItem(
      "philoo:attempt:lesson.sombras:1.0.0",
      JSON.stringify({ ...snapshot, lessonVersion: "0.9.0" }),
    );
    const store = new LocalAttemptStore({ storage });

    await expect(store.restore("lesson.sombras", "1.0.0")).resolves.toBeNull();
  });

  it("does not double-write retries with the same event ID", async () => {
    const storage = new MemoryStorage();
    const store = new LocalAttemptStore({ storage });

    await store.commit({ eventId: "event-1", next: snapshot });
    await store.commit({
      eventId: "event-1",
      next: { ...snapshot, sequence: 2, currentSceneId: "wall" },
    });

    expect(storage.writes).toBe(1);
    expect(JSON.parse(storage.getItem("philoo:attempt:lesson.sombras:1.0.0")!)).toEqual(
      snapshot,
    );
  });

  it("handles browser storage failures without crashing restore or commit", async () => {
    const unavailableStorage: Storage = {
      length: 0,
      clear: () => undefined,
      getItem: () => {
        throw new Error("Storage unavailable");
      },
      key: () => null,
      removeItem: () => undefined,
      setItem: () => {
        throw new Error("Storage unavailable");
      },
    };
    const store = new LocalAttemptStore({ storage: unavailableStorage });

    await expect(store.restore("lesson.sombras", "1.0.0")).resolves.toBeNull();
    await expect(store.commit({ eventId: "event-1", next: snapshot })).rejects.toThrow(
      /unable to persist lesson attempt/i,
    );
  });
});
