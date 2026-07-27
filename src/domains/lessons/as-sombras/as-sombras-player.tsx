"use client";

import { useEffect, useState } from "react";
import type { AttemptStore } from "../contracts";
import { LocalAttemptStore } from "../local-attempt-store";
import {
  LessonPlayer,
  type LessonSceneRenderProps,
} from "../lesson-player";
import {
  asSombrasManifest,
  type CaveScene,
} from "./manifest";
import { PrologueScene } from "./prologue-scene";
import { PROLOGUE_HYPOTHESIS_RESPONSE_KEY } from "./state";
import styles from "./as-sombras.module.css";

class VolatileStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

export class ResilientStorage implements Storage {
  private primary: Storage | null;
  private readonly fallback = new VolatileStorage();

  constructor(primary: Storage | null) {
    this.primary = primary;
  }

  get length() {
    return this.run((storage) => storage.length);
  }

  clear() {
    this.run((storage) => storage.clear());
  }

  getItem(key: string) {
    return this.run((storage) => storage.getItem(key));
  }

  key(index: number) {
    return this.run((storage) => storage.key(index));
  }

  removeItem(key: string) {
    this.run((storage) => storage.removeItem(key));
  }

  setItem(key: string, value: string) {
    this.run((storage) => storage.setItem(key, value));
  }

  private run<T>(operation: (storage: Storage) => T): T {
    if (this.primary) {
      try {
        return operation(this.primary);
      } catch {
        this.primary = null;
      }
    }

    return operation(this.fallback);
  }
}

export function AsSombrasPlayer() {
  const [store, setStore] = useState<LocalAttemptStore | null>(null);

  useEffect(() => {
    let active = true;
    let browserStorage: Storage | null;
    try {
      browserStorage = window.localStorage;
    } catch {
      browserStorage = null;
    }

    const storage = new ResilientStorage(browserStorage);
    const browserStore = new LocalAttemptStore({ storage });
    queueMicrotask(() => {
      if (active) {
        setStore(browserStore);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  if (!store) {
    return (
      <div
        className={styles.bootstrap}
        role="status"
        aria-label="Abrindo sua investigação…"
      >
        Abrindo sua investigação…
      </div>
    );
  }

  return <AsSombrasLesson store={store} />;
}

export function AsSombrasLesson({ store }: { store: AttemptStore }) {
  const [hypothesisDraft, setHypothesisDraft] = useState<string | null>(null);

  return (
    <LessonPlayer
      manifest={asSombrasManifest}
      store={store}
      onExitHref="/inicio"
      renderScene={(props) =>
        renderCaveScene(props, hypothesisDraft, setHypothesisDraft)
      }
    />
  );
}

function renderCaveScene(
  props: LessonSceneRenderProps<CaveScene>,
  hypothesisDraft: string | null,
  setHypothesisDraft: (value: string) => void,
) {
  const { scene, sceneState, responses, commit, isSaving } = props;

  switch (scene.kind) {
    case "prologue": {
      const storedResponse = responses[PROLOGUE_HYPOTHESIS_RESPONSE_KEY];
      const storedHypothesis =
        storedResponse?.visibility === "private_reflection" &&
        typeof storedResponse.value === "string"
          ? storedResponse.value
          : "";
      const hypothesis = hypothesisDraft ?? storedHypothesis;

      return (
        <PrologueScene
          hypothesis={hypothesis}
          isBusy={isSaving}
          onHypothesisChange={setHypothesisDraft}
          onRegister={(value) => {
            setHypothesisDraft(value);
            return commit({
              eventName: "hypothesis_registered",
              nextSceneState: {
                ...sceneState,
                hypothesisRegistered: true,
              },
              responses: {
                [PROLOGUE_HYPOTHESIS_RESPONSE_KEY]: {
                  visibility: "private_reflection",
                  value,
                },
              },
            });
          }}
          onContinue={() => {
            return commit({
              eventName: "enter_the_wall",
              nextSceneState: { ...sceneState, enteredCave: true },
              transition: "enter_the_wall",
            });
          }}
        />
      );
    }
    case "prisoner_view":
      return <TemporaryCaveScene scene={scene} />;
    case "prediction_mastery":
      return <TemporaryCaveScene scene={scene} />;
    case "impossible_shadow":
      return <TemporaryCaveScene scene={scene} />;
    case "evidence_investigation":
      return <TemporaryCaveScene scene={scene} />;
    case "shadow_laboratory":
      return <TemporaryCaveScene scene={scene} />;
    case "defend_model":
      return <TemporaryCaveScene scene={scene} />;
    case "revision_map":
      return <TemporaryCaveScene scene={scene} />;
    case "transfer_case":
      return <TemporaryCaveScene scene={scene} />;
    default:
      return assertNever(scene.kind);
  }
}

function TemporaryCaveScene({ scene }: { scene: CaveScene }) {
  return (
    <article className={styles.scene}>
      <div
        className={styles.environment}
        style={{ backgroundImage: `url("${scene.config.environmentAsset}")` }}
        aria-hidden="true"
      />
      <section
        className={styles.tray}
        aria-labelledby={`scene-title-${scene.id}`}
      >
        <div>
          <p className={styles.eyebrow}>Próxima etapa da investigação</p>
          <h1 id={`scene-title-${scene.id}`} tabIndex={-1}>
            {scene.title}
          </h1>
          <p>{scene.config.purpose}</p>
        </div>
        <button type="button" disabled>
          Continuar
        </button>
      </section>
    </article>
  );
}

function assertNever(value: never): never {
  throw new Error(`Unsupported Cave scene kind: ${String(value)}`);
}
