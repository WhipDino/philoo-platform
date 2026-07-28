"use client";

import { CursorClickIcon, JarIcon } from "@phosphor-icons/react";
import { useState } from "react";
import styles from "./philoo-causal-path-demonstration.module.css";

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

        <div className={styles.guide} />

        <div className={styles.destination}>
          <span className={styles.positionLabel}>Posição 2</span>
          <div className={styles.destinationObject}>
            <JarIcon weight="duotone" />
            <span>Objeto</span>
          </div>
        </div>

        <div className={styles.movingObject}>
          <JarIcon weight="duotone" />
          <span>Objeto</span>
        </div>
        <CursorClickIcon className={styles.cursor} weight="fill" />
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
