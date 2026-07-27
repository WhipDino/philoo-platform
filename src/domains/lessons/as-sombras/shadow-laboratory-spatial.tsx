"use client";

import {
  PIECE_DEFINITIONS,
  SLOT_DEFINITIONS,
  pieceName,
  type LaboratoryPieceId,
  type LaboratorySlotId,
  type ShadowLaboratoryState,
} from "./shadow-laboratory-state";
import styles from "./shadow-laboratory.module.css";

export interface SpatialWorkbenchProps {
  readonly state: ShadowLaboratoryState;
  readonly isBusy: boolean;
  readonly onSelectPiece: (piece: LaboratoryPieceId) => void;
  readonly onPlace: (slot: LaboratorySlotId) => void;
  readonly onMoveCarrier: (difference: number) => void;
  readonly onMoveArtifact: (difference: number) => void;
  readonly onRun: () => void;
}

export function SpatialWorkbench({
  state,
  isBusy,
  onSelectPiece,
  onPlace,
  onMoveCarrier,
  onMoveArtifact,
  onRun,
}: SpatialWorkbenchProps) {
  const artifactX = 100 + state.artifactPosition * 56;
  const carrierX = 100 + state.carrierPosition * 56;

  return (
    <section
      className={styles.spatialWorkbench}
      aria-labelledby="spatial-workbench-title"
    >
      <div className={styles.workbenchHeading}>
        <p className={styles.eyebrow}>Modo espacial · selecione e coloque</p>
        <h2 id="spatial-workbench-title">Monte a passagem escondida</h2>
        <p>
          Escolha uma peça e use um lugar nomeado. Você pode substituir
          qualquer escolha; arranjos incompletos também podem ser testados.
        </p>
      </div>

      <div
        className={styles.pieceInventory}
        role="group"
        aria-label="Peças do laboratório"
      >
        {PIECE_DEFINITIONS.map((piece) => (
          <button
            key={piece.id}
            type="button"
            aria-pressed={state.selectedPiece === piece.id}
            onClick={() => onSelectPiece(piece.id)}
            disabled={isBusy}
          >
            <span aria-hidden="true">{piece.shortName.slice(0, 1)}</span>
            Selecionar {piece.name}
          </button>
        ))}
      </div>

      <div
        className={styles.slotRail}
        role="group"
        aria-label="Lugares do laboratório"
      >
        {SLOT_DEFINITIONS.map((slot) => (
          <div
            className={styles.namedSlot}
            data-filled={state.slots[slot.id] ? "true" : "false"}
            key={slot.id}
          >
            <span>
              Lugar de {slot.name}
              <small>{slot.position}</small>
            </span>
            <strong>{pieceName(state.slots[slot.id])}</strong>
            <button
              type="button"
              onClick={() => onPlace(slot.id)}
              disabled={!state.selectedPiece || isBusy}
              aria-label={`Colocar seleção no lugar de ${slot.name}`}
            >
              Colocar aqui
            </button>
          </div>
        ))}
      </div>

      <div className={styles.causalStage}>
        <svg
          viewBox="0 0 720 240"
          aria-hidden="true"
          focusable="false"
          data-light-rays
        >
          <defs>
            <linearGradient id="laboratory-ray" x1="0" x2="1">
              <stop offset="0" stopColor="#f2b84b" stopOpacity="0.94" />
              <stop offset="1" stopColor="#f4f0e8" stopOpacity="0.18" />
            </linearGradient>
          </defs>
          <g className={styles.lightRays}>
            <path d={`M86 119 L${artifactX} 67 L660 30`} />
            <path d={`M86 121 L${artifactX} 173 L660 210`} />
          </g>
          {state.slots.fire === "fire" ? (
            <g className={styles.fireMark} transform="translate(86 120)">
              <path d="M0 24C-26 8-8-12 1-29c4 13 24 24 9 41 18-9 23 17-10 12Z" />
            </g>
          ) : null}
          {state.slots.artifact === "bird_artifact" ? (
            <g
              className={styles.artifactMark}
              transform={`translate(${artifactX} 120)`}
            >
              <path d="M-30 0c18-23 34-25 45-11C26-25 42-23 60 0 39-8 28-4 15 14 2-4-9-8-30 0Z" />
              <path d="M12-8h7v49h-7z" />
            </g>
          ) : null}
          {state.slots.carrier === "human_carrier" ? (
            <g
              className={styles.carrierMark}
              transform={`translate(${carrierX} 128)`}
            >
              <circle cx="0" cy="-35" r="11" />
              <path d="M-7-22h14l10 43H6l-3 45h-9l-2-45h-11Z" />
            </g>
          ) : null}
          {state.slots.wall === "wall" ? (
            <path className={styles.wallMark} d="M660 17v206" />
          ) : null}
          {state.slots.prisoner === "prisoner" ? (
            <g className={styles.prisonerMark} transform="translate(612 156)">
              <circle cx="0" cy="-28" r="10" />
              <path d="M-8-17H7l8 54h-28Z" />
            </g>
          ) : null}
          {state.lastRunResult === "projection_created" ? (
            <path
              className={styles.projectionMark}
              d="M660 62c-30 25-50 32-67 12-17 20-37 13-67-12 28 9 47 2 67-26 20 28 39 35 67 26Z"
            />
          ) : null}
        </svg>

        <div className={styles.positionControls}>
          <div>
            <span>Carregador · posição {state.carrierPosition}</span>
            <button
              type="button"
              onClick={() => onMoveCarrier(-1)}
              disabled={state.carrierPosition <= 1 || isBusy}
            >
              Mover para a esquerda
            </button>
            <button
              type="button"
              onClick={() => onMoveCarrier(1)}
              disabled={state.carrierPosition >= 8 || isBusy}
            >
              Mover para a direita
            </button>
          </div>
          <div>
            <span>Artefato · distância {state.artifactPosition}</span>
            <button
              type="button"
              onClick={() => onMoveArtifact(-1)}
              disabled={state.artifactPosition <= 1 || isBusy}
            >
              Aproximar da luz
            </button>
            <button
              type="button"
              onClick={() => onMoveArtifact(1)}
              disabled={state.artifactPosition >= 8 || isBusy}
            >
              Afastar da luz
            </button>
          </div>
        </div>
      </div>

      <button
        className={styles.runModelAction}
        type="button"
        onClick={onRun}
        disabled={isBusy}
      >
        Executar arranjo
      </button>
    </section>
  );
}
