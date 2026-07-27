"use client";

import Link from "next/link";
import type { AnimationEventHandler, ReactNode } from "react";
import { CaveStoryProgress } from "./as-sombras/cave-story-progress";
import { PhilooSoftFrame } from "./philoo-soft-frame";
import styles from "./philoo-story-shell.module.css";

type PhilooStoryShellProps = {
  backHref: string;
  backLabel?: string;
  currentBeat: number;
  totalBeats: number;
  labelledBy: string;
  phase: "idle" | "leaving";
  onAnimationEnd?: AnimationEventHandler<HTMLElement>;
  children: ReactNode;
  className?: string;
};

export function PhilooStoryShell({
  backHref,
  backLabel = "Voltar",
  currentBeat,
  totalBeats,
  labelledBy,
  phase,
  onAnimationEnd,
  children,
  className,
}: PhilooStoryShellProps) {
  return (
    <main
      id="conteudo"
      className={[styles.page, className].filter(Boolean).join(" ")}
    >
      <header className={styles.topbar}>
        <Link className={styles.back} href={backHref}>
          <span className={styles.backArrow} aria-hidden="true">
            ←
          </span>
          <span>{backLabel}</span>
        </Link>

        <div className={styles.lessonName}>
          <strong>Philoo</strong>
          <span aria-hidden="true">·</span>
          <span>As Sombras</span>
        </div>

        <CaveStoryProgress
          currentBeat={currentBeat}
          totalBeats={totalBeats}
        />
      </header>

      <section
        className={styles.storySurface}
        aria-labelledby={labelledBy}
        data-phase={phase}
        data-philoo-story-shell
        onAnimationEnd={onAnimationEnd}
      >
        <PhilooSoftFrame />
        <div className={styles.storyContent}>{children}</div>
      </section>
    </main>
  );
}
