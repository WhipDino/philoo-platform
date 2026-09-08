"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { Lock, Play, X } from "@phosphor-icons/react";
import type { MapCheckpointStatus, PathMapCheckpoint } from "./student-path-map-content";
import styles from "./student-lesson-briefing.module.css";

function statusLabel(status: MapCheckpointStatus) {
  if (status === "completed") {
    return "Concluída";
  }
  if (status === "current") {
    return "Em andamento";
  }
  if (status === "available") {
    return "Disponível";
  }
  return "Em breve";
}

function actionLabel(checkpoint: PathMapCheckpoint) {
  if (checkpoint.status === "completed") {
    return "Rever lição";
  }
  return checkpoint.briefing.startLabel;
}

export function StudentLessonBriefing({
  checkpoint,
  onClose,
}: {
  checkpoint: PathMapCheckpoint;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const isLocked = checkpoint.status === "locked";
  const minutes = Math.max(checkpoint.parts * 2, 8);

  useEffect(() => {
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <article
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Fechar briefing"
        >
          <X size={20} weight="bold" aria-hidden="true" />
        </button>

        <div className={styles.hero}>
          <Image
            src={checkpoint.sceneImage}
            alt={checkpoint.sceneAlt}
            fill
            sizes="(max-width: 720px) 100vw, 52rem"
            className={styles.heroImage}
            unoptimized
            priority
          />
          <div className={styles.heroShade} aria-hidden="true" />
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              {checkpoint.briefing.encounterLabel}
              <span aria-hidden="true"> · </span>
              {checkpoint.briefing.trailLabel}
            </p>
            <h2 id={titleId}>{checkpoint.title}</h2>
            <p className={styles.question}>{checkpoint.briefing.question}</p>
            {isLocked ? (
              <p className={styles.lockedCta}>
                <Lock size={18} weight="bold" aria-hidden="true" />
                Este encontro ainda não está disponível.
              </p>
            ) : (
              <Link href={checkpoint.briefing.startHref} className={styles.play}>
                <Play size={20} weight="fill" aria-hidden="true" />
                {actionLabel(checkpoint)}
              </Link>
            )}
          </div>
        </div>

        <div className={styles.body}>
          <p className={styles.meta}>
            <span data-tone={checkpoint.status}>{statusLabel(checkpoint.status)}</span>
            <span>{checkpoint.location}</span>
            <span>{minutes} min</span>
            <span>
              {checkpoint.parts} {checkpoint.parts === 1 ? "parte" : "partes"}
            </span>
          </p>
          <p className={styles.synopsis}>{checkpoint.briefing.history}</p>
          <p className={styles.investigation}>{checkpoint.briefing.investigation}</p>
          <dl className={styles.credits}>
            <div>
              <dt>Guia</dt>
              <dd>{checkpoint.guide}</dd>
            </div>
            <div>
              <dt>Pergunta</dt>
              <dd>{checkpoint.subtitle}</dd>
            </div>
          </dl>
        </div>
      </article>
    </div>
  );
}
