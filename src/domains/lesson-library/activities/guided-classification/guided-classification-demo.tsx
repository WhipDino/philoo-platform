"use client";

import { useState } from "react";
import {
  createGuidedClassificationState,
  type GuidedClassificationConfig,
  type GuidedClassificationState,
} from "./guided-classification-contract";
import { GuidedClassificationActivity } from "./guided-classification-activity";

type GuidedClassificationDemoProps<CategoryId extends string> = {
  config: GuidedClassificationConfig<CategoryId>;
};

export function GuidedClassificationDemo<CategoryId extends string>({
  config,
}: GuidedClassificationDemoProps<CategoryId>) {
  const [state, setState] = useState<GuidedClassificationState<CategoryId>>(() =>
    createGuidedClassificationState(),
  );

  return (
    <GuidedClassificationActivity
      config={config}
      value={state}
      onChange={setState}
    />
  );
}
