"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Lock,
  MapTrifold,
  Notebook,
  Play,
} from "@phosphor-icons/react";
import { getCharacterPose } from "@/domains/character-library";
import { getTrailCoin } from "./philosopher-coin-assets";
import { StudentLessonBriefing } from "./student-lesson-briefing";
import {
  getPathMapTrail,
  pathMapTrails,
  type MapCheckpointStatus,
  type PathMapCheckpoint,
  type PathMapTrail,
} from "./student-path-map-content";
import styles from "./student-trail.module.css";

const WAVE_STEPS = 10;

function playableTrails() {
  return pathMapTrails.filter(
    (item) => item.status !== "coming" && item.status !== "locked" && item.checkpoints.length > 0,
  );
}

function bannerTone(trailId: string) {
  return trailId === "primeiros-pensadores" ? "embers" : "cave";
}

function findScrollRoot(node: HTMLElement): Element | null {
  let current: HTMLElement | null = node.parentElement;
  while (current) {
    const overflowY = getComputedStyle(current).overflowY;
    if (overflowY === "auto" || overflowY === "scroll") {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

type StudentTrailViewProps = {
  trailId: string;
  onSwitchTrail: (trailId: string) => void;
  onOpenLibrary: () => void;
  onOpenNotebook: () => void;
};

export function StudentTrailView({
  trailId,
  onSwitchTrail,
  onOpenLibrary,
  onOpenNotebook,
}: StudentTrailViewProps) {
  const trails = useMemo(() => playableTrails(), []);
  const columnRef = useRef<HTMLDivElement>(null);
  const activeIdRef = useRef(trailId);
  const onSwitchTrailRef = useRef(onSwitchTrail);
  const [activeTrailId, setActiveTrailId] = useState(trailId);
  const [briefing, setBriefing] = useState<PathMapCheckpoint | null>(null);
  const trail = getPathMapTrail(activeTrailId) ?? trails[0];
  onSwitchTrailRef.current = onSwitchTrail;

  useEffect(() => {
    activeIdRef.current = activeTrailId;
  }, [activeTrailId]);

  useEffect(() => {
    if (!trails.some((item) => item.id === trailId)) {
      return;
    }
    setActiveTrailId(trailId);
  }, [trailId, trails]);

  useEffect(() => {
    const column = columnRef.current;
    if (!column || trails.length < 2) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const root = findScrollRoot(column);
    const sections = [...column.querySelectorAll<HTMLElement>("[data-trail-section]")];
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        const nextId = hit?.target instanceof HTMLElement ? hit.target.dataset.trailSection : null;
        if (!nextId || nextId === activeIdRef.current) {
          return;
        }
        setActiveTrailId(nextId);
        onSwitchTrailRef.current(nextId);
      },
      {
        root,
        rootMargin: "-22% 0px -58% 0px",
        threshold: [0.08, 0.2, 0.4],
      },
    );

    for (const section of sections) {
      observer.observe(section);
    }
    return () => observer.disconnect();
  }, [trails.length]);

  useEffect(() => {
    if (!trailId || trailId === trails[0]?.id) {
      return;
    }
    const target = columnRef.current?.querySelector<HTMLElement>(
      `[data-trail-section="${trailId}"]`,
    );
    if (!target) {
      return;
    }
    target.scrollIntoView({ block: "start", behavior: "instant" });
    // Deep-link landing only. Observer-driven trail changes must not jump the scroll.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  if (!trail || trail.checkpoints.length === 0) {
    return null;
  }

  const completedCount = trail.checkpoints.filter((cp) => cp.status === "completed").length;
  const progressPct =
    trail.checkpoints.length > 0
      ? Math.round((completedCount / trail.checkpoints.length) * 100)
      : 0;
  const currentCheckpoint =
    trail.checkpoints.find((cp) => cp.status === "current") ??
    trail.checkpoints.find((cp) => cp.status === "available");

  return (
    <section className={styles.page} aria-labelledby="trail-unit-title">
      <div className={styles.layout}>
        <div className={styles.pathColumn} ref={columnRef}>
          <div className={styles.unitBannerSticky}>
            <article className={styles.unitBanner} data-tone={bannerTone(trail.id)}>
              <div className={styles.unitBannerCopy}>
                <p className={styles.unitEyebrow}>{trail.eraLabel}</p>
                <h1 id="trail-unit-title">{trail.title}</h1>
                <p className={styles.unitBlurb}>{trail.blurb}</p>
              </div>
              <button
                type="button"
                className={styles.notebookBtn}
                onClick={onOpenNotebook}
                aria-label="Abrir caderno"
              >
                <Notebook size={28} weight="duotone" aria-hidden="true" />
              </button>
            </article>
          </div>

          {trails.map((item, index) => (
            <TrailSection
              key={item.id}
              trail={item}
              showBreak={index > 0}
              onOpenBriefing={setBriefing}
            />
          ))}
        </div>

        <aside className={styles.sidePanel} aria-label="Progresso da trilha">
          <TrailSidePanel
            trail={trail}
            progressPct={progressPct}
            completedCount={completedCount}
            currentCheckpoint={currentCheckpoint}
            onOpenLibrary={onOpenLibrary}
            onOpenBriefing={setBriefing}
          />
        </aside>
      </div>
      {briefing ? (
        <StudentLessonBriefing checkpoint={briefing} onClose={() => setBriefing(null)} />
      ) : null}
    </section>
  );
}

function TrailSection({
  trail,
  showBreak,
  onOpenBriefing,
}: {
  trail: PathMapTrail;
  showBreak: boolean;
  onOpenBriefing: (checkpoint: PathMapCheckpoint) => void;
}) {
  return (
    <>
      {showBreak ? <hr className={styles.sectionBreak} /> : null}
      <div className={styles.pathScroll} data-trail-section={trail.id}>
        {trail.id === "saindo-da-caverna" ? (
          <div className={styles.companion} data-slot="cave" aria-hidden="true">
            <Image
              src="/images/portal/trail/plato-trail-lantern-v3.png"
              alt=""
              width={360}
              height={480}
              sizes="(max-width: 640px) 28vw, 220px"
              className={styles.companionImage}
              unoptimized
            />
          </div>
        ) : null}
        {trail.id === "primeiros-pensadores" ? (
          <>
            <div className={styles.companion} data-slot="upper" aria-hidden="true">
              <Image
                src="/images/portal/trail/thales-trail-water-v1.png"
                alt=""
                width={360}
                height={480}
                sizes="(max-width: 640px) 28vw, 220px"
                className={styles.companionImage}
                unoptimized
              />
            </div>
            <div className={styles.companion} data-slot="lower" aria-hidden="true">
              <Image
                src="/images/portal/trail/heraclitus-trail-fire-v1.png"
                alt=""
                width={360}
                height={480}
                sizes="(max-width: 640px) 30vw, 244px"
                className={styles.companionImage}
                unoptimized
              />
            </div>
          </>
        ) : null}
        <ol className={styles.pathList} aria-label={`Encontros de ${trail.title}`}>
          {trail.checkpoints.map((checkpoint, index) => (
            <PathNode
              key={checkpoint.id}
              checkpoint={checkpoint}
              trailId={trail.id}
              wave={index % WAVE_STEPS}
              onOpenBriefing={onOpenBriefing}
            />
          ))}
        </ol>
      </div>
    </>
  );
}

function PathNode({
  checkpoint,
  trailId,
  wave,
  onOpenBriefing,
}: {
  checkpoint: PathMapCheckpoint;
  trailId: string;
  wave: number;
  onOpenBriefing: (checkpoint: PathMapCheckpoint) => void;
}) {
  const isCurrent = checkpoint.status === "current";
  const coinAsset = getTrailCoin(checkpoint.characterId, trailId);
  const portrait = coinAsset
    ? null
    : getCharacterPose(checkpoint.characterId, checkpoint.coinPoseId);
  const actionLabel =
    checkpoint.status === "locked"
      ? `Ver briefing de ${checkpoint.title}`
      : isCurrent
        ? `Continuar ${checkpoint.title}`
        : `Abrir ${checkpoint.title}`;

  const nodeBody = (
    <>
      {isCurrent ? (
        <span className={styles.startBubble} aria-hidden="true">
          Você está aqui
        </span>
      ) : null}
      <span className={styles.nodeCoin} data-status={checkpoint.status}>
        {coinAsset ? (
          <img
            src={coinAsset.src}
            alt=""
            width={112}
            height={112}
            className={styles.coinImage}
            decoding="async"
          />
        ) : portrait ? (
          <Image
            src={portrait.src}
            alt=""
            width={112}
            height={112}
            sizes="88px"
            className={styles.coinPortrait}
            unoptimized
          />
        ) : null}
      </span>
      <NodeStatusBadge status={checkpoint.status} />
    </>
  );

  return (
    <li className={styles.pathItem} data-wave={wave}>
      <div className={styles.pathNodeWrap}>
        <button
          type="button"
          className={styles.pathNode}
          data-status={checkpoint.status}
          data-tone={bannerTone(trailId)}
          aria-label={actionLabel}
          onClick={() => onOpenBriefing(checkpoint)}
        >
          {nodeBody}
        </button>
        <div className={styles.nodeLabel}>
          <strong>{checkpoint.title}</strong>
          <span>{checkpoint.location}</span>
        </div>
      </div>
    </li>
  );
}

function NodeStatusBadge({ status }: { status: MapCheckpointStatus }) {
  if (status === "completed") {
    return (
      <span className={styles.nodeBadge} data-status={status} aria-hidden="true">
        <Check size={16} weight="bold" />
      </span>
    );
  }
  if (status === "current") {
    return (
      <span className={styles.nodeBadge} data-status={status} aria-hidden="true">
        <Play size={14} weight="fill" />
      </span>
    );
  }
  if (status === "locked") {
    return (
      <span className={styles.nodeBadge} data-status={status} aria-hidden="true">
        <Lock size={14} weight="bold" />
      </span>
    );
  }
  return null;
}

function TrailSidePanel({
  trail,
  progressPct,
  completedCount,
  currentCheckpoint,
  onOpenLibrary,
  onOpenBriefing,
}: {
  trail: PathMapTrail;
  progressPct: number;
  completedCount: number;
  currentCheckpoint: PathMapCheckpoint | undefined;
  onOpenLibrary: () => void;
  onOpenBriefing: (checkpoint: PathMapCheckpoint) => void;
}) {
  return (
    <>
      <article className={styles.sideCard}>
        <p className={styles.sideEyebrow}>Seu progresso</p>
        <p className={styles.sideStat}>
          <strong>{completedCount}</strong>
          <span>de {trail.checkpoints.length} encontros</span>
        </p>
        <div className={styles.sideTrack} aria-hidden="true">
          <div className={styles.sideFill} style={{ width: `${progressPct}%` }} />
        </div>
        <p className={styles.sidePct}>{progressPct}% concluído</p>
      </article>

      {currentCheckpoint ? (
        <article className={styles.sideCard}>
          <p className={styles.sideEyebrow}>Próximo passo</p>
          <h2 className={styles.sideTitle}>{currentCheckpoint.title}</h2>
          <p className={styles.sideDetail}>{currentCheckpoint.summary}</p>
          {currentCheckpoint.status !== "locked" ? (
            <Link href={currentCheckpoint.briefing.startHref} className={styles.sideCta}>
              <Play size={18} weight="fill" aria-hidden="true" />
              {currentCheckpoint.briefing.startLabel}
            </Link>
          ) : null}
        </article>
      ) : null}

      <article className={styles.sideCard}>
        <p className={styles.sideEyebrow}>Lições realizadas</p>
        <ul className={styles.coinStrip}>
          {trail.checkpoints.map((checkpoint) => {
            const coin = getTrailCoin(checkpoint.characterId, trail.id);
            return (
              <li key={checkpoint.id} data-status={checkpoint.status}>
                <button
                  type="button"
                  className={styles.stripBtn}
                  onClick={() => onOpenBriefing(checkpoint)}
                  aria-label={`Ver briefing de ${checkpoint.title}`}
                >
                  {coin ? (
                    <img
                      src={coin.src}
                      alt=""
                      width={48}
                      height={48}
                      className={styles.stripCoin}
                      decoding="async"
                    />
                  ) : (
                    <span className={styles.stripPlaceholder} aria-hidden="true" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </article>

      <button type="button" className={styles.sideLink} onClick={onOpenLibrary}>
        <MapTrifold size={18} weight="duotone" aria-hidden="true" />
        Ver acervo completo
      </button>
    </>
  );
}
