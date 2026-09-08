"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Books,
  BookmarkSimple,
  ClipboardText,
  Compass,
  Flame,
  MapTrifold,
  Play,
} from "@phosphor-icons/react";
import {
  buildNextStepQueue,
  getHomeSequence,
  getNextStepHero,
  homeSequenceMeta,
  type NextStepItem,
} from "./student-next-step-content";
import { SHOW_STUDENT_LIBRARY, type TrailStatus } from "./student-portal-content";
import styles from "./student-next-step.module.css";

type StudentNextStepViewProps = {
  onOpenModuleMap: () => void;
  onOpenLibrary: () => void;
};

function chapterDotLabel(status: TrailStatus, title: string) {
  if (status === "lido") {
    return `${title} — lido`;
  }
  if (status === "atual") {
    return `${title} — você está aqui`;
  }
  if (status === "aberto") {
    return `${title} — disponível`;
  }
  return `${title} — em breve`;
}

export function StudentNextStepView({
  onOpenModuleMap,
  onOpenLibrary,
}: StudentNextStepViewProps) {
  const {
    greeting,
    lead,
    primary,
    sceneImage,
    moduleChip,
    chapterLabel,
    moduleProgressPct,
    chaptersRead,
    chapterCount,
    focusWord,
    chapters,
    currentChapter,
  } = getNextStepHero();
  const queue = buildNextStepQueue();
  const following = queue.filter((item) => item.id !== primary.id);
  const homework = following.find((item) => item.kind === "homework");
  const sequence = getHomeSequence();
  const progressPct = primary.progressPct ?? 0;

  return (
    <section className={styles.page} aria-labelledby="home-greeting">
      <header className={styles.pageHeader}>
        <p className={styles.stageEyebrow}>Sua sala · Philoo</p>
        <h1 id="home-greeting">{greeting}</h1>
        <p className={styles.pageLead}>{lead}</p>
      </header>

      <div className={styles.homeGrid}>
        <div className={styles.mainStack}>
          <article className={styles.nextCard} aria-labelledby="continue-title">
            <div className={styles.nextArt}>
              <Image
                src={sceneImage}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 58vw"
                className={styles.nextImage}
                unoptimized
              />
            </div>
            <div className={styles.nextBody}>
              <p className={styles.moduleChip}>Lição</p>
              <h2 id="continue-title" className={styles.cardTitle}>
                {primary.title}
              </h2>
              <p className={styles.cardDetail}>
                Agora · {currentChapter.title}
              </p>
              <div className={styles.progressRow}>
                <div
                  className={styles.heroTrack}
                  role="progressbar"
                  aria-label={`Progresso em ${primary.title}`}
                  aria-valuenow={progressPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className={styles.heroFill} style={{ width: `${progressPct}%` }} />
                </div>
                <span className={styles.cardMeta}>
                  {progressPct}% · {chapterLabel}
                </span>
              </div>
              <Link href={primary.href} className={styles.primaryCta}>
                <Play size={18} weight="fill" aria-hidden="true" />
                {primary.cta}
              </Link>
            </div>
          </article>
        </div>

        <aside className={styles.sideStack}>
          <section className={styles.sequenceCard} aria-labelledby="sequence-title">
            <header className={styles.sequenceHead}>
              <div>
                <h2 id="sequence-title" className={styles.sequenceTitle}>
                  {sequence.count} dias seguidos
                </h2>
                <p className={styles.sequenceLead}>{homeSequenceMeta.lead}</p>
              </div>
              <span className={styles.sequenceIcon} aria-hidden="true">
                <Flame size={26} weight="duotone" />
              </span>
            </header>
            <ol className={styles.sequenceDays} aria-label="Dias da sequência">
              {sequence.days.map((day) => (
                <li key={day.id}>
                  <span
                    className={styles.sequenceDot}
                    data-done={day.done || undefined}
                    data-today={day.today || undefined}
                    title={day.today ? `${day.label} · hoje` : day.label}
                  >
                    {day.done ? "✓" : day.label}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.placeCard} aria-label="Onde você está">
            <div className={styles.placeMain}>
              <p className={styles.sectionEyebrow}>Onde você está</p>
              <div className={styles.placeIcon} aria-hidden="true">
                <Compass size={28} weight="duotone" />
              </div>
              <h2 className={styles.placeTitle}>{moduleChip}</h2>
              <p className={styles.panelMeta}>
                {chaptersRead} de {chapterCount} capítulos
              </p>
              <div
                className={styles.placeTrack}
                role="progressbar"
                aria-label={`Progresso no módulo ${moduleChip}`}
                aria-valuenow={moduleProgressPct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className={styles.placeFill} style={{ width: `${moduleProgressPct}%` }} />
              </div>
              <ol className={styles.chapterDots} aria-label="Capítulos do módulo">
                {chapters.map((chapter) => (
                  <li key={chapter.n}>
                    <span
                      className={styles.chapterDot}
                      data-status={chapter.status}
                      title={chapterDotLabel(chapter.status, chapter.title)}
                      aria-label={chapterDotLabel(chapter.status, chapter.title)}
                    >
                      {chapter.n}
                    </span>
                  </li>
                ))}
              </ol>
              <p className={styles.panelWord}>
                <BookmarkSimple size={16} weight="fill" aria-hidden="true" />
                Palavra em foco · <strong>{focusWord}</strong>
              </p>
            </div>

            <div className={styles.placeFooter}>
              {homework ? (
                <section className={styles.upNext} aria-labelledby="queue-title">
                  <h2 id="queue-title" className={styles.queueHeading}>
                    Na sua fila
                  </h2>
                  <QueueCard item={homework} />
                </section>
              ) : null}

              <nav className={styles.shortcuts} aria-label="Atalhos do acervo">
                <button
                  type="button"
                  className={styles.shortcutCard}
                  onClick={onOpenModuleMap}
                  aria-label="Mapa do módulo"
                >
                  <MapTrifold size={20} weight="duotone" aria-hidden="true" />
                  <span>Abrir a Trilha</span>
                </button>
                {SHOW_STUDENT_LIBRARY ? (
                <button type="button" className={styles.shortcutCard} onClick={onOpenLibrary}>
                  <Books size={20} weight="duotone" aria-hidden="true" />
                  <span>Explorar o acervo</span>
                </button>
                ) : null}
              </nav>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}

function QueueCard({ item }: { item: NextStepItem }) {
  return (
    <Link href={item.href} className={styles.queueCard} data-kind={item.kind}>
      <span className={styles.queueIcon} aria-hidden="true">
        <ClipboardText size={22} weight="duotone" />
      </span>
      <div className={styles.queueBody}>
        <span className={styles.queueEyebrow}>{item.eyebrow}</span>
        <strong>{item.title}</strong>
        <span>{item.detail}</span>
      </div>
      <span className={styles.queueAction} aria-hidden="true">
        <ArrowRight size={16} weight="bold" />
      </span>
    </Link>
  );
}
