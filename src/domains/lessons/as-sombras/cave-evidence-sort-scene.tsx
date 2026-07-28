"use client";

import { useMemo, useState } from "react";
import { PhilooFolioStage } from "../philoo-folio-stage";
import { PhilooStoryShell } from "../philoo-story-shell";
import { PlatoGuide } from "../plato-guide";
import type { PlatoPoseKey } from "../plato-pose-catalog";
import { AS_SOMBRAS_JOURNEY_STAGES } from "./as-sombras-journey";
import styles from "./cave-evidence-sort-scene.module.css";

type DestinationId = "observed" | "concluded" | "unknown";

type EvidenceCard = {
  id: string;
  text: string;
  answer: DestinationId;
};

const DESTINATIONS: { id: DestinationId; label: string; hint: string }[] = [
  { id: "observed", label: "Observaram", hint: "A parede mostrou isso." },
  { id: "concluded", label: "Concluíram", hint: "Elas imaginaram a partir do que viram." },
  { id: "unknown", label: "Ainda não podiam saber", hint: "Não havia como confirmar só pela parede." },
];

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
    : "review-evidence";

  function chooseCard(id: string) {
    setSelectedId(id);
    setHasChecked(false);
  }

  function placeIn(destination: DestinationId) {
    if (!selectedId) return;
    setPlacements((current) => ({ ...current, [selectedId]: destination }));
    setSelectedId(null);
    setHasChecked(false);
  }

  const unplacedCards = CARDS.filter((card) => !placements[card.id]);

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
        <div className={styles.guidance}>
          <PlatoGuide
            className={styles.activityGuide}
            pose={platoPose}
            stageBeat={hasChecked ? (incorrectCount === 0 ? 2 : 1) : 0}
            sizes="(max-width: 760px) 140px, 210px"
            priority
          />
          <div>
            <p className={styles.label}>Platão propõe um desafio</p>
            <p>As pessoas presas só podiam olhar para a parede. Escolha uma frase e coloque-a no lugar que mostra o que elas poderiam saber.</p>
          </div>
          <div className={styles.wallMark} aria-hidden="true"><span /><span /><span /></div>
        </div>

        <div className={styles.instructions} role="status" aria-live="polite">
          {selected ? <>Você escolheu <strong>“{selected.text}”</strong>. Agora escolha um lugar abaixo.</> : <>Escolha uma frase. Você organizou {placedCount} de {CARDS.length}.</>}
        </div>

        <div className={styles.evidenceTable}>
          <section className={styles.cardTray} aria-labelledby="statements-title">
            <div className={styles.trayHeading}><p>Fragmentos da parede</p><h2 id="statements-title">O que se ouviu e se viu</h2></div>
            <div className={styles.cardStack}>
              {unplacedCards.map((card) => <EvidenceButton key={card.id} card={card} selected={card.id === selectedId} onChoose={chooseCard} />)}
              {unplacedCards.length === 0 && <p className={styles.empty}>Todas as frases já estão sobre a mesa.</p>}
            </div>
          </section>

          <div className={styles.destinations} aria-label="Lugares para as frases">
            {DESTINATIONS.map((destination) => {
              const cards = CARDS.filter((card) => placements[card.id] === destination.id);
              return <section className={styles.destination} key={destination.id} data-destination={destination.id} aria-labelledby={`${destination.id}-title`}>
                <button type="button" className={styles.destinationButton} onClick={() => placeIn(destination.id)} disabled={!selectedId} aria-describedby={`${destination.id}-hint`}>
                  <span id={`${destination.id}-title`}>{destination.label}</span><small id={`${destination.id}-hint`}>{destination.hint}</small>
                </button>
                <div className={styles.placedCards}>
                  {cards.map((card) => <EvidenceButton key={card.id} card={card} selected={card.id === selectedId} onChoose={chooseCard} placed />)}
                </div>
              </section>;
            })}
          </div>
        </div>

        {allPlaced && <div className={styles.checkArea}>
          {!hasChecked ? <button type="button" className={styles.checkButton} onClick={() => setHasChecked(true)}>Conferir caminho <span aria-hidden="true">→</span></button> : <div className={styles.feedback} role="status">{incorrectCount === 0 ? <><strong>Você separou o que a parede mostrou do que elas imaginaram.</strong><span>Agora você consegue notar a diferença entre ver, concluir e ainda não saber.</span></> : <><strong>{incorrectCount} {incorrectCount === 1 ? "frase precisa" : "frases precisam"} de outro olhar.</strong><span>Reveja as frases que você colocou: você pode tocar nelas e mudar de lugar.</span></>}</div>}
        </div>}
        </section>
      </PhilooFolioStage>
    </PhilooStoryShell>
  );
}

function EvidenceButton({ card, selected, onChoose, placed = false }: { card: EvidenceCard; selected: boolean; onChoose: (id: string) => void; placed?: boolean }) {
  return <button type="button" className={styles.evidenceCard} data-selected={selected} data-placed={placed} onClick={() => onChoose(card.id)} aria-pressed={selected}>{card.text}</button>;
}
