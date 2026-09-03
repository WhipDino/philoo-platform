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
import { PhilooDecisionLayers } from "../interactions/philoo-decision-layers";
import { PhilooDecisionLayersDemonstration } from "../interactions/philoo-decision-layers-demonstration";
import { PhilooDualLens } from "../interactions/philoo-dual-lens";
import { PhilooDualLensDemonstration } from "../interactions/philoo-dual-lens-demonstration";
import { PredictionConsequence } from "../interactions/prediction-consequence";
import storyLayout from "../philoo-soft-story-layout.module.css";
import { O_RETORNO_ASSETS } from "./o-retorno-assets";
import {
  O_RETORNO_FOLIO_BEATS,
  O_RETORNO_SCENE_META,
  type ORetornoFolioBeat,
} from "./o-retorno-content";
import {
  O_RETORNO_JOURNEY_STAGES,
  type ORetornoSceneId,
} from "./o-retorno-journey";
import styles from "./o-retorno-scene.module.css";

type ORetornoSceneProps = {
  sceneId: ORetornoSceneId;
};

export function ORetornoScene({ sceneId }: ORetornoSceneProps) {
  return (
    <FolioBeatsLesson
      sceneId={sceneId}
      beats={O_RETORNO_FOLIO_BEATS[sceneId]}
    />
  );
}

function isExerciseBeat(beat: ORetornoFolioBeat) {
  return (
    beat.kind === "prediction" ||
    beat.kind === "dual-lens" ||
    beat.kind === "decision-layers"
  );
}

function subscribeToClient() {
  return () => {};
}

function FolioBeatsLesson({
  sceneId,
  beats,
}: {
  sceneId: ORetornoSceneId;
  beats: readonly ORetornoFolioBeat[];
}) {
  const meta = O_RETORNO_SCENE_META[sceneId];
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
    beat?.kind === "story-panel" ? O_RETORNO_ASSETS[beat.imageKey] : null;
  const currentBeat =
    O_RETORNO_JOURNEY_STAGES.findIndex((stage) =>
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
    <button
      type="button"
      className={styles.helpButton}
      onClick={() => setBriefingOpen(true)}
    >
      <QuestionIcon aria-hidden="true" weight="bold" />
      <span>Como jogar</span>
    </button>
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
        totalBeats={O_RETORNO_JOURNEY_STAGES.length}
        labelledBy="o-retorno-title"
        phase="idle"
        className={
          beat.kind === "story-panel" ? storyLayout.storyPanelPage : undefined
        }
        surfaceWidth="narrative"
        surfaceTreatment="folio"
        showSoftFrame={false}
        journey={{
          lessonTitle: "O Retorno",
          currentSceneId: sceneId,
          stages: O_RETORNO_JOURNEY_STAGES,
          storageKey: "philoo:journey:o-retorno",
        }}
      >
        <PhilooFolioStage
          eyebrow={meta.eyebrow}
          title={meta.title}
          titleId="o-retorno-title"
          currentMoment={beatIndex + 1}
          totalMoments={beats.length}
          moment={isConceptMoment ? "concept" : "story"}
          mastheadActions={helpButton}
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
          {beat.kind === "prediction" ? (
            <div
              className={`${styles.scene} ${styles.predictionStage}`}
              data-has-visual={beat.imageKey ? "true" : "false"}
            >
              {beat.imageKey ? (
                <figure className={styles.predictionVisual}>
                  <Image
                    src={O_RETORNO_ASSETS[beat.imageKey].src}
                    alt={O_RETORNO_ASSETS[beat.imageKey].alt}
                    width={O_RETORNO_ASSETS[beat.imageKey].width}
                    height={O_RETORNO_ASSETS[beat.imageKey].height}
                    sizes="(max-width: 820px) calc(100vw - 48px), 52vw"
                    priority
                    unoptimized
                  />
                </figure>
              ) : null}
              <div className={styles.predictionCard}>
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
            </div>
          ) : null}

          {beat.kind === "dual-lens" ? (
            <div className={`${styles.scene} ${styles.dualLensStage}`}>
              <PhilooDualLens
                prompt={beat.prompt}
                lensA={{
                  ...O_RETORNO_ASSETS[beat.lensAKey],
                }}
                lensB={{
                  ...O_RETORNO_ASSETS[beat.lensBKey],
                }}
                initialLens={beat.initialLens}
                finalQuestion={beat.finalQuestion}
                questionHint="Escolha uma das cartas."
                alternatives={beat.alternatives}
                correctAlternativeId={beat.correctAlternativeId}
                correctFeedback={beat.correctFeedback}
                incorrectFeedback={beat.incorrectFeedback}
                onComplete={() => setExerciseReady(true)}
              />
            </div>
          ) : null}

          {beat.kind === "decision-layers" ? (
            <div
              className={`${styles.scene} ${styles.predictionCard} ${styles.decisionStage}`}
            >
              <PhilooDecisionLayers
                prompt={beat.prompt}
                layers={beat.layers}
                correctOrder={beat.correctOrder}
                correctFeedback={beat.correctFeedback}
                outOfPlaceFeedback={beat.outOfPlaceFeedback}
                onComplete={() => setExerciseReady(true)}
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
                      unoptimized
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
      {canRenderBriefing && isExerciseBeat(beat) && "briefing" in beat ? (
        <PhilooActivityBriefing
          open={briefingOpen}
          title={beat.briefing.title}
          purpose={beat.briefing.purpose}
          steps={beat.briefing.steps}
          startLabel={beat.briefing.startLabel}
          guidePose={beat.briefing.guidePose}
          demonstration={
            beat.kind === "prediction" ? (
              <PhilooChoiceDemonstration />
            ) : beat.kind === "dual-lens" ? (
              <PhilooDualLensDemonstration />
            ) : (
              <PhilooDecisionLayersDemonstration />
            )
          }
          onClose={() => setBriefingOpen(false)}
        />
      ) : null}
    </>
  );
}
