"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type DragEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import styles from "./philoo-causal-path.module.css";

export type CausalPathItem = {
  id: string;
  label: string;
  explanation: string;
  icon: ReactNode;
};

type Placement = string | null;

function findPositionIndex(element: Element | null) {
  const position = element?.closest<HTMLElement>("[data-causal-position]");
  const rawIndex = position?.dataset.causalPosition;
  const parsedIndex = Number.parseInt(rawIndex ?? "", 10);

  return Number.isInteger(parsedIndex) ? parsedIndex : null;
}

function firstBreakMessage(
  positions: readonly Placement[],
  correctOrder: readonly string[],
  items: readonly CausalPathItem[],
) {
  const breakIndex = positions.findIndex(
    (itemId, index) => itemId !== correctOrder[index],
  );
  const actualItemId = positions[breakIndex];
  const expectedItemId = correctOrder[breakIndex];
  const beforeBreak = positions.slice(0, breakIndex);

  if (actualItemId === "shadow" && !beforeBreak.includes("object")) {
    return "A sombra precisa de algo entre a luz e a parede.";
  }

  if (actualItemId === "name" && !beforeBreak.includes("shadow")) {
    return "O nome só pode vir depois que a sombra aparece na parede.";
  }

  const actualItem = items.find((item) => item.id === actualItemId);
  const expectedItem = items.find((item) => item.id === expectedItemId);

  if (actualItem && expectedItem) {
    return `Antes de ${actualItem.label.toLowerCase()}, o caminho precisa de ${expectedItem.label.toLowerCase()}.`;
  }

  return "Observe onde a primeira relação do caminho foi interrompida.";
}

