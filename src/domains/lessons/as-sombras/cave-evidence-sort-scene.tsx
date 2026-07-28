"use client";

import {
  ArrowRightIcon,
  BrainIcon,
  EyeIcon,
  QuestionIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { PhilooFolioStage } from "../philoo-folio-stage";
import { PhilooStoryShell } from "../philoo-story-shell";
import { PlatoGuide } from "../plato-guide";
import type { PlatoPoseKey } from "../plato-pose-catalog";
import { PhilooActivityBriefing } from "../interactions/philoo-activity-briefing";
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
  { id: "shape", text: "Uma forma atravessou a parede.", answer: "observed" },
  {
    id: "object",
    text: "A forma era produzida por um objeto.",
    answer: "concluded",
  },
  {
    id: "voice",
    text: "A voz vinha da própria sombra.",
    answer: "concluded",
  },
  {
    id: "outside",
    text: "Do ponto de vista dos prisioneiros, existia um mundo fora da caverna.",
    answer: "unknown",
  },
];

const FEEDBACK: Record<DestinationId, string> = {
  observed: "Isso apareceu diretamente na parede.",
  concluded: "Essa explicação completa algo que os prisioneiros não viram.",
  unknown: "Da posição deles, ainda faltam pistas para afirmar isso.",
};

function subscribeToClient() {
  return () => {};
}

export function CaveEvidenceSortScene() {
  const canRenderBriefing = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );
  const [briefingOpen, setBriefingOpen] = useState(true);
  const [exampleAcknowledged, setExampleAcknowledged] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, DestinationId>>({});
  const [hasChecked, setHasChecked] = useState(false);
  const [reasoning, setReasoning] = useState<string | null>(null);
  const hasDismissedBriefing = useRef(false);
  const exampleButtonRef = useRef<HTMLButtonElement>(null);
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
  const completedCorrectly = hasChecked && incorrectCount === 0;

  useEffect(() => {
    if (!briefingOpen && !exampleAcknowledged && hasDismissedBriefing.current) {
      exampleButtonRef.current?.focus();
    }
  }, [briefingOpen, exampleAcknowledged]);

  function closeBriefing() {
    hasDismissedBriefing.current = true;
    setBriefingOpen(false);
  }

  function chooseCard(id: string) {
    setSelectedId(id);
    setHasChecked(false);
    setReasoning(null);
  }

  function placeIn(destination: DestinationId) {
    if (!selectedId) return;
    moveCard(selectedId, destination);
  }

  function moveCard(cardId: string, destination: DestinationId) {
    setPlacements((current) => ({ ...current, [cardId]: destination }));
    setSelectedId(null);
    setHasChecked(false);
    const card = CARDS.find((item) => item.id === cardId);
    setReasoning(
      card && card.answer !== destination
        ? FEEDBACK[card.answer]
        : "Essa escolha combina com o que os prisioneiros poderiam afirmar.",
    );
  }

  return (
    <>
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
          eyebrow="Cena 8 · Hora de aplicar"
          title="O que realmente chegou até elas?"
          titleId="evidence-title"
          context="Separe o que foi visto do que foi apenas concluído."
          action={
            completedCorrectly ? (
              <Link href="/aula/as-sombras/a-primeira-duvida">
                Seguir a dúvida <span aria-hidden="true">→</span>
              </Link>
            ) : undefined
          }
          footerLabel={exampleAcknowledged ? "Aplicação independente" : "Exemplo guiado"}
        >
          <section className={styles.workspace} aria-labelledby="evidence-title">
            <div className={styles.activityHeading}>
              <p>
                <strong>
                  {exampleAcknowledged
                    ? "Agora é a sua vez."
                    : "Primeiro, veja como Platão separa uma pista."}
                </strong>
                <span>
                  {exampleAcknowledged
                    ? "Você pode mudar qualquer escolha antes de conferir."
                    : "O exemplo não conta nas quatro pistas do desafio."}
                </span>
              </p>
              <button
                type="button"
                className={styles.helpButton}
                onClick={() => setBriefingOpen(true)}
              >
                <QuestionIcon aria-hidden="true" weight="bold" />
                Como jogar
              </button>
            </div>

            {!exampleAcknowledged ? (
              <section className={styles.workedExample} aria-labelledby="example-title">
                <PlatoGuide
                  className={styles.exampleGuide}
                  pose="guided-classification"
                  sizes="(max-width: 540px) 120px, 210px"
                  priority
                />
                <div className={styles.exampleCopy}>
                  <p className={styles.label} id="example-title">
                    Platão mostra o primeiro exemplo
                  </p>
                  <div className={styles.exampleMove}>
                    <span>Uma forma atravessou a parede.</span>
                    <ArrowRightIcon aria-hidden="true" weight="bold" />
                    <strong>
                      <EyeIcon aria-hidden="true" weight="duotone" />
                      Vi
                    </strong>
                  </div>
                  <p>
                    A forma apareceu diretamente na parede. Por isso, ela vai
                    para o bolso <strong>Vi</strong>.
                  </p>
                  <button
                    ref={exampleButtonRef}
                    type="button"
                    onClick={() => setExampleAcknowledged(true)}
                  >
                    Entendi o exemplo <span aria-hidden="true">→</span>
                  </button>
                </div>
              </section>
            ) : (
              <>
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
                          Escolha uma pista e arraste para o bolso que fizer
                          mais sentido.
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

                <div className={styles.reasoning} role="status" aria-live="polite">
                  {reasoning ?? "Escolha uma pista para começar."}
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
                              Você separou o que eles viram do que apenas
                              imaginaram.
                            </strong>
                            <span>
                              Ver, concluir e ainda não saber são movimentos
                              diferentes do pensamento.
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
                              Toque nas pistas para experimentar outro bolso.
                              Seu raciocínio pode mudar enquanto você investiga.
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ) : null}
              </>
            )}
          </section>
        </PhilooFolioStage>
      </PhilooStoryShell>

      {canRenderBriefing ? (
        <PhilooActivityBriefing
          open={briefingOpen}
          title="Organize as pistas"
          purpose="Descubra a diferença entre o que apareceu na parede, o que foi completado pela imaginação e o que ainda não pode ser afirmado."
          steps={[
            "Leia uma pista.",
            "Guarde em Vi, Concluí ou Ainda não sei.",
            "Mude de bolso quando quiser revisar.",
          ]}
          startLabel={
            hasDismissedBriefing.current
              ? "Voltar ao desafio"
              : "Começar o desafio"
          }
          guidePose="guided-classification"
          demonstration={
            <div className={styles.briefingDemo}>
              <span>
                <EyeIcon aria-hidden="true" weight="duotone" />
                Vi
              </span>
              <span>
                <BrainIcon aria-hidden="true" weight="duotone" />
                Concluí
              </span>
              <span>
                <QuestionIcon aria-hidden="true" weight="duotone" />
                Ainda não sei
              </span>
            </div>
          }
          onClose={closeBriefing}
        />
      ) : null}
    </>
  );
}
