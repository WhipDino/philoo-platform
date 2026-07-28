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
import {
  BookOpenTextIcon,
  BrainIcon,
  ChalkboardTeacherIcon,
  ChatsCircleIcon,
  CheckIcon,
  LightbulbFilamentIcon,
  PuzzlePieceIcon,
  QuotesIcon,
} from "@phosphor-icons/react";
import styles from "./philoo-story-path-stage.module.css";

export type PhilooStoryPathKind =
  | "story"
  | "lesson"
  | "definition"
  | "concept"
  | "activity"
  | "reflection"
  | "conversation";

export type PhilooStoryPathStep = {
  id: string;
  label: string;
  kind: PhilooStoryPathKind;
};

const ICON_BY_KIND = {
  story: BookOpenTextIcon,
  lesson: ChalkboardTeacherIcon,
  definition: QuotesIcon,
  concept: LightbulbFilamentIcon,
  activity: PuzzlePieceIcon,
  reflection: BrainIcon,
  conversation: ChatsCircleIcon,
} as const;

const LABEL_BY_KIND: Record<PhilooStoryPathKind, string> = {
  story: "História",
  lesson: "Explicação",
  definition: "Definição",
  concept: "Ideia",
  activity: "Atividade",
  reflection: "Reflexão",
  conversation: "Conversa",
};

export type PhilooStoryPathStageProps = {
  eyebrow: string;
  title: string;
  titleId: string;
  context: string;
  steps: readonly PhilooStoryPathStep[];
  currentStep: number;
  furthestStep: number;
  onStepSelect: (step: number) => void;
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
  furthestStep,
  onStepSelect,
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
                    index === currentStep
                      ? "current"
                      : index <= furthestStep
                        ? "visited"
                        : "upcoming";
                  const StepIcon = ICON_BY_KIND[step.kind];
                  const kindLabel = LABEL_BY_KIND[step.kind];
                  const chipContent = (
                    <>
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
                      <span className={styles.stepIcon} aria-hidden="true">
                        <StepIcon
                          size={18}
                          weight={state === "current" ? "fill" : "duotone"}
                        />
                        {state === "visited" ? (
                          <span className={styles.visitedSeal}>
                            <CheckIcon size={9} weight="bold" />
                          </span>
                        ) : null}
                      </span>
                      <span className={styles.stepLabel}>{step.label}</span>
                    </>
                  );

                  return (
                    <li
                      key={step.id}
                      data-story-step-state={state}
                      data-story-step-kind={step.kind}
                    >
                      {state === "visited" ? (
                        <button
                          type="button"
                          className={styles.stepChip}
                          aria-label={`Voltar para ${kindLabel}: ${step.label}`}
                          title={kindLabel}
                          onClick={() => onStepSelect(index)}
                        >
                          {chipContent}
                        </button>
                      ) : (
                        <span
                          className={styles.stepChip}
                          aria-current={state === "current" ? "step" : undefined}
                          aria-disabled={state === "upcoming" ? "true" : undefined}
                          aria-label={`${kindLabel}: ${step.label}${
                            state === "current"
                              ? " (etapa atual)"
                              : " (indisponível)"
                          }`}
                          title={kindLabel}
                        >
                          {chipContent}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </LayoutGroup>

            <div className={styles.storyBody}>
              <AnimatePresence initial={false} mode="sync">
                <m.div
                  className={styles.storyMoment}
                  data-story-path-slot="moment"
                  data-story-transition-key={transitionKey}
                  key={`moment-${transitionKey}`}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={contentTransition}
                >
                  <div
                    className={styles.voiceSheet}
                    data-story-path-slot="voice"
                    role="status"
                    aria-live="polite"
                  >
                    <span className={styles.quoteMark} aria-hidden="true">
                      “
                    </span>
                    <p className={styles.speaker}>{speaker}</p>
                    <div className={styles.copy}>{children}</div>
                  </div>

                  <div
                    className={styles.guide}
                    data-story-path-slot="guide"
                  >
                    {guide}
                  </div>
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
