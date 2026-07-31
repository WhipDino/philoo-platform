"use client";

import { useState } from "react";
import { GuidedClassificationActivity } from "./guided-classification-activity";
import {
  createGuidedClassificationState,
  sanitizeGuidedClassificationState,
  type GuidedClassificationConfig,
  type GuidedClassificationState,
} from "./guided-classification-contract";

export type GuidedClassificationExerciseProps<
  CategoryId extends string,
> = {
  config: GuidedClassificationConfig<CategoryId>;
  initialState?: unknown;
  onStateChange?: (state: GuidedClassificationState<CategoryId>) => void;
  onComplete?: (state: GuidedClassificationState<CategoryId>) => void;
};

/**
 * The author-facing API for EX-05.
 *
 * It owns interaction state, responsive behavior, feedback, accessibility and
 * answer checking. Lesson authors only provide a typed content configuration.
 */
export function GuidedClassificationExercise<CategoryId extends string>({
  config,
  initialState,
  onStateChange,
  onComplete,
}: GuidedClassificationExerciseProps<CategoryId>) {
  const [state, setState] = useState<GuidedClassificationState<CategoryId>>(
    () =>
      initialState === undefined
        ? createGuidedClassificationState()
        : sanitizeGuidedClassificationState(config, initialState),
  );

  function handleChange(next: GuidedClassificationState<CategoryId>) {
    setState(next);
    onStateChange?.(next);
  }

  return (
    <GuidedClassificationActivity
      config={config}
      value={state}
      onChange={handleChange}
      onComplete={onComplete}
    />
  );
}
