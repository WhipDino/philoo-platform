export type JsonValue =
  | string
  | number
  | boolean
  | null
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };

export type JsonObject = { readonly [key: string]: JsonValue };
export type SceneMode = "composable" | "custom";
export type SceneTarget = string | "$complete";

export interface NamedTransition {
  readonly name: string;
  readonly to: SceneTarget;
}

export interface SceneNode<
  K extends string = string,
  C extends JsonObject = JsonObject,
> {
  readonly id: string;
  readonly arcId: string;
  readonly kind: K;
  readonly mode: SceneMode;
  readonly title: string;
  readonly savePoint: boolean;
  readonly config: C;
  readonly transitions: readonly NamedTransition[];
}

export interface LessonArc {
  readonly id: string;
  readonly title: string;
  readonly sceneIds: readonly string[];
}

export interface LessonManifest<TScene extends SceneNode = SceneNode> {
  readonly identity: {
    readonly id: string;
    readonly slug: string;
    readonly locale: "pt-BR";
    readonly version: string;
    readonly contentHash: string;
  };
  readonly title: string;
  readonly entrySceneId: string;
  readonly arcs: readonly LessonArc[];
  readonly scenes: readonly TScene[];
}

export type VisibilityClass =
  | "private_reflection"
  | "teacher_visible_task"
  | "derived_rubric"
  | "system_telemetry";

export interface ResponseEnvelope {
  readonly visibility: VisibilityClass;
  readonly value: JsonValue;
}

export interface AttemptSnapshot {
  readonly lessonId: string;
  readonly lessonVersion: string;
  readonly currentSceneId: string;
  readonly visitedSceneIds: readonly string[];
  readonly sceneState: Readonly<Record<string, JsonObject>>;
  readonly responses: Readonly<Record<string, ResponseEnvelope>>;
  readonly sequence: number;
  readonly status: "in_progress" | "completed";
}

export interface SceneCommit {
  readonly eventName: string;
  readonly nextSceneState: JsonObject;
  readonly responses?: Readonly<Record<string, ResponseEnvelope>>;
  readonly transition?: string;
}

export interface AttemptStore {
  restore(
    lessonId: string,
    lessonVersion: string,
  ): Promise<AttemptSnapshot | null>;
  commit(input: {
    readonly eventId: string;
    readonly next: AttemptSnapshot;
  }): Promise<void>;
}
