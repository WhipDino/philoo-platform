import type {
  AttemptSnapshot,
  AttemptStore,
  JsonObject,
  JsonValue,
  ResponseEnvelope,
  VisibilityClass,
} from "./contracts";

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
    value.currentSceneId.length > 0 &&
    Array.isArray(value.visitedSceneIds) &&
    value.visitedSceneIds.length > 0 &&
    value.visitedSceneIds.every(
      (sceneId) => typeof sceneId === "string" && sceneId.length > 0,
    ) &&
    value.visitedSceneIds.at(-1) === value.currentSceneId &&
    isSceneState(value.sceneState) &&
    isResponses(value.responses) &&
    Number.isSafeInteger(value.sequence) &&
    (value.sequence as number) >= 0 &&
    (value.status === "in_progress" || value.status === "completed")
  );
}

function isSceneState(
  value: unknown,
): value is AttemptSnapshot["sceneState"] {
  return isRecord(value) && Object.values(value).every(isJsonObject);
}

function isResponses(
  value: unknown,
): value is AttemptSnapshot["responses"] {
  return isRecord(value) && Object.values(value).every(isResponseEnvelope);
}

function isResponseEnvelope(value: unknown): value is ResponseEnvelope {
  return (
    isRecord(value) &&
    isVisibilityClass(value.visibility) &&
    isJsonValue(value.value)
  );
}

function isVisibilityClass(value: unknown): value is VisibilityClass {
  return (
    value === "private_reflection" ||
    value === "teacher_visible_task" ||
    value === "derived_rubric" ||
    value === "system_telemetry"
  );
}

function isJsonObject(value: unknown): value is JsonObject {
  return isRecord(value) && Object.values(value).every(isJsonValue);
}

function isJsonValue(value: unknown): value is JsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    (typeof value === "number" && Number.isFinite(value)) ||
    typeof value === "boolean"
  ) {
    return true;
  }

  return Array.isArray(value)
    ? value.every(isJsonValue)
    : isJsonObject(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
