"use client";

import {
  ArrowRightIcon,
  CheckCircleIcon,
  EyeIcon,
  FireIcon,
  LightbulbIcon,
  MoonStarsIcon,
  RepeatIcon,
  SparkleIcon,
  SunIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import { PhilooFolioStage, PhilooFolioVoice } from "../philoo-folio-stage";
import { PhilooNarrativeComposition } from "../philoo-narrative-composition";
import { PlatoGuide } from "../plato-guide";
import type { PlatoPoseKey } from "../plato-pose-catalog";
import { PhilooStoryShell } from "../philoo-story-shell";
import { A_SUBIDA_ASSETS } from "./a-subida-assets";
import { A_SUBIDA_SCENE_META } from "./a-subida-content";
import {
  A_SUBIDA_JOURNEY_STAGES,
  type ASubidaSceneId,
} from "./a-subida-journey";
import styles from "./a-subida-scene.module.css";

type ASubidaSceneProps = {
  sceneId: ASubidaSceneId;
};

export function ASubidaScene({ sceneId }: ASubidaSceneProps) {
  const meta = A_SUBIDA_SCENE_META[sceneId];

  return (
    <PhilooStoryShell
      className={styles.nunitoLesson}
      backHref={meta.previousHref}
      currentBeat={
        A_SUBIDA_JOURNEY_STAGES.findIndex((stage) =>
          stage.sceneIds.some((id) => id === sceneId),
        ) + 1
      }
      totalBeats={A_SUBIDA_JOURNEY_STAGES.length}
      labelledBy="a-subida-title"
      phase="idle"
      surfaceWidth="narrative"
      surfaceTreatment="folio"
      showSoftFrame={false}
      journey={{
        lessonTitle: "A Subida",
        currentSceneId: sceneId,
        stages: A_SUBIDA_JOURNEY_STAGES,
        storageKey: "philoo:journey:a-subida",
      }}
    >
      <PhilooFolioStage
        eyebrow={meta.eyebrow}
        title={meta.title}
        titleId="a-subida-title"
        context={meta.context}
        footerLabel={meta.footer}
        action={
          meta.nextHref ? (
            <Link className={styles.primaryAction} href={meta.nextHref}>
              {meta.nextLabel}
              <ArrowRightIcon aria-hidden="true" weight="bold" />
            </Link>
          ) : undefined
        }
      >
        <section className={styles.scene} data-scene={sceneId}>
          {sceneId === "primeiro-olhar" ? <ChapterRecapScene /> : null}
          {sceneId === "o-primeiro-movimento" ? <FirstMovementScene /> : null}
          {sceneId === "o-fogo" ? <MechanismScene /> : null}
          {sceneId === "duas-explicacoes" ? <ModelTestExercise /> : null}
          {sceneId === "a-subida-doi" ? <AscentScene /> : null}
          {sceneId === "ate-onde-posso-afirmar" ? (
            <EvidenceHorizonExercise />
          ) : null}
          {sceneId === "periagoge" ? <PeriagogeScene /> : null}
          {sceneId === "aprender-a-ver" ? <AdaptationScene /> : null}
          {sceneId === "revisar-o-mundo" ? <RevisionExercise /> : null}
          {sceneId === "a-decisao" ? <DecisionScene /> : null}
        </section>
      </PhilooFolioStage>
    </PhilooStoryShell>
  );
}

function ChapterRecapScene() {
  return (
    <PhilooNarrativeComposition
      className={styles.briefingComposition}
      guideSide="start"
      dialogue={
        <PhilooFolioVoice speaker="Platão" className={styles.briefingVoice}>
          <span className={styles.briefingKicker}>No capítulo anterior</span>
          <h2 className={styles.briefingTitle}>
            Um prisioneiro começou a desconfiar das sombras.
          </h2>
          <p className={styles.briefingLead}>
            Durante toda a vida, a parede foi o mundo que ele conheceu.
          </p>
          <p className={styles.briefingClose}>
            Então uma sombra falhou. Pela primeira vez, ele decidiu virar o
            corpo e procurar de onde ela vinha.
          </p>
        </PhilooFolioVoice>
      }
      guide={
        <PlatoGuide
          pose="reveal-behind"
          sizes="(max-width: 820px) 230px, 310px"
          priority
        />
      }
    />
  );
}

function FirstMovementScene() {
  return (
    <PhilooNarrativeComposition
      className={styles.briefingComposition}
      guideSide="start"
      dialogue={
        <PhilooFolioVoice speaker="Platão" className={styles.briefingVoice}>
          <span className={styles.briefingKicker}>A história continua</span>
          <h2 className={styles.briefingTitle}>
            O corpo vira antes de a certeza mudar.
          </h2>
          <p className={styles.briefingLead}>
            As correntes são soltas. Mandam-no levantar e virar o pescoço.
          </p>
          <p className={styles.briefingClose}>
            O movimento dói. A luz confunde. Por enquanto, as sombras ainda
            parecem mais verdadeiras.
          </p>
        </PhilooFolioVoice>
      }
      guide={
        <PlatoGuide
          pose="first-question"
          sizes="(max-width: 820px) 230px, 310px"
          priority
        />
      }
    />
  );
}

function GuidedLayout({
  pose,
  label,
  narration,
  children,
}: {
  pose: PlatoPoseKey;
  label: string;
  narration: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={styles.guidedLayout}>
      <div className={styles.guidedPlato}>
        <PlatoGuide pose={pose} sizes="(max-width: 720px) 120px, 220px" priority />
      </div>
      <div className={styles.guidedVoice}>
        <span>{label}</span>
        <p>{narration}</p>
      </div>
      <div className={styles.guidedContent}>{children}</div>
    </div>
  );
}

function NarratedStoryScene({
  asset,
  caption,
  pose,
  narratorLabel,
  narration,
  children,
}: {
  asset: (typeof A_SUBIDA_ASSETS)["mechanism" | "ascent" | "adaptation" | "decision"];
  caption: string;
  pose: PlatoPoseKey;
  narratorLabel: string;
  narration: ReactNode;
  children: ReactNode;
}) {
  return (
    <GuidedLayout pose={pose} label={narratorLabel} narration={narration}>
      <div className={styles.storyFocus}>
        <StoryImage asset={asset} caption={caption} priority />
        <div className={styles.storyNotes}>{children}</div>
      </div>
    </GuidedLayout>
  );
}

function StoryImage({
  asset,
  caption,
  priority = false,
}: {
  asset: (typeof A_SUBIDA_ASSETS)[
    | "mechanism"
    | "ascent"
    | "adaptation"
    | "decision"];
  caption: string;
  priority?: boolean;
}) {
  return (
    <figure className={styles.storyImage}>
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        priority={priority}
        sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1180px) 74vw, 980px"
        style={{
          objectPosition: `${asset.focalPoint.x * 100}% ${asset.focalPoint.y * 100}%`,
        }}
      />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function MechanismScene() {
  return (
    <NarratedStoryScene
      asset={A_SUBIDA_ASSETS.mechanism}
      caption="A sombra não desapareceu. Ela ganhou uma origem."
      pose="causal-path"
      narratorLabel="Platão revela o mecanismo"
      narration={
        <>Atrás da parede, ele encontra fogo e objetos. A sombra ganhou uma origem.</>
      }
    >
        <span className={styles.kicker}>
          <FireIcon weight="duotone" /> A primeira correção
        </span>
        <h2>O que ele via era real — mas não era tudo.</h2>
        <p>A parede mostrava um efeito. Sozinha, não mostrava a causa.</p>
        <ul>
          <li>
            <strong>Antes:</strong> “A sombra é o próprio pássaro.”
          </li>
          <li>
            <strong>Nova pista:</strong> objeto, fogo e parede trabalham juntos.
          </li>
          <li>
            <strong>Revisão:</strong> “A sombra representa algo que está atrás.”
          </li>
        </ul>
    </NarratedStoryScene>
  );
}

const MODEL_TESTS = [
  {
    id: "repeat",
    label: "Esperar a mesma sombra aparecer outra vez",
    explanation:
      "Isso confirma que existe um padrão, mas as duas explicações já preveem o mesmo padrão.",
  },
  {
    id: "move",
    label: "Mover o objeto e observar se a sombra muda junto",
    explanation:
      "Esse teste separa os modelos: se a sombra acompanha o objeto, ela não age sozinha.",
  },
  {
    id: "name",
    label: "Perguntar qual nome os outros usam",
    explanation:
      "Um nome compartilhado mostra um acordo. Ele não revela o mecanismo que produz a imagem.",
  },
] as const;

function ModelTestExercise() {
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = selected === "move";

  return (
    <div className={`${styles.exercise} ${styles.modelTestExercise}`}>
      <div className={styles.modelPair}>
        <article>
          <span>Modelo A</span>
          <strong>A sombra existe por conta própria.</strong>
          <p>Ela aparece e se move sem depender de outra coisa.</p>
        </article>
        <span className={styles.versus}>ou</span>
        <article>
          <span>Modelo B</span>
          <strong>A sombra depende do objeto e da luz.</strong>
          <p>Se um deles mudar, a sombra também deve mudar.</p>
        </article>
      </div>

      <fieldset className={styles.choiceField}>
        <legend>Qual observação ajudaria mais a distinguir os modelos?</legend>
        {MODEL_TESTS.map((test) => (
          <button
            key={test.id}
            type="button"
            aria-pressed={selected === test.id}
            onClick={() => {
              setSelected(test.id);
              setChecked(false);
            }}
          >
            <span aria-hidden="true">{selected === test.id ? "✓" : "○"}</span>
            {test.label}
          </button>
        ))}
      </fieldset>

      <div className={styles.activityFeedbackSlot}>
        {checked && selected ? (
          <div className={styles.feedback} data-correct={correct} role="status">
            {correct ? (
              <CheckCircleIcon weight="fill" />
            ) : (
              <LightbulbIcon weight="duotone" />
            )}
            <div>
              <strong>
                {correct
                  ? "Esse teste pode fazer um modelo perder força."
                  : "Essa pista ainda deixa os dois modelos de pé."}
              </strong>
              <p>
                {MODEL_TESTS.find((test) => test.id === selected)?.explanation}
              </p>
            </div>
          </div>
        ) : (
          <p className={styles.feedbackHint}>
            Escolha uma observação e teste o que ela consegue revelar.
          </p>
        )}
      </div>

      <div className={styles.exerciseActions}>
        <button
          type="button"
          disabled={!selected}
          onClick={() => setChecked(true)}
        >
          Testar minha escolha
        </button>
        {checked && correct ? (
          <Link href="/aula/a-subida/a-subida-doi">
            Continuar a subida <ArrowRightIcon weight="bold" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function AscentScene() {
  return (
    <div className={styles.ascentComposition}>
      <div className={styles.ascentPlato}>
        <PlatoGuide
          pose="light-pain-guide"
          sizes="(max-width: 720px) 110px, 250px"
          priority
        />
      </div>
      <StoryImage
        asset={A_SUBIDA_ASSETS.ascent}
        caption="A luz chega antes da compreensão."
        priority
      />
      <div className={styles.ascentExplanation}>
        <span>Platão acompanha a subida</span>
        <h2>A luz dói antes de revelar.</h2>
        <p>
          O prisioneiro ainda confia nas sombras porque seus olhos as conhecem.
          Aprender exige tempo para o corpo e o olhar se adaptarem.
        </p>
      </div>
    </div>
  );
}

const HORIZON_STEPS = [
  {
    id: "shadow",
    icon: EyeIcon,
    name: "Sombras",
    prompt: "Ele distingue contornos no chão.",
    options: [
      "Há formas que interrompem a luz.",
      "Já conheço a causa de todas as formas.",
      "O Sol é a origem de tudo o que existe.",
    ],
    answer: 0,
  },
  {
    id: "reflection",
    icon: MoonStarsIcon,
    name: "Reflexos",
    prompt: "Ele compara imagens na água com objetos próximos.",
    options: [
      "Toda imagem na água é um ser vivo.",
      "Uma imagem pode depender de algo fora dela.",
      "Nada fora da caverna pode ser conhecido.",
    ],
    answer: 1,
  },
  {
    id: "objects",
    icon: SparkleIcon,
    name: "Objetos",
    prompt: "Agora ele examina árvores, pedras e pessoas.",
    options: [
      "As sombras eram inventadas e não tinham relação alguma.",
      "Apenas aquilo que brilha pode ser real.",
      "Algumas aparências representam objetos sem mostrar tudo sobre eles.",
    ],
    answer: 2,
  },
  {
    id: "sun",
    icon: SunIcon,
    name: "O Sol",
    prompt: "Por fim, ele consegue olhar para a fonte da luz.",
    options: [
      "A luz ajuda a tornar visíveis muitas coisas que ele conheceu aos poucos.",
      "Quem viu o Sol nunca mais pode se enganar.",
      "Uma única experiência responde a todas as perguntas.",
    ],
    answer: 0,
  },
] as const;

function EvidenceHorizonExercise() {
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const current = HORIZON_STEPS[step];
  const correct = choice === current.answer;
  const complete = step === HORIZON_STEPS.length - 1 && checked && correct;

  function advance() {
    if (step < HORIZON_STEPS.length - 1) {
      setStep((value) => value + 1);
      setChoice(null);
      setChecked(false);
    }
  }

  return (
    <div className={`${styles.exerciseStage} ${styles.horizon}`}>
      <ol aria-label="Etapas da adaptação dos olhos">
        {HORIZON_STEPS.map((item, index) => {
          const Icon = item.icon;
          return (
            <li key={item.id} data-active={index === step} data-seen={index < step}>
              <Icon weight={index <= step ? "duotone" : "regular"} />
              <span>{item.name}</span>
            </li>
          );
        })}
      </ol>

      <article className={styles.horizonCard}>
        <span>Etapa {step + 1} de {HORIZON_STEPS.length}</span>
        <h2>{current.prompt}</h2>
        <p>Qual é a afirmação mais responsável com as pistas disponíveis agora?</p>
        <div className={styles.horizonChoices}>
          {current.options.map((option, index) => (
            <button
              key={option}
              type="button"
              aria-pressed={choice === index}
              onClick={() => {
                setChoice(index);
                setChecked(false);
              }}
            >
              <span>{String.fromCharCode(65 + index)}</span>
              {option}
            </button>
          ))}
        </div>

        <div className={styles.activityFeedbackSlot}>
          {checked ? (
            <div className={styles.inlineFeedback} data-correct={correct} role="status">
              <strong>{correct ? "Cabe nas pistas." : "Vai além do que as pistas permitem."}</strong>
              <p>
                {correct
                  ? "Você avançou sem transformar uma descoberta parcial em certeza total."
                  : "Tente uma afirmação menor, que não prometa mais do que foi observado."}
              </p>
            </div>
          ) : (
            <p className={styles.feedbackHint}>
              Escolha a afirmação que cabe nas pistas desta etapa.
            </p>
          )}
        </div>

        <div className={styles.exerciseActions}>
          {!complete ? (
            <button
              type="button"
              disabled={choice === null}
              onClick={checked && correct ? advance : () => setChecked(true)}
            >
              {checked && correct ? "Próxima etapa" : "Conferir alcance"}
            </button>
          ) : (
            <Link href="/aula/a-subida/periagoge">
              Descobrir a palavra <ArrowRightIcon weight="bold" />
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}

function PeriagogeScene() {
  return (
    <GuidedLayout
      pose="periagoge-guide"
      label="Platão dá um nome à virada"
      narration="Aprender não é receber olhos novos. É mudar a direção do olhar."
    >
      <article className={styles.wordArtifact}>
        <span lang="grc">περιαγωγή</span>
        <strong>periagōgē</strong>
        <p>substantivo grego · “virada”, “reorientação”</p>
        <div>
          <h2>Educar não é preencher olhos vazios.</h2>
          <p>A capacidade de aprender já existe. A educação ajuda a pessoa inteira a voltá-la para outra direção.</p>
        </div>
        <aside>
          <RepeatIcon weight="duotone" />
          <p>
            <strong>Na prática:</strong> encontrar uma pista, suportar a
            confusão, testar outra explicação e revisar o próprio modelo.
          </p>
        </aside>
      </article>
    </GuidedLayout>
  );
}

function AdaptationScene() {
  return (
    <NarratedStoryScene
      asset={A_SUBIDA_ASSETS.adaptation}
      caption="Primeiro o reflexo; depois, aquilo que se reflete."
      pose="gradual-seeing-guide"
      narratorLabel="Platão conta como os olhos aprendem"
      narration={
        <>Primeiro sombras e reflexos. Depois objetos, céu e, somente no fim, o Sol.</>
      }
    >
        <span className={styles.kicker}>
          <MoonStarsIcon weight="duotone" /> Uma ordem para aprender
        </span>
        <h2>Ele não salta da sombra diretamente para o Sol.</h2>
        <p>Cada etapa prepara a próxima e revela o limite da anterior.</p>
    </NarratedStoryScene>
  );
}

const REVISION_CHOICES = [
  {
    id: "erase",
    label: "“Tudo o que eu via antes era falso e inútil.”",
    feedback:
      "As sombras eram efeitos reais. O erro estava em tratá-las como realidade completa.",
  },
  {
    id: "revise",
    label:
      "“As sombras mostravam algo, mas agora sei que dependiam de objetos e luz.”",
    feedback:
      "Esta revisão preserva a pista antiga e muda a explicação quando surgem novas relações.",
  },
  {
    id: "certainty",
    label: "“Agora que saí, nunca mais posso me enganar.”",
    feedback:
      "Uma perspectiva mais ampla ajuda, mas não transforma ninguém em dono de toda a verdade.",
  },
] as const;

function RevisionExercise() {
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = selected === "revise";
  const selectedChoice = REVISION_CHOICES.find((item) => item.id === selected);

  return (
    <div className={`${styles.exerciseStage} ${styles.revision}`}>
      <div className={styles.revisionMap}>
        <article>
          <span>Modelo antigo</span>
          <strong>A parede contém as próprias coisas.</strong>
        </article>
        <ArrowRightIcon weight="bold" aria-hidden="true" />
        <article>
          <span>Novas relações</span>
          <strong>objeto + luz + parede</strong>
        </article>
        <ArrowRightIcon weight="bold" aria-hidden="true" />
        <article>
          <span>Modelo revisado</span>
          <strong>?</strong>
        </article>
      </div>

      <fieldset className={styles.choiceField}>
        <legend>Qual revisão explica mais sem fingir certeza total?</legend>
        {REVISION_CHOICES.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={selected === item.id}
            onClick={() => {
              setSelected(item.id);
              setChecked(false);
            }}
          >
            <span aria-hidden="true">{selected === item.id ? "✓" : "○"}</span>
            {item.label}
          </button>
        ))}
      </fieldset>

      <div className={styles.activityFeedbackSlot}>
        {checked && selectedChoice ? (
          <div className={styles.feedback} data-correct={correct} role="status">
            {correct ? <CheckCircleIcon weight="fill" /> : <RepeatIcon weight="duotone" />}
            <div>
              <strong>{correct ? "Revisão, não apagamento." : "Ainda podemos ajustar."}</strong>
              <p>{selectedChoice.feedback}</p>
            </div>
          </div>
        ) : (
          <p className={styles.feedbackHint}>
            Escolha a revisão que preserva a pista e melhora a explicação.
          </p>
        )}
      </div>

      <div className={styles.exerciseActions}>
        <button
          type="button"
          disabled={!selected}
          onClick={() => setChecked(true)}
        >
          Comparar com as evidências
        </button>
        {checked && correct ? (
          <Link href="/aula/a-subida/a-decisao">
            Ver a decisão <ArrowRightIcon weight="bold" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function DecisionScene() {
  return (
    <NarratedStoryScene
      asset={A_SUBIDA_ASSETS.decision}
      caption="Conhecer um mundo maior cria uma nova pergunta: o que fazer com isso?"
      pose="return-compassion-guide"
      narratorLabel="Platão explica por que ele volta"
      narration={
        <>Ele se lembra dos companheiros. Conhecer melhor não o torna superior: dá a ele uma responsabilidade.</>
      }
    >
      <article className={styles.decisionCopy}>
        <span className={styles.kicker}>
          <SunIcon weight="duotone" /> A escolha que abre o próximo capítulo
        </span>
        <h2>Ele poderia ficar. Mas se lembra dos outros.</h2>
        <p>
          Ele decide voltar. Conhecer melhor traz responsabilidade, não
          superioridade.
        </p>
      </article>
    </NarratedStoryScene>
  );
}
