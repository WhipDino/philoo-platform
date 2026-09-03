"use client";

import Image from "next/image";
import { useId, useState } from "react";
import styles from "./philoo-dual-lens.module.css";

export type DualLensImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  label: string;
  caption?: string;
};

export type DualLensAlternative = {
  id: string;
  label: string;
};

export type DualLensState = {
  schemaVersion: "1";
  compareRatio: number;
  revealedB: boolean;
  view: "compare" | "question";
  selectedAlternativeId: string | null;
  attempts: number;
  completed: boolean;
};

export type PhilooDualLensProps = {
  prompt: string;
  lensA: DualLensImage;
  lensB: DualLensImage;
  initialLens?: "A" | "B";
  finalQuestion: string;
  questionHint?: string;
  alternatives: readonly DualLensAlternative[];
  correctAlternativeId: string;
  correctFeedback: string;
  incorrectFeedback: readonly { alternativeId: string; message: string }[];
  confirmLabel?: string;
  retryLabel?: string;
  seeQuestionsLabel?: string;
  requireBothLensesVisited?: boolean;
  visitHint?: string;
  onComplete: () => void;
  onStateChange?: (state: DualLensState) => void;
};

const REVEAL_THRESHOLD = 88;

function makeInitialState(): DualLensState {
  return {
    schemaVersion: "1",
    compareRatio: 16,
    revealedB: false,
    view: "compare",
    selectedAlternativeId: null,
    attempts: 0,
    completed: false,
  };
}

