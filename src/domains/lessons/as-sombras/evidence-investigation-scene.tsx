"use client";

import {
  EvidenceInspector,
  type EvidenceClue,
  type ModelFitChoice,
} from "../interactions/evidence-inspector";
import type { AnomalyClueId } from "./anomaly-scene";
import styles from "./as-sombras.module.css";

export type CaveModelFit = "parede" | "fonte" | "ambos" | "incerto";

export interface EvidenceInvestigationSceneProps {
  readonly firstClueId: AnomalyClueId;
  readonly inspectedClueIds: readonly AnomalyClueId[];
  readonly comparisons: Readonly<
    Partial<Record<AnomalyClueId, CaveModelFit>>
  >;
  readonly onInspect: (
    clueId: AnomalyClueId,
  ) => void | boolean | Promise<void | boolean>;
  readonly onCompare: (
    clueId: AnomalyClueId,
    modelFit: CaveModelFit,
  ) => void | boolean | Promise<void | boolean>;
  readonly onContinue: () => void | boolean | Promise<void | boolean>;
  readonly isBusy?: boolean;
}

const clues: readonly EvidenceClue<AnomalyClueId>[] = [
  {
    id: "forma",
    title: "Forma estável",
    summary: "O contorno com asas permanece estável durante a passagem.",
    explanation:
      "A estabilidade explica por que a comunidade reconhece e prevê a forma.",
    unresolved:
      "A forma, sozinha, ainda não identifica o que produz a projeção.",
  },
  {
    id: "som",
    title: "Voz humana",
    summary: "Uma voz humana diz “mais devagar” enquanto a forma passa.",
    explanation:
      "A voz explica que há uma ação humana coordenada com o acontecimento.",
    unresolved:
      "Ainda não sabemos onde está a pessoa nem como ela se relaciona com a forma.",
  },
  {
    id: "tempo",
    title: "Passos fora do contorno",
    summary:
      "Os passos pesados começam antes da projeção e continuam depois dela.",
    explanation:
      "A duração dos passos explica que som e contorno não têm os mesmos limites no tempo.",
    unresolved:
      "O descompasso ainda não permite observar diretamente quem caminha.",
  },
  {
    id: "repeticao",
    title: "A mesma voz, outra forma",
    summary:
      "Mais tarde, a mesma voz acompanha uma projeção de formato diferente.",
    explanation:
      "A repetição testa uma fonte que pode acompanhar mais de uma forma.",
    unresolved:
      "Ainda falta ver o mecanismo que liga a fonte escondida à parede.",
    optional: true,
  },
];

const modelFits: readonly ModelFitChoice<CaveModelFit>[] = [
  { value: "parede", label: "combina com o modelo da parede" },
  { value: "fonte", label: "combina com uma fonte escondida" },
  { value: "ambos", label: "combina com os dois" },
  { value: "incerto", label: "ainda não sei" },
];

export function EvidenceInvestigationScene({
  firstClueId,
  inspectedClueIds,
  comparisons,
  onInspect,
  onCompare,
  onContinue,
  isBusy = false,
}: EvidenceInvestigationSceneProps) {
  return (
    <article
      className={`${styles.openingScene} ${styles.evidenceScene}`}
      aria-labelledby="evidence-title"
    >
      <header className={styles.evidenceHeader}>
        <p className={styles.eyebrow}>Ato 3 · mesa de evidências</p>
        <h1 id="evidence-title" tabIndex={-1}>
          Siga a incompatibilidade
        </h1>
        <p>
          Compare o que cada pista explica em dois modelos. Duas
          comparações bastam para avançar; as demais continuam abertas.
        </p>
      </header>

      <EvidenceInspector
        clues={clues}
        firstClueId={firstClueId}
        modelFits={modelFits}
        openedClueIds={inspectedClueIds}
        completedComparisons={comparisons}
        onInspect={onInspect}
        onCompare={onCompare}
        onContinue={onContinue}
        disabled={isBusy}
      />
    </article>
  );
}
