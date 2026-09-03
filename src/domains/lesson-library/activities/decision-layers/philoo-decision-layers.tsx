"use client";

import {
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import styles from "./philoo-decision-layers.module.css";

export type DecisionLayer = {
  id: string;
  label: string;
  weightNote: string;
  explanation: string;
};

export type DecisionLayersOutOfPlaceFeedback = {
  layerId: string;
  message: string;
};

export type DecisionLayersState = {
  schemaVersion: "1";
  positions: readonly (string | null)[];
  attempts: number;
  hasChecked: boolean;
  completed: boolean;
};

export type PhilooDecisionLayersProps = {
  prompt: string;
  layers: readonly DecisionLayer[];
  correctOrder: readonly string[];
  positionLabels?: readonly string[];
  initialFeedback?: string;
  incompleteFeedback?: string;
  correctFeedback: string;
  outOfPlaceFeedback: readonly DecisionLayersOutOfPlaceFeedback[];
  fallbackFeedback?: string;
  checkLabel?: string;
  onComplete: () => void;
  onStateChange?: (state: DecisionLayersState) => void;
};

const DEFAULT_POSITION_LABELS = [
  "Camada 1 · base, mais leve",
  "Camada 2 · no meio",
  "Camada 3 · topo, pesa mais",
] as const;

const PYRAMID_WIDTHS = ["100%", "86%", "72%"] as const;

type DragState = {
  layerId: string;
  label: string;
  note: string;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  width: number;
};

export function PhilooDecisionLayers({
  prompt,
  layers,
  correctOrder,
  positionLabels = DEFAULT_POSITION_LABELS,
  initialFeedback = "Arraste uma camada até o degrau da pirâmide.",
  incompleteFeedback = "Continue: ainda falta encaixar uma camada.",
  correctFeedback,
  outOfPlaceFeedback,
  fallbackFeedback = "Essa camada ainda não está no lugar certo. Reveja o peso de cada uma.",
  checkLabel = "Conferir",
  onComplete,
  onStateChange,
}: PhilooDecisionLayersProps): React.JSX.Element {
  const headingId = useId();
  const [positions, setPositions] = useState<readonly (string | null)[]>(() =>
    Array<string | null>(correctOrder.length).fill(null),
  );
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState(initialFeedback);
  const [outOfPlaceIds, setOutOfPlaceIds] = useState<readonly string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [hoverSlot, setHoverSlot] = useState<number | null>(null);
  const dragOrigin = useRef({ x: 0, y: 0 });
  const didDrag = useRef(false);

  const poolLayerIds = layers
    .map((layer) => layer.id)
    .filter((id) => !positions.includes(id));

  function emitState(
    nextPositions: readonly (string | null)[],
    nextAttempts: number,
    hasChecked: boolean,
    nextCompleted: boolean,
  ) {
    onStateChange?.({
      schemaVersion: "1",
      positions: nextPositions,
      attempts: nextAttempts,
      hasChecked,
      completed: nextCompleted,
    });
  }

  function placeLayer(layerId: string, positionIndex: number) {
    if (completed) return;

    const nextPositions = positions.map((current, index) => {
      if (index === positionIndex) return layerId;
      if (current === layerId) return null;
      return current;
    });

    setPositions(nextPositions);
    setSelectedLayerId(null);
    setOutOfPlaceIds([]);
    setFeedback(initialFeedback);
    emitState(nextPositions, attempts, false, false);
  }

  function placeSelected(positionIndex: number) {
    if (!selectedLayerId) return;
    placeLayer(selectedLayerId, positionIndex);
  }

  function removeFromPosition(positionIndex: number) {
    if (completed) return;
    const layerId = positions[positionIndex];
    if (!layerId) return;

    const nextPositions = positions.map((current, index) =>
      index === positionIndex ? null : current,
    );
    setPositions(nextPositions);
    setSelectedLayerId(null);
    emitState(nextPositions, attempts, false, false);
  }

  function startDrag(
    event: ReactPointerEvent<HTMLButtonElement>,
    layer: DecisionLayer,
  ) {
    if (completed || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    dragOrigin.current = { x: event.clientX, y: event.clientY };
    didDrag.current = false;
    setDrag({
      layerId: layer.id,
      label: layer.label,
      note: layer.weightNote,
      x: event.clientX,
      y: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
    });
  }

  function moveDrag(event: ReactPointerEvent<HTMLElement>) {
    if (!drag) return;
    const dx = event.clientX - dragOrigin.current.x;
    const dy = event.clientY - dragOrigin.current.y;
    if (Math.hypot(dx, dy) > 8) {
      didDrag.current = true;
    }
    setDrag({ ...drag, x: event.clientX, y: event.clientY });
    const target = document.elementFromPoint(event.clientX, event.clientY);
    const slot = target?.closest("[data-drop-slot]");
    setHoverSlot(slot ? Number(slot.getAttribute("data-drop-slot")) : null);
  }

  function endDrag(event: ReactPointerEvent<HTMLElement>) {
    if (!drag) return;
    const target = document.elementFromPoint(event.clientX, event.clientY);
    const slot = target?.closest("[data-drop-slot]");
    const pool = target?.closest("[data-drop-pool]");

    if (didDrag.current && slot) {
      placeLayer(drag.layerId, Number(slot.getAttribute("data-drop-slot")));
    } else if (didDrag.current && pool) {
      const nextPositions = positions.map((current) =>
        current === drag.layerId ? null : current,
      );
      setPositions(nextPositions);
      setSelectedLayerId(null);
      emitState(nextPositions, attempts, false, false);
    }

    setDrag(null);
    setHoverSlot(null);
  }

  function check() {
    if (completed) return;

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (positions.some((layerId) => layerId === null)) {
      setFeedback(incompleteFeedback);
      emitState(positions, nextAttempts, true, false);
      return;
    }

    const wrongIndexes = positions
      .map((layerId, index) => ({ layerId, index }))
      .filter(({ layerId, index }) => layerId !== correctOrder[index]);

    if (wrongIndexes.length === 0) {
      setCompleted(true);
      setOutOfPlaceIds([]);
      setFeedback(correctFeedback);
      emitState(positions, nextAttempts, true, true);
      onComplete();
      return;
    }

    const wrongIds = wrongIndexes
      .map(({ layerId }) => layerId)
      .filter((layerId): layerId is string => layerId !== null);
    setOutOfPlaceIds(wrongIds);

    const firstWrongId = wrongIds[0];
    const specific = outOfPlaceFeedback.find(
      (entry) => entry.layerId === firstWrongId,
    );
    setFeedback(specific?.message ?? fallbackFeedback);

    const nextPositions = positions.map((layerId) =>
      layerId !== null && wrongIds.includes(layerId) ? null : layerId,
    );

    setPositions(nextPositions);
    emitState(nextPositions, nextAttempts, true, false);
  }

  const allFilled = positions.every((layerId) => layerId !== null);

  return (
    <section
      className={styles.activity}
      data-philoo-decision-layers
      data-complete={completed ? "true" : "false"}
      aria-labelledby={headingId}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={() => {
        setDrag(null);
        setHoverSlot(null);
      }}
    >
      <header className={styles.header}>
        <p className={styles.eyebrow}>Camadas de uma decisão</p>
        <h2 id={headingId}>{prompt}</h2>
      </header>

      <div className={styles.board}>
        <div
          className={styles.pool}
          data-drop-pool
          aria-label="Camadas disponíveis"
        >
          {poolLayerIds.length === 0 ? (
            <p className={styles.poolEmpty}>Todas as camadas estão na pilha.</p>
          ) : null}
          {layers
            .filter((layer) => poolLayerIds.includes(layer.id))
            .map((layer) => {
              const selected = selectedLayerId === layer.id;
              return (
                <button
                  key={layer.id}
                  type="button"
                  className={styles.card}
                  data-selected={selected ? "true" : "false"}
                  data-dragging={drag?.layerId === layer.id ? "true" : "false"}
                  aria-pressed={selected}
                  disabled={completed}
                  onPointerDown={(event) => startDrag(event, layer)}
                  onClick={(event) => {
                    if (didDrag.current) {
                      event.preventDefault();
                      return;
                    }
                    setSelectedLayerId((current) =>
                      current === layer.id ? null : layer.id,
                    );
                  }}
                >
                  <strong>{layer.label}</strong>
                  <span>{layer.weightNote}</span>
                </button>
              );
            })}
        </div>

        <ol className={styles.stack} aria-label="Pirâmide de camadas">
          {positions.map((layerId, index) => {
            const layer = layers.find((candidate) => candidate.id === layerId);
            const isOutOfPlace = layerId ? outOfPlaceIds.includes(layerId) : false;

            return (
              <li
                key={index}
                className={styles.slot}
                data-rank={index}
                data-drop-slot={index}
                data-over={hoverSlot === index ? "true" : "false"}
                style={{ width: PYRAMID_WIDTHS[index] ?? "100%" }}
              >
                <span className={styles.slotLabel}>
                  {positionLabels[index] ?? `Camada ${index + 1}`}
                </span>
                <button
                  type="button"
                  className={styles.slotButton}
                  data-filled={layer ? "true" : "false"}
                  data-wrong={isOutOfPlace ? "true" : "false"}
                  disabled={completed || (!layer && !selectedLayerId && !drag)}
                  onPointerDown={
                    layer
                      ? (event) => startDrag(event, layer)
                      : undefined
                  }
                  onClick={(event) => {
                    if (didDrag.current) {
                      event.preventDefault();
                      return;
                    }
                    if (layer) {
                      removeFromPosition(index);
                      return;
                    }
                    placeSelected(index);
                  }}
                >
                  {layer ? layer.label : "Solte aqui"}
                </button>
                {layer ? <p>{layer.explanation}</p> : null}
              </li>
            );
          })}
        </ol>
      </div>

      {!completed ? (
        <button
          type="button"
          className={styles.check}
          disabled={!allFilled}
          onClick={check}
        >
          {checkLabel}
        </button>
      ) : null}

      <p
        className={styles.feedback}
        data-state={
          completed ? "complete" : outOfPlaceIds.length > 0 ? "wrong" : "guidance"
        }
        role="status"
        aria-live="polite"
      >
        {feedback}
      </p>

      {drag
        ? createPortal(
            <div
              className={styles.ghost}
              aria-hidden="true"
              style={{
                left: drag.x - drag.offsetX,
                top: drag.y - drag.offsetY,
                width: drag.width,
              }}
            >
              <strong>{drag.label}</strong>
              <span>{drag.note}</span>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
