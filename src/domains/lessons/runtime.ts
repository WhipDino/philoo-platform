import type {
  AttemptSnapshot,
  LessonManifest,
  SceneCommit,
  SceneNode,
} from "./contracts";
import { resolveNamedTransition } from "./graph";

export function createInitialSnapshot<TScene extends SceneNode>(
  manifest: LessonManifest<TScene>,
): AttemptSnapshot {
  return {
    lessonId: manifest.identity.id,
    lessonVersion: manifest.identity.version,
    currentSceneId: manifest.entrySceneId,
    visitedSceneIds: [manifest.entrySceneId],
    sceneState: {},
    responses: {},
    sequence: 0,
    status: "in_progress",
  };
}

export function applySceneCommit<TScene extends SceneNode>(
  manifest: LessonManifest<TScene>,
  snapshot: AttemptSnapshot,
  commit: SceneCommit,
): AttemptSnapshot {
  const target = commit.transition
    ? resolveNamedTransition(manifest, snapshot.currentSceneId, commit.transition)
    : undefined;
  const nextSceneId = target && target !== "$complete"
    ? target
    : snapshot.currentSceneId;

  return {
    ...snapshot,
    currentSceneId: nextSceneId,
    visitedSceneIds:
      target && target !== "$complete" && !snapshot.visitedSceneIds.includes(target)
        ? [...snapshot.visitedSceneIds, target]
        : [...snapshot.visitedSceneIds],
    sceneState: {
      ...snapshot.sceneState,
      [snapshot.currentSceneId]: { ...commit.nextSceneState },
    },
    responses: {
      ...snapshot.responses,
      ...commit.responses,
    },
    sequence: snapshot.sequence + 1,
    status: target === "$complete" ? "completed" : snapshot.status,
  };
}
