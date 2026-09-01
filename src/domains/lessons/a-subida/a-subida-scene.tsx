"use client";

import { QuestionIcon, StarFourIcon, SunIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { PhilooFolioStage, PhilooFolioVoice } from "../philoo-folio-stage";
import { PhilooNarrativeComposition } from "../philoo-narrative-composition";
import { PlatoGuide } from "../plato-guide";
import { PhilooStoryShell } from "../philoo-story-shell";
import { PhilooActivityBriefing } from "../interactions/philoo-activity-briefing";
import { PhilooChoiceDemonstration } from "../interactions/philoo-choice-demonstration";
import { PhilooPairConnect } from "../interactions/philoo-pair-connect";
import { PhilooPairConnectDemonstration } from "../interactions/philoo-pair-connect-demonstration";
import { PredictionConsequence } from "../interactions/prediction-consequence";
import storyLayout from "../philoo-soft-story-layout.module.css";
import { A_SUBIDA_ASSETS } from "./a-subida-assets";
import {
  A_SUBIDA_FOLIO_BEATS,
  A_SUBIDA_SCENE_META,
  type ASubidaFolioBeat,
} from "./a-subida-content";
import {
  A_SUBIDA_JOURNEY_STAGES,
  type ASubidaSceneId,
} from "./a-subida-journey";
import styles from "./a-subida-scene.module.css";

type ASubidaSceneProps = {
  sceneId: ASubidaSceneId;
};

export function ASubidaScene({ sceneId }: ASubidaSceneProps) {
  return (
    <FolioBeatsLesson
      sceneId={sceneId}
      beats={A_SUBIDA_FOLIO_BEATS[sceneId]}
    />
  );
}

function isExerciseBeat(beat: ASubidaFolioBeat) {
  return beat.kind === "prediction" || beat.kind === "pair-connect";
}

function subscribeToClient() {
  return () => {};
}

function FolioBeatsLesson({
  sceneId,
  beats,
}: {
  sceneId: ASubidaSceneId;
  beats: readonly ASubidaFolioBeat[];
}) {
  const meta = A_SUBIDA_SCENE_META[sceneId];
  const canRenderBriefing = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );
  const [beatIndex, setBeatIndex] = useState(0);
  const [exerciseReady, setExerciseReady] = useState(false);
  const [briefingOpen, setBriefingOpen] = useState(true);
  const beat = beats[beatIndex];
  const isLastBeat = beatIndex === beats.length - 1;
  const panelAsset =
    beat?.kind === "story-panel" ? A_SUBIDA_ASSETS[beat.imageKey] : null;
  const currentBeat =
    A_SUBIDA_JOURNEY_STAGES.findIndex((stage) =>
      stage.sceneIds.some((id) => id === sceneId),
    ) + 1;

  const isConceptMoment = beat?.moment === "concept";
  const canAdvance = !beat || !isExerciseBeat(beat) || exerciseReady;

  useEffect(() => {
    setExerciseReady(false);
    if (beat && isExerciseBeat(beat)) {
      setBriefingOpen(true);
    }
  }, [beatIndex, beat]);

  if (!beat) {
    return null;
  }

  const actionLabel = (
    <>
      {beat.actionLabel}
      <span className={storyLayout.actionArrow} aria-hidden="true">
        →
      </span>
    </>
  );

  const helpButton = isExerciseBeat(beat) ? (
    <div className={styles.exerciseToolbar}>
      <button
        type="button"
        className={styles.helpButton}
        onClick={() => setBriefingOpen(true)}
      >
        <QuestionIcon aria-hidden="true" weight="bold" />
        Como jogar
      </button>
    </div>
  ) : null;

  return (
    <>
    <PhilooStoryShell
      backHref={meta.previousHref}
      onBack={
        beatIndex > 0
          ? () => setBeatIndex((current) => Math.max(0, current - 1))
          : undefined
      }
      currentBeat={currentBeat}
      totalBeats={A_SUBIDA_JOURNEY_STAGES.length}
      labelledBy="a-subida-title"
      phase="idle"
      className={
        beat.kind === "story-panel" ? storyLayout.storyPanelPage : undefined
      }
      surfaceWidth="narrative"
      surfaceTreatment="folio"
      showSoftFrame={false}
      journey={{
        lessonTitle: "A Subida",
        currentSceneId: sceneId,
        stages: A_SUBIDA_JOURNEY_STAGES,
        storageKey: "philoo:journey:a-subida",
      }}
    >
      <PhilooFolioStage
        eyebrow={meta.eyebrow}
        title={meta.title}
        titleId="a-subida-title"
        currentMoment={beatIndex + 1}
        totalMoments={beats.length}
        moment={isConceptMoment ? "concept" : "story"}
        action={
          !canAdvance ? undefined : isLastBeat ? (
            <Link href={meta.nextHref!}>{actionLabel}</Link>
          ) : (
            <button
              type="button"
              onClick={() =>
                setBeatIndex((current) =>
                  Math.min(current + 1, beats.length - 1),
                )
              }
            >
              {actionLabel}
            </button>
          )
        }
      >
        {beat.kind === "pair-connect" ? (
          <div className={`${styles.scene} ${styles.predictionCard}`}>
            {helpButton}
            <PhilooPairConnect
              prompt={beat.prompt}
              sources={beat.sources}
              targets={beat.targets}
              matches={beat.matches}
              successTitle={beat.successTitle}
              successBody={beat.successBody}
              onComplete={() => setExerciseReady(true)}
              onIncomplete={() => setExerciseReady(false)}
            />
          </div>
        ) : null}

        {beat.kind === "prediction" ? (
          <div className={`${styles.scene} ${styles.predictionCard}`}>
            {helpButton}
            <PredictionConsequence
              prompt={beat.prompt}
              choices={beat.choices}
              isMatch={(choice) => choice === beat.match}
              consequence={beat.consequence}
              matchedFeedback={beat.matchedFeedback}
              unmatchedFeedback={beat.unmatchedFeedback}
              confirmLabel={beat.confirmLabel}
              retryLabel={beat.retryLabel}
              retryWhen={beat.retryWhen}
              unlockOnMiss={beat.unlockOnMiss}
              matchedStatus={beat.matchedStatus}
              unmatchedStatus={beat.unmatchedStatus}
              onCommit={(_choice, matched) => {
                setExerciseReady(matched);
              }}
            />
          </div>
        ) : null}

        {beat.kind === "reward" ? (
          <article className={styles.reward} role="status">
            <div className={styles.rewardSeal} aria-hidden="true">
              <SunIcon weight="duotone" />
              <StarFourIcon weight="fill" />
            </div>
            <p className={styles.rewardPoints}>{beat.pointsLabel}</p>
            <h2>{beat.title}</h2>
            <p className={styles.badgeName}>{beat.badgeName}</p>
            <ul className={styles.takeaways} aria-label="Suas descobertas">
              {beat.takeaways.map((takeaway) => (
                <li key={takeaway}>{takeaway}</li>
              ))}
            </ul>
            <div className={styles.unlocked}>
              <span aria-hidden="true">
                <StarFourIcon weight="fill" />
              </span>
              <div>
                <strong>{beat.unlockedTitle}</strong>
                <p>{beat.unlockedBody}</p>
              </div>
            </div>
          </article>
        ) : null}

        {beat.kind === "guide-voice" || beat.kind === "story-panel" ? (
          <PhilooNarrativeComposition
            className={
              beat.kind === "story-panel"
                ? storyLayout.storyStage
                : storyLayout.narrativeComposition
            }
            guideSide={beat.guideSide}
            illustration={
              beat.kind === "story-panel" && panelAsset ? (
                <figure
                  className={storyLayout.storyPanel}
                  data-story-panel
                  key={panelAsset.src}
                >
                  <Image
                    src={panelAsset.src}
                    alt={panelAsset.alt}
                    width={panelAsset.width}
                    height={panelAsset.height}
                    sizes="(max-width: 620px) calc(100vw - 52px), (max-width: 900px) 52vw, 600px"
                    priority
                  />
                </figure>
              ) : undefined
            }
            dialogue={
              beat.kind === "story-panel" ? (
                <PhilooFolioVoice
                  speaker="Platão"
                  tone={isConceptMoment ? "concept" : "dialogue"}
                >
                  <p className={storyLayout.beatCopy} key={beatIndex}>
                    {beat.text}
                  </p>
                </PhilooFolioVoice>
              ) : (
                <PhilooFolioVoice
                  speaker="Platão"
                  tone={isConceptMoment ? "concept" : "dialogue"}
                >
                  <h2 className={storyLayout.title}>{beat.title}</h2>
                  <p className={storyLayout.lead}>{beat.lead}</p>
                  {beat.guidance ? (
                    <p className={storyLayout.guidance}>{beat.guidance}</p>
                  ) : null}
                </PhilooFolioVoice>
              )
            }
            guide={<PlatoGuide key={beat.pose} pose={beat.pose} priority />}
          />
        ) : null}
      </PhilooFolioStage>
    </PhilooStoryShell>
    {canRenderBriefing && beat.kind === "pair-connect" ? (
      <PhilooActivityBriefing
        open={briefingOpen}
        title="Ligue os nós"
        purpose="Uma ideia da esquerda combina com uma da direita. Você monta o mapa inteiro e depois confere."
        steps={[
          "Toque na bolinha e puxe a linha até o outro nó.",
          "Ligue todos. Depois toque em Conferir ligações.",
          "Se alguma não combinar, ela treme, se solta, e a gente avisa. Você tenta de novo.",
        ]}
        startLabel="Vamos ligar"
        guidePose="gradual-seeing-guide"
        demonstration={<PhilooPairConnectDemonstration />}
        onClose={() => setBriefingOpen(false)}
      />
    ) : null}
    {canRenderBriefing && beat.kind === "prediction" ? (
      <PhilooActivityBriefing
        open={briefingOpen}
        title="Escolha uma alternativa"
        purpose="Aqui não tem arrastar. Você lê a pergunta, escolhe uma frase e confirma."
        steps={[
          "Toque na alternativa que combina com a história.",
          "Toque em Confirmar previsão.",
          "Se for essa, a gente confirma. Se não for, a gente avisa e você tenta de novo.",
        ]}
        startLabel="Vamos escolher"
        guidePose="return-compassion-guide"
        demonstration={<PhilooChoiceDemonstration />}
        onClose={() => setBriefingOpen(false)}
      />
    ) : null}
    </>
  );
}
