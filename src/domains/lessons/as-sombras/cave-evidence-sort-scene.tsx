"use client";

import { BrainIcon, EyeIcon, QuestionIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { PhilooFolioStage } from "../philoo-folio-stage";
import { PhilooStoryShell } from "../philoo-story-shell";
import { PlatoGuide } from "../plato-guide";
import type { PlatoPoseKey } from "../plato-pose-catalog";
import {
  PhilooDiscoveryTable,
  type DiscoveryCard,
  type DiscoveryDestination,
} from "../interactions/philoo-discovery-table";
import { AS_SOMBRAS_JOURNEY_STAGES } from "./as-sombras-journey";
import styles from "./cave-evidence-sort-scene.module.css";

type DestinationId = "observed" | "concluded" | "unknown";

type EvidenceCard = DiscoveryCard & {
  answer: DestinationId;
};

const DESTINATIONS = [
  {
    id: "observed",
    label: "Vi",
    hint: "A parede mostrou isso.",
    tone: "blue",
    icon: <EyeIcon size={22} weight="duotone" />,
  },
  {
    id: "concluded",
    label: "Concluí",
    hint: "Completei o que faltava com uma ideia.",
    tone: "apricot",
    icon: <BrainIcon size={22} weight="duotone" />,
  },
  {
    id: "unknown",
    label: "Ainda não sei",
    hint: "A parede não permite confirmar.",
    tone: "lavender",
    icon: <QuestionIcon size={22} weight="duotone" />,
  },
] satisfies readonly DiscoveryDestination<DestinationId>[];

const CARDS: EvidenceCard[] = [
  { id: "shape", text: "Uma forma cruzou a parede.", answer: "observed" },
  { id: "size", text: "A sombra mudou de tamanho.", answer: "observed" },
  { id: "horse", text: "Um cavalo passou atrás delas.", answer: "concluded" },
  { id: "voice", text: "A voz pertencia à sombra.", answer: "concluded" },
  { id: "fire", text: "Havia uma fogueira atrás delas.", answer: "unknown" },
  { id: "wall", text: "Nada existia além da parede.", answer: "unknown" },
];

export function CaveEvidenceSortScene() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, DestinationId>>({});
  const [hasChecked, setHasChecked] = useState(false);
  const selected = CARDS.find((card) => card.id === selectedId);
  const placedCount = Object.keys(placements).length;
  const allPlaced = placedCount === CARDS.length;
  const incorrectCount = useMemo(
    () => CARDS.filter((card) => placements[card.id] && placements[card.id] !== card.answer).length,
    [placements],
  );
  const platoPose: PlatoPoseKey = hasChecked
    ? incorrectCount === 0
      ? "celebrate-discovery"
      : "gentle-retry"
    : "guided-classification";

  function chooseCard(id: string) {
    setSelectedId(id);
    setHasChecked(false);
  }

  function placeIn(destination: DestinationId) {
    if (!selectedId) return;
    moveCard(selectedId, destination);
  }

  function moveCard(cardId: string, destination: DestinationId) {
    setPlacements((current) => ({ ...current, [cardId]: destination }));
    setSelectedId(null);
    setHasChecked(false);
  }

  return (
    <PhilooStoryShell
      backHref="/aula/as-sombras/eles-dao-nomes"
      currentBeat={5}
      totalBeats={10}
      labelledBy="evidence-title"
      phase="idle"
      surfaceWidth="narrative"
      surfaceTreatment="folio"
      showSoftFrame={false}
      journey={{
        lessonTitle: "As Sombras",
        currentSceneId: "o-que-chegou-ate-eles",
        stages: AS_SOMBRAS_JOURNEY_STAGES,
        storageKey: "philoo:journey:as-sombras",
      }}
    >
      <PhilooFolioStage
        eyebrow="Cena 5 · Primeiro desafio"
        title="O que realmente chegou até elas?"
        titleId="evidence-title"
        context="Separe o que foi visto do que foi apenas concluído."
        currentMoment={5}
        totalMoments={5}
      >
        <section className={styles.workspace} aria-labelledby="evidence-title">
          <div className={styles.introRow}>
            <div className={styles.guidance} data-activity-guidance>
              <PlatoGuide
                className={styles.activityGuide}
                pose={platoPose}
                stageBeat={hasChecked ? (incorrectCount === 0 ? 2 : 1) : 0}
                sizes="(max-width: 760px) 140px, 240px"
                priority
              />
              <div className={styles.guideCopy}>
                <p className={styles.label}>Platão propõe um desafio</p>
                <p className={styles.spokenChallenge}>
                  <span className={styles.desktopInstruction}>
                    Escolha uma pista e arraste para o bolso que fizer mais
                    sentido.
                  </span>
                  <span className={styles.phoneInstruction}>
                    Leia a pista e escolha o bolso que fizer mais sentido.
                  </span>
                </p>
                <p className={styles.fallbackInstruction}>
                  <span className={styles.desktopInstruction}>
                    Se preferir, toque na pista e depois no bolso.
                  </span>
                  <span className={styles.phoneInstruction}>
                    Toque em uma das três opções para continuar.
                  </span>
                </p>
              </div>
            </div>

            <div className={styles.instructions} role="status" aria-live="polite">
              <span
                className={styles.progressNumber}
                data-progress-fraction
                aria-label={`${placedCount} de ${CARDS.length} pistas organizadas`}
              >
                <strong aria-hidden="true">{placedCount}</strong>
                <i aria-hidden="true" />
                <small aria-hidden="true">{CARDS.length}</small>
              </span>
              <p>
                {selected ? (
                  <>
                    <strong>“{selected.text}”</strong>
                    <span>Arraste ou escolha um bolso.</span>
                  </>
                ) : (
                  <>
                    <strong>
                      {placedCount} de {CARDS.length} pistas organizadas
                    </strong>
                    <span>Continue investigando.</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <PhilooDiscoveryTable
            cards={CARDS}
            destinations={DESTINATIONS}
            placements={placements}
            selectedCardId={selectedId}
            onSelectCard={chooseCard}
            onPlaceCard={placeIn}
            onMoveCard={moveCard}
          />

          {allPlaced ? (
            <div className={styles.checkArea}>
              {!hasChecked ? (
                <button
                  type="button"
                  className={styles.checkButton}
                  onClick={() => setHasChecked(true)}
                >
                  Conferir descobertas <span aria-hidden="true">→</span>
                </button>
              ) : (
                <div
                  className={styles.feedback}
                  data-result={incorrectCount === 0 ? "correct" : "retry"}
                  role="status"
                >
                  {incorrectCount === 0 ? (
                    <>
                      <strong>
                        Você separou o que a parede mostrou do que elas
                        imaginaram.
                      </strong>
                      <span>
                        Agora você consegue notar a diferença entre ver,
                        concluir e ainda não saber.
                      </span>
                    </>
                  ) : (
                    <>
                      <strong>
                        {incorrectCount}{" "}
                        {incorrectCount === 1
                          ? "pista precisa"
                          : "pistas precisam"}{" "}
                        de outro olhar.
                      </strong>
                      <span>
                        Toque nas pistas para experimentar outro bolso. Seu
                        raciocínio pode mudar enquanto você investiga.
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </section>
      </PhilooFolioStage>
    </PhilooStoryShell>
  );
}
