"use client";

import Image from "next/image";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  useReducedMotion,
} from "motion/react";
import * as m from "motion/react-m";
import styles from "./cave-prisoner-wall-stage.module.css";

export type CavePrisonerWallBeat = 0 | 1 | 2;

export type CavePrisonerWallStageProps = {
  beat: CavePrisonerWallBeat;
};

export function CavePrisonerWallStage({
  beat,
}: CavePrisonerWallStageProps) {
  const shouldReduceMotion = useReducedMotion();
  const pathProgress = [0.34, 0.7, 1][beat];
  const prisonersVisible = beat >= 1;
  const wallVisible = beat >= 2;

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <div
          className={styles.stage}
          role="img"
          aria-label="Platão conduz o caminho para três pessoas no fundo da caverna, diante de uma parede iluminada"
          data-stage-beat={beat}
        >
          <div className={styles.caveTexture} aria-hidden="true" />

          <svg
            className={styles.stageDrawing}
            viewBox="0 0 1200 760"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="scene-three-entrance">
                <stop offset="0" stopColor="#BDEEFF" stopOpacity="0.88" />
                <stop offset="1" stopColor="#5BB8F5" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="scene-three-wall">
                <stop offset="0" stopColor="#F6C66D" stopOpacity="0.78" />
                <stop offset="1" stopColor="#F6C66D" stopOpacity="0" />
              </radialGradient>
            </defs>

            <path className={styles.archBack} d="M0 0H1200V760H0Z" />
            <path
              className={styles.archMiddle}
              d="M0 0H1200V760H1020C900 635 860 420 925 0H0Z"
            />
            <path
              className={styles.archFront}
              d="M0 0H1200V760H0V0ZM210 760C278 520 430 325 650 270C815 230 986 302 1200 520V760Z"
              fillRule="evenodd"
            />

            <m.ellipse
              className={styles.entranceGlow}
              cx="292"
              cy="378"
              rx="250"
              ry="300"
              animate={{ opacity: beat === 0 ? 0.72 : 0.2 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.55 }}
            />

            {shouldReduceMotion ? (
              <path
                className={styles.inquiryPath}
                d="M850 664C790 610 727 578 693 528C660 480 663 425 633 377"
                pathLength={1}
                strokeDasharray={`${pathProgress} 1`}
                strokeDashoffset={0}
              />
            ) : (
              <m.path
                className={styles.inquiryPath}
                d="M850 664C790 610 727 578 693 528C660 480 663 425 633 377"
                initial={false}
                animate={{ pathLength: pathProgress, opacity: 1 }}
                transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              />
            )}

            <m.ellipse
              className={styles.wallGlow}
              cx="642"
              cy="300"
              rx="210"
              ry="245"
              initial={false}
              animate={{
                opacity: wallVisible ? 0.92 : 0,
                scale: wallVisible ? 1 : 0.9,
              }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.58 }}
            />

            <m.g
              className={styles.prisoners}
              initial={false}
              animate={{
                opacity: prisonersVisible ? 1 : 0.18,
                scale: prisonersVisible ? 1 : 0.96,
              }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
            >
              <circle cx="596" cy="326" r="17" />
              <path d="M574 390C575 348 584 338 596 338C608 338 617 348 618 390Z" />
              <circle cx="640" cy="321" r="17" />
              <path d="M618 388C619 343 628 333 640 333C652 333 661 343 662 388Z" />
              <circle cx="684" cy="329" r="17" />
              <path d="M662 394C663 351 672 341 684 341C696 341 705 351 706 394Z" />
            </m.g>
          </svg>

          <div className={styles.platoGrounding} aria-hidden="true" />
          <Image
            className={styles.plato}
            src="/images/story/plato-v2/plato-descent-v2.png"
            alt=""
            width={1018}
            height={1544}
            sizes="(max-width: 620px) 150px, (max-width: 900px) 220px, 300px"
            priority
          />
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}
