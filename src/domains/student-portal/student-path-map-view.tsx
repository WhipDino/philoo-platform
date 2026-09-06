"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CaretLeft,
  CaretRight,
  Check,
  Lock,
  Play,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getCharacter, getCharacterPose } from "@/domains/character-library";
import { getPhilosopherGoldCoin } from "./philosopher-coin-assets";
import {
  getPathMapTrail,
  type MapCheckpointStatus,
  type PathMapCheckpoint,
  type PathMapTrail,
} from "./student-path-map-content";
import styles from "./student-path-map.module.css";

function defaultFocusedCheckpointId(trail: PathMapTrail): string {
  const current = trail.checkpoints.find((cp) => cp.status === "current");
  if (current) {
    return current.id;
  }
  const playable = trail.checkpoints.find(
    (cp) => cp.status === "available" || cp.status === "completed",
  );
  if (playable) {
    return playable.id;
  }
  return trail.checkpoints[0]?.id ?? "";
}

function tryCharacterPose(
  characterId: PathMapCheckpoint["characterId"],
  poseId: string,
) {
  const character = getCharacter(characterId);
  if (!(poseId in character.poses)) {
    return undefined;
  }
  return getCharacterPose(characterId, poseId);
}

function resolveCheckpointPortrait(checkpoint: PathMapCheckpoint): {
  src: string;
  alt: string;
} {
  const anchor =
    tryCharacterPose(checkpoint.characterId, "identity-anchor") ??
    tryCharacterPose(checkpoint.characterId, checkpoint.coinPoseId);
  if (anchor) {
    return { src: anchor.src, alt: `${checkpoint.title} — retrato` };
  }
  return {
    src: checkpoint.briefing.portrait,
    alt: checkpoint.briefing.portraitAlt,
  };
}

export function StudentPathMapView({
  trailId,
  onBack,
}: {
  trailId: string;
  onBack: () => void;
}) {
  const trail = getPathMapTrail(trailId);
  const [focusedCheckpointId, setFocusedCheckpointId] = useState(() =>
    trail ? defaultFocusedCheckpointId(trail) : "",
  );

  if (!trail) {
    return null;
  }

  return (
    <section className={styles.page} aria-labelledby="trail-banner-title">
      <TrailCheckpointsScreen
        trail={trail}
        focusedCheckpointId={focusedCheckpointId}
        onBack={onBack}
        backLabel="Voltar à biblioteca"
        onFocusCheckpoint={setFocusedCheckpointId}
      />
    </section>
  );
}

function TrailCheckpointsScreen({
  trail,
  focusedCheckpointId,
  onBack,
  backLabel,
  onFocusCheckpoint,
}: {
  trail: PathMapTrail;
  focusedCheckpointId: string;
  onBack: () => void;
  backLabel: string;
  onFocusCheckpoint: (checkpointId: string) => void;
}) {
  const completedCount = trail.checkpoints.filter((cp) => cp.status === "completed").length;
  const progressPct =
    trail.checkpoints.length > 0
      ? Math.round((completedCount / trail.checkpoints.length) * 100)
      : 0;
  const focusedCheckpoint = trail.checkpoints.find((cp) => cp.id === focusedCheckpointId);
  const bannerSrc = trail.bannerImage ?? trail.heroImage;
  const bannerAlt = trail.bannerAlt ?? trail.heroAlt;

  return (
    <>
      <button type="button" className={styles.trailScreenBack} onClick={onBack}>
        <ArrowLeft size={18} weight="bold" aria-hidden="true" />
        {backLabel}
      </button>

      <article className={styles.trailBanner} aria-labelledby="trail-banner-title">
        <div className={styles.trailBannerText}>
          <p className={styles.trailBannerEra}>{trail.eraLabel}</p>
          <h1 id="trail-banner-title">{trail.title}</h1>
          <p className={styles.trailBannerBlurb}>{trail.blurb}</p>
          <div className={styles.trailBannerStats}>
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
        <div className={styles.trailBannerArt}>
          <Image
            src={bannerSrc}
            alt={bannerAlt}
            fill
            priority
            sizes="(max-width: 768px) 40vw, 480px"
            className={styles.trailBannerImage}
            unoptimized
          />
        </div>
      </article>

      <div className={styles.checkpointSection}>
        <div className={styles.checkpointSectionHead}>
          <div>
            <p className={styles.eyebrow}>Seu percurso</p>
            <h2>Da primeira pergunta ao próximo encontro</h2>
          </div>
          <p className={styles.checkpointProgressCount}>
            {Math.min(completedCount + 1, trail.checkpoints.length)} de{" "}
            {trail.checkpoints.length}
          </p>
        </div>
        <p className={styles.checkpointHint}>
          Escolha um encontro disponível para ver o briefing antes de começar.
        </p>

        <CheckpointScrollRail
          trail={trail}
          focusedCheckpointId={focusedCheckpointId}
          onFocusCheckpoint={onFocusCheckpoint}
        />
      </div>

      {focusedCheckpoint ? (
        <CheckpointDetailCard checkpoint={focusedCheckpoint} />
      ) : null}
    </>
  );
}

