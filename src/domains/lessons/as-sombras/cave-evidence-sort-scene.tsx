"use client";

import Link from "next/link";
import { useState } from "react";
import { GuidedClassificationActivity } from "@/domains/lesson-library/activities/guided-classification/guided-classification-activity";
import {
  createGuidedClassificationState,
  evaluateGuidedClassification,
  type GuidedClassificationState,
} from "@/domains/lesson-library/activities/guided-classification/guided-classification-contract";
import { PhilooFolioStage } from "../philoo-folio-stage";
import { PhilooStoryShell } from "../philoo-story-shell";
import {
  AS_SOMBRAS_JOURNEY_STAGES,
  getAsSombrasChapterLabel,
} from "./as-sombras-journey";
import {
  CAVE_EVIDENCE_SORT_CONFIG,
  type CaveEvidenceCategoryId,
} from "./cave-evidence-sort-config";

export function CaveEvidenceSortScene() {
  const [activityState, setActivityState] = useState<
    GuidedClassificationState<CaveEvidenceCategoryId>
  >(() => createGuidedClassificationState());
  const evaluation = evaluateGuidedClassification(
    CAVE_EVIDENCE_SORT_CONFIG,
    activityState,
  );

  function returnToExample() {
    setActivityState((current) => ({
      ...current,
      stage: "example",
      selectedCardId: null,
      hasChecked: false,
      lastMove: null,
    }));
  }

  return (
    <PhilooStoryShell
      backHref="/aula/as-sombras/eles-dao-nomes"
      onBack={
        activityState.stage === "challenge" ? returnToExample : undefined
      }
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
        eyebrow={getAsSombrasChapterLabel("o-que-chegou-ate-eles")}
        title="O que realmente chegou até eles?"
        titleId="evidence-title"
        context="Separe o que foi visto do que foi apenas concluído."
        action={
          evaluation.completedCorrectly ? (
            <Link href="/aula/as-sombras/a-primeira-duvida">
              Seguir a dúvida <span aria-hidden="true">→</span>
            </Link>
          ) : undefined
        }
        footerLabel={
          activityState.stage === "challenge"
            ? "Aplicação independente"
            : "Exemplo guiado"
        }
      >
        <GuidedClassificationActivity
          config={CAVE_EVIDENCE_SORT_CONFIG}
          value={activityState}
          onChange={setActivityState}
        />
      </PhilooFolioStage>
    </PhilooStoryShell>
  );
}
