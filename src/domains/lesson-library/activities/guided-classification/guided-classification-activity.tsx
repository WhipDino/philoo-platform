"use client";

import {
  BrainIcon,
  ChatCircleIcon,
  EyeIcon,
  QuestionIcon,
  ScalesIcon,
} from "@phosphor-icons/react";
import { useId } from "react";
import { PhilooLessonCharacterGuide } from "@/domains/lessons/philoo-lesson-character-guide";
import {
  PhilooDiscoveryTable,
  type DiscoveryDestination,
} from "@/domains/lessons/interactions/philoo-discovery-table";
import {
  evaluateGuidedClassification,
  type GuidedClassificationConfig,
  type GuidedClassificationIcon,
  type GuidedClassificationState,
} from "./guided-classification-contract";
import styles from "./guided-classification-activity.module.css";

type GuidedClassificationActivityProps<CategoryId extends string> = {
  config: GuidedClassificationConfig<CategoryId>;
  value: GuidedClassificationState<CategoryId>;
  onChange: (state: GuidedClassificationState<CategoryId>) => void;
  onComplete?: (state: GuidedClassificationState<CategoryId>) => void;
};

function renderCategoryIcon(icon: GuidedClassificationIcon) {
  const props = { size: 22, weight: "duotone" as const };

  switch (icon) {
    case "brain":
      return <BrainIcon {...props} />;
    case "dialogue":
      return <ChatCircleIcon {...props} />;
    case "eye":
      return <EyeIcon {...props} />;
    case "question":
      return <QuestionIcon {...props} />;
    case "scales":
      return <ScalesIcon {...props} />;
  }
}

