import type { LessonManifest, SceneNode } from "./contracts";

const COMPLETE = "$complete";

export function validateLessonManifest<TScene extends SceneNode>(
  manifest: LessonManifest<TScene>,
): readonly string[] {
  const errors: string[] = [];
  const scenesById = new Map<string, TScene>();
  const sceneIdCounts = new Map<string, number>();

  for (const scene of manifest.scenes) {
    sceneIdCounts.set(scene.id, (sceneIdCounts.get(scene.id) ?? 0) + 1);
    scenesById.set(scene.id, scene);
  }

  for (const [sceneId, count] of sceneIdCounts) {
    if (count > 1) {
      errors.push(`Duplicate scene id "${sceneId}".`);
    }
  }

  for (const scene of manifest.scenes) {
    const transitionNames = new Set<string>();

    for (const transition of scene.transitions) {
      if (transitionNames.has(transition.name)) {
        errors.push(
          `Duplicate transition name "${transition.name}" in scene "${scene.id}".`,
        );
      }
      transitionNames.add(transition.name);

      if (transition.to !== COMPLETE && !scenesById.has(transition.to)) {
        errors.push(
          `Unknown target "${transition.to}" from scene "${scene.id}".`,
        );
      }
    }
  }

  if (!scenesById.has(manifest.entrySceneId)) {
    errors.push(`Unknown entry scene "${manifest.entrySceneId}".`);
  }

  const arcAssignments = new Map<string, number>();
  for (const arc of manifest.arcs) {
    for (const sceneId of arc.sceneIds) {
      if (!scenesById.has(sceneId)) {
        errors.push(`Arc "${arc.id}" references unknown scene "${sceneId}".`);
      }
      arcAssignments.set(sceneId, (arcAssignments.get(sceneId) ?? 0) + 1);
    }
  }

  for (const sceneId of scenesById.keys()) {
    if (arcAssignments.get(sceneId) !== 1) {
      errors.push(`Scene "${sceneId}" must be assigned exactly once to an arc.`);
    }
  }

  const reachableSceneIds = getReachableSceneIds(manifest, scenesById);
  for (const sceneId of scenesById.keys()) {
    if (!reachableSceneIds.has(sceneId)) {
      errors.push(`Scene "${sceneId}" is unreachable from the entry scene.`);
    }
  }

  const completableSceneIds = getCompletableSceneIds(manifest, scenesById);
  for (const sceneId of scenesById.keys()) {
    if (!completableSceneIds.has(sceneId)) {
      errors.push(`Scene "${sceneId}" has no path to ${COMPLETE}.`);
    }
  }

  return errors;
}

export function resolveNamedTransition<TScene extends SceneNode>(
  manifest: LessonManifest<TScene>,
  sceneId: string,
  transitionName: string,
): string | "$complete" {
  const scene = manifest.scenes.find((candidate) => candidate.id === sceneId);
  const transition = scene?.transitions.find(
    (candidate) => candidate.name === transitionName,
  );

  if (!transition) {
    throw new Error(
      `Transition "${transitionName}" was not found in scene "${sceneId}".`,
    );
  }

  return transition.to;
}

export function getRequiredSceneOrder<TScene extends SceneNode>(
  manifest: LessonManifest<TScene>,
): readonly string[] {
  const scenesById = new Map(manifest.scenes.map((scene) => [scene.id, scene]));
  return [...getReachableSceneIds(manifest, scenesById)];
}

function getReachableSceneIds<TScene extends SceneNode>(
  manifest: LessonManifest<TScene>,
  scenesById: ReadonlyMap<string, TScene>,
): Set<string> {
  const visited = new Set<string>();
  const queue = scenesById.has(manifest.entrySceneId)
    ? [manifest.entrySceneId]
    : [];

  while (queue.length > 0) {
    const sceneId = queue.shift();
    if (sceneId === undefined || visited.has(sceneId)) {
      continue;
    }

    visited.add(sceneId);
    const scene = scenesById.get(sceneId);
    if (!scene) {
      continue;
    }

    for (const transition of scene.transitions) {
      if (
        transition.to !== COMPLETE &&
        scenesById.has(transition.to) &&
        !visited.has(transition.to)
      ) {
        queue.push(transition.to);
      }
    }
  }

  return visited;
}

function getCompletableSceneIds<TScene extends SceneNode>(
  manifest: LessonManifest<TScene>,
  scenesById: ReadonlyMap<string, TScene>,
): Set<string> {
  const predecessors = new Map<string, string[]>();
  const directlyComplete = new Set<string>();

  for (const scene of manifest.scenes) {
    for (const transition of scene.transitions) {
      if (transition.to === COMPLETE) {
        directlyComplete.add(scene.id);
      } else if (scenesById.has(transition.to)) {
        const targetsPredecessors = predecessors.get(transition.to) ?? [];
        targetsPredecessors.push(scene.id);
        predecessors.set(transition.to, targetsPredecessors);
      }
    }
  }

  const completable = new Set(directlyComplete);
  const queue = [...directlyComplete];

  while (queue.length > 0) {
    const sceneId = queue.shift();
    if (sceneId === undefined) {
      continue;
    }

    for (const predecessor of predecessors.get(sceneId) ?? []) {
      if (!completable.has(predecessor)) {
        completable.add(predecessor);
        queue.push(predecessor);
      }
    }
  }

  return completable;
}
