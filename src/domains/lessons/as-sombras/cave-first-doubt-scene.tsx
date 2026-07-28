"use client";

import {
  ArrowRightIcon,
  CheckCircleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  QuestionIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PhilooFolioStage } from "../philoo-folio-stage";
import { PhilooStoryShell } from "../philoo-story-shell";
import { PlatoGuide } from "../plato-guide";
import { AS_SOMBRAS_JOURNEY_STAGES } from "./as-sombras-journey";
import styles from "./cave-first-doubt-scene.module.css";

type DoubtBeat = "anomaly" | "reflection" | "turn";
type ReflectionChoice =
  | "Procuraria outra pista"
  | "Perguntaria a outra pessoa"
  | "Continuaria acreditando na parede"
  | "Outra possibilidade";

const REFLECTION_OPTIONS = [
  {
    label: "Procuraria outra pista",
    icon: <MagnifyingGlassIcon aria-hidden="true" weight="duotone" />,
    response:
      "Duvidar não encerra a investigação. Às vezes, é assim que uma busca mais cuidadosa começa.",
  },
  {
    label: "Perguntaria a outra pessoa",
    icon: <UsersThreeIcon aria-hidden="true" weight="duotone" />,
    response:
      "Uma pergunta compartilhada pode abrir outra direção. Pensar também é comparar pontos de vista.",
  },
  {
    label: "Continuaria acreditando na parede",
    icon: <EyeIcon aria-hidden="true" weight="duotone" />,
    response:
      "Confiar no que conhecemos é compreensível. Uma dúvida pode esperar até aparecer uma pista mais forte.",
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
  reflection: {
    eyebrow: "Cena 9 · Sua vez de pensar",
    title: "O que você faria?",
    context: "Não existe resposta punida: cada escolha abre uma investigação.",
  },
  turn: {
    eyebrow: "Cena 9 · Um primeiro movimento",
    title: "A dúvida vira gesto",
    context: "A história termina aqui, no instante anterior a um novo olhar.",
  },
};

export function CaveFirstDoubtScene() {
  const [beat, setBeat] = useState<DoubtBeat>("anomaly");
  const [choice, setChoice] = useState<ReflectionChoice | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [possibility, setPossibility] = useState("");
  const [completed, setCompleted] = useState(false);
  const responseHeadingRef = useRef<HTMLHeadingElement>(null);
  const turnHeadingRef = useRef<HTMLHeadingElement>(null);
  const completionHeadingRef = useRef<HTMLHeadingElement>(null);
  const meta = BEAT_META[beat];

  useEffect(() => {
    if (completed) {
      completionHeadingRef.current?.focus();
      return;
    }

    if (beat === "reflection" && response) {
      responseHeadingRef.current?.focus();
      return;
    }

    if (beat === "turn") {
      turnHeadingRef.current?.focus();
    }
  }, [beat, completed, response]);

  function chooseReflection(
    nextChoice: Exclude<ReflectionChoice, "Outra possibilidade">,
    nextResponse: string,
  ) {
    setChoice(nextChoice);
    setResponse(nextResponse);
    setBeat("reflection");
  }

  function sharePossibility() {
    if (!possibility.trim()) return;
    setChoice("Outra possibilidade");
    setResponse(
      "Sua possibilidade cria um novo caminho para investigar. Uma ideia própria também pode virar uma pergunta.",
    );
    setBeat("reflection");
  }

  const reflectionControls = (
    <div className={styles.choices}>
      {REFLECTION_OPTIONS.map((option) => (
        <button
          key={option.label}
          type="button"
          aria-pressed={choice === option.label}
          onClick={() => chooseReflection(option.label, option.response)}
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
                <PlatoGuide
                  className={styles.anomalyPlato}
                  pose="first-doubt"
                  sizes="(max-width: 720px) 150px, 260px"
                  priority
                />
                <div className={styles.guideCopy}>
                  <p className={styles.speaker}>Platão percebe uma interrupção</p>
                  <h2>Algo não combina com o jogo da parede.</h2>
                  <p>
                    Um dos prisioneiros esperava a sombra de sempre. Mas o
                    contorno chegou diferente — e, por um instante, o nome que
                    ele conhecia já não explica tudo.
                  </p>
                  <p className={styles.inlineQuestion}>
                    Se tudo o que você conhecesse estivesse nesta parede, o que
                    faria você desconfiar dela?
                  </p>
                  {reflectionControls}
                </div>
              </article>
            </div>
          ) : null}

          {beat === "reflection" ? (
            <div className={styles.reflectionBeat}>
              <header className={styles.reflectionIntro}>
                <span className={styles.questionIcon} aria-hidden="true">
                  <QuestionIcon weight="duotone" />
                </span>
                <div>
                  <p className={styles.speaker}>Pare um instante</p>
                  <h2>
                    Se tudo o que você conhecesse estivesse nesta parede, o que
                    faria você desconfiar dela?
                  </h2>
                </div>
              </header>

              <div className={styles.reflectionGrid}>
                {reflectionControls}

                <aside
                  className={styles.responseCard}
                  data-has-response={response ? "true" : "false"}
                  aria-live="polite"
                >
                  <PlatoGuide
                    className={styles.responsePlato}
                    pose="first-doubt"
                    sizes="(max-width: 720px) 130px, 220px"
                  />
                  <div>
                    <h3
                      ref={responseHeadingRef}
                      className={styles.speaker}
                      tabIndex={-1}
                    >
                      Platão pensa com você
                    </h3>
                    {response ? (
                      <>
                        <p className={styles.response}>{response}</p>
                        <button type="button" onClick={() => setBeat("turn")}>
                          Continuar
                          <ArrowRightIcon aria-hidden="true" weight="bold" />
                        </button>
                      </>
                    ) : (
                      <p className={styles.responsePrompt}>
                        Escolha uma possibilidade. Aqui, responder é começar a
                        pensar — não disputar pontos.
                      </p>
                    )}
                  </div>
                </aside>
              </div>
            </div>
          ) : null}

          {beat === "turn" && !completed ? (
            <div className={styles.turnBeat}>
              <article className={styles.turnCopy}>
                <p className={styles.speaker}>A história muda de direção</p>
                <h2 ref={turnHeadingRef} tabIndex={-1}>
                  Pela primeira vez, ele tenta se virar.
                </h2>
                <p>
                  A dúvida ainda não mostra uma resposta. Ela faz algo menor —
                  e decisivo: interrompe o costume de olhar somente para a
                  parede.
                </p>
                <p>
                  O prisioneiro move os ombros devagar. Nós paramos exatamente
                  aqui, antes que ele descubra o que existe atrás.
                </p>
                <button type="button" onClick={() => setCompleted(true)}>
                  Quero ver além da parede
                  <ArrowRightIcon aria-hidden="true" weight="bold" />
                </button>
              </article>

              <div className={styles.turnGuide}>
                <span className={styles.turnHalo} aria-hidden="true" />
                <PlatoGuide
                  className={styles.turnPlato}
                  pose="invite-turn"
                  sizes="(max-width: 720px) 210px, 390px"
                  priority
                />
              </div>
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
              <div className={styles.completionThought}>
                <QuestionIcon aria-hidden="true" weight="duotone" />
                <span>
                  Você acompanhou como uma aparência pode virar certeza — e
                  como uma diferença pode inaugurar uma pergunta.
                </span>
              </div>
            </div>
          ) : null}
        </section>
      </PhilooFolioStage>
    </PhilooStoryShell>
  );
}