function clampRatio(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function PhilooDualLens({
  prompt,
  lensA,
  lensB,
  finalQuestion,
  questionHint = "Escolha uma das cartas.",
  alternatives,
  correctAlternativeId,
  correctFeedback,
  incorrectFeedback,
  confirmLabel = "Confirmar",
  retryLabel = "Tentar novamente",
  seeQuestionsLabel = "Ver perguntas",
  requireBothLensesVisited = true,
  visitHint = "Arraste a linha até o fim para ver o outro olho.",
  onComplete,
  onStateChange,
}: PhilooDualLensProps): React.JSX.Element {
  const headingId = useId();
  const sliderId = useId();
  const [state, setState] = useState<DualLensState>(makeInitialState);
  const [hasDragged, setHasDragged] = useState(false);
  const [wrongCardId, setWrongCardId] = useState<string | null>(null);

  const questionUnlocked = !requireBothLensesVisited || state.revealedB;
  const awaitingRetry = wrongCardId !== null && !state.completed;
  const canConfirm =
    state.view === "question" &&
    state.selectedAlternativeId !== null &&
    !state.completed &&
    !awaitingRetry;

  function commit(next: DualLensState) {
    setState(next);
    onStateChange?.(next);
  }

  function applyRatio(nextRatio: number) {
    const compareRatio = clampRatio(nextRatio);
    setHasDragged(true);
    commit({
      ...state,
      compareRatio,
      revealedB: state.revealedB || compareRatio >= REVEAL_THRESHOLD,
    });
  }

  function resetMiss() {
    setWrongCardId(null);
    commit({
      ...state,
      selectedAlternativeId: null,
    });
  }

  function confirm() {
    if (awaitingRetry) {
      resetMiss();
      return;
    }

    if (!canConfirm || state.selectedAlternativeId === null) return;

    const matched = state.selectedAlternativeId === correctAlternativeId;
    commit({
      ...state,
      attempts: state.attempts + 1,
      completed: matched,
    });

    if (matched) {
      setWrongCardId(null);
      onComplete();
      return;
    }

    setWrongCardId(state.selectedAlternativeId);
  }

  if (state.view === "question") {
    return (
      <section
        className={styles.activity}
        data-philoo-dual-lens
        data-view="question"
        aria-labelledby={headingId}
      >
        <header className={styles.questionHeader}>
          <h2 id={headingId}>{finalQuestion}</h2>
          <p>{questionHint}</p>
        </header>

        <div className={styles.cards} role="group" aria-label={finalQuestion}>
          {alternatives.map((alternative) => {
            const selected = state.selectedAlternativeId === alternative.id;
            const matched =
              state.completed && alternative.id === correctAlternativeId;
            const wrong = wrongCardId === alternative.id && !state.completed;
            const flipped = matched || wrong;
            const backMessage = matched
              ? correctFeedback
              : wrong
                ? (incorrectFeedback.find(
                    (entry) => entry.alternativeId === alternative.id,
                  )?.message ?? "A pedra não mudou. Quem muda é o olho. Tente de novo.")
                : "";

            return (
              <button
                key={alternative.id}
                type="button"
                className={styles.card}
                data-selected={selected ? "true" : "false"}
                data-matched={matched ? "true" : "false"}
                data-wrong={wrong ? "true" : "false"}
                data-flipped={flipped ? "true" : "false"}
                aria-label={alternative.label}
                aria-pressed={selected}
                disabled={state.completed}
                onClick={() => {
                  setWrongCardId(null);
                  commit({
                    ...state,
                    selectedAlternativeId: alternative.id,
                  });
                }}
              >
                <span className={styles.cardInner}>
                  <span className={styles.cardFront}>{alternative.label}</span>
                  <span
                    className={styles.cardBack}
                    aria-hidden={!flipped}
                    role={flipped ? "status" : undefined}
                    aria-live={flipped ? "polite" : undefined}
                  >
                    {wrong ? (
                      <span className={styles.retryLabel}>Ainda não é isso</span>
                    ) : null}
                    {backMessage ? <span>{backMessage}</span> : null}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {!state.completed ? (
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.confirm}
              disabled={!canConfirm && !awaitingRetry}
              onClick={confirm}
            >
              {awaitingRetry ? retryLabel : confirmLabel}
            </button>
          </div>
        ) : null}

      </section>
    );
  }

  return (
    <section
      className={styles.activity}
      data-philoo-dual-lens
      data-view="compare"
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className={styles.srOnly}>
        {prompt}
      </h2>

      <div
        className={styles.compare}
        style={{ ["--split" as string]: `${state.compareRatio}%` }}
        data-dragged={hasDragged ? "true" : "false"}
        data-dual-lens-compare
      >
        <div className={styles.baseLayer}>
          <Image
            className={styles.photo}
            src={lensA.src}
            alt={lensA.alt}
            width={lensA.width}
            height={lensA.height}
            sizes="(max-width: 700px) calc(100vw - 32px), min(1100px, 78vw)"
            priority
            unoptimized
          />
        </div>
        <div className={styles.revealLayer}>
          <Image
            className={styles.photo}
            src={lensB.src}
            alt=""
            width={lensB.width}
            height={lensB.height}
            sizes="(max-width: 700px) calc(100vw - 32px), min(1100px, 78vw)"
            priority
            unoptimized
          />
        </div>
        <div className={styles.handle} aria-hidden="true">
          <span className={styles.knob}>
            <i />
            <i />
          </span>
        </div>
        {!hasDragged ? (
          <p className={styles.dragCue}>Arraste a linha para ver o outro olho</p>
        ) : !questionUnlocked ? (
          <p className={styles.dragCue} role="status">
            {visitHint}
          </p>
        ) : null}
        <p className={styles.lensLegend} aria-hidden="true">
          <span>{lensA.label}</span>
          <span>{lensB.label}</span>
        </p>
        <label className={styles.srOnly} htmlFor={sliderId}>
          Comparar as duas lentes
        </label>
        <input
          id={sliderId}
          className={styles.range}
          type="range"
          min={0}
          max={100}
          value={Math.round(state.compareRatio)}
          aria-valuetext={`${Math.round(state.compareRatio)} por cento do olho acostumado`}
          onChange={(event) => applyRatio(Number(event.target.value))}
        />
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.confirm}
          disabled={!questionUnlocked}
          onClick={() => commit({ ...state, view: "question" })}
        >
          {seeQuestionsLabel}
        </button>
      </div>
    </section>
  );
}
