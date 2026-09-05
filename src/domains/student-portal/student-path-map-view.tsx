"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CaretLeft,
  Check,
  Lock,
  MapTrifold,
  Play,
} from "@phosphor-icons/react";
import { useState } from "react";
import { getCharacterPose } from "@/domains/character-library";
import { getPhilosopherGoldCoin } from "./philosopher-coin-assets";
import {
  getPathMapCheckpoint,
  getPathMapMeta,
  getPathMapTrail,
  pathMapTrails,
  type MapCheckpointStatus,
  type PathMapCheckpoint,
  type PathMapTrail,
  type TrailAvailability,
} from "./student-path-map-content";
import styles from "./student-path-map.module.css";

type MapMode = "trails" | "trail" | "lesson";

export function StudentPathMapView() {
  const [mode, setMode] = useState<MapMode>("trails");
  const [selectedTrailId, setSelectedTrailId] = useState<string | null>(null);
  const [selectedCheckpointId, setSelectedCheckpointId] = useState<string | null>(null);

  const meta = getPathMapMeta();
  const selectedTrail = selectedTrailId ? getPathMapTrail(selectedTrailId) : undefined;
  const selectedCheckpoint =
    selectedTrailId && selectedCheckpointId
      ? getPathMapCheckpoint(selectedTrailId, selectedCheckpointId)
      : undefined;

  const openTrail = (trailId: string) => {
    const trail = getPathMapTrail(trailId);
    if (!trail || trail.status === "coming" || trail.status === "locked") {
      return;
    }
    setSelectedTrailId(trailId);
    setSelectedCheckpointId(null);
    setMode("trail");
  };

  const openCheckpoint = (checkpointId: string) => {
    setSelectedCheckpointId(checkpointId);
    setMode("lesson");
  };

  const backToTrails = () => {
    setMode("trails");
    setSelectedTrailId(null);
    setSelectedCheckpointId(null);
  };

  const backToTrail = () => {
    setMode("trail");
    setSelectedCheckpointId(null);
  };

  return (
    <section className={styles.page} aria-labelledby="path-map-title">
      {mode === "trails" ? (
        <TrailGridScreen meta={meta} onOpenTrail={openTrail} />
      ) : null}
      {mode === "trail" && selectedTrail ? (
        <TrailCheckpointsScreen
          trail={selectedTrail}
          onBack={backToTrails}
          onOpenCheckpoint={openCheckpoint}
        />
      ) : null}
      {mode === "lesson" && selectedTrail && selectedCheckpoint ? (
        <LessonBriefingScreen
          trail={selectedTrail}
          checkpoint={selectedCheckpoint}
          onBack={backToTrail}
        />
      ) : null}
    </section>
  );
}

function TrailGridScreen({
  meta,
  onOpenTrail,
}: {
  meta: ReturnType<typeof getPathMapMeta>;
  onOpenTrail: (trailId: string) => void;
}) {
  return (
    <>
      <header className={styles.gridHeader}>
        <div className={styles.gridHeaderTop}>
          <p className={styles.eyebrow}>
            <MapTrifold size={16} weight="duotone" aria-hidden="true" />
            Trilhas Philoo
          </p>
          <span className={styles.gridHint}>Novas trilhas em breve</span>
        </div>
        <h1 id="path-map-title">Escolha uma trilha para explorar.</h1>
        {meta.currentTitle ? (
          <p className={styles.lede}>
            Você está em <strong>{meta.currentTitle}</strong> — {meta.unlocked} de{" "}
            {meta.total} encontros desbloqueados.
          </p>
        ) : (
          <p className={styles.lede}>
            {meta.unlocked} de {meta.total} encontros desbloqueados neste mapa.
          </p>
        )}
      </header>

      <div className={styles.trailGrid}>
        {pathMapTrails.map((trail) => (
          <TrailCard key={trail.id} trail={trail} onOpen={() => onOpenTrail(trail.id)} />
        ))}
      </div>
    </>
  );
}

