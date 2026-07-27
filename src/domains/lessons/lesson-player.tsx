"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type {
  AttemptSnapshot,
  AttemptStore,
  JsonObject,
  LessonManifest,
  ResponseEnvelope,
  SceneCommit,
  SceneNode,
} from "./contracts";
import { applySceneCommit, createInitialSnapshot } from "./runtime";
import { SceneErrorBoundary } from "./scene-error-boundary";
import styles from "./lesson-player.module.css";

export interface LessonSceneRenderProps<TScene extends SceneNode> {
  readonly scene: TScene;
  readonly sceneState: JsonObject;
  readonly responses: Readonly<Record<string, ResponseEnvelope>>;
  readonly commit: (sceneCommit: SceneCommit) => Promise<boolean>;
  readonly isSaving: boolean;
}

export interface LessonPlayerProps<TScene extends SceneNode> {
  readonly manifest: LessonManifest<TScene>;
  readonly store: AttemptStore;
  readonly renderScene: (
    props: LessonSceneRenderProps<TScene>,
  ) => ReactNode;
  readonly onExitHref: string;
}

interface PendingPersistence {
  readonly eventId: string;
  readonly next: AttemptSnapshot;
  readonly focusAfterCommit: boolean;
  readonly resolve: (succeeded: boolean) => void;
}

interface SceneRendererProps<TScene extends SceneNode>
  extends LessonSceneRenderProps<TScene> {
  readonly renderScene: (
    props: LessonSceneRenderProps<TScene>,
  ) => ReactNode;
}

function SceneRenderer<TScene extends SceneNode>({
  renderScene,
  ...props
}: SceneRendererProps<TScene>) {
  return renderScene(props);
}

function isUsableRestoredSnapshot<TScene extends SceneNode>(
  snapshot: AttemptSnapshot,
  manifest: LessonManifest<TScene>,
  scenesById: ReadonlyMap<string, TScene>,
): boolean {
  return (
    Number.isSafeInteger(snapshot.sequence) &&
    snapshot.sequence >= 0 &&
    scenesById.has(snapshot.currentSceneId) &&
    snapshot.visitedSceneIds.length > 0 &&
    snapshot.visitedSceneIds[0] === manifest.entrySceneId &&
    snapshot.visitedSceneIds.at(-1) === snapshot.currentSceneId &&
    snapshot.visitedSceneIds.every((sceneId) => scenesById.has(sceneId))
  );
}

