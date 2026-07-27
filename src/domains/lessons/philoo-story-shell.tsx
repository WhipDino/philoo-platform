"use client";

import Link from "next/link";
import type { AnimationEventHandler, ReactNode } from "react";
import { CaveStoryProgress } from "./as-sombras/cave-story-progress";
import { PhilooOuterRibbons } from "./philoo-outer-ribbons";
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
  showSoftFrame?: boolean;
  surfaceWidth?: "fluid" | "narrative";
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
  showSoftFrame = true,
  surfaceWidth = "fluid",
}: PhilooStoryShellProps) {
  return (
    <main
      id="conteudo"
      className={[styles.page, className].filter(Boolean).join(" ")}
      data-surface-width={surfaceWidth}
    >
      {surfaceWidth === "narrative" ? <PhilooOuterRibbons /> : null}

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
        data-surface-width={surfaceWidth}
        onAnimationEnd={onAnimationEnd}
      >
        {showSoftFrame ? <PhilooSoftFrame /> : null}
        <div className={styles.storyContent}>{children}</div>
      </section>
    </main>
  );
}
