import {
  confidenceLabel,
  isConfidenceLevel,
  type ConfidenceLevel,
} from "./confidence-control";

export type CerMove =
  | "claim"
  | "clue"
  | "bridge"
  | "acknowledgment"
  | "confidence";

export interface CerChoice {
  readonly value: string;
  readonly label: string;
}

export interface CerClaimChoice extends CerChoice {
  readonly requiresNextEvidence?: boolean;
}

export interface CerBridgeChoice extends CerChoice {
  readonly validClaims: readonly string[];
  readonly validClues: readonly string[];
}

export interface CerResponseConfig {
  readonly claims: readonly CerClaimChoice[];
  readonly clues: readonly CerChoice[];
  readonly bridges: readonly CerBridgeChoice[];
  readonly acknowledgments: readonly CerChoice[];
  readonly nextEvidence: readonly CerChoice[];
}

export interface CerResponseValue {
  readonly claim?: string;
  readonly nextEvidence?: string | null;
  readonly clue?: string;
  readonly bridge?: string;
  readonly acknowledgment?: string;
  readonly confidence?: ConfidenceLevel;
  readonly order?: readonly CerMove[];
  readonly reviewed?: boolean;
  readonly coherent?: boolean;
}

export interface CerReview extends CerResponseValue {
  readonly claim: string;
  readonly clue: string;
  readonly bridge: string;
  readonly acknowledgment: string;
  readonly confidence: ConfidenceLevel;
  readonly order: readonly CerMove[];
  readonly reviewed: true;
  readonly coherent: boolean;
}

export const cerMoveOrder: readonly CerMove[] = [
  "claim",
  "clue",
  "bridge",
  "acknowledgment",
  "confidence",
];

export const cerMoveNames: Readonly<Record<CerMove, string>> = {
  claim: "afirmação",
  clue: "pista",
  bridge: "ligação",
  acknowledgment: "reconhecimento",
  confidence: "confiança",
};

function isRecord(
  value: unknown,
): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function allowedValue(
  value: unknown,
  choices: readonly CerChoice[],
): string | undefined {
  return typeof value === "string" &&
    choices.some((choice) => choice.value === value)
    ? value
    : undefined;
}

function sanitizeOrder(value: unknown): readonly CerMove[] {
  if (!Array.isArray(value)) {
    return cerMoveOrder;
  }

  const moves = value.filter(
    (move): move is CerMove =>
      typeof move === "string" &&
      cerMoveOrder.includes(move as CerMove),
  );
  return moves.length === cerMoveOrder.length &&
    new Set(moves).size === cerMoveOrder.length
    ? moves
    : cerMoveOrder;
}

export function sanitizeCerResponse(
  value: unknown,
  config: CerResponseConfig,
): CerResponseValue {
  if (!isRecord(value)) {
    return { order: cerMoveOrder };
  }

  const claim = allowedValue(value.claim, config.claims);
  const nextEvidence = allowedValue(
    value.nextEvidence,
    config.nextEvidence,
  );
  const clue = allowedValue(value.clue, config.clues);
  const bridge = allowedValue(value.bridge, config.bridges);
  const acknowledgment = allowedValue(
    value.acknowledgment,
    config.acknowledgments,
  );
  const confidence = isConfidenceLevel(value.confidence)
    ? value.confidence
    : undefined;
  const reviewed =
    value.reviewed === true &&
    typeof value.coherent === "boolean";

  return {
    ...(claim ? { claim } : {}),
    ...(nextEvidence ? { nextEvidence } : {}),
    ...(clue ? { clue } : {}),
    ...(bridge ? { bridge } : {}),
    ...(acknowledgment ? { acknowledgment } : {}),
    ...(confidence ? { confidence } : {}),
    order: sanitizeOrder(value.order),
    ...(reviewed
      ? {
          reviewed: true,
          coherent: value.coherent as boolean,
        }
      : {}),
  };
}

export function isCerResponseBuilt(
  value: CerResponseValue,
  config: CerResponseConfig,
): value is CerReview {
  const claim = config.claims.find(
    (choice) => choice.value === value.claim,
  );
  return Boolean(
    claim &&
      value.clue &&
      value.bridge &&
      value.acknowledgment &&
      value.confidence &&
      (!claim.requiresNextEvidence || value.nextEvidence),
  );
}

export function isCerResponseCoherent(
  value: CerResponseValue,
  config: CerResponseConfig,
): boolean {
  if (!isCerResponseBuilt(value, config)) {
    return false;
  }
  const bridge = config.bridges.find(
    (choice) => choice.value === value.bridge,
  );
  return Boolean(
    bridge?.validClaims.includes(value.claim) &&
      bridge.validClues.includes(value.clue),
  );
}

function labelFor(
  value: string | undefined,
  choices: readonly CerChoice[],
): string | null {
  return (
    choices.find((choice) => choice.value === value)?.label ?? null
  );
}

function stripFinalPunctuation(value: string): string {
  return value.replace(/[.!?;:,]+$/u, "");
}

export function assembleCerSentence(
  value: CerResponseValue,
  config: CerResponseConfig,
): string {
  const clauses: Partial<Record<CerMove, string>> = {};
  const claim = labelFor(value.claim, config.claims);
  const clue = labelFor(value.clue, config.clues);
  const bridge = labelFor(value.bridge, config.bridges);
  const acknowledgment = labelFor(
    value.acknowledgment,
    config.acknowledgments,
  );

  if (claim) {
    const nextEvidence = labelFor(
      value.nextEvidence ?? undefined,
      config.nextEvidence,
    );
    clauses.claim = `Minha afirmação: ${stripFinalPunctuation(claim)}${
      nextEvidence
        ? `; para decidir, eu buscaria ${stripFinalPunctuation(nextEvidence)}`
        : ""
    }`;
  }
  if (clue) {
    clauses.clue = `Minha pista: ${stripFinalPunctuation(clue)}`;
  }
  if (bridge) {
    clauses.bridge = `Minha ligação: ${stripFinalPunctuation(bridge)}`;
  }
  if (acknowledgment) {
    clauses.acknowledgment = `Ainda reconheço: ${stripFinalPunctuation(
      acknowledgment,
    )}`;
  }
  if (value.confidence) {
    clauses.confidence = `Minha confiança é ${confidenceLabel(
      value.confidence,
    ).toLowerCase()}`;
  }

  const order = value.order ?? cerMoveOrder;
  const assembled = order
    .map((move) => clauses[move])
    .filter((clause): clause is string => Boolean(clause));
  return assembled.length > 0
    ? `${assembled.join("; ")}.`
    : "Sua resposta aparece aqui enquanto você escolhe os movimentos.";
}
