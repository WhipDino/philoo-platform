"use client";

import { CursorClickIcon, JarIcon } from "@phosphor-icons/react";
import { useState } from "react";
import styles from "./philoo-causal-path-demonstration.module.css";

const DRAG_PATH = "M 61 111 C 109 30, 210 32, 259 105";

export function PhilooCausalPathDemonstration(): React.JSX.Element {
  const [run, setRun] = useState(0);

  return (
    <section
      className={styles.demonstration}
      aria-label="Demonstração: o objeto sai da bandeja e chega à posição 2."
    >
      <div
        key={run}
        className={styles.stage}
        data-causal-demonstration-stage
        data-run={run}
        aria-hidden="true"
      >
        <div className={styles.tray}>
          <span className={styles.trayLabel}>Bandeja</span>
          <div className={styles.trayPiece}>
            <JarIcon weight="duotone" />
            <span>Objeto</span>
          </div>
        </div>

        <div className={styles.destination}>
          <span
            className={styles.positionLabel}
            data-causal-destination-label
          >
            Posição 2
          </span>
          <div className={styles.destinationObject}>
            <JarIcon weight="duotone" />
            <span>Objeto</span>
          </div>
        </div>

        <svg
          className={styles.motionLayer}
          viewBox="0 0 320 164"
          preserveAspectRatio="none"
        >
          <path
            className={styles.dragPath}
            data-causal-drag-path
            d={DRAG_PATH}
          />
          <g className={styles.dragProxy} data-causal-drag-proxy>
            <animateMotion
              calcMode="linear"
              dur="1800ms"
              fill="freeze"
              keyPoints="0;0;1;1"
              keyTimes="0;0.28;0.86;1"
              path={DRAG_PATH}
            />
            <animate
              attributeName="opacity"
              dur="1800ms"
              fill="freeze"
              keyTimes="0;0.2;0.3;0.86;1"
              values="0;0;1;1;0"
            />
            <rect
              className={styles.proxyBody}
              x="-34"
              y="-21"
              width="68"
              height="42"
              rx="11"
            />
            <JarIcon
              className={styles.proxyIcon}
              x="-27"
              y="-11"
              width="20"
              height="20"
              weight="duotone"
            />
            <text className={styles.proxyLabel} x="-3" y="5">
              Objeto
            </text>
          </g>
          <CursorClickIcon
            className={styles.cursor}
            data-causal-cursor-press
            x="-14"
            y="-20"
            width="29"
            height="29"
            weight="fill"
          >
            <animateMotion
              calcMode="linear"
              dur="1800ms"
              fill="freeze"
              keyPoints="0;0;1;1"
              keyTimes="0;0.28;0.86;1"
              path={DRAG_PATH}
            />
            <animate
              attributeName="opacity"
              dur="1800ms"
              fill="freeze"
              keyTimes="0;0.08;0.92;1"
              values="0;1;1;0"
            />
            <animateTransform
              additive="sum"
              attributeName="transform"
              dur="1800ms"
              fill="freeze"
              keyTimes="0;0.14;0.22;0.32;0.86;1"
              type="translate"
              values="0 0;0 0;4 8;-2 -13;0 0;0 0"
            />
            <animateTransform
              additive="sum"
              attributeName="transform"
              dur="1800ms"
              fill="freeze"
              keyTimes="0;0.14;0.22;0.32;0.86;1"
              type="scale"
              values="1 1;1 1;0.84 0.84;1.08 1.08;1 1;1 1"
            />
          </CursorClickIcon>
        </svg>
      </div>

      <button
        className={styles.replay}
        type="button"
        onClick={() => setRun((currentRun) => currentRun + 1)}
      >
        Ver novamente
      </button>
    </section>
  );
}
