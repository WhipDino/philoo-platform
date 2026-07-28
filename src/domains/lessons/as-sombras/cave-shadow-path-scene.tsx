"use client";

import {
  ArrowRightIcon,
  ChatTextIcon,
  FireIcon,
  JarIcon,
  QuestionIcon,
  SelectionBackgroundIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { PhilooFolioStage } from "../philoo-folio-stage";
import { PhilooStoryShell } from "../philoo-story-shell";
import { PhilooActivityBriefing } from "../interactions/philoo-activity-briefing";
import {
  PhilooCausalPath,
  type CausalPathItem,
} from "../interactions/philoo-causal-path";
import { AS_SOMBRAS_JOURNEY_STAGES } from "./as-sombras-journey";
import styles from "./cave-shadow-path-scene.module.css";

const PATH_ITEMS = [
  {
    id: "light",
    label: "Luz",
    explanation: "A fogueira ilumina.",
    icon: <FireIcon weight="duotone" />,
  },
  {
    id: "object",
    label: "Objeto",
    explanation: "Algo bloqueia parte da luz.",
    icon: <JarIcon weight="duotone" />,
  },
  {
    id: "shadow",
    label: "Sombra",
    explanation: "A forma aparece na parede.",
    icon: <SelectionBackgroundIcon weight="duotone" />,
  },
  {
    id: "name",
    label: "Nome",
    explanation: "Os prisioneiros interpretam a forma.",
    icon: <ChatTextIcon weight="duotone" />,
  },
] as const satisfies readonly CausalPathItem[];

const CORRECT_ORDER = ["light", "object", "shadow", "name"] as const;

function subscribeToClient() {
  return () => {};
}

export function CaveShadowPathScene() {
  const canRenderBriefing = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );
  const [briefingOpen, setBriefingOpen] = useState(true);
  const [complete, setComplete] = useState(false);
  const pathBoardRef = useRef<HTMLDivElement>(null);
  const focusActivityAfterClose = useRef(false);
  const hasDismissedBriefing = useRef(false);

  useEffect(() => {
    if (!briefingOpen && focusActivityAfterClose.current) {
      focusActivityAfterClose.current = false;
      pathBoardRef.current
        ?.querySelector<HTMLButtonElement>("[data-causal-piece]")
        ?.focus();
    }
  }, [briefingOpen]);

  function closeBriefing() {
    if (!hasDismissedBriefing.current) {
      hasDismissedBriefing.current = true;
      focusActivityAfterClose.current = true;
    }

    setBriefingOpen(false);
  }

  return (
    <>
      <PhilooStoryShell
        backHref="/aula/as-sombras/o-que-existe-atras"
        currentBeat={7}
        totalBeats={10}
        labelledBy="shadow-path-title"
        phase="idle"
        surfaceWidth="narrative"
        surfaceTreatment="folio"
        showSoftFrame={false}
        journey={{
          lessonTitle: "As Sombras",
          currentSceneId: "caminho-da-sombra",
          stages: AS_SOMBRAS_JOURNEY_STAGES,
          storageKey: "philoo:journey:as-sombras",
        }}
      >
        <PhilooFolioStage
          eyebrow="Cena 7 · Causa e aparência"
          title="O caminho da sombra"
          titleId="shadow-path-title"
          context="Ligue o que acontece atrás deles ao nome que chega à parede."
          action={
            complete ? (
              <Link href="/aula/as-sombras/doxa">
                Conhecer a dóxa <span aria-hidden="true">→</span>
              </Link>
            ) : undefined
          }
          footerLabel="Da causa ao nome"
        >
          <section
            className={styles.scene}
            aria-labelledby="shadow-path-title"
          >
            <div className={styles.activityHeading}>
              <p>
                <strong>A luz já começou.</strong>
                <span>Complete as três relações que faltam.</span>
              </p>
              <button
                type="button"
                className={styles.helpButton}
                onClick={() => setBriefingOpen(true)}
              >
                <QuestionIcon aria-hidden="true" weight="bold" />
                Como jogar
              </button>
            </div>

            <div className={styles.workspace}>
              <div className={styles.pathBoard} ref={pathBoardRef}>
                <PhilooCausalPath
                  items={PATH_ITEMS}
                  correctOrder={CORRECT_ORDER}
                  demonstratedItemId="light"
                  onComplete={() => setComplete(true)}
                />
              </div>
            </div>
          </section>
        </PhilooFolioStage>
      </PhilooStoryShell>

      {canRenderBriefing ? (
        <PhilooActivityBriefing
          open={briefingOpen}
          title="Monte o caminho da sombra"
          purpose="Descubra como uma coisa que ninguém vê termina virando um nome na parede."
          steps={[
            "Escolha uma peça.",
            "Coloque-a na próxima parte do caminho.",
          ]}
          startLabel="Vamos montar"
          guidePose="causal-path"
          demonstration={
            <div
              className={styles.demonstration}
              data-causal-demonstration
              aria-label="Demonstração: a luz já ocupa a primeira posição"
            >
              <span className={styles.demoLight}>
                <FireIcon aria-hidden="true" weight="duotone" />
                Luz
              </span>
              <ArrowRightIcon aria-hidden="true" weight="bold" />
              <span>A primeira posição já está pronta</span>
            </div>
          }
          onClose={closeBriefing}
        />
      ) : null}
    </>
  );
}
