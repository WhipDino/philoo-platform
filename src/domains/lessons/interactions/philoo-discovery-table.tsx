"use client";

import {
  LayoutGroup,
  LazyMotion,
  MotionConfig,
  domMax,
  useReducedMotion,
} from "motion/react";
import * as m from "motion/react-m";
import { useId, type ReactNode } from "react";
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
};

export function PhilooDiscoveryTable<DestinationId extends string>({
  cards,
  destinations,
  placements,
  selectedCardId,
  onSelectCard,
  onPlaceCard,
}: PhilooDiscoveryTableProps<DestinationId>) {
  const instanceId = useId();
  const shouldReduceMotion = useReducedMotion();
  const unplacedCards = cards.filter((card) => !placements[card.id]);
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
        aria-pressed={selected}
        layout
        layoutId={`${instanceId}-discovery-card-${card.id}`}
        transition={cardTransition}
        whileHover={shouldReduceMotion ? undefined : { y: -3 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
        onClick={() => onSelectCard(card.id)}
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
            aria-label="Mesa de descobertas"
          >
            <section className={styles.tray} aria-labelledby={`${instanceId}-tray-title`}>
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
                  <p className={styles.emptyTray}>
                    Todas as pistas já encontraram um lugar.
                  </p>
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
