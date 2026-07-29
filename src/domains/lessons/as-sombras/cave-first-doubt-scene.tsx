"use client";

import {
  ArrowRightIcon,
  CheckCircleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PhilooFolioStage } from "../philoo-folio-stage";
import { PhilooStoryShell } from "../philoo-story-shell";
import { PlatoGuide } from "../plato-guide";
import { AS_SOMBRAS_JOURNEY_STAGES } from "./as-sombras-journey";
import styles from "./cave-first-doubt-scene.module.css";

type DoubtBeat = "anomaly" | "turn";

const REFLECTION_OPTIONS = [
  {
    label: "Procuraria outra pista",
    icon: <MagnifyingGlassIcon aria-hidden="true" weight="duotone" />,
  },
  {
    label: "Perguntaria a outra pessoa",
    icon: <UsersThreeIcon aria-hidden="true" weight="duotone" />,
  },
  {
    label: "Continuaria acreditando na parede",
    icon: <EyeIcon aria-hidden="true" weight="duotone" />,
  },
] as const;

const BEAT_META: Record<
  DoubtBeat,
  { eyebrow: string; title: string; context: string }
> = {
  anomaly: {
    eyebrow: "Cena 9 · A primeira dúvida",
    title: "Algo não combina",
    context: "Uma pequena diferença interrompe a certeza da parede.",
  },
  turn: {
    eyebrow: "Cena 9 · Um primeiro movimento",
    title: "A dúvida vira gesto",
    context: "A história termina aqui, no instante anterior a um novo olhar.",
  },
};

export function CaveFirstDoubtScene() {
  const [beat, setBeat] = useState<DoubtBeat>("anomaly");
  const [possibility, setPossibility] = useState("");
  const [completed, setCompleted] = useState(false);
  const turnHeadingRef = useRef<HTMLHeadingElement>(null);
  const completionHeadingRef = useRef<HTMLHeadingElement>(null);
  const meta = BEAT_META[beat];

  useEffect(() => {
    if (completed) {
      completionHeadingRef.current?.focus();
      return;
    }

    if (beat === "turn") {
      turnHeadingRef.current?.focus();
    }
  }, [beat, completed]);

  function sharePossibility() {
    if (!possibility.trim()) return;
    setBeat("turn");
  }

  const reflectionControls = (
    <div className={styles.choices}>
      {REFLECTION_OPTIONS.map((option) => (
        <button
          key={option.label}
          type="button"
          onClick={() => setBeat("turn")}
        >
          <span aria-hidden="true">{option.icon}</span>
          <strong>{option.label}</strong>
        </button>
      ))}

      <div className={styles.otherIdea}>
        <label htmlFor="other-possibility">
          Escreva outra possibilidade
        </label>
        <div>
          <textarea
            id="other-possibility"
            maxLength={180}
            rows={2}
            value={possibility}
            onChange={(event) => setPossibility(event.target.value)}
            placeholder="Eu poderia..."
          />
          <span>{possibility.length}/180</span>
        </div>
        <button
          type="button"
          disabled={!possibility.trim()}
          onClick={sharePossibility}
        >
          Compartilhar ideia
        </button>
      </div>
    </div>
  );

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
        footerLabel={
          completed
            ? "Lição 1 concluída"
            : beat === "turn"
              ? "O primeiro movimento"
              : "A primeira dúvida"
        }
      >
        <section
          className={styles.scene}
          data-beat={beat}
          data-completed={completed ? "true" : "false"}
          aria-labelledby="first-doubt-title"
        >
          {beat === "anomaly" ? (
            <div className={styles.anomalyBeat}>
              <figure className={styles.anomalyFrame}>
                <Image
                  src="/images/story/cave-anomaly-v1.webp"
                  alt="Na parede da caverna, uma sombra aparece diferente das repetições que os prisioneiros aprenderam a prever"
                  fill
                  priority
                  sizes="(max-width: 720px) calc(100vw - 64px), (max-width: 1180px) 55vw, 650px"
                />
                <figcaption>Uma diferença no padrão</figcaption>
              </figure>

              <article className={styles.guideCard}>
                <div className={styles.guideIntro}>
                  <PlatoGuide
                    className={styles.anomalyPlato}
                    pose="first-doubt"
                    sizes="(max-width: 720px) 150px, 220px"
                    priority
                  />
                  <div className={styles.guideCopy}>
                    <p className={styles.speaker}>
                      Platão percebe uma interrupção
                    </p>
                    <h2>Algo não combina com o jogo da parede.</h2>
                    <p>
                      Um dos prisioneiros esperava a sombra de sempre. Mas o
                      contorno chegou diferente. Por um instante, o nome que
                      conhecia já não explicava tudo.
                    </p>
                  </div>
                </div>

                <div className={styles.questionPanel}>
                  <p className={styles.questionKicker}>Agora, pense com ele</p>
                  <p className={styles.inlineQuestion}>
                    Se tudo o que você conhecesse estivesse nesta parede, o que
                    faria você desconfiar dela?
                  </p>
                  {reflectionControls}
                </div>
              </article>
            </div>
          ) : null}

          {beat === "turn" && !completed ? (
            <div className={styles.turnBeat}>
              <article className={styles.turnCopy}>
                <p className={styles.speaker}>Platão acompanha o primeiro gesto</p>
                <h2 ref={turnHeadingRef} tabIndex={-1}>
                  Pela primeira vez, ele tenta se virar.
                </h2>
                <p>
                  A diferença na sombra não lhe deu uma resposta. Deu algo
                  mais importante: uma razão para desconfiar da parede.
                </p>
                <p>
                  Enquanto os outros continuam olhando para a frente, ele
                  move os ombros devagar e decide olhar para trás. Nós paramos
                  exatamente aqui.
                </p>
                <button type="button" onClick={() => setCompleted(true)}>
                  Quero ver além da parede
                  <ArrowRightIcon aria-hidden="true" weight="bold" />
                </button>
              </article>

              <figure className={styles.turnFrame}>
                <Image
                  src="/images/story/cave-first-turn-cliffhanger-v1.png"
                  alt="Um prisioneiro começa a olhar para trás enquanto os outros continuam voltados para a sombra na parede"
                  fill
                  sizes="(max-width: 720px) calc(100vw - 64px), (max-width: 1180px) 52vw, 620px"
                  priority
                />
                <figcaption>O instante em que a dúvida vira movimento</figcaption>
              </figure>
            </div>
          ) : null}

          {completed ? (
            <div className={styles.completion} role="status">
              <span className={styles.completionIcon} aria-hidden="true">
                <CheckCircleIcon weight="duotone" />
              </span>
              <p className={styles.completionKicker}>Primeira parte completa</p>
              <h2 ref={completionHeadingRef} tabIndex={-1}>
                Você concluiu: Dentro da caverna
              </h2>
              <p>A próxima parte começa quando o olhar se vira.</p>
              <ul className={styles.takeaways} aria-label="O que você descobriu">
                <li>A parede mostrava aparências.</li>
                <li>
                  Dóxa é uma crença formada pelo que parece verdadeiro.
                </li>
                <li>Uma dúvida pode iniciar outro modo de olhar.</li>
              </ul>
              <p className={styles.nextChapter}>
                Na próxima: o que acontece quando ele olha para trás?
              </p>
            </div>
          ) : null}
        </section>
      </PhilooFolioStage>
    </PhilooStoryShell>
  );
}
