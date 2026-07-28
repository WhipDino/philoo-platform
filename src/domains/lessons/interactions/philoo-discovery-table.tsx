"use client";

import {
  LayoutGroup,
  LazyMotion,
  MotionConfig,
  domMax,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import * as m from "motion/react-m";
import { useId, useRef, useState, type ReactNode } from "react";
import styles from "./philoo-discovery-table.module.css";

export type DiscoveryCard = {
  id: string;
  text: string;
};

export type DiscoveryDestination<DestinationId extends string> = {
  id: DestinationId;
  label: string;
  hint: string;
  tone: "blue" | "apricot" | "lavender";
  icon: ReactNode;
};

export type PhilooDiscoveryTableProps<DestinationId extends string> = {
  cards: readonly DiscoveryCard[];
  destinations: readonly DiscoveryDestination<DestinationId>[];
  placements: Readonly<Record<string, DestinationId>>;
  selectedCardId: string | null;
  onSelectCard: (cardId: string) => void;
  onPlaceCard: (destinationId: DestinationId) => void;
  onMoveCard: (cardId: string, destinationId: DestinationId) => void;
};

export function readDiscoveryDestinationId<DestinationId extends string>(
  element: Element | null,
  destinations: readonly DiscoveryDestination<DestinationId>[],
) {
  const pocket = element?.closest<HTMLElement>("[data-discovery-destination]");
  const id = pocket?.dataset.discoveryDestination;

  return destinations.some((destination) => destination.id === id)
    ? (id as DestinationId)
    : null;
}

export function PhilooDiscoveryTable<DestinationId extends string>({
  cards,
  destinations,
  placements,
  selectedCardId,
  onSelectCard,
  onPlaceCard,
  onMoveCard,
}: PhilooDiscoveryTableProps<DestinationId>) {
  const instanceId = useId();
  const shouldReduceMotion = useReducedMotion();
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [activeDestinationId, setActiveDestinationId] =
    useState<DestinationId | null>(null);
  const pointerStart = useRef({ x: 0, y: 0 });
  const didPointerDrag = useRef(false);
  const unplacedCards = cards.filter((card) => !placements[card.id]);
  const complete = unplacedCards.length === 0;
  const draggedPlacement = draggedCardId
    ? placements[draggedCardId]
    : undefined;
  const cardTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        layout: {
          type: "spring" as const,
          stiffness: 420,
          damping: 32,
          mass: 0.78,
        },
      };

  function renderCard(card: DiscoveryCard, placed = false) {
    const selected = card.id === selectedCardId;

    return (
      <m.button
        type="button"
        className={styles.card}
        data-selected={selected}
        data-placed={placed}
        data-dragging={draggedCardId === card.id ? "true" : "false"}
        data-draggable-card={card.id}
        aria-pressed={selected}
        drag
        dragMomentum={false}
        dragSnapToOrigin
        layout
        layoutId={`${instanceId}-discovery-card-${card.id}`}
        transition={cardTransition}
        whileHover={shouldReduceMotion ? undefined : { y: -3 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
        whileDrag={
          shouldReduceMotion
            ? undefined
            : { scale: 1.045, rotate: -1.25, zIndex: 30 }
        }
        onPointerDown={(event) => {
          pointerStart.current = { x: event.clientX, y: event.clientY };
          didPointerDrag.current = false;
          setDraggedCardId(card.id);
          onSelectCard(card.id);
        }}
        onPointerMove={(event) => {
          const distance = Math.hypot(
            event.clientX - pointerStart.current.x,
            event.clientY - pointerStart.current.y,
          );

          if (distance < 6) return;
          didPointerDrag.current = true;
          setActiveDestinationId(
            readDiscoveryDestinationId(
              document.elementFromPoint(event.clientX, event.clientY),
              destinations,
            ),
          );
        }}
        onPointerUp={(event) => {
          if (didPointerDrag.current) {
            const destinationId = readDiscoveryDestinationId(
              document.elementFromPoint(event.clientX, event.clientY),
              destinations,
            );

            if (destinationId) {
              onMoveCard(card.id, destinationId);
            }
          }

          setDraggedCardId(null);
          setActiveDestinationId(null);
        }}
        onDragStart={() => {
          setDraggedCardId(card.id);
        }}
        onDrag={(_, info: PanInfo) => {
          const element = document.elementFromPoint(info.point.x, info.point.y);
          setActiveDestinationId(
            readDiscoveryDestinationId(element, destinations),
          );
        }}
        onDragEnd={(_, info: PanInfo) => {
          const element = document.elementFromPoint(info.point.x, info.point.y);
          const destinationId = readDiscoveryDestinationId(
            element,
            destinations,
          );

          if (destinationId) {
            onMoveCard(card.id, destinationId);
          }

          setDraggedCardId(null);
          setActiveDestinationId(null);
        }}
        onClick={() => {
          if (!didPointerDrag.current) {
            onSelectCard(card.id);
          }
          didPointerDrag.current = false;
        }}
        key={card.id}
      >
        <span className={styles.cardGrip} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>{card.text}</span>
      </m.button>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domMax} strict>
        <LayoutGroup id={`${instanceId}-discovery-table`}>
          <section
            className={styles.table}
            data-philoo-discovery-table
            data-dragging={draggedCardId ? "true" : "false"}
            data-complete={complete ? "true" : "false"}
            aria-label="Mesa de descobertas"
          >
            <section
              className={styles.tray}
              data-source-tray
              data-empty={complete ? "true" : "false"}
              data-drag-source={
                draggedCardId && !draggedPlacement ? "true" : "false"
              }
              aria-labelledby={`${instanceId}-tray-title`}
            >
              <span className={styles.trayUnderlay} aria-hidden="true" />
              <div className={styles.trayHeading}>
                <div>
                  <span className={styles.kicker}>Escolha uma pista</span>
                  <h2 id={`${instanceId}-tray-title`}>Pistas da parede</h2>
                </div>
                <span className={styles.trayCount}>
                  {unplacedCards.length}
                </span>
              </div>
              <div className={styles.cardGrid}>
                {unplacedCards.map((card) => renderCard(card))}
                {unplacedCards.length === 0 ? (
                  <div className={styles.completedTray}>
                    <span className={styles.completedMark} aria-hidden="true">
                      ✓
                    </span>
                    <p>
                      <strong>Todas as pistas foram organizadas</strong>
                      <span>Agora revise os bolsos antes de conferir.</span>
                    </p>
                  </div>
                ) : null}
              </div>
            </section>

            <div
              className={styles.pockets}
              aria-label="Bolsos para organizar as pistas"
            >
              {destinations.map((destination) => {
                const destinationCards = cards.filter(
                  (card) => placements[card.id] === destination.id,
                );
                const titleId = `${instanceId}-${destination.id}-title`;

                return (
                  <m.section
                    className={styles.pocket}
                    data-tone={destination.tone}
                    data-receiving={selectedCardId ? "true" : "false"}
                    data-drag-over={
                      draggedCardId && activeDestinationId === destination.id
                        ? "true"
                        : "false"
                    }
                    data-discovery-destination={destination.id}
                    data-drag-source={
                      draggedCardId &&
                      draggedPlacement === destination.id
                        ? "true"
                        : "false"
                    }
                    aria-labelledby={titleId}
                    layout
                    transition={cardTransition}
                    key={destination.id}
                  >
                    <span className={styles.pocketLayer} aria-hidden="true" />
                    <button
                      type="button"
                      className={styles.pocketButton}
                      aria-label={`${destination.label} — ${destination.hint}`}
                      disabled={!selectedCardId}
                      onClick={() => onPlaceCard(destination.id)}
                    >
                      <span className={styles.pocketIcon} aria-hidden="true">
                        {destination.icon}
                      </span>
                      <span className={styles.pocketCopy}>
                        <strong id={titleId}>{destination.label}</strong>
                        <small>{destination.hint}</small>
                      </span>
                      <span className={styles.dropCue} aria-hidden="true">
                        guardar
                      </span>
                    </button>
                    <div className={styles.pocketSlot}>
                      {destinationCards.length > 0 ? (
                        destinationCards.map((card) => renderCard(card, true))
                      ) : (
                        <span className={styles.emptyPocket}>
                          {selectedCardId
                            ? "Colocar aqui"
                            : "Ainda sem pistas"}
                        </span>
                      )}
                    </div>
                  </m.section>
                );
              })}
            </div>
          </section>
        </LayoutGroup>
      </LazyMotion>
    </MotionConfig>
  );
}
