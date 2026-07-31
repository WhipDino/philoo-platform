import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  BracketsCurly,
  CheckCircle,
  Compass,
  FileText,
  Robot,
  Sparkle,
  Stack,
} from "@phosphor-icons/react/dist/ssr";
import {
  contextFreeAiChecklist,
  documentationLayers,
  getTechnicalDocumentBySourcePath,
  lessonCreationSteps,
  sourceMap,
  technicalTasks,
} from "@/domains/technical-docs/technical-docs-registry";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Manual de construção",
  description:
    "Ponto de entrada para construir, reutilizar, validar e documentar experiências Philoo.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TechnicalDocumentationHome() {
  return (
    <main id="conteudo" className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/inicio" aria-label="Ir ao portal">
          Philoo
        </Link>
        <nav aria-label="Documentação técnica">
          <Link aria-current="page" href="/tecnico">
            Manual
          </Link>
          <Link href="/tecnico/guias/comecar">Guias</Link>
          <Link href="/tecnico/biblioteca">Exercícios</Link>
          <Link href="/inicio">Portal</Link>
        </nav>
      </header>

      <div className={styles.canvas}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <Compass aria-hidden size={21} weight="fill" />
              Philoo Construction Manual
            </p>
            <h1>Comece com uma pergunta. Encontre o caminho certo.</h1>
            <p className={styles.lead}>
              Este é o ponto de entrada para pessoas e inteligências artificiais
              sem contexto: o que ler, onde mexer, o que não reconstruir e como
              provar que uma aula está pronta.
            </p>
            <div className={styles.heroActions}>
              <a href="#tarefas">
                Encontrar minha tarefa
                <ArrowRight aria-hidden size={18} weight="bold" />
              </a>
              <Link href="/tecnico/guias/comecar">
                Abrir todos os guias
              </Link>
            </div>
          </div>
          <aside className={styles.startCard}>
            <span>
              <Robot aria-hidden size={23} weight="duotone" />
              Sem contexto?
            </span>
            <strong>Leia apenas estes três primeiro.</strong>
            <ol>
              <li>
                <Link href="/tecnico/guias/comecar">
                  <code>AGENTS.md</code>
                </Link>
              </li>
              <li>
                <Link href="/tecnico/guias/comecar">
                  <code>docs/START_HERE.md</code>
                </Link>
              </li>
              <li>
                <Link href="/tecnico/guias/estado-do-projeto">
                  <code>docs/project/PROJECT_STATE.md</code>
                </Link>
              </li>
            </ol>
            <p>Depois, o mapa abaixo escolhe os documentos da tarefa.</p>
          </aside>
        </section>

        <section
          id="tarefas"
          className={styles.section}
          aria-labelledby="tasks-title"
        >
          <div className={styles.sectionHeading}>
            <span>
              <BookOpenText aria-hidden size={24} weight="fill" />
            </span>
            <div>
              <p className={styles.kicker}>Roteador de documentação</p>
              <h2 id="tasks-title">O que você precisa fazer?</h2>
            </div>
          </div>
          <p className={styles.sectionIntro}>
            Não leia tudo. Escolha a tarefa e comece pelo documento principal.
          </p>

          <div className={styles.taskGrid}>
            {technicalTasks.map((task) => (
              <article className={styles.taskCard} key={task.id}>
                <div>
                  <span className={styles.taskId}>{task.id}</span>
                  <h3>{task.title}</h3>
                  <p>{task.question}</p>
                </div>
                <div className={styles.outcome}>
                  <strong>Resultado esperado</strong>
                  <span>{task.outcome}</span>
                </div>
                <div className={styles.documentPath}>
                  <FileText aria-hidden size={18} weight="duotone" />
                  <code>{task.primaryDocument}</code>
                </div>
                {task.websiteHref ? (
                  <Link href={task.websiteHref}>
                    Ver nesta documentação
                    <ArrowRight aria-hidden size={17} weight="bold" />
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section
          id="criar-aula"
          className={styles.section}
          aria-labelledby="lesson-title"
        >
          <div className={styles.sectionHeading}>
            <span>
              <Sparkle aria-hidden size={24} weight="fill" />
            </span>
            <div>
              <p className={styles.kicker}>Fluxo oficial</p>
              <h2 id="lesson-title">Como nasce uma aula Philoo</h2>
            </div>
          </div>
          <p className={styles.sectionIntro}>
            A interface vem depois do contrato de aprendizagem. Cada etapa deixa
            uma decisão rastreável para a próxima pessoa ou IA.
          </p>
          <div className={styles.stepGrid}>
            {lessonCreationSteps.map((step) => (
              <article key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
          </div>
          <div className={styles.inlineCallout}>
            <BracketsCurly aria-hidden size={28} weight="bold" />
            <p>
              <strong>Regra decisiva:</strong> uma atividade é escolhida pelo
              raciocínio que o aluno precisa fazer. Se o catálogo já possui uma
              base, a aula configura essa base; não recria a tela.
            </p>
          </div>
        </section>

        <section
          id="personalizar"
          className={styles.section}
          aria-labelledby="custom-title"
        >
          <div className={styles.sectionHeading}>
            <span>
              <Stack aria-hidden size={24} weight="fill" />
            </span>
            <div>
              <p className={styles.kicker}>Antes de mudar um botão</p>
              <h2 id="custom-title">Descubra quem é dono da mudança</h2>
            </div>
          </div>
          <div className={styles.ownershipGrid}>
            <article>
              <span>Conteúdo</span>
              <h3>A aula configura</h3>
              <p>
                Texto, perguntas, cartões, respostas, feedback, ícone semântico
                e personagem aprovado.
              </p>
            </article>
            <article>
              <span>Componente</span>
              <h3>A biblioteca protege</h3>
              <p>
                Interação, revisão, acessibilidade, alvo mínimo, foco e
                composição responsiva.
              </p>
            </article>
            <article>
              <span>Sistema</span>
              <h3>A marca mantém</h3>
              <p>
                Paleta, tipografia, Folio, rail, profundidade 3D e ritmo de
                espaço compartilhado.
              </p>
            </article>
          </div>
        </section>

        <section
          id="personagens"
          className={styles.splitSection}
          aria-labelledby="characters-title"
        >
          <div>
            <p className={styles.kicker}>Personagens e imagens</p>
            <h2 id="characters-title">A pose também é uma API.</h2>
            <p>
              Gaze, direção, gesto, crop, safe area, proporção e tamanho
              responsivo não são decisões refeitas em cada aula. O preset do
              motor registra o tratamento aprovado.
            </p>
            <code>getGuidedClassificationGuide(&quot;plato&quot;)</code>
          </div>
          <ul>
            <li>identidade parte da referência canônica;</li>
            <li>o gesto conduz o olhar até a ação;</li>
            <li>mãos, rosto e intenção não são cortados;</li>
            <li>o asset é verificado nos cinco viewports;</li>
            <li>origem, licença e alt text ficam registrados.</li>
          </ul>
        </section>

        <section
          id="qualidade"
          className={styles.section}
          aria-labelledby="quality-title"
        >
          <div className={styles.sectionHeading}>
            <span>
              <CheckCircle aria-hidden size={24} weight="fill" />
            </span>
            <div>
              <p className={styles.kicker}>Definition of done</p>
              <h2 id="quality-title">Pronto significa verificável.</h2>
            </div>
          </div>
          <div className={styles.qualityGrid}>
            <article>
              <strong>3 comandos</strong>
              <span>test · lint · build</span>
            </article>
            <article>
              <strong>5 viewports</strong>
              <span>phone · tablets · notebook · desktop</span>
            </article>
            <article>
              <strong>3 caminhos</strong>
              <span>acerto · erro/revisão · estado restaurado</span>
            </article>
            <article>
              <strong>1 handoff</strong>
              <span>estado · limites · commit · próximo passo</span>
            </article>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="structure-title">
          <div className={styles.sectionHeading}>
            <span>
              <FileText aria-hidden size={24} weight="fill" />
            </span>
            <div>
              <p className={styles.kicker}>Memória durável</p>
              <h2 id="structure-title">Como a documentação se organiza</h2>
            </div>
          </div>
          <div className={styles.layerList}>
            {documentationLayers.map((layer, index) => (
              <article key={layer.label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{layer.label}</h3>
                  <code>{layer.files}</code>
                </div>
                <p>{layer.purpose}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.bottomGrid}>
          <article className={styles.sourceCard}>
            <p className={styles.kicker}>Onde está cada verdade</p>
            <h2>Mapa de fontes</h2>
            <dl>
              {sourceMap.map(([label, path]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>
                    {getTechnicalDocumentBySourcePath(path) ? (
                      <Link
                        href={`/tecnico/guias/${getTechnicalDocumentBySourcePath(path)?.slug}`}
                      >
                        <code>{path}</code>
                      </Link>
                    ) : (
                      <code>{path}</code>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
          <article className={styles.aiCard}>
            <p className={styles.kicker}>Contrato para IA sem memória</p>
            <h2>Antes de gerar código</h2>
            <ol>
              {contextFreeAiChecklist.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ol>
          </article>
        </section>

        <footer className={styles.footer}>
          <p>
            Código, documentação, testes e assets permanecem no mesmo
            repositório e no mesmo histórico. A conversa ajuda; o Git preserva.
          </p>
          <Link href="/tecnico/biblioteca">
            Continuar para a biblioteca
            <ArrowRight aria-hidden size={18} weight="bold" />
          </Link>
        </footer>
      </div>
    </main>
  );
}
