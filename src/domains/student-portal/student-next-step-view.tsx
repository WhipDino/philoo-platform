"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Books,
  BookmarkSimple,
  ClipboardText,
  Compass,
  MapTrifold,
  Play,
} from "@phosphor-icons/react";
import { buildNextStepQueue, getNextStepHero, type NextStepItem } from "./student-next-step-content";
import type { TrailStatus } from "./student-portal-content";
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
    hook,
    moduleProgressPct,
    chaptersRead,
    chapterCount,
    focusWord,
    chapters,
    currentChapter,
    nextChapter,
  } = getNextStepHero();
  const queue = buildNextStepQueue();
  const following = queue.filter((item) => item.id !== primary.id);
  const homework = following.find((item) => item.kind === "homework");

  return (
    <section className={styles.page} aria-labelledby="home-greeting">
      <header className={styles.pageHeader}>
        <p className={styles.stageEyebrow}>Sua sala · Philoo</p>
        <h1 id="home-greeting">{greeting}</h1>
        <p className={styles.pageLead}>{lead}</p>
      </header>

      <div className={styles.homeGrid}>
        <aside className={styles.placeCard} aria-label="Onde você está">
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
              <button type="button" className={styles.shortcutCard} onClick={onOpenLibrary}>
                <Books size={20} weight="duotone" aria-hidden="true" />
                <span>Explorar o acervo</span>
              </button>
            </nav>
          </div>
        </aside>

        <article className={styles.nextCard} aria-labelledby="continue-title">
          <div className={styles.nextArt}>
            <Image
              src={sceneImage}
              alt=""
              fill
              priority
              sizes="(max-width: 800px) 100vw, 58vw"
              className={styles.nextImage}
              unoptimized
            />
            <span className={styles.nextBadge}>Seu próximo passo</span>
          </div>

          <div className={styles.nextBody}>
            <p className={styles.moduleChip}>{moduleChip}</p>
            <h2 id="continue-title" className={styles.cardTitle}>
              {primary.title}
            </h2>
            <p className={styles.cardDetail}>{hook}</p>
            <p className={styles.cardMeta}>
              {chapterLabel}
              {typeof primary.progressPct === "number" ? ` · ${primary.progressPct}%` : null}
            </p>
            {typeof primary.progressPct === "number" ? (
              <div
                className={styles.heroTrack}
                role="progressbar"
                aria-label={`Progresso em ${primary.title}`}
                aria-valuenow={primary.progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className={styles.heroFill} style={{ width: `${primary.progressPct}%` }} />
              </div>
            ) : null}

            <ol className={styles.stepList} aria-label="O que vem agora">
              <li className={styles.step} data-state="current">
                <span className={styles.stepMark} aria-hidden="true">
                  <Play size={14} weight="fill" />
                </span>
                <div>
                  <small>Capítulo {currentChapter.n} · agora</small>
                  <strong>{currentChapter.title}</strong>
                </div>
              </li>
              {nextChapter.href ? (
                <li className={styles.step} data-state="later">
                  <span className={styles.stepMark} aria-hidden="true">
                    {nextChapter.n}
                  </span>
                  <div>
                    <small>Capítulo {nextChapter.n} · depois</small>
                    <strong>{nextChapter.title}</strong>
                  </div>
                </li>
              ) : null}
            </ol>

            <Link href={primary.href} className={styles.primaryCta}>
              <Play size={18} weight="fill" aria-hidden="true" />
              {primary.cta}
            </Link>
          </div>
        </article>
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
