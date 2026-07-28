"use client";

import {
  AnimatePresence,
  LayoutGroup,
  LazyMotion,
  MotionConfig,
  domMax,
  useReducedMotion,
} from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";
import styles from "./philoo-story-path-stage.module.css";

export type PhilooStoryPathStep = {
  id: string;
  label: string;
};

export type PhilooStoryPathStageProps = {
  eyebrow: string;
  title: string;
  titleId: string;
  context: string;
  steps: readonly PhilooStoryPathStep[];
  currentStep: number;
  transitionKey: string | number;
  guide: ReactNode;
  speaker: string;
  children: ReactNode;
  action: ReactNode;
};

export function PhilooStoryPathStage({
  eyebrow,
  title,
  titleId,
  context,
  steps,
  currentStep,
  transitionKey,
  guide,
  speaker,
  children,
  action,
}: PhilooStoryPathStageProps) {
  const shouldReduceMotion = useReducedMotion();
  const contentTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domMax} strict>
        <section
          className={styles.stage}
          aria-labelledby={titleId}
          data-philoo-story-path-stage
        >
          <span className={styles.underlay} aria-hidden="true" />
          <div className={styles.page}>
            <header className={styles.masthead}>
              <div>
                <span className={styles.eyebrow}>{eyebrow}</span>
                <h1 id={titleId}>{title}</h1>
                <p>{context}</p>
              </div>
              <span className={styles.beatCount}>
                {currentStep + 1} de {steps.length}
              </span>
            </header>

            <LayoutGroup id={`${titleId}-path`}>
              <ol className={styles.path} aria-label="Caminho nesta cena">
                {steps.map((step, index) => {
                  const state =
                    index < currentStep
                      ? "completed"
                      : index === currentStep
                        ? "current"
                        : "upcoming";

                  return (
                    <li key={step.id} data-story-step-state={state}>
                      {state === "current" ? (
                        <m.span
                          className={styles.activeStep}
                          layoutId={`${titleId}-active-step`}
                          transition={{
                            layout: {
                              type: "spring",
                              stiffness: 420,
                              damping: 25,
                              mass: 0.7,
                            },
                          }}
                          aria-hidden="true"
                        />
                      ) : null}
                      <span className={styles.stepMarker} aria-hidden="true">
                        {state === "completed" ? "✓" : index + 1}
                      </span>
                      <span
                        className={styles.stepLabel}
                        aria-current={state === "current" ? "step" : undefined}
                      >
                        {step.label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </LayoutGroup>

            <div className={styles.storyBody}>
              <svg
                className={styles.storyThread}
                viewBox="0 0 1000 430"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M18 22 C190 35 120 178 315 190 S590 115 680 235 S850 392 982 340" />
              </svg>

              <AnimatePresence initial={false} mode="wait">
                <m.div
                  className={styles.voiceSheet}
                  data-story-path-slot="voice"
                  role="status"
                  aria-live="polite"
                  key={`voice-${transitionKey}`}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={contentTransition}
                >
                  <span className={styles.quoteMark} aria-hidden="true">
                    “
                  </span>
                  <p className={styles.speaker}>{speaker}</p>
                  <div className={styles.copy}>{children}</div>
                </m.div>
              </AnimatePresence>

              <AnimatePresence initial={false} mode="popLayout">
                <m.div
                  className={styles.guide}
                  data-story-path-slot="guide"
                  key={`guide-${transitionKey}`}
                  initial={{ opacity: 0, x: 12, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -8, scale: 0.98 }}
                  transition={contentTransition}
                >
                  {guide}
                </m.div>
              </AnimatePresence>
            </div>

            <footer className={styles.actionDock}>
              <span>
                Momento {currentStep + 1} de {steps.length}
              </span>
              <div data-story-path-slot="action">{action}</div>
            </footer>
          </div>
        </section>
      </LazyMotion>
    </MotionConfig>
  );
}
