"use client";

import {
  ArrowRightIcon,
  DropIcon,
  SparkleIcon,
  SunIcon,
  TreeIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  GuidedClassificationExercise,
  type GuidedClassificationState,
} from "@/domains/lesson-library";
import {
  PhilooCausalPath,
  type CausalPathItem,
} from "../interactions/philoo-causal-path";
import {
  PredictionConsequence,
} from "../interactions/prediction-consequence";
import {
  RevisionMap,
  type RevisionMapValue,
  type RevisionRecord,
  type RevisionStrategy,
} from "../interactions/revision-map";
import { PhilooFolioStage, PhilooFolioVoice } from "../philoo-folio-stage";
import { PhilooNarrativeComposition } from "../philoo-narrative-composition";
import { PlatoGuide } from "../plato-guide";
import { PhilooStoryShell } from "../philoo-story-shell";
import { A_SUBIDA_ASSETS, type ASubidaAssetKey } from "./a-subida-assets";
import {
  A_DECISAO_CONTENT,
  A_SUBIDA_DOLOROSA_CONTENT,
  A_SUBIDA_SCENE_META,
  DEPOIS_DA_VIRADA_CONTENT,
  FOGO_E_ESTATUAS_BANNER,
  FOGO_E_ESTATUAS_CLASSIFICATION_CONFIG,
  isSombraPredictionResponsible,
  OBJETOS_ESTRELAS_LUA_CONTENT,
  O_SOL_BANNER,
  O_SOL_CONTENT,
  PERIAGOGE_CONTENT,
  REFLEXOS_NA_AGUA_BANNER,
  REFLEXOS_NA_AGUA_CONTENT,
  SOMBRAS_LA_FORA_BANNER,
  SOMBRAS_LA_FORA_CONTENT,
  type ASubidaImageCardContent,
  type MechanismCategoryId,
  type ModelStrategy,
  type SombraChoiceId,
} from "./a-subida-content";
import {
  A_SUBIDA_JOURNEY_STAGES,
  type ASubidaSceneId,
} from "./a-subida-journey";
import styles from "./a-subida-scene.module.css";

type ASubidaSceneProps = {
  sceneId: ASubidaSceneId;
};

const GATED_EXERCISE_SCENE_IDS: ReadonlySet<ASubidaSceneId> = new Set([
  "fogo-e-estatuas",
  "sombras-la-fora",
  "reflexos-na-agua",
  "o-sol",
]);

export function ASubidaScene({ sceneId }: ASubidaSceneProps) {
  const meta = A_SUBIDA_SCENE_META[sceneId];

  return (
    <PhilooStoryShell
      className={styles.nunitoLesson}
      backHref={meta.previousHref}
      currentBeat={
        A_SUBIDA_JOURNEY_STAGES.findIndex((stage) =>
          stage.sceneIds.some((id) => id === sceneId),
        ) + 1
      }
      totalBeats={A_SUBIDA_JOURNEY_STAGES.length}
      labelledBy="a-subida-title"
      phase="idle"
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
        context={meta.context}
        footerLabel={meta.footer}
        action={
          meta.nextHref && !GATED_EXERCISE_SCENE_IDS.has(sceneId) ? (
            <Link className={styles.primaryAction} href={meta.nextHref}>
              {meta.nextLabel}
              <ArrowRightIcon aria-hidden="true" weight="bold" />
            </Link>
          ) : undefined
        }
      >
        <section className={styles.scene} data-scene={sceneId}>
          {sceneId === "depois-da-virada" ? (
            <ImageCardScene content={DEPOIS_DA_VIRADA_CONTENT} />
          ) : null}
          {sceneId === "fogo-e-estatuas" ? <FogoEEstatuasExercise /> : null}
          {sceneId === "a-subida-dolorosa" ? (
            <ImageCardScene content={A_SUBIDA_DOLOROSA_CONTENT} />
          ) : null}
          {sceneId === "periagoge" ? <PeriagogeScene /> : null}
          {sceneId === "sombras-la-fora" ? <SombrasLaForaExercise /> : null}
          {sceneId === "reflexos-na-agua" ? <ReflexosNaAguaExercise /> : null}
          {sceneId === "objetos-estrelas-e-lua" ? (
            <ImageCardScene
              content={OBJETOS_ESTRELAS_LUA_CONTENT}
              reflectionPrompt={OBJETOS_ESTRELAS_LUA_CONTENT.reflectionPrompt}
            />
          ) : null}
          {sceneId === "o-sol" ? <OSolExercise /> : null}
          {sceneId === "a-decisao" ? <ADecisaoScene /> : null}
        </section>
      </PhilooFolioStage>
    </PhilooStoryShell>
  );
}