export function LessonPlayer<TScene extends SceneNode>({
  manifest,
  store,
  renderScene,
  onExitHref,
}: LessonPlayerProps<TScene>) {
  const [snapshot, setSnapshot] = useState<AttemptSnapshot | null>(null);
  const [hasRestored, setHasRestored] = useState(false);
  const [restoreFailed, setRestoreFailed] = useState(false);
  const [restoreRequest, setRestoreRequest] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [persistenceFailed, setPersistenceFailed] = useState(false);
  const snapshotRef = useRef<AttemptSnapshot | null>(null);
  const pendingRef = useRef<PendingPersistence | null>(null);
  const committingRef = useRef(false);
  const focusAfterCommitRef = useRef(false);
  const restorationRef = useRef<{
    store: AttemptStore;
    request: number;
    promise: Promise<AttemptSnapshot | null>;
  } | null>(null);

  const scenesById = useMemo(
    () => new Map(manifest.scenes.map((scene) => [scene.id, scene])),
    [manifest.scenes],
  );

  useEffect(() => {
    let active = true;

    if (
      restorationRef.current?.store !== store ||
      restorationRef.current.request !== restoreRequest
    ) {
      restorationRef.current = {
        store,
        request: restoreRequest,
        promise: store.restore(
          manifest.identity.id,
          manifest.identity.version,
        ),
      };
    }

    void restorationRef.current.promise
      .then((restoredSnapshot) => {
        if (!active) {
          return;
        }

        const usableSnapshot =
          restoredSnapshot &&
          restoredSnapshot.lessonId === manifest.identity.id &&
          restoredSnapshot.lessonVersion === manifest.identity.version &&
          isUsableRestoredSnapshot(
            restoredSnapshot,
            manifest,
            scenesById,
          )
            ? restoredSnapshot
            : createInitialSnapshot(manifest);

        snapshotRef.current = usableSnapshot;
        setRestoreFailed(false);
        setSnapshot(usableSnapshot);
        setHasRestored(true);
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setRestoreFailed(true);
      });

    return () => {
      active = false;
    };
  }, [
    manifest,
    manifest.identity.id,
    manifest.identity.version,
    scenesById,
    store,
    restoreRequest,
  ]);

  useEffect(() => {
    if (!focusAfterCommitRef.current || !snapshot) {
      return;
    }

    focusAfterCommitRef.current = false;
    document
      .querySelector<HTMLElement>(
        `[data-lesson-scene="${snapshot.currentSceneId}"] h1[tabindex="-1"]`,
      )
      ?.focus();
  }, [snapshot]);

  async function persist(pending: PendingPersistence): Promise<void> {
    if (committingRef.current) {
      return;
    }

    committingRef.current = true;
    pendingRef.current = pending;
    setIsSaving(true);
    setPersistenceFailed(false);

    try {
      await store.commit({ eventId: pending.eventId, next: pending.next });
      snapshotRef.current = pending.next;
      focusAfterCommitRef.current = pending.focusAfterCommit;
      pendingRef.current = null;
      setSnapshot(pending.next);
      pending.resolve(true);
    } catch {
      setPersistenceFailed(true);
    } finally {
      committingRef.current = false;
      setIsSaving(false);
    }
  }

  async function commit(sceneCommit: SceneCommit): Promise<boolean> {
    const current = snapshotRef.current;
    if (!current || committingRef.current || pendingRef.current) {
      return false;
    }

    return new Promise<boolean>((resolve) => {
      const next = applySceneCommit(manifest, current, sceneCommit);
      void persist({
        eventId: `${current.lessonId}:${current.sequence + 1}:${sceneCommit.eventName}`,
        next,
        focusAfterCommit:
          next.currentSceneId !== current.currentSceneId ||
          next.status !== current.status,
        resolve,
      });
    });
  }

  async function retryPersistence() {
    if (pendingRef.current) {
      await persist(pendingRef.current);
    }
  }

  function retryRestore() {
    setRestoreFailed(false);
    setHasRestored(false);
    setRestoreRequest((request) => request + 1);
  }

  async function goBack() {
    const current = snapshotRef.current;
    if (!current || committingRef.current || pendingRef.current) {
      return;
    }

    const currentHistoryIndex = current.visitedSceneIds.lastIndexOf(
      current.currentSceneId,
    );
    const previousSceneId = current.visitedSceneIds[currentHistoryIndex - 1];
    if (!previousSceneId || !scenesById.has(previousSceneId)) {
      return;
    }

    await persist({
      eventId: `${current.lessonId}:${current.sequence + 1}:back:${previousSceneId}`,
      next: {
        ...current,
        currentSceneId: previousSceneId,
        visitedSceneIds: current.visitedSceneIds.slice(
          0,
          currentHistoryIndex,
        ),
        sequence: current.sequence + 1,
      },
      focusAfterCommit: false,
      resolve: () => {},
    });
  }

  if (restoreFailed) {
    return (
      <main className={styles.restoreError} role="alert">
        <p className={styles.eyebrow}>Seu progresso continua guardado</p>
        <h1>Não foi possível abrir sua investigação</h1>
        <p>
          Tente novamente para recuperar o último ponto antes de começar.
        </p>
        <div className={styles.errorActions}>
          <button type="button" onClick={retryRestore}>
            Tentar de novo
          </button>
          <Link href={onExitHref}>Voltar ao início</Link>
        </div>
      </main>
    );
  }

  if (!hasRestored || !snapshot) {
    return (
      <div className={styles.loading} role="status" aria-label="Abrindo sua investigação…">
        <span className={styles.loadingMark} aria-hidden="true" />
        <span>Abrindo sua investigação…</span>
      </div>
    );
  }

  if (snapshot.status === "completed") {
    return (
      <main
        className={styles.completion}
        data-lesson-scene={snapshot.currentSceneId}
      >
        <p className={styles.eyebrow}>As Sombras · sessão 1</p>
        <h1 tabIndex={-1}>Investigação concluída</h1>
        <p>
          Você ainda não saiu da caverna. Mas a parede já não explica tudo.
        </p>
        <Link href={onExitHref}>Voltar ao início</Link>
      </main>
    );
  }

  const currentScene = scenesById.get(snapshot.currentSceneId);
  if (!currentScene) {
    return (
      <main className={styles.completion}>
        <p className={styles.eyebrow}>Ponto de investigação indisponível</p>
        <h1 tabIndex={-1}>Não foi possível abrir esta cena</h1>
        <Link href={onExitHref}>Voltar ao início</Link>
      </main>
    );
  }

  const countedSceneIds = manifest.arcs
    .flatMap((arc) => arc.sceneIds)
    .filter(
      (sceneId) =>
        scenesById.get(sceneId)?.config.countsTowardProgress !== false,
    );
  const progressIndex = countedSceneIds.indexOf(currentScene.id);
  const currentArc = manifest.arcs.find((arc) =>
    arc.sceneIds.includes(currentScene.id),
  );
  const historyIndex = snapshot.visitedSceneIds.lastIndexOf(currentScene.id);
  const canGoBack =
    historyIndex > 0 &&
    scenesById.has(snapshot.visitedSceneIds[historyIndex - 1]);
  const renderProps: LessonSceneRenderProps<TScene> = {
    scene: currentScene,
    sceneState: snapshot.sceneState[currentScene.id] ?? {},
    responses: snapshot.responses,
    commit,
    isSaving: isSaving || persistenceFailed,
  };
  const sceneBoundary = (
    <SceneErrorBoundary
      onExitHref={onExitHref}
      resetKey={`${snapshot.currentSceneId}:${snapshot.sequence}`}
    >
      <div
        className={styles.sceneContent}
        data-lesson-scene={currentScene.id}
      >
        <SceneRenderer {...renderProps} renderScene={renderScene} />
      </div>
    </SceneErrorBoundary>
  );
  const persistenceError = persistenceFailed ? (
    <div className={styles.persistenceError} role="alert">
      <span>Não foi possível guardar esta etapa</span>
      <button
        type="button"
        onClick={() => void retryPersistence()}
        disabled={isSaving}
      >
        Tentar de novo
      </button>
    </div>
  ) : null;

  if (currentScene.config.usesPlayerShell === false) {
    return (
      <>
        {persistenceError}
        {sceneBoundary}
      </>
    );
  }

  const pathProgress =
    progressIndex < 0 || countedSceneIds.length < 2
      ? 0
      : (progressIndex / (countedSceneIds.length - 1)) * 100;
  const pathStyle = {
    "--path-progress": `${pathProgress}%`,
  } as CSSProperties;

  return (
    <div className={styles.player}>
      <header className={styles.header}>
        <Link className={styles.exit} href={onExitHref}>
          <span aria-hidden="true">←</span>
          Encerrar
        </Link>
        <span className={styles.brand}>As Sombras</span>
        <div className={styles.orientation}>
          <span>{currentArc?.title ?? "Investigação"}</span>
          <strong>
            {progressIndex >= 0 ? progressIndex + 1 : 0} de{" "}
            {countedSceneIds.length}
          </strong>
        </div>
      </header>

      <nav
        className={styles.pathRegion}
        aria-label="Caminho da investigação"
      >
        <ol className={styles.path} style={pathStyle}>
          {countedSceneIds.map((sceneId, index) => {
            const pathScene = scenesById.get(sceneId);
            if (!pathScene) {
              return null;
            }
            const state =
              index < progressIndex
                ? "visited"
                : index === progressIndex
                  ? "current"
                  : "upcoming";
            return (
              <li
                key={sceneId}
                className={styles.pathItem}
                data-state={state}
                aria-current={state === "current" ? "step" : undefined}
                aria-label={pathScene.title}
              >
                <span aria-hidden="true" />
                <span className={styles.srOnly}>{pathScene.title}</span>
              </li>
            );
          })}
        </ol>
      </nav>

      <main className={styles.sceneStage}>{sceneBoundary}</main>

      <footer className={styles.actions}>
        <button
          type="button"
          onClick={() => void goBack()}
          disabled={!canGoBack || isSaving}
        >
          Voltar
        </button>
        <span aria-live="polite">
          {isSaving ? "Guardando esta etapa…" : ""}
        </span>
      </footer>

      {persistenceError}
    </div>
  );
}