export function GuidedClassificationActivity<CategoryId extends string>({
  config,
  value,
  onChange,
  onComplete,
}: GuidedClassificationActivityProps<CategoryId>) {
  const instanceId = useId();
  const evaluation = evaluateGuidedClassification(config, value);
  const selected = config.cards.find(
    (card) => card.id === value.selectedCardId,
  );
  const destinations = config.categories.map(
    (category): DiscoveryDestination<CategoryId> => ({
      id: category.id,
      label: category.label,
      hint: category.hint,
      tone: category.tone,
      icon: renderCategoryIcon(category.icon),
    }),
  );

  function emit(next: GuidedClassificationState<CategoryId>) {
    onChange(next);
  }

  function beginChallenge() {
    emit({
      ...value,
      stage: "challenge",
      selectedCardId: null,
      hasChecked: false,
      lastMove: null,
    });
  }

  function chooseCard(cardId: string) {
    emit({
      ...value,
      selectedCardId: cardId,
      hasChecked: false,
      lastMove: null,
    });
  }

  function moveCard(cardId: string, destinationId: CategoryId) {
    emit({
      ...value,
      placements: {
        ...value.placements,
        [cardId]: destinationId,
      },
      selectedCardId: null,
      hasChecked: false,
      lastMove: { cardId, destinationId },
    });
  }

  function placeSelectedCard(destinationId: CategoryId) {
    if (!value.selectedCardId) return;
    moveCard(value.selectedCardId, destinationId);
  }

  function checkAnswer() {
    const next = { ...value, hasChecked: true };
    const nextEvaluation = evaluateGuidedClassification(config, next);
    emit(next);

    if (nextEvaluation.completedCorrectly) {
      onComplete?.(next);
    }
  }

  function getReasoning() {
    if (evaluation.completedCorrectly) {
      return {
        title: config.feedback.successTitle,
        body: config.feedback.successBody,
      };
    }

    if (value.hasChecked && evaluation.incorrectCards.length > 0) {
      const firstIncorrect = evaluation.incorrectCards[0];
      const category = config.categories.find(
        (item) => item.id === firstIncorrect.answer,
      );

      return {
        title: config.feedback.retryTitle
          .replace("{count}", String(evaluation.incorrectCards.length))
          .replace(
            "{items}",
            evaluation.incorrectCards.length === 1
              ? config.labels.itemSingular
              : config.labels.itemPlural,
          ),
        body: category?.correctionHint ?? config.feedback.initial,
      };
    }

    if (value.lastMove) {
      const card = config.cards.find(
        (item) => item.id === value.lastMove?.cardId,
      );
      const category = config.categories.find(
        (item) => item.id === card?.answer,
      );

      return card?.answer === value.lastMove.destinationId
        ? { title: config.feedback.correctPlacement, body: null }
        : {
            title: category?.correctionHint ?? config.feedback.initial,
            body: null,
          };
    }

    return { title: config.feedback.initial, body: null };
  }

  const reasoning = getReasoning();

  return (
    <section
      className={styles.workspace}
      aria-label={config.prompt.title}
      data-guided-classification={config.id}
      data-complete={evaluation.completedCorrectly ? "true" : "false"}
    >
      {value.stage === "example" ? (
        <div className={styles.activityHeading}>
          <p>
            <strong>{config.workedExample.introductionTitle}</strong>
            <span>{config.workedExample.introductionBody}</span>
          </p>
        </div>
      ) : null}

      {value.stage === "example" ? (
        <section
          className={styles.workedExample}
          aria-labelledby={`${instanceId}-example-title`}
          data-has-guide={config.guide ? "true" : "false"}
        >
          {config.guide ? (
            <PhilooLessonCharacterGuide
              className={styles.exampleGuide}
              config={config.guide}
            />
          ) : null}
          <div className={styles.exampleCopy}>
            <p className={styles.label}>{config.workedExample.eyebrow}</p>
            <h2 id={`${instanceId}-example-title`}>
              {config.workedExample.title}
            </h2>
            <div className={styles.exampleGrid}>
              {config.categories.map((category) => {
                const example = config.workedExample.items.find(
                  (item) => item.categoryId === category.id,
                );

                if (!example) return null;

                return (
                  <article data-tone={category.tone} key={category.id}>
                    <div>
                      {renderCategoryIcon(category.icon)}
                      <strong>{category.label}</strong>
                    </div>
                    <b>{example.statement}</b>
                    <p>{example.explanation}</p>
                  </article>
                );
              })}
            </div>
            <button type="button" onClick={beginChallenge}>
              {config.workedExample.continueLabel}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      ) : (
        <>
          <div className={styles.exerciseTopline}>
            <div className={styles.exercisePrompt}>
              <strong>{config.prompt.title}</strong>
              <span>{config.prompt.instruction}</span>
            </div>
            <div
              className={styles.instructions}
              role="status"
              aria-live="polite"
            >
              <span
                className={styles.progressNumber}
                data-progress-fraction
                aria-label={`${evaluation.placedCount} de ${config.cards.length} ${config.labels.progressLabel}`}
              >
                <strong aria-hidden="true">{evaluation.placedCount}</strong>
                <i aria-hidden="true" />
                <small aria-hidden="true">{config.cards.length}</small>
              </span>
              <p>
                {selected ? (
                  <>
                    <strong>“{selected.text}”</strong>
                    <span>{config.prompt.selectedInstruction}</span>
                  </>
                ) : (
                  <>
                    <strong>
                      {evaluation.placedCount} de {config.cards.length}{" "}
                      {config.labels.progressLabel}
                    </strong>
                    <span>{config.prompt.idleInstruction}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className={styles.decisionBar}>
            <div
              className={styles.reasoning}
              role="status"
              aria-live="polite"
              data-result={
                evaluation.completedCorrectly
                  ? "correct"
                  : value.hasChecked
                    ? "retry"
                    : undefined
              }
            >
              <strong>{reasoning.title}</strong>
              {reasoning.body ? <span>{reasoning.body}</span> : null}
            </div>
            {evaluation.allPlaced && !value.hasChecked ? (
              <button
                type="button"
                className={styles.checkButton}
                onClick={checkAnswer}
              >
                {config.labels.check}
                <span aria-hidden="true">→</span>
              </button>
            ) : null}
          </div>

          <PhilooDiscoveryTable
            cards={config.cards}
            destinations={destinations}
            placements={value.placements}
            selectedCardId={value.selectedCardId}
            copy={config.table}
            onSelectCard={chooseCard}
            onPlaceCard={placeSelectedCard}
            onMoveCard={moveCard}
            hideCompletionTray
          />
        </>
      )}
    </section>
  );
}