export function PhilooCausalPath({
  items,
  correctOrder,
  demonstratedItemId,
  positionHints,
  onComplete,
  onIncomplete,
  completionMessage = "Da luz ao nome: o caminho está completo.",
  activityLabel = "Monte o caminho da sombra",
  pathLabel = "Quatro posições do caminho",
}: {
  items: readonly CausalPathItem[];
  correctOrder: readonly string[];
  demonstratedItemId: string;
  positionHints: readonly string[];
  onComplete: () => void;
  onIncomplete?: () => void;
  /**
   * Extracted for reuse beyond the Cave's light-object-shadow-name sequence
   * (see docs/reference candidate note for EX-03). Defaults preserve the
   * original Cave copy so existing lessons keep working unchanged.
   */
  completionMessage?: string;
  activityLabel?: string;
  pathLabel?: string;
}): React.JSX.Element {
  const instanceId = useId();
  const demonstratedPosition = Math.max(
    0,
    correctOrder.indexOf(demonstratedItemId),
  );
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [positions, setPositions] = useState<Placement[]>(() => {
    const initial = Array<Placement>(correctOrder.length).fill(null);
    initial[demonstratedPosition] = demonstratedItemId;
    return initial;
  });
  const [feedback, setFeedback] = useState(
    "Escolha uma peça e depois a posição onde ela entra.",
  );
  const [complete, setComplete] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [activePosition, setActivePosition] = useState<number | null>(null);
  const pointerStart = useRef<{
    itemId: string;
    x: number;
    y: number;
  } | null>(null);
  const didPointerDrag = useRef(false);
  const completionReported = useRef(false);
  const trayButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocusItemId = useRef<string | null>(null);

  useEffect(() => {
    const itemId = pendingFocusItemId.current;

    if (itemId) {
      trayButtonRefs.current.get(itemId)?.focus();
      pendingFocusItemId.current = null;
    }
  }, [positions]);

  function validate(nextPositions: readonly Placement[]) {
    if (nextPositions.some((itemId) => itemId === null)) {
      setFeedback("Continue: ainda há uma parte do caminho para completar.");
      return;
    }

    const matches = nextPositions.every(
      (itemId, index) => itemId === correctOrder[index],
    );

    if (!matches) {
      setFeedback(firstBreakMessage(nextPositions, correctOrder, items));
      return;
    }

    setComplete(true);
    setFeedback(completionMessage);

    if (!completionReported.current) {
      completionReported.current = true;
      onComplete();
    }
  }

  function placeItem(itemId: string, destinationIndex: number) {
    if (
      complete ||
      itemId === demonstratedItemId ||
      destinationIndex === demonstratedPosition
    ) {
      return;
    }

    const sourceIndex = positions.indexOf(itemId);
    const displacedItemId = positions[destinationIndex];
    const nextPositions = [...positions];

    if (sourceIndex >= 0 && sourceIndex !== destinationIndex) {
      nextPositions[sourceIndex] = displacedItemId;
    }

    nextPositions[destinationIndex] = itemId;
    setPositions(nextPositions);
    setSelectedItemId(null);
    validate(nextPositions);
  }

  function removeItem(destinationIndex: number) {
    if (destinationIndex === demonstratedPosition) return;

    const itemId = positions[destinationIndex];
    if (!itemId) return;

    const wasComplete = complete;
    const nextPositions = [...positions];
    nextPositions[destinationIndex] = null;

    pendingFocusItemId.current = itemId;
    completionReported.current = false;
    setPositions(nextPositions);
    setSelectedItemId(null);
    setComplete(false);
    setFeedback("Peça devolvida. Continue montando o caminho.");

    if (wasComplete) {
      onIncomplete?.();
    }
  }

  function releasePointerDrag(event: PointerEvent<HTMLButtonElement>) {
    const start = pointerStart.current;

    if (start && didPointerDrag.current) {
      const positionIndex = findPositionIndex(
        document.elementFromPoint(event.clientX, event.clientY),
      );

      if (positionIndex !== null) {
        placeItem(start.itemId, positionIndex);
      }
    }

    pointerStart.current = null;
    setDraggedItemId(null);
    setActivePosition(null);
  }

  function beginNativeDrag(
    event: DragEvent<HTMLButtonElement>,
    itemId: string,
  ) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", itemId);
    setSelectedItemId(itemId);
    setDraggedItemId(itemId);
  }

  const learnerItems = items.filter(
    (item) => item.id !== demonstratedItemId,
  );

  return (
    <section
      className={styles.activity}
      data-philoo-causal-path
      data-complete={complete ? "true" : "false"}
      aria-label={activityLabel}
    >
      <div className={styles.pieceTray}>
        <div className={styles.trayHeading}>
          <span>Peças do caminho</span>
          <small>Toque ou arraste</small>
        </div>
        <div className={styles.pieces}>
          {learnerItems.map((item, itemIndex) => {
            const selected = selectedItemId === item.id;
            const placedPosition = positions.indexOf(item.id);
            const placed = placedPosition >= 0;
            const stateDescriptionId = `${instanceId}-piece-${itemIndex}-state`;
            const stateDescription = selected
              ? "Peça selecionada."
              : placed
                ? `Colocada na posição ${placedPosition + 1}.`
                : "Peça disponível.";

            return (
              <div className={styles.pieceCell} key={item.id}>
                <button
                  type="button"
                  ref={(button) => {
                    if (button) {
                      trayButtonRefs.current.set(item.id, button);
                    } else {
                      trayButtonRefs.current.delete(item.id);
                    }
                  }}
                  className={styles.piece}
                  aria-describedby={stateDescriptionId}
                  aria-pressed={selected}
                  data-causal-piece={item.id}
                  data-placed={placed ? "true" : "false"}
                  data-dragging={draggedItemId === item.id ? "true" : "false"}
                  draggable={!complete}
                  disabled={complete}
                  onClick={() => {
                    if (didPointerDrag.current) {
                      didPointerDrag.current = false;
                      return;
                    }

                    setSelectedItemId(item.id);
                    setFeedback(
                      `Agora escolha uma posição para ${item.label.toLowerCase()}.`,
                    );
                  }}
                  onDragStart={(event) => beginNativeDrag(event, item.id)}
                  onDragEnd={() => {
                    setDraggedItemId(null);
                    setActivePosition(null);
                  }}
                  onPointerDown={(event) => {
                    pointerStart.current = {
                      itemId: item.id,
                      x: event.clientX,
                      y: event.clientY,
                    };
                    didPointerDrag.current = false;
                  }}
                  onPointerMove={(event) => {
                    const start = pointerStart.current;
                    if (!start) return;

                    const distance = Math.hypot(
                      event.clientX - start.x,
                      event.clientY - start.y,
                    );
                    if (distance < 8) return;

                    didPointerDrag.current = true;
                    setSelectedItemId(item.id);
                    setDraggedItemId(item.id);
                    setActivePosition(
                      findPositionIndex(
                        document.elementFromPoint(
                          event.clientX,
                          event.clientY,
                        ),
                      ),
                    );
                  }}
                  onPointerUp={releasePointerDrag}
                  onPointerCancel={() => {
                    pointerStart.current = null;
                    setDraggedItemId(null);
                    setActivePosition(null);
                  }}
                >
                  <span className={styles.pieceIcon} aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.label}
                </button>
                <span className={styles.srOnly} id={stateDescriptionId}>
                  {stateDescription}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <ol className={styles.path} aria-label={pathLabel}>
        {positions.map((itemId, positionIndex) => {
          const item = items.find((candidate) => candidate.id === itemId);
          const demonstrated = positionIndex === demonstratedPosition;
          const removable = Boolean(item) && !demonstrated;
          const descriptionId = `${instanceId}-position-${positionIndex}-description`;

          return (
            <li
              key={positionIndex}
              className={styles.position}
              data-filled={item ? "true" : "false"}
              data-active={activePosition === positionIndex ? "true" : "false"}
              style={{ "--path-order": positionIndex } as React.CSSProperties}
            >
              <span className={styles.positionNumber} aria-hidden="true">
                {positionIndex + 1}
              </span>
              <button
                type="button"
                className={styles.positionButton}
                aria-label={
                  item
                    ? removable
                      ? `Posição ${positionIndex + 1}, ${item.label}. Devolver peça`
                      : `Posição ${positionIndex + 1}, ${item.label}`
                    : `Posição ${positionIndex + 1}, vazia`
                }
                aria-describedby={descriptionId}
                aria-disabled={
                  demonstrated || (complete && !removable) || (!removable && !selectedItemId)
                    ? "true"
                    : "false"
                }
                data-causal-position={positionIndex}
                data-demonstrated={demonstrated ? "true" : undefined}
                data-removable={removable ? "true" : undefined}
                disabled={demonstrated || (complete && !removable)}
                onClick={() => {
                  if (removable) {
                    removeItem(positionIndex);
                  } else if (selectedItemId) {
                    placeItem(selectedItemId, positionIndex);
                  }
                }}
                onDragOver={(event) => {
                  if (demonstrated || complete || removable) return;
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                  setActivePosition(positionIndex);
                }}
                onDragLeave={() => setActivePosition(null)}
                onDrop={(event) => {
                  event.preventDefault();
                  const itemId = event.dataTransfer.getData("text/plain");
                  if (items.some((candidate) => candidate.id === itemId)) {
                    placeItem(itemId, positionIndex);
                  }
                  setDraggedItemId(null);
                  setActivePosition(null);
                }}
              >
                {item ? (
                  <>
                    <span className={styles.positionIcon} aria-hidden="true">
                      {item.icon}
                    </span>
                    {item.label}
                  </>
                ) : (
                  `Posição ${positionIndex + 1}`
                )}
              </button>
              <p id={descriptionId}>
                {item
                  ? demonstrated
                    ? positionHints[positionIndex]
                    : item.explanation
                  : positionHints[positionIndex]}
              </p>
            </li>
          );
        })}
      </ol>

      <p
        className={styles.feedback}
        data-feedback={
          complete
            ? "complete"
            : positions.every(Boolean)
              ? "causal-break"
              : "guidance"
        }
        role="status"
        aria-live="polite"
      >
        {feedback}
      </p>
    </section>
  );
}
