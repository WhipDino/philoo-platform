"use client";

import { CheckIcon } from "@phosphor-icons/react";
import {
  LayoutGroup,
  LazyMotion,
  MotionConfig,
  domMax,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import * as m from "motion/react-m";
import {
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
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

const PHONE_DISCOVERY_QUERY = "(max-width: 540px)";

function subscribeToPhoneDiscovery(onChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};

  const query = window.matchMedia(PHONE_DISCOVERY_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function readPhoneDiscovery() {
  return (
    typeof window !== "undefined" &&
    Boolean(window.matchMedia?.(PHONE_DISCOVERY_QUERY).matches)
  );
}

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
  const usePhoneDiscovery = useSyncExternalStore(
    subscribeToPhoneDiscovery,
    readPhoneDiscovery,
    () => false,
  );
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [activeDestinationId, setActiveDestinationId] =
    useState<DestinationId | null>(null);
  const pointerStart = useRef({ x: 0, y: 0 });
  const didPointerDrag = useRef(false);
  const unplacedCards = cards.filter((card) => !placements[card.id]);
  const complete = unplacedCards.length === 0;
  const mobileActiveCard =
    cards.find((card) => card.id === selectedCardId) ?? unplacedCards[0] ?? null;
  const mobileActiveIndex = mobileActiveCard
    ? cards.findIndex((card) => card.id === mobileActiveCard.id)
    : cards.length - 1;
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
          <div className={styles.discovery}>
            {!usePhoneDiscovery ? (
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
                        <CheckIcon weight="bold" />
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
            ) : null}

            {usePhoneDiscovery ? (
              <section
                className={styles.mobileDiscovery}
                data-mobile-discovery
                aria-label="Classificação guiada das pistas"
              >
              <div className={styles.mobileProgress} aria-live="polite">
                <span>
                  Pista {Math.min(mobileActiveIndex + 1, cards.length)} de{" "}
                  {cards.length}
                </span>
                <strong>{Object.keys(placements).length} organizadas</strong>
              </div>

              {mobileActiveCard ? (
                <>
                  <m.div
                    className={styles.mobileClue}
                    data-mobile-clue={mobileActiveCard.id}
                    layout
                    transition={cardTransition}
                    key={mobileActiveCard.id}
                  >
                    <span className={styles.mobileClueLabel}>
                      O que esta pista permite afirmar?
                    </span>
                    <strong>{mobileActiveCard.text}</strong>
                  </m.div>

                  <div
                    className={styles.mobileDestinations}
                    aria-label="Escolha onde guardar esta pista"
                  >
                    {destinations.map((destination) => (
                      <m.button
                        type="button"
                        className={styles.mobileDestination}
                        data-tone={destination.tone}
                        data-mobile-destination={destination.id}
                        aria-label={`${destination.label} — ${destination.hint}`}
                        onClick={() =>
                          onMoveCard(mobileActiveCard.id, destination.id)
                        }
                        whileTap={
                          shouldReduceMotion ? undefined : { scale: 0.98 }
                        }
                        key={destination.id}
                      >
                        <span className={styles.mobileDestinationIcon}>
                          {destination.icon}
                        </span>
                        <span>
                          <strong>{destination.label}</strong>
                          <small>{destination.hint}</small>
                        </span>
                        <b aria-hidden="true">→</b>
                      </m.button>
                    ))}
                  </div>
                </>
              ) : (
                <div className={styles.mobileComplete} role="status">
                  <span aria-hidden="true">
                    <CheckIcon weight="bold" />
                  </span>
                  <strong>Todas as pistas encontraram um lugar.</strong>
                  <small>Revise suas escolhas antes de conferir.</small>
                </div>
              )}

              {Object.keys(placements).length > 0 ? (
                <div className={styles.mobileReview}>
                  <span className={styles.mobileReviewTitle}>
                    Suas escolhas
                  </span>
                  <div>
                    {cards
                      .filter((card) => placements[card.id])
                      .map((card) => {
                        const destination = destinations.find(
                          (item) => item.id === placements[card.id],
                        );

                        return (
                          <button
                            type="button"
                            onClick={() => onSelectCard(card.id)}
                            aria-label={`Revisar: ${card.text}`}
                            key={card.id}
                          >
                            <span data-tone={destination?.tone}>
                              {destination?.icon}
                            </span>
                            <span>{card.text}</span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              ) : null}
              </section>
            ) : null}
          </div>
        </LayoutGroup>
      </LazyMotion>
    </MotionConfig>
  );
}
