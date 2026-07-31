import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BracketsCurly,
  CheckCircle,
  DeviceMobile,
  Monitor,
  Stack,
} from "@phosphor-icons/react/dist/ssr";
import {
  exerciseCatalog,
  libraryStatuses,
  libraryViewportChecks,
  sharedScreenMeasurements,
} from "@/domains/lesson-library/exercise-catalog";
import { GuidedClassificationExercise } from "@/domains/lesson-library";
import { SOCRATIC_DIALOGUE_CLASSIFICATION_EXAMPLE } from "@/domains/lesson-library/activities/guided-classification/guided-classification-examples";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Biblioteca de exercícios",
  description:
    "Documentação técnica interna dos padrões de aprendizagem da Philoo.",
  robots: {
    index: false,
    follow: false,
  },
};

const statusOrder = ["foundation", "candidate", "experiment"] as const;

const authorApiExample = `import {
  GuidedClassificationExercise,
} from "@/domains/lesson-library";
import {
  SOCRATIC_DIALOGUE_CLASSIFICATION_EXAMPLE,
} from "./socratic-dialogue-config";

export function LessonActivity() {
  return (
    <GuidedClassificationExercise
      config={SOCRATIC_DIALOGUE_CLASSIFICATION_EXAMPLE}
    />
  );
}`;

const persistenceApiExample = `const guide = getGuidedClassificationGuide("plato");
// guide já contém pose e tamanhos aprovados.

<GuidedClassificationExercise
  config={activity}
  initialState={savedProgress}
  onStateChange={(state) => saveProgress(state)}
  onComplete={(state) => awardCompletion(state)}
/>;

// Para integração totalmente controlada:
<GuidedClassificationActivity
  config={activity}
  value={state}
  onChange={setState}
/>;
`;