function TrailCard({ trail, onOpen }: { trail: PathMapTrail; onOpen: () => void }) {
  const isInteractive = trail.status === "active" || trail.status === "available";
  const tag = trail.statusTag ?? trailStatusLabel(trail.status);

  const card = (
    <article
      className={styles.trailCard}
      data-status={trail.status}
      aria-labelledby={`trail-${trail.id}-title`}
    >
      <div className={styles.trailCardMedia}>
        <Image
          src={trail.coverImage}
          alt={trail.coverAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={styles.trailCardImage}
          unoptimized
        />
        <div className={styles.trailCardOverlay} aria-hidden="true" />
      </div>
      <div className={styles.trailCardBody}>
        <span className={styles.trailNumber}>Trilha {String(trail.number).padStart(2, "0")}</span>
        <h2 id={`trail-${trail.id}-title`}>{trail.title}</h2>
        <p className={styles.trailSubtitle}>{trail.subtitle}</p>
        {trail.status === "active" && trail.progressPct > 0 ? (
          <div className={styles.trailProgress}>
            <span className={styles.trailProgressBar} aria-hidden="true">
              <span style={{ width: `${trail.progressPct}%` }} />
            </span>
            <span className={styles.trailProgressPct}>{trail.progressPct}%</span>
          </div>
        ) : (
          <span className={styles.trailStatusTag}>{tag}</span>
        )}
      </div>
    </article>
  );

  if (isInteractive) {
    return (
      <button
        type="button"
        className={styles.trailCardButton}
        onClick={onOpen}
        aria-label={`Abrir trilha ${trail.title}`}
      >
        {card}
      </button>
    );
  }

  return <div className={styles.trailCardButton} aria-disabled="true">{card}</div>;
}

function TrailCheckpointsScreen({
  trail,
  onBack,
  onOpenCheckpoint,
}: {
  trail: PathMapTrail;
  onBack: () => void;
  onOpenCheckpoint: (checkpointId: string) => void;
}) {
  const completedCount = trail.checkpoints.filter((cp) => cp.status === "completed").length;
  const progressPct =
    trail.checkpoints.length > 0
      ? Math.round((completedCount / trail.checkpoints.length) * 100)
      : 0;

  return (
    <>
      <div className={styles.trailHero}>
        <Image
          src={trail.heroImage}
          alt={trail.heroAlt}
          fill
          priority
          sizes="100vw"
          className={styles.trailHeroImage}
          unoptimized
        />
        <div className={styles.trailHeroOverlay} aria-hidden="true" />
        <div className={styles.trailHeroContent}>
          <button type="button" className={styles.backButton} onClick={onBack}>
            <ArrowLeft size={18} weight="bold" aria-hidden="true" />
            Voltar às trilhas
          </button>
          <p className={styles.trailHeroEra}>{trail.eraLabel}</p>
          <h1>{trail.title}</h1>
          <p className={styles.trailHeroBlurb}>{trail.blurb}</p>
          <div className={styles.trailHeroStats}>
            <div>
              <strong>{trail.checkpoints.length}</strong>
              <span>encontros</span>
            </div>
            <div>
              <strong>{progressPct}%</strong>
              <span>concluído</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.checkpointSection}>
        <div className={styles.checkpointSectionHead}>
          <div>
            <p className={styles.eyebrow}>Seu percurso</p>
            <h2>Da primeira pergunta ao próximo encontro</h2>
          </div>
          <p className={styles.checkpointHint}>
            Selecione um encontro disponível para ver o briefing antes de iniciar.
          </p>
        </div>

        <div className={styles.checkpointRail}>
          <div className={styles.checkpointTrack} aria-hidden="true" />
          <ol className={styles.checkpointList}>
            {trail.checkpoints.map((checkpoint) => (
              <CheckpointCoin
                key={checkpoint.id}
                checkpoint={checkpoint}
                onOpen={() => onOpenCheckpoint(checkpoint.id)}
              />
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}

function CheckpointCoin({
  checkpoint,
  onOpen,
}: {
  checkpoint: PathMapCheckpoint;
  onOpen: () => void;
}) {
  const isLocked = checkpoint.status === "locked";
  const coinAsset = getPhilosopherGoldCoin(checkpoint.characterId);
  const portrait = coinAsset
    ? null
    : getCharacterPose(checkpoint.characterId, checkpoint.coinPoseId);

  const coin = (
    <>
      {coinAsset ? (
        <span className={styles.coinArtFrame} aria-hidden="true">
          <Image
            src={coinAsset.src}
            alt=""
            width={120}
            height={120}
            sizes="88px"
            className={styles.coinArt}
            unoptimized
          />
        </span>
      ) : portrait ? (
        <span className={styles.coinMedallion} data-status={checkpoint.status} aria-hidden="true">
          <span className={styles.coinRimDots} aria-hidden="true" />
          <span className={styles.coinPortraitWell}>
            <Image
              src={portrait.src}
              alt=""
              width={160}
              height={240}
              sizes="72px"
              className={styles.coinPortrait}
              unoptimized
            />
          </span>
        </span>
      ) : null}
      <CoinStatusIcon status={checkpoint.status} />
    </>
  );

  return (
    <li className={styles.checkpointItem}>
      {isLocked ? (
        <div className={styles.coinButton} aria-disabled="true" data-status={checkpoint.status}>
          {coin}
        </div>
      ) : (
        <button
          type="button"
          className={styles.coinButton}
          data-status={checkpoint.status}
          onClick={onOpen}
          aria-label={`Abrir briefing: ${checkpoint.title}`}
        >
          {coin}
        </button>
      )}
      <div className={styles.coinLabel}>
        <strong>{checkpoint.title}</strong>
        <span>{checkpoint.location}</span>
      </div>
    </li>
  );
}

function LessonBriefingScreen({
  checkpoint,
  onBack,
}: {
  trail: PathMapTrail;
  checkpoint: PathMapCheckpoint;
  onBack: () => void;
}) {
  const isLocked = checkpoint.status === "locked";
  const startHref = checkpoint.briefing.startHref;
  const startLabel = checkpoint.briefing.startLabel;

  return (
    <>
      <button type="button" className={styles.briefingBack} onClick={onBack}>
        <CaretLeft size={18} weight="bold" aria-hidden="true" />
        Voltar ao percurso
      </button>

      <article className={styles.briefingCard} aria-labelledby="briefing-title">
        <div className={styles.briefingVisual}>
          <Image
            src={checkpoint.briefing.portrait}
            alt={checkpoint.briefing.portraitAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.briefingPortrait}
            unoptimized
          />
          <div className={styles.briefingVisualFade} aria-hidden="true" />
        </div>

        <div className={styles.briefingBody}>
          <div className={styles.briefingMeta}>
            <span>{checkpoint.briefing.trailLabel}</span>
            <span>{checkpoint.briefing.encounterLabel}</span>
          </div>
          <h1 id="briefing-title">{checkpoint.briefing.title}</h1>
          <p className={styles.briefingQuestion}>{checkpoint.briefing.question}</p>

          <section className={styles.briefingSection}>
            <h2>Retrato histórico e intelectual</h2>
            <p>{checkpoint.briefing.history}</p>
          </section>

          <section className={styles.briefingSection}>
            <h2>Sua investigação</h2>
            <p>{checkpoint.briefing.investigation}</p>
          </section>

          <footer className={styles.briefingFooter}>
            {isLocked ? (
              <span className={styles.briefingLocked}>
                <Lock size={18} weight="bold" aria-hidden="true" />
                Este encontro ainda não está disponível.
              </span>
            ) : (
              <Link href={startHref} className={styles.startButton}>
                {startLabel}
                <ArrowRight size={20} weight="bold" aria-hidden="true" />
              </Link>
            )}
          </footer>
        </div>
      </article>
    </>
  );
}

function CoinStatusIcon({ status }: { status: MapCheckpointStatus }) {
  if (status === "completed") {
    return (
      <span className={styles.coinBadge} data-status={status} aria-hidden="true">
        <Check size={14} weight="bold" />
      </span>
    );
  }
  if (status === "current") {
    return (
      <span className={styles.coinBadge} data-status={status} aria-hidden="true">
        <Play size={12} weight="fill" />
      </span>
    );
  }
  if (status === "locked") {
    return (
      <span className={styles.coinBadge} data-status={status} aria-hidden="true">
        <Lock size={12} weight="bold" />
      </span>
    );
  }
  return null;
}

function trailStatusLabel(status: TrailAvailability): string {
  if (status === "coming") {
    return "Em breve";
  }
  if (status === "locked") {
    return "Bloqueada";
  }
  return "Disponível";
}
