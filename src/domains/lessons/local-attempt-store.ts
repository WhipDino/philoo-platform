import type { AttemptSnapshot, AttemptStore } from "./contracts";

const DEFAULT_KEY_PREFIX = "philoo:attempt";

export class LocalAttemptStoreError extends Error {
  constructor() {
    super("Unable to persist lesson attempt locally.");
    this.name = "LocalAttemptStoreError";
  }
}

export class LocalAttemptStore implements AttemptStore {
  private readonly committedEventIds = new Set<string>();
  private readonly keyPrefix: string;

  constructor(
    private readonly options: {
      readonly storage: Storage;
      readonly keyPrefix?: string;
    },
  ) {
    this.keyPrefix = options.keyPrefix ?? DEFAULT_KEY_PREFIX;
  }

  async restore(
    lessonId: string,
    lessonVersion: string,
  ): Promise<AttemptSnapshot | null> {
    try {
      const rawSnapshot = this.options.storage.getItem(
        this.getKey(lessonId, lessonVersion),
      );
      if (rawSnapshot === null) {
        return null;
      }

      const parsedSnapshot: unknown = JSON.parse(rawSnapshot);
      return isAttemptSnapshot(parsedSnapshot, lessonId, lessonVersion)
        ? parsedSnapshot
        : null;
    } catch {
      return null;
    }
  }

  async commit(input: {
    readonly eventId: string;
    readonly next: AttemptSnapshot;
  }): Promise<void> {
    if (this.committedEventIds.has(input.eventId)) {
      return;
    }

    try {
      this.options.storage.setItem(
        this.getKey(input.next.lessonId, input.next.lessonVersion),
        JSON.stringify(input.next),
      );
      this.committedEventIds.add(input.eventId);
    } catch {
      throw new LocalAttemptStoreError();
    }
  }

  private getKey(lessonId: string, lessonVersion: string): string {
    return `${this.keyPrefix}:${lessonId}:${lessonVersion}`;
  }
}

function isAttemptSnapshot(
  value: unknown,
  lessonId: string,
  lessonVersion: string,
): value is AttemptSnapshot {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.lessonId === lessonId &&
    value.lessonVersion === lessonVersion &&
    typeof value.currentSceneId === "string" &&
    Array.isArray(value.visitedSceneIds) &&
    value.visitedSceneIds.every((sceneId) => typeof sceneId === "string") &&
    isRecord(value.sceneState) &&
    isRecord(value.responses) &&
    typeof value.sequence === "number" &&
    (value.status === "in_progress" || value.status === "completed")
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