function StoryImage({
  imageKey,
  caption,
  priority = false,
  compact = false,
}: {
  imageKey: ASubidaAssetKey;
  caption?: string;
  priority?: boolean;
  compact?: boolean;
}) {
  const asset = A_SUBIDA_ASSETS[imageKey];

  return (
    <figure
      className={`${styles.storyImage} ${compact ? styles.storyImageCompact : ""}`}
    >
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        priority={priority}
        sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1180px) 74vw, 980px"
        style={{
          objectPosition: `${asset.focalPoint.x * 100}% ${asset.focalPoint.y * 100}%`,
        }}
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function ImageCardScene({
  content,
  reflectionPrompt,
}: {
  content: ASubidaImageCardContent;
  reflectionPrompt?: string;
}) {
  return (
    <div className={styles.imageCardComposition}>
      <div className={styles.imageCardPlato}>
        <PlatoGuide
          pose={content.pose}
          sizes="(max-width: 900px) 180px, 300px"
          priority
        />
      </div>
      <article className={styles.imageCardStory}>
        <StoryImage
          imageKey={content.imageKey}
          caption={content.imageCaption}
          priority
        />
        <div className={styles.imageCardExplanation}>
          <span className={styles.imageCardSpeaker}>
            {content.speakerLabel}
          </span>
          <p>{content.body}</p>
          {reflectionPrompt ? (
            <p className={styles.imageCardReflection}>{reflectionPrompt}</p>
          ) : null}
        </div>
      </article>
    </div>
  );
}

function PeriagogeScene() {
  const asset = A_SUBIDA_ASSETS[PERIAGOGE_CONTENT.imageKey];

  return (
    <div className={styles.conceptComposition}>
      <div className={styles.conceptPlato}>
        {/* Beat 4 asset ships with a solid white background (rembg was
            unavailable during generation; see content/a-subida/07-validation.md).
            The cream concept card absorbs the mismatch per the validator's
            documented fallback until an alpha-channel pass is available. */}
        <Image
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          sizes="(max-width: 720px) 150px, (max-width: 900px) 210px, 280px"
          priority
        />
      </div>
      <article className={styles.wordArtifact}>
        <span lang="grc">{PERIAGOGE_CONTENT.greek}</span>
        <strong>{PERIAGOGE_CONTENT.romanization}</strong>
        <p>{PERIAGOGE_CONTENT.gloss}</p>
        <div>
          <span className={styles.conceptSpeaker}>
            {PERIAGOGE_CONTENT.speakerLabel}
          </span>
          <h2>{PERIAGOGE_CONTENT.heading}</h2>
          <p>{PERIAGOGE_CONTENT.body}</p>
          <p className={styles.imageCardReflection}>
            {PERIAGOGE_CONTENT.reflectionPrompt}
          </p>
        </div>
      </article>
    </div>
  );
}

function FogoEEstatuasExercise() {
  const meta = A_SUBIDA_SCENE_META["fogo-e-estatuas"];
  const [completed, setCompleted] = useState(false);

  function handleComplete(
    state: GuidedClassificationState<MechanismCategoryId>,
  ) {
    if (state.hasChecked) {
      setCompleted(true);
    }
  }

  return (
    <div className={styles.exerciseWithBanner}>
      <StoryImage
        imageKey={FOGO_E_ESTATUAS_BANNER.imageKey}
        caption={FOGO_E_ESTATUAS_BANNER.caption}
        compact
        priority
      />
      <GuidedClassificationExercise
        config={FOGO_E_ESTATUAS_CLASSIFICATION_CONFIG}
        onComplete={handleComplete}
      />
      {completed && meta.nextHref ? (
        <div className={styles.exerciseContinue}>
          <Link className={styles.primaryAction} href={meta.nextHref}>
            {meta.nextLabel}
            <ArrowRightIcon aria-hidden="true" weight="bold" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function SombrasLaForaExercise() {
  const [committedChoice, setCommittedChoice] =
    useState<SombraChoiceId | null>(null);

  return (
    <div className={styles.exerciseWithBanner}>
      <StoryImage
        imageKey={SOMBRAS_LA_FORA_BANNER.imageKey}
        caption={SOMBRAS_LA_FORA_BANNER.caption}
        compact
        priority
      />
      <div className={styles.predictionCard}>
        <PredictionConsequence
          prompt={SOMBRAS_LA_FORA_CONTENT.prompt}
          choices={SOMBRAS_LA_FORA_CONTENT.choices}
          isMatch={isSombraPredictionResponsible}
          consequence={SOMBRAS_LA_FORA_CONTENT.consequence}
          matchedFeedback={SOMBRAS_LA_FORA_CONTENT.matchedFeedback}
          unmatchedFeedback={SOMBRAS_LA_FORA_CONTENT.unmatchedFeedback}
          onCommit={(choice, matched) => {
            setCommittedChoice(matched ? choice : null);
          }}
        />
      </div>
      {committedChoice ? (
        <div className={styles.exerciseContinue}>
          <Link
            className={styles.primaryAction}
            href="/aula/a-subida/reflexos-na-agua"
          >
            Seguir para os reflexos
            <ArrowRightIcon aria-hidden="true" weight="bold" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

const CAUSAL_ICONS: Record<string, ReactNode> = {
  objeto: <TreeIcon weight="duotone" />,
  luz: <SunIcon weight="duotone" />,
  reflexo: <DropIcon weight="duotone" />,
};

function ReflexosNaAguaExercise() {
  const [completed, setCompleted] = useState(false);
  const items: CausalPathItem[] = REFLEXOS_NA_AGUA_CONTENT.items.map(
    (item) => ({
      ...item,
      icon: CAUSAL_ICONS[item.id],
    }),
  );

  return (
    <div className={styles.exerciseWithBanner}>
      <StoryImage
        imageKey={REFLEXOS_NA_AGUA_BANNER.imageKey}
        caption={REFLEXOS_NA_AGUA_BANNER.caption}
        compact
        priority
      />
      <div className={styles.causalCard}>
        <PhilooCausalPath
          items={items}
          correctOrder={REFLEXOS_NA_AGUA_CONTENT.correctOrder}
          demonstratedItemId={REFLEXOS_NA_AGUA_CONTENT.demonstratedItemId}
          positionHints={REFLEXOS_NA_AGUA_CONTENT.positionHints}
          completionMessage={REFLEXOS_NA_AGUA_CONTENT.completionMessage}
          activityLabel={REFLEXOS_NA_AGUA_CONTENT.activityLabel}
          pathLabel={REFLEXOS_NA_AGUA_CONTENT.pathLabel}
          onComplete={() => setCompleted(true)}
          onIncomplete={() => setCompleted(false)}
        />
      </div>
      {completed ? (
        <div className={styles.exerciseContinue}>
          <Link
            className={styles.primaryAction}
            href="/aula/a-subida/objetos-estrelas-e-lua"
          >
            Deixar a noite cair
            <ArrowRightIcon aria-hidden="true" weight="bold" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function OSolExercise() {
  const [value, setValue] = useState<RevisionMapValue>({});
  const [privateNote, setPrivateNote] = useState("");
  const complete = Boolean(value.recorded);

  return (
    <div className={styles.exerciseWithBanner}>
      <StoryImage
        imageKey={O_SOL_BANNER.imageKey}
        caption={O_SOL_BANNER.caption}
        compact
        priority
      />
      <div className={styles.revisionWorkbench}>
        <span className={styles.revisionWorkshopLabel}>
          <SparkleIcon weight="fill" aria-hidden="true" /> Oficina de ideias
        </span>
        <RevisionMap
          initialHypothesis={O_SOL_CONTENT.initialHypothesis}
          clueOptions={O_SOL_CONTENT.clueOptions}
          privateNote={privateNote}
          onHypothesisRevisited={(strategy: RevisionStrategy) => {
            setValue({ strategy });
          }}
          onRevisionRecorded={(
            revision: RevisionRecord,
            note: string,
          ) => {
            setPrivateNote(note);
            setValue({ ...revision, recorded: true });
          }}
          reviewer={(strategy: ModelStrategy) => (
            <p className={styles.revisionReviewerNote}>
              {O_SOL_CONTENT.reviewerText[strategy]}
            </p>
          )}
        />
      </div>
      {complete ? (
        <div className={styles.exerciseContinue}>
          <Link
            className={styles.primaryAction}
            href="/aula/a-subida/a-decisao"
          >
            Decidir o que fazer agora
            <ArrowRightIcon aria-hidden="true" weight="bold" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function ADecisaoScene() {
  return (
    <PhilooNarrativeComposition
      className={styles.decisionComposition}
      guideSide="start"
      dialogue={
        <PhilooFolioVoice
          speaker={A_DECISAO_CONTENT.speakerLabel}
          className={styles.decisionVoice}
        >
          <span className={styles.decisionKicker}>
            {A_DECISAO_CONTENT.kicker}
          </span>
          <h2 className={styles.decisionHeading}>
            {A_DECISAO_CONTENT.heading}
          </h2>
          <p className={styles.decisionLead}>{A_DECISAO_CONTENT.lead}</p>
          <p className={styles.decisionClose}>{A_DECISAO_CONTENT.closing}</p>
        </PhilooFolioVoice>
      }
      guide={
        <PlatoGuide
          pose={A_DECISAO_CONTENT.pose}
          sizes="(max-width: 820px) 230px, 310px"
          priority
        />
      }
    />
  );
}