export default function LessonLibraryPage() {
  return (
    <main id="conteudo" className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/tecnico" aria-label="Abrir manual técnico">
          Philoo
        </Link>
        <div className={styles.headerActions}>
          <nav aria-label="Documentação técnica">
            <Link href="/tecnico">Manual</Link>
            <Link aria-current="page" href="/tecnico/biblioteca">
              Exercícios
            </Link>
          </nav>
          <span className={styles.internalBadge}>Documentação interna · v1</span>
        </div>
      </header>

      <div className={styles.canvas}>
        <section className={styles.hero}>
          <div className={styles.eyebrow}>
            <BracketsCurly aria-hidden size={21} weight="bold" />
            Philoo Lesson Library
          </div>
          <h1>Uma linguagem comum para construir experiências de aprendizagem.</h1>
          <p>
            Aqui ficam os contratos de tela, comportamento, conteúdo e
            responsividade que transformam uma atividade validada em uma peça
            reutilizável — sem apagar a personalidade de cada aula.
          </p>
          <div className={styles.heroFacts} aria-label="Resumo da biblioteca">
            <span>
              <strong>{exerciseCatalog.length}</strong> exercícios mapeados
            </span>
            <span>
              <strong>{libraryViewportChecks.length}</strong> viewports obrigatórios
            </span>
            <span>
              <strong>1</strong> sistema de composição
            </span>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="anatomia-title">
          <div className={styles.sectionHeading}>
            <span className={styles.sectionIcon}>
              <Stack aria-hidden size={22} weight="fill" />
            </span>
            <div>
              <p className={styles.kicker}>Contrato compartilhado</p>
              <h2 id="anatomia-title">Anatomia de uma tela Philoo</h2>
            </div>
          </div>

          <div className={styles.anatomy}>
            <div className={styles.anatomyMain}>
              <span>Philoo Lesson Shell</span>
              <div className={styles.folio}>
                <span>Folio Stage</span>
                <div className={styles.activity}>
                  <strong>Activity Renderer</strong>
                  <small>conteúdo + interação + feedback</small>
                </div>
                <div className={styles.actionDock}>Action Dock</div>
              </div>
            </div>
            <aside className={styles.rail}>
              <span>Journey Rail</span>
              <i />
              <i />
              <i />
              <small>progresso e navegação</small>
            </aside>
          </div>

          <div className={styles.measurementGrid}>
            {sharedScreenMeasurements.map(([label, value]) => (
              <div className={styles.measurement} key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="responsive-title">
          <div className={styles.sectionHeading}>
            <span className={styles.sectionIcon}>
              <DeviceMobile aria-hidden size={22} weight="fill" />
            </span>
            <div>
              <p className={styles.kicker}>Mesma aprendizagem, outra composição</p>
              <h2 id="responsive-title">Matriz de equivalência responsiva</h2>
            </div>
          </div>
          <p className={styles.sectionIntro}>
            O celular não recebe uma miniatura do desktop. A ação intelectual,
            a ordem, o feedback e a mensagem permanecem; a distribuição espacial
            se adapta ao dispositivo.
          </p>
          <div className={styles.viewportGrid}>
            {libraryViewportChecks.map((item, index) => (
              <article className={styles.viewportCard} key={item.viewport}>
                {index === libraryViewportChecks.length - 1 ? (
                  <Monitor aria-hidden size={26} weight="duotone" />
                ) : (
                  <DeviceMobile aria-hidden size={26} weight="duotone" />
                )}
                <div>
                  <h3>{item.label}</h3>
                  <strong>{item.viewport}</strong>
                  <p>{item.checks}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="catalog-title">
          <div className={styles.sectionHeading}>
            <span className={styles.sectionIcon}>
              <BracketsCurly aria-hidden size={22} weight="fill" />
            </span>
            <div>
              <p className={styles.kicker}>Catálogo vivo</p>
              <h2 id="catalog-title">Exercícios mapeados</h2>
            </div>
          </div>

          <div className={styles.statusLegend}>
            {statusOrder.map((status) => (
              <div key={status}>
                <span className={styles[status]}>
                  {libraryStatuses[status].label}
                </span>
                <p>{libraryStatuses[status].description}</p>
              </div>
            ))}
          </div>

          <div className={styles.exerciseGrid}>
            {exerciseCatalog.map((exercise) => (
              <article className={styles.exerciseCard} key={exercise.id}>
                <div className={styles.cardTopline}>
                  <span className={styles.exerciseId}>{exercise.id}</span>
                  <span className={styles[exercise.status]}>
                    {libraryStatuses[exercise.status].label}
                  </span>
                </div>
                <h3>{exercise.name}</h3>
                <p className={styles.learningMove}>{exercise.learningMove}</p>

                <dl className={styles.cardDetails}>
                  <div>
                    <dt>Interação</dt>
                    <dd>{exercise.interaction}</dd>
                  </div>
                  <div>
                    <dt>O autor configura</dt>
                    <dd>{exercise.authorFields.join(" · ")}</dd>
                  </div>
                  <div>
                    <dt>A biblioteca protege</dt>
                    <dd>{exercise.protectedBehavior.join(" · ")}</dd>
                  </div>
                </dl>

                <div className={styles.responsiveRows}>
                  {Object.entries(exercise.responsiveContract).map(
                    ([viewport, contract]) => (
                      <div key={viewport}>
                        <strong>{viewport}</strong>
                        <span>{contract}</span>
                      </div>
                    ),
                  )}
                </div>

                <div className={styles.dependencies}>
                  {exercise.dependencies.map((dependency) => (
                    <span key={dependency}>{dependency}</span>
                  ))}
                </div>

                <Link className={styles.sourceLink} href={exercise.sourceRoute}>
                  Ver tela-fonte: {exercise.sourceLabel}
                  <ArrowUpRight aria-hidden size={17} weight="bold" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="engine-title">
          <div className={styles.sectionHeading}>
            <span className={styles.sectionIcon}>
              <CheckCircle aria-hidden size={22} weight="fill" />
            </span>
            <div>
              <p className={styles.kicker}>Primeiro motor extraído</p>
              <h2 id="engine-title">EX-05 · Classificação guiada</h2>
            </div>
          </div>
          <p className={styles.sectionIntro}>
            Este exemplo usa o mesmo motor da Caverna para analisar os
            movimentos de um diálogo socrático. Conteúdo, categorias, feedback
            e microcopy são configuração; estado, revisão, acessibilidade e
            responsividade pertencem à biblioteca.
          </p>
          <div className={styles.apiIntro}>
            <div>
              <span>API pública</span>
              <strong>@/domains/lesson-library</strong>
            </div>
            <p>
              O código da aula chama um componente. A biblioteca monta a
              experiência completa e o preset escolhe pose, recorte e tamanhos
              responsivos do personagem.
            </p>
          </div>
          <div className={styles.codeGrid}>
            <article className={styles.codePanel}>
              <header>
                <span>Uso recomendado</span>
                <strong>Uma chamada</strong>
              </header>
              <pre>
                <code>{authorApiExample}</code>
              </pre>
            </article>
            <article className={styles.codePanel}>
              <header>
                <span>Progresso e runtime</span>
                <strong>Integração opcional</strong>
              </header>
              <pre>
                <code>{persistenceApiExample}</code>
              </pre>
            </article>
          </div>
          <aside className={styles.characterContract}>
            <div>
              <strong>O personagem também é código</strong>
              <span>
                <code>getGuidedClassificationGuide(&quot;plato&quot;)</code>{" "}
                resolve pose, direção e tamanhos sem expor o arquivo da imagem.
              </span>
            </div>
            <ul>
              <li>olha e aponta para a direita</li>
              <li>fundo transparente e proporção preferida 2:3</li>
              <li>mãos, cabeça e gesto nunca são cortados</li>
              <li>presets novos só entram depois de validar o asset</li>
            </ul>
          </aside>
          <div className={styles.demoFrame}>
            <GuidedClassificationExercise
              config={SOCRATIC_DIALOGUE_CLASSIFICATION_EXAMPLE}
            />
          </div>
        </section>

        <section className={styles.qualityGate} aria-labelledby="gate-title">
          <CheckCircle aria-hidden size={34} weight="fill" />
          <div>
            <p className={styles.kicker}>Regra de promoção</p>
            <h2 id="gate-title">Quando um exercício vira biblioteca?</h2>
            <p>
              Só depois de ter conteúdo totalmente externo, estado versionado,
              acessibilidade e responsividade testadas e dois usos em contextos
              filosóficos diferentes. Até lá, seu status continua visível.
            </p>
          </div>
        </section>

        <footer className={styles.footer}>
          <p>
            Esta rota é uma primeira interface técnica, sem indexação e fora da
            navegação do estudante. Controle de acesso será definido junto com a
            arquitetura de contas da plataforma.
          </p>
        </footer>
      </div>
    </main>
  );
}