function CheckpointScrollRail({
  trail,
  focusedCheckpointId,
  onFocusCheckpoint,
}: {
  trail: PathMapTrail;
  focusedCheckpointId: string;
  onFocusCheckpoint: (checkpointId: string) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollHints = useCallback(() => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    setCanScrollLeft(rail.scrollLeft > 8);
    setCanScrollRight(maxScroll - rail.scrollLeft > 8);
  }, []);

  useEffect(() => {
    updateScrollHints();
    const rail = railRef.current;
    if (!rail) {
      return;
    }
    rail.addEventListener("scroll", updateScrollHints, { passive: true });
    const observer = new ResizeObserver(updateScrollHints);
    observer.observe(rail);
    return () => {
      rail.removeEventListener("scroll", updateScrollHints);
      observer.disconnect();
    };
  }, [trail.checkpoints.length, updateScrollHints]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }
    const focused = rail.querySelector<HTMLElement>(`[data-checkpoint-id="${focusedCheckpointId}"]`);
    focused?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [focusedCheckpointId]);

  const nudge = (direction: "left" | "right") => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }
    const delta = direction === "left" ? -220 : 220;
    rail.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div
      className={styles.checkpointRailWrap}
      data-can-scroll-left={canScrollLeft ? "true" : "false"}
      data-can-scroll-right={canScrollRight ? "true" : "false"}
    >
      {canScrollLeft ? (
        <button
          type="button"
          className={`${styles.scrollHint} ${styles.scrollHintLeft}`}
          onClick={() => nudge("left")}
          aria-label="Ver encontros anteriores"
        >
          <CaretLeft size={18} weight="bold" aria-hidden="true" />
        </button>
      ) : null}

      <div className={styles.checkpointRail} ref={railRef}>
        <div className={styles.checkpointTrack} aria-hidden="true" />
        <ol className={styles.checkpointList}>
          {trail.checkpoints.map((checkpoint) => (
            <CheckpointCoin
              key={checkpoint.id}
              checkpoint={checkpoint}
              isFocused={checkpoint.id === focusedCheckpointId}
              onFocus={() => onFocusCheckpoint(checkpoint.id)}
            />
          ))}
        </ol>
      </div>

      {canScrollRight ? (
        <button
          type="button"
          className={`${styles.scrollHint} ${styles.scrollHintRight}`}
          onClick={() => nudge("right")}
          aria-label="Ver próximos encontros"
        >
          <CaretRight size={18} weight="bold" aria-hidden="true" />
          <span className={styles.scrollPulse} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

function CheckpointCoin({
  checkpoint,
  isFocused,
  onFocus,
}: {
  checkpoint: PathMapCheckpoint;
  isFocused: boolean;
  onFocus: () => void;
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
    <li
      className={styles.checkpointItem}
      data-checkpoint-id={checkpoint.id}
      data-focused={isFocused ? "true" : "false"}
    >
      {isLocked ? (
        <div
          className={styles.coinButton}
          aria-disabled="true"
          data-status={checkpoint.status}
          onClick={onFocus}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onFocus();
            }
          }}
        >
          {coin}
        </div>
      ) : (
        <button
          type="button"
          className={styles.coinButton}
          data-status={checkpoint.status}
          aria-pressed={isFocused}
          onClick={onFocus}
          aria-label={`Selecionar encontro: ${checkpoint.title}`}
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

function CheckpointDetailCard({ checkpoint }: { checkpoint: PathMapCheckpoint }) {
  const isLocked = checkpoint.status === "locked";
  const portrait = resolveCheckpointPortrait(checkpoint);
  const statusLabel = checkpointStatusLabel(checkpoint.status);
  const actionLabel =
    checkpoint.status === "completed"
      ? "Rever o encontro"
      : checkpoint.briefing.startLabel;

  return (
    <article className={styles.detailCard} aria-labelledby="checkpoint-detail-title">
      <div className={styles.detailPortrait}>
        <Image
          src={portrait.src}
          alt={portrait.alt}
          fill
          sizes="(max-width: 768px) 40vw, 280px"
          className={styles.detailPortraitImage}
          unoptimized
        />
      </div>

      <div className={styles.detailBody}>
        <p className={styles.detailStatus}>{statusLabel}</p>
        <h2 id="checkpoint-detail-title">
          {checkpoint.title} <span aria-hidden="true">·</span> {checkpoint.location}
        </h2>
        <p className={styles.detailSummary}>{checkpoint.summary}</p>

        <footer className={styles.detailFooter}>
          {isLocked ? (
            <span className={styles.detailLocked}>
              <Lock size={18} weight="bold" aria-hidden="true" />
              Este encontro ainda não está disponível.
            </span>
          ) : (
            <>
              <Link href={checkpoint.briefing.startHref} className={styles.detailStart}>
                <Play size={18} weight="fill" aria-hidden="true" />
                {actionLabel}
              </Link>
              {checkpoint.status === "completed" ? (
                <span className={styles.detailMeta}>Feito · {checkpoint.parts * 2} min</span>
              ) : null}
            </>
          )}
        </footer>
      </div>
    </article>
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

function checkpointStatusLabel(status: MapCheckpointStatus): string {
  if (status === "completed") {
    return "Encontro concluído";
  }
  if (status === "current") {
    return "Encontro atual";
  }
  if (status === "available") {
    return "Disponível";
  }
  return "Em breve";
}
