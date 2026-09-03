"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { CharacterId } from "@/domains/character-library";
import { PhilooCharacterGuide } from "../philoo-character-guide";
import { PlatoGuide } from "../plato-guide";
import type { PlatoPoseKey } from "../plato-pose-catalog";
import styles from "./philoo-activity-briefing.module.css";

export type PhilooActivityBriefingProps = {
  open: boolean;
  title: string;
  purpose: string;
  steps: readonly string[];
  startLabel: string;
  guidePose?: PlatoPoseKey;
  guideCharacterId?: CharacterId;
  guidePoseId?: string;
  guideLabel?: string;
  demonstration: ReactNode;
  onClose: () => void;
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function keepFocusInside(
  dialog: HTMLElement | null,
  event: KeyboardEvent,
) {
  if (!dialog) return;

  const focusable = Array.from(
    dialog.querySelectorAll<HTMLElement>(focusableSelector),
  );
  if (focusable.length === 0) {
    event.preventDefault();
    dialog.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable.at(-1)!;
  const activeElement = document.activeElement;

  if (event.shiftKey && activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function inertBodySiblings(modalRoot: HTMLElement) {
  const siblings = Array.from(document.body.children).filter(
    (child) => child !== modalRoot,
  ) as HTMLElement[];
  const priorInert = siblings.map((sibling) => sibling.inert);

  siblings.forEach((sibling) => {
    sibling.inert = true;
  });

  return () => {
    siblings.forEach((sibling, index) => {
      sibling.inert = priorInert[index];
    });
  };
}

export function PhilooActivityBriefing({
  open,
  title,
  purpose,
  steps,
  startLabel,
  guidePose,
  guideCharacterId = "plato",
  guidePoseId,
  guideLabel = "Platão te acompanha",
  demonstration,
  onClose,
}: PhilooActivityBriefingProps): React.JSX.Element {
  const actionRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const modalRootRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    actionRef.current?.focus();

    return () => previousFocusRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const closeOnKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") keepFocusInside(dialogRef.current, event);
    };

    window.addEventListener("keydown", closeOnKey);
    return () => window.removeEventListener("keydown", closeOnKey);
  }, [onClose, open]);

  useEffect(() => {
    if (!open || !modalRootRef.current) return;

    const restoreInert = inertBodySiblings(modalRootRef.current);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      restoreInert();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return <></>;

  return createPortal(
    <div
      ref={modalRootRef}
      className={styles.backdrop}
      data-philoo-modal-root
    >
      <section
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-briefing-title"
      >
        <div className={styles.visual} data-briefing-visual>
          <span className={styles.visualHalo} aria-hidden="true" />
          {guideCharacterId === "plato" && guidePose ? (
            <PlatoGuide className={styles.guide} pose={guidePose} priority />
          ) : (
            <PhilooCharacterGuide
              className={styles.guide}
              characterId={guideCharacterId}
              poseId={guidePoseId ?? guidePose ?? "identity-anchor"}
              priority
            />
          )}
          <span className={styles.guideLabel}>{guideLabel}</span>
        </div>
        <div className={styles.copy}>
          <span className={styles.kicker}>Antes de começar</span>
          <h2 id="activity-briefing-title">{title}</h2>
          <p>{purpose}</p>
          <div className={styles.demonstration}>{demonstration}</div>
          <ol>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <button
            ref={actionRef}
            className={styles.action}
            type="button"
            onClick={onClose}
          >
            {startLabel}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
