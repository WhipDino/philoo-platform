import { JarIcon } from "@phosphor-icons/react";
import styles from "./philoo-causal-path-demonstration.module.css";

const DRAG_PATH = "M 61 111 C 109 30, 210 32, 259 105";
const LOOP_DURATION = "3600ms";

export function PhilooCausalPathDemonstration(): React.JSX.Element {
  return (
    <section
      className={styles.demonstration}
      aria-label="Demonstração: o objeto sai da bandeja e chega à posição 2."
    >
      <div
        className={styles.stage}
        data-causal-demonstration-stage
        data-causal-automatic-loop
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
          <defs>
            <mask
              id="causal-progressive-trail-mask"
              x="0"
              y="0"
              width="320"
              height="164"
              maskUnits="userSpaceOnUse"
            >
              <path
                className={styles.trailReveal}
                d={DRAG_PATH}
                pathLength="100"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  dur={LOOP_DURATION}
                  keyTimes="0;0.1;0.68;0.96;1"
                  repeatCount="indefinite"
                  values="100;100;0;0;100"
                />
              </path>
            </mask>
          </defs>

          <path
            className={styles.progressiveTrail}
            data-causal-progressive-trail
            d={DRAG_PATH}
            mask="url(#causal-progressive-trail-mask)"
          />
          <path className={styles.stableTrail} d={DRAG_PATH} />

          <g className={styles.movingPill} data-causal-moving-pill>
            <animateMotion
              calcMode="linear"
              dur={LOOP_DURATION}
              keyPoints="0;0;1;1"
              keyTimes="0;0.1;0.68;1"
              path={DRAG_PATH}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              dur={LOOP_DURATION}
              keyTimes="0;0.08;0.1;0.68;0.72;1"
              repeatCount="indefinite"
              values="0;0;1;1;0;0"
            />
            <rect
              className={styles.proxyBody}
              x="-40"
              y="-23"
              width="80"
              height="46"
              rx="13"
            />
            <JarIcon
              className={styles.proxyIcon}
              x="-32"
              y="-11"
              width="22"
              height="22"
              weight="duotone"
            />
            <text className={styles.proxyLabel} x="-5" y="5">
              Objeto
            </text>
          </g>
        </svg>
      </div>
    </section>
  );
}
