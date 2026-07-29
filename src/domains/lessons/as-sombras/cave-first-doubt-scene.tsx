"use client";

import { ArrowRightIcon, EyeIcon, StarFourIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PhilooFolioStage } from "../philoo-folio-stage";
import { PhilooStoryShell } from "../philoo-story-shell";
import { PlatoGuide } from "../plato-guide";
import { AS_SOMBRAS_JOURNEY_STAGES } from "./as-sombras-journey";
import styles from "./cave-first-doubt-scene.module.css";

type DoubtBeat = "anomaly" | "turn" | "bridge" | "reward";

const BEAT_META: Record<
  DoubtBeat,
  { eyebrow: string; title: string; context: string; footer: string }
> = {
  anomaly: {
    eyebrow: "Cena 9 · A primeira dúvida",
    title: "Algo não combina",
    context: "Uma pequena diferença interrompe a certeza da parede.",
    footer: "A falha no padrão",
  },
  turn: {
    eyebrow: "Cena 9 · O primeiro olhar",
    title: "Ele decide olhar",
    context: "A dúvida deixa de ser apenas um pensamento.",
    footer: "A dúvida vira movimento",
  },
  bridge: {
    eyebrow: "Fim da primeira jornada",
    title: "A passagem está aberta",
    context: "Platão liga a descoberta de hoje ao que vem depois.",
    footer: "A próxima etapa começa aqui",
  },
  reward: {
    eyebrow: "Jornada concluída",
    title: "Sua curiosidade abriu o caminho",
    context: "Você terminou a primeira parte do mito da caverna.",
    footer: "Lição 1 concluída",
  },
};

