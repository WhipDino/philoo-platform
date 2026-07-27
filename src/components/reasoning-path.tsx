import { previewLesson } from "@/lib/preview-content";

type ReasoningPathProps = {
  activeStep: 0 | 1 | 2 | 3;
};

export function ReasoningPath({ activeStep }: ReasoningPathProps) {
  return (
    <ol className="reasoning-path" aria-label="Etapas da linha de raciocínio">
      {previewLesson.steps.map((step, index) => {
        const state =
          index < activeStep ? "visited" : index === activeStep ? "current" : "next";

        return (
          <li key={step} data-state={state}>
            <span className="path-dot" aria-hidden="true">
              {index + 1}
            </span>
            <span className="path-copy">
              <span className="path-state">
                {state === "visited"
                  ? "observado"
                  : state === "current"
                    ? "agora"
                    : "depois"}
              </span>
              <strong>{step}</strong>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
