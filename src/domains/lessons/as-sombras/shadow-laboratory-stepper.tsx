"use client";

import {
  STEPPER_QUESTIONS,
  type ShadowLaboratoryState,
  type StepperAnswer,
  type StepperQuestionId,
} from "./shadow-laboratory-state";
import styles from "./shadow-laboratory.module.css";

export interface StructuredStepperProps {
  readonly state: ShadowLaboratoryState;
  readonly isBusy: boolean;
  readonly onAnswer: (
    questionId: StepperQuestionId,
    answer: StepperAnswer,
  ) => void;
  readonly onRun: () => void;
}

export function StructuredStepper({
  state,
  isBusy,
  onAnswer,
  onRun,
}: StructuredStepperProps) {
  return (
    <section
      className={styles.structuredStepper}
      aria-labelledby="structured-stepper-title"
    >
      <div className={styles.workbenchHeading}>
        <p className={styles.eyebrow}>Modo em etapas · mesma investigação</p>
        <h2 id="structured-stepper-title">Construa as ligações em ordem</h2>
        <p>
          Cada pergunta descreve uma parte do mesmo arranjo. Você pode
          revisar qualquer resposta antes de executar.
        </p>
      </div>
      <ol>
        {STEPPER_QUESTIONS.map((question) => (
          <li key={question.id}>
            <fieldset>
              <legend>{question.legend}</legend>
              {question.answers.map((answer) => (
                <label key={answer.value}>
                  <input
                    type="radio"
                    name={`laboratory-${question.id}`}
                    value={answer.value}
                    checked={
                      state.stepperAnswers[question.id] === answer.value
                    }
                    onChange={() => onAnswer(question.id, answer.value)}
                    disabled={isBusy}
                  />
                  <span>{answer.label}</span>
                </label>
              ))}
            </fieldset>
          </li>
        ))}
      </ol>
      <button
        className={styles.runModelAction}
        type="button"
        onClick={onRun}
        disabled={isBusy}
      >
        Executar modelo em etapas
      </button>
    </section>
  );
}