export function CaveFirstDoubtScene() {
  const [beat, setBeat] = useState<DoubtBeat>("anomaly");
  const turnHeadingRef = useRef<HTMLHeadingElement>(null);
  const bridgeHeadingRef = useRef<HTMLHeadingElement>(null);
  const rewardHeadingRef = useRef<HTMLHeadingElement>(null);
  const meta = BEAT_META[beat];

  useEffect(() => {
    const heading = {
      anomaly: null,
      turn: turnHeadingRef.current,
      bridge: bridgeHeadingRef.current,
      reward: rewardHeadingRef.current,
    }[beat];

    heading?.focus();
  }, [beat]);

  return (
    <PhilooStoryShell
      backHref="/aula/as-sombras/o-que-chegou-ate-eles"
      currentBeat={9}
      totalBeats={10}
      labelledBy="first-doubt-title"
      phase="idle"
      surfaceWidth="narrative"
      surfaceTreatment="folio"
      showSoftFrame={false}
      journey={{
        lessonTitle: "As Sombras",
        currentSceneId: "a-primeira-duvida",
        stages: AS_SOMBRAS_JOURNEY_STAGES,
        storageKey: "philoo:journey:as-sombras",
      }}
    >
      <PhilooFolioStage
        eyebrow={meta.eyebrow}
        title={meta.title}
        titleId="first-doubt-title"
        context={meta.context}
        footerLabel={meta.footer}
      >
        <section
          className={styles.scene}
          data-beat={beat}
          aria-labelledby="first-doubt-title"
        >
          {beat === "anomaly" ? (
            <article className={styles.storyReveal}>
              <div className={styles.storyCaption}>
                <div>
                  <p className={styles.kicker}>Era sempre o mesmo jogo</p>
                  <h2>Até que, um dia, a parede deixou uma pergunta.</h2>
                  <p>
                    Durante muito tempo, o jogo da parede acontecia sempre do
                    mesmo jeito. As sombras passavam, os prisioneiros davam
                    nomes a elas, e quem reconhecia primeiro parecia ser o mais
                    sábio.
                  </p>
                  <p>
                    Então surgiu um contorno diferente. Um dos prisioneiros
                    tentou usar os nomes que já conhecia, mas nenhum explicava
                    completamente o que via. Pela primeira vez, a parede deixou
                    uma pergunta sem resposta.
                  </p>
                </div>
                <button type="button" onClick={() => setBeat("turn")}>
                  Acompanhar a dúvida
                  <ArrowRightIcon aria-hidden="true" weight="bold" />
                </button>
              </div>

              <figure
                className={`${styles.storyFrame} ${styles.anomalyFrame}`}
              >
                <Image
                  src="/images/story/cave-anomaly-v1.webp"
                  alt="Uma sombra inesperada interrompe o padrão que os prisioneiros aprenderam a prever"
                  fill
                  priority
                  sizes="(max-width: 720px) calc(100vw - 48px), (max-width: 1180px) 72vw, 980px"
                />
                <span className={styles.anomalyPulse} aria-hidden="true" />
                <figcaption>Uma diferença no padrão</figcaption>
              </figure>
            </article>
          ) : null}

          {beat === "turn" ? (
            <article className={styles.storyReveal}>
              <div className={styles.storyCaption}>
                <div>
                  <p className={styles.kicker}>A pergunta não desaparece</p>
                  <h2 ref={turnHeadingRef} tabIndex={-1}>
                    Ele decide olhar
                  </h2>
                  <p>
                    Enquanto os outros continuam o jogo, ele percebe que repetir
                    um nome não resolve a diferença. Em vez de fingir que
                    entendeu, reúne coragem, move os ombros devagar e começa a
                    olhar para trás.
                  </p>
                </div>
                <button type="button" onClick={() => setBeat("bridge")}>
                  Ver o que existe atrás
                  <ArrowRightIcon aria-hidden="true" weight="bold" />
                </button>
              </div>

              <figure className={`${styles.storyFrame} ${styles.turnFrame}`}>
                <Image
                  src="/images/story/cave-first-turn-cliffhanger-v1.png"
                  alt="Um prisioneiro começa a olhar para trás enquanto os outros continuam voltados para a parede"
                  fill
                  priority
                  sizes="(max-width: 720px) calc(100vw - 48px), (max-width: 1180px) 72vw, 980px"
                />
                <span className={styles.turnArc} aria-hidden="true">
                  <EyeIcon weight="duotone" />
                </span>
                <figcaption>A dúvida virou movimento</figcaption>
              </figure>
            </article>
          ) : null}

          {beat === "bridge" ? (
            <article className={styles.bridge}>
              <div className={styles.bridgeGuide}>
                <PlatoGuide
                  className={styles.bridgePlato}
                  pose="first-doubt"
                  sizes="(max-width: 720px) 210px, 340px"
                  priority
                />
              </div>
              <div className={styles.bridgeCopy}>
                <p className={styles.kicker}>Platão prepara o próximo passo</p>
                <h2 ref={bridgeHeadingRef} tabIndex={-1}>
                  A primeira dúvida abriu uma passagem.
                </h2>
                <p>
                  Até aqui, conhecemos o mundo como os prisioneiros o
                  conheciam: pela parede. Na próxima etapa, ele verá aquilo que
                  sempre esteve atrás da parede.
                </p>
                <p className={styles.bridgeQuestion}>
                  O que acontece quando uma certeza precisa virar o rosto?
                </p>
                <button type="button" onClick={() => setBeat("reward")}>
                  Concluir As Sombras
                  <ArrowRightIcon aria-hidden="true" weight="bold" />
                </button>
              </div>
            </article>
          ) : null}

          {beat === "reward" ? (
            <article className={styles.reward} role="status">
              <div className={styles.rewardSeal} aria-hidden="true">
                <EyeIcon weight="duotone" />
                <StarFourIcon weight="fill" />
              </div>
              <p className={styles.rewardPoints}>+100 pontos de descoberta</p>
              <h2 ref={rewardHeadingRef} tabIndex={-1}>
                Você conquistou o Olhar curioso
              </h2>
              <p className={styles.badgeName}>Olhar curioso</p>

              <ul className={styles.takeaways} aria-label="Suas descobertas">
                <li>Aparência não é o mesmo que origem.</li>
                <li>Uma dúvida pode iniciar uma investigação.</li>
                <li>Procurar novas pistas amplia aquilo que sabemos.</li>
              </ul>

              <div className={styles.unlocked}>
                <span aria-hidden="true">
                  <StarFourIcon weight="fill" />
                </span>
                <div>
                  <strong>Próxima etapa desbloqueada</strong>
                  <p>O que acontece quando ele olha para trás?</p>
                </div>
              </div>
            </article>
          ) : null}
        </section>
      </PhilooFolioStage>
    </PhilooStoryShell>
  );
}
