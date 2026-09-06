"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Books,
  ClipboardText,
  GridFour,
  MapTrifold,
  Play,
  Sparkle,
} from "@phosphor-icons/react";
import { buildNextStepQueue, getNextStepHero, type NextStepItem } from "./student-next-step-content";
import styles from "./student-next-step.module.css";

type StudentNextStepViewProps = {
  onOpenModuleMap: () => void;
  onOpenLibrary: () => void;
};

export function StudentNextStepView({
  onOpenModuleMap,
  onOpenLibrary,
}: StudentNextStepViewProps) {
  const {
    greeting,
    primary,
    sceneImage,
    moduleChip,
    chapterLabel,
    moduleProgressPct,
    chaptersRead,
    chapterCount,
    focusWord,
  } = getNextStepHero();
  const queue = buildNextStepQueue();
  const following = queue.filter((item) => item.id !== primary.id);

  return (
    <section className={styles.page} aria-labelledby="home-greeting">
      <header className={styles.pageHeader}>
        <h1 id="home-greeting">{greeting}</h1>
        <p className={styles.pageLead}>Um passo de cada vez — o mapa de encontros fica na Biblioteca.</p>
      </header>

      <div className={styles.homeGrid}>
        <div className={styles.homeMain}>
          <section className={styles.continueSection} aria-labelledby="continue-title">
            <h2 id="continue-title" className={styles.sectionTitle}>
              Continue de onde parou
            </h2>
            <article className={styles.brilliantCard}>
              {typeof primary.progressPct === "number" ? (
                <div className={styles.cardTop}>
                  <div className={styles.track} aria-hidden="true">
                    <div className={styles.fill} style={{ width: `${primary.progressPct}%` }} />
                  </div>
                  <span
                    className={styles.score}
                    role="progressbar"
                    aria-label={`Progresso em ${primary.title}`}
                    aria-valuenow={primary.progressPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <Sparkle size={14} weight="fill" aria-hidden="true" />
                    {primary.progressPct}%
                  </span>
                </div>
              ) : null}

              <div className={styles.cardStage}>
                <Image
                  src={sceneImage}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 960px) 100vw, 55vw"
                  className={styles.stageImage}
                  unoptimized
                />
              </div>

              <div className={styles.cardBody}>
                <span className={styles.moduleChip}>
                  <GridFour size={14} weight="duotone" aria-hidden="true" />
                  {moduleChip}
                </span>
                <h3 className={styles.cardTitle}>{primary.title}</h3>
                <p className={styles.cardMeta}>{chapterLabel}</p>
                <p className={styles.cardDetail}>{primary.detail}</p>
                <Link href={primary.href} className={styles.primaryCta}>
                  <Play size={18} weight="fill" aria-hidden="true" />
                  {primary.cta}
                </Link>
              </div>
            </article>
          </section>
        </div>

        <aside className={styles.homeSide} aria-label="Próximos passos e progresso">
          <article className={styles.modulePanel}>
            <h2 className={styles.panelTitle}>Neste módulo</h2>
            <p className={styles.panelMeta}>
              {chaptersRead} de {chapterCount} capítulos lidos
            </p>
            <div className={styles.panelTrack} aria-hidden="true">
              <div className={styles.panelFill} style={{ width: `${moduleProgressPct}%` }} />
            </div>
            <p className={styles.panelWord}>
              Palavra em foco · <strong>{focusWord}</strong>
            </p>
          </article>

          {following.length > 0 ? (
            <section className={styles.upNext} aria-labelledby="queue-title">
              <div className={styles.upNextHead}>
                <div>
                  <p className={styles.sectionEyebrow}>Depois disso</p>
                  <h2 id="queue-title" className={styles.sectionTitle}>
                    Na sua fila
                  </h2>
                </div>
              </div>
              <div className={styles.upNextRail}>
                {following.map((item, index) => (
                  <QueueCard key={item.id} item={item} rank={index + 2} />
                ))}
              </div>
            </section>
          ) : null}

          <nav className={styles.shortcuts} aria-label="Atalhos do acervo">
            <button type="button" className={styles.shortcutCard} onClick={onOpenModuleMap}>
              <span className={styles.shortcutIcon}>
                <MapTrifold size={22} weight="duotone" aria-hidden="true" />
              </span>
              <span className={styles.shortcutCopy}>
                <strong>Mapa do módulo</strong>
                <span>Ver moedas desta trilha</span>
              </span>
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </button>
            <button type="button" className={styles.shortcutCard} onClick={onOpenLibrary}>
              <span className={styles.shortcutIcon}>
                <Books size={22} weight="duotone" aria-hidden="true" />
              </span>
              <span className={styles.shortcutCopy}>
                <strong>Biblioteca</strong>
                <span>Explorar o acervo</span>
              </span>
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </button>
          </nav>
        </aside>
      </div>
    </section>
  );
}

function QueueCard({ item, rank }: { item: NextStepItem; rank: number }) {
  const icon =
    item.kind === "homework" ? (
      <ClipboardText size={28} weight="duotone" aria-hidden="true" />
    ) : (
      <Play size={26} weight="fill" aria-hidden="true" />
    );

  return (
    <Link href={item.href} className={styles.queueCard} data-kind={item.kind}>
      <span className={styles.queueRank}>{rank}</span>
      <div className={styles.queueStage}>
        {item.imageSrc ? (
          <Image
            src={item.imageSrc}
            alt=""
            fill
            sizes="240px"
            className={styles.queueImage}
            unoptimized
          />
        ) : (
          <span className={styles.queueIcon}>{icon}</span>
        )}
      </div>
      <div className={styles.queueBody}>
        <span className={styles.queueEyebrow}>{item.eyebrow}</span>
        <strong>{item.title}</strong>
        <span>{item.detail}</span>
      </div>
      <span className={styles.queueAction}>
        {item.cta}
        <ArrowRight size={14} weight="bold" aria-hidden="true" />
      </span>
    </Link>
  );
}
